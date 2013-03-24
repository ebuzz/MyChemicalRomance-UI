$(document).ready(function(){

    //Why doesnt this stay on the Canvas
    $("canvas").drawRect({
        fillStyle: "#000",
        x: 0,
        y: 0,
        width: 50,
        height: 50,
        fromCenter: false
    });

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


});

var mixingBoard = {
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
