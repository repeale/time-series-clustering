## What is time-series-clustering?

- **Time Series** - time-series-clustering allows you to find Time Series Based Clustering among your data

## Sample

This file will give you a taste of what time-series-clustering does.

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
        "value": 1475625600000
    }, {
        "id": 2,
        "value": 1475625600000
    }, {
        "id": 3,
        "value": 1043712000000
    }]
};

var clusters = getClusters(convertedData);
var json = JSON.stringify(clusters);

fs.writeFile("./output.json", json, (err) => {
    if (err) {
        return console.log(err);
    }

    console.log("The file was saved!");
    console.log(clusters.clusters.length + ' clusters found!');
});
```
