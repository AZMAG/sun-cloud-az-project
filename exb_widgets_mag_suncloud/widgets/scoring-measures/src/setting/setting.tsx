import { React, jsx } from "jimu-core";
import { AllWidgetSettingProps } from "jimu-for-builder";
import { MapWidgetSelector  } from "jimu-ui/advanced/setting-components";
import { DataSourceSelector, AllDataSourceTypes, FieldSelector } from "jimu-ui/advanced/data-source-selector";
import { JimuMapViewComponent, JimuMapView } from "jimu-arcgis";

export default class Setting extends React.PureComponent<AllWidgetSettingProps<any>, any> {

  onMapWidgetSelected = (useMapWidgetIds: string[]) => {  

    this.props.onSettingChange({
      id: this.props.id,
      useMapWidgetIds: useMapWidgetIds
    });

  };


render() {
  return (


    <div className="widget-setting">

      <h3>Select a Datasource</h3>
      <MapWidgetSelector useMapWidgetIds={this.props.useMapWidgetIds} onSelect={this.onMapWidgetSelected}/>

    </div>
    
  )
  
}

}


