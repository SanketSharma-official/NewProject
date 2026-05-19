import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    signal
} from '@angular/core';

import {
    FormBuilder,
    FormsModule,
    ReactiveFormsModule,
    Validators
} from '@angular/forms';

import { DatePipe } from '@angular/common';
import { PersonStore } from './person.store';
import { CreatePersonDto, UpdatePersonDto, PersonModel, PersonStatus } from './person.model';

@Component({
    selector: 'app-person',
    standalone: true,
    imports: [ReactiveFormsModule, FormsModule, DatePipe],
    providers: [PersonStore],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="container py-4">
            <div class="card shadow-sm border-0">
                <div class="card-body">

                    <h2 class="mb-3">Person Management</h2>
                    <small class="text-muted">Total People: {{ people().length }}</small>

                    @if (loading()) {
                        <div class="alert alert-info mt-3">Loading people...</div>
                    }

                    @if (error()) {
                        <div class="alert alert-danger mt-3">Error loading data</div>
                    }

                    <!-- FILTERS -->
                    <div class="row g-3 mt-3 mb-4">
                        <div class="col-md-8">
                            <input
                                class="form-control"
                                placeholder="Search..."
                                [ngModel]="searchTerm()"
                                (ngModelChange)="searchTerm.set($event)" />
                        </div>
                        <div class="col-md-4">
                            <select
                                class="form-select"
                                [ngModel]="statusFilter()"
                                (ngModelChange)="statusFilter.set($event)">
                                <option value="all">All</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                    </div>

                    <!-- FORM -->
                    <form
                        [formGroup]="personForm"
                        (ngSubmit)="onSubmit()"
                        class="border p-3 rounded bg-light">

                        <input type="hidden" formControlName="id" />

                        <div class="row g-3">

                            <div class="col-md-6">
                                <input
                                    class="form-control"
                                    placeholder="First Name"
                                    formControlName="firstName">
                                @if (f['firstName'].invalid && f['firstName'].touched) {
                                    <div class="text-danger small">First name is required.</div>
                                }
                            </div>

                            <div class="col-md-6">
                                <input
                                    class="form-control"
                                    placeholder="Last Name"
                                    formControlName="lastName">
                                @if (f['lastName'].invalid && f['lastName'].touched) {
                                    <div class="text-danger small">Last name is required.</div>
                                }
                            </div>

                            <div class="col-md-6">
                                <input
                                    class="form-control"
                                    placeholder="Email"
                                    formControlName="email">
                                @if (f['email'].invalid && f['email'].touched) {
                                    <div class="text-danger small">Valid email is required.</div>
                                }
                            </div>

                            <div class="col-md-6">
                                <input
                                    class="form-control"
                                    placeholder="Phone"
                                    formControlName="phoneNumber">
                            </div>

                            <div class="col-md-6">
                                <input
                                    class="form-control"
                                    type="date"
                                    formControlName="dateOfBirth">
                                @if (f['dateOfBirth'].invalid && f['dateOfBirth'].touched) {
                                    <div class="text-danger small">Date of birth is required.</div>
                                }
                            </div>

                            <div class="col-md-6">
                                <select class="form-select" formControlName="status">
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>

                            <div class="col-md-12">
                                <input
                                    class="form-control"
                                    placeholder="Address"
                                    formControlName="address">
                            </div>

                            <div class="col-md-6">
                                <input
                                    class="form-control"
                                    placeholder="City"
                                    formControlName="city">
                            </div>

                            <div class="col-md-6">
                                <input
                                    class="form-control"
                                    placeholder="Country"
                                    formControlName="country">
                            </div>

                            <div class="col-md-6 form-check mt-2 ms-1">
                                <input
                                    type="checkbox"
                                    class="form-check-input"
                                    formControlName="isActive">
                                <label class="form-check-label">Is Active</label>
                            </div>

                        </div>

                        <div class="mt-3 d-flex gap-2">
                            <button class="btn btn-primary" type="submit">
                                {{ isEditing() ? 'Update' : 'Save' }}
                            </button>
                            <button class="btn btn-secondary" type="button" (click)="onReset()">
                                Reset
                            </button>
                        </div>

                    </form>

                    <!-- TABLE -->
                    <table class="table table-bordered mt-4">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            @for (person of filteredPeople(); track person.id) {
                                <tr>
                                    <td>{{ person.firstName }} {{ person.lastName }}</td>
                                    <td>{{ person.email }}</td>
                                    <td>{{ person.phoneNumber }}</td>
                                    <td>
                                        <span
                                            class="badge"
                                            [class.bg-success]="person.status === 'active'"
                                            [class.bg-danger]="person.status === 'inactive'">
                                            {{ person.status }}
                                        </span>
                                    </td>
                                    <td class="d-flex gap-2">
                                        <button
                                            class="btn btn-sm btn-primary"
                                            (click)="onEdit(person)">
                                            Edit
                                        </button>
                                        <button
                                            class="btn btn-sm btn-danger"
                                            (click)="onDelete(person)">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            }
                        </tbody>
                    </table>

                </div>
            </div>
        </div>
    `
})
export class PersonComponent {

    private readonly personStore = inject(PersonStore);
    private readonly fb = inject(FormBuilder);

    readonly people         = this.personStore.people;
    readonly loading        = this.personStore.loading;
    readonly error          = this.personStore.error;

    readonly searchTerm     = signal('');
    readonly statusFilter   = signal<'all' | PersonStatus>('all');
    readonly isEditing      = signal(false);

    readonly filteredPeople = computed(() => {
        const term   = this.searchTerm().toLowerCase();
        const filter = this.statusFilter();

        return this.people().filter(p => {
            const matchesSearch =
                p.firstName.toLowerCase().includes(term) ||
                p.lastName.toLowerCase().includes(term);

            const matchesFilter = filter === 'all' || p.status === filter;

            return matchesSearch && matchesFilter;
        });
    });

    readonly personForm = this.fb.group({
        id:          [0],
        firstName:   ['', Validators.required],
        lastName:    ['', Validators.required],
        email:       ['', [Validators.required, Validators.email]],
        phoneNumber: [''],
        dateOfBirth: ['', Validators.required],
        address:     [''],
        city:        [''],
        country:     [''],
        isActive:    [true],
        status:      ['active' as PersonStatus]
    });

    get f() {
        return this.personForm.controls;
    }

    onSubmit(): void {
        if (this.personForm.invalid) {
            this.personForm.markAllAsTouched();
            return;
        }

        const form = this.personForm.getRawValue();

        const baseDto: CreatePersonDto = {
            firstName:   form.firstName!,
            lastName:    form.lastName!,
            email:       form.email!,
            phoneNumber: form.phoneNumber ?? '',
            dateOfBirth: form.dateOfBirth!,
            address:     form.address ?? '',
            city:        form.city ?? '',
            country:     form.country ?? '',
            isActive:    form.isActive!,
            status:      form.status as PersonStatus
        };

        if (this.isEditing()) {
            const updateDto: UpdatePersonDto = {
                id: form.id!,
                ...baseDto
            };
            this.personStore.updatePerson(updateDto);
        } else {
            this.personStore.addPerson(baseDto);
        }

        this.onReset();
    }

    onEdit(person: PersonModel): void {
        this.isEditing.set(true);
        this.personForm.patchValue({
            id:          person.id,
            firstName:   person.firstName,
            lastName:    person.lastName,
            email:       person.email,
            phoneNumber: person.phoneNumber,
            dateOfBirth: person.dateOfBirth,
            address:     person.address,
            city:        person.city,
            country:     person.country,
            isActive:    person.isActive,
            status:      person.status
        });
    }

    onDelete(person: PersonModel): void {
        if (confirm(`Delete ${person.firstName} ${person.lastName}?`)) {
            this.personStore.deletePerson(person.id);
        }
    }

    onReset(): void {
        this.isEditing.set(false);
        this.personForm.reset({
            id:          0,
            firstName:   '',
            lastName:    '',
            email:       '',
            phoneNumber: '',
            dateOfBirth: '',
            address:     '',
            city:        '',
            country:     '',
            isActive:    true,
            status:      'active'
        });
    }
}