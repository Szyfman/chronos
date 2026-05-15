# Chronos - Guide for AI Agents

## Project Context

**Chronos** is a historical timeline game built as a Progressive Web App. It's a passion project focused on making history learning engaging through gameplay. The codebase is intentionally framework-free, using vanilla JavaScript for maximum simplicity and portability.

**Developer**: Solo developer, Portuguese speaker (Brazil), building primarily for personal use and learning

**Design Philosophy**:
- **Simplicity over complexity**: No build tools, no frameworks, no dependencies
- **Offline-first**: Full PWA with service worker caching
- **Bilingual by design**: Equal treatment of English and Portuguese
- **Educational value**: Every interaction should teach something about history
- **Smooth UX**: Polished animations, clear feedback, intuitive interactions

---

## How to Help

When working on this codebase, you should:

### ✅ DO

1. **Maintain the vanilla JS philosophy**
   - No frameworks, no build tools, no npm packages
   - Keep it runnable by opening index.html in a browser
   - Embrace simplicity over abstraction

2. **Respect bilingual equality**
   - Every string must have both `en` and `pt` versions
   - Test language switching after any UI change
   - Translate card content (name, facts, clues, hints) in both languages
   - Use translation helpers: `t()`, `cName()`, `cCat()`, `cHint()`, `cFact()`

3. **Preserve offline functionality**
   - All assets must be embedded (base64 for audio/images) or cacheable
   - No external API calls during gameplay
   - Increment service worker cache version on file changes: `const CACHE = 'chronos-vX'`

4. **Follow existing patterns**
   - Study similar code before adding new features
   - Keep separation of concerns: src/state.js (data), src/game.js (logic), src/ui.js (rendering)
   - Use consistent naming conventions (see Repository Summary)

5. **Test thoroughly**
   - Test all game modes (Classic, Empires, Characters, Biblical, Greco-Roman, Eastern, Daily)
   - Test Lives and Free modes
   - Test language switching mid-game
   - Test theme switching (dark/light)
   - Test trophy unlocking conditions
   - Test on both desktop and mobile (touch vs mouse)

6. **Write historical content carefully**
   - Fact-check dates and events against multiple sources
   - Keep facts interesting and educational (not dry Wikipedia summaries)
   - Include context and connections between events
   - Aim for "TIL" (Today I Learned) quality

