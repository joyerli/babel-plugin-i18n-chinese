const pathLib = require('path');
const fs = require('fs');

const utils = {};

utils.posixPath = (path) => {
  if (!path) {
    return null;
  }
  return path.replace(/\\/ig, '/');
};

utils.WORKSPACE = Symbol('workspace');

utils.resolve = (path) => {
  const workspace = process[utils.WORKSPACE] ? utils.nativePath(process[utils.WORKSPACE])
    : utils.projectPath(process.cwd());
  if (workspace) {
    return pathLib.join(workspace, ...path.split('/'));
  }
  return null;
};

utils.nativePath = (path) => {
  if (!path) {
    return null;
  }
  if (pathLib.seq === '/') {
    return exports.posixPath(path);
  }
  return exports.win32Path(path);
};

let projectPath;

utils.projectPath = (path) => {
  if (projectPath !== undefined) {
    return projectPath;
  }
  const dirPath = pathLib.dirname(path);
  if (dirPath === path) {
    projectPath = null;
    return projectPath;
  }
  projectPath = fs.existsSync(pathLib.join(path, 'package.json')) ? path : utils.projectPath(dirPath);
  return projectPath;
};

module.exports = utils;
