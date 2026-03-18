const sharp = require('sharp');
sharp('assets/images/logo.svg')
  .png()
  .toFile('assets/images/logo.png')
  .then(info => console.log('Successfully created logo.png!', info))
  .catch(err => console.error('Error creating logo.png:', err));
