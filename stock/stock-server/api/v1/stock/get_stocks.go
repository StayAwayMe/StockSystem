package stock

import (
	"github.com/gin-gonic/gin"
	"stock-server/api/v1/response"
	"stock-server/config/db"
	"stock-server/models"
)

type GetStocksInput struct {
	PageID   int `query:"page_id" description:"查询起始页id" default:"0"`
	PageSize int `query:"page_size" description:"单页查询数量,默认十条"  default:"10"`
}

type GetStocksResponse struct {
	response.Response
	Data GetStocksData `json:"data"`
}

type GetStocksData struct {
	Total int64           `json:"total"`
	List  []*models.Stock `json:"list"`
}

func GetStocks(ctx *gin.Context, in *GetStocksInput) (*GetStocksResponse, error) {
	if in.PageSize == 0 {
		in.PageSize = 10
	}

	res := &GetStocksResponse{}

	var total int64
	if err := db.GetDB().Model(&models.Stock{}).Count(&total).Error; err != nil {
		return nil, err
	}

	stocks := make([]*models.Stock, 0)
	if err := db.GetDB().Model(&models.Stock{}).Order("id desc").
		Offset(in.PageID * in.PageSize).Limit(in.PageSize).
		Find(&stocks).Error; err != nil {
		return nil, err
	}

	res.Data = GetStocksData{
		Total: total,
		List:  stocks,
	}
	return res, nil
}
