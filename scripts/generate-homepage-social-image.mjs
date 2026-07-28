import { mkdir, readFile, stat } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const portrait = await readFile(resolve(root, 'public', 'me.jpg'));
const primaryFont = await readFile(resolve(root, 'public', 'fonts', 'bricolage-grotesque-latin.woff2'));
const noteFont = await readFile(resolve(root, 'public', 'fonts', 'recursive-casual-latin.woff2'));
const output = resolve(root, 'public', 'social', 'homepage-v1.png');

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <style>
      @font-face {
        font-family: "Bricolage Social";
        src: url("data:font/woff2;base64,${primaryFont.toString('base64')}") format("woff2");
        font-weight: 400 800;
      }
      @font-face {
        font-family: "Recursive Social";
        src: url("data:font/woff2;base64,${noteFont.toString('base64')}") format("woff2");
        font-weight: 400 600;
      }
      .name { font-family: "Bricolage Social", sans-serif; font-size: 84px; font-weight: 800; letter-spacing: -3px; }
      .domain { font-family: "Bricolage Social", sans-serif; font-size: 30px; font-weight: 600; }
      .caption { font-family: "Recursive Social", sans-serif; font-size: 21px; font-weight: 400; }
    </style>
    <clipPath id="portrait-crop">
      <rect x="719" y="70" width="386" height="438" />
    </clipPath>
  </defs>

  <rect width="1200" height="630" fill="#f5f7f9" />
  <rect width="28" height="630" fill="#2c4ed5" />

  <g transform="translate(68 52) scale(3.7)">
    <path d="M5 28V5m0 14L15 9M8 16l9 10c3 3 9 2 11-2"
      fill="none" stroke="#2c4ed5" stroke-width="4"
      stroke-linecap="round" stroke-linejoin="round" />
    <circle cx="27.5" cy="24" r="3.5" fill="#f1453b" />
  </g>

  <text class="name" x="68" y="382" fill="#101116">Kaleb Cole</text>
  <line x1="70" y1="412" x2="542" y2="412" stroke="#2c4ed5" stroke-width="7" />
  <text class="domain" x="70" y="463" fill="#2c4ed5">kalebcole.dev</text>

  <g transform="rotate(2 913 310)">
    <rect x="716" y="72" width="426" height="520" fill="#f1453b" />
    <rect x="692" y="46" width="426" height="520" fill="#ffffff" stroke="#101116" stroke-width="3" />
    <image x="719" y="70" width="386" height="438"
      href="data:image/jpeg;base64,${portrait.toString('base64')}"
      preserveAspectRatio="xMidYMid slice" clip-path="url(#portrait-crop)" />
    <text class="caption" x="719" y="544" fill="#101116">Still figuring it out in public.</text>
  </g>
</svg>`;

await mkdir(dirname(output), { recursive: true });
await sharp(Buffer.from(svg))
  .png({ compressionLevel: 9, adaptiveFiltering: true })
  .toFile(output);

const { width, height } = await sharp(output).metadata();
const { size } = await stat(output);
console.log(`Generated ${output} (${width}x${height}, ${size} bytes).`);
