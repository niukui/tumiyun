import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
    Card,
    Button,
    message,
    Divider,
} from 'antd';
import StandardTable from 'components/StandardTable';
import BlankLayout from '../../layouts/BlankLayout';
import {getDateString} from '../../utils/utils';

import styles from './List.less';

@connect(({ receive, loading }) => ({
    receive,
    loading: loading.models.receive,
}))
export default class TableList extends PureComponent {
    state = {
    };

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'receive/fetch',
        });
    }

    handleStandardTableChange = (pagination, filtersArg, sorter) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'receive/page',
            payload: pagination
        });
    };

    render() {
        const { receive: { data }, loading } = this.props;
        const { modalVisible } = this.state;

        const columns = [
            {
                title: '任务编号',
                dataIndex: 'taskId',
                render: val => <span>{val}</span>,
            },
            {
                title: '交付方',
                dataIndex: 'delivererTrueName',
                render: val => <span>{val}</span>,
            },
            {
                title: '时间',
                align:'center',
                dataIndex: 'taskCreateTime',
                render: val => <span>{getDateString(val)}</span>,
            },
            {
                title: '交付物类型',
                align:'center',
                dataIndex: 'contentType',
                render: val => val&&val.length&&val[0]!==""?val[0]:"图片",
            },
            {
                title: '版权信息',
                align:'center',
                dataIndex: 'copyrightInfo',
                render: val => <span>{["未登录", "本人", "对方"][parseInt(val)]}</span>,
            },
            {
                title: '数量',
                align:'center',
                dataIndex: 'contentCount',
                render: val => <span>{val}</span>,
            },
            {
                title: '状态',
                align:'center',
                dataIndex: 'taskStatus',
                render: val => <span>{["未接收", "已接收"][parseInt(val)]}</span>,
            },
            {
                title: '操作',
                render: (data) => (
                    <Fragment>
                        <a href={"#/receive/details/"+encodeURIComponent(data.taskId)}>查看</a>
                        <Divider type="vertical" />
                    </Fragment>
                ),
            },
        ];

        return (
            <BlankLayout>
                <Card bordered={false}>
                    <div className={styles.tableList}>
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
