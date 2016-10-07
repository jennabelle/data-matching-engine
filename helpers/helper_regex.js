module.exports = {

	// escape reg exp brackets '/' to get value of variable
	escapeRegEx: function(str) {
		return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
	}
};