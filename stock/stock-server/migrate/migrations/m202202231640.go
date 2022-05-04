package migrations

import (
	"github.com/go-gormigrate/gormigrate/v2"
	"gorm.io/gorm"
	"stock-server/models"
)

var M202202231640 *gormigrate.Migration

func init() {

	M202202231640 = &gormigrate.Migration{
		ID: "202202231640",
		Migrate: func(tx *gorm.DB) error {
			if err := tx.AutoMigrate(&models.User{}); err != nil {
				return err
			}
			if err := tx.AutoMigrate(&models.Stock{}); err != nil {
				return err
			}
			if err := tx.AutoMigrate(&models.MineStock{}); err != nil {
				return err
			}
			if err := tx.AutoMigrate(&models.Transaction{}); err != nil {
				return err
			}
			if err := tx.AutoMigrate(&models.News{}); err != nil {
				return err
			}
			return nil
		},
		Rollback: func(tx *gorm.DB) error {
			if err := tx.Migrator().DropTable("users"); err != nil {
				return err
			}
			if err := tx.Migrator().DropTable("stocks"); err != nil {
				return err
			}
			if err := tx.Migrator().DropTable("mine_stocks"); err != nil {
				return err
			}
			if err := tx.Migrator().DropTable("transactions"); err != nil {
				return err
			}
			if err := tx.Migrator().DropTable("news"); err != nil {
				return err
			}
			return nil
		},
	}
}
