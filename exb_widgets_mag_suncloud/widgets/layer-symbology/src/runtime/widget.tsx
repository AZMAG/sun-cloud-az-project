/*
User has the ability to select predefined symbology renderers that can be applied
to layers.

Authors:
Chapman Munn -- Developer

Date: March 2023 - June 2023
*/

import { 
	React, 
	AllWidgetProps, 
	FeatureLayerDataSource,
	DataSourceManager,
	DataSourceComponent,
	SqlQueryParams
} from 'jimu-core'

import * as ReactDOM from 'react-dom';

import { JimuMapViewComponent, JimuMapView } from 'jimu-arcgis';

import { IMConfig } from '../config'

// icons
import PolygonImage from '../icons/polygon.png';
import PointImage from '../icons/point.png';
import LineImage from '../icons/line.png';
import iconCardOpen from '../icons/eye_open.svg';
import iconCardClosed from '../icons/eye_closed.svg';

import { InfoOutlined } from 'jimu-icons/outlined/suggested/info';
import { WrongOutlined } from 'jimu-icons/outlined/suggested/wrong';

// renderer files
import * as GenerateRenderers from './generateRenderers.js';
import {simpleRenderers} from './renderersSimple.js';
import {fieldUniqueValueInfos} from './renderersFieldUniqueValues.js';
import {fieldClassBreakInfos} from './renderersFieldClassBreaks.js';

// css
import './style.css';

import {
	Select,
	Button,
	Alert,
	Option,
	Label,
	Radio,
	Card,
	CardHeader,
	CardBody,
	CardFooter,
	Icon

} from 'jimu-ui';


export default class Widget extends React.PureComponent<AllWidgetProps<IMConfig>, any> {

	constructor (props) {
		super(props)
	};

	state = {

		// layer cards -> used to create cards
		layerCards : undefined,

		// related to the user selected layer
		selectedLayerID : undefined,
		selectedLayerKey : undefined,
		selectedLayerGeometryType : undefined,
		selectedLayerIndex: undefined,

		// user selected field
		selectedField : undefined,
		selectedFieldRendererType : undefined,

		// see single or multiple layers
		viewSingleLayer : true,

		// holder for feature layer classes
		layers : [],

		// determine if we are in draft mode
		draft : false

	};

