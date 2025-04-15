/** @jsx jsx */

import {AllWidgetProps, jsx, React} from 'jimu-core'
import {IMConfig} from '../config'

import {Alert, Button, Checkbox, Label, Loading, Modal, ModalBody, Option, Select} from 'jimu-ui';

// Esri dependencies
import FeatureLayer from 'esri/layers/FeatureLayer';
import esriConfig from 'esri/config';

// scoringEngine dependencies
import {scoringEngine} from '../../../scoringEngine/main';
import geometryEngine from 'esri/geometry/geometryEngine';

import * as qf from '../../../lib/queryFeatures';
import * as nh from '../../../scoringEngine/normalization';
import loading from '../../../lib/assets/loading.gif';
import blocks from '../../../lib/assets/blocks.gif';


// initialize scoring engine
let se = new scoringEngine();
se.geometryEngine = geometryEngine;
se.featuresToScore = [];
se.featuresForScoring = [];

// constants
const constantSpatialReference = 2223;

let measuresForScoring = [];

export default class Widget extends React.PureComponent<AllWidgetProps<IMConfig>, any> {

  constructor(props) {
    super(props)
  }

  state = {

    selectedLayer: null,
    selectedLayerUrl: null,
    selectedLayerType: null,
    selectedFeatureLayer: null,

    featureUpdateResult: [],
    featureUpdateResultSuccess: [],
    featuresToScore: [],

    modalLoadingOpen: false,
    modalMeasureOpen: false,
    modalCompositeOpen: false,

    messageFeaturesToScore: null,
    messageFeaturesToScoreType: 'info',

    // measure checkbox
    measures: {

      pavement: false,
      bridge: false,
      ttr: false, // transit time reliability
      ta: false, //transit alignment
      tr: false, //transit ridership
      employment_change: false,
      freight_route: false,
      broadband: false,
      safety: false,
      vc_ratio: false,
      vmt: false,
      pct_disadvantaged: false
    }
  };

  componentDidMount() {
    console.log('component did mount');
    /*
    On widget mount, register each data layer in schemaMeasures.dataLayers
    so that we can query said layers without passing a token or loggin in each time.
    */

    // user login token
    let token = this.props.token;

    // layers to be updated
    let scoreLayerUrls = Object.values(se.dataLayersScoring).map(layer => {
      return layer.url
    });

    // layers used for scoring
    let scoringLayerUrls = Object.values(se.dataLayersMeasures).map(layer => {
      return layer.url
    });

    // array of urls to add to the interceptor
    let urlforInterceptor = [].concat(scoreLayerUrls, scoringLayerUrls);

    let interceptor = {
      urls: urlforInterceptor,
      before({urlforInterceptor, requestOptions}) {
        requestOptions.query.token = token;
      }
    };
    esriConfig.request.interceptors.push(interceptor);

  }

  seeWidgetState = () => {
    console.log(this.state)
  }

  seeScoringEngineState = () => {
    console.log(se)
  }


  /**
   * Fires when user changes line/point selection.  It queries selected data source and updates widget status.
   * @param elm - div element
   */
  onDataSourceChange = (elm) => {

    let selectedLayer = elm.target.value;
    let selectedLayerUrl = se.dataLayersScoring[selectedLayer].url;
    let selectedLayerType = (selectedLayer === 'linearMeasureLayer') ? 'linear' : 'point';


    se.scoringLayer = selectedLayer;
    se.scoringLayerURL = selectedLayerUrl;
    se.scoringLayerType = selectedLayerType;

    this.setState({
        selectedLayer: selectedLayer,
        selectedLayerUrl: selectedLayerUrl,
        selectedLayerType: selectedLayerType,
        modalLoadingOpen: true
      },
      async () => {

        // query all features from the selected feature layer

        // ignore features w/ null geometry
        let expression = '';
        let devExpression = ''
        // devExpression = 'OBJECTID <10';

        // console.log(expression + devExpression);

        qf.queryFeaturesAsync(
          selectedLayerUrl, expression + devExpression, this.props.token
        )
        .then(
          (r) => {
            this.setState({
              modalLoadingOpen: false,
              featuresToScore: r,
              messageFeaturesToScore: `${r.features.length} features will be scored for need.`,
              messageFeaturesToScoreType: 'success',
            });
          }
        )
        .catch((error) => {
          console.error(`Could not query features: ${error}`);
        });
      });
  }


