const Cache = require('sync-disk-cache');
const nu = require('@upman/utils');
const fs = require('fs');
const pathLib = require('path');

const NS = '__upman-i18n-chinese-babel-plugin';

const location = nu.resolve('node_modules/.cache/sync-disk-cache');

const cache = new Cache(NS, {
  location,
});

module.exports = {
  set(path, value) {
    cache.set(nu.posixPath(path), JSON.stringify({
      key: path,
      value,
    }));
  },
  get(path) {
    const val = cache.get(nu.posixPath(path));
    if (!val || !val.value) {
      return null;
    }
    const wrapValue = JSON.parse(val.value);
    if (!wrapValue || !wrapValue.value) {
      return null;
    }
    return wrapValue.value;
  },
  clear() {
    cache.clear();
  },
  getAll() {
    try {
      const { root } = cache;
      const files = fs.readdirSync(root, {
        encoding: 'utf8',
      });
      return files.map((fileName) => {
        const content = fs.readFileSync(pathLib.join(root, fileName), {
          encoding: 'utf8',
        });
        return JSON.parse(content);
      });
    } catch (error) {
      return [];
    }
  },
};
