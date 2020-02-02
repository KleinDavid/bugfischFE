import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs';
import { Observable, throwError as observableThrowError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/empty';
import 'rxjs/add/operator/retry';
import { DataService } from './data.service';
import { Action } from '../model/action.model';
import { ServerResult } from '../model/serverResult.model';

@Injectable()
export class RestService {
    // baseUrl = 'http://davidjugend.pythonanywhere.com/';
    baseUrl = 'http://localhost:8000/'
    // baseUrl = 'http://185.26.156.206:40403/'

    constructor(private _http: HttpClient, private dataService: DataService) { }

    public postRequest<T>(path: string, body: any, headers: HttpHeaders = null, params: HttpParams = null): Observable<T> {
        body = { data: body }
        let res = this._http.post<T>(this.baseUrl.concat(path), JSON.stringify(body), { 'headers': headers, 'params': params })
            .pipe(
                timeout(100000),
                catchError((error: any) => {
                    return observableThrowError(error);
                })
            );
        return res;
    }

    protected getRequest<T>(path: string, headers: HttpHeaders = null, params: HttpParams = null): Observable<T> {
        // run get request
        return this._http.get<T>(this.baseUrl.concat(path), { 'headers': headers, 'params': params })
            .pipe(
                timeout(100000),
                catchError((error: any) => {
                    return observableThrowError(error);
                })
            );
    }

    protected deleteRequest<T>(path: string, headers: HttpHeaders = null, params: HttpParams = null): Observable<T> {
        // run delete request
        return this._http.delete<T>(this.baseUrl.concat(path), { 'headers': headers, 'params': params })
            .pipe(
                timeout(100000),
                catchError((error: any) => {
                    return observableThrowError(error);
                })
            );
    }

    protected putRequest<T>(path: string, body: string, headers: HttpHeaders = null, params: HttpParams = null): Observable<T> {
        return this._http.put<T>(this.baseUrl.concat(path), body, { 'headers': headers, 'params': params })
            .pipe(
                timeout(100000),
                catchError((error: any) => {
                    return observableThrowError(error);
                })
            );
    }

    public executeAction(action: Action): Observable<ServerResult> {
        action.Token = localStorage.getItem('Token');
        return this.postRequest<ServerResult>('executeAction/', action)
    }
}
