import { Injectable } from "@angular/core";
import { Subject, Observable } from 'rxjs';

@Injectable()
export class DataService {

    data: any[] = [];
    subjectsWithDataPackageName: SubjectWithDataPackageName[] = [];

    constructor() { }

    setData(data: any) {
        console.log(data)
        let dataPackage = this.data.find(ob => {
            if (ob.DataPackage) {
                return ob.DataPackage.Name === data.DataPackage.Name;
            }
            return false;
        });
        if (dataPackage) {
            console.log('erst', dataPackage);
            dataPackage.DataPackage.Data = data.DataPackage.Data;
            
            console.log('dann', dataPackage);
        } else {
            this.data.push(data);
        }

        console.log(this.data);

        let subjectWithDataPackageName = this.subjectsWithDataPackageName.find(ob => {
            return ob.dataPackageName == data.DataPackage.Name;
        });
        if (subjectWithDataPackageName) {
            subjectWithDataPackageName.obersvable.next();
        } else {
            this.subjectsWithDataPackageName.push(new SubjectWithDataPackageName(data.DataPackage.Name));
        }
    }

    getDataBinding(binding: string): any {
        let name = binding.split('.')[1];
        let data = this.data.find(ob => {
            if (ob.DataPackage) {
                return ob.DataPackage.Name === name;
            }
            return false;
        });
        if (!data) {
            return '';
        }
        return data.DataPackage.Data;
    }

    getObservible(name: string): Observable<any> {
        let subjectWithDataPackageName = this.subjectsWithDataPackageName.find(ob => {
            return ob.dataPackageName == name;
        });
        if (subjectWithDataPackageName) {
            return subjectWithDataPackageName.obersvable.asObservable();
        } else {
            subjectWithDataPackageName = new SubjectWithDataPackageName(name);
            this.subjectsWithDataPackageName.push(subjectWithDataPackageName);
            return subjectWithDataPackageName.obersvable.asObservable();
        }
    }
}

class SubjectWithDataPackageName {
    obersvable: Subject<any>;
    dataPackageName: string;

    constructor(name: string) {
        this.dataPackageName = name;
        this.obersvable = new Subject<any>();
    }
}