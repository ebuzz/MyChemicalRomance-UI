var makeList = {
    chemicals: [],
    numChemicals: 10,
    canvas: null,

    generateList: function() {
        this.canvas = $('canvas');
        for (var i=0; i<this.numChemicals; i++) {
            this.chemicals[i] = mcr.getRandomCompound();
        }
    },

    checkDiscoveryOnList: function(chemical) {
        for (var i=0; i<this.numChemicals; i++) {
            if (this.chemicals[i] !== null) {
                if (chemical.name === this.chemicals[i].name) {
                    this.chemicals[i] = null;
                }
            }
        }
    },

    render: function() {
        var listAsString = "";
        for (var i=0; i<this.numChemicals; i++) {
            if (this.chemicals[i] !== null) {
                listAsString += this.chemicals[i].name + "\n";
            }
        }
        this.canvas.drawText({
            layer: 'makeList',
            fillStyle: "#fff",
            strokeWidth: 1,
            x: 25, y: 25,
            font: "20pt chalkdust, sans-serif",
            text: listAsString,
            align: "left",
            lineHeight: 1.3,
            fromCenter: false
        });
    }
}