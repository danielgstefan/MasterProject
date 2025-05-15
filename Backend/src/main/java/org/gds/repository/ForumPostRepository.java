package org.gds.repository;

import org.gds.model.ForumPost;
import org.gds.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for ForumPost entity.
 */
@Repository
public interface ForumPostRepository extends JpaRepository<ForumPost, Long> {
    
    /**
     * Find all posts by category.
     * 
     * @param category the category name
     * @return list of posts in the category
     */
    List<ForumPost> findByCategory(String category);
    
    /**
     * Find all posts by author.
     * 
     * @param author the post author
     * @return list of posts by the author
     */
    List<ForumPost> findByAuthor(User author);
    
    /**
     * Find all posts by category with pagination.
     * 
     * @param category the category name
     * @param pageable pagination information
     * @return page of posts in the category
     */
    Page<ForumPost> findByCategory(String category, Pageable pageable);
    
    /**
     * Find all posts with pagination.
     * 
     * @param pageable pagination information
     * @return page of posts
     */
    Page<ForumPost> findAll(Pageable pageable);
    
    /**
     * Find posts containing the given text in title or content.
     * 
     * @param text the search text
     * @param pageable pagination information
     * @return page of matching posts
     */
    Page<ForumPost> findByTitleContainingIgnoreCaseOrContentContainingIgnoreCase(
            String text, String textRepeat, Pageable pageable);
}