$(document).ready(function(){
    var suspendRedraw = false;
    var currentId = 1;

    var explosionAnimator = new ExplosionAnimator();

    var workspaceCenter = 675;

    var secondsToBeatLevel = 300;
    var gameTimeAsString = "";
    var lastSystemTime = Math.floor(new Date().getTime()/1000);
    var currentSystemTime = Math.floor(new Date().getTime()/1000);

    var gameOverState = false;

    mcr.load();

    mcr.ready.done(function() {
        'use strict';
        //------Game Loop-----------
        var ONE_FRAME_TIME = 1000 / 60;
        gameTimeAsString = parseGameTimer();
        makeList.generateList();
        var mainLoop = function() {
            if (gameOverState) {
                $('canvas').drawText({
                    layer: 'gameOver',
                    fillStyle: '#f00',
                    x: 375, y: 200,
                    font: "48pt chalkdust",
                    text: "GAME OVER"
                });
                workspace.removeAll();
                mcr.clearWorkspace();
                return;
            }
            updateTimer();
            drawGame();
        };

        var drawGame = function() {
            if(!suspendRedraw) {
                resetUI();
                drawAllChemicals();
                makeList.render();
            }
            if (!explosionAnimator.animationDone) {
                explosionAnimator.draw();
            }
        };

        var updateTimer = function() {
            currentSystemTime = Math.floor(new Date().getTime()/1000);
            if (lastSystemTime !== currentSystemTime) {
                lastSystemTime = currentSystemTime;
                secondsToBeatLevel--;
                gameTimeAsString = parseGameTimer();
            }
            if (secondsToBeatLevel === 0) {
                gameOverState = true;
            }
        };

        setInterval( mainLoop, ONE_FRAME_TIME );
        //--------End Game Loop------

        $('canvas').mousedown(function(event) {
        });

        $('canvas').mouseup(function(event) {
        });

        function parseGameTimer() {
            var minutes = Math.floor(secondsToBeatLevel/60);
            var seconds = secondsToBeatLevel - (minutes*60);
            if (seconds < 10) {
                seconds = "0" + seconds;
            }
            return minutes + ":" + seconds;
        }

        function checkForDiscovery(result) {
            if(result.discovered.length > 0) {
                var x = Math.floor((Math.random()*300)+(workspaceCenter-175));
                var y = Math.floor((Math.random()*200)+100);
                var foundChemical = {
                    id: currentId++,
                    symbol: result.discovered[0].formula,
                    x: x,
                    y: y,
                    elements: result.discovered[0].elements,
                    name: result.discovered[0].name
                };
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
                renderCompoundsTabs(tabSelect,mcr.discoveredCompounds(group));
                workspace.removeAll();
                resetUI();
                makeList.checkDiscoveryOnList(foundChemical);
                if (makeList.allFound()) {
                    makeList.currentLevel++;
                    makeList.generateList();
                }
                drawChemicals(foundChemical.elements);
                explosionAnimator.startExplosion(foundChemical.name, getChemicalNamePixelWidth(foundChemical.name), x, y);
            }
        }

        function drawAllChemicals() {
            for(var i = 0; i < workspace.chemicals.length; i++) {
                var chemical = workspace.chemicals[i];
                drawChemical(chemical, chemical.x, chemical.y);
            }
        }

        function renderCompoundsTabs(tabSelector, compounds) {
            $(tabSelector).empty();
            for(var i = 0; i < compounds.length; i++) {
                $(tabSelector).append('<div class=\"sym\" id=\"' + compounds[i].formula + '\">' +transformNumbers(compounds[i].formula) + ' - ' + compounds[i].name + '</div>');
            }
            $(tabSelector + "-count").empty();
            $(tabSelector + "-count").append(compounds.length);
        }

        $( "#tabs" ).tabs();

        $.jCanvas.extend({
            name: "drawChemicalElement",
            props: {},
            fn: function(ctx, params) {

                var symbolWidth = getChemicalNamePixelWidth(params.symbol);

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

        var redTimeTimer = 0;
        var lastSeconds = secondsToBeatLevel;
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

            $("canvas").drawRect({
                layer: 'controls',
                strokeStyle: '#888',
                strokeWidth: 5,
                x: workspaceCenter, y: 175,
                width: 340,
                height: 340,
                fromCenter: true
            });

            $("canvas").drawText({
                layer: 'controls',
                fillStyle: 'rgba(125,125,125,.5)',
                strokeStyle: 'rgba(125,125,125,.5)',
                strokeWidth: 1,
                x: workspaceCenter, y: 250,
                font: "40pt Verdana, sans-serif",
                text: 'Combine\nChemicals\nHere'
            });

            $("canvas").drawRect({
                layer: 'controls',
                strokeStyle: '#888',
                strokeWidth: 5,
                x: workspaceCenter, y: 370,
                width: 340,
                height: 50,
                fromCenter: true
            });

            $("canvas").drawText({
                layer: 'controls',
                fillStyle: 'rgba(125,125,125,.5)',
                strokeStyle: 'rgba(125,125,125,.5)',
                strokeWidth: 1,
                x: workspaceCenter, y: 370,
                font: "26pt Verdana, sans-serif",
                text: 'Trash'
            });


            if (secondsToBeatLevel < 11 && (secondsToBeatLevel !== lastSeconds)) {
                redTimeTimer = 15;
                lastSeconds = secondsToBeatLevel;
            }
            if (redTimeTimer > 0) {
                $("canvas").drawText({
                    layer: 'controls',
                    fillStyle: 'rgba(255,0,0,1)',
                    x: 325, y: 20,
                    font: "26pt chalkdust",
                    text: "Time left: " + gameTimeAsString,
                    fromCenter: true
                });
                redTimeTimer--;
            } else {
                $("canvas").drawText({
                    layer: 'controls',
                    fillStyle: 'rgba(255,255,255,1)',
                    x: 325, y: 20,
                    font: "20pt chalkdust",
                    text: "Time left: " + gameTimeAsString,
                    fromCenter:true
                });
            }
            drawPotentialCount(mcr.undiscoveredCompounds());

        }

        function drawPotentialCount(count) {
            $("canvas").removeLayer("potentialCount");
            $("canvas").drawText({
                name: "potentialCount",
                layer: true,
                fillStyle: "#fff",
                x: workspaceCenter, y: 15,
                font: "14pt chalkdust",
                text: "Workspace possibilities: " + count
            });
        }

        //Attach Events to Table
        $(".symbol").each(function(i, periodicElement) {
            var symbol = $(this).find("abbr").text();
            $(periodicElement).on('click', function(event) {
                addChemicalToWorkspace(symbol);
            });
        });

        function drawChemicals(elements) {
            var keys = _.keys(elements);
            for (var i=0;i < keys.length; i++) {
                var elementSymbol = keys[i];
                $(".symbol").each(function(j, periodicElement) {
                    var symbol = $(this).find("abbr").text();
                    if (symbol === elementSymbol && mcr.undiscoveredCompounds(symbol) === 0) {
                        $(this).find("abbr").addClass('noPotential');
                    }
                });
            }
        }

        function createChemical(symbol) {
            return {
                id: currentId++,
                symbol: symbol,
                x: 0,
                y: 0
            }
        }

        function addChemicalToWorkspace(addedSymbol) {
            var symbol = addedSymbol ? addedSymbol : $('#chemSymbol').val();

            if(symbol === '') {
                return;
            }

            var x = Math.floor((Math.random()*350)+(workspaceCenter-175));
            var y = Math.floor((Math.random()*200)+100);
            var chemical = {
                id: currentId++,
                symbol: symbol,
                x: x,
                y: y
            };

            workspace.addChemical(chemical);
            drawChemical(chemical, x, y);

            var result = mcr.add(addedSymbol);
            checkForDiscovery(result);
        }

        function removeChemicalFromWorkspace(chemical) {
            var result = workspace.removeChemical(chemical);
            checkForDiscovery(result);
        }

        function drawChemical(chemical,x,y) {
            if (gameOverState) {
                return;
            }
            var x = x !==undefined? x : Math.floor((Math.random()*300)+(workspaceCenter-175));
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
                    if (event.x > (workspaceCenter-175) && event.x < (workspaceCenter+175) && event.y > 350) {
                        removeChemicalFromWorkspace(chemical);
                    }
                    suspendRedraw = false;
                },
                mousedown: function(event) {
                    suspendRedraw = true;
                },
                drag: function(layer) {
                    var chemical = layer.chemical;
                    chemical.x = layer.x;
                    chemical.y = layer.y;
                    workspace.updateChemical(chemical);
                }
            });
        }

        var searchDialog = $( "#searchDialog" ).dialog({
            autoOpen: false,
            draggable: false,
            modal: true,
            resizable:false,
            title:'Search',
            position: {at:'center', of:$("canvas")}
        });

    });
});