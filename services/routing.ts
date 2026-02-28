import { API_KEY } from '../constants/buildings';
import { Coordinate, RouteResult } from '../types';

export const fetchRoute = async (
    origin: Coordinate, 
    destination: Coordinate
): Promise<RouteResult | null> => {
    const url = `https://graphhopper.com/api/1/route?point=${origin.latitude},${origin.longitude}&point=${destination.latitude},${destination.longitude}&vehicle=foot&locale=es&key=${API_KEY}&points_encoded=false`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.paths && data.paths.length > 0) {
            const path = data.paths[0];
            const coordinates: Coordinate[] = path.points.coordinates.map((coord: any[]) => ({
                latitude: coord[1],
                longitude: coord[0]
            }));

            return {
                coordinates,
                instructions: path.instructions,
                distance: path.distance,
                time: path.time
            };
        }
        return null;
    } catch (error) {
        console.error("Error fetching route:", error);
        return {
            coordinates: [origin, destination],
            instructions: [{ distance: 0, text: "Camina directo hacia el destino (Sin conexión)", time: 0, interval: [0, 1] }],
            distance: 0,
            time: 0
        };
    }
};