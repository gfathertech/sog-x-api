    try {
        const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        const response = await axios.get(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36"
            }
        });
        const html = response.data;
        const $ = cheerio.load(html);

        const results = [];
        $("div.tF2Cxc").each((index, element) => {
            const title = $(element).find("h3").text().trim();
            const link = $(element).find("a").attr("href");
            const description = $(element).find(".VwiC3b").text().trim();

            if (title && link) {
                results.push({ title, link, description });
            }
        });

        return results;
    } catch (error) {
        console.error("Error fetching search results:", error.message);
        throw new Error("Gagal mengambil data pencarian.");
    }
}
  
    if (!args[0]) return m.reply("❗ Masukkan kata kunci pencarian!");

    const query = args.join(" ");
    try {
        const results = await google(query);

        if (results.length === 0) return m.reply("❌ Tidak ada hasil ditemukan.");

        let caption = `🔍 *Hasil Pencarian untuk: "${query}"*\n\n`;
        results.forEach((result, index) => {
            caption += `⭐ *${index + 1}. ${result.title}*\n`;
            caption += `🔗 *Link*: ${result.link}\n`;
            caption += `📝 *Deskripsi*: ${result.description || "Deskripsi tidak tersedia."}\n\n`;
        });

        const imageUrl = "https://files.catbox.moe/ggxx14.jpg"; 
        await Rifky.sendFile(m.chat, imageUrl, "result.jpg", caption.trim(), m);
    } catch (error) {
        console.error("Error:", error.message);
        m.reply("⚠️ Terjadi kesalahan saat mengambil data.");
    }



     async (query, maxPages = 3) => {
  try {
    const results = [];
    const currentTime = new Date().toISOString();

    for (let i = 0; i < maxPages; i++) {
      const start = i * 10;
      const response = await axios.get(`https://www.google.com/search?q=${query}&start=${start}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
        },
      });

      const $ = cheerio.load(response.data);
      const language = $('html').attr('lang') || 'id';

      $('.g').each((_, element) => {
        const title = $(element).find('h3').text().trim() || '';
        const link = $(element).find('a').attr('href') || '';
        const description = $(element).find('.VwiC3b').text().trim() || '';

        if (title && link) {
          results.push({
            created_at: currentTime,
            modified_at: currentTime,
            link,
            is_expanded: true,
            title,
            description,
            description_tokens: description.split(/\s+/).length,
            expanded_tokens: Math.ceil(description.split(/\s+/).length * 1.5),
            accept_language: language,
            engine: 'Google Search',
            expanded_description: description.length > 100 
              ? `${description.substring(0, 100)}...` 
              : description,
            scraped_at: currentTime,
          });
        }
      });
    }

    return { success: true, totalResults: results.length, results };
  } catch (error) {
    return { success: false, error: error.message };
  }
};




async function chromeStoreSearch(teks) {
    try {
        const { data } = await axios.get('https://chromewebstore.google.com/search/' + teks);
        const $ = cheerio.load(data);
        
        const results = [];

        $('div.Cb7Kte').each((index, element) => {
            const title = $(element).find('h2.CiI2if').text();
            const link = $(element).find('a.q6LNgd').attr('href').replace('./', 'https://chromewebstore.google.com/');
            const imgSrc = $(element).find('img.fzxcm').attr('src');
            const publisher = $(element).find('span.cJI8ee.HtRvfe').text() || 'Tidak ditemukan';
            const rating = $(element).find('span.Vq0ZA').text();
            const ratingCount = $(element).find('span.Y30PE').text();

            results.push({
                title,
                link,
                imgSrc,
                publisher,
                rating,
                ratingCount
            });
        });

        return results
    } catch (error) {
        return error.message;
    }
}

//Example:
return chromeStoreSearch("cookie");


(url) {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        const result = {
            title: $('.Pa2dE').text().trim(),
            logo: $('.KgGEHd img').attr('src'),
            rating: $('.Vq0ZA').first().text().trim(),
            ratingsCount: $('.qwG2Hd a p').text().trim(),
            description: $('.JJ3H1e p').text().trim(),
            version: $('.ZbWJPd').eq(0).find('.N3EXSc').text().trim(),
            updated: $('.ZbWJPd').eq(1).find('div').last().text().trim(),
            size: $('.ZbWJPd').eq(4).find('div').last().text().trim(),
            developer: {
                name: $('.ZbWJPd').eq(3).find('div').last().text().trim(),
            },
            support: {
                supportSite: $('.kcASRe a').attr('href'),
            },
        };

        return result
    } catch (error) {
        return error.message;
    }
}

//Example:
return chromeWebDetail("https://chromewebstore.google.com/detail/snake/oppflpnigmhkldmdmmbnopidlhahanji");







