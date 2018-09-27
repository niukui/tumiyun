import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Divider, Upload, Icon, message, Spin, Modal, Row, Col } from 'antd';
import BlankLayout from '../../layouts/BlankLayout';
import styles from './Details.less';
import {getDateString} from '../../utils/utils';

const copyrightInfos = ["未登录", "本人", "对方"];
const taskStatus = ["未接收", "已接收"];

@connect(({ receive, loading }) => ({
    receive,
    loading: loading.models.receive,
}))
export default class Details extends Component {

    state = {
        previewVisible: false,
        previewImage: ''
    }

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'receive/get',
            payload: this.props.match.params.id
        });
    }

    componentWillReceiveProps(nextProps) {
        if (!nextProps.receive.getOk && this.props.receive.getOk !== nextProps.receive.getOk) {
            if (nextProps.receive.message) {
                message.error(nextProps.receive.message);
            }
        }
    }

    handleFilesCancel = () => this.setState({ previewVisible: false })

    handleFilesPreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    }

    render() {
        const { receive, loading } = this.props;

        const { previewVisible, previewImage, } = this.state;

        let fileList = receive.fileList.map(function (val, key) {
            return {
                uid: val.fileId,
                name: val.fileName,
                status: 'done',
                url: val.fileUrl,
            };
        });


        return (
            <BlankLayout title="">
                <Spin spinning={loading}>
                    <Card bordered={false} title="">
                        <Row gutter={24}>
                            <Col span={8}>
                                <div className={styles.term}>任务编号</div>
                                <div className={styles.detail}>{receive.task.taskId}</div>
                            </Col>
                            <Col span={8}>
                                <div className={styles.term}>交付方</div>
                                <div className={styles.detail}>{receive.task.delivererTrueName}</div>
                            </Col>
                            <Col span={8}>
                                <div className={styles.term}>时间</div>
                                <div className={styles.detail}>{getDateString(receive.task.taskCreateTime)}</div>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={8}>
                                <div className={styles.term}>类型</div>
                                <div className={styles.detail}>{receive.task.contentType&&receive.task.contentType[0]}</div>
                            </Col>
                            <Col span={8}>
                                <div className={styles.term}>数量</div>
                                <div className={styles.detail}>{receive.task.contentCount}</div>
                            </Col>
                            <Col span={8}>
                                <div className={styles.term}>备注</div>
                                <div className={styles.detail}>{receive.task.taskRemark}</div>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={8}>
                                <div className={styles.term}>当前状态</div>
                                <div className={styles.detail}>{taskStatus[parseInt(receive.task.taskStatus)]}</div>
                            </Col>
                            <Col span={8}>
                                <div className={styles.term}>版权信息</div>
                                <div className={styles.detail}>{copyrightInfos[parseInt(receive.task.copyrightInfo)]}</div>
                            </Col>
                        </Row>
                    </Card>
                    <Divider style={{ marginBottom: 32 }} />
                    <Card bordered={false} title="文件柜" extra={<a href="#/blockchains">查看区块链版权</a>}>
                        <div className="clearfix">
                            <Upload
                                listType="picture-card"
                                fileList={fileList}
                                onPreview={this.handleFilesPreview}
                                onChange={this.handleFilesChange}
                                showUploadList={{ showRemoveIcon: false }}
                            >
                            </Upload>
                            <Modal visible={previewVisible} footer={null} onCancel={this.handleFilesCancel}>
                                <img alt="example" style={{ width: '100%' }} src={previewImage} />
                            </Modal>
                        </div>
                    </Card>
                </Spin>
            </BlankLayout>
        );
    }
}
