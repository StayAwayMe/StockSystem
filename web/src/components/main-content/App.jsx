import React, { Component } from "react";
import Header from "../header/App.jsx";
// import Home from "../home/App.jsx";
import Sidebar from "../sidebar/App.jsx";
import "./css/index.css";
import { connect } from "react-redux";
import routercontent from "../../routers/index.js";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
  withRouter,
} from "react-router-dom";
import NotFound from "../404/Notfound.jsx";
import { Layout, Modal, Breadcrumb, Spin, Divider } from "antd";
const { Content } = Layout;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      breadcrumb: [],
      dataReady: false,
      marginLeft: 200,
      collapsed: false,
      hasToken: false,
      historyarr: [],
      lastClick: [],
      location: "",
      notfou: false,
    };
  }
  handleBreadcrumbChange = (value) => {
    this.setState({
      breadcrumb: value,
    });
  };
  componentDidMount() {
    let { href, origin } = window.location;
    let arr = href.split(origin);
    const dizhi = arr[1]
    this.setState({ location: dizhi },()=>{
      routercontent.map((item) => {
        if (this.state.location === item.path) {
          this.setState({ notfou: true },()=>{
          });
        }
      });
      if(dizhi===''||dizhi ==='/'){
        this.setState({notfou:true})
      }
    });
   
  }
  render() {
    const { history, location, pageAuthMap } = this.props;
    return(

    <>
    {this.state.notfou?<>
    <div
        style={{
          maxHeight: "100vh",
          width: "100%",
          position: "fixed",
          top: 0,
        }}
        className="scroll"
      >
        <Header
          {...this.props}
          collapsed={this.state.collapsed}
          historyarr={this.state.historyarr}
          lastClick={this.state.lastClick}
        ></Header>
      </div>
      <Router>
        <Layout style={{ minHeight: "100vh" }}>
          <Sidebar
            {...this.props}
            getBreadcrumb={this.handleBreadcrumbChange}
            getHistort={(historyarr) => {
              this.setState({ historyarr });
            }}
            getLastClick={(lastClick) => {
              this.setState({ lastClick });
            }}
            coll={(collapsed) => {
              this.setState({ collapsed });
            }}
          ></Sidebar>
  
          <Content
            style={
              this.state.collapsed
                ? {
                    margin: "80px 0px 0px 10vh",
                    minHeight: "80vh",
                    //   backgroundColor: "red",
                  }
                : {
                    margin: "80px 0px 0px 23vh",
                    minHeight: "80vh",
                    //   backgroundColor: "red",
                  }
            }
          >
            <Switch>
              {routercontent.map((item) => {
                return (
                  <Route
                    {...this.props}
                    path={item.path}
                    component={item.component}
                    key={item.path}
                  />
                );
              })}
              {/* 一般写在所有路由注册的最下方，当所有路由都无法匹配时，跳转到Redirect指定的路由 */}
              <Route key="404" component={NotFound}></Route>
            </Switch>
          </Content>
        </Layout>
      </Router>
    </>:<NotFound></NotFound>}
      
    </>
  
    )
  }
}

export default App;
