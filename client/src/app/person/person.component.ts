import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PersonStore } from './person.store';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PersonModel } from './person.model';

@Component({
  selector: 'app-person',
  imports: [ReactiveFormsModule],
  providers: [PersonStore],
  template: `
    
    @if(loading()){
      <p>Loading...</p>
    }

    @if(error()){
      <p class="text-danger">Something went wrong!</p>
    }

    <h3>Add/Update Person</h3>
    <form [formGroup]="personForm" (ngSubmit)="onSubmit()" class="mb-3 d-inline-flex gap-2">
         <input type="hidden" formControlName='id'>
          <div>
             <input type="text" formControlName='firstName' class="form-control" placeholder="First Name">
            
             @if(f.firstName.invalid && (f.firstName.touched || f.firstName.dirty))
              {
                 @if(f.firstName.errors?.["required"]){
                   <p class="text-danger">First Name is required</p>
                 }
              }
          </div>

          <div>
             <input type="text" formControlName='lastName' class="form-control" placeholder="Last Name">
              @if(f.lastName.invalid && (f.lastName.touched || f.lastName.dirty))
              {
                 @if(f.lastName.errors?.["required"]){
                   <p class="text-danger">Last Name is required</p>
                 }
              }

          </div>

          <div>
            <div class="d-inline-flex gap-2">
              <button  type="submit" class="btn btn-info" [disabled]="personForm.invalid">Save</button>
              <button type="button" class="btn btn-primary" (click)="onReset()">Rest</button>
            </div>
          </div>
      </form>

      @if(!people() || people().length<1){
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
                  @for(person of people(); track person.id){
                   <tr>
                      <td>{{person.firstName}} </td>
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

  personForm = this.fb.group({
    id: [0],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
  });

  get f() {
    return this.personForm.controls;
  }

  onSubmit() {
    const person = this.personForm.value as PersonModel;

    if (person.id == 0) {
      console.log("added");
      this.personStore.addPerson(person);
    }
    else {
      console.log("updated");
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
