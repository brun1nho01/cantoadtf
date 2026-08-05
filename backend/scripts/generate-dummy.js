const sharp = require('sharp');
sharp({ create: { width: 400, height: 400, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
  .png()
  .composite([
    { input: Buffer.from('<svg width="400" height="400"><circle cx="200" cy="200" r="180" fill="black"/><text x="200" y="210" font-size="60" text-anchor="middle" fill="white">ARTE 01</text></svg>'), top: 0, left: 0 }
  ])
  .toFile('assets/arts/art-01.png')
  .then(() => console.log('Dummy art-01.png created!'));