	layerFieldOptions = {

		sunCloudPerformanceScores: [
			// {field: 'composite_score', alias: 'Weighted Normalized Score (Default)', type: 'classBreakRenderer'}, 
			{field: 'composite_score_assets', alias: 'Asset Condition Needs Score', type: 'classBreakRenderer'},
			{field: 'composite_score_mobility', alias: 'Mobility Needs Score', type: 'classBreakRenderer'}, 
			{field: 'composite_score_economy', alias: 'Economic Development Needs Score', type: 'classBreakRenderer'},
			{field: 'composite_score_safety', alias: 'Safety Needs Score', type: 'classBreakRenderer'}, 
			// {field: 'composite_score_equity_weighted', alias: 'Needs Score with Disadvantaged User Multiplier', type: 'classBreakRenderer'}
			{field: 'composite_score_unweighted', alias: 'Unweighted Combined Score', type: 'classBreakRenderer'},
			// 15 Performance Measures
			{field: 'injury_rate', alias: 'Serious Injury Rate', type: 'classBreakRenderer'}, 
			{field: 'non_motorized_injuries', alias: 'Bicyclist and Pedestrian Severe Injuries', type: 'classBreakRenderer'}, 
			{field: 'excess_expected_crashes', alias: 'Excess Expected Severe Crashes', type: 'classBreakRenderer'}, 
			{field: 'pavement_pct_poor', alias: 'Average Pavement Roughness (IRI)', type: 'classBreakRenderer'},
			{field: 'bridge_structural_rating', alias: 'Bridge Structural Evaluation Rating', type: 'classBreakRenderer'}, 
			{field: 'bridge_deck_geometry', alias: 'Bridge Deck Geometry', type: 'classBreakRenderer'}, 
			{field: 'lottr', alias: 'Level of Travel Time Reliability', type: 'classBreakRenderer'}, 
			{field: 'avg_delay', alias: 'Daily Delay', type: 'classBreakRenderer'}, 
			{field: 'vc_ratio', alias: 'Volume / Capacity Ratio', type: 'classBreakRenderer'}, 
			{field: 'vmt_change', alias: 'Vehicle Miles Traveled Change 2050', type: 'classBreakRenderer'}, 
			{field: 'transit_overlap', alias: 'Overlap with Transit Route', type: 'classBreakRenderer'}, 
			{field: 'transit_ridership', alias: 'Transit Ridership', type: 'classBreakRenderer'}, 
			{field: 'employment_change', alias: 'Employment Forecasted Change', type: 'classBreakRenderer'}, 
			{field: 'critical_freight', alias: 'Overlap with Critical Freight Route', type: 'classBreakRenderer'}, 
			{field: 'households_no_broadband', alias: 'Households without Broadband', type: 'classBreakRenderer'}
		],

		safetyPoint : [
			// {field :'injury_crashes', alias : 'Severe Injuries', type : 'classBreakRenderer'},
			// {field :'injury_rate', alias : 'Severe Injury Rate', type : 'classBreakRenderer'},
			{field :'fatal_injury_crashes', alias : 'Fatal & Severe Injuries', type : 'classBreakRenderer'},
			{field :'fatal_injury_rate', alias : 'Fatal & Severe Injury Rate', type : 'classBreakRenderer'},
			{field :'non_motorized_fatal_injury', alias : 'Bicyclist and Pedestrian Fatal & Severe Injuries', type : 'classBreakRenderer'},
			{field :'level_of_safety_service_kabc', alias : 'Level of Safety Service', type : 'uniqueValueRenderer'},
		],

		safetyPolyline : [
			// {field :'injury_crashes', alias : 'Severe Injuries', type : 'classBreakRenderer'},
			// {field :'injury_rate', alias : 'Severe Injury Rate', type : 'classBreakRenderer'},
			{field :'fatal_injury_crashes', alias : 'Fatal & Severe Injuries', type : 'classBreakRenderer'},
			{field :'fatal_injury_rate', alias : 'Fatal & Severe Injury Rate', type : 'classBreakRenderer'},
			{field :'non_motorized_fatal_injury', alias : 'Bicyclist and Pedestrian Fatal & Severe Injuries', type : 'classBreakRenderer'},
			{field :'level_of_safety_service_kabc', alias : 'Level of Safety Service', type : 'uniqueValueRenderer'},
		],

		bridgeConditionPoint : [
			{field :'deck_geometry_eval_068', alias : 'Deck Geometry Evaluation Rating', type : 'uniqueValueRenderer'},
			{field :'type', alias : 'Types', type: 'uniqueValueRenderer'}
		],

		transitRidershipPolyline: [
			{field: 'operator', alias : 'Operator', type : 'uniqueValueRenderer'},
			{field: 'avg_daily_rides', alias : 'Average Daily Rides', type : 'classBreakRenderer'},
		],

		travelDemandPolyline: [
			// {field: 'volume_2019', alias: 'Daily Volume 2019 - Layer Field Options', type: 'classBreakRenderer'},
			{field: 'volume_2050', alias: 'Daily Volume 2050', type: 'classBreakRenderer'},
			{field: 'vc_2019', alias: 'Volume/Capacity Ratio 2019', type: 'classBreakRenderer'},
			{field: 'vc_2050', alias: 'Volume/Capacity Ratio 2050', type: 'classBreakRenderer'}
		],

		futurePlannedRoadwaysPolyline: [
			{field: 'volume_2050', alias: 'Daily Volume 2050', type: 'classBreakRenderer'},  // Note: default
			{field: 'capacity_2050', alias: 'Volume/Capacity Ratio 2050', type: 'classBreakRenderer'}

		],

		travelTimePolyline: [
			{field: 'daily_delay', alias: 'Minutes of Daily Delay', type: 'classBreakRenderer'},
			// {field: 'peak_lottr', alias: 'Peak Period LOTTR (alt. colors)', type: 'classBreakRenderer'}
		],

		broadbandPolygon : [
			{field :'category_mobile', alias : 'Mobile Broadband Category', type : 'uniqueValueRenderer'},
			{field :'hh_no_broadband', alias : 'Households Without Broadband', type : 'classBreakRenderer'}
		],

		tazPolygon: [
			{field: 'TOTHH_2019', alias: 'Total households for year 2019', type: 'classBreakRenderer'}, // Note: default
			{field: 'TOTPOP_2019', alias: 'Total population for year 2019', type: 'classBreakRenderer'},
			{field: 'TOTEMP_2019', alias: 'Total employment for year 2019', type: 'classBreakRenderer'},
			{field: 'TOTHH_2050', alias: 'Total households for year 2050', type: 'classBreakRenderer'},
			{field: 'TOTPOP_2050', alias: 'Total population for year 2050', type: 'classBreakRenderer'},
			{field: 'TOTEMP_2050', alias: 'Total employment for year 2050', type: 'classBreakRenderer'}
		],

		// freightFlows: [
		// 	{field: 'freight_trips', alias: 'Freight Flows (2022)', type: 'classBreakRenderer'}
		// ],

	};

