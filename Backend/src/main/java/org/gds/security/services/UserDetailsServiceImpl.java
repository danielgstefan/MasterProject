package org.gds.security.services;

import org.gds.model.User;
import org.gds.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    UserRepository userRepository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String identifier) throws UsernameNotFoundException {
        // Caută întâi după username
        User user = userRepository.findByUsername(identifier)
                .or(() -> userRepository.findByEmail(identifier)) // Dacă nu găsește, caută după email
                .orElseThrow(() -> new UsernameNotFoundException(
                        "User not found with username or email: " + identifier));

        if (user.isBanned()) {
            throw new UsernameNotFoundException("This account has been banned");
        }

        return UserDetailsImpl.build(user);
    }
}
