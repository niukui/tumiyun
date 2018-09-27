import React, {Component, Fragment} from 'react';
import {connect} from 'dva';
import {
  Card,
  Form,
  Modal,
  Input,
  Button,
  message,
  Divider
} from 'antd';
import StandardTable from 'components/StandardTable';
import {getAuthority, setAuthority} from '../../utils/authority';
import MyForm from './Certification';
import {reloadAuthorized} from '../../utils/Authorized';
import {getDateString} from '../../utils/utils';

const FormItem = Form.Item;
const Certification = Form.create()(MyForm);

@connect(({blockchain, user, loading}) => ({blockchain, user, loading: loading.models.blockchain}))
export default class Blockchain extends Component {
  state = {
    modalVisible: false,
    authority: getAuthority() || {},
  };

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({type: 'blockchain/fetchList'});
  }

  componentWillUnmount() {}

  componentWillReceiveProps(nextProps) {
    if (nextProps.user.personalCertification && nextProps.user.personalCertification === "0") {
      nextProps.user.personalCertification = "";
      this.setState({modalVisible: false});
      message.success('认证成功');
      let authority = getAuthority();
      authority.name=this.formRef && this.formRef.props.form && this
      .formRef
      .props
      .form.getFieldValue("name");
      setAuthority(authority);
      reloadAuthorized();
    } else if (nextProps.user.personalCertification && nextProps.user.personalCertification === "1") {
      //message.error("个人认证失败！");
      nextProps.user.personalCertification = "";
      let formData = this.formRef && this.formRef.props.form && this
        .formRef
        .props
        .form
        .getFieldsValue();
      this.handleCompanyCertification(formData);
    }
    if (nextProps.user.Certification && nextProps.user.Certification === "0") {
      nextProps.user.Certification = "";
      message.success('认证成功');
      let authority = getAuthority();
      authority.corpName=this.formRef && this.formRef.props.form && this
      .formRef
      .props
      .form.getFieldValue("name");
      setAuthority(authority);
      reloadAuthorized();
    } else if (nextProps.user.Certification && nextProps.user.Certification === "1") {
      message.error("个人/企业认证失败！");
      nextProps.user.Certification = "";
    }
  }

  handlePersonalCertification = (formData) => {
    const name = formData.name;
    const idCardNumber = formData.idCardNumber;
    const {dispatch} = this.props;
    dispatch({
      type: 'user/personalCertification',
      payload: {
        name,
        idCardNumber
      }
    });
  }
  handleCompanyCertification = (formData) => {
    const corpName = formData.name;
    const creditCode = formData.idCardNumber;
    const {dispatch} = this.props;
    dispatch({
      type: 'user/companyCertification',
      payload: {
        corpName,
        creditCode
      }
    });
  }
  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag
    });
  };

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const {dispatch} = this.props;
    dispatch({type: 'blockchain/page', payload: pagination});
  };

  render() {
    const {blockchain: {
        data,count
      }, loading} = this.props;
    const {modalVisible, authority} = this.state;
    const parentMethods = {
      handleModalVisible: this.handleModalVisible,
      handlePersonalCertification: this.handlePersonalCertification,
      handleCompanyCertification: this.handleCompanyCertification
    };
    const columns = [
      {
          title: '任务编号',
          dataIndex: 'taskId',
          render: val => <span>{val}</span>,
      },
      {
          title: '接收方/交付方',
          dataIndex: 'acceptorTrueName',
          render: val => <span>{val}</span>,
      },
      {
          title: '交付时间',
          dataIndex: 'taskCreateTime',
          align:'center',
          render: val => <span>{getDateString(val)}</span>,
      },
      {
          title: '类型',
          dataIndex: 'contentType',
          align:'center',
          render: val => val&&val.length&&val[0]!==""?val[0]:"图片",
      },
      {
          title: '数量',
          dataIndex: 'contentCount',
          align:'center',
          render: val => <span>{val}</span>,
      },
      {
          title: '操作',
          render: (val) => (
              <Fragment>
                  <a href={"#/blockchain/details/"+encodeURIComponent(val.taskId)}>查看</a>
                  <Divider type="vertical" />
              </Fragment>
          ),
      },
    ];
    return (
      <Fragment>
        {authority.name===""&&authority.corpName===""&& <Card title='实名验证信息'>
          <span
            style={{
            textAlign: "center",
            fontSize: "1.5em"
          }}>您当前未进行实名认证，当前您有<b>{count}</b>件作品需要版权登记,请立即
          </span>
          <Button onClick= {() => this.handleModalVisible(true)}>实名认证
          </Button>
          <Certification
            wrappedComponentRef={(inst) => this.formRef = inst}
            {...parentMethods}
            modalVisible={modalVisible}></Certification>
        </Card>}

        <Card
          title='文件检索'
          style={{
          marginTop: "24px",
          marginBottom: "24px"
        }}>
          <p>您可以上传需要维权的作品，系统会自动帮你找到源文件
          </p>
          <Button onClick= {() => null}>上传文件
          </Button>
        </Card>
        <Card>
          <StandardTable
            loading={loading}
            data={data}
            columns={columns}
            rowKey="taskId"
            onChange={this.handleStandardTableChange}></StandardTable>
        </Card>
      </Fragment>
    );
  }
}
