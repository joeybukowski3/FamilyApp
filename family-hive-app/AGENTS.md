# Family Hive — Agent Instructions

## Non-negotiables
- Keep the app working at all times (npm run dev must start and load).
- Make small, reviewable changes (prefer <200 lines per commit when possible).
- Do not delete existing pages/components without replacing them.

## Security & privacy
- No plaintext PIN storage. If persistence is added, store only a salted hash.
- Don’t log private content (messages, photos, PINs).
- Default everything to private to the family space.

## MVP build order
1) App shell + navigation + routes
2) Local mocked auth/unlock (family + member + PIN)
3) Feed posts + comments (mocked)
4) Lists (todo/wishlist/christmas/custom)
5) Calendar events + reminders (mocked)
6) Profile customization (avatar/cover/status)
