package org.gds.config;

import org.gds.security.jwt.JwtUtils;
import org.gds.security.services.UserDetailsServiceImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.util.StringUtils;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import java.util.List;

/**
 * WebSocket Authentication Configuration.
 * This class configures authentication for WebSocket connections using JWT.
 */
@Configuration
@EnableWebSocketMessageBroker
@Order(Ordered.HIGHEST_PRECEDENCE + 99)
public class WebSocketAuthenticationConfig implements WebSocketMessageBrokerConfigurer {

    private static final Logger logger = LoggerFactory.getLogger(WebSocketAuthenticationConfig.class);

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    /**
     * Configure the client inbound channel to authenticate WebSocket connections.
     */
    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(new ChannelInterceptor() {
            @Override
            public Message<?> preSend(Message<?> message, MessageChannel channel) {
                StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

                if (accessor != null && StompCommand.CONNECT.equals(accessor.getCommand())) {
                    List<String> authHeaders = accessor.getNativeHeader("Authorization");

                    if (authHeaders != null && !authHeaders.isEmpty()) {
                        String authHeader = authHeaders.get(0);
                        if (StringUtils.hasText(authHeader) && authHeader.startsWith("Bearer ")) {
                            String jwt = authHeader.substring(7);

                            try {
                                if (jwtUtils.validateJwtToken(jwt)) {
                                    String username = jwtUtils.getUserNameFromJwtToken(jwt);
                                    UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                                    UsernamePasswordAuthenticationToken authentication =
                                            new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

                                    accessor.setUser(authentication);
                                    SecurityContextHolder.getContext().setAuthentication(authentication);

                                    logger.debug("WebSocket authenticated user: {}", username);
                                } else {
                                    logger.warn("Invalid JWT token received in WebSocket CONNECT");
                                }
                            } catch (Exception ex) {
                                logger.error("WebSocket authentication error: {}", ex.getMessage());
                            }
                        }
                    } else {
                        logger.warn("Missing Authorization header in WebSocket CONNECT");
                    }
                }

                return message;
            }
        });
    }
}
