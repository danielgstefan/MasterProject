package org.gds.service;

import org.gds.model.ForumComment;
import org.gds.model.ForumLike;
import org.gds.model.ForumPost;
import org.gds.model.User;
import org.gds.repository.ForumCommentRepository;
import org.gds.repository.ForumLikeRepository;
import org.gds.repository.ForumPostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service for forum operations.
 */
@Service
public class ForumService {

    @Autowired
    private ForumPostRepository postRepository;

    @Autowired
    private ForumCommentRepository commentRepository;

    @Autowired
    private ForumLikeRepository likeRepository;

    // Post operations

    /**
     * Get all posts with pagination.
     *
     * @param pageable pagination information
     * @return page of posts
     */
    public Page<ForumPost> getAllPosts(Pageable pageable) {
        return postRepository.findAll(pageable);
    }

    /**
     * Get posts by category with pagination.
     *
     * @param category category name
     * @param pageable pagination information
     * @return page of posts in the category
     */
    public Page<ForumPost> getPostsByCategory(String category, Pageable pageable) {
        return postRepository.findByCategory(category, pageable);
    }

    /**
     * Get a post by ID.
     *
     * @param id post ID
     * @return the post if found
     */
    public Optional<ForumPost> getPostById(Long id) {
        return postRepository.findById(id);
    }

    /**
     * Create a new post.
     *
     * @param post the post to create
     * @return the created post
     */
    public ForumPost createPost(ForumPost post) {
        return postRepository.save(post);
    }

    /**
     * Update a post.
     *
     * @param id post ID
     * @param updatedPost the updated post data
     * @return the updated post if found
     */
    public Optional<ForumPost> updatePost(Long id, ForumPost updatedPost) {
        return postRepository.findById(id)
                .map(post -> {
                    post.setTitle(updatedPost.getTitle());
                    post.setContent(updatedPost.getContent());
                    post.setCategory(updatedPost.getCategory());
                    return postRepository.save(post);
                });
    }

    /**
     * Delete a post.
     *
     * @param id post ID
     */
    @Transactional
    public void deletePost(Long id) {
        postRepository.findById(id).ifPresent(post -> {
            // Delete all comments for the post
            commentRepository.findByPost(post).forEach(comment -> 
                commentRepository.delete(comment));

            // Delete all likes for the post
            likeRepository.findAll().stream()
                .filter(like -> like.getPost().getId().equals(id))
                .forEach(like -> likeRepository.delete(like));

            // Delete the post
            postRepository.delete(post);
        });
    }

    /**
     * Search posts by title or content.
     *
     * @param query search query
     * @param pageable pagination information
     * @return page of matching posts
     */
    public Page<ForumPost> searchPosts(String query, Pageable pageable) {
        return postRepository.findByTitleContainingIgnoreCaseOrContentContainingIgnoreCase(
                query, query, pageable);
    }

    // Comment operations

    /**
     * Get comments for a post with pagination.
     *
     * @param postId post ID
     * @param pageable pagination information
     * @return page of comments for the post
     */
    public Page<ForumComment> getCommentsByPostId(Long postId, Pageable pageable) {
        return postRepository.findById(postId)
                .map(post -> commentRepository.findByPost(post, pageable))
                .orElseThrow(() -> new IllegalArgumentException("Post not found with ID: " + postId));
    }

    /**
     * Create a new comment.
     *
     * @param comment the comment to create
     * @return the created comment
     */
    public ForumComment createComment(ForumComment comment) {
        return commentRepository.save(comment);
    }

    /**
     * Update a comment.
     *
     * @param id comment ID
     * @param updatedComment the updated comment data
     * @return the updated comment if found
     */
    public Optional<ForumComment> updateComment(Long id, ForumComment updatedComment) {
        return commentRepository.findById(id)
                .map(comment -> {
                    comment.setContent(updatedComment.getContent());
                    return commentRepository.save(comment);
                });
    }

    /**
     * Get a comment by ID.
     *
     * @param id comment ID
     * @return the comment if found
     */
    public Optional<ForumComment> getCommentById(Long id) {
        return commentRepository.findById(id);
    }

    /**
     * Delete a comment.
     *
     * @param id comment ID
     */
    public void deleteComment(Long id) {
        commentRepository.deleteById(id);
    }

    // Like operations

    /**
     * Like or dislike a post.
     *
     * @param user the user
     * @param postId the post ID
     * @param isLike true for like, false for dislike
     * @return the created or updated like
     */
    @Transactional
    public ForumLike likePost(User user, Long postId, boolean isLike) {
        ForumPost post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Post not found with ID: " + postId));

        Optional<ForumLike> existingLike = likeRepository.findByUserAndPost(user, post);

        if (existingLike.isPresent()) {
            ForumLike like = existingLike.get();
            like.setLike(isLike);
            return likeRepository.save(like);
        } else {
            ForumLike newLike = new ForumLike(user, post, isLike);
            return likeRepository.save(newLike);
        }
    }

    /**
     * Remove a like or dislike from a post.
     *
     * @param user the user
     * @param postId the post ID
     */
    @Transactional
    public void removeLike(User user, Long postId) {
        ForumPost post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Post not found with ID: " + postId));

        likeRepository.findByUserAndPost(user, post)
                .ifPresent(like -> likeRepository.delete(like));
    }

    /**
     * Get the like count for a post.
     *
     * @param postId the post ID
     * @return the like count (likes minus dislikes)
     */
    public Long getLikeCount(Long postId) {
        ForumPost post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Post not found with ID: " + postId));

        Long count = likeRepository.getTotalLikeCount(post);
        return count != null ? count : 0L;
    }

    /**
     * Get the count of likes for a post.
     *
     * @param postId the post ID
     * @return the count of likes
     */
    public Long getLikesCount(Long postId) {
        ForumPost post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Post not found with ID: " + postId));

        return likeRepository.countByPostAndIsLike(post, true);
    }

    /**
     * Get the count of dislikes for a post.
     *
     * @param postId the post ID
     * @return the count of dislikes
     */
    public Long getDislikesCount(Long postId) {
        ForumPost post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Post not found with ID: " + postId));

        return likeRepository.countByPostAndIsLike(post, false);
    }

    /**
     * Check if a user has liked or disliked a post.
     *
     * @param user the user
     * @param postId the post ID
     * @return the like status (true for like, false for dislike, null if not liked)
     */
    public Boolean getUserLikeStatus(User user, Long postId) {
        ForumPost post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Post not found with ID: " + postId));

        return likeRepository.findByUserAndPost(user, post)
                .map(ForumLike::isLike)
                .orElse(null);
    }
}
