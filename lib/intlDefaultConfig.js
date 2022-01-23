const _ = require('lodash');
const t = require('@babel/types');
const md5 = require('md5');

module.exports = (
  appCode = 'base',
  {
    enableMd5Code = true,
  } = {},
) => ({
  i18nFunctionModuleId: 'react-intl-universal',
  isManualI18NImport(path) {
    const { node } = path;
    const moduleId = _.get(node, 'source.value');
    return moduleId === 'react-intl-universal';
  },
  exclude: [],
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
});
