/*
A widget that allows users to apply custom weights to performance measures.

Authors:
Chapman Munn -- Developer -- munn@highstreetconsulting.com

Date: March 2023 - June 2023
*/

import { 
	React, 
	AllWidgetProps,
	ReactDOM
} from 'jimu-core'

import { JimuMapViewComponent, JimuMapView } from 'jimu-arcgis';

import { IMConfig } from '../config'

import FeatureLayer from "esri/layers/FeatureLayer";

import * as colorRendererCreator from "esri/smartMapping/renderers/color.js";
import * as colorSchemes from "esri/smartMapping/symbology/color.js";
import * as colorRamps from "esri/smartMapping/symbology/support/colorRamps.js";

// lodash
// import _ from 'lodash';

import { 
	FeatureLayerDataSource, 
	DataSourceManager,
	FeatureLayerQueryParams
} from 'jimu-core';

// css
import './style.css';

// UI components
import {
	Button,
	Slider,
	Label,
	Checkbox,
	Select,
	Link,
	Alert
} from 'jimu-ui';

// icons <<ClassName> size={50}/>
import { UnlockOutlined } from 'jimu-icons/outlined/editor/unlock';
import { LockOutlined } from 'jimu-icons/outlined/editor/lock';
import { PolylineOutlined } from 'jimu-icons/outlined/gis/polyline';
import { DataPointOutlined } from 'jimu-icons/outlined/gis/data-point';
import { InvisibleOutlined } from 'jimu-icons/outlined/application/invisible';
import { VisibleOutlined } from 'jimu-icons/outlined/application/visible';

// <NumericInput defaultValue="10" />
import { NumericInput } from 'jimu-ui';


const sortArrayOfObjects = (arr, propertyName, order = 'ascending') => {
  const sortedArr = arr.sort((a, b) => {
    if (a[propertyName] < b[propertyName]) {
      return -1;
    }
    if (a[propertyName] > b[propertyName]) {
      return 1;
    }
    return 0;
  });

  if (order === 'descending') {
    return sortedArr.reverse();
  }

  return sortedArr;
};

export default class Widget extends React.PureComponent<AllWidgetProps<IMConfig>, any> {setState: any;

	constructor (props) {
		super(props)
	};

	state = {

		// web-map
		jimuMapView : null,

		// buttons
		scoreButtonDisabled : true,
		visibleButtonVisible : true,
		exportButtonDisabled : true,

		polylineLayerDisabled : true,
		polylineLayerVisible : false,

		// slider values
		injury_rate_norm              : 10, // Fatalities per 100 Million VMT 
		non_motorized_injuries_norm   : 10, // Non-motorized fatal & incapacitating injuries
		excess_expected_crashes_norm  : 12, // Excess expected crashes using SPFs
		pavement_pct_poor_norm        : 8, // Poor Pavement
		bridge_structural_rating_norm : 4, // Bridge Structural Evaluation Rating
		bridge_deck_geometry_norm     : 4, // Insufficient Bridge Deck Width
		lottr_norm                    : 6, // Level of Travel Time Reliability
		avg_delay_norm                : 4, // Daily Delay 
		vc_ratio_norm                 : 4, // Volume / Capacity Ratio
		vmt_change_norm               : 6, // Forecasted VMT Change
		transit_overlap_norm          : 4, // Overlap with Transit Route
		transit_ridership_norm        : 4, // Transit Ridership
		employment_change_norm        : 8, // Forecasted Employment Change
		households_no_broadband_norm  : 8, // Broadband needs
		critical_freight_norm         : 8, // Overlap with CUFC/CRFC


		// slider buttons
		pavement_pct_poor_norm_button        : <UnlockOutlined size='m'/>,
		bridge_structural_rating_norm_button : <UnlockOutlined size='m'/>,
		bridge_deck_geometry_norm_button     : <UnlockOutlined size='m'/>,
		lottr_norm_button                    : <UnlockOutlined size='m'/>,
		avg_delay_norm_button                : <UnlockOutlined size='m'/>, 
		vc_ratio_norm_button                 : <UnlockOutlined size='m'/>, 
		vmt_change_norm_button               : <UnlockOutlined size='m'/>,
		transit_overlap_norm_button          : <UnlockOutlined size='m'/>, 
		transit_ridership_norm_button        : <UnlockOutlined size='m'/>, 
		employment_change_norm_button        : <UnlockOutlined size='m'/>, 
		households_no_broadband_norm_button  : <UnlockOutlined size='m'/>, 
		fatality_rate_norm_button            : <UnlockOutlined size='m'/>,  
		injury_rate_norm_button              : <UnlockOutlined size='m'/>, 
		non_motorized_injuries_norm_button   : <UnlockOutlined size='m'/>, 
		excess_expected_crashes_norm_button  : <UnlockOutlined size='m'/>,
		critical_freight_norm_button		 : <UnlockOutlined size='m'/>,

		// arry of slider HTML components
		slidersHTML: document.getElementsByClassName("jimu-slider"),

		// the sum of all of the sliders
		sumOfAllSliders : 100,
		
		// smart-mapping variables
		smartMappingField : 'composite_score',
		smartMappingNumberClasses : 4,
		smartMappingClassType : 'quantile',

		// determine if we are in draft mode
		draft : false

	};

