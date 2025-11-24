package com.academicerp.academicerp.repository;

import com.academicerp.academicerp.entity.OrganisationHR;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrganisationHRRepository extends JpaRepository<OrganisationHR, Long> {
    
    Optional<OrganisationHR> findByEmail(String email);
    
    boolean existsByEmail(String email);
    
    Optional<OrganisationHR> findByOrganisationId(Long organisationId);
    
    @Query("SELECT hr FROM OrganisationHR hr WHERE " +
           "LOWER(hr.firstName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(hr.lastName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(hr.email) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(hr.contactNumber) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<OrganisationHR> searchByHRDetails(@Param("searchTerm") String searchTerm);
}
