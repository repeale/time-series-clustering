var assert = require('assert');
var getClusters = require('../index.js');

// README.md sample data
var data01 = require(__dirname + '/sampledata/data01.json');
// 1 day distance
var data02 = require(__dirname + '/sampledata/data02.json');
// 1 day timeframe
var data03 = require(__dirname + '/sampledata/data03.json');

describe('Cluster output for README.md', function() {
    var oClust = getClusters(data01);
    it('should return 1 cluster', function() {
        assert.deepEqual(oClust.clusters.length, 1);
    });
    it('should have value_range === 1', function() {
        assert.deepEqual(oClust.clusters[0].value_range, 1);
    });
    it('should have value_max === 1350777600000', function() {
        assert.deepEqual(oClust.clusters[0].value_max, 1350777600000);
    });
    it('should have value_min === 1350691200000', function() {
        assert.deepEqual(oClust.clusters[0].value_min, 1350691200000);
    });
    it('should have relevance === 12', function() {
        assert.deepEqual(oClust.clusters[0].relevance, 12);
    });
    it('should have ids === [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]', function() {
        assert.deepEqual(oClust.clusters[0].ids, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    });
});

describe('Cluster config:', function() {
    describe('maxDistance', function() {
        var oClust4 = getClusters(data02, {maxDistance: 60 * 60 * 24 * 1000 * 1});
        it('should return 1 cluster -> maxDistance is equal to the items distance', function() {
            assert.deepEqual(oClust4.clusters.length, 1);
        });

        var oClust5 = getClusters(data02, {maxDistance: 60 * 60 * 24 * 999 * 1});
        it('should return 0 cluster -> maxDistance is less than the items distance', function() {
            assert.deepEqual(oClust5.clusters.length, 0);
        });
    });

    describe('minTimeFrame', function() {
        var oClust6 = getClusters(data03, {minTimeFrame: 60 * 60 * 24 * 1000 * 1});
        it('should return 1 cluster -> minTimeFrame is equal to the items timeframe', function() {
            assert.deepEqual(oClust6.clusters.length, 1);
        });

        var oClust7 = getClusters(data03, {minTimeFrame: 60 * 60 * 24 * 1001 * 1});
        it('should return 0 cluster -> minTimeFrame is less than the items timeframe', function() {
            assert.deepEqual(oClust7.clusters.length, 0);
        });
    });

    describe('minRelevance', function() {
        var oClust2 = getClusters(data02);
        it('should return 1 cluster', function() {
            assert.deepEqual(oClust2.clusters.length, 1);
        });
        it('should return 1 cluster with relevance === 10', function() {
            assert.deepEqual(oClust2.clusters[0].relevance, 10);
        });

        var oClust3 = getClusters(data02, {minRelevance: 11});
        it('should return 0 cluster -> minRelevance === 11 and cluster relevance === 10', function() {
            assert.deepEqual(oClust3.clusters.length, 0);
        });
    });
});
