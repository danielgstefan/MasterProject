package org.gds.repository;

import org.gds.model.ERole;
import org.gds.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository interface for Role entity.
 */
@Repository
public interface RoleRepository extends JpaRepository<Role, Integer> {
    
    /**
     * Find a role by name.
     * @param name the role name
     * @return an Optional containing the role if found, or empty if not found
     */
    Optional<Role> findByName(ERole name);
}