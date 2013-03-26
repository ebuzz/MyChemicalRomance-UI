PeriodicMatch = {};
PeriodicMatch.offset = 10;
PeriodicMatch.gridSize = 60;
PeriodicMatch.elementSize = 50;

(function(){

    $.jCanvas.extend({
        name: "drawChemicalElement",
        props: {},
        fn: function(ctx, params) {

            $("canvas")

                .drawRect({
                    fillStyle: params.fillStyle,
                    x: params.x,
                    y: params.y,
                    width: params.width,
                    height: params.height,
                    shadowColor: "#000",
                    shadowBlur: 10,
                    fromCenter: false
                })
                .drawText({
                    fillStyle: "#9cf",
                    strokeStyle: "#25a",
                    strokeWidth: 2,
                    x: params.x + 25,
                    y: params.y + 25,
                    font: "36pt Verdana, sans-serif",
                    text: params.symbol

                });

            $.jCanvas.detectEvents(this, ctx, params);

        }
    });

    PeriodicMatch.data = {
        chemicals: [],

        addChemical: function(chemical) {
            this.chemicals.push(chemical);
        },

        removeChemical: function(chemical) {
            for(var i = 0; i < this.chemicals.length; i++) {
                if(this.chemicals[i].id === chemical.id) {
                    $("canvas").removeLayer(this.chemicals[i].id);
                    this.chemicals.splice(i, 1);
                }
            }
        },

        updateChemical: function(chemical) {
            for(var i = 0; i < this.chemicals.length; i++) {
                if(this.chemicals[i].id === chemical.id) {
                    this.chemicals[i] = chemical;
                }
            }
        }
    };

    var currentId = 0;
    PeriodicMatch.addChemical = function(symbol) {
        var chemical = {
            id: currentId++,
            symbol: symbol
        };

//        PeriodicMatch.data.addChemical(chemical);

        $("canvas").drawChemicalElement({
            name: chemical.id,
            chemical: chemical,
            layer: true,
            draggable: true,
            fillStyle: "#fff",
            symbol: symbol,
            width: 50,
            height: 50,
            x: 300,
            y: 300,
            dragstop: function(event) {
                if(event.x < 50 && event.y < 50) {
                    PeriodicMatch.data.removeChemical(chemical);
                }
            }
        });
    };

    PeriodicMatch.targetGrid = function(width, height) {
        for (var row = 0; row < height; row++) {
            for (var col = 0; col < width; col++) {
                var x = col * PeriodicMatch.gridSize + PeriodicMatch.offset;
                var y = row * PeriodicMatch.gridSize + PeriodicMatch.offset;
                $("canvas").drawRect({
                    strokeStyle: "black",
                    strokeWidth: 1,
                    x: x, y: y,
                    width: PeriodicMatch.gridSize,
                    height: PeriodicMatch.gridSize,
                    layer: true,
                    fromCenter: false
                });
            }
        }
    };

    PeriodicMatch.targetGrid(18, 2);

    $.when($.ajax('json/periodic.table.json')).then(function (table) {
        PeriodicMatch.table = table;
        for (var i= 0; i < table.length; i++) {
            PeriodicMatch.addChemical(table[i].symbol);
        }
    }, function () {
        console.log('error')
    });

//    PeriodicMatch.addChemical('H');
})();

