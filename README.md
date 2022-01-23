[TOC]

# 将js代码中中文转成多语言函数

编译js代码中，如果发现中文，将其编译成一个指定的国际化多语言函数。

添加依赖:
```
npm i -D babel-plugin-i18n-chinese

// 或者使用yarn

yarn add -D babel-plugin-i18n-chinese
```

再babel中参考配置如下：
```js
{
  plugins: [
    [plugin, {
      'i18n-chinese': {
        // 选项列表
      },
    }]
  ]
}
```

可以使用一个内建的默认参数生成函数：
```
const intlConfig = require('babel-plugin-i18n-chinese/lib/intlDefaultConfig');

{
  plugins: [
    ['i18n-chinese', intlConfig('a[[', {
      enableMd5Code: true,
    })]
  ]
}
```

他能将下面的代码：
```
const chineseText = '中国人不骗中国人';
```

转换为：
```
import intl from 'react-intl-universal';
intl.get('app.dsw2123s', '中国人不骗中国人').d('中国人不骗中国人');
```

> 默认使用`react-intl-universal`国际化框架，其他框架需要自己定制选项。

## 选项

### i18nFunctionModuleId

`string`, i18n国际化语言函数的导出模块， 如`react-intl-universal`。

### isManualI18NImport

`(path: babel.Path) => boolean`，判断是否是手动导入国际化框架的语句。如：
```js
isManualI18NImport(path) {
  const { node } = path;
  const moduleId = _.get(node, 'source.value');
  return moduleId === 'react-intl-universal';
},
```

### exclude

需要忽略的文件夹，支持[anymatch](https://www.npmjs.com/package/anymatch)语法。

### isI18nFunction

`(path: babel.Path, options: { manualI18NImport: string, autoI18NImport: string }) => boolean`, 判断是否是一个手动编写的多语言函数。`manualI18NImport`为手动导入的国际化多语言框架的导入名，`autoI18NImport`为自动导入国际化多语言框架的导入名。

如：
```js
isI18nFunction(path, { manualI18NImport, autoI18NImport }) {
  if (!manualI18NImport) {
    return false;
  }
  const { node } = path;
  const { callee } = node;
  if (!callee) {
    return false;
  }
  if (!t.isMemberExpression(callee)) {
    return false;
  }
  if (!callee.property) {
    return false;
  }
  if (!t.isIdentifier(callee.property)) {
    return false;
  }

  // 判断是否是正常使用函数
  if (callee.property.name !== 'd') {
    return false;
  }
  if (!callee.object) {
    return false;
  }
  if (!t.isCallExpression(callee.object)) {
    return false;
  }
  if (!callee.object.callee) {
    return false;
  }
  if (!t.isMemberExpression(callee.object.callee)) {
    return false;
  }
  const {
    object: calleeObject,
    property: calleeProperty,
  } = callee.object.callee;
  if (!calleeObject || !calleeProperty) {
    return false;
  }
  if (!t.isIdentifier(calleeObject)) {
    return false;
  }
  if (!t.isIdentifier(calleeProperty)) {
    return false;
  }
  let isOkCalleeObjectName = false;
  if (autoI18NImport && calleeObject.name === autoI18NImport) {
    isOkCalleeObjectName = true;
  }
  if (!isOkCalleeObjectName) {
    isOkCalleeObjectName = calleeObject.name === manualI18NImport;
  }
  if (!isOkCalleeObjectName) {
    return false;
  }
  if (calleeProperty.name !== 'get') {
    return false;
  }
  return true;
},
```

### getManualI18NInfo

`(path: babel.Path) => [string, string] | undefined`, 获取手动编写的国际化多语言函数的信息，用于统一收集多语言数据。需要返回一个编码和文本的数组。

如：
```js
getManualI18NInfo(path) {
  const { node } = path;
  const defaultValueNode = _.get(node, 'arguments[0]');
  let defaultValue;
  if (t.isStringLiteral(defaultValueNode)) {
    defaultValue = defaultValueNode.value;
  }
  if (t.isTemplateLiteral(defaultValueNode)) {
    defaultValue = _.get(defaultValueNode, 'quasis[0].value.raw');
  }
  const codeNode = _.get(node, 'callee.object.arguments[0]');
  if (t.isStringLiteral(codeNode)) {
    return [codeNode.value, defaultValue];
  }
  if (t.isTemplateLiteral(codeNode)) {
    const codeValue = _.get(codeNode, 'quasis[0].value.raw');
    if (codeValue) {
      return [codeValue, defaultValue];
    }
  }

  return undefined;
},
```

### generateI18NFunction

`(options: { path: babel.Path, node: babel.Node, text: string, autoI18NImport: string, state: babel.State }) => [string, babel.Node]`, 生成一个国际化多语言函数的调用节点。关于参数：
* `path`: 当前中文文本ast节点`Path`对象；
* `node`: 当前中文文本ast节点`Node`对象；
* `text`: 当前中文文本ast节点的文本值；
* `autoI18NImport`: 当前自动默认导入的国际化多语言框架的导入赋值变量；
* `state`: 当前中文文本ast节点`State`对象；

需要返回一个编码的文本值和国际化多语言函数的调用语句节点对象。

如：
```js
generateI18NFunction({
  path, node, text, autoI18NImport,
  state,
}) {
  const intlMember = t.memberExpression(
    t.identifier(autoI18NImport),
    t.identifier('get'),
    false, false,
  );
  const { filename } = state;
  const md5Text = enableMd5Code ? `o${md5(text)}`.slice(0, 7) : text;
  const codeText = `${
    (
      filename.includes('node_modules')
    ) ? 'comp' : appCode}.${md5Text}`;
  const codeTextNode = t.stringLiteral(codeText);
  codeTextNode.extra = {
    rawValue: codeText,
    raw: `'${codeText.split("'").join('\\\'').split('\n').join('\\\n')}'`,
  };
  const intlCall = t.callExpression(intlMember, [codeTextNode]);
  const memberExpression = t.memberExpression(intlCall, t.identifier('d'), false, false);

  const fnNode = t.callExpression(memberExpression, [node]);
  const parentNode = _.get(path, 'parentPath.node');
  if (t.isJSXAttribute(parentNode)) {
    return [codeText, t.jsxExpressionContainer(fnNode)];
  }

  return [codeText, fnNode];
},
```


