var canvasId,canvasObj,height,width;
var canvasHeight = 90;
var canvasWidth = 90;
var hardnessLevelSettings = [2,3,4,5,6,7,8];
var currentHardnessLevel = 1;
var minObstacleRadius = 20;
var maxObstacleRadius = 30;
var allPlanetsDetails = [];
var allAliensDetails = [];
var solidPlanets = [];
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
var maxLevel = 25;
var bullets = [];
var enemyBullets = [];
var bulletSpeed = 15;
var gameRunning = false;
var gamePaused = false;
var intervalId = null;
var aliensDestroyed = 0;
var lives = 3;
var maxLives = 5;
var powerUps = [];
var activePowerUps = {};
var burstMode = false;
var burstCount = 3;
var multiDirectionalGun = false;
var shipType = 1;
var mouseX = null;
var smoothingFactor = 0.15;
var targetX = null;
var alienShootInterval = 2000;
var lastAlienShootTime = 0;
var difficultyLevel = "Normal";
var difficultySettings = {
	"Easy": {speedMultiplier: 0.7, enemyShootChance: 0.3, enemyCount: 0.7},
	"Normal": {speedMultiplier: 1, enemyShootChance: 0.5, enemyCount: 1},
	"Hard": {speedMultiplier: 1.3, enemyShootChance: 0.7, enemyCount: 1.3},
	"Expert": {speedMultiplier: 1.6, enemyShootChance: 0.9, enemyCount: 1.5}
};
var highScore = 0;

function init(ele){
	canvasId = ele;
	canvasObj = $("#"+canvasId);
	setHeight();
	setWidth();
	loadHighScore();
	drawUniverse();
	drawShip();
	drawObstacles();
	introScreenPopup();
	getFocus();
	captureKeysNMouse();
}

function loadHighScore(){
	var saved = localStorage.getItem('starwars_highscore');
	if(saved){
		highScore = parseInt(saved, 10);
	}
}

function saveHighScore(){
	var currentScore = parseInt(score/10, 10);
	if(currentScore > highScore){
		highScore = currentScore;
		localStorage.setItem('starwars_highscore', highScore);
	}
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

	// Smooth mouse movement
	if(X != null && typeof X === 'number' && targetX !== null){
		var dx = targetX - shipOuterDetails.x;
		startX = shipOuterDetails.x + dx * smoothingFactor;
	} else if(X == null) {
		startX = width/2;
	} else if(X == "left") {
		startX = (shipOuterDetails.x)-(deavitionPer);
	} else if(X == "right") {
		startX = (shipOuterDetails.x)+(deavitionPer);
	} else {
		startX = X;
	}

	// never let the ship leave the canvas.
	if(X != null){
		if(startX>width)
			startX = shipOuterDetails.x;
		else if(startX < 1)
			startX = shipOuterDetails.x;
	}

	canvasObj.removeLayerGroup("ship").drawLayers();

	// Ship type changes based on level
	if(level >= 15){
		shipType = 3;
	} else if(level >= 8){
		shipType = 2;
	} else {
		shipType = 1;
	}

	if(shipType === 1){
		_drawShipType1(startX);
	} else if(shipType === 2){
		_drawShipType2(startX);
	} else {
		_drawShipType3(startX);
	}
}

