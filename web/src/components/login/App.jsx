import React, { useRef, useEffect, useState } from "react";
import { useHistory, withRouter } from "react-router-dom";
import { message, Input, Form, Button } from "antd";
import axios from "../../utils/axios.js";
import "./login.css";
import "./font/iconfont.css";
import store from "../../store/index.js";
import qs from "qs";
import $ from 'jquery'
function Login(props) {
  const History = useHistory()
  const userRef = useRef(null);
  const pwdRef = useRef(null);
  const phoneRef = useRef(null);
  const formRef = useRef(null);
  const [active,setActive] = useState(false)
  const [login, setLogin] = useState(false);
  const userFocus = () => {
    setuserShow(true);
  };
  const handleSign = async () => {
    const {phone,password}=formRef.current.getFieldsValue()
    if (!phone || !password) {
      message.warning("请输入手机号或密码!");
      return;
    }
    let obj = {
      phone,
      password,
    };
   
    const res2 = await axios({
      method: "post",
      url: `/v1/users`,
      // headers: {
      //   "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      // },
      data: qs.stringify(obj),
    }).then((res) => {
      if(res){
        message.success("登录成功")
        const action = {
          type: "getInfo",
          value: res,
        };
        store.dispatch(action)
        // localStorage.setItem('cookie',qs.stringify(res))
        props.history.push('/home')
        let now = new Date()
        now.setMinutes(now.getMinutes()+60*24*7)
        document.cookie=`token=${qs.stringify(res)}; expires=${now}"`;
        props.getData(qs.stringify(res))
      }
    })
    
  };
  const userRegist = () => {
    setLogin(true);
    formRef.current.resetFields();
  };
  return (
    <div>
      <div id="container">
        <div id="modal">
          <div className="txt">
            <h1>Welcome</h1>
            <p>全球资产管理系统,便捷操作，一站式解决方案</p>
          </div>
          {login ? (
            <>
              <div className="login">
                <span>客户资金资产管理系统</span>
                <div className="form">
                  <Form
                    ref={formRef}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 18 }}
                    onFinish={async () => {
                      const user = userRef.current.input.value;
                      const phone = phoneRef.current.input.value;
                      const password = pwdRef.current.input.value;
                      let obj = {
                        name: user,
                        password,
                        phone,
                      };
                      const res2 = await axios({
                        method: "post",
                        url: `/v1/users/tokens`,
                        headers: {
                          "content-type":
                            "application/x-www-form-urlencoded; charset=UTF-8",
                        },
                        data: qs.stringify(obj),
                      }).then((res2,dd) => {
                        if(res2.id){
                            message.success('注册成功')
                            formRef.current.resetFields();
                            setLogin(false)
                        }
                        if(res2.code===400){
                          message.error('手机号重复')
                        }
                      });
                    }}
                  >
                    <Form.Item
                      label="用户名"
                      name={"user"}
                      validateTrigger={["onBlur","onChange"]}
                      rules={[
                        {
                          message: "用户名至少为2位且不含中文",
                          pattern: /^[^\u4e00-\u9fa5]{2,}$/,
                          required: true,
                          min: 2,
                        },
                      ]}
                    >
                      <Input ref={userRef} placeholder="请输入用户名" />
                    </Form.Item>
                    <Form.Item
                      label="手机号"
                      name={"phone"}
                      validateTrigger={["onBlur","onChange"]}
                      rules={[
                        {
                          pattern: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/,
                          message: "手机号格式不正确",
                          required: true,
                        },
                      ]}
                    >
                      <Input ref={phoneRef} placeholder="请输入手机号" />
                    </Form.Item>
                    <Form.Item
                      validateTrigger={["onBlur","onChange"]}
                      label="密码"
                      name={"pass"}
                      rules={[
                        {
                          message: "密码至少为7位数且需要包含数字和字母",
                          pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{7,126}$/,
                          required: true,
                          min: 7,
                          // max: 126,
                        },
                      ]}
                    >
                      <Input
                        ref={pwdRef}
                        type="password"
                        placeholder="······"
                      />
                    </Form.Item>
                    <Form.Item>
                      <Button
                        onClick={() => {
                          formRef.current.submit();
                        }}
                        style={{
                          color: "white",
                          width: "100%",
                        }}
                      >
                        注册
                      </Button>
                    </Form.Item>
                    <Form.Item>
                      <Button
                        onClick={() => {
                          setLogin(false);
                          formRef.current.resetFields();
                        }}
                        style={{
                          color: "white",
                          width: "100%",
                        }}
                      >
                        返回登录
                      </Button>
                    </Form.Item>
                  </Form>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="login">
                <span>客户资金资产管理系统</span>
                <div className="form">
                  <Form
                    ref={formRef}
                    onFinish={() => {}}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 18 }}
                  >
                    <Form.Item 
                    name='phone'
                    label="手机号"
                    >
                      <Input
                        className="iconfont icon-zhanghu"
                        ref={userRef}
                        placeholder="请输入手机号"
                      />
                    </Form.Item>
                    <Form.Item 
                    name= 'password'
                    label="密码"
                    >

                      <Input
                        ref={pwdRef}
                        type="password"
                        placeholder="请输入密码"
                      />
                    </Form.Item>
                    <Form.Item>
                      <Button
                        onClick={handleSign}
                        style={{
                          color: "white",
                          width: "100%",
                        }}
                      >
                        登录
                      </Button>
                    </Form.Item>
                    <Form.Item>
                      <Button
                        style={{
                          color: "white",
                          width: "100%",
                        }}
                        onClick={userRegist}
                      >
                        前往注册
                      </Button>
                    </Form.Item>
                  </Form>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default withRouter(Login);
