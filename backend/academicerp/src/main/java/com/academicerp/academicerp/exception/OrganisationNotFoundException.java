package com.academicerp.academicerp.exception;

public class OrganisationNotFoundException extends RuntimeException {
    public OrganisationNotFoundException(String message) {
        super(message);
    }
    
    public OrganisationNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
