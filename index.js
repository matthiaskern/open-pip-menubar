require('async-to-gen/register');

const path = require('path');
const {app, clipboard, shell, Menu, Tray} = require('electron');

const open = require('open-pip');
const ytdl = require('ytdl-core');

const YOUTUBE_HOST = new RegExp('youtube.com/watch');

const iconPath = path.join(__dirname, 'assets/iconTemplate.png');

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
    label: 'Quit',
    type: 'normal',
    role: 'quit'
  }
]);

const filterVideo = ({resolution, audioEncoding}) => resolution && audioEncoding;

const filterMP4 = ({container}) => container === 'mp4';

const getResolution = ({resolution}) => Number(resolution.slice(0, -1));

const sortByResolution = (a, b) => getResolution(a) < getResolution(b);

app.on('ready', () => {
  app.dock.hide();

  const tray = new Tray(iconPath);

  tray.setToolTip('Open PiP');

  const blink = () => {
    setTimeout(() => tray.setHighlightMode('always'), 500);
    setTimeout(() => tray.setHighlightMode('selection'), 1000);
  };

  const openPIP = path => open(path).catch(blink);

  const openYouTube = url => {
    if (YOUTUBE_HOST.test(url)) {
      console.log('found youtube');
      ytdl.getInfo(url, {}, (err, info) => {
        if (err) {
          openPIP(url);
        } else {
          const MP4s = info.formats
            .filter(filterVideo)
            .filter(filterMP4);

          const sortedMP4s = MP4s.sort(sortByResolution);
          openPIP(sortedMP4s[0].url);
        }
      });
    } else {
      openPIP(url);
    }
  };

  tray.on('click', () => openYouTube(clipboard.readText()));
  tray.on('right-click', () => tray.popUpContextMenu(contextMenu));
  tray.on('drop-files', (event, files) => files.map(openPIP));
  tray.on('drop-text', (event, url) => openYouTube(url));
});
