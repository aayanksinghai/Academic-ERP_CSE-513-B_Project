package com.academicerp.academicerp.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "courses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String courseCode;

    @Column(nullable = false)
    private String name;

    private int credits;

    private int capacity;

    private String schedule;

    private String roomNumber;

    @ManyToOne
    @JoinColumn(name = "specialization_id")
    private CourseSpecialization specialization;

    @ManyToMany
    @JoinTable(name = "course_prerequisites",
            joinColumns = @JoinColumn(name = "course_id"),
            inverseJoinColumns = @JoinColumn(name = "prerequisite_id"))
    private Set<Course> prerequisites = new HashSet<>();
}