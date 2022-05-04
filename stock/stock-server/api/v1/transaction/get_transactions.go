package transaction

import (
	"github.com/gin-gonic/gin"
	"stock-server/api/v1/response"
	"stock-server/config/db"
	"stock-server/internal/service/current_user"
	"stock-server/models"
)

type GetTransactionInput struct {
	PageID   int `query:"page_id" description:"查询起始页id" default:"0"`
	PageSize int `query:"page_size" description:"单页查询数量,默认十条"  default:"10"`
}

type GetTransactionsResponse struct {
	response.Response
	Data GetTransactionsData `json:"data"`
}

type GetTransactionsData struct {
	Total int64               `json:"total"`
	List  []*models.Transaction `json:"list"`
}

func GetTransactions(ctx *gin.Context, in *GetTransactionInput) (*GetTransactionsResponse, error) {

	res := &GetTransactionsResponse{}

	currentUserInterface, _ := ctx.Get(current_user.CurrentUserIdentity)
	currentUser := currentUserInterface.(*current_user.CurrentUser)

	if in.PageSize == 0 {
		in.PageSize = 10
	}

	var total int64
	transaction := &models.Transaction{
		CreatedUserID: currentUser.Id,
	}
	if err := db.GetDB().Model(&models.Transaction{}).Where(transaction).Count(&total).Error; err != nil {
		return nil, err
	}

	transactions := make([]*models.Transaction, 0)
	if err := db.GetDB().Model(&models.Transaction{}).Where(transaction).Order("id desc").
		Offset(in.PageID * in.PageSize).Limit(in.PageSize).
		Find(&transactions).Error; err != nil {
		return nil, err
	}

	res.Data = GetTransactionsData{
		Total: total,
		List:  transactions,
	}
	return res, nil
}
