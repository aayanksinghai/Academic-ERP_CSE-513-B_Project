package com.academicerp.academicerp.mapper;

import com.academicerp.academicerp.dto.OrganisationHRDto;
import com.academicerp.academicerp.entity.Organisation;
import com.academicerp.academicerp.entity.OrganisationHR;
import org.springframework.stereotype.Component;

@Component
public class OrganisationHRMapper {
    
    public OrganisationHR toEntity(OrganisationHRDto dto, Organisation organisation) {
        if (dto == null) {
            return null;
        }
        
        OrganisationHR organisationHR = new OrganisationHR();
        organisationHR.setFirstName(dto.getFirstName());
        organisationHR.setLastName(dto.getLastName());
        organisationHR.setEmail(dto.getEmail());
        organisationHR.setContactNumber(dto.getContactNumber());
        organisationHR.setOrganisation(organisation);
        
        return organisationHR;
    }
    
    public OrganisationHRDto toDto(OrganisationHR organisationHR) {
        if (organisationHR == null) {
            return null;
        }
        
        OrganisationHRDto dto = new OrganisationHRDto();
        dto.setId(organisationHR.getId());
        dto.setFirstName(organisationHR.getFirstName());
        dto.setLastName(organisationHR.getLastName());
        dto.setEmail(organisationHR.getEmail());
        dto.setContactNumber(organisationHR.getContactNumber());
        
        return dto;
    }
    
    public void updateEntityFromDto(OrganisationHRDto dto, OrganisationHR organisationHR) {
        if (dto == null || organisationHR == null) {
            return;
        }
        
        if (dto.getFirstName() != null && !dto.getFirstName().trim().isEmpty()) {
            organisationHR.setFirstName(dto.getFirstName());
        }
        if (dto.getLastName() != null && !dto.getLastName().trim().isEmpty()) {
            organisationHR.setLastName(dto.getLastName());
        }
        if (dto.getEmail() != null && !dto.getEmail().trim().isEmpty()) {
            organisationHR.setEmail(dto.getEmail());
        }
        if (dto.getContactNumber() != null && !dto.getContactNumber().trim().isEmpty()) {
            organisationHR.setContactNumber(dto.getContactNumber());
        }
    }
}
