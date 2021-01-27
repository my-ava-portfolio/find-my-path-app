import { Injectable } from '@angular/core';

import * as L from 'leaflet';
import * as d3 from 'd3';

import { D3ToInputs } from '../services/d3toinputs.service';


interface PointGeometry {
  type: string;
  coordinates: number[];
}

interface Coordinates {
  x: number;
  y: number;
}

interface LatLng {
  lat: number;
  lng: number;
}



@Injectable({
  providedIn: 'root'
})

export class D3LeafletUtils {

  private windowWidth: number = window.innerWidth;
  private windowHeight: number = window.innerHeight;
  private popupClassName = 'popup-feature';

  constructor(
    private d3ToInputs: D3ToInputs
  ) { }

  pinPathCubicBezier(width: number, height: number): string {
    // https://medium.com/welldone-software/map-pins-using-svg-path-9fdfebb74501
    const deltaX = width * Math.sqrt(3);
    const deltaY = height * 4 / 3;
    return `M 0,0 C ${-deltaX},${-deltaY}
        ${deltaX},${-deltaY} 0,0 z`;
}

  removeFeaturesMapFromLayerId(layerId: string): void {
    d3.selectAll('#' + layerId).remove();
  }

  UpdatePathStyleFromLayerId(layerId: string, strokeColor?: string, strokeWidth?: string): void {
    // path , nodes, line chart are updated when color is changed
    const path: any = d3.selectAll('.lineConnect_pathMap-' + layerId);
    const pathPoints: any = d3.selectAll('.waypoints_pathMap-' + layerId);
    const pathTravelMarker: any = d3.selectAll('.travelMarker_pathMap-' + layerId);

    const nodes: any = d3.selectAll('#nodesMap-' + layerId + '  path');
    const TransportMarkersCircleOnPath: any = d3.selectAll('circle.travelFixedMarker_nodesMap-' + layerId);

    const chartLinePath: any = d3.selectAll('.chart-line-' + layerId);
    const chartLineCircle: any =  d3.selectAll('.chart-line-circle-' + layerId);
    const chartLineLegend: any =  d3.selectAll('.chart-legend-' + layerId);

    if (strokeColor !== undefined) {
      path.style('stroke', strokeColor);
      pathPoints.style('stroke', strokeColor);
      pathTravelMarker.style('stroke', strokeColor);
      nodes.style('stroke', strokeColor);
      chartLinePath.style('stroke', strokeColor);
      chartLineCircle.style('stroke', strokeColor);
      chartLineLegend.style('fill', strokeColor);
      TransportMarkersCircleOnPath.style('fill', strokeColor);
    }

    if (strokeWidth !== undefined) {
      path.style('stroke-width', strokeWidth);
    }
  }

