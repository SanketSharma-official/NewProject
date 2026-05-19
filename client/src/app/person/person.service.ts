import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { CreatePersonDto, PersonModel, UpdatePersonDto } from './person.model';

@Injectable({
    providedIn: 'root'
})
export class PersonService {

    private readonly http = inject(HttpClient);
    private readonly baseUrl = `${environment.apiUrl}/people`;

    getPeople(): Observable<PersonModel[]> {
        return this.http
            .get<PersonModel[]>(this.baseUrl)
            .pipe(catchError(this.handleError));
    }

    getPerson(id: number): Observable<PersonModel> {
        return this.http
            .get<PersonModel>(`${this.baseUrl}/${id}`)
            .pipe(catchError(this.handleError));
    }

    addPerson(dto: CreatePersonDto): Observable<PersonModel> {
        return this.http
            .post<PersonModel>(this.baseUrl, dto)
            .pipe(catchError(this.handleError));
    }

    updatePerson(dto: UpdatePersonDto): Observable<PersonModel> {
        return this.http
            .put<PersonModel>(`${this.baseUrl}/${dto.id}`, dto)
            .pipe(catchError(this.handleError));
    }

    deletePerson(id: number): Observable<void> {
        return this.http
            .delete<void>(`${this.baseUrl}/${id}`)
            .pipe(catchError(this.handleError));
    }

    private handleError(error: any) {
        console.error('API Error:', error);
        return throwError(() => error);
    }
}