	defaultLayerRendererNames = {

		sunCloudPerformanceScores: 'Combined Needs Score',
		safetyPoint: 'Excess Expected High Severity Crashes',
		safetyPolyline: 'Excess Expected High Severity Crashes',
		bridgeConditionPoint: 'Bridge Condition',
		pavementConditionPolyline: 'Pavement Roughness (IRI)',
		transitRidershipPolyline: 'Types',
		travelDemandPolyline: 'Daily Volume 2019',
		futurePlannedRoadwaysPolyline: 'Future Roadways',
		travelTimePolyline: 'Peak Period LOTTR',
		freightFlows: 'Freight Flows',
		freightRoutes: 'Types and Ridership', 
		disadvantagedUsersPolyline: 'Percent Disadvantaged Users', 
		broadbandPolygon: 'Fixed Connection Broadband Category',
		nepaPolygon: 'Environmental Indicators', 
		ms2Point: 'Agency',
		tazPolygon: 'Traffic Analysis Zones',
		j40Polygon: 'Categories',
		mediansSidewalksPolygon: 'Medians and Sidewalks',
		bikeLanesSidewalksPolyline: 'Bike Lanes and Sidewalks',
		lrtpPoint: 'Long Range Projects (Points)',
		lrtpPolyline: 'Long Range Projects',
		routesPolyline: 'Sun Cloud Routes'

	};

	propsConfig = {};

	componentDidMount(){

		// check to see if we are in draft mode
		var urlParams = new URLSearchParams(window.location.search);
		var draft = (urlParams.get('draft') === 'true') ? true : false;

		this.setState({ 
			draft : draft
		});

	}

	// SETUP

	addLayersToStateFromProps = () => {
		/*
	
		Moves layer data from this.props.config to this.state.layers.

		*/

		var keys = Object.keys(this.props.config.layerKeyObject);

		var layers = [];

		if (keys.length === 0){
			this.setState({
				layers : []
			},
			() => {
				alert('This widget needs to be configured.')
			});

		}

		else {

			keys.forEach((key) => {

				var layer = JSON.parse(this.props.config.layerKeyObject[key]);
				layers.push(layer);

			});

			this.setState({
				layers : layers
			},
			() => {
				this.addDefaultRenderersToLayerFieldOptions();
			});

		}

	}

	addDefaultRenderersToLayerFieldOptions = () => {
		/*

		Add default renderers for each item listed in this.state.layers.

		*/

		this.state.layers.forEach(item => {

			/*
			{
				layerID: 'widget_1-dataSource_1-18509498ce4-layer-19', 
				layerName: 'Transit Ridership (2021)', 
				layerGeometryType: 'polyline', 
				layerURL: 'https://services6.arcgis.com/clPWQMwZfdWn4MQZ/arcg…es/Sun_Cloud_Transit_Ridership_2021/FeatureServer', 
				key: 'transitRidershipPolyline'
			}
			*/

			if (this.props.jimuMapView.jimuLayerViews[item['layerID']] != undefined && 'layer' in this.props.jimuMapView.jimuLayerViews[item['layerID']]){

				var layer = this.props.jimuMapView.jimuLayerViews[item['layerID']].layer;

				var renderer = layer.renderer;

				// grab the default renderer name from the defaultLayerRendererNames object
				var alias = 'Default';
				if (item.key in this.defaultLayerRendererNames){

					alias = this.defaultLayerRendererNames[item.key];

				};
				
				var obj = {

					field : 'default',
					alias : alias,
					type : 'default',
					renderer : renderer

				}

				if (item.key in this.layerFieldOptions){

					this.layerFieldOptions[item.key].unshift(obj);

				}
				else {

					this.layerFieldOptions[item.key] = [obj];

				}
			}

			else {

				console.log('Undefined Item: ' + item['key'])
			}

		});

		this.createLayerCards();

	}

