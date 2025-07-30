import { SlippiGame, Character, Stage, PlayerType, StockType } from "@slippi/slippi-js";
import { getCurrentCode } from "../user/userProfileManager";
import { validateSingles } from "./validator";

export function processGame(file: Buffer): (string | number | boolean | null | undefined)[] | null{
    const code = getCurrentCode();
    const insertValues : (string | number | boolean | null | undefined)[] = [];
    try {
        const game = new SlippiGame(file);
        /** PART 0: VALIDATION */

        if (!validateSingles(game)){return null};
        insertValues.push(game.getFilePath()); // COLUMN 1: FILEPATH

        /** PART .5: INIT CONSTS AND FIND PORT */

        const metadata = game.getMetadata();
        const settings = game.getSettings();
        const stats = game.getStats();
        const players = settings?.players;
        const index = findIndex(code, players);
        const oIndex = 2%index;
        if(!index || index < 0){return null;}

        /** PART 1: SETTINGS */
        
        insertValues.push(settings?.matchInfo?.matchId); // COLUMN 2: MATCHID
        insertValues.push(Stage[settings?.stageId!]); // COLUMN 3: STAGE
        insertValues.push(settings?.isFrozenPS) //COLUMN 4: FROZEN STADIUM
        insertValues.push(settings?.matchInfo?.matchId); //COLUMN 5: MATCH ID

        /** PART 1.5a: PLAYER */

        let player = players?.[index];
        insertValues.push(player?.characterId); // COLUMN 6: CHARACTER
        insertValues.push(player?.characterColor); // COLUMN 7: COLOR
        insertValues.push(player?.rumbleEnabled); // COLUMN 8: RUMBLE
        insertValues.push(player?.nametag); // COLUMN 9: TAG
        

        /** PART 1.5b: OPPONENT */

        player = players?.[oIndex];
        insertValues.push(player?.characterId); // COLUMN 10: OPPONENT CHARACTER
        insertValues.push(player?.characterColor); // COLUMN 11: OPPONENT COLOR
        insertValues.push(player?.rumbleEnabled); // COLUMN 12: OPPONENT RUMBLE
        insertValues.push(player?.nametag); // COLUMN 13: OPPONENT TAG
        insertValues.push(player?.connectCode); // COLUMN 14: OPPONENT CODE
        insertValues.push(player?.userId); // COLUMN 15: OPPONENT USER ID

        /** PART 2: METADATA */
        
        insertValues.push(metadata?.startAt?.replace('T', ' ').slice(0, 19)); // COLUMN 16: TIME AND DATE
        insertValues.push(metadata?.playedOn); // COLUMN 17: PLAYED ON (dolphin, Wii, etc.)

        /** PART 3: STATS */

        insertValues.push(stats?.gameComplete); // COLUMN 18: GAME COMPLETE
        insertValues.push(stats?.lastFrame); // COLUMN 19: LAST FRAME 
        insertValues.push(stats?.playableFrameCount); // COLUMN 20: PLAYABLE FRAMES
        insertValues.push(...stocks(stats?.stocks,index,stats?.lastFrame));

        
        return insertValues;
    }catch(e){
        console.error("Error processing game")
        return null;
    }
}

function findIndex(code:string, players:PlayerType[]|undefined):number{
    let i = 0;
    if(!players){return -1;}
    for(i;i<players?.length;i++){
        if(players[i].connectCode == code){return i;}
    }
    return -1;
}

function stocks(stocks: StockType[] | undefined, index: number, lastFrame: number | undefined): (string | number | boolean | null | undefined)[] {
    const playerArray: (string | number | boolean | null | undefined)[] = [];
    const oppArray: (string | number | boolean | null | undefined)[] = [];
    if(stocks){
        stocks.forEach(stock => {
            if(stock.playerIndex == index){
                playerArray.push(getStockDuration(stock,lastFrame));
                playerArray.push(stock.endPercent);
            }
            
        });
    }
    
    return [...playerArray, ...oppArray];
}

function getStockDuration(stock: StockType, lastFrame: number | undefined):number | null{
    let s = stock.startFrame;
    if(s<0){s=0;}
    if(stock.endFrame){
        return (stock.endFrame-s)/60;
    }
    else if(lastFrame){return (lastFrame-s)/60}
    return null;
}