	sliderConfigurationArray = [
		/*

		name -- the name of the slider/normalized field
		alias -- the alias of the slider/normalized field
		type -- feature layer data type
		group -- composite score group
		raw -- the raw field name used for weighting

		*/
		{
			name  : 'injury_rate_norm', 
			alias : 'Serious and Fatal Injuries per million VMT',
			type  : "double",
			group : 'composite_score_safety',
			raw   : 'injury_rate'
		},
		{
			name  : 'non_motorized_injuries_norm', 
			alias : 'Bicyclist and Pedestrian Fatal & Serious Injuries',
			type  : "double",
			group : 'composite_score_safety',
			raw  : 'non_motorized_injuries'
		},
		{
			name  : 'excess_expected_crashes_norm', 
			alias : 'Excess expected crashes using SPFs',
			type  : "double",
			group : 'composite_score_safety',
			raw   : 'excess_expected_crashes'
		},
		{
			name  : 'pavement_pct_poor_norm', 
			alias : 'Pavement Rougness',
			type  : "double",
			group : 'composite_score_assets',
			raw   : 'pavement_pct_poor'
		},
		{
			name  : 'bridge_structural_rating_norm', 
			alias : 'Bridge Structural Evaluation Rating',
			type  : "double",
			group : 'composite_score_assets',
			raw   : 'bridge_structural_rating'
		},
		{
			name  : 'bridge_deck_geometry_norm', 
			alias : 'Bridge Deck Geometry',
			type  : "double",
			group : 'composite_score_assets',
			raw   : 'bridge_deck_geometry'
		},
		{
			name  : 'lottr_norm', 
			alias : 'Level of Travel Time Reliability',
			type  : "double",
			group : 'composite_score_mobility',
			raw   : 'lottr'
		},
		{
			name  : 'avg_delay_norm', 
			alias : 'Daily Delay',
			type  : "double",
			group : 'composite_score_mobility',
			raw   : 'avg_delay'
		},
		{
			name  : 'vc_ratio_norm', 
			alias : 'Volume / Capacity Ratio',
			type  : "double",
			group : 'composite_score_mobility',
			raw   : 'vc_ratio'
		},
		{
			name  : 'vmt_change_norm', 
			alias : 'VMT Forecasted Change',
			type  : "double",
			group : 'composite_score_mobility',
			raw   : 'vmt_change'
		},
		{
			name  : 'transit_overlap_norm', 
			alias : 'Overlap with Transit Route',
			type  : "double",
			group : 'composite_score_mobility',
			raw   : 'transit_overlap'
		},
		{
			name  : 'transit_ridership_norm', 
			alias : 'Transit Ridership',
			type  : "double",
			group : 'composite_score_mobility',
			raw   : 'transit_ridership'
		},
		{
			name  : 'employment_change_norm', 
			alias : 'Employment Forecasted Change',
			type  : "double",
			group : 'composite_score_economy',
			raw   : 'employment_change'
		},
		{
			name  : 'critical_freight_norm', 
			alias : 'Overlap with Critical Freight Route',
			type  : "double",
			group : 'composite_score_economy',
			raw   : 'critical_freight'
		},
		{
			name  : 'households_no_broadband_norm', 
			alias : 'Households Without Broadband',
			type  : "double",
			group : 'composite_score_economy',
			raw   : 'households_no_broadband'
		},


	];

	rawFieldArray = [
		/*
		{
			name -- Esri field name,
			type -- Esri field type,
			alias -- human display text,
			popup -- boolean (true == will be included in client side pop up),
			index -- client side pop up index
		}
		*/
		{
			name: "OBJECTID",
			type: "oid",
			alias: "OBJECTID",
			popup : false,
			index : null
		},
		{
			name : "percent_disadvantaged",
			type : "double",
			alias : "Percent Disadvantaged Facility Users",
			popup : false,
			index : null
		},
		{
			name : "route_id",
			type : "string",
			alias : "Route ID",
			popup : true,
			index : 2
		},
		{
			name : "injury_rate",
			type : "double",
			alias : "Serious and Fatal Injuries per million VMT",
			popup : true,
			index : 3
		},
		{
			name : "non_motorized_injuries",
			type : "double",
			alias : "Bicyclist and Pedestrian Fatal & Serious Injuries",
			popup : true,
			index : 4
		},
		{
			name : "excess_expected_crashes",
			type : "double",
			alias : "Excess expected crashes using SPFs",
			popup : true,
			index : 5
		},
		{
			name : "pavement_pct_poor",
			type : "double",
			alias : "Pavement Roughness",
			popup : true,
			index : 6
		},
		{	
			name : "bridge_structural_rating",
			type : "double",
			alias : "Bridge Structural Evaluation Rating",
			popup : true,
			index : 7
		},
		{
			name : "bridge_deck_geometry",
			type : "double",
			alias : "Bridge Deck Geometry",
			popup : true,
			index : 8
		},
		{	
			name : "lottr",
			type : "double",
			alias : "Level of Travel Time Reliability",
			popup : true,
			index : 9
		},
		{
			name : "avg_delay",
			type : "double",
			alias : "Daily Delay",
			popup : true,
			index : 10
		},
		{
			name : "vc_ratio",
			type : "double",
			alias : "Volume / Capacity Ratio",
			popup : true,
			index : 11
		},
		{
			name : "vmt_change",
			type : "double",
			alias : "VMT Forecasted Change",
			popup : true,
			index : 12
		},
		{	
			name : "transit_overlap",
			type : "double",
			alias : "Overlap with Transit Route",
			popup : true,
			index : 13
		},
		{
			name : "transit_ridership",
			type : "double",
			alias : "Transit Ridership",
			popup : true,
			index : 14
		},
		{
			name : "employment_change",
			type : "double",
			alias : "Employment Forecasted Change",
			popup : true,
			index : 15
		},
		{
			name : "critical_freight",
			type : "double",
			alias : "Overlap with Critical Freight Route",
			popup : true,
			index : 16
		},
		{
			name : "households_no_broadband",
			type : "double",
			alias : "Households Without Broadband",
			popup : true,
			index : 17
		},

	];

