import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet/dist/images/marker-shadow.png';
import * as d3 from 'd3';

import { MapViewBuilderService } from '../../services/mapviewbuider.service';
import { MapNodesBuilderService } from '../../services/mapnodesbuilder.service';
import { MapEditingService } from '../../services/mapediting.service';
import { MapPathBuilderService } from '../../services/mappathbuilder.service';

import { Node, Marker,  NodePathGeoJson, NodePathFeature} from '../../core/interfaces';
import { D3LeafletUtils } from '../../core/d3LeafletUtils';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  private InitialViewCoords: any = [45.754649, 4.858618];
  private url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  private attribution = '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors';
  private zoom = 10;
  map: any;
  EditModeStatus!: boolean;
  MarkerArray: Marker[] = [];
  PointsPathData!: NodePathGeoJson | null;

  constructor(
    private MapViewService: MapViewBuilderService,
    private MapNodesService: MapNodesBuilderService,
    private EditingService: MapEditingService,
    private PathBuilderService: MapPathBuilderService,
    private MapFuncs: D3LeafletUtils
  ) {

    this.PathBuilderService.PathPointsOutput.subscribe(PathData => {
      this.MapFuncs.computeAnimatePointsOnLine(this.map, PathData.features, 'pouette');
      this.PointsPathData = null;
    });

    this.MapViewService.bboxCoords.subscribe(data => {
      console.log('bbox FROM MAP', data);
      this.map.fitBounds([
        [data[0], data[2]],
        [data[1], data[3]]
      ]);
    });

    this.MapNodesService.nodes.subscribe(data => {
      console.log('nodes FROM MAP', data);
      this.countNodes(data);
    });

    this.MapNodesService.markerUuidToDelete.subscribe(markerUuid => {
      console.log(this.MarkerArray);
      this.MarkerArray.forEach( (value, index) => {
        if (value.uuid === markerUuid) {
          this.map.removeLayer(value.marker);
        }
      });

    });

    this.EditingService.EditModeStatus.subscribe(status => {
      this.EditModeStatus = status;
      console.log('cpcpcp', status);
    });


   }

  ngOnInit(): void {
    this.initMap();
   }

  initMap(): void {
    this.map = L.map('map').setView(this.InitialViewCoords, this.zoom);
    L.tileLayer(
      this.url,
      {
        attribution: this.attribution
      }
    ).addTo(this.map);
    this.map.on('click', this.onMapClick.bind(this));
  }

  onMapClick(event: any): void {

    const customMarker: any = L.Marker.extend({
      options: {
        uuid: ''
      }
    });

    if (this.EditModeStatus) {
      const coordinates: any = [
        event.latlng.lat,
        event.latlng.lng
      ];
      console.log('pouette', event);
      this.MapNodesService.buildNodesArray(coordinates);

      const UuidExpected: number = this.MapNodesService.NodesArray.length - 1;
      const NodeFound: Node = this.MapNodesService.getNodeFromUuid(UuidExpected);

      const marker = new customMarker(
        coordinates,
        {
          uuid: NodeFound.properties.uuid,
          draggable: true
        }
      ).on('dragend', (e: any) => {
        const coordsUpdated: any = [
          e.target.getLatLng().lat,
          e.target.getLatLng().lng
        ];
        const uuid: number = event.target.options.uuid;
        this.MapNodesService.updateNodeFeature(uuid, coordsUpdated);

        console.log('pouet', event.target.getLatLng(), event);
      }).addTo(this.map);

      marker.bindPopup(NodeFound.properties.name, { autoClose: false, closeOnClick: false }).openPopup();

      this.MarkerArray.push(
        { uuid: UuidExpected, marker }
      );
    }


  }
  //  put d3 js code!
  countNodes(nodes: any[]): void {
    console.log('nodes count FROM MAP', nodes.length);
  }

}
