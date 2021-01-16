export class colorsPalettes {
  colorsBrewer = [
    '#1f78b4',
    '#33a02c',
    '#e31a1c',
    '#ff7f00',
    '#6a3d9a',
    '#b15928'
  ];

  constructor() {
  }

}



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
}

export interface Node {
    type: string;
    geometry: PointGeometry;
    properties: {
        position: number;
        uuid: number;
        name: string;
    };
}
export interface Nodes extends Array<Node>{}

export interface NodeGeoJson {
    type: string;
    features: Nodes;
}

// PATH API
export interface NodePathFeature {
    type: string;
    geometry: PointGeometry;
    properties: {
      height: number;
      distance: number;
      step: string; // TODO seems useless, check API
      uuid: string; // to link to the chart and map
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


export interface configuration {
    EditingStatus: boolean;
    transportModeStatus: string;
    elevationStatus: boolean;
}


export interface PathFeature {
    id: string;
    name: string;
    color: string;
    configuration: configuration;
    inputNodes: NodeGeoJson;
    points_path?: NodePathGeoJson;
    line_path?: LinePathGeoJson;
    stats_path?: PathStatistics;

}
export interface PathContainer extends Array<PathFeature>{}

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


export interface Node {
    type: string;
    geometry: PointGeometry;
    properties: {
        position: number;
        uuid: number;
        name: string;
    };
}

export class NodeFeature {
    private type = 'feature';
    geometry: PointGeometry;
    properties: any;

    constructor(
        geometry: PointGeometry,
        properties: any
    ) {
        this.type = this.type;
        this.geometry = geometry;
        this.properties = properties;
    }

}

export class PathElement {
    id: string;
    name: string;
    strokeColor: string;
    strokeWidth = '2';
    editingStatus = false;
    transportMode = 'pedestrian';
    elevationStatus = true;
    private inputNodes: NodeFeature[] = [];
    private pointsPath!: NodePathGeoJson;
    private linePath!: LinePathGeoJson;
    statsPath!: PathStatistics;

    constructor(
        id: string,
        name: string,
        strokeColor: string,
    ) {
        this.id = id;
        this.name = name;
        this.strokeColor = strokeColor;
    }

    setColor(value: string): void {
        this.strokeColor = value;
    }
    getColor(): string {
        return this.strokeColor;
    }
    setWidth(value: number): void {
      this.strokeWidth = '' + value;
    }
    getWidth(): string {
        return this.strokeWidth;
    }

    setEdit(value: boolean): void {
        this.editingStatus = value;
    }
    getEdit(): boolean {
        return this.editingStatus;
    }

    setTransportMode(value: string): void {
        this.transportMode = value;
    }
    getTransportMode(): string {
        return this.transportMode;
    }

    setElevation(value: boolean): void {
        this.elevationStatus = true;
    }
    getElevation(): boolean {
        return this.elevationStatus;
    }

    setNodes(nodes: NodeFeature[]): void {
        this.inputNodes = nodes;
    }
    addNode(geometry: PointGeometry, properties: any): void {
        const newNodes = new NodeFeature(
            geometry,
            properties
      )
    this.rebuildNodes();
        this.inputNodes.push(newNodes);
    }
    getNodes(): NodeFeature[] {
        return this.inputNodes;
    }

    setPointsPath(nodesPath: NodePathGeoJson): void {
        this.pointsPath = nodesPath;
    }
    getPointsPath(): NodePathGeoJson {
        return this.pointsPath;
    }

    setLinePath(linePath: LinePathGeoJson): void {
        this.linePath = linePath;
    }
    getLinePath(): LinePathGeoJson {
        return this.linePath;
    }

    setStatsPath(statsPath: PathStatistics): void {
        this.statsPath = statsPath;
    }
    getStatsPath(): PathStatistics {
        return this.statsPath;
    }

    // deprecated, only used to debug the duplication action
    updatePath(pathId: string): void {
        this.getNodes().forEach((element: NodeFeature) => {
            element.properties.path = pathId
        });
    }
    rebuildNodes(): void {
        const nodesToReworked: NodeFeature[] = this.getNodes();
        this.inputNodes = []
        nodesToReworked.forEach((element: NodeFeature) => {
            this.addNode(
                createCopy(element.geometry),
                createCopy(element.properties)
            )
        });
    }

    getCopy(): PathElement{
        return (JSON.parse(JSON.stringify(this)));
    }

}


function createCopy(objectToCopy: any): any {
    // save my life...
    return JSON.parse(JSON.stringify(objectToCopy));
}
