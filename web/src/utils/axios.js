import { message } from 'antd';
import axios from 'axios'


const instance = axios.create({
  baseURL: 'http://localhost:80',
  timeout: 5000,
  withCredentials:true,//开启
  headers: {}
})

instance.interceptors.request.use(function (config) {
    return config;
  }, function (error) {
    return Promise.reject(error);
  });
instance.interceptors.response.use(function (response) {
  if(response.config.url==='/ping'){
    return response.data
  }
    return response.data.data
  }, function (error) {
    if(error.response.request.status==400){
      // message.warning('注册异常')
      const {data} = error.response
      if(data){
        if(data.data.message=="user_already_exist"){
          message.warning('手机号重复')
        }
      }
      if(data.data.message==="invalid_password"){
        message.error('密码错误');
      }
    }
    return Promise.reject(error);
  });

  export default instance
