import {    activeMapData,
            drawRoomState, updateBossPanel,
            showBalanceWindow,
            showMoveTerrTarget , showMoveWindow,
            showAttackTerrTarget,
            showAllTerrTarget,
            clearAllTerrTarget } from "./ui/clientGameScreen.js";

import { sendtoServer } from "./clientNetwork.js";

export let activeTerritoriesState;
export let activeGameState;
export let myPlayerInfo;
//export let activeTerr;
export let moveInfo = {};

let underPhasa = 1; //1 - источник/sourse, 2 - цель/targed 

export function actionClick() {
    //console.log("Action button clicked");
    sendtoServer("requestAction", {roomID: activeGameState.roomID, playerID: myPlayerInfo.id});
    // Здесь вы можете добавить логику для кнопки "Action"
    // Например, отправить запрос на сервер или изменить состояние игры
}

export function askNextPhase() {
    //console.log("Next button clicked");
    sendtoServer("requestNextPhase", {roomID: activeGameState.roomID, playerID: myPlayerInfo.id});
    // Здесь вы можете добавить логику для кнопки "Next"
    // Например, отправить запрос на сервер или изменить состояние игры

}


export function gotNextPhase(gotNextPhaseInfo){
    console.log("[ FUNC ] gotNextPhase(gotNextPhaseInfo)", gotNextPhaseInfo);
    //let newPhase = gotNextPhaseInfo.gameState.phaseOrder[gotNextPhaseInfo.gameState.activePhase];
    //console.log(newPhase)
    //let activePhaseNumber = activeGameState.gameState.phaseOrder.indexOf(gotNextPhaseInfo.activePhase);
    activeGameState.gameState.activePhase = gotNextPhaseInfo.activePhase;
    if (gotNextPhaseInfo.activePlayer === myPlayerInfo.id) {
        switch (gotNextPhaseInfo.activePhase) {
            case "balance":  {return  updateMoney(gotNextPhaseInfo.balance);}
        }
    }
}





export function updateRoomState(newRoomState) {
    //console.log("[ FUNC ] updateRoomState");
    //console.log(requestData);
    // check if right room
    let activeRoom = JSON.parse(localStorage.getItem("activeRoom"));
    if (activeRoom.id!=( newRoomState.id ?? newRoomState.roomID)) { console.log("[ERROR] Wrong RoomID"); return };
    //console.log(newRoomState);
    activeTerritoriesState = newRoomState.territoriesState;
    activeGameState=newRoomState;
    drawRoomState(newRoomState.territoriesState, newRoomState.playersState);

    myPlayerInfo =  newRoomState.playersState.find(p => p.id === JSON.parse(localStorage.getItem("activePlayer")) );
    updateBossPanel(myPlayerInfo);

}

export function territoryOnClick(terrID) {
    //console.log(activeGameState.gameState.phaseOrder[activeGameState.gameState.activePhase]);
    switch (activeGameState.gameState.activePhase) {
        case "balance":  {return;}                               
        case "move":     {return     terrClick_PhaseMove  (terrID);}
        case "attack":   {return     terrClick_PhaseAttack  (terrID);}
        case "police":   {return;}
        case "hire":     {return     terrClick_PhaseHire  (terrID);}
        default: console.log("[ ERR ] random click, phase");
    };
};





/*
============================================================
=========================  BALANCE  ========================
============================================================
*/

export function updateMoney(gotMoneyInfo){
    console.log("[ FUNC ] updateMoney(gotMoneyInfo)", gotMoneyInfo);
    /*  dataToSend.balance = {
            playerMoney: playerMoney,
            playerMoneyNextMove: playerMoneyNextMove,
            playerTerritories: playerTerritories,
            playerMonopoly: playerMonopoly,
            playerBandits: playerBandits,
            playerGenerals: playerGenerals,
            territoriesPrice: 50,
            monopolyPrice: 100,
            generalsPrice: -40,
            banditsPrice: -20,
        }
    */
    //console.log(myPlayerInfo);
    myPlayerInfo.balance = gotMoneyInfo;
    //console.log(myPlayerInfo);
    updateBossPanel(myPlayerInfo);
    showBalanceWindow(gotMoneyInfo);
}


/*
============================================================
==========================  MOVE  ==========================
============================================================
*/

function terrClick_PhaseMove(terrID){
    let activePhase = activeGameState.gameState.activePhase;
    console.log("Phase Move: ", activePhase, " underPhasa: ",underPhasa);
    switch (underPhasa) {
        case 1:     {return terrClick_PhaseMove_source(terrID);}                               
        case 2:     {return terrClick_PhaseMove_target(terrID);}
        default: console.log("[ERR], phase: ", activePhase, " underPhasa: ",underPhasa);
    };
}

