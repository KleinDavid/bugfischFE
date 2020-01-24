import { Injectable } from "@angular/core";

@Injectable()
export class DataService {

    data: any[] = []

    constructor() { }

    setData(data: any) {
        this.data.push(data)
    }

    getDataBinding(binding: string): any {
        let name = binding.split('.')[1];
        let data = this.data.find(ob => {

            if (ob.DataPackage) {
                return ob.DataPackage.Name === name
            }
            return false
        });
        return data.DataPackage.Data
    }
}