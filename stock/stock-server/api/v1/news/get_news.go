package news

import (
	"github.com/gin-gonic/gin"
	"stock-server/api/v1/response"
	"stock-server/config/db"
	"stock-server/models"
)

type GetNewsInput struct {
	PageID   int `query:"page_id" description:"查询起始页id" default:"0"`
	PageSize int `query:"page_size" description:"单页查询数量,默认十条"  default:"10"`
}

type GetNewsResponse struct {
	response.Response
	Data GetNewsData `json:"data"`
}

type GetNewsData struct {
	Total int64          `json:"total"`
	List  []*models.News `json:"list"`
}

func GetNews(ctx *gin.Context, in *GetNewsInput) (*GetNewsResponse, error) {
	if in.PageSize == 0 {
		in.PageSize = 10
	}

	res := &GetNewsResponse{}

	var total int64
	if err := db.GetDB().Model(&models.News{}).Count(&total).Error; err != nil {
		return nil, err
	}

	news := make([]*models.News, 0)
	if err := db.GetDB().Model(&models.News{}).Order("id desc").
		Offset(in.PageID * in.PageSize).Limit(in.PageSize).
		Find(&news).Error; err != nil {
		return nil, err
	}

	res.Data = GetNewsData{
		Total: total,
		List:  news,
	}
	return res, nil
}
