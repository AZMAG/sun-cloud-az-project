/*
Data layers to be used by the scoringEngine.

Authors:
Chapman Munn - Developer;
Ahjung Kim - Developer;

December 2022
*/

// layers that will be updated by the scoringEngine.
export const dataLayersScoring = {

	linearMeasureLayer: {
		url: 'https://services6.arcgis.com/clPWQMwZfdWn4MQZ/arcgis/rest/services/Sun_Cloud_Performance_Scores_Private/FeatureServer/0',
		fields: {
			oid: 'OBJECTID'
		},
	},

	pointMeasureLayer: {
		url: 'https://services6.arcgis.com/clPWQMwZfdWn4MQZ/ArcGIS/rest/services/suncloud_dev2/FeatureServer/1', fields: {
			oid: 'OBJECTID'
		},
	},

}

// layers used for measure scoring in the scoringEngine.
export const dataLayersMeasures = {
	name: {
		linear: {
			url: ''
		}, point: {
			url: ''
		}
	}, vmt: {
		linear: {
			url: 'https://services6.arcgis.com/clPWQMwZfdWn4MQZ/ArcGIS/rest/services/Sun_Cloud_Regional_Travel_Demand/FeatureServer/0'
		}, point: {
			url: 'https://services6.arcgis.com/clPWQMwZfdWn4MQZ/ArcGIS/rest/services/Sun_Cloud_Regional_Travel_Demand/FeatureServer/0'
		}
	}, vc_ratio: {
		linear: {
			url: 'https://services6.arcgis.com/clPWQMwZfdWn4MQZ/ArcGIS/rest/services/Sun_Cloud_Regional_Travel_Demand/FeatureServer/0'
		}, point: {
			url: 'https://services6.arcgis.com/clPWQMwZfdWn4MQZ/ArcGIS/rest/services/Sun_Cloud_Regional_Travel_Demand/FeatureServer/0'
		}
	}, broadband: {
		linear: {
			url: 'https://services6.arcgis.com/clPWQMwZfdWn4MQZ/ArcGIS/rest/services/Fixed_Broadband_Coverage_Map_WFL1/FeatureServer/0'
		}, point: {
			url: 'https://services6.arcgis.com/clPWQMwZfdWn4MQZ/ArcGIS/rest/services/Fixed_Broadband_Coverage_Map_WFL1/FeatureServer/0'
		}
	}, freight_route: {
		linear: {
			url: 'https://services6.arcgis.com/clPWQMwZfdWn4MQZ/ArcGIS/rest/services/Sun_Cloud_Freight_Routes_2023/FeatureServer/0'
		}, point: {
			url: 'https://services6.arcgis.com/clPWQMwZfdWn4MQZ/ArcGIS/rest/services/Sun_Cloud_Freight_Routes_2023/FeatureServer/0'
		}
	}, employment_change: {
		linear: {
			url: 'https://services6.arcgis.com/clPWQMwZfdWn4MQZ/ArcGIS/rest/services/Sun_Cloud_TAZ/FeatureServer/0'
		}, point: {
			url: 'https://services6.arcgis.com/clPWQMwZfdWn4MQZ/ArcGIS/rest/services/Sun_Cloud_TAZ/FeatureServer/0'
		}
	}, tr: {
		linear: {
			url: 'https://services6.arcgis.com/clPWQMwZfdWn4MQZ/ArcGIS/rest/services/Sun_Cloud_Transit_Ridership_2021/FeatureServer/0'
		}, point: {
			url: 'https://services6.arcgis.com/clPWQMwZfdWn4MQZ/ArcGIS/rest/services/Sun_Cloud_Transit_Ridership_2021/FeatureServer/0'
		}
	}, ta: {
		linear: {
			url: 'https://services6.arcgis.com/clPWQMwZfdWn4MQZ/ArcGIS/rest/services/Sun_Cloud_Transit_Ridership_2021/FeatureServer/0'
		}, point: {
			url: 'https://services6.arcgis.com/clPWQMwZfdWn4MQZ/ArcGIS/rest/services/Sun_Cloud_Transit_Ridership_2021/FeatureServer/0'
		}
	}, ttr: {
		linear: {
			url: 'https://services6.arcgis.com/clPWQMwZfdWn4MQZ/ArcGIS/rest/services/Sun_Cloud_Travel_Time/FeatureServer/0'
		}, point: {
			url: 'https://services6.arcgis.com/clPWQMwZfdWn4MQZ/ArcGIS/rest/services/Sun_Cloud_Travel_Time/FeatureServer/0'
		}
	}, bridge: {
		linear: {
			url: 'https://services6.arcgis.com/clPWQMwZfdWn4MQZ/ArcGIS/rest/services/Sun_Cloud_Bridges/FeatureServer/0'
		}, point: {
			url: 'https://services6.arcgis.com/clPWQMwZfdWn4MQZ/ArcGIS/rest/services/Sun_Cloud_Bridges/FeatureServer/0'
		}
	}, pavement: {
		linear: {
			url: 'https://services6.arcgis.com/clPWQMwZfdWn4MQZ/arcgis/rest/services/Sun_Cloud_Pavement_Condition/FeatureServer/2'
		}, point: {
			url: 'https://services6.arcgis.com/clPWQMwZfdWn4MQZ/arcgis/rest/services/Sun_Cloud_Pavement_Condition/FeatureServer/2'
		}
	}, safety: {
		linear: {
			url: 'https://services6.arcgis.com/clPWQMwZfdWn4MQZ/arcgis/rest/services/SunCloud_Segments_Safety/FeatureServer/0'

		}, point: {
			url: 'https://services6.arcgis.com/clPWQMwZfdWn4MQZ/ArcGIS/rest/services/SunCloud_Junctions_Safety/FeatureServer/0'

		}
	},

	insufficientBridgeDeckWidth: {
		linear: {
			url: 'https://services6.arcgis.com/clPWQMwZfdWn4MQZ/ArcGIS/rest/services/Sun_Cloud_Bridges/FeatureServer/0'
		}, point: {
			url: 'https://services6.arcgis.com/clPWQMwZfdWn4MQZ/ArcGIS/rest/services/Sun_Cloud_Bridges/FeatureServer/0'
		},

	}, bridgeStructuralEvaluationRating: {
		linear: {
			url: 'https://services6.arcgis.com/clPWQMwZfdWn4MQZ/ArcGIS/rest/services/Sun_Cloud_Bridges/FeatureServer/0'
		}, point: {
			url: 'https://services6.arcgis.com/clPWQMwZfdWn4MQZ/ArcGIS/rest/services/Sun_Cloud_Bridges/FeatureServer/0'
		},

	},

	pct_disadvantaged: {
		linear: {
			url: 'https://services6.arcgis.com/clPWQMwZfdWn4MQZ/ArcGIS/rest/services/Disadvantaged_Facility_Users_2021/FeatureServer/0'
		}, point: {
			url: 'https://services6.arcgis.com/clPWQMwZfdWn4MQZ/ArcGIS/rest/services/Disadvantaged_Facility_Users_2021/FeatureServer/0'

		}
	}

}
