"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
class PegelOnlineAPI {
    static fetchStations(includeTimeseries = true, includeCurrentMeasurement = true, filterWater) {
        return __awaiter(this, void 0, void 0, function* () {
            let url = `${this.baseUrl}?includeTimeseries=${includeTimeseries}&includeCurrentMeasurement=${includeCurrentMeasurement}`;
            if (filterWater) {
                url += `&waters=${filterWater}`;
            }
            const response = yield axios_1.default(url, {
                timeout: 60000,
                headers: {
                    "User-Agent": this.userAgent,
                },
            });
            if (response.status === 200) {
                return response.data;
            }
            return false;
        });
    }
}
PegelOnlineAPI.userAgent = "PegelOnline NodeJS API";
PegelOnlineAPI.baseUrl = "https://www.pegelonline.wsv.de/webservices/rest-api/v2/stations.json";
exports.PegelOnlineAPI = PegelOnlineAPI;
//
// PegelOnlineAPI.fetchStations(true, true).then((response) => {
// 	console.log(response);
// });
