import { SlippiGame, Character, Stage } from "@slippi/slippi-js";
import { getCurrentCode } from "../user/userProfileManager";
import { validateSingles } from "./validator";

export function processGame(file: Buffer): (string | number | null)[] | null{
    const tag = getCurrentCode();
    const insertValues : (string | number | null)[] = [];
    try {
        const game = new SlippiGame(file);
        /** PART 0: VALIDATION */

        if (!validateSingles(game)){return null};
        insertValues.push(game.getFilePath()); // COLUMN 1: FILEPATH

        /** PART 1: METADATA */
        

        return insertValues;
    }catch(e){
        console.error("Error processing game")
        return null;
    }
    
    return null;
}