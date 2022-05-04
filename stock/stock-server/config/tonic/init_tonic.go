package tonic

import (
	"github.com/gin-gonic/gin"
	"github.com/loopfz/gadgeto/tonic"
	"io"
	"net/http"
	"reflect"
	responseV1 "stock-server/api/v1/response"
	"strings"
)

const (
	RequestRouterAPI         = "api"
	RequestRouterOpenAPI     = "openapi"
)

func InitTonic() {

	// Initialize our own handlers
	tonic.SetBindHook(DefaultBindingHookMaxBodyBytes(10 * 1024 * 1024)) // 字段binding 大小限制
	tonic.SetErrorHook(TonicResponseErrorHook)
	tonic.SetRenderHook(TonicRenderHook, "")
	tonic.RegisterTagNameFunc(func(fld reflect.StructField) string {
		name := strings.SplitN(fld.Tag.Get("json"), ",", 2)[0]
		if name == "-" {
			return ""
		}
		return name
	})

}

// TonicResponseErrorHook Distribute binding & error handling & render handling to implementations in different API versions
func TonicResponseErrorHook(ctx *gin.Context, err error) (int, interface{}) {
	apiVersion := ctx.GetString("api_version")
	switch apiVersion {
	case "1":
		return responseV1.TonicErrorResponse(ctx, err)
	default:
		return tonic.DefaultErrorHook(ctx, err)
	}
}

func TonicRenderHook(ctx *gin.Context, statusCode int, payload interface{}) {

	apiVersion := ctx.GetString("api_version")

	switch {
	case strings.HasPrefix(ctx.Request.Host, RequestRouterAPI) && apiVersion == "1":
		responseV1.TonicRenderResponse(ctx, statusCode, payload)
	default:
		responseV1.TonicRenderResponse(ctx, statusCode, payload)
	}
}

func DefaultBindingHookMaxBodyBytes(maxBodyBytes int64) tonic.BindHook {
	return func(c *gin.Context, i interface{}) error {
		c.Request.Body = http.MaxBytesReader(c.Writer, c.Request.Body, maxBodyBytes)
		if err := c.ShouldBind(i); err != nil && err != io.EOF {
			return err
		}
		return nil
	}
}
