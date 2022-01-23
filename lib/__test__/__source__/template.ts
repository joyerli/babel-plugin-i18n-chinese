/* eslint-disable */
// @ts-ignore
// @ts-nocheck

interface User {
  address?: {
    detail?: string,
  },
}

const user = {
  address: {
    detail: '',
  }
};

const name = 'joyer';

export default {
  title1: `我要融资`,
  title2: `name`,
  title3: `name我要融资`,
  title4: `我要用字${user?.address?.detail}`,
  components: {
  },
  data() {
    return {
      test1: `我${name}好呀`,
      test2: `${name}你${name}好呀${name}`,
      test3: `你${name}好呀${name}`,
      test4: `joyer你好joyer${name}我好${age}才是joyer真的好`, // error
      test5: `joyer${name}好${age}才是真的好`, // error
      test6: `你${name}and${age}才是真的好`,
      test7: `你${name}他${age}is good`,
      test8: `你好${getWindow('才是真的好')}我好`,
      test9: `本${name}指${name}南${name}将${
        name}帮${name}助${name}你${name}为${
        name}编${name}辑${name}器${name}添${name}加${
        name}语${name}法${name}高${name}亮${name}的${name}功${name}能`,
      test10: `本${name}指${name}南${name}将${
        name}帮${name}助${name}你${name}为${
        name}编${name}辑${name}器${name}添${name}加${
        name}语${name}法${name}高${name}亮${name}的${name}功${name}能${name}`,
      test11: `${name}本${name}指${name}南${name}将${
        name}帮${name}助${name}你${name}为${
        name}编${name}辑${name}器${name}添${name}加${
        name}语${name}法${name}高${name}亮${name}的${name}功${name}能`,
      test12: `joyer${name}joyer${name}本${name}指${name}南${name}将${
        name}帮${name}助${name}你${name}为${
        name}编${name}辑${name}器${name}添${name}加${
        name}语${name}法${name}高${name}亮${name}的${name}功${name}joyer${name}joyer${name}`,
    };
  },
  methods: {
  },
  created() {
    this.test1 = JSON.stringify(`你好呀`);
    this.test2 = JSON.stringify(`我${name}好呀`);
    this.test2 = JSON.stringify(`${"你好"}`);
  },
  content: `相对方名称':${record.partyName}`,
  content2: `
    哈哈哈,
    哈哈哈，
    恩恩恩哼
  `,
  content3: `我是"谁"?`,
};
