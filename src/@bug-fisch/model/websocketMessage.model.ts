export enum WebsocketResponseType {
    Send = 'Send',
    Receive = 'Receive'
}

export class WebsocketMessage {
    Time: string;
    Message: string;
    Type: WebsocketResponseType;
}
