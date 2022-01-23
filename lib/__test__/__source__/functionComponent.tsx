// @ts-nocheck
/* eslint-disable */

import * as React from 'react';
import intl from 'utils/intl';

const TestPage: React.FC = () => {
  console.log('重新渲染组件');

  return (
    <div style={{ padding: 40 }}>
      表格头部
      <Ou.Table
        columns={[
          {
            title: <span>动态表格列1</span>,
          },
          {
            title: <span
              desc={intl.get('oc.base.code1').d('动态表格描述2')}
              >{intl.get('oc.base.code2').d('动态表格列2')}</span>,
          },
          '表格列3',
          {
            title: '表格列4',
          },
          {

          },
        ]}
      >
        表格内容
      </Ou.Table>
      表格底部
      <button title='按钮标题'>
        按钮
      </button>
      <button title='按钮标题'>
        {'动态' + '内容' + '按钮'}
      </button>
      <button>
        {intl.get('oc.base.code3').d('手动多语言按钮')}
      </button>
      页脚
    </div>
  );
};

TestPage.displayName = 'TestPage';

export default TestPage;
