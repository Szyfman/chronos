# Review Mode — Specification

Agreed design for the Review play mode (phase 6). Lives / **Review** / Free are the three play modes of the main menu.

## Rules

| | Lives | Review | Free |
|---|---|---|---|
| Lives | 3 | 5 | none |
| Hints / skips | 3 / 1 | 10 / 3 | unlimited |
| Clues per card | 3, then the hint button locks | 3, then the hint button locks | 3, then they loop: the next tap shows the 1st again |
| XP | full | half | none |
| Trophies | all | Skill, Long Term and Secret sections, except The End of History (`time_lord`) | none |
| Mode records | yes | no | no |
| Hits count towards mastery | yes | yes | no |
| Misses count towards mastery | yes | **no** | no |
| Misses feed the Review deck | yes | yes | yes |
| Compendium (cards discovered) | yes | yes | yes |

- The numbers above live in `PLAY_MODE_RULES` (game.js), read through `playModeRules()`. `Infinity` means unlimited (shown as ∞); a card still has only 3 clues. The +1 hint streak reward is skipped when hints are unlimited. `clueLoop` (Free) makes the clues loop; `mastery` (`'all'` / `'hits'` / `'none'`) says what counts towards mastery — see *Card stats and mastery* below.
- Review is offered only on the main menu (Classic, Empires, Characters). The Cultures screen keeps Lives / Free, and Free there follows the same rules as the main Free.
- The daily challenge always forces Lives, whatever the menu selection.
- Review unlocks at **level 5**. Below it the button shows as locked; tapping it shows "Available from level 5".
- At level 5+, tapping Review when no card of the chosen mode/era filter was ever missed (no weak card and no mastered-missed card, see *Deck*) shows "No mistakes to review in this mode/era". Both messages are brief notices that last as long as the streak-reward toast (2.6 s).

## Card stats and mastery

Agreed on 2026-10-21. Rule of thumb: **only a mode where something is at stake counts towards mastery**, and Review never sets mastery back.

Each card in `chronos_card_stats` keeps two kinds of miss:

| Field | Counts | Used by |
|---|---|---|
| `ok` | hits in Lives and Review | mastery (★, era seals), Compendium record, `total_correct` trophy |
| `miss` | misses in Lives only | mastery, Compendium record, `weak_overcome` trophy |
| `amiss` | misses in **every** mode (Lives, Review, Free) — always ≥ `miss` | the Review deck only (weak and mastered-missed cards, their weight) |

What a placement records (`recordCardResult`, game.js — the first card of a run is never recorded, skips are not attempts):

| | Hit | Miss |
|---|---|---|
| Lives (all modes, Cultures and the daily included) | `ok` +1 | `miss` +1 and `amiss` +1 |
| Review | `ok` +1 | `amiss` +1 |
| Free (main menu and Cultures) | nothing | `amiss` +1 |

The same rules apply in every game mode (Classic, Empires, Characters, Cultures). Stats belong to the **card**, not to the mode: Classic holds every card, so a person missed in Characters is also weak in Classic's Review, and mastering it in Classic takes it out of Characters' Review (the same for empires between Empires and Classic).

Why:
- **Review** is harder by design: the deck is made of the player's weak cards with their closest neighbours on the timeline. Punishing a miss in the mode built to train misses would discourage using it, so a miss there never moves a card away from its ★ nor takes a ★ or seal away. Hits still count, so Review is the natural way to raise mastery.
- **Free** has unlimited hints and skips and no lives, so a hit there says little about what the player knows. Free already gives no XP, trophies or records; now it gives no mastery either. Its misses still say which cards the player gets wrong, so they still feed the Review deck.

What the player sees:
- The Compendium record ("Your record: hits · misses — n more hits to master") shows only the mastery numbers (`ok` / `miss`), so the count always agrees with the ★. Review and Free misses don't appear there.
- The gameover screen says it: Free — "Free Play earns no XP or mastery"; Review — "Review earns half XP · misses don't affect mastery".
- A card already mastered (★) and missed in Review or Free stays mastered. It is no longer weak, but it can still come back as a mastered-missed target (*Deck*).
- Mastery still needs 2+ hits and more hits than (Lives) misses: Review doesn't forgive past misses, it only stops adding new ones.

Data saved before this change (v59 and older) can't be split by mode: on load `amiss` starts equal to `miss`, and hits made in Free until then stay in `ok`. The rules apply from v60 on. Storage and sync details: `PERSISTENCE.md` and `CLOUD_SYNC_SPEC.md`.

## Deck

