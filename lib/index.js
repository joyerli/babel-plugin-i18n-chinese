/* eslint-disable no-control-regex */
const anymatch = require('anymatch');
const _ = require('lodash');
const { addDefault } = require('@babel/helper-module-imports');
const nu = require('./utils');
const store = require('./store');

function isExcludeFile(state) {
  const {
    filename: filePath,
    opts: {
      exclude,
    } = {},
  } = state;
  if (exclude) {
    return anymatch(exclude, nu.posixPath(filePath));
  }
  return false;
}

function notHasChinese(str) {
  return str.search(/[^\x00-\xff]/) === -1;
}

const HANDLED_MARK = '___-@upman.babel-plugin-i18n-chinese-___';

function isHandled(node) {
  const comments = node.leadingComments || [];
  return comments.find((comment) => (comment.value || '').includes(HANDLED_MARK));
}

function markHandled(_node) {
  if (isHandled(_node)) {
    return;
  }
  const node = _node;
  node.leadingComments = node.leadingComments || [];
  node.leadingComments.push({
    type: 'CommentBlock',
    value: `*${HANDLED_MARK}*`,
  });
}

module.exports = (babel) => {
  const { types: t } = babel;
  const records = new Map();
  let manualI18NImport = '';
  let autoI18NImport = '';

  function genAutoImportI18N(path, state) {
    if (autoI18NImport) {
      return;
    }
    if (manualI18NImport) {
      autoI18NImport = manualI18NImport;
      return;
    }
    const {
      opts: {
        i18nFunctionModuleId,
      } = {},
    } = state;
    const node = addDefault(path, i18nFunctionModuleId, { nameHint: 'intl' });
    autoI18NImport = node.name;
  }

  function isValidOpts(state) {
    if (isExcludeFile(state)) {
      return false;
    }
    const {
      opts: {
        i18nFunctionModuleId,
        isManualI18NImport,
        isI18nFunction,
        getManualI18NInfo,
        generateI18NFunction,
      } = {},
    } = state;
    return i18nFunctionModuleId && isManualI18NImport && isI18nFunction
      && getManualI18NInfo && generateI18NFunction;
  }

  return {
    visitor: {
      Program: {
        enter(_1, state) {
          if (!isValidOpts(state)) {
            return;
          }
          manualI18NImport = '';
          autoI18NImport = '';
          records.clear();
        },
        exit(path, state) {
          if (!isValidOpts(state)) {
            return;
          }
          const { filename: filePath } = state;
          const _records = Array.from(records);
          if (_records.length) {
            store.set(filePath, _records);
          }
          records.clear();
        },
      },
      ImportDeclaration(path, state) {
        const {
          opts: {
            isManualI18NImport,
          } = {},
        } = state;
        if (!isValidOpts(state)) {
          return;
        }
        if (!isManualI18NImport(path)) {
          return;
        }

        path.traverse({
          ImportDefaultSpecifier(subPath) {
            manualI18NImport = _.get(subPath, 'node.local.name');
          },
        });
      },
      CallExpression(path, state) {
        if (!isValidOpts(state)) {
          return;
        }
        const {
          opts: {
            isI18nFunction,
            getManualI18NInfo,
          } = {},
        } = state;

        if (!isI18nFunction(path, { manualI18NImport, autoI18NImport })) {
          return;
        }

        path.traverse({
          StringLiteral(subPath) {
            markHandled(subPath.node);
          },
          TemplateLiteral(subPath) {
            markHandled(subPath.node);
          },
        });

        if (!getManualI18NInfo) {
          return;
        }

        const record = getManualI18NInfo(path, { manualI18NImport });
        if (!record) {
          return;
        }
        const [code] = record;
        let [, defaultValue] = record;
        if (!defaultValue) {
          defaultValue = code;
        }
        if (!code) {
          return;
        }
        records.set(code, defaultValue);
      },
      StringLiteral(path, state) {
        if (!isValidOpts(state)) {
          return;
        }
        const {
          opts: {
            generateI18NFunction,
          } = {},
        } = state;
        const { node } = path;

        if (isHandled(node)) {
          return;
        }
        const text = node.value;
        if (notHasChinese(text)) {
          return;
        }
        markHandled(node);

        genAutoImportI18N(path, state);
        const [codeText, fnNode] = generateI18NFunction({
          path, node, text, autoI18NImport, state,
        });
        records.set(codeText, text);
        path.replaceWith(fnNode);

        path.traverse({
          StringLiteral(subPath) {
            markHandled(subPath.node);
          },
          TemplateLiteral(subPath) {
            markHandled(subPath.node);
          },
        });
      },
      TemplateLiteral: {
        enter(_path, state) {
          const path = _path;
          if (!isValidOpts(state)) {
            return;
          }

          const {
            opts: {
              generateI18NFunction,
            } = {},
          } = state;
          const { node } = path;
          if (isHandled(node)) {
            return;
          }
          markHandled(node);

          if (_.isEmpty(node.quasis)) {
            return;
          }
          const newQuasiNodes = [];
          const quasiNodes = node.quasis || [];
          const expressionNodes = node.expressions || [];
          const newExpressionNodes = [...expressionNodes];
          let offset = 0;
          quasiNodes.forEach((quasiNode, index) => {
            if (!t.isTemplateElement(quasiNode)) {
              newQuasiNodes.push(quasiNode);
              return;
            }
            const text = String(_.get(quasiNode, 'value.raw'));
            if (notHasChinese(text)) {
              newQuasiNodes.push(quasiNode);
              return;
            }
            const textNode = t.stringLiteral(text);
            textNode.extra = {
              rawValue: text,
              raw: `'${text.split("'").join('\\\'').split('\n').join('\\\n')}'`,
            };
            let codeText;
            genAutoImportI18N(path, state);
            if (expressionNodes[index]) {
              const [fnCodeText, fnNode] = generateI18NFunction({
                path, node: textNode, text, autoI18NImport, state,
              });
              codeText = fnCodeText;
              newExpressionNodes.splice(index + offset, 0, fnNode);
            } else {
              const [fnCodeText, fnNode] = generateI18NFunction({
                path, node: textNode, text, autoI18NImport, state,
              });
              codeText = fnCodeText;
              newExpressionNodes.push(fnNode);
            }
            records.set(codeText, text);
            offset += 1;
            newQuasiNodes.push(t.templateElement({
              raw: '', cooked: '',
            }));
            newQuasiNodes.push(t.templateElement({
              raw: '', cooked: '',
            }));
          });

          path.replaceWith(t.templateLiteral(newQuasiNodes, newExpressionNodes));

          path.traverse({
            StringLiteral(subPath) {
              markHandled(subPath.node);
            },
            TemplateLiteral(subPath) {
              markHandled(subPath.node);
            },
          });
        },
      },
    },
  };
};
