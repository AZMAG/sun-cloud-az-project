import { React, jsx, FormattedMessage } from "jimu-core";
import { AllWidgetSettingProps } from "jimu-for-builder";
import { MapWidgetSelector } from "jimu-ui/advanced/setting-components";
import { DataSourceSelector, AllDataSourceTypes, FieldSelector } from "jimu-ui/advanced/data-source-selector";
import { JimuMapViewComponent, JimuMapView } from 'jimu-arcgis';
import {SettingSection, SettingRow} from 'jimu-ui/advanced/setting-components';
import * as ReactDOM from 'react-dom';

import {
	TextInput,
  Button
} from 'jimu-ui';

// used for the config file
import {IMConfig} from '../config';
 
export default class Setting extends React.PureComponent{

  state = {
    useMapWidgetIds: ['widget_1'],
    jimuMapView : null,
    layerKeysSet : []
  }

  defaultPropsConfig = {

    "title": "Zoom Test",
    "citiesPolygon": "{\"layerID\":\"widget_1-dataSource_1-185f4c44c21-layer-24-187918ea50b-layer-27-187918ea62c-layer-32\",\"layerName\":\"Cities\",\"layerGeometryType\":\"polygon\",\"layerURL\":\"https://services6.arcgis.com/clPWQMwZfdWn4MQZ/arcgis/rest/services/Sun_Cloud_Jurisdictional_Boundaries/FeatureServer/1\",\"layerDataSourceID\":\"dataSource_1-185f4c44c21-layer-24-187918ea50b-layer-27-187918ea62c-layer-32\",\"key\":\"citiesPolygon\"}",
    "cogPolygon": "{\"layerID\":\"widget_1-dataSource_1-185f4c44c21-layer-24-187918ea50b-layer-27-187918ea62c-layer-31\",\"layerName\":\"Councils of Government\",\"layerGeometryType\":\"polygon\",\"layerURL\":\"https://services6.arcgis.com/clPWQMwZfdWn4MQZ/arcgis/rest/services/Sun_Cloud_Jurisdictional_Boundaries/FeatureServer/2\",\"layerDataSourceID\":\"dataSource_1-185f4c44c21-layer-24-187918ea50b-layer-27-187918ea62c-layer-31\",\"key\":\"cogPolygon\"}",
    "mpoPolygon": "{\"layerID\":\"widget_1-dataSource_1-185f4c44c21-layer-24-187918ea50b-layer-27-187918ea62b-layer-30\",\"layerName\":\"Metropolitan Planning Organizations\",\"layerGeometryType\":\"polygon\",\"layerURL\":\"https://services6.arcgis.com/clPWQMwZfdWn4MQZ/arcgis/rest/services/Sun_Cloud_Jurisdictional_Boundaries/FeatureServer/3\",\"layerDataSourceID\":\"dataSource_1-185f4c44c21-layer-24-187918ea50b-layer-27-187918ea62b-layer-30\",\"key\":\"mpoPolygon\"}",
    "mpaPolygon": "{\"layerID\":\"widget_1-dataSource_1-185f4c44c21-layer-24-187918ea50b-layer-27-187918ea62b-layer-29\",\"layerName\":\"Municipal Planning Areas\",\"layerGeometryType\":\"polygon\",\"layerURL\":\"https://services6.arcgis.com/clPWQMwZfdWn4MQZ/arcgis/rest/services/Sun_Cloud_Jurisdictional_Boundaries/FeatureServer/4\",\"layerDataSourceID\":\"dataSource_1-185f4c44c21-layer-24-187918ea50b-layer-27-187918ea62b-layer-29\",\"key\":\"mpaPolygon\"}",
    "countiesPolygon": "{\"layerID\":\"widget_1-dataSource_1-185f4c44c21-layer-24-187918ea50b-layer-27-187918ea62a-layer-28\",\"layerName\":\"Counties\",\"layerGeometryType\":\"polygon\",\"layerURL\":\"https://services6.arcgis.com/clPWQMwZfdWn4MQZ/arcgis/rest/services/Sun_Cloud_Jurisdictional_Boundaries/FeatureServer/5\",\"layerDataSourceID\":\"dataSource_1-185f4c44c21-layer-24-187918ea50b-layer-27-187918ea62a-layer-28\",\"key\":\"countiesPolygon\"}"
  
  }

