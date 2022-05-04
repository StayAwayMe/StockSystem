package api

import (
	"regexp"
	"stock-server/api/ping"
	"stock-server/api/v1"
	"stock-server/api/v1/middleware"
	"stock-server/config"
	"stock-server/config/log"

	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
	"github.com/wI2L/fizz"
	"github.com/wI2L/fizz/openapi"
)

func GetHttpApplication(appConfig *config.AppConfig) *gin.Engine {

	engine := gin.New()
	engine.Use(middleware.SetResponseHeader())
	engine.Use(middleware.Cors())

	gin.SetMode(appConfig.Environment)
	engine.Use(gin.LoggerWithWriter(log.StandardLogger().Out))
	engine.Use(gin.RecoveryWithWriter(log.StandardLogger().Out))
	engine.Use(APIVersion())

	// Serve static files under static folder
	// for OpenAPI documentations
	engine.Use(static.Serve("/static", static.LocalFile("./static", false)))

	fizzEngine := fizz.NewFromEngine(engine)

	// Do not include package name in component names
	fizzEngine.Generator().UseFullSchemaNames(false)

	// ping api
	ping.InitRoutes(fizzEngine)
	// v1 api
	v1.InitRoutes(fizzEngine)

	// Serve OpenAPI specifications
	infos := &openapi.Info{
		Title:       "Go service",
		Description: "A template for Golang API server",
		Version:     "1.0.0",
	}

	fizzEngine.GET("/openapi.json", nil, fizzEngine.OpenAPI(infos, "json"))
	fizzEngine.GET("/openapi.yml", nil, fizzEngine.OpenAPI(infos, "yaml"))

	if len(fizzEngine.Errors()) != 0 {

		for _, err := range fizzEngine.Errors() {
			log.Error(err)
		}

		panic("fizz initialization error")
	}

	return engine
}

func APIVersion() gin.HandlerFunc {
	return func(c *gin.Context) {

		path := c.FullPath()

		re := regexp.MustCompile(`^/v([0-9]+)/`)
		matches := re.FindStringSubmatch(path)

		if len(matches) > 1 {
			c.Set("api_version", matches[1])
		}

		c.Next()
	}
}
