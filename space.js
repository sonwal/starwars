var canvasId,canvasObj,height,width;
var canvasHeight = 90;
var canvasWidth = 90;
var hardnessLevelSettings = [2,3,4,5];
var currentHardnessLevel = 1;
var minObstacleRadius = 20;
var maxObstacleRadius = 30;
var allPlanetsDetails = [];
var allPlanetsNames = [];
var shipOuterDetails = {};
var popupDisplay = true;
var shipSpeed = 10;
var speedDeviation=5;
var minHeightFrame,maxHeightFrame;
var currentTopValueFrame;
var overlapFound;
var obstacleColour = "WHITE";
var obstacleBorderWidth = 2;
var color = "#794c13";
var levelThreshold = 10000;
var score = 0;
var level = 1;
var maxLevel = 15;
var bullets = [];
var bulletSpeed = 15;
var gameRunning = false;
var intervalId = null;
var aliensDestroyed = 0;

function init(ele){
	canvasId = ele;
	canvasObj = $("#"+canvasId);
	setHeight();
	setWidth();
	drawUniverse();
	drawShip();
	drawObstacles();
	introScreenPopup();
	getFocus();
	captureKeysNMouse();
}

function setHeight(){
	height = ($(window).height())*(canvasHeight/100);
	// height = parseInt(height,10);
	canvasObj.attr("height",height+"px");
}

function setWidth(){
	width = ($(window).width())*(canvasWidth/100);
	// width = parseInt(width,10);
	canvasObj.attr("width",width+"px");
}

function drawUniverse(){
	canvasObj.drawRect({
		name:"universe",
		layer:true,
		fillStyle:'BLACK',
		x: 0, y: 0,
		height:height,
		width:width,
		fromCenter:false
	});
	minHeightFrame =  -1*(height);
	maxHeightFrame =  -1*(height/2);
}

