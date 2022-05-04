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
  Tag,
} from "antd";
import Meta from "antd/es/card/Meta";
import store from "../../store/index.js";
import qs from "qs";
import moment from "moment";
import axios from '../../utils/axios.js'
class LeftContent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      info: {},
      goo: [],
    };
  }
  async componentDidMount() {
   
  await axios({
      url:'/ping',
      method:'get'
    }).then((res)=>{
      const [status]= res.request.header.Connection
      this.setState({goo:status})
    })
    let info = document.cookie;
    info = qs.parse(info);
    this.setState({
      info,
    });
  }
  render() {
    const { info,goo } = this.state;
    return (
      <div style={{ display: "flex" }}>
        <Card className="contentCenter" style={{ height: "auto", flex: 1 }}>
          <Meta
            id="userImage"
            className="contentCenter"
            style={{ marginTop: "10px", marginLeft: "45%" }}
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
            <div>账号：{info.name}</div>
            <div>手机号：{info.phone}</div>
            <div style={{ marginTop: "7px" }}>状态：{goo==='keep-alive'?'在线':'离线'}</div>
            <div style={{ marginTop: "7px", width: "250px" }}>
              角色：
              <Tag color="purple">普通用户</Tag>
            </div>
            <div style={{ marginTop: "7px" }}>
              登录时间：{moment().format("YYYY年MM月DD日")}
            </div>
          </div>
          <Divider style={{ marginTop: "15px", marginBottom: "15px" }} />
          <div
            style={{ width: "280px", textAlign: "center", marginLeft: "35%" }}
          >
            <div style={{ marginBottom: "20px" }}>最常访问：暂未开放</div>
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
