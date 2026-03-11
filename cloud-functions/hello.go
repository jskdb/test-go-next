package handler

import (
	"encoding/json"
	"net/http"
	"runtime"
)

// Handler — 最基础的 handler
// api/hello.go → GET /hello
func Handler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message":   "Hello from EdgeOne Go Functions!",
		"path":      r.URL.Path,
		"method":    r.Method,
		"goVersion": runtime.Version(),
	})
}
