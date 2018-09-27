import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
    Card,
    Button,
    message,
    Divider,
    Modal,
} from 'antd';
import StandardTable from 'components/StandardTable';
import BlankLayout from '../../layouts/BlankLayout';
import {getDateString} from '../../utils/utils';
import { getAuthority } from '../../utils/authority';

import styles from './List.less';

const confirm = Modal.confirm;

@connect(({ delivery, loading }) => ({
    delivery,
    loading: loading.models.delivery,
}))
export default class TableList extends PureComponent {
    state = {
    };

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'delivery/fetch',
        });
    }

    handleStandardTableChange = (pagination, filtersArg, sorter) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'delivery/page',
            payload: pagination
        });
    };

    gotoCreate = () => {
        var authority  =getAuthority();
        var self = this;
        if(authority.name || authority.corpName){
            self.props.history.push("deliver/create");
        }else{
            confirm({
                title: '您当前未实名认证，请进行实名认证。',
                onOk() {
                    self.props.history.push("account");
                },
                okText: '确认',
                cancelText: '取消',
                iconType:"exclamation-circle"
              });
        }
    };

    render() {
        const { delivery: { data }, loading } = this.props;

        const columns = [
            {
                title: '任务编号',
                dataIndex: 'taskId',
                render: val => <span>{val}</span>,
            },
            {
                title: '接收方',
                dataIndex: 'acceptorTrueName',
                render: val => <span>{val}</span>,
            },
            {
                title: '时间',
                dataIndex: 'taskCreateTime',
                align:'center',
                render: val => <span>{getDateString(val)}</span>,
            },
            {
                title: '交付物类型',
                dataIndex: 'contentType',
                align:'center',
                render: val => val&&val.length&&val[0]!==""?val[0]:"图片",
            },
            {
                title: '版权信息',
                dataIndex: 'copyrightInfo',
                align:'center',
                render: val => <span>{["未登录", "本人", "对方"][parseInt(val)]}</span>,
            },
            {
                title: '数量',
                dataIndex: 'contentCount',
                align:'center',
                render: val => <span>{val}</span>,
            },
            {
                title: '状态',
                dataIndex: 'taskStatus',
                align:'center',
                render: val => <span>{["未接收", "已接收"][parseInt(val)]}</span>,
            },
            {
                title: '操作',
                render: (data) => (
                    <Fragment>
                        <a href={"#/deliver/details/"+encodeURIComponent(data.taskId)}>查看</a>
                        <Divider type="vertical" />
                    </Fragment>
                ),
            },
        ];

        return (
            <BlankLayout>
                <Card bordered={false}>
                    <div className={styles.tableList}>

                        <div className={styles.tableListOperator}>
                            <Button icon="plus" type="primary" onClick={() => this.gotoCreate()}>
                                新建
              </Button>
                        </div>
                        <StandardTable
                            loading={loading}
                            data={data}
                            rowKey="taskId"
                            columns={columns}
                            onChange={this.handleStandardTableChange}
                        />
                    </div>
                </Card>
            </BlankLayout>
        );
    }
}