	compositeScoreArray = [
		/*
		{
			name -- Esri field name,
			type -- Esri field type,
			alias -- human display text,
			popup -- boolean (true == will be included in client side pop up),
			index -- client side pop up index
		}
		*/
		{
			name : "composite_score",
			type : "double",
			alias : 'Composite Score',
			popup : true,
			index : 1
		},
		{
			name : "composite_score_safety",
			type : "double",
			alias : 'Safety Composite Score',
			popup : true,
			index : 18
		},
		{
			name : "composite_score_assets",
			type : "double",
			alias : 'Assets Composite Score',
			popup : true,
			index : 19
		},
		{
			name : "composite_score_mobility",
			type : "double",
			alias : "Mobility Composite Score",
			popup : true,
			index : 20
		},
		{
			name : "composite_score_economy",
			type : "double",
			alias : "Economy Composite Score",
			popup : true,
			index : 21
		},
		{
			name : "composite_score_unweighted",
			type : "double",
			alias : 'Unweighted Composite Score',
			popup : true,
			index : 22
		},
	];

	scoredLayers = {
		/*
		key: "scoredLayerPolyline"
		layerDataSourceID: "dataSource_1-186e16a58d2-layer-28-186e16a5b6a-layer-29"
		layerGeometryType: "point"
		layerID: "widget_1-dataSource_1-186e16a58d2-layer-28-186e16a5b6a-layer-29"
		layerName: "Sun cloud scoring point"
		layerURL: "https://services6.arcgis.com/clPWQMwZfdWn4MQZ/arcgis/rest/services/suncloud_dev2_view/FeatureServer"
		*/
		scoredLayerPolyline : null
	};

	scoredLayerFeatures = {
		scoredLayerPolyline : [],
	};

	scoredLayersDataSources = {
		scoredLayerPolyline : null,
	};
	
	clientSideFeatureLayers = {
		scoredLayerPolyline : null,
	};

	clientSideFeatureLayerPopupTemplate = {

		title: "Weighted Performance Measure Scores",
		content: [
			{
				type: "fields",
				fieldInfos: []
			}
		]

	};

	clientSideSmartMappingColorScheme = {
    "id": "Chaptone-Beach",
    "name": "Chaptone-Beach",
    "tags": [],
    "theme": "high-to-low",
    "colors": [
        [255, 255, 178, 255],
        [254, 204, 92, 255],
        [253, 141, 60, 255],
        [240, 59, 32, 255],
        [189, 0, 38, 255]
    ],
    "colorsForClassBreaks": [
        {
            "numClasses": 1,
            "colors": [
                [
					'#fedd84'
                ]
            ]
        },
        {
            "numClasses": 2,
            "colors": [
                [
					83,59,98,255 // purple
                ],
				[
					254,219,131,255 // yellow
                ]
            ]
        },
        {
            "numClasses": 3,
            "colors": [
                [
					83,59,98,255 // purple
                ],
				[
					224,87,91,255 // orange
				],
				[
					254,219,131,255 // yellow
                ]
            ]
        }, 
        {
            "numClasses": 4,
            "colors": [
                [
					83,59,98,255 // purple
                ],
				[
					156,83,116,255 // light purple
				],
				[
					238,121,90,255 // light orange
				],
				[
					254,219,131,255 // yellow
                ]
            ]
        },
        {
            "numClasses": 5,
            "colors": [
                [
					83,59,98,255 // purple
                ],
				[
					163,82,113,255 // light purple
				],
				[
					223,83,91,255 // salmon
				],
				[
					245,138,89,255 // light orange
				],
				[
					254,219,131,255 // yellow
                ]
            ]
        },
        {
            "numClasses": 6,
            "colors": [
                [
					83,59,98,255 // purple
                ],
				[
					159,82,114,255
				],
				[
					201,76,98,255
				],
				[ 
					235,112,90,255
				],
				[
					252,155,89,255
				],
				[
					254,219,131,255 // yellow
                ]
            ]
        },
        {
            "numClasses": 7,
            "colors": [
                [
					83,59,98,255 // purple
                ],
				[
					139,79,114,255
				],
				[
					191,78,102,255
				],
				[
					224,86,90,255
				],
				[ 
					241,129,89,255
				],
				[
					252,170,99,255
				],
				[
					254,219,131,255 // yellow
                ]
            ]
        },
        {
            "numClasses": 8,
            "colors": [
                [
					83,59,98,255 // purple
                ],
				[
					115,70,107,255
				],
				[
					162,81,113,255
				],
				[
					204,76,97,255
				],
				[
					237,118,89,255
				],
				[ 
					246,141,89,255
				],
				[
					253,166,97,255
				],
				[
					254,219,131,255 // yellow
                ]
            ]
        },
        {
            "numClasses": 9,
            "colors": [
                [
					83,59,98,255 // purple
                ],
				[
					115,71,107,255
				],
				[
					170,80,110,255
				],
				[
					195,77,100,255
				],
				[
					222,81,91,255
				],
				[ 
					242,131,89,255
				],
				[
					252,158,92,255
				],
				[
					253,195,115,255
				],
				[
					254,219,131,255 // yellow
                ]
            ]
        },
        {
            "numClasses": 10,
            "colors": [
                [
					83,59,98,255 // purple
                ],
				[
					113,70,106,255
				],
				[
					148,81,116,255
				],
				[
					173,80,109,255
				],
				[
					201,76,98,255
				],
				[
					231,104,90,255
				],
				[ 
					247,142,89,255
				],
				[
					252,155,89,255
				],
				[
					253,184,108,255
				],
				[
					254,219,131,255 // yellow
                ]
            ]
        }
    ],
    "noDataColor": [
        170,
        170,
        170,
        255
    ],
    "width": "2px",
    "opacity": 0.8
};

