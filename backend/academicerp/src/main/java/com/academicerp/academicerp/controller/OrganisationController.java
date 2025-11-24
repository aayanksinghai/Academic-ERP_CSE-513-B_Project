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
    public ResponseEntity<?> createOrganisation(@Valid @RequestBody OrganisationRequestDto requestDto) {
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
    public ResponseEntity<?> getOrganisationById(@PathVariable Long id) {
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
    public ResponseEntity<List<OrganisationResponseDto>> getAllOrganisations() {
        List<OrganisationResponseDto> organisations = organisationService.getAllOrganisations();
        return ResponseEntity.ok(organisations);
    }
    
    @GetMapping("/paginated")
    public ResponseEntity<Page<OrganisationResponseDto>> getAllOrganisationsPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
                Sort.by(sortBy).descending() : 
                Sort.by(sortBy).ascending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<OrganisationResponseDto> organisations = organisationService.getAllOrganisationsPaginated(pageable);
        return ResponseEntity.ok(organisations);
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<OrganisationResponseDto>> searchOrganisations(
            @RequestParam String searchTerm) {
        List<OrganisationResponseDto> organisations = organisationService.searchOrganisations(searchTerm);
        return ResponseEntity.ok(organisations);
    }
    
    @GetMapping("/search/name")
    public ResponseEntity<List<OrganisationResponseDto>> findByNameContaining(
            @RequestParam String name) {
        List<OrganisationResponseDto> organisations = organisationService.findByNameContaining(name);
        return ResponseEntity.ok(organisations);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateOrganisation(
            @PathVariable Long id,
            @Valid @RequestBody OrganisationUpdateDto updateDto) {
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
    public ResponseEntity<?> deleteOrganisation(@PathVariable Long id) {
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
    public ResponseEntity<Map<String, Boolean>> checkOrganisationExists(@PathVariable Long id) {
        boolean exists = organisationService.existsById(id);
        Map<String, Boolean> response = new HashMap<>();
        response.put("exists", Boolean.valueOf(exists));
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/check-email")
    public ResponseEntity<Map<String, Boolean>> checkEmailExists(@RequestParam String email) {
        boolean exists = organisationService.existsByEmail(email);
        Map<String, Boolean> response = new HashMap<>();
        response.put("exists", Boolean.valueOf(exists));
        return ResponseEntity.ok(response);
    }
}
