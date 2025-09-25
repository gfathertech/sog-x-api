// storage/mistralAI.ts
import { randomUUID } from 'crypto';
import { overchatRequest } from "../modelBase/overchatBase";
import { logger } from "../../config/logger";

export interface MistralAIResponse {
  status: number;
  result: string;
}

export const getMistralAIResponse = async (
  message: string,
  systemMessage: string = ""
): Promise<MistralAIResponse> => {
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
      model: 'mistralai/mistral-nemo',
      messages,
      personaId: 'free-mistral-chatbot',
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

    logger.debug(`Mistral AI response: ${response.result.substring(0, 50)}...`);
    
    return {
      status: 200,
      result: response.result
    };
  } catch (error: any) {
    logger.error("Mistral AI API error:", error);
    return {
      status: 500,
      result: `Mistral AI error: ${error.message || "Unknown error"}`
    };
  }
};