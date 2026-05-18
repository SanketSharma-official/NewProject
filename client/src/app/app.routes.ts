import { Routes } from '@angular/router';
import { NotFoundComponent } from './not-found.component';
import { PersonComponent } from './person/person.component';

export const routes: Routes = [
    {
        path: "people",
        component: PersonComponent
    },
    {
        path: "about",
        loadComponent: () => import('./about.component').then(a => a.AboutComponent)
    },
    {
        path: "",
        redirectTo: "/people",
        pathMatch: "full"
    },
    {
        path: "**",
        loadComponent: () => import('./not-found.component').then(a => a.NotFoundComponent)
    }
];
