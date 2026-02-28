export interface Coordinate {
    latitude: number;
    longitude: number;
}

export interface Room {
    name: string;
    coordinates: Coordinate;
}

export interface Building {
    name: string;
    images?: string[]; // En web usaremos strings (rutas de la carpeta public)
    rooms: Room[];
}

export interface LocationSelection {
    name: string;
    coordinates: Coordinate | null;
    isCurrentLocation: boolean;
}

export interface RouteInstruction {
    distance: number;
    text: string;
    time: number;
    interval: number[];
}

export interface RouteResult {
    coordinates: Coordinate[];
    instructions: RouteInstruction[];
    distance: number;
    time: number;
}