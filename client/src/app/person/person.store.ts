import {
    computed,
    DestroyRef,
    inject,
    Injectable,
    signal
} from "@angular/core";

import { HttpErrorResponse } from "@angular/common/http";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { CreatePersonDto, PersonModel, UpdatePersonDto } from "./person.model";
import { PersonService } from "./person.service";

export interface PersonState {
    people: readonly PersonModel[];
    loading: boolean;
    error: HttpErrorResponse | null;
    selectedPerson: PersonModel | null;
}

const initialState: PersonState = {
    people: [],
    loading: false,
    error: null,
    selectedPerson: null
};

@Injectable()
export class PersonStore {

    private readonly personService = inject(PersonService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly state = signal<PersonState>(initialState);

    // Selectors
    readonly people         = computed(() => this.state().people);
    readonly loading        = computed(() => this.state().loading);
    readonly error          = computed(() => this.state().error);
    readonly selectedPerson = computed(() => this.state().selectedPerson);
    readonly totalPeople    = computed(() => this.people().length);
    readonly activePeople   = computed(() => this.people().filter(p => p.status === 'active'));
    readonly inactivePeople = computed(() => this.people().filter(p => p.status === 'inactive'));

    constructor() {
        this.loadPeople();
    }

    private patchState(state: Partial<PersonState>) {
        this.state.update(current => ({ ...current, ...state }));
    }

    private setLoading() {
        this.patchState({ loading: true, error: null });
    }

    private setError(error: HttpErrorResponse) {
        console.error(error);
        this.patchState({ loading: false, error });
    }

    loadPeople() {
        this.setLoading();

        this.personService
            .getPeople()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (people) => {
                    const sorted = [...people].sort((a, b) =>
                        a.firstName.localeCompare(b.firstName)
                    );
                    this.patchState({ people: sorted, loading: false });
                },
                error: (error) => this.setError(error)
            });
    }

    addPerson(dto: CreatePersonDto) {
        this.setLoading();

        this.personService
            .addPerson(dto)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (createdPerson) => {
                    const sorted = [...this.people(), createdPerson].sort((a, b) =>
                        a.firstName.localeCompare(b.firstName)
                    );
                    this.patchState({ people: sorted, loading: false });
                },
                error: (error) => this.setError(error)
            });
    }

    updatePerson(dto: UpdatePersonDto) {
        this.setLoading();

        this.personService
            .updatePerson(dto)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (updatedPerson) => {
                    const sorted = this.people()
                        .map(p => p.id === dto.id ? updatedPerson : p)
                        .sort((a, b) => a.firstName.localeCompare(b.firstName));

                    this.patchState({
                        people: sorted,
                        loading: false,
                        selectedPerson: null
                    });
                },
                error: (error) => this.setError(error)
            });
    }

    deletePerson(id: number) {
        this.setLoading();

        this.personService
            .deletePerson(id)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: () => {
                    const filtered = this.people().filter(p => p.id !== id);
                    this.patchState({ people: filtered, loading: false });
                },
                error: (error) => this.setError(error)
            });
    }

    selectPerson(person: PersonModel | null) {
        this.patchState({ selectedPerson: person });
    }

    resetState() {
        this.state.set(initialState);
    }
}