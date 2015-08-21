var Main = Main || {};

Main.Player = function(game, x, y) {
	Phaser.Sprite.call(this, game, x, y, 'player');

	// Regular properties
	this.health = 3;
	this.anchor.set(0.5, 0.7);
	this.scale.set(1.5, 1.5);
	this.animations.add('running', [6, 7, 8, 7], 10, true);
	this.checkWorldBounds = true;
	this.outOfBoundsKill = true;

	// Physics properties
	this.game.physics.arcade.enable(this);
	this.body.gravity.y = 300;
	this.body.setSize(17, 35);
	this.body.bounce.set(0.3);

	this.animations.play('running');
	this.game.add.existing(this);
};

Main.Player.prototype = Object.create(Phaser.Sprite.prototype);
Main.Player.prototype.constructor = Main.Player;

Main.Player.prototype.handleInput = function() {
	// This function handles the input for either the mouse or mobile devices
	if ((this.game.input.mousePointer.isDown || this.game.input.pointer1.isDown) && this.body.touching.down) {
		this.body.velocity.y = -200;
	}
};

Main.Player.prototype.damagePlayer = function() {
	// If the player is not invincible then we can damage him
	if (!this.invincibility) {
		this.damage(1);

		// We remove the last heart
		this.hearts[this.hearts.length -1].kill();
		this.hearts.splice(this.hearts.length - 1, 1);
		
		// Now the player is invincible for the next 2 seconds
		this.invincibility = true;
		this.game.time.events.add(2000, this.toggleInvincibility, this, this);

		// Animations for the invicibility frames
		this.playerIsInvencible = this.game.add.tween(this);
		this.playerIsInvencible.to({ alpha: 0.3 }, 500);
		this.playerIsInvencible.to({ alpha: 1 }, 500);
		this.playerIsInvencible.to({ alpha: 0.3 }, 500);
		this.playerIsInvencible.to({ alpha: 1 }, 500);
		this.playerIsInvencible.start();
		this.playerIsInvencible.onComplete.removeAll();
	}
};

Main.Player.prototype.toggleInvincibility = function() {
	this.invincibility = false;
};

Main.Player.prototype.setupHealth = function() {
	// Creates some heart sprites which will act as the player's health
	this.hearts = [];
	this.hearts.push(this.game.add.sprite(10, 10, 'heart'));
	this.hearts.push(this.game.add.sprite(25, 10, 'heart'))
	this.hearts.push(this.game.add.sprite(40, 10, 'heart'))
};