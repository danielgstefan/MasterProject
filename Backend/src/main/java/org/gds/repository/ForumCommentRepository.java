package org.gds.repository;

import org.gds.model.ForumComment;
import org.gds.model.ForumPost;
import org.gds.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for ForumComment entity.
 */
@Repository
public interface ForumCommentRepository extends JpaRepository<ForumComment, Long> {
    
    /**
     * Find all comments for a post.
     * 
     * @param post the forum post
     * @return list of comments for the post
     */
    List<ForumComment> findByPost(ForumPost post);
    
    /**
     * Find all comments by a user.
     * 
     * @param author the comment author
     * @return list of comments by the author
     */
    List<ForumComment> findByAuthor(User author);
    
    /**
     * Find all comments for a post with pagination.
     * 
     * @param post the forum post
     * @param pageable pagination information
     * @return page of comments for the post
     */
    Page<ForumComment> findByPost(ForumPost post, Pageable pageable);
    
    /**
     * Count the number of comments for a post.
     * 
     * @param post the forum post
     * @return the number of comments
     */
    long countByPost(ForumPost post);
}