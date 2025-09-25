import { logger } from "../config/logger";
import * as cheerio from "cheerio";
import axios from "axios";

export const apkMirror = async (
  text: string
): Promise<{ status: number; result: string }> => {
  try {
     // Validate inputs
         if (!text) {
              logger.warn("SYSTEM: Missing prompt");
              return { status: 400, result: "Text is missing" };
            }
    // STEP 1: Search
    const searchURL = `https://www.apkmirror.com/?s=${encodeURIComponent(text)}`;
    const response = await axios.get(searchURL, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });

    const $ = cheerio.load(response.data);
    const firstResult = $('.appRow').first();
    const appTitle = firstResult.find('.appRowTitle').text().trim();
    const appPage = 'https://www.apkmirror.com' + firstResult.find('a').attr('href');

    if (!appPage || !appTitle) {
      return { status: 401, result: "Sorry, I couldn’t find an APK matching that title." };
    }

    // STEP 2: Go to App Page and get first version
    const appDetails = await axios.get(appPage, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });

    const $$ = cheerio.load(appDetails.data);
    const versionLink = 'https://www.apkmirror.com' + $$('.table-row a.accent_color').first().attr('href');

    if (!versionLink) {
    return { status: 401, result: "Culdn’t find a version to download." };
    }

    // STEP 3: Go to Version Page (with download variants)
    const versionPage = await axios.get(versionLink, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });

    const $$$ = cheerio.load(versionPage.data);
    const variantPage = 'https://www.apkmirror.com' + $$$('a.downloadButton').first().attr('href');

    if (!variantPage) {
      return { status: 401, result: "Couldn’t find a download variant." };
    }

    // STEP 4: Go to Variant Page (actual download)
    const finalPage = await axios.get(variantPage, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });

    const $$$$ = cheerio.load(finalPage.data);
    const downloadLink = 'https://www.apkmirror.com' + $$$$('a[rel="nofollow"]').first().attr('href');

    if (!downloadLink) {
      return { status: 401, result: "Couldn’t find the final download link." };
    }

    // Final reply
const result = {
  appName: appTitle,
  downloadLink: downloadLink,
  version: versionLink.split('/')[5] // This will get "v1.2.3" from the example
};
        const ress = JSON.stringify(result)
        const res = JSON.parse(ress)

      return {
      status: 200,
      result: res
    };

  } catch (err: any) {
    logger.error("APK Deep Fetch Error:", err.message);
    
    return {
      status: 500,
      result: `Gemini error: ${err.message || "Unknown error"}`
    };
  }
};
