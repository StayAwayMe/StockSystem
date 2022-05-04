package error

type FailedData struct {
	FieldName string `json:"field_name" description:"The name of the field that fails the validation"`
	Message   string `json:"message" description:"The error type of the validation that fails"`
}

var (
	// user
	UserPasswordFormatError = &FailedData{"password_format_error", "password need to contain letters and numbers"} // 密码格式不合法错误
	// permissions
	AuthenticationError = &FailedData{"authentication_error", "no operation permission"} // 没有操作权限
)
