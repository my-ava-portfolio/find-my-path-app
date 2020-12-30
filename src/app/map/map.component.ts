import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { MapControlerService } from '../mapcontroler.service';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  private init_pos_coord: any = [45.754649, 4.858618]
  private url: string = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  private attribution: string = '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors';
  private zoom: number = 10;
  map: any;
  map_nodes: any = { 
    type: "FeatureCollection",
    features: []
  }

  constructor(private mapService: MapControlerService) {
      console.log(this.mapService.bbox);
      this.mapService.bboxChange.subscribe(data => {
        console.log("aaa", data);
        this.map.fitBounds([
          [data.bbox[0], data.bbox[2]],
          [data.bbox[1], data.bbox[3]]
        ]);
      });
   }

  ngOnInit(): void {
    this.initMap()
   }

  initMap() {
    this.map = L.map('map').setView(this.init_pos_coord, this.zoom);
    L.tileLayer(
      this.url,
      {
        attribution: this.attribution
      }
    ).addTo(this.map);
    this.map.on('click', this.onMapClick.bind(this));
  }

  onMapClick(event: any) {
    this.map_nodes.features.push(
      {
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [
              event.latlng.lat,
              event.latlng.lng
            ]
        },
        "properties": {
            "position": this.map_nodes.features.length,
            "uuid": this.map_nodes.features.length,
            "name": ""
        }
      }
    )
    console.log(this.map_nodes)
  }

}
