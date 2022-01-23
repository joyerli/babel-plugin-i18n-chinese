/* eslint-disable */

export default {
  name: 'MainFinancePage',
  componentName: 'MainFinancePage',
  title1: intl.get(`base.test.code1`).d('我要融资1'),
  data() {
    return {
      isCancel: false,
      dataProps2: intl.get('base.test.code2').d('我要融资2'),
    };
  },
};

const i18n1 = intl.get('base.test.code3').d(`你好我好1`);
const i18n2 = intl.get('base.test.code4').d(`你好${name}我好2`);
const i18n3 = intl.get('base.test.code5').d(`你好${getWindow('才是真的好')}我好3`);
const i18n4 = intl.get('base.test.code6').d(getName(`你好${getWindow('才是真的好')}我好4`));


const i18n5Code = 'code5';
const i18n5 = intl.get(`base.test.${i18n5Code}`).d(`你好我好5`);
const i18n6 = intl.get("base.test.code7").d(`你好我好6`);
const i18n7 = intl.get('base.test' + 'code9').d(`你好我好7`);
const i18n8 = intl.get('base.test' + 'code' + 10).d(`你好我好8`);


const i18n9 = intl.get("base.test.code11").d('你好我好9');
const i18n10 = intl.get('base.test.code12').d("你好我好10");

const notDefault = intl.get('base.test.code13');

const i18n12 = intl.get('base.test.code14').d('你好我好11');
const i18n13 = intl.set('base.test.code15').d('你好我好12');
const i18n14 = intl.get('base.test.code16').t('你好我好13');
const i18n11 = _t.get('base._t.code').d('你好我好15');

const i18n17 = intl.get(`base.test.code17`).d("你好我好14");
const i18n15 = intl.get('我是编码').d('你好我好16');
const i18n16 = _t.get('我是编码2').d('你好我好17');
