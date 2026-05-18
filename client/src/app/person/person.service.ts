import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { PersonModel } from './person.model';

@Injectable({
  providedIn: 'root'
})
export class PersonService {
  private readonly http = inject(HttpClient);
  private url = environment.apiUrl + '/people'; // localhost:5152/api/people

  getPeople() {
    return this.http.get<PersonModel[]>(this.url);
  }

  getPerson(id: number) {
    return this.http.get<PersonModel>(`${this.url}/${id}`);
  }

  addPerson(person: PersonModel) {
    return this.http.post<PersonModel>(this.url, person);
  }

  updatePerson(person: PersonModel) {
    return this.http.put<void>(`${this.url}/${person.id}`, person);
  }

  deletePerson(id: number) {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
