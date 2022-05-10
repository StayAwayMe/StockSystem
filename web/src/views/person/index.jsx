import React from "react";
import {
  Avatar,
  Button,
  Card,
  Col,
  Divider,
  List,
  message,
  Row,
  Space,
  Tag,
} from "antd";
import Meta from "antd/es/card/Meta";
import store from "../../store/index.js";
import qs from "qs";
import moment from "moment";
import axios from "../../utils/axios.js";
import _ from "lodash";
class LeftContent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      info: {},
      goo: [],
      hideBtn: "隐藏余额",
      hide: 0,
      hideText: "",
    };
  }
  initfetch = () => {
    axios({
      url: "/ping",
      method: "get",
    }).then((res) => {
      const [status] = res.request.header.Connection;
      this.setState({ goo: status });
    });
    let info = document.cookie;
    info = qs.parse(info);
    this.setState(
      {
        info,
      },
      () => {
        let balance = info.balance + "";
        let aaa = "*";
        //  balance.map(item=>{
        //    aaa+="*"
        //  })
        for (let i = 0; i < balance.length; i++) {
          aaa += "*";
        }
        this.setState({ hideText: aaa });
      }
    );
  };
  async componentDidMount() {
    this.initfetch();
  }
  render() {
    const { info, goo, hide, hideBtn, hideText } = this.state;
    return (
      <div style={{ display: "flex" }}>
        <Card className="contentCenter" style={{ height: "auto", flex: 1 }}>
          <Meta
            id="userImage"
            className="contentCenter"
            style={{ marginTop: "10px", marginLeft: "48%" }}
            avatar={
              <Avatar
                style={{ width: "100px", height: "100px" }}
                src="https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png"
              />
            }
          />
          <div
            style={{
              marginTop: "70px",
              textAlign: "center",
              fontSize: "20px",
              fontWeight: "500",
              color: "black",
            }}
          ></div>
          <div style={{ marginTop: "10px", marginLeft: "45%" }}>
            <Space direction="vertical" size={"middle"}>
              <div>账号：{info.name}</div>
              <div>手机号：{info.phone}</div>
              <div>状态：{goo === "keep-alive" ? "在线" : "离线"}</div>
              <div>
                <span style={{ float: "left" }}>
                  余额：
                  {hideBtn === "显示余额" ? hideText : info.balance + "元"}
                </span>{" "}
                <a
                  style={{ float: "left" }}
                  onClick={() => {
                    if (hideBtn === "隐藏余额") {
                      this.setState({ hideBtn: "显示余额" });
                    } else {
                      this.setState({ hideBtn: "隐藏余额" });
                    }

                    this.setState({});
                  }}
                >
                  {hideBtn}
                </a>
              </div>
              <div style={{ width: "250px" }}>
                角色：
                <Tag color="purple">普通用户</Tag>
              </div>
              <div style={{ marginTop: "7px" }}>
                注册时间：
                {moment.unix(info.created_at)?.format("YYYY-MM-DD HH:mm:ss")}
              </div>
              <div>
                上次登录：
                {moment.unix(info.updated_at)?.format("YYYY-MM-DD HH:mm:ss")}
              </div>
            </Space>
          </div>
          <Divider style={{ marginTop: "15px", marginBottom: "15px" }} />
          <div
            style={{ width: "280px", textAlign: "center", marginLeft: "40%" }}
          >
            <div>
              <Button
                type="primary"
                onClick={_.debounce(
                  () => {
                    message.loading("正在刷新", 1).then(() => {
                      this.initfetch();

                      message.success("刷新成功");
                    });
                  },
                  1000,
                  false
                )}
              >
                刷新数据
              </Button>
            </div>
          </div>
          <Divider style={{ marginTop: "15px", marginBottom: "25px" }} />
          <div style={{ textAlign: "center", marginBottom: "15px" }}></div>
        </Card>
      </div>
    );
  }
}

export default function Person() {
  return (
    <>
      <Row gutter={[24, 17]}>
        <Col flex={8} style={{ maxWidth: "80%" }}>
          <div style={{ position: "sticky", top: "20px" }}>
            <LeftContent
              handleFavClick={() => {
                a();
              }}
              handleHisClick={() => {
                b();
              }}
            />
          </div>
        </Col>
      </Row>
    </>
  );
}
