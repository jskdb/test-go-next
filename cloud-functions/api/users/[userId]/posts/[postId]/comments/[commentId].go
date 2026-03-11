package handler

import (
	"encoding/json"
	"net/http"
	"strings"
)

// Handler — 三层动态参数：获取用户文章的某条评论
// 路由: GET /api/users/:userId/posts/:postId/comments/:commentId
// 示例: /api/users/u-100/posts/p-200/comments/c-300
// 路径结构: /api/users/{userId}/posts/{postId}/comments/{commentId}
func Handler(w http.ResponseWriter, r *http.Request) {
	parts := strings.Split(r.URL.Path, "/")
	// parts: ["", "api", "users", userId, "posts", postId, "comments", commentId]
	userId := parts[3]
	postId := parts[5]
	commentId := parts[7]

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"userId":    userId,
		"postId":    postId,
		"commentId": commentId,
		"comment":   "Comment " + commentId + " on Post " + postId,
		"author":    "User " + userId,
		"path":      r.URL.Path,
		"method":    r.Method,
	})
}
