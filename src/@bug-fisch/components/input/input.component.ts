import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { ActionService } from 'src/@bug-fisch/services/action.service';
import { DataService } from 'src/@bug-fisch/services/data.service';

@Component({
  selector: 'app-input-component',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent implements OnInit {

  @Input() actionInputBinding = '';
  @Input() text = '';
  @Input() type = '';
  @Input() width = ''
  @Input() textbox = false;

  private actionName = '';
  actionInput = '';
  inputValue = '';

  constructor(private actionService: ActionService, private dataService: DataService) {

  }
 

  ngOnInit(): void {
    this.inputValue = this.actionService.getInputValueByBinding(this.actionInputBinding) 
  }

  setInput(input: string): void {
    this.inputValue = input;
    this.actionService.setInputValueByBinding(this.actionInputBinding, input);
  }
}
