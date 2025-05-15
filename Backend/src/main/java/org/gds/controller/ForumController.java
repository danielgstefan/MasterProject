package org.gds.controller;

import org.gds.model.ForumComment;
import org.gds.model.ForumLike;
import org.gds.model.ForumPost;
import org.gds.model.User;
import org.gds.payload.request.CommentRequest;
import org.gds.payload.request.PostRequest;
import org.gds.payload.response.MessageResponse;
import org.gds.service.ForumService;
import org.gds.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.Map;

/**
 * REST controller for forum operations.
 */
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/forum")
public class ForumController {

    @Autowired
    private ForumService forumService;

    @Autowired
    private UserService userService;

    // Helper method to get the current authenticated user
    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return userService.getUserByUsername(username)
                .orElseThrow(() -> new IllegalStateException("User not found: " + username));
    }

    // Post endpoints

    /**
     * Get all posts with pagination.
     *
     * @param page page number
     * @param size page size
     * @param sort sort field
     * @param direction sort direction
     * @return page of posts
     */
    @GetMapping("/posts")
    public ResponseEntity<Page<ForumPost>> getAllPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sort,
            @RequestParam(defaultValue = "desc") String direction) {
        
        Sort.Direction sortDirection = direction.equalsIgnoreCase("asc") ? 
                Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sort));
        
        Page<ForumPost> posts = forumService.getAllPosts(pageable);
        return ResponseEntity.ok(posts);
    }

    /**
     * Get posts by category with pagination.
     *
     * @param category category name
     * @param page page number
     * @param size page size
     * @return page of posts in the category
     */
    @GetMapping("/posts/category/{category}")
    public ResponseEntity<Page<ForumPost>> getPostsByCategory(
            @PathVariable String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<ForumPost> posts = forumService.getPostsByCategory(category, pageable);
        return ResponseEntity.ok(posts);
    }

    /**
     * Get a post by ID.
     *
     * @param id post ID
     * @return the post if found
     */
    @GetMapping("/posts/{id}")
    public ResponseEntity<ForumPost> getPostById(@PathVariable Long id) {
        return forumService.getPostById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Create a new post.
     *
     * @param postRequest post request data
     * @return the created post
     */
    @PostMapping("/posts")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<ForumPost> createPost(@Valid @RequestBody PostRequest postRequest) {
        User currentUser = getCurrentUser();
        
        ForumPost post = new ForumPost(
                postRequest.getTitle(),
                postRequest.getContent(),
                currentUser,
                postRequest.getCategory()
        );
        
        ForumPost createdPost = forumService.createPost(post);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdPost);
    }

    /**
     * Update a post.
     *
     * @param id post ID
     * @param postRequest updated post data
     * @return the updated post if found
     */
    @PutMapping("/posts/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> updatePost(
            @PathVariable Long id,
            @Valid @RequestBody PostRequest postRequest) {
        
        User currentUser = getCurrentUser();
        
        return forumService.getPostById(id)
                .map(post -> {
                    // Check if the user is the author or an admin
                    if (!post.getAuthor().getId().equals(currentUser.getId()) && 
                            !currentUser.getRoles().stream().anyMatch(role -> 
                                    role.getName().name().equals("ROLE_ADMIN"))) {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                                .body(new MessageResponse("You can only edit your own posts"));
                    }
                    
                    ForumPost updatedPost = new ForumPost();
                    updatedPost.setTitle(postRequest.getTitle());
                    updatedPost.setContent(postRequest.getContent());
                    updatedPost.setCategory(postRequest.getCategory());
                    
                    return forumService.updatePost(id, updatedPost)
                            .map(ResponseEntity::ok)
                            .orElse(ResponseEntity.notFound().build());
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Delete a post.
     *
     * @param id post ID
     * @return success message
     */
    @DeleteMapping("/posts/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> deletePost(@PathVariable Long id) {
        User currentUser = getCurrentUser();
        
        return forumService.getPostById(id)
                .map(post -> {
                    // Check if the user is the author or an admin
                    if (!post.getAuthor().getId().equals(currentUser.getId()) && 
                            !currentUser.getRoles().stream().anyMatch(role -> 
                                    role.getName().name().equals("ROLE_ADMIN"))) {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                                .body(new MessageResponse("You can only delete your own posts"));
                    }
                    
                    forumService.deletePost(id);
                    return ResponseEntity.ok(new MessageResponse("Post deleted successfully"));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Search posts by title or content.
     *
     * @param query search query
     * @param page page number
     * @param size page size
     * @return page of matching posts
     */
    @GetMapping("/posts/search")
    public ResponseEntity<Page<ForumPost>> searchPosts(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<ForumPost> posts = forumService.searchPosts(query, pageable);
        return ResponseEntity.ok(posts);
    }

    // Comment endpoints

    /**
     * Get comments for a post with pagination.
     *
     * @param postId post ID
     * @param page page number
     * @param size page size
     * @return page of comments for the post
     */
    @GetMapping("/posts/{postId}/comments")
    public ResponseEntity<Page<ForumComment>> getCommentsByPostId(
            @PathVariable Long postId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "createdAt"));
        
        try {
            Page<ForumComment> comments = forumService.getCommentsByPostId(postId, pageable);
            return ResponseEntity.ok(comments);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Create a new comment.
     *
     * @param postId post ID
     * @param commentRequest comment request data
     * @return the created comment
     */
    @PostMapping("/posts/{postId}/comments")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> createComment(
            @PathVariable Long postId,
            @Valid @RequestBody CommentRequest commentRequest) {
        
        User currentUser = getCurrentUser();
        
        return forumService.getPostById(postId)
                .map(post -> {
                    ForumComment comment = new ForumComment(
                            commentRequest.getContent(),
                            currentUser,
                            post
                    );
                    
                    ForumComment createdComment = forumService.createComment(comment);
                    return ResponseEntity.status(HttpStatus.CREATED).body(createdComment);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Update a comment.
     *
     * @param commentId comment ID
     * @param commentRequest updated comment data
     * @return the updated comment if found
     */
    @PutMapping("/comments/{commentId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> updateComment(
            @PathVariable Long commentId,
            @Valid @RequestBody CommentRequest commentRequest) {
        
        User currentUser = getCurrentUser();
        
        return forumService.getCommentById(commentId)
                .map(comment -> {
                    // Check if the user is the author or an admin
                    if (!comment.getAuthor().getId().equals(currentUser.getId()) && 
                            !currentUser.getRoles().stream().anyMatch(role -> 
                                    role.getName().name().equals("ROLE_ADMIN"))) {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                                .body(new MessageResponse("You can only edit your own comments"));
                    }
                    
                    ForumComment updatedComment = new ForumComment();
                    updatedComment.setContent(commentRequest.getContent());
                    
                    return forumService.updateComment(commentId, updatedComment)
                            .map(ResponseEntity::ok)
                            .orElse(ResponseEntity.notFound().build());
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Delete a comment.
     *
     * @param commentId comment ID
     * @return success message
     */
    @DeleteMapping("/comments/{commentId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> deleteComment(@PathVariable Long commentId) {
        User currentUser = getCurrentUser();
        
        return forumService.getCommentById(commentId)
                .map(comment -> {
                    // Check if the user is the author or an admin
                    if (!comment.getAuthor().getId().equals(currentUser.getId()) && 
                            !currentUser.getRoles().stream().anyMatch(role -> 
                                    role.getName().name().equals("ROLE_ADMIN"))) {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                                .body(new MessageResponse("You can only delete your own comments"));
                    }
                    
                    forumService.deleteComment(commentId);
                    return ResponseEntity.ok(new MessageResponse("Comment deleted successfully"));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Like endpoints

    /**
     * Like a post.
     *
     * @param postId post ID
     * @return success message
     */
    @PostMapping("/posts/{postId}/like")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> likePost(@PathVariable Long postId) {
        User currentUser = getCurrentUser();
        
        try {
            forumService.likePost(currentUser, postId, true);
            return ResponseEntity.ok(new MessageResponse("Post liked successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Dislike a post.
     *
     * @param postId post ID
     * @return success message
     */
    @PostMapping("/posts/{postId}/dislike")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> dislikePost(@PathVariable Long postId) {
        User currentUser = getCurrentUser();
        
        try {
            forumService.likePost(currentUser, postId, false);
            return ResponseEntity.ok(new MessageResponse("Post disliked successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Remove a like or dislike from a post.
     *
     * @param postId post ID
     * @return success message
     */
    @DeleteMapping("/posts/{postId}/like")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> removeLike(@PathVariable Long postId) {
        User currentUser = getCurrentUser();
        
        try {
            forumService.removeLike(currentUser, postId);
            return ResponseEntity.ok(new MessageResponse("Like/dislike removed successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Get the like status and count for a post.
     *
     * @param postId post ID
     * @return like status and count
     */
    @GetMapping("/posts/{postId}/likes")
    public ResponseEntity<?> getLikeInfo(@PathVariable Long postId) {
        try {
            Long likeCount = forumService.getLikeCount(postId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("likeCount", likeCount);
            
            // Add user's like status if authenticated
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.isAuthenticated() && 
                    !authentication.getName().equals("anonymousUser")) {
                User currentUser = getCurrentUser();
                Boolean userLikeStatus = forumService.getUserLikeStatus(currentUser, postId);
                response.put("userLikeStatus", userLikeStatus);
            }
            
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}