function terrClick_PhaseMove_source(terrID){ 
        //movedBandits[terrID] = usedBand + 1;
        //console.log(movedBandits);

    //const moved = movedBandits.territories.find(item => item.id === terrID);
    const territory = activeTerritoriesState.find(item => item.id === terrID);
        
    if(territory.owner!==myPlayerInfo.id) {return alert("Wrong territory"); }
    moveInfo = {
        fromTerrID: terrID,
        terrOwner: territory.owner
    };

    
    //bandits
    moveInfo.activeBandits = Math.min(territory.activeBandits, territory.bandits - 1);

    //boss
    
    moveInfo.activeBoss=myPlayerInfo.boss.active;
    if (myPlayerInfo.boss.pos!==terrID) {
        moveInfo.activeBoss=false
    };


    //general
    const general = myPlayerInfo.generals.find(g => g.pos === terrID);
    moveInfo.activeGeneral = general?.active === true;


    console.log(moveInfo);
    //if (terrInfo.terrOwner!==myPlayerInfo.id) {alert("Wrong territory ("+terrID+")"); return}
    if ((moveInfo.activeBandits > 0) || (moveInfo.activeGeneral) || (moveInfo.activeBoss)) {
        underPhasa=2;
        showMoveTerrTarget(moveInfo);
    } else {
        console.log(moveInfo.activeBandits)
        alert("Nobody can move");
    }
};

function terrClick_PhaseMove_target(terrID){
    let allNeighborTerrId = activeMapData.territories.find(item => item.id === moveInfo.fromTerrID).neighbors;
    let myNeighborTerr=[];

    allNeighborTerrId.forEach(neighborID => {
        if (activeTerritoriesState.find(item => item.id === neighborID).owner===myPlayerInfo.id){myNeighborTerr.push (neighborID) };
    });
    if (!myNeighborTerr.includes(terrID)) {
        clearAllTerrTarget();
        underPhasa=1;
    } else {
        //console.log(moveInfo)
        moveInfo.toTerrID = terrID;
        //general
        const targetGeneral = myPlayerInfo.generals.find(g => Number(g.pos) === Number(terrID));
        moveInfo.activeGeneral = moveInfo.activeGeneral && !targetGeneral;


        if ((moveInfo.activeBandits > 0) || (moveInfo.activeGeneral) || (moveInfo.activeBoss)) {
            clearAllTerrTarget();
            underPhasa=1;
            showMoveWindow(moveInfo);
        } else {
            alert("Nobody can move on this terrirory____");
        }
        //console.log(moveInfo);
        
        
    }

    
};// конец функции

export function reqMoveFromTo(gotMoveInfo){ // called from GameScreen - modal Window
    /*
    let moveInfo ={
            fromTerrID:
            toTerrID:
            bandits:
            boss : 
            general : 
        }
    */
    console.log(activeGameState);
    moveInfo.roomID = activeGameState.roomID;
    gotMoveInfo.roomID = activeGameState.roomID;
    console.log(gotMoveInfo);
    sendtoServer("requestMove", gotMoveInfo);
    //send on server Info, dass ich etwas verschiebe

}



export function upd_moveBoss(moveInfo) {
    //console.log("upd_moveBoss", moveInfo);
    //console.log("activeGameState", activeGameState);
    activeGameState.playersState.find(player => player.id === moveInfo.playerID).boss = {pos: moveInfo.toTerrID, active:false};
}

export function upd_moveGeneral(moveInfo) {
    //console.log("upd_moveGeneral", moveInfo);

    const player = activeGameState.playersState.find(pl => pl.id === moveInfo.playerID);
    const generalID = player.generals.findIndex(g => Number(g.pos) === Number(moveInfo.fromTerrID));
    player.generals[generalID] = {pos:moveInfo.toTerrID, active:false};
    myPlayerInfo.generals=player.generals;
    console.log(activeGameState)
}

export function upd_moveBandits(moveInfo) {
    //console.log(activeGameState.territoriesState);
    const from = activeGameState.territoriesState.find(t => t.id === moveInfo.fromTerrID);
    from.bandits -= moveInfo.bandits;
    from.activeBandits -= moveInfo.bandits;


    const to = activeGameState.territoriesState.find(t => t.id === moveInfo.toTerrID);
    to.bandits += moveInfo.bandits;

}




/*
============================================================
=========================  ATTACK  =========================
============================================================
*/

function terrClick_PhaseAttack(terrID){
    console.log("terrPhaseAttack");
};

function terrClick_PhaseHire(terrID){
    console.log("terrPhaseHire");
};


