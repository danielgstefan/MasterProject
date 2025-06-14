package org.gds.repository;

import org.gds.model.TuningRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TuningRequestRepository extends JpaRepository<TuningRequest, Long> {
    List<TuningRequest> findByUserId(Long userId);
    List<TuningRequest> findByUserIdAndTuningType(Long userId, TuningRequest.TuningType tuningType);
}
