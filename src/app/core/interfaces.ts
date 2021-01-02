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


interface PointGeometry {
    type: string;
    coordinates: number[];
};

export interface Node {
    type: string;
    geometry: PointGeometry;
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
    geometry: PointGeometry;
    properties: {
        height: number;
        distance: number;
    };
    LatLng?: any;
}

export interface NodePathGeoJson {
    type: string;
    features: NodePathFeature[];
}

interface TopoPath {
    nodes_count: number;
    height_min: number;
    height_max: number;
    height_diff: number;
    length: number;
}

interface LinePathGeoJson {
    type: string;
    features: {
        type: string;
        geometry: PointGeometry;
        properties: {
            source_node: string,
            target_node: string,
            path_step: number,
            length: number
        };
    };
}

export interface PathStatistics {
    nodes_count: number;
    height_min: number;
    height_max: number;
    height_diff: number;
    length: number;
}

export interface OutputPathApi {
    points_path: NodePathGeoJson;
    line_path: LinePathGeoJson;
    stats_path: PathStatistics;
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


// topo chart

// margin
export interface Margin {
    top: number;
    right: number;
    bottom: number;
    left: number;
}

