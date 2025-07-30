import { GameStartType, MetadataType, SlippiGame, StatsType } from "@slippi/slippi-js"
import { getCurrentCode } from "../user/userProfileManager";

export function validateSingles(game: SlippiGame): boolean {
    const tag = getCurrentCode();
    const metadata = game.getMetadata();
    const settings = game.getSettings();
    const stats = game.getStats();


    return (validMetadata(tag, metadata) && validSettings(tag, settings) && validateStats(tag, stats))
}

function validMetadata(tag: string, metadata: MetadataType | null): boolean{
    if(!metadata){return false;}
    return true;
}

function validSettings(tag: string, settings: GameStartType | null): boolean{
    if(!settings){return false;}
    if(settings.isTeams){return false;}
    return true;
}

function validateStats(tag: string, stats: StatsType | null): boolean {
    if(!stats){return false;}
    return true;
}