function drawShip(X){
	var startX;
	var deviation = 1;
	var deavitionPer = deviation/100*width;

	if(X == null)
		startX = width/2;
	else if(X == "left")
		startX = (shipOuterDetails.x)-(deavitionPer);
	else if(X == "right")
		startX = (shipOuterDetails.x)+(deavitionPer);
	else
		startX = X;

	// never let the ship leave the canvas.
	// todo: questionable code!!
	if(X != null){
		if(startX>width)
			startX = shipOuterDetails.x;
		else if(startX < 1)
			startX = shipOuterDetails.x;
	}

	canvasObj.removeLayerGroup("ship").drawLayers();

	var shipSides = 3;
	var shipSize = 20;
	var shipColour = "WHITE";
	var shipBoundaryWidth = 2;
	var startY = height-((5/100)*height);
	var sideLength = _getSideLengthShip(shipSize,shipSides);
	var shipRadius = _getTriangleRadius(sideLength);
	var distanceOfThrustersAndShip = 1;
	var thrusterCount = 3;
	var thrusterLength = 1.5;
	// var thrustersDistance = parseInt((sideLength/thrusterCount),10);
	var thrustersDistance = sideLength/thrusterCount;
	var derivedDistanceBetweenThrustersAndShip = (distanceOfThrustersAndShip/100)*height;
	var thrustersDerivedLength = (thrusterLength/100)*height;
	var shipDerivedHeight = _getShipDerivedHeight(sideLength);

	var thrustersX11 = startX-(sideLength/2)+(thrustersDistance/2);
	var thrustersY11 = startY-shipRadius+shipDerivedHeight+derivedDistanceBetweenThrustersAndShip;
	var thrustersX12 = thrustersX11;
	var thrustersY12 = startY-shipRadius+shipDerivedHeight+derivedDistanceBetweenThrustersAndShip+thrustersDerivedLength;

	var thrustersX21 = startX;
	var thrustersY21 = startY-shipRadius+shipDerivedHeight+derivedDistanceBetweenThrustersAndShip;
	var thrustersX22 = thrustersX21;
	var thrustersY22 = startY-shipRadius+shipDerivedHeight+derivedDistanceBetweenThrustersAndShip+thrustersDerivedLength;

	var thrustersX31 = startX+thrustersDistance;
	var thrustersY31 = startY-shipRadius+shipDerivedHeight+derivedDistanceBetweenThrustersAndShip;
	var thrustersX32 = thrustersX31;
	var thrustersY32 = startY-shipRadius+shipDerivedHeight+derivedDistanceBetweenThrustersAndShip+thrustersDerivedLength;

	// ship cabin calculations.
	var shipCabinBorderWidth = 1;
	var shipCabinSize = 5;
	var shipCabinDistance = 1;
	var shipCabinDerivedDistance = (shipCabinDistance/100)*height;
	var shipCabinX = startX;
	var shipCabinY = startY-shipCabinDerivedDistance;

	// main ship body
	canvasObj.drawPolygon({
		name:"mainShipBody",
		layer: true,
		groups:["ship"],
		strokeStyle: shipColour,
		strokeWidth: shipBoundaryWidth,
		x: startX, y: startY,
		radius: shipSize,
		sides: shipSides
	});
	shipOuterDetails.x = startX;
	shipOuterDetails.y = startY;
	shipOuterDetails.r = shipSize+1;

	// thruster 1
	canvasObj.drawLine({
		name:"thruster1",
		layer: true,
		groups:["ship"],
		strokeStyle: shipColour,
		strokeWidth: shipBoundaryWidth,
		x1: thrustersX11, y1: thrustersY11,
		x2:thrustersX12, y2:thrustersY12
	});

	// thruster 2
	canvasObj.drawLine({
		name:"thruster2",
		layer: true,
		groups:["ship"],
		strokeStyle: shipColour,
		strokeWidth: shipBoundaryWidth,
		x1: thrustersX21, y1: thrustersY21,
		x2:thrustersX22, y2:thrustersY22
	});

	// thruster 3
	canvasObj.drawLine({
		name:"thruster3",
		layer: true,
		groups:["ship"],
		strokeStyle: shipColour,
		strokeWidth: shipBoundaryWidth,
		x1: thrustersX31, y1: thrustersY31,
		x2:thrustersX32, y2:thrustersY32
	});

	// ship cabin
	canvasObj.drawPolygon({
		name:"shipCabin",
		layer: true,
		groups:["ship"],
		strokeStyle: shipColour,
		strokeWidth: shipCabinBorderWidth,
		x: shipCabinX, y: shipCabinY,
		radius: shipCabinSize,
		sides: shipSides
	});
}

function drawObstacles(X){
	var maxHeight;
	var radius,x,y;

	// defining an active area for drawing obstacles.
	if(X == null || !X){
		maxHeight = height;
		minHeight = 1;
	}
	else{
		currentTopValueFrame = minHeight = minHeightFrame;
		maxHeight = maxHeightFrame;
	}

	var maxWidth = width;

	for(var i=0;i<hardnessLevelSettings[currentHardnessLevel];){
		// get random co-ords.
		radius = _getRandomNumber(minObstacleRadius,maxObstacleRadius);
		x = _getRandomNumber(radius,maxWidth-radius);
		y = _getRandomNumber(minHeight-(radius-1),maxHeight+(radius-1));

		// check collision with other planets.
		overlapFound = false;
		for(var j=0;j<allPlanetsDetails.length;j++){
			if(_isPlanetOverlap(allPlanetsDetails[j].x,allPlanetsDetails[j].y,allPlanetsDetails[j].r,x,y,radius)){
				overlapFound = true;
				break;
			}
		}

		// check collision with ship.
		if(!overlapFound){
			if(_isPlanetOverlap(shipOuterDetails.x,shipOuterDetails.y,shipOuterDetails.r,x,y,radius))
				overlapFound = true;
		}

		// draw alien ship
		if(!overlapFound){
			_drawAlienShip(x, y, radius);
			allPlanetsDetails.push({
				x:x,
				y:y,
				r:radius
			});
			i++;
		}
	}
}

