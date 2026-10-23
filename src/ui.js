// ── ui.js ────────────────────────────────────────────────────────────────
// All UI rendering, panel management, drag/drop, and audio controls.
// Depends on: state.js, i18n.js, game.js (cardYear, isInterval, etc.)
// ─────────────────────────────────────────────────────────────────────────

// ── ERA COLORS ────────────────────────────────────────────────────────────


function selectMode(m){
  gameMode=m;
  document.getElementById('mc-classic').classList.toggle('selected',m==='classic');
  document.getElementById('mc-empires').classList.toggle('selected',m==='empires');
  document.getElementById('mc-characters').classList.toggle('selected',m==='characters');
  // Era filter only relevant for classic & empires & characters modes
  const showEra=(m==='classic'||m==='empires'||m==='characters');
  document.getElementById('era-section').style.display=showEra?'':'none';
}
function selectLives(on){
  menuPlayMode=on?'lives':'free';
  syncPlayModeButtons();
}
// Review is picked only when a deck can be built for the current mode/filter;
// otherwise a brief notice says why and the choice stays as it was
function selectReview(){
  var av=reviewAvailability(gameMode, eraSelection);
  if(!av.ok){ _reviewBlockedNotice(av.reason); return; }
  menuPlayMode='review';
  syncPlayModeButtons();
}
function _reviewBlockedNotice(reason){
  queueNotice({ text: reason==='level' ? t('review_locked').replace('{n}',REVIEW_MIN_LEVEL) : t('review_empty') });
}
// Main-menu play mode buttons follow menuPlayMode; Review shows a lock below its level
function syncPlayModeButtons(){
  document.getElementById('lo-lives').classList.toggle('active',menuPlayMode==='lives');
  document.getElementById('lo-review').classList.toggle('active',menuPlayMode==='review');
  document.getElementById('lo-free').classList.toggle('active',menuPlayMode==='free');
  document.getElementById('lo-review').classList.toggle('locked',playerLevelInfo().level<REVIEW_MIN_LEVEL);
}
// Era chips are multi-select: each era toggles on/off. An empty selection
// means every era is in the deck.
function selectEra(era){
  if(eraSelection.includes(era)) eraSelection=eraSelection.filter(e=>e!==era);
  else eraSelection=eraSelection.concat(era);
  syncEraChips();
}
function syncEraChips(){
  document.querySelectorAll('#era-section .era-chip').forEach(c=>{
    c.classList.toggle('active', eraSelection.includes(c.dataset.era));
  });
}
function startGame(){
  // Mode or era filter may have changed since Review was picked
  if(menuPlayMode==='review'){
    var av=reviewAvailability(gameMode, eraSelection);
    if(!av.ok){ _reviewBlockedNotice(av.reason); return; }
  }
  _isDailyChallenge=false; _isRecoverRun=false;
  setPlayMode(menuPlayMode);
  eraFilter=eraSelection.slice();
  var _hBtnR=document.getElementById('hint-btn');
  var _sBtnR=document.getElementById('skip-btn');
  if(_hBtnR) _hBtnR.style.display='';
  if(_sBtnR) _sBtnR.style.display='';
  document.getElementById('intro').classList.remove('show');
  const cs=document.getElementById('cultures-screen');
  if(cs) cs.classList.remove('show');
  initGame();
}
function updateIntroHistBtn(){
  // Always show hub buttons — they work even without history
  const ib=document.getElementById('intro-btns');if(ib)ib.style.display='flex';
}
let _fromGameover=false;
var _currentFactCard=null; // tracks which card the fact panel is showing
function showIntro(){
  setRunTheme(null);   // back to the player's own theme
  const cs = document.getElementById('cultures-screen');
  if(cs) cs.classList.remove('show');
  document.getElementById('gameover').classList.remove('show');
  document.getElementById('intro').classList.add('show');
  _lastDailyResult=null; _hideDailyGameoverBtns();
  updateIntroHistBtn();
  syncPlayModeButtons();   // the level may have unlocked Review since last time
}
function restartGame(){
  _voluntaryEnd=false; _pendingGameRecord=null;
  currentCard=null; reviewMode=false;
  _lastDailyResult=null; _hideDailyGameoverBtns();
  // Hide gameover and close any open panels immediately
  document.getElementById('gameover').classList.remove('show');
  var _fp2=document.getElementById('fact-panel');
  if(_fp2){_fp2.classList.remove('open');_fp2.classList.remove('review-mode');_popNavState('fact');}
  // If last game was a culture mode, go back to cultures hub
  if(gameMode==='abrahamic'||gameMode==='roman'||gameMode==='eastern'){
    selectCultureMode(gameMode);
    cultureLivesMode=playMode!=='free';
    document.getElementById('clo-lives').classList.toggle('active', cultureLivesMode);
    document.getElementById('clo-free').classList.toggle('active', !cultureLivesMode);
    openCultures();
  } else {
    showIntro();
  }
}

// ── CONFIRM END ───────────────────────────────────────────────────────────
function confirmEnd(){
  if(!gameActive)return;
  openConfirm(t('end_title'),t('end_body'),t('keep_playing'),t('end_run'),function(){ _voluntaryEnd=true; endGame(false); });
}
// The End-run dialog, reused for other confirmations (logout). The confirm
// button runs onOk after closing; the inline doEndRun() stays as a fallback.
function openConfirm(title,body,cancelLbl,okLbl,onOk){
  document.getElementById('cd-title').textContent=title;
  document.getElementById('cd-body').textContent=body;
  document.getElementById('cd-cancel').textContent=cancelLbl;
  var ok=document.getElementById('cd-end');
  ok.textContent=okLbl;
  ok.onclick=function(){ closeConfirm(); onOk(); };
  document.getElementById('confirm-dialog').classList.add('show');
}
function closeConfirm(){document.getElementById('confirm-dialog').classList.remove('show');}
function doEndRun(){closeConfirm();_voluntaryEnd=true;endGame(false);}

// ── GAME INIT ─────────────────────────────────────────────────────────────
function drawCard(){
  if(!deck.length){endGame(true);return;}
  currentCard=deck.pop();
  cardCluesUsed=0;
  renderHandCard();
  saveRun();
}
// Shows currentCard in the hand — also for a card restored by resumeSavedRun,
// which keeps its revealed clues
function renderHandCard(){
  const c=currentCard;
  const iv=isInterval(c);
  document.getElementById('hc-name').textContent=cName(c);
  document.getElementById('hc-cat').textContent=iv?'':cCat(c);
  document.getElementById('hc-era').textContent='';
  document.getElementById('hc-hint').textContent=cHint(c);
  document.getElementById('hc-bar').style.background='rgba(201,168,76,0.25)';
  document.getElementById('hand-card').className=playMode==='free'?'free-border':(playMode==='review'?'review-border':cardFrameClass());
  document.getElementById('ghost').className=cardFrameClass();
  // Interval-specific fields
  const spanEl=document.getElementById('hc-span');
  const regionEl=document.getElementById('hc-region');
  spanEl.style.display=iv?'block':'none';
  regionEl.style.display=iv?'block':'none';
  if(iv){
    spanEl.textContent='?? – ?? · place to reveal dates';
    regionEl.textContent=cRegion(c)||'';
  }
  document.getElementById('g-name').textContent=cName(c);
  document.getElementById('g-cat').textContent=iv?'':cCat(c);
  document.getElementById('score-val').textContent=score;
  document.getElementById('streak-val').textContent=streak;
  // Clue display: blank, or the last clue revealed
  const clueEl=document.getElementById('hc-clue');
  const clues=cClues(c);
  if(cardCluesUsed>0&&clues&&clues[cardCluesUsed-1]){clueEl.textContent='💡 '+clues[cardCluesUsed-1];clueEl.classList.add('show');}
  else{clueEl.textContent='';clueEl.classList.remove('show');}
  renderSideBtns();
}
function renderLives(){
  const v=document.getElementById('lives-val');
  if(v)v.textContent=lives;
}
function renderTimeline(){
  const el=document.getElementById('timeline');el.innerHTML='';
  el.appendChild(makeDZ(0));
  timeline.forEach((card,idx)=>{el.appendChild(makeTCard(card,idx));el.appendChild(makeDZ(idx+1));});
  // Show empty state hint when timeline is empty
  if(timeline.length===0){
    const hint=document.createElement('div');
    hint.style.cssText='text-align:center;color:rgba(201,168,76,.3);font-family:Inter,sans-serif;font-size:.75rem;letter-spacing:.1em;text-transform:uppercase;padding:60px 20px;pointer-events:none;user-select:none';
    hint.textContent='↑ Drop your first card here';
    el.appendChild(hint);
  }
}
// Runs with lives, in every game mode (daily included), dress the cards in
// the player's profile frame (.cf-<style> in CSS); the default Classic frame
// is the base card look. Free and Review show their mode colour instead.
function cardFrameClass(){
  if(playMode!=='lives')return '';
  const f=selectedCustom('frame');
  return f.style==='classic'?'':'cf-'+f.style;
}
function makeTCard(card,idx){
  const d=document.createElement('div');
  const iv=isInterval(card);
  const color=ERA_COLORS[card.era]||'#9a6abf';
  // Framed runs drop the purple interval border: the frame wins on every card
  const fc=cardFrameClass();
  d.className='timeline-card'+(iv&&playMode!=='lives'?' interval-card':'')+(fc?' '+fc:'');
  if(iv){
    const dur=card.endYear-card.startYear;
    const durStr=dur>0?`${dur} yrs`:'';
    d.innerHTML=`<div class="tc-dot" style="background:${color}"></div><div class="tc-info"><div class="tcard-name">${cName(card)}</div><div class="tc-meta tc-region">${cRegion(card)||card.era}</div></div><div class="tc-span">${formatYear(card.startYear)} – ${formatYear(card.endYear)}</div><div class="tc-peek">ℹ</div>`;
  } else {
    d.innerHTML=`<div class="tc-dot" style="background:${color}"></div><div class="tc-info"><div class="tcard-name">${cName(card)}</div><div class="tc-meta">${card.era} · ${cCat(card)}</div></div><div class="tc-year">${formatYear(card.year)}</div><div class="tc-peek">ℹ</div>`;
  }
  d.addEventListener('click',()=>{
    const fp=document.getElementById('fact-panel');
    if(fp&&fp.classList.contains('open')&&!reviewMode){
      // Post-placement trivia is open; preserve pending draw, then show review
      _pendingDraw=true;
      fp.classList.remove('open');
      fp.classList.remove('review-mode');
      _currentFactCard=null;
      reviewMode=false;
    }
    reviewCard(card);
  });
  return d;
}
function makeDZ(idx){
  const d=document.createElement('div');d.className='drop-zone';d.dataset.index=idx;
  d.setAttribute('data-label',t('drop_here'));
  const line=document.createElement('div');line.className='dz-line';d.appendChild(line);
  d.addEventListener('click',(e)=>{
    const fp=document.getElementById('fact-panel');
    if(fp&&fp.classList.contains('open')){closeFact();return;}
    if(!isDragging&&currentCard){_justPlaced=true;setTimeout(()=>{_justPlaced=false;},0);attemptPlacement(idx);}
  });
  return d;
}

// ── HINTS & SKIP ─────────────────────────────────────────────────────────
function renderSideBtns(){
  const visible=timeline.length>0; // only show after first card placed
  // Hint button — disabled if no hints left in pool OR card already showed 3
  const hBtn=document.getElementById('hint-btn');
  hBtn.classList.toggle('visible',visible);
  hBtn.disabled=(!currentCard||!gameActive||hints<=0||(cardCluesUsed>=3&&!playModeRules().clueLoop));
  document.getElementById('hint-count').textContent=isFinite(hints)?hints:'∞';
  // Dots show hints remaining in pool (up to 3 dots max for visual)
  for(let i=0;i<3;i++){
    const dot=document.getElementById('hd'+i);
    if(dot)dot.classList.toggle('used',i<hints);
  }
  // Skip button — only 1 per run
  const sBtn=document.getElementById('skip-btn');
  sBtn.classList.toggle('visible',visible);
  sBtn.disabled=(!currentCard||!gameActive||skip<=0);
  document.getElementById('skip-count').textContent=isFinite(skip)?skip:'∞';
  const hl=document.getElementById('hint-lbl');if(hl)hl.textContent=lang==='pt'?'Pista':'Hint';
  const sl=document.getElementById('skip-lbl');if(sl)sl.textContent=lang==='pt'?'Pular':'Skip';
}
/* ── NOTICE QUEUE ──────────────────────────────────────────────────────────
   Streak rewards and trophy unlocks share one queue and show one at a time,
   so they never stack on top of each other. In-game they sit just below the
   correct/wrong feedback pill (.in-game), which fires at the same moment.
   queueNotice({streak:true}) | queueNotice({trophy:def}) | queueNotice({custom:item})
   | queueNotice({text:'…'}) — a custom notice (customization unlocked)
   uses the trophy toast.
   A text notice uses the streak pill and lasts as long; repeated taps don't
   pile up copies of the same text. */
var _noticeQueue=[], _noticeBusy=false, _noticeShowing=null;
function queueNotice(notice){
  if(notice.text&&((_noticeShowing&&_noticeShowing.text===notice.text)||_noticeQueue.some(function(n){ return n.text===notice.text; }))) return;
  _noticeQueue.push(notice);
  if(!_noticeBusy) _nextNotice();
}
function _nextNotice(){
  var notice=_noticeQueue.shift();
  _noticeShowing=notice||null;
  if(!notice){ _noticeBusy=false; return; }
  _noticeBusy=true;
  var el, ms;
  if(notice.trophy){
    var def=notice.trophy, tier=def.tier&&TROPHY_TIERS[def.tier];
    el=document.getElementById('tp-toast');
    document.getElementById('tp-toast-icon').textContent=def.icon;
    var nm=(lang==='pt'?def.name_pt:def.name)+(tier?' ('+(lang==='pt'?tier.name_pt:tier.name)+')':'');
    document.getElementById('tp-toast-txt').textContent=(lang==='pt'?'Troféu: ':'Trophy: ')+nm+' 🏆';
    el.classList.toggle('in-game', gameActive);
    ms=3200;
  } else if(notice.custom){
    var item=notice.custom;
    el=document.getElementById('tp-toast');
    document.getElementById('tp-toast-icon').textContent=item.cat==='frame'?'🖼️':(item.cat==='title'?titleIcon(item):item.icon);
    document.getElementById('tp-toast-txt').textContent=t('cu_new_'+item.cat).replace('{name}',_nm(item));
    el.classList.toggle('in-game', gameActive);
    ms=3200;
  } else {
    el=document.getElementById('streak-toast');
    el.textContent=notice.text||t('skip_earned');
    ms=2600;
  }
  el.classList.add('show');
  setTimeout(function(){
    el.classList.remove('show');
    setTimeout(_nextNotice, 450); // let the fade-out finish before the next one
  }, ms);
}
function showStreakToast(){ queueNotice({ streak:true }); }

// ── DRAG ──────────────────────────────────────────────────────────────────
var ghost; // assigned in DOMContentLoaded below
function startDrag(e){
  if(!currentCard||!gameActive)return;
  e.preventDefault();isDragging=true;
  SFX.play('pickup');
  ghost.classList.add('visible');
  document.getElementById('hand-card').classList.add('lifting');
  moveGhost(e.clientX,e.clientY);
  document.addEventListener('pointermove',onDrag);
  document.addEventListener('pointerup',endDrag);
}
function onDrag(e){
  if(!isDragging)return;
  moveGhost(e.clientX,e.clientY);
  const area=document.getElementById('timeline-area'),ar=area.getBoundingClientRect();
  if(e.clientY<ar.top+60)area.scrollTop-=8;
  else if(e.clientY>ar.bottom-60)area.scrollTop+=8;
  const dz=dzAt(e.clientX,e.clientY);
  if(currentDropZone&&currentDropZone!==dz)currentDropZone.classList.remove('active');
  if(dz){dz.classList.add('active');currentDropZone=dz;}else currentDropZone=null;
}
function endDrag(e){
  document.removeEventListener('pointermove',onDrag);
  document.removeEventListener('pointerup',endDrag);
  ghost.classList.remove('visible');
  document.getElementById('hand-card').classList.remove('lifting');
  isDragging=false;
  if(currentDropZone){
    currentDropZone.classList.remove('active');
    const idx=parseInt(currentDropZone.dataset.index);
    currentDropZone=null;attemptPlacement(idx);
  }
}
function moveGhost(x,y){ghost.style.left=(x-ghost.offsetWidth/2)+'px';ghost.style.top=(y-ghost.offsetHeight/2-20)+'px';}
function dzAt(x,y){
  for(const dz of document.querySelectorAll('.drop-zone')){
    const r=dz.getBoundingClientRect();
    if(x>=r.left-30&&x<=r.right+30&&y>=r.top-30&&y<=r.bottom+30)return dz;
  }
  return null;
}

