package com.academicerp.academicerp.repository;

import com.academicerp.academicerp.entity.Organisation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrganisationRepository extends JpaRepository<Organisation, Long> {
    
    @Query("SELECT o FROM Organisation o LEFT JOIN o.organisationHR hr WHERE " +
           "LOWER(o.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(o.address) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(hr.firstName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(hr.lastName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(hr.email) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Organisation> searchOrganisations(@Param("searchTerm") String searchTerm);
    
    List<Organisation> findByNameContainingIgnoreCase(String name);
}
