# **Sun Cloud Safety Layers**

## **Overview**
This script is designed to create safety data layers for the SunCloud project. It specifically calculates crash frequency, crash rates, and crash predictions for both segments and junctions. 

The safety junctions and segments layer can be found below with more information on methodology:

- Junctions: https://azgeo.maps.arcgis.com/home/item.html?id=b7ab2303e3bd4e58a1e0a8964b07a951

- Segments: https://azgeo.maps.arcgis.com/home/item.html?id=fdb09b5629514b6fadea59c86b764045

## **Files**

- **create_safety_layer.ipynb** - This is the main script that runs the calculations. It uses arcpy and pandas packages in a jupyter notebook. This can be run inside of ArcGIS Pro or the IDE of your choice. 

- **safety_layers.gdb** - This is the main geodatabase that holds the feature layers outputted from the above script.

- **data folder** - This holds the 2017-2021 csv crash data files and 2019 aadt shapefiles.

- **Safety.aprx** - This is the ArcGIS Pro file that can be opened to run the jupyter notebook.

- **calibration folder** - This folder holds histogram images of the calibration for SPFs and the standard deviation that denotes the LOSS categories.

## **Notebook Sections**
The notebook is structured into the below sections. As you run through each section of the notebook, you will be able to observe changes to the feature layers directly outputted in your map.

1. **Setup**: Loads necessary libraries and connects to the ESRI data hub.
2. **Load Data**: Loads the crash, segment, and junctions layers as well as all the data that will be joined to those layers. More information on those layers can be found in the Data Sources section below. Please update the location of the crash datasets.
3. **Clip to Boundary**: Clips datasets to the SunCloud boundary.
4. **Safety Calculations**: This is the largest portion of the code. It calculates each of the performance measures including Crash Frequency, Crash Rates, Predictive Crashes, Calibration of Predictive Crashes, Expected, Excess, and Level Of Safety Service. For detailed information on the methods, please see the published layers posted above. If errors occur, please see the Common Troubleshooting section below.
5. **Clean Up**: Creates a copy of the feature layer, removes all unused attributes, renames, and assigns aliases to each attribute.

Once all chunks are executed, please manually publish to your desired ESRI datahub. The layers should be called safety_segments and safety_junctions.

## Data Sources (Attribution)
- AADT 2019: https://services6.arcgis.com/clPWQMwZfdWn4MQZ/arcgis/rest/services/AADT_2020_gdb/FeatureServer/0 
- Urban Areas: https://services.arcgis.com/P3ePLMYs2RVChkJx/ArcGIS/rest/services/USA_Urban_Areas/FeatureServer/3 
- Road Medians: https://services1.arcgis.com/XAiBIVuto7zeZj1B/arcgis/rest/services/ATIS_prod_gdb/FeatureServer/33 
- ATIS: https://services6.arcgis.com/clPWQMwZfdWn4MQZ/arcgis/rest/services/AZ_All_Roads_Network_2021/FeatureServer/0 
- Counties: https://services3.arcgis.com/gjVvdAtTsjMYfRZ8/ArcGIS/rest/services/Sun_Cloud_Counties/FeatureServer/6
- HPMS Through Lanes: https://services6.arcgis.com/clPWQMwZfdWn4MQZ/arcgis/rest/services/Arizona_Highway_Performance_Monitoring_System_2020_Data_/FeatureServer/41
- Crash Data: 2017-2021 Crashes from AZDOT Public Records. To gain new crash records please visit and fill out a records request here: https://azdot.govqa.us/WEBAPP/_rs/(S(dnasd4czvqilltpdnvzyg5m1))/supporthome.aspx

## Common Troubleshooting
If any underlying dataset is updated, the following might need updating:

- **Spatial Joins**: The fields in these joins will need to be updated due to changes in attribute names in the newly loaded datasets.

- **SPF re-calibration**: The predicted crashes are currently calibrated to account for KABC only crashes due to the PAG region not collecting PDO crashes. This calibration depends on the difference between the SPFs used. Portions of the script find the average difference between the pre-defined or ADOT SPFs vs PAG SPFs to determine a relationship/calibration.

For this script to function properly, certain attributes must be populated for the safety performance functions (SPFs). Some calculations may fail if these attributes are missing, 0, or NULL. Often many data sources read in lack a full dataset and require manually updating. The below shows the needed attributes for each layer:

- **Junctions**: Traffic Control, Number of Legs, AADT

- **Segments**: Number of Lanes, Divided/Undivided, Urban/Rural, AADT

Specifically, the following attributes tend to be missing or incomplete and require manual updates:

- Number of Lanes

- AADT

- Divided/Undivided Roadway

## **Contact**

Created on behalf of the Maricopa Association of Governments and all Sun Cloud partner agencies with support from FHWA through AID Grant No. 999-M(562)F.

Contact: Yousef Dana (dana@highstreetconsulting.com) or Ted Brown (ebrown@azmag.gov)

Last update: June 2023