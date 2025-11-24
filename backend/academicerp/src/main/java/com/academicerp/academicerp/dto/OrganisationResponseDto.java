package com.academicerp.academicerp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrganisationResponseDto {
    
    private Long id;
    private String name;
    private String address;
    private OrganisationHRDto hrDetails;
}
