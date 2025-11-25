package com.academicerp.academicerp.service;

import com.academicerp.academicerp.entity.Employee;
import com.academicerp.academicerp.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class EmployeeService {
    
    private final EmployeeRepository employeeRepository;
    
    public Optional<Employee> findByEmail(String email) {
        return employeeRepository.findByEmail(email);
    }
    
    public boolean isValidEmployee(String email) {
        return employeeRepository.existsByEmail(email);
    }
    
    public boolean isOutreachEmployee(String email) {
        Optional<Employee> employee = employeeRepository.findByEmail(email);
        return employee.isPresent() && "Outreach".equalsIgnoreCase(employee.get().getDepartment());
    }
    
    public Employee createEmployeeIfNotExists(String email, String firstName, String lastName) {
        Optional<Employee> existingEmployee = employeeRepository.findByEmail(email);
        if (existingEmployee.isPresent()) {
            return existingEmployee.get();
        }
        
        Employee newEmployee = Employee.builder()
                .email(email)
                .firstName(firstName)
                .lastName(lastName)
                .build();
        
        return employeeRepository.save(newEmployee);
    }
}
