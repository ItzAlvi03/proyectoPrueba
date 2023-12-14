import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PrincipalComponent } from './componentes/principal/principal.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { APIServiceService } from './Services/apiservice.service';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from './componentes/footer/footer.component';
import { RickMortyComponent } from './componentes/rick-morty/rick-morty.component';
import { RickMortyCardComponent } from './componentes/rick-morty-card/rick-morty-card.component';
import { MenuComponent } from './componentes/menu/menu.component';
import { GameboyComponent } from './componentes/gameboy/gameboy.component';
import { MenuPrincipalComponent } from './componentes/gameboy/menu-principal/menu-principal.component';
import { PokedexComponent } from './componentes/gameboy/pokedex/pokedex.component';
import { PokemonCardComponent } from './componentes/gameboy/pokemon-card/pokemon-card.component';

@NgModule({
  declarations: [
    AppComponent,
    PrincipalComponent,
    FooterComponent,
    RickMortyComponent,
    RickMortyCardComponent,
    MenuComponent,
    GameboyComponent,
    MenuPrincipalComponent,
    PokedexComponent,
    PokemonCardComponent,
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
