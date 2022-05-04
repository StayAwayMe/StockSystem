package user

import (
	"crypto/sha256"
	"fmt"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"stock-server/api/v1/response"
	"stock-server/config/db"
	error2 "stock-server/internal/library/error"
	"stock-server/internal/library/password"
	"stock-server/internal/service/current_user"
	"stock-server/models"
)

type LoginInput struct {
	Phone    string `json:"phone" form:"phone" validate:"required,len=11" description:"手机号"`
	Password string `json:"password" form:"password" validate:"required,gt=6,lt=127" description:"密码：要求长度大于7(字符)"`
}

type LoginResponse struct {
	response.Response
	Data models.User `json:"data"`
}

// Login 登录
func Login(ctx *gin.Context, in *LoginInput) (*LoginResponse, error) {

	if !password.IsSafe(in.Password) {
		return nil, response.NewOperationErrorResponseWithData(error2.UserPasswordFormatError)
	}

	// 查询用户是否存在
	user := &models.User{
		Phone: in.Phone,
	}
	err := db.GetDB().First(user, user).Error
	if err != nil && err == gorm.ErrRecordNotFound {
		return nil, response.NewValidationErrorResponseWithMessage("user_login", "user_not_found")
	}
	if err != nil {
		return nil, err
	}

	passwordHash := fmt.Sprintf("%x", sha256.Sum256([]byte(in.Password)))
	if user.Password != fmt.Sprintf("%x", sha256.Sum256([]byte(passwordHash+user.Salt))) {
		return nil, response.NewValidationErrorResponseWithMessage("user_login", "invalid_password")
	}

	// 更新用户登录状态至session
	currentUser := &current_user.CurrentUser{
		User: user,
		UserVerification: current_user.UserVerification{
			UserId: user.Id,
		},
	}
	if err = currentUser.SaveUserLoginSession(ctx.Request, ctx.Writer); err != nil {
		return nil, err
	}

	return &LoginResponse{
		Data: *user,
	}, nil
}
