package org.gds.security;

import org.gds.security.jwt.AuthEntryPointJwt;
import org.gds.security.jwt.AuthTokenFilter;
import org.gds.security.services.UserDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;


@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class WebSecurityConfig {

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Autowired
    private AuthEntryPointJwt unauthorizedHandler;

    @Autowired
    private AuthTokenFilter authTokenFilter;


    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }


    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }


    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }


    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors().and()
                .csrf(csrf -> csrf.disable())
                .exceptionHandling().authenticationEntryPoint(unauthorizedHandler).and()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS).and()
                .authorizeRequests()
                    .requestMatchers(HttpMethod.GET, "/api/car-photos/**").permitAll()  // Allow viewing car photos
                    .requestMatchers(HttpMethod.GET, "/api/audio/**").permitAll()  // Allow viewing audio
                    .requestMatchers(HttpMethod.POST, "/api/car-photos/**").hasRole("ADMIN")  // Restrict adding car photos to admins
                    .requestMatchers(HttpMethod.PUT, "/api/car-photos/**").hasRole("ADMIN")   // Restrict editing car photos to admins
                    .requestMatchers(HttpMethod.DELETE, "/api/car-photos/**").hasRole("ADMIN") // Restrict deleting car photos to admins
                    .requestMatchers(HttpMethod.POST, "/api/audio/**").hasRole("ADMIN")  // Restrict adding audio to admins
                    .requestMatchers(HttpMethod.PUT, "/api/audio/**").hasRole("ADMIN")   // Restrict editing audio to admins
                    .requestMatchers(HttpMethod.DELETE, "/api/audio/**").hasRole("ADMIN") // Restrict deleting audio to admins
                    .requestMatchers("/api/auth/signin").permitAll()
                    .requestMatchers("/api/auth/signup").permitAll()
                    .requestMatchers("/api/auth/refresh-token").permitAll()
                    .requestMatchers("/error").permitAll()
                    .requestMatchers("/api/test/**").permitAll()
                    .requestMatchers("/forum/**").permitAll()
                    .requestMatchers("/api/forum/posts").permitAll()
                    .requestMatchers("/api/forum/posts/category/**").permitAll()
                    .requestMatchers("/api/forum/posts/*/comments").permitAll()
                    .requestMatchers("/api/forum/posts/*/photos").permitAll()
                    .requestMatchers("/api/forum/posts/*/likes").permitAll()
                    .requestMatchers("/h2-console/**").permitAll()
                    .requestMatchers("/favicon.ico").permitAll()
                    .requestMatchers("/ws/**").permitAll()
                    .requestMatchers("/cars/**").permitAll()
                    .requestMatchers("/uploads/**").permitAll()
                    .requestMatchers("/audio/**").permitAll()
                    .requestMatchers("/api/tuning/**").authenticated()
                    .anyRequest().authenticated();

        http.authenticationProvider(authenticationProvider());
        http.addFilterBefore(authTokenFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
