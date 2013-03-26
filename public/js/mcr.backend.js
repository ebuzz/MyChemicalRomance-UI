(function (root, $) {
    'use strict';

    var compounds, discoveries, elements, ready = $.Deferred();

    var mcr = root.mcr = {
        add: function (symbol) {
            return {};
        },
        ready: ready,
        symbols: {}
    };

    function initCompounds(data) {
        compounds = data;
    }

    function initElements(data) {
        elements = data;
        $.each(data, function (idx, element) {
            mcr.symbols[element.SYMBOL] = element;
        });
        buildDiscoveryTree();
    }

    function buildDiscoveryTree() {
        discoveries =  {
            count: 0,
            symbols: {}
        };

        $.each(compounds, function(idx, compound) {
            discoveries.count++;
        });
    }

    $.when($.ajax('json/compounds.json'), $.ajax('json/elements.json')).then(function (data1, data2) {
        initCompounds(data1[0]);
        initElements(data2[0].PERIODIC_TABLE.ATOM);
        ready.resolve();
    }, function () {
        console.log('error');
    });

})(this, this.jQuery);