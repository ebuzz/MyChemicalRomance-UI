$(document).ready(function(){
    var suspendRedraw = false;
    mcr.load();

    mcr.ready.done(function() {
    'use strict';
    //------Game Loop-----------
    var ONE_FRAME_TIME = 1000 / 60;
    var mainLoop = function() {
        drawGame();
    };

    var drawGame = function() {
        if(!suspendRedraw) {
            resetUI();
            drawAllChemicals();
        }
    };

    setInterval( mainLoop, ONE_FRAME_TIME );
    //--------End Game Loop------

    function drawAllChemicals() {
        for(var i = 0; i < mixingBoard.chemicals.length; i++) {
            var chemical = mixingBoard.chemicals[i];
            drawChemical(chemical, chemical.x, chemical.y);
        }
    }

    function renderCompounds(tabSelector, compounds) {
        $(tabSelector).empty();
        for(var i = 0; i < compounds.length; i++) {
            $(tabSelector).append('<div>' + compounds[i].formula + ' - ' + compounds[i].name + '</div>');
        }
        $(tabSelector + "-count").empty();
        $(tabSelector + "-count").append(compounds.length);
    }

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
            source: "images/reactor_area.jpg",
            x: 675, y: 200,
            scale: 0.6
        });

        $("canvas").drawImage({
            name:'controls',
            layer: true,
            source: "images/trashcan_full.png",
            x: 875, y: 375,
            scale: 0.3
        });

//        $("canvas").drawImage({
//            name:'controls',
//            layer: true,
//            source: "images/search.png",
//            x: 455, y: 375,
//            scale: 0.5,
//            click : function(layer) {
//                $("#searchDialog").dialog('open');
//            }
//        });

//        $("canvas").drawImage({
//            name:'controls',
//            layer: true,
//            source: "images/help.png",
//            x: 25, y: 375,
//            scale: 0.3
//        });



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

        if(symbol === '') {
            return;
        }

        var x = Math.floor((Math.random()*700)+100) / 2;
        var y = Math.floor((Math.random()*200)+100);
        var chemical = {
            id: currentId++,
            symbol: symbol,
            x: x,
            y: y
        };
        mixingBoard.addChemical(chemical);
        drawChemical(chemical, x, y);
    }

    function drawChemical(chemical,x,y) {
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
                suspendRedraw = false;

                if((event.x > 810) && (event.y > 315)) {
                    mixingBoard.removeChemical(chemical);
                    drawPotentialCount(mcr.undiscoveredCompounds());
                } else if(event.x >= 450) {
                    var result = mcr.add(chemical.symbol);
                    if(result.discovered.length > 0) {
                        var x = 750;
                        var y = 200;
                        var group = result.discovered[0].group;
                        renderCompounds(group === "covalent"?"#tabs-3":"#tabs-2",mcr.discoveredCompounds(group));
                        mixingBoard.removeAllFromReactor();
                        var foundChemical = {
                            id: currentId++,
                            symbol: result.discovered[0].formula,
                            x: x,
                            y: y
                        };
                        resetUI();
                        mixingBoard.addChemical(foundChemical);
                        drawChemical(foundChemical, x, y);
                        mcr.add(foundChemical.symbol);
                        window.animateExplosion(x, y);
                    }
                    drawPotentialCount(result.potential);
                } else if(event.x < 450){
                    var result = mcr.remove(chemical.symbol);
                    drawPotentialCount(result.potential);
                }
            },
            mousedown: function(layer) {
                suspendRedraw = true;
            },
            drag: function(layer) {
                var chemical = layer.chemical;
                chemical.x = layer.x;
                chemical.y = layer.y;
                mixingBoard.updateChemical(chemical);
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

    removeAllFromReactor: function() {
        for(var i = this.chemicals.length-1; i >= 0; i--) {
            if(this.chemicals[i].x > 450) {
                this.removeChemical(this.chemicals[i]);
            }
        }
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
