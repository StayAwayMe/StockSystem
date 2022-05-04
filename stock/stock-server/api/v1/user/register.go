package user

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"stock-server/api/v1/response"
	"stock-server/config/db"
	error2 "stock-server/internal/library/error"
	"stock-server/internal/library/password"
	"stock-server/internal/service/current_user"
	"stock-server/models"
)

type RegisterInput struct {
	Name     string `json:"name" form:"name" validate:"required,gt=1" description:"用户名"`
	Phone    string `json:"phone" form:"phone" validate:"required,len=11" description:"手机号"`
	Password string `json:"password" form:"password" validate:"required,gt=6,lt=127" description:"密码：要求长度大于7(字符)"`
}

type RegisterResponse struct {
	response.Response
	Data *models.User `json:"data"`
}

// Register 注册
func Register(ctx *gin.Context, in *RegisterInput) (*RegisterResponse, error) {

	if !password.IsSafe(in.Password) {
		return nil, response.NewOperationErrorResponseWithData(error2.UserPasswordFormatError)
	}

	user := &models.User{
		Phone: in.Phone,
	}
	//查重
	if err := db.GetDB().First(user, user).Error; err != nil {
		if err != gorm.ErrRecordNotFound {
			return nil, err
		}
	} else {
		return nil, response.NewValidationErrorResponseWithMessage("user_register", "user_already_exist")
	}

	user = models.NewUser(in.Name, in.Password, in.Phone)
	if err := db.GetDB().Create(user).Error; err != nil {
		return nil, err
	}

	//设置cookie
	currentUser := &current_user.CurrentUser{
		User: user,
		UserVerification: current_user.UserVerification{
			UserId: user.Id,
		},
	}
	if err := currentUser.SaveUserLoginSession(ctx.Request, ctx.Writer); err != nil {
		return nil, err
	}

	return &RegisterResponse{
		Data: user,
	}, nil
}
