import axios from "axios";
import * as cheerio from 'cheerio';
import { logger } from "../../config/logger";

export const unsplash = async (
  text: string
): Promise<{ status: number;  result:string[]}> => {


  const res = `https://unsplash.com/s/photos/${encodeURIComponent(text)}`;
  const { data } = await axios.get(res);
  const $ = cheerio.load(data);
  const seen = new Set();
  const imageUrls: string[] = [];

  $('img[src^="https://images.unsplash.com"]').each((_, el) => {
    const fullUrl = $(el).attr('src');

      console.log(fullUrl)

    if (fullUrl && fullUrl.includes('photo') && !fullUrl.includes('profile')) {
      const baseUrl = fullUrl.split('?')[0];
      if (!seen.has(baseUrl)) {
        seen.add(baseUrl);
        imageUrls.push(fullUrl);
      }
    }
  });

    // const result: {image: string}[] =[]
  const arrayResults: string[] = imageUrls
  if (!arrayResults.length) {
      return { status: 502, result: ["No images found"] };
  }
  
// for (let i = 0; i < arrayResults.length; i++) {
//    const imageurl: string =  arrayResults[i]

//     result.push({
//         image: imageurl
//     })
//     }

  return {
      status: 200,
      result: arrayResults
    };

}

export const getUnsplash = async (
  text: string
): Promise<{ status: number; result: string[] | string }> => {
  try {
    // Validate inputs
    if (!text) {
      logger.warn("YouTube Downloader: Missing videoUrl");
      return { status: 400, result: "The 'url' parameter is missing" };
    }

    // Post data to the external service
    const response = await axios.get(`https://unsplash.com/s/photos/${encodeURIComponent(text)}`, {
      headers: 
      { 'Content-Type': 'application/json',
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
        "Accept": "*/*",
        "Accept-Encoding": "gzip, deflate, br, zstd",
        "connection": "keep-alive",
        "cache-control": "no-cache, no-store, must-revalidate"
       },
    });

    const html = response.data
    const $ = cheerio.load(html)
    const images: {url: string}[] =[]

    $('img[src^="https://images.unsplash.com"]').each((_, element) => {
        const fullUrl = $(element).attr('src');
        if (fullUrl && fullUrl.includes('photo') && !fullUrl.includes('profile')) {
      const baseUrl = fullUrl.split('?')[0];
            images.push({
                url: baseUrl
            })
                }
    })

    console.dir(images)

    return {
      status: 200,
      result: 'data'
    };

  } catch (error: any) {
    logger.error("Unsplash Downloader API error:", error);
    return {
      status: 500,
      result: `Unsplash Downloader error: ${error.message || "Unknown error"}`
    };
  }
};

// getUnsplash('love')