	// TURNING THINGS ON AND OFF

	turnOffNonActiveLayers = () => {
		/*
		Turn off all layers in the Web-Map. Leaving all layers w/ type === 'group'
		on.
		*/
		
		var cardBodies = Array.from(document.getElementsByClassName('card-body'));

		var index = 0;

		cardBodies.forEach(item => {

			var visible = (item.hidden === true) ? false : true;

			var data = JSON.parse(item.getAttribute('data'))

			this.turnOnOffSpecificLayer(data.layerID, visible);

			index += 1;

		})

	}

	turnOnOffSpecificLayer = (selectedLayerID, visible) => {
		/*
		Turn on a specific layer.
		*/

		var selectedLayer = this.props.jimuMapView.jimuLayerViews[selectedLayerID];

		if (selectedLayer != undefined){
			selectedLayer.layer.visible = visible;
		}
		else {
			console.log(selectedLayer + ' layer issue.')
		}
		

	}

	turnOffLayersCollapseCards = () => {
		/*
		Hide all card-bodies and turn off all layers. Change card-header icons.
		*/

		var cardBodies = Array.from(document.getElementsByClassName('card-body'));
		cardBodies.forEach(item => {
			
			item.parentElement.getElementsByClassName('jimu-icon')[0].src = iconCardClosed;

			item.hidden = true;
		});

		this.state.layers.forEach(item => {

			/*
				key: "compositeScorePoint"
				layerGeometryType: "point"
				layerID: "widget_1-dataSource_1-18749aa1fca-layer-31-18749aa2211-layer-32"
				layerName: "Intersection Needs"
				layerPortalID: "3e20f8186bc0438ab56b7d003da816bd"
				layerURL: "https://services6.arcgis.com/clPWQMwZfdWn4MQZ/arcgis/rest/services/suncloud_dev2_view/FeatureServer"
			*/

			if (this.props.jimuMapView.jimuLayerViews[item.layerID] != undefined){


				this.props.jimuMapView.jimuLayerViews[item.layerID].layer.visible = false;

			}


		})

	}

	turnOffLayersHideCardBodiesViewSingleLayer = (targetCardBodyData) => {
		/*
		hides all card-bodies and turns off all layers except for the target layer.

		Inputs:
		targetCardBodyData: {
			layerID: 'widget_9-dataSource_2-18631c4db3d-layer-30-18631c4c265-layer-29',
			layerName: 'SunCloud Junctions Safety 2021',
			key: 'safetyPoint'
		}
		*/

		var cardBodies = Array.from(document.getElementsByClassName('card-body'));

		cardBodies.forEach(cardBody => {

			var cardBodyData = JSON.parse(cardBody.getAttribute('data'));

			if (targetCardBodyData.layerID != cardBodyData.layerID){

				cardBody.hidden = true;
				this.turnOnOffSpecificLayer(cardBodyData.layerID, false);
				cardBody.parentElement.getElementsByClassName('jimu-icon')[0].src = iconCardClosed;

			}
		})
	}

	// CARDS AND CARD BODIES

