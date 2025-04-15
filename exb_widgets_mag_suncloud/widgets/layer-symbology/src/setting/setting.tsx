import { React, jsx, FormattedMessage } from "jimu-core";
import { AllWidgetSettingProps } from "jimu-for-builder";
import { MapWidgetSelector } from "jimu-ui/advanced/setting-components";
import { DataSourceSelector, AllDataSourceTypes, FieldSelector } from "jimu-ui/advanced/data-source-selector";
import { JimuMapViewComponent, JimuMapView } from 'jimu-arcgis';
import {SettingSection, SettingRow} from 'jimu-ui/advanced/setting-components';
import * as ReactDOM from 'react-dom';

import {
	Select,
  Option,
  Alert,
  Button,
  TextArea
} from 'jimu-ui';

// used for the config file
import {IMConfig} from '../config';
 
export default class Setting extends React.PureComponent{

  state = {
    useMapWidgetIds: ['widget_1'],
    jimuMapView : null,
    selectLayerOptions : [],
    selectedLayerID : null,
    layerKeysSet : []
  }


  defaultLayerKeyOptions = {

  }

  layerKeyOptionSelections = this.defaultLayerKeyOptions;

  componentDidMount = () => {

    this.onMapWidgetSelected(this.props.useMapWidgetIds);

    // set layer-key defaults
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set('layerKeyObject', this.defaultLayerKeyOptions)
    });

  }

  onMapWidgetSelected = (useMapWidgetIds: string[]) => {  
    /*
    User selects a Web-Map as a data source.
    */
    this.props.onSettingChange({
      id: this.props.id,
      useMapWidgetIds: useMapWidgetIds
    });

    this.setState({
      useMapWidgetIds : useMapWidgetIds
    })
    
  };

  onActiveViewChange = (jimuMapView: JimuMapView) => {
		/*
		Load Web-Map DS and set the widget prop w/ jimuMapView
		*/

		if (jimuMapView != null){

      this.setState({
        jimuMapView : jimuMapView
      },
      () => {
        this.createLayerSelectOptions();
      }
      )

		}
	}

  createLayerSelectOptions = () => {
    /*
    Create an array of layer Options and update the Widget state with the array.
    */
		var layers = this.state.jimuMapView.jimuLayerViews;
		var layerArray = Object.keys(layers);
    
    layerArray.sort();

		var selectLayerOptions = [];

    document.getElementById('selectALayer').innerHTML = '';

    var defaultOption = document.createElement('option');
    defaultOption.selected = true;
    defaultOption.disabled = true;
    defaultOption.innerText = 'Select One';
    defaultOption.value= "default";

    document.getElementById('selectALayer').appendChild(defaultOption);

		layerArray.forEach(layer => {

			var layerID = layer;
			var layerData = layers[layer];
			var layerName = layerData.layer.title;
      var layerGeometryType = layerData.layer.geometryType;
      var layerURL = layerData.layer.url;
      var layerPortalID = (layerData.layer.portalItem != undefined) ? layerData.layer.portalItem.id : null;

      var valueJSON = JSON.stringify({
        layerID : layerID,
        layerName : layerName,
        layerGeometryType : layerGeometryType,
        layerURL : layerURL,
        layerPortalID : layerPortalID
      });

			if (layerData.type != 'group'){

        var option = document.createElement('option');
        option.value = valueJSON;
        option.innerText = layerName;

        document.getElementById('selectALayer').appendChild(option);

			}

		})

		this.setState({
			selectLayerOptions : selectLayerOptions
		})
	}

  submitPropsUpdate = () => {
    /*
    Submit a property update to the widget.
    */

    var selectedValue = document.getElementById('selectALayer').value;
    var selectedKeyName = document.getElementById('selectAKey').value;
    
    if (selectedValue === 'default' || selectedKeyName === 'default'){

      alert('Select a Layer and a Key');

    }
    else {

      selectedValue = JSON.parse(selectedValue);
      selectedValue['key'] = selectedKeyName;

      this.layerKeyOptionSelections[selectedKeyName] = JSON.stringify(selectedValue);




      this.props.onSettingChange({
        id: this.props.id,
        config: this.props.config.set('layerKeyObject', this.layerKeyOptionSelections)
      });
      this.props.onSettingChange({
        id: this.props.id,
        config: this.props.config.set('layerKeyObject', this.layerKeyOptionSelections)
      });

      document.getElementById('selectALayer').value='default';
      document.getElementById('selectAKey').value='default';

      var li = <li>{selectedKeyName}</li>

      this.setState({
        layerKeysSet : [...this.state.layerKeysSet, li];
      })

    }

  }

  log = () => {
    console.log(this)
  };

