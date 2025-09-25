// storage/overchatBase.ts
import { randomUUID } from 'crypto';
import { logger } from "../../config/logger";
import dotenv from "dotenv";
import fetch from 'node-fetch';

dotenv.config();

export interface OverchatRequestOptions {
  endpoint: string;
  body: any;
  isStream?: boolean;
}

export interface AIResponse {
  status: number;
  result: string;
}

export interface OverchatResponse {
  status: number;
  result: any;
}

// Common headers for all Overchat requests
const getCommonHeaders = () => {
  const uuid = randomUUID();
  return {
    'User-Agent': 'Mozilla/5.0 (Linux; Android 11; vivo 1901) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.7258.143 Mobile Safari/537.36',
    'Accept': 'application/json, text/plain, */*',
    'Accept-Encoding': 'identity',
    'Content-Type': 'application/json',
    'sec-ch-ua-platform': '"Android"',
    'x-device-uuid': uuid,
    'authorization': 'Bearer',
    'sec-ch-ua': '"Not;A=Brand";v="99", "Android WebView";v="139", "Chromium";v="139"',
    'sec-ch-ua-mobile': '?1',
    'x-device-language': 'en',
    'x-device-platform': 'web',
    'x-device-version': '1.0.44',
    'origin': 'https://widget.overchat.ai',
    'x-requested-with': 'mark.via.gp',
    'sec-fetch-site': 'same-site',
    'sec-fetch-mode': 'cors',
    'sec-fetch-dest': 'empty',
    'referer': 'https://widget.overchat.ai/',
    'accept-language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
    'priority': 'u=1, i'
  };
};

// Main function to handle Overchat API requests
export const overchatRequest = async (
  options: OverchatRequestOptions
): Promise<OverchatResponse> => {
  try {
    const { endpoint, body, isStream = false } = options;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: getCommonHeaders(),
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      logger.error(`Overchat API error: ${response.status} ${response.statusText}`);
      return { status: response.status, result: `API error: ${response.statusText}` };
    }

    if (isStream) {
      // Handle stream response
      const text = await response.text();
      
      if (!text || text.trim() === '') {
        logger.warn("Overchat: Empty stream response from server");
        return { status: 404, result: "Empty response from server" };
      }

      // Parse the stream response
      const lines = text.split('\n').filter(line => line.trim() !== '');
      let fullResponse = '';

      for (const line of lines) {
        if (line.trim() === 'data: [DONE]') {
          break;
        }

        if (line.startsWith('data: ')) {
          const jsonStr = line.substring(6); // Remove "data: " prefix
          try {
            const data = JSON.parse(jsonStr);
            if (data.choices && data.choices[0]?.delta?.content) {
              fullResponse += data.choices[0].delta.content;
            }
          } catch (error) {
            logger.debug("Failed to parse stream chunk:", error);
            // Continue processing other chunks
          }
        }
      }

      if (!fullResponse) {
        logger.warn("Overchat: No content extracted from stream");
        return { status: 404, result: "No content found in response" };
      }

      return {
        status: 200,
        result: fullResponse
      };
    } else {
      // Handle JSON response
      const data = await response.json();
      return {
        status: 200,
        result: data
      };
    }
  } catch (error: any) {
    logger.error("Overchat API error:", error);
    return {
      status: 500,
      result: `Overchat error: ${error.message || "Unknown error"}`
    };
  }
};