import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import "leaflet/dist/images/marker-shadow.png";
import * as d3 from "d3";

import { MapViewBuilderService } from '../../services/mapviewbuider.service';
import { MapNodesBuilderService } from '../../services/mapnodesbuilder.service';
import { MapEditingService } from '../../services/mapediting.service';
import { MapPathBuilderService } from '../../services/mappathbuilder.service';

import { Node, Marker,  NodePathGeoJson, NodePathFeature} from '../../core/interfaces';

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
    private PathBuilderService: MapPathBuilderService
  ) {

    this.PathBuilderService.PathPointsOutput.subscribe(PathData => {
      this.PointsPathData = PathData;
      this.computeAnimatePointsOnLine(PathData, "pouette")
      this.PointsPathData = null
      console.log('path', PathData);
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
      console.log(this.MarkerArray)
      this.MarkerArray.forEach( (value, index) => {
        if (value.uuid === markerUuid) {
          this.map.removeLayer(value.marker);
        }
      })

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

    var customMarker: any = L.Marker.extend({
      options: {
        uuid: ''
      }
    });

    if (this.EditModeStatus) {
      const coordinates: any = [
        event.latlng.lat,
        event.latlng.lng
      ];
      console.log("pouette", event);
      this.MapNodesService.buildNodesArray(coordinates);

      const UuidExpected: number = this.MapNodesService.NodesArray.length - 1;
      const NodeFound: Node = this.MapNodesService.getNodeFromUuid(UuidExpected);

      const marker = new customMarker(
        coordinates,
        {
          uuid: NodeFound.properties.uuid,
          draggable: true
        }
      ).on('dragend', (event: any) => {
        const new_coordinates: any = [
          event.target.getLatLng().lat,
          event.target.getLatLng().lng
        ]
        const uuid: number = event.target.options.uuid;
        this.MapNodesService.updateNodeFeature(uuid, new_coordinates);

        console.log("pouet", event.target.getLatLng(), event)
      }).addTo(this.map);

      marker.bindPopup(NodeFound.properties.name, { autoClose: false, closeOnClick: false }).openPopup()

      this.MarkerArray.push(
        { uuid: UuidExpected, marker: marker }
      )
    }


  }
  //  put d3 js code!
  countNodes(nodes: any[]): void {
    console.log('nodes count FROM MAP', nodes.length);
  }

  computeAnimatePointsOnLine(geojson_nodes: NodePathGeoJson, id: string) {

    const geojson_nodes_features: NodePathFeature[] = geojson_nodes.features;

    const applyLatLngToLayer = (d: any): any => {
        return this.map.latLngToLayerPoint(
            new L.LatLng(
                d.geometry.coordinates[1],
                d.geometry.coordinates[0]
            )
        )
    };

    geojson_nodes_features.forEach( (feature, i) => {
        feature.LatLng = new L.LatLng(
            feature.geometry.coordinates[1],
            feature.geometry.coordinates[0]
        )
    })

    // leaflet-zoom-hide needed to avoid the phantom original SVG
    const svg_map_container: any = L.svg().addTo(this.map);
    const svg: any  = d3.select(svg_map_container._container).attr('id', id);
    const g: any = svg.append('g').attr('class', 'leaflet-zoom-hide path_' + id);

    // Here we're creating a FUNCTION to generate a line
    // from input points. Since input points will be in
    // Lat/Long they need to be converted to map units
    // with applyLatLngToLayer
    const toLine: any = d3.line()
      // .interpolate("linear")
      .x((d: any): number => applyLatLngToLayer(d).x)
      .y((d: any): number => applyLatLngToLayer(d).y);

    // From now on we are essentially appending our features to the
    // group element. We're adding a class with the line name
    // and we're making them invisible

    // these are the points that make up the path
    // they are unnecessary so I've make them
    // transparent for now
    const ptFeatures: any = g.selectAll('circle')
        .data(geojson_nodes_features)
        .enter()
        .append('circle')
        .attr('r', 3)
        .attr('class', 'waypoints_' + id)
        .style('opacity', '0');

    // Here we will make the points into a single
    // line/path. Note that we surround the geojson_nodes_features
    // with [] to tell d3 to treat all the points as a
    // single line. For now these are basically points
    // but below we set the "d" attribute using the
    // line creator function from above.
    const linePath: any  = g.selectAll('.lineConnect_' + id)
        .data([geojson_nodes_features])
        .enter()
        .append('path')
        .attr('class', 'lineConnect_' + id)
        .style('fill', 'none') // add a color
        .style('opacity', 'unset') // add 0 to hide the path
        .style('stroke', 'black')
        .style('stroke-width', '2')
        .style('overflow', 'overlay')

    // This will be our traveling circle it will
    // travel along our path
    const marker: any  = g.append('circle')
        .attr('r', 10)
        .attr('id', 'marker_' + id)
        .attr('class', 'travelMarker_' + id)
        .style('fill', 'yellow')

    // TODO should be optional and add argument
    const textmarker: any  = g.append('text')
        .attr('font-family', '\'Font Awesome 5 Free\'')
        .attr('font-weight', 900)
        .text('\uf238')
        .attr('x', -5)
        .attr('y', 5)
        .attr('id', 'markerText_' + id)
        .attr('class', 'travelMarkerText_' + id)
        // https://fontawesome.com/cheatsheet

    // Reposition the SVG to cover the features.
    const reset = (): void => {
        // WARNING disabled after add svg with leaflet method...
        // var bounds = d3path.bounds(geojson_nodes),
        //     topLeft = bounds[0],
        //     bottomRight = bounds[1];


        // here you're setting some styles, width, heigh etc
        // to the SVG. Note that we're adding a little height and
        // width because otherwise the bounding box would perfectly
        // cover our features BUT... since you might be using a big
        // circle to represent a 1 dimensional point, the circle
        // might get cut off.
      ptFeatures.attr(
        'transform',
        (d: any): string => 'translate(' + applyLatLngToLayer(d).x + ',' + applyLatLngToLayer(d).y + ')'
      );

        // again, not best practice, but I'm harding coding
        // the starting point

      marker.attr('transform',
        (): string => {
          const y: number = geojson_nodes_features[0].geometry.coordinates[1];
          const x: number = geojson_nodes_features[0].geometry.coordinates[0];
          return 'translate(' +
            this.map.latLngToLayerPoint(new L.LatLng(y, x)).x + ',' +
            this.map.latLngToLayerPoint(new L.LatLng(y, x)).y + ')';
        }
      );

      textmarker.attr('transform',
        (): string => {
        const y: number = geojson_nodes_features[0].geometry.coordinates[1]
        const x: number = geojson_nodes_features[0].geometry.coordinates[0]
        return 'translate(' +
          this.map.latLngToLayerPoint(new L.LatLng(y, x)).x + ',' +
          this.map.latLngToLayerPoint(new L.LatLng(y, x)).y + ')';
      });

      linePath.attr('d', toLine);

        // WARNING disabled after add svg with leaflet method...
        // g.attr("transform", "translate(" + (-topLeft[0] + 50) + "," + (-topLeft[1] + 50) + ")");

    }

    function transition(): void {
      linePath.transition()
        .duration(7500)
        .attrTween('stroke-dasharray', tweenDash)
        .on('end', (): void => {
            marker.style('opacity', '0')
            textmarker.style('opacity', '0')
            // d3.select(this).call(transition);// infinite loop
        });
    }

    // this function feeds the attrTween operator above with the
    // stroke and dash lengths
    function tweenDash(): any {
        return function(t: any): any {
            //total length of path (single value)
            const l: any = linePath.node().getTotalLength();

            const interpolate: any = d3.interpolateString('0,' + l, l + ',' + l);
            //t is fraction of time 0-1 since transition began
            const marker: any = d3.select('#marker_' + id);
            const textmarker: any = d3.select('#markerText_' + id);

            const p = linePath.node().getPointAtLength(t * l);

            //Move the marker to that point
            marker.attr('transform', 'translate(' + p.x + ',' + p.y + ')'); // move marker
            textmarker.attr('transform', 'translate(' + p.x + ',' + p.y + ')'); // move marker

            return interpolate(t);
        }
    }


    // when the user zooms in or out you need to reset
    // the view
    this.map.on('moveend', reset);

    // this puts stuff on the map!
    reset();
    transition();

  }

}
