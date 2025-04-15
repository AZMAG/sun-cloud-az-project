# Sun Cloud Explorer App Widgets

Author: High Street Consulting Group
Contact: Mark Egge (egge@highstreetconsulting.com) or Ted Brown (ebrown@azmag.gov)
Last update: June 2023

This repository contains the source code for widgets for the Sun Cloud Explorer app including the:

* Layer Symbology widget used to control layer visibility and symbology
* Dynamic weighting / scoring widget (named `balanced-sliders`)
* Zoom to Geography widget

# Local Setup

1. Clone symlink this folder the `[your ExB install directory]/client/` folder.

# Layer Symbology Widget

This widget is used to control the visibilty of layers in the Sun Cloud Explorer app. 

The source code for the renderers are defined in `widgets/layer-symbology/src/runtime/renderersFieldClassBreaks.js` and `widgets/layer-symbology/src/runtime/renderersFieldUniqueValues.js`

To add a new layer, first it must be added to `settings.tsx` then also added to `widget.tsx` and then finally linked through ExB.

# Weighting Widget

a.k.a the balaned sliders widget. Dynamically re-scores features based on user-defined weights.