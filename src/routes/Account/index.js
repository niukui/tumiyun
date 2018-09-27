import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import {
  Card,
  Divider,
  Button,
  Modal,
  Form,
  Input,
  message
} from 'antd';
import DescriptionList from 'components/DescriptionList';
import { WrappedConfigPasswordForm } from 'components/ConfigPassword';
import { WrappedChangePasswordForm } from 'components/ChangePassword';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './index.less';
import {getAuthority, setAuthority} from '../../utils/authority';
import {reloadAuthorized} from '../../utils/Authorized';


const { Description } = DescriptionList;
const FormItem = Form.Item;
const PersonalCertification = Form.create()(props => {
  const { modalVisible, form, handleModalVisible, handlePersonalCertification } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (!err) {
        handlePersonalCertification(fieldsValue);
      }
    });
  };
  return (
    <Modal
      title="个人认证"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => {
        handleModalVisible();
        form.resetFields();
      }}>
      <FormItem label="姓名">
        {form.getFieldDecorator('name', {
          rules: [
            {
              required: true,
              message: '请输入姓名!'
            }, {
              validator: null
            }
          ]
        })(<Input />)}
      </FormItem>
      <FormItem label="身份证号">
        {form.getFieldDecorator('idCardNumber', {
          rules: [
            {
              required: true,
              message: '请确认身份证号!'
            }, {
              validator: null
            }
          ]
        })(<Input />)}
      </FormItem>
    </Modal>
  );
});
const CompanyCertification = Form.create()(props => {
  const { modalVisible, form, handleCompanyModalVisible, handleCompanyCertification } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (!err) {
        handleCompanyCertification(fieldsValue);
      }
    });
  };
  return (
    <Modal
      title="企业认证"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => {
        handleCompanyModalVisible();
        form.resetFields();
      }}>
      <FormItem label="企业名称">
        {form.getFieldDecorator('corpName', {
          rules: [
            {
              required: true,
              message: '请输入企业名称!'
            }, {
              validator: null
            }
          ]
        })(<Input />)}
      </FormItem>
      <FormItem label="统一信用号码">
        {form.getFieldDecorator('creditCode', {
          rules: [
            {
              required: true,
              message: '请输入统一信用名称!'
            }, {
              validator: null
            }
          ]
        })(<Input placeholder="统一信用号码/注册号码/纳税号码" />)}
      </FormItem>
    </Modal>
  );
});
@connect(({ user, login }) => ({ user, login }))
export default class Deliver extends Component {
  state = {
    configVisible: false,
    changeVisible: false,
    personalVisible: false,
    companyVisible: false,
    confirmLoading: false,
    authority: getAuthority() || {},
    hasPassword: false,
    personalCertification: false,
    companyCertification: false
  };

  componentDidMount() { }

