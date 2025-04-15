/*
An object containing data related to Field Unique Value renderers for specific
layers and fields.

Author: Chapman Munn
Author: Itai Intrater
Date: 3/14/2023
*/

export const fieldUniqueValueInfos = {

    safetyPoint : {
        level_of_safety_service_kabc : [
            {
                value : 'LOSS IV',
                symbol : {
                    size: 4,
                    color : '#d7191c',
                    style: 'circle',
                    outline: null
                }
            },
            {
                value : 'LOSS III',
                symbol : {
                    size: 4,
                    color : '#fdae61',
                    style: 'circle',
                    outline: null
                }
            },
            {
                value : 'LOSS II',
                symbol : {
                    size: 4,
                    color : '#abdda4',
                    style: 'circle',
                    outline: null
                }
            },
            {
                value : 'LOSS I',
                symbol : {
                    size: 4,
                    color : '#2b83ba',
                    style: 'circle',
                    outline: null
                }
            }
        ]
    },

    safetyPolyline : {
        level_of_safety_service_kabc : [
            {
                value : 'LOSS IV',
                symbol : {
                    width: "2px",
                    color : '#d7191c'
                }
            },
            {
                value : 'LOSS III',
                symbol : {
                    width: "2px",
                    color : '#fdae61'
                }
            },
            {
                value : 'LOSS II',
                symbol : {
                    width: "2px",
                    color : '#abdda4'
                }
            },
            {
                value : 'LOSS I',
                symbol : {
                    width: "2px",
                    color : '#2b83ba'
                }
            }
        ]
    },

    bridgeConditionPoint: {

        deck_geometry_eval_068: [
            {
                value: '9',
                symbol: {
                    color: '#0051f2',
                    size: 5,
                    style: 'circle',
                    outline: null
                }
            }, 
            {
                value: '8',
                symbol: {
                    color: '#377cf6',
                    size: 5,
                    style: 'circle',
                    outline: null
                }
            }, 
            {
                value: '7',
                symbol: {
                    color: '#6da7fb',
                    size: 5,
                    style: 'circle',
                    outline: null
                }
            }, 
            {
                value: '6',
                symbol: {
                    color: '#a4d2ff',
                    size: 5,
                    style: 'circle',
                    outline: null
                }
            }, 
            {
                value: '5',
                symbol: {
                    color: '#daffa5',
                    size: 5,
                    style: 'circle',
                    outline: null
                }
            }, 
            {
                value: '4',
                symbol: {
                    color: '#ffd173',
                    size: 5,
                    style: 'circle',
                    outline: null
                }
            }, 
            {
                value: '3',
                symbol: {
                    color: '#ecb356',
                    size: 5,
                    style: 'circle',
                    outline: null
                }
            }, 
            {
                value: '2',
                symbol: {
                    color: '#c6781d',
                    size: 5,
                    style: 'circle',
                    outline: null
                }
            }, 
            {
                value: '1',
                symbol: {
                    color: '#b35a00',
                    size: 5,
                    style: 'circle',
                    outline: null
                }
            }, 
            {
                value: '0',
                symbol: {
                    color: '#b35a00',
                    size: 5,
                    style: 'circle',
                    outline: null
                }
            }, 
            {
                value: 'N',
                symbol: {
                    color: 'rgba(0,0,0,0.25)',
                    size: 5,
                    style: 'circle',
                    outline: null
                }
            }
        ],

        type: [
            {
                value: 'Bridge',
                symbol: {
                    style: 'square',
                    color: '#7fc97f',
                    size: 5
                }
            },
            {
                value: 'Culvert',
                symbol: {
                    style: 'circle',
                    color: '#beaed4',
                    outline: '#000000',
                    size: 5
                }
            }
        ]

    },

    pavementConditionPolyline : {

        source : [
            {
                value : 'Arizona DOT (2021)',
                symbol : {
                color : '#502059'
                }
            },
            {
                value : 'MAG ABNA (2019)',
                symbol : {
                color : '#892450'
                }
            },
            {
                value : 'Pima County',
                symbol : {
                color : '#f7b316'
                }
            },
            {
                value : 'City of Tucson',
                symbol : {
                color : '#31384f'
                }
            },
            {
                value : 'Sun Corridor MPO (2019)',
                symbol : {
                color : '#4275ae'
                }
            },
            {
                value : 'SEAGO (2022)',
                symbol : {
                color : '#e48f3c'
                }
            }
        ]
    },

    transitRidershipPolyline : {

        operator : [
            {
                value : 'Valley Metro',
                symbol : {
                    width: 2,
                    color : '#f7b316'
                }
            },
            {
                value : 'Phoenix',
                symbol : {
                    width: 2,
                    color : '#892450'
                }
            },
            {
                value : 'Sun Tran',
                symbol : {
                    width: 2,
                    color: '#502059'
                }
            },
            {
                value : 'City of Douglas',
                symbol : {
                    width: 2,
                    color : '#31384f'
                }
            },
            {
                value : 'City of Sierra Vista',
                symbol : {
                    width: 2,
                    color : '#4275ae'
                }
            },
            {
                value : 'Scottsdale',
                symbol : {
                    width: 2,
                    color : '#d53e4f'
                }
            },
            {
                value : 'City of Coolidge Transit Department',
                symbol : {
                    width: 2,
                    color : '#e4331f'
                }
            },
            {
                value : 'Benson Area Transit (BAT)',
                symbol : {
                    width: 2,
                    color : '#99d594'
                }
            },
            {
                value : 'Central Arizona Regional Transit',
                symbol : {
                    width: 2,
                    color : 'green'
                }
            },
            {
                value : 'City of Bisbee',
                symbol : {
                    width: 2,
                    color: '#218794'
                }
            }
        ]

    },

    freightRoutes : {

        network : [
            {
                value : 'Critical Rural Freight Corridors',
                symbol : {
                    color : '#99004d'
                }
            },
            {
                value : 'Critical Urban Freight Corridors',
                symbol : {
                    color : '#e6772e'
                }
            },
            {
                value : 'Non-Primary Highway Freight System',
                symbol : {
                    color : '#ffbfc9'
                }
            },
            {
                value : 'Primary Highway Freight System',
                symbol : {
                    color : '#1a305d'
                }
            }
        ]
    },

    j40Polygon : {

        CC : [
            {
                value : '8',
                symbol : {
                    color : '#264964'
                }
            },
            {
                value : '7',
                symbol : {
                    color : '#236081'
                }
            },
            {
                value : '6',
                symbol : {
                    color : '#3b7695'
                }
            },
            {
                value : '5',
                symbol : {
                    color : '#528ca9'
                }
            },
            {
                value : '4',
                symbol : {
                    color : '#68a2be'
                }
            },
            {
                value : '3',
                symbol : {
                    color : '#7fb9d3'
                }
            },
            {
                value : '2',
                symbol : {
                    color : '#96d1e9'
                }
            },
            {
                value : '1',
                symbol : {
                    color : '#aee9ff'
                }
            },
            {
                value : '0',
                symbol : {
                    style : 'none'
                }
            }
        ]
    },

    bikewaysPolyline : {

        TYPE : [
            {
                value : 'Multi-Use Path - Paved',
                symbol : {
                    color : '#f79664'
                }
            },
            {
                value : 'Bike Lane',
                symbol : {
                    color : '#0daab1'
                }
            },
            {
                value : 'Recreational Trail',
                symbol : {
                    color : '#9bbb59'
                }
            },
            {
                value : 'Bike Route',
                symbol : {
                    color : '#9ed8d9'
                }
            },
            {
                value : 'Multi-Use Path - Unspecified Surface',
                symbol : {
                    color : '#fc921f'
                }
            },
            {
                value : 'Multi-Use Path - Unpaved',
                symbol : {
                    color : '#fc921f'
                }
            },
            {
                value : 'Paved Shoulder',
                symbol : {
                    color : '#9e6040'
                }
            },
            {
                value : 'Bike Boulevard',
                symbol : {
                    color : '#b7814a'
                }
            }
        ]
    },

    lrtpPoint : {

        Type : [
            {
                value : 'Corridor Improvements',
                symbol : {
                    color : '#024e76'
                }
            },
            {
                value : 'Multimodal',
                symbol : {
                    color : '#ea311f'
                }
            },
            {
                value : 'Freeway',
                symbol : {
                    color : '#00734c'
                }
            },
            {
                value : 'Transit',
                symbol : {
                    color : '#704489'
                }
            },
            {
                value : 'Preservation',
                symbol : {
                    color : '#f09100'
                }
            },
            {
                value : 'Bridge',
                symbol : {
                    color : '#607100'
                }
            },
            {
                value : 'Intersection Improvements',
                symbol : {
                    color : '#7570b3'
                }
            },
            {
                value : 'Local Project Funding',
                symbol : {
                    color : '#c6004b'
                }
            },
            {
                value : 'Aviation',
                symbol : {
                    color : '#666666'
                }
            }
        ]
    },

    lrtpPolyline : {

        Type : [
            {
                value : 'Corridor Improvements',
                symbol : {
                    color : '#024e76'
                }
            },
            {

                value : 'Multimodal',
                symbol : {
                    color : '#ea311f'
                }
            },
            {
                value : 'Freeway',
                symbol : {
                    color : '#00734c'
                }
            },
            {
                value : 'New Roadway',
                symbol : {
                    color : '#000000'
                }
            },
            {
                value : 'Transit',
                symbol : {
                    color : '#704489'
                }
            },
            {
                value : 'Roadway Preservation',
                symbol : {
                    color : '#f09100'
                }
            },
            {
                value : 'Safety',
                symbol : {
                    color : '#7570b3'
                }
            },
            {
                value : 'Bridge',
                symbol : {
                    color : '#607100'
                }
            },
            {
                value : 'ROW Preservation',
                symbol : {
                    color : '#c6004b'
                }
            },
            {
                value : 'Aviation',
                symbol : {
                    color : '#666666'
                }
            }
        ]
    },

    ms2Point : {

        Agency : [
            {
                value : 'ADOT',
                symbol : {
                    color : '#cc9bc3'
                }
            },
            {
                value : 'CAG',
                symbol : {
                    color : '#92c991'
                }
            },
            {
                value : 'MAG',
                symbol : {
                    color : '#93bac4'
                }
            },
            {
                value : 'PAG',
                symbol : {
                    color : '#cfb4a3'
                }
            },
            {
                value : 'SCMPO',
                symbol : {
                    color : '#cfb4a3'
                }
            },
            {
                value : 'SVMPO',
                symbol : {
                    color : '#bed2ff'
                }
            }
        ]
    },

    broadbandPolygon : {

        // Best, Good, Basic, Limited
        // #0571b0, #92c5de, #f4a582, #ca0020

        category_mobile : [
            {
                value : 'Best',
                symbol : {
                    color : '#0571b0',
                    outline: null
                }
            },
            {
                value : 'Good',
                symbol : {
                    color : '#92c5de',
                    outline: null
                }
            },
            {
                value : 'Basic',
                symbol : {
                    color : '#f4a582',
                    outline: null
                }
            },
            {
                value : 'Limited',
                symbol : {
                    color : '#ca0020',
                    outline: null
                }
            },
            {
                value : 'No records',
                symbol : {
                    color : "rgba(102, 102, 102, 0.75)",
                    outline: null
                }
            }
        ], 

        category_fixed : [
            {
                value : 'Best',
                symbol : {
                    color : '#0571b0',
                    outline: null
                }
            },
            {
                value : 'Good',
                symbol : {
                    color : '#92c5de',
                    outline: null
                }
            },
            {
                value : 'Basic',
                symbol : {
                    color : '#f4a582',
                    outline: null
                }
            },
            {
                value : 'Limited',
                symbol : {
                    color : '#ca0020',
                    outline: null
                }
            },
            {
                value : 'No records',
                symbol : {
                    color : "rgba(22, 22, 22, 0.50)",
                    outline: null
                }
            }
        ]

    }

}
