# breakout-remake
A remake of the classic game breakout.
JavaScript was used to write methods that were called to enable the game's
functionality.
The onLoad function invokes the canvas element to draw the components of the game
- the ball, paddle and bricks.


To add to the set up of the game, the functions spaceToStart() and printScore() are called.

To allow the functionality of the game, the play(blocks) function is called in the 
addEventListener() function.  Within the play(blocks) function, the speed and angle at which the ball bounces off the paddle are adjusted depending on which part of the paddle the ball hits.
A function hitBlock(blockArray) is also called in the play(blocks) function, where calculations are done to determine when a brick has been hit by the ball.


#### ACCESSING THE GAME
- download all the files in this directory
- open index.html in chrome
- enjoy the game!