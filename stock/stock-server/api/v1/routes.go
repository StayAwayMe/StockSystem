package v1

import (
	"github.com/loopfz/gadgeto/tonic"
	"github.com/wI2L/fizz"
	"stock-server/api/v1/middleware"
	"stock-server/api/v1/mine"
	"stock-server/api/v1/news"
	"stock-server/api/v1/response"
	"stock-server/api/v1/stock"
	"stock-server/api/v1/transaction"
	"stock-server/api/v1/user"
)

func InitRoutes(r *fizz.Fizz) {

	v1g := r.Group("v1", "ApiV1", "API version 1")

	// user group
	UserGroup(v1g)
	// stock group
	StockGroup(v1g)
	// mineStock group
	MineStockGroup(v1g)
	// transaction group
	TransactionGroup(v1g)
	// news group
	NewsGroup(v1g)
}

func UserGroup(g *fizz.RouterGroup) {

	userGroup := g.Group("users", "user", "Account APIs")

	userGroup.POST("/tokens", []fizz.OperationOption{
		fizz.Summary("用户注册"),
		fizz.Response("400", "exception", response.ValidationErrorResponse{}, nil),
	}, tonic.Handler(user.Register, 200))

	userGroup.POST("", []fizz.OperationOption{
		fizz.Summary("用户登录"),
		fizz.Response("400", "exception", response.ValidationErrorResponse{}, nil),
	}, tonic.Handler(user.Login, 200))

	userGroup.GET("", []fizz.OperationOption{
		fizz.Summary("用户信息获取"),
		fizz.Response("400", "exception", response.ValidationErrorResponse{}, nil),
	}, middleware.UserLoginAuth, tonic.Handler(user.GetUser, 200))

	userGroup.DELETE("/tokens", []fizz.OperationOption{
		fizz.Summary("用户登出"),
		fizz.Response("400", "exception", response.ValidationErrorResponse{}, nil),
	}, middleware.UserLoginAuth, tonic.Handler(user.Logout, 200))
}

func StockGroup(g *fizz.RouterGroup) {

	stockGroup := g.Group("stocks", "stocks", "Stocks APIs")

	stockGroup.POST("/init", []fizz.OperationOption{
		fizz.Summary("添加初始化股票数据"),
		fizz.Response("400", "exception", response.ValidationErrorResponse{}, nil),
	}, tonic.Handler(stock.CreateStock, 200))

	stockGroup.POST("", []fizz.OperationOption{
		fizz.Summary("购买股票"),
		fizz.Response("400", "exception", response.ValidationErrorResponse{}, nil),
	}, middleware.UserLoginAuth, tonic.Handler(stock.BuyStock, 200))

	stockGroup.GET("", []fizz.OperationOption{
		fizz.Summary("获取首页股票列表"),
		fizz.Response("400", "exception", response.ValidationErrorResponse{}, nil),
	}, middleware.UserLoginAuth, tonic.Handler(stock.GetStocks, 200))
}

func MineStockGroup(g *fizz.RouterGroup) {

	mineStockGroup := g.Group("mine-stocks", "mine-stocks", "Mine Stocks APIs", middleware.UserLoginAuth)

	mineStockGroup.GET("", []fizz.OperationOption{
		fizz.Summary("获取我的股票列表"),
		fizz.Response("400", "exception", response.ValidationErrorResponse{}, nil),
	}, tonic.Handler(mine.GetMineStocks, 200))

	mineStockGroup.PUT("", []fizz.OperationOption{
		fizz.Summary("卖出股票"),
		fizz.Response("400", "exception", response.ValidationErrorResponse{}, nil),
	}, tonic.Handler(mine.SaleStock, 200))
}

func TransactionGroup(g *fizz.RouterGroup) {

	transactionGroup := g.Group("transactions", "transactions", "Transactions APIs", middleware.UserLoginAuth)

	transactionGroup.GET("", []fizz.OperationOption{
		fizz.Summary("获取交易记录列表"),
		fizz.Response("400", "exception", response.ValidationErrorResponse{}, nil),
	}, tonic.Handler(transaction.GetTransactions, 200))

	transactionGroup.PUT("", []fizz.OperationOption{
		fizz.Summary("修改交易记录"),
		fizz.Response("400", "exception", response.ValidationErrorResponse{}, nil),
	}, tonic.Handler(transaction.UpdateTransaction, 200))

	transactionGroup.DELETE("", []fizz.OperationOption{
		fizz.Summary("删除交易记录"),
		fizz.Response("400", "exception", response.ValidationErrorResponse{}, nil),
	}, tonic.Handler(transaction.DeleteTransaction, 200))
}

func NewsGroup(g *fizz.RouterGroup) {

	newsGroup := g.Group("news", "news", "News APIs")

	newsGroup.POST("/init", []fizz.OperationOption{
		fizz.Summary("添加初始化新闻数据"),
		fizz.Response("400", "exception", response.ValidationErrorResponse{}, nil),
	}, tonic.Handler(news.CreateNews, 200))

	newsGroup.GET("", []fizz.OperationOption{
		fizz.Summary("获取新闻资讯列表"),
		fizz.Response("400", "exception", response.ValidationErrorResponse{}, nil),
	}, middleware.UserLoginAuth, tonic.Handler(news.GetNews, 200))
}
