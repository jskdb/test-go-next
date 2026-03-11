package handler

import (
	"encoding/json"
	"net/http"
	"strings"
)

// Handler — 动态路由参数
// api/[id].go → GET /api/:id
func Handler(w http.ResponseWriter, r *http.Request) {
	parts := strings.Split(r.URL.Path, "/")
	userID := parts[len(parts)-1]

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"user_id": userID,
		"path":    r.URL.Path,
		"method":  r.Method,
		"message": "User detail for ID: " + userID,
	})
}
