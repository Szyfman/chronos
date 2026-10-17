# Review Mode — Specification

Agreed design for the Review play mode (phase 6). Lives / **Review** / Free are the three play modes of the main menu.

## Rules

| | Lives | Review | Free |
|---|---|---|---|
| Lives | 3 | 5 | none |
| Hints / skips | 3 / 1 | 10 / 3 | unlimited |
| XP | full | half | none |
| Trophies | all | Skill, Long Term and Secret sections, except The End of History (`time_lord`) | none |
| Mode records | yes | no | no |
| Card stats, era mastery, Compendium | yes | yes | yes |

- The numbers above live in `PLAY_MODE_RULES` (game.js), read through `playModeRules()`. `Infinity` means unlimited (shown as ∞); a card still has only 3 clues. The +1 hint streak reward is skipped when hints are unlimited.
- Review is offered only on the main menu (Classic, Empires, Characters). The Cultures screen keeps Lives / Free, and Free there follows the same rules as the main Free.
- The daily challenge always forces Lives, whatever the menu selection.
- Review unlocks at **level 5**. Below it the button shows as locked; tapping it shows "Available from level 5".
- At level 5+, tapping Review with no weak card in the chosen mode/era filter shows "No mistakes to review in this mode/era". Both messages are brief notices that last as long as the streak-reward toast (2.6 s).

## Deck

Built from `chronos_card_stats` for the chosen mode (Classic, Empires or Characters) and era filter. Size **18–30** cards.

### Terms
- **Timeline**: every card of the mode, sorted by year (`cardYear`; intervals use `startYear`). Distance = number of positions on it.
- **Weak card**: has at least one miss and is not mastered (mastered = 2+ correct and more hits than misses, same rule as era mastery). Weight = `miss − ok + 1` (minimum 1).
- **Target**: a weak card picked for this review.
- **Era band**: the era filter groups: Ancient (Ancient + Classical), Medieval (Medieval + Renaissance), Modern (Early Modern + Modern), Contemporary.

### Regions
A deck is made of **regions**: contiguous stretches of the timeline around targets.

1. **Count.** Up to 4 regions; 3–4 when there are enough weak cards. One weak card gives one region of 18; two far apart give two regions of about 9.
2. **First region.** Its first target is a weighted random pick among all weak cards.
3. **Later regions — strong preference.** They stay in the same era band as the first region, then the adjacent band, and go anywhere else only when the nearer bands run out of weak cards. The band itself changes between reviews, because the first pick is random.
4. **Grouping.** Weak cards within **5 positions** of a region join it as extra targets, while the region stays within its size cap.
5. **Size.** 6–12 cards per region, drawn at random. With only one or two targets, regions grow past 12 to reach the deck minimum of 18.

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
- `buildReviewDeck(mode, eraFilter, rand?)` in game.js (section REVIEW DECK) returns `{ deck, targets }` or `null`; its numbers are in `REVIEW_DECK`. `reviewAvailability(mode, eraFilter)` gives the reason a Review can't start (`level` / `mode` / `empty`) and is checked both when Review is picked (`selectReview`) and when the run starts (`startGame`), since the mode or filter may change in between.
- Targets of the last two reviews are kept in `chronos_review_history` (`reviewHistory` in state.js) for the cooldown.
- Trophy filtering per mode: `trophyAllowedInMode(def)` (the `sections` list in `PLAY_MODE_RULES.review`); mode records only count `playMode === 'lives'`.

### First card
The first card of a run lands on an empty timeline and can't be wrong (it isn't recorded in card stats), so it is **never a target**: the deck is arranged so the first card drawn is a boundary or context card.