	createLayerCards = () => {
		/*

		Incoming Example:
		{
			layerID: 'widget_9-dataSource_2-18631c4db3d-layer-30-18631c4c265-layer-29', 
			layerName: 'SunCloud Junctions Safety 2021', 
			key: 'safetyPoint'
		}

		*/

		// call createLayerCards

		let layerCards = [];

		const propsConfigLayers = this.state.layers;

		// iterate through layers and build out a card for each
		var index = 0;

		propsConfigLayers.forEach(item => {

			/*
			{
				layerID: 'widget_1-dataSource_1-18749aa2211-layer-32', 
				layerName: 'Intersection Needs', 
				layerGeometryType: 'point', 
				layerURL: 'https://services6.arcgis.com/clPWQMwZfdWn4MQZ/arcgis/rest/services/suncloud_dev2_view/FeatureServer', 
				key: 'compositeScorePoint'
			}

			*/

			if (this.props.jimuMapView.jimuLayerViews[item.layerID] != undefined){

				item['index'] = index;

				// assign icon to layer
				var icon;
				if (item.layerGeometryType === 'point'){
					icon = PointImage;
				}
				else if (item.layerGeometryType === 'polyline'){
					icon = LineImage;
				}
				else { 
					icon = PolygonImage;
				}
	
				// card-body open on card creation
				var hidden = (this.props.jimuMapView.jimuLayerViews[item.layerID].layer.visible === true) ? false : true;
	
				// icon
				var openCloseIcon = (hidden === true) ? iconCardClosed : iconCardOpen;

				// portal item url
				{/* 

					Example: https://azgeo.maps.arcgis.com/home/item.html?id=fdb09b5629514b6fadea59c86b764045
				
					this.props.portalUrl = "https://azgeo.maps.arcgis.com"
					item.layerPortalID = '3e20f8186bc0438ab56b7d003da816bd'

					`${this.props.portalUrl}/home/item.html?id=${item.layerPortalID}`;
				
				*/}
				item['link'] = `${this.props.portalUrl}/home/item.html?id=${item.layerPortalID}`;
	
				// create radio buttons
				var radioButtons = this.createRadioButtons(item.key, 0);
	
				var element : HTMLElement = (
	
					<Card
						className="mt-2"
					>
						
						{/* card header contains expansion button */}
						<CardHeader>
	
							<div className='row'>
	
								{/* open/close card */}
								<div className='col p-0'>

									<Label className='mb-0'>
										
										<span>
											<Button
												aria-label="Button"
												icon
												onClick={this.layerCardOpenClose}
												size="default"
											>
												<Icon
													color='green'
													icon={openCloseIcon}
													size="l"
												/>
											</Button>

										</span>

										<span className='layer-title ml-2 align-middle'>{item.layerName}</span>

									</Label>

									{/* portal item source link button */}
									<span className='float-right mt-1'>

										<Button
											size="small"
											type="link"
											href={item.link}
											target='_blank'
										>
											<InfoOutlined size='m' color='black'/>
										</Button>

									</span>

								</div>

							</div>

						</CardHeader>
	
						<CardBody
							hidden={hidden}
							data={JSON.stringify(item)}
						>
	
							{radioButtons}
	
						</CardBody>
	
					</Card>
				)
	
				layerCards.push(element);
	
				index += 1;

			}

			else {

				console.log(`Error: ${item.key}`)

			}



		})

		this.setState({layerCards : layerCards})

	}

	layerCardOpenClose = (elm : React.ChangeEvent<HTMLInputElement>) => {
		/*
		User clicks on a layer card.
		
		This function:
		- turns off all data layers;
		- turns on the selected layer;
		- finds the associated elm card-body;
		- extracts JSON data contained w/in the card-body;
		- sets widget state parameters; and
		- creates radio buttons and renders them.

		{
			layerID: 'widget_1-dataSource_1-18509498ce4-layer-19', 
			layerKey: 'transitRidershipPolyline', 
			layerIndex: 6, 
			layerGeometryType: 
			'polyline'
		}

		Inputs:
		elm -- the element clicked (button)
		*/

		var targetElm = elm.target;

		// extract card information
		var cardBody = this.findElementCardBodyFromClick(targetElm);
		var cardBodyData = this.extractCardBodyData(cardBody);

		// active card body
		var cardBodyHidden = cardBody.hidden;
		cardBody.hidden = (cardBodyHidden === true) ? false : true;

		// card icon
		var iconTargetElement = (targetElm.children[0].getAttribute('class') === 'jimu-icon') ? targetElm.children[0] : targetElm.children[0].firstChild;
		
		if (cardBodyHidden === true){
			iconTargetElement.src = iconCardOpen;
		}
		else{
			iconTargetElement.src = iconCardClosed;
		}

		// turn off layer if card is deactivated
		if (cardBody.hidden === true){

			this.turnOnOffSpecificLayer(cardBodyData.layerID, false);

			this.setState({
				selectedLayerID           : cardBodyData.layerID,
				selectedLayerKey          : cardBodyData.layerKey,
				selectedLayerGeometryType : cardBodyData.layerGeometryType,
				selectedLayerIndex        : cardBodyData.layerIndex
			});

		}

		else {

			this.setState({
				selectedLayerID : cardBodyData.layerID,
				selectedLayerKey : cardBodyData.layerKey,
				selectedLayerGeometryType : cardBodyData.layerGeometryType,
				selectedLayerIndex: cardBodyData.layerIndex
			},
			
			() => {

				this.turnOnOffSpecificLayer(cardBodyData.layerID, true);
				this.turnOffNonActiveLayers();

			});

		}

		if (this.state.viewSingleLayer === true){
			this.turnOffLayersHideCardBodiesViewSingleLayer(cardBodyData);
		}

	}

