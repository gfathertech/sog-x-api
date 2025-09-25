import { getYoutubeVideoInfo } from "./scraper/youtubeScraper";
import { ApiResponse } from "../utils/schema";
import { logger } from "../config/logger";
import * as cheerio from "cheerio";
import axios from "axios";
import  dotenv from "dotenv";
dotenv.config()


export const ytStalk = async (
  url: string
): Promise<{ status: number; result: any}> => {
  try {
      const response = await getYoutubeVideoInfo(url);
       return {
      status: 200,
      result: response
    };
  } catch (err: any) {
    logger.error("APK Deep Fetch Error:", err.message);
    
    return {
      status: 500,
      result: `Gemini error: ${err.message || "Unknown error"}`
    };
  }
};