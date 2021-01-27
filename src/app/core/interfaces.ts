
// export const apiBaseUrl = 'https://find-my-path.herokuapp.com';
export const apiBaseUrl = "http://192.168.1.16:5000";

export const colorsPalettes: string[] = [
    '#ff7f00',
    '#e31a1c',
    '#6a3d9a',
    '#b15928',
    '#33a02c',
    '#1f78b4'
  ];




// transport modes
export interface TransportMode {
  title: string;
  value: string;
}



// interface PointGeometry {
//   type: string;
//   coordinates: number[];
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
    position: string;
    uuid: string; // to link to the chart and map
    path_name: string;
    height: number;
    distance: number;
  };
  LatLng?: any;
}
export interface NodePathGeoJson {
  type: string;
  features: NodePathFeature[];
}

export interface LinePathGeoJson {
  type: string;
  features: {
    type: string;
    geometry: {
      type: string;
      coordinates: number[];
    };
    properties: {
      path_position: number,
      path_name: string;
      source_node: string,
      target_node: string,
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


export interface Configuration {
  EditingStatus: boolean;
  transportModeStatus: string;
  elevationStatus: boolean;
}


export interface PathFeature {
  id: string;
  name: string;
  color: string;
  configuration: Configuration;
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


export class LogMessage {
  icon!: string;
  details!: string;
  constructor() {}
}

export class PathElement {
  id: string;
  name: string;
  strokeColor: string;
  strokeWidth = '2';
  editingStatus = false;
  transportMode = 'pedestrian';
  elevationStatus = true;
  isPathLoop = false;
  pathLogMessages: LogMessage[] = [];
  private inputNodes: Node[] = [];
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

  setNodes(nodes: Node[]): void {
    this.inputNodes = nodes;
  }
  addNode(geometry: any, properties: any): void {
    const newNodes: Node = {
      type: 'Feature',
      geometry,
      properties
    };
    
    this.rebuildNodes();
    this.inputNodes.push(newNodes);
  }
  getNodes(): Node[] {
    return this.inputNodes;
  }
  buildGeojsonOriginalNodes(): string {
    return JSON.stringify({
      type: 'FeatureCollection',
      features: this.getNodes()
    });
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

  rebuildNodes(): void {
      const nodesToReworked: Node[] = this.getNodes();
      this.inputNodes = [];
      nodesToReworked.forEach((element: Node) => {
          this.addNode(
              createCopy(element.geometry),
              createCopy(element.properties)
          );
      });
  }

  getCopy(): PathElement {
    return (JSON.parse(JSON.stringify(this)));
  }

  isPathComputed(): boolean {
    return this.pointsPath !== undefined;
  }

  getTransportModeIcon(): string {
    if (this.getTransportMode() === 'pedestrian') {
      return '\uf554';
    } else if ( this.getTransportMode() === 'vehicle') {
      return '\uf1b9';
    } else {
      return '\uf128';
    }
  }

}


function createCopy(objectToCopy: any): any {
    // save my life...
    return JSON.parse(JSON.stringify(objectToCopy));
}
