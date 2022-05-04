package mine

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"stock-server/api/v1/response"
	"stock-server/config/db"
	"stock-server/internal/service/current_user"
	"stock-server/models"
)

type SaleStockResponse struct {
	response.Response
	Data *models.MineStock `json:"data"`
}

type SaleStockInput struct {
	ID    string `json:"id" form:"id" validate:"required" description:"记录id"`
	Count int64  `json:"count" form:"count" validate:"required" description:"卖出数量(手)"`
}

func SaleStock(ctx *gin.Context, in *SaleStockInput) (*SaleStockResponse, error) {

	currentUserInterface, _ := ctx.Get(current_user.CurrentUserIdentity)
	currentUser := currentUserInterface.(*current_user.CurrentUser)

	tx := db.GetDB().Begin()

	// 卖出股票
	mineStock := &models.MineStock{
		BaseModel: models.BaseModel{
			Id: in.ID,
		},
		CreatedUserID: currentUser.Id,
	}
	// 查询是否购买过
	err := db.GetDB().First(mineStock, mineStock).Error
	if err != nil && err == gorm.ErrRecordNotFound {
		return nil, response.NewValidationErrorResponseWithMessage("found_record", "record_not_found")
	}

	if err != nil{
		return nil, err
	}

	balance := mineStock.TradingTotalPrice - float64(in.Count)*100*mineStock.Price
	if balance < 0 { // 卖出余额不足
		return nil, response.NewValidationErrorResponseWithMessage("balance", "insufficient_account_balance")
	}

	mineStock.Count = mineStock.Count - in.Count
	mineStock.TradingTotalPrice = balance
	switch mineStock.Count {
	case 0: // 该股票余额为零时，删除该记录
		if err := tx.Delete(mineStock).Error; err != nil {
			return nil, err
		}
	default:
		if err := tx.Save(mineStock).Error; err != nil {
			return nil, err
		}
	}

	// 记录交易
	transaction := &models.Transaction{
		CreatedUserID:     currentUser.Id,
		Name:              mineStock.Name,
		Code:              mineStock.Code,
		Price:             mineStock.Price,
		Count:             in.Count,
		TradingTotalPrice: float64(in.Count) * 100 * mineStock.Price,
		Type:              models.TransactionTypeSale,
	}
	if err := tx.Create(transaction).Error; err != nil {
		return nil, err
	}

	// 余额增加
	currentUser.User.Balance = currentUser.User.Balance + float64(in.Count)*100*mineStock.Price
	if err := tx.Save(currentUser.User).Error; err != nil {
		return nil, err
	}

	if err := tx.Commit().Error; err != nil {
		return nil, err
	}

	return &SaleStockResponse{
		Data: mineStock,
	}, nil
}
