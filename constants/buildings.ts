import { Building } from '../types';

// Tu API Key de GraphHopper
export const API_KEY: string = 'ddff1e90-c186-428f-9f99-d050abc8f6a0';

export const BUILDINGS_DATA: Building[] = [
    {
        name: "Edificio Gerardo Barrios",
        images: ["/buildings/GB.jpg"],
        rooms: [
            { name: "Decanaturas | Instituto del graduado", coordinates: { latitude: 13.4900917, longitude: -88.1935302 } },
            { name: "GB_N2_01", coordinates: { latitude: 13.4900917, longitude: -88.1935302 } },
            { name: "GB_N2_02", coordinates: { latitude: 13.4900917, longitude: -88.1935302 } },
            { name: "GB_N2_03", coordinates: { latitude: 13.4900917, longitude: -88.1935302 } },
            { name: "GB_N2_S1", coordinates: { latitude: 13.4900917, longitude: -88.1935302 } },
            { name: "GB_N2_S2", coordinates: { latitude: 13.4900917, longitude: -88.1935302 } },
            { name: "GB_N3_01", coordinates: { latitude: 13.4900917, longitude: -88.1935302 } },
            { name: "GB_N3_02", coordinates: { latitude: 13.4900917, longitude: -88.1935302 } },
            { name: "GB_N3_03", coordinates: { latitude: 13.4900917, longitude: -88.1935302 } },
            { name: "GB_N3_04", coordinates: { latitude: 13.4900917, longitude: -88.1935302 } }
        ]
    },
    {
        name: "Biblioteca Central",
        images: ["/buildings/biblioteca.jpg"],
        rooms: [
            { name: "Sala de estudio individual", coordinates: { latitude: 13.4884685, longitude: -88.1918152 } },
            { name: "Sala de estudio grupal", coordinates: { latitude: 13.4884685, longitude: -88.1918152 } },
        ]
    },
    {
        name: "Cancha Universitaria Gerardo Barrios",
        rooms: [
            { name: "Cancha UGB", coordinates: { latitude: 13.489155, longitude: -88.194562 } },
        ]
    },
    {
        name: "Baños",
        rooms: [
            { name: "Baño 1", coordinates: { latitude: 13.4884806, longitude: -88.1921623 } },
            { name: "Baño 2", coordinates: { latitude: 13.4887349, longitude: -88.1925301 } },
            { name: "Baño 3", coordinates: { latitude: 13.4884816, longitude: -88.1936915 } },
            { name: "Baño 4", coordinates: { latitude: 13.4899990, longitude: -88.1933120 } },
        ]
    },
    {
        name: "Laboratorios",
        images: ["/buildings/laboratorios.jpg"],
        rooms: [
            { name: "LAB_C1_DR", coordinates: { latitude: 13.48850, longitude: -88.19343 } },
            { name: "LAB_C2_DR", coordinates: { latitude: 13.48850, longitude: -88.19343 } },
            { name: "LAB_C3_DR", coordinates: { latitude: 13.48850, longitude: -88.19343 } },
            { name: "LAB_C4_DR", coordinates: { latitude: 13.48850, longitude: -88.19343 } },
            { name: "LAB_HR_DR", coordinates: { latitude: 13.48850, longitude: -88.19343 } }
        ]
    },
    {
        name: "Edificio Innova",
        images: ["/buildings/innova.jpg"],
        rooms: [
            { name: "INV_N1_LS", coordinates: { latitude: 13.4886243, longitude: -88.1936105 } },
            { name: "INV_N1_LH", coordinates: { latitude: 13.4886243, longitude: -88.1936105 } },
            { name: "INV_N2_SSDC", coordinates: { latitude: 13.4886243, longitude: -88.1936105 } },
            { name: "INV_N2_CDS", coordinates: { latitude: 13.4886243, longitude: -88.1936105 } },
            { name: "INV_N2_LM", coordinates: { latitude: 13.4886243, longitude: -88.1936105 } },
            { name: "INV_N3_CDN", coordinates: { latitude: 13.4886243, longitude: -88.1936105 } },
            { name: "INV_N3_TDA", coordinates: { latitude: 13.4886243, longitude: -88.1936105 } },
            { name: "INV_N3_LSP", coordinates: { latitude: 13.4886243, longitude: -88.1936105 } }
        ]
    },
    {
        name: "Edificio Juan Jose Cañas",
        images: ["/buildings/jcanas.jpg"],
        rooms: [
            { name: "JC_N1_01", coordinates: { latitude: 13.4886574, longitude: -88.1938024 } },
            { name: "JC_N1_L.C.C", coordinates: { latitude: 13.4886574, longitude: -88.1938024 } },
            { name: "JC_N1_LA", coordinates: { latitude: 13.4886574, longitude: -88.1938024 } },
            { name: "JC_N2_LI_1", coordinates: { latitude: 13.4886574, longitude: -88.1938024 } },
            { name: "JC_N2_Magna_01", coordinates: { latitude: 13.4886574, longitude: -88.1938024 } },
            { name: "JC_N2_02", coordinates: { latitude: 13.4886574, longitude: -88.1938024 } },
            { name: "JC_N3_01", coordinates: { latitude: 13.4886574, longitude: -88.1938024 } },
            { name: "JC_N3_02", coordinates: { latitude: 13.4886574, longitude: -88.1938024 } },
            { name: "JC_N3_03", coordinates: { latitude: 13.4886574, longitude: -88.1938024 } },
            { name: "JC_N3_04", coordinates: { latitude: 13.4886574, longitude: -88.1938024 } }
        ]
    },
    {
        name: "Edificio Dr. Hugo Lindo",
        images: ["/buildings/hugolindo.jpg"],
        rooms: [
            { name: "HL_N1_LI_2", coordinates: { latitude: 13.4896262, longitude: -88.1930545 } },
            { name: "HL_N1_LE", coordinates: { latitude: 13.4896262, longitude: -88.1930545 } },
            { name: "HL_N1_01", coordinates: { latitude: 13.4896262, longitude: -88.1930545 } },
            { name: "HL_N1_02", coordinates: { latitude: 13.4896262, longitude: -88.1930545 } },
            { name: "HL_N1_03", coordinates: { latitude: 13.4896262, longitude: -88.1930545 } },
            { name: "HL_N1_04", coordinates: { latitude: 13.4896262, longitude: -88.1930545 } }
        ]
    },
    {
        name: "Edificio de Enfermería",
        images: ["/buildings/molano.jpg"],
        rooms: [
            { name: "MO_N1_01", coordinates: { latitude: 13.4886995, longitude: -88.1940295 } },
            { name: "MO_N1_02", coordinates: { latitude: 13.4886995, longitude: -88.1940295 } },
            { name: "MO_N1_03", coordinates: { latitude: 13.4886995, longitude: -88.1940295 } },
            { name: "MO_N1_LPE", coordinates: { latitude: 13.4886995, longitude: -88.1940295 } },
            { name: "MO_N1_LA", coordinates: { latitude: 13.4886995, longitude: -88.1940295 } },
            { name: "MO_N1_LN", coordinates: { latitude: 13.4886995, longitude: -88.1940295 } },
            { name: "MO_N1_LMI", coordinates: { latitude: 13.4886995, longitude: -88.1940295 } },
            { name: "MO_N1_LCQ", coordinates: { latitude: 13.4886995, longitude: -88.1940295 } }
        ]
    },
    {
        name: "Edificios Independientes",
        rooms: [
            { name: "Admisiones Universidad Gerardo Barrios", coordinates: { latitude: 13.4889261, longitude: -88.1932690 } },
            { name: "Auditorio Universidad Gerardo Barrios", coordinates: { latitude: 13.4885195, longitude: -88.1928500 } },
            { name: "Bienestar Estudiantil Universidad Gerardo Barrios", coordinates: { latitude: 13.4886101, longitude: -88.1933524 } },
            { name: "UGB Store", coordinates: { latitude: 13.4885353, longitude: -88.1920181 } },
            { name: "Academica UGB", coordinates: { latitude: 13.4886763, longitude: -88.1925805 } },
            { name: "Colecturia UGB", coordinates: { latitude: 13.4887610, longitude: -88.1925467 } }
        ]
    },
    {
        name: "Edificio Dr. David Joaquin Guzman",
        images: ["/buildings/jguzman.jpg"],
        rooms: [
            { name: "JG_N1_01", coordinates: { latitude: 13.4885942, longitude: -88.1921424 } },
            { name: "JG_N1_02", coordinates: { latitude: 13.4885942, longitude: -88.1921424 } },
            { name: "JG_N1_03", coordinates: { latitude: 13.4885942, longitude: -88.1921424 } },
            { name: "JG_N1_04", coordinates: { latitude: 13.4885942, longitude: -88.1921424 } },
            { name: "JG_RV_N2_L_RV", coordinates: { latitude: 13.4885942, longitude: -88.1921424 } },
            { name: "JG_N2_01", coordinates: { latitude: 13.4885942, longitude: -88.1921424 } },
            { name: "JG_N2_02", coordinates: { latitude: 13.4885942, longitude: -88.1921424 } },
            { name: "JG_N2_03", coordinates: { latitude: 13.4885942, longitude: -88.1921424 } }
        ]
    },
    {
        name: "Edificio Monseñor Oscar Arnulfo Romero",
        images: ["/buildings/mromero.jpg"],
        rooms: [
            { name: "UGB Store", coordinates: { latitude: 13.488587, longitude: -88.192121 } },
            { name: "MR_N1_3", coordinates: { latitude: 13.488446, longitude: -88.191966 } },
            { name: "Dept de Idiomas", coordinates: { latitude: 13.488446, longitude: -88.191966 } },
            { name: "MR_N1_4", coordinates: { latitude: 13.488446, longitude: -88.191966 } },
            { name: "MR_N1_5", coordinates: { latitude: 13.488446, longitude: -88.191966 } },
            { name: "MR_N1_6", coordinates: { latitude: 13.488446, longitude: -88.191966 } },
            { name: "MR_N2_7", coordinates: { latitude: 13.488446, longitude: -88.191966 } },
            { name: "MR_N2_8", coordinates: { latitude: 13.488446, longitude: -88.191966 } },
            { name: "MR_N2_9", coordinates: { latitude: 13.488446, longitude: -88.191966 } },
            { name: "MR_N2_10", coordinates: { latitude: 13.488446, longitude: -88.191966 } },
            { name: "MR_N2_11", coordinates: { latitude: 13.488446, longitude: -88.191966 } },
            { name: "MR_N2_12", coordinates: { latitude: 13.488446, longitude: -88.191966 } },
            { name: "MR_N3_13", coordinates: { latitude: 13.488446, longitude: -88.191966 } },
            { name: "MR_N3_14", coordinates: { latitude: 13.488446, longitude: -88.191966 } },
            { name: "MR_N3_1", coordinates: { latitude: 13.488446, longitude: -88.191966 } },
        ]
    }
];