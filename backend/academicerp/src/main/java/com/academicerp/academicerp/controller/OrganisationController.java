package com.academicerp.academicerp.controller;

import com.academicerp.academicerp.dto.OrganisationRequestDto;
import com.academicerp.academicerp.dto.OrganisationResponseDto;
import com.academicerp.academicerp.dto.OrganisationUpdateDto;
import com.academicerp.academicerp.service.OrganisationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/organisations")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class OrganisationController {
    
    private final OrganisationService organisationService;
    
    @PostMapping
    @PreAuthorize("hasRole('OUTREACH')")
    public ResponseEntity<?> createOrganisation(@Valid @RequestBody OrganisationRequestDto requestDto, Authentication authentication) {
        try {
            OrganisationResponseDto responseDto = organisationService.createOrganisation(requestDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('OUTREACH')")
    public ResponseEntity<?> getOrganisationById(@PathVariable Long id, Authentication authentication) {
        try {
            OrganisationResponseDto responseDto = organisationService.getOrganisationById(id);
            return ResponseEntity.ok(responseDto);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }
    
    @GetMapping
    @PreAuthorize("hasRole('OUTREACH')")
    public ResponseEntity<List<OrganisationResponseDto>> getAllOrganisations(Authentication authentication) {
        List<OrganisationResponseDto> organisations = organisationService.getAllOrganisations();
        return ResponseEntity.ok(organisations);
    }
    
    @GetMapping("/paginated")
    @PreAuthorize("hasRole('OUTREACH')")
    public ResponseEntity<Page<OrganisationResponseDto>> getAllOrganisationsPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            Authentication authentication) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
                Sort.by(sortBy).descending() : 
                Sort.by(sortBy).ascending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<OrganisationResponseDto> organisations = organisationService.getAllOrganisationsPaginated(pageable);
        return ResponseEntity.ok(organisations);
    }
    
    @GetMapping("/search")
    @PreAuthorize("hasRole('OUTREACH')")
    public ResponseEntity<List<OrganisationResponseDto>> searchOrganisations(
            @RequestParam String searchTerm,
            Authentication authentication) {
        List<OrganisationResponseDto> organisations = organisationService.searchOrganisations(searchTerm);
        return ResponseEntity.ok(organisations);
    }
    
    @GetMapping("/search/name")
    @PreAuthorize("hasRole('OUTREACH')")
    public ResponseEntity<List<OrganisationResponseDto>> findByNameContaining(
            @RequestParam String name,
            Authentication authentication) {
        List<OrganisationResponseDto> organisations = organisationService.findByNameContaining(name);
        return ResponseEntity.ok(organisations);
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('OUTREACH')")
    public ResponseEntity<?> updateOrganisation(
            @PathVariable Long id,
            @Valid @RequestBody OrganisationUpdateDto updateDto,
            Authentication authentication) {
        try {
            OrganisationResponseDto responseDto = organisationService.updateOrganisation(id, updateDto);
            return ResponseEntity.ok(responseDto);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('OUTREACH')")
    public ResponseEntity<?> deleteOrganisation(@PathVariable Long id, Authentication authentication) {
        try {
            organisationService.deleteOrganisation(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Organisation deleted successfully");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }
    
    @GetMapping("/{id}/exists")
    @PreAuthorize("hasRole('OUTREACH')")
    public ResponseEntity<Map<String, Boolean>> checkOrganisationExists(@PathVariable Long id, Authentication authentication) {
        boolean exists = organisationService.existsById(id);
        Map<String, Boolean> response = new HashMap<>();
        response.put("exists", Boolean.valueOf(exists));
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/check-email")
    @PreAuthorize("hasRole('OUTREACH')")
    public ResponseEntity<Map<String, Boolean>> checkEmailExists(@RequestParam String email, Authentication authentication) {
        boolean exists = organisationService.existsByEmail(email);
        Map<String, Boolean> response = new HashMap<>();
        response.put("exists", Boolean.valueOf(exists));
        return ResponseEntity.ok(response);
    }
}
