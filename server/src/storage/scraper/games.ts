/*
*
* [ *SCRAPE TOURNAMENT ML* ]
* Created By Hann
* 
* Channel: https://whatsapp.com/channel/0029Vaf07jKCBtxAsekFFk3i
*
**/

Source Code:
const axios = require('axios');
const cheerio = require('cheerio');

async function latestTourMobileLegends() {
    try {
        const { data } = await axios.get('https://infotourney.com/tournament/mobile-legends');
        const $ = cheerio.load(data);
        const tournaments = [];

        $('.items-row .item').each((index, element) => {
            const title = $(element).find('h2 a').text();
            const url = "https://infotourney.com" + $(element).find('h2 a').attr('href');
            const image = "https://infotourney.com" + $(element).find('img').attr('src');
            const startDate = $(element).find('.published time').attr('datetime');
            const startDateText = $(element).find('.published').text().trim();
            const registrationEndDateText = $(element).find('p').last().text().trim();
            const description = $(element).find('p').eq(1).text().trim();
            
            const tags = [];
            $(element).find('.tags a').each((i, tagElement) => {
                tags.push($(tagElement).text());
            });

            tournaments.push({
                title,
                url,
                image,
                startDate,
                startDateText,
                registrationEndDateText,
                description,
                tags
            });
        });

        return tournaments
    } catch (error) {
        return error.message;
    }
}

//Example:
return latestTourMobileLegends();




/*
*
* [ *SCRAPE MINECRAFT STALK* ]
* Created By Hann
* 
* Channel: https://whatsapp.com/channel/0029Vaf07jKCBtxAsekFFk3i
*
**/

Source Code:
const axios = require('axios');

async function MinecraftStalk(teks) {
    try {
        const response = await axios.get('https://playerdb.co/api/player/minecraft/' + teks);
        const data = response.data;

        const result = {
            username: data.data.player.username,
            id: data.data.player.id,
            raw_id: data.data.player.raw_id,
            avatar: data.data.player.avatar,
            skin_texture: data.data.player.skin_texture,
            name_history: data.data.player.name_history
        };

        return result
    } catch (error) {
        return error.message;
    }
}

//Example:
return MinecraftStalk("hann");



/*
*
* [ *SCRAPE MIXLR STALK* ]
* Created By Hann
* 
* Channel: https://whatsapp.com/channel/0029Vaf07jKCBtxAsekFFk3i
*
**/

Source Code:
const axios = require('axios');

async function mixlrStalk(teks) {
    try {
        const response = await axios.get('https://api.mixlr.com/users/' + teks);
        const data = response.data;

        const result = {
            username: data.username,
            id: data.id,
            url: data.url,
            profile_image_url: data.profile_image_url,
            is_live: data.is_live,
            time_zone: data.time_zone,
            role: data.role
        };

        return result
    } catch (error) {
        return error.message;
    }
}

//Example:
return mixlrStalk("hann");




/*
*
* [ *SCRAPE BANDLAND STALK* ]
* Created By Hann
* 
* Channel: https://whatsapp.com/channel/0029Vaf07jKCBtxAsekFFk3i
*
**/

Source Code:
const axios = require('axios');

async function bandLandStalk(teks) {
    try {
        const response = await axios.get('https://www.bandlab.com/api/v1.3/users/' + teks);
        const data = response.data;

        const result = {
            about: data.about,
            backgroundPicture: data.backgroundPicture.url,
            collaborationStatus: data.collaborationStatus,
            counters: {
                followers: data.counters.followers,
                following: data.counters.following,
            },
            createdOn: data.createdOn,
            genres: data.genres,
            id: data.id,
            name: data.name,
            picture: data.picture.url,
            skills: data.skills,
            username: data.username
        };

        return result
    } catch (error) {
        return error.message;
    }
}

//Example:
return bandLandStalk("hann");


/*
*
* [ *SCRAPE XBOX STALK* ]
* Created By Hann
* 
* Channel: https://whatsapp.com/channel/0029Vaf07jKCBtxAsekFFk3i
*
**/

