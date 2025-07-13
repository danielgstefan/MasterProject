package org.gds.service;

import org.gds.model.ForumComment;
import org.gds.model.ForumLike;
import org.gds.model.ForumPost;
import org.gds.model.ForumPostPhoto;
import org.gds.model.User;
import org.gds.repository.ForumCommentRepository;
import org.gds.repository.ForumLikeRepository;
import org.gds.repository.ForumPostPhotoRepository;
import org.gds.repository.ForumPostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;


@Service
public class ForumService {

    @Autowired
    private ForumPostRepository postRepository;

    @Autowired
    private ForumCommentRepository commentRepository;

    @Autowired
    private ForumLikeRepository likeRepository;

    @Autowired
    private ForumPostPhotoRepository photoRepository;



    public Page<ForumPost> getAllPosts(Pageable pageable) {
        return postRepository.findAll(pageable);
    }


    public Page<ForumPost> getPostsByCategory(String category, Pageable pageable) {
        return postRepository.findByCategory(category, pageable);
    }


    public Optional<ForumPost> getPostById(Long id) {
        return postRepository.findById(id);
    }


    public ForumPost createPost(ForumPost post) {
        return postRepository.save(post);
    }


    public Optional<ForumPost> updatePost(Long id, ForumPost updatedPost) {
        return postRepository.findById(id)
                .map(post -> {
                    post.setTitle(updatedPost.getTitle());
                    post.setContent(updatedPost.getContent());
                    post.setCategory(updatedPost.getCategory());
                    return postRepository.save(post);
                });
    }


    @Transactional
    public void deletePost(Long id) {
        postRepository.findById(id).ifPresent(post -> {
            commentRepository.findByPost(post).forEach(comment ->
                commentRepository.delete(comment));

            likeRepository.findAll().stream()
                .filter(like -> like.getPost().getId().equals(id))
                .forEach(like -> likeRepository.delete(like));

            photoRepository.findByPost(post).forEach(photo -> {
                photoRepository.delete(photo);
            });

            postRepository.delete(post);
        });
    }


    public Page<ForumPost> searchPosts(String query, Pageable pageable) {
        return postRepository.findByTitleContainingIgnoreCaseOrContentContainingIgnoreCase(
                query, query, pageable);
    }



    public Page<ForumComment> getCommentsByPostId(Long postId, Pageable pageable) {
        return postRepository.findById(postId)
                .map(post -> commentRepository.findByPost(post, pageable))
                .orElseThrow(() -> new IllegalArgumentException("Post not found with ID: " + postId));
    }


    public ForumComment createComment(ForumComment comment) {
        return commentRepository.save(comment);
    }


    public Optional<ForumComment> updateComment(Long id, ForumComment updatedComment) {
        return commentRepository.findById(id)
                .map(comment -> {
                    comment.setContent(updatedComment.getContent());
                    return commentRepository.save(comment);
                });
    }


    public Optional<ForumComment> getCommentById(Long id) {
        return commentRepository.findById(id);
    }


    public void deleteComment(Long id) {
        commentRepository.deleteById(id);
    }



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


    @Transactional
    public void removeLike(User user, Long postId) {
        ForumPost post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Post not found with ID: " + postId));

        likeRepository.findByUserAndPost(user, post)
                .ifPresent(like -> likeRepository.delete(like));
    }


    public Long getLikeCount(Long postId) {
        ForumPost post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Post not found with ID: " + postId));

        Long count = likeRepository.getTotalLikeCount(post);
        return count != null ? count : 0L;
    }


    public Long getLikesCount(Long postId) {
        ForumPost post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Post not found with ID: " + postId));

        return likeRepository.countByPostAndIsLike(post, true);
    }


    public Long getDislikesCount(Long postId) {
        ForumPost post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Post not found with ID: " + postId));

        return likeRepository.countByPostAndIsLike(post, false);
    }


    public Boolean getUserLikeStatus(User user, Long postId) {
        ForumPost post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Post not found with ID: " + postId));

        return likeRepository.findByUserAndPost(user, post)
                .map(ForumLike::isLike)
                .orElse(null);
    }


    public ForumPostPhoto savePhoto(ForumPostPhoto photo) {
        return photoRepository.save(photo);
    }

    public List<ForumPostPhoto> getPhotosByPost(ForumPost post) {
        return photoRepository.findByPost(post);
    }

    public Optional<ForumPostPhoto> getPhotoById(Long id) {
        return photoRepository.findById(id);
    }

    public void deletePhoto(ForumPostPhoto photo) {
        photoRepository.delete(photo);
    }

    @Transactional
    public void deletePhotosByPost(ForumPost post) {
        photoRepository.deleteByPost(post);
    }
}