  computeAnimatePointsOnLine(LeafletMap: any, pathData: any, layerId: string): void {
    this.removeFeaturesMapFromLayerId(layerId);

    const GeoJsonPointFeatures: any[] = pathData.getPointsPath().features;
    const inputData: any[] = JSON.parse(JSON.stringify(GeoJsonPointFeatures));
    const convertLatLngToLayerCoords = (d: any): any => {
        return LeafletMap.latLngToLayerPoint(
            new L.LatLng(
                d.geometry.coordinates[1],
                d.geometry.coordinates[0]
            )
        );
    };

    inputData.forEach( (feature, i) => {
        feature.LatLng = new L.LatLng(
            feature.geometry.coordinates[1],
            feature.geometry.coordinates[0]
        );
    });

    const svgMapContainer: any = L.svg().addTo(LeafletMap);
    const svg: any = d3.select(svgMapContainer._container).attr('id', layerId);
    // leaflet-zoom-hide needed to avoid the phantom original SVG
    const g: any = svg.append('g').attr('class', 'leaflet-zoom-hide path_' + layerId);

    // function to generate a line
    const toLine: any = d3.line()
      // .interpolate("linear")
      .x((d: any): number => convertLatLngToLayerCoords(d).x)
      .y((d: any): number => convertLatLngToLayerCoords(d).y);


    // Here we will make the points into a single
    // line/path. Note that we surround the input_data
    // with [] to tell d3 to treat all the points as a
    // single line. For now these are basically points
    // but below we set the "d" attribute using the
    // line creator function from above.
    const linePath: any  = g.selectAll('.lineConnect_' + layerId)
      .data([inputData])
      .enter()
      .append('path')
      .attr('class', 'lineConnect_' + layerId)
      .style('fill', 'none')
      .style('opacity', 'unset') // add 0 to hide the path
      .style('stroke', pathData.strokeColor)
      .style('stroke-width', pathData.strokeWidth + 'px')
      .style('overflow', 'overlay');

    // the traveling circle along the path
    const marker: any  = g.append('circle')
      .attr('r', 11)
      .attr('id', 'marker_' + layerId)
      .attr('class', 'travelMarker_' + layerId)
      .style('fill', 'white')
      .style('stroke', pathData.strokeColor)
      .style('stroke-width', '4px');

    const textmarker: any  = g.append('text')
      .attr('font-family', '\'Font Awesome 5 Free\'')
      .attr('font-weight', 900)
      .text(pathData.getTransportModeIcon())
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'middle')
      .attr('id', 'markerText_' + layerId)
      .attr('class', 'travelMarkerText_' + layerId);

    // points that make the path, we'll be used to display them with the line chart
    // we make them transparent
    const ptFeatures: any = g.selectAll('circle')
      .data(inputData)
      .enter()
      .append('circle')
      .attr('r', 6)
      .style('fill', 'white')
      .style('stroke', pathData.strokeColor)
      .style('stroke-width', '2px')
      .attr('class', 'waypoints_' + layerId)
      .attr('id', (d: any) => d.properties.uuid)
      .style('opacity', '0');

    // Reposition the SVG to cover the features.
    const reset = (): void => {

      // we get the stating point
      marker.attr('transform',
        (): string => {
          const y: number = inputData[0].geometry.coordinates[1];
          const x: number = inputData[0].geometry.coordinates[0];
          return 'translate(' +
            LeafletMap.latLngToLayerPoint(new L.LatLng(y, x)).x + ',' +
            LeafletMap.latLngToLayerPoint(new L.LatLng(y, x)).y +
          ')';
        }
      );

      textmarker.attr('transform',
        (): string => {
        const y: number = inputData[0].geometry.coordinates[1];
        const x: number = inputData[0].geometry.coordinates[0];
        return 'translate(' +
            LeafletMap.latLngToLayerPoint(new L.LatLng(y, x)).x + ',' +
            LeafletMap.latLngToLayerPoint(new L.LatLng(y, x)).y +
          ')';
        }
      );

      linePath.attr('d', toLine);

      ptFeatures.attr(
        'transform',
        (d: any): string => 'translate(' +
          convertLatLngToLayerCoords(d).x + ',' +
          convertLatLngToLayerCoords(d).y +
        ')'
      );

    };

    function transition(): void {
      linePath.transition()
        .duration(7500)
        .attrTween('stroke-dasharray', tweenDash)
        .on('end', (): void => {
          marker.style('opacity', '0');
          textmarker.style('opacity', '0');
          // d3.select(this).call(transition);// infinite loop
          linePath.style('stroke-dasharray', '0');
          // value of this property is depending from the zoom... if we zoom the context change and the style is not adapted.
          // so we remove the stroke-dasharray style to be sure to display the path as usual

        })
        ;

    }


