/*
A widget that allows users to zoom to the extent of a selected geometry.
Additionally, underlying data layers are filtered based on the selected
geometry extent.

Authors:
Chapman Munn -- Developer -- munn@highstreetconsulting.com

Date: March 2023 - June 2023
*/

import { 
	React, 
	AllWidgetProps,

} from 'jimu-core';

import { JimuMapViewComponent, JimuMapView } from 'jimu-arcgis';

import { IMConfig } from '../config'

import * as watchUtils from "esri/core/watchUtils.js";

// lodash
import _ from 'lodash';

// css
import './style.css';

// UI components
import {
	Button,
	Alert,
	Loading,
	Label,
	Select,
	Option
} from 'jimu-ui';

import Graphic from 'esri/Graphic';

import { CloseCircleOutlined } from 'jimu-icons/outlined/editor/close-circle';
import { InfoOutlined } from 'jimu-icons/outlined/suggested/info'

export default class Widget extends React.PureComponent<AllWidgetProps<IMConfig>, any> {setState: any;


	constructor (props) {
		super(props)
	};

	state = {

		// web-map
		jimuMapView : null,

		// major polygon options
		majorPolygonOptions : [],
		majorPolygonOptionKey : undefined,
		majorPolygonOptionURL : 'default',
		majorPolygonOptionFeatureLayer : undefined,
		majorPolygonOptionHumanName : undefined,

		// minor polygon options
		minorPolygonOptions : [<Option value='default'>Select One</Option>],
		minorPolygonOptionName : 'default',

		// geometry
		extentGeometry : undefined,
		defaultExtent : undefined,

		// loading modal
		loadingOpen : true,

		// determine if we are in draft mode
		draft : false
	
	};

	polygonLayers = {};

	filterLayers = [];

	graphicSymbology = 	{
		type: "simple-fill",
		color: [51, 51, 204, 0.9],
		style: "none",
		outline: {
			color: [255, 145, 0],
			width: 2
		}
	}
	
	componentDidMount() {
		/*
		After the widget has mounted, set state variables.
		*/

		// check to see if we are in draft mode
		var urlParams = new URLSearchParams(window.location.search);
		var draft = (urlParams.get('draft') === 'true') ? true : false;

		this.setState({
			title : this.props.config.title,
			draft : draft
		});

		window.onpopstate = (e) => {
			console.log(e)
		};

	};

	helperHandlePropsConfigLayers = () => {
		/*
		Helper function to handle the props.config.layers object. Create major polygon dropdown options.

		Example of props.config.layers object:
		{
			"layerID": "widget_1-dataSource_1-185f4c44c21-layer-24-187918ea50b-layer-27-187918ea62c-layer-32",
			"layerName": "Cities",
			"layerGeometryType": "polygon",
			"layerURL": "https://services6.arcgis.com/clPWQMwZfdWn4MQZ/arcgis/rest/services/Sun_Cloud_Jurisdictional_Boundaries/FeatureServer/0",
			"layerDataSourceID": "dataSource_1-185f4c44c21-layer-24-187918ea50b-layer-27-187918ea62c-layer-32",
			"key": "citiesPolygon"
		}
		*/

		var majorPolygonOptions = [];

		[
			this.props.config.citiesPolygon,
			this.props.config.cogPolygon,
			this.props.config.mpoPolygon,
			this.props.config.mpaPolygon,
			this.props.config.countiesPolygon
		]
		.forEach((item) => {

			if (item !== undefined){

				var data = JSON.parse(item);

				let featureLayer = this.state.jimuMapView.jimuLayerViews[data.layerID];

				if (featureLayer != undefined){

					data['featureLayer'] = this.state.jimuMapView.jimuLayerViews[data.layerID].layer;

					this.polygonLayers[data.key] = data;
		
					var elm = <Option name={data.key} value={data.layerURL}>{data.layerName}</Option>
					majorPolygonOptions.push(elm)

				}

			}

		});

		this.setState({
			majorPolygonOptions : majorPolygonOptions
		})

	};

