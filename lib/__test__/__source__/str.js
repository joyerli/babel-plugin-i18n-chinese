/* eslint-disable */

export default {
  name: 'MainFinancePage',
  componentName: 'MainFinancePage',
  title1: '我要融资',
  title2: "我要融资",
  components: {
  },
  data() {
    return {
      isCancel: false,
      age: '',
      name: 'name',
      test1: '我要融资',
      test2: "我要融资",
    };
  },
  methods: {
  },
  created() {
    this.test1 = '我要融资';
    this.test2 = "我要融资";
    this.test1 = JSON.stringify('我要融资');
    this.test2 = JSON.stringify("我要融资");
    this.test2 = JSON.stringify('你好' + '我好');
    this.test2 = JSON.stringify('你好' + name + "我好");
    this.test2 = JSON.stringify("hi我要融资");
  },
};
