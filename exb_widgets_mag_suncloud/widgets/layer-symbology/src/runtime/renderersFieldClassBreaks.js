/*
An object containing data related to Field Class Break renderers for specific
layers and fields.

Size for points defaults to 4 but can be overridden

Author: Chapman Munn
Author: Itai Intrater
Date: 3/14/2023

*/

export const fieldClassBreakInfos = {

    sunCloudPerformanceScores: {
        // Esri color ramps - Mentone Beach
        // #48385f,#995375,#db4a5b,#fc9a59,#fee086
        // Dark to Yellow
        // const colors = ["#48385f", "#995375", "#db4a5b", "#fc9a59", "#fee086"];
        composite_score: [
            {
                minValue: 0.0,
                maxValue: 10.,
                symbol: {
                    color: "#48385f"
                },
                label: "0 - 10"
            },
            {
                minValue: 10.,
                maxValue: 20.,
                symbol: {
                    color: "#995375"
                },
                label: "10 - 20"
            },
            {
                minValue: 20.,
                maxValue: 30.,
                symbol:  {
                    color: "#db4a5b"
                },
                label: "20 - 30"
            },
            {
                minValue: 30.,
                maxValue: 40.,
                symbol: {
                    color: "#fc9a59"
                },
                label: "30 - 40"
            },
            {
                minValue: 40.,
                maxValue: 100.,
                symbol: {
                    color: "#fee086"
                },
                label: "40+"
            }
        ],

        composite_score_assets: [
            {
                minValue: 0.0,
                maxValue: 10.,
                symbol: {
                    color: "#48385f"
                },
                label: "0 - 10"
            },
            {
                minValue: 10.,
                maxValue: 20.,
                symbol: {
                    color: "#995375"
                },
                label: "10 - 20"
            },
            {
                minValue: 20.,
                maxValue: 30.,
                symbol:  {
                    color: "#db4a5b"
                },
                label: "20 - 30"
            },
            {
                minValue: 30.,
                maxValue: 45.,
                symbol: {
                    color: "#fc9a59"
                },
                label: "30 - 45"
            },
            {
                minValue: 45.,
                maxValue: 100.,
                symbol: {
                    color: "#fee086"
                },
                label: "45+"
            }
        ],
        
        composite_score_mobility: [
            {
                minValue: 0.0,
                maxValue: 20.,
                symbol: {
                    color: "#48385f"
                },
                label: "0 - 20"
            },
            {
                minValue: 20.,
                maxValue: 35.,
                symbol: {
                    color: "#995375"
                },
                label: "20 - 35"
            },
            {
                minValue: 35.,
                maxValue: 50.,
                symbol:  {
                    color: "#db4a5b"
                },
                label: "35 - 50"
            },
            {
                minValue: 50.,
                maxValue: 65.,
                symbol: {
                    color: "#fc9a59"
                },
                label: "50 - 65"
            },
            {
                minValue: 65.,
                maxValue: 100.,
                symbol: {
                    color: "#fee086"
                },
                label: "65+"
            }
        ],

        composite_score_economy: [
            {
                minValue: 0.0,
                maxValue: 15.,
                symbol: {
                    color: "#48385f"
                },
                label: "0 - 15"
            },
            {
                minValue: 15.,
                maxValue: 25.,
                symbol: {
                    color: "#995375"
                },
                label: "15 - 30"
            },
            {
                minValue: 25.,
                maxValue: 35.,
                symbol:  {
                    color: "#db4a5b"
                },
                label: "30 - 40"
            },
            {
                minValue: 35.,
                maxValue: 45.,
                symbol: {
                    color: "#fc9a59"
                },
                label: "40 - 50"
            },
            {
                minValue: 45.,
                maxValue: 100.,
                symbol: {
                    color: "#fee086"
                },
                label: "50+"
            }
        ],

        composite_score_safety: [
            {
                minValue: 0.0,
                maxValue: 20.,
                symbol: {
                    color: "#48385f"
                },
                label: "0 - 15"
            },
            {
                minValue: 20.,
                maxValue: 30.,
                symbol: {
                    color: "#995375"
                },
                label: "15 - 25"
            },
            {
                minValue: 30.,
                maxValue: 40.,
                symbol:  {
                    color: "#db4a5b"
                },
                label: "25 - 35"
            },
            {
                minValue: 40.,
                maxValue: 50.,
                symbol: {
                    color: "#fc9a59"
                },
                label: "35 - 45"
            },
            {
                minValue: 50.,
                maxValue: 100.,
                symbol: {
                    color: "#fee086"
                },
                label: "45+"
            }
        ],

        composite_score_unweighted: [
            {
                minValue: 0.0,
                maxValue: 17.,
                symbol: {
                    color: "#48385f"
                },
                label: "0 - 15"
            },
            {
                minValue: 17.,
                maxValue: 24.,
                symbol: {
                    color: "#995375"
                },
                label: "15 - 25"
            },
            {
                minValue: 24.,
                maxValue: 31.,
                symbol:  {
                    color: "#db4a5b"
                },
                label: "20 - 25"
            },
            {
                minValue: 31.,
                maxValue: 38.,
                symbol: {
                    color: "#fc9a59"
                },
                label: "25 - 35"
            },
            {
                minValue: 38.,
                maxValue: 100.,
                symbol: {
                    color: "#fee086"
                },
                label: "35+"
            }
        ],

        // 15 Performance Measures
        // Serious Injury Rate 
        injury_rate: [
            {
                minValue: 0.0,
                maxValue: 300,
                symbol: {
                    color: "#48385f"
                },
                label: "0 - 300"
            },
            {
                minValue: 300,
                maxValue: 500,
                symbol: {
                    color: "#995375"
                },
                label: "300 - 500"
            },
            {
                minValue: 500,
                maxValue: 800,
                symbol:  {
                    color: "#db4a5b"
                },
                label: "500 - 800"
            },
            {
                minValue: 800,
                maxValue: 1000,
                symbol: {
                    color: "#fc9a59"
                },
                label: "800 - 1000"
            },
            {
                minValue: 1000,
                maxValue: 10000,
                symbol: {
                    color: "#fee086"
                },
                label: "1000+"
            }
        ],

        // Bicyclist and Pedestrian Severe Injuries 
        non_motorized_injuries: [
            {
                minValue: 0.0,
                maxValue: 6,
                symbol: {
                    color: "#48385f"
                },
                label: "0 - 6"
            },
            {
                minValue: 6,
                maxValue: 12,
                symbol: {
                    color: "#995375"
                },
                label: "6 - 12"
            },
            {
                minValue: 12,
                maxValue: 20,
                symbol:  {
                    color: "#db4a5b"
                },
                label: "12 - 20"
            },
            {
                minValue: 20,
                maxValue: 25,
                symbol: {
                    color: "#fc9a59"
                },
                label: "20 - 25"
            },
            {
                minValue: 25,
                maxValue: 100,
                symbol: {
                    color: "#fee086"
                },
                label: "25+"
            }
        ],

        // Excess Expected Severe Crashes 
        excess_expected_crashes: [
            {
                minValue: -1000,
                maxValue: -200,
                symbol: {
                    color: "#48385f"
                },
                label: "-200"
            },
            {
                minValue: -200,
                maxValue: 0,
                symbol: {
                    color: "#995375"
                },
                label: "-200 - 0"
            },
            {
                minValue: 0,
                maxValue: 50,
                symbol:  {
                    color: "#db4a5b"
                },
                label: "0 - 50"
            },
            {
                minValue: 50,
                maxValue: 150,
                symbol: {
                    color: "#fc9a59"
                },
                label: "800 - 1000"
            },
            {
                minValue: 150,
                maxValue: 10000,
                symbol: {
                    color: "#fee086"
                },
                label: "150+"
            }
        ],

        // Pavement Percent Poor Condition
        pavement_pct_poor: [
            {
                minValue: 0.0,
                maxValue: 20,
                symbol: {
                    color: "#48385f"
                },
                label: "0 - 20"
            },
            {
                minValue: 20,
                maxValue: 50,
                symbol: {
                    color: "#995375"
                },
                label: "20 - 50"
            },
            {
                minValue: 50,
                maxValue: 70,
                symbol:  {
                    color: "#db4a5b"
                },
                label: "50 - 70"
            },
            {
                minValue: 70,
                maxValue: 100,
                symbol: {
                    color: "#fc9a59"
                },
                label: "70 - 100"
            },
            {
                minValue: 100,
                maxValue: 1000,
                symbol: {
                    color: "#fee086"
                },
                label: "100+"
            }
        ],

        // Bridge Structural Evaluation Rating 
        bridge_structural_rating: [
            {
                minValue: 0.0,
                maxValue: 2,
                symbol: {
                    color: "#48385f"
                },
                label: "0 - 2"
            },
            {
                minValue: 2,
                maxValue: 4,
                symbol: {
                    color: "#995375"
                },
                label: "2 - 4"
            },
            {
                minValue: 4,
                maxValue: 6,
                symbol:  {
                    color: "#db4a5b"
                },
                label: "4 - 6"
            },
            {
                minValue: 6,
                maxValue: 8,
                symbol: {
                    color: "#fc9a59"
                },
                label: "6 - 8"
            },
            {
                minValue: 8,
                maxValue: 20,
                symbol: {
                    color: "#fee086"
                },
                label: "8+"
            }
        ],

        // Bridge Deck Geometry 
        bridge_deck_geometry: [
            {
                minValue: 0.0,
                maxValue: 2,
                symbol: {
                    color: "#48385f"
                },
                label: "0 - 2"
            },
            {
                minValue: 2,
                maxValue: 4,
                symbol: {
                    color: "#995375"
                },
                label: "2 - 4"
            },
            {
                minValue: 4,
                maxValue: 6,
                symbol:  {
                    color: "#db4a5b"
                },
                label: "4 - 6"
            },
            {
                minValue: 6,
                maxValue: 8,
                symbol: {
                    color: "#fc9a59"
                },
                label: "6 - 8"
            },
            {
                minValue: 8,
                maxValue: 20,
                symbol: {
                    color: "#fee086"
                },
                label: "8+"
            }
        ],

        // Level of Travel Time Reliability 
        lottr: [
            {
                minValue: 0.0,
                maxValue: 1,
                symbol: {
                    color: "#48385f"
                },
                label: "0 - 1"
            },
            {
                minValue: 1,
                maxValue: 2,
                symbol: {
                    color: "#995375"
                },
                label: "1 - 2"
            },
            {
                minValue: 2,
                maxValue: 3.5,
                symbol:  {
                    color: "#db4a5b"
                },
                label: "2 - 3.5"
            },
            {
                minValue: 3.5,
                maxValue: 5,
                symbol: {
                    color: "#fc9a59"
                },
                label: "3.5 - 5"
            },
            {
                minValue: 5,
                maxValue: 10,
                symbol: {
                    color: "#fee086"
                },
                label: "5+"
            }
        ],

        // Daily Delay 
        avg_delay: [
            {
                minValue: 0.0,
                maxValue: 30,
                symbol: {
                    color: "#48385f"
                },
                label: "0 - 30"
            },
            {
                minValue: 30,
                maxValue: 60,
                symbol: {
                    color: "#995375"
                },
                label: "30 - 60"
            },
            {
                minValue: 60,
                maxValue: 90,
                symbol:  {
                    color: "#db4a5b"
                },
                label: "60 - 90"
            },
            {
                minValue: 90,
                maxValue: 120,
                symbol: {
                    color: "#fc9a59"
                },
                label: "90 - 120"
            },
            {
                minValue: 120,
                maxValue: 1000,
                symbol: {
                    color: "#fee086"
                },
                label: "120+"
            }
        ],

        // Volume / Capacity Ratio 
        vc_ratio: [
            {
                minValue: 0.0,
                maxValue: 0.6,
                symbol: {
                    color: "#48385f"
                },
                label: "0 - 0.6"
            },
            {
                minValue: 0.6,
                maxValue: 1.2,
                symbol: {
                    color: "#995375"
                },
                label: "0.6 - 1.2"
            },
            {
                minValue: 1.2,
                maxValue: 1.8,
                symbol:  {
                    color: "#db4a5b"
                },
                label: "1.2 - 1.8"
            },
            {
                minValue: 1.8,
                maxValue: 2.35,
                symbol: {
                    color: "#fc9a59"
                },
                label: "800 - 1000"
            },
            {
                minValue: 2.35,
                maxValue: 10,
                symbol: {
                    color: "#fee086"
                },
                label: "2.35+"
            }
        ],

        // Vehicle Miles Traveled Change 2050 
        vmt_change: [
            {
                minValue: -75000,
                maxValue: 0,
                symbol: {
                    color: "#48385f"
                },
                label: "-75,000 - 0"
            },
            {
                minValue: 0,
                maxValue: 100000,
                symbol: {
                    color: "#995375"
                },
                label: "0 - 100,000"
            },
            {
                minValue: 100000,
                maxValue: 200000,
                symbol:  {
                    color: "#db4a5b"
                },
                label: "100,000 - 200,000"
            },
            {
                minValue: 200000,
                maxValue: 277695,
                symbol: {
                    color: "#fc9a59"
                },
                label: "200,000 - 277,695"
            },
            {
                minValue: 277695,
                maxValue: 999999,
                symbol: {
                    color: "#fee086"
                },
                label: "277,695+"
            }
        ],

        // Overlap with Transit Route 
        transit_overlap: [
            {
                minValue: 0.0,
                maxValue: 0.2,
                symbol: {
                    color: "#48385f"
                },
                label: "0 - 0.2"
            },
            {
                minValue: 0.2,
                maxValue: 0.5,
                symbol: {
                    color: "#995375"
                },
                label: "0.2 - 0.5"
            },
            {
                minValue: 0.5,
                maxValue: 0.7,
                symbol:  {
                    color: "#db4a5b"
                },
                label: "0.5 - 0.7"
            },
            {
                minValue: 0.7,
                maxValue: 1,
                symbol: {
                    color: "#fc9a59"
                },
                label: "0.7 - 1"
            },
            {
                minValue: 1,
                maxValue: 10,
                symbol: {
                    color: "#fee086"
                },
                label: "1+"
            }
        ],

        // Transit Ridership 
        transit_ridership: [ // reversed the color order
        // const colors = ["#48385f", "#995375", "#db4a5b", "#fc9a59", "#fee086"];
            { // zero ridership
                minValue: 0.0,
                maxValue: 1,
                symbol: {
                    color: "rgba(120,120,120,0.4)"
                },
                label: "No Service"
            },
            { 
                minValue: 1,
                maxValue: 100,
                symbol: {
                    color: "#fee086"
                },
                label: "0 - 100"
            },
            {
                minValue: 100,
                maxValue: 500,
                symbol: {
                    color: "#fc9a59"
                },
                label: "100 - 500"
            },
            {
                minValue: 500,
                maxValue: 1500,
                symbol:  {
                    color: "#db4a5b"
                },
                label: "500 - 1500"
            },
            {
                minValue: 1500,
                maxValue: 5000,
                symbol: {
                    color: "#995375"
                },
                label: "1500 - 5000"
            },
            {
                minValue: 5000,
                maxValue: 50000,
                symbol: {
                    color: "#48385f"
                },
                label: "5000+"
            }
        ],

        // Employment Forecasted Change 
        employment_change: [ // reversed the color order
        // const colors = ["#48385f", "#995375", "#db4a5b", "#fc9a59", "#fee086"];
            {
                minValue: -850,
                maxValue: 0,
                symbol: {
                    color: "#fee086"
                },
                label: "-850 - 0"
            },
            {
                minValue: 0,
                maxValue: 5000,
                symbol: {
                    color: "#fc9a59"
                },
                label: "0 - 5,000"
            },
            {
                minValue: 5000,
                maxValue: 20000,
                symbol:  {
                    color: "#db4a5b"
                },
                label: "5,000 - 20,000"
            },
            {
                minValue: 20000,
                maxValue: 30000,
                symbol: {
                    color: "#995375"
                },
                label: "20,000 - 30,000"
            },
            {
                minValue: 30000,
                maxValue: 50000,
                symbol: {
                    color: "#48385f"
                },
                label: "30,000+"
            }
        ],

        // Overlap with Critical Freight Route 
        critical_freight: [
            {
                minValue: 0.0,
                maxValue: 0.2,
                symbol: {
                    color: "#48385f"
                },
                label: "0 - 0.2"
            },
            {
                minValue: 0.2,
                maxValue: 0.5,
                symbol: {
                    color: "#995375"
                },
                label: "0.2 - 0.5"
            },
            {
                minValue: 0.5,
                maxValue: 0.7,
                symbol:  {
                    color: "#db4a5b"
                },
                label: "0.5 - 0.7"
            },
            {
                minValue: 0.7,
                maxValue: 1,
                symbol: {
                    color: "#fc9a59"
                },
                label: "0.7 - 1"
            },
            {
                minValue: 1,
                maxValue: 5,
                symbol: {
                    color: "#fee086"
                },
                label: "1+"
            }
        ],

        // Households without Broadband 
        households_no_broadband: [
            {
                minValue: 0.0,
                maxValue: 100,
                symbol: {
                    color: "#48385f"
                },
                label: "0 - 100"
            },
            {
                minValue: 100,
                maxValue: 250,
                symbol: {
                    color: "#995375"
                },
                label: "100 - 250"
            },
            {
                minValue: 250,
                maxValue: 350,
                symbol:  {
                    color: "#db4a5b"
                },
                label: "250 - 350"
            },
            {
                minValue: 350,
                maxValue: 450,
                symbol: {
                    color: "#fc9a59"
                },
                label: "350 - 450"
            },
            {
                minValue: 450,
                maxValue: 1000,
                symbol: {
                    color: "#fee086"
                },
                label: "450+"
            }
        ]
    },

    safetyPoint : {
        // Dark to Yellow
        // const colors = ["#48385f", "#995375", "#db4a5b", "#fc9a59", "#fee086"];

        // injury_crashes : [
        //     {
        //         minValue: 0,
        //         maxValue: 20,
        //         symbol: {
        //             color : '#48385f',
        //             style: 'circle',
        //             outline: null
        //         },
        //         label: "0 - 20"
        //     },
        //     {
        //         minValue: 20,
        //         maxValue: 40,
        //         symbol: {
        //             color : '#995375',
        //             style: 'circle',
        //             outline: null
        //         },
        //         label: "20 - 40"
        //     },
        //     {
        //         minValue: 40,
        //         maxValue: 60,
        //         symbol: {
        //             color : '#fc9a59',
        //             style: 'circle',
        //             outline: null
        //         },
        //         label: "40 - 60"
        //     },
        //     {
        //         minValue: 60,
        //         maxValue: 1000,
        //         symbol: {
        //             color : '#fee086',
        //             style: 'circle',
        //             outline: null
        //         },
        //         label: "> 60"
        //     }
        // ],
        // injury_rate : [
        //     {
        //         minValue: 0,
        //         maxValue: 1,
        //         symbol: {
        //             color : '#48385f',
        //             style: 'circle',
        //             outline: null
        //         },
        //         label: "0 - 4"
        //     },
        //     {
        //         minValue: 1,
        //         maxValue: 2,
        //         symbol: {
        //             color : '#995375',
        //             style: 'circle',
        //             outline: null
        //         },
        //         label: "4 - 8"
        //     },
        //     {
        //         minValue: 2,
        //         maxValue: 3,
        //         symbol: {
        //             color : '#fc9a59',
        //             style: 'circle',
        //             outline: null
        //         },
        //         label: "8 - 11"
        //     },
        //     {
        //         minValue: 3,
        //         maxValue: 100,
        //         symbol: {
        //             color : '#fee086',
        //             style: 'circle',
        //             outline: null
        //         },
        //         label: "> 11"
        //     }
        // ],
        fatal_injury_crashes : [
            {
                minValue: 0,
                maxValue: 20,
                symbol: {
                    color : '#48385f',
                    style: 'circle',
                    outline: null
                },
                label: "0 - 20"
            },
            {
                minValue: 20,
                maxValue: 40,
                symbol: {
                    color : '#995375',
                    style: 'circle',
                    outline: null
                },
                label: "20 - 40"
            },
            {
                minValue: 40,
                maxValue: 60,
                symbol: {
                    color : '#fc9a59',
                    style: 'circle',
                    outline: null
                },
                label: "40 - 60"
            },
            {
                minValue: 60,
                maxValue: 1000,
                symbol: {
                    color : '#fee086',
                    style: 'circle',
                    outline: null
                },
                label: "> 60"
            }
        ],
        fatal_injury_rate : [
            {
                minValue: 0,
                maxValue: 1,
                symbol: {
                    color : '#48385f',
                    style: 'circle',
                    outline: null
                },
                label: "0 - 1"
            },
            {
                minValue: 1,
                maxValue: 2,
                symbol: {
                    color : '#995375',
                    style: 'circle',
                    outline: null
                },
                label: "1 - 2"
            },
            {
                minValue: 2,
                maxValue: 3,
                symbol: {
                    color : '#fc9a59',
                    style: 'circle',
                    outline: null
                },
                label: "2 - 3"
            },
            {
                minValue: 3,
                maxValue: 10000,
                symbol: {
                    color : '#fee086',
                    style: 'circle',
                    outline: null
                },
                label: "> 3"
            }
        ],
        non_motorized_fatal_injury : [
            {
                minValue: -1,
                maxValue: 0,
                symbol: {
                    color : '#48385f',
                    style: 'circle',
                    outline: null
                },
                label: "0"
            },
            {
                minValue: 0.5,
                maxValue: 1,
                symbol: {
                    color : '#995375',
                    style: 'circle',
                    outline: null
                },
                label: "1"
            },
            {
                minValue: 1,
                maxValue: 2,
                symbol: {
                    color : '#fc9a59',
                    style: 'circle',
                    outline: null
                },
                label: "2"
            },
            {
                minValue: 2,
                maxValue: 50,
                symbol: {
                    color : '#fee086',
                    style: 'circle',
                    outline: null
                },
                label: "> 2"
            }
        ]
    },

    safetyPolyline : {
        // Dark to Yellow
        // const colors = ["#48385f", "#995375", "#db4a5b", "#fc9a59", "#fee086"];

        // injury_crashes : [
        //     {
        //         minValue: 0,
        //         maxValue: 50,
        //         symbol: {
        //             color : '#48385f'
        //         },
        //         label: "0 - 50"
        //     },
        //     {
        //         minValue: 50,
        //         maxValue: 100,
        //         symbol: {
        //             color : '#995375'
        //         },
        //         label: "50 - 100"
        //     },
        //     {
        //         minValue: 100,
        //         maxValue: 150,
        //         symbol: {
        //             color : '#fc9a59'
        //         },
        //         label: "100 - 150"
        //     },
        //     {
        //         minValue: 150,
        //         maxValue: 10000,
        //         symbol: {
        //             color : '#fee086'
        //         },
        //         label: "> 150"
        //     }
        // ],
        // injury_rate : [
        //     // Esri color ramps - Esri Orange and Blue 1
        //     {
        //         minValue: 0,
        //         maxValue: 4,
        //         symbol: {
        //             color : '#48385f'
        //         },
        //         label: "0 - 4"
        //     },
        //     {
        //         minValue: 4.001,
        //         maxValue: 8,
        //         symbol: {
        //             color : '#995375'
        //         },
        //         label: "4 - 8"
        //     },
        //     {
        //         minValue: 8.001,
        //         maxValue: 11,
        //         symbol: {
        //             color : '#fc9a59'
        //         },
        //         label: "8 - 11"
        //     },
        //     {
        //         minValue: 11.001,
        //         maxValue: 100,
        //         symbol: {
        //             color : '#fee086'
        //         },
        //         label: "> 11"
        //     }
        // ],
        fatal_injury_crashes : [
            {
                minValue: 0,
                maxValue: 50,
                symbol: {
                    color : '#48385f'
                },
                label: "0 - 50"
            },
            {
                minValue: 50,
                maxValue: 100,
                symbol: {
                    color : '#995375'
                },
                label: "50 - 100"
            },
            {
                minValue: 100,
                maxValue: 150,
                symbol: {
                    color : '#fc9a59'
                },
                label: "100 - 150"
            },
            {
                minValue: 150,
                maxValue: 10000,
                symbol: {
                    color : '#fee086'
                },
                label: "> 150"
            }
        ],
        fatal_injury_rate : [
            {
                minValue: 0,
                maxValue: 5,
                symbol: {
                    color : '#48385f'
                },
                label: "0 - 5"
            },
            {
                minValue: 5,
                maxValue: 10,
                symbol: {
                    color : '#995375'
                },
                label: "5 - 10"
            },
            {
                minValue: 10,
                maxValue: 15,
                symbol: {
                    color : '#fc9a59'
                },
                label: "10 - 15"
            },
            {
                minValue: 15,
                maxValue: 50000,
                symbol: {
                    color : '#fee086'
                },
                label: "> 15"
            }
        ],
        non_motorized_fatal_injury : [
            {
                minValue: -1,
                maxValue: 0,
                symbol: {
                    color : '#48385f'
                },
                label: "0"
            },
            {
                minValue: 0.1,
                maxValue: 2,
                symbol: {
                    color : '#995375'
                },
                label: "1 – 2"
            },
            {
                minValue: 2,
                maxValue: 4,
                symbol: {
                    color : '#fc9a59'
                },
                label: "2 – 4"
            },
            {
                minValue: 4,
                maxValue: 500,
                symbol: {
                    color : '#fee086'
                },
                label: "> 4"
            }
        ]
    },

    travelDemandPolyline: {

        // Dark to Yellow
        // const colors = ["#48385f", "#995375", "#db4a5b", "#fc9a59", "#fee086"];
        volume_2019: [
            {
                minValue: 0,
                maxValue: 40000,
                symbol:
                {
                    // color: '#feedde',
                    color: '#48385f',
                    width: 1.0
                },
                label: "0 - 40,000"
            },
            {
                minValue: 40000,
                maxValue: 80000,
                symbol:
                {
                    // color: '#fdbe85',
                    color: '#995375',
                    width: 2.0
                },
                label: "40,000 - 80,000"
            },
            {
                minValue: 80000,
                maxValue: 120000,
                symbol:
                {
                    // color: '#fd8d3c',
                    color: '#db4a5b',
                    width: 3.0
                },
                label: "80,000 - 120,000"
            },
            {
                minValue: 120000,
                maxValue: 160000,
                symbol:
                {
                    // color: '#e6550d',
                    color: '#fc9a59',
                    width: 4.0
                },
                label: "120,000 - 160,000"
            },
            {
                minValue: 160000,
                maxValue: 999999,
                symbol:
                {
                    // color: '#a63603',
                    color: '#fee086',
                    width: 5.0
                },
                label: "> 160,000"
            },
        ],

        volume_2050: [
            {
                minValue: 0,
                maxValue: 40000,
                symbol:
                {
                    color: '#48385f',
                    width: 2.0
                },
                label: "0 - 40,000"
            },
            {
                minValue: 40000,
                maxValue: 80000,
                symbol:
                {
                    color: '#995375',
                    width: 2.0
                },
                label: "40,000 - 80,000"
            },
            {
                minValue: 80000,
                maxValue: 120000,
                symbol:
                {
                    color: '#db4a5b',
                    width: 3.0
                },
                label: "80,000 - 120,000"
            },
            {
                minValue: 120000,
                maxValue: 160000,
                symbol:
                {
                    color: '#fc9a59',
                    width: 4.0
                },
                label: "120,000 - 160,000"
            },
            {
                minValue: 160000,
                maxValue: 999999,
                symbol:
                {
                    color: '#fee086',
                    width: 5.0
                },
                label: "> 160,000"
            },
        ],

        vc_2019: [
            {
                minValue: 0,
                maxValue: 0.7,
                symbol: {
                    color: '#48385f',
                    width: 1.5
                },
                label: "0 - 0.7"
            },
            {
                minValue: 0.7,
                maxValue: 0.8,
                symbol: {
                    color: '#995375',
                    width: 2.0
                },
                label: "0.7 - 0.8"
            },
            {
                minValue: 0.8,
                maxValue: 0.9,
                symbol: {
                    color: '#db4a5b',
                    width: 3.0
                },
                label: "0.8 - 0.9"
            },
            {
                minValue: 0.9,
                maxValue: 1.0,
                symbol: {
                    color: '#fc9a59',
                    width: 3.5
                },
                label: "0.9 - 1.0"
            },
            {
                minValue: 1.0,
                maxValue: 10,
                symbol: {
                    color: '#fee086',
                    width: 4.0
                },
                label: "> 1.0"
            },
        ],

        vc_2050: [
            {
                minValue: 0,
                maxValue: 0.7,
                symbol: {
                    color: '#48385f',
                    width: 1.5
                },
                label: "0 - 0.7"
            },
            {
                minValue: 0.7,
                maxValue: 0.8,
                symbol: {
                    color: '#995375',
                    width: 2.0
                },
                label: "0.7 - 0.8"
            },
            {
                minValue: 0.8,
                maxValue: 0.9,
                symbol: {
                    color: '#db4a5b',
                    width: 3.0
                },
                label: "0.8 - 0.9"
            },
            {
                minValue: 0.9,
                maxValue: 1.0,
                symbol: {
                    color: '#fc9a59',
                    width: 3.5
                },
                label: "0.9 - 1.0"
            },
            {
                minValue: 1.0,
                maxValue: 10,
                symbol: {
                    color: '#fee086',
                    width: 4
                },
                label: "> 1.0"
            },
        ]
    },

    futurePlannedRoadwaysPolyline: {
        // Dark to Yellow
        // const colors = ["#48385f", "#995375", "#db4a5b", "#fc9a59", "#fee086"];
        volume_2050: [
            {
                minValue: 0,
                maxValue: 30000,
                symbol:
                {
                    color: '#48385f',
                    width: 1.0
                },
                label: "0 - 30,000"
            },
            {
                minValue: 30000,
                maxValue: 50000,
                symbol:
                {
                    color: '#db4a5b',
                    width: 2.0
                },
                label: "30,000 - 50,000"
            },
            {
                minValue: 50000,
                maxValue: 80000,
                symbol:
                {
                    color: '#fd8d3c',
                    width: 3.0
                },
                label: "50,000 - 80,000"
            },
            {
                minValue: 80000,
                maxValue: 100000,
                symbol:
                {
                    color: '#fc9a59',
                    width: 3.5
                },
                label: "80,000 - 100,000"
            },
            {
                minValue: 100000,
                maxValue: 999999,
                symbol:
                {
                    color: '#fee086',
                    width: 4.0
                },
                label: "> 100,000"
            },
        ],

        capacity_2050: [
            {
                minValue: 0,
                maxValue: 30000,
                symbol:
                {
                    color: '#48385f',
                    width: 1.0
                },
                label: "0 - 30,000"
            },
            {
                minValue: 30000,
                maxValue: 50000,
                symbol:
                {
                    color: '#995375',
                    width: 2.0
                },
                label: "30,000 - 50,000"
            },
            {
                minValue: 50000,
                maxValue: 80000,
                symbol:
                {
                    color: '#db4a5b',
                    width: 3.0
                },
                label: "50,000 - 80,000"
            },
            {
                minValue: 80000,
                maxValue: 100000,
                symbol:
                {
                    color: '#fc9a59',
                    width: 3.5
                },
                label: "80,000 - 100,000"
            },
            {
                minValue: 100000,
                maxValue: 999999,
                symbol:
                {
                    color: '#fee086',
                    width: 4.0
                },
                label: "> 100,000"
            },
        ]
    },

    transitRidershipPolyline : {
        // Dark to Yellow
        // const colors = ["#48385f", "#995375", "#db4a5b", "#fc9a59", "#fee086"];
        avg_daily_rides : [
            {
                minValue: 0,
                maxValue: 500,
                symbol: {
                    color : '#fee086'
                },
                label: "0 - 500"
            },
            {
                minValue: 501,
                maxValue: 1000,
                symbol: {
                    color : '#fc9a59'
                },
                label: "500 - 1000"
            },
            {
                minValue: 1001,
                maxValue: 2000,
                symbol: {
                    width: "2px",
                    color : '#db4a5b'
                },
                label: "1000 - 2000"
            },
            {
                minValue: 2001,
                maxValue: 4000,
                symbol: {
                    width: "3px",
                    color : '#995375'
                },
                label: "2000 - 4000"
            },
            {
                minValue: 4000,
                maxValue: 100000,
                symbol: {
                    width: "4px",
                    color : '#48385f'
                },
                label: "4000+"
            }
        ]

    },

    travelTimePolyline: {
        // Dark to Yellow
        // const colors = ["#48385f", "#995375", "#db4a5b", "#fc9a59", "#fee086"];
        daily_delay: [
            {
                minValue: 0.0,
                maxValue: 20.,
                symbol: {
                    // color: '#10305e'
                    color: '#48385f'
                },
                label: "0 - 20"
            },
            {
                minValue: 20.,
                maxValue: 50.,
                symbol: {
                    // color: '#8897a2'
                    color: '#995375'
                },
                label: "20 - 50"
            },
            {
                minValue: 50.,
                maxValue: 90.,
                symbol:  {
                    // color: '#fffee6'
                    color: '#db4a5b'
                },
                label: "50 - 90"
            },
            {
                minValue: 90.,
                maxValue: 130.,
                symbol: {
                    // color: '#d2987f'
                    color: '#fc9a59'
                },
                label: "90 - 170"
            },
            {
                minValue: 130.,
                maxValue: 1500.,
                symbol: {
                    // color: '#a53217'
                    color: '#fee086'
                },
                label: "130+"
            }
        ],

        peak_lottr: [
            {
                minValue: 1.0,
                maxValue: 1.1,
                symbol: {
                    // color: '#10305e'
                    color: '#48385f'
                },
                label: "1 - 1.25"
            },
            {
                minValue: 1.1,
                maxValue: 1.25,
                symbol: {
                    // color: '#8897a2'
                    color: '#995375'
                },
                label: "1.25 - 1.5"
            },
            {
                minValue: 1.2,
                maxValue: 1.4,
                symbol: {
                    // color: '#fffee6'
                    color: '#db4a5b'
                },
                label: "1.5 - 2.0"
            },
            {
                minValue: 1.4,
                maxValue: 1.75,
                symbol: {
                    // color: '#d2987f'
                    color: '#fc9a59'
                },
                label: "2.0 - 3.0"
            },
            {
                minValue: 1.75,
                maxValue: 10.,
                symbol: {
                    // color: '#a53217'
                    color: '#fee086'
                },
                label: "3+"
            }
        ]

     },

    broadbandPolygon : {

        hh_no_broadband : [
            {
                minValue: 1,
                maxValue: 10,
                symbol: {
                    color : "rgba(253,208,162, 0.85)",
                    outline: null
                },
                label: "1 - 10"
            },
            {
                minValue: 11,
                maxValue: 45,
                symbol: {
                    color : "rgba(253,141,60, 1)",
                    outline: null
                },
                label: "11 - 45"
            },
            {
                minValue: 46,
                maxValue: 125,
                symbol: {
                    color : "rgba(217,72,1, 1)",
                    outline: null
                },
                label: "46 - 126"
            },   
            {
                minValue: 126,
                symbol: {
                    color : "rgba(140,45,4, 1)",
                    outline: null
                },
                label: "126+"
            }         
        ],

        pop_no_broadband : [
            // Best, Good, Basic, Limited
            // #0571b0, #92c5de, #f4a582, #ca0020
            {
                minValue: 1,
                maxValue: 10,
                symbol: {
                    color : "rgba(255, 255, 212, 0.5)",
                    outline: null
                },
                label: "1 - 10"
            },
            {
                minValue: 11,
                maxValue: 45,
                symbol: {
                    color : "rgba(254, 217, 142, 1)",
                    outline: null
                },
                label: "11 - 45"
            },
            {
                minValue: 46,
                maxValue: 125,
                symbol: {
                    color : "rgba(254, 153, 41, 1)",
                    outline: null
                },
                label: "46 - 126"
            },   
            {
                minValue: 126,
                symbol: {
                    color : "rgba(204, 76, 2, 1)",
                    outline: null
                },
                label: "126+"
            }
        ]
    },

    tazPolygon: {

        TOTHH_2019: [
            {
                minValue: 1,
                maxValue: 300,
                symbol:
                {
                    color: '#fffcd4'
                },
                label: "1 - 300"
            },
            {
                minValue: 300,
                maxValue: 800,
                symbol:
                {
                    color: '#b1cdc2'
                },
                label: "300 - 800"
            },
            {
                minValue: 800,
                maxValue: 1300,
                symbol:
                {
                    color: '#629eb0'
                },
                label: "800 - 1,300"
            },
            {
                minValue: 1300,
                maxValue: 2000,
                symbol:
                {
                    color: '#38627a'
                },
                label: "1,300 - 2,000"
            },
            {
                minValue: 2000,
                maxValue: 9999,
                symbol:
                {
                    color: '#0d2644'
                },
                label: "> 2,000"
            },
        ],

        TOTPOP_2019: [
            {
                minValue: 1,
                maxValue: 1000,
                symbol:
                {
                    color: '#fffcd4'
                },
                label: "1 - 1,000"
            },
            {
                minValue: 1000,
                maxValue: 2000,
                symbol:
                {
                    color: '#b1cdc2'
                },
                label: "1,000 - 2,000"
            },
            {
                minValue: 2000,
                maxValue: 3000,
                symbol:
                {
                    color: '#629eb0'
                },
                label: "2,000 - 3,000"
            },
            {
                minValue: 3000,
                maxValue: 5000,
                symbol:
                {
                    color: '#38627a'
                },
                label: "3,000 - 5,000"
            },
            {
                minValue: 5000,
                maxValue: 20000,
                symbol:
                {
                    color: '#0d2644'
                },
                label: "> 5,000"
            },
        ],

        TOTEMP_2019: [
            {
                minValue: 1,
                maxValue: 1000,
                symbol:
                {
                    color: '#fffcd4'
                },
                label: "1 - 1,000"
            },
            {
                minValue: 1000,
                maxValue: 2000,
                symbol:
                {
                    color: '#b1cdc2'
                },
                label: "1,000 - 2,000"
            },
            {
                minValue: 2000,
                maxValue: 5000,
                symbol:
                {
                    color: '#629eb0'
                },
                label: "2,000 - 5,000"
            },
            {
                minValue: 5000,
                maxValue: 20000,
                symbol:
                {
                    color: '#0d2644'
                },
                label: "> 5,000"
            },
        ],

        TOTHH_2050: [
            {
                minValue: 1,
                maxValue: 400,
                symbol:
                {
                    color: '#fffcd4'
                },
                label: "1 - 400"
            },
            {
                minValue: 400,
                maxValue: 1000,
                symbol:
                {
                    color: '#b1cdc2'
                },
                label: "400 - 1,000"
            },
            {
                minValue: 1000,
                maxValue: 1800,
                symbol:
                {
                    color: '#629eb0'
                },
                label: "1,000 - 1,800"
            },
            {
                minValue: 1800,
                maxValue: 3000,
                symbol:
                {
                    color: '#38627a'
                },
                label: "1,800 - 3,000"
            },
            {
                minValue: 3000,
                maxValue: 9999,
                symbol:
                {
                    color: '#0d2644'
                },
                label: "> 3,000"
            },
        ],

        TOTEMP_2050: [
            {
                minValue: 1,
                maxValue: 1000,
                symbol:
                {
                    color: '#fffcd4'
                },
                label: "1 - 1,000"
            },
            {
                minValue: 1000,
                maxValue: 2000,
                symbol:
                {
                    color: '#b1cdc2'
                },
                label: "1,000 - 2,000"
            },
            {
                minValue: 2000,
                maxValue: 5000,
                symbol:
                {
                    color: '#629eb0'
                },
                label: "2,000 - 5,000"
            },
            {
                minValue: 5000,
                maxValue: 9000,
                symbol:
                {
                    color: '#38627a'
                },
                label: "5,000 - 9,000"
            },
            {
                minValue: 9000,
                maxValue: 50000,
                symbol:
                {
                    color: '#0d2644'
                },
                label: "> 9,000"
            }
        ],

        TOTPOP_2050: [
            {
                minValue: 1,
                maxValue: 1000,
                symbol:
                {
                    color: '#fffcd4'
                },
                label: "1 - 1,000"
            },
            {
                minValue: 1000,
                maxValue: 3000,
                symbol:
                {
                    color: '#b1cdc2'
                },
                label: "1,000 - 3,000"
            },
            {
                minValue: 3000,
                maxValue: 5000,
                symbol:
                {
                    color: '#629eb0'
                },
                label: "3,000 - 5,000"
            },
            {
                minValue: 5000,
                maxValue: 8000,
                symbol:
                {
                    color: '#38627a'
                },
                label: "5,000 - 8,000"
            },
            {
                minValue: 8000,
                maxValue: 25000,
                symbol:
                {
                    color: '#0d2644'
                },
                label: "> 8,000"
            }
        ]

    },

    // transitRidershipPolyline : {

    //     avg_daily_rides : [
    //         {
    //             minValue: 0,
    //             maxValue: 500,
    //             symbol: {
    //                 color : '#d6c4f1'
    //             },
    //             label: "0 - 500"
    //         },
    //         {
    //             minValue: 501,
    //             maxValue: 1000,
    //             symbol: {
    //                 color : '#c4afe2'
    //             },
    //             label: "500 - 1000"
    //         },
    //         {
    //             minValue: 1001,
    //             maxValue: 2000,
    //             symbol: {
    //                 width: "2px",
    //                 color : '#a085c6'
    //             },
    //             label: "1000 - 2000"
    //         },
    //         {
    //             minValue: 2001,
    //             maxValue: 4000,
    //             symbol: {
    //                 width: "3px",
    //                 color : '#7b5ba9'
    //             },
    //             label: "2000 - 4000"
    //         },
    //         {
    //             minValue: 4000,
    //             symbol: {
    //                 width: "4px",
    //                 color : '#57318c'
    //             },
    //             label: "4000+"
    //         }
    //     ]

    // },

    compositeScorePolyline: {
        // Esri color ramps - Mentone Beach
        composite_score: [
            {
                minValue: 0.0,
                maxValue: 10.0,
                symbol: {
                    color: "#48385f"
                },
                label: "0 - 10"
            },
            {
                minValue: 10.0,
                maxValue: 20.0,
                symbol: {
                    color: "#995375"
                },
                label: "10 - 20"
            },
            {
                minValue: 20.0,
                maxValue: 30.0,
                symbol:  {
                    color: "#db4a5b"
                },
                label: "20 - 30"
            },
            {
                minValue: 30.0,
                maxValue: 40.0,
                symbol: {
                    color: "#fc9a59"
                },
                label: "30 - 40"
            },
            {
                minValue: 40.0,
                maxValue: 100.0,
                symbol: {
                    color: "#fee086"
                },
                label: "40+"
            }
        ],

        composite_score_assets: [
            {
                minValue: 0.0,
                maxValue: 20.0,
                symbol: {
                    color: "#48385f"
                },
                label: "0 - 20"
            },
            {
                minValue: 20.0,
                maxValue: 40.0,
                symbol: {
                    color: "#995375"
                },
                label: "20 - 40"
            },
            {
                minValue: 40.0,
                maxValue: 60.0,
                symbol:  {
                    color: "#db4a5b"
                },
                label: "40 - 60"
            },
            {
                minValue: 60.0,
                maxValue: 80.0,
                symbol: {
                    color: "#fc9a59"
                },
                label: "60 - 80"
            },
            {
                minValue: 80.0,
                maxValue: 100.0,
                symbol: {
                    color: "#fee086"
                },
                label: "80 - 100"
            }
        ],
        
        composite_score_mobility: [
            {
                minValue: 0.0,
                maxValue: 20.0,
                symbol: {
                    color: "#48385f"
                },
                label: "0 - 20"
            },
            {
                minValue: 20.0,
                maxValue: 40.0,
                symbol: {
                    color: "#995375"
                },
                label: "20 - 40"
            },
            {
                minValue: 40.0,
                maxValue: 60.0,
                symbol:  {
                    color: "#db4a5b"
                },
                label: "40 - 60"
            },
            {
                minValue: 60.0,
                maxValue: 80.0,
                symbol: {
                    color: "#fc9a59"
                },
                label: "60 - 80"
            },
            {
                minValue: 80.0,
                maxValue: 100.0,
                symbol: {
                    color: "#fee086"
                },
                label: "80 - 100"
            }
        ],

        composite_score_economy: [
            {
                minValue: 0.0,
                maxValue: 15.0,
                symbol: {
                    color: "#48385f"
                },
                label: "0 - 15"
            },
            {
                minValue: 15.0,
                maxValue: 30.0,
                symbol: {
                    color: "#995375"
                },
                label: "15 - 30"
            },
            {
                minValue: 30.0,
                maxValue: 40.0,
                symbol:  {
                    color: "#db4a5b"
                },
                label: "30 - 40"
            },
            {
                minValue: 40.0,
                maxValue: 50.0,
                symbol: {
                    color: "#fc9a59"
                },
                label: "40 - 50"
            },
            {
                minValue: 50.0,
                maxValue: 100.0,
                symbol: {
                    color: "#fee086"
                },
                label: "50+"
            }
        ],

        composite_score_safety: [
            {
                minValue: 0.0,
                maxValue: 20.0,
                symbol: {
                    color: "#48385f"
                },
                label: "0 - 20"
            },
            {
                minValue: 20.0,
                maxValue: 40.0,
                symbol: {
                    color: "#995375"
                },
                label: "20 - 40"
            },
            {
                minValue: 40.0,
                maxValue: 60.0,
                symbol:  {
                    color: "#db4a5b"
                },
                label: "40 - 60"
            },
            {
                minValue: 60.0,
                maxValue: 80.0,
                symbol: {
                    color: "#fc9a59"
                },
                label: "60 - 80"
            },
            {
                minValue: 80.0,
                maxValue: 100.0,
                symbol: {
                    color: "#fee086"
                },
                label: "80 - 100"
            }
        ],

        composite_score_equity_weighted: [
            {
                minValue: 0.0,
                maxValue: 25.0,
                symbol: {
                    color: "#48385f"
                },
                label: "0 - 20"
            },
            {
                minValue: 20.0,
                maxValue: 35.0,
                symbol: {
                    color: "#995375"
                },
                label: "20 - 35"
            },
            {
                minValue: 35.0,
                maxValue: 50.0,
                symbol:  {
                    color: "#db4a5b"
                },
                label: "35 - 50"
            },
            {
                minValue: 50.0,
                maxValue: 65.0,
                symbol: {
                    color: "#fc9a59"
                },
                label: "50 - 65"
            },
            {
                minValue: 65.0,
                maxValue: 100.0,
                symbol: {
                    color: "#fee086"
                },
                label: "65 - 80"
            }
        ]
    },

    freightFlows : {

        freight_trips : [
            {
                minValue: 0,
                maxValue: 500,
                symbol:
                {
                    color: '#48385f',
                    width: 1.0
                },
                label: "0 - 500"
            },
            {
                minValue: 500,
                maxValue: 1000,
                symbol:
                {
                    color: '#995375',
                    width: 2.0
                },
                label: "500 - 1,000"
            },
            {
                minValue: 1000,
                maxValue: 2000,
                symbol:
                {
                    color: '#db4a5b',
                    width: 3.0
                },
                label: "1,000 - 2,000"
            },
            {
                minValue: 2000,
                maxValue: 10000,
                symbol:
                {
                    color: '#fc9a59',
                    width: 4.0
                },
                label: "2,000 - 10,000"
            },
            {
                minValue: 10000,
                maxValue: 999999,
                symbol:
                {
                    color: '#fee086',
                    width: 5.0
                },
                label: "> 10,000"
            },
        ]
    },

}