var _feedbackTimer=null;
var _justPlaced=false;
var _showPlacedTrivia=true;
(function(){ try{ var v=localStorage.getItem('chronos_placed_trivia'); if(v==='false')_showPlacedTrivia=false; }catch(e){} })();
/* A miss says how far to move without giving the slot away: the direction,
   how many cards to move past (1–2, 3–5, 6–10, more than 10 — never the
   exact count) and the size of the error in years, by order of magnitude.
   Both are shown because they disagree where cards are crowded (5 cards
   can be a few decades) or sparse (1 card can be centuries). `miss` comes
   from attemptPlacement: { dir, cards, years, ranged, span }. */
const MISS_CARD_BANDS=[[2,'1'],[5,'3'],[10,'6'],[Infinity,'11']];
const MISS_YEAR_BANDS=[[10,'years'],[25,'decades2'],[100,'decades'],[250,'centuries2'],[1000,'centuries'],[2500,'millennia2'],[Infinity,'millennia']];
function missMessage(m){
  const head=m.cards<=2&&m.years<10?'hair':m.cards<=2&&m.years<100?'close':m.cards>10||m.years>=1000?'far':'off';
  const dir=t((m.ranged?'miss_started_':'miss_')+m.dir);
  const cards=t(m.dir==='earlier'?'miss_up':'miss_down').replace('{n}',t('miss_c_'+MISS_CARD_BANDS.find(b=>m.cards<=b[0])[1]));
  const why=m.span?t('miss_span'):t('miss_y_'+MISS_YEAR_BANDS.find(b=>m.years<b[0])[1]);
  return { head:t('miss_'+head)+' '+dir, detail:cards+' · '+why };
}
function showFeedback(ok,miss){
  const el=document.getElementById('feedback');el.className='';
  if(ok){el.textContent=t('correct');}
  else if(miss){
    const msg=missMessage(miss);
    el.textContent=msg.head;
    const sub=document.createElement('span');sub.className='fb-sub';sub.textContent=msg.detail;
    el.appendChild(sub);
  }
  else el.textContent='✗';
  void el.offsetWidth;
  el.className=ok?'correct':'incorrect';
  clearTimeout(_feedbackTimer);
  // A miss stays longer: it has a second line to read before moving the card
  _feedbackTimer=setTimeout(()=>el.className='',ok?2400:4200);
}

// ── HIT EFFECTS ───────────────────────────────────────────────────────────
// The chosen hit effect (category 'effect', progression.js) bursts over the
// card just placed correctly — or over its tile when picked in the Progress
// tab. HIT_FX[fx] adds the particles to the burst: each is an <i> with the
// .fx-<kind> class, placed and steered by CSS variables (--x/--y start,
// --dx/--dy travel, --r turn, --d delay, --t duration; px, deg, ms).
// With reduced motion only a short glow around the card is shown.
// Settings → Appearance switches them off during play (chronos_hit_fx).
var _hitFxOn=true;
(function(){ try{ if(localStorage.getItem('chronos_hit_fx')==='false')_hitFxOn=false; }catch(e){} })();
function toggleHitFx(val){
  _hitFxOn=!!val;
  try{ localStorage.setItem('chronos_hit_fx',_hitFxOn); }catch(e){}
  updateSettingsUI();
}
var _rnd=function(a,b){return a+Math.random()*(b-a);};
function _fxPart(burst,cls,v){
  var i=document.createElement('i');i.className=cls;
  Object.keys(v||{}).forEach(function(k){
    var unit=(k==='r'||k==='a')?'deg':((k==='d'||k==='t')?'ms':'px');
    i.style.setProperty('--'+k,(Math.round(v[k]*10)/10)+unit);
  });
  burst.appendChild(i);return i;
}
function _fxAura(burst,w,h,color,t){
  var a=_fxPart(burst,'fx-aura',{w:w,h:h,t:t||700});a.style.setProperty('--c',color);return a;
}
const HIT_FX={
  sparks:function(b,w,h){
    _fxPart(b,'fx-flash',{t:380});
    for(var n=0;n<18;n++)_fxPart(b,'fx-spark',{x:_rnd(-w*.3,w*.3),y:_rnd(-h*.3,h*.3),a:_rnd(0,360),dx:_rnd(35,85),d:_rnd(0,120),t:_rnd(420,700)});
  },
  flames:function(b,w,h){
    _fxAura(b,w,h,'rgba(255,110,20,.75)',900);
    for(var n=0;n<16;n++)_fxPart(b,'fx-flame',{x:_rnd(-w*.46,w*.46),y:-h*_rnd(.15,.45),dx:_rnd(-12,12),dy:-_rnd(30,65),s:_rnd(11,19),d:_rnd(0,260),t:_rnd(650,950)});
  },
  coins:function(b,w,h){
    _fxPart(b,'fx-flash gold',{t:380});
    for(var n=0;n<11;n++){var py=-_rnd(45,95);
      _fxPart(b,'fx-coin',{x:_rnd(-w*.25,w*.25),y:0,dx:_rnd(-90,90),dy:py,ey:_rnd(25,60),r:_rnd(540,1080)*(Math.random()<.5?-1:1),d:_rnd(0,160),t:_rnd(850,1150)});}
  },
  leaf:function(b,w,h){
    _fxAura(b,w,h,'rgba(232,185,49,.7)',1100);
    for(var n=0;n<16;n++)_fxPart(b,'fx-leaf',{x:_rnd(-w*.48,w*.48),y:-h/2-_rnd(8,40),dx:_rnd(-28,28),dy:h+_rnd(10,45),r:_rnd(180,540)*(Math.random()<.5?-1:1),s:_rnd(6,11),d:_rnd(0,300),t:_rnd(1000,1400)});
  },
  ink:function(b,w,h){
    var cx=_rnd(-w*.2,w*.2);
    _fxPart(b,'fx-blot',{x:cx,y:0,s:_rnd(34,44),t:1000});
    for(var n=0;n<3;n++)_fxPart(b,'fx-blot',{x:cx+_rnd(-50,50),y:_rnd(-h*.35,h*.35),s:_rnd(10,18),d:_rnd(60,180),t:900});
    for(n=0;n<10;n++){var a=_rnd(0,Math.PI*2),dist=_rnd(28,62);
      _fxPart(b,'fx-drop',{x:cx,y:0,dx:Math.cos(a)*dist,dy:Math.sin(a)*dist*.7,s:_rnd(3,8),d:_rnd(0,80),t:_rnd(500,750)});}
  },
  seal:function(b,w,h){
    var x=-w/2+12;   // the left end: the year on the right stays readable
    _fxPart(b,'fx-wax',{x:x,y:0,t:1400});
    _fxPart(b,'fx-ring red',{x:x,y:0,d:380,t:600});
    for(var n=0;n<6;n++){var a=_rnd(0,Math.PI*2),dist=_rnd(22,40);
      _fxPart(b,'fx-drop wax',{x:x,y:0,dx:Math.cos(a)*dist,dy:Math.sin(a)*dist,s:_rnd(3,6),d:380,t:_rnd(400,600)});}
  },
  stars:function(b,w,h){
    for(var n=0;n<4;n++)_fxPart(b,'fx-meteor',{x:_rnd(-w*.55,w*.1),y:-h/2-_rnd(10,40),a:_rnd(22,38),dx:_rnd(150,230),d:n*_rnd(90,150),t:_rnd(600,800)});
    for(n=0;n<7;n++)_fxPart(b,'fx-twinkle',{x:_rnd(-w*.45,w*.45),y:_rnd(-h*.6,h*.6),s:_rnd(8,14),d:_rnd(150,650),t:650});
  },
  feathers:function(b,w,h){
    _fxAura(b,w,h,'rgba(255,90,30,.75)',1300);
    for(var n=0;n<9;n++)_fxPart(b,'fx-feather',{x:_rnd(-w*.42,w*.42),y:_rnd(-h*.1,h*.3),dx:_rnd(-30,30),dy:-_rnd(60,115),r:_rnd(-40,40),d:_rnd(0,350),t:_rnd(1150,1500)});
    for(n=0;n<10;n++)_fxPart(b,'fx-ember',{x:_rnd(-w*.45,w*.45),y:_rnd(-h*.2,h*.4),dx:_rnd(-10,10),dy:-_rnd(40,90),d:_rnd(0,500),t:_rnd(700,1000)});
  },
  rewind:function(b,w,h){
    for(var n=0;n<3;n++)_fxPart(b,'fx-ring back',{x:0,y:0,d:n*160,t:700});
    _fxPart(b,'fx-clock',{x:0,y:0,t:1300});
  }
};
// Whether hits play an effect's sound: effects on and one won. Misses are
// then silent (attemptPlacement).
function hitSoundOn(){
  var item=shownEffect();
  return _hitFxOn&&!!HIT_FX[item.fx]&&!!HIT_SFX[item.fx];
}
// preview: picked in the Progress tab — plays even with effects switched off.
// Says whether the effect's sound played (then the drop sound is left out).
function playHitEffect(target,preview){
  var item=shownEffect();
  if(!target||!HIT_FX[item.fx]||(!_hitFxOn&&!preview))return false;
  // Cards burst inside the scrolling timeline (so the burst follows them and
  // is drawn above the next cards); tiles burst inside themselves
  // Layout offsets, not the on-screen box: a card just placed is still
  // scaled by its entry animation
  var own=!target.classList.contains('timeline-card');
  var host=own?target:document.getElementById('timeline');
  var w=target.offsetWidth,h=target.offsetHeight;
  var burst=document.createElement('div');burst.className='fx-burst';
  burst.style.left=((own?0:target.offsetLeft)+w/2)+'px';
  burst.style.top=((own?0:target.offsetTop)+h/2)+'px';
  var calm=false;
  try{calm=window.matchMedia('(prefers-reduced-motion: reduce)').matches;}catch(e){}
  if(calm)_fxAura(burst,w,h,'rgba(201,168,76,.8)',700);
  else HIT_FX[item.fx](burst,w,h);
  playHitSound(item.fx);
  host.appendChild(burst);
  setTimeout(function(){burst.remove();},2000);
  return !!HIT_SFX[item.fx];
}

// ── FACT PANEL ────────────────────────────────────────────────────────────
// Each open of the panel advances to the card's next fact, so tapping a placed
// card shows something new instead of a random (possibly repeated) one.
// Index is kept per card name for the whole session and wraps around.
var _factIdx={};
function _factPool(card){
  var pool=(lang==='pt'?(card.facts_pt||card.facts):(card.facts||card.facts_pt))||[];
  if(isInterval(card)){
    // Intervals lead with their description, then cycle through the facts
    var desc=lang==='pt'?(card.description_pt||card.description):(card.description||card.description_pt);
    if(desc)pool=[desc].concat(pool);
  }
  pool=pool.filter(Boolean);
  if(!pool.length)pool=[(lang==='pt'?(card.hint_pt||card.hint):card.hint)||''];
  return pool;
}
function _nextFact(card,keepIdx){
  var pool=_factPool(card);
  var prev=_factIdx[card.name];
  var idx;
  if(prev===undefined)idx=isInterval(card)?0:Math.floor(Math.random()*pool.length);
  else idx=keepIdx?prev:prev+1;
  idx%=pool.length;
  _factIdx[card.name]=idx;
  return pool[idx];
}
function showFact(card,isReview,keepIdx){
  reviewMode=!!isReview;
  _currentFactCard=card;
  const fp=document.getElementById('fact-panel');
  const iv=isInterval(card);
  document.getElementById('fp-tag-txt').textContent=isReview?t('review_tag'):t('fact_tag');
  document.getElementById('fp-name').textContent=cName(card);
  const fact=_nextFact(card,keepIdx);
  if(iv){
    const reg=cRegion(card);
    document.getElementById('fp-year').textContent=formatYear(card.startYear)+' – '+formatYear(card.endYear)+(reg?' · '+reg:'');
    document.getElementById('fp-text').textContent=fact;
  } else {
    document.getElementById('fp-year').textContent=formatYear(card.year)+' · '+card.era;
    document.getElementById('fp-text').textContent=fact;
  }
  document.getElementById('fp-btn').textContent=isReview?t('fp_close'):t('fp_continue');
  // Facts: the card's next fact; with a single one there is nothing to cycle
  const n=_factPool(card).length;
  const more=document.getElementById('fp-more');
  more.textContent=t('fp_more');
  more.disabled=n<2;
  document.getElementById('fp-count').textContent=n>1?(_factIdx[card.name]+1)+'/'+n:'';
  fp.classList.toggle('review-mode',isReview);
  // A review over an open panel reuses it: still one back press to close
  if(!fp.classList.contains('open')) _pushNavState('fact');
  fp.classList.add('open');
}
// Facts button: the next of the card's facts, in the same panel (same mode)
function nextFact(){
  if(_currentFactCard) showFact(_currentFactCard,reviewMode);
}
function reviewCard(card){
  // Tap on a placed card in the timeline → show its fact in review mode
  // If a post-placement fact panel is already open (pendingDraw), preserve that flag
  showFact(card,true);
}
function closeFact(){
  // Already closed (Escape with no panel open): must not draw a card
  if(!document.getElementById('fact-panel').classList.contains('open')) return;
  _popNavState('fact');
  document.getElementById('fact-panel').classList.remove('open');
  document.getElementById('fact-panel').classList.remove('review-mode');
  _currentFactCard=null;
  const wasReview=reviewMode;
  reviewMode=false;
  // Draw next card if: (a) this was a post-placement panel (not review), OR
  // (b) this was a review that interrupted a pending post-placement panel
  if(gameActive&&(!wasReview||_pendingDraw)){_pendingDraw=false;drawCard();}
}

function openHistory(){
  if(gameActive)return;
  _fromGameover=false;
  document.getElementById('gameover').classList.remove('show');
  _hpTab='streak';
  renderHistoryPanel();
  document.getElementById('history-panel').classList.add('open');
  _pushNavState('history');
}
// After "Save timeline": the saved games, with the one just saved (the newest) open
function openHistoryFromGameover(){
  _fromGameover=true;
  document.getElementById('gameover').classList.remove('show');
  _hpTab='timelines';
  renderHistoryPanel();
  if(gameHistory.length) toggleEntry(0);
  document.getElementById('history-panel').classList.add('open');
  _pushNavState('history');
}
function closeHistory(){
  _popNavState('history');
  document.getElementById('history-panel').classList.remove('open');
  if(gameActive)return;
  document.getElementById('gameover').classList.remove('show');
  _fromGameover=false;
  if(_fromCultures){ _fromCultures=false; openCultures(); } else { showIntro(); }
}
function renderHistoryPanel(){
  switchHpTab(_hpTab);
  document.getElementById('hp-title').textContent=t('history_title');
  document.getElementById('hp-close').textContent=t('hp_close');
  const list=document.getElementById('history-list');list.innerHTML='';
  if(!gameHistory.length){list.innerHTML=`<div class="hp-empty">${t('no_history').replace('\n','<br>')}</div>`;return;}
  gameHistory.forEach((entry,i)=>{
    const d=new Date(entry.date);
    const loc=entry.lang==='pt'?'pt-BR':'en-US';
    const dateStr=d.toLocaleDateString(loc,{day:'numeric',month:'short',year:'numeric'})+' · '+d.toLocaleTimeString(loc,{hour:'2-digit',minute:'2-digit'});
    const modeLbl=modeBadgeLabel(entry.mode,entryPlayMode(entry));
    // Stored records are data, not markup: numbers forced, text escaped, the
    // mode whitelisted before it becomes a CSS class
    const modeCls=RECORD_MODES.some(m=>m.id===entry.mode)?entry.mode:'classic';
    const div=document.createElement('div');div.className='history-entry';
    div.innerHTML=`
      <div class="he-header" onclick="toggleEntry(${i})">
        <div><div class="he-date">${esc(dateStr)}</div><div class="he-stats">${Number(entry.score)|0} pts · ${Number(entry.placed)|0} ${t('cards_placed')}</div></div>
        <div class="he-right">
          <span class="he-era-tag">${eraTagLabel(entry.eraFilter)}</span>
          <span class="he-mode ${modeCls}">${modeLbl}</span>
          <button class="he-del" title="Delete" onclick="event.stopPropagation();askDeleteEntry(${i})">🗑</button>
          <span class="he-chevron" id="chev-${i}">▼</span>
        </div>
      </div>
      <div class="he-tl" id="ht-${i}">
        <div class="ht-label">${t('tl_lbl')}</div>
        ${_htCards(entry)}
      </div>`;
    list.appendChild(div);
  });
}
function _htRow(c,miss){
  return `<div class="ht-card${miss?' ht-miss':''}"><div class="ht-dot" style="background:${_eraColor(c.era)}"></div><div class="ht-name">${esc(c.name)}${miss?`<span class="ht-miss-lbl">✗ ${t('ht_last_miss')}</span>`:''}</div><div class="ht-year">${esc(c.span||formatYear(c.year))}</div></div>`;
}
/* A saved timeline, with the card of the run's last miss (buildGameRecord)
   highlighted where it belongs — only once it is in the Compendium, so the
   history never gives away a date; before that, only its name, at the end */
