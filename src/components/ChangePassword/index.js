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

class ChangePasswordForm extends React.Component {
  componentDidMount() {
    this
      .props
      .onRefOfChange(this)
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
          //console.log('Received values of form: ', values);
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
    if (value && value !== form.getFieldValue('newPassword')) {
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
    if (value && value === form.getFieldValue('oldPassword')) {
      callback('旧密码不能与原密码相同!');
      if (value && this.state.confirmDirty) {
        form.validateFields(['confirm'], {force: true});
      }
    } else {
      callback();
    }
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    const {autoCompleteResult} = this.state;

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

    const websiteOptions = autoCompleteResult.map(website => (
      <AutoCompleteOption key={website}>{website}</AutoCompleteOption>
    ));

    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem {...formItemLayout} label="原密码">
          {getFieldDecorator('oldPassword', {
            rules: [
              {
                required: true,
                message: '请输入密码!'
              }, {}
            ]
          })(<Input type="password"/>)}
        </FormItem>
        <FormItem {...formItemLayout} label="设置密码">
          {getFieldDecorator('newPassword', {
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

export const WrappedChangePasswordForm = Form.create({})(ChangePasswordForm);