  componentDidMount = () => {

    this.onMapWidgetSelected(this.props.useMapWidgetIds);

    // set default props
    Object.keys(this.defaultPropsConfig).forEach((key) => {

      this.props.onSettingChange({
        id: this.props.id,
        config: this.props.config.set(key, this.defaultPropsConfig[key])
      });

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
        this.sendJimuMapViewToProps();
        this.createLayerSelectOptions();
      }
      )

		}
	}

  sendJimuMapViewToProps = () => {
      this.props.onSettingChange({
        jimuMapView: this.state.jimuMapView
      });
  }

  createLayerSelectOptions = () => {
    /*
    Create an array of layer Options and update the Widget state with the array.
    */
		var layers = this.state.jimuMapView.jimuLayerViews;
		var layerArray = Object.keys(layers);

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
      var layerURL = layerData.layer.url + '/' + layerData.layer.layerId; // multiple layers in same feature layer.
      var layerDataSourceID = layerData.layerDataSourceId;

      var valueJSON = JSON.stringify({
        layerID : layerID,
        layerName : layerName,
        layerGeometryType : layerGeometryType,
        layerURL : layerURL,
        layerDataSourceID : layerDataSourceID
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

  submitWidgetNameUpdate = () => {
    /*
    Submit a property update to the widget.
    */

    var widgetNameInput = document.getElementById("widgetName") as HTMLInputElement;

    var obj = {
      id : 'title',
      value : widgetNameInput.value
    };

    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set(obj.id, obj.value)
    });

  }

  submitLayerUpdates = () => {
    /*
    Submit a property update to the widget.
    */

    var selectedValue = document.getElementById('selectALayer').value;
    var selectedKey = document.getElementById('selectAKey').value;
    var selectedKeyName = document.getElementById('selectAKey').options[document.getElementById('selectAKey').selectedIndex].innerText;
    
    if (selectedValue === 'default' || selectedKey === 'default'){

      alert('Select a Layer and a Key');

    }
    else {

      selectedValue = JSON.parse(selectedValue);
      selectedValue['key'] = selectedKey;

      this.props.onSettingChange({
        id: this.props.id,
        config: this.props.config.set(selectedKey, JSON.stringify(selectedValue))
      });

      document.getElementById('selectALayer').value='default';
      document.getElementById('selectAKey').value='default';

      var li = <li>{selectedKeyName}</li>

      this.setState({
        layerKeysSet : [...this.state.layerKeysSet, li]
      });

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

          <button className="m-2" onClick={this.log}>Log Widget</button>

          <hr></hr>

          <h3>Widget Name</h3>
          <p>Enter widget name to be displayed in widget title.</p>
          <TextInput
            borderless
            className="mb-3 w-100"
            placeholder={this.props.config['title']}
            id="widgetName"
          />

          {/* give the widget a name */}
          <Button
            className="w-100"
            type="primary"
            onClick={this.submitWidgetNameUpdate}
          >
            Save Widget Name
          </Button>
          
          <hr></hr>
          
          {/* select a web-map as data source */}
          <h3>Select a Datasource</h3>
          <MapWidgetSelector useMapWidgetIds={this.props.useMapWidgetIds} onSelect={this.onMapWidgetSelected}/>

          <hr></hr>

          {/* define data layers */}
          <h3>Configure Data Layers</h3>
          <p className="mt-2">Select a Key</p>
          <select id="selectAKey" className="w-100">

            <option value='default' disabled selected>Select One</option>

            <option value='citiesPolygon'>Cities: Polygon</option>
            <option value='cogPolygon'>COG: Polygon</option>
            <option value='mpoPolygon'>MPO: Polygon</option>
            <option value='mpaPolygon'>MPA: Polygon</option>
            <option value='countiesPolygon'>Counties: Polygon</option>

          </select>
          
          <p className="mt-2">Select a Layer</p>
          <select id="selectALayer" className="w-100">
            <option value='default' disabled selected>Select One</option>
          </select>

          <Button
            className='mt-2 w-100'
            type="primary"
            onClick={this.submitLayerUpdates}
          >
            Submit Layer Updates
          </Button>

          <ul className='mt-2 form-control'>
            {this.state.layerKeysSet}
          </ul>

          {/* web-map selection */}
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

        </div>
      </div>
    </div>

  )
  

}

}