	componentDidMount() {
		/*
		After the widget has mounted, set state variables.
		*/

		// check to see if we are in draft mode
		var urlParams = new URLSearchParams(window.location.search);
		var draft = (urlParams.get('draft') === 'true') ? true : false;

		// parse this.props.config.scoredLayerPolyline if it has been set in ExB Manager.
		if (this.props.config.scoredLayerPolyline != undefined){
			this.scoredLayers.scoredLayerPolyline = JSON.parse(this.props.config.scoredLayerPolyline);
		}
		
		// build out the popup content for the client-side feature layer
		this.helperBuildClientSideFeatureLayerPopUpContent();

		const slidersHTML = document.getElementsByClassName("jimu-slider");
		const locksHTML= document.getElementsByClassName("lock-input");

		this.setState({ 
			slidersHTML : slidersHTML, 
			locksHTML : locksHTML,
			draft : draft
		});
	};

	// DATA SOURCES
	onActiveViewChange= (jimuMapView: JimuMapView) => {
		/*
		Load Web-Map and set the widget prop w/ jimuMapView
		*/

	
		if (jimuMapView != null){

			this.setState(
				{
					jimuMapView : jimuMapView,
				},
				() => {

					this.createDataSourceFromLayerSelectionAndCollectFeatures();

				}
			)

		}
	};

	createDataSourceFromLayerSelectionAndCollectFeatures = () => {
		/*
		Create data sources for the point and polyline scored layers.

		Update this.scoredLayerDataSources w/ the FeatureLayerDataSources for each.
		*/

		var dsManager = DataSourceManager.getInstance();

		// var scoredLayerPoint : FeatureLayerDataSource = dsManager.getDataSource(this.scoredLayers.scoredLayerPoint.layerDataSourceID) as FeatureLayerDataSource;
		var scoredLayerPolyline : FeatureLayerDataSource = dsManager.getDataSource(this.scoredLayers.scoredLayerPolyline.layerDataSourceID) as FeatureLayerDataSource;

		// this.scoredLayersDataSources.scoredLayerPoint = scoredLayerPoint;
		this.scoredLayersDataSources.scoredLayerPolyline = scoredLayerPolyline;

		// this.queryDataSourcesForFeatures(this.scoredLayersDataSources.scoredLayerPoint, 'scoredLayerPoint');
		this.queryDataSourcesForFeatures(this.scoredLayersDataSources.scoredLayerPolyline, 'scoredLayerPolyline');
	
	};

	queryDataSourcesForFeatures = (featureLayerDataSource, scoredLayerName) => {
		/*
		TODO

		Inputs:
		featureLayerDataSource -- FeatureLayerDataSource
		scoredLayerName -- string (scoredLayerPoint or scoredLayerPolyline)
		*/

		var layerDefinition = featureLayerDataSource.capabilities.layerDefinition;
		var objectIdField = layerDefinition.objectIdField;
		var maxRecordCount = layerDefinition.maxRecordCount;
		
		var queryFeatures = [];

		var startFeatureObjectId = 0;
		var endFeatureObjectId = maxRecordCount;

		featureLayerDataSource.queryCount()
		.then((result) => {

			var totalFeatureCount = result.count;
			var iterations = Math.ceil(totalFeatureCount / maxRecordCount);
			var iteratorArray = [...Array(iterations).keys()];
			var maxIterator = Math.max(...iteratorArray);

			console.log('totalFeatureCount: ' + totalFeatureCount);

			iteratorArray.forEach(iteration => {


				var oids = Array(endFeatureObjectId - startFeatureObjectId).fill().map((x,i)=> startFeatureObjectId + i);

				//var oids = _.range(startFeatureObjectId, endFeatureObjectId);

				var queryParams : FeatureLayerQueryParams = {
					where : "1=1",
					outFields : ["*"], 
					returnGeometry : true,
					objectIds : oids
				}

				startFeatureObjectId = startFeatureObjectId + maxRecordCount;
				endFeatureObjectId = endFeatureObjectId + maxRecordCount;
				
				featureLayerDataSource.query(queryParams)
				.then((result) => {

					queryFeatures.push(result.records);
					queryFeatures = queryFeatures.flat();

					if (queryFeatures.length >= totalFeatureCount){

						this.scoredLayerFeatures[scoredLayerName] = queryFeatures;
						
						this.helperBuildClientSideFeatureLayer(scoredLayerName, queryFeatures)

					}

					
				});


			})

		})

	};

