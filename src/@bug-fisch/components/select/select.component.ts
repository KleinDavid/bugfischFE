import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { ActionService } from 'src/@bug-fisch/services/action.service';

@Component({
  selector: 'app-select-component',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class SelectComponent implements OnInit{

  @Input() listDataBinding = '';
  @Input() outputValueBinding = '';
  @Input() showValues = '';
  @Input() selectAllOptionText = '';
  @Input() selectAllOptionAction = '';
  @Input() onSelectActionBinding = '';
  @Input() text = '';

  selectedValue = '';
  dataList: any[] = [];

  constructor(private actionService: ActionService) {

  }

  ngOnInit(): void {
    if(this.selectAllOptionAction !== ''){
      let object = {}
      object['ID'] = 'all';
      object[this.showValues.split(',')[0]]  = this.selectAllOptionText; 
      this.dataList.push(object)
    }
    let data = this.actionService.getInputValueByBinding(this.listDataBinding);
    let i = 0;
    while (data[i]) {
      this.dataList.push(data[i]);
      i++;
    }
    
  }

  setInput(input: string): void {

  }

  getDataItemsAsString(data: any, number: number): string {
    return data[this.showValues.split(',')[number - 1].replace(' ', '')] as string;
  }

  onChange(event: any): void {
    if(event.value == 'all'){
      this.actionService.runAction(this.selectAllOptionAction);
      this.actionService.setInputValueByBinding(this.outputValueBinding, '');
      return;
    }
    this.actionService.setInputValueByBinding(this.outputValueBinding, '' + event.value);
    if (this.onSelectActionBinding !== '') {
      this.actionService.runAction(this.onSelectActionBinding);
    }
  }
}
