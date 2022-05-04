package transaction

import (
	"github.com/gin-gonic/gin"
	"stock-server/api/v1/response"
	"stock-server/config/db"
	"stock-server/internal/service/current_user"
	"stock-server/models"
)

type UpdateTransactionResponse struct {
	response.Response
	Data *models.Transaction `json:"data"`
}

type UpdateTransactionInput struct {
	*models.Transaction
}

func UpdateTransaction(ctx *gin.Context, in *UpdateTransactionInput) (*UpdateTransactionResponse, error) {

	currentUserInterface, _ := ctx.Get(current_user.CurrentUserIdentity)
	currentUser := currentUserInterface.(*current_user.CurrentUser)

	in.Transaction.CreatedUserID = currentUser.Id
	if err := db.GetDB().Save(in.Transaction).Error; err != nil {
		return nil, err
	}

	return &UpdateTransactionResponse{
		Data: in.Transaction,
	}, nil
}
