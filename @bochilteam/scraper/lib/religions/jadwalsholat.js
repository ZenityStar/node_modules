"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listJadwalSholat = void 0;
const cheerio_1 = __importDefault(require("cheerio"));
const fs_1 = require("fs");
const got_1 = __importDefault(require("got"));
const path_1 = require("path");
const utils_1 = require("../utils");
exports.listJadwalSholat = JSON.parse((0, fs_1.readFileSync)((0, path_1.join)(__dirname, "../../data/jadwal-sholat.json"), "utf-8"));
async function jadwalsholat(kota) {
    let jadwal;
    if (!(jadwal = exports.listJadwalSholat.find(({ kota: Kota }) => new RegExp(Kota, "ig").test(kota))))
        throw new utils_1.ScraperError("List kota " + exports.listJadwalSholat.map(({ kota }) => kota));
    const today = await (0, got_1.default)(`https://www.jadwalsholat.org/adzan/ajax/ajax.daily1.php?id=${jadwal.value}`).text();
    let sholatToday = {};
    const $ = cheerio_1.default.load(today);
    $("table > tbody > tr")
        .filter(".table_light, .table_dark")
        .each(function () {
        const el = $(this).find("td");
        const sholat = el.eq(0).text();
        const time = el.eq(1).text();
        sholatToday[sholat] = time;
    });
    const data = await (0, got_1.default)(`https://jadwalsholat.org/jadwal-sholat/monthly.php?id=${jadwal.value}`).text();
    const list = [];
    const $$ = cheerio_1.default.load(data);
    $$("table.table_adzan > tbody > tr")
        .filter(".table_light, .table_dark")
        .each(function () {
        const el = $$(this).find("td");
        const date = el.eq(0).text().trim();
        const imsyak = el.eq(1).text().trim();
        const shubuh = el.eq(2).text().trim();
        const terbit = el.eq(3).text().trim();
        const dhuha = el.eq(4).text().trim();
        const dzuhur = el.eq(5).text().trim();
        const ashr = el.eq(6).text().trim();
        const magrib = el.eq(7).text().trim();
        const isyak = el.eq(8).text().trim();
        list.push({
            date,
            imsyak,
            shubuh,
            terbit,
            dhuha,
            dzuhur,
            ashr,
            magrib,
            isyak,
        });
    });
    return {
        date: $$("tr.table_title > td > h2.h2_edit").text().trim(),
        today: sholatToday,
        list,
    };
}
exports.default = jadwalsholat;
