const { menubar } = require('menubar');

const mb = menubar({
  index: `file://${__dirname}/index.html`,
  icon: './icon.png', // replace with path to your icon
  browserWindow: {
    width: 800,
    height: 600,
  }
});

mb.on('ready', () => {
  console.log('Menubar app is ready.');
});
