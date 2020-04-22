import { NgModule } from "@angular/core";
import { BugFischSharedModule } from 'src/@bug-fisch/bug-fisch.shared.module';
import { BrowserModule } from '@angular/platform-browser';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { YoutubePlayerComponent } from './youtubePlayer.component';
import { YouTubePlayerModule } from '@angular/youtube-player';

@NgModule({
    imports: [
        MatButtonModule,
        MatInputModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatProgressSpinnerModule,
        YouTubePlayerModule,

        MatFormFieldModule,
        BugFischSharedModule,
        BrowserModule
    ],
    declarations: [
        YoutubePlayerComponent
    ],
    exports: [
        YoutubePlayerComponent
    ]
})

export class YoutubePlayerModule { }

