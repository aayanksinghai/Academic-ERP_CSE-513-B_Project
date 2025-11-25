package com.academicerp.academicerp.controller;

import com.academicerp.academicerp.entity.Employee;
import com.academicerp.academicerp.service.EmployeeService;
import com.academicerp.academicerp.service.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<?> oauth2Success(@AuthenticationPrincipal OAuth2User principal) {
        try {
            String email = principal.getAttribute("email");
            String firstName = principal.getAttribute("given_name");
            String lastName = principal.getAttribute("family_name");
            
            if (email == null) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Email not found in OAuth2 response");
                return ResponseEntity.badRequest().body(error);
            }
            
            // Check if user is a valid employee
            if (!employeeService.isValidEmployee(email)) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Access denied. Only registered employees can access this system.");
                return ResponseEntity.status(403).body(error);
            }
            
            // Check if user is from Outreach department for Organisation access
            if (!employeeService.isOutreachEmployee(email)) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Access denied. Only Outreach department employees can access Organisation operations.");
                return ResponseEntity.status(403).body(error);
            }
            
            // Create or update employee record
            Employee employee = employeeService.createEmployeeIfNotExists(email, firstName, lastName);
            
            // Generate JWT token
            String token = jwtService.generateToken(email);
            
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("employee", Map.of(
                "id", employee.getEmployeeId(),
                "email", employee.getEmail(),
                "firstName", employee.getFirstName(),
                "lastName", employee.getLastName(),
                "title", employee.getTitle(),
                "department", employee.getDepartment()
            ));
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Authentication failed: " + e.getMessage());
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
}
