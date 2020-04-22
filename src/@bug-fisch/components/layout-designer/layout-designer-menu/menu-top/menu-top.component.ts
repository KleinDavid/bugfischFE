import { Component, Output, EventEmitter, OnInit, Input } from '@angular/core';
import { LayoutDesignerlCreationMode } from '../../layout-designer-objects/Enums';


@Component({
  selector: 'atled-layout-designer-menu-top',
  templateUrl: './menu-top.component.html',
  styleUrls: ['./menu-top.component.scss']
})
export class LayoutDesignerMenuTopComponent implements OnInit {
  
  @Input() currentCreationMode: LayoutDesignerlCreationMode = LayoutDesignerlCreationMode.None;

  constructor() {
  }

  ngOnInit(): void {
  }

  clickMenu(btnNumber: number) {
  }

  checkEditMode(btnNumber: number) {
    return btnNumber === this.currentCreationMode;
  }
}
