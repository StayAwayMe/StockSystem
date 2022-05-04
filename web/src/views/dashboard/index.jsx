import React, { Component } from "react";
import { Result, Button,message } from "antd";
import { SmileOutlined } from "@ant-design/icons";

class dashboard extends Component {
  render() {
    return (
      <div>
        <Result
          icon={<SmileOutlined />}
          title="welcome to 账户资金管理系统!"
          extra={<Button 
            type="primary"
            onClick={()=>{
              message
              .loading("正在退出", 1)
              .then(() => {
                localStorage.removeItem("cookie");
                document.cookie =
                  "token=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
                location.href = window.location.href;
              })
              .then(() => message.info("退出成功", 1));
            }}
          >快速退出</Button>
        }
        />
      </div>
    );
  }
}

export default dashboard;
