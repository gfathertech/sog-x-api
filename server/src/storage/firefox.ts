/* Firefox (theme) Search n Download
 * https://addons.mozilla.org
 * Mampir vapisz.web.app
 */

const axios = require('axios')
const cheerio = require('cheerio')

async function fr_search(tema) {
    try {
        const { data } = await axios.get(`https://addons.mozilla.org/en-US/firefox/search/?q=${encodeURIComponent(tema)}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        })

        const $ = cheerio.load(data)

        const result = []
        $('a').each((_, element) => {
            const text = $(element).text().trim()
            const href = $(element).attr('href')

            if (text && href) {
                if (text.toLowerCase().includes(tema.toLowerCase())) { result.push({ text, url: href.startsWith('http') ? href : `https://addons.mozilla.org${href}` })
                }
            }
        })

        return {
            title: $('title').text().trim() || '-',
            result
        }
    } catch (e) {
        return {}
        console.error(e)
    }
}

async function fr_download(url) {
    try {
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        })

        const $ = cheerio.load(data)

        const title = $('title').text().trim()

        let author = ''
        $('h1').each((_, element) => {
            const header_text = $(element).text().trim()
            if (header_text) {
                author = header_text.replace('by ', '')
            }
        })

        let download = ''
        $('a').each((_, element) => {
            const text = $(element).text().trim()
            const href = $(element).attr('href')
            if (text && href) {
                if (text.toLowerCase().includes('download file')) { download = href.startsWith('http') ? href : `https://addons.mozilla.org${href}`
                }
            }
        })

        return {
            title,
            author,
            download
        }
    } catch (e) {
        return {}
        console.error(e)
    }
}

fr_search("Ronaldo")

fr_download("https://addons.mozilla.org/en-US/firefox/addon/cristiano-ronaldo-cr9-real-mad/?utm_source=addons.mozilla.org&utm_medium=referral&utm_content=search")