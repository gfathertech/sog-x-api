//routes/v1Routes.ts
import express, { Router } from "express";
import { getGeminiResponse,
   getOpenaiResponse,
    getAiResponseWithRole,
  initConversationWithRole} from "../storage/aiChat/gemini";
import { getYoutubeVideoInfo } from "../storage/scraper/youtubeScraper"; // Import the new function
import { apkMirror } from "../storage/downloader";
import { logger } from "../config/logger";
import { apiAuth } from "../config/apiAuth";
import { ytStalk } from "../storage/stalk";
import { getMistralAIResponse} from "../storage/aiChat/mistral";
import { generateImage } from "../storage/image/imagen4";
import { animexinDetail, animexinSearch, animexinUpdate } from "../storage/anime/anime";
import { unsplash } from "../storage/scraper/unsplash";
import { getTiktokAudio } from "../storage/scraper/tiktok";
import axios from "axios";
import { getGpt4 } from "../storage/aiChat/gpt4";
import { getGroq4 } from "../storage/aiChat/grok4";
import { getSciteAIResponse } from "../storage/tools/scite";


const router = Router();

// Gemini API endpoint
router.get("/ai/gemini", apiAuth, async (req, res) => {
  const prompt = req.query.prompt as string || "";
  const response = await getGeminiResponse(prompt);
  
  res.status(response.status).json({
    status: response.status,
    owner: "Gfather Tech",
    result: response.result
  });
});

// ChatGPT API endpoint
// router.get("/ai/chatgpt", apiAuth, async (req, res) => {
//   const prompt = req.query.prompt as string || "";
//   const response = await getOpenaiResponse(prompt);
  
//   res.status(response.status).json({
//     status: response.status,
//     owner: "Gfather Tech",
//     result: response.result
//   });
// });

// Simplified Mistral AI endpoint for single messages
router.get("/ai/mistral", apiAuth, async (req, res) => {
  try {
    const message = req.query.message as string;
    const systemMessage = req.query.systemMessage as string || "";
    
    if (!message) {
      return res.status(400).json({
        status: 400,
        owner: "Gfather Tech",
        result: "Message is required"
      });
    }
    
    const response = await getMistralAIResponse(message, systemMessage);
    
    res.status(response.status).json({
      status: response.status,
      owner: "Gfather Tech",
      result: response.result
    });
  } catch (error) {
    logger.error("Mistral AI simple endpoint error:", error);
    res.status(500).json({
      status: 500,
      owner: "Gfather Tech",
      result: "Internal server error"
    });
  }
});

router.get("/ai/gpt4", apiAuth, async (req, res) => {
  try {
    const message = req.query.message as string;
    const systemMessage = req.query.systemMessage as string || "";
    const usage = req.query.usage as string || "";
    
    if (!message) {
      return res.status(400).json({
        status: 400,
        owner: "Gfather Tech",
        result: "Message is required"
      });
    }
    
    const response = await getGpt4(message, systemMessage, usage);
    
    res.status(response.status).json({
      status: response.status,
      owner: "Gfather Tech",
      result: response.result
    });
  } catch (error) {
    logger.error("Mistral AI simple endpoint error:", error);
    res.status(500).json({
      status: 500,
      owner: "Gfather Tech",
      result: "Internal server error"
    });
  }
});

// Scite AI endpoint
router.get("/ai/scite", apiAuth, async (req, res) => {
  try {
    const prompt = req.query.prompt as string || "";
    const maxRetries = parseInt(req.query.maxRetries as string) || 100;
    
    if (!prompt) {
      return res.status(400).json({
        status: 400,
        owner: "Gfather Tech",
        result: "Prompt is required"
      });
    }
    
    const response = await getSciteAIResponse(prompt, maxRetries);
    
    res.status(response.status).json({
      status: response.status,
      owner: "Gfather Tech",
      result: response.result
    });
  } catch (error) {
    logger.error("Scite AI endpoint error:", error);
    res.status(500).json({
      status: 500,
      owner: "Gfather Tech",
      result: "Internal server error"
    });
  }
});

router.get("/ai/groq4", apiAuth, async (req, res) => {
  try {
    const message = req.query.message as string;
    const systemMessage = req.query.systemMessage as string || "";
    
    if (!message) {
      return res.status(400).json({
        status: 400,
        owner: "Gfather Tech",
        result: "Message is required"
      });
    }
    
    const response = await getGroq4(message, systemMessage);
    
    res.status(response.status).json({
      status: response.status,
      owner: "Gfather Tech",
      result: response.result
    });
  } catch (error) {
    logger.error("Mistral AI simple endpoint error:", error);
    res.status(500).json({
      status: 500,
      owner: "Gfather Tech",
      result: "Internal server error"
    });
  }
});

