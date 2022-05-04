package password

import "regexp"

// IsSafe 检测密码强度是否安全(需要包含字母、数字)
func IsSafe(password string) bool {

	//  `[0-9]+`, `[a-z]+`, `[A-Z]+`, `[~!@#$%^&*?_-]+`
	patternList := []string{`[0-9]+`, `[a-zA-Z]+`}
	for _, pattern := range patternList {
		match, _ := regexp.MatchString(pattern, password)
		if !match {
			return false
		}
	}

	return true
}
