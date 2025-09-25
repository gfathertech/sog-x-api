import { randomUUID } from 'crypto';
import { overchatRequest,AIResponse } from "../modelBase/overchatBase";
import { logger } from "../../config/logger";


export const getGpt4 = async (
  message: string,
  systemMessage: string = "",
  usage:string = ""
): Promise<AIResponse> => {
  try {
    // Validate inputs
    if (!message) {
      logger.warn("Mistral AI: Missing message");
      return { status: 400, result: "Message is required" };
    }

    const endpoint = 'https://widget-api.overchat.ai/v1/chat/completions';
    
    const messages = [
      {
        id: randomUUID(),
        role: "user",
        content: message
      }
    ];

    if (systemMessage) {
      messages.unshift({
        id: randomUUID(),
        role: "system",
        content: systemMessage
      });
    }

    const body = {
      model: 'gpt-4.1-nano-2025-04-14',
      messages,
      personaId: `${usage}` || "chat-gpt",
      frequency_penalty: 0,
      max_tokens: 4000,
      presence_penalty: 0,
      stream: true,
      temperature: 0.5,
      top_p: 0.95
    };

    const response = await overchatRequest({
      endpoint,
      body,
      isStream: true
    });

    if (response.status !== 200) {
      return response;
    }

    logger.debug(`Gpt 4 response: ${response.result.substring(0, 50)}...`);
    
    return {
      status: 200,
      result: response.result
    };
  } catch (error: any) {
    logger.error("Gpt 4 API error:", error);
    return {
      status: 500,
      result: `Gpt 4 error: ${error.message || "Unknown error"}`
    };
  }
};

/**
ai-paraphrasing-tool
ai-prompt-generator
ai-text-summarizer
ai-writer
ai-detector
 */