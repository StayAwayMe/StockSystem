package cmds

import (
	"fmt"
	"github.com/spf13/cobra"
	"net/http"
	"stock-server/api"
	"stock-server/config"
	"stock-server/config/db"
	"stock-server/config/log"
	"stock-server/config/origin"
	"stock-server/config/session"
	"stock-server/config/tonic"
)

type Subdomains map[string]http.Handler

var ServerCmd = &cobra.Command{
	Use:     "server",
	Aliases: []string{"s"},
	Short:   "node server",
	RunE: func(cmd *cobra.Command, args []string) error {
		log.Info("start service server")
		appConfig := config.GetConfig()

		// Initialize app config
		if err := InitAllFromAppConfig(appConfig); err != nil {
			panic(err)
		}

		// Start http server
		app := api.GetHttpApplication(appConfig)
		address := fmt.Sprintf("%s:%s", appConfig.Http.Host, appConfig.Http.Port)

		log.Info("server url:" + address)
		return app.Run(address)
	},
}

func InitAllFromAppConfig(appConfig *config.AppConfig) error {

	// Initialize tonic  tonic配置会全局覆盖
	tonic.InitTonic()

	// Initialize database
	if err := db.InitDB(appConfig); err != nil {
		return err
	}

	// Initialize session store
	if err := session.InitSessionStore(appConfig); err != nil {
		return err
	}

	// Initialize cors allow origin
	if err := origin.InitOrigin(appConfig); err != nil {
		return err
	}

	return nil
}
