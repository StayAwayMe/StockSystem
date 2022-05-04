package random

import (
	"fmt"
	"github.com/bwmarrin/snowflake"
	"math/rand"
	"time"
)

var node *snowflake.Node

var letterRunes = []rune("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz")

func init() {
	node, _ = snowflake.NewNode(1)
	// Initialize seed
	rand.Seed(time.Now().UnixNano())
}

func GenerateUUID() string {
	return node.Generate().String()
}

func GenerateRandomString(n int) string {

	b := make([]rune, n)
	for i := range b {
		b[i] = letterRunes[rand.Intn(len(letterRunes))]
	}
	return string(b)
}

func GenerateRandomCode(n int) string {
	return fmt.Sprintf("%06d", rand.Intn(n))
}
