export interface PersonModel {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    dateOfBirth: string;
    address: string;
    city: string;
    country: string;
    isActive: boolean;
    readonly createdAt: string;
    readonly updatedAt?: string;
    status: PersonStatus;
}

export type PersonStatus = 'active' | 'inactive';

export interface CreatePersonDto {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    dateOfBirth: string;
    address: string;
    city: string;
    country: string;
    isActive: boolean;
    status: PersonStatus;
}

export interface UpdatePersonDto {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    dateOfBirth: string;
    address: string;
    city: string;
    country: string;
    isActive: boolean;
    status: PersonStatus;
}