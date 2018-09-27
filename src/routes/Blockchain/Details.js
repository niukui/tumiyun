import { Button, Card, Divider, Form, Popover, Tabs, message } from 'antd';
import StandardTable from 'components/StandardTable';
import download from 'downloadjs';
import { connect } from 'dva';
import React, { Component, Fragment } from 'react';
import { reloadAuthorized } from '../../utils/Authorized';
import { getAuthority, setAuthority } from '../../utils/authority';
import MyForm from './Certification';

const {TabPane} = Tabs;
const FormItem = Form.Item;
const Certification = Form.create()(MyForm);

@connect(({blockchain, user, loading}) => ({blockchain, user, loading: loading.models.blockchain}))
export default class BlockchainDetails extends Component {
  state = {
    modalVisible: false,
    previewVisible: false,
    authority: getAuthority()
  };
  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({type: 'blockchain/fetchFile', payload: this.props.match.params.id});
  }

  componentWillUnmount() {}

  componentWillReceiveProps(nextProps) {
    if (nextProps.user.personalCertification && nextProps.user.personalCertification === "0") {
      nextProps.user.personalCertification = "";
      this.setState({modalVisible: false});
      message.success('认证成功');
      let authority = getAuthority();
      authority.name = this.formRef && this.formRef.props.form && this
        .formRef
        .props
        .form
        .getFieldValue("name");
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
      authority.corpName = this.formRef && this.formRef.props.form && this
        .formRef
        .props
        .form
        .getFieldValue("name");
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

  handleFilesPreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true
    });
  }
  handleFilesCancel = () => this.setState({previewVisible: false})
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const {dispatch} = this.props;
    dispatch({type: 'blockchain/page', payload: pagination});
  };

  render() {
    const {blockchain: {
        data
      }, loading} = this.props;
    const {modalVisible, authority} = this.state;
    const parentMethods = {
      handleModalVisible: this.handleModalVisible,
      handlePersonalCertification: this.handlePersonalCertification,
      handleCompanyCertification: this.handleCompanyCertification
    };
    const columns = [
      {
        title: '文件名称',
        dataIndex: 'fileId',
        render: val => <span>{val}</span>
      }, {
        title: '预览图',
        dataIndex: 'snapshotUrl',
        render: (val) => (
          <div
            style={{
            width: "160px",
            height: "90px"
          }}>
            <img
              style={{
              width: "100%",
              height: "100%"
            }}
              alt="example"
              src={val}/>
          </div>
        )
      }, {
        title: '状态',
        dataIndex: 'sighCopyright',
        render: val => <span>{val === "1"
              ? "已登记"
              : "未登记"}</span>
      }, {
        title: '查看详情',
        dataIndex: 'certUrl',
        render: (val) => (
          <Popover
            content={< img style = {{ width: "100%", height: "100%" }}alt = "example" src = {
            val
          } />}>
            <Button border={null}>查看证书</Button>
          </Popover>
        )
      }, {
        title: '查看资料',
        dataIndex: 'downloadUrl',
        render: (val, item) => (
          <Fragment>
            <a
              onClick={() => {
              download(val)
            }}
              href="javascript:void(0)">下载</a>
            <Divider type="vertical"/> {/* <a onClick={() => {
              fetch(val).then(res => {
                return res.blob();
              }).then(file => {
                if (window.navigator.msSaveOrOpenBlob) // IE10+
                  window.navigator.msSaveOrOpenBlob(file, item.fileName);
                else { // Others
                  var a = document.createElement("a"),
                    url = URL.createObjectURL(file);
                  a.href = url;
                  a.download = item.fileName;
                  document.body.appendChild(a);
                  a.click();
                  setTimeout(function () {
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                  }, 0);
                }
              })
              return false;
            }} download href="javascript:void(0)" rel="nofollow">下载</a> */}
          </Fragment>
        )
      }
    ];
    return (
      <Fragment>
        {authority.name === "" && authority.corpName === "" && <Card title='实名验证信息'>
          <span
            style={{
            textAlign: "center",
            fontSize: "1.5em"
          }}>您当前未进行实名认证，当前您有<b>200</b>件作品需要版权登记,请立即
          </span>
          <Button onClick={() => this.handleModalVisible(true)}>实名认证
          </Button>
          <Certification
            {...parentMethods}
            wrappedComponentRef={(inst) => this.formRef = inst}
            modalVisible={modalVisible}></Certification>
        </Card>}

        <Card>
          <StandardTable
            loading={loading}
            data={data}
            columns={columns}
            rowKey="fileId"
            onChange={this.handleStandardTableChange}></StandardTable>
        </Card>

      </Fragment>
    );
  }
}
