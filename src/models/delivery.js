import { queryDelivery, submitDelivery, getDelivery } from '../services/apitumi';

export default {
  namespace: 'delivery',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    uploadFinish: false,
    task: {},
    fileList: []
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryDelivery, payload);
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
    *save({ payload }, { call, put }) {
      yield put({
        type: 'initCreateForm',
      });
      const response = yield call(submitDelivery, payload);
      yield put({
        type: 'submit',
        payload: response,
      });
    },
    *initCreate({ payload }, { call, put }) {
      yield put({
        type: 'initCreateForm',
      });
    },
    *initDetails({ payload }, { call, put }) {
      yield put({
        type: 'initDetailsForm',
      });
    },
    *get({ payload }, { call, put }) {
      const response = yield call(getDelivery, payload);
      yield put({
        type: 'getDelivery',
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
    submit(state, action) {
      return {
        ...state,
        uploadFinish: (action.payload && action.payload.content && action.payload.content.taskId) || true,
        uploadOk: (action.payload && action.payload.code && action.payload.code === "0") || false,
        message: (action.payload && action.payload.msg) || "",
      };
    },
    initCreateForm(state, action) {
      return {
        ...state,
        uploadFinish: false,
        uploadOk: false,
        message: ''
      };
    },
    initDetailsForm(state, action) {
      return {
        ...state,
        getOk: false,
        message: ''
      };
    },
    getDelivery(state, action) {

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
    acceptorName(state, action) {
      return {
        ...state,
        acceptorName: action.payload
      };
    },
  },
};
