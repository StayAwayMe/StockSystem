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

package models

import (
	"crypto/sha256"
	"fmt"

	"stock-server/internal/library/random"
)

type UserStatus int

const (
	UserNormal  UserStatus = iota + 1 // 正常
	UserDeleted                       // 已删除
)

type User struct {
	BaseModel
	Name     string     `json:"name" gorm:"type:varchar(127);not null" description:"用户姓名"`
	Password string     `json:"-" gorm:"type:varchar(64);not null" description:"密码"`
	Salt     string     `json:"-" gorm:"type:varchar(32);not null" description:"密码 salt"`
	Status   UserStatus `json:"status" gorm:"type:tinyint(1);not null" description:"用户状态"`
	Phone    string     `json:"phone" gorm:"type:varchar(11);unique;default:null" description:"用户手机号"`
	Balance  float64    `json:"balance" gorm:"type:float;" description:"账户剩余(固定)资金(元)"`
}

func NewUser(name, password, phoneNumber string) *User {

	salt := random.GenerateRandomString(32)
	passwordHash := fmt.Sprintf("%x", sha256.Sum256([]byte(password)))
	password = fmt.Sprintf("%x", sha256.Sum256([]byte(passwordHash+salt)))

	return &User{
		Name:     name,
		Password: password,
		Salt:     salt,
		Status:   UserNormal,
		Phone:    phoneNumber,
		Balance:  100000000, // 默认1亿元余额
	}
}