Source Code:
const axios = require('axios');
const cheerio = require('cheerio');
const { createCanvas } = require('canvas');
const fs = require('fs');

async function xboxStalk(teks) {
    try {
        const { data } = await axios.get('https://xboxgamertag.com/search/' + teks);
        const $ = cheerio.load(data);

        let gamerscore = 0;
        let gamesPlayed = 0;

        $('.profile-detail-item').each((index, element) => {
            const title = $(element).find('span').text();
            const value = $(element).text().replace(title, '').trim();
            if (title.includes("Gamerscore")) {
                gamerscore = parseInt(value.replace(/,/g, ''), 10) || 0;
            }
            if (title.includes("Games Played")) {
                gamesPlayed = parseInt(value, 10) || 0;
            }
        });

        const gamertag = {
            name: $('h1 a').text(),
            avatar: $('.avatar img').attr('src'),
            gamerscore: gamerscore,
            gamesPlayed: gamesPlayed,
            gameHistory: []
        };

        $('.recent-games .game-card').each((index, element) => {
            const game = {
                title: $(element).find('h3').text(),
                lastPlayed: $(element).find('.text-sm').text().replace('Last played ', ''),
                platforms: $(element).find('.text-xs').text(),
                gamerscore: $(element).find('.badge:contains("Gamerscore")').parent().next().text().trim(),
                achievements: $(element).find('.badge:contains("Achievements")').parent().next().text().trim(),
                progress: ($(element).find('.progress-bar').attr('style') || 'width: 0%;').match(/width: (.*?);/)[1] || '0%'
            };
            gamertag.gameHistory.push(game);
        });

        await buatImageXbox(gamertag);

        return gamertag;
    } catch (error) {
        return error.message;
    }
}

async function buatImageXbox(gamertag) {
    const canvasWidth = 800;
    const canvasHeight = 1200;
    const canvas = createCanvas(canvasWidth, canvasHeight);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#2a2a2a';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    ctx.fillStyle = '#3a3a3a';
    ctx.fillRect(0, 0, canvasWidth, 150);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 30px Arial';
    ctx.fillText(gamertag.name, 30, 50);

    ctx.font = '20px Arial';
    ctx.fillText(`Gamerscore: ${gamertag.gamerscore}`, 30, 90);
    ctx.fillText(`Games Played: ${gamertag.gamesPlayed}`, 30, 120);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 25px Arial';
    ctx.fillText('Game History', 30, 200);

    let yPosition = 240;
    let xPosition = 30;

    const maxItemsPerColumn = 6;
    const progressWidth = 300;
    let gameCount = 0;

    gamertag.gameHistory.forEach((game, index) => {
        if (gameCount >= maxItemsPerColumn) {
            xPosition += 400;
            yPosition = 240;
            gameCount = 0;
        }

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 18px Arial';
        ctx.fillText(game.title, xPosition, yPosition);

        ctx.font = '16px Arial';
        ctx.fillStyle = '#cccccc';
        ctx.fillText(`Last Played: ${game.lastPlayed}`, xPosition, yPosition + 25);

        ctx.fillText(`Gamerscore: ${game.gamerscore}`, xPosition, yPosition + 50);
        ctx.fillText(`Achievements: ${game.achievements}`, xPosition, yPosition + 75);

        ctx.fillStyle = '#444'; 
        ctx.fillRect(xPosition, yPosition + 100, progressWidth, 20);

        ctx.fillStyle = '#00ff00';
        const progress = parseFloat(game.progress) || 0;
        ctx.fillRect(xPosition, yPosition + 100, (progress / 100) * progressWidth, 20);

        yPosition += 150;
        gameCount += 1;
    });

    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync('kanjut.png', buffer);
    await Rifky.sendMessage(m.chat, {image: fs.readFileSync("./kanjut.png")})
}

//Example:
return xboxStalk("ruep")




