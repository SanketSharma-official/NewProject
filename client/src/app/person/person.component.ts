import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PersonStore } from './person.store';
import { FormBuilder, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { PersonModel } from './person.model';

@Component({
  selector: 'app-person',
  imports: [ReactiveFormsModule, FormsModule],
  providers: [PersonStore],
  template: `
    @if(loading()){
      <p>Loading...</p>
    }

    @if(error()){
      <p class="text-danger">Something went wrong!</p>
    }

    <div class="d-flex gap-2 mb-3">
      <input
        type="text"
        class="form-control"
        placeholder="Search by name..."
        [(ngModel)]="searchTerm">

      <select class="form-select" [(ngModel)]="statusFilter">
        <option value="all">All</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
    </div>

    <h3>Add/Update Person</h3>

    <form [formGroup]="personForm" (ngSubmit)="onSubmit()" class="mb-3 d-inline-flex gap-2">
      <input type="hidden" formControlName="id">

      <div>
        <input type="text" formControlName="firstName" class="form-control" placeholder="First Name">

        @if(f.firstName.invalid && (f.firstName.touched || f.firstName.dirty)){
          @if(f.firstName.errors?.["required"]){
            <p class="text-danger">First Name is required</p>
          }
        }
      </div>

      <div>
        <input type="text" formControlName="lastName" class="form-control" placeholder="Last Name">

        @if(f.lastName.invalid && (f.lastName.touched || f.lastName.dirty)){
          @if(f.lastName.errors?.["required"]){
            <p class="text-danger">Last Name is required</p>
          }
        }
      </div>

      <div class="d-inline-flex gap-2">
        <button type="submit" class="btn btn-info" [disabled]="personForm.invalid">Save</button>
        <button type="button" class="btn btn-primary" (click)="onReset()">Rest</button>
      </div>
    </form>

    @if(filteredPeople.length === 0){
      <h5>No data found</h5>
    }
    @else{
      <div class="list">
        <h3>People</h3>

        <table class="table table-bordered">
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            @for(person of filteredPeople; track person.id){
              <tr>
                <td>{{person.firstName}}</td>
                <td>{{person.lastName}}</td>
                <td>
                  <div class="d-inline-flex gap-2">
                    <a (click)="onEdit(person)" class="btn btn-info">Edit</a>
                    <a (click)="onDelete(person)" class="btn btn-danger">Delete</a>
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    }
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PersonComponent {
  private readonly personStore = inject(PersonStore);

  people = this.personStore.people;
  loading = this.personStore.loading;
  error = this.personStore.error;

  private readonly fb = inject(FormBuilder);

  searchTerm = '';
  statusFilter: 'all' | 'active' | 'inactive' = 'all';

  personForm = this.fb.group({
    id: [0],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
  });

  get f() {
    return this.personForm.controls;
  }

  get filteredPeople() {
    const term = this.searchTerm.toLowerCase().trim();

    return (this.people() || []).filter(person => {
      const matchesSearch =
        person.firstName.toLowerCase().includes(term) ||
        person.lastName.toLowerCase().includes(term);

      const matchesFilter =
        this.statusFilter === 'all'
          ? true
          : (person as any).status === this.statusFilter;

      return matchesSearch && matchesFilter;
    });
  }

  onSubmit() {
    const person = this.personForm.value as PersonModel;

    if (person.id == 0) {
      this.personStore.addPerson(person);
    } else {
      this.personStore.updatePerson(person);
    }

    this.onReset();
  }

  onReset() {
    this.personForm.reset();
    this.personForm.patchValue({
      id: 0,
      firstName: '',
      lastName: ''
    });
  }

  onEdit(person: PersonModel) {
    this.personForm.patchValue(person);
  }

  onDelete(person: PersonModel) {
    if (confirm(`Are you sure to delete a person with name : ${person.firstName} ${person.lastName}`)) {
      this.personStore.deletePerson(person.id);
    }
  }
}