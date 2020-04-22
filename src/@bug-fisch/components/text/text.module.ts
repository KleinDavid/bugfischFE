import { NgModule } from "@angular/core";
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";
import { BugFischSharedModule } from 'src/@bug-fisch/bug-fisch.shared.module';
import { TextComponent } from './text.component';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
    imports: [
        MatIconModule,
        MatInputModule,
        MatFormFieldModule,
        BugFischSharedModule
    ],
    declarations: [
        TextComponent
    ],
    exports: [
        TextComponent
    ]
})

export class TextModule { }