  /**
   * Queries selected measure features.
   * Aggregates all promises and returns a single promise that includes measure name.
   */
  collectFeatures = () => {
    let stateMeasures = this.state.measures

    Object.keys(stateMeasures).forEach(key => {
      let index = measuresForScoring.indexOf(key);
      if (stateMeasures[key] === true && index === -1) {
        measuresForScoring.push(key)
      } else if (stateMeasures[key] === false && index > -1) {
        // if state is false remove from the array
        measuresForScoring.splice(index, 1);
      }
    });

    let collectedFeatures = []
    const token = this.props.token
    // measures have been selected
    if (measuresForScoring.length > 0) {
      measuresForScoring.forEach(measure => {
        let where = '1=1'

        // broadband layer needs
        if (measure == 'broadband') {
          where = "category_fixed IN ('No records', 'Limited')";
        }
        const url = se.dataLayersMeasures[measure][se.scoringLayerType].url;

        // add the measure key, value pair to the query result object
        const qResult = new Promise(function (resolve, reject) {
          qf.queryFeaturesAsync(url, where, token)
          .then(r => {
            r.measure = measure;
            resolve(r)
          })
        });
        collectedFeatures.push(qResult)
      })

      // if all promises are fulfilled return it as a single promise.
      return Promise.all(collectedFeatures)
    }
    // user needs to select some measures
    else {
      alert('Pick one or more scoring measures.')
    }
  }


  /**
   * Updates the stateObject's state
   * @param elm - checked element
   */
  checkMeasureBox = (elm) => {

    let isChecked = elm.target.checked
    const m = elm.target.id
    this.setState({
      measures: {
        ...this.state.measures,
        [m]: isChecked
      }
    })
  }


