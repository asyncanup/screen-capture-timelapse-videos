#!/usr/bin/env node

const day = process.argv[2];
if (!day) {
  console.log('Usage: ./cleanup.js 2019-07-31');
  process.exit(0);
}

const {
  l, getImageName, getImagePathsForDay, removeImages,
  getSigs, writeSigs, SIG_UNKNOWN
} = require('./utils');

const sigs = getSigs();
const deletedPaths = [];
Object.keys(sigs).forEach(path => {
  if (getImageName(path).startsWith(day)) {
    delete sigs[path];
    deletedPaths.push(path);
  }
});
writeSigs(sigs);

l(`Deleted ${deletedPaths.length} pre-calculated signatures, ${Object.keys(sigs).length} remaining`);

removeImages(deletedPaths);
l(`Deleted ${deletedPaths.length} screenshots`);

