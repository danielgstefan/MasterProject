package org.gds.controller;

import org.gds.model.ForumComment;
import org.gds.model.ForumLike;
import org.gds.model.ForumPost;
import org.gds.model.ForumPostPhoto;
import org.gds.model.User;
import org.gds.payload.request.CommentRequest;
import org.gds.payload.request.PostRequest;
import org.gds.payload.response.MessageResponse;
import org.gds.service.ForumService;
import org.gds.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.Valid;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;


@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/forum")
public class ForumController {

    @Autowired
    private ForumService forumService;

    @Autowired
    private UserService userService;

    @Value("${forum.photo.upload.dir:uploads/forum}")
    private String uploadDir;

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return userService.getUserByUsername(username)
                .orElseThrow(() -> new IllegalStateException("User not found: " + username));
    }



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


    @GetMapping("/posts/category/{category}")
    public ResponseEntity<Page<ForumPost>> getPostsByCategory(
            @PathVariable String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<ForumPost> posts = forumService.getPostsByCategory(category, pageable);
        return ResponseEntity.ok(posts);
    }


    @GetMapping("/posts/{id}")
    public ResponseEntity<ForumPost> getPostById(@PathVariable Long id) {
        return forumService.getPostById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }


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


    @PutMapping("/posts/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> updatePost(
            @PathVariable Long id,
            @Valid @RequestBody PostRequest postRequest) {

        User currentUser = getCurrentUser();

        return forumService.getPostById(id)
                .map(post -> {
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


    @DeleteMapping("/posts/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> deletePost(@PathVariable Long id) {
        User currentUser = getCurrentUser();

        return forumService.getPostById(id)
                .map(post -> {
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


    @GetMapping("/posts/search")
    public ResponseEntity<Page<ForumPost>> searchPosts(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<ForumPost> posts = forumService.searchPosts(query, pageable);
        return ResponseEntity.ok(posts);
    }



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


    @PutMapping("/comments/{commentId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> updateComment(
            @PathVariable Long commentId,
            @Valid @RequestBody CommentRequest commentRequest) {

        User currentUser = getCurrentUser();

        return forumService.getCommentById(commentId)
                .map(comment -> {
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


    @DeleteMapping("/comments/{commentId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> deleteComment(@PathVariable Long commentId) {
        User currentUser = getCurrentUser();

        return forumService.getCommentById(commentId)
                .map(comment -> {
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


    @GetMapping("/posts/{postId}/likes")
    public ResponseEntity<?> getLikeInfo(@PathVariable Long postId) {
        try {
            Long likesCount = forumService.getLikesCount(postId);
            Long dislikesCount = forumService.getDislikesCount(postId);
            Long totalLikeCount = forumService.getLikeCount(postId);

            Map<String, Object> response = new HashMap<>();
            response.put("likeCount", totalLikeCount);
            response.put("likesCount", likesCount);
            response.put("dislikesCount", dislikesCount);

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


    @PostMapping("/posts/{postId}/photos")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> uploadPostPhoto(
            @PathVariable Long postId,
            @RequestParam("file") MultipartFile file) {

        User currentUser = getCurrentUser();

        return forumService.getPostById(postId)
                .map(post -> {
                    if (!post.getAuthor().getId().equals(currentUser.getId()) &&
                            !currentUser.getRoles().stream().anyMatch(role -> 
                                    role.getName().name().equals("ROLE_ADMIN"))) {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                                .body(new MessageResponse("You can only add photos to your own posts"));
                    }

                    if (file.isEmpty()) {
                        return ResponseEntity.badRequest()
                                .body(new MessageResponse("Please select a file to upload"));
                    }

                    try {
                        String originalName = StringUtils.cleanPath(file.getOriginalFilename());
                        String extension = "";
                        int i = originalName.lastIndexOf('.');
                        if (i > 0) extension = originalName.substring(i);
                        String filename = UUID.randomUUID() + extension;

                        Path uploadPath = Paths.get(uploadDir);
                        if (!Files.exists(uploadPath)) {
                            Files.createDirectories(uploadPath);
                        }

                        Path filePath = uploadPath.resolve(filename);
                        file.transferTo(filePath);

                        String url = "/forum/" + filename;

                        ForumPostPhoto photo = new ForumPostPhoto(filename, url, originalName, post);
                        ForumPostPhoto savedPhoto = forumService.savePhoto(photo);

                        return ResponseEntity.ok(savedPhoto);
                    } catch (IOException e) {
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body(new MessageResponse("Failed to upload photo: " + e.getMessage()));
                    }
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/posts/{postId}/photos")
    public ResponseEntity<List<ForumPostPhoto>> getPostPhotos(@PathVariable Long postId) {
        return forumService.getPostById(postId)
                .map(post -> ResponseEntity.ok(forumService.getPhotosByPost(post)))
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/photos/{photoId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> deletePhoto(@PathVariable Long photoId) {
        User currentUser = getCurrentUser();

        return forumService.getPhotoById(photoId)
                .map(photo -> {
                    ForumPost post = photo.getPost();

                    if (!post.getAuthor().getId().equals(currentUser.getId()) &&
                            !currentUser.getRoles().stream().anyMatch(role -> 
                                    role.getName().name().equals("ROLE_ADMIN"))) {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                                .body(new MessageResponse("You can only delete photos from your own posts"));
                    }

                    try {
                        Path filePath = Paths.get(uploadDir).resolve(photo.getFilename());
                        Files.deleteIfExists(filePath);
                    } catch (IOException e) {
                        System.err.println("Error deleting file: " + e.getMessage());
                    }

                    forumService.deletePhoto(photo);
                    return ResponseEntity.ok(new MessageResponse("Photo deleted successfully"));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
