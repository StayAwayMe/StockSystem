package models

type MineStock struct {
	BaseModel
	CreatedUserID     string  `json:"created_user_id" gorm:"type:varchar(191);" description:"购买者id"`
	Name              string  `json:"name" gorm:"type:varchar(191);" description:"股票名称"`
	Code              string  `json:"code" gorm:"type:varchar(191);" description:"股票代码"`
	Price             float64 `json:"price" gorm:"type:float;" description:"价格"`
	Count             int64   `json:"count" gorm:"type:int(11);" description:"数量(手)"`
	TradingTotalPrice float64 `json:"trading_total_price" gorm:"type:float;" description:"总金额(元)"`
}
