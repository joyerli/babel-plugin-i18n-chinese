// eslint-disable-next-line import/no-extraneous-dependencies
const babel = require('@babel/core');
const fs = require('fs');
const pathLib = require('path');
const nu = require('../utils');
const plugin = require('../index');
const store = require('../store');
const intlConfig = require('../intlDefaultConfig');

function unit({
  fileName,
  preset = false,
  enableMd5Code = false,
}) {
  const codePath = pathLib.join(__dirname, '__source__', `${fileName}.js`);
  const codeTsxPath = pathLib.join(__dirname, '__source__', `${fileName}.tsx`);
  const codeTsPath = pathLib.join(__dirname, '__source__', `${fileName}.ts`);

  let sourceCode;
  let fileNameWithType;

  if (fs.existsSync(codePath)) {
    sourceCode = fs.readFileSync(codePath, { encoding: 'utf8' });
    fileNameWithType = `${fileName}.js`;
  } else if (fs.existsSync(codeTsxPath)) {
    sourceCode = fs.readFileSync(codeTsxPath, { encoding: 'utf8' });
    fileNameWithType = `${fileName}.tsx`;
  } else {
    sourceCode = fs.readFileSync(codeTsPath, { encoding: 'utf8' });
    fileNameWithType = `${fileName}.ts`;
  }
  let { code } = babel.transformSync(sourceCode, {
    filename: `/path/to/${fileNameWithType}`,
    sourceType: 'module',
    presets: preset ? [
      ['babel-preset-react-app'],
    ] : undefined,
    plugins: [
      [plugin, intlConfig('app', {
        enableMd5Code: true,
      })],
    ],
    babelrc: false,
    configFile: false,
    generatorOpts: {
      jsescOption: {
        minimal: true,
      },
    },
  });
  const paths = nu.resolve('').split(':');
  let pathPrefix = '';
  if (paths.length === 2) {
    pathPrefix = `${paths[0]}:`;
  }
  code = code.replace(/".*?babel-plugin-i18n-chinese/g, '"babel-plugin-i18n-chinese');
  code = code.replace(/\\\\/g, '/');
  // console.log('code', code);
  // console.log('store', store.get(`${pathPrefix}/path/to/${fileName}.js`)
  //  || store.get(`${pathPrefix}/path/to/${fileName}.ts`)
  //  || store.get(`${pathPrefix}/path/to/${fileName}.tsx`));
  expect(code).toMatchSnapshot();
  expect(store.get(`${pathPrefix}/path/to/${fileName}.js`)
    || store.get(`${pathPrefix}/path/to/${fileName}.ts`)
    || store.get(`${pathPrefix}/path/to/${fileName}.tsx`)).toMatchSnapshot();
}

describe('i8n', () => {
  it('字符串', () => {
    unit({ fileName: 'str' });
  });
  it('模板字符串', () => {
    unit({ fileName: 'template', preset: true });
  });
  it('手动多语言函数', () => {
    unit({ fileName: 'manual' });
  });
  it('没有导入工具的手动多语言函数不当作多语言函数', () => {
    unit({ fileName: 'manualWithoutImport' });
  });
  it('在tsx文件中的字符串', () => {
    unit({ fileName: 'str', preset: true });
  });
  it('类组件', () => {
    unit({ fileName: 'classComponent', preset: true });
  });
  it('类组件有手动', () => {
    unit({ fileName: 'classComponentWithManual', preset: true });
  });
  it('函数组件', () => {
    unit({ fileName: 'functionComponent', preset: true });
  });
  it('空值', () => {
    unit({ fileName: 'empty' });
  });
  it('md5转码', () => {
    unit({ fileName: 'str', enableMd5Code: true });
  });
});
