import {askRoomState, askMapData} from "../clientRequestFromServer.js";
import {territoryOnClick} from "../clientGameLogic.js"
import { activeTerritoriesState, activeGameState } from "../clientGameLogic.js"
import { reqMoveFromTo, askNextPhase, actionClick } from "../clientGameLogic.js"

const markerSize=200;
let scale = 1;
export let activeMapData;


export async function createGameScreen(){
    const gameScreen = document.getElementById("gameScreen");
    if(!gameScreen){
        console.error("gameScreen not found");
        return;
    }
    //gameScreen.style.display = "none";

    gameScreen.innerHTML = `
        <div id="left-container">
            <input type="range" min="1" max="2" step="0.1" value="1" class="vertical-slider" id="zoomRange"> <!-- зум карты -->
            <svg width="100%" height="100%" id="policeLevelSvg"></svg>
            
        </div>
        <div id="right-container"></div>
            
        <div id="map-container">
            <img alt="Map" id="map-img">
            <svg width="100%" height="100%" id="polygonSvg">
                <defs>
                        <filter id="blur" x="-50%" y="-50%" width="300%" height="300%">
                            <feGaussianBlur in="SourceGraphic" stdDeviation="5" />
                        </filter>
                </defs>
            </svg>
        </div>
        
        <div id="right-container"></div>

        <div id="BossPanel">
            <div id="BossPanel_input" > </div>
            
        </div>



        <!-- Контейнер для кнопок -->
        <div id="bottom-container">
            <div id="GameStatus-text" >Ход игрока</div>
            <div id="buttons-container">
                <button id="action-btn" class="bottom-btn">Action</button>
                <button id="next-btn" class="bottom-btn">Next</button>
            </div>
            
        </div>
    `;
    document.getElementById("action-btn").addEventListener("click", actionButtonClick);
    document.getElementById("next-btn").addEventListener("click", nextButtonClick);

    let activeRoom = JSON.parse(localStorage.getItem("activeRoom"));
    let mapData = JSON.parse(localStorage.getItem("mapData_"+activeRoom.map));

    if (mapData) {
        // Connect to the active room
        createMap(mapData);
    } else {
        // Ask for room selection
        askMapData(activeRoom.map);
    }
};

export function actionButtonClick() {
    actionClick();
    //console.log("Action button clicked");
    // Здесь вы можете добавить логику для кнопки "Action"
    // Например, отправить запрос на сервер или изменить состояние игры
}

export function nextButtonClick() {
    askNextPhase();
    //console.log("Next button clicked");
    // Здесь вы можете добавить логику для кнопки "Next"
    // Например, отправить запрос на сервер или изменить состояние игры

}



export function showGameScreen(){
    document.getElementById("gameScreen").style.display = "block";
    document.getElementById("startScreen").style.display = "none";
}

function scalePolygonPoints(points, scaleFactor) {
    return points.map(([x, y]) => [
        x * scaleFactor,
        y * scaleFactor
    ]);
}

function colorPolygon(terrID,r,g,b,a){
	let terrPolygon=document.getElementById('t_'+terrID+'_plg');
	let colorPen="rgba("+r+", "+g+", "+b+", "+a/3+")";
	let colorFill="rgba("+r+", "+g+", "+b+", "+a+")";
	terrPolygon.setAttribute("fill", colorFill); // Прозрачная заливка
	terrPolygon.setAttribute("stroke", colorPen); // Черный контур
	terrPolygon.setAttribute("filter", "url(#blur)"); // Применение фильтра размытия
};

function updateTerritory(territoryId, playerRGBcolor, banditsCount) {
	const object = document.getElementById(`t_${territoryId}_bandit`);
	if (!object) return;

	const elements = object.querySelectorAll("circle, polygon, path");
	if (!elements.length) return;

	const colorFill = `rgba(${playerRGBcolor.r}, ${playerRGBcolor.g}, ${playerRGBcolor.b}, 1)`;
	const brightness = (playerRGBcolor.r * 299 + playerRGBcolor.g * 587 + playerRGBcolor.b * 114) / 1000;
	const contrastColor = brightness < 128 ? "white" : "black";

	elements.forEach(element => {
		element.setAttribute("fill", colorFill);
		element.setAttribute("stroke", "black");
	});

	/*
    if (type === "boss" || type === "general") {
		elements[1].setAttribute("stroke", contrastColor);
	}
    */

	const text = object.querySelector("text");
	if (text) text.setAttribute("fill", contrastColor);
    if (text) text.textContent=banditsCount;
}

