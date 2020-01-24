import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { ActionService } from 'src/@bug-fisch/services/action.service';

@Component({
  selector: 'app-select-component',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class SelectComponent implements OnInit, AfterViewInit {

  @Input() listDataBinding = ''
  @Input() outputValueBinding = '';
  @Input() showValues = '';
  @Input() text = '';
  @Input() width = '';

  selectedValue = '';
  dataList: any[] = [];

  constructor(private actionService: ActionService) {

  }

  ngOnInit(): void {
    let data = this.actionService.getInputValueByBinding(this.listDataBinding);
    let i = 0
    while (data[i]) {
      this.dataList.push(data[i]);
      i++;
    }
  }

  ngAfterViewInit(): void {
    if (this.width === '')
      return
    (document.getElementsByClassName('mat-form-field-infix')[1] as HTMLElement).style.width = this.width + 'px';
  }

  setInput(input: string): void {

  }

  getDataItemsAsString(data: any, number: number): string {
    return data[this.showValues.split(',')[number - 1].replace(' ', '')] as string;
  }

  onChange(event): void {
    this.actionService.setInputValueByBinding(this.outputValueBinding, '' + event.value)
  }
}
