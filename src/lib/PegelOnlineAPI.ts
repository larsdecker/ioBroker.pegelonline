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
}

export class PegelOnlineAPI {

	constructor() {
	}

	public async fetchStations(includeTimeseries: boolean = true, includeCurrentMeasurement: boolean = true, filterWater?: string): Promise<IStation> {

	}

}