function _drawAlienShip(x, y, size){
	var alienColor = "#FF0000";
	var alienBorderColor = "#FFAA00";
	
	// Main body (diamond shape for alien ship)
	canvasObj.drawPolygon({
		name:uuid(),
		layer: true,
		groups:["planets"],
		fillStyle: alienColor,
		strokeStyle: alienBorderColor,
		strokeWidth: 2,
		x: x, y: y,
		radius: size,
		sides: 4,
		rotate: 45
	});
	
	// Cockpit window
	canvasObj.drawArc({
		name:uuid(),
		layer: true,
		groups:["planets"],
		fillStyle: "#00FFFF",
		x: x, y: y,
		radius: size/3
	});
}

function _runShip(){
	gameRunning = true;
	drawObstacles(true);
	intervalId = setInterval(function(){
		if(!allPlanetsDetails.length || currentTopValueFrame >= maxHeightFrame)
			drawObstacles(true);

		// Update and redraw alien ships
		canvasObj.removeLayerGroup("planets").drawLayers();
		for(var i=0;i<allPlanetsDetails.length;i++){
			_drawAlienShip(allPlanetsDetails[i].x, allPlanetsDetails[i].y+speedDeviation, allPlanetsDetails[i].r);
			allPlanetsDetails[i].y += speedDeviation;
			// remove non visible planets.
			if((allPlanetsDetails[i].y-allPlanetsDetails[i].r)>height)
				allPlanetsDetails.splice(i, 1);
		}
		
		// Update and redraw bullets
		_updateBullets();
		
		currentTopValueFrame += speedDeviation;
		// detect collision.
		if(_detectCollision()){
			return;
		}
		score += speedDeviation;
		if(score){
			var levelLocal = parseInt((score/levelThreshold)+1,10);
			var scoreLocal = parseInt(score/10,10);
			if(levelLocal != level){
				if(maxLevel == levelLocal){
					_gameOver("** You Rock !! Max Level Reached !!! **");
					return;
				}
				level = levelLocal;
				speedDeviation += 2;
				if(currentHardnessLevel < hardnessLevelSettings.length - 1){
					currentHardnessLevel++;
				}
			}
			_scoreBoard(scoreLocal,level,aliensDestroyed);
		}
	},shipSpeed);
}

function introScreenPopup(belowText){
	var popupX = width/2;
	var popupY = height/2;
	var popupWidth = width/1.5;
	var popupHeight = height/2;

	canvasObj.drawRect({
		name:"introScreenPopup",
		layer:true,
		groups:["introPopup"],
		fillStyle:'rgba(0, 0, 0, 0.8)',
		strokeStyle:"#FFD700",
		strokeWidth: 3,
		x: popupX, y: popupY,
		height:popupHeight,
		width:popupWidth,
		fromCenter:true
	}).drawText({
		name:"introScreenPopupTopText",
		layer:true,
		groups:["introPopup"],
		fillStyle: '#FFD700',
		strokeStyle: '#FFA500',
		strokeWidth: 2,
		x: popupX, y: popupY-(popupHeight/4),
		fontSize: 70,
		fontFamily: 'Arial, sans-serif',
		fontStyle: 'bold',
		text: '⭐ STAR WARS ⭐',
		fromCenter: true
	}).drawText({
		name:"introScreenPopupText",
		layer:true,
		groups:["introPopup"],
		fillStyle: '#FFFFFF',
		strokeStyle: '#FFD700',
		strokeWidth: 1,
		x: popupX, y: popupY+(popupHeight/6),
		fontSize: 25,
		fontFamily: 'Arial, sans-serif',
		text: (belowText == null)?'Press SPACE or Click to Start':belowText,
		fromCenter: true
	}).drawText({
		name:"introScreenInstructions",
		layer:true,
		groups:["introPopup"],
		fillStyle: '#AAAAAA',
		x: popupX, y: popupY+(popupHeight/3),
		fontSize: 18,
		fontFamily: 'Arial, sans-serif',
		text: 'Use Arrow Keys or Mouse to Move | SPACE to Shoot',
		fromCenter: true
	});
}

