import { Component, Input, ElementRef, ViewChild, AfterViewInit, OnDestroy } from "@angular/core";
import type { ConfigBase, OnSafeEvent } from "safecontracts";
import { createSafeList } from "../../builders/list";

@Component({
    selector: "safe-list",
    standalone: true,
    template: `<div #listContainer></div>`
})
export class SafeListComponent implements AfterViewInit, OnDestroy {
    @Input() config!: ConfigBase;
    @Input() onEvent?: OnSafeEvent;
    @ViewChild("listContainer") containerRef!: ElementRef<HTMLElement>;
    private root: HTMLElement | null = null;

    ngAfterViewInit() {
        const _ctx = createSafeFireContext(this.config, this.onEvent, buildPayloadViaCli);
    this.root = createSafeList(this.containerRef.nativeElement, this.config, _ctx);
    }

    ngOnDestroy() {
        this.root?.remove();
        this.root = null;
    }
}