	findElementCardBodyFromClick = (elm) => {
		/*
		Find a card-body contained in a jimu-card from an element.

		Inputs:
		elm -- element

		Returns:
		selectedCardBody -- element
		*/

		var parentCard = elm.closest('.jimu-card');
		var selectedCardBody = parentCard.querySelector('.card-body');

		return selectedCardBody

	}

	extractCardBodyData = (cardBody) => {
		/*
		Extract attribute data from a card-body.

		Inputs:
		cardBody -- element to extract data from

		Returns:
		result -- object

		{
			layerID : data.layerID,
			layerKey : data.key,
			layerIndex : data.index
		}
		*/

		var data = JSON.parse(cardBody.getAttribute('data'));

		var result = {
			layerID : data.layerID,
			layerKey : data.key,
			layerIndex : data.index,
			layerGeometryType : data.layerGeometryType
		}

		return result

	}

	// RADIO BUTTONS

	createRadioButtons = (selectedLayerKey : string, checkedIndex : number) => {
		/*
		Create radio buttons elements.

		Inputs:
		key -- string (safetyPoint, sunCloudRoutesPolyline, etc.)

		Returns:
		fieldRadioButtons -- array of Radio options || false if there is an issue creating Radio options.
		*/

		// check to make sure that fields are available for the selected layer

		if (selectedLayerKey in this.layerFieldOptions){

			var fieldRadioButtons = [];

			var availableFieldsForSymbology = this.layerFieldOptions[selectedLayerKey];

			var i : number = 0;

			availableFieldsForSymbology.forEach(item => {

				item['index'] = i;

				var radioElm = (
					<div>
						<Label
							className='p-0 m-0'
						> 
							<Radio 
								checked={checkedIndex === i}
								onChange={(evt, checked) => this.radioButtonCheck(evt, checked, i)}
								index={i}
							/>
							<span className='ml-2'>{item.alias}</span>
						</Label>
					</div>
				)

				fieldRadioButtons.push(radioElm);

				i += 1;

			});

			return fieldRadioButtons

		}

		// fields are not available for the layer
		else {

			return false

		}


	}

