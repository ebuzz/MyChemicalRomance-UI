var hotbar = {

    canvas: null,
    numSlots: 7,
    slots: [],
    slotDimension: 50,

    clear: function() {
        for (var i=0; i<this.numSlots; i++) {
            this.slots[i] = null;
        }
    },

    init: function(x, y) {
        this.clear();
        this.centerX = x;
        this.centerY = y;
        this.drawX = x;// - this.slotDimension*.5;
        this.drawY = y;// + this.slotDimension*.5;
        this.canvas = $('canvas');
    },

    addChemicalToSlot: function(chemical, index) {
        this.slots[index] = chemical;
    },

    removeChemicalFromSlot: function(index) {
        this.slots[index] = null;
    },

    getCompoundFromSlotByCoord: function(yCoord) {
        return this.slots[this.getIndexFromCoord(yCoord)];
    },

    getCompoundFromSlot: function(index) {
        return this.slots[index];
    },

    getNextAvailableIndex: function() {
        for (var i=0; i<this.numSlots; i++) {
            if (this.slots[i] == null) {
                return i;
            }
        }
        return -1;
    },

    getIndexFromCoord: function(yCoord) {
        return Math.floor((yCoord - this.drawY)/this.slotDimension);
    },

    intersects: function(x, y) {
        var endX = this.drawX+this.slotDimension;
        var endY = this.drawY+(this.slotDimension*this.numSlots);
        if (x > this.drawX && x < endX) {
            if (y > this.drawY && y < endY) {
                return true;
            }
        }
        return false;
    },

    render: function() {
        this.canvas.drawText({
            layer: 'hotbarLayer',
            fillStyle: "rgba(125,125,125,.5)",
            //strokeStyle:"#fff",
            x: this.drawX-(this.slotDimension *.33), y:this.drawY+(this.slotDimension*this.numSlots) *.5,
            font: "24pt Verdana, sans-serif",
            text: "Shortcut bar",
            rotate: -90
        });

        for (var i=0; i<this.numSlots; i++) {
            this.canvas.drawRect({
                layer: 'hotbarLayer',
                fillStyle: "#000",
                strokeStyle: '#fff',
                strokeWidth: 1,
                x: this.drawX, y: this.drawY+this.slotDimension*i,
                width: this.slotDimension,
                height: this.slotDimension,
                fromCenter: false
            });

            if (this.slots[i] !== null) {
                var fontSize = 36;
                for (var fontSize=36; fontSize >=8; fontSize--) {
                    var formulaSizeInPixels = getChemicalNamePixelWidthWithFontSize(this.slots[i].symbol, fontSize);
                    if (formulaSizeInPixels <= this.slotDimension) {
                        break;
                    }
                }
                this.canvas.drawText({
                    layer: 'hotbarLayer',
                    fillStyle: "#00f",
                    //strokeStyle:"#fff",
                    x: this.drawX, y:this.drawY+this.slotDimension*i,
                    font: fontSize + "pt Verdana, sans-serif",
                    text: transformNumbers(this.slots[i].symbol),
                    fromCenter: false
                });
            }
        }
    }
}

function Hotbar() {
}

Hotbar.prototype = hotbar;
