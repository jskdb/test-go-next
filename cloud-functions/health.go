package handler

import (
	"encoding/json"
	"net/http"
	"time"
)

// Handler — 健康检查
// api/health.go → GET /health
func Handler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"status":    "ok",
		"timestamp": time.Now().UTC().Format(time.RFC3339),
	})
}
