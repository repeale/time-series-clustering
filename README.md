# Time Series Clustering

time-series-clustering allows you to find Time Series Based Clustering among your data

### Install

```sh
$ npm install --save time-series-clustering
```

### Sample

This will give you a taste of what time-series-clustering does.

```js
var getClusters = require('../lib/Clusters.js');

var clusterConfig = {
    // max time distance for two items to be in the same cluster
    maxDistance: 60 * 60 * 24 * 1000 * 1, // 1 day
    // filter cluster with a time frame smaller than minTimeFrame
    minTimeFrame: 60 * 60 * 24 * 1000 * 1, // 1 day
    // min number of items to get a relevant cluster
    minRelevance: 10
};

var convertedData = {
    "data": [{
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

var clusters = getClusters(convertedData);

// RETURNED OBJECT -> ARRAY OF CLUSTERS
/*
    {
        "clusters": [{
            "value_max": 1350777600000,
            "value_min": 1350691200000,
            "value_range": 1,
            "relevance": 11,
            "ids": [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
        }]
    }
*/

var json = JSON.stringify(clusters);

fs.writeFile("./output.json", json, (err) => {
    if (err) {
        return console.log(err);
    }

    console.log("The file was saved!");
    console.log(clusters.clusters.length + ' clusters found!');
});
```

## License

[The MIT License](LICENSE) - © [Alessio Enrico Repetti]  (https://github.com/repeale)
