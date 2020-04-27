import { Component, Inject, OnInit, ViewEncapsulation, AfterViewChecked, ViewChild, OnDestroy } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import * as xmlFormatter from 'xml-formatter';

@Component({
    selector: 'workflow-html-dialog.component',
    templateUrl: 'html-dialog.component.html',
    styleUrls: ['html-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class HTMLDialog implements OnInit, AfterViewChecked, OnDestroy {

    @ViewChild('tabGroup', { static: false }) tabGroup;
    modeler: any;
    modelerLoaded = false;
    xmlContent: String = '';
    xmlContentDiagram: String = '';
    xmlContentEditor: String = '';
    xmlFormatter = xmlFormatter;
    xmlLineNumbers: number[] = [];

    // edit or upload
    workState: String = '';

    /** constructor
     * @param _fuseTranslationLoaderService 
     * @param dialogRef 
     * @param _rest 
     * @param notificationService 
     * @param data 
     */
    constructor(
        public dialogRef: MatDialogRef<HTMLDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
    }

    ngOnInit(): void {
        this.xmlContent = JSON.parse(JSON.stringify(this.data.content));
        // this.workState = this.data.state;
        this.xmlContent = 
        '<html lang="de"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>Print-Layout | FDG-DUS | FDG-Dienst</title><style>.simple-image-box {overflow: hidden;width: 100%;height: 100%;  position: relative;}.simple-image {position: absolute;max-width: 100%;max-height: 100%;top: 0;bottom: 0;left: 0;right: 0;margin: auto;-webkit-user-select: none;-khtml-user-select: none;-moz-user-select: none;-o-user-select: none;user-select: none;}:host {display: block;left: 0;width: 100%;height: 100%;}</style></head><body>' + this.xmlContent + '</body></html>'
        // this.formatXml();
        this.updateXmlLineNumbers();
    }

    ngAfterViewChecked(): void {
        this.initModeler();
    }

    initModeler(): void {
        
    }

    handleError(err: any): any {
        if (err) {
            console.warn('Ups, error: ', err);
        }
    }

    loadBpmn(): void {
        this.modeler.importXML(this.xmlContent, this.handleError);
    }

    save(): void {
        const tab = this.tabGroup.selectedIndex;
        if (tab === 1) {
            try {
                this.loadBpmn();
            } catch (e) {
                console.log('save error');
            }
        } else if (tab === 0) {
            this.updateXmlLineNumbers();
            this.getXmlDiagram();
        }
        this.dialogRef.close({ data: { xmlContent: this.xmlContent } });

    }

    updateXmlContent(): void {
        const tab = this.tabGroup.selectedIndex;
        if (tab === 0) {
            this.loadBpmn();
        } else if (tab === 1) {
            this.updateXmlLineNumbers();
            this.getXmlDiagram();
        }
    }

    getXmlDiagram(): void {
        this.modeler.saveXML((err: any, xml: any) => {
            if (this.xmlContent !== this.xmlFormatter(xml)) {
                this.xmlContent = !err ? this.xmlFormatter(xml) : err;
            }
        });
    }

    updateXmlLineNumbers(): void {

        this.xmlLineNumbers = [];
        let counter = 1;
        if (this.xmlContent.includes('\r\n')) {
            this.xmlContent.split('\r\n').forEach(() => {
                this.xmlLineNumbers.push(counter);
                counter++;
            });
        } else {
            this.xmlContent.split('\n').forEach(() => {
                this.xmlLineNumbers.push(counter);
                counter++;
            });
        }
    }

    formatXml(): void {
        const list = this.xmlFormatter(this.xmlContent.replace(/(?:\r\n|\r|\n)/g, ''))
            .split('\r\n').filter(tag => tag.trim().length > 0);
        let xmlString = '';
        list.forEach(el => {
            xmlString += el + '\r\n';
        });

        this.xmlContent = xmlString;
    }

    ngOnDestroy(): void {
        this.modeler.destroy();
    }
}
