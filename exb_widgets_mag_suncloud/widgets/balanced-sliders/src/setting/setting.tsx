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
    prposConfigUpdates : []
  }

  defaultPropsConfig = {
    "scoredLayerPolyline": "{\"layerID\":\"widget_1-dataSource_1-1879b5d4471-layer-37\",\"layerName\":\"Sun Cloud Performance Scores\",\"layerGeometryType\":\"polyline\",\"layerURL\":\"https://services6.arcgis.com/clPWQMwZfdWn4MQZ/arcgis/rest/services/Sun_Cloud_Performance_Scores_Private_view/FeatureServer\",\"layerDataSourceID\":\"dataSource_1-1879b5d4471-layer-37\",\"key\":\"scoredLayerPolyline\"}",
  }

  componentDidMount = () => {

    this.onMapWidgetSelected(this.props.useMapWidgetIds);

    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set('scoredLayerPolyline', this.defaultPropsConfig.scoredLayerPolyline)
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

      // this.props.onSettingChange({
      //   id: this.props.id,
      //   jimuMapView: jimuMapView
      // });

      this.setState({
        jimuMapView : jimuMapView
      },
      () => {
        this.createLayerSelectOptions();
        this.sendJimuMapViewToProps();
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

      console.log(layers[layer])

			var layerID = layer;
			var layerData = layers[layer];
			var layerName = layerData.layer.title;
      var layerGeometryType = layerData.layer.geometryType;
      var layerURL = layerData.layer.url;
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

  submitPropsUpdate = () => {
    /*
    Submit a property update to the widget.
    */

    var selectedValue = document.getElementById('selectALayer').value;
    var selectedKey = document.getElementById('selectAKey').value;
    
    if (selectedValue === 'default' || selectedKey === 'default'){

      alert('Select a Layer and a Key');

    }
    else {

      selectedValue = JSON.parse(selectedValue);
      selectedValue['key'] = selectedKey;

      var obj = {
        id : selectedKey,
        value : JSON.stringify(selectedValue)
      }

      this.updateWidgetConfigProps(obj);

      document.getElementById('selectALayer').value='default';
      document.getElementById('selectAKey').value='default';

      this.state.prposConfigUpdates.push(obj);

    }

  }

  updateWidgetConfigProps = (obj) => {
    /*
    Update the widget config properties.
    */

    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set(obj.id, obj.value)
    });

  };

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

            {/* polyline */}
            <option value='scoredLayerPolyline'>Roadway Segments Needs: Polyline</option>
            {/* <option value='scoredLayerPoint'>Intersection Needs: Point</option> */}

            
          </select>
          
          {/* Select a Layer */}
          <p className="mt-2">Select a Layer</p>
          <select id="selectALayer" className="w-100">
            <option value='default' disabled selected>Select One</option>
          </select>


          {/* submit update */}
          <Button
            className='mt-2'
            type="primary"
            onClick={this.submitPropsUpdate}
          >
            Submit Props Update
          </Button>

          <hr></hr>
          <Alert
          type='primary'
          text={this.state.propsConfigUpdates}
          />

        </div>
      </div>
    </div>

  )
  

}

}


