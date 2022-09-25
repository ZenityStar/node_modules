"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tebakkatajson = void 0;
const got_1 = __importDefault(require("got"));
async function tebakkata() {
    if (!exports.tebakkatajson) {
        exports.tebakkatajson = await (0, got_1.default)("https://raw.githubusercontent.com/BochilTeam/database/master/games/tebakkata.json").json();
    }
    return exports.tebakkatajson[Math.floor(Math.random() * exports.tebakkatajson.length)];
}
exports.default = tebakkata;
