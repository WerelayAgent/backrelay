const fs = require('fs');
const path = require('path');

const outDir = path.join('.vercel', 'output');
const staticDir = path.join(outDir, 'static');

// Clean and recreate .vercel/output
if (fs.existsSync(outDir)) {
  fs.rmSync(outDir, { recursive: true, force: true });
}
fs.mkdirSync(staticDir, { recursive: true });

// Write Build Output API v3 config.json with routes for API proxy and SPA client routing
const config = {
  version: 3,
  routes: [
    {
      src: '^/v1/(.*)$',
      dest: 'https://trybackers.com/v1/$1'
    },
    {
      src: '^/v1$',
      dest: 'https://trybackers.com/v1'
    },
    {
      handle: 'filesystem'
    },
    {
      src: '^/(.*)$',
      dest: '/index.html'
    }
  ]
};

fs.writeFileSync(
  path.join(outDir, 'config.json'),
  JSON.stringify(config, null, 2)
);

// Items to copy into static output
const items = [
  'index.html',
  'favicon.svg',
  'assets'
];

for (const item of items) {
  if (fs.existsSync(item)) {
    const dest = path.join(staticDir, item);
    fs.cpSync(item, dest, { recursive: true });
    console.log(`Copied ${item} -> ${dest}`);
  }
}

console.log('Backrelay build successfully generated for Vercel Output API v3!');
