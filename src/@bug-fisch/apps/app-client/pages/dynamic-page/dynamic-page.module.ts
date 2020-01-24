import { NgModule } from "@angular/core";
import { DynamicPageComponent } from "./dynamic-page.component";
import { RoutableComponentsModule } from "../routable-components/routable-components.module";

@NgModule({
    imports: [
        RoutableComponentsModule
    ],
    declarations: [
        DynamicPageComponent
    ]
    
})

export class DynamicPageModule {}

