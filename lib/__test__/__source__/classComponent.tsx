// @ts-nocheck
/* eslint-disable */

import React from 'react';

class DetailDrawer extends React.Component {
  name = '成员属性';

  handleCancel() {
    const str = '方法内文本';
    console.log(str);
    console.log('方法内调用文本');
  }

  render() {
    const str = '渲染方法内文本';
    console.log(str);
    console.log('渲染方法内文本');

    const tip = '变量文本';
    return (
      <Drawer
        title="组件属性文本1"
        desc={'组件动态属性问文本'}
        tip={tip}
        onClick={() => {
          console.log('点击了');
        }}
        visible={tip === '条件内容'}
        >
        <Form>
          <Row style={{ flex: 'auto', context: '占位内容' }}>
            <Col span={24}>
              <Form.Item
                {...fromLayOut}
                label="结算单类型"
              >
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Button>
          组件节点位文本
        </Button>
        <Button>
          {'组件节点动态文本'}
        </Button>
        <Button>
          {`组件节点模板文本`}
        </Button>
      </Drawer>
    );
  }
}
