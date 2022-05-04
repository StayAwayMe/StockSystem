import React, { Component } from "react";
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
} from "antd";
const { Panel } = Collapse;
const { TextArea } = Input;
function callback(key) {
  // console.log(key);
}
import axios from "../../utils/axios.js";
import qs from 'qs'
export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      newsDatas: [],
      total: 0,
      current: 0,
      size: 10,
      rightVisilbe: false,
    };
    this.newsFormRef = React.createRef();
  }
  initFetch = (page_id, page_size) => {
    axios({
      url: `/v1/news?page_id=${page_id - 1}&page_size=${page_size}`,
      method: "GET",
    }).then((res) => {
      let { list, total } = res;
      this.setState({ newsDatas: list, total });
    });
  };
  componentDidMount() {
    this.initFetch(1, 10);
  }
  render() {
    let { newsDatas, total, current, size, rightVisilbe } = this.state;
    return (
      <div>
        <div className="site-layout-background" style={{ padding: 24 }}>
          <Divider>~~~新闻资讯~~~</Divider>
          <Button
            onClick={() => {
              this.setState({ rightVisilbe: true });
            }}
            type={"primary"}
          >
            添加新闻
          </Button>
        </div>
        <div
          className="site-layout-background"
          style={{ padding: 24, marginTop: 10 }}
        >
          <Collapse defaultActiveKey={["1"]} onChange={callback}>
            {newsDatas.map((item) => (
              <Panel header={item.title} key={item.id}>
                <div>
                  <a href={item.link} target="_blank">
                    {item.title}
                  </a>
                  <span style={{ float: "left" }}>详情点击→</span>
                  <span style={{ float: "right" }}>{item.publish_time}</span>
                </div>
              </Panel>
            ))}
          </Collapse>
          <br />
          <Pagination
            total={total}
            defaultCurrent={1}
            onChange={(current, size) => {
              this.setState({ size, current }, () => {
                this.initFetch(current, size);
              });
            }}
          ></Pagination>
          <Drawer
            title="添加新闻"
            placement="right"
            onClose={() => {
              this.setState({ rightVisilbe: false });
            }}
            visible={rightVisilbe}
            extra={
              <Space>
                <Button
                  onClick={() => {
                    this.setState({ rightVisilbe: false });
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  onClick={() => {
                    let {link,title} = this.newsFormRef.current.getFieldsValue();
                    let flag = false
                    if(/^(((ht|f)tps?):\/\/)?([^!@#$%^&*?.\s-]([^!@#$%^&*?.\s]{0,63}[^!@#$%^&*?.\s])?\.)+[a-z]{2,6}\/?/.test(link)){
                      flag =true
                    }
                    if(flag){
                      let obj = {
                        link,
                        title
                      }
                      axios({
                        url: `/v1/news/init`,
                        method: "POST",
                        data: qs.parse(obj),
                      }).then(res=>{
                        message.success('添加成功');
                        this.setState({rightVisilbe:false},()=>{
                          this.newsFormRef.current.resetFields()
                          this.initFetch(current,size)
                        })
                      })  
                    }else{
                      message.error("请输入正确的文章链接")
                    }
                    
                  }}
                >
                  OK
                </Button>
              </Space>
            }
          >
            <Form name={"newForm"} ref={this.newsFormRef}>
              <Form.Item label={"文章链接"} name="link">
                <Input />
              </Form.Item>
              <Form.Item label={"新闻内容"} name="title">
                <TextArea rows={4} />
              </Form.Item>
              {/* <Form.Item></Form.Item> */}
              {/* <Form.Item></Form.Item> */}
            </Form>
          </Drawer>
        </div>
      </div>
    );
  }
}
