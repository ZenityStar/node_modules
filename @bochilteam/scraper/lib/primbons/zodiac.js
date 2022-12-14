"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getZodiac(months, dates) {
    // https://github.com/Nurutomo/wabot-aq/blob/master/plugins/zodiac.js
    const d = new Date(1970, months - 1, dates + 1);
    // https://www.primbon.com/zodiak.htm
    const zodiac = [
        ["capricorn", new Date(1970, 0, 21)],
        ["aquarius", new Date(1970, 1, 20)],
        ["pisces", new Date(1970, 2, 21)],
        ["aries", new Date(1970, 3, 20)],
        ["taurus", new Date(1970, 4, 21)],
        ["gemini", new Date(1970, 5, 22)],
        ["cancer", new Date(1970, 6, 23)],
        ["leo", new Date(1970, 7, 24)],
        ["virgo", new Date(1970, 8, 23)],
        ["libra", new Date(1970, 9, 24)],
        ["scorpio", new Date(1970, 10, 23)],
        ["sagitarius", new Date(1970, 11, 22)], // SAGITARIUS (23 November - 21 Desember)
    ];
    return zodiac.find(([_, _d]) => _d >= d)[0];
}
exports.default = getZodiac;
