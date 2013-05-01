var makeList = {
    compounds: [],
    numCompounds: 10,
    canvas: null,
    listAsString: "",

    generateList: function() {
        var startingCompounds = [];
        this.canvas = $('canvas');
        for (var i=0; i<this.numCompounds; i++) {
            var compound
            do {
                compound = mcr.getRandomCompound();
            } while (this.isDuplicate(compound))
            this.compounds.push(compound);
        }
        startingCompounds = this.compounds;
        mcr.setDiscoverableCompounds(startingCompounds);
        this.generateListAsString();
    },

    isDuplicate: function(compound) {
        for (var i=0; i<this.compounds.length; i++) {
            if (compound.name === this.compounds[i].name) {
                return true;
            }
        }
        return false;
    },

    generateListAsString: function() {
        this.listAsString = "";
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
                    this.compounds.splice(i, 1);
                    break;
                }
            }
        }
        this.generateListAsString();
    },

    render: function() {
        this.canvas.drawText({
            layer: 'makeList',
            fillStyle: "#fff",
            strokeWidth: 1,
            x: 25, y: 25,
            font: "20pt chalkdust, sans-serif",
            text: this.listAsString,
            align: "left",
            lineHeight: 1.3,
            fromCenter: false
        });
    }
}