  /**
   * Fires when "Scores Measures" button is clicked.
   * Runs CollectFeatures.  If measure features are collected, runs scoreMeasures.
   *
   */
  scoreMeasureButtonClick = () => {
    if (this.state.selectedLayer != null) {
      this.setState({
        modalMeasureOpen: true
      })
      this.collectFeatures()
      .then(
        (r) => {
          return this.scoreMeasures(r)
        }
      )
      .then(
        // update the scoring feature layer with the computed scores
        (score_result) => {
          // console.log(score_result);
          // line or the point feature layer
          const fl = new FeatureLayer({
            url: this.state.selectedLayerUrl
          });


          const all_fields = score_result[0].attributes;

          let attrs = score_result.map((f) => f.attributes);

          // get the name of the fields to be updated
          let key_fields = Object.keys(all_fields).filter(item => item !== 'OBJECTID');

          // key_fields = ['lottr'];
          // normalize the value and add it back to update object
          key_fields.forEach(function (el) {
            // console.log(el);
            let norm_field = `${el}_norm`;
            // console.log(norm_field);
            if (nh.normalizationRules[norm_field]) {
              // console.log(norm_field);
              let values = attrs.map((f) => f[el]);
              // console.log('values', values);
              let n = nh.normalize(values, norm_field);
              // console.log('normalized', n);

              // add norm value to the r object as key, value pair
              for (let i = 0; i < score_result.length; i++) {
                score_result[i]['attributes'][norm_field] = n[i]; // Add the key-value pair to the object at index n
              }

            } else {
              console.log('exception occurred');
            }


          });

          // console.log(score_result);
          fl.applyEdits(
            {updateFeatures: score_result}
          )
          .then((editsResult) => {
            // TODO: add if edit fails
            console.log('edit result', editsResult.updateFeatureResults);
            this.setState({modalMeasureOpen: false})

            this.setState({modalCompositeOpen: true})

            qf.queryFeaturesAsync(
              this.state.selectedLayerUrl, '', this.props.token
            ).then(
              (r) => {
                console.log('updating composite scores...');
                // console.log(r);
                const features = r.features;
                let attributes = features.map((f) => f.attributes);
                // console.log(attributes);

                let features_to_update = [];


                let composite_scores = attributes.forEach((row) => {
                  let newObj = {'attributes': {}};
                  newObj['attributes']['OBJECTID'] = row['OBJECTID'];

                  newObj['attributes']['composite_score_unweighted'] =
                    (row['injury_rate_norm'] || 0) * 10 +
                    (row['non_motorized_injuries_norm'] || 0) * 10 +
                    (row['excess_expected_crashes_norm'] || 0) * 12 +
                    (row['pavement_pct_poor_norm'] || 0) * 8 +
                    (row['bridge_structural_rating_norm'] || 0) * 4 +
                    (row['bridge_deck_geometry_norm'] || 0) * 4 +
                    (row['lottr_norm'] || 0) * 6 +
                    (row['avg_delay_norm'] || 0) * 4 +
                    (row['vc_ratio_norm'] || 0) * 4 +
                    (row['vmt_change_norm'] || 0) * 6 +
                    (row['transit_overlap_norm'] || 0) * 4 +
                    (row['transit_ridership_norm'] || 0) * 4 +
                    (row['employment_change_norm'] || 0) * 8 +
                    (row['critical_freight_norm'] || 0) * 8 +
                    (row['households_no_broadband_norm'] || 0) * 8;

                  newObj['attributes']['composite_score_safety'] = (
                    (row['injury_rate_norm'] || 0) * 30 +
                    (row['non_motorized_injuries_norm'] || 0) * 30 +
                    (row['excess_expected_crashes_norm'] || 0) * 40
                  );

                  newObj['attributes']['composite_score_assets'] = (
                    (row['pavement_pct_poor_norm'] || 0) * 50 +
                    (row['bridge_structural_rating_norm'] || 0) * 25 +
                    (row['bridge_deck_geometry_norm'] || 0) * 25
                  );

                  newObj['attributes']['composite_score_mobility'] = (
                    (row['lottr_norm'] || 0) * 20 +
                    (row['avg_delay_norm'] || 0) * 15 +
                    (row['vc_ratio_norm'] || 0) * 15 +
                    (row['vmt_change_norm'] || 0) * 20 +
                    (row['transit_overlap_norm'] || 0) * 15 +
                    (row['transit_ridership_norm'] || 0) * 15
                  )

                  newObj['attributes']['composite_score_economy'] = (
                    (row['employment_change_norm'] || 0) * 33 +
                    (row['critical_freight_norm'] || 0) * 33 +
                    (row['households_no_broadband_norm'] || 0) * 34
                  );

                  newObj['attributes']['composite_score'] = (
                    newObj['attributes']['composite_score_unweighted'] +
                    newObj['attributes']['composite_score_unweighted'] *
                    (row['percent_disadvantaged'] || 0).toFixed(2))

                  features_to_update.push(newObj);
                });

                // console.log(features_to_update);
                // remove non-composite fields
                fl.applyEdits(
                  {updateFeatures: features_to_update}
                )
                this.setState({
                  modalCompositeOpen: false
                })


              });
          })
          .catch((error) => {
            window.alert(error);
            console.log(error);
          });
        })
      .then(
        () => {
        }
      )
    } else {
      window.alert('Select a data source.')
    }
  }


  weightedMean = (arrValues: number[], arrWeights: number[]) => {
    const result = arrValues
    .map((value, i) => {
      const weight = arrWeights[i]
      const sum = value * weight
      return [sum, weight]
    })
    .reduce((p, c) => [p[0] + c[0], p[1] + c[1]], [0, 0])

    return result[0] / result[1]
  }


