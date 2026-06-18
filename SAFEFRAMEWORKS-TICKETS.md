# SAFEFRAMEWORKS-TICKETS.md

## What It Is

A ticket is a concrete improvement request tied to a component. It lives as a JSON file. It has a test. The test proves the fix works.

## Where Tickets Live

```
safeframeworks/tickets/{component}/{component}-{seq}.json
```

One folder per component. Files sort by sequence number.

## Ticket Shape

| Field | Type | Purpose |
|-------|------|---------|
| id | string | `{component}-{seq}` e.g. `calendar-0002` |
| component | string | Target component |
| type | TicketType | What kind of work (see below) |
| title | string | One-line summary |
| description | string | Full context |
| status | TicketStatus | `open` → `in-progress` → `closed` |
| proves | string[] | Domain prove commands for regression |
| params | object | Scoping: `{ component, event, builder }` |
| test | object | Concrete CLI test (see below) |
| resolution | string | How it was fixed (filled on close) |
| files | string[] | What changed |

## Ticket Types

| Type | What it means |
|------|--------------|
| variation | Add or fix a component variant |
| event | Add or fix event firing or payload |
| paint | Fix paint definition or CSS rendering |
| style | Fix contrast, theme, unopinionated violation |
| data | Fix data slot, schema, readList/readRecord |
| structure | Fix builder structure (TDZ, imports, naming) |
| new-component | Add an entirely new component |
| bug | Runtime error, empty render, broken behavior |

## The Test

Every ticket defines a concrete test. A CLI command and assertions on the JSON output.

```json
"test": {
  "command": "payload build --component calendar --event select --year 2026 --month 5 --day 18 --date 2026-06-18",
  "assert": {
    "ok": true,
    "data.year": 2026,
    "data.date": "2026-06-18"
  }
}
```

`safedesk prove ticket` runs each ticket's command, checks each assertion. Dot paths resolve into the JSON output: `data.date` → `output.data.date`.

## Two Layers of Proving

| Layer | What it checks | Command |
|-------|---------------|---------|
| Ticket test | The specific fix works | `safedesk prove ticket` |
| Domain proofs | Nothing else broke | `safedesk prove event-payload`, etc. |

A ticket closes when both pass. The test verifies the fix. The domain proofs verify no side effects.

## Lifecycle

1. **Create** — from the viewer's component card. Type dropdown + title input + "Ticket" button. Auto-generates id, suggests proves from type, populates params from component.

2. **Fix** — change the code. Update the contract if needed. Add the `test` field with a concrete assertion.

3. **Prove** — click the ticket's Prove button. Runs `safedesk {test.command}`, checks assertions. Shows `5/5 ✓` or the first failure.

4. **Close** — set status to `closed`, fill `resolution` and `files`.

5. **Regression** — `safedesk prove ticket` checks all closed tickets. A closed ticket whose test now fails = regression caught.

## Viewer Integration

**Sidebar** — Tickets section with Open (count) / Closed (count). Closed sorted by last closed first.

**Component view** — each component card has a ticket creation bar at the bottom.

**Ticket view** — cards showing id, type, status, title, description, scope, proves, resolution. Prove button on every ticket. Start/Close buttons on open tickets.

**Proofs sidebar** — ticket domain runs `safedesk prove ticket`.

## Example

```
safedesk prove ticket
  ticket: 6/6 PASS
    PASS: calendar-0002: payload build --component calendar --event select --year 2026
    PASS: calendar-0003: prove builder-registry
    PASS: calendar-0004: prove builder-registry
    PASS: button-0001: payload build --component button --event click
    PASS: button-0002: payload build --component button --event click
    PASS: button-0003: payload build --component button --event click --label "This was helpful"
```

Each line is one ticket. One command. One result. Specific.
