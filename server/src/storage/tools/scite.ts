import fetch from "node-fetch";
import { randomUUID } from "crypto";
import { logger } from "../../config/logger";
import dotenv from "dotenv";

dotenv.config();

// Interface definitions for API responses
interface SciteAIPostResponse {
  id?: string;
  status?: string;
  [key: string]: any;
}

interface SciteAITaskResponse {
  status: string;
  result?: {
    turns?: Array<{
      role: string;
      content: string;
    }>;
  };
  [key: string]: any;
}

interface SciteAIAssistantTurn {
  role: string;
  content: string;
}

interface SciteAIResult {
  turns?: SciteAIAssistantTurn[];
}

export interface SciteAIResponse {
  status: number;
  result: string;
}

// Type guard functions
function isSciteAIPostResponse(data: any): data is SciteAIPostResponse {
  return data && typeof data === 'object';
}

function isSciteAITaskResponse(data: any): data is SciteAITaskResponse {
  return data && typeof data === 'object' && 'status' in data;
}

function isSciteAIResult(data: any): data is SciteAIResult {
  return data && typeof data === 'object';
}

export const getSciteAIResponse = async (
  prompt: string,
  maxRetries: number = 20
): Promise<SciteAIResponse> => {
  try {
    // Validate inputs
    if (!prompt) {
      logger.warn("Scite AI: Missing prompt");
      return { status: 400, result: "Prompt is required" };
    }

    // Generate random ID for each request
    const anonId = randomUUID();

    // Send prompt to scite.ai
    const postResponse = await fetch("https://api.scite.ai/assistant/poll", {
      method: "POST",
      headers: {
        "User-Agent": "Mozilla/5.0 (Linux; Android 11; vivo 1901 Build/RP1A.200720.012) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.7258.143 Mobile Safari/537.36",
        "Accept": "application/json, text/plain, */*",
        "Accept-Encoding": "gzip, deflate, br, zstd",
        "Content-Type": "application/json",
        "sec-ch-ua-platform": '"Android"',
        "Authorization": "Bearer null",
        "sec-ch-ua": '"Not;A=Brand";v="99", "Android WebView";v="139", "Chromium";v="139"',
        "sec-ch-ua-mobile": "?1",
        "Origin": "https://scite.ai",
        "Sec-Fetch-Site": "same-site",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Dest": "empty",
        "Referer": "https://scite.ai/",
        "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
      },
      body: JSON.stringify({
        turns: [{ role: "user", content: prompt }],
        user_input: prompt,
        session_id: null,
        country: null,
        alwaysUseReferences: false,
        neverUseReferences: false,
        abstractsOnly: false,
        fullTextsOnly: false,
        numReferences: 25,
        rankBy: "relevance",
        answerLength: "medium",
        model: "gpt-4o-mini-2024-07-18",
        reasoningEffort: "medium",
        yearFrom: "",
        yearTo: "",
        topics: [],
        journals: [],
        citationSections: [],
        publicationTypes: [],
        citationStyle: "apa",
        dashboards: [],
        referenceChecks: [],
        dois: [],
        useStructuredResponse: false,
        anon_id: anonId
      })
    });

    if (!postResponse.ok) {
      logger.error(`Scite AI POST failed with status: ${postResponse.status}`);
      return { 
        status: postResponse.status, 
        result: `Failed to submit prompt to Scite AI (status: ${postResponse.status})` 
      };
    }

    const postData: unknown = await postResponse.json();
    
    if (!isSciteAIPostResponse(postData)) {
      logger.error("Scite AI: Invalid POST response format");
      return { status: 500, result: "Invalid response format from Scite AI" };
    }

    const taskId = postData.id;

    if (!taskId) {
      logger.warn("Scite AI: No task ID received");
      return { status: 404, result: "No task ID received from Scite AI" };
    }

    // Poll for task completion
    let resultData: SciteAITaskResponse;
    let retries = 0;
    
    while (retries < maxRetries) {
      const getResponse = await fetch(`https://api.scite.ai/assistant/tasks/${taskId}`, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Linux; Android 11; vivo 1901 Build/RP1A.200720.012) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.7258.143 Mobile Safari/537.36",
          "Accept": "application/json, text/plain, */*",
          "Accept-Encoding": "gzip, deflate, br, zstd",
          "sec-ch-ua-platform": '"Android"',
          "Authorization": "Bearer null",
          "sec-ch-ua": '"Not;A=Brand";v="99", "Android WebView";v="139", "Chromium";v="139"',
          "sec-ch-ua-mobile": "?1",
          "Origin": "https://scite.ai",
          "Sec-Fetch-Site": "same-site",
          "Sec-Fetch-Mode": "cors",
          "Sec-Fetch-Dest": "empty",
          "Referer": "https://scite.ai/",
          "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
        }
      });

      if (!getResponse.ok) {
        logger.error(`Scite AI GET failed with status: ${getResponse.status}`);
        return { 
          status: getResponse.status, 
          result: `Failed to check task status (status: ${getResponse.status})` 
        };
      }

      const responseData: unknown = await getResponse.json();
      
      if (!isSciteAITaskResponse(responseData)) {
        logger.error("Scite AI: Invalid task response format");
        return { status: 500, result: "Invalid task response format from Scite AI" };
      }

      resultData = responseData;

      console.log("dygcygvvveveceybcbe", getResponse,)

      // Check if task is completed
      if (resultData.status === "SUCCESS") {
        break;
      }

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, 1500));
      retries++;
      
      logger.debug(`Scite AI polling attempt ${retries}/${maxRetries}`);
    }

    // Check if max retries reached
    if (retries >= maxRetries && resultData!.status !== "SUCCESS") {
      logger.warn("Scite AI: Max retries reached without success");
      return { status: 408, result: "Request timeout: Scite AI processing took too long" };
    }

    // Extract assistant response with proper type checking
    let responseContent = "No response generated";
    
    if (resultData!.result && isSciteAIResult(resultData!.result)) {
      const assistantTurn = resultData!.result.turns?.find((t: SciteAIAssistantTurn) => t.role === "assistant");
      if (assistantTurn && assistantTurn.content) {
        responseContent = assistantTurn.content;
      }
    }

    logger.debug(`Scite AI response: ${responseContent.substring(0, 50)}...`);
    
    return {
      status: 200,
      result: responseContent
    };
  } catch (error: any) {
    logger.error("Scite AI API error:", error);
    return {
      status: 500,
      result: `Scite AI error: ${error.message || "Unknown error"}`
    };
  }
};