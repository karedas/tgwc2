import { Injectable, ElementRef } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { NgScrollbar } from 'ngx-scrollbar';

@Injectable()
export class ScrollbarOutputService {
  pause$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  containerSize = 0;

  private scrollTopBeforePause = 0;


  resetScrollTopPause () {
    this.scrollTopBeforePause = -1;
  }

  scrollPanelToBottom(scrollbarRef: NgScrollbar, scrollEnd: ElementRef) {
    if (scrollbarRef) {
      setTimeout(() => {
        scrollbarRef.scrollToElement(scrollEnd.nativeElement, {
          duration: 80
        });
      }, 30);
    }
  }

  // Stop the output AutoScroll Event
  isScrollable(): Observable<boolean> {
    return this.pause$.asObservable();
  }

  toggleAutoScroll() {
    this.pause$.next(!this.pause$.value);
  }

  onMouseScroll(scrollTop, outputSizes?: number) {
    // Check if output container changes size after window.resize or split area width changes,
    // then reset the pause behaviour to prevent not wanted behaviour.
    if (outputSizes !== this.containerSize) {
      this.containerSize = outputSizes;
      this.scrollTopBeforePause = 0;
    }
    if (scrollTop > this.scrollTopBeforePause) {
      this.scrollTopBeforePause = scrollTop;
    } else if (scrollTop < this.scrollTopBeforePause - 150) {
      if (!this.pause$.value) {
        this.pause$.next(true);
      }
    }
  }

  disablePause() {
    if (this.pause$.value) {
      this.pause$.next(false);
    }
  }

  scrollToPlaceHolder(scrollbarRef: NgScrollbar, pausePlaceHolder: ElementRef) {
    scrollbarRef.scrollToElement(pausePlaceHolder.nativeElement, {
      duration: 50
    });
  }
}
