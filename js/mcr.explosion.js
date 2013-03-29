$(document).ready(function(){
    // shim layer with setTimeout fallback
    window.requestAnimFrame = (function(){
        return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame     ||
            function( callback ){
                window.setTimeout(callback, 1000 / 60);
            };
    })();

    var canvas = document.getElementById("canvas"),
        ctx = canvas.getContext("2d"),
        W = 900,
        H = 400,
        circles = [];

    canvas.width = W;
    canvas.height = H;

    //Random Circles creator
    function create(x, y) {

        //Place the circles at the center

        this.x = x ? x : W/2;
        this.y = y ? y : H/2;


        //Random radius between 2 and 6
        this.radius = 2 + Math.random()*3;

        //Random velocities
        this.vx = -5 + Math.random()*10;
        this.vy = -5 + Math.random()*10;

        //Random colors
        this.r = Math.round(Math.random())*255;
        this.g = Math.round(Math.random())*255;
        this.b = Math.round(Math.random())*255;
    }

    var animationDone = false;
    function draw() {
        //Fill canvas with black color
        ctx.globalCompositeOperation = "source-over";
        ctx.fillStyle = "rgba(0,0,0,0.15)";
        ctx.fillRect(0, 0, W, H);

        //Fill the canvas with circles
        for(var j = 0; j < circles.length; j++){
            var c = circles[j];

            if(c.radius > 0) {
                //Create the circles
                ctx.beginPath();
                ctx.arc(c.x, c.y, c.radius, 0, Math.PI*2, false);
                ctx.fillStyle = "rgba("+c.r+", "+c.g+", "+c.b+", 0.5)";
                ctx.fill();

                c.x += c.vx;
                c.y += c.vy;
                c.radius -= .02;
            }
            //Regeneration
            //if(c.radius < 0)
            //    circles[j] = new create();
        }
        animationDone = true;
        for(var j = 0; j < circles.length; j++){
            var c = circles[j];
            if(c.radius > 0) {
                animationDone = false;
            }
        }
    }

    window.animateExplosion = function(x, y) {
        circles = [];
        for (var i = 0; i < 500; i++) {
            circles.push(new create(x + 25, y + 25));
        }
        animationDone = false;
        animateExplosion();
    }

    function animateExplosion(e){
        if(!animationDone) {
            requestAnimFrame(animateExplosion);
            draw();
        }
    }
});



