import {askRoomState, askMapData} from "../clientRequestFromServer.js";

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



export async function updateRoomState(RoomState) {
    // Здесь вы можете обновить интерфейс игры на основе состояния комнаты
    //console.log("Updating game interface with room state:", RoomState);

}





export function showGameScreen(){
    console.log("showGameScreen called");
    document.getElementById("gameScreen").style.display = "block";
    document.getElementById("startScreen").style.display = "none";
   // document.getElementById("roomScreen").style.display = "none";
    //document.getElementById("logo_img").style.height = "0%";
    
}


function scalePolygonString(points, scaleFactor) {
    console.log(points, typeof points);
    // Разделяем строку на массив точек
    let scaledPoints = points.split(" ").map(point => {
        // Разделяем точку на координаты X и Y
        let [x, y] = point.split(",").map(Number);
        // Масштабируем каждую координату
        return `${x * scaleFactor},${y * scaleFactor}`;
    });

    // Собираем обратно в строку и возвращаем
    return scaledPoints.join(" ");
}

function scalePolygonPoints(points, scaleFactor) {
    return points.map(([x, y]) => [
        x * scaleFactor,
        y * scaleFactor
    ]);
}

function colorPolygon(terrID,r,g,b,a){
	let terrPolygon=document.getElementById(terrID+'_plg');
	let colorPen="rgba("+r+", "+g+", "+b+", "+a/3+")";
	let colorFill="rgba("+r+", "+g+", "+b+", "+a+")";
	terrPolygon.setAttribute("fill", colorFill); // Прозрачная заливка
	terrPolygon.setAttribute("stroke", colorPen); // Черный контур
	terrPolygon.setAttribute("filter", "url(#blur)"); // Применение фильтра размытия
};





export function createMap(mapData) {
    
    document.getElementById("map-img").src = "img/MapImg/" + mapData.mapImage;
    let mapSize = mapData.mapSize;
    console.log(document.getElementById("map-container").clientHeight);
    console.log(document.getElementById("map-img").clientHeight);
    //console.log(document.getElementById("map-img").style);
    let scaleH = document.getElementById("map-container").clientHeight/mapSize[1];
    let scaleW = document.getElementById("map-container").clientWidth/mapSize[0];
    let scale = Math.max(scaleH, scaleW);
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
			var element = document.getElementById(territory.id+'_plg');
			if (element) {element.parentNode.removeChild(element);}
			
			const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");

			// Устанавливаем атрибуты для полигона
			polygon.setAttribute("id", territory.id + '_plg');
			polygon.setAttribute("points", scalePolygonPoints(territory.border, scale)); // Координаты точек
			polygon.setAttribute("fill", "rgba(0, 0, 0, 0)"); // Прозрачная заливка
			polygon.setAttribute("stroke", "rgba(0, 0, 0, 0)"); // Прозрачный контур
			polygon.setAttribute("stroke-width", "10"); // Толщина контура

			// Добавляем обработчик события клика
			polygon.addEventListener("click", function(e) {
					e.stopPropagation(); // Останавливаем всплытие события
					territoryOnClick(territory.id); // Передаем имя территории в обработчик
			});

			// Добавляем полигон в SVG после завершения обработки
			svg.appendChild(polygon);
			colorPolygon(territory.id, 100, 0, 0, 1);
    });
    let activeRoom = JSON.parse(localStorage.getItem("activeRoom"));
    askRoomState(activeRoom.id);
    showGameScreen()
};


export function territoryOnClick(terrID) {
	//document.querySelector('.dropdown-content').style.display = 'none'; // Скрываем меню, если клик был вне меню
	console.log('function territoryOnClick('+terrID+')')
    colorPolygon(terrID, 0, 0, 100, 1);
	console.log('          GameStatus.Phase: '+GameStatus.Phase)
	//нажатие на территорию имеет смысл лишь в случе атаки или перемещения.
	// причем нажатие может быть двух типов - сначала мы выбираем откуда, а потом цель
	// при вторичном нажатии на "откуда" все просто сбрасывается
	if (PoliceInfo.UnderAttack) {
		let myUnderAttack = PoliceInfo.TerritorysUnderAttack.filter(territory =>  MyPlayer.Territory.includes(territory));
		if (underPhasa === 0){
			if (myUnderAttack.includes(terrID)) {
				policeMove(terrID);
			} else {
				alert('Освободи '+myUnderAttack)
			}
		} else {policeMove(terrID);}
	} else { // if we are not under police attack
		if (GameStatus.Phase === -2){
				choose_base(terrID)
			}
		// при нажатии на территорию в зависимости от фазы соседи начинают гореть красным, если они не принадлежат игроку
		if (PlayersArray[GameStatus.ActivePlayer]===MyPlayer.Name){
			if (GameStatus.Phase === 2){// Атака
				PhaseAttack(terrID)
			} else if (GameStatus.Phase === 1) {//Перемещение
				PhaseMove(terrID);
			} else {console.log('Неизвестная фаза перемещения');};
		};
	}
};




/*
export function updateBossPanel(PlayerInfo){
    // Обновление информации о боссе
    let bossPanel = document.getElementById('BossPanel');
		if (PlayerInfo.MoneyNextMove>0) {nextMoveSign='+'}else {nextMoveSign=''}
		money = PlayerInfo.Money.toString();
		money = money.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
		console.log(money)
		nextMoveMoney=PlayerInfo.NextMove.toString();
		nextMoveMoney=nextMoveMoney.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
		
    bossPanel.innerHTML = `
        <div class="boss-column" id="boss-column-left">
            <div id="boss-name">Имя: ${PlayerInfo.Name}</div>
						<div id="boss-life">Жизни босса: ${PlayerInfo.Life}</div>
						<div id="boss-money">Баланс: ${money} 000 $</div>
						<div id="boss-next">След. ход: ${nextMoveSign} ${nextMoveMoney} 000 $</div>
            
        </div>
        <div class="boss-column" id="boss-column-right">
            <div id="boss-bandits">Бандиты: ${PlayerInfo.Bandits}</div>
            <div id="boss-territory">Территорий: ${PlayerInfo.Territory.length}</div>
            <div id="boss-monopoly">Монополии: ${PlayerInfo.Monopoly}</div>
            <div id="boss-business">Бизнесов: ${PlayerInfo.Businesses}</div>
        </div>
    `;
};    
*/