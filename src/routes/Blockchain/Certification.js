import React, {Component, Fragment} from 'react';
import {connect} from 'dva';
import {
  Form,
  Modal,
  Input,
} from 'antd';

const FormItem = Form.Item;
export default class MyForm extends Component {
  state = {
    
  };

  componentDidMount() {}

  componentWillUnmount() {}

  okHandle = () => {
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) 
        return;
      let formData = this.props.form.getFieldsValue();
      this.props.handlePersonalCertification(formData);
    });
  };


  render() {
    const {modalVisible,handleModalVisible} = this.props;

    return (
      <Modal
        title="实名认证"
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => {
        handleModalVisible();
        this.props.form.resetFields();
      }}>
        <FormItem label="名称">
          {this.props.form.getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: '请输入个人/企业名称!'
              }, {
                validator: null
              }
            ]
          })(<Input/>)}
        </FormItem>
        <FormItem label="统一信用号码">
          {this.props.form.getFieldDecorator('idCardNumber', {
            rules: [
              {
                required: true,
                message: '请输入统一信用名称!'
              }, {
                validator: null
              }
            ]
          })(<Input placeholder="身份证号码/统一信用号码/注册号码/纳税号码"/>)}
        </FormItem>
      </Modal>
    );
  }
}
