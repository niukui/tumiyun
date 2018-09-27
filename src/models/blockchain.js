import {copyrightList, copyrightFile,copyrightCount} from '../services/apitumi';

export default {
  namespace : 'blockchain',

  state : {
    data: {
      list: [],
      pagination: {}
    },
    uploadFinish: false,
    task: {},
    fileList: [],
    count:""
  },

  effects : {
    *fetchList({
      payload
    }, {call, put}) {
      const response = yield call(copyrightList);
      yield put({type: 'saveList', payload: response});
      const responseCount = yield call(copyrightCount);
      yield put({type: 'getCount', payload: responseCount});
    },
    *page({ payload }, { call, put }) {
      yield put({
        type: 'pagination',
        payload: payload,
      });
    },
    *fetchFile({
      payload
    }, {call, put}) {
      const response = yield call(copyrightFile,payload);
      yield put({type: 'getFile', payload: response});
    }
  },

  reducers : {
    saveList(state, action) {
      const list = (action.payload && action.payload.content && action.payload.content.copyrightList) || [];
      const data = {
        list,
        pagination: {
          total: list && list.length,
          pageSize: 10,
          current: 1
        }
      };
      return {
        ...state,
        data
      };
    },
    pagination(state, action) {
      let data = { ...state.data };
      data.pagination = action.payload;
      return {
        ...state,
        data: {
          list: [...data.list],
          pagination: { ...action.payload }
        }
      };
    },
    getFile(state, action) {
      const list = action.payload && action.payload.content && action.payload.content.copyrightList || [];
      const data = {
        list,
        pagination: {
          total: list && list.length,
          pageSize: 10,
          current: 1
        }
      };
      return {
        ...state,
        getOk: (action.payload && action.payload.code && action.payload.code === "0") || false,
        message: (action.payload && action.payload.msg) || "",
        data
      };
    },
    getCount(state, action) {
      const count = action.payload && action.payload.content && action.payload.content.copyrightFileCount || {};
      return {
        ...state,
        getOk: (action.payload && action.payload.code && action.payload.code === "0") || false,
        message: (action.payload && action.payload.msg) || "",
        count
      };
    }
  }
};
