module.exports = (data, oConfig) => {
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
    oConfig = _extend(_defaultConfig, oConfig);

    console.log(oConfig);

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
        var clusterTimeFrame = oCluster.value_max - oCluster.value_min;
        if (clusterTimeFrame < 0) {
            throw 'negative clusterTimeFrame';
        }

        // apply only filters on the single cluster
        if (clusterTimeFrame >= oConfig.minTimeFrame && oCluster.relevance >= oConfig.minRelevance) {
            _clusters.push(oCluster);
        }
    };

    var _areInSameCluster = (oRecentData, oOldData) => {
        var areInSameCluster = false;

        if (Math.abs(oRecentData.value - oOldData.value) <= oConfig.maxDistance) {
            areInSameCluster = true;
        }

        return areInSameCluster;
    };

    try {
        for (var ii = 0, len = data.data.length; ii < len; ii++) {
            var idsInTheSameCluster = idsInTheSameCluster || [];

            var maxValue = maxValue || null;
            var minValue = minValue || null;

            if (ii === 0) {
                // add first item in the cluster
                idsInTheSameCluster.push(data.data[ii].id);
                //maxValue = data.data[ii].value;
            } else {
                maxValue = maxValue || data.data[ii - 1].value; // already in cluster

                if (_areInSameCluster(data.data[ii - 1], data.data[ii])) {
                    // pushing the current id in the cluster
                    idsInTheSameCluster.push(data.data[ii].id);
                    
                    if (ii === data.data.length - 1) {
                        minValue = data.data[ii].value;
                        // if the last item belong to the cluster add the cluster
                        _addCluster(new Cluster(minValue, maxValue, idsInTheSameCluster));
                    }
                } else {
                    // current item is no more in the previous cluster
                    minValue = data.data[ii - 1].value;

                    _addCluster(new Cluster(minValue, maxValue, idsInTheSameCluster));

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
