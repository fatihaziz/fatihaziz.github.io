// One-time script: Extract base64 images and text from love letter HTML
const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(
  path.join(__dirname, 'public/for-my-love-for-eternity/index.html'),
  'utf-8'
);

// Extract base64 images
const imgRegex = /src="data:image\/(?:jpeg|png);base64,([^"]+)"/g;
const photoNames = [
  'photo-01-the-day-we-met.jpg',
  'photo-02-first-flowers.jpg',
  'photo-03-that-look.jpg',
  'photo-04-cosplay-day.jpg',
  'photo-05-from-dubai.jpg',
  'photo-06-you-came.jpg',
  'photo-07-valentines-day.jpg',
  'photo-08-first-dinner.jpg',
];

let match;
let i = 0;
const outDir = path.join(__dirname, 'public/love-letter');

while ((match = imgRegex.exec(html)) !== null) {
  if (i < photoNames.length) {
    const buf = Buffer.from(match[1], 'base64');
    const outPath = path.join(outDir, photoNames[i]);
    fs.writeFileSync(outPath, buf);
    console.log(`Wrote ${photoNames[i]} (${(buf.length / 1024).toFixed(1)} KB)`);
    i++;
  }
}

console.log(`\nExtracted ${i} images to ${outDir}`);

// Also extract text content by stripping tags (rough extraction for reference)
const lines = html.split('\n');
// Print non-image, non-CSS, non-JS content lines that have visible text
let inStyle = false, inScript = false;
const textLines = [];
for (const line of lines) {
  if (line.includes('<style')) inStyle = true;
  if (line.includes('</style>')) { inStyle = false; continue; }
  if (line.includes('<script')) inScript = true;
  if (line.includes('</script>')) { inScript = false; continue; }
  if (inStyle || inScript) continue;
  if (line.includes('data:image')) continue;

  const stripped = line.replace(/<[^>]+>/g, '').trim();
  if (stripped && stripped.length > 1) {
    textLines.push(stripped);
  }
}

fs.writeFileSync(
  path.join(outDir, '_extracted-text.txt'),
  textLines.join('\n'),
  'utf-8'
);
console.log(`\nText content saved to ${outDir}/_extracted-text.txt`);
