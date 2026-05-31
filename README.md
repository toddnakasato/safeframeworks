# safeframeworks

Framework-specific renderers for safecomponents contracts.

Each framework directory imports types, resolver, dispatcher, and Intent from safecomponents (the contract) and provides its own component implementations.

## Structure

```
safeframeworks/
  react/       — re-exports safecomponents (React reference implementation)
  angular/     — future
  vue/         — future
  svelte/      — future
  astro/       — future
```

## How it works

safeapp reads `config.json` `renderer.framework` and imports the matching renderer.
safecomponents defines the contract. safeframeworks provides the mirror.
