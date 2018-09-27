import React, {Component} from 'react';
import {connect} from 'dva';
import {
    Card,
    Form,
    Input,
    Button,
    Radio,
    Icon,
    Upload,
    Modal,
    Spin,
    message,
    AutoComplete
} from 'antd';
import BlankLayout from '../../layouts/BlankLayout';
import querystring from 'querystring';
import fetch from 'dva/fetch';
import {getAuthority, setAuthority, goToManage} from '../../utils/authority';
import browserMD5File from 'browser-md5-file';
import * as es5Shim from 'es5-shim';
import Promise from 'promise';
import {isPoneNumber} from '../../utils/utils';
import DropzoneComponent from 'react-dropzone-component';

const Dragger = Upload.Dragger;
const copyrightInfos = ["未登录", "本人", "对方"];
const taskStatus = ["未接收", "已接收"];

const FormItem = Form.Item;
const Option = AutoComplete.Option;
const {TextArea} = Input;

let timeout;
let currentValue;

function renderOption(item) {
    return (
        <Option key={item.value} value={item.value} text={item.text}>
            {item.text}
        </Option>
    );
}

function fetchUser(phoneNumber, callback) {
    if (timeout) {
        clearTimeout(timeout);
        timeout = null;
    }
    let currentValue = phoneNumber;

    function fake() {
        const str = querystring.encode({word: phoneNumber});
        fetch(`/user/search?${str}`, {credentials: 'include'})
            .then(response => response.json())
            .then((d) => {
                if (currentValue === phoneNumber) {
                    const result = (d.content && d.content.userList) || [];
                    const data = [];
                    result.forEach((r) => {
                        if (r.corpName || r.trueName) {
                            data.push({
                                value: r.phoneNumber,
                                text: r.userId + "/" + r.phoneNumber + "/" + (r.corpName || r.trueName || ''),
                                acceptorName: r.corpName || r.trueName || ''
                            });
                        }
                    });
                    callback(data);
                }
            });
    }
    timeout = setTimeout(fake, 300);
}

@connect(({delivery, loading}) => ({delivery}))

@Form.create()
export default class Create extends Component {
    state = {
        dataSource: [],
        phoneNumber: '',
        step: 1,
        previewVisible: false,
        previewImage: '',
        fileList: [],
        loading: false,
        authority: getAuthority() || {},
        register: "0"
    }

    componentDidMount() {
        const {dispatch} = this.props;
        dispatch({type: 'delivery/initCreate'});
        this.fileMd5s = {};
        this.acceptorName = '';
    }

    handleChange = (value, ele) => {
        var self = this;
        var item = self
            .state
            .dataSource
            .find(d => d.text == value || d.value == value);
        if (item) {
            self.phoneNumber = item.value;
            this.deliverAccptorName(item.acceptorName || '');
        } else {
            this.deliverAccptorName('');
            if (isPoneNumber(value)) {
                self.phoneNumber = value;
            } else {
                self.phoneNumber = '';
            }
        }
    }

    handleSelect = (value, ele) => {
        var self = this;
        var item = self
            .state
            .dataSource
            .find(d => d.value == ele.key);
        if (item) {
            self.phoneNumber = item.value;
            this.deliverAccptorName(item.acceptorName || '');
        } else {
            self
                .props
                .form
                .setFieldsValue({"phoneNumberMask": ''});
            self.phoneNumber = '';
            this.deliverAccptorName('');
        }
    }
    handleBlur = (val) => {
        var self = this;
        var item = self
            .state
            .dataSource
            .find(d => d.value == self.phoneNumber || d.text === val || d.value === val);
        if (item) {
            self.phoneNumber = item.value;
            this.deliverAccptorName(item.acceptorName || '');
        } else {
            this.deliverAccptorName('');
            if (isPoneNumber(val)) {
                this
                    .props
                    .form
                    .setFieldsValue({"phoneNumberMask": val});
                self.phoneNumber = val;
            } else {
                this
                    .props
                    .form
                    .setFieldsValue({"phoneNumberMask": ''});
                self.phoneNumber = '';
            }
        }
    }

