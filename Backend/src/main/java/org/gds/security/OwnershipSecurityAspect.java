package org.gds.security;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.gds.security.services.UserDetailsImpl;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class OwnershipSecurityAspect {

    @Around("@annotation(isOwnerOrAdmin)")
    public Object checkOwnership(ProceedingJoinPoint joinPoint, IsOwnerOrAdmin isOwnerOrAdmin) throws Throwable {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        Object[] args = joinPoint.getArgs();
        Long requestedUserId = null;

        for (Object arg : args) {
            if (arg instanceof Long) {
                requestedUserId = (Long) arg;
                break;
            }
        }

        if (requestedUserId == null) {
            throw new SecurityException("User ID not found in request");
        }

        if (userDetails.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))
            || userDetails.getId().equals(requestedUserId)) {
            return joinPoint.proceed();
        }

        throw new SecurityException("Access denied: You can only access your own requests");
    }
}
