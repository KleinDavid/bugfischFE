import { Injectable } from '@angular/core';
import { RestService } from './rest.service';
import { DataService } from './data.service';
import { Subject } from 'rxjs';
import { Action } from '../model/action.model';
import { Server } from 'http';
import { ServerResult } from '../model/serverResult.model';
import { Websocket, WebsocketService } from './websocket.service';

@Injectable()
export class ActionService {

    routingSubject: Subject<string> = new Subject<string>();
    actions: Action[] = [];
    websocket: Websocket;

    constructor(private _rest: RestService, private dataService: DataService, private websocketService: WebsocketService) {
        this.websocket = this.websocketService.getNewWebsocket()
    }

    public executeAction(action: Action) {
        this._rest.executeAction(action).subscribe(res => {

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

    private setNewActionsAfterResult(actionIds: string[], serverActions: Action[]){
        let currentActions: Action[] = []
        currentActions = this.actions.filter(action => {
            return actionIds.includes(action.Id);
        });
        serverActions.forEach(action => {
            let oldAction = currentActions.find(currentAction => (action.Id === currentAction.Id));
            if (oldAction) {
                oldAction = action;
            } else {
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
        let object = this.actions.find(a => a.Name === name).Input
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
        let object = this.actions.find(a => a.Name === name).Input
        for (let counter = 2; counter < binding.split('.').length - 1; counter++) {
            object = object[binding.split('.')[counter]];
        }
        object[binding.split('.')[binding.split('.').length - 1]] = input;
    }

    runAction(actionName: string): void {
        const action = this.actions.find(a => a.Name === actionName);
        this.executeAction(action);
    }

    private handleAction(clientAction: Action) {
        switch (clientAction.Type) {
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
            case 'InitializeWebsocketClientAction':
                this.websocket.connect(clientAction.Input.Path);
                this.websocket.sendRequest(localStorage.getItem('Token'));
                break;
            default:
                break;
        }
    }

}
