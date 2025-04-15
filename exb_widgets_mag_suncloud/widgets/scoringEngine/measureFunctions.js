/*
This file contains functions to calculate measures and functions to help calculate measures. This file is used in concert
with schemaMeasures.js and whatever logic handling code UI code exists.

Authors:
Chapman Munn -- Developer
Ahjung Kim -- Developer


Date:
November 2022
*/

export const helperfunctionsMeasures = {

	sumArrayValues : (values) => {
		/*
		Sum each value in an array.

		TODO -> error handling

		Inputs:
		values -- array of values.

		Returns:
		value -- float or int

		*/
		let value = values.reduce((p, c) => p + c, 0);
		return value
	},

	normalizeValue : (value) => {

		let result = ([undefined, NaN, null].includes(value) === true) ? null : Math.round(value, 2);
		return result

	}, 

	geometryIntersectFeaturesArray : (geometry, intersectingFeatures, geometryEngine) => {
		/*
		Create an array of features by intersecting the geometry from a feature in question with an array
		of features.

		Inputs:
		feature -- object
		intersectingFeatures -- array of objects
		geometryEngine -- Esri geometryEngine class

		Returns:
		result -- array of objects (features) or empy array
		*/

		try {
			var result = intersectingFeatures.filter(intersectingFeature => geometryEngine.intersects(intersectingFeature.geometry, geometry) === true);
		} catch (error) {
			var result = [];
		}
		
		return result
	},

	unionGeometries : (features, geometryEngine) => {
		/*
		Union an array of feature geometries together.

		Inputs:
		features -- array of objects
		geometryEngine -- Esri geometryEngine class

		Returns:
		result -- unioned geometry object or null
		*/

		let featureGeometries = features.map(feature => {return feature.geometry});
		let result;
		if (featureGeometries.length > 0){
			result = geometryEngine.union(featureGeometries);
		}
		else {
			result = null
		}
		return result
	}

}

export const measures = {

	calculateMinValue: function (featureSet, ratingField) {
		const attributes = featureSet.features.map(x => x.attributes)
		const ratings = attributes.map(x => x[ratingField])
		return Math.min(...ratings)
	},

	calculateMaxValue: function (featureSet, ratingField) {
		const attributes = featureSet.features.map(x => x.attributes)
		const ratings = attributes.map(x => x[ratingField])
		return Math.max(...ratings)
	},

	calculateAverageValue: function (features, ratingField) {
		const values = features.map(x => x.attributes[ratingField])
		return values.reduce((a, b) => a + b) / values.length;
	},

	weighted_avg: function(featureSet, ratingField, weightField) {
		const attributes = featureSet.features.map(x => x.attributes)
		const ratings = attributes.map(x => x[ratingField])
		const weights = attributes.map(x => x[weightField])

		const sumArrayValues = (values) => {
			return values.reduce((p, c) => p + c, 0)
		}
		 return sumArrayValues(ratings.map((factor, index) => factor * weights[index])) / sumArrayValues(weights)
	},
	
	weightedAverageNotEqualOne : (features, ratingField, weightFields) => {
		/*
		Intersect a feature with an array of measureFeatures. Use this array of measureFeatures
		for the weighted average calculation

		Compute the non-normalized (does not sum to 1) weighted average 
		for a specific field using a calculated weight.

		TODO -> error handling
		TODO -> better way to handle weights dynamically

		You can calculate the weighted average of this set of numbers by:
		1. multiplying each value in the set by its weight
		2. adding up the products 
		3. dividing the products' sum by the sum of all weights.

		Inputs:
		features -- array of objects
		ratingField -- string. A field in feature.attributes.
		weightFields -- array of strings. Fields in feature.attributes.

		Returns:
		value -- float. The computed weighted average value.
		*/

		var valueWeighted=[];
		var weights=[];

		features.forEach(feature => {

				let valueRaw = feature.attributes[ratingField]; 
				let weight = (weightFields.length === 1) ? feature.attributes[weightFields[0]] : feature.attributes[weightFields[0]] * feature.attributes[weightFields[1]];
				let valueCalc = valueRaw * weight

				valueWeighted.push(valueCalc);
				weights.push(weight);

		});

		let sumValueWeighted = helperfunctionsMeasures.sumArrayValues(valueWeighted);
		let sumWeights = helperfunctionsMeasures.sumArrayValues(weights);
		let result = sumValueWeighted / sumWeights;

		return result

	},

	concatenateStrings : (features, ratingField) => {
		/*
		Create a concatenated string from feature.attribute values.

		Inputs:
		features -- array of objects
		ratingField -- string

		Returns:
		value -- string
		*/
	 let values = features.map(feature => {return feature.attributes[ratingField]});
	 let set = new Set(values);
	 let value = Array.from(set).join(' AND ');

	 return value
	},

	calculatePercentOverlapLinearPolygon : (feature, unionedGeometry, geometryEngine) => {
		/*
			Calculate the percent overlap between a linear feature and a unioned polygon geometry.

			Inputs:
			feature -- object
			unionedGeometry -- geometry object
			geometryEngine -- Esri geometryEngine class
		*/
	
		let result;
		let featureLength = geometryEngine.planarLength(feature.geometry, 'meters');
		let difference = geometryEngine.difference(feature.geometry, unionedGeometry);
		if (difference != null){
			let featureDifferenceLength = geometryEngine.planarLength(difference, 'meters');
			result = (featureLength - featureDifferenceLength) / featureLength;
		}
		else {

			result = 1;

		}

		return result

	},

	sumMeasureFieldValues(features, measureField){
		/*
		Sum all values from a specific feature.attributes field.

		Inputs:
		features -- array of objects
		measureField -- string

		Returns:
		result -- float
		*/

		let values = features.map(feature => {return feature.attributes[measureField]});

		let result = helperfunctionsMeasures.sumArrayValues(values);

		return result
	}

};

