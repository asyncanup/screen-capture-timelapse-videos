#!/usr/bin/env node

const day = process.argv[2];
if (!day) {
  console.log('Usage: ./cleanup.js 2019-07-31');
  process.exit(0);
}

const {
  l, getImageName, getImagePathsForDay, removeImagesForDay,
  getSigs, writeSigs, SIG_UNKNOWN
} = require('./utils');

const sigs = getSigs();
let deletedSigCount = 0;
Object.keys(sigs).forEach(path => {
  if (getImageName(path).startsWith(day)) {
    delete sigs[path];
    deletedSigCount += 1;
  }
});
writeSigs(sigs);

l(`Deleted ${deletedSigCount} pre-calculated signatures, ${Object.keys(sigs).length} remaining`);

const deletedFileCount = getImagePathsForDay(day).length;
removeImagesForDay(day);
l(`Deleted ${deletedFileCount} screenshots`);

