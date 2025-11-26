export interface OrganisationHR {
    id?: number | string
    firstName: string
    lastName: string
    email: string
    contactNumber: string
}

export interface Organisation {
    id?: number | string
    name: string
    address: string
    hrDetails?: OrganisationHR
    // For backward compatibility with list view
    contactPerson?: string
    contactEmail?: string
    contactNumber?: string
}
