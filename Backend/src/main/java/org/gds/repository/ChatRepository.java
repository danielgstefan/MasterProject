package org.gds.repository;

import org.gds.model.Chat;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository for accessing Chat entities.
 */
@Repository
public interface ChatRepository extends JpaRepository<Chat, Long> {
    /**
     * Find all chat messages with pagination.
     * 
     * @param pageable Pagination information
     * @return Page of chat messages
     */
    Page<Chat> findAllByOrderByTimestampDesc(Pageable pageable);
    
    /**
     * Find the most recent chat messages.
     * 
     * @param pageable Pagination information
     * @return Page of chat messages
     */
    Page<Chat> findAllByOrderByTimestampAsc(Pageable pageable);
}