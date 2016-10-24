// time-series-clustering
// time series HCA
module.exports = (data, oConfig) => {
    // TODO: add support for not ordered values

    var _extend = (obj, src) => {
        for (var key in src) {
            if (src.hasOwnProperty(key)) obj[key] = src[key];
        }

        return obj;
    };

    var _defaultConfig = {
        // max time distance for two items to be in the same cluster
        maxDistance: 86400000 * 1, // 1 day
        // max number of clusters returned - returned clusters are those with more elements
        maxClusters: 10, // min value 2 
        // filter cluster with a time frame smaller than minTimeFrame
        minTimeFrame: 86400000 * 0, // 0 day
        // min number of items to get a relevant cluster
        minRelevance: 1
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

    var _gerIrrelevantClusterIndex = (aClusters) => {
        var irrelevantClusterIndex = 0;
        var foundIrrelevant = false;

        for (var ii = 1, len = aClusters.length; ii < len; ii++) {
            if (aClusters[ii].ids.length < aClusters[irrelevantClusterIndex].ids.length) {
                irrelevantClusterIndex = ii;
                foundIrrelevant = true;
            } else if (ii === 1) {
                foundIrrelevant = true;
                irrelevantClusterIndex = 0;
            }
        }

        if (foundIrrelevant)
            return irrelevantClusterIndex;
        else
            return -1;
    };

    var _addCluster = (oCluster) => {
        if (_clusters.length < oConfig.maxClusters) {
            _clusters.push(oCluster);
        } else {
            // override most irrelevant cluster
            var irrelevantClusterIndex = _gerIrrelevantClusterIndex(_clusters);

            if (irrelevantClusterIndex === -1)
                return;

            if (_clusters[irrelevantClusterIndex].ids.length < oCluster.ids.length)
                _clusters[irrelevantClusterIndex] = oCluster;
        }
    };

    var _areInSameCluster = (oRecentData, oOldData) => {
        var areInSameCluster = false;

        if (oRecentData.value - oOldData.value <= oConfig.maxDistance) {
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

                    if (clusterTimeFrame > oConfig.minTimeFrame && idsInTheSameCluster.length >= oConfig.minRelevance) {
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