function _htCards(entry){
  const tl=Array.isArray(entry.timeline)?entry.timeline:[];
  const rows=tl.map(c=>_htRow(c,false));
  const m=entry.miss;
  if(!m||typeof m!=='object'||typeof m.name!=='string'||typeof m.year!=='number') return rows.join('');
  if(discoveredCards.has(m.key)){
    rows.splice(tl.filter(c=>c.year<=m.year).length,0,_htRow(m,true));
    return rows.join('');
  }
  return rows.join('')+`<div class="ht-miss-note">✗ ${t('ht_last_miss')}: <b>${esc(m.name)}</b> — ${t('ht_miss_hidden')}</div>`;
}
// Dot colour of a stored timeline card: only colours from the era table, so a
// stored value can never reach the style attribute
function _eraColor(era){
  return Object.prototype.hasOwnProperty.call(ERA_COLORS,era)?ERA_COLORS[era]:'#888';
}
function toggleEntry(i){
  const ht=document.getElementById(`ht-${i}`),chev=document.getElementById(`chev-${i}`);
  const open=ht.classList.toggle('open');chev.classList.toggle('open',open);
}


// ── HISTORY TABS ──────────────────────────────────────────────────────────
var _hpTab = 'streak';

function switchHpTab(tab){
  _hpTab = tab;
  document.getElementById('hp-tab-timelines').classList.toggle('active', tab==='timelines');
  document.getElementById('hp-tab-timelines').textContent=t('tab_timelines');
  document.getElementById('hp-tab-streak').classList.toggle('active', tab==='streak');
  document.getElementById('hp-tab-streak').textContent=t('tab_streak');
  document.getElementById('history-list').style.display = tab==='timelines' ? '' : 'none';
  document.getElementById('hp-streak').style.display = tab==='streak' ? 'flex' : 'none';
  if(tab==='streak'){ _calViewYear=new Date().getFullYear(); _calViewMonth=new Date().getMonth(); renderStreakTab(); }
}

// ── SWIPE BETWEEN TABS ────────────────────────────────────────────────────
/* History (Timelines | Streak) and Trophies (Progress | Trophies): a
   horizontal drag on a tab's content moves it with the finger. Let go past
   TAB_SWIPE_PX, or on a quick flick, it slides out and the neighbour tab
   slides in; short of that it springs back. Towards a side with no tab it
   only gives a little. Vertical moves stay scrolls: the tab areas are
   touch-action: pan-y (index.html), so the browser leaves horizontal moves
   to us instead of cancelling them. areas: { tab: element id }, left to right. */
const TAB_SWIPE_PX = 60, TAB_FLICK_PX = 30, TAB_FLICK_MS = 250, TAB_SLIDE_MS = 160;
function _tabSwipe(panelId, areas, getTab, switchTab) {
  var tabs = Object.keys(areas);
  var panel = document.getElementById(panelId);
  var g = null;   // the gesture in progress
  function slide(el, x, then) {
    el.style.transition = 'transform ' + TAB_SLIDE_MS + 'ms ease-out';
    el.style.transform = x ? 'translateX(' + x + 'px)' : '';
    setTimeout(function() { el.style.transition = ''; if (then) then(); }, TAB_SLIDE_MS);
  }
  panel.addEventListener('pointerdown', function(e) {
    if (g || !e.isPrimary || e.button !== 0) return;
    var el = document.getElementById(areas[getTab()]);
    if (!el.contains(e.target) || e.target.closest('input, textarea, select')) return;
    g = { el: el, id: e.pointerId, x: e.clientX, y: e.clientY, t: Date.now(), dx: 0, on: false, i: tabs.indexOf(getTab()) };
  });
  panel.addEventListener('pointermove', function(e) {
    if (!g || e.pointerId !== g.id) return;
    var dx = e.clientX - g.x, dy = e.clientY - g.y;
    if (!g.on) {
      if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return;
      if (Math.abs(dy) >= Math.abs(dx)) { g = null; return; }   // a scroll
      g.on = true;
      panel.classList.add('tab-swiping');
      g.el.style.transition = 'none';
    }
    g.dx = dx;
    var next = g.i + (dx < 0 ? 1 : -1);
    g.el.style.transform = 'translateX(' + (tabs[next] ? dx : dx / 4) + 'px)';
  });
  function release(e, cancelled) {
    if (!g || e.pointerId !== g.id) return;
    var s = g; g = null;
    if (!s.on) return;
    panel.classList.remove('tab-swiping');
    // A drag that ends on a button (a calendar day, a saved game) doesn't press it
    window.addEventListener('click', _swallowClick, true);
    setTimeout(function() { window.removeEventListener('click', _swallowClick, true); }, 400);
    var next = s.i + (s.dx < 0 ? 1 : -1);
    var go = !cancelled && !!tabs[next] && (Math.abs(s.dx) > TAB_SWIPE_PX
      || (Math.abs(s.dx) > TAB_FLICK_PX && Date.now() - s.t < TAB_FLICK_MS));
    if (!go) { slide(s.el, 0); return; }
    var dir = s.dx < 0 ? -1 : 1, w = s.el.offsetWidth;
    slide(s.el, dir * w, function() {
      s.el.style.transform = '';
      switchTab(tabs[next]);
      var n = document.getElementById(areas[tabs[next]]);
      n.style.transition = 'none';
      n.style.transform = 'translateX(' + (-dir * w) + 'px)';
      void n.offsetWidth;   // start from the side before sliding in
      slide(n, 0);
    });
  }
  panel.addEventListener('pointerup', function(e) { release(e, false); });
  panel.addEventListener('pointercancel', function(e) { release(e, true); });
}
function _swallowClick(e) {
  e.stopPropagation(); e.preventDefault();
  window.removeEventListener('click', _swallowClick, true);
}

// ── RENDER STREAK TAB ─────────────────────────────────────────────────────
// Preview mode lets the developer step today's daily through its states;
// 'real' reads the saved record as usual.
var _PREVIEW_DAILY=[
  {id:'real',    en:'real',            pt:'real'},
  {id:'none',    en:'not played',      pt:'não jogado'},
  {id:'retry',   en:'lost, tries left',pt:'perdeu, com tentativas'},
  {id:'out',     en:'out of tries',    pt:'sem tentativas'},
  {id:'won',     en:'completed',       pt:'concluído'}
];
var _previewDailyIdx=0;
function _previewDailyStatus(){
  if(!customPreview) return null;
  var M=DAILY_MAX_ATTEMPTS;
  switch(_PREVIEW_DAILY[_previewDailyIdx].id){
    case 'none':  return {won:false,locked:false,attemptsUsed:0,attemptsLeft:M};
    case 'retry': return {won:false,locked:false,attemptsUsed:1,attemptsLeft:M-1};
    case 'out':   return {won:false,locked:true, attemptsUsed:M,attemptsLeft:0};
    case 'won':   return {won:true, locked:true, attemptsUsed:1,attemptsLeft:0};
  }
  return null;
}
function renderStreakTab(){
  var panel=document.getElementById('hp-streak');
  panel.innerHTML='';
  var st=_calcStreak();

  // ── Streak stats ──────────────────────────────────────────────────────
  var stats=document.createElement('div'); stats.className='streak-stats';
  stats.innerHTML='<div class="streak-stat"><div class="streak-stat-val">'+st.cur+'</div><div class="streak-stat-lbl">🔥 '+t('daily_current_streak')+'</div></div><div class="streak-divider"></div><div class="streak-stat"><div class="streak-stat-val">'+st.longest+'</div><div class="streak-stat-lbl">⭐ '+t('daily_longest_streak')+'</div></div>';
  panel.appendChild(stats);

  var today=new Date(); today.setHours(0,0,0,0);

  // ── Monthly calendar with prev/next navigation ───────────────────────
  var calTitle=document.createElement('div'); calTitle.className='dc-section-title';
  calTitle.textContent=lang==='pt'?'📅 Calendário de Desafios':'📅 Challenge Calendar';
  panel.appendChild(calTitle);

  var calWrap=document.createElement('div'); calWrap.className='dc-cal-wrap';
  calWrap.id='dc-cal-wrap';
  panel.appendChild(calWrap);
  _renderCalMonth(_calViewYear, _calViewMonth);

  // ── Play / retry button ───────────────────────────────────────────────
  // Four states: never played · lost with tries left · won · out of tries.
  // Note that "played today" (streak) and "can still play" are different
  // questions — the latter is _dailyStatus().locked.
  var fake=_previewDailyStatus();
  var st2=fake||_dailyTodayStatus();
  var btn=document.createElement('button');
  btn.className='streak-play-btn';
  btn.disabled=st2.locked&&!st2.won;
  if(st2.won){
    // Won: one button, the day's status on top of the way to its card
    btn.classList.add('done');
    btn.innerHTML='<span class="streak-btn-sub">'+t('daily_done')+'</span><span>'+t('daily_view_card')+'</span>';
    btn.onclick=function(){ openDailyCard(today.getFullYear(),today.getMonth(),today.getDate()); };
  } else {
    if(st2.locked)              btn.textContent=t('daily_no_tries');
    else if(st2.attemptsUsed>0) btn.textContent=t('daily_retry');
    else                        btn.textContent=t('daily_play');
    if(!st2.locked&&!fake) btn.onclick=function(){ closeHistory(); startDailyChallenge(); };
  }
  panel.appendChild(btn);

  if(!st2.locked&&st2.attemptsUsed>0){
    var tries=document.createElement('div'); tries.className='streak-tries-msg';
    tries.textContent=t('daily_tries_left').replace('{n}',st2.attemptsLeft).replace('{max}',DAILY_MAX_ATTEMPTS);
    panel.appendChild(tries);
  }
  // Once today is closed out (won or out of tries) the past days in the
  // calendar above become actionable, so the message also points to catch-up
  // (st2.locked is what _recoverGateOpen() answers).
  if(st2.locked){
    var msg=document.createElement('div'); msg.className='streak-done-msg';
    msg.textContent=st2.won?t('daily_comeback'):t('daily_out_recover');
    panel.appendChild(msg);
  } else if(st2.attemptsUsed===0){
    var hint=document.createElement('div'); hint.className='streak-done-msg';
    hint.textContent=t('daily_card_hint');
    panel.appendChild(hint);
  }

  // Preview only: switch today's state without playing (nothing is saved)
  if(customPreview){
    var pv=document.createElement('button'); pv.className='streak-preview-btn';
    pv.textContent='🧪 '+(lang==='pt'?'Hoje: ':'Today: ')+_PREVIEW_DAILY[_previewDailyIdx][lang==='pt'?'pt':'en']+' ▸';
    pv.onclick=function(){ _previewDailyIdx=(_previewDailyIdx+1)%_PREVIEW_DAILY.length; renderStreakTab(); };
    panel.appendChild(pv);
  }
}

// ── Calendar navigation state ─────────────────────────────────────────────
var _CAL_MIN_YEAR=DAILY_EPOCH_YEAR; var _CAL_MIN_MONTH=DAILY_EPOCH_MONTH; // March 2026 (0-indexed)
var _calViewYear  = new Date().getFullYear();
var _calViewMonth = new Date().getMonth(); // 0-indexed

function _calNav(dir){
  _calViewMonth += dir;
  if(_calViewMonth > 11){ _calViewMonth=0; _calViewYear++; }
  if(_calViewMonth < 0) { _calViewMonth=11; _calViewYear--; }
  // Clamp to min
  if(_calViewYear<_CAL_MIN_YEAR||(_calViewYear===_CAL_MIN_YEAR&&_calViewMonth<_CAL_MIN_MONTH)){
    _calViewYear=_CAL_MIN_YEAR; _calViewMonth=_CAL_MIN_MONTH;
  }
  _renderCalMonth(_calViewYear, _calViewMonth);
}

function _renderCalMonth(yr, mo){
  var wrap=document.getElementById('dc-cal-wrap');
  if(!wrap) return;
  wrap.innerHTML='';

  var today=new Date(); today.setHours(0,0,0,0);
  var nowYr=today.getFullYear(); var nowMo=today.getMonth();
  var isFuture=(yr>nowYr)||(yr===nowYr&&mo>nowMo);

  var monthDate=new Date(yr,mo,1);
  var monthName=monthDate.toLocaleDateString(lang==='pt'?'pt-BR':'en-US',{month:'long',year:'numeric'});

  var mBlock=document.createElement('div'); mBlock.className='dc-month-block';

  // ── Nav header ──────────────────────────────────────────────────────────
  var nav=document.createElement('div'); nav.className='dc-month-nav';
  var isAtMin=(yr===_CAL_MIN_YEAR&&mo===_CAL_MIN_MONTH);
  var prevBtn=document.createElement('button'); prevBtn.className='dc-nav-btn'; prevBtn.textContent='‹';
  prevBtn.disabled=isAtMin;
  prevBtn.onclick=function(){ _calNav(-1); };
  var mTitle=document.createElement('div'); mTitle.className='dc-month-title dc-month-title-btn';
  mTitle.textContent=monthName.charAt(0).toUpperCase()+monthName.slice(1);
  mTitle.title=lang==='pt'?'Ir para mês/ano':'Jump to month/year';
  mTitle.onclick=function(){ _toggleCalPicker(yr, mo, mBlock); };
  var nextBtn=document.createElement('button'); nextBtn.className='dc-nav-btn'; nextBtn.textContent='›';
  nextBtn.disabled=isFuture;
  nextBtn.onclick=function(){ if(!isFuture) _calNav(1); };
  nav.appendChild(prevBtn); nav.appendChild(mTitle); nav.appendChild(nextBtn);
  mBlock.appendChild(nav);

  // ── Day-of-week header ──────────────────────────────────────────────────
  var hdr=document.createElement('div'); hdr.className='dc-cal-grid';
  var hdNames=lang==='pt'?['S','T','Q','Q','S','S','D']:['M','T','W','T','F','S','S'];
  hdNames.forEach(function(n){
    var h=document.createElement('div'); h.className='dc-cal-hdr'; h.textContent=n;
    hdr.appendChild(h);
  });
  mBlock.appendChild(hdr);

  // ── Calendar grid ────────────────────────────────────────────────────────
  var grid=document.createElement('div'); grid.className='dc-cal-grid';
  var firstDow=monthDate.getDay();
  var offset=firstDow===0?6:firstDow-1;
  for(var e=0;e<offset;e++){
    var empty=document.createElement('div'); empty.className='dc-cal-cell empty';
    grid.appendChild(empty);
  }
  var daysInMonth=new Date(yr,mo+1,0).getDate();
  for(var d=1;d<=daysInMonth;d++){
    var dayDate=new Date(yr,mo,d); dayDate.setHours(0,0,0,0);
    var dst=_dailyStatus(dayDate);
    var rec=dst.rec;
    var unlocked=_isCardUnlocked(dayDate);
    var cell=document.createElement('div');
    var isFutureDay=dayDate.getTime()>today.getTime();
    // Guarded so the common cells cost no extra storage reads
    var recoverable=!unlocked&&!isFutureDay&&_recoverEligible(dayDate);
    // .done still means "played live", so the streak visuals are untouched.
    // .won now means "card unlocked", which recovery can also achieve — hence
    // .recovered, so a caught-up day never passes for a day actually kept.
    cell.className='dc-cal-cell'+(rec?' done':'')
      +(unlocked?' won':(rec?' lost':''))
      +(unlocked&&!dst.won?' recovered':'')
      +(recoverable?' recoverable':'')
      +(isFutureDay?' future':'');
    if(dayDate.getTime()===today.getTime()) cell.classList.add('today');
    cell.textContent=d;
    if(unlocked){
      (function(dayNum){ cell.onclick=function(){ openDailyCard(yr,mo,dayNum); }; })(d);
    } else if(rec||recoverable){
      // Unfinished days keep the inline run summary, which now also carries the
      // catch-up action — which is why never-played past days open it too:
      // otherwise recovery would have nowhere to be offered from.
      (function(r,cellEl,dayNum){
        cellEl.onclick=function(){ toggleDailyEntry(cellEl,r,dayNum,yr,mo); };
      })(rec,cell,d);
    }
    grid.appendChild(cell);
  }
  mBlock.appendChild(grid);
  wrap.appendChild(mBlock);
}


