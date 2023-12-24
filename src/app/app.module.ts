import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PrincipalComponent } from './componentes/principal/principal.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { APIServiceService } from './Services/apiservice.service';
import { FormsModule } from '@angular/forms';
import { RickMortyComponent } from './componentes/rick-morty/rick-morty.component';
import { RickMortyCardComponent } from './componentes/rick-morty-card/rick-morty-card.component';
import { MenuComponent } from './componentes/menu/menu.component';
import { GameboyComponent } from './componentes/gameboy/gameboy.component';
import { MenuPrincipalComponent } from './componentes/gameboy/menu-principal/menu-principal.component';
import { PokedexComponent } from './componentes/gameboy/pokedex/pokedex.component';
import { AnimacionApagarComponent } from './componentes/gameboy/animaciones/animacion-apagar/animacion-apagar.component';
import { InfoUsoComponent } from './componentes/gameboy/info-uso/info-uso.component';
import { UsuarioComponent } from './componentes/gameboy/usuario/usuario.component';
import { LogInComponent } from './componentes/gameboy/usuario/log-in/log-in.component';
import { SignInComponent } from './componentes/gameboy/usuario/sign-in/sign-in.component';
import { CombateCPUComponent } from './componentes/gameboy/combate-cpu/combate-cpu.component';
import { AnimacionEncenderComponent } from './componentes/gameboy/animaciones/animacion-encender/animacion-encender.component';

@NgModule({
  declarations: [
    AppComponent,
    PrincipalComponent,
    RickMortyComponent,
    RickMortyCardComponent,
    MenuComponent,
    GameboyComponent,
    MenuPrincipalComponent,
    PokedexComponent,
    AnimacionApagarComponent,
    InfoUsoComponent,
    UsuarioComponent,
    LogInComponent,
    SignInComponent,
    CombateCPUComponent,
    AnimacionEncenderComponent,
  ],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule
  ],
  providers: [APIServiceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