	// CREATE CLIENT-SIDE FEATURE LAYER
	helperBuildClientSideFeatureLayer = (scoredLayerName, features) => {
		/*
		Build out a client-side feature layer containing scored features.
		
		Inputs:
		scoredLayerName -- string (scoredLayerPoint or scoredLayerPolyline)
		features -- array of features
		*/

		var graphics = [];

		features.forEach(item => {
			var obj = {
				attributes : {
					OBJECTID : item.feature.attributes.OBJECTID,
					composite_score : item.feature.attributes.composite_score
				},
				geometry : item.feature.geometry,
			};
			graphics.push(obj);
		});

		var featureLayerFields = this.sliderConfigurationArray.concat(this.rawFieldArray).concat(this.compositeScoreArray);

		var layer = new FeatureLayer(
			{
				fields : featureLayerFields,
				source : graphics,
				objectIdField: "OBJECTID",
				spatialReference : {wkid : 2223},
				title : 'Weighted Performance Measure Scores',
				visible : true,
				clientSideLayer : true,
				popupTemplate : this.clientSideFeatureLayerPopupTemplate,
			}
		);

		this.clientSideFeatureLayers[scoredLayerName] = layer;

		setTimeout(() => {
			this.setState({
				scoreButtonDisabled : false,
			},
			() => {

			}
			)
		},
			5000
		)
	};

	helperBuildClientSideFeatureLayerPopUpContent = () => {
		/*
		Build out the popup content for the client-side feature layer.

		Iterate through this.rawFieldArray and this.compositeScoreArray to
		setup the popup content.
		
		clientSideFeatureLayerPopupTemplate.content.fieldInfos -> example

		{
			fieldName : 'composite_score',
			label : 'Composite Score',
			format: {
				digitSeparator: true,
				places: 2
				}
		},		
		
			Composite Score Order:

			Safety Composite Score	23.06
			Assets Composite Score	0.00
			Mobility Composite Score	60.06
			Economy Composite Score	3.23
			Unweighted Composite Score	24.70

		*/

		var fieldInfos = [];

		var popUpArray = this.rawFieldArray.concat(this.compositeScoreArray);

		popUpArray.forEach(item => {

			if (item.popup === true){

				var obj = {
					fieldName : item.name,
					label : item.alias,
					index : item.index
				};

				if (item.type === 'double'){
					obj['format'] =  {
						digitSeparator: true,
						places: 2
					}
				};

				fieldInfos.push(obj);

			}

		});

		//var sortedFieldInfos = _.sortBy(fieldInfos, 'index')
		const sortedFieldInfos = sortArrayOfObjects(fieldInfos, 'index');
		this.clientSideFeatureLayerPopupTemplate.content[0].fieldInfos = sortedFieldInfos;

	}

	// TURNING LAYERS ON AND OFF
	turnOnOffScoredLayers = () => {
		/*
		Turn the client-side layers on/off.

		'scoredLayerPolyline', 'polylineLayerVisible'
		*/
		
		var futureVisibility = (this.state['polylineLayerVisible'] === true) ? false : true;
		this.clientSideFeatureLayers['scoredLayerPolyline'].visible = futureVisibility;

		this.setState({
			polylineLayerVisible : futureVisibility,
		})

	};

	hideLayers = () => {
		/*
		Hide all layers in the Web-Map.
		*/
		var layers = Object.values(this.state.jimuMapView.jimuLayerViews);
		layers.forEach(layer => {layer.layer.visible=false});
	
	}

	// CREATE SLIDERS
	createSliders = () => {
		/*
		Create sliders based on data contained within this.sliderConfigurationArray
		*/

		var sliders = [];

		this.sliderConfigurationArray.forEach(item => {

			var buttonElementID = `${item.name}_button`;

			var element : HTMLElement = (

				<div>

					<Label
						size='default'
						className='mt-2'
					>
						{item.alias}:
					</Label>
				
					<div className='row'>

						<div className='col-2'>

							<Button
								icon
								id={buttonElementID}
								onClick={() => this.sliderEnableDisable(item.name)}
								size="default"
								type="default"
							>

								{this.state[buttonElementID]}

							</Button>

						</div>

						<div className='col-7'>

							<Slider
								className='w-75'
								name={item.name}
								id={item.name}
								aria-label="Small"
								step={.25}
								min={0}
								max={100}
								value={this.state[item.name]}
								onMouseUp={this.sliderUpdateOnMouseUp}
							/>
							
						</div>

						<div className='col-3'>

							<NumericInput
								name={item.name}
								defaultValue={this.state[item.name]}
								value={this.state[item.name]}
								size='sm'
								onChange={(value : number, name : string) => this.balanceSliders(item.name, value)}
								step='.25'
								min='0'
								max='100'
							/>

						</div>

					</div>

				</div>

			)

			sliders.push(element)


		})

		return (
			sliders
		)


	};

	// DISABLE/ENABLE ELEMENTS W/ ICON
	sliderEnableDisable = (sliderName) => {
		/*
		User clicks the button associated with enabling or disabling
		a specific slider and numerical input.

		Inputs:
		sliderName -- the element that has been interacted with.

		document.getElementsByName('injury_rate_norm')
		*/

		var elementsWithSliderName = document.getElementsByName(sliderName);

		var sliderButton = `${sliderName}_button`;

		var action = (elementsWithSliderName[0].disabled === true) ? false : true;

		var icon = (action === true) ? <LockOutlined size='m' color='red'/> : <UnlockOutlined size='m'/>  

		var obj = {};
		obj[sliderButton] = icon
		this.setState(
			obj,
			() => {
				elementsWithSliderName.forEach(item => {
					item.disabled = action;
				});
			}
		)
	};

	// SLIDER ADJUSTMENT CODE
	sliderUpdateOnMouseUp = (elm) => {
		/*
		User manually adjusts a slider. Upon release, call the balanceSliders function.

		Inputs:
		elm -- event object
		*/
		var sliderName = elm.target.name;
		var sliderValue = elm.target.valueAsNumber;

		this.balanceSliders(sliderName, sliderValue);

	};

