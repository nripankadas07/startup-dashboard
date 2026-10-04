'use strict';
// Implements only the directory glob API used by this pinned Next lint plugin.
const {globSync: tinyGlobSync} = module.require('tinyglobby');
exports.globSync = (patterns, options) => {
  if (!options || options.onlyDirectories !== true || Object.keys(options).some(key => key !== 'onlyDirectories')) {
    throw new TypeError('next-root-glob supports only globSync(patterns, {onlyDirectories:true})');
  }
  return tinyGlobSync(patterns, {onlyDirectories:true, expandDirectories:false}).map(value => value.replace(/\/$/, ''));
};