7. **Prioritize performance**
   - Keep cards.js readable (it's large but must stay human-editable)
   - Avoid expensive operations in render loops
   - Use efficient DOM manipulation (innerHTML for full rebuilds, targeted updates for small changes)

8. **Communicate clearly**
   - Explain why changes are needed, not just what changed
   - Provide context for historical content decisions
   - Suggest alternatives when modifying core mechanics

### ❌ DON'T

1. **Don't add build complexity**
   - No webpack, Babel, TypeScript, or bundlers
   - No npm dependencies (not even dev dependencies)
   - Don't require compilation or transpilation

2. **Don't break offline functionality**
   - Don't add external API calls (Google Fonts, CDN libraries, etc.)
   - Don't require server-side logic
   - Don't use external images/audio (embed or cache them)

3. **Don't sacrifice bilingual support**
   - Don't hardcode English-only strings
   - Don't forget to translate new UI elements
   - Don't assume English is primary (both languages are equal)

4. **Don't add unnecessary abstractions**
   - Avoid over-engineering (no class hierarchies, factories, or complex patterns)
   - Don't create utilities unless used in 3+ places
   - Keep functions focused and readable (better long than clever)

5. **Don't modify scoring arbitrarily**
   - Scoring system is balanced (10 base + streak×2, intervals 10-30)
   - Don't change point values without justification
   - Trophy unlock conditions are carefully designed (don't make them easier/harder without reason)

6. **Don't break the separation of concerns**
   - game.js should never call UI rendering directly (only indirectly via ui.js exports)
   - ui.js should never modify game state directly (only via game.js functions)
   - state.js should never have logic (only variable declarations)

7. **Don't reduce accessibility**
   - Maintain keyboard navigation where it exists
   - Keep contrast ratios readable
   - Don't remove semantic HTML

8. **Don't remove historical accuracy**
   - Verify date changes against reputable sources
   - Don't oversimplify complex historical events
   - Respect cultural sensitivity in content

---

## Common Tasks Guide

### Adding a New Historical Card

**Location**: `src/cards.js`

**For single-year events/people (CARDS array)**:
```javascript
{
  name: 'English Name',
  name_pt: 'Nome em Português',
  year: 1234,  // Negative for BCE, positive for CE
  cat: 'Events',  // or 'People'
  cat_pt: 'Eventos',  // or 'Pessoas'
  era: 'Medieval',  // See era list in Repository Summary
  hint: 'One-line description...',
  hint_pt: 'Descrição de uma linha...',
  facts: [
    'Interesting fact 1...',
    'Interesting fact 2...',
    'Interesting fact 3...'
  ],
  facts_pt: [
    'Fato interessante 1...',
    'Fato interessante 2...',
    'Fato interessante 3...'
  ],
  clues: [
    'Vague clue',
    'More specific clue',
    'Very specific clue'
  ],
  clues_pt: [
    'Pista vaga',
    'Pista mais específica',
    'Pista muito específica'
  ],
  tags: ['roman']  // Optional: for mode filtering
}
```

**For intervals/empires (INTERVALS array)**:
```javascript
{
  name: 'English Name',
  name_pt: 'Nome em Português',
  startYear: -500,  // Empire start
  endYear: 200,     // Empire end
  era: 'Classical',
  region: 'Mediterranean',
  region_pt: 'Mediterrâneo',
  culture: 'Roman',
  culture_pt: 'Romano',
  description: 'Full paragraph description...',
  description_pt: 'Descrição completa...',
  facts: ['Fact 1', 'Fact 2', ...],
  facts_pt: ['Fato 1', 'Fato 2', ...],
  clues: ['Clue 1', 'Clue 2', 'Clue 3'],
  clues_pt: ['Pista 1', 'Pista 2', 'Pista 3'],
  tags: ['eastern']  // Optional
}
```

**Guidelines**:
- **Names**: Use commonly recognized English names (Julius Caesar, not Gaius Julius Caesar)
- **Dates**: Be as precise as possible, use reputable sources (Wikipedia + 2 other sources)
- **Categories**: People (individuals), Events (everything else)
- **Eras**: See Repository Summary for full era list
- **Facts**: Write 3-5 interesting facts, make them engaging (not just "Born in X, died in Y")
- **Clues**: Progressive difficulty - vague → specific → very specific (3 clues total)
- **Tags**: Only add if card should appear in special mode (roman, abrahamic, eastern)

**Testing**:
1. Start game in relevant mode
2. Look for card in deck (may need to play multiple rounds)
3. Verify all text displays correctly
4. Switch language, verify translations
5. Place card, verify fact panel shows correctly
6. Check Compendium entry

### Adding a New Game Mode

**Requires changes in multiple files**:

1. **Define mode constants** in `game.js`:
   ```javascript
   const MODE_LABEL = { newmode: 'newmode_lbl', ... };
   const MODE_DRAG_LABEL = { newmode: 'drag_label_newmode', ... };
   const MODE_WON = { newmode: 'sub_newmode_won', ... };
   const MODE_LOST = { newmode: 'sub_newmode_lost', ... };
   ```

2. **Add mode logic** to `buildPool()` in `game.js`:
   ```javascript
   } else if (mode === 'newmode') {
     pool = [...CARDS, ...INTERVALS].filter(c => 
       Array.isArray(c.tags) && c.tags.includes('newmode_tag')
     );
   } else {
   ```

3. **Add translations** in `i18n.js`:
   ```javascript
   en: {
     newmode_lbl: 'New Mode',
     drag_label_newmode: 'Drag instruction...',
     sub_newmode_won: 'Victory message',
     sub_newmode_lost: 'Defeat message',
     mc_newmode_title: 'Mode Title',
     mc_newmode_desc: 'Mode description',
     ...
   },
   pt: { /* Same keys, Portuguese values */ }
   ```

4. **Add UI elements** in `index.html`:
   - Mode card in intro screen or cultures screen
   - Button with `onclick="selectMode('newmode'); selectLives(true); startGame()"`
   - Title, description, icon

5. **Update mode selection** in `ui.js`:
   ```javascript
   function selectMode(m) {
     // Add newmode case
     document.getElementById('mc-newmode').classList.toggle('selected', m === 'newmode');
   }
   ```

6. **Tag relevant cards** in `cards.js`:
   - Add `tags: ['newmode_tag']` to appropriate cards/intervals

**Testing**:
- Verify pool builds correctly (console.log deck size)
- Test Lives and Free modes
- Test win and loss conditions
- Verify all translated strings appear
- Test language switching
- Check gameover screen messages

### Modifying the Scoring System

**Location**: `src/game.js`, `attemptPlacement()` function

**Current formula**:
```javascript
const basePoints = isInterval(card)
  ? Math.min(30, 10 + Math.floor((card.endYear - card.startYear) / 100))
  : 10;
score += basePoints + streak * 2;
```

**When modifying**:
- Consider impact on existing trophies (Iron Mind: 500+ points, etc.)
- Test extensively with different strategies
- Update trophy thresholds if needed
- Document reasoning in commit message
- Update REPOSITORY_SUMMARY.md scoring section

**Balance considerations**:
- Average game (30 cards, moderate streaks) should reach ~400-600 points
- High-skill game (50+ cards, long streaks) should reach 1000+ points
- Empires mode naturally scores higher (longer bonuses)

### Adding a New Trophy

**Location**: `src/trophies.js`, `TROPHY_DEFS` array

```javascript
{
  id: 'unique_trophy_id',
  icon: '🏆',
  name: 'Trophy Name',
  name_pt: 'Nome do Troféu',
  desc: 'Short unlock description',
  desc_pt: 'Descrição curta',
  hint: 'Detailed unlock requirements for locked trophy',
  hint_pt: 'Requisitos detalhados em português',
  trivia: 'Fascinating historical trivia revealed on unlock (4-6 sentences)',
  trivia_pt: 'Curiosidade histórica fascinante (4-6 frases)',
  
  // Option 1: Card-based trophy
  needed: ['Card Name 1', 'Card Name 2', 'Card Name 3'],
  
  // Option 2: Special condition trophy
  needed: null,
  special: 'special_condition_name'
}
```

**For card-based trophies**:
- Use exact card names (as they appear in `card.name`, not `card.name_pt`)
- Trophy unlocks when ALL listed cards are in timeline at game end
- Example: `needed: ['Julius Caesar', 'Augustus', 'Cleopatra']`

**For special condition trophies**:
- Add check logic in `game.js`, `checkTrophies()` function:
  ```javascript
  } else if (def.special === 'your_condition') {
    earned = /* your check logic */;
  } else if (def.special === 'score_500') {
  ```
- Examples: score thresholds, streak milestones, compendium completion, etc.

**Writing trivia**:
- 4-6 sentences of interesting historical context
- Connect to the achievement theme (e.g., Vienna Crossover talks about who lived in Vienna)
- Include surprising facts or lesser-known details
- Avoid dry encyclopedic tone (aim for "Did you know?" style)
- Cite specific numbers, dates, quotes when possible

**Testing**:
- Play game and meet unlock condition
- Verify toast appears with icon and name
- Open trophy panel, verify modal shows trivia
- Switch language, verify all text translates
- Check that trophy saves to localStorage (refresh page)

### Fixing a Bug

**Diagnosis process**:
1. Reproduce bug consistently
2. Check browser console for errors
3. Identify which file contains the bug (state, game, ui, i18n, etc.)
4. Add `console.log()` statements to trace execution
5. Verify localStorage state if persistence is involved

**Common bug locations**:
- **Placement validation**: `game.js`, `attemptPlacement()`
- **Rendering issues**: `ui.js`, `renderTimeline()`, `renderCP()`, etc.
- **Translation missing**: `i18n.js`, `S` object
- **State not persisting**: Check `localStorage.setItem()` calls
- **Trophy not unlocking**: `game.js`, `checkTrophies()`

**Fix process**:
1. Write minimal fix (don't refactor unrelated code)
2. Test fix in relevant game mode(s)
3. Test in both languages
4. Test on mobile if UI-related
5. Increment service worker version if files changed
6. Document fix in commit message

**Example commit messages**:
- `fix: placement validation for intervals with equal start years`
- `fix: compendium search not filtering by Portuguese names`
- `fix: trophy toast queue overlapping when multiple unlocked`

### Improving Performance

**Known bottlenecks** (current performance is good, but for future scaling):

1. **Timeline rendering** (`ui.js`, `renderTimeline()`):
   - Currently: Full innerHTML rebuild every time
   - If slow (100+ cards): Implement incremental updates
   - Use document fragments for batch DOM insertion

2. **Compendium filtering** (`ui.js`, `renderCP()`):
   - Currently: Filters entire array on every keystroke
   - If slow (2000+ cards): Add debouncing to search input
   - Consider virtual scrolling for very long lists

3. **cards.js size**:
   - Currently: ~2787 lines, 1200+ cards
   - At 3000+ cards: Consider chunking by era/mode (lazy load)
   - Keep data structure simple (plain objects, no nested complexity)

4. **localStorage usage**:
   - Currently: ~200-300 KB total
   - If quota exceeded: Implement cleanup (delete old history entries)
   - Consider IndexedDB for very large datasets (10,000+ history entries)

**Optimization guidelines**:
- Profile first (browser DevTools Performance tab)
- Don't optimize prematurely (current code is fast enough)
- Prefer readability over micro-optimizations
- Test on low-end mobile devices if performance-critical

### Updating Translations

**Location**: `src/i18n.js`, `S` object

**Adding new strings**:
1. Add key-value pairs to both `en` and `pt` objects:
   ```javascript
   const S = {
     en: { new_key: 'English text', ... },
     pt: { new_key: 'Texto em português', ... }
   };
   ```

2. Use in code:
   ```javascript
   document.getElementById('element-id').textContent = t('new_key');
   ```

3. If dynamic (inside functions), ensure `_applyAllTranslations()` updates it on language switch

**Translation guidelines**:
- Keep strings concise (UI space is limited)
- Match tone: casual and friendly (not formal)
- Preserve meaning over literal translation
- Test in both languages (some Portuguese words are longer)
- For card content, maintain educational value

**Common translation patterns**:
- Buttons: Imperative verbs ("Begin" / "Começar", "Close" / "Fechar")
- Labels: Nouns ("Score" / "Pontos", "Streak" / "Sequência")
- Messages: Full sentences ("All cards placed!" / "Todas as cartas colocadas!")

**Portuguese-specific notes**:
- Use European Portuguese conventions for dates if applicable
- Brazilian Portuguese is primary (project author is Brazilian)
- Avoid overly formal language (use "você", not "vós")

### Working with Service Worker

**Location**: `sw.js`

**Cache version management**:
```javascript
const CACHE = 'chronos-v4';  // Increment on every deploy
```

**When to increment**:
- ANY file in FILES array changes (HTML, JS, manifest, icons)
- New features added
- Bugs fixed in cached files
- Don't increment for: localStorage data changes, server-side only changes (none in this project)

**Cache strategy**:
- Install: Pre-cache all files
- Activate: Delete old caches
- Fetch: Cache-first, network fallback

**Debugging**:
- Chrome DevTools → Application → Service Workers
- Unregister old workers if testing
- Use "Update on reload" during development
- Check Cache Storage to verify files

**Common issues**:
- **Stale cache**: User sees old version
  - Solution: Increment CACHE version, user will update on next visit
- **Files not cached**: Check FILES array includes them
- **Cache too large**: Exclude large files (like bgm.js), rely on browser cache

---

## Architecture Principles

### Data Flow
```
User Input (DOM events)
  ↓
UI handlers (src/ui.js)
  ↓
Game logic functions (src/game.js)
  ↓
State updates (src/state.js variables)
  ↓
Render functions (src/ui.js)
  ↓
DOM updates (visible to user)
```

**Key rule**: Never skip layers. UI should never directly modify game state; game logic should never directly manipulate DOM.

### File Responsibilities

| File | Responsible For | NOT Responsible For |
|------|----------------|---------------------|
| `src/state.js` | Variable declarations, initial values | Logic, calculations, rendering |
| `src/cards.js` | Historical content (data only) | Game mechanics, UI |
| `src/trophies.js` | Trophy definitions, check logic | Rendering, state management |
| `src/game.js` | Game rules, scoring, lifecycle | DOM manipulation, translations |
| `src/ui.js` | Rendering, animations, interactions | Game rules, content data |
| `src/i18n.js` | Translations, language switching | Game logic, state management |
| `src/bgm.js` | Background music data | Volume controls (in ui.js) |
| `src/sfx.js` | Sound effects engine | When to play sounds (in game.js/ui.js) |
| `sw.js` | Caching, offline support | Game logic, content |

### Naming Conventions

**Variables**:
- `gameMode` - camelCase for regular variables
- `_pendingDraw` - leading underscore for internal/private variables
- `ERA_COLORS` - UPPER_SNAKE_CASE for constants

**Functions**:
- `startGame()` - camelCase for public functions
- `_seededRNG()` - leading underscore for internal helpers
- `showFact()` - verb-first for actions
- `renderTimeline()` - "render" prefix for DOM rendering

**DOM IDs**:
- `hand-card` - kebab-case
- `timeline-area` - descriptive, not generic
- `hp-tab-streak` - prefixes for grouped elements (hp = history panel)

**CSS Classes**:
- `.timeline-card` - component name
- `.active` - state modifier
- `.empires-border` - mode-specific styling

### Code Comments

**When to comment**:
- Complex algorithms (seeded RNG, streak calculation)
- Non-obvious business logic (scoring formulas, trophy conditions)
- File headers (ASCII art section dividers in game.js, ui.js)
- Workarounds for browser quirks

**When NOT to comment**:
- Obvious code (`// Increment score` before `score++`)
- Self-documenting function names
- Standard DOM manipulation
- Simple variable assignments

**Comment style**:
```javascript
// ── SECTION HEADER ─────────────────────────────────────────────────────────

// Single-line explanation
function doSomething() { ... }

/* Multi-line explanation
   for complex logic that needs
   more context */
```

---

## Testing Guidelines

### Manual Testing Checklist

**Every feature change**:
- [ ] Test in all relevant game modes
- [ ] Test with Lives mode enabled
- [ ] Test with Free mode (no lives)
- [ ] Switch language mid-test
- [ ] Switch theme (dark/light)
- [ ] Test on desktop (mouse)
- [ ] Test on mobile (touch)

**After adding/modifying cards**:
- [ ] Card appears in correct game mode(s)
- [ ] Card sorts correctly in timeline
- [ ] Facts display in both languages
- [ ] Clues reveal progressively (if using hints)
- [ ] Compendium entry shows correctly
- [ ] Card name translates in language switch

**After modifying game logic**:
- [ ] Scoring calculates correctly
- [ ] Streak increments/resets correctly
- [ ] Lives decrement in Lives mode
- [ ] Game ends at 0 lives or deck empty
- [ ] Hint/skip buttons enable/disable correctly
- [ ] Daily challenge uses seeded shuffle

**After UI changes**:
- [ ] Layout doesn't break on narrow screens
- [ ] Animations play smoothly
- [ ] Drag-and-drop works on touch
- [ ] Panels open/close correctly
- [ ] Buttons have clear hover/active states
- [ ] Text is readable in both themes

**Before committing**:
- [ ] No console errors
- [ ] Service worker cache version incremented
- [ ] All changed files saved
- [ ] Tested in at least 2 browsers
- [ ] Commit message is descriptive

### Browser Testing Targets

**Primary**:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest, Mac/iOS)

**Secondary**:
- Chrome Mobile (Android)
- Samsung Internet
- Opera

**Known issues**:
- Safari: May need manual reload for service worker updates
- Mobile browsers: Drag-and-drop may feel less responsive (inherent to web)

### Device Testing

**Desktop**:
- 1920×1080 (most common)
- 1366×768 (common laptop)
- 2560×1440 (high-res)

**Mobile**:
- iPhone 12/13/14 (390×844)
- iPhone SE (375×667)
- Android mid-size (360×740)
- iPad (768×1024)

**Responsive breakpoints** (check index.html CSS):
- 768px: Tablet portrait
- 480px: Phone landscape
- No specific breakpoints: Flexbox adapts naturally

---

## Content Guidelines

### Historical Accuracy Standards

**Required**:
- Cross-reference dates with at least 2 reputable sources
- Use consensus dates when exact dates are disputed
- Note uncertainty in facts when appropriate ("likely", "estimated", "around")

**Acceptable sources**:
- Academic history books
- Britannica, Encyclopedia.com
- University history department websites
- Peer-reviewed journal articles
- Well-maintained Wikipedia articles (verify with second source)

**Avoid**:
- Unsourced claims
- Fringe theories without mainstream acceptance
- Politically charged interpretations (stick to facts)
- Anachronistic terms (don't call ancient people "terrorists", etc.)

### Writing Style for Facts

**Good examples**:
- "Julius Caesar was assassinated by 23 senators on the Ides of March, 44 BCE. His last words were disputed: some sources claim 'Et tu, Brute?', while others report Greek: 'καὶ σύ, τέκνον' (You too, child?)."
- "The Library of Alexandria was not destroyed in a single dramatic fire as popularly believed, but gradually declined over centuries due to funding cuts and political neglect."

**Bad examples**:
- "Julius Caesar died in 44 BCE." (Too dry, no context)
- "Caesar was the greatest Roman ever! His assassination was tragic!" (Too opinionated)
- "Caesar invented the Julian calendar." (Incomplete - he reformed the existing calendar, didn't invent calendars)

**Guidelines**:
- Start with the most interesting fact
- Include surprising details or common misconceptions
- Connect events to broader context
- Use specific numbers, dates, quotes when possible
- Aim for 2-4 sentences per fact
- Write for a curious adult reader (not children, not academics)

### Cultural Sensitivity

**Do**:
- Use historically accurate names (Constantinople until 1453, then Istanbul)
- Acknowledge multiple perspectives (colonialism, wars, revolutions)
- Respect religious content (Biblical mode should be respectful to believers and scholars)
- Use people's preferred names when known (Muhammad, not Mohammed)

**Don't**:
- Impose modern values on historical contexts
- Use slurs or derogatory terms (even if historically used)
- Make light of atrocities (Holocaust, genocides, slavery)
- Favor one culture's perspective as "correct"

**When in doubt**: Frame facts neutrally, include multiple viewpoints, focus on "what happened" over "what it means."

---

## Git Workflow

### Commit Message Format

```
type: brief description (50 chars max)

Optional longer description explaining why this change
was needed, what problem it solves, and any important
context for future developers.

Resolves: #issue-number (if applicable)
```

**Types**:
- `feat`: New feature (new mode, new trophy, new cards)
- `fix`: Bug fix
- `chore`: Maintenance (version bump, refactoring)
- `docs`: Documentation only
- `style`: Formatting, whitespace (no logic change)
- `test`: Testing only
- `content`: Card additions or corrections

**Examples**:
- `feat: add Eastern civilization game mode`
- `fix: timeline rendering breaks with 100+ cards`
- `chore: increment service worker cache to v5`
- `content: add 15 new Medieval Europe cards`

### Branching Strategy

**Current**: Direct commits to `main` (solo project)

**If project grows**:
- `main`: Stable, deployed version
- `develop`: Integration branch
- `feature/feature-name`: New features
- `fix/bug-description`: Bug fixes

### Versioning

**No semantic versioning currently** - service worker cache version is the de facto version.

**If implementing versioning**:
- Major: Incompatible changes (localStorage schema change, etc.)
- Minor: New features (new mode, major UI overhaul)
- Patch: Bug fixes, card additions

---

## Deployment

### Current Deployment Method

**Manual** (assumed):
1. Edit files locally
2. Test thoroughly
3. Increment `sw.js` cache version
4. Commit to git
5. Upload files to web hosting / push to GitHub Pages

### Pre-Deployment Checklist

- [ ] All files saved
- [ ] Service worker cache version incremented
- [ ] No console errors in browser
- [ ] Tested in multiple browsers
- [ ] Mobile testing completed
- [ ] Git commit created with descriptive message
- [ ] No sensitive data in localStorage (N/A for this project)

### Post-Deployment Verification

- [ ] Website loads correctly
- [ ] Service worker activates (check DevTools)
- [ ] New features work as expected
- [ ] Old features still work (no regressions)
- [ ] Language switching works
- [ ] Theme switching works
- [ ] Daily challenge updates correctly

### Rollback Procedure

**If deployment breaks**:
1. Revert files to previous version
2. Decrement service worker cache version (or skip version number)
3. Re-deploy quickly
4. Users will auto-update on next visit (may need to clear cache if urgent)

**Note**: No database or server-side state to worry about. All user data is client-side localStorage.

---

## Troubleshooting Common Issues

### Issue: Cards not appearing in deck

**Possible causes**:
1. Card mode tags don't match selected mode
2. Card era doesn't match selected era filter
3. Pool building logic filtering out card
4. Card data has syntax error (breaks entire CARDS/INTERVALS array)

**Debug**:
```javascript
// Add to initGame() after buildPool()
console.log('Pool size:', pool.length);
console.log('Deck size:', deck.length);
console.log('Sample cards:', deck.slice(0, 5).map(c => c.name));
```

### Issue: Translations not appearing

**Possible causes**:
1. Translation key missing in S object
2. Key name mismatch (typo)
3. Language switch not triggering re-render
4. Element not updated in _applyAllTranslations()

**Debug**:
```javascript
// Check if key exists
console.log(t('your_key'));  // Should not return 'your_key'

// Check current language
console.log('Current lang:', lang);
```

### Issue: Trophy not unlocking

**Possible causes**:
1. Card names in `needed` array don't match exactly (check case, punctuation)
2. Special condition logic is wrong
3. Trophy already earned (check earnedTrophies object)
4. checkTrophies() not called at game end

**Debug**:
```javascript
// Add to checkTrophies()
console.log('Placed cards:', placed);
console.log('Needed cards:', def.needed);
console.log('Has all needed:', def.needed.every(n => placed.indexOf(n) >= 0));
```

### Issue: Service worker not updating

**Possible causes**:
1. Cache version not incremented
2. Browser aggressively caching sw.js itself
3. Service worker in broken state

**Fix**:
1. Hard refresh (Ctrl+Shift+R / Cmd+Shift+R)
2. DevTools → Application → Service Workers → Unregister
3. Clear site data in DevTools
4. Reload page

### Issue: localStorage quota exceeded

**Rare** (would require 1000+ game history entries)

**Fix**:
1. Implement cleanup in game.js:
   ```javascript
   if (gameHistory.length > 30) {
     gameHistory = gameHistory.slice(0, 30);
   }
   ```
2. Add user-facing "Clear History" button
3. Graceful try-catch around localStorage.setItem() (already present)

### Issue: Drag-and-drop not working

**Possible causes**:
1. Pointer events not supported (very old browser)
2. `isDragging` state stuck
3. Event listeners not attached

**Debug**:
1. Check console for errors
2. Verify `ghost` element exists in DOM
3. Test click-to-place as alternative (should work even if drag fails)

---

## Performance Benchmarks

**Current performance** (as of v4):
- Page load (first visit): ~500ms
- Page load (cached): <100ms
- Language switch: <50ms (instant)
- Timeline render (50 cards): <20ms
- Compendium filter (1200 cards): <30ms
- Daily challenge seed + shuffle: <5ms

**Acceptable thresholds**:
- Timeline render: <100ms (up to 200 cards)
- Language switch: <100ms (should feel instant)
- Search/filter: <50ms per keystroke
- Animation frame rate: 60fps (16.6ms per frame)

**If performance degrades**:
1. Profile with browser DevTools
2. Identify bottleneck (rendering, logic, or data)
3. Optimize hot path only (don't optimize everything)
4. Re-test and verify improvement

---

## Future Roadmap Ideas

*(Not commitments, just ideas for potential expansion)*

### Content Expansion
- Add African history mode (currently underrepresented)
- Add Pre-Columbian Americas mode
- Add Scientific Discoveries mode
- More granular era filters (Early Medieval vs High Medieval)
- User-submitted cards (with moderation queue)

### Gameplay Features
- Multiplayer: Async turn-based (compete on same deck)
- Time Trial mode: Place as many as possible in 5 minutes
- Endless mode: Infinite deck, see how long streak lasts
- Custom difficulty: Adjust hint availability, point scaling
- Zen mode: No score, no streaks, pure learning

### Educational Features
- "Why" explanations: Show why a placement is correct/incorrect with historical context
- Timeline visualization: Zoom out to see full timeline with all eras
- Card connections: Show related cards ("Also happened around this time...")
- Study mode: Spaced repetition algorithm for learning specific cards
- Quiz mode: Multiple choice for dates instead of drag-drop

### UI/UX Improvements
- Timeline zoom levels (compact vs detailed view)
- Keyboard shortcuts for power users
- Better mobile gestures (swipe to place?)
- Achievements page with stats (cards placed per era, accuracy rate)
- Card favorites/bookmarks

### Technical Improvements
- Add unit tests (Jest or similar)
- TypeScript types (optional, without build step)
- Accessibility: Full ARIA labels, keyboard navigation
- Analytics: Privacy-respecting usage tracking (localStorage-based)
- Export timeline as image/PDF

---

## FAQs for AI Agents

### Q: Should I add TypeScript?
**A**: No. The project philosophy is zero build steps. Vanilla JS is intentional.

### Q: Should I add a CSS framework (Tailwind, Bootstrap)?
**A**: No. Keep inline styles and minimal custom CSS. No external dependencies.

### Q: Should I refactor to React/Vue/Svelte?
**A**: Absolutely not. Vanilla JS is a core principle. The codebase is simple enough that frameworks would add complexity, not reduce it.

### Q: Can I use modern JS features (ES2020+)?
**A**: Yes, if widely supported. Check caniuse.com. Avoid very new features (ES2023+) that require transpilation.

### Q: Should I split cards.js into multiple files?
**A**: Not yet. src/cards.js is large but manageable. Only split if approaching 5000+ lines or if load time becomes measurably slow.

### Q: Can I add a backend server?
**A**: No. The game is intentionally client-side only. No servers, no APIs, no databases.

### Q: Should I add user accounts / cloud sync?
**A**: Not without very good reason. localStorage is sufficient. Cloud sync would require backend (see previous Q).

### Q: Can I use localStorage for large data (10+ MB)?
**A**: No. Stay under 5 MB total. If data grows beyond that, refactor to IndexedDB.

### Q: Should I optimize card data format to save space?
**A**: Not yet. Readability > size until cards.js approaches 1 MB. Currently ~200-300 KB (acceptable).

### Q: Can I use external images instead of base64?
**A**: Only if cached by service worker. Prefer base64 for icons/small images. External images risk offline breakage.

### Q: Should I add a card editor UI?
**A**: Interesting idea, but low priority. Direct editing of cards.js is fine for now. Could be future feature.

### Q: Should I add animation libraries (GSAP, anime.js)?
**A**: No. CSS transitions and simple JS are sufficient. Don't add dependencies.

### Q: Can I reorganize file structure (src/, dist/, etc.)?
**A**: The project now uses organized folders (src/, assets/, docs/) while maintaining the vanilla JS philosophy. The structure balances simplicity with scalability. No build step required.

### Q: Should I add ESLint / Prettier?
**A**: Optional. If added, configure to match existing style. Don't enforce new conventions.

### Q: Can I add service worker push notifications?
**A**: Interesting idea (remind user to do daily challenge), but requires careful UX. Not a priority.

### Q: Should I add Google Analytics or similar?
**A**: Developer decision. If added, must be privacy-respecting and GDPR-compliant. Consider localStorage-based analytics only.

---

## Code Quality Standards

### Acceptable
- Functions up to ~100 lines (if cohesive)
- Some code duplication (DRY is not absolute)
- Inline styles for dynamic values
- Long if-else chains for mode selection
- Global variables (they're in state.js for a reason)
- Manual DOM manipulation (no virtual DOM needed)

### Not Acceptable
- Unreadable variable names (x, foo, tmp, etc.)
- Commented-out code (delete it, git history exists)
- console.log() left in production code (use for debugging only)
- Copy-pasted code that could be a function (if used 3+ times)
- Magic numbers without explanation (what is 20? why 20?)
- Modifying built-in prototypes (Array.prototype, etc.)

### Encouraged
- Small, focused functions (do one thing well)
- Clear variable names (gameMode, currentCard, streak)
- Comments for complex logic
- Consistent code style (match existing patterns)
- Early returns to reduce nesting
- Guard clauses (check conditions at start of function)

---

## Communication with Developer

When suggesting changes, structure your response:

1. **Summary**: One-sentence description of what you're proposing
2. **Why**: Explain the problem this solves or benefit it provides
3. **How**: Technical implementation details
4. **Trade-offs**: What complexity does this add? What are alternatives?
5. **Testing**: How to verify the change works
6. **Migration**: Does existing data need updating? Do users need to clear cache?

**Example**:
```
Summary: Add keyboard shortcut (Esc) to close all panels

Why: Improves user experience for power users and accessibility

How: Add document-level keydown listener that checks for Escape key,
then calls closeFact(), closeConfirm(), etc.

Trade-offs: Adds ~10 lines of code. Minimal complexity. Alternative
would be per-panel listeners (more code, same effect).

Testing: Open each panel, press Esc, verify it closes

Migration: None needed (pure UI enhancement)
```

---

## Final Notes

- **Prefer simplicity**: When in doubt, choose the simpler solution
- **Respect the vision**: This is a passion project with clear design principles
- **Think long-term**: Will this be maintainable in 2 years? 5 years?
- **Test thoroughly**: A bug caught locally is 10× easier to fix than one in production
- **Learn from history**: The game teaches history - the codebase should too (readable, documented, clear)

**Most importantly**: Have fun! This project is about celebrating history and making learning engaging. Your contributions should reflect that joy and curiosity.

---

*This guide was written for AI assistants helping with the Chronos codebase. Last updated: 2026-04-09*
