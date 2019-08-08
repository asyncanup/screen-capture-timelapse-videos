#!/usr/bin/env node

const day = process.argv[2];
if (!day) {
  console.log('Usage: ./createVideoForDay.js 2019-07-31');
  process.exit(0);
}

const fs = require('fs');
const {
  sh, l,
  getImageName, getImagePathsForDay, getImageSignature,
  getSigs, writeSigs, SIG_UNKNOWN
} = require('./utils');

l('Started');

const uniqueBySignature = (imagePathSig, i, imagePathSigsArr) => {
  const foundWithSameSig = imagePathSigsArr.find(ps => imagePathSig[1] === ps[1]);
  return !foundWithSameSig || foundWithSameSig === imagePathSig;
};

const imagePaths = getImagePathsForDay(day);
l(`Found ${imagePaths.length} images for ${day}. Calculating signatures:`);

const sigs = getSigs();
l(`Found ${Object.keys(sigs).length} keys to reuse`);

const imagePathSigs = imagePaths.map((path, pathIndex) => {
  if (sigs[path]) { return [path, sigs[path]]; }
  let sig;
  try {
    sig = getImageSignature(path)
  } catch (e) {
    console.log(`Could not calculate signature for: ${path}`);
    console.error(e);
    sig = SIG_UNKNOWN;
  }
  sigs[path] = sig;
  if (pathIndex % 10 == 0) {
    writeSigs(sigs);
  }
  return [path, sig];
});
writeSigs(sigs);

l(`Started converting day's images to video`);
sh(`rm -rf .vid/ && mkdir .vid`);
imagePathSigs
  .filter(ps => ps[1] !== SIG_UNKNOWN)
  .filter(uniqueBySignature)
  .forEach(([path, sig], i) => {
    sh(`convert '${path}' -resize 1920x1080 image.png`);
    sh(`convert -size 300x80 xc:none -pointsize 30 -gravity north -draw "fill black rectangle 0,0,300,35" ` +
      `-draw "fill white text 0,0 '${getImageName(path)}'" watermark.png`);
    sh(`composite -dissolve 50% -gravity south watermark.png image.png .vid/${String(i).padStart(5, '0')}.png`);
    sh(`rm image.png watermark.png`);
  });

sh(`ffmpeg -y -r 15 -f image2 -i '.vid/%05d.png' -vcodec libx264 -pix_fmt yuv420p -crf 10 ${day}.mp4`);
sh(`rm -rf .vid/`);

l('Done!');

