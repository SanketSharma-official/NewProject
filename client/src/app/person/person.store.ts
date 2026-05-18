import { computed, DestroyRef, inject, Injectable, signal } from "@angular/core";
import { PersonModel } from "./person.model";
import { HttpErrorResponse } from "@angular/common/http";
import { PersonService } from "./person.service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

export interface PersonState {
    people: readonly PersonModel[],
    loading: boolean,
    error: HttpErrorResponse | null
}

const _initialState: PersonState = {
    people: [],
    loading: false,
    error: null
}

@Injectable()
export class PersonStore {
    private readonly personService = inject(PersonService);
    private state = signal(_initialState);
    private readonly destroyRef = inject(DestroyRef);

    people = computed(() => this.state().people);
    loading = computed(() => this.state().loading);
    error = computed(() => this.state().error);

    addPerson(person: PersonModel) {
        this.personService.addPerson(person)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (person: PersonModel) => this.state.update(() => ({ ...this.state(), loading: false, people: [...this.people(), person] })),
                error: (error) => {
                    console.log(error);
                    this.setError(error);
                }
            });
    }

    updatePerson(person: PersonModel) {
        this.personService.updatePerson(person)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: () => this.state.update(() => ({ ...this.state(), loading: false, people: this.people().map(p => p.id === person.id ? person : p) })),
                error: (error) => {
                    console.log(error);
                    this.setError(error);
                }
            });
    }

    deletePerson(id: number) {
        this.personService.deletePerson(id)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: () => this.state.update(() => ({
                    ...this.state(),
                    loading: false,
                    people: this.people().filter(p => p.id !== id)
                })),
                error: (error) => {
                    console.log(error);
                    this.setError(error);
                }
            });
    }

    private loadPeople() {
        this.setLoading();
        this.personService.getPeople().pipe(
            takeUntilDestroyed(this.destroyRef)
        ).subscribe({
            next: (people) => this.state.update(() => ({ ...this.state(), loading: false, people })),
            error: (error) => {
                console.log(error);
                this.setError(error);
            }
        });
    }

    private setLoading() {
        this.state.update(() => ({ ...this.state(), loading: true }));
    }

    private setError(error: HttpErrorResponse) {
        this.state.update(() => ({ ...this.state(), loading: false, error }));
    }

    constructor() {
        this.loadPeople();
    }
}