import { GoogleGenerativeAI } from "@google/generative-ai";
import { logger } from "../../config/logger";
import * as cheerio from "cheerio";
import OpenAI from "openai";
import axios from "axios";
import  dotenv from "dotenv";
import { RateLimiter } from "limiter";

dotenv.config()

export const getGeminiResponse = async (
  prompt: string,
  model: string = "gemini-1.5-flash"
): Promise<{ status: number; result: string }> => {
  try {
    // Validate inputs
    if (!prompt) {
      logger.warn("Gemini: Missing prompt");
      return { status: 400, result: "Prompt is missing" };
    }

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(process.env.apiKey!);
    const genModel = genAI.getGenerativeModel({ model });
    
    // Get response
    const result = await genModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    logger.debug(`Gemini response: ${text.substring(0, 50)}...`);
    
    return {
      status: 200,
      result: text
    };
  } catch (error: any) {
    logger.error("Gemini API error:", error);
    
    // Handle specific errors
    if (error?.message?.includes("API_KEY")) {
      return { status: 401, result: "The API key is invalid" };
    }
    
    return {
      status: 500,
      result: `Gemini error: ${error.message || "Unknown error"}`
    };
  }
};

// const client = new OpenAI({
//   apiKey: `${process.env.OPENAI}`
// });
// export const getOpenai = async (
//   prompt: string,
//   model: string = "gemini-1.5-flash"
// ): Promise<{ status: number; result: string }> => {
//   const chatCompletion = await client.chat.completions.create({
//     messages: [
//       {
//         role: "system",
//         content:
//           "You are a software developer of 40 years"
//       },
//       {
//         role: "assistant",
//         content:
//           "Explain in details due to your expirience"
//       },
//       {
//         role: "user",
//         content: prompt
//       }
//     ],
//     model: model
//   });

//    return {
//       status: 200,
//       result: chatCompletion.choices[0].message.content!
//     };
// }

// Initialize rate limiter (e.g., 150 requests per minute)
const limiter = new RateLimiter({
  tokensPerInterval: 150000,
  interval: "minute"
});

// Initialize OpenAI client with environment variables
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  maxRetries: 3,
  timeout: 30_000, // 30-second timeout
});

export const getOpenaiResponse = async (
  prompt: string,
  model: string = "gpt-3.5-turbo" // Valid OpenAI model
): Promise<{ status: number; result: string }> => {
  
  // Input validation
  if (!prompt?.trim()) {
    return { status: 400, result: "Prompt cannot be empty" };
  }

  if (!process.env.OPENAI_API_KEY) {
    return { status: 500, result: "API key not configured" };
  }

  try {
    // Rate limiting
    await limiter.removeTokens(1);

    const chatCompletion = await client.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an experienced software developer with 40 years of experience",
        },
        {
          role: "user",
          content: prompt.trim(),
        },
      ],
      model,
      max_tokens: 1000, // Prevent excessive output
    });

    const result = chatCompletion.choices[0]?.message?.content?.trim();

    if (!result) {
      return { status: 500, result: "Empty response from AI" };
    }

    return { status: 200, result };

  } catch (error: any) {
    // Enhanced error handling
    console.error("OpenAI API error:", error);

    if (error instanceof OpenAI.APIError) {
      return {
        status: error.status || 500,
        result: `API Error: ${error.message}`
      };
    }

    return {
      status: 500,
      result: error.message || "Internal server error"
    };
  }
};


// export const getAiResponse = async (
//   question: string
// ): Promise<{ status: number; result: string }> => {
//   try {
//     // Validate inputs
//     if (!question) {
//       logger.warn("AI: Missing question");
//       return { status: 400, result: "Question is missing" };
//     }

//     const data = JSON.stringify({
//       "messages": [
//         {
//           "content": "Hello, how can i assist you today?",
//           "role": "system"
//         },
//         {
//           "content": question,
//           "role": "user"
//         }
//       ],
//       "model": "gpt-3.5-turbo-0125",
//       "temperature": 0.9
//     });
    
//     const config = {
//       method: 'POST' as const,
//       url: process.env.AI_API_URL,
//       headers: {
//         'User-Agent': 'okhttp/3.14.9',
//         'Connection': 'Keep-Alive',
//         'Accept-Encoding': 'gzip',
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${process.env.AI_API_KEY}`,
//       },
//       data: data
//     };
    
//     const response = await axios.request(config);
    
//     logger.debug(`AI response received successfully`);
    
//     return {
//       status: 200,
//       result: response.data
//     };
//   } catch (error: any) {
//     logger.error("AI API error:", error);
    
//     // Handle specific errors
//     if (error?.response?.status === 401) {
//       return { status: 401, result: "The API key is invalid" };
//     }
    
//     if (error?.response?.status === 429) {
//       return { status: 429, result: "Rate limit exceeded" };
//     }
    
//     return {
//       status: 500,
//       result: `AI error: ${error.message || "Unknown error"}`
//     };
//   }
// };

// Interface for chat messages
interface ChatMessage {
  role: string;
  content: string;
}

export const getAiResponseWithRole = async (
  systemPrompt: string,
  conversationHistory: ChatMessage[],
  newMessage: string
): Promise<{ status: number; result: any }> => {
  try {
    // Validate inputs
    if (!newMessage) {
      logger.warn("AI: Missing message");
      return { status: 400, result: "Message is missing" };
    }

    if (!systemPrompt) {
      logger.warn("AI: Missing system prompt");
      return { status: 400, result: "System prompt is missing" };
    }

    // Build the messages array with system prompt and conversation history
    const messages: ChatMessage[] = [
      {
        role: "system",
        content: systemPrompt
      },
      ...conversationHistory,
      {
        role: "user",
        content: newMessage
      }
    ];

    const data = JSON.stringify({
      messages,
      model: "gpt-3.5-turbo-0125",
      temperature: 0.9
    });
    
    const config = {
      method: 'POST' as const,
      url: process.env.AI_API_URL,
      headers: {
        'User-Agent': 'okhttp/3.14.9',
        'Connection': 'Keep-Alive',
        'Accept-Encoding': 'gzip',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.AI_API_KEY}`,
      },
      data: data
    };
    
    const response = await axios.request(config);
    
    // Extract the assistant's response
    const assistantResponse = response.data.choices[0]?.message?.content || "No response generated";
    
    // Add the new exchange to the conversation history
    const updatedHistory = [
      ...conversationHistory,
      { role: "user", content: newMessage },
      { role: "assistant", content: assistantResponse }
    ];
    
    logger.debug(`AI response: ${assistantResponse.substring(0, 50)}...`);
    
    return {
      status: 200,
      result: {
        response: assistantResponse,
        conversationHistory: updatedHistory
      }
    };
  } catch (error: any) {
    logger.error("AI API error:", error);
    
    // Handle specific errors
    if (error?.response?.status === 401) {
      return { status: 401, result: "The API key is invalid" };
    }
    
    if (error?.response?.status === 429) {
      return { status: 429, result: "Rate limit exceeded" };
    }
    
    return {
      status: 500,
      result: `AI error: ${error.message || "Unknown error"}`
    };
  }
};

// Helper function to initialize a new conversation with a specific role
export const initConversationWithRole = (systemPrompt: string): ChatMessage[] => {
  return [
    {
      role: "system",
      content: systemPrompt
    }
  ];
};