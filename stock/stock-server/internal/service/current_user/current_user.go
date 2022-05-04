package current_user

import (
	"encoding/json"
	"net/http"
	"time"

	"stock-server/api/v1/response"
	"stock-server/config/db"
	"stock-server/config/session"
	"stock-server/models"
)

const (
	CurrentUserIdentity = "CurrentUserIdentity"

	UserSessionKey       = "user-token"
	UserVerificationInfo = "user-verification-info"
)

type CurrentUser struct {
	*models.User
	UserVerification UserVerification `json:"user_verification"` // 用户登录状态session校验信息
}

type UserVerification struct {
	UserId string `json:"user_id"`
}

type VaultVerification struct {
	RandomString string    `json:"random_string"`
	Token        string    `json:"token"`
	Expire       time.Time `json:"expire"`
}

func NewCurrentUser() *CurrentUser {
	return &CurrentUser{
		User: &models.User{},
	}
}

func NewCurrentUserFromSession(request *http.Request) (*CurrentUser, error) {
	// 用户登录状态session获取
	userSession, err := session.GetSessionStore().Get(request, UserSessionKey)

	if err != nil {
		return nil, err
	}

	currentUser := NewCurrentUser()

	userVerificationBytes := userSession.Values[UserVerificationInfo]
	if userVerificationBytes == nil {
		return nil, response.NewAccessDeniedResponse()
	}

	userVerificationInfo := UserVerification{}
	if err := json.Unmarshal(userVerificationBytes.([]byte), &userVerificationInfo); err != nil {
		return nil, err
	}
	currentUser.UserVerification = userVerificationInfo

	currentUser.User.Id = currentUser.UserVerification.UserId
	if err := db.GetDB().First(currentUser.User, currentUser.User).Error; err != nil {
		return nil, err
	}

	return currentUser, nil
}

func (currentUser *CurrentUser) RemoveUserLoginSession(request *http.Request, response http.ResponseWriter) error {
	store := session.GetSessionStore()
	userSession := session.NewSession(store, UserSessionKey) // 创建新session
	userSession.Options.MaxAge = 0
	return store.Save(request, response, userSession)
}

func (currentUser *CurrentUser) SaveUserLoginSession(request *http.Request, response http.ResponseWriter) error {

	store := session.GetSessionStore()
	userSession := session.NewSession(store, UserSessionKey) // 创建新session

	userVerificationBytes, err := json.Marshal(currentUser.UserVerification)
	if err != nil {
		return err
	}

	userSession.Values[UserVerificationInfo] = userVerificationBytes
	return store.Save(request, response, userSession)
}
