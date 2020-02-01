import { Component, OnInit, ChangeDetectorRef, ComponentFactoryResolver, Type, ViewContainerRef, ViewChild, AfterViewChecked, AfterViewInit } from '@angular/core';
import { ActionService } from 'src/@bug-fisch/services/action.service';
import { Action } from 'src/@bug-fisch/model/action.model';


@Component({
  selector: 'app-dynamic-page',
  templateUrl: './dynamic-page.component.html',
  styleUrls: ['./dynamic-page.component.scss']
})
export class DynamicPageComponent implements OnInit, AfterViewInit {

  @ViewChild('viewContainerRef', { read: ViewContainerRef, static: false }) viewContainerRef: ViewContainerRef;

  public standardComponents: {
    componentName: string,
    inputs: string[],
    factory: any,
    factoryClass: any,
    selector: string,
    innerHtml: string,
    style: any
  }[] = [];

  constructor(private componentFactoryResolver: ComponentFactoryResolver,
    private changeDetectRef: ChangeDetectorRef, private actionService: ActionService) {
  }

  ngOnInit(): void {
    this.loadStadardComponents();
    this.actionService.routingSubject.subscribe(res => this.createComponentByName(res));
  }

  ngAfterViewInit(): void {
    let token = localStorage.getItem('Token');
    if (!token) {
      token = '';
    }
    let action = new Action
    action.Type = 'InitializeSessionAction';
    action.Input = {};
    action.Name = '';
    action.Id = '';
    action.Input.Token = token;
    this.actionService.executeAction(action);
    this.changeDetectRef.detectChanges();
  }

  loadStadardComponents(): void {
    console.log(this.componentFactoryResolver)
    const moduleRefList = this.componentFactoryResolver['_ngModule']['_def']['modules']
      .find((x: any) => x.name === 'RoutableComponentsModule')['__annotations__'][0]['imports'];
    moduleRefList.forEach((moduleRef: any) => {
      if (moduleRef['__annotations__'] !== undefined) {
        if (moduleRef['__annotations__'][0] !== undefined) {
          if (moduleRef['__annotations__'][0]['exports'] !== undefined) {
            if (moduleRef['__annotations__'][0]['exports'][0] !== undefined) {
              this.pushComponent((<Type<any>>moduleRef['__annotations__'][0]['exports'][0]));
            }
          }
        }
      }
    });
  }

  pushComponent(factoryClass: any): void {
    if (!this.factoryExists(factoryClass.name)) {
      return;
    }
    const factory = this.componentFactoryResolver.resolveComponentFactory(factoryClass);
    const inputs = factory.inputs.map((value: any) => {
      return value.propName;
    })
    const selector = factory.selector;
    this.standardComponents.push({
      componentName: factoryClass.name,
      inputs: inputs,
      factory: factory,
      factoryClass: factoryClass,
      selector: selector,
      innerHtml: '',
      style: null
    });
  }

  factoryExists(name: string): boolean {
    return (Array.from(this.componentFactoryResolver['_factories'].values()).find((value: any) => (value.componentType.name === name)) !== undefined);
  }

  createComponentByName(componentName: string): void {
    const component = this.standardComponents.find(c => c.componentName === componentName);
    this.viewContainerRef.clear();
    this.viewContainerRef.createComponent(component.factory);
    const element = document.getElementsByTagName(component.selector)[0] as HTMLElement;
    component.innerHtml = element.outerHTML;
    component.style = element.style;
    this.changeDetectRef.detectChanges();
  }
}
