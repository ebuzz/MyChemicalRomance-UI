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
            $(tabSelector).append('<div>' +transformNumbers(compounds[i].formula) + ' - ' + compounds[i].name + '</div>');
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

            $('canvas')
                .drawText({
                    layer: 'myLayer',
                    name: 'myText',
                    fillStyle: "#36c",
                    strokeStyle: "#25a",
                    strokeWidth: 2,
                    x: -100, y: -100,
                    font: "36pt Verdana, sans-serif",
                    text: params.symbol
                });
            var symbolWidth = $('canvas').measureText('myText').width;
            //$("canvas").removeLayer('myLayer');

            $('canvas')
            .drawRect({
                fillStyle: params.fillStyle,
                strokeStyle: '#000',
                strokeWidth: 1,
                x: params.x, y: params.y,
                width: symbolWidth+10,
                height: params.height
            }).drawText({
                name: 'myText',
                fillStyle: "#36c",
                strokeStyle: "#25a",
                strokeWidth: 2,
                x: params.x, y: params.y,
                font: "36pt Verdana, sans-serif",
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

        debugger;
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

        function transformNumbers(symbol) {
            var numbersRegex = RegExp("[\-\+0-9]+");
            var lettersRegex = RegExp("[A-z]+");

            var symbols = symbol.split(numbersRegex);
            var numbers = symbol.split(lettersRegex);

            if (numbers[0] == '') {
                for (var i=1; i<numbers.length; i++) {
                    numbers[i-1] = convertToSubOrSup(numbers[i]);
                }
                numbers[numbers.length-1] = "";
            } else {
                for (var i=0; i<numbers.length; i++) {
                    numbers[i] = convertToSubOrSup(numbers[i]);
                }
            }


            var convertedSymbol = "";
            for (var i=0; i<symbols.length; i++) {
                debugger;
                convertedSymbol += symbols[i];
                if (numbers[i] !== undefined) {
                    convertedSymbol += numbers[i];
                }
            }
            return convertedSymbol;
        }

        function convertToSubOrSup(number) {
            var convertedNumber = "";
            var numberIsSuper = false;
            for (var i=0; i < number.length; i++) {
                switch(number[i])
                {
                    case '1':
                        convertedNumber += numberIsSuper ? "\u2071" : "\u2081";
                        numberIsSuper = false;
                        break;
                    case '2':
                        convertedNumber += numberIsSuper ? "\u00B2" : "\u2082";
                        numberIsSuper = false;
                        break;
                    case '3':
                        convertedNumber += numberIsSuper ? "\u00B3" : "\u2083";
                        numberIsSuper = false;
                        break;
                    case '4':
                        convertedNumber += numberIsSuper ? "\u2074" : "\u2084";
                        numberIsSuper = false;
                        break;
                    case '5':
                        convertedNumber += numberIsSuper ? "\u2075" : "\u2085";
                        numberIsSuper = false;
                        break;
                    case '6':
                        convertedNumber += numberIsSuper ? "\u2076" : "\u2086";
                        numberIsSuper = false;
                        break;
                    case '7':
                        convertedNumber += numberIsSuper ? "\u2077" : "\u2087";;
                        numberIsSuper = false;
                        break;
                    case '8':
                        convertedNumber += numberIsSuper ? "\u2078" : "\u2088";
                        numberIsSuper = false;
                        break;
                    case '9':
                        convertedNumber += numberIsSuper ? "\u2079" : "\u2089";
                        numberIsSuper = false;
                        break;
                    case '0':
                        convertedNumber += numberIsSuper ? "\u2070" : "\u2080";
                        numberIsSuper = false;
                        break;
                    case '+':
                        numberIsSuper = true;
                        convertedNumber += numberIsSuper ? "\u207A" : "\u208A";
                        break;
                    case '-':
                        numberIsSuper = true;
                        convertedNumber += numberIsSuper ? "\u207B" : "\u208B";
                        break;
                }
            }
            var constructedNumber = "";
            for (var i=0; i < convertedNumber.length; i++) {
                if (i != (convertedNumber.length-1) && (convertedNumber[i] === "\u207B" || convertedNumber[i] === "\u207A")) {
                    constructedNumber += convertedNumber[i+1] + convertedNumber[i];
                    i++;
                } else {
                    constructedNumber += convertedNumber[i];
                }
            }

            return constructedNumber;
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
            symbol: transformNumbers(chemical.symbol),
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
                        var tabSelect = "";
                        if (group === "covalent") {
                            tabSelect = "#tabs-3";
                        } else if (group === "ionic") {
                            tabSelect = "#tabs-2";
                        } else if (group === "cation") {
                            tabSelect = "#tabs-4";
                        } else if (group === "anion") {
                            tabSelect = "#tabs-5";
                        }
                        renderCompounds(tabSelect,mcr.discoveredCompounds(group));
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