	radioButtonCheck = (evt: React.ChangeEvent<HTMLInputElement>) => {
		/*
		User checks a symbology radio button. 
		
		This function:
		- updates widget state items; and
		- rerenderes the widget radio buttons based on the selected radio.

		Inputs:
		evt -- react change element
		*/

		var targetElm  = evt.target;

		// extract card information
		var cardBody = this.findElementCardBodyFromClick(targetElm);
		var cardBodyData = this.extractCardBodyData(cardBody);
		/*
			{
				layerID: 'widget_1-dataSource_1-18749aa2211-layer-32', 
				layerKey: 'compositeScorePoint', 
				layerIndex: 0, 
				layerGeometryType: 'point'
			}
		*/

		// extract field information
		var selectedFieldIndex = parseInt(targetElm.getAttribute('index'));
		/*
			1
		*/

		// layer and field data
		var layerFieldData = this.layerFieldOptions[cardBodyData.layerKey][selectedFieldIndex];
		/*
			{
				field: 'composite_score_assets', 
				alias: 'Asset Condition Needs Score', 
				type: 'classBreakRenderer', 
				index: 1
			}

		*/

		this.setState({

			selectedField: layerFieldData.field,
			selectedFieldRendererType: layerFieldData.type,

			selectedLayerID : cardBodyData.layerID,
			selectedLayerKey : cardBodyData.layerKey,
			selectedLayerGeometryType : cardBodyData.layerGeometryType,
			selectedLayerIndex: cardBodyData.layerIndex

		},
		() => {

			var fieldRadioButtons = this.createRadioButtons(this.state.selectedLayerKey, selectedFieldIndex);
			
			if (fieldRadioButtons !== false){

				ReactDOM.render(
					fieldRadioButtons,
					cardBody
				);

				this.generateRenderer();

			}

			else {

				console.log('Fields for this layer have not been defined.');

			}


		})
	}

	toggleViewSingleLayer = (evt: React.ChangeEvent<HTMLInputElement>) => {

		var target = evt.target;
		var name = target.name;
		var checked;

		if (name === 'viewSingleLayer'){
			checked = true;
		}
		else {
			checked = false;
		}

		this.setState({
			viewSingleLayer : checked
		},
		() => {
			this.turnOffLayersCollapseCards();
		}
		)

	}

	// RENDERERS

	generateRenderer = () => {
		/*
		Create a renderer to apply to the selected layer.


		selectedField: "default"
		selectedFieldRendererType: "default"
		selectedLayerGeometryType: "point"
		selectedLayerID: "widget_1-dataSource_1-18749aa2211-layer-32"
		selectedLayerIndex: 0
		selectedLayerKey: "compositeScorePoint"
		*/

		if (this.state.selectedFieldRendererType === 'default'){

			var defaultRenderer = this.layerFieldOptions[this.state.selectedLayerKey][0].renderer;
			console.log(defaultRenderer)
			this.applyRendererToLayer(defaultRenderer)

		}

		else {

			// create GenerateRenderer class instance and populate parameters
			var GenerateRenderer = new GenerateRenderers.GenerateRenderer();
			GenerateRenderer.selectedField = this.state.selectedField;
			GenerateRenderer.selectedFieldRendererType = this.state.selectedFieldRendererType;
			GenerateRenderer.selectedLayerGeometryType = this.state.selectedLayerGeometryType;
			GenerateRenderer.selectedLayerKey = this.state.selectedLayerKey;

			// determine the Esri symbol type to apply to the layer
			GenerateRenderer.determineEsriSymbolType();

			// generate a Simple Renderer
			if (GenerateRenderer.selectedFieldRendererType === 'simpleRenderer'){

				if (GenerateRenderer.selectedLayerKey in simpleRenderers){

					var simpleRenderer = simpleRenderers[GenerateRenderer.selectedLayerKey];

					if (simpleRenderer != undefined){
		
						simpleRenderer.symbol.type = GenerateRenderer.esriSymbolType;
			
						this.applyRendererToLayer(simpleRenderer);
		
					}
					else { 
						alert('Class breaks have not been defined.');
					}

				}
				else {
					alert('Renderer info has not been defined for this simple renderer layer.');
				}

			}

			// generate a class break renderer
			else if (GenerateRenderer.selectedFieldRendererType === 'classBreakRenderer'){

				if (GenerateRenderer.selectedLayerKey in fieldClassBreakInfos){

					if (GenerateRenderer.selectedField in fieldClassBreakInfos[GenerateRenderer.selectedLayerKey]){

						var classBreakInfos = fieldClassBreakInfos[GenerateRenderer.selectedLayerKey][GenerateRenderer.selectedField]

						if (classBreakInfos != undefined){
			
							classBreakInfos.forEach(element => {
								element.symbol.type = GenerateRenderer.esriSymbolType;
							});

							if(GenerateRenderer.selectedLayerGeometryType == "point") {
								classBreakInfos.forEach(element => {
									if(element.symbol.size == undefined) {
										element.symbol.size = 4;
									}
								});
							}

							else if(GenerateRenderer.selectedLayerGeometryType == "polyline") {
								classBreakInfos.forEach(element => {
									if(element.symbol.width == undefined) {
										element.symbol.width = 1.5;
									}
								});
							}

							GenerateRenderer.classBreakInfos = classBreakInfos;
							
							var rendererToApply = GenerateRenderer.generateClassBreakRenderer();
				
							this.applyRendererToLayer(rendererToApply);
			
						}
						else { 
							alert('Class breaks have not been defined.');
						}

					}
					else {
						alert('Renderer info has not been defined for field:' + GenerateRenderer.selectedField);
					}

				}
				else {
					alert('Renderer info has not been defined for this class breaks layer.');
				}

			}

			// generate a uniqueValueRenderer
			else if (GenerateRenderer.selectedFieldRendererType === 'uniqueValueRenderer'){

				if (GenerateRenderer.selectedLayerKey in fieldUniqueValueInfos){

					if (GenerateRenderer.selectedField in fieldUniqueValueInfos[GenerateRenderer.selectedLayerKey]){

						var uniqueValueInfos = fieldUniqueValueInfos[GenerateRenderer.selectedLayerKey][GenerateRenderer.selectedField];

						if(uniqueValueInfos != undefined){
		
							uniqueValueInfos.forEach(element => {
								element.symbol.type = GenerateRenderer.esriSymbolType;
							});
				
							GenerateRenderer.uniqueValueInfos = uniqueValueInfos;
							
							var rendererToApply = GenerateRenderer.generateUniqueValueRenderer();

							// unsure why this doesn't populate automatically from the field alias ... it should!
							// rendererToApply.legendOptions = { title: "test" };

							this.applyRendererToLayer(rendererToApply);
			
						}
						else {
							alert('Unique values have not been defined.');
						}					

					}
					else {
						alert('Renderer info has not been defined for this field.');
					}

				}
				else {
					alert('Renderer info has not been defined for this unique values layer.');
				}

			}

		}



	}

