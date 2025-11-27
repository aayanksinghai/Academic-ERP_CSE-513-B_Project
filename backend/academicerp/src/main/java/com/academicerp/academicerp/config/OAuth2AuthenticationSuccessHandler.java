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
            boolean isValidEmployee = employeeService.isValidEmployee(email);
            log.info("User {} is valid employee: {}", email, isValidEmployee);
            
            // Check if user is from Outreach department (only if valid employee)
            boolean isOutreach = isValidEmployee && employeeService.isOutreachEmployee(email);
            log.info("User {} is from Outreach department: {}", email, isOutreach);
            
            // Generate JWT token for all users (employee or not)
            String token = jwtService.generateToken(email);
            log.info("JWT token generated for user: {}", email);
            
            // Redirect to frontend with token and department info
            // isOutreach will be true only if user is both valid employee AND from Outreach
            // Non-employees will have isOutreach=false and be redirected to Welcome page
            String redirectUrl = "http://localhost:5173/auth/callback?token=" + URLEncoder.encode(token, StandardCharsets.UTF_8) + 
                                "&isOutreach=" + String.valueOf(isOutreach);
            log.info("Redirecting to: {}", redirectUrl);
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
