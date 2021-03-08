import { Component, Inject, OnInit, ViewEncapsulation, AfterViewChecked, ViewChild, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as xmlFormatter from 'xml-formatter';
import * as cleaner from 'clean-html';

import * as pretty from 'pretty';
import { DesignerFileManager } from '../../managers/designerFileManager';
import { DesignerCssClassManager } from '../../managers/designerCssClassManager';
import { IdCard } from '../../layout-designer-objects/RenderableObjects/IdCard';
import { CssClass } from '../../layout-designer-objects/CssClass';
import { TransformableObject } from '../../layout-designer-objects/RenderableObjects/TransformableObject';

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

    private cssManager: DesignerCssClassManager = DesignerCssClassManager.getInstance();
    private fileManager: DesignerFileManager = DesignerFileManager.getInstance();

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

        //this.xmlContent = JSON.parse(JSON.stringify(this.data.content));
        // this.workState = this.data.state;
        //this.xmlContent = 
        let idCard = (this.data.idCard as IdCard);
        let transformableObjects = (this.data.transformableObjects as TransformableObject[]);
        let cssClasses = (this.data.cssClasses as CssClass[])
        transformableObjects.forEach(t => t.unselect());
        let style = document.createElement('style');
        transformableObjects.forEach(t => { style.innerHTML += t.getCss() });
        // cssClasses.forEach(t => { style.innerHTML += t.getCss() })

        let u = '<html lang="de"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>Print-Layout | FDG-DUS | FDG-Dienst</title></html>'
        let html = document.createElement('html')
        html.innerHTML = u;
        let str = html.outerHTML;
        console.log(str);
        str = pretty(str);
        console.log(str);
        cleaner.clean(u, function (html) {
            console.log(html);
        });

        this.xmlContent = this.createHtml();
        // this.formatXml();
        this.updateXmlLineNumbers();
        this.createHtml();
    }

    createHtml(): string {
        let html = document.createElement('html');
        html.lang = 'de';
        let head = document.createElement('head');
        
        let meta = document.createElement('meta');
        meta.name = 'viewport';
        meta.content = 'width=device-width, initial-scale=1.0';
        meta.setAttribute('charset', 'utf-8');
        
        let style = document.createElement('style');
        let hostClassString = ':host {display: block;left: 0;width: 100%;height: 100%;}'
        let styleString = hostClassString;
        this.cssManager.classes.concat(this.cssManager.blockedClasses).filter(c => c.active).forEach(c => {
            styleString += c.getCssStringWithBinding();
        })
        style.innerHTML = styleString;

        let body = document.createElement('body');
        body.innerHTML = (this.data.idCard as IdCard).getFinalHTML();

        head.appendChild(meta);
        head.appendChild(style);

        html.appendChild(head);
        html.appendChild(body);

        let outerHtml = html.outerHTML;
        // this.fileManager.fileList.forEach(f => {
        //     outerHtml = outerHtml.replace(f.src, f.path);
        // });

        return pretty(outerHtml);
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