  scoreMeasures = (arrayOfQueryResults) => {
    let widget = this;


    // this will hold feature layer update object
    let featuresToUpdate = [];

    const featuresToScore = this.state.featuresToScore;
    const type = (featuresToScore.geometryType).toLowerCase();
    // console.log(type);

    function applyScoringMethodology(scoringFeature) {
      let featureObject = {
        attributes: {}
      };

      featureObject.attributes['OBJECTID'] = scoringFeature.attributes.OBJECTID

      // performance of for loop is better
      arrayOfQueryResults.forEach(
        (r) => {
          let measureName = r.measure

          switch (measureName) {
            case 'pavement':
              let pavementScores = [
                {in: 'average_iri', out: 'pavement_pct_poor'}
              ]

              pavementScores.forEach((el) => {
                featureObject.attributes[el.out] = null;
                let scoringGeom;
                if (type.includes('line')) {
                  scoringGeom = scoringFeature.geometry;
                } else if (type.includes('point')) {
                  scoringGeom = geometryEngine.buffer(scoringFeature.geometry, 500, 'feet');
                }
                // console.log(scoringGeom);
                let intersectingFeats = r.features.filter(f => geometryEngine.intersects(f.geometry, scoringGeom) === true);
                // console.log(intersectingFeats);
                // let identical_feat;
                let len = intersectingFeats.length;
                if (len > 0) {
                  for (let i = 0; i < len; i++) {
                    // look for identical feature from the intersecting features
                    let candidate = intersectingFeats[i];

                    if (Math.round(candidate.attributes['Shape__Length']) == Math.round(scoringFeature.attributes['Shape__Length'])) {
                      // console.log(candidate.attributes[el.in]);
                      featureObject.attributes[el.out] = candidate.attributes[el.in];
                      break;
                    }
                  }
                }
              });
              break;

            case 'safety':
              console.log('safety');
              // safety line logic
              // featureObject.attributes['fatality_rate'] = null;
              featureObject.attributes['injury_rate'] = null;
              featureObject.attributes['non_motorized_injuries'] = null;
              featureObject.attributes['excess_expected_crashes'] = null;

              let safetyIntersect = r.features.filter(f => geometryEngine.intersects(f.geometry, scoringFeature.geometry) === true);
              // console.log(safetyIntersect);

              // console.log(safetyIntersect);
              if (safetyIntersect.length > 0) {
                if (type.includes('line')) {

                  // TODO: make this a function
                  function getValidSafetyPairs(f, fieldName) {
                    const intersect = geometryEngine.intersect(f.geometry, scoringFeature.geometry);
                    const targetVal = f.attributes[fieldName];
                    if (intersect !== null && targetVal !== null) {
                      return [targetVal, geometryEngine.planarLength(intersect, 'feet')]
                    } else {
                      return [null, null]
                    }
                  }

                  const wAvgFields = [
                    {in: 'fatal_injury_rate', out: 'injury_rate'}]

                  wAvgFields.forEach((el) => {
                    let validPairs = safetyIntersect.map((f) => getValidSafetyPairs(f, el.in));
                    // console.log(validPairs);
                    validPairs = validPairs.filter(item => item[0] !== null && item[1] !== null);
                    // console.log(validPairs);
                    if (validPairs.length > 0) {
                      featureObject.attributes[el.out] = widget.weightedMean(validPairs.map((el) => el[0]), validPairs.map((el) => el[1]));
                    }
                  });

                  const sumFields = [
                    {in: 'non_motorized_fatal_injury', out: 'non_motorized_injuries'},
                    {in: 'excess_expected_kabc_crashes', out: 'excess_expected_crashes'}];

                  const overlap = safetyIntersect.filter((el) => geometryEngine.intersect(el.geometry, scoringFeature.geometry) !== null);

                  sumFields.forEach((el) => {
                    const attr = overlap.map((f) => f.attributes[el.in]);
                    // console.log(attr);
                    attr.filter(Boolean);
                    featureObject.attributes[el.out] = attr.reduce((a, b) => a + b, 0);
                  });
                }
                // safety point logic
                // else if (type.includes('point')) {
                //   featureObject.attributes['fatality_rate'] = safetyIntersect[0].attributes['fatal_injury_rate'];
                //   featureObject.attributes['serious_injury_rate'] = safetyIntersect[0].attributes['severe_injury_rate'];
                //   featureObject.attributes['non_motorized_injuries'] = safetyIntersect[0].attributes['non_motorized_injuries'];
                //   featureObject.attributes['excess_expected_crashes'] = safetyIntersect[0].attributes['excess_expected_crashes'];
                // }
              }
              break

            case 'bridge':
              // default is null
              featureObject.attributes['bridge_structural_rating'] = null;
              featureObject.attributes['bridge_deck_geometry'] = null;

              let result;
              //
              if (type.includes('line')) {
                result = r.features.filter(f => geometryEngine.intersects(f.geometry, scoringFeature.geometry) === true);
              }

              if (result.length > 0) {
                // calculate average structural rating
                let structural_evals = result.map((a) => (
                  a.attributes['structural_eval_067']
                ));
                // remove null from array
                structural_evals = structural_evals.filter(value => value !== null);
                featureObject.attributes['bridge_structural_rating'] = structural_evals.reduce((a, b) => a + b) / structural_evals.length;

                // calculate minimum deck geometry eval
                let deck_geom_evals = result.map((a) => (
                  a.attributes['deck_geometry_eval_068']
                ));
                // remove null from array
                deck_geom_evals = deck_geom_evals.filter(value => value !== null);

                if (deck_geom_evals.length > 0) {
                  featureObject.attributes['bridge_deck_geometry'] = Math.min(...deck_geom_evals);
                }
              }
              break;

            case 'ttr':
              featureObject.attributes['lottr'] = null;
              featureObject.attributes['avg_delay'] = null;

              // apply buffer to point
              let ttrGeom;
              // const _widget = this;
              if (type.includes('line')) {
                ttrGeom = scoringFeature.geometry;
              } else if (type.includes('point')) {
                ttrGeom = geometryEngine.buffer(scoringFeature.geometry, 500, 'feet');
              }

              // get intersecting features
              const ttrIntersect = r.features.filter(f => geometryEngine.intersect(f.geometry, ttrGeom) != null);
              if (ttrIntersect.length > 0) {
                let lottr_array = ttrIntersect.map((f) => f.attributes['peak_lottr']);
                lottr_array = lottr_array.filter(f => f !== null);
                if (lottr_array.length > 0) {
                  featureObject.attributes['lottr'] = Math.max(...lottr_array);
                } else {
                  featureObject.attributes['lottr'] = null;

                }
                // get the value, length pair
                let ttrPair = ttrIntersect.map((f) => {
                  return [f.attributes['daily_delay'], geometryEngine.planarLength(f.geometry, 'feet')]
                });

                // remove if value is null.
                ttrPair = ttrPair.filter((el) => {
                  return el[0] != null
                });

                if (ttrPair.length > 0) {
                  featureObject.attributes['avg_delay'] = (widget.weightedMean(ttrPair.map((el) => el[0]), ttrPair.map((el) => el[1])));
                }
              }
              break;

            case 'ta':
              console.log('transit alignment');
              // initialize the value
              featureObject.attributes['transit_overlap'] = 0;

              const taBuffer = geometryEngine.buffer(scoringFeature.geometry, 500, 'feet');
              let i = r.features.filter(f => geometryEngine.intersects(f.geometry, taBuffer) === true);

              if (i.length > 0) {
                if (type.includes('line')) {
                  const segLength = geometryEngine.planarLength(scoringFeature.geometry, 'feet')
                  const union = geometryEngine.union(i.map((f) => f.geometry));
                  const intersect = geometryEngine.intersect(union, taBuffer);
                  if (intersect) {
                    const intersectLength = geometryEngine.planarLength(intersect, 'feet');
                    let pct = (intersectLength / segLength);
                    featureObject.attributes['transit_overlap'] = Math.min(...[1, pct]);
                  }
                }
              }
              break;

            case 'tr':
              console.log('travel ridership');
              featureObject.attributes['transit_ridership'] = 0;

              const buffer = geometryEngine.buffer(scoringFeature.geometry, 500, 'feet');
              let trIntersects = r.features.filter(f => geometryEngine.intersect(f.geometry, buffer) != null)

              if (type.includes('line')) {
                if (trIntersects.length > 0) {
                  let ridership_array = trIntersects.map((f) => f.attributes['avg_daily_rides']);
                  // console.log(ridership_array)
                  featureObject.attributes['transit_ridership'] = Math.max(...ridership_array)
                }
              }
              // else if (type.includes('point')) {
              //   let vals = intersectingFeats.map(f => f.attributes['avg_daily_rides']);
              //   if (vals.length > 0) {
              //     featureObject.attributes['transit_ridership'] = vals.reduce((a, b) => a + b, 0);
              //   }
              // }

              break;

            case 'employment_change':
              console.log('employment_change');
              featureObject.attributes['employment_change'] = null;

            function ecPairs(f) {
              // const g = scoringFeature.geometry;
              // if (geometryEngine.intersect(g, f.geometry)){
              return [f.attributes['totemp_2050'] - f.attributes['totemp_2019'],
                geometryEngine.planarArea(f.geometry, 'square-feet')];
              // }

            }

              let ecIntersects = r.features.filter(f => geometryEngine.intersects(f.geometry, scoringFeature.geometry) === true);
              let exPairs = (ecIntersects.map((f) => ecPairs(f)));
              // console.log(exPairs);
              if (exPairs.length > 0) {
                featureObject.attributes['employment_change'] = widget.weightedMean(exPairs.map(el => el[0]), exPairs.map(el => el[1]));
              }
              // console.log(widget.weightedMean(ecIntersects.map(el => el[0]), ecIntersects.map(el => el[1])));
              // console.log(exPairs.map(el => el[0]));

              // for each intersects, collect where intersect length is greater than zero (chg_empden, feature.area)

              // if array length is

              break;

            case 'freight_route':

              featureObject.attributes['critical_freight'] = 0;

              // apply buffer
              const freightGeom = geometryEngine.buffer(scoringFeature.geometry, 50, 'feet');

              const freightOverlap = r.features.filter(f => geometryEngine.intersect(f.geometry, freightGeom) != null);
              console.log(freightOverlap);

              if (freightOverlap.length > 0) {
                if (type.includes('line')) {
                  const segLength = geometryEngine.planarLength(scoringFeature.geometry, 'feet')
                  const union = geometryEngine.union(freightOverlap.map((f) => f.geometry));

                  const intersect = geometryEngine.intersect(union, freightGeom);
                  if (intersect != null) {

                    const intersectLength = geometryEngine.planarLength(intersect, 'feet');

                    let pct = (intersectLength / segLength);
                    // console.log(intersectLength, segLength, pct);

                    featureObject.attributes['critical_freight'] = Math.min(...[1, pct])
                  }

                } else if (type.includes('point')) {
                  featureObject.attributes['critical_freight'] = 1;
                }
              }
              break;

            case 'broadband':
              console.log('broadband');


              let bbGeom;
              featureObject.attributes['households_no_broadband'] = 0;

              // add 500' buffer to point
              if (type.includes('line')) {
                bbGeom = scoringFeature.geometry;
              }
              // else if (type.includes('point')) {
              //   bbGeom = geometryEngine.buffer(scoringFeature.geometry, 500, 'feet');
              // }

              const bbandIntersects = r.features.filter(f => geometryEngine.intersect(f.geometry, scoringFeature.geometry) != null);
              if (bbandIntersects.length > 0) {
                let attributes = bbandIntersects.map((f) => f.attributes['hh_no_broadband']);
                const sum = attributes.reduce((a, b) => a + b, 0);
                if (sum > 0) {
                  featureObject.attributes['households_no_broadband'] = sum;
                }
              }
              break

            case 'vc_ratio':
              console.log('vc_ratio');
              featureObject.attributes['vc_ratio'] = null;
              let losResult;
              let scoringGeom;

              if (type.includes('line')) {
                scoringGeom = scoringFeature.geometry;
                losResult = r.features.filter((f) => {
                  if (f.geometry)
                    return geometryEngine.intersects(scoringGeom, f.geometry) === true
                });


                function getValidLosPairs(f, fieldName) {
                  let targetVal = f.attributes[fieldName];
                  let intersect;
                  if (f.geometry) {
                    intersect = geometryEngine.intersect(f.geometry, scoringGeom)
                  }
                  if (targetVal !== null && intersect !== null) {
                    return [targetVal, geometryEngine.planarLength(intersect, 'feet')]
                  }
                }

                let pairs = losResult.map((f) => getValidLosPairs(f, 'vc_2019'));
                if (pairs.length>0){
                  let new_pairs = pairs.filter(Boolean);
                  if (new_pairs.length>0){
                    featureObject.attributes['vc_ratio'] =
                      widget.weightedMean(new_pairs.map((el) => el[0]), new_pairs.map((el) => el[1]));
                  }
                }
              }
              // else if (type.includes('point')) {
              //   scoringGeom = geometryEngine.buffer(scoringFeature.geometry, 500, 'feet')
              //   losResult = r.features.filter((f) => {
              //     if (f.geometry)
              //       return geometryEngine.intersects(scoringGeom, f.geometry) === true
              //   });
              //   let values = losResult.map(f => f.attributes['vc_2019']);
              //   values = values.filter(val => val !== null);
              //   if (values.length > 0) {
              //     featureObject.attributes['vc_ratio'] = values.reduce((a, b) => a + b) / values.length;
              //   }
              // }
              break;

            case 'vmt':
              console.log('vmt');
              featureObject.attributes['vmt_change'] = null;
              let vmtGeom = null;
              if (type.includes('line')) {
                vmtGeom = scoringFeature.geometry;
              } else if (type.includes('point')) {
                vmtGeom = geometryEngine.buffer(scoringFeature.geometry, 50, 'feet');
              }

            function validVmtPairs(f, currentF, futureF) {
              const current = f.attributes[currentF];
              const future = f.attributes[futureF];
              if (current != null && future != null && future != 0) {
                //   get true intersecting length
                const intersect = geometryEngine.intersect(f.geometry, vmtGeom);
                if (intersect != null) {
                  let diff = future - current;
                  let length = geometryEngine.planarLength(intersect, 'miles');
                  if (type.includes('line')) {
                    return diff * length
                  } else if (type.includes('point')) {
                    return diff
                  }
                }
              }
            }

              let vmtIntersect = r.features.filter(f => geometryEngine.intersect(f.geometry, vmtGeom) != null);
              let vmt_chg = vmtIntersect.map((f) => validVmtPairs(f, ['volume_2019'], ['volume_2050']));
              vmt_chg = vmt_chg.filter(Boolean);


              if (vmt_chg.length > 0) {
                featureObject.attributes['vmt_change'] = vmt_chg.reduce((a, b) => a + b, 0);
              }
              break;


            case 'pct_disadvantaged':
              console.log('pct_disadvantaged');
              featureObject.attributes['percent_disadvantaged'] = null;
              let j40Geom = null;

              if (type.includes('line')) {
                j40Geom = scoringFeature.geometry;
                let j40Intersect = r.features.filter(f => geometryEngine.intersect(f.geometry, j40Geom) != null);
                if (j40Intersect.length > 0) {
                  const val = j40Intersect[0].attributes['percent_j40'];
                  featureObject.attributes['percent_disadvantaged'] = val;
                }

              } else if (type.includes('point')) {
                j40Geom = geometryEngine.buffer(scoringFeature.geometry, 50, 'feet');
                let j40Intersect = r.features.filter(f => geometryEngine.intersect(f.geometry, j40Geom) != null);
                let values = j40Intersect.map((el) => el.attributes['percent_j40']);
                values = values.filter(Boolean);
                if (values.length > 0) {
                  const avg = values.reduce((a, b) => a + b) / values.length;
                  featureObject.attributes['percent_disadvantaged'] = avg;
                }
              }
              break;

            default:
              alert(`Sorry, ${measureName} methodology is not in the code`);
          }
          featuresToUpdate.push(featureObject)
        }
      )
    }

    // apply scoring logic to each scoring feature
    featuresToScore.features.map(applyScoringMethodology)
    // console.log(featuresToUpdate);
    return featuresToUpdate
  }


