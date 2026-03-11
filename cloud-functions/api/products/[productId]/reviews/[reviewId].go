package handler

import (
	"encoding/json"
	"net/http"
	"strings"
)

// Handler — 多动态参数：获取商品的某条评论
// 路由: GET /api/products/:productId/reviews/:reviewId
// 示例: /api/products/sku-001/reviews/42
// 路径结构: /api/products/{productId}/reviews/{reviewId}
func Handler(w http.ResponseWriter, r *http.Request) {
	parts := strings.Split(r.URL.Path, "/")
	// /api/products/{productId}/reviews/{reviewId}
	// parts: ["", "api", "products", productId, "reviews", reviewId]
	productId := parts[3]
	reviewId := parts[5]

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"productId": productId,
		"reviewId":  reviewId,
		"comment":   "Great product!",
		"rating":    5,
		"path":      r.URL.Path,
		"method":    r.Method,
	})
}