function _drawShipType1(startX){
	// Original white triangular ship
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

	var shipCabinBorderWidth = 1;
	var shipCabinSize = 5;
	var shipCabinDistance = 1;
	var shipCabinDerivedDistance = (shipCabinDistance/100)*height;
	var shipCabinX = startX;
	var shipCabinY = startY-shipCabinDerivedDistance;

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

	canvasObj.drawLine({
		name:"thruster1",
		layer: true,
		groups:["ship"],
		strokeStyle: shipColour,
		strokeWidth: shipBoundaryWidth,
		x1: thrustersX11, y1: thrustersY11,
		x2:thrustersX12, y2:thrustersY12
	});

	canvasObj.drawLine({
		name:"thruster2",
		layer: true,
		groups:["ship"],
		strokeStyle: shipColour,
		strokeWidth: shipBoundaryWidth,
		x1: thrustersX21, y1: thrustersY21,
		x2:thrustersX22, y2:thrustersY22
	});

	canvasObj.drawLine({
		name:"thruster3",
		layer: true,
		groups:["ship"],
		strokeStyle: shipColour,
		strokeWidth: shipBoundaryWidth,
		x1: thrustersX31, y1: thrustersY31,
		x2:thrustersX32, y2:thrustersY32
	});

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

function _drawShipType2(startX){
	// Advanced blue pentagon ship
	var shipSize = 25;
	var shipColour = "#00AAFF";
	var startY = height-((5/100)*height);

	canvasObj.drawPolygon({
		name:"mainShipBody",
		layer: true,
		groups:["ship"],
		fillStyle: "#001144",
		strokeStyle: shipColour,
		strokeWidth: 3,
		x: startX, y: startY,
		radius: shipSize,
		sides: 5
	});
	
	canvasObj.drawArc({
		name:"shipCore",
		layer: true,
		groups:["ship"],
		fillStyle: "#00FFFF",
		x: startX, y: startY,
		radius: shipSize/3
	});

	// Wing thrusters
	canvasObj.drawArc({
		name:"thruster1",
		layer: true,
		groups:["ship"],
		fillStyle: "#00AAFF",
		x: startX - shipSize/1.5, y: startY + shipSize/2,
		radius: 5
	});
	
	canvasObj.drawArc({
		name:"thruster2",
		layer: true,
		groups:["ship"],
		fillStyle: "#00AAFF",
		x: startX + shipSize/1.5, y: startY + shipSize/2,
		radius: 5
	});

	shipOuterDetails.x = startX;
	shipOuterDetails.y = startY;
	shipOuterDetails.r = shipSize+1;
}

function _drawShipType3(startX){
	// Elite golden hexagonal ship
	var shipSize = 30;
	var shipColour = "#FFD700";
	var startY = height-((5/100)*height);

	canvasObj.drawPolygon({
		name:"mainShipBody",
		layer: true,
		groups:["ship"],
		fillStyle: "#332200",
		strokeStyle: shipColour,
		strokeWidth: 4,
		x: startX, y: startY,
		radius: shipSize,
		sides: 6
	});
	
	canvasObj.drawPolygon({
		name:"shipCore",
		layer: true,
		groups:["ship"],
		fillStyle: "#FFAA00",
		strokeStyle: "#FFD700",
		strokeWidth: 2,
		x: startX, y: startY,
		radius: shipSize/2,
		sides: 6
	});

	// Multiple thrusters
	for(var i = 0; i < 4; i++){
		var angle = (i * 90) * Math.PI / 180;
		canvasObj.drawArc({
			name:"thruster" + i,
			layer: true,
			groups:["ship"],
			fillStyle: "#FF6600",
			x: startX + Math.cos(angle) * shipSize * 0.7,
			y: startY + Math.sin(angle) * shipSize * 0.7,
			radius: 4
		});
	}

	shipOuterDetails.x = startX;
	shipOuterDetails.y = startY;
	shipOuterDetails.r = shipSize+1;
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
	var enemyCount = Math.floor(hardnessLevelSettings[currentHardnessLevel] * difficultySettings[difficultyLevel].enemyCount);

	for(var i=0;i<enemyCount;){
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

		// Randomly decide if this is an alien ship or solid planet
		var isSolidPlanet = Math.random() < 0.2; // 20% chance of solid planet
		
		// draw alien ship or planet
		if(!overlapFound){
			if(isSolidPlanet){
				_drawSolidPlanet(x, y, radius);
				solidPlanets.push({
					x:x,
					y:y,
					r:radius,
					type: 'planet'
				});
			} else {
				var alienType = _getRandomNumber(1, 3);
				_drawAlienShip(x, y, radius, alienType);
				allAliensDetails.push({
					x:x,
					y:y,
					r:radius,
					type: alienType,
					canShoot: alienType >= 2, // Types 2 and 3 can shoot
					lastShot: 0
				});
			}
			allPlanetsDetails.push({
				x:x,
				y:y,
				r:radius,
				isSolid: isSolidPlanet
			});
			i++;
		}
	}
}

function _drawAlienShip(x, y, size, type){
	type = type || 1;
	
	if(type === 1){
		// Basic red alien ship (original)
		var alienColor = "#FF0000";
		var alienBorderColor = "#FFAA00";
		
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
		
		canvasObj.drawArc({
			name:uuid(),
			layer: true,
			groups:["planets"],
			fillStyle: "#00FFFF",
			x: x, y: y,
			radius: size/3
		});
	} else if(type === 2){
		// Advanced green alien ship (can shoot)
		canvasObj.drawPolygon({
			name:uuid(),
			layer: true,
			groups:["planets"],
			fillStyle: "#00AA00",
			strokeStyle: "#00FF00",
			strokeWidth: 2,
			x: x, y: y,
			radius: size,
			sides: 5
		});
		
		canvasObj.drawArc({
			name:uuid(),
			layer: true,
			groups:["planets"],
			fillStyle: "#FFFF00",
			x: x, y: y,
			radius: size/3
		});
		
		// Gun indicators
		canvasObj.drawArc({
			name:uuid(),
			layer: true,
			groups:["planets"],
			fillStyle: "#FF0000",
			x: x - size/2, y: y,
			radius: 3
		});
		canvasObj.drawArc({
			name:uuid(),
			layer: true,
			groups:["planets"],
			fillStyle: "#FF0000",
			x: x + size/2, y: y,
			radius: 3
		});
	} else if(type === 3){
		// Elite purple alien ship (faster and can shoot)
		canvasObj.drawPolygon({
			name:uuid(),
			layer: true,
			groups:["planets"],
			fillStyle: "#8800AA",
			strokeStyle: "#FF00FF",
			strokeWidth: 3,
			x: x, y: y,
			radius: size,
			sides: 6
		});
		
		canvasObj.drawArc({
			name:uuid(),
			layer: true,
			groups:["planets"],
			fillStyle: "#FF00FF",
			x: x, y: y,
			radius: size/2.5
		});
		
		// Multiple gun indicators
		for(var i = 0; i < 3; i++){
			var angle = (i * 120) * Math.PI / 180;
			canvasObj.drawArc({
				name:uuid(),
				layer: true,
				groups:["planets"],
				fillStyle: "#FF0000",
				x: x + Math.cos(angle) * size * 0.7,
				y: y + Math.sin(angle) * size * 0.7,
				radius: 3
			});
		}
	}
}

function _drawSolidPlanet(x, y, size){
	var planetTypes = [
		{color: "#8B4513", border: "#654321", name: "brown"},
		{color: "#4169E1", border: "#1E3A8A", name: "blue"},
		{color: "#DC143C", border: "#8B0000", name: "red"},
		{color: "#FFD700", border: "#FFA500", name: "gold"},
		{color: "#808080", border: "#505050", name: "gray"}
	];
	
	var planet = planetTypes[_getRandomNumber(0, planetTypes.length - 1)];
	
	// Draw main planet body
	canvasObj.drawArc({
		name:uuid(),
		layer: true,
		groups:["planets"],
		fillStyle: planet.color,
		strokeStyle: planet.border,
		strokeWidth: 3,
		x: x, y: y,
		radius: size
	});
	
	// Add surface details
	for(var i = 0; i < 3; i++){
		canvasObj.drawArc({
			name:uuid(),
			layer: true,
			groups:["planets"],
			fillStyle: planet.border,
			opacity: 0.5,
			x: x + _getRandomNumber(-size/2, size/2),
			y: y + _getRandomNumber(-size/2, size/2),
			radius: _getRandomNumber(3, size/3)
		});
	}
}

function _runShip(){
	gameRunning = true;
	drawObstacles(true);
	var currentSpeed = speedDeviation * difficultySettings[difficultyLevel].speedMultiplier;
	
	intervalId = setInterval(function(){
		// Skip game updates if paused
		if(gamePaused) return;
		
		if(!allPlanetsDetails.length || currentTopValueFrame >= maxHeightFrame)
			drawObstacles(true);

		// Update and redraw all objects
		canvasObj.removeLayerGroup("planets").drawLayers();
		
		// Update aliens and solid planets
		for(var i=allPlanetsDetails.length-1; i>=0; i--){
			if(allPlanetsDetails[i].isSolid){
				// Update solid planets
				var solidIdx = solidPlanets.findIndex(function(p){
					return p.x === allPlanetsDetails[i].x && p.y === allPlanetsDetails[i].y;
				});
				if(solidIdx !== -1){
					_drawSolidPlanet(allPlanetsDetails[i].x, allPlanetsDetails[i].y+currentSpeed, allPlanetsDetails[i].r);
					solidPlanets[solidIdx].y += currentSpeed;
					allPlanetsDetails[i].y += currentSpeed;
					if((allPlanetsDetails[i].y-allPlanetsDetails[i].r)>height){
						allPlanetsDetails.splice(i, 1);
						solidPlanets.splice(solidIdx, 1);
					}
				}
			} else {
				// Update aliens
				var alienIdx = allAliensDetails.findIndex(function(a){
					return Math.abs(a.x - allPlanetsDetails[i].x) < 1 && Math.abs(a.y - allPlanetsDetails[i].y) < 1;
				});
				if(alienIdx !== -1){
					var alien = allAliensDetails[alienIdx];
					var extraSpeed = alien.type === 3 ? currentSpeed * 1.3 : currentSpeed;
					_drawAlienShip(alien.x, alien.y+extraSpeed, alien.r, alien.type);
					alien.y += extraSpeed;
					allPlanetsDetails[i].y += extraSpeed;
					
					// Enemy shooting
					if(alien.canShoot && gameRunning){
						var now = Date.now();
						if(now - alien.lastShot > alienShootInterval / difficultySettings[difficultyLevel].enemyShootChance){
							if(Math.random() < difficultySettings[difficultyLevel].enemyShootChance){
								_alienShoot(alien.x, alien.y, alien.type);
								alien.lastShot = now;
							}
						}
					}
					
					if((allPlanetsDetails[i].y-allPlanetsDetails[i].r)>height){
						allPlanetsDetails.splice(i, 1);
						allAliensDetails.splice(alienIdx, 1);
					}
				}
			}
		}
		
		// Update and redraw bullets
		_updateBullets();
		
		// Update and redraw enemy bullets
		_updateEnemyBullets();
		
		// Update and redraw power-ups
		_updatePowerUps();
		
		// Spawn power-ups randomly
		if(Math.random() < 0.005){
			_spawnPowerUp();
		}
		
		currentTopValueFrame += currentSpeed;
		
		// detect collision.
		if(_detectCollision()){
			return;
		}
		
		score += currentSpeed;
		if(score){
			var levelLocal = parseInt((score/levelThreshold)+1,10);
			var scoreLocal = parseInt(score/10,10);
			if(levelLocal != level){
				if(maxLevel == levelLocal){
					_gameOver("** You Rock !! Max Level Reached !!! **");
					return;
				}
				level = levelLocal;
				speedDeviation += 1.5;
				currentSpeed = speedDeviation * difficultySettings[difficultyLevel].speedMultiplier;
				if(currentHardnessLevel < hardnessLevelSettings.length - 1){
					currentHardnessLevel++;
				}
				// Level up notification
				_showLevelUp();
			}
			_scoreBoard(scoreLocal,level,aliensDestroyed);
		}
	},shipSpeed);
}

function introScreenPopup(belowText){
	var popupX = width/2;
	var popupY = height/2;
	var popupWidth = width/1.5;
	var popupHeight = height/1.7;

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
		x: popupX, y: popupY-(popupHeight/3),
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
		x: popupX, y: popupY-(popupHeight/10),
		fontSize: 25,
		fontFamily: 'Arial, sans-serif',
		text: (belowText == null)?'Press SPACE or Click to Start':belowText,
		fromCenter: true
	}).drawText({
		name:"introScreenDifficulty",
		layer:true,
		groups:["introPopup"],
		fillStyle: '#00FFFF',
		x: popupX, y: popupY+(popupHeight/12),
		fontSize: 20,
		fontFamily: 'Arial, sans-serif',
		text: 'Difficulty: ' + difficultyLevel + ' (Press 1-4 to change)',
		fromCenter: true
	}).drawText({
		name:"introScreenDiffOptions",
		layer:true,
		groups:["introPopup"],
		fillStyle: '#AAAAAA',
		x: popupX, y: popupY+(popupHeight/6),
		fontSize: 16,
		fontFamily: 'Arial, sans-serif',
		text: '1:Easy | 2:Normal | 3:Hard | 4:Expert',
		fromCenter: true
	}).drawText({
		name:"introScreenInstructions",
		layer:true,
		groups:["introPopup"],
		fillStyle: '#AAAAAA',
		x: popupX, y: popupY+(popupHeight/3.5),
		fontSize: 16,
		fontFamily: 'Arial, sans-serif',
		text: 'Arrow Keys/Mouse: Move | SPACE: Shoot | P: Pause',
		fromCenter: true
	}).drawText({
		name:"introScreenHighScore",
		layer:true,
		groups:["introPopup"],
		fillStyle: '#FFD700',
		x: popupX, y: popupY+(popupHeight/2.5),
		fontSize: 18,
		fontFamily: 'Arial, sans-serif',
		fontStyle: 'bold',
		text: 'High Score: ' + highScore,
		fromCenter: true
	});
}

