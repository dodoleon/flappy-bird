var gameWidth = 1000;
var gameHigh = 600;
var game = new Phaser.Game(gameWidth, gameHigh, Phaser.AUTO, 'game_div');
var username;
var otherbirds;
var reference;
var bird;
var score, rank, bestscore=0;
var label_score, label_rank, label_bestscore;
var hole = [2, 4, 6, 3, 5, 3, 1, 3, 6, 2, 1, 6, 1, 3, 4, 6, 2, 3, 5, 5, 4, 2, 4, 6, 5, 4, 4, 1, 3, 2, 4, 2, 3, 2, 3, 4, 2, 2, 4, 4, 2, 3, 2, 1, 6, 6, 3, 2, 1, 2, 6, 6, 5, 5, 5, 3, 1, 3, 1, 2, 5, 5, 4, 3, 6, 2, 4, 1, 1, 2, 5, 2, 2, 2, 4, 5, 6, 1, 6, 6, 4, 5, 4, 2, 6, 6, 4, 3, 4, 1, 1, 6, 6, 5, 1, 3, 5, 4, 3, 1];
var holeNum;
function showHint(thisbestsore)
{
    var xmlhttp;
    if (thisbestsore.length==0)
    {
        document.getElementById("txtHint").innerHTML="";
        return;
    }
    if (window.XMLHttpRequest)
    {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp=new XMLHttpRequest();
    }
    else
    {// code for IE6, IE5
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange=function()
    {
        if (xmlhttp.readyState==4 && xmlhttp.status==200)
        {
                        console.log(bestscore);

            bestscore=xmlhttp.responseText;
            console.log(bestscore);
        }
    }
    xmlhttp.open("GET","server/saveIntoDatabase.php?name="+username+"&score="+thisbestsore,true);
    xmlhttp.send();
}

function getName(name)
{
    username=name;
}

var main_state = {
    preload: function() {
        //设置背景颜色
        this.game.stage.backgroundColor = '#71c5cf';

        this.game.load.image('background','resource/background.jpg');
        //载入小鸟图片
        this.game.load.spritesheet('bird1','resource/bird1.png',51,36,3);
        this.game.load.spritesheet('bird2','resource/bird2.png',51,36,3);

        //载入水管图片
        this.game.load.image('pipe','resource/pipe.png');
        this.game.load.image('pipecover','resource/pipecover.png');

        //载入跳跃声音
        this.game.load.audio('jump', 'resource/jump.wav');
        showHint(0);
        holeNum = 0;
    },
    create: function() {
        this.bg = this.game.add.tileSprite(0,0,gameWidth,gameHigh,'background');
        //x 水平方向速度，y 垂直方向速度
        this.bg.autoScroll(-100,0);

        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        //增加按键响应
        var space_key = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        space_key.onDown.add(this.jump, this); 

        //定义水管对象
        this.pipes = this.game.add.group();
        this.pipes.enableBody = true;
        this.pipes.createMultiple(30, 'pipe',0,false);
        this.game.physics.arcade.enable(this.pipes);

        //定义水管盖子对象
        this.pipeCovers = this.game.add.group();
        this.pipeCovers.enableBody = true;
        this.pipeCovers.createMultiple(30, 'pipecover',0,false);
        this.game.physics.arcade.enable(this.pipeCovers);

        //一个定时器，每2秒生成一个水管
        this.timerpipes = this.game.time.events.loop(2000, this.add_row_of_pipes, this);
        this.timer = this.game.time.events.loop(2000,this.show,this);

        //一个参考系，记录下飞行的距离
        reference = this.game.add.sprite();
        this.game.physics.arcade.enable(reference);
        reference.body.gravity.x = 200;

        otherbirds = this.game.add.group();
        otherbirds.enableBody = true;
        this.game.physics.arcade.enable(otherbirds);

        //增加一个玩家控制的小鸟的对象
        bird = this.game.add.sprite(160, 245, 'bird1');
        bird.animations.add('fly');
        bird.play('fly',5,true);
        this.game.physics.arcade.enable(bird);
        bird.body.gravity.y = 1000;
        bird.name = username;

        // 改变鸟的旋转中心
        bird.anchor.setTo(-0.2, 0.5);

        //积分界面
        score = -2;
        rank = 1;
        var style = { font: "30px Arial", fill: "#ffffff" };
        label_score = this.game.add.text(20, 20, "0", style);
        label_rank = this.game.add.text(20,550,"rank: 1",style);
        label_bestscore = this.game.add.text(150,550,"best score: "+bestscore, style);

        //添加一个声音
        this.jump_sound = this.game.add.audio('jump');

        this.server = new io (function getOtherBird(otherbird){
            var existingBird = null;

            if (otherbird.name === username) {
                console.log('return');
                return;
            }

            for(var i=0;i<otherbirds.length;i++) {
                if (otherbirds._hash[i].name == otherbird.name) {
                    if (otherbird.alive==true) {
                        console.log('other bird jump');
                        existingBird = otherbirds._hash[i];
                        //给y方向的速度。基于物理效果有加速度的情况下会先上升一段距离，然后下降
                        existingBird.body.velocity.y = -350;
                        //用引擎自动补全跳跃中角度的变化
                        this.game.add.tween(existingBird).to({angle: -20}, 100).start();
                    }else{
                        if(otherbird.x>reference.x) {
                            rank -= 1;
                            label_rank.text = "rank: "+rank;
                        }
                    }
                    break;
                }
            }

            if (existingBird == null && otherbird.alive == true) {
                console.log('not exist');
                if(otherbird.x>reference.x) {
                    rank += 1;
                    label_rank.text = "rank: "+rank;
                }
                existingBird = this.game.add.sprite(otherbird.x-reference.x+160, otherbird.y, 'bird2');
                existingBird.animations.add('fly');
                existingBird.play('fly',5,true);
                this.game.physics.arcade.enable(existingBird);
                existingBird.body.gravity.y = 1000;
                existingBird.body.velocity.y = otherbird.speed;
                existingBird.name = otherbird.name;
                existingBird.angle = otherbird.angle;
                // 改变鸟的旋转中心
                existingBird.anchor.setTo(-0.2, 0.5);
                // 保证鸟会被收回
                existingBird.checkWorldBounds = true;
                existingBird.outOfBoundsKill = true;
                otherbirds.add(existingBird);
            }
        });
    },

    update: function() {
        if (bird.inWorld == false)
            this.restart_game();

        // 使小鸟的角度缓慢下降
        if (bird.angle < 20)
            bird.angle += 1;

        for (var i=0;i<otherbirds.length;i++){
            if(otherbirds._hash[i].angle < 20)
                otherbirds._hash[i].angle += 1;
        }
        //检测鸟和水管盖子还有水管的碰撞
        this.game.physics.arcade.overlap(bird, this.pipes, this.hit_pipe, function(){}, this);
        this.game.physics.arcade.overlap(bird, this.pipeCovers, this.hit_pipe, function(){}, this);
    },

    jump: function() {
        // 当鸟碰撞到了水管，就不进行跳跃
        if (bird.alive == false)
            return;

        //给y方向的速度。基于物理效果有加速度的情况下会先上升一段距离，然后下降
        bird.body.velocity.y = -350;

        //用引擎自动补全跳跃中角度的变化
        this.game.add.tween(bird).to({angle: -20}, 100).start();
        if (bird.alive == true)
            this.send_bird();

        //播放跳跃的音效
        this.jump_sound.play();
    },

    //当鸟碰到水管后的死亡动画。
    hit_pipe: function() {
        //当鸟已经碰到水管时什么都不做
        if (bird.alive == false)
            return;

        //设置鸟死亡
        bird.alive = false;

        //删除掉计时器
        this.game.time.events.remove(this.timerpipes);
        this.bg.stopScroll();

        //所有的水管停止运动
        this.pipes.forEachAlive(function(p){
            p.body.velocity.x = 0;
        }, this);
        this.pipeCovers.forEachAlive(function(p){
            p.body.velocity.x = 0;
        }, this);
        this.send_bird();
        showHint(score);
    },

    restart_game: function() {
        //清产生水管的除计时器
        this.game.time.events.remove(this.timerpipes);
        this.game.state.start('main');
    },

    //增加一个水管
    add_one_pipe: function(x, y) {
        var pipe = this.pipes.getFirstDead();
        if(pipe){
            pipe.reset(x, y);
            pipe.body.velocity.x = -200;

            //保证水管会被回收
            pipe.checkWorldBounds = true;
            pipe.outOfBoundsKill = true;
        }
    },

    //增加一个水管盖
    add_one_pipecover : function (x ,y){
        var pipecover = this.pipeCovers.getFirstDead();
        if(pipecover){
            pipecover.reset(x, y);
            pipecover.body.velocity.x = -200;

            //保证水管盖会被回收
            pipecover.checkWorldBounds = true;
            pipecover.outOfBoundsKill = true;
        }
    },

    //增加一整条水管
    add_row_of_pipes: function() {
        //var hole = Math.floor(Math.random()*6)+1;
        var thishole = hole[holeNum%100];
        for (var i = 0; i < thishole-1; i++) {
            this.add_one_pipe(gameWidth, i * 50);
        }
        for (var i = thishole+4; i < 10; i++) {
            this.add_one_pipe(gameWidth, i * 50);
        }
        this.add_one_pipecover(gameWidth-10, (thishole-1)*50);
        this.add_one_pipecover(gameWidth-10, (thishole+3)*50);
        score += 1;
        label_score.text = (score>0)?score:0;
        holeNum++;
    },

    send_bird: function() {
        this.server.send(bird, reference.x);
    },
    //定时显示信息用于测试
    show: function() {
        console.log('x:',reference.x);
        console.log('other birds num:',otherbirds.length);
    }
};

game.state.add('main', main_state);  

game.state.start('main'); 