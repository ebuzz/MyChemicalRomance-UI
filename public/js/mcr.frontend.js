
$(document).ready(function(){
	var suspendRedraw = false;
    var currentId = 1;

    var hotbar1 = new Hotbar();
    var explosionAnimator = new ExplosionAnimator();

    var workspaceCenter = 700;

    var secondsToBeatLevel = 360;
    var gameTimeAsString = "";
    var lastSystemTime = Math.floor(new Date().getTime()/1000);
    var currentSystemTime = Math.floor(new Date().getTime()/1000);


	mcr.load();
    hotbar1.init(workspaceCenter-225, 0);

	mcr.ready.done(function() {
		'use strict';
		//------Game Loop-----------
        var ONE_FRAME_TIME = 1000 / 60;
        gameTimeAsString = parseGameTimer();
        makeList.generateList();
        var mainLoop = function() {
            if (secondsToBeatLevel <= 0) {
                $('canvas').drawText({
                    layer: 'gameOver',
                    fillStyle: '#f00',
                    x: 375, y: 200,
                    font: "48pt chalkdust",
                    text: "GAME OVER"
                });
                return;
            } if (makeList.compounds.length === 0) {
                $('canvas').drawText({
                    layer: 'youWin',
                    fillStyle: '#a0a',
                    x: 375, y: 200,
                    font: "56pt chalkdust",
                    text: "YOU WIN"
                });
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
        };

        setInterval( mainLoop, ONE_FRAME_TIME );
        //--------End Game Loop------


        var clickedDownHotbar = false;
        var clickedUpHotbar = false;
        var selectedHotbarChemical = null;
        var selectedHotbarIndex = -1;
        $('canvas').mousedown(function(event) {
            if (hotbar1.intersects(event.offsetX, event.offsetY)) {
                clickedDownHotbar = true;
                selectedHotbarIndex = hotbar1.getIndexFromCoord(event.offsetY);
                selectedHotbarChemical = hotbar1.getCompoundFromSlot(selectedHotbarIndex);
            }
        });

        $('canvas').mouseup(function(event) {
            if (hotbar1.intersects(event.offsetX, event.offsetY)) {
                clickedUpHotbar = true;
            }
            checkHotbarInteraction(event);
            clickedDownHotbar = clickedUpHotbar = false;
        });

        function parseGameTimer() {
            var minutes = Math.floor(secondsToBeatLevel/60);
            var seconds = secondsToBeatLevel - (minutes*60);
            if (seconds < 10) {
                seconds = "0" + seconds;
            }
            return minutes + ":" + seconds;
        }

        function checkHotbarInteraction(event) {
            if (clickedDownHotbar && clickedUpHotbar) { //clicked down and up on hotbar
                if (selectedHotbarChemical != null) {
                    addChemicalToWorkspace(selectedHotbarChemical.symbol);
                }
            } else if (clickedDownHotbar && !clickedUpHotbar) { //clicked hotbar and dragged off
                hotbar1.removeChemicalFromSlot(selectedHotbarIndex);
            } else if (!clickedDownHotbar && clickedUpHotbar) { //clicked workspace and dragged to hotbar

            }
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
                workspace.addChemical(foundChemical);
                drawChemical(foundChemical, x, y);
                makeList.checkDiscoveryOnList(foundChemical);
                mcr.add(foundChemical.symbol);
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
                    strokeWidth: 1,
                    x: 375, y: 390,
                    font: "20pt Verdana, sans-serif",
                    text: "Time left: " + gameTimeAsString
                });
                redTimeTimer--;
            } else {
                $("canvas").drawText({
                    layer: 'controls',
                    fillStyle: 'rgba(125,125,125,1)',
                    strokeWidth: 1,
                    x: 375, y: 390,
                    font: "15pt Verdana, sans-serif",
                    text: "Time left: " + gameTimeAsString
                });
            }

            hotbar1.render();

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

        function addChemicalToHotbar(symbol) {
            var freeHotbarIndex = hotbar1.getNextAvailableIndex();
            var chemical = createChemical(symbol);
            if (freeHotbarIndex !== -1) {
                hotbar1.addChemicalToSlot(chemical, freeHotbarIndex);
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
            workspace.removeChemical(chemical);
            var result = mcr.remove(chemical.symbol);
            checkForDiscovery(result);
        }

        function drawChemical(chemical,x,y) {
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
                    if (hotbar1.intersects(event.x, event.y)) {
                        hotbar1.addChemicalToSlot(chemical, hotbar1.getIndexFromCoord(event.y));
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