function _showLevelUp(){
	var popupX = width/2;
	var popupY = height/3;
	
	canvasObj.drawText({
		name:"levelUpText",
		layer:true,
		groups:["levelUp"],
		fillStyle: '#FFD700',
		strokeStyle: '#FFA500',
		strokeWidth: 3,
		x: popupX, y: popupY,
		fontSize: 50,
		fontFamily: 'Arial, sans-serif',
		fontStyle: 'bold',
		text: 'LEVEL UP! Level ' + level,
		fromCenter: true
	});
	
	setTimeout(function(){
		canvasObj.removeLayerGroup("levelUp").drawLayers();
	}, 2000);
}

function _spawnPowerUp(){
	var types = ['life', 'burst', 'multi', 'shield', 'speed'];
	var type = types[_getRandomNumber(0, types.length - 1)];
	var x = _getRandomNumber(30, width - 30);
	var y = -30;
	
	powerUps.push({
		x: x,
		y: y,
		type: type,
		r: 15
	});
}

function _updatePowerUps(){
	canvasObj.removeLayerGroup("powerups").drawLayers();
	
	for(var i = powerUps.length - 1; i >= 0; i--){
		powerUps[i].y += 3;
		
		// Remove if off screen
		if(powerUps[i].y > height){
			powerUps.splice(i, 1);
			continue;
		}
		
		// Check collision with player
		if(_isPlanetOverlap(shipOuterDetails.x, shipOuterDetails.y, shipOuterDetails.r,
			powerUps[i].x, powerUps[i].y, powerUps[i].r)){
			_collectPowerUp(powerUps[i].type);
			powerUps.splice(i, 1);
			continue;
		}
		
		// Draw power-up
		_drawPowerUp(powerUps[i]);
	}
}