	applyRendererToLayer = (rendererToApply) => {
		/*
		Apply a renderer to a layer based on the selected field.
		*/

		this.props.jimuMapView.jimuLayerViews[this.state.selectedLayerID].layer.renderer = rendererToApply;
		
	}


	// DATA SOURCES

	onActiveViewChange= (jimuMapView: JimuMapView) => {
		/*
		Load Web-Map DS and set the widget prop w/ jimuMapView
		*/
		
		if (jimuMapView != null){

			this.props.jimuMapView = jimuMapView;

			this.addLayersToStateFromProps();

		}
	}




	// TEST

	filterLayer = () => {
		alert('Feature coming!')
	}

	log = () => {
		console.log(this)
	}

	// RENDER

	render () { 
		return (

			<div className='overflow-auto w-100 h-100 p-2'>
				
				{/* log button if in draft mode */}
				{
					this.state.draft && <button className='m-2' onClick={this.log}>Log</button>
				}

				{/* card visibility options */}
				

				<div className='border p-1 form-inline'>

					{/* 
					
					consider: a radio button at the top with options for "OR" and "AND". 
					OR would turn off all existing layers whenever a new layer was selected (basically, how things worked before). 
					AND would allow multiple layers to be turned on at the same time (how things work now). 
					OR should be default behavior. Displaying multiple layers at the same time often isn't useful if both are line layers.

					*/}
					
					<div>
						<p className='mb-0'>Display:&nbsp;</p>
					</div>

					<div className='form-inline'>
						<Label className='mr-3'>
							<Radio 
								checked={this.state.viewSingleLayer}
								onChange={(evt, checked) => this.toggleViewSingleLayer(evt, checked)}
								name='viewSingleLayer'
							/>
								<span className='ml-2'>One at a Time</span>
						</Label>

						<Label>
							<Radio 
								checked={!this.state.viewSingleLayer}
								onChange={(evt, checked) => this.toggleViewSingleLayer(evt, checked)}
								name='viewMultipleLayers'
							/>
							<span className='ml-2'>Multiple (Advanced)</span>
						</Label>
					</div>

				</div>

				{/* layer cards */}
				<div className='mt-2'>
					<div className=''>
						{
							this.state.layerCards
						}
					</div>
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
	}
}