function _toggleCalPicker(curYr, curMo, mBlock){
  var existing=mBlock.querySelector('.dc-picker');
  if(existing){ existing.remove(); return; }

  var today=new Date(); var nowYr=today.getFullYear(); var nowMo=today.getMonth();
  var selYr=curYr; var selMo=curMo;

  var monthNames=lang==='pt'
    ?['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']
    :['January','February','March','April','May','June','July','August','September','October','November','December'];

  var picker=document.createElement('div'); picker.className='dc-picker';
  var cols=document.createElement('div'); cols.className='dc-picker-cols';

  // ── Build a drum-roll column: 3 visible items, center = selected ─────
  function makeCol(items, selectedIdx, onSelect){
    var col=document.createElement('div'); col.className='dc-picker-col';
    // highlight bar (position:absolute, sits at top:40px = second row)
    var hl=document.createElement('div'); hl.className='dc-picker-highlight'; col.appendChild(hl);
    // top spacer = 1 item height so first item can center
    var padTop=document.createElement('div'); padTop.style.cssText='height:40px;flex-shrink:0;scroll-snap-align:none'; col.appendChild(padTop);
    items.forEach(function(item, i){
      var el=document.createElement('div');
      el.className='dc-picker-item'+(i===selectedIdx?' active':'')+(item.disabled?' disabled':'');
      el.textContent=item.label;
      el.dataset.idx=i;
      el.onclick=function(){
        col.querySelectorAll('.dc-picker-item').forEach(function(e){ e.classList.remove('active'); });
        el.classList.add('active');
        onSelect(i, item.value);
        col.scrollTo({top: i*40, behavior:'smooth'});
      };
      col.appendChild(el);
    });
    // bottom spacer = 1 item height so last item can center
    var padBot=document.createElement('div'); padBot.style.cssText='height:40px;flex-shrink:0;scroll-snap-align:none'; col.appendChild(padBot);
    // Initial scroll — selected item in center row (row 2 = offset selectedIdx*40)
    setTimeout(function(){ col.scrollTop=selectedIdx*40; },0);
    return col;
  }

  // ── Month column ─────────────────────────────────────────────────────
  var moItems=monthNames.map(function(name,i){
    var tooEarly=(selYr===_CAL_MIN_YEAR&&i<_CAL_MIN_MONTH);
    var tooLate=(selYr===nowYr&&i>nowMo);
    return {label:name, value:i, disabled:tooEarly||tooLate};
  });
  var moCol=makeCol(moItems, selMo, function(i, val){
    selMo=val;
  });

  // ── Year column ──────────────────────────────────────────────────────
  var yrItems=[];
  for(var y=_CAL_MIN_YEAR;y<=nowYr;y++) yrItems.push({label:String(y),value:y,disabled:false});
  var yrSelIdx=yrItems.findIndex(function(it){return it.value===selYr;});
  var yrCol=makeCol(yrItems, yrSelIdx, function(i, val){
    selYr=val;
    // Re-evaluate disabled months
    moCol.querySelectorAll('.dc-picker-item').forEach(function(el,mi){
      var tooEarly=(selYr===_CAL_MIN_YEAR&&mi<_CAL_MIN_MONTH);
      var tooLate=(selYr===nowYr&&mi>nowMo);
      el.classList.toggle('disabled', tooEarly||tooLate);
      // If currently selected month is now disabled, clamp
      if(el.classList.contains('active')&&(tooEarly||tooLate)){
        el.classList.remove('active');
        var clamp=selYr===_CAL_MIN_YEAR?_CAL_MIN_MONTH:nowMo;
        selMo=clamp;
        moCol.querySelectorAll('.dc-picker-item')[clamp].classList.add('active');
        moCol.scrollTo({top:clamp*40,behavior:'smooth'});
      }
    });
  });

  cols.appendChild(moCol);
  cols.appendChild(yrCol);
  picker.appendChild(cols);

  // ── Confirm button ────────────────────────────────────────────────────
  var confirm=document.createElement('button'); confirm.className='dc-picker-confirm';
  confirm.textContent=lang==='pt'?'Confirmar':'Confirm';
  confirm.onclick=function(){
    _calViewYear=selYr; _calViewMonth=selMo;
    _renderCalMonth(selYr, selMo);
  };
  picker.appendChild(confirm);

  var hdr=mBlock.querySelector('.dc-cal-grid');
  mBlock.insertBefore(picker, hdr);
}
function toggleDailyEntry(cellEl, rec, day, yr, mo){
  // Remove any open expanded panel in this grid
  var existing=cellEl.closest('.dc-month-block').querySelector('.dc-entry-panel');
  if(existing){
    var wasCell=existing.dataset.cell===(yr+'-'+mo+'-'+day);
    existing.remove();
    if(wasCell) return; // tap same cell = collapse
  }
  var panel=document.createElement('div'); panel.className='dc-entry-panel';
  panel.dataset.cell=yr+'-'+mo+'-'+day;
  var d=new Date(yr,mo,day); d.setHours(0,0,0,0);
  var dateStr=d.toLocaleDateString(lang==='pt'?'pt-BR':'en-US',{day:'numeric',month:'short',year:'numeric'});
  // rec is null for a day that was never played — the panel then exists purely
  // to offer recovery, so every field below has to tolerate that.
  var html='<div class="dc-entry-header"><span class="dc-entry-date">📅 '+dateStr+'</span>'
    +(rec?'<span class="dc-entry-score">'+(Number(rec.score)|0)+' pts · '+(Number(rec.placed)|0)+' '+(lang==='pt'?'cartas':'cards')+'</span>':'')
    +'</div>';
  // Stored timeline: text escaped, colour from the era table only
  if(rec&&Array.isArray(rec.timeline)&&rec.timeline.length){
    html+='<div class="dc-entry-tl">';
    rec.timeline.forEach(function(c){
      html+='<div class="ht-card"><div class="ht-dot" style="background:'+_eraColor(c.era)+'"></div><div class="ht-name">'+esc(c.name)+'</div><div class="ht-year">'+esc(c.span||formatYear(c.year))+'</div></div>';
    });
    html+='</div>';
  }
  panel.innerHTML=html;
  _appendRecoverRow(panel,d);
  // Insert after the grid row containing the cell
  cellEl.closest('.dc-month-block').appendChild(panel);
}

// The catch-up affordance inside a past day's panel. Three states worth
// rendering: playable now, playable but today's run is not finished yet, and
// out of catch-up tries. Anything else (future day, before the calendar
// starts, card already unlocked) renders nothing.
function _appendRecoverRow(panel, date){
  var st=_recoverStatus(date);
  var row=document.createElement('div'); row.className='dc-recover-row';
  if(!_recoverEligible(date)){
    if(!st.won&&st.locked){
      var none=document.createElement('div'); none.className='dc-recover-note';
      none.textContent=t('daily_recover_none').replace('{max}',DAILY_MAX_ATTEMPTS);
      row.appendChild(none);
    } else return;
  } else if(!_recoverGateOpen()){
    var gate=document.createElement('div'); gate.className='dc-recover-note';
    gate.textContent=t('daily_recover_gate').replace('{max}',DAILY_MAX_ATTEMPTS);
    row.appendChild(gate);
  } else {
    var btn=document.createElement('button'); btn.className='dc-recover-btn';
    btn.textContent=t('daily_recover_btn');
    btn.onclick=function(){
      closeHistory();
      startRecoverChallenge(date.getFullYear(),date.getMonth(),date.getDate());
    };
    row.appendChild(btn);
    var note=document.createElement('div'); note.className='dc-recover-note';
    note.textContent=t('daily_recover_tries').replace('{n}',st.attemptsLeft).replace('{max}',DAILY_MAX_ATTEMPTS)
      +' · '+t('daily_recover_no_streak');
    row.appendChild(note);
  }
  panel.appendChild(row);
}

// ── DAILY REWARD CARD MODAL ───────────────────────────────────────────────
// Unlocked by winning a daily (all 18 placed). Content comes from
// DAILY_CARDS (dailycards.js) via _dailyCardFor(); days with no content yet
// still open, showing the run stats plus a placeholder.
var _dcardDate=null;   // date currently displayed, for language re-render

function _fillDailyCard(date){
  var card=_dailyCardFor(date);
  var unlock=_cardUnlockRun(date);
  var rec=unlock.rec;
  var color=(card&&ERA_COLORS[card.era])||'var(--gold)';
  var bar=document.getElementById('dcard-bar');
  var frame=document.getElementById('dcard-frame');
  if(bar) bar.style.background=color;
  if(frame) frame.style.borderColor=card&&ERA_COLORS[card.era]?ERA_COLORS[card.era]+'66':'';
  document.getElementById('dcard-tag').textContent=t('dcard_tag');
  var yearEl=document.getElementById('dcard-year');
  var titleEl=document.getElementById('dcard-title');
  var metaEl=document.getElementById('dcard-meta');
  var textEl=document.getElementById('dcard-text');
  var factsEl=document.getElementById('dcard-facts');
  factsEl.innerHTML='';
  if(card){
    // Year stays the hero; the calendar day rides beside it, smaller, so the
    // card says which day of the year it belongs to without burying the year.
    yearEl.textContent=formatYear(card.year);
    var dayEl=document.createElement('span');
    dayEl.className='dcard-day';
    dayEl.textContent=date.toLocaleDateString(lang==='pt'?'pt-BR':'en-US',{day:'numeric',month:'long'});
    yearEl.appendChild(dayEl);
    yearEl.style.display='';
    titleEl.textContent=dcTitle(card);
    var meta=[];
    var _tag=dcTag(card); if(_tag) meta.push(_tag);
    var _reg=dcRegion(card); if(_reg) meta.push(_reg);
    if(card.era) meta.push(card.era);
    metaEl.textContent=meta.join(' · ');
    metaEl.style.display=meta.length?'':'none';
    textEl.textContent=dcText(card);
    dcFacts(card).forEach(function(f){
      var li=document.createElement('li'); li.textContent=f; factsEl.appendChild(li);
    });
  } else {
    yearEl.style.display='none';
    titleEl.textContent=date.toLocaleDateString(lang==='pt'?'pt-BR':'en-US',{day:'numeric',month:'long'});
    metaEl.style.display='none';
    textEl.textContent=t('dcard_soon');
  }
  // Footer: the run that unlocked this card
  var runEl=document.getElementById('dcard-run');
  var dateStr=date.toLocaleDateString(lang==='pt'?'pt-BR':'en-US',{day:'numeric',month:'short',year:'numeric'});
  if(rec){
    runEl.textContent='📅 '+dateStr+' · '+rec.score+' pts · '+rec.placed+'/'+DAILY_DECK_SIZE+' '
      +(lang==='pt'?'cartas':'cards')
      +(rec.attempts>1?' · '+_dailyAttemptLabel(rec.attempts):'')
      +(unlock.recovered?' · '+t('dcard_recovered'):'');
  } else {
    runEl.textContent='📅 '+dateStr;
  }
  document.getElementById('dcard-close').textContent=t('dcard_close');
}

function openDailyCard(yr,mo,d){
  _dcardDate=new Date(yr,mo,d);
  _fillDailyCard(_dcardDate);
  document.getElementById('dcard-modal').scrollTop=0;
  document.getElementById('dcard-bg').classList.add('open');
  document.getElementById('dcard-modal').classList.add('open');
  _pushNavState('dailycard');
}

function closeDailyCard(){
  var m=document.getElementById('dcard-modal');
  if(!m||!m.classList.contains('open')) return;
  _popNavState('dailycard');
  m.classList.remove('open');
  document.getElementById('dcard-bg').classList.remove('open');
  _dcardDate=null;
}

// ── DAILY CHALLENGE ───────────────────────────────────────────────────────
// ── DELETE HISTORY ENTRIES ────────────────────────────────────────────────
let _delIdx=null;
function askDeleteEntry(i){
  _delIdx=i;
  document.getElementById('del-msg').textContent=t('del_one');
  document.getElementById('del-backdrop').classList.add('show');
}

function cancelDel(){document.getElementById('del-backdrop').classList.remove('show');_delIdx=null;}
function confirmDel(){
  if(_delIdx!==null) gameHistory.splice(_delIdx,1);
  try{localStorage.setItem('chronos_history',JSON.stringify(gameHistory));}catch(e){}
  document.getElementById('del-backdrop').classList.remove('show');
  _delIdx=null;
  renderHistoryPanel();
}

// ── COMPENDIUM ────────────────────────────────────────────────────────────
var cpFilt = 'all';
var cpMastery = 'all';  // 'all' | 'mastered' | 'todo' (discovered, not mastered yet)
var cpFiltVisible = false;
// Era sections (MASTERY_ERAS indexes) open during this visit; all start closed
var _cpOpenSections = [];

function openCompendium() {
  var el = document.getElementById('cp-q');
  if (el) el.value = '';
  cpFilt = 'all';
  cpMastery = 'all';
  cpFiltVisible = false;
  _cpOpenSections = [];
  document.querySelectorAll('.cp-chip').forEach(function(b){
    b.classList.toggle('on', b.dataset.f === 'all');
  });
  document.querySelectorAll('.cp-m-chip').forEach(function(b){
    b.classList.toggle('on', b.dataset.m === 'all');
  });
  // Reset filter panel collapsed
  var _cf = document.getElementById('cp-filt');
  var _ctb = document.getElementById('cp-filt-toggle');
  if (_cf) _cf.style.display = 'none';
  if (_ctb) _ctb.classList.remove('active');
  renderCP();
  document.getElementById('cp').classList.add('open');
  _pushNavState('compendium');
}

function closeCompendium() {
  _popNavState('compendium');
  document.getElementById('cp').classList.remove('open');
  if (!gameActive) {
    document.getElementById('gameover').classList.remove('show');
    _fromGameover = false;
    if(_fromCultures){ _fromCultures=false; openCultures(); } else { showIntro(); }
  }
}

function setCpFilt(btn) {
  cpFilt = btn.dataset.f;
  document.querySelectorAll('.cp-chip').forEach(function(b){ b.classList.remove('on'); });
  btn.classList.add('on');
  renderCP();
}

function setCpMastery(btn) {
  cpMastery = btn.dataset.m;
  document.querySelectorAll('.cp-m-chip').forEach(function(b){ b.classList.remove('on'); });
  btn.classList.add('on');
  renderCP();
}

// Toggles in place (keeps the scroll position). Reads the current class
// because a search shows every section open without them being in the list.
function toggleCpSection(i) {
  var sec = document.getElementById('cp-sec-' + i);
  if (!sec) return;
  var open = !sec.classList.contains('open');
  _cpOpenSections = _cpOpenSections.filter(function(x){ return x !== i; });
  if (open) _cpOpenSections.push(i);
  sec.classList.toggle('open', open);
  // Closed from its sticky header far down the list: bring the header back
  // into view instead of leaving the list scrolled into the next eras
  var list = document.getElementById('cp-list');
  var above = list ? list.getBoundingClientRect().top - sec.getBoundingClientRect().top : 0;
  if (!open && above > 0) list.scrollTop -= above;
}

function toggleCpFilt() {
  cpFiltVisible = !cpFiltVisible;
  var filt = document.getElementById('cp-filt');
  var btn = document.getElementById('cp-filt-toggle');
  if (filt) filt.style.display = cpFiltVisible ? '' : 'none';
  if (btn) btn.classList.toggle('active', cpFiltVisible);
}

