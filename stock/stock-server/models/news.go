package models

type News struct {
	BaseModel
	Title       string `json:"title"  gorm:"type:varchar(255)" validate:"required" description:"标题"`
	PublishTime string `json:"publish_time" gorm:"type:varchar(255)" description:"发布时间"`
	Link        string `json:"link" gorm:"type:varchar(255)" description:"文章地址"`
}
