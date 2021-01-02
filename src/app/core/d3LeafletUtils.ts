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

    computeAnimatePointsOnLine(LeafletMap: any, GeoJsonPointFeatures: any[], layerId: string): void {
        d3.selectAll('#' + layerId).remove();

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
            .style('fill', 'none') // add a color
            .style('opacity', 'unset') // add 0 to hide the path
            .style('stroke', 'black')
            .style('stroke-width', '2')
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


    computeMapFromPoints(LeafletMap: any, GeoJsonPointFeatures: any[], layerId: string, displayToolTip: boolean = false): void {
        d3.selectAll('#' + layerId).remove();

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
            .on('mouseover', (d: any): void => {
                LeafletMap.dragging.disable();
                this.initPopup('body', 'popup-' + layerId, d, false);
            })
            .on('mousemove', (d: any): void => {
                LeafletMap.dragging.disable();
                this.moveResponsivePopup('#popup-' + layerId);
            })
            .on('mouseout', (d: any): void => {
                LeafletMap.dragging.enable();
                d3.select('#popup-' + layerId).remove();
            })
            .call(
                d3.drag()
                .on('drag', (): void => {
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
                    this.computeMapFromPoints(LeafletMap, GeoJsonPointFeatures, layerId, displayToolTip = false);

                })
            );

        const textPoints = g.selectAll('.PathNodesText')
            .data(GeoJsonPointFeatures)
            .enter()
            .append('text')
            .text( (d: any): string => {
                const name = d.properties.name;
                const position = d.properties.position;

                if (name.length > 0) {
                    return name;
                } else {
                    return position;
                }
            })
            .attr('text-anchor', 'middle')
            .attr('y', -20)
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
        console.log('aaa', coordinates, LeafletMap.layerPointToLatLng([coordinates.x, coordinates.y]) );
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
            console.log(popup);
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



}
