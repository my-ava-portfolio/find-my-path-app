import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { MapComponent } from './components/map/map.component';
import { ViewcontrolerComponent } from './components/viewcontroler/viewcontroler.component';
import { NodesParametersComponent } from './components/nodesparameters/nodesparameters.component';
import { FooterComponent } from './components/footer/footer.component';
import { nodesControlersComponent } from './components/nodescontrolers/nodescontrolers.component';

import { MapViewBuilderService } from './services/mapviewbuider.service';
import { MapNodesBuilderService } from './services/mapnodesbuilder.service';
import { MapEditingService } from './services/mapediting.service';
import { MapPathBuilderService } from './services/mappathbuilder.service';




@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MapComponent,
    ViewcontrolerComponent,
    NodesParametersComponent,
    FooterComponent,
    nodesControlersComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    MapViewBuilderService,
    MapNodesBuilderService,
    MapEditingService,
    MapPathBuilderService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
