package org.gds.repository;

import org.gds.model.ForumPost;
import org.gds.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface ForumPostRepository extends JpaRepository<ForumPost, Long> {
    

    List<ForumPost> findByCategory(String category);
    

    List<ForumPost> findByAuthor(User author);
    

    Page<ForumPost> findByCategory(String category, Pageable pageable);
    

    Page<ForumPost> findAll(Pageable pageable);
    

    Page<ForumPost> findByTitleContainingIgnoreCaseOrContentContainingIgnoreCase(
            String text, String textRepeat, Pageable pageable);
}