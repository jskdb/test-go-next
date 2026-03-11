package handler

import (
	"encoding/json"
	"io"
	"net/http"
)

// Handler — 请求回显（echo），返回请求的完整信息
// 用于调试和测试，支持任意 HTTP 方法
// 路由: /echo
func Handler(w http.ResponseWriter, r *http.Request) {
	// 读取 body
	body, _ := io.ReadAll(r.Body)
	defer r.Body.Close()

	// 收集 headers
	headers := make(map[string]string)
	for key, values := range r.Header {
		if len(values) > 0 {
			headers[key] = values[0]
		}
	}

	// 收集 query params
	queryParams := make(map[string]string)
	for key, values := range r.URL.Query() {
		if len(values) > 0 {
			queryParams[key] = values[0]
		}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"method":      r.Method,
		"path":        r.URL.Path,
		"queryParams": queryParams,
		"headers":     headers,
		"body":        string(body),
	})
}
