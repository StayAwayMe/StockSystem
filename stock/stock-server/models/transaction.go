package models

type TransactionType int

const (
	TransactionTypeBuy  TransactionType = iota + 1 // 买入
	TransactionTypeSale                            // 卖出
)

type Transaction struct {
	BaseModel
	CreatedUserID     string          `json:"created_user_id" gorm:"type:varchar(191);" description:"操作者id"`
	Name              string          `json:"name" gorm:"type:varchar(191);" description:"股票名称"`
	Code              string          `json:"code" gorm:"type:varchar(191);" description:"股票代码"`
	Price             float64         `json:"price" gorm:"type:float;" description:"交易价格"`
	Count             int64           `json:"count" gorm:"type:int(11);" description:"购买数量(手=100股)"`
	TradingTotalPrice float64         `json:"trading_total_price" gorm:"type:float;" description:"成交金额(元)"`
	Type              TransactionType `json:"type" gorm:"type:tinyint(1);" description:"交易类型 1：买入  2：卖出"`
}
