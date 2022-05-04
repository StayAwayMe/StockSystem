package user

import (
	"github.com/gin-gonic/gin"
	"stock-server/api/v1/response"
	"stock-server/internal/service/current_user"
	"stock-server/models"
)

type GetUserResponse struct {
	response.Response
	Data *models.User `json:"data"`
}

func GetUser(ctx *gin.Context) (*GetUserResponse, error) {

	currentUserInterface, _ := ctx.Get(current_user.CurrentUserIdentity)
	currentUser := currentUserInterface.(*current_user.CurrentUser)

	res := &GetUserResponse{
		Data: currentUser.User,
	}

	return res, nil
}
