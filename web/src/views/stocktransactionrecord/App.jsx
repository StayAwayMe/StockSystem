import React from "react";
import {
    Button,
    message,
    Form,
    Table,
    Pagination,
    Divider,
    List,
    Tooltip,
    Modal,
    Input,
    Space,
    DatePicker,
    InputNumber,
    Drawer,
    Collapse,
    Select,
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "../../utils/axios.js";
import { useEffect, useState, useRef } from "react";
import { filterHelper } from "../../utils";
import moment from "moment";
const { confirm } = Modal;
import qs from 'qs'
const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 16 },
};
export default function App() {
    const [recorddata, setRecordData] = useState([]);
    const [total, setTotal] = useState(0);
    const [stockdata, setStockData] = useState([]);
    const [gooodcurrent, setgoodCurrent] = useState(0);
    const [size, setSize] = useState(10);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedRows, setSelectRows] = useState([]);
    const [patchVisible, setPatchVisible] = useState(false);
    const formRef = useRef(null);

    const initFetch = (page_id = 0, page_size = 10) => {
        // /v1/transactions
        axios({
            url: `/v1/transactions?page_id=${page_id}&page_size=${page_size}`,
            method: "GET",
        }).then((res) => {
            let { list, total } = res;
            list.map((item) => {
                item.type_Chinese = item.type === 1 ? "买入" : "卖出";
            });
            setRecordData(list);
            setTotal(total);
        });
    };
    const getStocksData = () => {
        axios({
            url: `/v1/stocks?page_id=${0}&page_size=999999`,
            method: "GET",
            // headers: {
            //   "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            // },
        }).then((res2) => {
            let { list, total } = res2;
            setStockData(list);
        });
    };
    useEffect(() => {
        getStocksData();
        initFetch();
    }, []);
    useEffect(() => {
        if (patchVisible) {
            let obj = selectedRows[0];
            formRef.current.setFieldsValue({ ...obj });
        }
    }, [patchVisible]);

    const columns = [
        {
            title: "股票代码",
            dataIndex: "code",
            filters: filterHelper(recorddata, "code"),
            onFilter: (value, record) => record.code === value,
        },
        {
            title: "股票名称",
            dataIndex: "name",
            filters: filterHelper(recorddata, "name"),
            onFilter: (value, record) => record.name === value,
        },
        {
            title: "价格",
            dataIndex: "price",
            sorter: (a, b) => a.price - b.price,
            render: (text, record) => {
                if (record.type === 1) {
                    return <a style={{ color: "red" }}>{text}</a>;
                } else if (record.type === 2) {
                    return <a style={{ color: "green" }}>{text}</a>;
                }
            },
        },
        {
            title: "交易数量",
            dataIndex: "count",
            sorter: (a, b) => a.count - b.count,
            render: (text, record) => {
                if (record.type === 1) {
                    return <a style={{ color: "red" }}>{text}</a>;
                } else if (record.type === 2) {
                    return <a style={{ color: "green" }}>{text}</a>;
                }
            },
        },
        {
            title: "交易总价",
            dataIndex: "trading_total_price",
            sorter: (a, b) => a.trading_total_price - b.trading_total_price,
            render: (text, record) => {
                if (record.type === 1) {
                    return <a style={{ color: "red" }}>{text}</a>;
                } else if (record.type === 2) {
                    return <a style={{ color: "green" }}>{text}</a>;
                }
            },
        },
        {
            title: "交易类型",
            dataIndex: "type_Chinese",
            filters: filterHelper(recorddata, "type_Chinese"),
            onFilter: (value, record) => record.type_Chinese === value,
        },
        {
            title: "创建时间",
            dataIndex: "created_at",
            render: (text) => {
                text = moment.unix(text).format("YYYY-MM-DD HH:mm:ss");
                return text;
            },
            sorter: (a, b) => a.created_at - b.created_at,
        },
        {
            title: "更新时间",
            dataIndex: "updated_at",
            render: (text) => {
                text = moment.unix(text).format("YYYY-MM-DD HH:mm:ss");
                return text;
            },
            sorter: (a, b) => a.updated_at - b.updated_at,
        },
    ];
    return (
        <>
            <div className="site-layout-background" style={{ padding: 24 }}>
                <Divider>~~~股票交易记录录入~~~</Divider>
            </div>
            <div className="site-layout-background" style={{ padding: 24 }}>
                <Table
                    dataSource={recorddata}
                    columns={columns}
                    pagination={false}
                    size={"small"}
                    title={() => (
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <div>股票交易记录表</div>
                            <Space size={"large"}>
                                <Tooltip title="删除交易记录">
                                    <DeleteOutlined
                                        style={{ fontSize: "16px", cursor: "pointer" }}
                                        onClick={() => {
                                            let obj = {
                                                id: selectedRowKeys[0],
                                            };
                                            confirm({
                                                title: "删除记录",
                                                icon: <DeleteOutlined />,
                                                content: `是否要删除记录`,
                                                onOk() {
                                                    axios({
                                                        url: `/v1/transactions`,
                                                        method: "DELETE",
                                                        // data:qs.parse(obj),
                                                        // data:obj,
                                                        data: obj,
                                                    }).then(() => {
                                                        initFetch();
                                                    });
                                                },
                                                onCancel() {
                                                },
                                            });
                                        }}
                                    />
                                </Tooltip>
                                <Tooltip title="修改交易记录">
                                    <EditOutlined
                                        style={{ fontSize: "16px", cursor: "pointer" }}
                                        onClick={() => {
                                            if (selectedRowKeys.length !== 1) {
                                                if (selectedRowKeys.length === 0) {
                                                    message.error("您还没有选择交易记录！");
                                                } else {
                                                    message.error("不能选择多条交易记录进行修改");
                                                }
                                            } else {
                                                setPatchVisible(true);
                                            }
                                        }}
                                    />
                                </Tooltip>
                            </Space>
                        </div>
                    )}
                    rowSelection={{
                        type: "checkbox",
                        selectedRowKeys: selectedRowKeys,
                        onChange: (selectedRowKeys, selectedRows) => {
                            setSelectedRowKeys(selectedRowKeys);
                            setSelectRows(selectedRows);
                        },
                    }}
                    rowKey="id"
                />
                <br />
                <Pagination
                    total={total}
                    onChange={(current, size) => {
                        setgoodCurrent(current);
                        setSize(size);
                        initFetch(current - 1, size);
                    }}
                ></Pagination>
                <Modal
                    visible={patchVisible}
                    onOk={() => {
                        let obj = formRef.current.getFieldsValue()
                        Modal.confirm({
                            title: "修改记录",
                            icon: <EditOutlined />,
                            content: "是否修改该条记录？",
                            onOk: ()=>{
                                axios({
                                    url:`/v1/transactions`,
                                    method:'PUT',
                                    data:qs.parse(obj)
                                }).then((res)=>{
                                    initFetch();
                                    message.success('修改交易记录成功！')
                                    setPatchVisible(false)
                                    setSelectedRowKeys([])
                                })
                            },
                            onCancel() {

                            },
                          });
                        
                    }}
                    title="修改交易记录"
                    onCancel={() => {
                        setPatchVisible(false);
                    }}
                >
                    <Form {...layout} name="patch" ref={formRef}>
                        <Form.Item name="code" label="股票代码">
                            <Input disabled style={{ width: "20vw" }}></Input>
                        </Form.Item>
                        <Form.Item name="name" label="股票名称">
                            <Input disabled style={{ width: "20vw" }}></Input>
                        </Form.Item>
                        <Form.Item name="count" label="数量"
                        rules={[{ required: true, message: "请输入数量！" }]}
                        
                        >
                            <InputNumber
                                min={1}
                                style={{ width: "20vw" }}
                                onBlur={() => {
                                    let {price,count,trading_total_price} = formRef.current.getFieldsValue()
                                    let  total = price*count
                                    formRef.current.setFieldsValue({trading_total_price:total})
                                 }}
                            ></InputNumber>
                        </Form.Item>
                        <Form.Item name="price" 
                        rules={[{ required: true, message: "请输入价格！" }]}
                        label="价格">
                            <InputNumber
                                min={0}
                                style={{ width: "20vw" }}
                                onBlur={() => {
                                    let {price,count,trading_total_price} = formRef.current.getFieldsValue()
                                    let  total = price*count
                                    formRef.current.setFieldsValue({trading_total_price:total})
                                 }}
                            ></InputNumber>
                        </Form.Item>
                        <Form.Item name="trading_total_price" label="成交价格">
                            <InputNumber disabled style={{ width: "20vw" }}></InputNumber>
                        </Form.Item>
                        <Form.Item name="type" label="交易类型">
                            <Select style={{ width: "20vw" }}>
                                <Select.Option value={1}>买入</Select.Option>
                                <Select.Option value={2}>卖出</Select.Option>
                            </Select>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </>
    );
}
