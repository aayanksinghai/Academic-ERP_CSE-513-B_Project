package com.academicerp.academicerp.model;

import jakarta.persistence.*;
import lombok.*;


@Entity
@Table(name = "course_specializations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourseSpecialization {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    private String description;
}