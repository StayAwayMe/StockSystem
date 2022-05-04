package models

type Stock struct {
	BaseModel
	Name              string  `json:"name" gorm:"type:varchar(191);" description:"股票名称"`
	Code              string  `json:"code" gorm:"type:varchar(191);" description:"股票代码"`
	Price             float64 `json:"price" gorm:"type:float;" description:"股票最新价格"`
	PriceLime         float64 `json:"price_limit" gorm:"type:float;" description:"涨跌幅"`
	TradingVolume     float64 `json:"trading_volume" gorm:"type:float;" description:"成交量(手)"`
	TradingTotalPrice float64 `json:"trading_total_price" gorm:"type:float;" description:"成交金额(元)"`
}