	grabArrayOfSliderObjects = () => {
		/*
		Grab an array of slider objects. {name : <sliderName>, value : <sliderValue>}

		Returns:
		sliderArrayOfObjects -- [{}...] | objects = {name : <sliderName>, value : <sliderValue>}
		*/

		var sliderArrayOfObjects = [];
		this.sliderConfigurationArray.forEach(item => {
			var obj = {
				name : item.name,
				value : parseFloat(this.state[item.name]),
				disabled : document.getElementById(item.name).disabled,
			};
			sliderArrayOfObjects.push(obj)
		})
		return sliderArrayOfObjects

	};

	sumArrayOfNumbers = (array) => {
		/*
		Compute the sum of an array of numbers.
		*/
		var result = array.reduce((partialSum, a) => partialSum + a, 0);
		return result
	};

	roundToNearest25 = (number) => {
		/*
		Round a number to the nearest .25.

		Inputs:
		number -- number to be rounded

		Returns:
		roundedNumber -- number rounded to the nearest .25
		*/

		var roundedNumber = parseFloat((Math.round(number * 4) / 4).toFixed(2));

		return roundedNumber
	}

	balanceSliders = (sliderName : string, sliderValue : number) => {
		/*
		When a slider is adjusted, balance the other sliders to ensure
		the sum of all sliders is 100.
		*/

		sliderValue = this.roundToNearest25(sliderValue);

		// check to see if slider/input is disabled -> do nothing if true.
		var sliderDisabled = document.getElementById(sliderName).disabled;
		if (sliderDisabled === true){
			return
		}

		// state value of active slider
		var stateSliderValue = parseFloat(this.state[sliderName]);

		// determine addition or subtraction
		var additionSubtraction = (sliderValue != 100) ? (stateSliderValue < sliderValue) ? 'subtraction' : 'addition' : 'zero';
		
		// difference between state value and slider value
		var sliderDifference = Math.abs(stateSliderValue - sliderValue);

		// grab array of slider objects
		var sliders = this.grabArrayOfSliderObjects();
		var slidersNetCurrent = sliders.filter(item => item.name != sliderName);

		// calc sum of disabled and active sliders net current
		var sumDisabled = 0;
		var sumActive = 0;

		slidersNetCurrent.forEach(item => {
		
			if (item.disabled === true){
				sumDisabled += item.value;
			}
			else {
				sumActive += item.value;
			}
		
		});

		// edgecase active slider checks
		if (sumDisabled + sliderValue > 100){
			sliderValue = 100 - sumDisabled;
		}
		// active sliders net current and disabled
		var slidersNetCurrentDisabled = slidersNetCurrent.filter(item => item.disabled != true);

		// sliders depending on 0 or 100
		var slidersNetCurrentDisabledValueMinMax;
		if (additionSubtraction === 'addition'){
			slidersNetCurrentDisabledValueMinMax = slidersNetCurrentDisabled.filter(item => item.value != 100);
		}
		else {
			slidersNetCurrentDisabledValueMinMax = slidersNetCurrentDisabled.filter(item => item.value != 0);
		}

		var obj = this.helperBalanceSliders(
			slidersNetCurrentDisabledValueMinMax, 
			sliderDifference, 
			additionSubtraction,
			sliderName,
			sliderValue
		);

		this.setState(
			obj,
			() => {
				this.calculateSliderTotals();
			}
		);

	};

	helperBalanceSliders = (
		slidersArrayObjects, 
		difference, 
		additionSubtraction,
		sliderName,
		sliderValue
		) => {

		/*

		Helper function for balanceSliders.

		Arguments:
		slidersArrayObjects -- [{}...] | objects = {name : <sliderName>, value : <sliderValue>}
		difference -- number | difference between state value and slider value
		additionSubtraction -- string | 'addition' or 'subtraction'
		sliderName -- string | name of active slider
		sliderValue -- number | value of active slider

		Returns:
		obj -- {} | object = {<sliderName> : <sliderValue>, ...}

		*/

		// object
		var obj = {};

		// original slider length
		var originalSliderLength = slidersArrayObjects.length;

		// initial distribution
		var perSliderDifference = difference / originalSliderLength;

		// sort sliders
		var sortedSliders = (additionSubtraction === 'addition') ? slidersArrayObjects.sort((a, b) => (a.value < b.value) ? 1 : -1) : slidersArrayObjects.sort((a, b) => (a.value > b.value) ? 1 : -1)

		var i = 1;

		sortedSliders.forEach(item => {

			var removeFromDifference = 0;

			if (additionSubtraction === 'addition'){

				if (item.value + perSliderDifference <= 100){

					obj[item.name] = parseFloat((item.value + perSliderDifference).toFixed(2));
				}

				else {

					obj[item.name] = 100;

				}

			}
			else if (additionSubtraction === 'subtraction'){

				if (item.value - perSliderDifference >= 0){

					obj[item.name] = parseFloat((item.value - perSliderDifference).toFixed(2));

				}

				else {

					obj[item.name] = 0;

				}

			}

			else if(additionSubtraction === 'zero'){

				obj[item.name] = 0;

			}

		});

		obj[sliderName] = this.roundToNearest25(sliderValue);

		var sliderTotals = this.sumArrayOfNumbers(Object.values(obj));

		if (sliderTotals > 100){

			console.log('sliderTotals > 100')

			var difference = sliderTotals - 100;

			var removeDifference = parseFloat((obj[sliderName] - difference).toFixed(2))

			obj[sliderName] = this.roundToNearest25(removeDifference);

		}

		return obj;

	}

