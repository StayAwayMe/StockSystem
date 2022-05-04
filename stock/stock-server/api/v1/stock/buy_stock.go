package stock

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"stock-server/api/v1/response"
	"stock-server/config/db"
	"stock-server/internal/service/current_user"
	"stock-server/models"
)

type BuyStockResponse struct {
	response.Response
	Data *models.MineStock `json:"data"`
}

type BuyStockInput struct {
	ID    string `json:"id" form:"id" validate:"required" description:"股票id"`
	Count int64  `json:"count" form:"count" validate:"required" description:"购买数量(手)"`
}

func BuyStock(ctx *gin.Context, in *BuyStockInput) (*BuyStockResponse, error) {

	currentUserInterface, _ := ctx.Get(current_user.CurrentUserIdentity)
	currentUser := currentUserInterface.(*current_user.CurrentUser)

	stock := &models.Stock{
		BaseModel: models.BaseModel{
			Id: in.ID,
		},
	}

	err := db.GetDB().First(stock, stock).Error
	if err != nil && err == gorm.ErrRecordNotFound {
		return nil, response.NewValidationErrorResponseWithMessage("found_record", "record_not_found")
	}
	if err != nil {
		return nil, err
	}

	tx := db.GetDB().Begin()

	// 购买股票
	mineStock := &models.MineStock{
		CreatedUserID: currentUser.Id,
		Name:          stock.Name,
		Code:          stock.Code,
	}
	// 查询是否购买过
	err = db.GetDB().First(mineStock, mineStock).Error
	if err != nil && err != gorm.ErrRecordNotFound {
		return nil, err
	}

	mineStock.Price = stock.Price
	mineStock.Count = mineStock.Count + in.Count
	mineStock.TradingTotalPrice = mineStock.TradingTotalPrice + float64(in.Count)*100*stock.Price
	if err := tx.Save(mineStock).Error; err != nil {
		return nil, err
	}

	// 记录交易
	transaction := &models.Transaction{
		CreatedUserID:     currentUser.Id,
		Name:              stock.Name,
		Code:              stock.Code,
		Price:             stock.Price,
		Count:             in.Count,
		TradingTotalPrice: float64(in.Count) * 100 * stock.Price,
		Type:              models.TransactionTypeBuy,
	}
	if err := tx.Create(transaction).Error; err != nil {
		return nil, err
	}

	// 余额扣除
	currentUser.User.Balance = currentUser.User.Balance - float64(in.Count)*100*stock.Price
	if err := tx.Save(currentUser.User).Error; err != nil {
		return nil, err
	}

	if err := tx.Commit().Error; err != nil {
		return nil, err
	}

	return &BuyStockResponse{
		Data: mineStock,
	}, nil
}
