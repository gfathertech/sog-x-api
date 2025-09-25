import axios from "axios";
import express from 'express';
import * as cheerio from "cheerio";
import { logger } from "../../config/logger";
import { ApiResponse } from "../../utils/schema";

export const getTiktokAudio = async (
  url: string
): Promise<{ status: number; result: string }> => {
  try {
    // Validate inputs
        if (!url) {
          logger.warn("Tiktok Downloader: Missing videoUrl");
          return { status: 400, result: "The 'url' parameter is missing" };
        }

        const response = await axios.post(
      "https://ttsave.app/download",
      { query: url, language_id: 1 },
      {
        headers: {
          "Content-Type": "application/json",
          "Origin": "https://ttsave.app",
          "Referer": "https://ttsave.app/en",
          "User-Agent": "Mozilla/5.0"
        }
      }
    );
 
          const html = await response.data 
          const $ = cheerio.load(html)

          console.log(html)

          const links = {
            link: url,
            noWatermark: $('a[type="no-watermark"]').attr('href'),
            watermark: $('a[type="watermark"]').attr('href'),
            audio: $('a[type="audio"]').attr('href'),
            thumbnail: $('a[type="cover"]').attr('href')
          }

      
    
        const data = JSON.stringify(links);
     return {
      status: 200,
      result: JSON.parse(data)
    };
  } catch (error: any) {
    logger.error("Tiktok Downloader API error:", error);
    return {
      status: 500,
      result: `Tiktok Downloader error: ${error.message || "Unknown error"}`
    };
  }
};