function _drawPowerUp(powerUp){
	var colors = {
		'life': '#00FF00',
		'burst': '#FF00FF',
		'multi': '#00FFFF',
		'shield': '#FFFF00',
		'speed': '#FF8800'
	};
	
	var icons = {
		'life': '+',
		'burst': 'B',
		'multi': 'M',
		'shield': 'S',
		'speed': 'V'
	};
	
	canvasObj.drawArc({
		name: uuid(),
		layer: true,
		groups: ["powerups"],
		fillStyle: colors[powerUp.type],
		strokeStyle: '#FFFFFF',
		strokeWidth: 2,
		x: powerUp.x,
		y: powerUp.y,
		radius: powerUp.r
	});
	
	canvasObj.drawText({
		name: uuid(),
		layer: true,
		groups: ["powerups"],
		fillStyle: '#000000',
		x: powerUp.x,
		y: powerUp.y,
		fontSize: 20,
		fontFamily: 'Arial, sans-serif',
		fontStyle: 'bold',
		text: icons[powerUp.type],
		fromCenter: true
	});
}

function _collectPowerUp(type){
	score += 500;
	
	if(type === 'life'){
		if(lives < maxLives){
			lives++;
		}
	} else if(type === 'burst'){
		activePowerUps.burst = Date.now() + 10000; // 10 seconds
		burstMode = true;
	} else if(type === 'multi'){
		activePowerUps.multi = Date.now() + 15000; // 15 seconds
		multiDirectionalGun = true;
	} else if(type === 'shield'){
		activePowerUps.shield = Date.now() + 8000; // 8 seconds
	} else if(type === 'speed'){
		activePowerUps.speed = Date.now() + 12000; // 12 seconds
	}
	
	_updateActivePowerUps();
}

