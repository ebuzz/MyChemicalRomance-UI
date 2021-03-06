(function (root, $, _) {
    'use strict';

    var allCompounds, discoverableCompounds, checkedOutCompounds = {}, discoveries, elements, ready = $.Deferred();
    var workspace= [];

    var mcr = root.mcr = {
        discoveredCompounds: function(group) {
            var result = [];
            for(var key in checkedOutCompounds) {
                var compound = discoverableCompounds[key];
                if (compound.group === group) {
                    result.push(compound);
                }
            }
            return result;
        },
        undiscoveredCompounds: function(symbol) {
            return findPotentialCompounds(symbol).length;
        },
        discoverableCompounds: function() {
            return discoverableCompounds;
        },
        workspace: function() {
            return workspace;
        },
        add: function (symbol) {
            workspace.push(symbol);
            return buildResult();
        },
        remove: function(symbol) {
            for(var i = 0; i < workspace.length; i++) {
                if(workspace[i] === symbol) {
                    workspace.splice(i, 1);
                    break;
                }
            }
            return buildResult();
        },
        reset: function() {
            clearWorkspace();
            returnCompounds();
        },
        clearWorkspace: clearWorkspace,
        getRandomCompound: getRandomCompound,
        setDiscoverableCompounds: setDiscoverableCompounds,

        elements: elements,
        ready: ready,
        symbols: {},
        load: load,
        compoundsUrl: 'json/compounds.json',
        elementsUrl: 'json/elements.json'
    };

    function setDiscoverableCompounds(discoveryList) {
        discoverableCompounds = [];
        for (var i=0; i<discoveryList.length; i++) {
            discoverableCompounds.push(discoveryList[i]);
        }
    }

    function clearWorkspace() {
        workspace = [];
    }

    function getRandomCompound(level) {
        var idx = 0;
        var compound = null;
        do {
            idx = Math.floor((allCompounds.length) * Math.random());
            compound = allCompounds[idx];
        } while (compound.level > level);

        return compound;
    }

    function checkoutCompound(idx) {
        checkedOutCompounds[idx] = true;
    }

    function checkedOut(idx) {
        return !!checkedOutCompounds[idx];
    }

    function returnCompounds() {
        checkedOutCompounds = {};
    }

    function buildResult() {
        var discoveries = findMatchedCompounds();
        return {
            workspace: workspace,
            discovered: discoveries,
            potential: findPotentialCompounds().length
        };
    }

    function findPotentialCompounds(symbol) {

        var map = {};
        if (symbol === undefined) {
            map = parseWorkspace();
        } else {
            map[symbol] = 1;
        }
        var result = [];

        for (var i= 0, n=discoverableCompounds.length; i<n; i++) {
            if (!checkedOut(i) && isPotentialMatch(map, discoverableCompounds[i].elements)) {
                result.push(discoverableCompounds[i]);
            }
        }

        return result;
    }

    function isPotentialMatch(potentialCompound, compound) {
        var potKeys = _.keys(potentialCompound);

        for(var i= 0, n=potKeys.length; i<n; i++) {
            var key= potKeys[i];

            if (! compound[key]) return false;
            if (potentialCompound[key] > compound[key]) return false;
        }
        return true;
    }

    function findMatchedCompounds() {
        var map = parseWorkspace();
        var result = [];

        for (var i= 0, n=discoverableCompounds.length; i<n; i++) {
            if (isMatch(map, discoverableCompounds[i]) && !checkedOut(i)) {
                checkoutCompound(i);
                result.push(discoverableCompounds[i]);
            }
        }

        return result;
    }

    function isMatch(map, compound) {
        return _.isEqual(map, compound.elements);
    }

    function parseWorkspace() {
        var map = {};
        for (var i= 0, n=workspace.length; i<n; i++) {
            var c= workspace[i];
            if (map[c]) {
                map[c] = map[c] + 1;
            } else {
                map[c] = 1;
            }
        }
        return map;
    }

    function initCompounds(data) {
        allCompounds = data;
        discoverableCompounds = allCompounds;
    }

    function initElements(data) {
        elements = data;
        $.each(data, function (idx, element) {
            mcr.symbols[element.SYMBOL] = element;
        });
    }

    function load() {
        $.when($.ajax({url:mcr.compoundsUrl,dataType:'json'}), $.ajax({url:mcr.elementsUrl,dataType:'json'})).then(function (data1, data2) {
            initCompounds(data1[0]);
            initElements(data2[0].PERIODIC_TABLE.ATOM);
            ready.resolve();
        }, function () {
            console.log('mcr.backend.js: error');
        });
    }
})(this, this.jQuery, this._);