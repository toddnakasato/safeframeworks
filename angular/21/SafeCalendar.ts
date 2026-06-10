import { Component, Input, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import type { ConfigBase, OnSafeEvent } from 'safecontracts';
import { createSafeCalendar } from '../../builders/calendar';

@Component({
  selector: 'safe-calendar',
  standalone: true,
  template: `<div #calendarContainer></div>`
})
export class SafeCalendarComponent implements AfterViewInit, OnDestroy {
  @Input() config!: ConfigBase;
  @Input() onEvent?: OnSafeEvent;
  @ViewChild('calendarContainer') containerRef!: ElementRef<HTMLElement>;
  private root: HTMLElement | null = null;

  ngAfterViewInit() {
    this.root = createSafeCalendar(this.containerRef.nativeElement, this.config, this.onEvent);
  }

  ngOnDestroy() {
    this.root?.remove();
    this.root = null;
  }
}
