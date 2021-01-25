import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet/dist/images/marker-shadow.png';

import { MapToParametersService } from '../../services/maptoparameters.service';
import { ParametersToMapService } from '../../services/parameterstomap.service';

import { MapViewBuilderService } from '../../services/mapviewbuider.service';
import { MapPathBuilderService } from '../../services/mappathbuilder.service';
import { PathsToMapService } from '../../services/pathstomap.service';

import { PathFeature, PathElement, Marker} from '../../core/interfaces';
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
  private zoomValue = 10;
  private minZoomValue = 3
  private maxZoomValue = 18
	
  private stamenLayer: any = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}{r}.png', { id: 'backgroundMap', attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' });
  private osmLayer: any = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {id: 'backgroundMap', attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'});
  private openTopoMap: any = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {id: 'backgroundMap', attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'});
  
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
    this.PathBuilderService.pathBuilt.subscribe(PathData => {
      this.MapFuncs.computeAnimatePointsOnLine(
        this.map,
        PathData,
        this.pathMapPrefix + PathData.id
      );
      this.Map2ParametersService.pushCompletePath(PathData);
      this.displayNodesOnMap(PathData);
    });

    // delete node path from parameter button
    this.Parameters2MapService.MapPathIdToremove.subscribe(pathId => {
      this.MapFuncs.removeFeaturesMapFromLayerId(this.pathMapPrefix + pathId);
      this.MapFuncs.removeFeaturesMapFromLayerId(this.nodesMapPrefix + pathId);

    });

    // zoom on path
    this.Parameters2MapService.PathToZoom.subscribe(pathFeat => {
      let jsonData!: string
      if (!pathFeat.isPathComputed()) {
        // zoom on the path is it has been computed
        jsonData = pathFeat.buildGeojsonOriginalNodes();
      } else {
        // zoom on the map nodes by default
        jsonData = JSON.stringify(pathFeat.getLinePath());
      }
      const jsonLayer = L.geoJSON(JSON.parse(jsonData));
      this.map.fitBounds(jsonLayer.getBounds());

    });

   }

  ngOnInit(): void {
    this.initMap();
   }

  initMap(): void {

    this.map = L.map('map', {
      center: this.InitialViewCoords,
      zoom: this.zoomValue,
      minZoom: this.minZoomValue,
      maxZoom: this.maxZoomValue,
      layers: [this.osmLayer] // the default background map
    });
    // prepare background map controler
    const backgroundMaps = {
      "Stamen": this.stamenLayer,
      "OpenTopoMap": this.openTopoMap,
      "OpenStreetMap": this.osmLayer
    };
    L.control.layers(backgroundMaps).addTo(this.map);

    this.map.on('click', this.onMapClickWithD3.bind(this));
  }

  onMapClickWithD3(event: any): void {
    // get coordinates from map click
    const coordinates: any = [
      event.latlng.lat,
      event.latlng.lng
    ];
    this.Map2ParametersService.getPointCoords(coordinates);
  }


  displayNodesOnMap(pathFeature: PathElement): void {
    this.MapFuncs.computeMapFromPoints(
      this.map,
      pathFeature,
      this.nodesMapPrefix + pathFeature.id,
    );
  }
}
