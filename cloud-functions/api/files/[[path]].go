package handler

import (
	"encoding/json"
	"net/http"
	"strings"
)

// Handler — catch-all 路由：匹配 /api/files/ 下任意层级的路径
// 文件: api/files/[[path]].go → 路由: /api/files/:path*
// 示例:
//   /api/files              → path = ""
//   /api/files/readme.txt   → path = "readme.txt"
//   /api/files/docs/a/b.md  → path = "docs/a/b.md"
func Handler(w http.ResponseWriter, r *http.Request) {
	// /api/files/docs/a/b.md → 截取 /api/files/ 之后的部分
	prefix := "/api/files/"
	filePath := ""
	if strings.HasPrefix(r.URL.Path, prefix) {
		filePath = strings.TrimPrefix(r.URL.Path, prefix)
	}

	// 拆分层级
	segments := []string{}
	if filePath != "" {
		segments = strings.Split(filePath, "/")
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"filePath": filePath,
		"segments": segments,
		"depth":    len(segments),
		"path":     r.URL.Path,
		"method":   r.Method,
	})
}