	calculateSliderTotals = () => {
		/*
		Calculate the sum of all sliders.
		*/
		var lt = [];
		var sliders = this.grabArrayOfSliderObjects();
		sliders.forEach(item => {
			lt.push(item.value)
		})
		var sumOfAllSliders = this.sumArrayOfNumbers(lt).toFixed(0);

		this.setState({
			sumOfAllSliders : sumOfAllSliders
		})

	}

	scoreButtonClick = () => {
		/*
		User clicks the score button. Kick off scoring process for 
		point and polyline client-side feature layers.
		*/

		// this.hideLayers();

		var layers = Object.keys(this.clientSideFeatureLayers);
		layers.forEach(layerName => {

			this.state.jimuMapView.view.map.addMany([this.clientSideFeatureLayers[layerName]]);

			this.generateCompositeScoreUpdateClientFeatureLayers(layerName);

		});

		this.setState({
			polylineLayerDisabled : false,
			exportButtonDisabled : false,
			polylineLayerVisible : true,
		},
		() => {
			this.clientSideFeatureLayers['scoredLayerPolyline'].visible = true;
		}
		)

	};

	// GENERATE COMPOSITE SCORE
	generateCompositeScoreUpdateClientFeatureLayers = (layerName) => {
		/*
		User has adjusted the sliders and now it is time to compute a composite score.
		*/

		document.getElementById('hiddenButtonLinkDiv').hidden = true;

		var updateFeatures = [];

		this.scoredLayerFeatures[layerName].forEach(item => {

			var feature : object = item.feature;

			var attributes  = feature.attributes;

			var obj = {
				"attributes" : {
					OBJECTID : attributes.OBJECTID,
				}
			};

			var compositeScoreGroups = {
				'composite_score' : [],
				'composite_score_unweighted' : []
			}

			this.sliderConfigurationArray.forEach(item => {

				// add raw metric score to client-side attributes
				obj.attributes[item.raw] = attributes[item.raw];

				// add percent_disadvantaged to client-side attributes
				obj.attributes['percent_disadvantaged'] = attributes['percent_disadvantaged'];

				// add route_id to client-side attributes
				obj.attributes['route_id'] = attributes['route_id'];

				// add normalized fields to client-side attributes
				obj.attributes[item.name] = this.state[item.name];

				// weight normalized fields
				var weight = this.state[item.name];
				// console.log(weight, attributes)
				var weightedValue = weight * attributes[item.name]; // CHANGE TO item.name
				
				// add to composite score array
				compositeScoreGroups.composite_score.push(weightedValue);

				// add to composite score array
				compositeScoreGroups.composite_score_unweighted.push(weightedValue);

			});

			// compute composite scores
			Object.keys(compositeScoreGroups).forEach(item => {

				var cleanArray = compositeScoreGroups[item].filter(item => [NaN, null].includes(item) === false)
				
				var compositeScore = this.sumArrayOfNumbers(cleanArray);

				// weight the composite score using the percent_disadvantaged field
				if (item === 'composite_score'){
					var compositeScoreWeight = (attributes.percent_disadvantaged != null) ? 1 + attributes.percent_disadvantaged : 1;
					compositeScore  = compositeScore * compositeScoreWeight;
				}

				obj.attributes[item] = compositeScore;

			});
			updateFeatures.push(obj);

		});

		this.clientSideFeatureLayers[layerName].applyEdits(
			{
				updateFeatures : updateFeatures
			}
		)
		.then(() => {

			this.generateDynamicRenderer();

		})

	};

	// GENERATE DYNAMIC RENDER
	generateDynamicRenderer = () => {

		// var colorScheme = colorSchemes.default.getSchemeByName(
		// 	{
		// 		name : 'Orange 4',
		// 		geometryType : 'polyline',
		// 		theme : 'high-to-low'
		// 	}
		// );

		// console.log(colorScheme)



		var params = {
			layer : this.clientSideFeatureLayers['scoredLayerPolyline'],
			field : this.state.smartMappingField,
			classificationMethod : this.state.smartMappingClassType,
			numClasses : this.state.smartMappingNumberClasses,
			colorScheme : this.clientSideSmartMappingColorScheme
		};

		colorRendererCreator.default.createClassBreaksRenderer(params)
		.then((response) => {

				this.clientSideFeatureLayers['scoredLayerPolyline'].renderer = response.renderer;

		});

	}

	onSmartMappingNumberClassesChange = (evt : Event) => {
		/*
		Update the smartMappingNumberClasses state variable.

		Inputs:
		evt -- event object
		*/

		var smartMappingNumberClasses = evt.target.valueAsNumber;

		this.setState({
			smartMappingNumberClasses : smartMappingNumberClasses
		},
		() => {

			this.generateDynamicRenderer();
		}
		)

	}

	onSmartMappingFieldChange = (evt : Event) => {
		/*
		Update the smartMappingField state variable.

		Inputs:
		evt -- event object
		*/

		var smartMappingField = evt.target.value;

		this.setState({
			smartMappingField : smartMappingField
		},
		() => {
			this.generateDynamicRenderer();
		}
		);

	}

	onSmartMappingClassTypeChange = (evt : Event) => {
		/*
		Update the smartMappingClassType state variable.

		Inputs:
		evt -- event object
		*/

		var smartMappingClassType = evt.target.value;

		this.setState({
			smartMappingClassType : smartMappingClassType
		},
		() => {
			this.generateDynamicRenderer();
		}
		);

	}

