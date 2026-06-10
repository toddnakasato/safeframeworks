/**
 * SafeChat — Angular chat (bubbles, input, quick actions).
 * Renders via shared-mapping chat builder (./chat) — identical across
 * frameworks. Structure + data-* only.
 */
import { Component, Input, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import type { ConfigBase, OnSafeEvent } from 'safecontracts';
import { createSafeChat } from './chat';

@Component({
  selector: 'safe-chat',
  standalone: true,
  template: `<div #chatContainer></div>`
})
export class SafeChatComponent implements AfterViewInit, OnDestroy {
  @Input() config!: ConfigBase;
  @Input() onEvent?: OnSafeEvent;
  @ViewChild('chatContainer') containerRef!: ElementRef<HTMLElement>;
  private root: HTMLElement | null = null;

  ngAfterViewInit() {
    this.root = createSafeChat(this.containerRef.nativeElement, this.config, this.onEvent);
  }

  ngOnDestroy() {
    this.root?.remove();
    this.root = null;
  }
}