function createBanditToken(territoryId, x, y,size) {
	const svg = document.getElementById("polygonSvg");
	const id = `t_${territoryId}_bandit`;

	let element = document.getElementById(id);
	if (element) element.remove();


	const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
	g.setAttribute("id", id);
	g.setAttribute("class", "map-object");
	g.setAttribute("transform", `translate(${x} ${y})`);
	g.setAttribute("pointer-events", "none");

	let shape;
    shape = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    shape.setAttribute("r", size);
	shape.setAttribute("fill", "white");
	shape.setAttribute("stroke", "black");
	shape.setAttribute("stroke-width", "2");
    g.appendChild(shape);

    const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
	label.setAttribute("x", "0");
	label.setAttribute("y", "0");
	label.setAttribute("text-anchor", "middle");
	label.setAttribute("dominant-baseline", "central");
    label.setAttribute("font-size", size*.8);
	label.textContent = "*";
	g.appendChild(label);

	svg.appendChild(g);

	//return g;
}

function createBossToken(playerId, playerRGBcolor,size) {
	const svg = document.getElementById("polygonSvg");
	const id = `p_${playerId}_boss`;

	let element = document.getElementById(id);
	if (element) element.remove();


	const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
	g.setAttribute("id", id);
	g.setAttribute("class", "map-object");
	g.setAttribute("transform", `translate(${500} ${500})`);
	g.setAttribute("pointer-events", "none");

	let shape;
    const hexSize = size *1.3;
    shape = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    const points = [
        [0, -hexSize],
        [hexSize * 0.866, -hexSize * 0.5],
        [hexSize * 0.866, hexSize * 0.5],
        [0, hexSize],
        [-hexSize * 0.866, hexSize * 0.5],
        [-hexSize * 0.866, -hexSize * 0.5]
    ];
    shape.setAttribute("points", points.map(p => p.join(",")).join(" "));
    shape.setAttribute("fill", `rgb(${playerRGBcolor.r}, ${playerRGBcolor.g}, ${playerRGBcolor.b}, 1)`);
    //shape.setAttribute("fill", "white");
    shape.setAttribute("stroke", "black");
    shape.setAttribute("stroke-width", "2");        


    const s = size*.8;
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", "0");
    circle.setAttribute("cy", "0");
    circle.setAttribute("r", s);
    //circle.setAttribute("fill", `rgb(${playerRGBcolor.r}, ${playerRGBcolor.g}, ${playerRGBcolor.b},1)`);
    circle.setAttribute("fill", "white");
    circle.setAttribute("stroke", "black");
    circle.setAttribute("stroke-width", "2");

    
    const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
	label.setAttribute("x", "0");
	label.setAttribute("y", "0");
	label.setAttribute("text-anchor", "middle");
	label.setAttribute("dominant-baseline", "central");
    label.setAttribute("font-size", size);
	label.textContent = "B";


	g.appendChild(shape);
    g.appendChild(circle);
	g.appendChild(label);

	svg.appendChild(g);

	//return g;
}

