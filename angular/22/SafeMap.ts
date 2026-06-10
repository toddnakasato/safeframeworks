/**
 * SafeMap — Angular map component.
 * Renders via shared-mapping map builder (./map) — identical across frameworks.
 * Leaflet + OpenStreetMap. Outputs data-* attributes for intent. No hardcoded CSS.
 */
import { Component, Input, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import type * as L from 'leaflet';
import type { ConfigBase, OnSafeEvent } from 'safecontracts';
import { createSafeMap, mapData } from './map';

@Component({
  selector: 'safe-map',
  standalone: true,
  template: `
    <div #mapContainer data-map-container></div>
  `,
  host: {
    '[attr.data-component]': "'map'",
    '[attr.data-variant]': 'config.metadata.variant'
  }
})
export class SafeMapComponent implements AfterViewInit, OnDestroy {
  @Input() config!: ConfigBase;
  @Input() onEvent?: OnSafeEvent;
  @ViewChild('mapContainer') containerRef!: ElementRef<HTMLElement>;
  private map: L.Map | null = null;

  ngAfterViewInit() {
    this.map = createSafeMap(this.containerRef.nativeElement, this.config, mapData(this.config), this.onEvent);
  }

  ngOnDestroy() {
    this.map?.remove();
    this.map = null;
  }
}
