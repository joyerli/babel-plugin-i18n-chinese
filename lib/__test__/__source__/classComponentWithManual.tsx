// @ts-nocheck

import React from 'react';
import intl from 'utils/intl';

class DetailDrawer extends React.Component {
  unitId = '';

  handleCancel() {
    const str = '方法内文本';
    console.log(str);
    console.log(intl.get('oc.base.code1').d('方法内调用文本'));
  }

  render() {
    const str = '渲染方法内文本';
    console.log(str);
    console.log('渲染方法内文本');

    const tip = '变量文本';

    // @ts-ignore
    return (
      <Drawer
        title="组件属性文本1"
        desc={intl.get('oc.base.code2').d('组件动态属性文本')}
        tip={tip}
      >
        <Form>
          <Row style={{ flex: 'auto' }}>
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
          {intl.get('oc.base.code3').d('组件动态子节点文本')}
        </Button>
      </Drawer>
    );
  }
}
