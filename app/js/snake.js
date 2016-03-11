var Snakes = function() {
    this.count = 5;
    this.currentDirection = "r";
    this.radius = 10;
    this.change = {
        posx: 20,
        posy: 0
    };
    this.snakeObj = [{
            sequence: 1,
            posx: 90,
            posy: 10,
            color: "#ff0000"
        }, {
            sequence: 2,
            posx: 70,
            posy: 10,
            color: "#0000ff"
        }, {
            sequence: 3,
            posx: 50,
            posy: 10,
            color: "#0000ff"
        }, {
            sequence: 4,
            posx: 30,
            posy: 10,
            color: "#0000ff"
        }, {
            sequence: 5,
            posx: 10,
            posy: 10,
            color: "#0000ff"
        }

    ];
};

//object creation 
var snake = new Snakes();
var repaint = {
    init: function(obj, ref) {
        var that = this;
        that.svgHeight = 500;
        that.svgWidth = 1000;
        that.foodCount = 0;
        that.totalScore = 0;
        that.avoidableCell = [];
        that.raph = Raphael(ref[0], that.svgWidth, that.svgHeight);
        that.raph.canvas.style.border = "2px solid #000";
        that.paint(obj, ref);
        that.timer();
        that.interval = setInterval(function() {
            that.checkRepaint(obj, ref);
        }, 100);
        that.eventHandler(obj, ref);
        that.makeNewCell(obj, ref);
        that.checkCollision(obj, ref);

    },
    paint: function(snake, ref) {
        var i, circle;
        for (i = 0; i < snake.snakeObj.length; i++) {
            circle = this.raph.circle(snake.snakeObj[i].posx, snake.snakeObj[i].posy, snake.radius);
            circle.attr({
                fill: snake.snakeObj[i].color,
                'stroke-width': 0,
                'stroke': '#fff'
            });
        }
        $(".timer span").html("0");
        $("#count span").html(this.foodCount);
    },
    checkRepaint: function(snake, ref) {

        var i = 0,
            j = 0,
            l = snake.snakeObj.length,
            circles = $("circle");;
        for (i = 1; i < l; i++) {
            //Collided into Itself
            if (snake.snakeObj[i].posy === snake.snakeObj[0].posy && snake.snakeObj[i].posx === snake.snakeObj[0].posx) {
                //console.log("Collided");
                break;
            }
        }
        for (j = l - 1; j > i; j--) {
            delete snake.snakeObj[j];
            this.addStones(circles[j]);
            circles[j].remove();
            //console.log(circles[j-1]);
            snake.snakeObj.length--;
            //console.log(snake.snakeObj.length);
        }
        snake.count = snake.snakeObj.length;
        this.repaint(snake, ref);
        //checking for collision with avoidableCell
        for (i = 0; i < this.avoidableCell.length; i++) {
            if (snake.snakeObj[0].posy === this.avoidableCell[i].cy && snake.snakeObj[0].posx === this.avoidableCell[i].cx) {
                this.youDie(snake, ref);
            }
        }
        if (snake.snakeObj[0].posx > 1000 || snake.snakeObj[0].posx < 0) { // if snake dies horizontally
            this.youDie(snake, ref);
        }
        if (snake.snakeObj[0].posy > 500 || snake.snakeObj[0].posy < 0) { // if snake dies vertically
            this.youDie(snake, ref);
        }
    },
    youDie: function(snake, ref) {
        //alert("You died");
        console.log("you died!!");
        clearInterval(this.interval);
        clearInterval(this.interval_timer);
        snake = new Snakes();
        $("svg").remove();
        this.init(snake, ref);
    },
    addStones: function(circleElem) {
        var x = parseInt($(circleElem).attr('cx')),
            y = parseInt($(circleElem).attr('cy')),
            r = parseInt($(circleElem).attr('r'));
        //console.log(x,y,r);
        this.avoidableCell.push({
            "cx": x,
            "cy": y,
            "cr": r
        });
        var rectPath = this.raph.path("M" + (x - r) + "," + (y - r) + "L" + (x - r) + "," + (y + r) + "L" + (x + r) + "," + (y + r) + "L" + (x + r) + "," + (y - r) + "Z");
        rectPath.attr({
            fill: "brown"
        });
    },
    repaint: function(snake, ref) {
        var circles = $("circle");
        //console.log(snake.snakeObj)
        for (i = snake.count - 1; i >= 1; i--) {
            //console.log(snake.snakeObj[i].posx,snake.snakeObj[i].posy);
            snake.snakeObj[i].posx = snake.snakeObj[i - 1].posx;
            snake.snakeObj[i].posy = snake.snakeObj[i - 1].posy;
            circles[i].setAttribute('cx', snake.snakeObj[i].posx);
            circles[i].setAttribute('cy', snake.snakeObj[i].posy);
        }
        snake.snakeObj[0].posx = snake.snakeObj[0].posx + snake.change.posx;
        snake.snakeObj[0].posy = snake.snakeObj[0].posy + snake.change.posy;
        circles[0].setAttribute('cx', snake.snakeObj[0].posx);
        circles[0].setAttribute('cy', snake.snakeObj[0].posy);
        circles[snake.snakeObj.length - 1].setAttribute('fill', snake.snakeObj[snake.snakeObj.length - 1].color)
        //score updater
        this.totalScore = this.totalScore + 10;
        $("#score h3").html(this.totalScore);
        $("#length span").html(snake.count);

    },
    eventHandler: function(snake, ref) {
        var that = this;
        ref.off('keydown').on('keydown', function(evt) {
            //console.log(evt.keyCode);
            switch (evt.keyCode) {
                //left arrow
                case 37:
                    if (snake.currentDirection != 'r' && snake.currentDirection != 'l') {
                        snake.change.posx = -20;
                        snake.change.posy = 0;
                        snake.currentDirection = 'l';
                        that.checkRepaint(snake, ref);
                    }
                    break;
                    //up arrow
                case 38:
                    if (snake.currentDirection != 'u' && snake.currentDirection != 'd') {
                        snake.change.posx = 0;
                        snake.change.posy = -20;
                        snake.currentDirection = 'u';
                        that.checkRepaint(snake, ref);
                    }
                    break;
                    //right arrow
                case 39:
                    if (snake.currentDirection != 'r' && snake.currentDirection != 'l') {
                        snake.change.posx = 20;
                        snake.change.posy = 0;
                        snake.currentDirection = 'r';
                        that.checkRepaint(snake, ref);
                    }
                    break;
                    //down arrow
                case 40:
                    if (snake.currentDirection != 'u' && snake.currentDirection != 'd') {
                        snake.change.posx = 0;
                        snake.change.posy = 20;
                        snake.currentDirection = 'd';
                        that.checkRepaint(snake, ref);
                    }
                    break;

            }
        });
    },
    isOdd: function(n) {
        return !(n % 2 == 0);
    },

    randomGenerator: function() {
        var height, width, w, h;

        height = Math.random() * this.svgHeight;
        width = Math.random() * this.svgWidth;
        w = parseInt(parseInt(width) / 10) * 10;
        h = parseInt(parseInt(height) / 10) * 10;
        w = this.isOdd(w / 10) ? w : w + 10;
        h = this.isOdd(h / 10) ? h : h + 10;
        return {
            "height": h,
            "width": w
        }
    },
    makeNewCell: function(snake, ref) {
        var that = this;
        var allow = false;
        do {
            that.newCellDets = that.randomGenerator();
            allow = false;
            for (i = 0; i < that.avoidableCell.length; i++) {
                if (that.avoidableCell[i].cx === that.newCellDets.width && that.avoidableCell[i].cy === that.newCellDets.height)
                    allow = true;
            }
            for (i = 0; i < snake.snakeObj.length; i++) {
                if (snake.snakeObj[i].posx === that.newCellDets.width && snake.snakeObj.posy === that.newCellDets.height)
                    allow = true;
            }
        } while (allow);
        circle = that.raph.circle(that.newCellDets.width, that.newCellDets.height, snake.radius);
        circle.attr({
            fill: 'green',
            'stroke-width': 0,
            'stroke': '#fff'
        });


    },
    checkCollision: function(snake, ref) {
        var that = this;
        Object.observe(snake.snakeObj[0], function() {
            var length = snake.snakeObj.length;
            if (that.newCellDets.height === snake.snakeObj[0].posy && that.newCellDets.width === snake.snakeObj[0].posx) {
                (snake.snakeObj).push({
                    sequence: snake.snakeObj.length,
                    posx: snake.snakeObj[0].posx - snake.change.posx,
                    posy: snake.snakeObj[0].posy - snake.change.posy,
                    color: "#0000ff"
                });
                snake.count = snake.snakeObj.length;
                that.makeNewCell(snake, ref);
                that.totalScore = that.totalScore + 50;
                $("#count span").html(++that.foodCount);
                $("#length span").html(snake.count);
                $("#score h3").html(that.totalScore);

            }
        });


    },
    timer: function() {
        var startTime = new Date();
        var that = this;
        this.interval_timer = setInterval(function() {
            $(".timer span").html(parseInt(((new Date()).getTime() - startTime.getTime()) / 1000));
        }, 1000);;


    },
    scoreCard: function(snake, ref) {

    }

}
repaint.init(snake, $("body"));