function createGeneralToken(playerId, playerRGBcolor, size, index) {
    const svg = document.getElementById("polygonSvg");
    const id = `p_${playerId}_general_${index}`;

    let element = document.getElementById(id);
    if (element) element.remove();

    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttribute("id", id);
    g.setAttribute("class", "map-object");
    g.setAttribute("pointer-events", "none");

    const sCircle = size * 1.1;
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("r", sCircle);
    circle.setAttribute("fill", "white");
    circle.setAttribute("stroke", "black");
    circle.setAttribute("stroke-width", "2");

    const hexSize = size * .8;
    const shape = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    const points = [[0,-hexSize],[hexSize*.866,-hexSize*.5],[hexSize*.866,hexSize*.5],[0,hexSize],[-hexSize*.866,hexSize*.5],[-hexSize*.866,-hexSize*.5]];
    shape.setAttribute("points", points.map(p => p.join(",")).join(" "));
    shape.setAttribute("fill", `rgb(${playerRGBcolor.r},${playerRGBcolor.g},${playerRGBcolor.b})`);
    shape.setAttribute("stroke", "black");
    shape.setAttribute("stroke-width", "2");

    const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
    label.setAttribute("text-anchor", "middle");
    label.setAttribute("dominant-baseline", "central");
    label.setAttribute("font-size", size * .8);
    label.textContent = "G";

    g.append(circle, shape, label);
    svg.appendChild(g);

    return g;
}

export function createMap(mapData) {
    activeMapData=mapData;
    
    document.getElementById("map-img").src = "img/MapImg/" + mapData.mapImage;
    let mapSize = mapData.mapSize;
    //console.log(document.getElementById("map-container").clientHeight);
    //console.log(document.getElementById("map-img").clientHeight);
    //console.log(document.getElementById("map-img").style);
    let scaleH = document.getElementById("map-container").clientHeight/mapSize[1];
    let scaleW = document.getElementById("map-container").clientWidth/mapSize[0];
    scale = Math.max(scaleH, scaleW);
    //console.log("[FUNC] createMap scale=",scale);

    const mapWidth = mapSize[0] * scale;
    const mapHeight = mapSize[1] * scale;

    const mapImg = document.getElementById("map-img");
    const polygonSVG = document.getElementById("polygonSvg");

    mapImg.style.width = `${mapWidth}px`;
    mapImg.style.height = `${mapHeight}px`;

    polygonSVG.style.width = `${mapWidth}px`;
    polygonSVG.style.height = `${mapHeight}px`;

    /*mapData.territories: array von
    {"id":11,      "region":1,
    
    "border":[[5775,1007],[3565,990],[3446,421],[3306,51],[5214,51]],
    "neighbors":[12,13,21,25],

    "bandits":[4482,537],  "boss":[3836,430],  "generals":[5061,618]
    }
    */



	//создаем полигон, который и будет отображать территорию на карте
	// Находим SVG внутри map-container
	const svg = document.getElementById("polygonSvg");
	// Проходим по массиву данных и создаем полигоны
	
	mapData.territories.forEach(territory => {
			var element = document.getElementById('t_'+territory.id+'_plg');
			if (element) {element.parentNode.removeChild(element);}
			
			const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");

			// Устанавливаем атрибуты для полигона
			polygon.setAttribute("id", 't_'+territory.id + '_plg');
			polygon.setAttribute("points", scalePolygonPoints(territory.border, scale)); // Координаты точек
			polygon.setAttribute("fill", "rgba(0, 0, 0, 0)"); // Прозрачная заливка
			polygon.setAttribute("stroke", "rgba(0, 0, 0, 0)"); // Прозрачный контур
			polygon.setAttribute("stroke-width", "10"); // Толщина контура

			// Добавляем обработчик события клика
			polygon.addEventListener("click", function(e) {
					e.stopPropagation(); // Останавливаем всплытие события
					polygonClick(territory.id); // Передаем имя территории в обработчик
			});

			// Добавляем полигон в SVG после завершения обработки
			svg.appendChild(polygon);
			//colorPolygon(territory.id, 0, 0, 0, 0);
    });

    //const markerSize=200;

    //create Bandits, Boss and General
    mapData.territories.forEach(territory => {
        var element = document.getElementById('t_'+territory.id+'_bandit');
        if (element) {element.parentNode.removeChild(element);}
        createBanditToken(territory.id, territory.bandits[0]*scale, territory.bandits[1]*scale, markerSize*scale*1.2)
        let startColor={r:100,g:100,b:100};
        updateTerritory(territory.id,startColor,"-");
        //console.log(territory);
    });     

    /*
    mapData.territories.forEach(territory => {
        var element = document.getElementById('t_'+territory.id+'_general');
        if (element) {element.parentNode.removeChild(element);}
        createMapObject("general", territory.id, territory.generals[0]*scale, territory.generals[1]*scale,markerSize*scale);
        document.querySelector("#"+'t_'+territory.id+"_general text").textContent = "G";
        colorMapObject("general", territory.id,100,100,100,1);

    }); 

    mapData.territories.forEach(territory => {
        var element = document.getElementById('t_'+territory.id+'_boss');
        if (element) {element.parentNode.removeChild(element);}
        createMapObject("boss", territory.id, territory.boss[0]*scale, territory.boss[1]*scale, markerSize*scale)
        document.querySelector("#"+'t_'+territory.id+"_boss text").textContent = "B";
        colorMapObject("boss", territory.id,100,100,100,1);
    }); 
    */
    

    let activeRoom = JSON.parse(localStorage.getItem("activeRoom"));
    askRoomState(activeRoom.id);
    showGameScreen()
};

