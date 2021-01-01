// transport modes
export interface TransportMode {
    title: string;
    value: string;
}

// a node feature
// interface Geometry {
//     type: string;
//     coordinates: number[];
// }

// interface Properties {
//     position: number;
//     uuid: number;
//     name: string;
// }




export interface Node {
    type: string;
    geometry: {
        type: string;
        coordinates: number[];
    };
    properties: {
        position: number;
        uuid: number;
        name: string;
    };
}
export interface NodeGeoJson {
    type: string;
    features: Node[];
}

// PATH API
export interface NodePathFeature {
    type: string;
    geometry: {
        type: string;
        coordinates: number[];
    };
    properties: {
        elevation: number;
        distance: number;
    };
    LatLng?: any;
}
export interface NodePathGeoJson {
    type: string;
    features: NodePathFeature[];
}

export interface OutputPathApi {
    points_path: NodePathGeoJson;
    line_path: any;
    stats_path: any;
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
