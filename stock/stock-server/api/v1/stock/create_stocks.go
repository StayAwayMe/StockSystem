package stock

import (
	"github.com/gin-gonic/gin"
	"stock-server/api/v1/response"
	"stock-server/config/db"
	"stock-server/models"
)

type CreateStockResponse struct {
	response.Response
}

type CreateStockInput struct {
	*models.Stock
}

func CreateStock(ctx *gin.Context, in *CreateStockInput) (*CreateStockResponse, error) {

	if err := db.GetDB().Create(in.Stock).Error; err != nil {
		return nil, err
	}

	return &CreateStockResponse{}, nil
}
