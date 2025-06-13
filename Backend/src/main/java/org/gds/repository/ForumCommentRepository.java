package org.gds.repository;

import org.gds.model.ForumComment;
import org.gds.model.ForumPost;
import org.gds.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface ForumCommentRepository extends JpaRepository<ForumComment, Long> {
    
    
    List<ForumComment> findByPost(ForumPost post);
    
    
    List<ForumComment> findByAuthor(User author);
    
    
    Page<ForumComment> findByPost(ForumPost post, Pageable pageable);
    
    
    long countByPost(ForumPost post);
}