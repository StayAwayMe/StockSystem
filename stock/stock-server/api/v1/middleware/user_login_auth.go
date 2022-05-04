/*
 * Copyright 2021 Seven Seals Technology
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package middleware

import (
	"stock-server/api/v1/response"
	"stock-server/internal/service/current_user"

	"github.com/gin-gonic/gin"
)

// UserLoginAuth 登录验证
func UserLoginAuth(ctx *gin.Context) {
	currentUser, err := current_user.NewCurrentUserFromSession(ctx.Request)
	if err != nil || currentUser.Id == "" {
		ctx.AbortWithStatusJSON(400, response.NewValidationErrorResponseWithMessage("login_error", "user login status expired"))
		return
	}

	ctx.Set(current_user.CurrentUserIdentity, currentUser)
	ctx.Next()
}
