import React, { Component } from "react";
import {
  Avatar,
  Breadcrumb,
  Col,
  Dropdown,
  Layout,
  Menu,
  message,
  Row,
  Tabs,
  Timeline,
  Tooltip,
  Divider,
  Card,
} from "antd";
import { Link } from "react-router-dom";
import "./less/index.less";
import routers from "../../routers/index.js";
import sideRoute from "../../sideRoute";
import { HomeOutlined, UserOutlined } from "@ant-design/icons";
import store from "../../store";
import qs from 'qs'
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
  withRouter,
} from "react-router-dom";
class RightContent extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
       info:''
    }
  }
  componentDidMount(){
    let info = document.cookie;
    info= qs.parse(info)
    this.setState({
      info
    })
   
  }
  render() {
    const {info}=this.state
    const menu = (
      <Menu selectedKeys={[]}>
        <Menu.Item
          key="userCenter"
          onClick={() => {
            this.props.history.push("/person");
            window.location.href = location.href
            
          }}
        >
          个人中心
        </Menu.Item>
        <Menu.Item key="userinfo">个人设置</Menu.Item>
        <Menu.Divider />
        <Menu.Item
          key="logout"
          onClick={() => {
            // message.success("退出登录成功，感谢使用");
            message
              .loading("正在退出中", 1)
              .then(() => {
                localStorage.removeItem("cookie");
                document.cookie =
                  "token=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
                location.href = window.location.href;
              })
              .then(() => message.info("退出成功", 1));
          }}
        >
          退出登录
        </Menu.Item>
      </Menu>
    );
    return (
      <div>
        <Dropdown overlay={menu}>
          <span className="right">
            <Avatar
              size="small"
              style={{ margin: "0 10px 5px 0" }}
              src="https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png"
              alt="avatar"
            />
            <span>{info.name}</span>
          </span>
        </Dropdown>
      </div>
    );
  }
}
class LeftContent extends Component {
  render() {
    return (
      <div className="left">
        <Breadcrumb style={{ lineHeight: "50px" }}>
          <Breadcrumb.Item>
            <HomeOutlined />
          </Breadcrumb.Item>
          {this.props.lastClick.map((item) => (
            <Breadcrumb.Item key={item}> {item}</Breadcrumb.Item>
          ))}
        </Breadcrumb>
      </div>
    );
  }
}
 class Header extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div
        style={
          this.props.collapsed
            ? {
                margin: "0 0 0 8vh",
                // padding:'0 0 10vh 0 ',
                display: "flex",
                justifyContent: "space-between",
                backgroundColor: "rgb(255,255,255)",
              }
            : {
                margin: "0 0 0 20vh",
                // padding:'0 0 10vh 0 ',
                display: "flex",
                justifyContent: "space-between",
                backgroundColor: "rgb(255,255,255)",
              }
        }
      >
        <LeftContent {...this.props} />
        <RightContent {...this.props}/>
        {/* <div>ddd</div> */}
      </div>
    );
  }
}

export default withRouter(Header)