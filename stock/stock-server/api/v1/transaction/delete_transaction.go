package transaction

import (
	"github.com/gin-gonic/gin"
	"stock-server/api/v1/response"
	"stock-server/config/db"
	"stock-server/internal/service/current_user"
	"stock-server/models"
)

type DeleteTransactionResponse struct {
	response.Response
}

type DeleteTransactionInput struct {
	ID string `json:"id" form:"id" validate:"required" description:"记录id"`
}

func DeleteTransaction(ctx *gin.Context, in *DeleteTransactionInput) (*DeleteTransactionResponse, error) {

	currentUserInterface, _ := ctx.Get(current_user.CurrentUserIdentity)
	currentUser := currentUserInterface.(*current_user.CurrentUser)

	transaction := &models.Transaction{
		BaseModel: models.BaseModel{
			Id: in.ID,
		},
		CreatedUserID: currentUser.Id,
	}

	if err := db.GetDB().Delete(transaction).Error; err != nil {
		return nil, err
	}

	return &DeleteTransactionResponse{
	}, nil
}
