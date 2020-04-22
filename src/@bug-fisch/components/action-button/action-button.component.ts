import { Component, Input, OnInit, AfterViewInit, HostListener } from '@angular/core';
import { ActionService } from 'src/@bug-fisch/services/action.service';

@Component({
  selector: 'app-action-button',
  templateUrl: './action-button.component.html',
  styleUrls: ['./action-button.component.scss']
})
export class ActionButtonComponent implements OnInit {

  @Input() actionBinding = '';
  @Input() text = '';
  @Input() enterReaction = false;
  @Input() styleType = '0';
  @Input() scrollUpAfterClick = false;

  actionNames: string[] = [];
  runningActionNumber: number = 0
  actionIsRunning: boolean = false;

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (this.enterReaction && event.keyCode === 13) {
      this.onClick();
    }
  }

  constructor(private actionService: ActionService) {
  }

  ngOnInit(): void {
    this.actionNames = this.actionBinding.replace(' ', '').split(',')
    this.actionNames.forEach(a => {
      this.actionService.getActionExecutedSubjectByName(a).actionExecutedSubject.subscribe(() => {
        if (this.scrollUpAfterClick) {
          document.getElementsByClassName('question-title')[0].scrollIntoView({ block: 'end', behavior: 'smooth' });
        }
        if (this.actionIsRunning) {
          this.executeNextAction();
        }
      })
    })
  }

  onClick(): void {
    if (this.scrollUpAfterClick) {
      document.getElementsByClassName('question-title')[0].scrollIntoView({ block: 'end', behavior: 'smooth' });
    }
    this.actionIsRunning = true;
    this.actionService.runAction(this.actionNames[0]);
  }

  private executeNextAction(): void {
    let runAction = (this.runningActionNumber === this.actionNames.length - 1)
    if (this.runningActionNumber === this.actionNames.length - 1) {
      this.runningActionNumber = 0;
      this.actionIsRunning = false;

      let scrollToTop = window.setInterval(() => {
        let pos = window.pageYOffset;
        if (pos > 0) {
          window.scrollTo(0, pos - 20); // how far to scroll on each step
        } else {
          window.clearInterval(scrollToTop);
        }
      }, 16);
    } else {
      this.runningActionNumber++;
    }
    if (this.runningActionNumber !== 0) {
      this.actionService.runAction(this.actionNames[this.runningActionNumber])
    }
  }

}
