import axios from 'axios';
import * as cheerio from "cheerio";
import { logger } from '../../config/logger';
import { apkMirror } from '../../utils/schema';



 export const getApkMirror = async (
   text: string
 ): Promise<{ status: number; result: apkMirror | string }> => {
   try {
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
    return { status: 502, result: "Sorry, I couldn’t find an APK matching that title." };
    }

    // STEP 2: Go to App Page and get first version
    const appDetails = await axios.get(appPage, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });

    const $$ = cheerio.load(appDetails.data);
    const versionLink = 'https://www.apkmirror.com' + $$('.table-row a.accent_color').first().attr('href');

    if (!versionLink) {
    return { status: 502, result: "Couldn’t find a version to download" };
    }

    // STEP 3: Go to Version Page (with download variants)
    const versionPage = await axios.get(versionLink, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });

    const $$$ = cheerio.load(versionPage.data);
    const variantPage = 'https://www.apkmirror.com' + $$$('a.downloadButton').first().attr('href');

    if (!variantPage) {
    return { status: 502, result: "Couldn’t find a download variant" };
    }

    // STEP 4: Go to Variant Page (actual download)
    const finalPage = await axios.get(variantPage, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });

    const $$$$ = cheerio.load(finalPage.data);
    const downloadLink = 'https://www.apkmirror.com' + $$$$('a[rel="nofollow"]').first().attr('href');

    if (!downloadLink) {
     return { status: 502, result: "Couldn’t find the final download link." };
    }

    // Final reply
    const replyMessage = `*${appTitle}*\n\nVersion: ${versionLink.split('/')[5]}`;
    
    const result: apkMirror ={
        appLink: downloadLink,
        title: appTitle,
       version: versionLink.split('/')[5]
    }
   
    
     return {
      status: 200,
      result: result
    };
  } catch (error) {
     logger.error("APK Deep Fetch Error:", error);
        return {
          status: 500,
          result: `Something went wrong while fetching the full APK download: ${error || "Unknown error"}`
        }
  }
};



getApkMirror('whatsapp')