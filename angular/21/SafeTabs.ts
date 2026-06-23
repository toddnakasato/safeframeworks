import { Component, Input, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import type { ConfigBase, OnSafeEvent } from 'safecontracts';
import { buildComponent } from '../../utils/render';

interface TabItem { key: string; label: string; child: string; icon?: string; }

@Component({
  selector: 'safe-tabs',
  standalone: true,
  template: `<div #tabsContainer></div>`
})
export class SafeTabsComponent implements AfterViewInit, OnDestroy {
  @Input() config!: ConfigBase;
  @Input() onEvent?: OnSafeEvent;
  @ViewChild('tabsContainer') containerRef!: ElementRef<HTMLElement>;

  private root: HTMLElement | null = null;
  private panel: HTMLElement | null = null;
  private activeChild: HTMLElement | null = null;
  private active: string = '';

  private get tabs(): TabItem[] {
    return (this.config.metadata['tabs'] as TabItem[]) ?? [];
  }

  ngAfterViewInit() {
    const variant = (this.config.metadata['variant'] as string) ?? 'default';
    const position = (this.config.metadata['position'] as string) ?? 'top';
    this.active = (this.config.metadata['defaultActive'] as string) ?? this.tabs[0]?.key ?? '';

    this.root = document.createElement('div');
    this.root.setAttribute('data-component', 'tabs');
    this.root.setAttribute('data-variant', variant);
    this.root.setAttribute('data-position', position);

    const bar = document.createElement('div');
    bar.setAttribute('data-tabs-bar', '');
    bar.setAttribute('data-position', position);

    for (const tab of this.tabs) {
      const btn = document.createElement('button');
      btn.setAttribute('data-tab', '');
      if (tab.key === this.active) btn.setAttribute('data-active', '');
      if (tab.icon) {
        const icon = document.createElement('span');
        icon.setAttribute('data-role', 'tab-icon');
        icon.textContent = tab.icon;
        btn.appendChild(icon);
      }
      const label = document.createElement('span');
      label.setAttribute('data-role', 'tab-label');
      label.textContent = tab.label;
      btn.appendChild(label);
      btn.addEventListener('click', () => this.select(tab.key, bar));
      bar.appendChild(btn);
    }

    this.panel = document.createElement('div');
    this.panel.setAttribute('data-tabs-panel', '');

    this.root.appendChild(bar);
    this.root.appendChild(this.panel);
    this.containerRef.nativeElement.appendChild(this.root);

    this.mountChild(this.active);
  }

  private select(key: string, bar: HTMLElement) {
    this.active = key;
    bar.querySelectorAll('[data-tab]').forEach(btn => {
      const label = btn.querySelector('[data-role="tab-label"]')?.textContent?.trim();
      const tab = this.tabs.find(t => t.label === label);
      if (tab?.key === key) btn.setAttribute('data-active', '');
      else btn.removeAttribute('data-active');
    });
    this.mountChild(key);
    this.onEvent?.({ name: 'select', payload: { key } } as any);
  }

  private mountChild(key: string) {
    if (!this.panel) return;
    this.activeChild?.remove();
    this.activeChild = null;
    const children = this.config.children as Record<string, ConfigBase> | undefined;
    const child = children?.[key];
    if (child) {
      const content = document.createElement('div');
      content.setAttribute('data-tab-content', '');
      content.setAttribute('data-tab-key', key);
      this.activeChild = buildComponent(child, this.onEvent);
      content.appendChild(this.activeChild);
      this.panel.innerHTML = '';
      this.panel.appendChild(content);
    }
  }

  ngOnDestroy() {
    this.root?.remove();
    this.root = null;
    this.panel = null;
    this.activeChild = null;
  }
}
