import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrincipalComponent } from './componentes/principal/principal.component';
import { RickMortyComponent } from './componentes/rick-morty/rick-morty.component';
import { RickMortyCardComponent } from './componentes/rick-morty-card/rick-morty-card.component';
import { GameboyComponent } from './componentes/gameboy/gameboy.component';
import { IAComponentComponent } from './componentes/ia-component/ia-component.component';
import { IphoneComponent } from './componentes/iphone/iphone.component';

const routes: Routes = [
  { path: '', pathMatch: 'prefix', redirectTo: 'pruebaApi'},
  { path: 'pruebaApi', component: PrincipalComponent},
  { path: 'rickMorty/:page', component: RickMortyComponent},
  { path: 'rickMortyCard/:id/:page', component: RickMortyCardComponent},
  { path: 'gameboy', component: GameboyComponent},
  { path: 'IA', component: IAComponentComponent},
  { path: 'iphone', component: IphoneComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
