package org.gds.repository;

import org.gds.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository interface for User entity.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email); // ← Adaugă asta

    Boolean existsByUsername(String username);

    Boolean existsByEmail(String email);
}