	selectMajorPolygonOption = (elm, evt) => {
		/*
		User selects an option from the boundary Select.

		{
			"name": "citiesPolygon",
			"value": "https://services6.arcgis.com/clPWQMwZfdWn4MQZ/arcgis/rest/services/Sun_Cloud_Jurisdictional_Boundaries/FeatureServer/1",
			"children": "Cities"
		}
		*/

		var majorPolygonOptionKey = evt.props.name;
		var majorPolygonOptionURL = evt.props.value;
		var majorPolygonOptionHumanName = evt.props.children;
		var majorPolygonOptionFeatureLayer = this.polygonLayers[majorPolygonOptionKey].featureLayer;

		this.setState({
			majorPolygonOptionKey : majorPolygonOptionKey,
			majorPolygonOptionURL : majorPolygonOptionURL,
			majorPolygonOptionHumanName : majorPolygonOptionHumanName,
			majorPolygonOptionFeatureLayer : majorPolygonOptionFeatureLayer,
			minorPolygonOptionName : 'default'
		},
		
		()=> {

			this.state.jimuMapView.view.graphics = [];
			this.state.jimuMapView.view.extent = this.state.defaultExtent;

			this.state.majorPolygonOptionFeatureLayer.definitionExpression = '1=1';
			this.state.majorPolygonOptionFeatureLayer.visible = false;
			
			this.getMinorPolygonOptions();

		});

	};

	getMinorPolygonOptions = () => {
		/*
		Load the minor polygon options from the selected major polygon option.
		*/

		var minorPolygonOptions = [];

		var params = {
			where : '1=1',
			outFields : ["name"],
			returnDistinctValues: true,
			f : 'json'
		}

		this.state.majorPolygonOptionFeatureLayer.queryFeatures(params).then((results) => {

			if ('features' in results){

				var features = results.features;
				var options = features.map(item => {return item.attributes['name']});

				var defaultOption = <Option selected disabled value='default'>Select One</Option>
				minorPolygonOptions.push(defaultOption);

				options.forEach(element => {
					
					var elm = <Option name={element} value={element}>{element}</Option>

					minorPolygonOptions.push(elm);

				});

				
				this.setState({
					minorPolygonOptions : minorPolygonOptions
				})

			}

		})

	};

	selectMinorPolygonOption = (elm, evt) => {
		/*
		User selects an option from the minor polygon Select.

		Kick off the zoom and filter functions.
		*/

		this.collectLayersFromJimuMapView();

		var minorPolygonOptionName = evt.props.name;

		this.setState({
			minorPolygonOptionName : minorPolygonOptionName
		},
		
		()=> {

			this.zoomZoomZoom();

		});

	};

	zoomZoomZoom = () => {
		/*
		Zoom to the selected minor polygon option extent.
		*/

		this.setState({
			loadingOpen : false
		},
		
		() => {

			var params = {
				where : `name = '${this.state.minorPolygonOptionName}'`,
				returnGeometry : true,
				f : 'json'
			};

			this.state.majorPolygonOptionFeatureLayer.queryFeatures(params).then((results) => {

				var feature = results.features[0];

				var extentGeometry = feature.geometry;

				this.setState({
					extentGeometry : extentGeometry
				},
				() => {

					this.state.jimuMapView.view.goTo(extentGeometry);
					this.handleShortTermGraphics();
					this.filterFilterFilter(extentGeometry);

					this.state.majorPolygonOptionFeatureLayer.definitionExpression = '1=1';
					this.state.majorPolygonOptionFeatureLayer.visible = false;

				});

			});


		});

	};

	filterFilterFilter = (extent) => {
		/*
		Filter each visible layer contained in the filterLayers array with this.state.extentGeometry.
		*/

		var i = 0;
		var visibleLayers = this.filterLayers.filter(item => item.layer.visible === true);
		var visibleLayersLength = visibleLayers.length;

		visibleLayers.forEach(item => {

			var layer = item.layer;
			var oidField = layer.objectIdField;

			var params = {
				geometry : extent,
				returnGeometry : false,
				f : 'json',
				spatialRelationship: "contains",
				distance: 0,
			};

			layer.queryObjectIds(params)
			.then((results) => {

				var definitionExpression = `${oidField} IN (${results})`;
				layer.definitionExpression = definitionExpression;

				i += 1;

				if (i === visibleLayersLength) {

					this.state.jimuMapView.view.whenLayerView(layer).then((layerView) => {
						watchUtils.default.whenFalseOnce(layerView, "updating", (upDone) => {
							this.setState({
								loadingOpen : true
							});
		
						});
					});
				}

			});

		});

	};

