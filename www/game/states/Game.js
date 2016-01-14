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
        	// Any deskop configurations goes here
        }
        else {
        	// Trying to fit the whole screen
            this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
            this.scale.forceOrientation(true, false);
            this.scale.pageAlignHorizontally = true;
            this.scale.pageAlignVertically = true;
            this.scale.enterIncorrectOrientation.add(this.enterIncorrectOrientation, this);
            this.scale.leaveIncorrectOrientation.add(this.leaveIncorrectOrientation, this);
        }
    },

    enterIncorrectOrientation: function() {
    	console.log('errado');
    },

    leaveIncorrectOrientation: function() {
    	console.log('certo');
    },

	preload: function() {
		// List with people's names which will be used as obstacles
		this.peopleNames = [];

		this.load.spritesheet('player', 'assets/guilherme.png', 32, 49);
		this.load.image('background', 'assets/rua_com_nuvem.png');
		this.load.image('heart', 'assets/heart.png');

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

		// Adding the background and scaling its size
		this.background = this.add.tileSprite(0, 0, 320, 240, 'background');
		this.background.scale.y = 1.3;
		// Without this we would not be able to see other sprites
		this.world.sendToBack(this.background);

		// The player. He starts invisible
		this.player = new Main.Player(this.game, 50, this.world.height - 60);
		this.player.alpha = 0;
		this.player.events.onKilled.add(this.resetGame, this);

		// The ground has no image, we don't need one
		this.ground = new Main.Ground(this.game, 0, this.world.height - 10);

		// Sets up the title screen
		this.createTitleText();

		// These timers haven't started yet, they are just being created
		this.difficultySystem = new Main.DifficultySystem(this.game, this.peopleNames);
		this.scoreSystem = new Main.ScoreSystem(this.game, this.difficultySystem);
		
		this.scoreSystem.createBestScoreText();		
	},

	update: function() {
		this.physics.arcade.collide(this.player, this.ground);
		this.physics.arcade.overlap(this.player, this.difficultySystem.peopleGroup, this.player.damagePlayer, null, this.player);

		if (this.gameHasStarted) {
			this.background.tilePosition.x -= this.difficultySystem.backgroundSpeed;

			this.player.handleInput();
		} else {
			this.background.tilePosition.x -= 1;

			if (this.input.pointer1.isDown || this.input.mousePointer.isDown) {
				this.startGame();
			}
		}
	},

	startGame: function() {
		// Here we hide the texts, pause the Tween and revive the player if necessary
		this.gameTitleTween.pause();
		this.pressStart.alpha = 0;
		this.gameTitle.alpha = 0;

		// If the player just died we revive him and setup his health
		if (!this.player.alive) {
			this.player.reset(50, this.world.height - 60, 3);
		}
		this.player.alpha = 1;
		this.player.setupHealth();
		
		this.difficultySystem.startSpawningPeople();
		this.scoreSystem.start();
		
		// The game is ready to go
		this.gameHasStarted = true;
	},

	resetGame: function() {
		// Here we resume the Tween and show the texts again
		this.gameTitleTween.resume();
		this.gameHasStarted = false;

		// We are displaying the title screen again
		this.pressStart.alpha = 1;
		this.gameTitle.alpha = 1;

		// We stop spawning people since the player just died
		this.difficultySystem.stopSpawningPeople();

		// Hide the score text, reset its value and pause the timer
		this.scoreSystem.pause();
	},

	// Creates the title screen text
	createTitleText: function() {
		var pressStartText = "Toque na tela \npara começar!";
	    var pressStartStyle = { font: "bold 18px Arial", fill: "#ff0044", align: "center" , stroke: '#000000', strokeThickness: 6};
	    this.pressStart = this.add.text(this.world.centerX - 65, 150, pressStartText, pressStartStyle);

	    var gameTitleText = "Corrida batuta!";
	    var gameTitleStyle = { font: "bold 40px Arial", fill: "#BC26D6", align: "center" , stroke: '#000000', strokeThickness: 6};
	    this.gameTitle = this.add.text(this.world.centerX - 145, 20, gameTitleText, gameTitleStyle);

	    // Title animations
	    this.gameTitleTween = this.add.tween(this.gameTitle);
	    this.gameTitleTween.to({ y: 30 }, 1000);
	    this.gameTitleTween.to({ y: 20 }, 1000);
	    this.gameTitleTween.loop();
	    this.gameTitleTween.start();
	},

	// This is for debugging purposes
	render: function() {
		/*
    	this.game.debug.body(this.player);

    	var renderGroup = function(person) {
    		this.game.debug.body(person);
    	};

    	// Debugging collision and hit boxes
		this.difficultySystem.peopleGroup.forEachAlive(renderGroup, this);

		// Debbuging how many people are in the peopleGroup
		this.game.debug.text('PeopleGroup Size: ' + this.difficultySystem.peopleGroup.children.length, 10, 35);
		// Max background speed will be 8
		this.game.debug.text('Background Speed: ' + this.difficultySystem.backgroundSpeed, 10, 55);
		// Max person respawn time will be 3
		this.game.debug.text('Max Respawn Time: ' + this.difficultySystem.personMaxRespawnTime, 10, 75);
		*/
	}
};