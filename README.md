# Time Series Clustering

time-series-clustering allows you to find Time Series Based Clustering among your ordered data

[![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Dependency status][david-dm-image]][david-dm-url] [![Dev Dependency status][david-dm-dev-image]][david-dm-dev-url]

### Install

```sh
$ npm install --save time-series-clustering
```

### Sample

This will give you a taste of what time-series-clustering does.

```js
var getClusters = require('time-series-clustering');

var clusterConfig = {
    // max time distance for two items to be in the same cluster
    maxDistance: 60 * 60 * 24 * 1000 * 1, // 1 day
    // filter cluster with a time frame smaller than minTimeFrame
    minTimeFrame: 60 * 60 * 24 * 1000 * 1, // 1 day
    // min number of items to get a relevant cluster
    minRelevance: 10
};

// convertedData must contain UNIX timestamp in "value" fields ordered from the most recent to the oldest
var convertedData = {
    "data": [{
        "id": 0,
        "value": 1477504545436
    }, {
        "id": 1,
        "value": 1350777600000
    }, {
        "id": 2,
        "value": 1350777600000
    }, {
        "id": 3,
        "value": 1350777600000
    }, {
        "id": 4,
        "value": 1350777600000
    }, {
        "id": 5,
        "value": 1350691200000
    }, {
        "id": 6,
        "value": 1350691200000
    }, {
        "id": 7,
        "value": 1350691200000
    }, {
        "id": 8,
        "value": 1350691200000
    }, {
        "id": 9,
        "value": 1350691200000
    }, {
        "id": 10,
        "value": 1350691200000
    }, {
        "id": 11,
        "value": 1350691200000
    }, {
        "id": 12,
        "value": 1350691200000
    }, {
        "id": 13,
        "value": 1337126400000
    }]
};

console.log(getClusters(convertedData, clusterConfig));

// RETURNED OBJECT -> ARRAY OF CLUSTERS
/*
    {
        "clusters": [{
            "value_max": 1350777600000,
            "value_min": 1350691200000,
            "value_range": 1,
            "relevance": 12,
            "ids": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
        }]
    }
*/
```

## License

[The MIT License](LICENSE) - © [Alessio Enrico Repetti]  (https://github.com/repeale)

[npm-url]: https://npmjs.org/package/time-series-clustering
[downloads-image]: http://img.shields.io/npm/dm/time-series-clustering.svg
[npm-image]: http://img.shields.io/npm/v/time-series-clustering.svg
[david-dm-url]:https://david-dm.org/repeale/time-series-clustering
[david-dm-image]:https://david-dm.org/repeale/time-series-clustering.svg
[david-dm-dev-url]:https://david-dm.org/repeale/time-series-clustering#info=devDependencies
[david-dm-dev-image]:https://david-dm.org/repeale/time-series-clustering/dev-status.svg
