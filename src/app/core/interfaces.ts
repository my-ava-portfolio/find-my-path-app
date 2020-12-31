// transport modes
export interface TransportMode {
    title: string;
    value: string;
}

// a geojson feature
interface Geometry {
    type: string;
    coordinates: number[];
}

interface Properties {
    position: number;
    uuid: number;
    name: string;
}

export interface Node {
    type: string;
    geometry: Geometry;
    properties: Properties;
}

// a bbox output from app api
export interface Bbox {
    bbox: number[];
}


// a leafet marker
export interface Marker {
    uuid: number;
    marker: any;
}