  componentWillUnmount() { }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user.configFinish && nextProps.user.configFinish === "0") {
      nextProps.user.configFinish = "";
      this.setState({confirmLoading: false});
      this.setState({hasPassword: true});
      this.setState({configVisible: false});
      message.success('添加成功');
    } else if (nextProps.user.configFinish && nextProps.user.configFinish === "1") {
      nextProps.user.configFinish = "";
      message.error("设置失败");
      this.setState({confirmLoading: false});
    }

    if (nextProps.user.changeFinish && nextProps.user.changeFinish === "0") {
      nextProps.user.changeFinish = "";
      this.setState({confirmLoading: false});
      this.setState({changeVisible: false});
      message.success('修改成功');
    } else if (nextProps.user.changeFinish && nextProps.user.changeFinish === "1") {
      nextProps.user.changeFinish = "";
      message.error(nextProps.user.msg);
      this.setState({confirmLoading: false});
    }

    if (nextProps.user.personalCertification && nextProps.user.personalCertification === "0") {
      nextProps.user.personalCertification = "";
      message.success('认证成功');
      this.setState({personalVisible: false,authority:getAuthority()});      

    } else if (nextProps.user.personalCertification && nextProps.user.personalCertification === "1") {
      message.error("认证失败，请保证输入的信息正确");
    }

    if (nextProps.user.Certification && nextProps.user.Certification === "0") {
      nextProps.user.Certification = "";
      message.success('认证成功');
      this.setState({companyVisible: false,authority:getAuthority()});      
    } else if (nextProps.user.Certification && nextProps.user.Certification === "1") {
      message.error("认证失败，请保证输入的信息正确");
    }
  }
  onGetCaptcha = () => {
    const { dispatch } = this.props;
    const mobileNumber = this
      .wrappedConfigPasswordForm
      .props
      .form
      .getFieldsValue()
      .phone;
    dispatch({type: 'user/getConfigCaptcha', payload: mobileNumber});
  }
  onRef = (ref) => {
    this.wrappedConfigPasswordForm = ref;
  }
  onRefOfChange = (ref) => {
    this.wrappedChangePasswordForm = ref;
  }
  configPassword = () => {
    this.setState({ configVisible: true })
  }
  handleConfigPassword = (e) => {
    this
      .wrappedConfigPasswordForm
      .props
      .form
      .validateFieldsAndScroll((err, values) => {
        if (!err) {
          this.setState({confirmLoading: true});
          let phoneNumber = values.phone;
          let smsVerifyCode = values.captcha;
          let password = values.password;
          const {dispatch} = this.props;
          dispatch({
            type: 'user/configPassword',
            payload: {
              phoneNumber,
              smsVerifyCode,
              password
            }
          });
        }
      })

  }
  changePassword = () => {
    this.setState({ changeVisible: true })
  }
  handleChangePassword = (e) => {
    this
      .wrappedChangePasswordForm
      .props
      .form
      .validateFieldsAndScroll((err, values) => {
        if (!err) {
          this.setState({ confirmLoading: true });
          let oldPassword = values.oldPassword;
          let newPassword = values.newPassword;
          const { dispatch } = this.props;
          dispatch({
            type: 'user/changePassword',
            payload: {
              oldPassword,
              newPassword
            }
          });
        }
      })
  }
  handleCancel = () => {
    this.setState({ configVisible: false, changeVisible: false, confirmLoading: false });
    this.wrappedConfigPasswordForm && this
      .wrappedConfigPasswordForm
      .props
      .form
      .resetFields()
    this.wrappedConfigPasswordForm && this
      .wrappedConfigPasswordForm
      .props
      .form
      .setFieldsValue({"phone": this.state.authority.phoneNumber})
    this.wrappedChangePasswordForm && this
      .wrappedChangePasswordForm
      .props
      .form
      .resetFields();
  }
  handleModalVisible = flag => {
    this.setState({
      personalVisible: !!flag
    });
  };
  handleCompanyModalVisible = flag => {
    this.setState({
      companyVisible: !!flag
    });
  };
  handlePersonalCertification = (formData) => {
    this.setState({personalCertification: formData.name});    
    const name = formData.name;
    const idCardNumber = formData.idCardNumber;
    const { dispatch } = this.props;
    dispatch({
      type: 'user/personalCertification',
      payload: {
        name,
        idCardNumber
      }
    });
  }
  handleCompanyCertification = (formData) => {
    this.setState({companyCertification: formData.corpName});
    const corpName = formData.corpName;
    const creditCode = formData.creditCode;
    const { dispatch } = this.props;
    dispatch({
      type: 'user/companyCertification',
      payload: {
        corpName,
        creditCode
      }
    });
  }
  render() {
    const formItemLayout = {
      labelCol: {
        xs: {
          span: 24
        },
        sm: {
          span: 8
        }
      },
      wrapperCol: {
        xs: {
          span: 24
        },
        sm: {
          span: 16
        }
      }
    };
    const {
      configVisible,
      changeVisible,
      personalVisible,
      companyVisible,
      confirmLoading,
      authority,
      hasPassword,
      personalCertification,
      companyCertification
    } = this.state;

    const parentMethods = {
      handleModalVisible: this.handleModalVisible,
      handleCompanyModalVisible: this.handleCompanyModalVisible,
      handlePersonalCertification: this.handlePersonalCertification,
      handleCompanyCertification: this.handleCompanyCertification
    };
    return (
      <Fragment>
        <PageHeaderLayout title="">
          <Card bordered={false}>
            <DescriptionList
              size="large"
              title=""
              style={{
                marginBottom: 32
              }}>
              <Description term="账户ID">{authority.userId}</Description>
            </DescriptionList>
            <Divider style={{
              marginBottom: 32
            }} />
            <DescriptionList
              size="large"
              title=""
              style={{
                marginBottom: 32
              }}>
              {authority.hasPassword === "0" && hasPassword === false
                ? <Description term="登录密码">未设置
                    <Button style={{marginLeft:'15px'}} onClick={this.configPassword}>设置密码</Button>
                    <Modal
                      title="设置密码"
                      visible={configVisible}
                      onOk={this.handleConfigPassword}
                      confirmLoading={confirmLoading}
                      onCancel={this.handleCancel}>
                      <WrappedConfigPasswordForm
                        onRef={this.onRef}
                        onGetCaptcha={this.onGetCaptcha}
                        phoneNumber={authority.phoneNumber}></WrappedConfigPasswordForm>
                    </Modal>
                  </Description>

                : <Description term="登录密码">已设置
                  <Button style={{marginLeft:'15px'}} onClick={this.changePassword}>修改密码</Button>
                  <Modal
                    title="修改密码"
                    visible={changeVisible}
                    onOk={this.handleChangePassword}
                    confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}>
                    <WrappedChangePasswordForm onRefOfChange={this.onRefOfChange}></WrappedChangePasswordForm>
                  </Modal>
                </Description>
              }
            </DescriptionList>
            <Divider style={{
              marginBottom: 32
            }} />
            <DescriptionList
              size="large"
              title=""
              style={{
              marginBottom: 32
            }}>
              {authority.corpName !== "" && < Description term = "实名认证" > 已公司实名认证 / {
                authority.corpName
              } < /Description>}
              {authority.name !== "" && < Description term = "实名认证" > 已个人实名认证 / {
                authority.name
              } < /Description>}

              {authority.corpName === "" && authority.name === "" && <Description term="实名认证">
                    <Button style={{marginLeft:'15px'}} onClick={() => this.handleModalVisible(true)}>个人认证</Button>
                    <PersonalCertification {...parentMethods} modalVisible={personalVisible}></PersonalCertification>
                    <Button style={{marginLeft:'15px'}} onClick={() => this.handleCompanyModalVisible(true)}>公司认证</Button>
                    <CompanyCertification {...parentMethods} modalVisible={companyVisible}></CompanyCertification>
                  </Description>
                  }
            </DescriptionList>
          </Card>
        </PageHeaderLayout>
      </Fragment>
            );
          }
        }