function _updateActivePowerUps(){
	var now = Date.now();
	
	if(activePowerUps.burst && now > activePowerUps.burst){
		burstMode = false;
		delete activePowerUps.burst;
	}
	
	if(activePowerUps.multi && now > activePowerUps.multi){
		multiDirectionalGun = false;
		delete activePowerUps.multi;
	}
	
	if(activePowerUps.shield && now > activePowerUps.shield){
		delete activePowerUps.shield;
	}
	
	if(activePowerUps.speed && now > activePowerUps.speed){
		delete activePowerUps.speed;
	}
}

function _alienShoot(x, y, type){
	if(type === 2){
		// Single shot straight down
		enemyBullets.push({
			x: x,
			y: y + 20,
			dx: 0,
			dy: 8,
			r: 4
		});
	} else if(type === 3){
		// Triple shot in spread pattern
		var angles = [-20, 0, 20];
		for(var i = 0; i < angles.length; i++){
			var angle = angles[i] * Math.PI / 180;
			enemyBullets.push({
				x: x,
				y: y + 20,
				dx: Math.sin(angle) * 6,
				dy: Math.cos(angle) * 8 + 2,
				r: 4
			});
		}
	}
}

function _updateEnemyBullets(){
	canvasObj.removeLayerGroup("enemyBullets").drawLayers();
	
	for(var i = enemyBullets.length - 1; i >= 0; i--){
		enemyBullets[i].x += enemyBullets[i].dx;
		enemyBullets[i].y += enemyBullets[i].dy;
		
		// Remove if off screen
		if(enemyBullets[i].y > height || enemyBullets[i].x < 0 || enemyBullets[i].x > width){
			enemyBullets.splice(i, 1);
			continue;
		}
		
		// Check collision with player (unless shielded)
		if(!activePowerUps.shield){
			if(_isPlanetOverlap(shipOuterDetails.x, shipOuterDetails.y, shipOuterDetails.r,
				enemyBullets[i].x, enemyBullets[i].y, enemyBullets[i].r)){
				enemyBullets.splice(i, 1);
				_loseLife();
				continue;
			}
		}
		
		// Draw enemy bullet
		canvasObj.drawArc({
			name: uuid(),
			layer: true,
			groups: ["enemyBullets"],
			fillStyle: "#FF0000",
			strokeStyle: "#FF6600",
			strokeWidth: 2,
			x: enemyBullets[i].x,
			y: enemyBullets[i].y,
			radius: enemyBullets[i].r
		});
	}
}