function _scoreBoard(scoreText,levelText,destroyedText){
	var popupX = width-width/15;
	var popupY = height-(height/15)*13.8;
	var popupWidth = 10/100*width;
	var popupHeight = 12/100*height;

	canvasObj.removeLayerGroup('scoreBoard').
	drawRect({
		name:"scoreBoardBG",
		layer:true,
		groups:["scoreBoard"],
		fillStyle:'rgba(0, 0, 0, 0.7)',
		strokeStyle:"#FFD700",
		strokeWidth: 2,
		x: popupX, y: popupY,
		height:popupHeight,
		width:popupWidth,
		fromCenter:true
	}).drawText({
		name:"scoreBoardScoreText",
		layer:true,
		groups:["scoreBoard"],
		fillStyle: '#00FF00',
		strokeStyle: '#00FF00',
		strokeWidth: 1,
		x: popupX, y: popupY-(popupHeight/3),
		fontSize: 14,
		fontFamily: 'Arial, sans-serif',
		fontStyle: 'bold',
		text: 'Score:'+(scoreText==null?"":(isNaN(scoreText)?"":scoreText)),
		fromCenter: true
	}).drawText({
		name:"scoreBoardLevelText",
		layer:true,
		groups:["scoreBoard"],
		fillStyle: '#FFD700',
		strokeStyle: '#FFD700',
		strokeWidth: 1,
		x: popupX, y: popupY,
		fontSize: 12,
		fontFamily: 'Arial, sans-serif',
		fontStyle: 'bold',
		text: 'Level:'+(levelText==null?"":(isNaN(levelText)?"":levelText)),
		fromCenter: true
	}).drawText({
		name:"scoreBoardDestroyedText",
		layer:true,
		groups:["scoreBoard"],
		fillStyle: '#FF4500',
		strokeStyle: '#FF4500',
		strokeWidth: 1,
		x: popupX, y: popupY+(popupHeight/3),
		fontSize: 12,
		fontFamily: 'Arial, sans-serif',
		fontStyle: 'bold',
		text: 'Killed:'+(destroyedText==null?"":(isNaN(destroyedText)?"":destroyedText)),
		fromCenter: true
	});
}

function getFocus(){
	canvasObj.attr("tabindex",1).focus();
}

function captureKeysNMouse(){
	// keyboard handling.
	canvasObj.on("keydown",function(key){
		if(popupDisplay == true)
			_prePopupCalls();
		else{
			switch(key.keyCode){
				case 37: 	// left arrow.
				drawShip('left');
				break;
				case 39: 	// right arrow.
				drawShip('right');
				break;
				case 32:	// space bar for shooting
				_shootBullet();
				break;
			}
		}
	});

	// mouse handling.
	canvasObj.mousemove(function(event){
		if(popupDisplay == true)
			_prePopupCalls();
		else{
			// find out is mouse moved left or right.
			if(shipOuterDetails.x > event.pageX)
				while(event.pageX<shipOuterDetails.x)
					drawShip("left");
			else if(shipOuterDetails.x < event.pageX)
				while(shipOuterDetails.x<event.pageX)
					drawShip("right");
		}
	});
	
	// mouse click for shooting
	canvasObj.click(function(event){
		if(popupDisplay == true)
			_prePopupCalls();
		else{
			_shootBullet();
		}
	});
}

function _prePopupCalls(){
	canvasObj.removeLayerGroup("introPopup").drawLayers();
	_scoreBoard();
	allPlanetsDetails = [];
	bullets = [];
	canvasObj.removeLayerGroup("planets").drawLayers();
	canvasObj.removeLayerGroup("bullets").drawLayers();
	_runShip();
	popupDisplay = false;
}

function _getSideLengthShip(radius,sides){
	// sideLength = 2*radius*(sin(pi/sides))
	return (2*radius*(Math.sin(Math.PI/sides)));
}