// Escapes text for innerHTML — also quotes, so it is safe inside attributes.
// Stored records may one day come from the cloud: they always go through here.
function esc(s) {
  return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function renderCP() {
  // Clear list immediately — prevents stale content on Android WebView
  var list = document.getElementById('cp-list');
  if (list) list.innerHTML = '';

  var q = ((document.getElementById('cp-q') || {}).value || '').toLowerCase().trim();

  var all = [];
  CARDS.forEach(function(c){ if(c && typeof c.name === 'string') all.push(c); });
  INTERVALS.forEach(function(c){ if(c && typeof c.name === 'string') all.push(c); });
  all.sort(function(a, b) {
    var ya = a.startYear !== undefined ? a.startYear : (a.year || 0);
    var yb = b.startYear !== undefined ? b.startYear : (b.year || 0);
    return ya - yb;
  });

  // Header and search box follow the language (they were English until a language switch)
  var cpTitle = document.getElementById('cp-title');
  if (cpTitle) cpTitle.textContent = t('cp_title');
  var cpClose = document.getElementById('cp-close');
  if (cpClose) cpClose.textContent = t('cp_close');
  var cpFiltBtn = document.getElementById('cp-filt-toggle');
  if (cpFiltBtn) cpFiltBtn.title = t('cp_filt_title');
  var cpQ = document.getElementById('cp-q');
  if (cpQ) cpQ.placeholder = t('cp_search');

  // Update mastery chip labels for language
  var masteryChipLabels = {all:t('cp_m_all'), mastered:t('cp_m_mastered'), todo:t('cp_m_todo')};
  document.querySelectorAll('.cp-m-chip').forEach(function(b){
    if(masteryChipLabels[b.dataset.m]) b.textContent = masteryChipLabels[b.dataset.m];
  });

  // Update type chip labels for language
  var typeChipLabels = lang==='pt'
    ? {all:'Todos', people:'Pessoas', events:'Eventos', empires:'Impérios', biblical:'Bíblico'}
    : {all:'All', people:'People', events:'Events', empires:'Empires', biblical:'Biblical'};
  document.querySelectorAll('.cp-chip').forEach(function(b){
    if(typeChipLabels[b.dataset.f]) b.textContent = typeChipLabels[b.dataset.f];
  });

  // Update filter section labels
  var flTypeLbl = document.getElementById('cfl-type');
  var flMasteryLbl = document.getElementById('cfl-mastery');
  if(flTypeLbl) flTypeLbl.textContent = lang==='pt' ? 'TIPO' : 'TYPE';
  if(flMasteryLbl) flMasteryLbl.textContent = t('cp_mastery_lbl');

  // Same rule as the Gold seal of era mastery; a locked card shows nothing
  function isMst(c) { return discoveredCards.has(c.name) && isCardMastered(cardStats[c.name]); }

  var inView = all.filter(function(c) {
    var iv = c.startYear !== undefined;
    if (cpFilt === 'people'   && c.cat !== 'People') return false;
    if (cpFilt === 'events'   && c.cat !== 'Events') return false;
    if (cpFilt === 'empires'  && !iv) return false;
    if (q) {
      var nm = (lang === 'pt' ? (c.name_pt || c.name) : c.name).toLowerCase();
      if (nm.indexOf(q) === -1) return false;
    }
    return true;
  });

  // Per-era counts before the mastery filter: the section headers compare
  // the filtered cards with the era's total
  var eraCount = {};
  inView.forEach(function(c) {
    var n = eraCount[c.era] = eraCount[c.era] || { total: 0, disc: 0, mst: 0 };
    n.total++;
    if (discoveredCards.has(c.name)) n.disc++;
    if (isMst(c)) n.mst++;
  });

  var filtered = inView.filter(function(c) {
    if (cpMastery === 'mastered') return isMst(c);
    if (cpMastery === 'todo') return discoveredCards.has(c.name) && !isMst(c);
    return true;
  });

  // Update discovered count to reflect active filters
  var discoveredInFilter = 0;
  filtered.forEach(function(c){ if(discoveredCards.has(c.name)) discoveredInFilter++; });
  var allDiscovered = 0;
  all.forEach(function(c){ if(discoveredCards.has(c.name)) allDiscovered++; });
  var allMastered = all.filter(isMst).length;
  var cntEl = document.getElementById('cp-cnt');
  if(cntEl) {
    var isFiltered = (cpFilt !== 'all' || cpMastery !== 'all' || q);
    if(isFiltered) {
      // Show filtered count + total discovered in parentheses
      cntEl.textContent = discoveredInFilter + ' / ' + filtered.length
        + (lang==='pt' ? ' neste filtro' : ' in view')
        + '  ·  ' + allDiscovered + ' / ' + all.length
        + (lang==='pt' ? ' no total' : ' total');
    } else {
      // The mastered total fits only on the short line; the section headers show it per era
      cntEl.textContent = allDiscovered + ' / ' + all.length
        + (lang==='pt' ? ' descobertos' : ' discovered')
        + '  ·  ' + t('cp_cnt_mastered').replace('{n}', allMastered);
    }
  }

  if (!list) return;

  if (!filtered.length) {
    list.innerHTML = '<p style="text-align:center;color:#9a9080;padding:40px 20px;font-family:Inter,sans-serif;font-size:.9rem">'+(lang==='pt'?'Nenhuma carta encontrada.':'No cards match.')+'</p>';
    return;
  }

  var rowsByEra = {};  filtered.forEach(function(card) {
    var iv   = card.startYear !== undefined;
    var disc = discoveredCards.has(card.name);
    var mst  = isMst(card);
    var sid  = 'ck_' + card.name.replace(/[^a-z0-9]/gi, '_');
    var col  = ERA_COLORS[card.era] || '#888';

    var nm = disc
      ? esc(lang === 'pt' ? (card.name_pt || card.name) : card.name)
        + (mst ? ' <span class="ck-star" title="' + esc(t('cp_m_mastered')) + '">★</span>' : '')
      : '?????';

    var yr = disc
      ? (iv
          ? (formatYear(card.startYear) + ' \u2013 ' + formatYear(card.endYear))
          : formatYear(card.year))
      : '????';

    // The era is the section header, so the row shows only the category
    var meta = disc ? esc(iv ? t('cp_empire') : (lang === 'pt' ? (card.cat_pt || card.cat) : card.cat)) : '';

    var h = '';
    h += '<div class="ck">';
    h += '<div class="ck-h" onclick="toggleCK(&#39;' + sid + '&#39;)">';
    h += '<div class="ck-dot" style="background:' + col + ';opacity:' + (disc ? '1' : '0.4') + '"></div>';
    h += '<div class="ck-mid">';
    h += '<div class="ck-n' + (disc ? '' : ' lk') + '">' + nm + '</div>';
    if (meta) h += '<div class="ck-m">' + meta + '</div>';
    h += '</div>';
    h += '<div class="ck-r">';
    h += '<div class="ck-y">' + yr + '</div>';
    h += '<div class="ck-a" id="ka_' + sid + '">\u203a</div>';
    h += '</div>';
    h += '</div>'; /* end ck-h */

    h += '<div class="ck-b" id="' + sid + '"><div class="ck-i">';
    if (disc) {
      var hint  = lang === 'pt' ? (card.hint_pt  || card.hint  || '') : (card.hint  || '');
      var facts = lang === 'pt' ? (card.facts_pt || card.facts || []) : (card.facts || []);
      var clues = lang === 'pt' ? (card.clues_pt || card.clues || []) : (card.clues || []);
      h += _cpRecordLine(cardStats[card.name], mst);
      if (hint) h += '<div class="ck-tl">' + esc(hint) + '</div>';
      facts.forEach(function(f) { h += '<p class="ck-f">' + esc(f) + '</p>'; });
      if (clues.length) {
        h += '<div class="ck-cs"><div class="ck-cl">' + (lang === 'pt' ? 'Pistas' : 'Clues') + '</div>';
        clues.forEach(function(c) { h += '<div class="ck-c">' + esc(c) + '</div>'; });
        h += '</div>';
      }
    } else {
      h += '<div class="ck-lk">' + t('cp_locked') + '</div>';
    }
    h += '</div></div></div>';
    (rowsByEra[card.era] = rowsByEra[card.era] || []).push(h);
  });

  // One folding section per mastery era, like the trophy sections. A search
  // opens every section so its matches are visible; an empty section is hidden.
  var eraInfo = eraMastery();
  var html = '';
  MASTERY_ERAS.forEach(function(era, i) {
    var rows = rowsByEra[era.id];
    if (!rows) return;
    var seal = eraInfo[i].seal;
    var n = eraCount[era.id];
    // No filter: ★ mastered · discovered / total. Mastered: ★ mastered / total.
    // To master: discovered-not-mastered / total.
    var cnt = cpMastery === 'mastered' ? '★ ' + n.mst + ' / ' + n.total
      : cpMastery === 'todo' ? (n.disc - n.mst) + ' / ' + n.total
      : '★ ' + n.mst + '  ·  ' + n.disc + ' / ' + n.total;
    var isOpen = !!q || _cpOpenSections.indexOf(i) >= 0;
    html += '<div class="tp-sec cp-sec' + (isOpen ? ' open' : '') + '" id="cp-sec-' + i + '">';
    html += '<button class="tp-sec-hd" onclick="toggleCpSection(' + i + ')">';
    html += '<span class="tp-sec-arrow">▸</span>';
    html += '<span class="tp-sec-name">' + (lang === 'pt' ? era.name_pt : era.name) + (seal ? ' ' + seal.icon : '') + '</span>';
    html += '<span class="tp-sec-cnt">' + cnt + '</span>';
    html += '</button>';
    html += '<div class="cp-sec-body">' + rows.join('') + '</div>';
    html += '</div>';
  });
  list.innerHTML = html;
}

// "Your record" line of an open Compendium card: the mastery hits and misses
// (ok/miss — not amiss, so the line agrees with the ★) and how many more
// hits it needs to be mastered (2+ hits and more hits than misses)
function _cpRecordLine(s, mastered) {
  var ok = (s && s.ok) | 0, miss = (s && s.miss) | 0;
  var need = Math.max(0, 2 - ok, miss - ok + 1);
  var status = mastered ? t('cp_done')
    : (need === 1 ? t('cp_need1') : t('cp_needn').replace('{n}', need));
  var line = t('cp_hist')
    .replace('{ok}', ok === 1 ? t('cp_ok1') : t('cp_okn').replace('{n}', ok))
    .replace('{miss}', miss === 1 ? t('cp_miss1') : t('cp_missn').replace('{n}', miss))
    .replace('{status}', status);
  return '<div class="ck-st' + (mastered ? ' done' : '') + '">' + line + '</div>';
}

function toggleCK(sid) {
  var body = document.getElementById(sid);
  var arr  = document.getElementById('ka_' + sid);
  if (!body) return;
  var wasOpen = body.classList.contains('op');
  document.querySelectorAll('.ck-b.op').forEach(function(b){ b.classList.remove('op'); });
  document.querySelectorAll('.ck-a.op').forEach(function(a){ a.classList.remove('op'); });
  if (!wasOpen) {
    body.classList.add('op');
    if (arr) arr.classList.add('op');
    setTimeout(function(){ body.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 60);
  }
}


// ── THEME ─────────────────────────────────────────────────────────────────
let lightMode=false;
try{lightMode=localStorage.getItem('chronos_theme')==='light';}catch(e){}
// A timeline theme (Customization, progression.js) brings its own look on
// its own light or dark base: while one is in use the dark/light setting is
// off (kept, and back with the Classic theme). body gets .themed and the
// theme's .th-<style> class.
// A run of a Cultures mode always wears that culture's theme (the theme item
// with that `mode`), won or not: set when a run starts or resumes
// (initGame / resumeSavedRun), cleared on the menus (showIntro / openCultures).
var _themeCls='', _runThemeMode=null;
function setRunTheme(mode){
  _runThemeMode=CUSTOMIZATIONS.some(function(c){ return c.cat==='theme'&&c.mode===mode; })?mode:null;
  applyTheme();
}
function activeTheme(){
  if(_runThemeMode){
    var th=CUSTOMIZATIONS.find(function(c){ return c.cat==='theme'&&c.mode===_runThemeMode; });
    if(th) return th;
  }
  return selectedCustom('theme');
}
function themeLocksMode(){ return !!activeTheme().base; }
function applyTheme(){
  var th=activeTheme();
  document.body.classList.toggle('light',th.base?th.base==='light':lightMode);
  if(_themeCls)document.body.classList.remove(_themeCls);
  _themeCls=th.base?'th-'+th.style:'';
  if(_themeCls)document.body.classList.add(_themeCls);
  document.body.classList.toggle('themed',!!th.base);
}
function toggleTheme(){
  if(themeLocksMode())return;
  lightMode=!lightMode;
  try{localStorage.setItem('chronos_theme',lightMode?'light':'dark');}catch(e){}
  applyTheme();
  if(typeof updateSettingsUI==='function')updateSettingsUI();
}
// ── TROPHY SYSTEM ─────────────────────────────────────────────────────────
// Unlock toasts go through queueNotice (see NOTICE QUEUE above)

function openTrophies(tab){
  document.getElementById('tp-title-txt').textContent = lang==='pt' ? '🏆 Troféus' : '🏆 Trophies';
  document.getElementById('tp-close').textContent = lang==='pt' ? '✕ Fechar' : '✕ Close';
  _tpOpenSections = [];
  switchTpTab(tab || 'progress');
  document.getElementById('tp').classList.add('open');
  _pushNavState('trophies');
}
function closeTrophies(){
  _popNavState('trophies');
  document.getElementById('tp').classList.remove('open');
  if(!gameActive){
    if(_fromCultures){ _fromCultures=false; openCultures(); } else { showIntro(); }
  }
}

// Collapsible sections (trophy sections and Customization) stay open only
// during a visit: openTrophies closes them all again
var _tpOpenSections = [];
try { localStorage.removeItem('chronos_tp_open'); } catch(e) {}   // older versions remembered them

function toggleTpSection(id){
  var i = _tpOpenSections.indexOf(id);
  if(i >= 0) _tpOpenSections.splice(i, 1); else _tpOpenSections.push(id);
  // Toggle in place instead of re-rendering, so the list keeps its scroll position
  var sec = document.getElementById('tp-sec-'+id);
  if(sec) sec.classList.toggle('open', i < 0);
}

function renderTrophies(){
  var earnedCount = TROPHY_DEFS.filter(function(def){ return !!earnedTrophies[def.id]; }).length;
  var cntEl = document.getElementById('tp-cnt');
  if(cntEl) cntEl.textContent = earnedCount + ' / ' + TROPHY_DEFS.length + ' ' + t('tp_earned');

  // A trophy with a missing or unknown section falls into the first one,
  // so a typo in the data never hides it
  var sectionIds = TROPHY_SECTIONS.map(function(s){ return s.id; });
  var html = '';
  TROPHY_SECTIONS.forEach(function(sec){
    var cards = '', total = 0, earned = 0;
    TROPHY_DEFS.forEach(function(def, i){
      var defSec = sectionIds.indexOf(def.section) >= 0 ? def.section : sectionIds[0];
      if(defSec !== sec.id) return;
      var isEarned = !!earnedTrophies[def.id];
      total++; if(isEarned) earned++;   // every level counts in the section total
      // A family is drawn once, as a single card, where its first level sits
      if(def.family){
        if(TROPHY_DEFS.findIndex(function(d){ return d.family === def.family; }) === i) cards += _familyCard(def.family);
        return;
      }
      var nm = lang==='pt' ? def.name_pt : def.name;
      var dateStr = '';
      if(isEarned){
        try{
          var d = new Date(earnedTrophies[def.id]);
          dateStr = d.toLocaleDateString(lang==='pt'?'pt-BR':'en-US',{day:'numeric',month:'short',year:'numeric'});
        }catch(e){}
      }
      var tier = def.tier && TROPHY_TIERS[def.tier];
      // A locked secret trophy shows nothing about itself
      var hidden = _isHiddenTrophy(def);
      cards += '<div class="tc'+(isEarned?' earned':'')+(hidden?' secret':'')+'" onclick="openTrophyModal('+i+')">';
      cards += '<div class="tcard-icon">'+(hidden?'❓':def.icon)+'</div>';
      cards += '<div class="tcard-name">'+(hidden?'???':nm)+'</div>';
      if(tier) cards += '<div class="tcard-tier tier-'+def.tier+'">'+(lang==='pt'?tier.name_pt:tier.name)+'</div>';
      cards += '<div class="tcard-desc">'+(isEarned ? (lang==='pt'?'✦ Toque para ver detalhes':'✦ Tap to view') : (hidden ? t('secret_card') : (lang==='pt'?'Toque para ver os requisitos':'Tap to see requirements')))+'</div>';
      if(isEarned && dateStr) cards += '<div class="tcard-date">'+dateStr+'</div>';
      if(!isEarned) cards += _trophyProgressBar(def);
      if(!isEarned) cards += '<div class="tcard-lock">🔒</div>';
      cards += '</div>';
    });
    if(!total) return;
    var isOpen = _tpOpenSections.indexOf(sec.id) >= 0;
    html += '<div class="tp-sec'+(isOpen?' open':'')+'" id="tp-sec-'+sec.id+'">';
    html += '<button class="tp-sec-hd" onclick="toggleTpSection(\''+sec.id+'\')">';
    html += '<span class="tp-sec-arrow">▸</span>';
    html += '<span class="tp-sec-name">'+sec.icon+' '+(lang==='pt'?sec.name_pt:sec.name)+'</span>';
    html += '<span class="tp-sec-cnt">'+earned+' / '+total+'</span>';
    html += '</button>';
    html += '<div class="tp-sec-grid">'+cards+'</div>';
    html += '</div>';
  });
  document.getElementById('tp-list').innerHTML = html;
}

// ── TROPHY PANEL TABS ─────────────────────────────────────────────────────
var _tpTab = 'progress';

function switchTpTab(tab){
  _tpTab = tab;
  document.getElementById('tp-tab-trophies').classList.toggle('active', tab==='trophies');
  document.getElementById('tp-tab-trophies').textContent=t('tab_trophies');
  document.getElementById('tp-tab-progress').classList.toggle('active', tab==='progress');
  document.getElementById('tp-tab-progress').textContent=t('tab_progress');
  document.getElementById('tp-list').style.display = tab==='trophies' ? '' : 'none';
  document.getElementById('tp-progress').style.display = tab==='progress' ? 'flex' : 'none';
  // The trophy title and count belong to the Trophies tab; hidden (not removed)
  // on Progress so the header buttons don't move when switching tabs
  document.getElementById('tp-head-title').style.visibility = tab==='trophies' ? '' : 'hidden';
  renderTrophies(); // keeps the header count current on both tabs
  if(tab==='progress') renderProgress();
}

// ── RENDER PROGRESSION TAB ────────────────────────────────────────────────
function renderProgress(){
  var info = playerLevelInfo();
  var title = shownTitle();
  var emblem = selectedCustom('emblem');
  var frame = selectedCustom('frame');

  var html = '<div class="pf-card">';
  html += '<div class="pf-avatar pf-frame-'+frame.style+'">'+emblem.icon+'</div>';
  html += '<div class="pf-name-wrap"><input id="pf-name" class="pf-name" type="text" maxlength="'+PLAYER_NAME_MAX+'" autocomplete="off" spellcheck="false"><span class="pf-name-edit">✎</span></div>';
  html += '<div class="pf-title">'+(lang==='pt'?title.name_pt:title.name)+'</div>';
  html += '</div>';

  html += '<div class="pf-level"><div class="pf-level-row">';
  html += '<span class="pf-level-lbl">'+t('pf_level').replace('{n}',info.level)+'</span>';
  html += '<span class="pf-xp-txt">'+t('pf_xp').replace('{xp}',formatXp(info.xp)).replace('{max}',formatXp(info.xpNeeded))+'</span>';
  html += '</div><div class="pf-xp-bar"><div class="pf-xp-fill" style="width:'+Math.round(100*info.xp/info.xpNeeded)+'%"></div></div>';
  html += '<div class="pf-xp-foot"><span>'+t('pf_total_xp').replace('{n}',formatXp(info.totalXp))+'</span>';
  html += '<span>'+t('pf_to_next').replace('{n}',formatXp(info.xpNeeded-info.xp)).replace('{lvl}',info.level+1)+'</span></div></div>';

  // Account (login): folds like Customization; filled by renderAccount, which only uses textContent
  html += '<div class="tp-sec'+(_tpOpenSections.indexOf('account')>=0?' open':'')+'" id="tp-sec-account">';
  html += '<button class="tp-sec-hd" onclick="toggleTpSection(\'account\')">';
  html += '<span class="tp-sec-arrow">▸</span><span class="tp-sec-name">'+t('acc_title')+'</span><span class="tp-sec-cnt" id="pf-account-cnt"></span>';
  html += '</button>';
  html += '<div class="pf-acc-body"><div class="pf-account" id="pf-account"></div></div>';
  html += '</div>';

  // Stats (era mastery + mode records) fold like Customization
  html += '<div class="tp-sec'+(_tpOpenSections.indexOf('stats')>=0?' open':'')+'" id="tp-sec-stats">';
  html += '<button class="tp-sec-hd" onclick="toggleTpSection(\'stats\')">';
  html += '<span class="tp-sec-arrow">▸</span><span class="tp-sec-name">📊 '+t('pf_stats')+'</span>';
  html += '</button>';
  html += '<div class="pf-stats-body">'+_renderEraMastery()+_renderModeRecords()+'</div>';
  html += '</div>';

  // Customization folds like a trophy section, and so does each category
  // inside it; counts are of unlocked items. Hidden items (title_auto) are
  // never shown nor counted.
  var shownItems = CUSTOMIZATIONS.filter(function(i){ return !i.hidden; });
  var customHtml = '';
  CUSTOM_CATEGORIES.forEach(function(cat){
    var items = shownItems.filter(function(i){ return i.cat === cat.id; });
    var body = cat.id==='title' ? _renderTitleRows(items) : _renderCustomTiles(cat.id, items, emblem, frame);
    customHtml += _foldSection('custom_'+cat.id, _nm(cat), items.filter(isCustomUnlocked).length+' / '+items.length, body, 'pf-sub');
  });
  html += _foldSection('custom', '🎨 '+t('pf_custom'),
    shownItems.filter(isCustomUnlocked).length+' / '+shownItems.length, customHtml, 'pf-custom');

  document.getElementById('tp-progress').innerHTML = html;

  // Name goes in via .value (never innerHTML) so user text is never parsed as markup
  var nameInput = document.getElementById('pf-name');
  nameInput.value = playerName;
  nameInput.placeholder = t('pf_name_ph');
  nameInput.addEventListener('change', function(){ setPlayerName(this.value); this.value = playerName; });
  nameInput.addEventListener('keydown', function(e){ if(e.key==='Enter') this.blur(); });
  renderAccount();
}

// A folding section with the trophy-tab look; it stays open or closed while
// the panel is open (toggleTpSection). cls names its body: <cls>-body.
function _foldSection(id, name, count, body, cls){
  return '<div class="tp-sec '+cls+(_tpOpenSections.indexOf(id)>=0?' open':'')+'" id="tp-sec-'+id+'">'
    + '<button class="tp-sec-hd" onclick="toggleTpSection(\''+id+'\')">'
    + '<span class="tp-sec-arrow">▸</span><span class="tp-sec-name">'+name+'</span><span class="tp-sec-cnt">'+count+'</span>'
    + '</button><div class="'+cls+'-body">'+body+'</div></div>';
}

// Emblem / frame / effect tiles. Emblem and frame tiles preview the item
// combined with the other current choice, so they show the real result;
// effect tiles show the effect's emoji (picking one plays it on the tile).
// The item in use in a tile category: for effects, the first one won while
// none was chosen (shownEffect)
function _customInUse(catId){
  return catId==='effect' ? shownEffect() : selectedCustom(catId);
}
function _renderCustomTiles(catId, items, emblem, frame){
  var selected = _customInUse(catId), html = '<div class="pf-opts">';
  items.forEach(function(item){
    var unlocked = isCustomUnlocked(item);
    var selectable = isCustomSelectable(item);   // differs only in preview mode
    var hidden = _customHidden(item);
    var preview = catId==='frame'
      ? '<div class="pf-avatar sm pf-frame-'+(hidden?'classic':item.style)+'">'+(hidden?'❓':emblem.icon)+'</div>'
      : catId==='effect'
      ? '<div class="pf-fx-ico">'+(hidden?'❓':item.icon)+'</div>'
      : catId==='theme'
      ? '<div class="pf-th-sw th-'+item.style+'">'+item.icon+'</div>'
      : '<div class="pf-avatar sm pf-frame-'+frame.style+'">'+(hidden?'❓':item.icon)+'</div>';
    // Selectable items are picked; locked ones open their card, which says how
    // to unlock them — the tile itself shows only the look and the name, so
    // every tile has the same size
    var click = selectable ? 'pickCustomization' : 'openCustomModal';
    html += '<div class="pf-opt'+(item.id===selected.id?' on':'')+(selectable?'':' locked')+(selectable&&!unlocked?' pv':'')+'" id="pf-opt-'+item.id+'" onclick="'+click+'(\''+item.id+'\')">';
    html += preview;
    html += '<div class="pf-opt-name">'+(hidden?'???':_nm(item))+'</div>';
    html += '</div>';
  });
  return html + '</div>';
}

// Titles as one-line strips, the size of their section's header: the emoji
// of their source (titleIcon) and the name; on the right the level of a level
// title and a lock when locked — or, for the title in use, that it is in use
// (and whether it follows the level). They behave like emblem and frame
// tiles: see pickTitle.
function _renderTitleRows(items){
  var active = shownTitle(), follows = titleFollowsLevel(), html = '<div class="pf-ttls">';
  items.forEach(function(item){
    var unlocked = isCustomUnlocked(item);
    var selectable = isCustomSelectable(item);   // differs only in preview mode
    var on = item.id === active.id;
    var lvl = item.unlock && item.unlock.title ? _unlockTitle(item) : null;
    var right = on ? t(follows ? 'cu_title_follow' : 'cu_title_on')
      : ((unlocked ? '' : '🔒 ') + (lvl ? t('pf_level').replace('{n}', lvl.minLevel) : '')).trim();
    html += '<div class="pf-ttl'+(on?' on':'')+(selectable?'':' locked')+(selectable&&!unlocked?' pv':'')+'" onclick="pickTitle(\''+item.id+'\')">';
    html += '<span class="pf-ttl-i">'+titleIcon(item)+'</span><span class="pf-ttl-n">'+esc(_nm(item))+'</span>';
    if(right) html += '<span class="pf-ttl-r">'+esc(right)+'</span>';
    html += '</div>';
  });
  return html + '</div>';
}

// Like an emblem or frame tile: the first tap uses the title, a tap on the
// title in use (or on a locked one) opens its card with the trivia. The
// title in use is the shown one, which may be the level's title while it
// follows the level — selectedCustom would say title_auto there.
function pickTitle(id){
  var item = CUSTOMIZATIONS.find(function(c){ return c.id === id; });
  if(!item) return;
  if(item.id === shownTitle().id || !isCustomSelectable(item)){ openCustomModal(id); return; }
  if(!selectCustomization(id)) return;
  SFX.play('drop');
  // The list scrolls on its own: keep its position across the re-render
  var list = document.querySelector('.pf-ttls'), top = list ? list.scrollTop : 0;
  renderProgress();
  list = document.querySelector('.pf-ttls');
  if(list) list.scrollTop = top;
}

// ── ACCOUNT (sync.js) ─────────────────────────────────────────────────────
// Login block of the Progress tab. Built with textContent only: the e-mail
// comes from the server. Re-drawn by sync.js whenever the session changes.
function renderAccount(){
  var box=document.getElementById('pf-account');
  if(!box) return;
  var a=syncAccountInfo();
  // Folded header: whether this device is signed in
  var cnt=document.getElementById('pf-account-cnt');
  if(cnt) cnt.textContent=a.status==='in'?t('acc_on'):(a.status==='starting'?t('acc_starting'):t('acc_off'));
  box.textContent='';
  var add=function(tag,cls,text){ var el=document.createElement(tag); el.className=cls; if(text) el.textContent=text; box.appendChild(el); return el; };
  if(a.status==='starting'){
    add('div','pf-acc-text',t('acc_starting'));
  } else if(a.status==='in'){
    add('div','pf-acc-text',t('acc_signed_in'));
    add('div','pf-acc-email',a.email);
    add('div','pf-acc-status'+(a.phase==='offline'||a.phase==='update'||a.phase==='other'?' warn':''),_syncStatusText(a));
    var now=add('button','pf-acc-btn',t('acc_sync_now'));
    now.disabled=a.phase==='syncing'||a.phase==='update'||a.phase==='other';
    now.onclick=function(){ syncNow(); };
    add('button','pf-acc-btn secondary',t('acc_logout')).onclick=_askLogout;
  } else {
    add('div','pf-acc-text',t('acc_pitch'));
    add('button','pf-acc-btn',t('acc_login')).onclick=syncLogin;
  }
  var link=add('a','pf-acc-link',t('acc_privacy'));
  link.href='privacy.html';
  link.target='_blank';
  link.rel='noopener';
}

// One line on the state of the cloud copy
function _syncStatusText(a){
  if(a.phase==='syncing') return t('acc_syncing');
  if(a.phase==='offline') return t('acc_sync_offline');
  if(a.phase==='update') return t('acc_sync_update');
  if(a.phase==='other') return t('acc_sync_other');
  if(!a.lastSync) return t('acc_sync_never');
  var min=Math.floor((Date.now()-Date.parse(a.lastSync))/60000);
  if(!(min>=1)) return t('acc_synced_now');
  if(min<60) return t('acc_synced_min').replace('{n}',min);
  if(min<48*60) return t('acc_synced_h').replace('{n}',Math.floor(min/60));
  return t('acc_synced_on').replace('{date}',new Date(a.lastSync).toLocaleDateString(lang==='pt'?'pt-BR':'en-US',{day:'numeric',month:'short'}));
}

// Logout clears this device's progress (it stays in the cloud), so it asks
// first — and again, more bluntly, if the last sync before leaving failed
function _askLogout(){
  openConfirm(t('acc_logout_title'),t('acc_logout_body'),t('acc_cancel'),t('acc_logout'),function(){
    syncLogout(false).then(function(r){
      if(r&&r.ok) return;
      openConfirm(t('acc_logout_title'),t('acc_logout_fail_body'),t('acc_cancel'),t('acc_logout_anyway'),function(){ syncLogout(true); });
    });
  });
}

// After sync.js merged other devices' progress into localStorage: reload it
// into memory and redraw whatever is on screen (never runs during a run)
function onSyncApplied(){
  reloadSavedProgress();
  applyTheme();   // the theme chosen on another device
  var tp=document.getElementById('tp');
  if(tp&&tp.classList.contains('open')){ renderTrophies(); if(_tpTab==='progress') renderProgress(); }
  var hp=document.getElementById('history-panel');
  if(hp&&hp.classList.contains('open')) switchHpTab(_hpTab);
  var cp=document.getElementById('cp');
  if(cp&&cp.classList.contains('open')) renderCP();
  updateIntroHistBtn();
  syncPlayModeButtons();   // the level may have changed (Review unlocks at 5)
}

// Era mastery block of the progress tab. The bar tracks the next seal; once
// gold is earned it stays full and shows how many cards are mastered.
function _renderEraMastery(){
  var html = '<div class="pf-block"><div class="dc-section-title">'+t('pf_mastery')+'</div>';
  html += '<div class="pf-help">'+t('pf_mastery_help')+'</div>';
  html += '<div class="pf-mastery">';
  eraMastery().forEach(function(m){
    var color = ERA_COLORS[m.era.id] || 'var(--gold)';
    var sealName = function(s){ return s.icon+' '+(lang==='pt'?s.name_pt:s.name); };
    var pct, caption;
    if(m.next){
      pct = m.next.goal ? Math.min(100, Math.round(100*m.next.count/m.next.goal)) : 0;
      caption = t('pf_mastery_next').replace('{seal}', sealName(m.next.seal))
        .replace('{n}', m.next.count).replace('{goal}', m.next.goal)
        .replace('{what}', t(m.next.seal.need==='mastered' ? 'pf_mastery_mastered' : 'pf_mastery_hit'));
    } else {
      pct = 100;
      caption = t('pf_mastery_done').replace('{seal}', sealName(m.seal)).replace('{n}', m.mastered).replace('{total}', m.total);
    }
    html += '<div class="pf-era'+(m.seal?' sealed':'')+'">';
    html += '<div class="pf-era-row"><span class="pf-era-name">'+(lang==='pt'?m.era.name_pt:m.era.name)+'</span>';
    html += '<span class="pf-era-seal"'+(m.seal?' title="'+(lang==='pt'?m.seal.name_pt:m.seal.name)+'"':'')+'>'+(m.seal?m.seal.icon:'·')+'</span></div>';
    html += '<div class="pf-xp-bar"><div class="pf-xp-fill" style="width:'+pct+'%;background:'+color+'"></div></div>';
    html += '<div class="pf-era-cap">'+caption+'</div>';
    html += '</div>';
  });
  return html + '</div></div>';
}

// Per-mode personal bests (lives runs only — see recordModeResult)
function _renderModeRecords(){
  var html = '<div class="pf-block"><div class="dc-section-title">'+t('pf_records')+'</div>';
  html += '<div class="pf-records">';
  html += '<div class="pf-rec-row pf-rec-head"><span>'+t('pf_rec_mode')+'</span><span>'+t('pf_rec_best')+'</span><span>'+t('pf_rec_cards')+'</span><span>'+t('pf_rec_streak')+'</span><span>'+t('pf_rec_runs')+'</span></div>';
  RECORD_MODES.forEach(function(mode){
    var r = modeRecords[mode.id];
    var played = r && (r.runs|0) > 0;
    html += '<div class="pf-rec-row'+(played?'':' empty')+'">';
    html += '<span class="pf-rec-mode">'+mode.icon+' '+t(mode.label)+'</span>';
    html += '<span class="pf-rec-best">'+(played ? formatXp(r.best|0) : '—')+'</span>';
    html += '<span>'+(played ? (r.mostPlaced|0) : '—')+'</span>';
    // Records saved before streaks were tracked have no bestStreak yet
    html += '<span>'+(played && r.bestStreak != null ? (r.bestStreak|0) : '—')+'</span>';
    html += '<span>'+(played ? (r.runs|0) : '—')+'</span>';
    html += '</div>';
  });
  html += '</div><div class="pf-help">'+t('pf_records_note')+'</div></div>';
  return html;
}

// First tap selects; tapping the item that is already selected opens its
// detail modal instead
function pickCustomization(id){
  var item = CUSTOMIZATIONS.find(function(c){ return c.id === id; });
  if(item && _customInUse(item.cat).id === id){ openCustomModal(id); return; }
  if(!selectCustomization(id)) return;
  if(item.cat!=='effect') SFX.play('drop');   // an effect plays its own sound
  if(item.cat==='theme') applyTheme();
  renderProgress();
  if(item.cat==='effect') playHitEffect(document.getElementById('pf-opt-'+id),true);
}

function _unlockTitle(item){
  return PLAYER_TITLES.find(function(tt){ return tt.id === item.unlock.title; });
}
function _unlockTrophy(item){
  return TROPHY_DEFS.find(function(d){ return d.id === item.unlock.trophy; });
}
function _nm(o){ return o ? (lang==='pt' ? o.name_pt : o.name) : ''; }
// Era and seal of a { mastery } unlock, as display names
function _unlockMastery(item){
  var u = item.unlock.mastery;
  var era = MASTERY_ERAS.find(function(e){ return e.id === u.era; });
  var seal = MASTERY_SEALS.find(function(s){ return s.id === u.seal; });
  return { era: _nm(era) || u.era, seal: seal ? seal.icon+' '+_nm(seal) : u.seal };
}
// A locked secret item hides its look, name and requirement (preview shows all)
function _customHidden(item){
  return !!item.secret && !customPreview && !isCustomUnlocked(item);
}
// Full sentence for the detail modal
function _customHowText(item){
  var u = item.unlock || {};
  if(u.title){
    var title = _unlockTitle(item);
    // A level title's own row only needs the level
    if(item.cat==='title' && title) return title.minLevel <= 1 ? t('cu_title_start') : t('em_how_level').replace('{n}', title.minLevel);
    if(title && title.minLevel <= 1) return t('em_how_start').replace('{title}', _nm(title));
    return t('em_how_title').replace('{title}', _nm(title) || u.title).replace('{n}', title ? title.minLevel : '?');
  }
  if(u.level)  return t('em_how_level').replace('{n}', u.level);
  if(u.trophy) return t('em_how_trophy').replace('{name}', _nm(_unlockTrophy(item)) || u.trophy);
  if(u.mastery){ var m = _unlockMastery(item); return t('em_how_mastery').replace('{seal}', m.seal).replace('{era}', m.era); }
  if(u.record){
    var rm = RECORD_MODES.find(function(r){ return r.id === u.record.mode; });
    return t('em_how_record').replace('{n}', formatXp(u.record.best)).replace('{mode}', rm ? t(rm.label) : u.record.mode)
      + (item.mode ? ' '+t('th_culture_note') : '');
  }
  return t('em_how_free');
}

// Emblem / frame detail — same modal as trophies. Unlocked: trivia + how it
// was won; locked: only how to unlock it (the trivia stays a reward, as with
// trophies). A locked secret item only says to keep playing. Preview mode
// shows everything, marked as a preview.
function openCustomModal(id){
  var item = CUSTOMIZATIONS.find(function(c){ return c.id === id; });
  if(!item) return;
  if(_customHidden(item)){
    _showTpModal({ icon: '❓', earned: false, name: '???', date: '', trivia: '', how: t('secret_hint') });
    return;
  }
  var unlocked = isCustomUnlocked(item);
  var date = '';
  if(unlocked && item.unlock && item.unlock.trophy) date = earnedTrophies[item.unlock.trophy] || '';
  var cat = CUSTOM_CATEGORIES.find(function(c){ return c.id === item.cat; });
  _showTpModal({
    icon: item.cat==='title' ? titleIcon(item) : item.icon,
    // Frames show the current emblem wearing them
    iconHtml: item.cat==='frame' ? '<div class="pf-avatar pf-frame-'+item.style+'">'+selectedCustom('emblem').icon+'</div>'
      : item.cat==='theme' ? '<div class="pf-th-sw lg th-'+item.style+'">'+item.icon+'</div>' : '',
    earned: unlocked || customPreview,
    badge: !unlocked && customPreview ? t('pf_preview_badge') : '',
    name: _nm(cat) + ': ' + _nm(item),
    date: date,
    trivia: lang==='pt' ? (item.trivia_pt || item.trivia || '') : (item.trivia || ''),
    // The current level's title also explains that using it follows the level
    how: _customHowText(item) + (item.cat==='title' && item===levelTitleItem() ? ' '+t('cu_title_follow_note') : '')
  });
}

// Progress bar under a locked long-term trophy (nothing for yes/no goals)
function _trophyProgressBar(def){
  var pr = trophyProgress(def);
  if(!pr || !pr.bar) return '';
  var n = Math.min(pr.n, pr.goal);
  var pct = pr.goal ? Math.round(100*n/pr.goal) : 0;
  return '<div class="tcard-prog"><div class="tcard-prog-bar"><div class="tcard-prog-fill" style="width:'+pct+'%"></div></div>'
    + '<div class="tcard-prog-txt">'+formatXp(n)+' / '+formatXp(pr.goal)+'</div></div>';
}

function _isHiddenTrophy(def){ return def.section === 'secret' && !earnedTrophies[def.id]; }

// ── TROPHY FAMILIES ───────────────────────────────────────────────────────
// Levels of the same feat (`family` in trophies.js) share one card: it shows
// the highest level earned, "Level n/total", and the bar towards the next one.
function _familyState(fid){
  var levels = TROPHY_DEFS.filter(function(d){ return d.family === fid; });
  var done = levels.filter(function(d){ return !!earnedTrophies[d.id]; });
  return { levels: levels, done: done, top: done[done.length-1] || null,
           next: levels.find(function(d){ return !earnedTrophies[d.id]; }) || null };
}
function _fmtTrophyDate(iso, month){
  try{ var d = new Date(iso); if(!isNaN(d)) return d.toLocaleDateString(lang==='pt'?'pt-BR':'en-US',{day:'numeric',month:month||'short',year:'numeric'}); }catch(e){}
  return '';
}
function _familyCard(fid){
  var f = _familyState(fid), shown = f.top || f.levels[0];
  var tier = shown.tier && TROPHY_TIERS[shown.tier];
  var html = '<div class="tc'+(f.top?' earned':'')+'" onclick="openTrophyFamily(\''+fid+'\')">';
  html += '<div class="tcard-icon">'+shown.icon+'</div>';
  html += '<div class="tcard-name">'+_nm(shown)+'</div>';
  if(tier) html += '<div class="tcard-tier tier-'+shown.tier+'">'+_nm(tier)+'</div>';
  html += '<div class="tcard-level">'+t('tp_level').replace('{n}', f.done.length).replace('{total}', f.levels.length)+'</div>';
  html += '<div class="tcard-desc">'+(f.top ? (lang==='pt'?'✦ Toque para ver detalhes':'✦ Tap to view') : (lang==='pt'?'Toque para ver os requisitos':'Tap to see requirements'))+'</div>';
  if(f.top){ var ds = _fmtTrophyDate(earnedTrophies[f.top.id]); if(ds) html += '<div class="tcard-date">'+ds+'</div>'; }
  if(f.next){
    html += _trophyProgressBar(f.next);
    if(f.top) html += '<div class="tcard-next">'+t('tp_next').replace('{name}', _nm(f.next))+'</div>';
  }
  if(!f.top) html += '<div class="tcard-lock">🔒</div>';
  return html + '</div>';
}
// Family modal: the trivia of every level earned so far (a new level reveals a
// new one), then the ladder of levels with the progress towards the next
function openTrophyFamily(fid){
  var f = _familyState(fid), shown = f.top || f.levels[0];
  var trivia = f.done.map(function(d){
    return '✦ '+_nm(d)+'\n'+(lang==='pt' ? (d.trivia_pt || d.trivia || '') : (d.trivia || ''));
  }).join('\n\n');
  var ladder = f.levels.map(function(d){
    var tier = d.tier && TROPHY_TIERS[d.tier];
    return (earnedTrophies[d.id] ? '✓ ' : '○ ')+_nm(d)+(tier ? ' ('+_nm(tier)+')' : '')+' — '+(lang==='pt' ? d.desc_pt : d.desc);
  }).join('\n');
  var pr = f.next ? trophyProgress(f.next) : null;
  if(pr && pr.bar) ladder += '\n\n'+t('tp_next').replace('{name}', _nm(f.next))+' · '+t('tp_progress').replace('{n}', formatXp(Math.min(pr.n, pr.goal))).replace('{goal}', formatXp(pr.goal));
  else if(!f.next) ladder += '\n\n'+t('tp_all_levels');
  _showTpModal({
    icon: shown.icon,
    earned: !!f.top,
    name: _nm(shown)+' · '+t('tp_level').replace('{n}', f.done.length).replace('{total}', f.levels.length),
    date: f.top ? earnedTrophies[f.top.id] : '',
    trivia: trivia,
    how: ladder
  });
}

function openTrophyModal(idx){
  var def = TROPHY_DEFS[idx];
  if(_isHiddenTrophy(def)){
    _showTpModal({ icon: '❓', earned: false, name: '???', date: '', trivia: '', how: t('secret_hint') });
    return;
  }
  var pr = earnedTrophies[def.id] ? null : trophyProgress(def);
  _showTpModal({
    icon: def.icon,
    earned: !!earnedTrophies[def.id],
    name: lang==='pt' ? def.name_pt : def.name,
    date: earnedTrophies[def.id] || '',
    trivia: lang==='pt' ? (def.trivia_pt || def.trivia || '') : (def.trivia || ''),
    how: (lang==='pt' ? (def.hint_pt || def.hint || '') : (def.hint || ''))
      + (pr && pr.bar ? ' ' + t('tp_progress').replace('{n}', formatXp(Math.min(pr.n, pr.goal))).replace('{goal}', formatXp(pr.goal)) : '')
  });
}

/* Fills and opens the trophy/customization detail modal.
   o: { icon, iconHtml?, earned, badge?, name, date (ISO or ''), trivia, how }
   iconHtml (our own markup, e.g. a framed avatar) replaces the icon text;
   badge overrides the earned badge text (preview mode).
   Earned: trivia first, then how it was unlocked (only the latter if there is
   no trivia). Locked: only how to unlock. */
function _showTpModal(o){
  var isEarned = !!o.earned;
  var modal = document.getElementById('tp-modal');
  var bg = document.getElementById('tp-modal-bg');

  // Icon
  var iconEl = document.getElementById('tp-modal-icon');
  if(o.iconHtml) iconEl.innerHTML = o.iconHtml;
  else iconEl.textContent = o.icon;

  // Badge
  var badge = document.getElementById('tp-modal-badge');
  if(isEarned){
    badge.textContent = o.badge || (lang==='pt' ? '✦ Desbloqueado' : '✦ Unlocked');
    badge.className = 'earned-badge';
  } else {
    badge.textContent = lang==='pt' ? '🔒 Bloqueado' : '🔒 Locked';
    badge.className = 'locked-badge';
  }

  // Name
  document.getElementById('tp-modal-name').textContent = o.name;

  // Date (emblems won through a title have none)
  var dateEl = document.getElementById('tp-modal-date');
  dateEl.textContent = '';
  if(isEarned && o.date){
    var d = new Date(o.date);
    if(!isNaN(d)){
      var ds = d.toLocaleDateString(lang==='pt'?'pt-BR':'en-US',{day:'numeric',month:'long',year:'numeric'});
      dateEl.textContent = (lang==='pt'?'Conquistado em ':'Earned on ') + ds;
    }
  }

  // Section label and body
  var lbl = document.getElementById('tp-modal-section-lbl');
  var body = document.getElementById('tp-modal-body');
  var divider = document.getElementById('tp-modal-divider');
  var reqLbl = document.getElementById('tp-modal-req-lbl');
  var reqBody = document.getElementById('tp-modal-req-body');

  if(isEarned && !o.trivia){
    lbl.textContent = o.badge
      ? (lang==='pt' ? '— Como desbloquear' : '— How to unlock')
      : (lang==='pt' ? '— Como foi desbloqueado' : '— How it was unlocked');
    body.textContent = o.how || '';
    divider.style.display = 'none';
    reqLbl.style.display = 'none';
    reqBody.style.display = 'none';
  } else if(isEarned){
    // Primary: trivia
    lbl.textContent = lang==='pt' ? '✦ Curiosidade histórica' : '✦ Historical Trivia';
    body.textContent = o.trivia || '';
    // Secondary: show requirements
    divider.style.display = 'block';
    reqLbl.style.display = 'block';
    reqBody.style.display = 'block';
    reqLbl.style.color = 'rgba(201,168,76,.35)';
    reqBody.style.color = 'rgba(201,168,76,.55)';
    reqLbl.textContent = o.badge   // preview of a locked item: it was not unlocked yet
      ? (lang==='pt' ? '— Como desbloquear' : '— How to unlock')
      : (lang==='pt' ? '— Como foi desbloqueado' : '— How it was unlocked');
    reqBody.textContent = o.how || '';
    // Light mode colors
    if(document.body.classList.contains('light')){
      reqLbl.style.color = '#64748b';
      reqBody.style.color = '#334155';
    }
  } else {
    lbl.textContent = lang==='pt' ? '— Como desbloquear' : '— How to unlock';
    body.textContent = o.how || '';
    divider.style.display = 'none';
    reqLbl.style.display = 'none';
    reqBody.style.display = 'none';
  }

  // Close button text
  document.getElementById('tp-modal-close').textContent = lang==='pt' ? 'Fechar' : 'Close';

  // Earned class
  modal.classList.toggle('earned-modal', isEarned);

  // Open
  if(!modal.classList.contains('open')) _pushNavState('tpmodal');
  modal.scrollTop = 0;
  bg.classList.add('open');
  modal.classList.add('open');
}

function closeTrophyModal(){
  if(!document.getElementById('tp-modal').classList.contains('open')) return;
  _popNavState('tpmodal');
  document.getElementById('tp-modal').classList.remove('open');
  document.getElementById('tp-modal-bg').classList.remove('open');
}


// ── SETTINGS PANEL ───────────────────────────────────────────────────────

function openSettings() {
  updateSettingsUI();
  document.getElementById('settings-panel').classList.add('open');
  _pushNavState('settings');
}

function closeSettings() {
  _popNavState('settings');
  document.getElementById('settings-panel').classList.remove('open');
}

function updateSettingsUI() {
  // A timeline theme in use sets dark or light itself: both buttons are off
  // and a note says which theme decides
  var th = activeTheme(), locked = !!th.base;
  var light = locked ? th.base === 'light' : lightMode;
  ['sopt-dark', 'sopt-light'].forEach(function(id) { document.getElementById(id).disabled = locked; });
  document.getElementById('sopt-dark').classList.toggle('on', !light);
  document.getElementById('sopt-light').classList.toggle('on', light);
  document.getElementById('sett-theme-note').textContent = locked ? t(_runThemeMode ? 'th_mode_note_run' : 'th_mode_note').replace('{name}', _nm(th)) : '';
  document.getElementById('sopt-en').classList.toggle('on', lang === 'en');
  document.getElementById('sopt-pt').classList.toggle('on', lang === 'pt');
  document.getElementById('sett-theme-lbl').textContent = lang === 'pt' ? 'Aparência' : 'Appearance';
  document.getElementById('sett-hitfx-lbl').textContent = lang === 'pt' ? 'Efeitos de acerto' : 'Hit effects';
  document.getElementById('sopt-hitfx-on').classList.toggle('on', _hitFxOn);
  document.getElementById('sopt-hitfx-off').classList.toggle('on', !_hitFxOn);
  document.getElementById('sett-lang-lbl').textContent = lang === 'pt' ? 'Idioma' : 'Language';
  document.getElementById('settings-title').textContent = lang === 'pt' ? '⚙ Configurações' : '⚙ Settings';
  document.getElementById('settings-close').textContent = lang === 'pt' ? 'Fechar' : 'Close';
  var ptOn=document.getElementById('sopt-placed-trivia-on');
  var ptOff=document.getElementById('sopt-placed-trivia-off');
  if(ptOn) ptOn.classList.toggle('on',_showPlacedTrivia);
  if(ptOff) ptOff.classList.toggle('on',!_showPlacedTrivia);
  var ptLbl=document.getElementById('sett-placed-trivia-lbl');
  if(ptLbl) ptLbl.textContent=lang==='pt'?'Trivia ao Colocar':'Trivia on Placement';
  // settings btn is icon-only ⚙
}

function setTheme(mode) {
  if (themeLocksMode()) return;
  lightMode = (mode === 'light');
  try { localStorage.setItem('chronos_theme', mode); } catch(e) {}
  applyTheme();
  updateSettingsUI();
}

function togglePlacedTrivia(val){
  _showPlacedTrivia = (val === undefined) ? !_showPlacedTrivia : !!val;
  try{ localStorage.setItem('chronos_placed_trivia',_showPlacedTrivia); }catch(e){}
  updateSettingsUI();
}


// ── CULTURES HUB ─────────────────────────────────────────────────────────
let cultureMode='abrahamic', cultureLivesMode=true, _fromCultures=false;

function openCultures(){
  setRunTheme(null);
  document.getElementById('intro').classList.remove('show');
  document.getElementById('cultures-screen').classList.add('show');
  // Cultures only offer Lives / Free: a Review choice on the menu shows as Lives
  cultureLivesMode = menuPlayMode !== 'free';
  document.getElementById('clo-lives').classList.toggle('active', cultureLivesMode);
  document.getElementById('clo-free').classList.toggle('active', !cultureLivesMode);
  _pushNavState('cultures');
}

function closeCultures(){
  _popNavState('cultures');
  document.getElementById('cultures-screen').classList.remove('show');
  showIntro();
}

function selectCultureMode(m){
  cultureMode = m;
  document.getElementById('mc-biblical').classList.toggle('selected', m==='abrahamic');
  document.getElementById('mc-roman').classList.toggle('selected', m==='roman');
  document.getElementById('mc-eastern').classList.toggle('selected', m==='eastern');
}

function selectCultureLives(on){
  cultureLivesMode = on;
  document.getElementById('clo-lives').classList.toggle('active', on);
  document.getElementById('clo-free').classList.toggle('active', !on);
}

function startCultureGame(){
  gameMode = cultureMode;
  // The cultures choice also becomes the main menu choice, as before
  menuPlayMode = cultureLivesMode ? 'lives' : 'free';
  setPlayMode(menuPlayMode);
  eraFilter = [];
  syncPlayModeButtons();
  document.getElementById('cultures-screen').classList.remove('show');
  document.getElementById('intro').classList.remove('show');
  initGame();
}


// ══════════════════════════════════════════════════════════════════════════
// AUDIO ENGINE
// ══════════════════════════════════════════════════════════════════════════

// ── State (persisted to localStorage) ────────────────────────────────────
var _musicVol  = 40;   // 0–100
var _sfxVol    = 80;   // 0–100
var _musicMute = false;
var _sfxMute   = false;

(function _loadAudioPrefs() {
  try {
    var mv = localStorage.getItem('chronos_music_vol');
    var sv = localStorage.getItem('chronos_sfx_vol');
    var mm = localStorage.getItem('chronos_music_mute');
    var sm = localStorage.getItem('chronos_sfx_mute');
    if (mv !== null) _musicVol  = parseInt(mv);
    if (sv !== null) _sfxVol    = parseInt(sv);
    if (mm !== null) _musicMute = mm === 'true';
    if (sm !== null) _sfxMute   = sm === 'true';
  } catch(e) {}
})();

// ── Background music ──────────────────────────────────────────────────────
var _bgm = null;
var _bgmReady = false;
var _bgmFadeTimer = null;
// Gain node the music plays through (sfx.js explains why: iOS ignores the
// element's volume). null when Web Audio isn't available: the element's own
// volume is used, as before.
var _bgmGain = null;

// Every music volume change goes through these two
function _setMusicLevel(v) {
  if (_bgmGain) _bgmGain.gain.value = v;
  else if (_bgm) _bgm.volume = v;
}
function _musicLevel() {
  return _bgmGain ? _bgmGain.gain.value : (_bgm ? _bgm.volume : 0);
}
function _musicTarget() { return _musicMute ? 0 : _musicVol / 100; }

function _initBGM() {
  if (_bgm) return;
  _bgm = new Audio('./assets/bgm.mp3');
  _bgm.loop = true;
  _bgm.preload = 'auto';
  _bgm.currentTime = 3;
  _bgm.addEventListener('timeupdate', function() {
    if (_bgm.currentTime < 3) _bgm.currentTime = 3;
  });
  var ctx = audioContext();
  if (ctx) {
    try {
      var src = ctx.createMediaElementSource(_bgm);   // once per element: guarded by `if (_bgm) return`
      _bgmGain = ctx.createGain();
      src.connect(_bgmGain);
      _bgmGain.connect(ctx.destination);
    } catch(e) { _bgmGain = null; }
  }
  _setMusicLevel(_musicTarget());
  _bgmReady = true;
}

function playMusic() {
  _initBGM();
  if (!_bgm) return;
  resumeAudio();
  _setMusicLevel(_musicTarget());
  if (_bgm.paused) {
    _bgm.play().catch(function() {});
  }
}

function stopMusic(fade) {
  if (!_bgm || _bgm.paused) return;
  if (!fade) { _bgm.pause(); return; }
  // Fade out over 800ms
  clearInterval(_bgmFadeTimer);
  var startVol = _musicLevel();
  var steps = 16;
  var i = 0;
  _bgmFadeTimer = setInterval(function() {
    i++;
    _setMusicLevel(Math.max(0, startVol * (1 - i / steps)));
    if (i >= steps) { clearInterval(_bgmFadeTimer); _bgm.pause(); _setMusicLevel(_musicTarget()); }
  }, 50);
}

function fadeInMusic() {
  _initBGM();
  if (!_bgm) return;
  resumeAudio();
  clearInterval(_bgmFadeTimer);
  _setMusicLevel(0);
  if (_bgm.paused) _bgm.play().catch(function() {});
  var target = _musicTarget();
  var steps = 20;
  var i = 0;
  _bgmFadeTimer = setInterval(function() {
    i++;
    _setMusicLevel(Math.min(target, target * (i / steps)));
    if (i >= steps) clearInterval(_bgmFadeTimer);
  }, 50);
}

// ── Volume / mute controls ────────────────────────────────────────────────
function setMusicVolume(val) {
  _musicVol = parseInt(val);
  try { localStorage.setItem('chronos_music_vol', _musicVol); } catch(e) {}
  if (_bgm && !_musicMute) _setMusicLevel(_musicVol / 100);
  _updateAudioUI();
}

function setSfxVolume(val) {
  _sfxVol = parseInt(val);
  try { localStorage.setItem('chronos_sfx_vol', _sfxVol); } catch(e) {}
  _updateAudioUI();
}

function toggleMusicMute() {
  _musicMute = !_musicMute;
  try { localStorage.setItem('chronos_music_mute', _musicMute); } catch(e) {}
  if (_bgm) { resumeAudio(); _setMusicLevel(_musicTarget()); }
  _updateAudioUI();
}

function toggleSfxMute() {
  _sfxMute = !_sfxMute;
  try { localStorage.setItem('chronos_sfx_mute', _sfxMute); } catch(e) {}
  _updateAudioUI();
}

function _updateAudioUI() {
  var ms = document.getElementById('music-vol-slider');
  var ss = document.getElementById('sfx-vol-slider');
  var mb = document.getElementById('music-mute-btn');
  var sb = document.getElementById('sfx-mute-btn');
  if (ms) ms.value = _musicVol;
  if (ss) ss.value = _sfxVol;
  if (mb) { mb.textContent = _musicMute ? 'OFF' : 'ON'; mb.classList.toggle('muted', _musicMute); }
  if (sb) { sb.textContent = _sfxMute  ? 'OFF' : 'ON'; sb.classList.toggle('muted', _sfxMute);  }
}

// ── Page visibility: pause music when app backgrounds ─────────────────────
document.addEventListener('visibilitychange', function() {
  if (!_bgm) return;
  if (document.hidden) { _bgm.pause(); }
  else { resumeAudio(); _bgm.play().catch(function(){}); }
});

// ── Run save: the OS may kill the app once it is in the background ───────
document.addEventListener('visibilitychange', function() { if (document.hidden) saveRun(); });
window.addEventListener('pagehide', function() { saveRun(); });

// ── Consolidated init ─────────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', function() {
  // Theme
  applyTheme();
  // Bind ghost drag element and hand-card pointer handler
  ghost = document.getElementById('ghost');
  document.getElementById('hand-card').addEventListener('pointerdown', startDrag);
  // Keyboard shortcuts
  document.addEventListener('keydown', e => { if(e.key==='Escape'){closeDailyCard();closeFact();closeConfirm();cancelDel();} });
  document.addEventListener('touchmove', e => { if(isDragging)e.preventDefault(); }, {passive:false});
  // Bottom sheets close when dragged down, like their close buttons
  _sheetDrag(document.getElementById('fact-panel'), closeFact);
  _sheetDrag(document.getElementById('tp-modal'), closeTrophyModal);
  _sheetDrag(document.getElementById('dcard-modal'), closeDailyCard);
  _sheetDrag(document.getElementById('settings-sheet'), closeSettings);
  // Tabs change with a horizontal swipe on their content
  _tabSwipe('history-panel', { timelines: 'history-list', streak: 'hp-streak' }, function() { return _hpTab; }, switchHpTab);
  _tabSwipe('tp', { progress: 'tp-progress', trophies: 'tp-list' }, function() { return _tpTab; }, switchTpTab);
  // Tap outside fact panel closes it; exclude timeline cards (they open a new trivia themselves)
  function _closeFactIfOpen(e){
    if(_justPlaced)return;
    var fp=document.getElementById('fact-panel');
    if(!fp||!fp.classList.contains('open'))return;
    if(fp.contains(e.target))return;
    if(e.target.closest('.timeline-card'))return;
    closeFact();
  }
  document.getElementById('timeline-area').addEventListener('click',_closeFactIfOpen);
  document.getElementById('bottom-area').addEventListener('click',_closeFactIfOpen);
  // Set initial mode UI state
  selectMode('classic');
  updateIntroHistBtn();
  // The page is written in English: apply the language the player chose
  // (setLang saves it to chronos_lang, which was never read back before)
  try { if (localStorage.getItem('chronos_lang') === 'pt') setLang('pt'); } catch(e) {}
  // Test mode (?preview, see progression.js) stays flagged on screen at all times
  if(customPreview){
    var pv = document.createElement('div');
    pv.id = 'preview-banner';
    pv.textContent = t('preview_banner');
    document.body.appendChild(pv);
  }
  // A run left in progress (app closed, killed or reloaded) resumes straight away
  resumeSavedRun();
  // Login session, if any (no network at all when logged out)
  syncBoot();
});

