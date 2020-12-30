import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { MapComponent } from './map/map.component';
import { ViewcontrolerComponent } from './viewcontroler/viewcontroler.component';
import { NodescontrolerComponent } from './nodescontroler/nodescontroler.component';

import { MapControlerService } from './mapcontroler.service';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MapComponent,
    ViewcontrolerComponent,
    NodescontrolerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [MapControlerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
