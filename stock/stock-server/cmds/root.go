package cmds

import (
	"github.com/spf13/cobra"
	"stock-server/config"
	"stock-server/config/log"
)

var configPath string
var RootCmd = &cobra.Command{
	Use:     "app",
	Short:   "app server",
	Version: "1.0",

	Aliases: []string{"a"},
	PersistentPreRunE: func(cmd *cobra.Command, args []string) error {

		// Initialize config from config file
		err := config.InitConfig(configPath)

		// Initialize log format
		appConfig := config.GetConfig()
		if err := log.InitLog(appConfig); err != nil {
			return err
		}

		return err
	},
}

func init() {
	RootCmd.PersistentFlags().StringVar(&configPath, "conf", "", "configuration file path")
}
