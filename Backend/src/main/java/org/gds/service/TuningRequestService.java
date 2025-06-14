package org.gds.service;

import org.gds.model.TuningRequest;
import org.gds.repository.TuningRequestRepository;
import org.gds.model.User;
import org.gds.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TuningRequestService {

    @Autowired
    private TuningRequestRepository tuningRequestRepository;

    @Autowired
    private UserRepository userRepository;

    public TuningRequest createRequest(TuningRequest request, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        request.setUser(user);
        request.setStatus("PENDING");
        return tuningRequestRepository.save(request);
    }

    public List<TuningRequest> getUserRequests(Long userId) {
        return tuningRequestRepository.findByUserId(userId);
    }

    public List<TuningRequest> getUserRequestsByType(Long userId, TuningRequest.TuningType type) {
        return tuningRequestRepository.findByUserIdAndTuningType(userId, type);
    }

    public TuningRequest updateRequestStatus(Long requestId, String status) {
        TuningRequest request = tuningRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        request.setStatus(status);
        return tuningRequestRepository.save(request);
    }

    public List<TuningRequest> getAllRequests() {
        return tuningRequestRepository.findAll();
    }
}
