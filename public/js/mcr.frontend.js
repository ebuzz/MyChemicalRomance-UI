$(document).ready(function(){
    'use strict';

    var currentId = 1;
    //Why doesnt this stay on the Canvas

    $("canvas").drawImage({
        name:'trashcan',
        layer: true,
        source: "images/trashcan_full.png",
        x: 800, y: 30,
        scale: 0.3
    });

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
                font: "36pt Verdana, sans-serif",
                text: params.symbol

            });

            $.jCanvas.detectEvents(this, ctx, params);

        }
    });

//    $("canvas").drawChemicalElement({
//        layer: true,
//        draggable: true,
//        fillStyle: "#fff",
//        symbol: "H",
//        width: 50,
//        height: 50,
//        x: 150,
//        y: 130
//    });

    $('#chemSymbol').on('change', function() {
        var symbol = $('#chemSymbol').val();
        if(symbol === '') {
            return;
        }
        var chemical = {
            id: currentId++,
            symbol: symbol
        };

        mixingBoard.addChemical(chemical);

        $("canvas").drawChemicalElement({
            name: ''+chemical.id,
            chemical: chemical,
            layer: true,
            draggable: true,
            fillStyle: "#fff",
            symbol: $('#chemSymbol').val(),
            width: 50,
            height: 50,
            x: 300,
            y: 300,
            dragstop: function(event) {
                var withinXBoundry = (event.x < 800 && event.x > 770);
                var withinYBoundry = (event.y > 15 && event.y < 45);
                if(withinXBoundry && withinYBoundry) {
                    mixingBoard.removeChemical(chemical);
                }
            }
        });
    });

});

var mixingBoard = {
    chemicals: [],

    addChemical: function(chemical) {
        this.chemicals.push(chemical);
    },

    removeChemical: function(chemical) {
        for(var i = 0; i < this.chemicals.length; i++) {
            if(this.chemicals[i].id === chemical.id) {
                $("canvas").removeLayer(''+this.chemicals[i].id);
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