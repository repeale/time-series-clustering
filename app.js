// =============================================================================
// get packages ================================================================
// =============================================================================

// get data
var sampleData = require('./data/data.js');
var getClusters = require('./Clusters.js');
var fs = require('fs');

var clusterConfig = {
    //maxDistance: 86400000 * 1, // 1 day
    //maxClusters: 10, // min value 2,
    //minTimeFrame: 86400000 * 2 // 1 day
};

var convertData = (oData) => {
    var _convertedData = {
        data: []
    };

    for (var ii = 0, len = oData.data.periods.length; ii < len; ii++) {
        var period = oData.data.periods[ii];
        for (var jj = 0, len2 = period.ids.length; jj < len2; jj++) {
            var id = period.ids[jj];
            _convertedData.data.push({
                id: id,
                value: Date.parse(period.period)
            });
        }
    }

    return _convertedData;
};

var init = () => {
    var convertedData = convertData(sampleData, clusterConfig);

    /*var json2 = JSON.stringify(convertedData);
    fs.writeFile("./convertedData.json", json2, (err) => {
        if (err) {
            return console.log(err);
        }

        console.log("The file was saved!");
    });*/

    var clusters = getClusters(convertedData);
    var json = JSON.stringify(clusters);

    fs.writeFile("./output.json", json, (err) => {
        if (err) {
            return console.log(err);
        }

        console.log("The file was saved!");
        console.log(clusters.clusters.length + ' clusters found!');
    });
};

init();
