// import { randomUUID } from 'crypto';
// import { promisify } from 'util';
// import zlib from 'zlib';
// import fetch from 'node-fetch';
// import { logger } from '../../config/logger';
// import dotenv from "dotenv";

// dotenv.config();

// const gunzip = promisify(zlib.gunzip);
// const inflate = promisify(zlib.inflate);
// const brotli = promisify(zlib.brotliDecompress);

// async function _tryDecompress(buf: Buffer, contentEncoding: string | null): Promise<string | null> {
//   if (!contentEncoding) return null;
//   const enc = contentEncoding.toLowerCase();
  
//   try {
//     if (enc.includes('gzip') || enc.includes('x-gzip')) return (await gunzip(buf)).toString('utf8');
//     if (enc.includes('deflate')) return (await inflate(buf)).toString('utf8');
//     if (enc.includes('br') || enc.includes('brotli')) return (await brotli(buf)).toString('utf8');
//   } catch (error) {
//     // Failed to decompress
//     logger.debug("Decompression failed:", error);
//     return null;
//   }
//   return null;
// }

// export interface overchatResponse {
//   status: number;
//   result: string;
// }

// export const generateImage = async (
//   prompt: string
// ): Promise<overchatResponse> => {
//   try {
//     // Validate inputs
//     if (!prompt) {
//       logger.warn("Generate Image: Missing prompt");
//       return { status: 400, result: "Prompt is required" };
//     }

//     if (typeof prompt !== 'string') {
//       logger.warn("Generate Image: Invalid prompt type");
//       return { status: 400, result: "Prompt must be a string" };
//     }

//     const endpoint = 'https://widget-api.overchat.ai/v1/images/generations';
//     const uuid = randomUUID();

//     const headers = {
//       'User-Agent': 'Mozilla/5.0 (Linux; Android 11; vivo 1901) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.7258.143 Mobile Safari/537.36',
//       'Accept': 'application/json, text/plain, */*',
//       'Accept-Encoding': 'identity',
//       'Content-Type': 'application/json',
//       'sec-ch-ua-platform': '"Android"',
//       'x-device-uuid': uuid,
//       'authorization': 'Bearer',
//       'sec-ch-ua': '"Not;A=Brand";v="99", "Android WebView";v="139", "Chromium";v="139"',
//       'sec-ch-ua-mobile': '?1',
//       'x-device-language': 'en',
//       'x-device-platform': 'web',
//       'x-device-version': '1.0.44',
//       'origin': 'https://widget.overchat.ai',
//       'x-requested-with': 'mark.via.gp',
//       'sec-fetch-site': 'same-site',
//       'sec-fetch-mode': 'cors',
//       'sec-fetch-dest': 'empty',
//       'referer': 'https://widget.overchat.ai/',
//       'accept-language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
//       'priority': 'u=1, i'
//     };

//     const bodyObj = {
//       prompt,
//       model: 'google/imagen4/preview',
//       personaId: 'Imagen-4'
//     };

//     const response = await fetch(endpoint, {
//       method: 'POST',
//       headers,
//       body: JSON.stringify(bodyObj)
//     });

//     const contentEncoding = response.headers?.get('content-encoding') || null;

//     const arrayBuffer = await response.arrayBuffer();
//     const buffer = Buffer.from(arrayBuffer);
//     let text = buffer.toString('utf8');

//     let json: any = null;
//     try {
//       json = JSON.parse(text);
//     } catch (error) {
//       const decompressed = await _tryDecompress(buffer, contentEncoding);
//       if (decompressed) {
//         try {
//           json = JSON.parse(decompressed);
//         } catch (parseError) {
//           logger.error("Failed to parse decompressed response:", parseError);
//           return { status: 500, result: "Invalid response format from server" };
//         }
//       } else {
//         if (contentEncoding?.toLowerCase().includes('zstd')) {
//           return { status: 500, result: "Server using unsupported ZSTD compression" };
//         }
//         return { status: 500, result: "Invalid JSON response from server" };
//       }
//     }

//     if (!json || !Array.isArray(json.data) || !json.data.length) {
//       logger.warn("Generate Image: Empty data from server");
//       return { status: 404, result: "No image data received from server" };
//     }


//     const firstImage = json.data[0];
//     console.log("fffffffffff", firstImage);
//     if (!firstImage.url) {
//       logger.warn("Generate Image: No URL in response");
//       return { status: 404, result: "Image URL not found in response" };
//     }

//     logger.debug(`Image generated successfully: ${firstImage.url.substring(0, 50)}...`);
    
//     return {
//       status: 200,
//       result: firstImage.url
//     };
//   } catch (error: any) {
//     logger.error("Generate Image API error:", error);
    
//     return {
//       status: 500,
//       result: `Image generation error: ${error.message || "Unknown error"}`
//     };
//   }
// };



// storage/imageGenerator.ts
import { overchatRequest } from "../modelBase/overchatBase";
import { logger } from "../../config/logger";

export interface GenerateImageResponse {
  status: number;
  result: string;
}

export const generateImage = async (
  prompt: string
): Promise<GenerateImageResponse> => {
  try {
    // Validate inputs
    if (!prompt) {
      logger.warn("Generate Image: Missing prompt");
      return { status: 400, result: "Prompt is required" };
    }

    const endpoint = 'https://widget-api.overchat.ai/v1/images/generations';
    
    const body = {
      prompt,
      model: 'google/imagen4/preview',
      personaId: 'Imagen-4'
    };

    const response = await overchatRequest({
      endpoint,
      body,
      isStream: false
    });

    if (response.status !== 200) {
      return response;
    }

    // Process the response
    if (!response.result.data || !Array.isArray(response.result.data) || !response.result.data.length) {
      logger.warn("Generate Image: Empty data from server");
      return { status: 404, result: "No image data received from server" };
    }

    const imageData = response.result.data[0];
    if (!imageData.url) {
      logger.warn("Generate Image: No URL in response");
      return { status: 404, result: "Image URL not found in response" };
    }

    logger.debug(`Image generated successfully: ${imageData.url.substring(0, 50)}...`);
    
    return {
      status: 200,
      result: imageData.url
    };
  } catch (error: any) {
    logger.error("Generate Image API error:", error);
    return {
      status: 500,
      result: `Image generation error: ${error.message || "Unknown error"}`
    };
  }
};