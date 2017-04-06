const {app, clipboard, shell, Menu, Tray} = require('electron');

const open = require('open-pip');
const ytdl = require('ytdl-core');

const YOUTUBE_HOST = new RegExp('www.youtube');

const iconPath = './icons/iconTemplate.png';

const contextMenu = Menu.buildFromTemplate([
  {
    label: 'Feedback',
    type: 'normal',
    click() {
      shell.openExternal('https://github.com/matthiaskern/open-pip-menubar');
    }
  },
  {
    type: 'separator'
  },
  {
    type: 'normal',
    label: 'Quit',
    role: 'quit'
  }
]);

app.on('ready', () => {
  const tray = new Tray(iconPath);

  tray.setToolTip('Open PiP');

  const blink = () => {
    setTimeout(() => tray.setHighlightMode('always'), 500);
    setTimeout(() => tray.setHighlightMode('selection'), 1000);
  };

  const openPIP = path => open(path).catch(blink);

  tray.on('click', () => {
    const url = clipboard.readText();

    if (YOUTUBE_HOST.test(url)) {
      ytdl.getInfo(url, {}, (err, info) => {
        if (err) {
          openPIP(url);
        } else {
          openPIP(info.formats[0].url);
        }
      });
    } else {
      openPIP(url);
    }
  });

  tray.on('right-click', () => tray.popUpContextMenu(contextMenu));
});
