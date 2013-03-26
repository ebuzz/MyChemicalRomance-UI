$(document).ready(function(){
    mcr.load();

    mcr.ready.done(function() {
    'use strict';
    resetUI();

    $( "#tabs" ).tabs();
    var searchDialog = $( "#searchDialog" ).dialog({
        autoOpen: false,
        draggable: false,
        modal: true,
        resizable:false,
        title:'Search',
        position: {at:'center', of:$("canvas")}
    });
    var currentId = 1;

    $.jCanvas.extend({
        name: "drawChemicalElement",
        props: {},
        fn: function(ctx, params) {

            $("canvas").drawRect({
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
                font: "28pt Verdana, sans-serif",
                text: params.symbol

            });

            $.jCanvas.detectEvents(this, ctx, params);
        }
    });

    function resetUI() {
        $("canvas").removeLayers();
        $("canvas").clearCanvas();


        $("canvas").drawImage({
            name:'background',
            layer: true,
            source: "images/blackboard.jpg",
            x: 0, y: 0,
            scaleX : 1.5
        });

        $("canvas").drawImage({
            name:'controls',
            layer: true,
            source: "images/trashcan_full.png",
            x: 875, y: 375,
            scale: 0.3
        });

        $("canvas").drawImage({
            name:'controls',
            layer: true,
            source: "images/search.png",
            x: 455, y: 375,
            scale: 0.5,
            click : function(layer) {
                $("#searchDialog").dialog('open');
            }
        });

        $("canvas").drawImage({
            name:'controls',
            layer: true,
            source: "images/help.png",
            x: 25, y: 375,
            scale: 0.3
        });

        drawPotentialCount(mcr.undiscoveredCompounds());

    }

    function drawPotentialCount(count) {
        $("canvas").removeLayer("potentialCount");
        $("canvas").drawText({
            name: "potentialCount",
            layer: true,
            fillStyle: "#fff",
            x: 50, y: 15,
            font: "10pt Verdana, sans-serif",
            text: "Potential: " + count
        });
    }

    //Attach Events to Table
    $(".symbol").each(function(i, periodicElement) {
        $(periodicElement).on('click', function(event) {
            var symbol = $(this).find("abbr").text();
            addElementToCanvas(symbol);
        });
    });

    $('#chemSymbol').on('change', function() {
        addElementToCanvas();
    });

    $('#addElement').on('click', function() {
        addElementToCanvas();
    });

    function addElementToCanvas(addedSymbol) {
        var symbol = addedSymbol ? addedSymbol : $('#chemSymbol').val();
        console.log(addedSymbol);
        if(symbol === '') {
            return;
        }

        var result = mcr.add(symbol);
        if(result.discovered.length > 0) {
            var chemical = {
                id: currentId++,
                symbol: result.discovered[0].formula
            };
            mixingBoard.removeAll();
            //animateExplosion();
            resetUI();

            drawChemical(chemical);
            mcr.add(chemical.symbol);
        }else {
            var chemical = {
                id: currentId++,
                symbol: symbol
            };

            var x = Math.floor((Math.random()*700)+100);
            var y = Math.floor((Math.random()*200)+100);

            drawChemical(chemical,x,y);
        }
        drawPotentialCount(result.potential);

    }

    function drawChemical(chemical,x,y) {
        mixingBoard.addChemical(chemical);
        var x = x !==undefined? x : Math.floor((Math.random()*700)+100);
        var y = y!==undefined? y : Math.floor((Math.random()*200)+100);
        $("canvas").drawChemicalElement({
            name: ''+chemical.id,
            chemical: chemical,
            layer: true,
            draggable: true,
            fillStyle: "#fff",
            symbol: chemical.symbol,
            width: 50,
            height: 50,
            x: x,
            y: y,
            dragstop: function(event) {
                var withinXBoundary = (event.x > 810);
                var withinYBoundary = (event.y > 315);
                if(withinXBoundary && withinYBoundary) {
                    mixingBoard.removeChemical(chemical);
                    drawPotentialCount(mcr.undiscoveredCompounds());
                }
            }
        });
    }
    });
});

var mixingBoard = {
    chemicals: [],

    addChemical: function(chemical) {
        this.chemicals.push(chemical);
    },

    removeAll: function() {
        for(var i = 0; i < this.chemicals.length; i++) {
            $("canvas").removeLayer(''+this.chemicals[i].id);
        }
        mcr.clearWorkspace();
        this.chemicals = [];
    },

    removeChemical: function(chemical) {
        for(var i = 0; i < this.chemicals.length; i++) {
            if(this.chemicals[i].id === chemical.id) {
                $("canvas").removeLayer(''+this.chemicals[i].id);
                mcr.remove(this.chemicals[i].symbol);
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
