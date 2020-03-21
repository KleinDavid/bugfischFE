import { Injectable } from "@angular/core";
import { Subject, Observable, Observer, Subscription } from "rxjs";
import { map } from "rxjs/operators";
import { formatDate } from "@angular/common";
import { WebsocketMessage, WebsocketResponseType } from '../model/websocketMessage.model';

export enum WebsocketConnectionState {
    connected,
    notConnected,
    waiting
}

@Injectable({ providedIn: "root" })
export class WebsocketService {
    private websocketList: Websocket[] = [];

    getNewWebsocket(name?: string): Websocket {
        let websocket: Websocket;
        if (name) {
            websocket = new Websocket(name);
        } else {
            websocket = new Websocket();
        }
        this.registerWebsocket(websocket);
        return websocket;
    }

    registerWebsocket(websocket: Websocket): void {
        if (!websocket.id) {
            websocket.id = this.generateWebsocketId();
            this.websocketList.push(websocket);
        }
    }

    destroyWebsocket(id: number): void {
        this.getWebsocketById(id).destroy();
        this.websocketList = this.websocketList.filter(websocket => websocket.id !== id);
    }

    getWebsocketById(id: number): Websocket {
        return this.websocketList.find(websocket => websocket.id === id);
    }

    getWebsocketByName(name: string): Websocket {
        return this.websocketList.find(websocket => websocket.name === name);
    }

    private generateWebsocketId(): number {
        for (let i = 0; i <= this.websocketList.length; i++) {
            if (!this.websocketList.find(websocket => websocket.id === i)) {
                return i;
            }
        }
    }
}

export class Websocket {

    connectionState: WebsocketConnectionState;
    id: number;
    messages: WebsocketMessage[] = [];
    name: string;
    saveMassages: boolean = false;

    private url: string;
    private onMessage: any;

    private subscription = new Subscription();
    private subjectWebsocket: Subject<string>;

    private subjectMessagesSend: Subject<WebsocketMessage>;
    private subjectMessagesReceive: Subject<WebsocketMessage>;
    private subjectMessages: Subject<WebsocketMessage>;

    constructor(name?: string) {
        this.subjectMessages = new Subject<WebsocketMessage>();
        this.subjectMessagesSend = new Subject<WebsocketMessage>();
        this.subjectMessagesReceive = new Subject<WebsocketMessage>();

        if (name) {
            this.name = name;
        }
        this.connectionState = WebsocketConnectionState.notConnected;
    }

    connect(url: string, onMessage?: any): void {
        this.connectionState = WebsocketConnectionState.waiting;

        this.url = url;
        this.onMessage = (e: MessageEvent) => {
            if (onMessage) onMessage(e);
            this.saveMessage(e.data, WebsocketResponseType.Receive);
        };

        this.connectWebsocket();
        this.subscription = this.subjectWebsocket.subscribe();
    }

    sendRequest(messageString: string) {
        if (this.connectionState !== WebsocketConnectionState.connected) {
            return;
        }
        this.saveMessage(messageString, WebsocketResponseType.Send);
        this.subjectWebsocket.next(messageString);
    }

    clearMessages(): void {
        this.messages = [];
    }

    getSubjectMessagesReceive(): Subject<WebsocketMessage> {
        return this.subjectMessagesReceive;
    }

    getSubjectMessagesSend(): Subject<WebsocketMessage> {
        return this.subjectMessagesSend;
    }

    getSubjectMessages(): Subject<WebsocketMessage> {
        return this.subjectMessages;
    }

    destroy(): void {
        this.subscription.unsubscribe();
    }

    private saveMessage(messageString: string, type: WebsocketResponseType): void {
        const message = {
            Message: messageString,
            Type: type,
            Time: this.getTime()
        }

        if (this.saveMassages) {
            this.messages.push(message);
        }

        if (type === WebsocketResponseType.Send) {
            this.subjectMessagesSend.next(message);
        }

        if (type === WebsocketResponseType.Receive) {
            this.subjectMessagesReceive.next(message);
        }

        this.subjectMessages.next(message);
    }

    private getTime(): string {
        return formatDate(new Date(), "h:mm:ss", "en");
    }

    private connectWebsocket(): void {
        this.connectionState = WebsocketConnectionState.waiting;

        if (this.subjectWebsocket) {
            this.subjectWebsocket.complete();
        }

        try {
            this.subjectWebsocket = <Subject<string>>this.create().pipe(
                map(
                    (response: MessageEvent): String => {
                        const data = response.data;
                        return data as string;
                    }
                )
            );
        } catch (e) {
            this.connectionState = WebsocketConnectionState.notConnected;
        }
    }

    private create(): Subject<MessageEvent> {
        const ws = new WebSocket(this.url);
        const observable = Observable.create(
            (obs: Observer<MessageEvent>) => {
                ws.onmessage = this.onMessage;
                ws.onerror = onerror;
                ws.onclose = () => {
                    this.connectionState = WebsocketConnectionState.notConnected;
                    obs.complete.bind(obs);
                };
                ws.onopen = () => {
                    this.connectionState = WebsocketConnectionState.connected;
                };
                return ws.close.bind(ws);
            }
        );

        const observer = {
            next: (data: string) => {
                if (data) { ws.send(data) };
            }
        };
        return Subject.create(observer, observable);
    }
}
