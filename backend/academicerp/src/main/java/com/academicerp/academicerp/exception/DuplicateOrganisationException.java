package com.academicerp.academicerp.exception;

public class DuplicateOrganisationException extends RuntimeException {
    public DuplicateOrganisationException(String message) {
        super(message);
    }
    
    public DuplicateOrganisationException(String message, Throwable cause) {
        super(message, cause);
    }
}
