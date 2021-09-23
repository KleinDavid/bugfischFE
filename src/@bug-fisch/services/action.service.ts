import { Injectable } from '@angular/core';
import { RestService } from './rest.service';
import { DataService } from './data.service';
import { Subject } from 'rxjs';
import { Action } from '../model/action.model';
import { Websocket, WebsocketConnectionState, WebsocketService } from './websocket.service';
import { WebsocketMessage } from '../model/websocketMessage.model';
import { ServerResult } from '../model/serverResult.model';
import { ConfigService } from './config.service';

@Injectable()
export class ActionService {

    routingSubject: Subject<string> = new Subject<string>();
    actionExecutedSubjects: ActionExecutedSubject[] = [];
    actions: Action[] = [];
    websocket: Websocket;

    constructor(private dataService: DataService, private websocketService: WebsocketService, 
        private configService: ConfigService) {
        this.initWebsocket();
    }

    public async executeAction(action: Action) {
        action.Token = localStorage.getItem('Token');
        if (this.websocket.connectionState !== WebsocketConnectionState.connected) {
            await this.websocket.connect(this.configService.config.websocketUrl);
        }
        this.websocket.sendRequest(JSON.stringify({ data: action }));
        // const res = await this._rest.executeAction(action);
        // if (res.Error != '') {
        //     console.error(res.Error)
        //     return
        // }
        // if (this.actionExecutedSubjects.find(actionExecutedSubject => action.Name === actionExecutedSubject.name)) {
        //     this.actionExecutedSubjects.find(actionExecutedSubject => action.Name === actionExecutedSubject.name).actionExecutedSubject.next(true)
        // }
        // let serverActions = res.Actions.filter(action => {
        //     return action.Execute === 'Server'
        // });
        // this.setNewActionsAfterResult(res.ActionIds, serverActions)

        // let clientActions = res.Actions.filter(action => {
        //     return action.Execute === 'Client'
        // });
        // clientActions.forEach(action => {
        //     this.handleAction(action)
        // })
    }

    private initWebsocket(): void {
        this.websocket = this.websocketService.getNewWebsocket('MainConnection');
        this.websocket.getSubjectMessagesReceive().subscribe(serverResult => {
            const res = JSON.parse(serverResult.Message) as ServerResult;
            if (res.Error != '') {
                console.error(res.Error)
                return
            }
            this.actionExecutedSubjects.find(actionExecutedSubject => res.ExecutedActionName === actionExecutedSubject.name)?.actionExecutedSubject.next(true)
            let serverActions = res.Actions.filter(action => {
                return action.Execute === 'Server'
            });
            this.setNewActionsAfterResult(res.ActionIds, serverActions)

            let clientActions = res.Actions.filter(action => {
                return action.Execute === 'Client'
            });
            clientActions.forEach(action => {
                this.handleAction(action)
            })
        });
    }

    private setNewActionsAfterResult(actionIds: string[], serverActions: Action[]) {
        let currentActions: Action[] = []
        currentActions = this.actions.filter(action => {
            return actionIds.includes(action.Id);
        });
        serverActions.forEach(action => {
            let oldAction = currentActions.find(currentAction => (action.Id === currentAction.Id || action.Name === currentAction.Name));;
            if (oldAction) {
                oldAction = action;
            } else {
                this.actionExecutedSubjects.push(new ActionExecutedSubject(action.Name, action.Id));
                currentActions.push(action);
            }
        });
        this.actions = currentActions;
    }

    updateActionInput(name: string, inputName: string, data: string) {
        const action = this.actions.find(a => a.Name === name)
        if (!action) {
            return
        }
        action.Input[inputName] = data;
    }

    getInputValue(actionName: string, inputName: string): string {
        return this.actions.find(a => a.Name === actionName).Input[inputName];
    }

    getInputValueByBinding(binding: string): string {
        let type = binding.split('.')[0];
        if (type === 'Action') {
            return this.getActionBinding(binding);
        }
        return this.dataService.getDataBinding(binding);
    }

    private getActionBinding(binding: string): string {
        let name = binding.split('.')[1];
        let object = this.actions.find(a => a.Name === name).Input;
        for (let counter = 2; counter < binding.split('.').length; counter++) {
            object = object[binding.split('.')[counter]];
        }
        return object
    }

    setInputValueByBinding(binding: string, input: string): void {
        let type = binding.split('.')[0];
        if (type === 'Action') {
            this.setActionBindingValue(binding, input);
        }
    }

    private setActionBindingValue(binding: string, input: string) {
        let name = binding.split('.')[1];
        let object = this.actions.find(a => a.Name === name).Input;
        for (let counter = 2; counter < binding.split('.').length - 1; counter++) {
            if (binding.split('.')[counter].includes('(')) {
                let values = binding.split('.')[counter].replace('(', '').replace(')', '').split('=');
                let counter2 = 0;
                while (object[counter2]) {
                    if (object[counter2][values[0]] + '' === values[1] + '') {
                        object = object[counter2];
                    }
                    counter2++;
                }
            } else {
                object = object[binding.split('.')[counter]];
            }
        }
        object[binding.split('.')[binding.split('.').length - 1]] = JSON.parse(JSON.stringify(input));
    }

    runAction(actionName: string): void {
        const action = this.actions.find(a => a.Name === actionName);
        this.executeAction(action);
    }

    private handleAction(clientAction: Action) {
        console.log(clientAction, 'ooo');
        switch (clientAction.Name) {
            case 'DeleteActionInClientAction':
                break;
            case 'ChangeRouteClientAction':
                this.routingSubject.next(clientAction.Input.ComponentName);
                break;
            case 'SetDataClientAction':
                this.dataService.setData(clientAction.Input);
                break;
            case 'SetTokenClientAction':
                localStorage.setItem('Token', clientAction.Input.Token);
                break;
            case 'ClearDataClientActoin':
                this.dataService.data = [];
                break;
            default:
                break;
        }
    }

    getActionExecutedSubjectByName(name: string) {
        return this.actionExecutedSubjects.find(action => action.name === name)
    }
}

class ActionExecutedSubject {
    name = '';
    id = '';
    actionExecutedSubject: Subject<boolean> = new Subject<boolean>();

    constructor(name: string, id: string) {
        this.name = name
    }
}
