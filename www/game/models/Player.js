var Main = Main || {};

Main.Player = function(game, x, y) {
	Phaser.Sprite.call(this, game, x, y, 'player');

	// Regular properties
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