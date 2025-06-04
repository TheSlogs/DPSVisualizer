import * as fs from 'fs';
import * as path from 'path';

const PROFILE_PATH = path.join(__dirname, 'profiles.json');

interface ProfileData {
  currentTag: string;
  codes: string[];
  directory: string;
}

function readProfileFile(): ProfileData {
  const raw = fs.readFileSync(PROFILE_PATH, 'utf-8');
  return JSON.parse(raw);
}

function writeProfileFile(data: ProfileData){
  fs.writeFileSync(PROFILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

export function getCurrentCode(): string {
  const data = readProfileFile();
  return data.currentTag;
}

export function setCurrentCode(tag: string){
  const data = readProfileFile();
  if (!data.codes.includes(tag)){
    data.codes.push(tag);
  }
  data.currentTag = tag;
  writeProfileFile(data);
}

export function getDirectory(): string {
  const data = readProfileFile();
  return data.directory;
}

export function setDirectory(dir: string){
  const data = readProfileFile();
  data.directory = dir;
  writeProfileFile(data);
}