function polygonClick(terrID){ territoryOnClick(terrID);}

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

export function drawRoomState(territoriesState, playersState) {
    // Здесь вы можете обновить интерфейс игры на основе состояния комнаты
    //console.log("Updating game interface with room state:");
    //console.log(RoomState);


    //let playersState = RoomState.playerState;
    //let territoriesState = RoomState.territoriesState;


    let policeColor={r:0,g:0,b:0}
    let noOneColor={r:250,g:250,b:250}
    // update Territories
    territoriesState.forEach(territory => {
        //update Banditcolor and Bandit count
        // // territory.owner: 0=nobody, -1=police 15, -2= police 30
        document.querySelector("#t_" + territory.id + "_bandit").style.display = "";
        if (territory.owner === -1) {     
            updateTerritory(territory.id, policeColor, 15);
        } else if (territory.owner === -2){
            updateTerritory(territory.id, policeColor, 30);
        } else if (territory.owner === 0){
            updateTerritory(territory.id,noOneColor,"-");
            document.querySelector("#t_" + territory.id + "_bandit").style.display = "none";
        }else {
        let ownerColor = hexToRgb(playersState.find(p => p.id === territory.owner).color);
        updateTerritory(territory.id,ownerColor,territory.bandits);
        }
    });

    //console.log(playersState);
    //update BossTocken and General Tocken
    playersState.forEach(player => {
        if (!document.getElementById('p_'+player.id+'_boss')) { createBossToken(player.id, hexToRgb(player.color), markerSize*scale)}
       
        let bossPosition = activeMapData.territories.find(ter => ter.id === player.boss.pos).boss;
        const bossToken = document.getElementById(`p_${player.id}_boss`);
        bossToken.setAttribute("transform",`translate(${bossPosition[0]*scale} ${bossPosition[1]*scale})`);

        //console.log(activeMapData);
        
        player.generals.forEach((general, index) => {
            //console.log ("Player ",player.id," general ",index, "on ",generalPos);
            let generalPos = general.pos;
            const id = `p_${player.id}_general_${index + 1}`;
            let token = document.getElementById(id);
            if (!token) token = createGeneralToken(player.id, hexToRgb(player.color), markerSize*scale, index + 1);
            const position = activeMapData.territories.find(ter => ter.id === generalPos).generals;
            //console.log(position);
            token.setAttribute("transform", `translate(${position[0]*scale} ${position[1]*scale})`);

        });
        
        document.querySelectorAll(`[id^="p_${player.id}_general_"]`).forEach(token => {
            const generalID = Number(token.id.split("_").pop());
            if (generalID > player.generals.length) token.remove();
        });
    });
    
}




