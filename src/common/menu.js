import { isUrl } from '../utils/utils';

const menuData = [
  {
    name: '首页',
    icon: 'home',
    path: 'home',
    children: [
    ],
  },
  {
    name: '我要交付',
    icon: 'upload',
    path: 'delivers',
    children: [
    ],
  },
  {
    name: '我要接收',
    icon: 'download',
    path: 'receives',
    children: [
    ],
  },
  {
    name: '区块链版权',
    icon: 'link',
    path: 'blockchains',
    children: [
    ],
  },
  {
    name: '账号中心',
    icon: 'user',
    path: 'account',
    children: [
    ],
  }
];

function formatter(data, parentPath = '/', parentAuthority) {
  return data.map(item => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: "admin",
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

export const getMenuData = () => formatter(menuData);
