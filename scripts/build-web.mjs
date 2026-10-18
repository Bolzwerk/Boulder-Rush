// Wraps src/game.html (the same file published as the claude.ai artifact) into a
// standalone page for the Android app, with the pixel fonts bundled for offline play.
import {readFileSync,writeFileSync,mkdirSync,copyFileSync} from 'node:fs';

const out='www';
mkdirSync(`${out}/fonts`,{recursive:true});
const fonts=[
  ['Press Start 2P','node_modules/@fontsource/press-start-2p/files/press-start-2p-latin-400-normal.woff2','press-start-2p.woff2'],
  ['VT323','node_modules/@fontsource/vt323/files/vt323-latin-400-normal.woff2','vt323.woff2'],
];
for(const [,src,dst] of fonts)copyFileSync(src,`${out}/fonts/${dst}`);
const faces=fonts.map(([fam,,dst])=>`@font-face{font-family:"${fam}";src:url(fonts/${dst}) format("woff2");font-display:swap}`).join('\n');

let game=readFileSync('src/game.html','utf8');
game=game.replace(/<link rel="preconnect"[^>]*>\n/,'').replace(/<link rel="stylesheet" href="https:\/\/fonts\.googleapis\.com[^>]*>\n/,`<style>\n${faces}\n</style>\n`);
const build=process.env.GITHUB_RUN_NUMBER?`1.0.${process.env.GITHUB_RUN_NUMBER}`:'dev';
game=game.replace("const BUILD='web';",`const BUILD='${build}';`);
if(game.includes('fonts.googleapis.com'))throw new Error('Google Fonts link not replaced');

const html=`<!doctype html><html lang="de"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover">
<style>:root{color-scheme:dark;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0}[hidden]{display:none!important}</style>
</head><body>
${game}
</body></html>
`;
writeFileSync(`${out}/index.html`,html);
console.log(`wrote ${out}/index.html (${html.length} bytes)`);
