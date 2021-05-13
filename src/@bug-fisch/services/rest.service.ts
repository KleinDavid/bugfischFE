import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs';
import { Observable, Subject, throwError as observableThrowError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/empty';
import 'rxjs/add/operator/retry';
import { DataService } from './data.service';
import { Action } from '../model/action.model';
import { ServerResult } from '../model/serverResult.model';
import { Websocket, WebsocketConnectionState, WebsocketService } from './websocket.service';
import { WebsocketMessage } from '../model/websocketMessage.model';

@Injectable()
export class RestService {
    // baseUrl = 'http://davidjugend.pythonanywhere.com/';
    baseUrl = 'http://localhost:8000/'
    // baseUrl = 'http://185.26.156.206:40403/'
    websocketUrl = 'ws://185.26.156.206:40406';
    websocket: Websocket;
    private websocketMessageObservable: Subject<WebsocketMessage>

    constructor(private _http: HttpClient, private dataService: DataService, private websocketService: WebsocketService) {
        this.websocket = this.websocketService.getNewWebsocket('MainConnection');
        this.websocketMessageObservable = this.websocket.getSubjectMessagesReceive();
    }

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

    public async executeAction(action: Action): Promise<ServerResult> {
        action.Token = localStorage.getItem('Token');
        if (this.websocket.connectionState !== WebsocketConnectionState.connected) {
            await this.websocket.connect(this.websocketUrl);
        }
        this.websocket.sendRequest(JSON.stringify({ data: action }));
        return new Promise((resolve, reject) => {
            this.websocketMessageObservable.subscribe(res => {
                resolve(JSON.parse(res.Message));
            });
        });
    }
}