	// EXPORT GEOJSON
	exportGeoJSON = () => {
		/*
		Export GeoJSON files.
		*/

		if (document.getElementById('hiddenButtonLinkDiv').hidden === true){

			var params = {
				where : "1=1",
				outFields : ["*"],
				returnGeometry : true,
				outSpatialReference : { wkid: 4326 }
			};
	
			this.clientSideFeatureLayers.scoredLayerPolyline.queryFeatures(params)
			.then((result) => {
	
				var features = result.features;
				var geoJSON = this.helperExportGeoJson(features);
	
				document.getElementById('downloadPolylines').setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(geoJSON));
				document.getElementById('downloadPolylines').setAttribute('download', 'Sun Cloud Scored Segments.geojson');
	
			});
	
			document.getElementById('hiddenButtonLinkDiv').hidden = false;

		}
		else {

			document.getElementById('hiddenButtonLinkDiv').hidden = true;

		}

	};

	helperExportGeoJson = (features) => {
		/*
		Creates a GeoJSON file from the features passed to it.

		Inputs:
		features -- array of objects

		Returns:
		result -- GeoJSON string

		polyline
		point
		*/

		var geoJSON = { 
			"type": "FeatureCollection",
			"features": []
		}

		features.forEach(item => {

			var coordinates = (item.geometry.type === 'point') ? [item.geometry.x, item.geometry.y] : item.geometry.paths;

			var obj = {
				"type" : "Feature",
				"properties" : item.attributes,
				"geometry" : {
					"type" : (item.geometry.type === 'point') ? 'Point' : 'MultiLineString',
					"coordinates" : coordinates
				}
			};

			geoJSON.features.push(obj)

		});

		var result = JSON.stringify(geoJSON);

		return result



	};

	// EXPORT WEIGHTS
	exportWeights = () => {
		/*
		Export current weight item values to a csv for download.
		*/
		
		var string = '';

		string += `name, weight \n`;

		this.sliderConfigurationArray.forEach(item => {
			let row = `${item.name}, ${this.state[item.name]} \n`;
			string += row;
		})

		var encodedUri = encodeURIComponent(string);
		var link = document.createElement("a");
		link.setAttribute("href", 'data:text/plain;charset=utf-8,' + encodedUri);
		link.setAttribute("download", "SliderWeights.csv");
		document.body.appendChild(link);
		link.click();

	};

	log = () => {
		console.log(this)
	}

	render () {
		return (
			<div className='container-fluid overflow-auto w-100 h-100'>

					{/* log button if in draft mode */}
					{
						this.state.draft && <button className='m-2' onClick={this.log}>Log</button>
					}
			
					{/* score / export buttons */}
					<div className='row mt-2'>

						<div className='col-4'>
							<Button
								className='w-100'
								onClick={this.scoreButtonClick}
								size="default"
								type="secondary"
								disabled={this.state.scoreButtonDisabled}
							>
								Rescore
							</Button>
						</div>

						<div className='col-4'>
							<Button
								className='w-100'
								onClick={this.exportGeoJSON}
								size="default"
								type="secondary"
								disabled={this.state.exportButtonDisabled}
							>
								Export
							</Button>
						</div>

						<div className='col-4'>
							<Button
								className='w-100'
								onClick={this.turnOnOffScoredLayers}
								size="default"
								type="secondary"
								disabled={this.state.polylineLayerDisabled}
							>
								<PolylineOutlined size={'m'}/> {this.state.polylineLayerVisible === true ? 'Hide' : 'Show'}
							</Button>
						</div>

					</div>

					<hr></hr>

					{/* download files */}
					<div id='hiddenButtonLinkDiv' hidden className='row mt-2'>
						
						<div className='col-6'>
							<Button
								size="default"
								type="link"
								className="w-100 text-primary"
								onClick={this.exportWeights}
							>
								Download Weights

							</Button>
						</div>

						<div className='col-6'>
							<Link
								type="link"
								id='downloadPolylines'
							>
								Download Scores
							</Link>
						</div>

					</div>

					{/* smart mapping */}
					<div className='row mt-2'>

						<div className='col-4'>

							<Label>Class Count: {this.state.smartMappingNumberClasses}</Label>
							<Slider
								aria-label="Small"
								min={2}
								max={10}
								step={1}
								value={this.state.smartMappingNumberClasses}
								onChange={this.onSmartMappingNumberClassesChange}
							/>

						</div>

						<div className='col-4'>

							<Label>Field Selection</Label>
							<Select
								onChange={this.onSmartMappingFieldChange}
								value={this.state.smartMappingField}
							>
								<Option value="composite_score">Composite Score</Option>
								<Option value="composite_score_unweighted">Composite Score Unweighted</Option>

							</Select>

						</div>

						<div className='col-4'>

							<Label>Class Type</Label>
							<Select
								onChange={this.onSmartMappingClassTypeChange}
								value={this.state.smartMappingClassType}
							>
								<Option value="equal-interval">Equal interval</Option>
								<Option value="quantile">Quantile</Option>
								<Option value="natural-breaks">Natual Breaks</Option>
							</Select>

						</div>

					</div>

					<hr></hr>
					
					{/* slider content */}
					<div id='slider-container' className='mt-2'>

						<Alert
							className='w-100'
							type="info"
							text={`Slider Sum: ${this.state.sumOfAllSliders}`}
						/>

						{this.createSliders()}

				
					</div>

					{/* load data source Web-Map */}
					{this.props.hasOwnProperty('useMapWidgetIds') &&
						this.props.useMapWidgetIds &&
						this.props.useMapWidgetIds[0] && (
							<JimuMapViewComponent
								useMapWidgetId={this.props.useMapWidgetIds[0]}
								onActiveViewChange={this.onActiveViewChange}
							/>
						)
					}

			</div>
		)
	};
}
