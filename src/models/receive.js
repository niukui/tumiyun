import { queryReceive, getReceive } from '../services/apitumi';

export default {
  namespace: 'receive',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    task:{},
    fileList:[]
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryReceive, payload);
      yield put({
        type: 'list',
        payload: response,
      });
    },
    *page({ payload }, { call, put }) {
      yield put({
        type: 'pagination',
        payload: payload,
      });
    },
    *get({ payload }, { call, put }) {
      const response = yield call(getReceive, payload);
      yield put({
        type: 'getReceive',
        payload: response
      });
    }
  },

  reducers: {
    list(state, action) {
      const list = (action.payload && action.payload.content && action.payload.content.deliveryList) || [];
      const data = {
        list, pagination: {
          total: list && list.length,
          pageSize: 10,
          current: 1,
        }
      };
      return {
        ...state,
        data,
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
    initDetailsForm(state, action) {
      return {
        ...state,
        getOk: false,
        message: ''
      };
    },
    getReceive(state, action) {
      
      const task = action.payload && action.payload.content && action.payload.content.task || {};
      const fileList = action.payload && action.payload.content && action.payload.content.fileList || [];
      
      return {
        ...state,
        getOk: (action.payload && action.payload.code && action.payload.code === "0") || false,
        message: (action.payload && action.payload.msg) || "",
        task,
        fileList
      };
    },
  },
};
