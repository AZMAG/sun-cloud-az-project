export const normalize = (data, ruleName) => {

	console.log(data);
	// Look up the rule corresponding to the provided rule name
	const rule = normalizationRules[ruleName];
	console.log(rule);
	const log = rule.log;
	const reverse = rule.reverse;
	const clip_outliers = rule.stdClip;

	// If all the values in the array are zero, just return the original array
	if (data.reduce((a, b) => a + b, 0) === 0) {
		return data;
	}

	// If 'log' is true and the array contains zero or negative values, shift the array by the absolute value of the minimum value + 1
	// and then apply a natural logarithm transformation to the shifted values
	if (log === true) {
		if (Math.min(...data) <= 0) {
			data = data.map((value) => {
				if (value !== null) {
					return value + (Math.abs(Math.min(...data)) + 1)
				} else {
					return value;
				}
			})
		}
		data = data.map((value) => {
			if (value !== null) {
				return Math.log(value);
			} else {
				return value;
			}
		})
	}
	console.log(data)

	// If 'clip_outliers' is greater than zero, calculate the mean and standard deviation of the array
	// and clip any values that are more than 'clip_outliers' standard deviations from the mean
	// console.log(data);

	if (clip_outliers > 0) {
		let sd = standardDeviation(data);
		// console.log(sd)
		let upper = mean(data) + clip_outliers * sd;
		// console.log(upper)
		let lower = mean(data) - clip_outliers * sd;
		// console.log(lower)
		data = data.map((value) => {
			if (value !== null) {
				// const new_val = Math.max(Math.min(value, upper), lower)

				return Math.max(Math.min(value, upper), lower);
			} else {
				return value;
			}
		});
	}

	// console.log(data)

	// Find the minimum and maximum values in the array with no nulls
	let new_arr = data.filter(item => item !== null);
	let min_val = Math.min(...new_arr);
	let max_val = Math.max(...new_arr);


	let result;
	// If 'reverse' is true, perform inverse normalization by subtracting each value from the maximum value
	// and dividing the result by the range of the original values (i.e., max_val - min_val)
	if (reverse === true) {
		result = data.map((value) => {
			if (value !== null) {
				return Math.abs((value - max_val) / (max_val - min_val));
			} else {
				return value;
			}
		})
	} else {
		// Otherwise, perform standard normalization by subtracting each value from the minimum value
		// and dividing the result by the range of the original values
		result = data.map((value) => {
			if (value !== null) {
				return (value - min_val) / (max_val - min_val)
			} else {
				return value;
			}
		})
	}

	// Round each value in the resulting array to four decimal places and return the array
	return result.map((value) => {
		if (value !== null) {
			return parseFloat(value.toFixed(4));
		} else {
			return value;
		}
	})
	// parseFloat(value.toFixed(4))})
}

export const normalizationRules = {

	injury_rate_norm: {
		log: false, reverse: false, stdClip: 3
	},

	non_motorized_injuries_norm: {
		log: false, reverse: false, stdClip: 3
	},

	excess_expected_crashes_norm: {
		log: false, reverse: false, stdClip: 3
	},

	pavement_pct_poor_norm: {
		log: false, reverse: false, stdClip: 3
	},

	bridge_structural_rating_norm: {
		log: false, reverse: true, stdClip: 3
	},

	bridge_deck_geometry_norm: {
		log: false, reverse: true, stdClip: 3
	},

	lottr_norm: {
		log: false, reverse: false, stdClip: 3
	},

	avg_delay_norm: {
		log: false, reverse: false, stdClip: 3
	},

	vc_ratio_norm: {
		log: false, reverse: false, stdClip: 3
	},

	vmt_change_norm: {
		log: false, reverse: false, stdClip: 3
	},

	transit_overlap_norm: { // .clip(upper=100))
		log: false, reverse: false, stdClip: 3
	},

	transit_ridership_norm: { // .fillna(0))
		log: false, reverse: false, stdClip: 3
	},

	employment_change_norm: {
		log: false, reverse: false, stdClip: 3
	},

	critical_freight_norm: {
		log: false, reverse: false, stdClip: 3
	},

	households_no_broadband_norm: {
		log: false, reverse: false, stdClip: 3
	}
}

const standardDeviation = (arr) => {
	// console.log(arr);

	arr = arr.filter(item => item !== null);

	const n = arr.length;
	const mean = arr.reduce((a, b) => a + b) / n;
	// console.log(mean)
	return Math.sqrt(arr.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n);
}

const mean = (numbers) => {
	numbers = numbers.filter(item => item !== null);
	// console.log(numbers)

	let sum = numbers.reduce((a, b) => a + b, 0);
	// console.log(sum)
	return sum / numbers.length;
}
