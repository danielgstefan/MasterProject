package org.gds.repository;

import org.gds.model.Chat;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface ChatRepository extends JpaRepository<Chat, Long> {
    
    Page<Chat> findAllByOrderByTimestampDesc(Pageable pageable);
    
    
    Page<Chat> findAllByOrderByTimestampAsc(Pageable pageable);
}