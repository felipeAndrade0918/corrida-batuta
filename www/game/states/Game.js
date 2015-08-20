Main.Game = function() {
	this.gameHasStarted = false;
};

Main.Game.prototype = {

	init: function () {

		// Multi-touch support
        this.input.maxPointers = 1;

        //  Phaser will automatically pause if the browser tab the game is in loses focus
        this.stage.disableVisibilityChange = true;

        if (this.game.device.desktop) {
        }
        else {
        	// Trying to fit the whole screen
            this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
            this.scale.forceLandscape = true;
            this.scale.pageAlignHorizontally = true;
            this.scale.pageAlignVertically = true;
        }

        this.scale.refresh();
    },

	preload: function() {
		// List with people's names which will be used as obstacles
		this.peopleNames = [];

		this.load.spritesheet('player', 'assets/guilherme.png', 32, 49);
		this.load.image('background', 'assets/rua_com_nuvem.png');

		this.load.spritesheet('ricardo', 'assets/ricardo.png', 32, 49);
		this.peopleNames.push('ricardo');

		this.load.spritesheet('pamela', 'assets/pamela.png', 32, 49);
		this.peopleNames.push('pamela');

		this.load.spritesheet('bruna', 'assets/bruna.png', 32, 49);
		this.peopleNames.push('bruna');
	},

	create: function() {
		// Starting the Arcade Physics System
		this.physics.startSystem(Phaser.Physics.ARCADE);

		// Sprites from this group will act as obstacles
		this.peopleGroup = this.add.group();

		// Adding the background and scaling its size
		this.background = this.add.tileSprite(0, 0, 320, 240, 'background');
		this.background.scale.y = 1.3;
		// Without this we would not be able to see other sprites
		this.world.sendToBack(this.background);

		// The player. He starts invisible
		this.player = new Main.Player(this.game, 50, this.world.height - 100);
		this.player.alpha = 0;
		this.player.events.onKilled.add(this.resetGame, this);

		// The ground has no image, we don't need one
		this.ground = new Main.Ground(this.game, 0, this.world.height - 10);

		// Sets up the title screen
		this.createGameText();

		// Keeps spawning people when the game is running
		this.time.events.loop(this.rnd.integerInRange(3, 7) * 1000, this.spawnPerson, this);
	},

	update: function() {
		this.physics.arcade.collide(this.player, this.ground);
		this.physics.arcade.collide(this.player, this.peopleGroup, this.killPlayer, null, this);

		if (this.gameHasStarted) {
			this.background.tilePosition.x -= 4;

			this.player.handleInput();
		} else {
			this.background.tilePosition.x -= 1;

			if (this.input.pointer1.isDown || this.input.mousePointer.isDown) {
				this.resumeGame();
			}
		}

	},

	spawnPerson: function() {
		// We only spawn people when the game is running
		if (this.gameHasStarted) {
			var personPosition = this.rnd.integerInRange(0, this.peopleNames.length - 1);
			var person = new Main.Person(this.game, this.world.width, this.world.height - 25, this.peopleNames[personPosition]);
			this.peopleGroup.add(person);
		}
	},

	killPlayer: function(player, person) {
		player.kill();
	},

	resumeGame: function() {
		// Here we hide the texts, pause the Tween and revive the player if necessary
		this.gameTitleTween.pause();
		this.pressStart.alpha = 0;
		this.gameTitle.alpha = 0;
		this.gameHasStarted = true;
		if (!this.player.alive) {
			this.player.reset(50, this.world.height - 100, 1);
		}
		this.player.alpha = 1;
	},

	resetGame: function() {
		// Here we resume the Tween and show the texts again
		this.gameTitleTween.resume();
		this.gameHasStarted = false;
		this.pressStart.alpha = 1;
		this.gameTitle.alpha = 1;
	},

	createGameText: function() {
		var pressStartText = "Toque na tela \npara começar!";
	    var pressStartStyle = { font: "bold 32px Arial", fill: "#ff0044", align: "center" , stroke: '#000000', strokeThickness: 6};
	    this.pressStart = this.add.text(this.world.centerX - 120, 150, pressStartText, pressStartStyle);

	    var gameTitleText = "Corrida batuta!";
	    var gameTitleStyle = { font: "bold 40px Arial", fill: "#BC26D6", align: "center" , stroke: '#000000', strokeThickness: 6};
	    this.gameTitle = this.add.text(this.world.centerX - 145, 20, gameTitleText, gameTitleStyle);

	    this.gameTitleTween = this.add.tween(this.gameTitle);
	    this.gameTitleTween.to({ y: 30 }, 1000);
	    this.gameTitleTween.to({ y: 20 }, 1000);
	    this.gameTitleTween.loop();
	    this.gameTitleTween.start();
	},

	render: function() {
		// This is for debugging purposes
    	/*var renderGroup = function(thing) {
    		this.game.debug.body(thing);
    	};
    	this.game.debug.body(this.player);
		this.peopleGroup.forEachAlive(renderGroup, this);*/
	}
};