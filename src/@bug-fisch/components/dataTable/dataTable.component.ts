import { Component, Input, OnInit } from '@angular/core';
import { ActionService } from 'src/@bug-fisch/services/action.service';
import { DataService } from 'src/@bug-fisch/services/data.service';

@Component({
  selector: 'app-data-table',
  templateUrl: './dataTable.component.html',
  styleUrls: ['./dataTable.component.scss']
})
export class DataTableComponent implements OnInit {

  @Input() listDataBinding = '';
  @Input() showValues = '';
  @Input() text = ''

  selectedValue = '';
  dataList: any[] = [];

  private actionName = '';
  actionInput = '';
  inputValue = '';

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

  getDataItemsAsString(data: any): string {
    let string = ''
    this.showValues.split(',').forEach(value => {
      string += data[value.replace(' ', '')] + ' ';
    });
    return string;
  }
}