function _getShipDerivedHeight(sideLength){
	// H^2 = P^2+B^2
	var sideLengthHalf = sideLength/2;
	return Math.sqrt(Math.pow(sideLength, 2)-Math.pow(sideLengthHalf, 2));
}

function _getTriangleRadius(sideLength){
	// R = side/root 3
	return sideLength/Math.sqrt(3);
}

function _isPlanetOverlap(x1,y1,radius1,x2,y2,radius2){
	return (Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2))-(radius2+radius1)) <= 0;
}

function _detectCollision(){
	for(var i=0;i<allPlanetsDetails.length;i++){
		var res = _isPlanetOverlap(shipOuterDetails.x,shipOuterDetails.y,shipOuterDetails.r,allPlanetsDetails[i].x,allPlanetsDetails[i].y,allPlanetsDetails[i].r);
		if(res){
			_gameOver("GAME OVER! You were destroyed by an alien ship!");
			return true;
		}
	}
	return false;
}

function _gameOver(message){
	gameRunning = false;
	if(intervalId){
		clearInterval(intervalId);
		intervalId = null;
	}
	
	// Show explosion at ship location
	_showExplosion(shipOuterDetails.x, shipOuterDetails.y, 40);
	
	setTimeout(function(){
		canvasObj.removeLayerGroup("ship").drawLayers();
		canvasObj.removeLayerGroup("bullets").drawLayers();
		_showGameOverScreen(message);
	}, 500);
}

function _showGameOverScreen(message){
	var popupX = width/2;
	var popupY = height/2;
	var popupWidth = width/1.5;
	var popupHeight = height/1.8;

	canvasObj.drawRect({
		name:"gameOverPopup",
		layer:true,
		groups:["gameOverPopup"],
		fillStyle:'rgba(0, 0, 0, 0.9)',
		strokeStyle:"#FF0000",
		strokeWidth: 4,
		x: popupX, y: popupY,
		height:popupHeight,
		width:popupWidth,
		fromCenter:true
	}).drawText({
		name:"gameOverTitle",
		layer:true,
		groups:["gameOverPopup"],
		fillStyle: '#FF0000',
		strokeStyle: '#FF4500',
		strokeWidth: 3,
		x: popupX, y: popupY-(popupHeight/3),
		fontSize: 60,
		fontFamily: 'Arial, sans-serif',
		fontStyle: 'bold',
		text: 'GAME OVER',
		fromCenter: true
	}).drawText({
		name:"gameOverMessage",
		layer:true,
		groups:["gameOverPopup"],
		fillStyle: '#FFFFFF',
		x: popupX, y: popupY-(popupHeight/8),
		fontSize: 20,
		fontFamily: 'Arial, sans-serif',
		text: message,
		fromCenter: true
	}).drawText({
		name:"gameOverScore",
		layer:true,
		groups:["gameOverPopup"],
		fillStyle: '#00FF00',
		strokeStyle: '#00FF00',
		strokeWidth: 1,
		x: popupX, y: popupY+(popupHeight/8),
		fontSize: 25,
		fontFamily: 'Arial, sans-serif',
		fontStyle: 'bold',
		text: 'Final Score: ' + parseInt(score/10,10),
		fromCenter: true
	}).drawText({
		name:"gameOverKills",
		layer:true,
		groups:["gameOverPopup"],
		fillStyle: '#FFD700',
		x: popupX, y: popupY+(popupHeight/5),
		fontSize: 20,
		fontFamily: 'Arial, sans-serif',
		text: 'Aliens Destroyed: ' + aliensDestroyed,
		fromCenter: true
	}).drawText({
		name:"gameOverRestart",
		layer:true,
		groups:["gameOverPopup"],
		fillStyle: '#AAAAAA',
		x: popupX, y: popupY+(popupHeight/3),
		fontSize: 22,
		fontFamily: 'Arial, sans-serif',
		text: 'Press SPACE or Click to Restart',
		fromCenter: true
	});
	
	// Setup restart handler
	var restartHandler = function(e){
		if(e.type === 'keydown' && e.keyCode !== 32) return;
		
		canvasObj.off("keydown", restartHandler);
		canvasObj.off("click", restartHandler);
		_restartGame();
	};
	
	canvasObj.on("keydown", restartHandler);
	canvasObj.on("click", restartHandler);
}

