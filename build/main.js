"use strict";
/*
 * Created with @iobroker/create-adapter v1.11.0
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// The adapter-core module gives you access to the core ioBroker functions
// you need to create an adapter
const utils = require("@iobroker/adapter-core");
const PegelOnlineAPI_1 = require("./lib/PegelOnlineAPI");
class Pegelonline extends utils.Adapter {
    constructor(options = {}) {
        super(Object.assign(Object.assign({}, options), { name: "pegelonline" }));
        this.on("ready", this.onReady.bind(this));
        this.on("objectChange", this.onObjectChange.bind(this));
        this.on("stateChange", this.onStateChange.bind(this));
        this.on("message", this.onMessage.bind(this));
        this.on("unload", this.onUnload.bind(this));
    }
    /**
     * Is called when databases are connected and adapter received configuration.
     */
    onReady() {
        return __awaiter(this, void 0, void 0, function* () {
            // // Initialize your adapter here
            //
            // // The adapters config (in the instance object everything under the attribute "native") is accessible via
            // // this.config:
            // this.log.info("config option1: " + this.config.option1);
            // this.log.info("config option2: " + this.config.option2);
            //
            // /*
            // For every state in the system there has to be also an object of type state
            // Here a simple template for a boolean variable named "testVariable"
            // Because every adapter instance uses its own unique namespace variable names can't collide with other adapters variables
            // */
            // await this.setObjectAsync("testVariable", {
            // 	type: "state",
            // 	common: {
            // 		name: "testVariable",
            // 		type: "number",
            // 		role: "indicator",
            // 		read: true,
            // 		write: true,
            // 	},
            // 	native: {},
            // });
            //
            // // in this template all states changes inside the adapters namespace are subscribed
            this.subscribeStates("*");
            //
            // /*
            // setState examples
            // you will notice that each setState will cause the stateChange event to fire (because of above subscribeStates cmd)
            // */
            // // the variable testVariable is set to true as command (ack=false)
            // await this.setStateAsync("testVariable", true);
            //
            // // same thing, but the value is flagged "ack"
            // // ack should be always set to true if the value is received from or acknowledged from the target system
            // await this.setStateAsync("testVariable", { val: true, ack: true });
            //
            // // same thing, but the state is deleted after 30s (getState will return null afterwards)
            // await this.setStateAsync("testVariable", { val: true, ack: true, expire: 30 });
            //
            // // examples for the checkPassword/checkGroup functions
            // let result = await this.checkPasswordAsync("admin", "iobroker");
            // this.log.info("check user admin pw ioboker: " + result);
            //
            // result = await this.checkGroupAsync("admin", "admin");
            // this.log.info("check group user admin group admin: " + result);
            PegelOnlineAPI_1.PegelOnlineAPI.fetchStations(true, true, this.config.river || "Weser").then((response) => {
                if (response !== false) {
                    this.log.info(`Got Response from PegelOnline with ${response.length}`);
                    response.forEach((entry) => __awaiter(this, void 0, void 0, function* () {
                        const basePrefix = `Station.${entry.shortname}`;
                        yield this.setObjectNotExistsAsync(`${basePrefix}.number`, {
                            type: "state",
                            common: {
                                name: `${basePrefix}.number`,
                                type: "number",
                                role: "value",
                            },
                            native: {},
                        });
                        yield this.setState(`${basePrefix}.value`, { val: entry.number, ack: true });
                        yield this.setObjectNotExistsAsync(`${basePrefix}.km`, {
                            type: "state",
                            common: {
                                name: `${basePrefix}.km`,
                                type: "number",
                                role: "value",
                            },
                            native: {},
                        });
                        yield this.setObjectNotExistsAsync(`${basePrefix}.latitude`, {
                            type: "state",
                            common: {
                                name: `${basePrefix}.latitude`,
                                type: "number",
                                role: "value",
                            },
                            native: {},
                        });
                        yield this.setState(`${basePrefix}.latitude`, { val: entry.latitude, ack: true });
                        yield this.setObjectNotExistsAsync(`${basePrefix}.longitude`, {
                            type: "state",
                            common: {
                                name: `${basePrefix}.longitude`,
                                type: "number",
                                role: "value",
                            },
                            native: {},
                        });
                        yield this.setState(`${basePrefix}.longitude`, { val: entry.longitude, ack: true });
                        if (entry.timeseries.length > 0 && entry.timeseries[0]) {
                            yield this.setObjectNotExistsAsync(`${basePrefix}.timeseries.currentMeasurement`, {
                                type: "state",
                                common: {
                                    name: `${basePrefix}.timeseries,currentMeasurement`,
                                    type: "number",
                                    role: "value",
                                },
                                native: {},
                            });
                            yield this.setState(`${basePrefix}.timeseries.currentMeasurement`, { val: entry.timeseries[0].currentMeasurement, ack: true });
                            yield this.setObjectNotExistsAsync(`${basePrefix}.timeseries.unit`, {
                                type: "state",
                                common: {
                                    name: `${basePrefix}.timeseries.unit`,
                                    type: "number",
                                    role: "value",
                                },
                                native: {},
                            });
                            yield this.setState(`${basePrefix}.timeseries.unit`, { val: entry.timeseries[0].unit, ack: true });
                        }
                    }));
                }
            });
        });
    }
    /**
     * Is called when adapter shuts down - callback has to be called under any circumstances!
     */
    onUnload(callback) {
        try {
            this.log.info("cleaned everything up...");
            callback();
        }
        catch (e) {
            callback();
        }
    }
    /**
     * Is called if a subscribed object changes
     */
    onObjectChange(id, obj) {
        if (obj) {
            // The object was changed
            this.log.info(`object ${id} changed: ${JSON.stringify(obj)}`);
        }
        else {
            // The object was deleted
            this.log.info(`object ${id} deleted`);
        }
    }
    /**
     * Is called if a subscribed state changes
     */
    onStateChange(id, state) {
        if (state) {
            // The state was changed
            this.log.info(`state ${id} changed: ${state.val} (ack = ${state.ack})`);
        }
        else {
            // The state was deleted
            this.log.info(`state ${id} deleted`);
        }
    }
    // /**
    //  * Some message was sent to this instance over message box. Used by email, pushover, text2speech, ...
    //  * Using this method requires "common.message" property to be set to true in io-package.json
    //  */
    onMessage(obj) {
        if (typeof obj === "object" && obj.message) {
            if (obj.command === "send") {
                // e.g. send email or pushover or whatever
                this.log.info("send command");
                // Send response in callback if required
                if (obj.callback)
                    this.sendTo(obj.from, obj.command, "Message received", obj.callback);
            }
        }
    }
}
if (module.parent) {
    // Export the constructor in compact mode
    module.exports = (options) => new Pegelonline(options);
}
else {
    // otherwise start the instance directly
    (() => new Pegelonline())();
}