Built from `chronos_card_stats` for the chosen mode (Classic, Empires or Characters) and era filter. Size **18–30** cards.

### Terms
- **Timeline**: every card of the mode, sorted by year (`cardYear`; intervals use `startYear`). Distance = number of positions on it.
- **Weak card**: has at least one miss in any mode (`amiss` > 0) and is not mastered (mastered = 2+ correct and more hits than misses, same rule as era mastery). Weight = `amiss − ok + 1` (minimum 1): a miss in Review or Free makes the card come back more often until it is mastered, while a hit in Free doesn't make it come back less.
- **Mastered-missed card**: mastered, but missed at least once in any mode (`amiss` > 0). Weight = `amiss`: the cards missed most come back most. A fallback for when weak cards run out (agreed on 2026-10-21): mastering everything must not lock the player out of Review.
- **Target**: a weak or mastered-missed card picked for this review.
- **Era band**: the era filter groups: Ancient (Ancient + Classical), Medieval (Medieval + Renaissance), Modern (Early Modern + Modern), Contemporary.

### Regions
A deck is made of **regions**: contiguous stretches of the timeline around targets.

1. **Count.** Up to 4 regions; 3–4 when there are enough weak cards. One weak card gives one region of 18; two far apart give two regions of about 9.
2. **First region.** Its first target is a weighted random pick among all weak cards.
3. **Later regions — strong preference.** They stay in the same era band as the first region, then the adjacent band, and go anywhere else only when the nearer bands run out of weak cards. The band itself changes between reviews, because the first pick is random.
4. **Grouping.** Weak cards within **5 positions** of a region join it as extra targets, while the region stays within its size cap. In a region seeded by a mastered-missed card, nearby mastered-missed cards join too.
5. **Size.** 6–12 cards per region, drawn at random. With only one or two targets, regions grow past 12 to reach the deck minimum of 18.
6. **Mastered-missed cards.** Weak cards always seed regions first. When no weak card is left to seed one:
   - **No weak card at all** (everything missed is mastered): mastered-missed cards seed every region, up to 4, by the same rules. A notice at the start of the run says "All mastered — reviewing the ones you missed most".
   - **Some weak cards, but they fill fewer than 3 regions** (`REVIEW_DECK.topUp`): mastered-missed cards add regions until there are 3. The weak cards stay guaranteed and remain the focus, and the rest of the deck varies between reviews instead of always being built around the same one or two cards. No notice.
   - With 3 or more weak regions nothing changes.

### Inside a region
- **Fixed:** each target, plus the card immediately before and after it on the timeline (its boundary cards). This is the core of the training.
- **Variable:** the remaining cards. The region's size and the side it grows towards are drawn at random, so the context around the same target changes between reviews.

### Growing a region (edges)
Each growth step, in order of preference:
1. Grow towards the drawn side, inside the era filter.
2. If there is no card on that side — the target is the first or last card of the timeline, or sits at the filter's edge — grow towards the opposite side instead. A region never shrinks, and never asks for a card that doesn't exist.
3. Only when both sides are exhausted inside the filter, take the nearest card outside it ("pierce" the filter, silently, only as many cards as needed).

### Variety between reviews
- Targets used in the **last review** have their weight halved (×0.5); those of the review **before** it, ×0.75. This needs a small record of the last two reviews' targets.
- Repeating a weak card is intended until it is mastered: the cooldown only stops the same review from repeating.
- Card order inside the deck is shuffled as in any run.

### Implementation
- `buildReviewDeck(mode, eraFilter, rand?)` in game.js (section REVIEW DECK) returns `{ deck, targets, allMastered }` or `null` (no card of the mode/filter ever missed); its numbers are in `REVIEW_DECK`. `allMastered` makes `initGame` queue the notice. Card tests: `_isWeakCard`, `_isMasteredMissed`; `reviewTargetCards` lists both. `reviewAvailability(mode, eraFilter)` gives the reason a Review can't start (`level` / `mode` / `empty`) and is checked both when Review is picked (`selectReview`) and when the run starts (`startGame`), since the mode or filter may change in between.
- Targets of the last two reviews are kept in `chronos_review_history` (`reviewHistory` in state.js) for the cooldown.
- Trophy filtering per mode: `trophyAllowedInMode(def)` (the `sections` list in `PLAY_MODE_RULES.review`); mode records only count `playMode === 'lives'`.

### First card
The first card of a run lands on an empty timeline and can't be wrong (it isn't recorded in card stats), so it is **never a target**: the deck is arranged so the first card drawn is a boundary or context card.
