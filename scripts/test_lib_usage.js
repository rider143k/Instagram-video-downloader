
const { instagramGetUrl } = require("instagram-url-direct");

async function test() {
    const url = "https://www.instagram.com/reel/DFTaHCOTIUq/";
    try {
        const result = await instagramGetUrl(url);
        console.log(JSON.stringify(result, null, 2));
    } catch (e) {
        console.error("Error:", e);
    }
}

test();
