import { Component, Input, OnInit, AfterViewInit, HostListener } from '@angular/core';
import { ActionService } from 'src/@bug-fisch/services/action.service';

@Component({
  selector: 'app-youtube-player',
  templateUrl: './youtubePlayer.component.html',
  styleUrls: ['./youtubePlayer.component.scss']
})
export class YoutubePlayerComponent implements OnInit {

  youtubeTag: HTMLScriptElement

  constructor(private actionService: ActionService) {
  }

  ngOnInit(): void {
    const tag = document.createElement('script');

    tag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(tag);
    this.youtubeTag = tag
  }
  
  stateChange(): void{
    console.log(this.youtubeTag)
    let els = document.getElementsByClassName('ytp-collapse');
    console.log(els)
    Array.prototype.forEach.call(els, function(el) {
      // Do stuff here
      console.log(el.tagName);
      el.click()
  });
  }

}