  render() {
    return (

      <div className='container-fluid'>

        {/* page modal */}
        <Modal
          isOpen={this.state.modalLoadingOpen}
          centered
        >
          <ModalBody>
            <div className='row m-4'>
              <Loading
                type='PRIMARY'
              />
            </div>
          </ModalBody>

        </Modal>

        {/* measure modal */}
        <Modal
          isOpen={this.state.modalMeasureOpen}
          centered
        >
          <ModalBody>
            <p><strong>Scoring and normalizing selected measures...</strong></p>
            <img
              src={loading}
              style={{width: '100px', margin: 'auto', display: 'block'}}
              alt="Loading..."
            />

          </ModalBody>

        </Modal>

        {/* measure modal */}
        <Modal
          isOpen={this.state.modalCompositeOpen}
          centered
        >
          <ModalBody>
            <p><strong>Updating composite scores...</strong></p>
            <img
              src={blocks}
              style={{width: '100px', margin: 'auto', display: 'block'}}
              alt="Calculating composite scores..."
            />

          </ModalBody>

        </Modal>

        {/* development buttons */}
        {/*<div className='row'>*/}

        {/*  <div className='col-6'>*/}
        {/*    <Button onClick={this.seeWidgetState}>See Widget State</Button>*/}
        {/*  </div>*/}

        {/*  <div className='col-6'>*/}
        {/*    <Button onClick={this.seeScoringEngineState}>See Scoring Engine State</Button>*/}
        {/*  </div>*/}

        {/*</div>*/}

        {/* select a layer to score */}
        <div className='row'>

          <div className='col-6'>

            <h3>1. Select a Data Source</h3>

            <Select
              aria-label='Select Label'
              onChange={this.onDataSourceChange}
              useFirstOption={true}
            >
              <Option disabled value='default'>Select One</Option>
              <Option value='linearMeasureLayer'>Linear Segments</Option>
              {/*<Option value='pointMeasureLayer'>Intersection Points</Option>*/}

            </Select>

          </div>

          <div className='col-6'>

            <h3>Features to Score</h3>

            <Alert
              className='w-100 mt-2'
              form='basic'
              open
              text={this.state.messageFeaturesToScore}
              type={this.state.messageFeaturesToScoreType}
              withIcon
            />

          </div>

        </div>

        {/* measureGroup selection */}
        <div className='row mt-2'>


          <div
            aria-label='What frameworks have you used?'
            role='group'
            className='col-6'
          >

            <h3>2. Select a Measure</h3>

            <Label
              centric
              className='ml-2 d-flex'
            >
              <Checkbox
                id="pavement"
                onChange={this.checkMeasureBox}
                checked={this.state.measures.pavement}
              />
              Pavement
            </Label>

            <Label
              centric
              className='ml-2 d-flex'
            >
              <Checkbox
                id="bridge"
                onChange={this.checkMeasureBox}
                checked={this.state.measures.bridge}
              />
              Bridge
            </Label>

            <Label
              centric
              className='ml-2 d-flex'
            >
              <Checkbox
                id="ttr"
                onChange={this.checkMeasureBox}
                checked={this.state.measures.ttr}
              />
              Level of Travel Time Reliability & Daily Delay
            </Label>

            <Label
              centric
              className='ml-2 d-flex'
            >
              <Checkbox
                id="ta"
                onChange={this.checkMeasureBox}
                checked={this.state.measures.ta}
              />
              Transit Alignment
            </Label>


            <Label
              centric
              className='ml-2 d-flex'
            >
              <Checkbox
                id="tr"
                onChange={this.checkMeasureBox}
                checked={this.state.measures.tr}
              />
              Transit Ridership
            </Label>

            <Label
              centric
              className='ml-2 d-flex'
            >
              <Checkbox
                id="employment_change"
                onChange={this.checkMeasureBox}
                checked={this.state.measures.employment_change}
              />
              Forecasted Employment Change
            </Label>

            <Label
              centric
              className='ml-2 d-flex'
            >
              <Checkbox
                id="freight_route"
                onChange={this.checkMeasureBox}
                checked={this.state.measures.freight_route}
              />
              Overlap with Critical Freight Route
            </Label>

            <Label
              centric
              className='ml-2 d-flex'
            >
              <Checkbox
                id="broadband"
                onChange={this.checkMeasureBox}
                checked={this.state.measures.broadband}
              />
              Broadband Needs
            </Label>

            <Label
              centric
              className='ml-2 d-flex'
            >
              <Checkbox
                id="safety"
                onChange={this.checkMeasureBox}
                checked={this.state.measures.safety}
              />
              Safety
            </Label>


            <Label
              centric
              className='ml-2 d-flex'
            >
              <Checkbox
                id="vc_ratio"
                onChange={this.checkMeasureBox}
                checked={this.state.measures.vc_ratio}
              />
              Level of Service(TDM)
            </Label>

            <Label
              centric
              className='ml-2 d-flex'
            >
              <Checkbox
                id="vmt"
                onChange={this.checkMeasureBox}
                checked={this.state.measures.vmt}
              />
              Change in Vehicle Miles Traveled (2019 – 2050)
            </Label>

            <Label
              centric
              className='ml-2 d-flex'
            >
              <Checkbox
                id='pct_disadvantaged'
                onChange={this.checkMeasureBox}
                checked={this.state.measures.pct_disadvantaged}
              />
              Disadvantaged Facility Users
            </Label>
          </div>

        </div>

        {/* kickoff measure scoring */}
        <div className='row mt-2'>

          <div className='col-4'>

            <Button
              onClick={this.scoreMeasureButtonClick}
              size='default'
              type='primary'
            >
              Score Measures
            </Button>
          </div>
        </div>
      </div>
    )
  }
}