function _restartGame(){
	// Reset game state
	score = 0;
	level = 1;
	aliensDestroyed = 0;
	speedDeviation = 5;
	currentHardnessLevel = 1;
	allPlanetsDetails = [];
	bullets = [];
	popupDisplay = true;
	
	// Clear all layers
	canvasObj.removeLayerGroup("gameOverPopup").drawLayers();
	canvasObj.removeLayerGroup("planets").drawLayers();
	canvasObj.removeLayerGroup("bullets").drawLayers();
	canvasObj.removeLayerGroup("explosion").drawLayers();
	
	// Redraw ship at starting position
	drawShip();
	
	// Show intro screen
	introScreenPopup();
}

function _shootBullet(){
	if(!gameRunning) return;
	
	var bulletX = shipOuterDetails.x;
	var bulletY = shipOuterDetails.y - shipOuterDetails.r - 5;
	
	bullets.push({
		x: bulletX,
		y: bulletY,
		r: 3
	});
}

function _updateBullets(){
	canvasObj.removeLayerGroup("bullets").drawLayers();
	
	for(var i = bullets.length - 1; i >= 0; i--){
		bullets[i].y -= bulletSpeed;
		
		// Remove bullets that are off screen
		if(bullets[i].y < 0){
			bullets.splice(i, 1);
			continue;
		}
		
		// Check collision with aliens
		var hitAlien = false;
		for(var j = allPlanetsDetails.length - 1; j >= 0; j--){
			if(_isPlanetOverlap(bullets[i].x, bullets[i].y, bullets[i].r, 
				allPlanetsDetails[j].x, allPlanetsDetails[j].y, allPlanetsDetails[j].r)){
				
				// Show explosion
				_showExplosion(allPlanetsDetails[j].x, allPlanetsDetails[j].y, allPlanetsDetails[j].r);
				
				// Remove alien and bullet
				allPlanetsDetails.splice(j, 1);
				bullets.splice(i, 1);
				aliensDestroyed++;
				score += 100;
				hitAlien = true;
				break;
			}
		}
		
		if(hitAlien) continue;
		
		// Draw bullet (laser beam)
		canvasObj.drawLine({
			name: uuid(),
			layer: true,
			groups: ["bullets"],
			strokeStyle: "#00FF00",
			strokeWidth: 3,
			x1: bullets[i].x, y1: bullets[i].y,
			x2: bullets[i].x, y2: bullets[i].y + 10
		});
		
		// Add glow effect
		canvasObj.drawArc({
			name: uuid(),
			layer: true,
			groups: ["bullets"],
			fillStyle: "#00FF00",
			x: bullets[i].x,
			y: bullets[i].y,
			radius: bullets[i].r
		});
	}
}

function _showExplosion(x, y, size){
	// Create explosion effect with multiple circles
	var explosionColors = ["#FF0000", "#FF4500", "#FFA500", "#FFFF00"];
	
	for(var i = 0; i < 4; i++){
		(function(index){
			setTimeout(function(){
				canvasObj.removeLayerGroup("explosion").drawLayers();
				canvasObj.drawArc({
					name: uuid(),
					layer: true,
					groups: ["explosion"],
					fillStyle: explosionColors[index],
					x: x + _getRandomNumber(-5, 5),
					y: y + _getRandomNumber(-5, 5),
					radius: size + (index * 5),
					opacity: 1 - (index * 0.2)
				});
			}, index * 50);
		})(i);
	}
	
	// Clear explosion after animation
	setTimeout(function(){
		canvasObj.removeLayerGroup("explosion").drawLayers();
	}, 300);
}

function _getRandomNumber(min,max){
	return Math.floor((Math.random()*(max-min+1))+min);
}

function uuid() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});
}