window.addEventListener('load', function() {
  _updateAudioUI();
  // Patch updateSettingsUI to also refresh audio controls
  if (typeof updateSettingsUI === 'function') {
    var _origUpdateSettingsUI = updateSettingsUI;
    updateSettingsUI = function() {
      _origUpdateSettingsUI();
      var ml = document.getElementById('sett-music-lbl');
      var sl = document.getElementById('sett-sfx-lbl');
      var al = document.getElementById('sett-audio-lbl');
      if (ml) ml.textContent = (typeof lang !== 'undefined' && lang === 'pt') ? 'Música'  : 'Music';
      if (sl) sl.textContent = (typeof lang !== 'undefined' && lang === 'pt') ? 'Efeitos' : 'Effects';
      if (al) al.textContent = (typeof lang !== 'undefined' && lang === 'pt') ? 'Áudio'   : 'Audio';
      _updateAudioUI();
    };
  }
  // Start music on first user interaction anywhere
  function _startMusicOnce() {
    playMusic();
    SFX.init();
    document.removeEventListener('pointerdown', _startMusicOnce);
    document.removeEventListener('keydown',     _startMusicOnce);
  }
  document.addEventListener('pointerdown', _startMusicOnce);
  document.addEventListener('keydown',     _startMusicOnce);
  // iOS may leave the audio context suspended after the app comes back from
  // the background, and only a tap is allowed to wake it
  document.addEventListener('pointerdown', resumeAudio);
});


