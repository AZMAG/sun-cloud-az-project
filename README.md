# Sun Cloud

App author: High Street Consulting Group

Created on behalf of the Maricopa Association of Governments and all Sun Cloud partner agencies with support from FHWA through AID Grant No. 999-M(562)F.

Contact: Mark Egge (egge@highstreetconsulting.com) or Ted Brown (ebrown@azmag.gov)

Last update: June 2023


# Local Setup

1. install Esri experience builder developer edition v.1.11 or later. Installation instructions: https://developers.arcgis.com/experience-builder/guide/install-guide/
1. Clone this repository locally
3. Symlink this `exb_apps_mag_suncloud` folder to your `[your ExB install directory]/server/public/apps` folder (e.g. `ln -s ~/hs/mag/sun_cloud/exb_apps_mag_suncloud ~/hs/ArcGISExperienceBuilder/server/public/apps` )
3. Symlink the widgets folder into the `[your ExB install directory]/client/exb_widgets_mag_suncloud/` folder (e.g. `ln -s ~/hs/mag/sun_cloud/exb_widgets_mag_suncloud ~/hs/ArcGISExperienceBuilder/client`)
2. Run `npm start` from `[your ExB install directory]/server`. 
3. Set your client ID and authenticate with AZ Geo (see below)
4. Open the app https://localhost:3001/builder/?id=exb_apps_mag_suncloud

## AZ Geo Client ID Setup

1. To go the [Content / My Content pane in AZ Geo](https://azgeo.maps.arcgis.com/home/content.html) and click `New Item` then choose `Application`
2. Select `Other application` option and click `Next`.
3. In the New item dialog box, enter the following parameters:

* Title - Enter something that makes sense to you, such as Experience Builder credentials.
* Tags - Optionally enter something such as Experience Builder.
* Select a forlder and optionally fill Categories and Summary if necessary
* Click `Save` to add

5. Click the `Settings` tab.
6. On the `Redirect URLs` section enter in `https://localhost:3001/` for the Redirect URI, and click Add > Update.
![Look up Client ID](./resources/images/client_id.png)
7. Under `Credentials` copy the value of Client ID (e.g. Y8d0Fhzk78RWi5kR)
8. Open https://localhost:3001/page/set-portalurl and paste in your Client ID and click `Sign In`
![Set Client ID](./resources/images/set_client_id.png)

