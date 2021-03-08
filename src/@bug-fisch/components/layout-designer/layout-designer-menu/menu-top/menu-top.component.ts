import { Component, Output, EventEmitter, OnInit, Input } from '@angular/core';
import { LayoutDesignerlCreationMode } from '../../layout-designer-objects/Enums';
import { CssClass } from '../../layout-designer-objects/CssClass';
import { CSSGlobalDialog } from '../../dialogs/css-global-dialog/css-global-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { TransformableObject } from '../../layout-designer-objects/RenderableObjects/TransformableObject';
import { IdCard } from '../../layout-designer-objects/RenderableObjects/IdCard';
import { BindingDialog } from '../../dialogs/binding-dialog/binding-dialog.component';
import { DesignerCssClassManager } from '../../managers/designerCssClassManager';
import { HTMLDialog } from '../../dialogs/html-dialog/html-dialog.component';


@Component({
  selector: 'atled-layout-designer-menu-top',
  templateUrl: './menu-top.component.html',
  styleUrls: ['./menu-top.component.scss']
})
export class LayoutDesignerMenuTopComponent implements OnInit {

  @Input() cardDirection = 0;
  @Input() visible: boolean = true;
  @Input() currentCreationMode: LayoutDesignerlCreationMode = LayoutDesignerlCreationMode.None;
  @Input() transformableObjects: TransformableObject[] = [];
  @Input() idCard: IdCard = new IdCard('');
  @Input() selectedObject: TransformableObject;
  @Input() defaultTextField: TransformableObject;

  @Output() cardDirectionChange: EventEmitter<LayoutDesignerlCreationMode> = new EventEmitter();
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter();
  @Output() disableLayoutDesinger: EventEmitter<boolean> = new EventEmitter();

  styleSheet: HTMLStyleElement;
  fontFileName: string;
  fonts: string[] = [''];

  private cssClassManager: DesignerCssClassManager = DesignerCssClassManager.getInstance();

  constructor(private dialogRef: MatDialog, ) {
  }

  ngOnInit(): void {
  }

  clickMenu(btnNumber: number) {
    // this.onChange.emit();
  }
  handleFontFileInput(e: any) {
    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    var pattern = /.ttf/;
    var reader = new FileReader();
    if (!file.name.match(pattern)) {
      alert('invalid format');
      return;
    }
    this.fontFileName = file.name.split('.')[0];
    reader.onload = this.handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }

  private handleReaderLoaded(e: any): void {
    let reader = e.target;
    this.styleSheet = document.createElement('style');
    this.styleSheet.type = 'text/css';
    this.styleSheet.innerHTML = '@font-face {font-family: "' + this.fontFileName + '";src: url(' + reader.result + ') format("truetype");}';
    let documentHead = document.getElementsByTagName('head')[0];
    documentHead.insertBefore(this.styleSheet, documentHead.firstChild);
    this.onFontFamilyChange(this.fontFileName);
    this.fonts.push(this.fontFileName);
  }

  // template functions
  setCardDirection(val: number): void {
    val !== this.cardDirection ? this.cardDirectionChange.emit() : '';
    this.cardDirection = val;
  }

  setVisible(): void {
    this.visible = !this.visible;
    this.visibleChange.emit(this.visible);
  }

  openCssDialog(): void {
    this.disableLayoutDesinger.emit(true);
    const dialogRef = this.dialogRef.open(CSSGlobalDialog, {
      panelClass: 'global-classes-dialog',
      autoFocus: false,
      data: { }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.cssClassManager.updateClasses();
      this.disableLayoutDesinger.emit(false);
      this.transformableObjects.forEach(t => { t.updateClasses() })
    });
  }

  openHtmlDialog(): void {
    const dialogRef = this.dialogRef.open(HTMLDialog, {
      panelClass: 'full-width-dialog',
      autoFocus: false,
      data: { idCard: this.idCard, transformableObjects: this.transformableObjects }
    });

    dialogRef.afterClosed().subscribe(() => {
    });
  }

  onTextStyleButtonClick(valueName: string, valueActiv: string, valueAlternativ: string): void {
    if (this.selectedObject?.type === 'TextField') {
      this.selectedObject.getCssValue(valueName).value === valueActiv ?
        this.selectedObject.setCssValue(valueName, valueAlternativ) :
        this.selectedObject.setCssValue(valueName, valueActiv);
    } else {
      (this.defaultTextField.getCssValue(valueName).value === valueActiv) ?
        this.defaultTextField.setCssValue(valueName, valueAlternativ) :
        this.defaultTextField.setCssValue(valueName, valueActiv);
    }
  }

  onAlignButtonClick(align: string): void {
    if (this.selectedObject?.type === 'TextField') {
      this.selectedObject.setCssValue('text-align', align);
    } else {
      this.defaultTextField.setCssValue('text-align', align);
    }
  }

  onFontFamilyChange(fontName: string): void {
    if (this.selectedObject?.type === 'TextField') {
      this.selectedObject.setCssValue('font-family', fontName);
      this.selectedObject.render();
    } else {
      this.defaultTextField.setCssValue('font-family', fontName);;
    }
  }

  isCssValueSet(valueName: string, value: string): boolean {
    if (this.selectedObject?.type === 'TextField') {
      return this.selectedObject.getCssValue(valueName).value === value;
    } else {
      return this.defaultTextField.getCssValue(valueName).value === value;
    }
  }

  getSelectedFont(): string {
    if (this.selectedObject?.type === 'TextField') {
      return this.selectedObject.getCssValue('font-family').value;
    } else {
      return this.defaultTextField.getCssValue('font-family').value;
    }
  }

  onUploadFontClick(): void {
    document.getElementById('fontUploader').click();
  }

  openBindingDialog() {
    this.disableLayoutDesinger.emit(true);
    const dialogRef = this.dialogRef.open(BindingDialog, {
      panelClass: 'binding-dialog',
      autoFocus: false,
      data: { filterValue: '' }
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      this.transformableObjects.filter(o => o.type === 'TextField').forEach(o => {
        this.cssClassManager.updateClasses();
        o.unselect();
      });
      this.disableLayoutDesinger.emit(false);
    });
  }
}
