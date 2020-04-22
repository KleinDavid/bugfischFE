import { Component, Output, EventEmitter, OnInit, Input } from '@angular/core';
import { LayoutDesignerlCreationMode } from '../../layout-designer-objects/Enums';


@Component({
  selector: 'atled-layout-designer-menu-left',
  templateUrl: './menu-left.component.html',
  styleUrls: ['./menu-left.component.scss']
})
export class LayoutDesignerMenuLeftComponent implements OnInit {

  @Input() currentCreationMode: LayoutDesignerlCreationMode = LayoutDesignerlCreationMode.None;
  @Output() onCreationModeChanged: EventEmitter<LayoutDesignerlCreationMode> = new EventEmitter();
  
  constructor() {
  }

  ngOnInit(): void {
    this.onCreationModeChanged.emit(this.currentCreationMode);
  }

  clickMenu(btnNumber: number) {
    this.currentCreationMode = btnNumber;
    this.onCreationModeChanged.emit(this.currentCreationMode)
  }

  checkEditMode(btnNumber: number) {
    return btnNumber === this.currentCreationMode;
  }
}