    // this function feeds the attrTween operator above with the
    // stroke and dash lengths
    function tweenDash(): any {
      return (t: any): any => {
        // total length of path (single value)
        const l: any = linePath.node().getTotalLength();
        // t is the time converted from 0 to 1
        const interpolate: any = d3.interpolateString('0,' + l, l + ',' + l);
        // t is fraction of time 0-1 since transition began
        const markerSelected: any = d3.select('#marker_' + layerId);
        const textmarkerSelect: any = d3.select('#markerText_' + layerId);

        const p = linePath.node().getPointAtLength(t * l);

        // Move the marker to that point
        markerSelected.attr('transform', 'translate(' + p.x + ',' + p.y + ')'); // move marker
        textmarkerSelect.attr('transform', 'translate(' + p.x + ',' + p.y + ')'); // move marker

        return interpolate(t);
      };
    }

    // when the user zooms in or out you need to reset
    // the view
    LeafletMap.on('moveend', reset);

    // this puts stuff on the map!
    reset();
    transition();

  }

  computeMapFromPoints(LeafletMap: any, inputPath: any, layerId: string, displayToolTip: boolean = false): void {
    this.removeFeaturesMapFromLayerId(layerId);

    const GeoJsonPointFeatures = inputPath.getNodes();

    const inputData: any[] = JSON.parse(JSON.stringify(GeoJsonPointFeatures));

    inputData.forEach( (feature, i): void => {
      feature.LatLng = new L.LatLng(
        feature.geometry.coordinates[1],
        feature.geometry.coordinates[0]
      );
      feature.properties.uuid = 'node_' + feature.properties.uuid + '_' + layerId; // layerId to avoid conflic between paths !
    });

    const svgLayer: any = L.svg().addTo(LeafletMap);
    const svg: any = d3.select(svgLayer._container)
      .attr('id', layerId)
      .attr('pointer-events', 'auto')
      .attr('class', 'svg-shadow');
    const g: any = svg.select('g').attr('class', 'leaflet-zoom-hide');

    const path = this.pinPathCubicBezier(25, 35);
    const PathNodes: any = g.selectAll('.' + layerId)
      .data(inputData)
      .enter()
      .append('g')
      .attr('class', 'MapMarkers')
      .attr('id', (d: any): void => d.properties.uuid); // very important for the drag move

    PathNodes
      .append('path')
      .attr('d', path)
      .attr('class', 'PathNodes')
      .style('stroke', inputPath.getColor())
      .style('stroke-width', '5px');

    PathNodes
      .append('text')
      .text((d: any): string => {
        return d.properties.position;
      })
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'middle')
      .attr('class', 'PathNodesText')
      .attr('id', 'textMarker-' + layerId)
      .attr('y', '-18');

    PathNodes
      .append('circle')
      .attr('r', 10)
      .attr('cy', '-38')
      .attr('class', 'travelFixedMarker_' + layerId)
      .style('fill', inputPath.getColor()); // TODO add css

    PathNodes
      .append('text')
      .attr('font-family', '\'Font Awesome 5 Free\'')
      .attr('y', '-38')
      .attr('font-weight', 900)
      .text(inputPath.getTransportModeIcon())
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'middle')
      .attr('class', 'travelFixedMarker_' + layerId)
      .style('fill', 'white')
      .style('opacity', '1');

    PathNodes
      .on('mouseover', (d: any): void => {
          this.initPopup('body', 'popup-' + inputPath.id, d, false);
      })
      .on('mousemove', (d: any): void => {
          this.moveResponsivePopup('#popup-' + inputPath.id);
      })
      .on('mouseout', (d: any): void => {
        // TODO issue popup sometimes not removed
        d3.select('#popup-' + inputPath.id).remove();
      });

    const layerCoordsConverter = this.convertLayerCoordsToLatLng.bind(this);

    function refreshInputDataCoordinates(sourceData: any, featureUpdated: any): any {
      const nodeUuid: number = inputData.findIndex(
          (node: any): boolean =>
              node.properties.uuid === featureUpdated.properties.uuid
      );
      const CoordinatesUpdated = layerCoordsConverter(LeafletMap, { x: d3.event.x, y: d3.event.y });
      sourceData[nodeUuid].geometry.coordinates = [CoordinatesUpdated.lng, CoordinatesUpdated.lat];

      return sourceData;
    }


    if (inputPath.getEdit()) {
      PathNodes
        .attr('class', 'MapMarkers-' + layerId + ' dragEnabled')
        .call(
          d3.drag()
            .on('drag', (d: any): void => {
            LeafletMap.dragging.disable();
            d3.select('#' + d.properties.uuid)
              // .style('r', '15')
              .attr('transform', 'translate(' + d3.event.x + ',' + d3.event.y + ')' );

            // to refresh the nodecontrolers part
            // use the original input data to update data path (inherit)
            refreshInputDataCoordinates(GeoJsonPointFeatures, d);
          })
          .on('end', (d: any): void => {
            // to refresh the nodecontrolers part
            // use the original input data to update data path (inherit)
            inputPath.setNodes(refreshInputDataCoordinates(GeoJsonPointFeatures, d));
            this.computeMapFromPoints(LeafletMap, inputPath, layerId, displayToolTip = false);

            // emit a node changes
            const CoordinatesUpdated = layerCoordsConverter(LeafletMap, { x: d3.event.x, y: d3.event.y });
            this.d3ToInputs.emitpointMapMoved([CoordinatesUpdated.lng, CoordinatesUpdated.lat]);

            LeafletMap.dragging.enable();
            // remove tooltip to avoid issue due to the drag and drop
            d3.select('#popup-' + inputPath.id).remove();
          })
        );
    }


    // Reposition the SVG to cover the features.
    const reset = (): void => {
      const latLngConverter = this.convertLatLngToLayerCoords.bind(this);
      // convert from latlong to map units
      // textPoints.attr('transform',
      //   (d: any): string =>
      //     'translate(' +
      //     latLngConverter(LeafletMap, d.geometry).x + ',' +
      //     latLngConverter(LeafletMap, d.geometry).y +
      //   ')'
      // );
      PathNodes.attr('transform',
        (d: any): string => 'translate(' +
          latLngConverter(LeafletMap, d.geometry).x + ',' +
          latLngConverter(LeafletMap, d.geometry).y +
        ')'
      );
    };

    // when the user zooms in or out you need to reset
    // the view
    LeafletMap.on('zoom', reset);
    // this puts stuff on the map!
    reset();

  }

  convertLatLngToLayerCoords(LeafletMap: any, geometry: PointGeometry): any {
    const y = geometry.coordinates[1];
    const x = geometry.coordinates[0];
    return LeafletMap.latLngToLayerPoint(new L.LatLng(y, x));
  }

  convertLayerCoordsToLatLng(LeafletMap: any, coordinates: Coordinates): LatLng {
    return LeafletMap.layerPointToLatLng([coordinates.x, coordinates.y]);
  }

  initPopup(containerId: string, popupId: string, feature: any, staticMode: boolean = false): void {

    const popupDiv: any = d3.select(containerId).append('div')
      .attr('class', 'shadow bg-white rounded ' + this.popupClassName)
      .attr('id', popupId);
        // .style('opacity', 1)
    // TODO improve to display all the properties nicely
    popupDiv.html(feature.properties.name);

    if (staticMode) {
      const popup: any = d3.selectAll('#' + popupId);
      popup
        .style('left', (d3.event.pageX)  + 'px')
        .style('top', (d3.event.pageY - 20) + 'px');
    }
  }

  moveResponsivePopup(popupId: string): void {
    const popup: any = d3.selectAll(popupId);

    // do not change with let or you'll have value issue
    // TODO improve
    const popupWidth = 50;
    const popupHeight = 10;
    popup
      .style('left', (): string => {
        if (d3.event.pageX + popupWidth + 20 > this.windowWidth) {
            return d3.event.pageX - popupWidth - 15 + 'px';
        } else {
            return d3.event.pageX + 15 + 'px';
        }
      })
      .style('top', (): string => {
        if (d3.event.pageY + popupHeight + 20 > this.windowHeight) {
            return d3.event.pageY - popupHeight - 15 + 'px';
        } else {
            return d3.event.pageY + 15 + 'px';
        }
      });
  }

  createLinesChart(chartId: string, data: any[], margin: any, width: number, height: number, isGlobalChart: boolean): void {
    // list of paths
    const defaultChartClass = 'multiLineChart' + '-' + chartId;

    const contentWidth: number = width - margin.right;
    const contentHeight: number = height + margin.top + margin.bottom;

    d3.select('#' + defaultChartClass).remove();
    const svg: any = d3.select('#' + chartId)
      .append('svg')
      .attr('width', '100%')
      .attr('height', contentHeight)
      .attr('id', defaultChartClass);

    const g: any = svg
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
      // to display y axis and top legend

    // Set the ranges
    const x: any = d3.scaleLinear().range([5, contentWidth]); // add 5 not 0, to dispatch the x axis and the y axis
    const y: any = d3.scaleLinear().range([height, 0]);

    // Define the axes
    const xAxis: any = d3.axisBottom(x);
    const yAxis: any = d3.axisLeft(y);

    // Define the line
    const lineBuilder: any = d3.line<any>()
      .x( (d: any) => x(d.properties.distance) )
      .y( (d: any) => y(d.properties.height) )
      .curve(d3.curveCatmullRom);

    // Scale the range of the data
    const xValues: number[] = [];
    const yValuesMin: number[] = [];
    const yValuesMax: number[] = [];
    data.forEach((item: any) => {
      xValues.push(item.statsPath.length);
      yValuesMin.push(item.statsPath.height_min - 2);
      yValuesMax.push(item.statsPath.height_max + 2);
    });

    x.domain([
      0,
      d3.max(xValues)
    ]);
    y.domain([
      d3.min(yValuesMin),
      d3.max(yValuesMax)
    ]);

    // legend process
    const legend = g.selectAll('g')
    .data(data)
    .enter()
    .append('g')
    .attr('class', 'legend');

    legend.append('rect')
      .attr('x', contentWidth - 90)
      .attr('y', (d: any, i: number) => i *  20)
      .attr('width', 10)
      .attr('height', 10)
      .attr('class', (d: any) => 'chart-legend-' + d.id)
      .style('fill', (d: any) => d.strokeColor);

    legend.append('text')
      .attr('x', contentWidth - 75)
      .attr('y', (d: any, i: number) => (i *  20) + 9)
      .text( (d: any) => d.name);

    if (isGlobalChart) {
      legend
        .style('pointer-event', 'auto')
        .style('cursor', 'pointer')
        .on('click', (d: any, i: any, n: any) => {
          const chartLegend = d3.select('.chart-legend-' + d.id);
          if (chartLegend.style('fill') === 'grey') {
            d3.select('.chart-line-' + d.id).style('opacity', '1');
            d3.selectAll('.chart-line-circle-' + d.id).style('opacity', '1');
            chartLegend.style('fill', d.strokeColor);
          } else {
            d3.select('.chart-line-' + d.id).style('opacity', '0');
            d3.selectAll('.chart-line-circle-' + d.id).style('opacity', '0');
            chartLegend.style('fill', 'grey');
          }
        });
    }

    // data process
    data.forEach((item: any) => {

      const features: any[] = item.getPointsPath().features;
      const innerG: any = g.append('g');
      // Add the line_value path.
      innerG.append('path')
        .attr('class', 'chart-line-' + item.id)
        .attr('d', lineBuilder(features))
        .style('fill', 'none') // add a color
        .style('opacity', '1') // add 0 to hide the path
        .style('stroke', item.strokeColor)
        .style('stroke-width', '4')
        .style('overflow', 'overlay');

      // Add the valueline path.
      innerG.selectAll('.chart-line-circle-' + item.id)
      .data(features)
      .enter()
        .append('circle')
        .attr('class', 'chart-line-circle-' + item.id)
        .attr('r', 3)
        .style('height', '100%')
        .style('fill', 'white')
        .style('opacity', '1')
        .style('stroke-width', '2px')
        .style('stroke', item.strokeColor)
        .attr('pointer-events', 'all')
        .style('cursor', 'pointer')
        .attr('cx', (d: any) => x(d.properties.distance))
        .attr('cy', (d: any) => y(d.properties.height))
        .on('mouseover', (d: any, i: any, n: any) => {
          d3.select(n[i]).attr('r', 6);

          const currentPopup: any = d3.select('body').append('div')
            .attr('id', 'topoTooltip')
            .attr('class', 'row border rounded shadow')
            .style('opacity', 0.8)
            .style('position', 'absolute')
            .style('width', '170px')
            .style('height', '80px')
            .style('text-align', 'center')
            .style('background-color', item.getColor())
            .style('margin-left', '-5px')
            .style('border-width', '5px');

          currentPopup.transition()
            .duration(200)
            .style('opacity', .8);
          currentPopup
            .html('<div class="col-lg-12"><span class="font-weight-bold">' + item.name + '</span></div>' +
              '<div class="col-lg-12"><span>Elevation: ' + d.properties.height + ' m.</span></div>' +
              '<div class="col-lg-12"><span>Distance: ' + Math.round(d.properties.distance) + ' m. </span></div>'
            )
            .style('left', (d3.event.pageX + 10) + 'px')
            .style('top', (d3.event.pageY - 10) + 'px');

          // display node on map from chart
          d3.selectAll('#' + d.properties.uuid).style('opacity', '1');
        })
        .on('mouseout', (d: any, i: any, n: any) => {
          d3.select(n[i]).attr('r', 3);

          // reset display node on map from chart
          d3.selectAll('#' + d.properties.uuid).style('opacity', '0');
          d3.selectAll('#topoTooltip').remove();
      })
      .on('mousemove', () => {
        // always only 1 popup
        const currentPopup = d3.selectAll('#topoTooltip');

        // to get the size of the popup...
        // const popup_width: number = d3.selectAll("#topoTooltip").node().getBoundingClientRect().width
        // const popup_height: number = d3.selectAll("#topoTooltip").node().getBoundingClientRect().height
        const popupWidth: number = parseInt(d3.selectAll('#topoTooltip').style('width').replace('px', ''), 10);
        const popupHeight: number = parseInt(d3.selectAll('#topoTooltip').style('height').replace('px', ''), 10);

        currentPopup
        .style('left', () => {
          if (d3.event.pageX + popupWidth + 10 > window.outerWidth) {
                return d3.event.pageX - popupWidth - 10 + 'px';
            } else {
                return d3.event.pageX + 10 + 'px';
            }
        })
        .style('top', () => {
            if (d3.event.pageY + popupHeight + 10 > window.outerHeight) {
                return d3.event.pageY - popupHeight - 10 + 'px';
            } else {
                return d3.event.pageY + 10 + 'px';
            }
        });

      });

    });

    // Add X axis
    g.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis);

    // text label x axis
    g.append('text')
      .attr('transform', 'translate(' + (contentWidth + 0) + ' ,' + (height - 5) + ')')
      .style('text-anchor', 'end')
      .style('font-size', '10px')
      .text('Distance parcourue (mètre)');

    // Add Y axis
    g.append('g')
        .attr('class', 'y axis')
        .call(yAxis);

    // text label y axis
    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 5)
      .attr('x', 0)
      .attr('dy', '1em')
      .style('text-anchor', 'end')
      .style('font-size', '10px')
      .text('Altitude (mètres)');

  }

}
