
// Native fetch in Node
const fs = require('fs');

async function test() {
    const shortcode = 'DFTaHCOTIUq';
    const url = `https://www.instagram.com/p/${shortcode}/?__a=1&__d=dis`;
    console.log(`Fetching ${url}...`);

    try {
        const res = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });
        console.log('Status:', res.status);
        if (res.status === 200) {
            const text = await res.text();
            fs.writeFileSync('scripts/ig_dump.html', text);
            console.log('Saved to scripts/ig_dump.html');
        }
    } catch (e) {
        console.error(e);
    }
}

test();
