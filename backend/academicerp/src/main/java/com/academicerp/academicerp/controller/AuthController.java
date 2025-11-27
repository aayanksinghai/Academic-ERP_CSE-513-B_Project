package com.academicerp.academicerp.controller;

import com.academicerp.academicerp.entity.Employee;
import com.academicerp.academicerp.service.EmployeeService;
import com.academicerp.academicerp.service.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {
    
    private final JwtService jwtService;
    private final EmployeeService employeeService;
    
    @GetMapping("/oauth2/success")
    public RedirectView oauth2Success(@AuthenticationPrincipal OAuth2User principal) {
        try {
            // Check if principal is null (user not authenticated via OAuth2)
            if (principal == null) {
                return new RedirectView("http://localhost:5173/auth/callback?error=oauth2_required");
            }
            
            String email = principal.getAttribute("email");
            String firstName = principal.getAttribute("given_name");
            String lastName = principal.getAttribute("family_name");
            
            if (email == null) {
                return new RedirectView("http://localhost:5173/auth/callback?error=email_not_found");
            }
            
            // Check if user is a valid employee
            if (!employeeService.isValidEmployee(email)) {
                return new RedirectView("http://localhost:5173/auth/callback?error=not_employee");
            }
            
            // Check if user is from Outreach department for Organisation access
            if (!employeeService.isOutreachEmployee(email)) {
                return new RedirectView("http://localhost:5173/auth/callback?error=not_outreach");
            }
            
            // Create or update employee record
            Employee employee = employeeService.createEmployeeIfNotExists(email, firstName, lastName);
            
            // Generate JWT token
            String token = jwtService.generateToken(email);
            
            // Redirect to frontend with token
            return new RedirectView("http://localhost:5173/auth/callback?token=" + token);
        } catch (Exception e) {
            return new RedirectView("http://localhost:5173/auth/callback?error=auth_failed");
        }
    }
    
    @PostMapping("/user-info")
    public ResponseEntity<?> getUserInfo(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        if (token == null) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Token is required");
            return ResponseEntity.badRequest().body(error);
        }
        
        try {
            String email = jwtService.extractUsername(token);
            if (email == null || !jwtService.isTokenValid(token, email)) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Invalid token");
                return ResponseEntity.status(401).body(error);
            }
            
            if (!employeeService.isValidEmployee(email)) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "User not found");
                return ResponseEntity.status(404).body(error);
            }
            
            Employee employee = employeeService.findByEmail(email).get();
            boolean isOutreach = employeeService.isOutreachEmployee(email);
            
            Map<String, Object> response = new HashMap<>();
            response.put("email", email);
            response.put("firstName", employee.getFirstName());
            response.put("lastName", employee.getLastName());
            response.put("department", employee.getDepartment());
            response.put("isOutreach", isOutreach);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to retrieve user info");
            return ResponseEntity.status(500).body(error);
        }
    }
    
    @GetMapping("/user")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal OAuth2User principal) {
        if (principal == null) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "User not authenticated");
            return ResponseEntity.status(401).body(error);
        }
        
        String email = principal.getAttribute("email");
        if (!employeeService.isValidEmployee(email)) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Access denied. Only registered employees can access this system.");
            return ResponseEntity.status(403).body(error);
        }
        
        if (!employeeService.isOutreachEmployee(email)) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Access denied. Only Outreach department employees can access Organisation operations.");
            return ResponseEntity.status(403).body(error);
        }
        
        return ResponseEntity.ok(principal.getAttributes());
    }
    
    @PostMapping("/validate-token")
    public ResponseEntity<?> validateToken(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        if (token == null) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Token is required");
            return ResponseEntity.badRequest().body(error);
        }
        
        try {
            String email = jwtService.extractUsername(token);
            boolean isValid = jwtService.isTokenValid(token, email) && employeeService.isValidEmployee(email) && employeeService.isOutreachEmployee(email);
            
            Map<String, Object> response = new HashMap<>();
            response.put("valid", isValid);
            if (isValid) {
                response.put("email", email);
            } else if (employeeService.isValidEmployee(email) && !employeeService.isOutreachEmployee(email)) {
                response.put("error", "Access denied. Only Outreach department employees can access Organisation operations.");
            }
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("valid", false);
            response.put("error", "Invalid token");
            return ResponseEntity.ok(response);
        }
    }
    
    // TEST ENDPOINT - Remove in production
    @PostMapping("/generate-test-token")
    public ResponseEntity<?> generateTestToken(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        if (email == null) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Email is required");
            return ResponseEntity.badRequest().body(error);
        }
        
        // Check if user is a valid employee
        if (!employeeService.isValidEmployee(email)) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Access denied. Only registered employees can access this system.");
            return ResponseEntity.status(403).body(error);
        }
        
        // Check if user is from Outreach department
        if (!employeeService.isOutreachEmployee(email)) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Access denied. Only Outreach department employees can access Organisation operations.");
            return ResponseEntity.status(403).body(error);
        }
        
        // Generate JWT token
        String token = jwtService.generateToken(email);
        
        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("email", email);
        response.put("message", "Test token generated successfully");
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/oauth2/failure")
    public ResponseEntity<?> oauth2Failure() {
        Map<String, String> error = new HashMap<>();
        error.put("error", "OAuth2 authentication failed");
        error.put("message", "Please try logging in again");
        return ResponseEntity.status(401).body(error);
    }
}