// ── BACK BUTTON HANDLER ───────────────────────────────────────────────────
/* Open panels, innermost last; the back button closes the last one.
   While any is open, ONE history entry of ours (the guard) sits above the
   page, whatever the number of panels: back lands on the page, and the guard
   is pushed again if panels remain. A panel closed by its own button leaves
   the guard in place for the next panel to reuse, so closing never calls
   history.back() (which is async and would race with a panel opened right
   after, as closeHistory → openCultures does) and never leaves a pile of
   dead steps behind. A back press with no panel open only meets a leftover
   guard, and goes back once more to do what back does on the page. */
var _navStack = [];
var _navGuard = !!(window.history.state && window.history.state.chronosGuard);   // the current entry is our guard (also after a reload on it)
var _navPopping = false;   // a close function is running for the back button

function _pushNavState(panel) {
  _navStack.push(panel);
  if (!_navGuard) { window.history.pushState({ chronosGuard: true }, ''); _navGuard = true; }
}

// Called by the close functions. Under the back button the panel is already
// off the stack, and a panel opened twice must not lose its outer entry
function _popNavState(panel) {
  if (_navPopping) return;
  var i = _navStack.lastIndexOf(panel);
  if (i >= 0) _navStack.splice(i, 1);
}

// A run starting or ending hides panels without their close functions (and
// the fact panel goes with the run): forget them, so back never closes a
// panel that isn't there
function resetNav() { _navStack = []; }