// AI endpoint with role-based conversation
router.post("/ai/chat", apiAuth, async (req, res) => {
  try {
    const { message, systemPrompt, conversationHistory = [] } = req.body;
    
    // If no conversation history exists but a system prompt is provided, initialize
    let history = conversationHistory;
    if (conversationHistory.length === 0 && systemPrompt) {
      history = initConversationWithRole(systemPrompt);
    }
    
    const response = await getAiResponseWithRole(
      systemPrompt || "You are a helpful AI assistant.",
      history,
      message
    );
    
    res.status(response.status).json({
      status: response.status,
      owner: "Gfather Tech",
      result: response.result
    });
  } catch (error) {
    logger.error("Chat endpoint error:", error);
    res.status(500).json({
      status: 500,
      owner: "Gfather Tech",
      result: "Internal server error"
    });
  }
});

// Image generation endpoint
router.post("/image/imagen4", apiAuth, async (req, res) => {
  const prompt = req.query.prompt as string || "";
  const response = await generateImage(prompt);
  
  res.status(response.status).json({
    status: response.status,
    owner: "Gfather Tech",
    result: response.result
  });
});

// APKMirror Downloader endpoint
router.get("/d/apkmirror", apiAuth, async (req, res) => {
  const text = req.query.text as string || "";
  const response = await apkMirror(text);
  
  res.status(response.status).json({
    status: response.status,
    owner: "Gfather Tech",
    result: response.result
  });
});

// YouTube Info endpoint
router.get("/d/yt", apiAuth, async (req, res) => {
  const videoUrl = req.query.url as string || "";
  const response = await getYoutubeVideoInfo(videoUrl);
  
  res.status(response.status).json({
    status: response.status,
    owner: "Gfather TechR",
    result: response.result
  });
});

// Tiktok Info endpoint
router.get("/d/tiktok", apiAuth, async (req, res) => {
  const url = req.query.url as string || "";
  const response = await getTiktokAudio(url);
  
  res.status(response.status).json({
    status: response.status,
    owner: "Gfather TechR",
    result: response.result
  });
});

// YouTube stalk endpoint
router.get("/stalk/ytstalk", apiAuth, async (req, res) => {
  const url = req.query.url as string || "";
  const response = await ytStalk(url);
  
  res.status(response.status).json({
    status: response.status,
    owner: "Gfather Tech",
    result: response.result
  });
});

// YouTube stalk endpoint
router.get("/d/unsplash", apiAuth, async (req, res) => {
  const text = req.query.text as string || "";
  const response = await unsplash(text);
  
  res.status(response.status).json({
    status: response.status,
    owner: "Gfather Tech",
    result: response.result
  });
});

// Search Route
router.get("/s/animex", apiAuth, async (req, res) => {
  const keyword = req.query.text as string || "";

  if (!keyword) {
    return res.status(400).json({
      status: 400,
      owner: "Gfather TechR",
      result: "Missing search keyword"
    });
  }

  const response = await animexinSearch(keyword);
  res.status(response.status).json({
    status: response.status,
    owner: "Gfather TechR",
    result: response.result
  });
});

// Detail Route
router.get("/s/animex/detail", apiAuth, async (req, res) => {
  const url = req.query.url as string || "";

  if (!url) {
    return res.status(400).json({
      status: 400,
      owner: "Gfather TechR",
      result: "Missing detail URL"
    });
  }

  const response = await animexinDetail(url);
  res.status(response.status).json({
    status: response.status,
    owner: "Gfather TechR",
    result: response.result
  });
});

// Update Route
router.get("/animex/update", apiAuth, async (req, res) => {
  const keyword = req.query.q as string || "";

  if (!keyword) {
    return res.status(400).json({
      status: 400,
      owner: "Gfather TechR",
      result: "Missing update keyword"
    });
  }

  const response = await animexinUpdate(keyword);
  res.status(response.status).json({
    status: response.status,
    owner: "Gfather TechR",
    result: response.result
  });
});

router.get("/test", apiAuth, async (req, res) => {
  const url = req.query.q as string || "";
  const cu = req.query.cu as string || "";

  if (!url) {
    return res.status(400).json({
      status: 400,
      owner: "Gfather TechR",
      result: "Missing update keyword"
    });
  }
 const urll = `https://1pt.co/addURL`
  const response = await axios.post(urll, {url, cu});
  const data = await response;
  console.log(data);


  res.status(response.status).json({
    status: response.status,
    owner: "Gfather TechR",
    result: data
  });
});

// Register all v1 routes
export const v1Routes = (app: express.Application) => {
  app.use("/api/v1", router);
  logger.info("v1 API routes registered at /api/v1");
};