// import ClassBreaksRenderer from "@arcgis/core/renderers/ClassBreaksRenderer.js";
import ClassBreaksRenderer from "esri/renderers/ClassBreaksRenderer";
// import UniqueValueRenderer from "@arcgis/core/renderers/UniqueValueRenderer.js";
import UniqueValueRenderer from "esri/renderers/UniqueValueRenderer";

export class GenerateRenderer {

    constructor(
        selectedLayerGeometryType,
        selectedFieldRendererType,
        selectedField,
        selectedLayerKey,
        classBreakInfos,
        esriSymbolType,
        uniqueValueInfos
        ){
        this.selectedLayerGeometryType = selectedLayerGeometryType;
        this.selectedFieldRendererType = selectedFieldRendererType;
        this.selectedField = selectedField;
        this.selectedLayerKey = selectedLayerKey;
        this.classBreakInfos = classBreakInfos;
        this.esriSymbolType = esriSymbolType;
        this.uniqueValueInfos = uniqueValueInfos;
    }

    determineEsriSymbolType = () => {
        /*
        Determine the appropriate Esri symbology type to apply based on the layer
        geometry type.

        E.g., Polyline == simple-line
        */

        var esriSymbolType;
        if (this.selectedLayerGeometryType === 'polyline'){
            esriSymbolType = 'simple-line';
        }
        else if (this.selectedLayerGeometryType === 'point'){
            esriSymbolType = 'simple-marker';
        }
        else {
            esriSymbolType = 'simple-fill'
        }

        this.esriSymbolType = esriSymbolType;

    }

    generateClassBreakRenderer = () => {
        /*
        Generate a class break renderer.
        */

        var renderer = new ClassBreaksRenderer();
        renderer.field = this.selectedField;
        renderer.classBreakInfos = this.classBreakInfos;
        
        return renderer

    }

    generateUniqueValueRenderer = () => {
        /*
        Generate a unique value renderer.
        */

        var renderer = new UniqueValueRenderer();
        renderer.field = this.selectedField;
        renderer.uniqueValueInfos = this.uniqueValueInfos;

        return renderer
    }

}