function _closePanel(panel) {
  switch(panel) {
    case 'history': closeHistory(); break;
    case 'compendium': closeCompendium(); break;
    case 'trophies': closeTrophies(); break;
    case 'settings': closeSettings(); break;
    case 'cultures': closeCultures(); break;
    case 'dailycard': closeDailyCard(); break;
    case 'tpmodal': closeTrophyModal(); break;
    case 'fact': closeFact(); break;
  }
}

// ── DRAG A SHEET DOWN TO CLOSE ────────────────────────────────────────────
/* The bottom sheets (fact panel, trophy/customization card, daily card,
   settings)
   follow the finger down and close when let go past SHEET_CLOSE_PX, or on a
   quick flick; short of that they spring back. A sheet scrolled down scrolls
   as usual, so the drag only starts from its top and reading a long trivia
   never closes it. The offset is --sheet-dy, used by each sheet's open
   transform in index.html; .sheet-drag turns the transition off meanwhile. */
const SHEET_CLOSE_PX = 80;
const SHEET_FLICK_PX = 30, SHEET_FLICK_MS = 250;
function _sheetDrag(el, onClose) {
  var startY = 0, startT = 0, dy = 0, armed = false, dragging = false;
  el.addEventListener('touchstart', function(e) {
    dragging = false; dy = 0;
    // Buttons and controls keep their own gestures (a volume slider moved
    // slightly downwards must not close Settings)
    armed = e.touches.length === 1 && el.scrollTop <= 0 && !e.target.closest('button, input, select, textarea');
    if (armed) { startY = e.touches[0].clientY; startT = Date.now(); }
  }, { passive: true });
  el.addEventListener('touchmove', function(e) {
    if (!armed) return;
    dy = e.touches[0].clientY - startY;
    if (!dragging) {
      if (dy < -6) { armed = false; return; }   // an upward swipe scrolls the sheet
      // From the top a downward move can't scroll it: keep the browser from
      // taking the gesture (pull-to-refresh) before it counts as a drag
      if (dy > 0) e.preventDefault();
      if (dy < 6) return;
      dragging = true; el.classList.add('sheet-drag');
    }
    e.preventDefault();
    el.style.setProperty('--sheet-dy', Math.max(0, dy) + 'px');
  }, { passive: false });
  function release(close) {
    armed = false;
    if (!dragging) return;
    dragging = false;
    el.classList.remove('sheet-drag');
    el.style.removeProperty('--sheet-dy');   // springs back, or slides out from here
    if (close) onClose();
  }
  el.addEventListener('touchend', function() {
    release(dy > SHEET_CLOSE_PX || (dy > SHEET_FLICK_PX && Date.now() - startT < SHEET_FLICK_MS));
  });
  el.addEventListener('touchcancel', function() { release(false); });
}

window.addEventListener('popstate', function(e) {
  // Forward onto the guard (desktop): it is ours again, nothing to close
  if (e.state && e.state.chronosGuard) { _navGuard = true; return; }
  _navGuard = false;
  if (!_navStack.length) { window.history.back(); return; }
  var panel = _navStack.pop();
  _navPopping = true;
  try { _closePanel(panel); } finally { _navPopping = false; }
  if (_navStack.length && !_navGuard) { window.history.pushState({ chronosGuard: true }, ''); _navGuard = true; }
});
