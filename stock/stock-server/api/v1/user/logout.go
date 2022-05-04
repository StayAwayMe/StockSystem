package user

import (
	"github.com/gin-gonic/gin"
	"stock-server/api/v1/response"
	"stock-server/internal/service/current_user"
)

// Logout 退出登录
func Logout(ctx *gin.Context) (*response.Response, error) {
	currentUserInterface, _ := ctx.Get(current_user.CurrentUserIdentity)
	currentUser := currentUserInterface.(*current_user.CurrentUser)
	return &response.Response{}, currentUser.RemoveUserLoginSession(ctx.Request, ctx.Writer)
}
