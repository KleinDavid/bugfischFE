import { Component, Input, OnInit, AfterViewInit, HostListener } from '@angular/core';
import { ActionService } from 'src/@bug-fisch/services/action.service';

@Component({
  selector: 'app-action-button',
  templateUrl: './action-button.component.html',
  styleUrls: ['./action-button.component.scss']
})
export class ActionButtonComponent implements AfterViewInit {

  @Input() actionBinding = ' ';
  @Input() text = '';
  @Input() width = '';
  @Input() enterReaction = false;

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (this.enterReaction && event.keyCode === 13) {
      this.onClick();
    }
  }

  constructor(private actionService: ActionService) { }

  onClick(): void {
    this.actionService.runAction(this.actionBinding);
  }

  ngAfterViewInit(): void {
    (document.getElementsByClassName('mat-button')[0] as HTMLElement).style.minWidth = this.width + 'px';
  }

}
