const sharp = require('sharp');

async function generateOGImage() {
  try {
    // 1. First, resize the logo so it fits nicely inside the canvas
    const logoBuffer = await sharp('assets/images/logo.svg')
      .resize({ width: 600, fit: 'contain' })
      .toBuffer();

    // 2. Create a 1200x630 background and composite the logo onto it
    const info = await sharp({
      create: {
        width: 1200,
        height: 630,
        channels: 4,
        background: { r: 10, g: 10, b: 26, alpha: 1 } // #0a0a1a equivalent
      }
    })
    .composite([
      { input: logoBuffer, gravity: 'center' }
    ])
    .png()
    .toFile('assets/images/og-image.png');
    
    console.log('Successfully created 1200x630 og-image.png!', info);
  } catch (err) {
    console.error('Error creating og-image.png:', err);
  }
}

generateOGImage();