    handleSearch = (value) => {
        fetchUser(value, data => {
            this.setState({
                dataSource: data || []
            });
        });
    }

    gotoList = () => {
        this
            .props
            .history
            .goBack();
    }
    nextStep = (e) => {
        this
            .props
            .form
            .validateFieldsAndScroll((err, values) => {
                if (!err) {
                    this.setState({step: 2});
                }
            });
    }
    prevStep = () => {
        this.setState({step: 1});
    }
    handleFilesCancel = () => this.setState({previewVisible: false})

    handleFilesChange = ({file, fileList, event}) => {
        this.setState({fileList});
        if (file.response) {
            this.setState({loading: false});
        }
    }

    handleFilesPreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true
        });
    }
    handleBeforeUpload = (file, fileList) => {
        var self = this;
        self.setState({loading: true});
        return new Promise(function (resolve, reject) {
            browserMD5File(file, (err, md5) => {
                self.fileMd5s[file.uid] = md5;
                resolve(file);
            });
        });
    }
    prepareData = (file) => {
        var self = this;
        return {
            md5: self.fileMd5s[file.uid],
            dir: ""
        };
    }

    submitDeliver = (e) => {
        var fileIds = [];
        this
            .state
            .fileList
            .forEach(function (val, key) {
                if (val.xhr && val.xhr.response) {
                    try {
                        var response = JSON.parse(val.xhr.response);
                        if (response && response.content && response.content.fileId) {
                            fileIds.push(response.content.fileId);
                        }
                    } catch {}
                }
            });
        if (fileIds.length === 0) {
            message.error("请上传图片");
            return;
        }
        if (this.state.fileList.length !== fileIds.length) {
            message.error("有未上传成功的图片，请点击重新上传按钮；或者删除文件");
            return;
        }
        var formData = this
            .props
            .form
            .getFieldsValue([
                "phoneNumberMask",
                "remark",
                "watermark",
                "sighCopyright",
                "copyrightOwner",
                "type"
            ]);
        formData['fileIds'] = fileIds;
        formData['phoneNumber'] = this.phoneNumber;
        delete formData['phoneNumberMask']
        this.setState({loading: true});

        const {dispatch} = this.props;
        dispatch({type: 'delivery/save', payload: formData});
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.delivery.uploadFinish && this.props.delivery.uploadFinish !== nextProps.delivery.uploadFinish) {
            this.setState({loading: false});
            if (nextProps.delivery.uploadOk) {
                message.success('添加成功');
                this.gotoList();
            } else {
                message.error(nextProps.delivery.message);
            }
        }
    }

    getNameVerify = () => {
        const {authority} = this.state;
        return (authority.name || authority.corpName)
            ? <span>实名认证信息: {(authority.name || authority.corpName)}</span>
            : <span>您当前未进行实名认证，若要进行版权登记，请立即
                <a href='#/account'>实名认证</a>
            </span>;
    }

    deliverAccptorName = (acceptorName) => {
        const {dispatch} = this.props;
        dispatch({type: 'delivery/acceptorName', payload: acceptorName});
    }

    addFileToList = (file) => {
        this.setState({
            fileList: [
                ...(this.state.fileList),
                file
            ]
        });
    }
    removeFileFromList = (file) => {
        var newList = [];
        this
            .state
            .fileList
            .forEach((item, key) => {
                if (item.upload.uuid !== file.upload.uuid) {
                    newList.push(item);
                }
            });
        this.setState({
            fileList: [...newList]
        });
    }
    createElement = function (string) {
        var div = document.createElement("div");
        div.innerHTML = string;
        return div.childNodes[0];
    }

    render() {
        const {delivery: {
                acceptorName
            }} = this.props;
        const {getFieldDecorator, getFieldValue} = this.props.form;
        const {step} = this.state;
        const {
            previewVisible,
            previewImage,
            fileList,
            loading,
            authority,
            dataSource
        } = this.state;

        const uploadButton = (
            <div>
                <Icon type="plus"/>
                <div className="ant-upload-text">Upload</div>
            </div>
        );

        const formItemLayout = {
            labelCol: {
                xs: {
                    span: 24
                },
                sm: {
                    span: 7
                }
            },
            wrapperCol: {
                xs: {
                    span: 24
                },
                sm: {
                    span: 12
                },
                md: {
                    span: 10
                }
            }
        };

        const submitFormLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0
                },
                sm: {
                    span: 10,
                    offset: 7
                }
            }
        };

        const componentConfig = {
            allowedFiletypes: [
                '.jpg', '.png', '.gif'
            ],
            showFiletypeIcon: true,
            postUrl: '/file/upload'
        };
        var self = this;
        const djsConfig = {
            accept: function accept(file, done) {
                if (file.xhr && file.xhr.response) {
                    var response = JSON.parse(file.xhr.response);
                    if (response.code !== "0") {
                        return done(response.msg);
                    } else {
                        return done();
                    }
                }
                return done();
            },
            addRemoveLinks: true,
            transformFile: (file, done) => {
                browserMD5File(file, (err, md5) => {
                    self.fileMd5s[file.upload.uuid] = md5;
                    file.upload.md5 = md5;
                    if (file.fullPath && file.name) {
                        file.upload.dir = file
                            .fullPath
                            .substring(0, file.fullPath.length - file.name.length - 1);
                    } else {
                        file.upload.dir = '';
                    }
                    return done(file);
                });
            },
            addRemoveLinks: true,
            dictRemoveFile: '删除',
            dictDefaultMessage: "拖放文件到这里",
            dictCancelUpload: "取消上传",
            previewTemplate: "<div class=\"dz-preview dz-file-preview\">\n  <div class=\"dz-image\"><img data-" +
                    "dz-thumbnail /></div>\n  <div class=\"dz-details\">\n    <div class=\"dz-size\">" +
                    "<span data-dz-size></span></div>\n    <div class=\"dz-filename\"><span data-dz-n" +
                    "ame></span></div>\n  </div>\n  <div class=\"dz-progress\"><span class=\"dz-uploa" +
                    "d\" data-dz-uploadprogress></span></div>\n  <div class=\"dz-error-message-up\"><" +
                    "span data-dz-errormessage></span></div>\n  <div class=\"dz-success-mark\">\n    " +
                    "<svg width=\"54px\" height=\"54px\" viewBox=\"0 0 54 54\" version=\"1.1\" xmlns=" +
                    "\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmln" +
                    "s:sketch=\"http://www.bohemiancoding.com/sketch/ns\">\n      <title>Check</title" +
                    ">\n      <defs></defs>\n      <g id=\"Page-1\" stroke=\"none\" stroke-width=\"1" +
                    "\" fill=\"none\" fill-rule=\"evenodd\" sketch:type=\"MSPage\">\n        <path d=" +
                    "\"M23.5,31.8431458 L17.5852419,25.9283877 C16.0248253,24.3679711 13.4910294,24.3" +
                    "66835 11.9289322,25.9289322 C10.3700136,27.4878508 10.3665912,30.0234455 11.9283" +
                    "877,31.5852419 L20.4147581,40.0716123 C20.5133999,40.1702541 20.6159315,40.26266" +
                    "49 20.7218615,40.3488435 C22.2835669,41.8725651 24.794234,41.8626202 26.3461564," +
                    "40.3106978 L43.3106978,23.3461564 C44.8771021,21.7797521 44.8758057,19.2483887 4" +
                    "3.3137085,17.6862915 C41.7547899,16.1273729 39.2176035,16.1255422 37.6538436,17." +
                    "6893022 L23.5,31.8431458 Z M27,53 C41.3594035,53 53,41.3594035 53,27 C53,12.6405" +
                    "965 41.3594035,1 27,1 C12.6405965,1 1,12.6405965 1,27 C1,41.3594035 12.6405965,5" +
                    "3 27,53 Z\" id=\"Oval-2\" stroke-opacity=\"0.198794158\" stroke=\"#747474\" fill" +
                    "-opacity=\"0.816519475\" fill=\"#FFFFFF\" sketch:type=\"MSShapeGroup\"></path>\n" +
                    "      </g>\n    </svg>\n  </div>\n  <div class=\"dz-error-mark\">\n    <svg widt" +
                    "h=\"54px\" height=\"54px\" viewBox=\"0 0 54 54\" version=\"1.1\" xmlns=\"http://" +
                    "www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns:sketch=" +
                    "\"http://www.bohemiancoding.com/sketch/ns\">\n      <title>Error</title>\n      " +
                    "<defs></defs>\n      <g id=\"Page-1\" stroke=\"none\" stroke-width=\"1\" fill=\"" +
                    "none\" fill-rule=\"evenodd\" sketch:type=\"MSPage\">\n        <g id=\"Check-+-Ov" +
                    "al-2\" sketch:type=\"MSLayerGroup\" stroke=\"#747474\" stroke-opacity=\"0.198794" +
                    "158\" fill=\"#FFFFFF\" fill-opacity=\"0.816519475\">\n          <path d=\"M32.65" +
                    "68542,29 L38.3106978,23.3461564 C39.8771021,21.7797521 39.8758057,19.2483887 38." +
                    "3137085,17.6862915 C36.7547899,16.1273729 34.2176035,16.1255422 32.6538436,17.68" +
                    "93022 L27,23.3431458 L21.3461564,17.6893022 C19.7823965,16.1255422 17.2452101,16" +
                    ".1273729 15.6862915,17.6862915 C14.1241943,19.2483887 14.1228979,21.7797521 15.6" +
                    "893022,23.3461564 L21.3431458,29 L15.6893022,34.6538436 C14.1228979,36.2202479 1" +
                    "4.1241943,38.7516113 15.6862915,40.3137085 C17.2452101,41.8726271 19.7823965,41." +
                    "8744578 21.3461564,40.3106978 L27,34.6568542 L32.6538436,40.3106978 C34.2176035," +
                    "41.8744578 36.7547899,41.8726271 38.3137085,40.3137085 C39.8758057,38.7516113 39" +
                    ".8771021,36.2202479 38.3106978,34.6538436 L32.6568542,29 Z M27,53 C41.3594035,53" +
                    " 53,41.3594035 53,27 C53,12.6405965 41.3594035,1 27,1 C12.6405965,1 1,12.6405965" +
                    " 1,27 C1,41.3594035 12.6405965,53 27,53 Z\" id=\"Oval-2\" sketch:type=\"MSShapeG" +
                    "roup\"></path>\n        </g>\n      </g>\n    </svg>\n  </div>\n</div>",
            maxFiles: 100,
            maxFilesize: 20,
            dictMaxFilesExceeded: '文件数量超出限制，最多100个文件。',
            dictFileTooBig: '文件太大 ({{filesize}}MiB). 最大限制: {{maxFilesize}}MiB.',
            thumbnailMethod:'contain'
        };

        const eventHandlers = {
            init: function (dropzone) {
                self.myDropzone = dropzone;

                dropzone._finishedUploading = function _finishedUploading(files, xhr, e) {
                    var response = void 0;

                    if (files[0].status === "canceled") {
                        return;
                    }

                    if (xhr.readyState !== 4) {
                        return;
                    }

                    if (xhr.responseType !== 'arraybuffer' && xhr.responseType !== 'blob') {
                        response = xhr.responseText;

                        if (xhr.getResponseHeader("content-type") && ~ xhr.getResponseHeader("content-type").indexOf("application/json")) {
                            try {
                                response = JSON.parse(response);
                            } catch (error) {
                                e = error;
                                response = "Invalid JSON response from server.";
                            }
                        }
                    }

                    dropzone._updateFilesUploadProgress(files);

                    if (!(200 <= xhr.status && xhr.status < 300 && (typeof response === 'object' && response.code === '0'))) {
                        dropzone._handleUploadError(files, xhr, response);
                    } else {
                        if (files[0].upload.chunked) {
                            files[0]
                                .upload
                                .finishedChunkUpload(dropzone._getChunk(files[0], xhr));
                        } else {
                            dropzone._finished(files, response, e);
                        }
                    }
                };
            },
            sending: (file, xhr, formData) => {
                formData.append("md5", file.upload.md5);
                formData.append("dir", file.upload.dir);
            },
            addedfile: (file) => {
                self.addFileToList(file);
            },
            complete: (file) => {

                if (file.message && (typeof file.message === 'object' && (file.message.code === '1' || file.message.status === 500))) {
                    message.error(file.message.msg || file.message.message);
                    if (file.message.msg === '用户未登录') {
                        setAuthority({});
                        goToManage();
                    }
                    return;
                }
                if (file.message && ((file.message.indexOf('文件太大') >= 0 || file.message.indexOf('文件数量超出限制') >= 0))) {
                    return;
                }
                if (!file.previewElement.getElementsByClassName('dz-retry') || file.previewElement.getElementsByClassName('dz-retry').length === 0) {
                    var retryLink = self.createElement("<a class=\"dz-retry\" href=\"javascript:void(0);\" >重新上传</a>");
                    if (retryLink) {
                        retryLink
                            .addEventListener("click", function removeFileEvent(e) {
                                e.preventDefault();
                                e.stopPropagation();
                                self
                                    .myDropzone
                                    .processFile(file);
                            });
                    }
                    if ("error" === file.status) {
                        file
                            .previewElement
                            .appendChild(retryLink);
                    } else if (file.xhr && file.xhr.response && 200 <= file.xhr.status && file.xhr.status < 300) {
                        try {
                            var response = JSON.parse(file.xhr.response);
                            if (response.code !== "0") {
                                file
                                    .previewElement
                                    .appendChild(retryLink);
                            }
                        } catch (error) {
                            file
                                .previewElement
                                .appendChild(retryLink);
                        }
                    }
                } else {
                    var retryLink = file
                        .previewElement
                        .getElementsByClassName('dz-retry')[0];
                    var errorMessage;
                    var b = file
                        .previewElement
                        .getElementsByClassName('dz-error-message-up')[0]
                    var c = b.getElementsByTagName('span')[0]
                    if (file.previewElement.getElementsByClassName('dz-error-message-up') && file.previewElement.getElementsByClassName('dz-error-message-up').length && file.previewElement.getElementsByClassName('dz-error-message-up')[0].getElementsByTagName('span') && file.previewElement.getElementsByClassName('dz-error-message-up')[0].getElementsByTagName('span').length) {
                        errorMessage = file
                            .previewElement
                            .getElementsByClassName('dz-error-message-up')[0]
                            .getElementsByTagName('span')[0];
                    }
                    if ("success" === file.status) {
                        file
                            .previewElement
                            .classList
                            .add("dz-success");
                        file
                            .previewElement
                            .classList
                            .remove("dz-error");
                        if (errorMessage) {
                            errorMessage.textContent = '';
                        }
                        file
                            .previewElement
                            .removeChild(retryLink);
                    } else if (file.xhr && file.xhr.response && 200 <= file.xhr.status && file.xhr.status < 300) {
                        try {
                            var response = JSON.parse(file.xhr.response);
                            if (response.code === "0") {
                                file
                                    .previewElement
                                    .classList
                                    .add("dz-success");
                                file
                                    .previewElement
                                    .classList
                                    .remove("dz-error");
                                if (errorMessage) {
                                    errorMessage.textContent = '';
                                }
                                file
                                    .previewElement
                                    .removeChild(retryLink);
                            }
                        } catch (error) {
                            file
                                .previewElement
                                .classList
                                .add("dz-success");
                            file
                                .previewElement
                                .classList
                                .remove("dz-error");
                            if (errorMessage) {
                                errorMessage.textContent = '';
                            }
                            file
                                .previewElement
                                .removeChild(retryLink);
                        }
                    }
                }
            },
            error: function (file, msg) {
                file.message = msg;
            },
            removedfile: (file) => {
                self.removeFileFromList(file);
            }
        }

        return (
            <BlankLayout title="">
                <Spin spinning={loading}>
                    <Card bordered={false}>
                        <Form
                            hideRequiredMark
                            style={{
                            marginTop: 8,
                            display: (step === 1
                                ? 'block'
                                : 'none')
                        }}>
                            <FormItem {...formItemLayout} label="交付对象">
                                {getFieldDecorator('phoneNumberMask', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入交付对象'
                                        }
                                    ]
                                })(
                                    <AutoComplete
                                        size="large"
                                        style={{
                                        width: '100%'
                                    }}
                                        dataSource={dataSource.map(renderOption)}
                                        onSelect={this.handleSelect}
                                        onSearch={this.handleSearch}
                                        onChange={this.handleChange}
                                        onBlur={this.handleBlur}
                                        placeholder="请输入交付对象"
                                        optionLabelProp="text">
                                        <Input/>
                                    </AutoComplete>
                                )}
                            </FormItem>
                            <FormItem {...formItemLayout} label="备注">
                                {getFieldDecorator('remark', {
                                    rules: [
                                        {
                                            required: false,
                                            message: '请输入备注'
                                        }
                                    ]
                                })(<TextArea style={{}} placeholder="备注" rows={4}/>)}
                            </FormItem>
                            {/* <FormItem {...formItemLayout} label="是否添加水印">
                                <div>
                                    {getFieldDecorator('watermark', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请选择',
                                            },
                                        ],
                                    })(
                                        <Radio.Group>
                                            <Radio value="0">是</Radio>
                                            <Radio value="1">否</Radio>
                                        </Radio.Group>
                                    )}
                                </div>
                            </FormItem> */}
                            <FormItem {...formItemLayout} label="是否登记区块链版权">
                                <div>
                                    {getFieldDecorator('sighCopyright', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请选择'
                                            }
                                        ],
                                        initialValue: "0"
                                    })(
                                        <Radio.Group onChange={(e) => this.setState({register: e.target.value})}>
                                            <Radio value="0">是</Radio>
                                            <Radio value="1">否</Radio>
                                        </Radio.Group>
                                    )}
                                </div>
                            </FormItem>
                            {this.state.register === "0" && <FormItem {...formItemLayout} label="版权归属">
                                <div>
                                    {getFieldDecorator('copyrightOwner', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请选择'
                                            }
                                        ]
                                    })(
                                        <Radio.Group>
                                            <Radio value="1">
                                                本人
                                            </Radio>
                                            {this.getNameVerify()}
                                            <br></br>
                                            <Radio value="2">对方</Radio>
                                            {acceptorName
                                                ? <span>实名认证信息: {acceptorName}</span>
                                                : <span></span>}
                                        </Radio.Group>
                                    )}
                                </div>
                            </FormItem>}

                            <FormItem
                                {...submitFormLayout}
                                style={{
                                marginTop: 32
                            }}>
                                <Button type="primary" onClick={() => this.nextStep()}>
                                    下一步，上传
                                </Button>
                                <Button
                                    style={{
                                    marginLeft: 8
                                }}
                                    onClick={() => this.gotoList()}>取消</Button>
                            </FormItem>
                        </Form>

                        <Form
                            hideRequiredMark
                            style={{
                            marginTop: 8,
                            display: (step === 2
                                ? 'block'
                                : 'none')
                        }}>
                            <FormItem {...formItemLayout} label="类型">
                                <div>
                                    {getFieldDecorator('type', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请选择'
                                            }
                                        ],
                                        initialValue: "1"
                                    })(
                                        <Radio.Group>
                                            <Radio value="1">图片</Radio>
                                            <Radio disabled value="2">视频</Radio>
                                            <Radio disabled value="3">音频</Radio>
                                        </Radio.Group>
                                    )}
                                </div>
                            </FormItem>
                            <FormItem {...formItemLayout} label="文件柜">
                                {getFieldDecorator('fileIds', {})(<DropzoneComponent
                                    config={componentConfig}
                                    eventHandlers={eventHandlers}
                                    djsConfig={djsConfig}/>)}
                            </FormItem>
                            <FormItem
                                {...submitFormLayout}
                                style={{
                                marginTop: 32
                            }}>
                                <Button type="primary" onClick={() => this.submitDeliver()}>
                                    确定
                                </Button>
                                <Button
                                    style={{
                                    marginLeft: 8
                                }}
                                    onClick={() => this.prevStep()}>返回</Button>
                            </FormItem>
                        </Form>
                    </Card>
                </Spin>
            </BlankLayout>
        );
    }
}
