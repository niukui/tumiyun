import { configPassword,changePassword,personalCertification,companyCertification,getConfigVerification } from '../services/apitumi';
import { getAuthority,setAuthority } from '../utils/authority';
import {reloadAuthorized} from '../utils/Authorized';


export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: {},
    configFinish:false,
    changeFinish:false,
    personalCertification:false,
    msg:""
  },

  effects: {
    *getConfigCaptcha({ payload }, { call, put }) {
      const response = yield call(getConfigVerification,payload);
      yield put({
        type: 'config',
        payload: response,
      });
    },
    *configPassword({ payload }, { call, put }) {
      const response = yield call(configPassword,payload);
      yield put({
        type: 'config',
        payload: response,
      });
    },
    *changePassword({ payload }, { call, put }) {
      const response = yield call(changePassword,payload);
      yield put({
        type: 'change',
        payload: response,
      });
    },
    *personalCertification({ payload }, { call, put }) {
      const response = yield call(personalCertification,payload);
      yield put({
        type: 'personCertification',
        payload: response,
        name:payload.name
      });
    },
    *companyCertification({ payload }, { call, put }) {
      const response = yield call(companyCertification,payload);
      yield put({
        type: 'Certification',
        payload: response,
        corpName:payload.corpName
      });
    },
  },

  reducers: {
    config(state, action) {
      return {
        ...state,
        configFinish:(action.payload && action.payload.code),
        msg:(action.payload && action.payload.msg)
      };
    },
    change(state, action) {
      return {
        ...state,
        changeFinish:(action.payload && action.payload.code),
        msg:(action.payload && action.payload.msg)
      };
    },
    personCertification(state, action) {
      if(action.payload.code==="0"){
        let authority = getAuthority();
        authority.name = action.name;
        setAuthority(authority);
        reloadAuthorized();
      }
      return {
        ...state,
        personalCertification:(action.payload && action.payload.code),
      };
    },
    Certification(state, action) {
      if(action.payload.code==="0"){
        let authority = getAuthority();
        authority.corpName = action.corpName;
        setAuthority(authority);
        reloadAuthorized();
      }
      return {
        ...state,
        Certification:(action.payload && action.payload.code),
      };
    },
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload,
        },
      };
    },
  },
};
