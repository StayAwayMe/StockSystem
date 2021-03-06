import React, { Component } from "react";
import axios from "../../utils/axios.js";
import store from "../../store/index.js";
import { filterHelper } from "../../utils/index.js";
import moment, { isMoment } from "moment";
import {
  PlusOutlined,
  BankOutlined,
  MoneyCollectTwoTone,
  ExclamationCircleOutlined,
  DollarCircleTwoTone,
} from "@ant-design/icons";
import qs from "qs";
import {
  Button,
  message,
  Form,
  Table,
  Pagination,
  Divider,
  Tooltip,
  Modal,
  Input,
  Space,
  DatePicker,
  InputNumber,
  Select,
} from "antd";
import $ from "jquery";
const { Option } = Select;
const { Search } = Input;

const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 16 },
};
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      stocks: [],
      data: [],
      total: 0,
      current: 1,
      loading: false,
      addVisible: false,
      positionVisible: false,
      position_page_id: 1,
      position_data: [],
      position_total: 0,
      shop_buy_visible: false,
      shop_sell_visible: false,
      position_current: 1,
      fastBuy: false,
      fastSell: false,
      buyId: 0,
      sellId: 0,
      allData: [],
      maxPosition: 0,
      allStocks: [],
      buyVisible: false,
    };
    this.formRef = React.createRef();
    this.addModalRef = React.createRef();
    this.shopRef = React.createRef();
    this.fastBuyRef = React.createRef();
    this.fastSellRef = React.createRef();
    this.shop_sell_Ref = React.createRef();
    this.fastVisibleRef = React.createRef();
  }
  initfetch = (page_id) => {
    this.setState({ loading: true });
    axios({
      url: `/v1/stocks?page_id=${page_id - 1}&page_size=10`,
      method: "GET",
      // headers: {
      //   "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      // },
    }).then((res2) => {
      let { list, total } = res2;
      this.setState({ data: list, total, current: page_id, loading: false });
    });
  };
  async componentDidMount() {
    this.buyallData();
    const name = store.getState()["info"];
    this.initfetch(1);
    this.emmm();
    this.setState({ name }, () => {
      message.success("???????????????");
    });
  }
  emmm = () => {
    axios({
      url: `/v1/mine-stocks?page_id=${0}&page_size=99999`,
      method: "GET",
      // data: obj1,
    }).then((res) => {
      const { list } = res;
      this.setState({ allData: list });
    });
  };
  buyallData = () => {
    axios({
      url: `/v1/stocks?page_id=0&page_size=99999`,
      method: "GET",
      // headers: {
      //   "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      // },
    }).then((res2) => {
      const { list } = res2;
      this.setState({ allStocks: list });
    });
  };
  render() {
    const { positionVisible } = this.state;
    const columns = [
      {
        title: "????????????",
        dataIndex: "code",
        filters: filterHelper(this.state.data, "code"),
        onFilter: (value, record) => record.code === value,
      },
      {
        title: "????????????",
        dataIndex: "name",
        filters: filterHelper(this.state.data, "name"),
        onFilter: (value, record) => record.name === value,
      },
      {
        title: "????????????",
        dataIndex: "price",
        align: "center",
        sorter: (a, b) => a.price - b.price,
        render: (text) => {
          if (text > 10) {
            return (
              <p style={{ color: "white", backgroundColor: "red" }}>{text}</p>
            );
          } else {
            return (
              <p style={{ color: "white", backgroundColor: "green" }}>{text}</p>
            );
          }
        },
      },
      {
        title: "?????????",
        dataIndex: "price_limit",
        sorter: (a, b) => a.price_limit - b.price_limit,
        render: (text) => {
          if (text > 1) {
            return <a style={{ color: "red" }}>{text}</a>;
          } else {
            return <a style={{ color: "green" }}>{text}</a>;
          }
        },
      },
      {
        title: "????????????",
        dataIndex: "trading_volume",
        sorter: (a, b) => a.trading_volume - b.trading_volume,
      },
      {
        title: "????????????",
        dataIndex: "trading_total_price",
        filters: filterHelper(this.state.data, "trading_total_price"),
      },
      {
        title: "????????????",
        dataIndex: "created_at",
        render: (text) => {
          text = moment.unix(text).format("YYYY-MM-DD HH:mm:ss");
          return text;
        },
        sorter: (a, b) => a.created_at - b.created_at,
      },
      {
        title: "??????id",
        dataIndex: "id",
        sorter: (a, b) => a.id - b.id,
      },
      {
        title: "??????",
        render: (text, record) => {
          return (
            <a
              onClick={() => {
                this.setState({ fastBuy: true, buyId: record.id }, () => {
                  this.fastBuyRef.current.setFieldsValue({ id: record.id });
                });
              }}
            >
              ????????????
            </a>
          );
        },
      },
    ];
    const position_columns = [
      {
        title: "??????id",
        dataIndex: "id",
        filters: filterHelper(this.state.position_data, "id"),
        onFilter: (value, record) => record.id === value,
      },
      {
        title: "????????????",
        dataIndex: "code",
        filters: filterHelper(this.state.position_data, "code"),
        onFilter: (value, record) => record.code === value,
      },
      {
        title: "????????????",
        dataIndex: "name",
        filters: filterHelper(this.state.position_data, "name"),
        onFilter: (value, record) => record.name === value,
      },
      {
        title: "??????????????????",
        dataIndex: "count",
        sorter: (a, b) => a.count - b.count,
      },

      {
        title: "??????",
        dataIndex: "price",
        sorter: (a, b) => a.price - b.price,
      },
      {
        title: "?????????",
        dataIndex: "trading_total_price",
        sorter: (a, b) => a.trading_total_price - b.trading_total_price,
      },
      {
        title: "????????????",
        dataIndex: "updated_at",
        render: (text) => {
          text = moment.unix(text).format("YYYY-MM-DD HH:mm:ss");
          return text;
        },
        sorter: (a, b) => a.updated_at - b.updated_at,
      },
      {
        title: "????????????",
        dataIndex: "created_at",
        render: (text) => {
          text = moment.unix(text).format("YYYY-MM-DD HH:mm:ss");
          return text;
        },
        sorter: (a, b) => a.created_at - b.created_at,
      },
      {
        title: "????????????",
        render: (text, record) => {
          return (
            <a
              onClick={() => {
                this.setState({ fastSell: true, sellId: record.id }, () => {
                  this.state.allData.map((item) => {
                    if (item.id === record.id) {
                      this.setState({ maxPosition: item.count });
                    }
                  });
                  this.fastSellRef.current.setFieldsValue({ id: record.id });
                });
              }}
            >
              ????????????
            </a>
          );
        },
      },
      {
        title: "????????????",
        render: (text, record) => {
          return (
            <a
              onClick={() => {
                let id = 0;
                this.state.allStocks.map((item) => {
                  if (item.name === record.name) {
                    id = item.id;
                  }
                });
                if (id == 0) {
                  message.success("????????????");
                } else {
                  this.setState({ buyVisible: true }, () => {
                    this.fastVisibleRef.current.setFieldsValue({ id });
                  });
                }
              }}
            >
              ????????????
            </a>
          );
        },
      },
    ];
    return (
      <div>
        <div className="site-layout-background" style={{ padding: 24 }}>
          <Divider>~~~????????????~~~</Divider>
          <Form
            name="horizontal_login"
            layout="inline"
            ref={this.formRef}
            onFinish={async() => {
              this.initfetch(1);
              this.setState({ current: 1 });
              await axios({
                url: `/v1/mine-stocks?page_id=1&page_size=10`,
                method: "GET",
                // data: obj1,
              }).then((res) => {
                let { list, total } = res;
                this.setState(
                  {
                    position_total: total,
                    position_data: list,
                    position_current: 1,
                  },
                  () => {
                    message.success("???????????????");
                  }
                );
              });
            }}
          >
            <Form.Item>
              <Button htmlType="submit" type="primary">
                ??????
              </Button>
            </Form.Item>
          </Form>
        </div>
        <div
          className="site-layout-background"
          style={{ padding: 24, marginTop: 10 }}
        >
          <Table
            size={"small"}
            title={() => {
              return (
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div>??????????????????</div>
                  <div span={2} style={{ float: "right" }}>
                    <Space size="large">
                      <Tooltip title="??????????????????">
                        <PlusOutlined
                          style={{ fontSize: "16px", cursor: "pointer" }}
                          onClick={() => {
                            this.setState({
                              addVisible: true,
                            });
                          }}
                        />
                      </Tooltip>
                      <Tooltip title="????????????">
                        <BankOutlined
                          onClick={() => {
                            this.setState({ positionVisible: true }, () => {
                              let page_id = this.state.position_page_id || 1;
                              let obj = {
                                page_id,
                                page_size: 10,
                              };
                              axios({
                                url: `/v1/mine-stocks`,
                                method: "GET",
                                data: obj,
                              }).then((res) => {
                                let { list, total } = res;
                                this.setState(
                                  {
                                    position_total: total,
                                    position_data: list,
                                  },
                                  () => {
                                    message.success("?????????????????????");
                                  }
                                );
                              });
                            });
                          }}
                        />
                      </Tooltip>
                    </Space>
                  </div>
                </div>
              );
            }}
            columns={columns}
            dataSource={this.state.data}
            rowKey="id"
            showSorterTooltip={true}
            loading={this.state.loading}
            pagination={false}
          />
          <Pagination
            current={this.state.current}
            onChange={(a, b, c) => {
              this.initfetch(a);
            }}
            total={this.state.total}
            showTotal={(total, range) =>
              `????????????${range[0]}-${range[1]}??? ?????? ${total} ???`
            }
          />
          ;
          <Modal
            visible={this.state.addVisible}
            style={{ width: "20vw" }}
            title="??????????????????"
            onOk={() => {
              this.addModalRef.current.submit();
            }}
            onCancel={() => {
              this.setState({ addVisible: false });
            }}
          >
            <Form
              {...layout}
              name="basic"
              ref={this.addModalRef}
              onFinish={(values) => {
                let {
                  name,
                  code,
                  created_at,
                  price,
                  price_limit,
                  trading_volume,
                } = values;
                price = price - 0;
                price_limit = price_limit - 0;
                created_at = moment(created_at).format("x") - 0;
                trading_volume = trading_volume - 0;
                let trading_total_price = price * trading_volume;
                let obj = {
                  ...values,
                  price,
                  price_limit,
                  created_at,
                  trading_volume,
                  trading_total_price,
                };
                axios({
                  url: `/v1/stocks/init`,
                  method: "POST",
                  data: qs.parse(obj),
                }).then((res2) => {
                  // let { list, total } = res2;
                  this.setState({ addVisible: false }, () => {
                    this.initfetch(1);
                  });
                });
              }}
            >
              <div
                style={
                  {
                    // display: "flex",
                    // justifyContent: "space-between",
                    // width: "88%",
                    // marginLeft: "20px",
                  }
                }
              >
                <Form.Item
                  label="????????????"
                  name="code"
                  rules={[
                    { required: true, message: "??????????????????????????????????????????" },
                  ]}
                >
                  <Input style={{ width: "15vw" }} />
                </Form.Item>
              </div>
              <Form.Item
                label="????????????"
                name="name"
                /*style={{ display: "none" }}*/
                rules={[{ required: true, message: "?????????????????????!" }]}
              >
                <Input style={{ width: "15vw" }} />
              </Form.Item>
              <Form.Item
                label="??????"
                name="price"
                rules={[{ required: true, message: "???????????????" }]}
              >
                <Input style={{ width: "15vw" }}></Input>
              </Form.Item>
              <Form.Item
                label="?????????"
                name="price_limit"
                rules={[
                  {
                    required: true,
                    message: "??????????????????",
                  },
                ]}
              >
                <Input style={{ width: "15vw" }} />
              </Form.Item>
              <Form.Item
                label="????????????"
                name="trading_volume"
                rules={[
                  {
                    required: true,
                    pattern: new RegExp(/(^[\-0-9][0-9]*(\.[0-9]+)?)$/),
                    message: "????????????????????????????????????",
                  },
                ]}
              >
                <Input style={{ width: "15vw" }} />
              </Form.Item>
              <Form.Item
                label="????????????"
                name="created_at"
                // rules={[{ required: true, pattern: new RegExp(/(^[\-0-9][0-9]*(\.[0-9]+)?)$/), message: '????????????????????????????????????' }]}
              >
                <DatePicker style={{ width: "15vw" }} />
              </Form.Item>
            </Form>
          </Modal>
          <Modal
            visible={this.state.positionVisible}
            width={"80%"}
            title="????????????"
            onOk={() => {
              this.setState({ positionVisible: false });
            }}
            onCancel={() => {
              this.setState({ positionVisible: false });
            }}
          >
            <Table
              size={"small"}
              title={() => (
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div>????????????????????????</div>
                  <div span={2} style={{ float: "right" }}>
                    <Space size="large">
                      <Tooltip title="????????????">
                        <MoneyCollectTwoTone
                          style={{ fontSize: "16px", cursor: "pointer" }}
                          onClick={() => {
                            this.setState({ shop_buy_visible: true });
                          }}
                        />
                      </Tooltip>
                      <Tooltip title="????????????">
                        <DollarCircleTwoTone
                          style={{ fontSize: "16px", cursor: "pointer" }}
                          onClick={() => {
                            this.setState({ shop_sell_visible: true });
                          }}
                        />
                      </Tooltip>
                    </Space>
                  </div>
                </div>
              )}
              pagination={false}
              rowKey="id"
              columns={position_columns}
              dataSource={this.state.position_data}
            />
            <Pagination
              current={this.state.position_current}
              onChange={(page_id) => {
                axios({
                  url: `/v1/mine-stocks?page_id=${page_id - 1}&page_size=10`,
                  method: "GET",
                  // data: obj1,
                }).then((res) => {
                  let { list, total } = res;
                  this.setState({
                    position_total: total,
                    position_data: list,
                    position_current: page_id,
                  });
                });
              }}
              total={this.state.position_total}
              showTotal={(total, range) =>
                `????????????${range[0]}-${range[1]}??? ?????? ${total} ???`
              }
            />
          </Modal>
          <Modal
            title="????????????"
            width={"30%"}
            visible={this.state.shop_buy_visible}
            onOk={() => {
              // this.setState({ shop_buy_visible: false });
              const { id, count } = this.shopRef.current.getFieldsValue();
              if (!id || !count) {
                message.error("???????????????id?????????");
              } else {
                let obj = {
                  id,
                  count: count - 0,
                };
                Modal.confirm({
                  title: "????????????",
                  icon: <ExclamationCircleOutlined />,
                  content: "?????????????????????",
                  onOk: async () => {
                    console.log("OK");
                    await axios({
                      url: `/v1/stocks`,
                      method: "POST",
                      data: qs.parse(obj),
                    }).then((res) => {
                      message.success(
                        {
                          content: `??????${res.created_user_id}????????????${res.count}???< ${res.name} >???????????????${res.count}`,
                          className: "custom-class",
                          style: {
                            position: "fixed",
                            top: 0,
                            right: 0,
                            height: "",
                          },
                        },
                        2000
                      );
                    });
                    let page_id = this.state.position_page_id || 1;
                    let obj1 = {
                      page_id,
                      page_size: 10,
                    };
                    await axios({
                      url: `/v1/mine-stocks`,
                      method: "GET",
                      data: obj1,
                    }).then((res2) => {
                      const { total, list } = res2;
                      this.setState(
                        {
                          position_total: total,
                          position_data: list,
                          shop_buy_visible: false,
                          position_current: 1,
                        },
                        () => {
                          this.shopRef.current.resetFields();
                        }
                      );
                    });
                  },
                  onCancel() {
                    console.log("Cancel");
                  },
                });
              }
            }}
            onCancel={() => {
              this.setState({ shop_buy_visible: false });
            }}
          >
            <Form ref={this.shopRef} onFinish={(value) => {}} {...layout}>
              <Form.Item
                name="id"
                label="??????id"
                rules={[{ required: true, message: "????????????id???" }]}
              >
                {/* <Input placeholder="???????????????id" style={{ width: "20vw" }} /> */}
                <Select
                  style={{ width: "20vw" }}
                  // onChange={(res)=>{
                  //   this.state.allStocks.map(item=>{
                  //     if(item.id==res){
                  //       // this.setState({maxPosition:item.count});
                  //     }
                  //   })
                  // }}
                >
                  {this.state.allStocks.map((item) => (
                    <Option label={item.name} value={item.id} key={item.id}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name={"count"}
                label="????????????(???)"
                rules={[{ required: true, message: "??????????????????" }]}
              >
                <InputNumber min={100} style={{ width: "20vw" }} />
              </Form.Item>
            </Form>
          </Modal>
          <Modal
            title="??????"
            width={"50%"}
            visible={this.state.shop_sell_visible}
            onOk={() => {
              const { id, count } = this.shop_sell_Ref.current.getFieldsValue();
              if (!id || !count) {
                message.error("???????????????id?????????");
              } else {
                let obj = {
                  id,
                  count: count - 0,
                };
                Modal.confirm({
                  title: "????????????",
                  icon: <ExclamationCircleOutlined />,
                  content: "?????????????????????",
                  onOk: async () => {
                    console.log("OK");
                    await axios({
                      url: `/v1/mine-stocks`,
                      method: "PUT",
                      // data:qs.parse(obj),
                      // data:obj,
                      data: qs.stringify(obj),
                    }).then((res) => {
                      this.emmm();
                      message.success(
                        {
                          content: `??????${res.created_user_id}??????${count}???< ${res.name} >???????????????${res.count}`,
                          className: "custom-class",
                          style: {
                            position: "fixed",
                            top: 0,
                            right: 0,
                            height: "",
                          },
                        },
                        2000
                      );
                    });
                    let page_id = this.state.position_page_id || 1;
                    let obj1 = {
                      page_id,
                      page_size: 10,
                    };
                    await axios({
                      url: `/v1/mine-stocks`,
                      method: "GET",
                      data: obj1,
                    }).then((res2) => {
                      const { total, list } = res2;
                      this.setState(
                        {
                          position_total: total,
                          position_data: list,
                          position_current: 1,
                          shop_sell_visible: false,
                        },
                        () => {
                          message.success("????????????");
                          this.shop_sell_Ref.current.resetFields();
                        }
                      );
                    });
                  },
                  onCancel() {},
                });
              }
            }}
            onCancel={() => {
              this.setState({ shop_sell_visible: false });
            }}
          >
            <Form ref={this.shop_sell_Ref} onFinish={(value) => {}} {...layout}>
              <Form.Item
                name="id"
                label="????????????"
                rules={[{ required: true, message: "????????????id???" }]}
              >
                {/* <Input placeholder="???????????????id" style={{ width: "20vw" }} /> */}
                {/* <Search allowClear placeholder="input search text" onSearch={()=>{}} style={{ width: 200 }} /> */}

                <Select
                  style={{ width: "20vw" }}
                  onChange={(res) => {
                    this.state.allData.map((item) => {
                      if (item.id == res) {
                        this.setState({ maxPosition: item.count });
                      }
                    });
                  }}
                >
                  {this.state.allData.map((item) => (
                    <Option label={item.name} value={item.id} key={item.id}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name={"count"}
                label="????????????(???)"
                rules={[{ required: true, message: "??????????????????" }]}
              >
                <InputNumber
                  max={this.state.maxPosition}
                  min={1}
                  style={{ width: "20vw" }}
                />
              </Form.Item>
            </Form>
          </Modal>
          <Modal
            title="????????????"
            visible={this.state.fastBuy}
            onOk={() => {
              // this.setState({ fastBuy: false });
              const { id, count } = this.fastBuyRef.current.getFieldsValue();
              let obj = {
                id,
                count: count - 0,
              };
              Modal.confirm({
                title: "????????????",
                icon: <ExclamationCircleOutlined />,
                content: "?????????????????????",
                onOk: async () => {
                  console.log("OK");
                  await axios({
                    url: `/v1/stocks`,
                    method: "POST",
                    data: qs.parse(obj),
                  }).then((res) => {
                    this.emmm();
                    message.success(
                      {
                        content: `??????${res.created_user_id}????????????${count}???< ${res.name} >???????????????${res.count}`,
                        className: "custom-class",
                        style: {
                          position: "fixed",
                          top: 0,
                          right: 0,
                          height: "",
                        },
                      },
                      2000
                    );
                  });
                  let page_id = this.state.position_page_id || 1;
                  let obj1 = {
                    page_id,
                    page_size: 10,
                  };
                  await axios({
                    url: `/v1/mine-stocks`,
                    method: "GET",
                    data: obj1,
                  }).then((res2) => {
                    this.setState({ fastBuy: false }, () => {
                      this.fastBuyRef.current.resetFields();
                    });
                  });
                },
                onCancel() {},
              });
            }}
            onCancel={() => {
              this.setState({ fastBuy: false });
            }}
          >
            <Form {...layout} name="fastBuy" ref={this.fastBuyRef}>
              <Form.Item
                name={"id"}
                label="??????id"
                // rules={[{ required: true, message: "??????id" }]}
              >
                {/* <Input disabled style={{ width: "20vw" }} /> */}
                <Select
                  style={{ width: "20vw" }}
                  onChange={(res) => {
                    // this.state.allData.map(item=>{
                    //   if(item.id==res){
                    //     this.setState({maxPosition:item.count});
                    //   }
                    // })
                  }}
                  disabled
                >
                  {this.state.allStocks.map((item) => (
                    <Option label={item.name} value={item.id} key={item.id}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name={"count"}
                label="????????????(???)"
                rules={[{ required: true, message: "??????????????????" }]}
              >
                <InputNumber min={100} style={{ width: "20vw" }} />
              </Form.Item>
            </Form>
          </Modal>
          <Modal
            title="????????????"
            visible={this.state.fastSell}
            onOk={() => {
              const { id, count } = this.fastSellRef.current.getFieldsValue();
              let obj = {
                id,
                count: count - 0,
              };
              Modal.confirm({
                title: "????????????",
                icon: <ExclamationCircleOutlined />,
                content: `?????????????????????`,
                onOk: async () => {
                  console.log("OK");
                  await axios({
                    url: `/v1/mine-stocks`,
                    method: "PUT",
                    // data:qs.parse(obj),
                    // data:obj,
                    data: qs.stringify(obj),
                  }).then((res) => {
                    console.log(res, "res");
                    message.success(
                      {
                        content: `??????${res.created_user_id}??????${count}???< ${res.name} >???????????????${res.count}`,
                        className: "custom-class",
                        style: {
                          position: "fixed",
                          top: 0,
                          right: 0,
                          height: "",
                        },
                      },
                      2000
                    );
                  });
                  let page_id = this.state.position_page_id || 1;
                  let obj1 = {
                    page_id,
                    page_size: 10,
                  };
                  await axios({
                    url: `/v1/mine-stocks`,
                    method: "GET",
                    data: obj1,
                  }).then((res2) => {
                    const { total, list } = res2;
                    console.log(res2, "res2");
                    this.setState(
                      {
                        fastSell: false,
                        position_data: list,
                        position_total: total,
                      },
                      () => {
                        this.fastSellRef.current.resetFields();
                      }
                    );
                  });
                },
              });
            }}
            onCancel={() => {
              this.setState({ fastSell: false });
            }}
          >
            <Form {...layout} name="fastSell" ref={this.fastSellRef}>
              <Form.Item
                name={"id"}
                label="??????id"
                // rules={[{ required: true, message: "??????id" }]}
              >
                <Select
                  style={{ width: "20vw" }}
                  onChange={(res) => {
                    console.log(res, "res");
                    this.state.allData.map((item) => {
                      if (item.id == res) {
                        this.setState({ maxPosition: item.count }, () => {
                          console.log(this.state.maxPosition, "max");
                        });
                      }
                    });
                  }}
                  disabled
                >
                  {this.state.allData.map((item) => (
                    <Option label={item.name} value={item.id} key={item.id}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
                {/* <Input disabled style={{ width: "20vw" }} /> */}
              </Form.Item>
              <Form.Item
                name={"count"}
                label="????????????(???)"
                rules={[{ required: true, message: "??????????????????" }]}
              >
                <InputNumber
                  min={0}
                  max={this.state.maxPosition}
                  style={{ width: "20vw" }}
                />
              </Form.Item>
            </Form>
          </Modal>
          <Modal
            title="????????????"
            visible={this.state.buyVisible}
            onOk={() => {
              // this.setState({ fastBuy: false });
              const { id, count } =
                this.fastVisibleRef.current.getFieldsValue();

              let obj = {
                id,
                count: count - 0,
              };
              Modal.confirm({
                title: "????????????",
                icon: <ExclamationCircleOutlined />,
                content: "?????????????????????",
                onOk: async () => {
                  console.log("OK");
                  await axios({
                    url: `/v1/stocks`,
                    method: "POST",
                    data: qs.parse(obj),
                  }).then((res) => {
                    this.emmm();
                    message.success(
                      {
                        content: `??????${res.created_user_id}????????????${count}???< ${res.name} >???????????????${res.count}`,
                        className: "custom-class",
                        style: {
                          position: "fixed",
                          top: 0,
                          right: 0,
                          height: "",
                        },
                      },
                      2000
                    );
                  });
                  let page_id = this.state.position_page_id || 1;
                  let obj1 = {
                    page_id,
                    page_size: 10,
                  };
                  await axios({
                    url: `/v1/mine-stocks`,
                    method: "GET",
                    data: obj1,
                  }).then((res2) => {
                    const { list, total } = res2;
                    this.setState(
                      {
                        buyVisible: false,
                        position_data: list,
                        position_total: total,
                      },
                      () => {
                        this.fastVisibleRef.current.resetFields();
                      }
                    );
                  });
                },
                onCancel() {},
              });
            }}
            onCancel={() => {
              this.setState({ buyVisible: false });
            }}
          >
            <Form {...layout} name="fastVisibleRef" ref={this.fastVisibleRef}>
              <Form.Item
                name={"id"}
                label="??????id"
                // rules={[{ required: true, message: "??????id" }]}
              >
                {/* <Input disabled style={{ width: "20vw" }} /> */}
                <Select
                  style={{ width: "20vw" }}
                  onChange={(res) => {}}
                  disabled
                >
                  {this.state.allStocks.map((item) => (
                    <Option label={item.name} value={item.id} key={item.id}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name={"count"}
                label="????????????(???)"
                rules={[{ required: true, message: "??????????????????" }]}
              >
                <InputNumber min={100} style={{ width: "20vw" }} />
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </div>
    );
  }
}
export default Home;