function _loseLife(){
	lives--;
	_showExplosion(shipOuterDetails.x, shipOuterDetails.y, 30);
	
	if(lives <= 0){
		_gameOver("GAME OVER! You ran out of lives!");
	} else {
		// Brief invincibility after hit
		activePowerUps.shield = Date.now() + 2000;
		_showLifeLost();
	}
}

function _showLifeLost(){
	var popupX = width/2;
	var popupY = height/2;
	
	canvasObj.drawText({
		name:"lifeLostText",
		layer:true,
		groups:["lifeLost"],
		fillStyle: '#FF0000',
		strokeStyle: '#FF6600',
		strokeWidth: 2,
		x: popupX, y: popupY,
		fontSize: 40,
		fontFamily: 'Arial, sans-serif',
		fontStyle: 'bold',
		text: 'LIFE LOST! ' + lives + ' remaining',
		fromCenter: true
	});
	
	setTimeout(function(){
		canvasObj.removeLayerGroup("lifeLost").drawLayers();
	}, 1500);
}

function _scoreBoard(scoreText,levelText,destroyedText){
	var popupX = width-width/15;
	var popupY = height-(height/15)*13.8;
	var popupWidth = 10/100*width;
	var popupHeight = 15/100*height;

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
		x: popupX, y: popupY-(popupHeight/2.5),
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
		x: popupX, y: popupY-(popupHeight/6),
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
		x: popupX, y: popupY+(popupHeight/12),
		fontSize: 12,
		fontFamily: 'Arial, sans-serif',
		fontStyle: 'bold',
		text: 'Killed:'+(destroyedText==null?"":(isNaN(destroyedText)?"":destroyedText)),
		fromCenter: true
	}).drawText({
		name:"scoreBoardLivesText",
		layer:true,
		groups:["scoreBoard"],
		fillStyle: '#00FFFF',
		strokeStyle: '#00FFFF',
		strokeWidth: 1,
		x: popupX, y: popupY+(popupHeight/3.5),
		fontSize: 12,
		fontFamily: 'Arial, sans-serif',
		fontStyle: 'bold',
		text: 'Lives:'+lives,
		fromCenter: true
	});
	
	// Show active power-ups
	var powerUpY = popupY + (popupHeight/2.2);
	if(activePowerUps.shield){
		canvasObj.drawText({
			name:"powerUpShield",
			layer:true,
			groups:["scoreBoard"],
			fillStyle: '#FFFF00',
			x: popupX, y: powerUpY,
			fontSize: 10,
			fontFamily: 'Arial, sans-serif',
			text: 'SHIELD',
			fromCenter: true
		});
	}
	if(activePowerUps.burst){
		powerUpY += 12;
		canvasObj.drawText({
			name:"powerUpBurst",
			layer:true,
			groups:["scoreBoard"],
			fillStyle: '#FF00FF',
			x: popupX, y: powerUpY,
			fontSize: 10,
			fontFamily: 'Arial, sans-serif',
			text: 'BURST',
			fromCenter: true
		});
	}
	if(activePowerUps.multi){
		powerUpY += 12;
		canvasObj.drawText({
			name:"powerUpMulti",
			layer:true,
			groups:["scoreBoard"],
			fillStyle: '#00FFFF',
			x: popupX, y: powerUpY,
			fontSize: 10,
			fontFamily: 'Arial, sans-serif',
			text: 'MULTI',
			fromCenter: true
		});
	}
}

function getFocus(){
	canvasObj.attr("tabindex",1).focus();
}

