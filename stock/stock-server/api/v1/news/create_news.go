package news

import (
	"github.com/gin-gonic/gin"
	"stock-server/api/v1/response"
	"stock-server/config/db"
	"stock-server/models"
)

type CreateNewsResponse struct {
	response.Response
}

type CreateNewsInput struct {
	*models.News
}

func CreateNews(ctx *gin.Context, in *CreateNewsInput) (*CreateNewsResponse, error) {

	if err := db.GetDB().Create(in.News).Error; err != nil {
		return nil, err
	}

	return &CreateNewsResponse{}, nil
}
