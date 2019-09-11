import { Injectable, InjectionToken, Inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { cloneDeep, mergeWith, isEmpty, isArray, merge } from 'lodash';

export const TG_CONFIG = new InjectionToken('tgCustomConfig');

@Injectable({
    providedIn: 'root'
})
export class ConfigService {

    private _configSubject: BehaviorSubject<any>;
    private readonly _defaultConfig: any;

    constructor(
        @Inject(TG_CONFIG) private _config
    ) {
        // set the default config from the user provided config (from forRoot)
        this._defaultConfig = this._config;
        this._init();
    }


    set config(value) {
        let config = this._configSubject.getValue();
        config = merge({}, config, value);
        this._configSubject.next(config);
    }

    get config(): any | Observable<any> {
        return this._configSubject.asObservable();
    }

    get defaultConfig(): any {
        return this._defaultConfig;
    }

    private _init(): void {

        let config: any;
        // get config values from localstorage.
        let configInStorage = localStorage.getItem('config');
        // Set the config from the default config
        this._configSubject = new BehaviorSubject(cloneDeep(this._defaultConfig));
        if (configInStorage) {
            configInStorage = JSON.parse(configInStorage);
            // Check Object keys architecture to avoid difference between code version
            if (this.compareConfigKeys(configInStorage)) {
                config = cloneDeep(configInStorage);
                this._configSubject.next(config);
            } else {

                localStorage.setItem('config', JSON.stringify(this._configSubject.getValue()));
            }
        } else {
            localStorage.setItem('config', JSON.stringify(this._configSubject.getValue()));
        }
    }

    private compareConfigKeys(storedConfig: any) {
        // Compare default config with Values in localstorage
        const aKeys = this.getDeepKeys(storedConfig).sort();
        const bKeys = this.getDeepKeys(this._configSubject.getValue()).sort();
        return JSON.stringify(aKeys) === JSON.stringify(bKeys);
    }

    private getDeepKeys(obj) {
        let keys = [];
        for (const key in obj) {
            if (obj.hasOwnProperty(key) && key !== 'shortcuts') {
                keys.push(key);
                if (typeof obj[key] === 'object') {
                    const subkeys = this.getDeepKeys(obj[key]);
                    keys = keys.concat(subkeys.map(function(subkey) {
                        return key + '.' + subkey;
                    }));
                }
            }

        }
        return keys;
    }

    setConfig(value, opts = { emitEvent: true }): void {
        // Get the value from the behavior subject
        let config = this._configSubject.getValue();
        // // Merge the new config
        config = mergeWith(config, value, (obj: any, src) => {
            if (isArray(src) && isEmpty(src)) {
                return src;
            } else if (isArray(src)) {
                return src;
            }
        });

        // If emitEvent option is true...
        if (opts.emitEvent === true) {
            // Notify the observers
            this._configSubject.next(config);
        }


        localStorage.setItem('config', JSON.stringify(config));
    }

    getConfig(): Observable<any> {
        return this._configSubject.asObservable();
    }

    resetToDefaults(): void {
        // Set the config from the default config
        this._configSubject.next(cloneDeep(this._defaultConfig));
    }

}