	handleShortTermGraphics = () => {
		/*
		Create a polygon graphic representing the selected minor polygon option.
		Remove all other graphics from the map, then add the new graphic.
		*/

		this.state.jimuMapView.view.graphics = [];

		var polygonGraphic = new Graphic({
			geometry: this.state.extentGeometry,
			symbol: this.graphicSymbology
		});

		this.state.jimuMapView.view.graphics.add(polygonGraphic);

	}

	collectLayersFromJimuMapView = () => {
		/*
		Collect all the layers from the web-map and store them in the 
		filterLayers array for use in filtering.

		temp1.state.jimuMapView.view.layerViews.items[temp1.state.jimuMapView.view.layerViews.items.length - 1].layer


		temp1.jimuMapView.view.layerViews.items.filter(item => item.layer.test === false)
		*/

		this.filterLayers = [];

		var layers = Object.keys(this.state.jimuMapView.jimuLayerViews);

		layers.forEach(item => {

			var layer = this.state.jimuMapView.jimuLayerViews[item];

			if (layer.type === 'feature'){

				this.filterLayers.push(layer);

			}

		});

		this.collectClientSideScoredLayerFromJimuMapView();

	};

	collectClientSideScoredLayerFromJimuMapView = () => {

		var clientSideLayerArray = this.state.jimuMapView.view.layerViews.items.filter(item => item.layer.clientSideLayer === true)

		if (clientSideLayerArray.length > 0){

			this.filterLayers.push(clientSideLayerArray[0]);

		}

	}

	clearFiltersZoomOut = () => {
		/*
		Set a definition expression of 1=1 on each layer in the filterLayers array.
		*/

		this.filterLayers.forEach(item => {

			var layer = item.layer;

			layer.definitionExpression = '1=1';

		});

		this.state.jimuMapView.view.goTo(this.state.defaultExtent);

		this.setState({
			majorPolygonOptionURL : 'default',
			minorPolygonOptions : [<Option value='default'>Select One</Option>],
			minorPolygonOptionName : 'default',
			majorPolygonOptionHumanName : undefined
		},
		() => {
			this.state.jimuMapView.view.graphics = [];
		})

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
					defaultExtent : jimuMapView.view.extent
				},
				() => {

					this.helperHandlePropsConfigLayers();

				}
			)

		}
	};


	log = () => {
		console.log(this)
	}

	render () {

		return (
			<div className='container-fluid'>

				{/* log button if in draft mode */}
				{
					this.state.draft && <button className='m-2' onClick={this.log}>Log</button>
				}

				<div className='row m-0'>
					<h2>{this.state.title}</h2>

					<div id='loadingColumn' className='float-right' hidden={this.state.loadingOpen}>
						<Loading
							type="DONUT"
						/>
					</div>

				</div>

				
				<p className='mb-1 font-weight-bolder'>Apply a filter to currently visible layer(s):</p>


				<div className='row'>

					<div className='col-6'>

						<Label className='mb-0'>Boundary Type:</Label>

						<Select
							id='majorPolygonSelect'
							useFirstOption={true}
							onChange={this.selectMajorPolygonOption}
							value={this.state.majorPolygonOptionURL}
						>
							[<Option value='default'>Select One</Option>]

							{
								this.state.majorPolygonOptions
							}

						</Select>

					</div>

					<div className='col-6'>

						<Label className='mb-0'>Targeted Boundary:</Label>
						<Select
							onChange={this.selectMinorPolygonOption}
							value={this.state.minorPolygonOptionName}
						>

							{this.state.minorPolygonOptions}

						</Select>
						
					</div>

				</div>

				<button className='mt-2' onClick={this.clearFiltersZoomOut} icon>
					<CloseCircleOutlined size='m'/>&nbsp;Clear
				</button>


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
