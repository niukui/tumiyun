import {
  Form,
  Input,
  Tooltip,
  Icon,
  Cascader,
  Select,
  Row,
  Col,
  Checkbox,
  Button,
  AutoComplete
} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const AutoCompleteOption = AutoComplete.Option;

class ConfigPasswordForm extends React.Component {

  componentDidMount() {
    this
      .props
      .onRef(this)
    this
      .props
      .form
      .setFieldsValue({"phone": this.props.phoneNumber})
  }
  state = {
    confirmDirty: false,
    autoCompleteResult: []
  };
  handleSubmit = (e) => {
    e.preventDefault();
    this
      .props
      .form
      .validateFieldsAndScroll((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values);
        }
      });
  }
  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({
      confirmDirty: this.state.confirmDirty || !!value
    });
  }
  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('请保持两次输入的密码一致');
    } else {
      callback();
    }
  }
  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    let regex = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z_!@#$%^&*()_+=|]{6,17}$/;
    if(value&&!regex.test(value)){
      callback("密码格式错误");
    }
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], {force: true});
      
    }
    callback();
  }
  onGetCaptcha = () => {
    let count = 59;
    this.setState({count});
    if (this.props.onGetCaptcha) {
      this
        .props
        .onGetCaptcha();
    }
    this.interval = setInterval(() => {
      count -= 1;
      this.setState({count});
      if (count === 0) {
        clearInterval(this.interval);
      }
    }, 1000);
  };
  render() {
    const {getFieldDecorator, setFieldsValue} = this.props.form;
    const {autoCompleteResult, count} = this.state;

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
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0
        },
        sm: {
          span: 16,
          offset: 8
        }
      }
    };
    const prefixSelector = getFieldDecorator('prefix', {initialValue: '86'})(
      <Select style={{
        width: 70
      }}>
        <Option value="86">+86</Option>
      </Select>
    );

    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem {...formItemLayout} label="手机号">
          {getFieldDecorator('phone', {
            rules: [
              {
                required: true,
                message: '请输入手机号!'
              }
            ]
          })(<Input
            readOnly
            addonBefore={prefixSelector}
            style={{
            width: '100%'
          }}/>)}
        </FormItem>
        <FormItem {...formItemLayout} label="验证码" extra="请输入你得到的验证码">
          <Row gutter={8}>
            <Col span={12}>
              {getFieldDecorator('captcha', {
                rules: [
                  {
                    required: true,
                    message: '请输入你得到的验证码!'
                  }
                ]
              })(<Input/>)}
            </Col>
            <Col span={12}>
              <Button disabled={count} onClick={this.onGetCaptcha}>{count
                  ? `${count}s`
                  : "获取验证码"}</Button>
            </Col>
          </Row>
        </FormItem>
        <FormItem {...formItemLayout} label="设置密码">
          {getFieldDecorator('password', {
            rules: [
              {
                required: true,
                message: '请输入密码!'
              }, {
                validator: this.validateToNextPassword
              }
            ]
          })(<Input type="password" placeholder="6-16位数字和字母组成"/>)}
        </FormItem>
        <FormItem {...formItemLayout} label="确认密码">
          {getFieldDecorator('confirm', {
            rules: [
              {
                required: true,
                message: '请确认密码!'
              }, {
                validator: this.compareToFirstPassword
              }
            ]
          })(<Input type="password" onBlur={this.handleConfirmBlur}/>)}
        </FormItem>

      </Form>
    );
  }
}

export const WrappedConfigPasswordForm = Form.create({})(ConfigPasswordForm);
