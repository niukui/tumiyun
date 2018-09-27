import { getMainPage } from '../services/apitumi';

export default {
  namespace: 'home',

  state: {
    mainpage: {
      acceptQuickStart: [],
      copyRightsViews: [],
      dashBoard: [],
      deliveryQuickStart: []
    }
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(getMainPage, payload);
      yield put({
        type: 'mainpage',
        payload: response,
      });
    }
  },

  reducers: {
    mainpage(state, action) {
      const mainpage = {
        ...(action.payload.content)
      };
      return {
        ...state,
        mainpage,
        getOk: (action.payload && action.payload.code && action.payload.code === "0") || false,
        message: (action.payload && action.payload.msg) || "",
      };
    }
  },
};
