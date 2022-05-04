const HtmlWebPackPlugin = require("html-webpack-plugin");
module.exports = {
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                },
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: "html-loader",
                    },
                ],
            },
            {
                test:/\.css$/,
                use:['style-loader','css-loader'],
            },
            {
                test:/\.less$/,
                use:[{
                    loader:'style-loader'
                },{
                    loader:'css-loader'
                },{
                    loader:'less-loader'
                }]
            }
        ],

    },
    devServer: {
        hot: true,
        host: '127.0.0.1',
        port: '8080',
        historyApiFallback: true,
        proxy: {
            '/api/v1': {
              target: `http://127.0.0.1:80/api/v1`, // 这里可以跟随项目实际部署服务器来
              secure: false, // 如果是https接口，需要配置这个参数
              changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
              ws: true,
              pathRewrite: {
                '^/api/v1': '' // 自定义
              }
            },
          }
      },
    plugins: [
        new HtmlWebPackPlugin({
            template: "./index.html",

            filename: "./index.html",
        }),
    ],
    
};
