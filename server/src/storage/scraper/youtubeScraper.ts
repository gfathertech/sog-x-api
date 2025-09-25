//storage/youtubeDownloader.ts
import axios from "axios";
import { logger } from "../../config/logger";
import { ApiResponse } from "../../utils/schema";

export const getYoutubeVideoInfo = async (
  url: string
): Promise<{ status: number; result: ApiResponse | string }> => {
  try {
    // Validate inputs
    if (!url) {
      logger.warn("YouTube Downloader: Missing videoUrl");
      return { status: 400, result: "The 'url' parameter is missing" };
    }

    // Prepare form data for the external API call
    const formData = new URLSearchParams();
    formData.append('url', url);

    // Post data to the external service
    const response = await axios.post('https://iloveyt.net/proxy.php', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    const data = response.data;

    console.dir(data)

    // Check if the external API call was successful
    if (!data?.api || data.api.status !== 'OK') {
      logger.error("YouTube Downloader: Failed to retrieve valid media info from iloveyt.net", data);
      return { status: 502, result: "Failed to retrieve media info from the external service" };
    }

    // Simplify the mediaItems structure into a cleaner format
    const simplifiedItems = (data.api.mediaItems || []).map((item: any) => ({
      type: item.type,
      quality: item.mediaQuality || item.mediaRes,
      extension: item.mediaExtension,
      fileSize: item.mediaFileSize,
      downloadUrl: item.mediaUrl,
    }));

    const result: ApiResponse = {
      service: data.api.service,
      title: data.api.title,
      imagePreviewUrl: data.api.imagePreviewUrl,
      ytLink: data.api.permanentLink,
      description: data.api.description,
      streamLink: data.api.previewUrl,
      items: simplifiedItems,
    };
    
    logger.debug(`YouTube Downloader: Successfully fetched info for title: ${result.title.substring(0, 50)}...`);

    return {
      status: 200,
      result: result
    };

  } catch (error: any) {
    logger.error("YouTube Downloader API error:", error);
    return {
      status: 500,
      result: `YouTube Downloader error: ${error.message || "Unknown error"}`
    };
  }
};