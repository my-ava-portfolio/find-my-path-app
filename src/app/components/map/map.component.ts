import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet/dist/images/marker-shadow.png';
import * as d3 from 'd3';

import { MapToParametersService } from '../../services/maptoparameters.service';
import { ParametersToMapService } from '../../services/parameterstomap.service';

import { MapViewBuilderService } from '../../services/mapviewbuider.service';
import { MapPathBuilderService } from '../../services/mappathbuilder.service';
import { PathsToMapService } from '../../services/pathstomap.service';

import { PathFeature, PathElement, PathContainer, Nodes, Node, Marker,  NodePathGeoJson, NodePathFeature} from '../../core/interfaces';
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

  private nodesMapPrefix = 'nodesMap-';
  private pathMapPrefix = 'pathMap-';

  map: any;
  EditModeStatus!: boolean;
  MarkerArray: Marker[] = [];
  finalPathCompleted!: PathFeature;

  constructor(
    private Map2ParametersService: MapToParametersService,
    private Parameters2MapService: ParametersToMapService,
    private MapViewService: MapViewBuilderService,
    private PathBuilderService: MapPathBuilderService,
    private MapFuncs: D3LeafletUtils,
    private paths2MapService: PathsToMapService,
  ) {

    // to set the map view from the API
    this.MapViewService.bboxCoords.subscribe(data => {
      this.map.fitBounds([
        [data[0], data[2]],
        [data[1], data[3]]
      ]);
    });


    // refresh path if a switch is done from the pathshandler component
    this.paths2MapService.pathToRefresh.subscribe(pathFeature => {
      this.displayNodesOnMap(pathFeature);
    });

    // map from a path nodes from the inputparameters component
    this.Parameters2MapService.NodesPathToMap.subscribe(pathFeature => {
      this.displayNodesOnMap(pathFeature);
    });

    // map the path from nodes by using the API
    this.PathBuilderService.pathApiOutputs.subscribe(PathData => {
      this.MapFuncs.computeAnimatePointsOnLine(
        this.map,
        PathData.getPointsPath().features,
        this.pathMapPrefix + PathData.id,
        PathData.strokeColor,
        PathData.strokeWidth
      );
      console.log("animated path", this.pathMapPrefix + PathData.id)
      this.Map2ParametersService.pushCompletePath(PathData)
      this.displayNodesOnMap(PathData);
    });

    // delete node path from parameter button
    this.Parameters2MapService.MapPathIdToremove.subscribe(pathId => {
      this.MapFuncs.removeFeaturesMapFromLayerId(this.pathMapPrefix + pathId)
      this.MapFuncs.removeFeaturesMapFromLayerId(this.nodesMapPrefix + pathId)

    })
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

  onMapClickWithD3(event: any): void {
    console.log("create point on map")
    const coordinates: any = [
      event.latlng.lat,
      event.latlng.lng
    ];
    this.Map2ParametersService.getPointCoords(coordinates)
  }


  displayNodesOnMap(pathFeature: PathElement): void {
    this.MapFuncs.computeMapFromPoints(
      this.map,
      pathFeature.getNodes(),
      this.nodesMapPrefix + pathFeature.id,
      pathFeature.getEdit(),
      pathFeature.getColor()
    )
  }
}
