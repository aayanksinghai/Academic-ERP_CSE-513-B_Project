package com.academicerp.academicerp.dto;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrganisationUpdateDto {
    
    private String name;
    private String address;
    
    @Valid
    private OrganisationHRDto hrDetails;
}
