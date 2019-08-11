const fs = require('fs');
const { execSync } = require('child_process');
const sh = cmd => execSync(cmd);
const out = cmd => execSync(cmd).toString().split('\n');
const l = (...args) => console.log(...args);
const getImageName = path => path.substr(path.lastIndexOf('/')).substr(1).split('.png')[0].replace(/\./g, ':').replace('T', ' ');
const getImagePathsForDay = day => out(`find screenshots/ -name '${day}*.png'`);
const getImageSignature = path => out(`magick identify -verbose '${path}' | grep signature`)[0].trim().split(' ')[1];
const removeImagesForDay = day => sh(`rm screenshots/*/${day}*.png`);

const sigsFilePath = './sigs.json';
const SIG_UNKNOWN = 'UNKNOWN';
const getSigs = () => {
  const sigs = {};
  if (fs.existsSync(sigsFilePath)) {
    Object.assign(sigs, JSON.parse(fs.readFileSync(sigsFilePath).toString()));
  }
  return sigs;
};
const writeSigs = sigs => fs.writeFileSync(sigsFilePath, JSON.stringify(sigs, null, 2));

module.exports = {
  sh, out, l,
  getImageName, getImagePathsForDay, getImageSignature, removeImagesForDay,
  getSigs, writeSigs, SIG_UNKNOWN
};