export function updateBossPanel(PlayerInfo){
    // Обновление информации о боссе
    /*let playerBandits=0;
    let playerTerritories =0;
    let playerMonopoly=0;

    activeTerritoriesState.forEach(territory => {
        if (territory.owner === PlayerInfo.id) {
            playerTerritories += 1;
            playerBandits += territory.bandits;
        }
    });

    let playerMoneyNextMove = playerTerritories*50 + playerMonopoly*100 - playerBandits*20 - PlayerInfo.generals.length*40
    */
    //console.log(PlayerInfo);
    let nextMoveSign;
    if (PlayerInfo.balance.playerMoneyNextMove>0) {nextMoveSign='+'}else {nextMoveSign=''}
    ///nextMoveSign ="";
    let money = PlayerInfo.balance.playerMoney.toString();
    money = money.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    //console.log(money)
    let nextMoveMoney=PlayerInfo.balance.playerMoneyNextMove.toString();
    nextMoveMoney=nextMoveMoney.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
	
    let bossPanel = document.getElementById('BossPanel');
    bossPanel.innerHTML = `
        <div class="boss-column" id="boss-column-left">
            <div id="boss-name">Имя: ${PlayerInfo.name}</div>
						<div id="boss-life">Жизни босса: ${PlayerInfo.life}</div>
						<div id="boss-money">Баланс: ${money} 000 $</div>
						<div id="boss-next">След. ход: ${nextMoveSign} ${nextMoveMoney} 000 $</div>
            
        </div>
        <div class="boss-column" id="boss-column-right">
            <div id="boss-territory">Территорий: ${PlayerInfo.balance.playerTerritories}</div>
            <div id="boss-monopoly">Монополии: ${PlayerInfo.balance.playerMonopoly}</div>
            <div id="boss-bandits">Бандиты: ${PlayerInfo.balance.playerBandits}</div>
            <div id="boss-bandits">Generals: ${PlayerInfo.balance.playerGenerals}</div>
        </div>
    `;
};    






export function showBalanceWindow(gotMoneyInfo) {
    const overlay = document.createElement("div");
    overlay.id = "balanceOverlay";
    overlay.className = "modal-overlay";

    const modal = document.createElement("div");
    modal.id = "balanceWindow";
    modal.className = "modalWindow balanceWindow";

    const territoryIncome = gotMoneyInfo.playerTerritories * 50;
    const monopolyIncome = gotMoneyInfo.playerMonopoly * 100;
    const banditCost = gotMoneyInfo.playerBandits * 20;
    const generalCost = gotMoneyInfo.playerGenerals * 40;
    const totalChange =
        territoryIncome + monopolyIncome - banditCost - generalCost;

    const formatMoney = amount =>
        `${amount > 0 ? "+" : ""}${amount.toLocaleString("ru-RU")} 000 $`;

    modal.innerHTML = `
        <div class="moveWindowTitle">Баланс за ход</div>

        <div class="balanceRows">
            <div class="balanceRow">
                <span>Доход за территории</span>
                <strong>${formatMoney(territoryIncome)}</strong>
            </div>
            <div class="balanceRow">
                <span>Доход за монополии</span>
                <strong>${formatMoney(monopolyIncome)}</strong>
            </div>
            <div class="balanceRow">
                <span>Расходы на бандитов</span>
                <strong>${formatMoney(-banditCost)}</strong>
            </div>
            <div class="balanceRow">
                <span>Расходы на генералов</span>
                <strong>${formatMoney(-generalCost)}</strong>
            </div>

            <div class="balanceRow balanceTotal">
                <span>Изменение баланса</span>
                <strong>${formatMoney(totalChange)}</strong>
            </div>
            <div class="balanceRow balanceCurrent">
                <span>Баланс сейчас</span>
                <strong>${formatMoney(gotMoneyInfo.playerMoney)}</strong>
            </div>
        </div>

        <button type="button" id="balanceOkButton">Понятно</button>
    `;

    const closeWindow = () => {
        overlay.remove();
        modal.remove();
    };

    overlay.addEventListener("click", closeWindow);
    modal.addEventListener("click", event => event.stopPropagation());
    modal.querySelector("#balanceOkButton").addEventListener("click", closeWindow);

    document.body.append(overlay, modal);
}


