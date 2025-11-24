package com.academicerp.academicerp.mapper;

import com.academicerp.academicerp.dto.OrganisationRequestDto;
import com.academicerp.academicerp.dto.OrganisationResponseDto;
import com.academicerp.academicerp.dto.OrganisationUpdateDto;
import com.academicerp.academicerp.entity.Organisation;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class OrganisationMapper {
    
    private final OrganisationHRMapper organisationHRMapper;
    
    public Organisation toEntity(OrganisationRequestDto requestDto) {
        if (requestDto == null) {
            return null;
        }
        
        Organisation organisation = new Organisation();
        organisation.setName(requestDto.getName());
        organisation.setAddress(requestDto.getAddress());
        
        return organisation;
    }
    
    public OrganisationResponseDto toResponseDto(Organisation organisation) {
        if (organisation == null) {
            return null;
        }
        
        OrganisationResponseDto responseDto = new OrganisationResponseDto();
        responseDto.setId(organisation.getId());
        responseDto.setName(organisation.getName());
        responseDto.setAddress(organisation.getAddress());
        responseDto.setHrDetails(organisationHRMapper.toDto(organisation.getOrganisationHR()));
        
        return responseDto;
    }
    
    public void updateEntityFromDto(OrganisationUpdateDto updateDto, Organisation organisation) {
        if (updateDto == null || organisation == null) {
            return;
        }
        
        if (updateDto.getName() != null && !updateDto.getName().trim().isEmpty()) {
            organisation.setName(updateDto.getName());
        }
        if (updateDto.getAddress() != null && !updateDto.getAddress().trim().isEmpty()) {
            organisation.setAddress(updateDto.getAddress());
        }
    }
}
