var makeList = {
    compounds: [],
    found: [],
    lineInfo: [],
    numCompounds: 10,
    canvas: null,
    listAsString: "",
    currentLevel: 1,
    masterList: [],

    generateList: function() {
        this.compounds = [];
        this.lineInfo = [];
        this.canvas = $('canvas');
        for (var i=0; i<this.numCompounds; i++) {
            var compound = null;
            do {
                compound = mcr.getRandomCompound(this.currentLevel);
            } while (this.isDuplicate(compound))
            this.found[i] = false;
            this.compounds.push(compound);
            this.masterList.push(compound);
            this.lineInfo[i] = {
                width:getChemicalNamePixelWidthFont("chalkdust", this.compounds[i].name),
                y1offset: Math.floor(Math.random() * 20) - 10,
                y2offset: Math.floor(Math.random() * 20) - 10
            };
        }
        mcr.reset();
        mcr.setDiscoverableCompounds(this.compounds);
        this.generateListAsString();
    },

    isDuplicate: function(compound) {
        for (var i=0; i<this.compounds.length; i++) {
            if (compound.name === this.compounds[i].name) {
                return true;
            }
        }
        for (var i=0; i<this.masterList.length; i++) {
            if (compound.name === this.masterList[i].name) {
                return true;
            }
        }
        return false;
    },

    generateListAsString: function() {
        this.listAsString = "Level: " + this.currentLevel + "\n";
        for (var i=0; i<this.compounds.length; i++) {
            if (this.compounds[i] !== null) {
                this.listAsString += this.compounds[i].name + "\n";
            }
        }
    },

    checkDiscoveryOnList: function(chemical) {
        for (var i=0; i<this.compounds.length; i++) {
            if (this.compounds[i] !== null) {
                if (chemical.name === this.compounds[i].name) {
                    this.found[i] = true;
                    break;
                }
            }
        }
        this.generateListAsString();
    },

    allFound: function() {
        for (var i=0; i<this.found.length; i++) {
            if (!this.found[i]) {
                return false;
            }
        }
        return true;
    },

    render: function() {
        this.canvas.drawText({
            layer: 'makeList',
            fillStyle: "#fff",
            x: 25, y: 5,
            font: "20pt chalkdust",
            text: this.listAsString,
            align: "left",
            lineHeight: 1.3,
            fromCenter: false
        });
        $("canvas").drawLine({
            layer: 'makeList',
            strokeStyle: "#fff",
            strokeWidth: 4,
            rounded: true,
            x1: 25, y1: 40,
            x2: 450, y2: 40
        });
        for (var i=0; i<this.found.length; i++) {
            if (this.found[i]) {
                $("canvas").drawLine({
                    layer: 'makeList',
                    strokeStyle: "rgba(255,0,0,1)",
                    strokeWidth: 5,
                    rounded: true,
                    x1: 25, y1: 60+35*i+this.lineInfo[i].y1offset,
                    x2: 25+this.lineInfo[i].width, y2: 60+35*i+this.lineInfo[i].y2offset
                });
            }
        }
    }
}