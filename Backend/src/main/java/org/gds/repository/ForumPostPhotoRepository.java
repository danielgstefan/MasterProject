package org.gds.repository;

import org.gds.model.ForumPost;
import org.gds.model.ForumPostPhoto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ForumPostPhotoRepository extends JpaRepository<ForumPostPhoto, Long> {
    
    List<ForumPostPhoto> findByPost(ForumPost post);
    
    void deleteByPost(ForumPost post);
}