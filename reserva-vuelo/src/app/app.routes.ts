import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { UsuarioComponent } from './components/usuario/usuario.component';

export const routes: Routes = [
    { path: '', component: HomeComponent,},
    { path: 'usuarios', component: UsuarioComponent,},
];