/*
============================================================
==========================  MOVE  ==========================
============================================================
*/

export function showMoveTerrTarget(gotMoveInfo){
    //console.log (gotMoveInfo);
    let allNeighborTerrId = activeMapData.territories.find(item => item.id === gotMoveInfo.fromTerrID).neighbors;
    let myNeighborTerr=[];

    allNeighborTerrId.forEach(neighborID => {
        if (activeTerritoriesState.find(item => item.id === neighborID).owner===gotMoveInfo.terrOwner){myNeighborTerr.push (neighborID) };
    });

    let myColor = hexToRgb(activeGameState.playersState.find(item => item.id === gotMoveInfo.terrOwner).color);
    myNeighborTerr.forEach(neighborID => {
        colorPolygon(neighborID,myColor.r,myColor.g,myColor.b,0.5)        
    });


};


export function showMoveWindow(gotMoveInfo) {
    const overlay = document.createElement("div");
    overlay.id = "moveOverlay";
    overlay.addEventListener("click", () => {
        overlay.remove();
        document.getElementById("moveWindow")?.remove();
    });

    const modal = document.createElement("div");
    modal.id = "moveWindow";
    modal.className = "modalWindow";

    modal.innerHTML = `
        <div class="moveWindowTitle">${gotMoveInfo.fromTerrID} → ${gotMoveInfo.toTerrID}</div>
        <div class="moveOptions">
            <label><input type="checkbox" id="moveBoss" ${!gotMoveInfo.activeBoss ? "disabled" : ""}> Boss</label>
            <label><input type="checkbox" id="moveGeneral" ${!gotMoveInfo.activeGeneral ? "disabled" : ""}> General</label>
        </div>
        <div class="moveBandits">Бандиты: <span id="moveBanditsValue">0</span><input type="range" id="moveBandits" min="0" max="${gotMoveInfo.activeBandits}" value="0"></div>
        <button id="moveButton">Передвинуть</button>
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(modal);

    const banditsSlider = document.getElementById("moveBandits");
    const banditsValue = document.getElementById("moveBanditsValue");

    banditsSlider.addEventListener("input", () => {
        banditsValue.textContent = banditsSlider.value;
    });

    document.getElementById("moveButton").addEventListener("click", () => {
        let movement ={
            fromTerrID:gotMoveInfo.fromTerrID,
            toTerrID:gotMoveInfo.toTerrID,
            bandits:Number(document.getElementById("moveBandits").value),
            boss : document.getElementById("moveBoss").checked,
            general : document.getElementById("moveGeneral").checked,
        }

        reqMoveFromTo(movement);

        overlay.remove();
        document.getElementById("moveWindow")?.remove();
    });
}


export function animation_moveBoss(input){
       
    let bossPosition = activeMapData.territories.find(ter => ter.id === input.toTerrID).boss;
    const bossToken = document.getElementById(`p_${input.playerID}_boss`);
    bossToken.setAttribute("transform",`translate(${bossPosition[0]*scale} ${bossPosition[1]*scale})`);

}

export function animation_moveGeneral(input) {
    console.log("[ FUNC ] animation_moveGeneral(input)", input);
    const player = activeGameState.playersState.find(pl => pl.id === input.playerID); //activeGameState.playersState is already updatet
    const generalID = player.generals.findIndex(g => Number(g.pos) === Number(input.toTerrID));
    const newGeneralPosition = activeMapData.territories.find(ter => ter.id === input.toTerrID).generals;
    const generalToken = document.getElementById(`p_${input.playerID}_general_${generalID + 1}`);

    if (generalID === -1 || !generalToken || !newGeneralPosition) return;

    generalToken.setAttribute("transform", `translate(${newGeneralPosition[0] * scale} ${newGeneralPosition[1] * scale})`);
}

export function animation_moveBandits(input) {
    const from = activeGameState.territoriesState.find(t => t.id === input.fromTerrID);
    const to = activeGameState.territoriesState.find(t => t.id === input.toTerrID);
    const player = activeGameState.playersState.find(p => p.id === input.playerID);

    //from.bandits -= input.bandits;
    //from.activeBandits -= input.bandits;

    const fromObject = document.getElementById(`t_${input.fromTerrID}_bandit`);
    const toObject = document.getElementById(`t_${input.toTerrID}_bandit`);
    const fromText = fromObject?.querySelector("text");

    if (fromText) fromText.textContent = from.bandits;
    if (!fromObject || !toObject) return;

    const svg = fromObject.ownerSVGElement;
    const fromBox = fromObject.getBBox();
    const toBox = toObject.getBBox();

    const fromPoint = svg.createSVGPoint();
    fromPoint.x = fromBox.x + fromBox.width / 2;
    fromPoint.y = fromBox.y + fromBox.height / 2;

    const toPoint = svg.createSVGPoint();
    toPoint.x = toBox.x + toBox.width / 2;
    toPoint.y = toBox.y + toBox.height / 2;

    const start = fromPoint.matrixTransform(fromObject.getCTM());
    const end = toPoint.matrixTransform(toObject.getCTM());

    const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");

    let playerRGBcolor =hexToRgb(player.color)
    const brightness = (playerRGBcolor.r * 299 + playerRGBcolor.g * 587 + playerRGBcolor.b * 114) / 1000;
    const contrastColor = brightness < 128 ? "white" : "black";


    circle.setAttribute("cx", "0");
    circle.setAttribute("cy", "0");
    circle.setAttribute("r", "12");
    circle.setAttribute("fill", player.color);
    circle.setAttribute("stroke", "black");
    circle.setAttribute("stroke-width", "2");

    text.setAttribute("x", "0");
    text.setAttribute("y", "0");
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("dominant-baseline", "central");
    text.setAttribute("fill", contrastColor);
    text.setAttribute("font-size", "12");
    text.setAttribute("font-weight", "bold");
    text.textContent = input.bandits;

    group.append(circle, text);
    svg.appendChild(group);

    group.setAttribute("transform", `translate(${start.x} ${start.y})`);
    group.style.transition = "transform 1s ease-in-out";

    requestAnimationFrame(() => {
        group.setAttribute("transform", `translate(${end.x} ${end.y})`);
    });

    setTimeout(() => {
        group.remove();
        const toText = toObject.querySelector("text");
        if (toText) toText.textContent = to.bandits;
    }, 1000);
}







/*
============================================================
=========================  ATTACK  =========================
============================================================
*/


export function showAttackTerrTarget(terrInfo){
    let allNeighborTerrId = activeMapData.territories.find(item => item.id === terrInfo.id).neighbors;
    let myNeighborTerr=[];

    allNeighborTerrId.forEach(neighborID => {
        if (activeTerritoriesState.find(item => item.id === neighborID).owner!==terrInfo.terrOwner){myNeighborTerr.push (neighborID) };
    });

    //console.log(activeMapData);

    myNeighborTerr.forEach(neighborID => {
        let enemyID = activeTerritoriesState.find(item => item.id === neighborID).owner;
        console.log("Terr ",neighborID," Owner: ",enemyID);
        let enemyColor;
        if (enemyID>0){
            enemyColor = hexToRgb(activeGameState.playerState.find(item => item.id === enemyID).color);
            enemyColor.a = 0.8;
        } else if(enemyID<0) {enemyColor= {r:0,g:0,b:0,a:0.8}
        } else {enemyColor= hexToRgb(activeGameState.playerState.find(item => item.id === terrInfo.terrOwner).color);}
        
        colorPolygon(neighborID,enemyColor.r,enemyColor.g,enemyColor.b,1);       
    });
    return true;

};












export function showAllTerrTarget(terrInfo){
    let allNeighborTerrId = activeMapData.territories.find(item => item.id === terrInfo.id).neighbors;
    allNeighborTerrId.forEach(neighborID => {colorPolygon(neighborID,0,0,0,0.5); });


};

export function clearAllTerrTarget(){
    activeMapData.territories.forEach(terr => {
        colorPolygon(terr.id,0,0,0,0);
    });
}

