package get

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"stock-server/config/log"
)

type PingGetResponse struct {
	Request struct {
		Header http.Header `json:"header"`
	} `json:"request"`
	Response struct {
		Message string `json:"message"`
	} `json:"response"`
}

func PingGet(ctx *gin.Context) (resp *PingGetResponse, err error) {

	resp = &PingGetResponse{
		Request: struct {
			Header http.Header `json:"header"`
		}{Header: ctx.Request.Header},
		Response: struct {
			Message string `json:"message"`
		}{Message: "success"},
	}

	log.Infof("response header info: %+v", resp.Request.Header)

	return
}
