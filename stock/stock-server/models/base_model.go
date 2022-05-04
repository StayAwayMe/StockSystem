package models

import (
	"gorm.io/gorm"
	"stock-server/internal/library/random"
	"time"
)

type BaseModel struct {
	Id        string `json:"id" gorm:"type:varchar(191);primary_key" description:"Primary key"`
	CreatedAt int64  `json:"created_at" gorm:"type:int(11)" description:"创建时间"`
	UpdatedAt int64  `json:"updated_at" gorm:"type:int(11)" description:"更新时间"`
}

type PageInput struct {
	PageID   int    `query:"page_id" description:"查询起始页id" default:"0"`
	PageSize int    `query:"page_size" description:"单页查询数量,默认十条" validate:"max=50" default:"10"`
	Order    string `query:"order" description:"查询结果排序策略"`
}

func (model *BaseModel) BeforeCreate(*gorm.DB) error {
	model.CreatedAt = time.Now().Unix()
	model.UpdatedAt = model.CreatedAt
	model.Id = random.GenerateUUID()

	return nil
}

func (model *BaseModel) BeforeUpdate(*gorm.DB) error {
	model.UpdatedAt = time.Now().Unix()
	return nil
}

