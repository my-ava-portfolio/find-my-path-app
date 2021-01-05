import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet/dist/images/marker-shadow.png';
import * as d3 from 'd3';

import { MapViewBuilderService } from '../../services/mapviewbuider.service';
import { MapPathBuilderService } from '../../services/mappathbuilder.service';
import { PathsHandlerService } from '../../services/pathshandler.service';

import { PathFeature, Nodes, Node, Marker,  NodePathGeoJson, NodePathFeature} from '../../core/interfaces';
import { D3LeafletUtils } from '../../core/d3LeafletUtils';


@Component({
  selector: 'app-map',
  // https://medium.com/@simonb90/comprendre-la-viewencapsulation-dans-un-component-angular-83decae8f092
  encapsulation: ViewEncapsulation.None,
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
    private PathsHService: PathsHandlerService,
    private MapViewService: MapViewBuilderService,
    private PathBuilderService: MapPathBuilderService,
    private MapFuncs: D3LeafletUtils
  ) {

    // go to handler service ; idem for statistics
    this.PathBuilderService.pathApiOutputs.subscribe(PathData => {
      this.MapFuncs.computeAnimatePointsOnLine(this.map, PathData.points_path!.features, 'pouette');
      this.PointsPathData = null;
    });

    this.MapViewService.bboxCoords.subscribe(data => {
      this.map.fitBounds([
        [data[0], data[2]],
        [data[1], data[3]]
      ]);
    });


    this.PathsHService.PathsHandlerContainer.subscribe(data => {
      const openedPath: PathFeature = this.PathsHService.getOpenedPath();
      this.MapFuncs.computeMapFromPoints(
        this.map,
        openedPath.inputNodes.features,
        'nodesMap-' + openedPath.id
      )
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
    this.map.on('click', this.onMapClickWithD3.bind(this));
  }


  _getEditingPathStatus(): void {
    const PathId: string = this.PathsHService.currentTabDisplayed;
    const pathIndex: number = this.PathsHService.getPathIndex(PathId);
    this.EditModeStatus = this.PathsHService.PathsHandlerData[pathIndex].configuration.EditingStatus;
  }

  onMapClickWithD3(event: any): void {
    this._getEditingPathStatus()

    if (this.EditModeStatus) {
      const coordinates: any = [
        event.latlng.lat,
        event.latlng.lng
      ];
      this.PathsHService.buildNodesArray(coordinates);

    }
  }


}
