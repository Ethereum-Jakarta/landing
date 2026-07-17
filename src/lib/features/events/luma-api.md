# Lu.ma Public Calendar API (reverse-engineered)

The event data on `/events` comes from Lu.ma's **public, unauthenticated** JSON API — the
same endpoints Lu.ma's own frontend calls. **No API key and no Lu.ma Plus plan required.**

> ⚠️ **Unofficial.** These endpoints are undocumented and can change without notice. If
> `/events` suddenly breaks, re-verify the shapes below (`src/lib/features/events/luma.ts`).

## Base

```
https://api.lu.ma
```

Send `Accept: application/json`. A normal browser `User-Agent` is safest.

## Auth

None. Public calendars/events return data with no token.

## CORS — server-side only

Responses carry **no `Access-Control-Allow-Origin`** header (only `Vary: Origin`), so a
browser cannot call these endpoints cross-origin — it will be blocked by CORS.

➡️ **Always fetch from the server** (SvelteKit `+page.server.ts` / an API route), never from
client `onMount`. Server-to-server has no CORS restriction. This is how `/events` works.

## ETHJKT identifiers

| Thing                    | ID / value                                                          |
| ------------------------ | ------------------------------------------------------------------- |
| **ETHJKT host user**     | `usr-Tm7P3txU8ZLCWeP` (username `ethjkt`) — see `LUMA_HOST_USER_ID` |
| Organizer's own calendar | `cal-GqViRJDawYQ4duE` (7 events, only ETHJKT-owned ones)            |
| Stale calendar (ignore)  | `cal-zdfaHfttTCXyZtR` — Pintu events, last Aug 2024                 |

> **Why list by host, not calendar?** ETHJKT co-hosts across ~6 partner calendars
> (MetaMask, Celo, Lisk, Scroll, Bittensor…). The organizer's own calendar only has the
> handful of events they _own_ (7). Listing by the **host user** returns **all 16** events
> they've run, across every calendar. This is what `/events` uses (endpoint #0 below).

## Endpoints

### 0. List a host's events across all calendars (what `/events` uses)

```
GET /user/profile/events-hosting
    ?user_api_id=<usr-id>        // REQUIRED — username / api_id params are rejected (400)
    &period=future|past
    &pagination_limit=<n>
```

Returns the same `{ entries: [...], has_more }` shape as endpoint #1 — each entry has the
full `event` object plus `guest_count`, `ticket_info`, `featured_guests`, etc. Sibling
endpoints `/user/profile/events` (attended) and `/user/profile/events-together` exist too.

**Finding the host `user_api_id`:** open any of the host's events, read
`__NEXT_DATA__` → `hosts[].api_id` (and `.username`). The public profile lives at
`luma.com/user/<username>`; its `__NEXT_DATA__` also carries `event_hosted_count`.

### 1. List a single calendar's events

```
GET /calendar/get-items
    ?calendar_api_id=<cal-id>
    &period=future|past
    &pagination_limit=<n>
```

- `period=future` — upcoming events (ascending). Often **empty** when nothing is scheduled.
- `period=past` — recent events (newest first). Used as the fallback on `/events`.
- `pagination_limit` — max entries. Use a real number (e.g. `6`, `50`); `1` can return `[]`.

**Response**

```jsonc
{
  "entries": [
    {
      "api_id": "calev-...",
      "guest_count": 42,           // may be null
      "ticket_info": { ... },
      "hosts": [ ... ],
      "event": {
        "api_id": "evt-...",
        "name": "Scroll Dev Meetup ETH Jakarta",
        "url": "5pa5ayy1",          // slug → https://luma.com/<url>
        "cover_url": "https://images.lumacdn.com/event-covers/...",
        "start_at": "2026-01-10T03:00:00.000Z",  // ISO 8601 UTC
        "end_at": "2026-01-10T09:00:00.000Z",
        "timezone": "Asia/Jakarta",              // IANA
        "location_type": "offline",              // "offline" | "online"
        "geo_address_info": { "city": "...", "city_state": "..." } // null when online/hidden
      }
    }
  ],
  "has_more": false
}
```

Only the fields above are consumed. See `RawEntry` / `normalize()` in `luma.ts`.

#### Upcoming (`period=future`) entries carry more

Future entries include registration/attendance fields that past ones don't:

| Entry field                 | Example                                | Notes                                   |
| --------------------------- | -------------------------------------- | --------------------------------------- |
| `guest_count`               | `68`                                   | Attendee count — **`0` if list hidden** |
| `ticket_count`              | `68`                                   |                                         |
| `ticket_info`               | `{ is_free, price, is_sold_out, ... }` | Pricing / sold-out state                |
| `registration_availability` | `"sold-out"` \| `"available"` \| …     |                                         |
| `featured_guests`           | `[ {name, avatar_url, ...}, ... ]`     | Sample of attendees — see below         |
| `waitlist_active`           | `false`                                |                                         |
| `tags`                      | `[ {name:"hands-on", color:"red"} ]`   |                                         |
| `hosts`                     | `[ {name, avatar_url, ...} ]`          |                                         |
| `featured_city`             | `{ name:"Jakarta", slug:"jakarta" }`   |                                         |

The nested `event` object is the same shape as past events.

### Guest / participant visibility

Controlled by the host's **`event.show_guest_list`** flag:

| `show_guest_list` | `guest_count`    | `featured_guests`                       | Full roster |
| ----------------- | ---------------- | --------------------------------------- | ----------- |
| `true`            | real number      | up to **10** sampled attendees (public) | auth only   |
| `false`           | **`0`** (hidden) | `[]`                                    | auth only   |

- **`featured_guests`** is the only public attendee data: a **sample of ~10**, each with
  `name`, `first_name`/`last_name`, `avatar_url`, `bio_short`, `last_online_at`, `timezone`,
  and social handles. No auth needed.
- The **full attendee list** — `GET /event/get-guest-list?event_api_id=<evt>` — returns
  **`401 "You are not signed in."`**. Not publicly accessible.
- When the list is hidden, `guest_count` is reported as `0` (not the true count).
- `event/get` also returns `guest_data`, but that's the **current viewer's own** registration
  status (all null when anonymous), _not_ the attendee list.

➡️ For a public "X going + avatar stack" UI, use `guest_count` + `featured_guests`. Don't
expect the full roster without an authenticated Lu.ma session.

### 2. Calendar metadata

```
GET /calendar/get?api_id=<cal-id>
```

Returns `{ "calendar": { name, avatar_url, cover_image_url, luma_plan, ... } }`.
Not currently used by the page.

### 3. Single event detail

```
GET /event/get?event_api_id=<evt-id>
```

Returns the full event object (description, ticket types, hosts, guest list settings, …).
Use this if we later add on-site event detail pages instead of linking out to Lu.ma.

## How to find a calendar's `api_id`

The handle in the URL is **not** the api_id. Fetch the public page and read the embedded
Next.js data:

```bash
curl -s https://luma.com/<handle-or-event-slug> \
  | grep -oE 'cal-[A-Za-z0-9]+' | sort -u
```

The `__NEXT_DATA__` `<script>` blob contains `calendar_api_id` / `event_api_id` in
`props.pageProps.initialData.data`.

## Quick check

```bash
curl -s 'https://api.lu.ma/calendar/get-items?calendar_api_id=cal-GqViRJDawYQ4duE&period=past&pagination_limit=3' \
  | python3 -c 'import sys,json;[print(e["event"]["name"]) for e in json.load(sys.stdin)["entries"]]'
```
