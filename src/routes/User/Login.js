import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Checkbox, Alert, Icon,Carousel  } from 'antd';
import Login from 'components/Login';
import styles from './Login.less';

const { Tab, UserName, Password, Mobile, Captcha, Submit } = Login;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
export default class LoginPage extends Component {
  state = {
    type: 'mobile',
    autoLogin: true,
    mobileNumber:"",
    captcha:"",
    password:"",
    isAuthentication:false
  };
  componentWillReceiveProps(nextProps) { 
        this.setState({isAuthentication:true});
        //message.success('添加成功');
        this.gotoMainPage();   
  }

  gotoMainPage = ()=>{

  }

  onTabChange = type => {
    this.setState({ type });
  };

  handleSubmit = (err, values) => {
    let { type } = this.state;
    let phoneNumber;
    let verifyCode;
    let password;
    if(type == "mobile"){
      type = "1";
      phoneNumber = values.mobile;
      verifyCode = values.captcha;
    }
    if(type == "account"){
      type = "2";
      password = values.password;
      phoneNumber = values.userName;
    }
    if (!err) {
      if(type == "1"){
        this.props.dispatch({
          type: 'login/login',
          payload: {
            phoneNumber,
            type,
            verifyCode        
          },
        });
      }else{
        this.props.dispatch({
          type: 'login/login',
          payload: {
            type,
            password,
            phoneNumber,        
          },
        });
      }
    }
  };

  changeAutoLogin = e => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };

  onGetCaptcha = () =>{
    const { dispatch } = this.props;
    const mobileNumber = this.state.mobileNumber;
    dispatch({
        type: 'login/getCaptcha',
        payload:mobileNumber
    });
  }

  GetPhoneNumber = (e) =>{
    let phone = e.target.value;
    this.setState({mobileNumber:phone})
  }
  GetPassword = (e) =>{
    let password = e.target.value;
    this.setState({password:password})
  }

  renderMessage = content => {
    return <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />;
  };

  render() {
    const { login, submitting } = this.props;
    const { type,mobileNumber,captcha } = this.state;
    return (
      <div className={styles.main}>
        <Login defaultActiveKey={type} onTabChange={this.onTabChange} onSubmit={this.handleSubmit}>
        <Tab key="mobile" tab="手机号登录">
            {login.status === 'error' &&
              login.type === 'mobile' &&
              !submitting &&
              this.renderMessage('验证码错误')}
            <Mobile name="mobile" onChange={this.GetPhoneNumber} />
            <Captcha name="captcha" onGetCaptcha={this.onGetCaptcha}/>
          </Tab>
          <Tab key="account" tab="账户密码登录">
            {login.status === 'error' &&
              login.type === 'account' &&
              !submitting &&
              this.renderMessage('账户或密码错误')}
            <UserName name="userName" placeholder="输入手机号" onChange={this.GetPhoneNumber}/>
            <Password name="password" placeholder="请输入密码" onChange={this.GetPassword}/>
          </Tab>
          <div>
            <Checkbox checked={this.state.autoLogin} onChange={this.changeAutoLogin}>
              自动登录
            </Checkbox>
          </div>
          <Submit loading={submitting}>登录</Submit>
          <div className={styles.other}>
            首次登陆，系统会为您自动创建一个账户
          </div>
        </Login>
      </div>
    );
  }
}
