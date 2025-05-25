package org.gds.repository;
import org.springframework.data.repository.query.Param;

import org.gds.model.ForumLike;
import org.gds.model.ForumPost;
import org.gds.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface ForumLikeRepository extends JpaRepository<ForumLike, Long> {

    Optional<ForumLike> findByUserAndPost(User user, ForumPost post);


    @Query("SELECT COUNT(f) FROM ForumLike f WHERE f.post = :post AND f.isLike = :isLike")
    long countByPostAndIsLike(@Param("post") ForumPost post, @Param("isLike") boolean isLike);

    boolean existsByUserAndPost(User user, ForumPost post);

    void deleteByUserAndPost(User user, ForumPost post);

    @Query("SELECT SUM(CASE WHEN l.isLike = true THEN 1 ELSE -1 END) FROM ForumLike l WHERE l.post = ?1")
    Long getTotalLikeCount(ForumPost post);
}

