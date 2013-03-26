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
                    fillStyle: "black",
                    strokeStyle: "black",
                    strokeWidth: 1,
                    x: params.x + 20,
                    y: params.y + 20,
                    font: "20pt Verdana, sans-serif",
                    text: params.symbol

                });

            $.jCanvas.detectEvents(this, ctx, params);

        }
    });

    var gridOffset = 10;
    var gridSize = 50;
    var elementSize = 40;
    var difficultyLevel;

    var periods = [];
    var elements = [];

    function addChemicalToCanvas(symbol, x, y) {
        $("canvas").drawChemicalElement({
            name: symbol,
            layer: true,
            draggable: true,
            fillStyle: "#fff",
            symbol: symbol,
            width: elementSize,
            height: elementSize,
            x: x,
            y: y,
            dragstop: function(event) {
                console.log(event);
            }
        });
    };

    function drawTable(totalPeriods) {
        for (var row = 0; row < totalPeriods; row++) {
            var groups = periods[row].groups;
            for (var col = 0; col < groups.length; col++) {
                var x = (groups[col] - 1) * gridSize + gridOffset;
                var y = row * gridSize + gridOffset;
                $("canvas").drawRect({
                    strokeStyle: "black",
                    strokeWidth: 1,
                    x: x, y: y,
                    width: gridSize,
                    height: gridSize,
                    layer: true,
                    fromCenter: false
                });
            }

        }
    };

    function shuffleElements(lastElement){ //v1.0
        for(var j, x, i = lastElement; i; j = parseInt(Math.random() * i), x = elements[--i], elements[i] = elements[j], elements[j] = x);
    };

    function drawElements(row) {
        var i = 0;
        var y = (row + 1) * gridSize;
        var x = 0;
        var lastElement = periods[row - 1].lastElement;
        shuffleElements(lastElement);
        for (; i < lastElement; i++) {
            x = gridOffset + (gridSize * i)
            addChemicalToCanvas(elements[i].symbol, x, y);
        }
    }

    $.when($.ajax('json/periodic-table-elements.json'), $.ajax('json/periodic-table-grid.json')).then(function (tableElements, tablePeriods) {
        elements = tableElements[0];
        periods = tablePeriods[0];
    }, function () {
        console.log('error')
    });

    $('#start-matching').click(function() {
        $('canvas').removeLayers();
        $('canvas').clearCanvas();
        difficultyLevel = parseInt($('#matching-difficulty').val());
        drawTable(difficultyLevel);
        drawElements(difficultyLevel);
    });

    function getElement(symbol) {
        for (var i = 0; i < elements.length; i++) {
            if (elements[i].symbol === symbol) {
                return elements[i];
            }
        }
    }

    $('#finish-matching').click(function() {
        for (var i = 0; i < periods[difficultyLevel - 1].lastElement; i++) {
            var element = elements[i];
            var layer = $('canvas').getLayer(element.symbol);
            var targetX = (periods[element.period - 1].groups[element.group - 1] - 1) * gridSize + gridOffset;
            var targetY = (element.period - 1) * gridSize + gridOffset;

            console.log("element: ".concat(element.symbol));
            console.log("x: ".concat(layer.x));
            console.log("y: ".concat(layer.y));
            console.log("group: ".concat(element.group));
            console.log("period: ".concat(element.period));
            console.log("targetX: ".concat(targetX));
            console.log("targetY: ".concat(targetY));

            if ((layer.x >= targetX && layer.x <= (targetX + 20)) &&
                (layer.y >= targetY && layer.y <= (targetY + 20))) {
                $('#canvas').setLayer(element.symbol, {
                    fillStyle: 'green'
                })
            } else {
                $('#canvas').setLayer(element.symbol, {
                    fillStyle: 'red'
                })
            }
        }


//        var layer = $('canvas').getLayer('H');
//        var element = getElement('H');
//        var x = (groups[col] - 1) * gridSize + gridOffset;
//        var y = row * gridSize + gridOffset;
//        var targetX = (periods[element.period - 1].groups[element.group - 1] - 1) * gridSize + gridOffset;
//        var targetY = (element.period - 1) * gridSize + gridOffset;


//        if ((layer.x >= targetX && layer.x <= (targetX + 20)) &&
//            (layer.y >= targetY && layer.y <= (targetY + 20))) {
//            $('#canvas').setLayer('H', {
//                fillStyle: 'green'
//            })
//        } else {
//            $('#canvas').setLayer('H', {
//                fillStyle: 'red'
//            })
//        }

    });
})();

