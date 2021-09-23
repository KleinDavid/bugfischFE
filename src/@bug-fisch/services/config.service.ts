import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ConfigDev } from "../model/config.dev.model";

@Injectable({ providedIn: "root" })
export class ConfigService {
    config: ConfigDev;
    constructor(private httpClient: HttpClient) {

    }

    // public loadConfig(): void {
    //     this.httpClient.get('assets/config.dev.json', { responseType: 'json' })
    //         .subscribe((config: ConfigDev) => {
    //             console.log(config);
    //             this.config = config;
    //         });
    // }

    public async loadConfig(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.httpClient.get('assets/config.dev.json', { responseType: 'json' })
                .subscribe((config: ConfigDev) => {
                    this.config = config;
                    resolve();
                })
        });
    }
}
