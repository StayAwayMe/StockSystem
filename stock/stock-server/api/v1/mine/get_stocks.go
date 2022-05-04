package mine

import (
	"github.com/gin-gonic/gin"
	"stock-server/api/v1/response"
	"stock-server/config/db"
	"stock-server/internal/service/current_user"
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
	Total int64               `json:"total"`
	List  []*models.MineStock `json:"list"`
}

func GetMineStocks(ctx *gin.Context, in *GetStocksInput) (*GetStocksResponse, error) {

	res := &GetStocksResponse{}

	currentUserInterface, _ := ctx.Get(current_user.CurrentUserIdentity)
	currentUser := currentUserInterface.(*current_user.CurrentUser)

	if in.PageSize == 0 {
		in.PageSize = 10
	}

	var total int64
	mineStock := &models.MineStock{
		CreatedUserID: currentUser.Id,
	}
	if err := db.GetDB().Model(&models.MineStock{}).Where(mineStock).Count(&total).Error; err != nil {
		return nil, err
	}

	mineStocks := make([]*models.MineStock, 0)
	if err := db.GetDB().Model(&models.MineStock{}).Where(mineStock).Order("id desc").
		Offset(in.PageID * in.PageSize).Limit(in.PageSize).
		Find(&mineStocks).Error; err != nil {
		return nil, err
	}

	res.Data = GetStocksData{
		Total: total,
		List:  mineStocks,
	}
	return res, nil
}