function captureKeysNMouse(){
	// keyboard handling.
	canvasObj.on("keydown",function(key){
		if(popupDisplay == true){
			// Difficulty selection on intro screen
			switch(key.keyCode){
				case 49: // 1 key
					difficultyLevel = "Easy";
					canvasObj.removeLayerGroup("introPopup").drawLayers();
					introScreenPopup();
					break;
				case 50: // 2 key
					difficultyLevel = "Normal";
					canvasObj.removeLayerGroup("introPopup").drawLayers();
					introScreenPopup();
					break;
				case 51: // 3 key
					difficultyLevel = "Hard";
					canvasObj.removeLayerGroup("introPopup").drawLayers();
					introScreenPopup();
					break;
				case 52: // 4 key
					difficultyLevel = "Expert";
					canvasObj.removeLayerGroup("introPopup").drawLayers();
					introScreenPopup();
					break;
				default:
					_prePopupCalls();
					break;
			}
		}
		else{
			switch(key.keyCode){
				case 37: 	// left arrow.
					if(!gamePaused) drawShip('left');
					break;
				case 39: 	// right arrow.
					if(!gamePaused) drawShip('right');
					break;
				case 32:	// space bar for shooting
					if(!gamePaused) _shootBullet();
					break;
				case 80:	// P key for pause
					_togglePause();
					break;
			}
		}
	});

	// mouse handling.
	canvasObj.mousemove(function(event){
		if(popupDisplay == true)
			return; // Don't auto-start on mouse move
		else if(!gamePaused){
			// Smooth mouse movement
			targetX = event.pageX;
			if(!mouseX){
				mouseX = targetX;
			}
		}
	});
	
	// Smooth mouse movement update loop
	setInterval(function(){
		if(gameRunning && targetX !== null && mouseX !== null){
			drawShip(targetX);
			mouseX = shipOuterDetails.x;
		}
	}, 16); // ~60 FPS
	
	// mouse click for shooting
	canvasObj.click(function(event){
		if(popupDisplay == true)
			_prePopupCalls();
		else if(!gamePaused){
			_shootBullet();
		}
	});
}

function _togglePause(){
	if(!gameRunning) return;
	
	gamePaused = !gamePaused;
	
	if(gamePaused){
		_showPauseScreen();
	} else {
		canvasObj.removeLayerGroup("pausePopup").drawLayers();
	}
}

function _showPauseScreen(){
	var popupX = width/2;
	var popupY = height/2;
	var popupWidth = width/2;
	var popupHeight = height/3;
	
	canvasObj.drawRect({
		name:"pausePopup",
		layer:true,
		groups:["pausePopup"],
		fillStyle:'rgba(0, 0, 0, 0.9)',
		strokeStyle:"#FFD700",
		strokeWidth: 3,
		x: popupX, y: popupY,
		height:popupHeight,
		width:popupWidth,
		fromCenter:true
	}).drawText({
		name:"pauseTitle",
		layer:true,
		groups:["pausePopup"],
		fillStyle: '#FFD700',
		strokeStyle: '#FFA500',
		strokeWidth: 2,
		x: popupX, y: popupY-(popupHeight/4),
		fontSize: 50,
		fontFamily: 'Arial, sans-serif',
		fontStyle: 'bold',
		text: 'PAUSED',
		fromCenter: true
	}).drawText({
		name:"pauseInstructions",
		layer:true,
		groups:["pausePopup"],
		fillStyle: '#FFFFFF',
		x: popupX, y: popupY+(popupHeight/6),
		fontSize: 20,
		fontFamily: 'Arial, sans-serif',
		text: 'Press P to Resume',
		fromCenter: true
	});
}

