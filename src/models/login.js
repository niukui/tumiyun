import {routerRedux} from 'dva/router';
import {setAuthority} from '../utils/authority';
import {reloadAuthorized} from '../utils/Authorized';
import {getVerification, login} from '../services/apitumi';
import {message} from 'antd';

export default {
  namespace : 'login',

  state : {
    status: undefined,
    corpName: "",
    name: "",
    phoneNumber: "",
    userId: "",
    hasPassword: ""
  },

  effects : {
    *getCaptcha({
      payload
    }, {call, put}) {
      const response = yield call(getVerification, payload);
      yield put({type: 'changeLoginStatus', payload: response});
    },
    *login({
      payload
    }, {call, put}) {
      const response = yield call(login, payload);
      yield put({type: 'changeLoginStatus', payload: response});
      // Login successfully
      if (response.code === '0') {
        reloadAuthorized();
        yield put(routerRedux.push('/home'));
      }
    }
  },

  reducers : {
    changeLoginStatus(state, {payload}) {
      if (payload.code === "0") {
        setAuthority(payload.content);
      } else if (payload.code === "1") {
        message.error(payload.msg);
      } else {
        setAuthority({});
        goToManage();
      }
      return {
        ...state,
        status: payload.status,
        corpName: payload.content && payload.content.corpName,
        name: payload.content && payload.content.name,
        phoneNumber: payload.content && payload.content.phoneNumber,
        userId: payload.content && payload.content.userId,
        hasPassword: payload.content && payload.content.hasPassword
      };
    }
  }
};
