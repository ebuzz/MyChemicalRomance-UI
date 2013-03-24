(function(root) {
    'use strict';

    var compounds, elements, ready = $.Deferred();

    var mcr = root.mcr = {
        add: function(symbol) {
            return {};
        },
        ready: ready
    };

    function initCompounds(data) {
        compounds = data;
    }

    function initElements(data) {
        elements = data;
    }

    $.when($.ajax('json/compounds.json'), $.ajax('json/elements.json')).then(function(data1, data2) {
        initCompounds(data1[0]);
        initElements(data2[0].PERIODIC_TABLE.ATOM);
        ready.resolve();
    }, function() {console.log('error')});

})(this);