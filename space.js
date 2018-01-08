var canvasId,canvasObj,height,width;
var canvasHeight = 90;
var canvasWidth = 90;
var hardnessLevelSettings = [1,2,3,4];
var currentHardnessLevel = 1;
var minObstacleRadius = 30;
var maxObstacleRadius = 150;
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
		x = _getRandomNumber(1,maxWidth);
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

		// draw planet
		if(!overlapFound){
			canvasObj.drawArc({
				name:uuid(),
				layer: true,
				groups:["planets"],
				strokeStyle: obstacleColour,
				strokeWidth: obstacleBorderWidth,
				fillStyle: color,
				x:x,y:y,
				radius:radius
			});
			allPlanetsDetails.push({
				x:x,
				y:y,
				r:radius
			});
			i++;
		}
	}
}

function _runShip(){
	var intervalId;
	drawObstacles(true);
	intervalId = setInterval(function(){
		if(!allPlanetsDetails.length || currentTopValueFrame >= maxHeightFrame)
			drawObstacles(true);

		canvasObj.removeLayerGroup("planets").drawLayers();
		for(var i=0;i<allPlanetsDetails.length;i++){
			canvasObj.drawArc({
				name:uuid(),
				layer: true,
				groups:["planets"],
				strokeStyle: obstacleColour,
				strokeWidth: obstacleBorderWidth,
				fillStyle: color,
				x:allPlanetsDetails[i].x,y:allPlanetsDetails[i].y+speedDeviation,
				radius:allPlanetsDetails[i].r
			}).drawLayers();
			allPlanetsDetails[i].y += speedDeviation;
			// remove non visible planets.
			if((allPlanetsDetails[i].y-allPlanetsDetails[i].r)>height)
				allPlanetsDetails.splice(i, 1);
		}
		currentTopValueFrame += speedDeviation;
		// detect collision.
		_detectCollision();
		score += speedDeviation;
		if(score){
			var levelLoval = parseInt((score/levelThreshold)+1,10);
			var scoreLocal = parseInt(score/10,10);
			if(levelLoval != level){
				if(maxLevel == levelLoval){
					introScreenPopup("** You Rock !! Max Level Reached !!! **");
					clearInterval(intervalId);
					return false;
				}
				level = levelLoval;
				speedDeviation += 3;
			}
			_scoreBoard(scoreLocal,level);
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
		fillStyle:'rgba(239, 236, 236, .5)',
		strokeStyle:"WHITE",
		x: popupX, y: popupY,
		height:popupHeight,
		width:popupWidth,
		fromCenter:true
	}).drawText({
		name:"introScreenPopupTopText",
		layer:true,
		groups:["introPopup"],
		fillStyle: '#9cf',
		strokeStyle: '#25a',
		strokeWidth: 3,
		x: popupX, y: popupY-(popupHeight/4),
		fontSize: 90,
		fontFamily: 'Verdana, sans-serif',
		text: 'Space Wars',
		fromCenter: true
	}).drawText({
		name:"introScreenPopupText",
		layer:true,
		groups:["introPopup"],
		fillStyle: '#9cf',
		strokeStyle: '#25a',
		strokeWidth: 1,
		x: popupX, y: popupY+(popupHeight/4),
		fontSize: 30,
		fontFamily: 'Verdana, sans-serif',
		text: (belowText == null)?'Press Any Key to Continue...':belowText,
		fromCenter: true
	});
}

function _scoreBoard(scoreText,levelText){
	var popupX = width-width/15;
	var popupY = height-(height/15)*13.8;
	var popupWidth = 10/100*width;
	var popupHeight = 10/100*height;

	canvasObj.removeLayerGroup('scoreBoard').
	drawRect({
		name:"scoreBoardBG",
		layer:true,
		groups:["scoreBoard"],
		fillStyle:'rgb(239, 236, 236)',
		strokeStyle:"WHITE",
		x: popupX, y: popupY,
		height:popupHeight,
		width:popupWidth,
		fromCenter:true
	}).drawText({
		name:"scoreBoardScoreText",
		layer:true,
		groups:["scoreBoard"],
		fillStyle: 'GREEN',
		strokeStyle: 'GREEN',
		strokeWidth: 1,
		x: popupX, y: popupY-(popupHeight/4),
		fontSize: 15,
		fontFamily: 'Verdana, sans-serif',
		text: 'Score:'+(scoreText==null?"":(isNaN(scoreText)?"":scoreText)),
		fromCenter: true
	}).drawText({
		name:"scoreBoardLevelText",
		layer:true,
		groups:["scoreBoard"],
		fillStyle: 'GREEN',
		strokeStyle: 'GREEN',
		strokeWidth: 1,
		x: popupX, y: (popupY-(popupHeight/4))+(((popupY-(popupHeight/4))/4)*3),
		fontSize: 12,
		fontFamily: 'Verdana, sans-serif',
		text: 'Level:'+(levelText==null?"":(isNaN(levelText)?"":levelText)),
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
}

function _prePopupCalls(){
	canvasObj.removeLayerGroup("introPopup").drawLayers();
	_scoreBoard();
	allPlanetsDetails = [];
	canvasObj.removeLayerGroup("planets").drawLayers();
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
			alert("bang");
			canvasObj.drawPolygon({
				fillStyle: '#36c',
				x: 100, y: 100,
				radius: 50,
				sides: 5,
				concavity: 0.5
			});
		}
	}
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