render() {
  return (
    
    <div className="container">
      <div className="row">
        <div className="col-12">

          <button className="btn btn-primary m-2" onClick={this.log}>Log Widget State</button>

          <hr></hr>
          <h3>Select a Datasource</h3>
          
          <MapWidgetSelector useMapWidgetIds={this.props.useMapWidgetIds} onSelect={this.onMapWidgetSelected}/>

          {
            this.state.hasOwnProperty('useMapWidgetIds') &&
            this.state.useMapWidgetIds &&
            this.state.useMapWidgetIds[0] &&
            (
              <JimuMapViewComponent
              useMapWidgetId={this.state.useMapWidgetIds[0]}
              onActiveViewChange={this.onActiveViewChange}
            />
            )
          
          }


          <hr></hr>

          {/* Select a Key */}
          <p className="mt-2">Select a Key</p>
          <select id="selectAKey" className="w-100">

            {/* default */}
            <option value='default' disabled selected>Select One</option>

            {/* scored layer */}
            <option value='sunCloudPerformanceScores'>Sun Cloud Performance Scores</option>

            {/* safety */}
            <option value='safetyPoint'>Safety - Junctions</option>
            <option value='safetyPolyline'>Safety - Road Segments</option>

            {/* assets */}
            <option value='bridgeConditionPoint'>Bridge Condition</option>
            <option value='pavementConditionPolyline'>Pavement Roughness</option>

            {/* mobility */}
            <option value='transitRidershipPolyline'>Transit Ridership</option>
            <option value='travelDemandPolyline'>Travel Demand (2019)</option>
            <option value='futurePlannedRoadwaysPolyline'>Planned Future Roadways (2050)</option>
            <option value='travelTimePolyline'>Reliability and Delay</option>
            <option value='freightFlows'>Freight Flows (2022)</option>
            <option value='freightRoutesPolyline'>Freight Routes</option>

            {/* economic */}
            <option value='disadvantagedUsersPolyline'>Disadvantaged Facility Users</option>
            <option value='broadbandPolygon'>Broadband Coverage</option>
            
            {/* other */}
            <option value='ms2Point'>MS2 Traffic Counts</option>
            <option value='nepaPolygon'>Environmental Indicators (NEPA)</option>
            <option value='j40Polygon'>Justice40 Disadvantaged Tracts</option>
            <option value='tazPolygon'>Traffic Analysis Zones</option>
            <option value='mediansSidewalksPolygon'>Medians and Sidewalks</option>
            <option value='bikeLanesSidewalksPolyline'>Bike Lanes and Sidewalks</option>
            <option value='lrtpPoint'>LRTP Points</option>
            <option value='lrtpPolyline'>LRTP Lines</option>

            {/* boundaries */}
            {/* <option value='countiesPolygon'>Counties: Polygon</option>
            <option value='mpaPolygon'>Municipal Planning Areas: Polygon</option>
            <option value='mpoPolygon'>Municipal Planning Organizations: Polygon</option>
            <option value='cogPolygon'>Council of Governments: Polygon</option>
            <option value='citiesPolygon'>Cities: Polygon</option> */}
            <option value='routesPolyline'>Sun Cloud Routes</option>

          </select>

          {/* Select a Layer */}
          <p className="mt-2">Select a Layer</p>
          <select id="selectALayer" className="w-100">
            <option value='default' disabled selected>Select One</option>
          </select>

          {/* submit update */}
          <p className="mt-2">Save Changes</p>
          <Button type="primary" onClick={this.submitPropsUpdate} >
            Submit Props Update</Button>

          <hr></hr>
          <ul>
            {this.state.layerKeysSet}
          </ul>

        </div>
      </div>
    </div>

  )
  

}

}
