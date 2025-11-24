package com.academicerp.academicerp.service;

import com.academicerp.academicerp.dto.OrganisationRequestDto;
import com.academicerp.academicerp.dto.OrganisationResponseDto;
import com.academicerp.academicerp.dto.OrganisationUpdateDto;
import com.academicerp.academicerp.entity.Organisation;
import com.academicerp.academicerp.entity.OrganisationHR;
import com.academicerp.academicerp.exception.DuplicateOrganisationException;
import com.academicerp.academicerp.exception.OrganisationNotFoundException;
import com.academicerp.academicerp.mapper.OrganisationMapper;
import com.academicerp.academicerp.mapper.OrganisationHRMapper;
import com.academicerp.academicerp.repository.OrganisationRepository;
import com.academicerp.academicerp.repository.OrganisationHRRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class OrganisationService {
    
    private final OrganisationRepository organisationRepository;
    private final OrganisationHRRepository organisationHRRepository;
    private final OrganisationMapper organisationMapper;
    private final OrganisationHRMapper organisationHRMapper;
    
    public OrganisationResponseDto createOrganisation(OrganisationRequestDto requestDto) {
        if (organisationHRRepository.existsByEmail(requestDto.getHrDetails().getEmail())) {
            throw new DuplicateOrganisationException("Organisation with this HR email already exists");
        }
        
        Organisation organisation = organisationMapper.toEntity(requestDto);
        Organisation savedOrganisation = organisationRepository.save(organisation);
        
        OrganisationHR organisationHR = organisationHRMapper.toEntity(requestDto.getHrDetails(), savedOrganisation);
        OrganisationHR savedOrganisationHR = organisationHRRepository.save(organisationHR);
        
        savedOrganisation.setOrganisationHR(savedOrganisationHR);
        return organisationMapper.toResponseDto(savedOrganisation);
    }
    
    @Transactional(readOnly = true)
    public OrganisationResponseDto getOrganisationById(Long id) {
        Organisation organisation = organisationRepository.findById(id)
                .orElseThrow(() -> new OrganisationNotFoundException("Organisation not found with id: " + id));
        return organisationMapper.toResponseDto(organisation);
    }
    
    @Transactional(readOnly = true)
    public List<OrganisationResponseDto> getAllOrganisations() {
        List<Organisation> organisations = organisationRepository.findAll();
        return organisations.stream()
                .map(organisationMapper::toResponseDto)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public Page<OrganisationResponseDto> getAllOrganisationsPaginated(Pageable pageable) {
        Page<Organisation> organisations = organisationRepository.findAll(pageable);
        return organisations.map(organisationMapper::toResponseDto);
    }
    
    @Transactional(readOnly = true)
    public List<OrganisationResponseDto> searchOrganisations(String searchTerm) {
        List<Organisation> organisations = organisationRepository.searchOrganisations(searchTerm);
        return organisations.stream()
                .map(organisationMapper::toResponseDto)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<OrganisationResponseDto> findByNameContaining(String name) {
        List<Organisation> organisations = organisationRepository.findByNameContainingIgnoreCase(name);
        return organisations.stream()
                .map(organisationMapper::toResponseDto)
                .collect(Collectors.toList());
    }
    
    public OrganisationResponseDto updateOrganisation(Long id, OrganisationUpdateDto updateDto) {
        Organisation organisation = organisationRepository.findById(id)
                .orElseThrow(() -> new OrganisationNotFoundException("Organisation not found with id: " + id));
        
        // Update organisation fields
        organisationMapper.updateEntityFromDto(updateDto, organisation);
        
        // Update HR details if provided
        if (updateDto.getHrDetails() != null) {
            OrganisationHR organisationHR = organisationHRRepository.findByOrganisationId(id)
                    .orElseThrow(() -> new OrganisationNotFoundException("Organisation HR not found for organisation id: " + id));
            
            // Check if email is being updated and if it already exists
            if (updateDto.getHrDetails().getEmail() != null && 
                !updateDto.getHrDetails().getEmail().equals(organisationHR.getEmail()) &&
                organisationHRRepository.existsByEmail(updateDto.getHrDetails().getEmail())) {
                throw new DuplicateOrganisationException("Organisation with this HR email already exists");
            }
            
            organisationHRMapper.updateEntityFromDto(updateDto.getHrDetails(), organisationHR);
            organisationHRRepository.save(organisationHR);
        }
        
        Organisation updatedOrganisation = organisationRepository.save(organisation);
        return organisationMapper.toResponseDto(updatedOrganisation);
    }
    
    public void deleteOrganisation(Long id) {
        if (!organisationRepository.existsById(id)) {
            throw new OrganisationNotFoundException("Organisation not found with id: " + id);
        }
        organisationRepository.deleteById(id);
    }
    
    @Transactional(readOnly = true)
    public boolean existsById(Long id) {
        return organisationRepository.existsById(id);
    }
    
    @Transactional(readOnly = true)
    public boolean existsByEmail(String email) {
        return organisationHRRepository.existsByEmail(email);
    }
}
