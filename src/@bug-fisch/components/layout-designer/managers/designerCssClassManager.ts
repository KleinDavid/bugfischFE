import { CssClass } from '../layout-designer-objects/CssClass';

export class DesignerCssClassManager {
    private static instance: DesignerCssClassManager;
    classes: CssClass[] = [];
    blockedClasses: CssClass[] = [];

    public static getInstance(): DesignerCssClassManager {
        if (!this.instance) {
            this.instance = new DesignerCssClassManager();
        }
        return this.instance;
    }

    addClass(cssClass: CssClass): void {
        this.classes.push(cssClass);
        console.log(this.classes);
    }

    addBlockedClass(cssClass: CssClass): void {
        this.blockedClasses.push(cssClass)
    }

   updateClasses(): void {
    this.classes.concat(this.blockedClasses).forEach(c => {
        c.update();
    });
   };
}