function _prePopupCalls(){
	canvasObj.removeLayerGroup("introPopup").drawLayers();
	_scoreBoard();
	allPlanetsDetails = [];
	allAliensDetails = [];
	solidPlanets = [];
	bullets = [];
	enemyBullets = [];
	powerUps = [];
	canvasObj.removeLayerGroup("planets").drawLayers();
	canvasObj.removeLayerGroup("bullets").drawLayers();
	canvasObj.removeLayerGroup("enemyBullets").drawLayers();
	canvasObj.removeLayerGroup("powerups").drawLayers();
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
	// Shield protects from collisions
	if(activePowerUps.shield) return false;
	
	for(var i=0;i<allPlanetsDetails.length;i++){
		var res = _isPlanetOverlap(shipOuterDetails.x,shipOuterDetails.y,shipOuterDetails.r,allPlanetsDetails[i].x,allPlanetsDetails[i].y,allPlanetsDetails[i].r);
		if(res){
			lives--;
			if(lives <= 0){
				_gameOver("GAME OVER! You were destroyed!");
			} else {
				// Show explosion and give brief invincibility
				_showExplosion(shipOuterDetails.x, shipOuterDetails.y, 30);
				activePowerUps.shield = Date.now() + 2000;
				_showLifeLost();
				
				// Remove the colliding object
				var alienIdx = allAliensDetails.findIndex(function(a){
					return Math.abs(a.x - allPlanetsDetails[i].x) < 1 && Math.abs(a.y - allPlanetsDetails[i].y) < 1;
				});
				if(alienIdx !== -1){
					allAliensDetails.splice(alienIdx, 1);
				}
				allPlanetsDetails.splice(i, 1);
			}
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
	
	// Save high score
	saveHighScore();
	
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
		x: popupX, y: popupY+(popupHeight/5.5),
		fontSize: 20,
		fontFamily: 'Arial, sans-serif',
		text: 'Aliens Destroyed: ' + aliensDestroyed,
		fromCenter: true
	}).drawText({
		name:"gameOverHighScore",
		layer:true,
		groups:["gameOverPopup"],
		fillStyle: '#FFA500',
		x: popupX, y: popupY+(popupHeight/3.8),
		fontSize: 18,
		fontFamily: 'Arial, sans-serif',
		text: 'High Score: ' + highScore,
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
	allAliensDetails = [];
	solidPlanets = [];
	bullets = [];
	enemyBullets = [];
	powerUps = [];
	activePowerUps = {};
	burstMode = false;
	multiDirectionalGun = false;
	lives = 3;
	shipType = 1;
	popupDisplay = true;
	gamePaused = false;
	mouseX = null;
	targetX = null;
	
	// Clear all layers
	canvasObj.removeLayerGroup("gameOverPopup").drawLayers();
	canvasObj.removeLayerGroup("planets").drawLayers();
	canvasObj.removeLayerGroup("bullets").drawLayers();
	canvasObj.removeLayerGroup("enemyBullets").drawLayers();
	canvasObj.removeLayerGroup("powerups").drawLayers();
	canvasObj.removeLayerGroup("explosion").drawLayers();
	canvasObj.removeLayerGroup("levelUp").drawLayers();
	canvasObj.removeLayerGroup("lifeLost").drawLayers();
	canvasObj.removeLayerGroup("pausePopup").drawLayers();
	
	// Redraw ship at starting position
	drawShip();
	
	// Show intro screen
	introScreenPopup();
}

function _shootBullet(){
	if(!gameRunning) return;
	
	var bulletX = shipOuterDetails.x;
	var bulletY = shipOuterDetails.y - shipOuterDetails.r - 5;
	
	if(burstMode){
		// Burst mode - fire 3 bullets
		for(var i = 0; i < burstCount; i++){
			bullets.push({
				x: bulletX,
				y: bulletY - (i * 15),
				r: 3,
				dx: 0,
				dy: -bulletSpeed
			});
		}
	} else if(multiDirectionalGun){
		// Multi-directional - fire in 5 directions
		var angles = [-30, -15, 0, 15, 30];
		for(var i = 0; i < angles.length; i++){
			var angle = angles[i] * Math.PI / 180;
			bullets.push({
				x: bulletX,
				y: bulletY,
				r: 3,
				dx: Math.sin(angle) * bulletSpeed * 0.5,
				dy: -Math.cos(angle) * bulletSpeed
			});
		}
	} else {
		// Normal single bullet
		bullets.push({
			x: bulletX,
			y: bulletY,
			r: 3,
			dx: 0,
			dy: -bulletSpeed
		});
	}
}

function _updateBullets(){
	canvasObj.removeLayerGroup("bullets").drawLayers();
	
	for(var i = bullets.length - 1; i >= 0; i--){
		bullets[i].x += bullets[i].dx || 0;
		bullets[i].y += bullets[i].dy || -bulletSpeed;
		
		// Remove bullets that are off screen
		if(bullets[i].y < 0 || bullets[i].x < 0 || bullets[i].x > width){
			bullets.splice(i, 1);
			continue;
		}
		
		// Check collision with aliens
		var hitAlien = false;
		for(var j = allPlanetsDetails.length - 1; j >= 0; j--){
			if(_isPlanetOverlap(bullets[i].x, bullets[i].y, bullets[i].r, 
				allPlanetsDetails[j].x, allPlanetsDetails[j].y, allPlanetsDetails[j].r)){
				
				// Don't destroy solid planets
				if(allPlanetsDetails[j].isSolid){
					bullets.splice(i, 1);
					hitAlien = true;
					break;
				}
				
				// Show explosion
				_showExplosion(allPlanetsDetails[j].x, allPlanetsDetails[j].y, allPlanetsDetails[j].r);
				
				// Remove alien from both arrays
				var alienIdx = allAliensDetails.findIndex(function(a){
					return Math.abs(a.x - allPlanetsDetails[j].x) < 1 && Math.abs(a.y - allPlanetsDetails[j].y) < 1;
				});
				if(alienIdx !== -1){
					allAliensDetails.splice(alienIdx, 1);
				}
				
				var solidIdx = solidPlanets.findIndex(function(p){
					return Math.abs(p.x - allPlanetsDetails[j].x) < 1 && Math.abs(p.y - allPlanetsDetails[j].y) < 1;
				});
				if(solidIdx !== -1){
					solidPlanets.splice(solidIdx, 1);
				}
				
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