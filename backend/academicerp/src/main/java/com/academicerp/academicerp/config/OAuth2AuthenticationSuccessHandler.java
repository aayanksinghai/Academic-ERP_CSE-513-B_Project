package com.academicerp.academicerp.config;

import com.academicerp.academicerp.entity.Employee;
import com.academicerp.academicerp.service.EmployeeService;
import com.academicerp.academicerp.service.JwtService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Component
@RequiredArgsConstructor
@Slf4j
public class OAuth2AuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    private final JwtService jwtService;
    private final EmployeeService employeeService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        
        try {
            log.info("OAuth2 authentication successful for user: {}", (Object) oAuth2User.getAttribute("email"));
            
            String email = oAuth2User.getAttribute("email");
            String firstName = oAuth2User.getAttribute("given_name");
            String lastName = oAuth2User.getAttribute("family_name");
            
            if (email == null) {
                log.error("Email not found in OAuth2 response");
                redirectToFrontendWithError(response, "email_not_found");
                return;
            }
            
            // Check if user is a valid employee
            if (!employeeService.isValidEmployee(email)) {
                log.error("User {} is not a registered employee", email);
                redirectToFrontendWithError(response, "not_employee");
                return;
            }
            
            // Check if user is from Outreach department
            if (!employeeService.isOutreachEmployee(email)) {
                log.error("User {} is not from Outreach department", email);
                redirectToFrontendWithError(response, "not_outreach");
                return;
            }
            
            // Create or update employee record
            Employee employee = employeeService.createEmployeeIfNotExists(email, firstName, lastName);
            log.info("Employee record processed for: {}", email);
            
            // Generate JWT token
            String token = jwtService.generateToken(email);
            log.info("JWT token generated for user: {}", email);
            
            // Redirect to frontend with token
            String redirectUrl = "http://localhost:5173/auth/callback?token=" + URLEncoder.encode(token, StandardCharsets.UTF_8);
            response.sendRedirect(redirectUrl);
            
        } catch (Exception e) {
            log.error("Error during OAuth2 success handling", e);
            redirectToFrontendWithError(response, "auth_failed");
        }
    }
    
    private void redirectToFrontendWithError(HttpServletResponse response, String errorCode) throws IOException {
        String redirectUrl = "http://localhost:5173/auth/callback?error=" + errorCode;
        response.sendRedirect(redirectUrl);
    }
}
