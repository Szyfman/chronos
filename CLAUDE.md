# Chronos

Before changing anything, read `documentation/CLAUDE.md` (project rules) and, for the area you touch, its specs in `documentation/`.

Persistence is shared by every feature: before adding, changing or removing anything stored in `localStorage` (a new `chronos_*` key, a new field in an existing one, a new run flag), read `documentation/PERSISTENCE.md` and register the change there with its merge rule. Saved runs (`RUN_SAVE.md`) and cloud sync (`CLOUD_SYNC.md`) depend on that registry being complete.

`documentation/CLAUDE.md` and `documentation/PERSISTENCE.md` are edited by more than one chat: pull `main` before editing them.
