// This script will download the necessary icons for the admin dashboard
import fs from 'fs';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the icons to download
const icons = [
  {
    name: 'completed.png',
    url: 'https://img.icons8.com/material-rounded/96/ffffff/checkmark--v1.png'
  },
  {
    name: 'pending.png',
    url: 'https://img.icons8.com/material-rounded/96/ffffff/time-machine.png'
  },
  {
    name: 'scheduled.png',
    url: 'https://img.icons8.com/material-rounded/96/ffffff/calendar.png'
  },
  {
    name: 'not-scheduled.png',
    url: 'https://img.icons8.com/material-rounded/96/ffffff/calendar-delete.png'
  },
  {
    name: 'today.png',
    url: 'https://img.icons8.com/material-rounded/96/ffffff/today.png'
  }
];

// Function to download an image
const downloadImage = (url, filename) => {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
        return;
      }

      const fileStream = fs.createWriteStream(filename);
      response.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`Downloaded ${filename}`);
        resolve();
      });

      fileStream.on('error', (err) => {
        fs.unlink(filename, () => {}); // Delete the file if there's an error
        reject(err);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
};

// Download all icons
const downloadAllIcons = async () => {
  try {
    // Use the current directory to save icons
    const publicDir = path.resolve('public');

    // Create public directory if it doesn't exist
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir);
    }

    // Download each icon
    for (const icon of icons) {
      const filePath = path.join(publicDir, icon.name);
      await downloadImage(icon.url, filePath);
    }

    console.log('All icons downloaded successfully!');
  } catch (error) {
    console.error('Error downloading icons:', error);
  }
};

downloadAllIcons();
