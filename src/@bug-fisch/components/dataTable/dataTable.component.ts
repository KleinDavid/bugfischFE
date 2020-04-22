import { Component, Input, OnInit } from '@angular/core';
import { ActionService } from 'src/@bug-fisch/services/action.service';
import { DataService } from 'src/@bug-fisch/services/data.service';
import { MatTableDataSource } from '@angular/material/table';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-data-table',
  templateUrl: './dataTable.component.html',
  styleUrls: ['./dataTable.component.scss']
})
export class DataTableComponent implements OnInit {

  @Input() listDataBinding = '';
  @Input() columnNames = ['Frage', 'Thema', 'Datum']
  @Input() columnDataBindings = ['Text', 'Category.Thema', 'Category.Datum']
  @Input() columnWidth = ['75', '20', '5']
  @Input() columnsToHideOnXs = ['Datum', 'Thema']

  dataList: any[] = [];
  flatTableDataList: any[] = []
  tableDataSource = new MatTableDataSource<any>(this.flatTableDataList);
  displayedColumns: string[] = [];

  flexMediaWatcher: Subscription;
  currentScreenWidth: string = '';


  constructor(private actionService: ActionService, private dataService: DataService, private mediaObserver: MediaObserver) {
    this.flexMediaWatcher = mediaObserver.media$.subscribe((change: MediaChange) => {
      if (change.mqAlias !== this.currentScreenWidth) {
        this.currentScreenWidth = change.mqAlias;
        this.getDispayedColumns();
      }
    });
  }

  ngOnInit(): void {
    this.dataService.getObservible(this.listDataBinding.split('.')[1]).subscribe(() => {
      this.initTableData();
    })
    this.initTableData();
    this.getDispayedColumns();
  }

  initTableData(): void {
    this.dataList = [];
    let data = this.actionService.getInputValueByBinding(this.listDataBinding);
    let i = 0
    while (data[i]) {
      this.dataList.push(data[i]);
      i++;
    }
    this.createFlatTableDataList();
  }

  createFlatTableDataList(): void {
    this.flatTableDataList = [];
    this.dataList.forEach(dataValue => {
      let newRowValue = {}
      this.columnDataBindings.forEach(binding => {
        let flatValue = dataValue;
        let flatValueName = '';
        binding.split('.').forEach(bindingValue => {
          flatValueName = bindingValue;
          flatValue = flatValue[bindingValue];
        })
        newRowValue[flatValueName] = flatValue;
      })
      this.flatTableDataList.push(newRowValue);
    });
    this.tableDataSource = new MatTableDataSource<any>(this.flatTableDataList);
  }

  getDispayedColumns(): void {
    this.displayedColumns = [];
    this.columnDataBindings.forEach(binding => {
      let columnName = ''
      binding.split('.').forEach(bindingValue => {
        columnName = bindingValue
      });
      if (!(this.currentScreenWidth === 'xs' && this.columnsToHideOnXs.includes(columnName))) {
        this.displayedColumns.push(columnName)
      }
    })
  }

  getHeaderNameByDisplayedColumn(columnName: string): string {
    return this.columnNames[this.displayedColumns.indexOf(columnName)]
  }

  getColumnWidthByDisplayedColumn(columnName: string): string {
    if (this.columnWidth.length == 0) {
      return (100 / this.displayedColumns.length) + '%;';
    } else {
      return this.columnWidth[this.displayedColumns.indexOf(columnName)] + '%;';
    }
  }
}
