
const fs = require('fs');
const content = fs.readFileSync('scripts/ig_dump.html', 'utf8');
const lsdMatch = content.match(/"LSD",\[\],{"token":"([^"]+)"}/);
const lsdMatch2 = content.match(/LSD[^"]+"([^"]+)"/);
// Basic search
const index = content.indexOf('LSD');
console.log('Context around LSD:');
console.log(content.substring(index, index + 200));
