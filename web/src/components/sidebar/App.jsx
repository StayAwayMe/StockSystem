import React from "react";
import "./less/index.less";
import { Layout, List, Menu } from "antd";
// import endPoint from '../data/index.js'
import {
  ReadOutlined,
  HomeOutlined,
  ExclamationCircleOutlined,
  DatabaseOutlined,
  FundOutlined,
  SettingOutlined,
  FileTextOutlined,
  UserOutlined,
  MoneyCollectOutlined,
  DoubleRightOutlined,
  createFromIconfontCN
} from "@ant-design/icons";
const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_3370706_hn2evzny2if.json?spm=a313x.7781069.1998910419.53&file=font_3370706_hn2evzny2if.json',
});

import { Link, withRouter } from "react-router-dom";
import sideRoute from '../../sideRoute/index.js'
const { Sider } = Layout;
const { SubMenu } = Menu;

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            categorys: {
                "categorys": {},
                "pages": [],
                "defaultOpenKeys": [],
            },
            user: props.user,
            logoClassName: 'kf-long-logo',
            rank: [],
            collapsed:false,
            historyArr:[],
            lastClick:[],
        };
        this.iconConfig = {
            "主页": <HomeOutlined />,
            "新闻": <ReadOutlined />,
            "登录": <ExclamationCircleOutlined />,
            "股票交易记录": <DatabaseOutlined />,
            "结算数据": <MoneyCollectOutlined />,
            "公司业绩": <FundOutlined />,
            "持仓报表": <FileTextOutlined />,
            "404": <FundOutlined />,
            "个人综合屏": <UserOutlined />,
            "基础设置": <SettingOutlined />
        };
        this.categorySourceData = {};
    }
  
    dispatchPageAuth(action) {
        store.dispatch(action)
    }
  render() {
    const { categorys, rank } = this.state;
    return (
      <Sider
        collapsible
        //   onCollapse={this.props.onCollapse}
        onCollapse={(a)=>{
            this.props.coll(a)
        }}
        style={{ overflow: "auto", height: "95vh", position: "fixed", left: 0 }}
      >
        <div
          // className={this.state.logoClassName}
          style={{ backgroundColor: "" }}
        ></div>
        <Menu
          theme="dark"
          mode="inline"
          onClick={(value)=>{
              
              let arr = this.state.historyArr
              arr.push(value['key'])
              arr = [...new Set(arr)]
              this.setState({historyArr:arr,lastClick:[value['key']]},()=>{
                  this.props.getHistort(this.state.historyArr)
                  this.props.getLastClick(this.state.lastClick)
              })
            //   this.setState((prev)=>({historyArr:prev.historyArr.push(value['key'])}),()=>{
            //   })
            //   this.props.history.push(value["key"]);
          }}
        >
          <Menu.Item key={"dashboard"} title={"home"} icon={<ExclamationCircleOutlined />}>
            <Link to ={'/dashboard'}>Dashboard</Link>
          </Menu.Item>
          {
              sideRoute.map(item=>(
                  <Menu.Item key={item.cha_name} title={item.url}  icon={this.iconConfig[item.cha_name]}>
                      <Link to={item.url}>{item["cha_name"]}</Link>
                  </Menu.Item>
              ))
          }
        </Menu>
      </Sider>
    );
  }
}

export default App;
