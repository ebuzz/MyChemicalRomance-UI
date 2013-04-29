
var explosionAnimator = {
    canvas: null,
    circles: [],
    animationDone: true,
    numCircles: 175,
    radiusDecay:.125,
    name: null,
    nameWidth: 0,
    x: 0,
    y: 0,
    timer: 0,
    timerLength: 100,

    startExplosion: function(name, width, x, y) {
        if (this.canvas === null) {
            this.canvas = $('canvas');
        }
        this.name = name;
        this.nameWidth = width;
        this.x = x;
        this.y = y;
        this.animationDone = false;
        this.timer = this.timerLength;
        this.circles = [];
        for (var i = 0; i < this.numCircles; i++) {
            this.circles.push(new createCircle(x, y));
        }
    },

    draw: function() {
        for(var j = 0; j < this.circles.length; j++){
            var circle = this.circles[j];

            if(circle.radius > 0) {
                //Create the circles
                this.canvas.drawArc({
                    layer: 'explosion',
                    fillStyle: "rgba(" + circle.r + "," + circle.g + "," + circle.b + ",.75)",
                    x: circle.x, y: circle.y,
                    radius: circle.radius
                });

                circle.x += circle.vx;
                circle.y += circle.vy;
                circle.radius -= this.radiusDecay;
            }

            if(circle.radius < 2)
                this.circles.pop();//[j] = new create();
        }

        if (this.circles.length === 0) {
            this.animationDone = true;
        }

        if (this.timer > 0) {
            this.animationDone = false;

            this.canvas.drawRect({
                layer: 'explosion',
                fillStyle: "rgba(255,0,0,1)",
                x: this.x, y: this.y,
                width: this.nameWidth+10*(this.circles.length/100),
                height: 50+10*(this.circles.length/100)
            });

            this.canvas.drawText({
                layer: 'explosion',
                fillStyle: "rgba(255,255,255,1)",
                x: this.x, y: this.y,
                font: "36pt Verdana, sans-serif",
                text: this.name
            });
            this.timer--;
        }
    }
}

function createCircle(x, y) {
    var velocity = 20;
    this.x = x;
    this.y = y;


    //Random radius between 2 and 6
    this.radius = 4 + Math.random()*3;

    //Random velocities
    this.vx = -velocity/2 + Math.random()*velocity;
    this.vy = -velocity/2 + Math.random()*velocity;

    //Random colors
    this.r = Math.round(Math.random())*255;
    this.g = Math.round(Math.random())*255;
    this.b = Math.round(Math.random())*255;
}

function ExplosionAnimator() {
}

ExplosionAnimator.prototype = explosionAnimator;
