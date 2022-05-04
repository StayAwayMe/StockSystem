package ping

import (
	"github.com/loopfz/gadgeto/tonic"
	"github.com/wI2L/fizz"
	"stock-server/api/ping/get"
	"stock-server/api/ping/post"
)

func InitRoutes(r *fizz.Fizz) {

	pingGroup := r.Group("ping", "ping", "Ping Test APIs")

	// ping get
	pingGroup.GET("", []fizz.OperationOption{
		fizz.Summary("ping for get "),
	}, tonic.Handler(get.PingGet, 200))

	// ping post
	pingGroup.POST("", []fizz.OperationOption{
		fizz.Summary("ping for post "),
	}, tonic.Handler(post.PingPost, 200))

}
