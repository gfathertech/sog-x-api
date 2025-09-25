import axios from "axios";
import * as cheerio from "cheerio";
import { logger } from "../../config/logger";

interface AnimeListItem {
  title: string;
  url: string | undefined;
  image: string | undefined;
  episode: string;
  type: string;
}

interface DownloadLink {
  subtitleType: string;
  links: { url: string | undefined }[];
}

interface AnimeDetail {
  title: string;

  episodeTitle: string;
  image: string | undefined;
  rating: string;
  status: string;
  network: string;
  studio: string;
  released: string;
  duration: string;
  country: string;
  type: string;
  episodes: string;
  fansub: string;
  genres: string[];
  description: string;
  downloadLinks: DownloadLink[];
}

// 1. AnimeXin Update
export const animexinUpdate = async (
  text: string
): Promise<{ status: number; result: AnimeListItem[] | string }> => {
  try {
    const res = `https://animexin.dev/s/${encodeURIComponent(text)}`;
    const { data } = await axios.get(res);
    const $ = cheerio.load(data);
    const animeList: AnimeListItem[] = [];

    $(".listupd .bsx").each((_, element) => {
      animeList.push({
        title: $(element).find('h2[itemprop="headline"]').text(),
        url: $(element).find('a[itemprop="url"]').attr("href"),
        image: $(element).find('img[itemprop="image"]').attr("src"),
        episode: $(element).find(".eggepisode").text(),
        type: $(element).find(".eggtype").text(),
      });
    });

    return {
      status: 200,
      result: animeList,
    };
  } catch (error: any) {
    logger.error("Animexin Update error:", error);
    return {
      status: 500,
      result: `Animexin Update error: ${error.message || "Unknown error"}`,
    };
  }
};

// 2. AnimeXin Detail
export const animexinDetail = async (
  url: string
): Promise<{ status: number; result: AnimeDetail | string }> => {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const episodeData: AnimeDetail = {
      title: $('h2[itemprop="partOfSeries"]').text(),
      episodeTitle: $('h2[itemprop="headline"]').text(),
      image: $(".thumb img[itemprop='image']").attr("src"),
      rating: $(".rating strong").text(),
      status: $('.spe span:contains("Status:")').text().replace("Status: ", ""),
      network: $('.spe span:contains("Network:") a').text(),
      studio: $('.spe span:contains("Studio:") a').text(),
      released: $('.spe span:contains("Released:")').text().replace("Released: ", ""),
      duration: $('.spe span:contains("Duration:")').text().replace("Duration: ", ""),
      country: $('.spe span:contains("Country:") a').text(),
      type: $('.spe span:contains("Type:")').text().replace("Type: ", ""),
      episodes: $('.spe span:contains("Episodes:")').text().replace("Episodes: ", ""),
      fansub: $('.spe span:contains("Fansub:")').text().replace("Fansub: ", ""),
      genres: $(".genxed a")
        .map((_, el) => $(el).text())
        .get(),
      description: $(".desc.mindes").text().trim(),
      downloadLinks: [],
    };

    $(".mctnx .soraddlx").each((_, element) => {
      const subtitleType = $(element).find(".sorattlx h3").text();
      const links = $(element)
        .find(".soraurlx a")
        .map((_, el) => ({
          url: $(el).attr("href"),
        }))
        .get();
      episodeData.downloadLinks.push({ subtitleType, links });
    });

    return { status: 200, result: episodeData };
  } catch (error: any) {
    logger.error("Animexin Detail error:", error);
    return {
      status: 500,
      result: `Animexin Detail error: ${error.message || "Unknown error"}`,
    };
  }
};

// 3. AnimeXin Search
export const animexinSearch = async (
  keyword: string
): Promise<{ status: number; result: AnimeListItem[] | string }> => {
  try {
    const { data } = await axios.get(`https://animexin.dev/?s=${encodeURIComponent(keyword)}`);
    const $ = cheerio.load(data);
    const animeList: AnimeListItem[] = [];

    $(".listupd article.bs").each((_, element) => {
      animeList.push({
        title: $(element).find('h2[itemprop="headline"]').text(),
        url: $(element).find('a[itemprop="url"]').attr("href"),
        image: $(element).find('img[itemprop="image"]').attr("src"),
        episode: $(element).find(".epx").text(),
        type: $(element).find(".typez").text(),
      });
    });

    return {
      status: 200,
      result: animeList,
    };
  } catch (error: any) {
    logger.error("Animexin Search error:", error);
    return {
      status: 500,
      result: `Animexin Search error: ${error.message || "Unknown error"}`,
    };
  }
};



// const result =  animexinSearch("fantasy");
// console.log(result);

// const details =  animexinDetail("https://animexin.dev/renegade-immortal-episode-71-indonesia-english-sub/");
// console.log(details)

// const updates =  animexinUpdate("dragon");
// console.log(updates);