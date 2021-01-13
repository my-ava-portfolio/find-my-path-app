import { Injectable } from '@angular/core';

import * as L from 'leaflet';
import * as d3 from 'd3';



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

    constructor() { }

    removeFeaturesMapFromLayerId(layerId: string): void {
        d3.selectAll('#' + layerId).remove();
    }

    UpdatePathStyleFromLayerId(layerId: string, strokeColor?: string, strokeWidth?: string): void {
      const path: any = d3.selectAll('.lineConnect_pathMap-' + layerId);
      const nodes: any = d3.selectAll('#nodesMap-' + layerId + ' circle');

      if (strokeColor !== undefined) {
        path.style('stroke', strokeColor);
        nodes.style('stroke', strokeColor);
      }

      if (strokeWidth !== undefined) {
        path.style('stroke-width', strokeWidth);
      }
  }

    computeAnimatePointsOnLine(LeafletMap: any, GeoJsonPointFeatures: any[], layerId: string, lineColor: string, lineWidth: string): void {
        this.removeFeaturesMapFromLayerId(layerId);

        const convertLatLngToLayerCoords = (d: any): any => {
            return LeafletMap.latLngToLayerPoint(
                new L.LatLng(
                    d.geometry.coordinates[1],
                    d.geometry.coordinates[0]
                )
            );
        };

        GeoJsonPointFeatures.forEach( (feature, i) => {
            feature.LatLng = new L.LatLng(
                feature.geometry.coordinates[1],
                feature.geometry.coordinates[0]
            );
        });

        // leaflet-zoom-hide needed to avoid the phantom original SVG
        const svgMapContainer: any = L.svg().addTo(LeafletMap);
        const svg: any  = d3.select(svgMapContainer._container).attr('id', layerId);
        const g: any = svg.append('g').attr('class', 'leaflet-zoom-hide path_' + layerId);

        // Here we're creating a FUNCTION to generate a line
        // from input points. Since input points will be in
        // Lat/Long they need to be converted to map units
        // with convertLatLngToLayerCoords
        const toLine: any = d3.line()
        // .interpolate("linear")
        .x((d: any): number => convertLatLngToLayerCoords(d).x)
        .y((d: any): number => convertLatLngToLayerCoords(d).y);

        // From now on we are essentially appending our features to the
        // group element. We're adding a class with the line name
        // and we're making them invisible

        // these are the points that make up the path
        // they are unnecessary so I've make them
        // transparent for now
        const ptFeatures: any = g.selectAll('circle')
            .data(GeoJsonPointFeatures)
            .enter()
            .append('circle')
            .attr('r', 3)
            .attr('class', 'waypoints_' + layerId)
            .style('opacity', '0');

        // Here we will make the points into a single
        // line/path. Note that we surround the GeoJsonPointFeatures
        // with [] to tell d3 to treat all the points as a
        // single line. For now these are basically points
        // but below we set the "d" attribute using the
        // line creator function from above.
        const linePath: any  = g.selectAll('.lineConnect_' + layerId)
            .data([GeoJsonPointFeatures])
            .enter()
            .append('path')
            .attr('class', 'lineConnect_' + layerId)
            .style('fill', 'none')
            .style('opacity', 'unset') // add 0 to hide the path
            .style('stroke', lineColor)
            .style('stroke-width', lineWidth)
            .style('overflow', 'overlay');

        // This will be our traveling circle it will
        // travel along our path
        const marker: any  = g.append('circle')
            .attr('r', 10)
            .attr('id', 'marker_' + layerId)
            .attr('class', 'travelMarker_' + layerId)
            .style('fill', 'yellow');

        // TODO should be optional and add argument
        const textmarker: any  = g.append('text')
            .attr('font-family', '\'Font Awesome 5 Free\'')
            .attr('font-weight', 900)
            .text('\uf238')
            .attr('x', -5)
            .attr('y', 5)
            .attr('id', 'markerText_' + layerId)
            .attr('class', 'travelMarkerText_' + layerId);
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
                (d: any): string => 'translate(' + convertLatLngToLayerCoords(d).x + ',' + convertLatLngToLayerCoords(d).y + ')'
            );

            // again, not best practice, but I'm harding coding
            // the starting point
            marker.attr('transform',
                (): string => {
                    const y: number = GeoJsonPointFeatures[0].geometry.coordinates[1];
                    const x: number = GeoJsonPointFeatures[0].geometry.coordinates[0];
                    return 'translate(' +
                    LeafletMap.latLngToLayerPoint(new L.LatLng(y, x)).x + ',' +
                    LeafletMap.latLngToLayerPoint(new L.LatLng(y, x)).y + ')';
                }
            );

            textmarker.attr('transform',
                (): string => {
                const y: number = GeoJsonPointFeatures[0].geometry.coordinates[1];
                const x: number = GeoJsonPointFeatures[0].geometry.coordinates[0];
                return 'translate(' +
                    LeafletMap.latLngToLayerPoint(new L.LatLng(y, x)).x + ',' +
                    LeafletMap.latLngToLayerPoint(new L.LatLng(y, x)).y + ')';
                }
            );

            linePath.attr('d', toLine);

            // WARNING disabled after add svg with leaflet method...
            // g.attr("transform", "translate(" + (-topLeft[0] + 50) + "," + (-topLeft[1] + 50) + ")");

        };

        function transition(): void {
        linePath.transition()
            .duration(7500)
            .attrTween('stroke-dasharray', tweenDash)
            .on('end', (): void => {
                marker.style('opacity', '0');
                textmarker.style('opacity', '0');
                // d3.select(this).call(transition);// infinite loop
            });
        }

        // this function feeds the attrTween operator above with the
        // stroke and dash lengths
        function tweenDash(): any {
            return (t: any): any => {
                // total length of path (single value)
                const l: any = linePath.node().getTotalLength();

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


    computeMapFromPoints(LeafletMap: any, GeoJsonPointFeatures: any[], layerId: string, dragEnabled: boolean, colorStroke: string,displayToolTip: boolean = false): void {
        this.removeFeaturesMapFromLayerId(layerId);
        console.log('drag status', dragEnabled);
        GeoJsonPointFeatures.forEach( (feature, i): void => {
            feature.LatLng = new L.LatLng(
                feature.geometry.coordinates[1],
                feature.geometry.coordinates[0]
            );
        });

        const svgLayer: any = L.svg().addTo(LeafletMap);
        const svg: any = d3.select(svgLayer._container).attr('id', layerId).attr('pointer-events', 'auto');
        const g: any = svg.select('g').attr('class', 'leaflet-zoom-hide path');

        const PointsCircles: any = g.selectAll('.PathNodes')
          .data(GeoJsonPointFeatures)
          .enter()
          .append('circle', '.PathNodes')
          .attr('class', 'PathNodes')
          .attr('r', '15')
          .attr('id', (d: any): void => d.properties.id)
          .style('stroke', colorStroke);
          // .on('mouseover', (d: any): void => {
          //     LeafletMap.dragging.disable();
          //     this.initPopup('body', 'popup-' + layerId, d, false);
          // })
          // .on('mousemove', (d: any): void => {
          //     LeafletMap.dragging.disable();
          //     this.moveResponsivePopup('#popup-' + layerId);
          // })
          // .on('mouseout', (d: any): void => {
          //     LeafletMap.dragging.enable();
          //     // TODO issue popup sometimes not removed
          //     d3.select('#popup-' + layerId).remove();
          // })

        if (dragEnabled) {
          PointsCircles
            .attr('class', 'PathNodes dragEnabled')
            .call(
              d3.drag()
                .on('drag', (): void => {
                  LeafletMap.dragging.disable();
                  d3.select(d3.event.sourceEvent.target)
                    .style('r', '15')
                    .attr('transform', (d: any): string => 'translate(' + d3.event.x + ',' + d3.event.y + ')' );
              })
              .on('end', (d: any): void => {
                const layerCoordsConverter = this.convertLayerCoordsToLatLng.bind(this);
                const nodeUuid: number = GeoJsonPointFeatures.findIndex(
                    (node: any): boolean =>
                        node.properties.uuid === d.properties.uuid
                );
                const CoordinatesUpdated = layerCoordsConverter(LeafletMap, { x: d3.event.x, y: d3.event.y });
                GeoJsonPointFeatures[nodeUuid].geometry.coordinates = [CoordinatesUpdated.lng, CoordinatesUpdated.lat];
                this.computeMapFromPoints(LeafletMap, GeoJsonPointFeatures, layerId, dragEnabled, colorStroke, displayToolTip = false);
                LeafletMap.dragging.enable();
              })
            );
          }


        const textPoints = g.selectAll('.PathNodesText')
            .data(GeoJsonPointFeatures)
            .enter()
            .append('text')
            .text( (d: any): string => {
                const name = d.properties.name;
                const position = d.properties.position;

                // if (name.length > 0) {
                //     return name;
                // } else {
                    return position;
                // }
            })
            .attr('text-anchor', 'middle')
            .attr('alignment-baseline', 'middle')
            .attr('class', 'PathNodesText');

        // Reposition the SVG to cover the features.
        const reset = (): void => {
            const latLngConverter = this.convertLatLngToLayerCoords.bind(this);

            // convert from latlong to map units
            textPoints.attr('transform',
                (d: any): string =>
                    'translate(' + latLngConverter(LeafletMap, d.geometry).x + ',' + latLngConverter(LeafletMap, d.geometry).y + ')'
            );
            PointsCircles.attr('transform',
                (d: any): string =>
                    'translate(' + latLngConverter(LeafletMap, d.geometry).x + ',' + latLngConverter(LeafletMap, d.geometry).y + ')'
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
      const popupWidth: number = 50;
      const popupHeight: number = 10;
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

    createLinesChart(chartId: string, data: any[], margin: any, width: number, height: number): void {
      console.log('YAAAAAATTTTAAAA', data);
      // list of paths
      const defaultChartClass = 'multiLineChart' + '-' + chartId;

      d3.select('#' + defaultChartClass).remove();
      const svg: any = d3.select('#' + chartId).append('svg');

      const contentWidth: number = width;
      const contentHeight: number = height + margin.top + margin.bottom;

      const g: any = svg
        .attr('width', '100%')
        .attr('height', contentHeight)
        .attr('id', defaultChartClass)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

      // Set the ranges
      const x: any = d3.scaleLinear().range([0, contentWidth]);
      const y: any = d3.scaleLinear().range([contentHeight, 0]);

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
      const yValues: number[] = [];
      data.forEach((item: any) => {
        xValues.push(item.statsPath.length);
        yValues.push(item.statsPath.height_min - 2);
        yValues.push(item.statsPath.height_max + 2);
      });

      x.domain([
        0,
        d3.max(xValues)
      ]);
      y.domain([
        d3.min(yValues),
        d3.max(yValues)
      ]);

      data.forEach((item: any) => {

        const features: any[] = item.getPointsPath().features;
        console.log('aaaaAAAAAAAAAAAAAAA', features);
        const innerG: any = g.append('g')
        // Add the line_value path.
        innerG.append('path')
        .attr('class', 'line')
        .attr('d', lineBuilder(features))
        .style('fill', 'none') // add a color
        .style('opacity', 'unset') // add 0 to hide the path
        .style('stroke', item.strokeColor)
        .style('stroke-width', '4')
        .style('overflow', 'overlay');

        // Add the valueline path.
        innerG.selectAll('circle')
        .data(features)
        .enter()
        .append('circle')
        .attr('r', 3)
        .style('stroke', 'none')
        .style('stroke-width', 20)
        .attr('pointer-events', 'all')
        .style('cursor', 'pointer')
        .attr('cx', (d: any) => x(d.properties.distance))
        .attr('cy', (d: any) => y(d.properties.height))
        .on('mouseover', (d: any) => {
          const tooltip_div: any = d3.select('body').append('div')
            .attr('id', 'topoTooltip')
            .attr('class', 'border shadow')
            .style('opacity', 0)
            .style('position', 'absolute')
            .style('width', '170px')
            .style('height', '65px')
            .style('background-color', item.getColor());

          tooltip_div.transition()
            .duration(200)
            .style('opacity', .9);
          tooltip_div.html('<p>Nom: ' + item.name + '<br>Altitude: ' + d.properties.height + ' mètres<br>Distance: ' + Math.round(d.properties.distance)  + ' mètres</p>')
            .style('left', (d3.event.pageX + 10) + 'px')
            .style('top', (d3.event.pageY - 10) + 'px');
        })
        .on('mouseout', () => {
          d3.selectAll('#topoTooltip').remove();
        })
        .on('mousemove', () => {
          // always only 1 popup
          const current_popup = d3.selectAll('#topoTooltip');

          // to get the size of the popup...
          // const popup_width: number = d3.selectAll("#topoTooltip").node().getBoundingClientRect().width
          // const popup_height: number = d3.selectAll("#topoTooltip").node().getBoundingClientRect().height
          // console.log(popup_width, popup_height)
          const popup_width: number = parseInt(d3.selectAll('#topoTooltip').style('width').replace('px', ''), 10);
          const popup_height: number = parseInt(d3.selectAll('#topoTooltip').style('height').replace('px', ''), 10);

          current_popup
          .style('left', () => {
            if (d3.event.pageX + popup_width + 10 > window.outerWidth) {
                  return d3.event.pageX - popup_width - 10 + 'px';
              } else {
                  return d3.event.pageX + 10 + 'px';
              }
          })
          .style('top', () => {
              if (d3.event.pageY + popup_height + 10 > window.outerHeight) {
                  return d3.event.pageY - popup_height - 10 + 'px';
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
        .attr('transform', 'translate(' + (width + 0) + ' ,' + (height - 5) + ')')
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
