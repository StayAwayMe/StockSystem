package post

import (
	"encoding/json"
	"github.com/gin-gonic/gin"
	"io/ioutil"
	"net/http"
	"stock-server/config/log"
)

type PingPostResponse struct {
	Request struct {
		Header http.Header            `json:"header"`
		Body   map[string]interface{} `json:"body"`
	} `json:"request"`
	Response struct {
		Message string `json:"message"`
	} `json:"response"`
}

func PingPost(ctx *gin.Context) (resp *PingPostResponse, err error) {
	bodyBuffer, _ := ioutil.ReadAll(ctx.Request.Body)

	body := map[string]interface{}{}
	err = json.Unmarshal(bodyBuffer, &body)
	if err != nil {
		log.Errorf("PingGet json.Unmarshal error: %v", err)
	}

	resp = &PingPostResponse{
		Request: struct {
			Header http.Header            `json:"header"`
			Body   map[string]interface{} `json:"body"`
		}{Header: ctx.Request.Header, Body: body},
		Response: struct {
			Message string `json:"message"`
		}{Message: "success"},
	}

	log.Infof("response header info: %+v", resp.Request.Header)
	log.Infof("response body info: %+v", resp.Request.Body)

	return
}
