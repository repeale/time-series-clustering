// time-series-clustering
// time series HCA
module.exports = (data, oConfig) => {
    // TODO: add support for not ordered values?

    var _extend = (obj, src) => {
        for (var key in src) {
            if (src.hasOwnProperty(key)) obj[key] = src[key];
        }

        return obj;
    };

    var _defaultConfig = {
        // max time distance for two items to be in the same cluster
        maxDistance: 60 * 60 * 24 * 1000 * 1, // 1 day
        // filter cluster with a time frame smaller than minTimeFrame
        minTimeFrame: 60 * 60 * 24 * 1000 * 1, // 1 day
        // min number of items to get a relevant cluster
        minRelevance: 10
    };

    oConfig = oConfig || {};
    oConfig = _extend(oConfig, _defaultConfig);

    // holds all the Cluster obj
    var _clusters = [];

    var Cluster = function(minValue, maxValue, aIds) {
        return {
            value_max: maxValue,
            value_min: minValue,
            value_range: (maxValue - minValue) / oConfig.maxDistance,
            relevance: [].concat(aIds).length,
            ids: [].concat(aIds)
        };
    };

    var _addCluster = (oCluster) => {
        _clusters.push(oCluster);
    };

    var _areInSameCluster = (oRecentData, oOldData) => {
        var areInSameCluster = false;

        if (Math.abs(oRecentData.value - oOldData.value) <= oConfig.maxDistance) {
            areInSameCluster = true;
        }

        return areInSameCluster;
    };

    try {
        for (var ii = 1, len = data.data.length; ii < len; ii++) {
            var idsInTheSameCluster = idsInTheSameCluster || [];

            if (ii === 0) {
                // add first item in the cluster
                idsInTheSameCluster.push(data.data[ii].id);
            } else {
                var maxValue = maxValue || data.data[ii - 1].value; // already in cluster

                if (_areInSameCluster(data.data[ii - 1], data.data[ii])) {
                    idsInTheSameCluster.push(data.data[ii].id);
                } else { // current item is no more in the previous cluster
                    minValue = data.data[ii - 1].value;

                    var clusterTimeFrame = maxValue - minValue;
                    if (clusterTimeFrame < 0) {
                        throw 'negative clusterTimeFrame';
                    }

                    // apply only filters on the single cluster
                    if (clusterTimeFrame >= oConfig.minTimeFrame && idsInTheSameCluster.length >= oConfig.minRelevance) {
                        var cluster = new Cluster(minValue, maxValue, idsInTheSameCluster);
                        _addCluster(cluster);
                    }

                    // clear data for a new cluster
                    minValue = null;
                    maxValue = null;
                    idsInTheSameCluster = [];

                    // push current data in the next cluster
                    idsInTheSameCluster.push(data.data[ii].id);
                }
            }
        }
    } catch (e) {
        console.log('ERROR: ' + e);
    }


    return {
        clusters: _clusters
    };
};
