import axios from "axios";

export interface IStation {
	uuid: string;
	number: string;
	shortname: string;
	longname: string;
	km: number;
	agency: string;
	longitude: number;
	latitude: number;
	water: {
		shortname: string;
		longname: string;
	};
	timeseries: [
		{
			"shortname": string,
			"longname": string,
			"unit": string,
			"equidistance": number,
			"currentMeasurement": {
				"timestamp": Date,
				"value": number,
				"trend": number,
				"stateMnwMhw": string,
				"stateNswHsw": string,
			},
			"gaugeZero": {
				"unit": string,
				"value": number,
				"validFrom": Date,
			};
		}
	];
}

export class PegelOnlineAPI {

	private static userAgent = "PegelOnline NodeJS API";
	private static baseUrl = "https://www.pegelonline.wsv.de/webservices/rest-api/v2/stations.json";

	public static async fetchStations(includeTimeseries: boolean = true, includeCurrentMeasurement: boolean = true, filterWater?: string): Promise<IStation[]|false> {

		let url = `${this.baseUrl}?includeTimeseries=${includeTimeseries}&includeCurrentMeasurement=${includeCurrentMeasurement}`;

		if (filterWater) {
			url += `&waters=${filterWater}`;
		}

		const response = await axios(url, {
			timeout: 60000,
			headers: {
				"User-Agent": this.userAgent,
			},
		});

		if (response.status === 200) {
			return response.data;
		}

		return false;
	}

}
//
// PegelOnlineAPI.fetchStations(true, true).then((response) => {
// 	console.log(response);
// });
