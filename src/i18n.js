// ── i18n.js ──────────────────────────────────────────────────────────────
// Translations, language helpers, and all language-switching logic.
// Depends on: state.js (for lang), game.js (MODE_LABEL, MODE_DRAG_LABEL),
//             ui.js (renderTimeline, renderSideBtns, renderHistoryPanel,
//                    renderCP, renderTrophies, showFact, drawCard)
// ─────────────────────────────────────────────────────────────────────────

const ERA_COLORS={Ancient:'#3ab87a',Classical:'#3a7ab8',Medieval:'#8a4ab8',Renaissance:'#b87a3a','Early Modern':'#e8c81c',Modern:'#b83a3a',Contemporary:'#b84a6a','Biblical':'#b8943a','Jewish History':'#d4a853'};

// ── TRANSLATIONS ──────────────────────────────────────────────────────────
const S={
en:{subtitle:'Timeline',drag_label:'Drag to place · tap placed cards to review',drop_here:'+ drop here',streak:'Streak',placed_lbl:'Placed',score:'Score',correct:'✓ Correct',miss_hair:'✗ By a hair!',miss_close:'✗ So close!',miss_off:'✗ Not quite —',miss_far:'✗ Way off!',miss_earlier:'place it earlier',miss_later:'place it later',miss_started_earlier:'it started earlier',miss_started_later:'it started later',miss_up:'↑ {n} up',miss_down:'↓ {n} down',miss_c_1:'1 or 2 cards',miss_c_3:'3 to 5 cards',miss_c_6:'6 to 10 cards',miss_c_11:'more than 10 cards',miss_y_years:'off by a few years',miss_y_decades2:'off by 1 or 2 decades',miss_y_decades:'off by several decades',miss_y_centuries2:'off by 1 or 2 centuries',miss_y_centuries:'off by several centuries',miss_y_millennia2:'off by 1 or 2 millennia',miss_y_millennia:'off by several millennia',miss_span:'empires and eras count from their start',fact_tag:'Historical Insight',review_tag:'Card Review',fp_continue:'Continue →',fp_more:'Facts ↻',fp_close:'✕ Close',go_won:'Well Played',go_lost:'Time Ends',sub_won:'All cards placed!',sub_ended:'Run ended',sub_lost:'All lives lost',sub_free:'Game complete!',final_score:'Final Score',play_again:'Play Again',view_history:'◷ History',history_title:'Game History',hp_close:'✕ Close',no_history:'No games played yet.\nFinish a game to see it here.',cards_placed:'cards placed',tl_lbl:'Timeline built:',ht_last_miss:'Last miss',ht_miss_hidden:'discover this card to see where it goes',classic_lbl:'Classic',free_lbl:'Free',i_sub:'History Timeline Game',i_desc:'Place historical figures, events and empires in chronological order — without seeing the dates.',mc_classic_title:'Classic',mc_classic_desc:'Place people, events and discoveries in order.',lo_lives:'Lives',lo_free:'Free',mc_free_title:'Free',mc_free_desc:'No lives. Learn without pressure.',begin:'Begin',free_mode_lbl:'Free',end_title:'End this run?',end_body:'This run will count as a loss. You can save your timeline on the end screen.',keep_playing:'Keep playing',end_run:'End run',
    hp_clear_all:'✕ Clear all',
    del_one:'Delete this game from history?',
    del_all:'Delete all saved games? This cannot be undone.',
    del_cancel:'Cancel',
    del_confirm:'Delete',
    del_confirm_all:'Delete all',
    rules_label:'Rules',era_label:'Era',
    era_all:'All Ages',era_ancient:'Ancient',era_medieval:'Medieval',era_modern:'Modern',era_contemporary:'Contemporary',hint_lbl:'Hint',skip_earned:'💡 +1 Hint — streak bonus!',
    mc_empires_title:'Empires',mc_empires_desc:'Place empires and eras by their rise and fall.',
    empires_lbl:'Empires',drag_label_empires:'Drag to place · tap cards to review',
    span_label:'Duration',region_label:'Region',
    tut_title:'Empires in Parallel',tut_sub:'How to play',
    tut_s1:'Each card shows an empire, dynasty or era with its start and end dates hidden. Place it in the correct position on the timeline.',
    tut_s2:"You're sorting by start year. Place the card where it fits chronologically among what's already placed.",
    tut_s3:"After placing, you'll see the full date span — how long the empire lasted. Some overlap with others!",
    tut_s4:'Use hints (💡) to reveal contextual clues about when an empire rose or fell.',
    tut_btn:"Let's go →",
    sub_empires_won:'All empires placed!',sub_empires_lost:'The ages crumble...',
    biblical_lbl:'Biblical',mc_biblical_title:'Biblical',mc_biblical_desc:'Prophets, kings and sacred history.',mc_roman_desc:'Ancient Greece, Rome and Byzantium.',mc_eastern_desc:'Persia, China, India and Islam.',mc_back_desc:'Back to the main menu.',cultures_title:'Cultures',cultures_i_sub:'History Timeline Game',cultures_i_desc:'Explore history through the lens of specific civilizations and traditions.',mc_roman_title:'Greco-Roman',mc_eastern_title:'Eastern',mc_back_title:'Main Menu',mc_cultures_title:'Cultures',mc_cultures_desc:'Biblical, Greco-Roman &amp; Eastern modes.',
    characters_lbl:'People',mc_characters_title:'Characters',mc_characters_desc:'Order the greatest figures in history.',
    drag_label_characters:'Drag to place · tap cards to review',
    sub_characters_won:'Every great figure placed!',sub_characters_lost:'History fades from memory...',
    drag_label_biblical:'Drag to place · tap cards to review',
    drag_label_roman:'Place Greco-Roman events and figures in order — without seeing the dates',
    drag_label_eastern:'Place Eastern civilizations and figures in order — without seeing the dates',
    sub_biblical_won:'Sacred history complete!',sub_biblical_lost:'The scroll is sealed...',
    tab_timelines:'📜 Timelines',tab_streak:'🔥 Streak',daily_play:'📅 Play Today\'s Challenge',daily_done:'✓ Completed Today',daily_comeback:'Come back tomorrow for a new challenge!',daily_current_streak:'Current Streak',daily_longest_streak:'Longest Streak',daily_title:'Daily Challenge',daily_retry:'🔄 Try Again',daily_attempt_of:'attempt {n} of {max}',daily_tries_left:'{n} of {max} tries left today',daily_no_tries:'✗ No Tries Left Today',daily_out_of_tries:'Out of tries — but the day still counts for your streak',daily_try_again_sub:'Same 18 cards, new order. You still have a try today.',daily_exit:'← Back to Menu',daily_view_card:'🎴 See Today\'s Card',daily_card_hint:'Place all 18 cards to unlock the card of the day',dcard_tag:'On This Day in History',dcard_soon:'This day\'s card is still being written — come back once it\'s ready.',dcard_close:'✕ Close',dcard_run_lbl:'Your run',daily_recover_title:'Catch-Up',daily_recover_hint:'Missed a day? Unlock its card from the calendar above.',daily_recover_btn:'🎴 Unlock this day\'s card',daily_recover_tries:'{n} of {max} tries today',daily_recover_gate:'Finish today\'s challenge first — win it, or use all {max} tries.',daily_recover_none:'Out of tries for today — {max} more tomorrow.',daily_recover_no_streak:'Card only — your streak stays as it is.',daily_recover_won_sub:'Card unlocked — your streak stays as it is.',daily_recover_again_sub:'The same 18 cards from that day, new order. You still have a catch-up try.',daily_recover_out:'Out of tries for today — this card gets {max} more tomorrow.',daily_view_card_past:'🎴 See That Day\'s Card',dcard_recovered:'recovered',
    daily_expired_sub:'The challenge of {date} closed at midnight — your run ended with the cards you had placed.',daily_recover_expired_sub:'A catch-up run can\'t carry over to another day — it ended with the cards you had placed.',
    acc_title:'☁️ Account',acc_pitch:'Keep your progress safe and play on any phone. Optional — the game works the same without an account.',acc_login:'Sign in with Google',acc_starting:'Connecting…',acc_signed_in:'Signed in as',acc_sync_now:'Sync now',acc_syncing:'Syncing…',acc_sync_offline:'No connection to the server — it will retry on its own.',acc_sync_update:'Update the app to sync (close and reopen it).',acc_sync_other:'This phone holds the progress of another account. Sign out to clear it, then sign in again.',acc_sync_never:'Not synced yet.',acc_synced_now:'Synced just now.',acc_synced_min:'Synced {n} min ago.',acc_synced_h:'Synced {n} h ago.',acc_synced_on:'Last synced on {date}.',acc_logout_title:'Sign out?',acc_logout_body:'Your progress stays safe in your account and is removed from this phone. Sign in again to bring it all back.',acc_logout_fail_body:'Could not send the latest progress of this phone to your account. Signing out now loses what was not synced.',acc_logout_anyway:'Sign out anyway',acc_cancel:'Cancel',acc_logout:'Sign out',acc_login_failed:'Couldn\'t sign in — please try again.',acc_offline:'No connection — connect to the internet to sign in.',acc_privacy:'Privacy policy',acc_on:'Signed in',acc_off:'Not signed in',pf_stats:'Stats',
    tab_trophies:'🏆 Trophies',tab_progress:'⭐ Progress',tp_earned:'earned',pf_name_ph:'Your name',pf_level:'Level {n}',pf_xp:'{xp} / {max} XP',pf_custom:'Customization',pf_total_xp:'Total: {n} XP',pf_to_next:'{n} XP to level {lvl}',go_xp_gain:'+{n} XP',go_level_up:'⬆ Level up! You reached level {n}',go_new_title:'New title: {name}',pf_mastery:'Era Mastery',pf_mastery_help:'Bronze: 25% of the era\'s cards placed correctly · Silver: 60% · Gold: 90% mastered (2+ correct and more hits than misses)',pf_mastery_next:'Next: {seal} — {n} / {goal} {what}',pf_mastery_done:'{seal} earned — {n} / {total} mastered',pf_mastery_hit:'placed',pf_mastery_mastered:'mastered',cp_mastery_lbl:'MASTERY',cp_m_all:'All',cp_m_mastered:'Mastered',cp_m_todo:'To Master',cp_title:'📚 Compendium',cp_close:'✕ Close',cp_search:'Search cards…',cp_filt_title:'Search & Filter',cp_cnt_mastered:'★ {n} mastered',cp_hist:'Your record: {ok} · {miss} — {status}',cp_ok1:'1 hit',cp_okn:'{n} hits',cp_miss1:'1 miss',cp_missn:'{n} misses',cp_need1:'1 more hit to master',cp_needn:'{n} more hits to master',cp_done:'★ mastered',cp_empire:'Empire/Era',cp_locked:'Play this card to unlock its story.',pf_records:'Records',pf_rec_mode:'Mode',pf_rec_best:'Best',pf_rec_cards:'Cards',pf_rec_streak:'Streak',pf_rec_runs:'Runs',pf_records_note:'Only runs with lives count.',go_new_record:'🏆 New record — {mode}!',em_how_start:'Every player starts as a {title}, so this emblem is yours from the very first game.',em_how_title:'Reach the title {title} (level {n}).',em_how_level:'Reach level {n}.',em_how_trophy:'Earn the trophy {name}.',em_how_free:'Available from the start.',go_xp_free:'Free Play earns no XP or mastery',lo_review:'Review',review_locked:'Review unlocks at level {n}',review_empty:'No mistakes to review in this mode/era',review_all_mastered:'All mastered — reviewing the ones you missed most',go_xp_review:'Review earns half XP · misses don\'t affect mastery',tp_progress:'Progress: {n} / {goal}.',secret_hint:'Secret trophy — keep playing to discover it.',secret_card:'Secret trophy',tp_level:'Level {n}/{total}',tp_next:'Next: {name}',tp_all_levels:'All levels unlocked!',em_how_mastery:'Earn the {seal} seal of Era Mastery in {era}.',cu_new_emblem:'New emblem: {name}',cu_new_frame:'New frame: {name}',cu_new_title:'New title: {name}',cu_new_effect:'New hit effect: {name}',cu_new_theme:'New theme: {name}',em_how_record:'Score {n} points or more in a {mode} run with lives.',th_culture_note:'Runs of this culture always use this theme.',th_mode_note_run:'Set by the {name} theme, which runs of this culture always use.',th_mode_note:'Set by the {name} theme. Choose the Classic theme in Customization to pick dark or light.',cu_title_on:'✓ In use',cu_title_follow:'✓ In use · follows your level',cu_title_follow_note:'Using the title of your current level makes your title follow your level again.',cu_locked:'🔒 Locked',cu_title_start:'Every player starts with this title.',preview_banner:'🧪 TEST',pf_preview_badge:'🧪 Preview'},
pt:{subtitle:'Linha do Tempo',drag_label:'Arraste para colocar · toque nas cartas colocadas para rever',drop_here:'+ soltar aqui',streak:'Sequência',placed_lbl:'Colocadas',score:'Pontos',correct:'✓ Correto',miss_hair:'✗ Por um triz!',miss_close:'✗ Quase!',miss_off:'✗ Não foi —',miss_far:'✗ Bem longe!',miss_earlier:'coloque antes',miss_later:'coloque depois',miss_started_earlier:'começou antes',miss_started_later:'começou depois',miss_up:'↑ {n} acima',miss_down:'↓ {n} abaixo',miss_c_1:'1 ou 2 cartas',miss_c_3:'3 a 5 cartas',miss_c_6:'6 a 10 cartas',miss_c_11:'mais de 10 cartas',miss_y_years:'erro de poucos anos',miss_y_decades2:'erro de 1 ou 2 décadas',miss_y_decades:'erro de várias décadas',miss_y_centuries2:'erro de 1 ou 2 séculos',miss_y_centuries:'erro de vários séculos',miss_y_millennia2:'erro de 1 ou 2 milênios',miss_y_millennia:'erro de vários milênios',miss_span:'impérios e eras contam pelo início',fact_tag:'Curiosidade Histórica',review_tag:'Rever Carta',fp_continue:'Continuar →',fp_more:'Fatos ↻',fp_close:'✕ Fechar',go_won:'Muito Bem',go_lost:'O Tempo Acabou',sub_won:'Todas as cartas colocadas!',sub_ended:'Partida encerrada',sub_lost:'Todas as vidas perdidas',sub_free:'Jogo completo!',final_score:'Pontuação Final',play_again:'Jogar Novamente',view_history:'◷ Histórico',history_title:'Histórico de Jogos',hp_close:'✕ Fechar',no_history:'Nenhum jogo ainda.\nTermine um jogo para vê-lo aqui.',cards_placed:'cartas colocadas',tl_lbl:'Linha do tempo:',ht_last_miss:'Último erro',ht_miss_hidden:'descubra esta carta para ver onde ela fica',classic_lbl:'Clássico',free_lbl:'Livre',i_sub:'Jogo de Linha do Tempo Histórica',i_desc:'Coloque figuras históricas, eventos e impérios em ordem cronológica — sem ver as datas.',mc_classic_title:'Clássico',mc_classic_desc:'Coloque pessoas, eventos e descobertas em ordem.',lo_lives:'Vidas',lo_free:'Livre',mc_free_title:'Livre',mc_free_desc:'Sem vidas. Aprenda sem pressão.',begin:'Começar',free_mode_lbl:'Livre',end_title:'Encerrar esta partida?',end_body:'Esta rodada contará como derrota. Você pode salvar sua timeline na tela final.',keep_playing:'Continuar jogando',end_run:'Encerrar partida',
    hp_clear_all:'✕ Limpar tudo',
    del_one:'Excluir este jogo do histórico?',
    del_all:'Excluir todos os jogos salvos? Isso não pode ser desfeito.',
    del_cancel:'Cancelar',
    del_confirm:'Excluir',
    del_confirm_all:'Excluir tudo',
    rules_label:'Regras',era_label:'Era',
    era_all:'Todas as Eras',era_ancient:'Antiga',era_medieval:'Medieval',era_modern:'Moderna',era_contemporary:'Contemporânea',hint_lbl:'Dica',skip_earned:'💡 +1 Dica — bônus de sequência!',
    mc_empires_title:'Impérios',mc_empires_desc:'Posicione impérios e eras pelo seu surgimento e queda.',
    empires_lbl:'Impérios',drag_label_empires:'Arraste para colocar · toque nas cartas para rever',
    span_label:'Duração',region_label:'Região',
    tut_title:'Impérios em Paralelo',tut_sub:'Como jogar',
    tut_s1:'Cada carta mostra um império, dinastia ou era com suas datas de início e fim ocultas. Coloque-a na posição correta na linha do tempo.',
    tut_s2:'Você está ordenando pelo ano de início. Coloque a carta onde ela se encaixa cronologicamente entre as já colocadas.',
    tut_s3:'Após colocar, você verá o intervalo completo — quanto tempo o império durou. Alguns se sobrepõem!',
    tut_s4:'Use dicas (💡) para revelar pistas contextuais sobre quando um império surgiu ou caiu.',
    tut_btn:'Vamos lá →',
    sub_empires_won:'Todos os impérios colocados!',sub_empires_lost:'As eras desmoronam...',
    biblical_lbl:'Bíblico',mc_biblical_title:'Bíblico',mc_biblical_desc:'Profetas, reis e história sagrada.',mc_roman_desc:'Grécia Antiga, Roma e Bizâncio.',mc_eastern_desc:'Pérsia, China, Índia e Islã.',mc_back_desc:'Voltar ao menu principal.',cultures_title:'Culturas',cultures_i_sub:'Jogo de Linha do Tempo Histórica',cultures_i_desc:'Explore a história através de civilizações e tradições específicas.',mc_roman_title:'Greco-Romano',mc_eastern_title:'Oriental',mc_back_title:'Menu Principal',mc_cultures_title:'Culturas',mc_cultures_desc:'Modos Bíblico, Greco-Romano e Oriental.',
    characters_lbl:'Pessoas',mc_characters_title:'Personagens',mc_characters_desc:'Ordene as maiores figuras da história.',
    drag_label_characters:'Arraste para colocar · toque nas cartas para rever',
    sub_characters_won:'Todas as grandes figuras colocadas!',sub_characters_lost:'A história se apaga da memória...',
    drag_label_biblical:'Arraste para colocar · toque nas cartas para rever',
    drag_label_roman:'Coloque eventos e figuras greco-romanas em ordem — sem ver as datas',
    drag_label_eastern:'Coloque civilizações e figuras orientais em ordem — sem ver as datas',
    sub_biblical_won:'História sagrada completa!',sub_biblical_lost:'O pergaminho é selado...',
    tab_timelines:'📜 Partidas',tab_streak:'🔥 Sequência',daily_play:'📅 Jogar Desafio de Hoje',daily_done:'✓ Concluído Hoje',daily_comeback:'Volte amanhã para um novo desafio!',daily_current_streak:'Sequência Atual',daily_longest_streak:'Maior Sequência',daily_title:'Desafio Diário',daily_retry:'🔄 Tentar Novamente',daily_attempt_of:'tentativa {n} de {max}',daily_tries_left:'{n} de {max} tentativas restantes hoje',daily_no_tries:'✗ Sem Tentativas Hoje',daily_out_of_tries:'Tentativas esgotadas — mas o dia ainda conta para sua sequência',daily_try_again_sub:'As mesmas 18 cartas, em nova ordem. Você ainda tem uma tentativa hoje.',daily_exit:'← Voltar ao Menu',daily_view_card:'🎴 Ver a Carta de Hoje',daily_card_hint:'Coloque todas as 18 cartas para desbloquear a carta do dia',dcard_tag:'Neste Dia na História',dcard_soon:'A carta deste dia ainda está sendo escrita — volte quando estiver pronta.',dcard_close:'✕ Fechar',dcard_run_lbl:'Sua partida',daily_recover_title:'Recuperação',daily_recover_hint:'Perdeu algum dia? Desbloqueie a carta dele no calendário acima.',daily_recover_btn:'🎴 Desbloquear a carta deste dia',daily_recover_tries:'{n} de {max} tentativas hoje',daily_recover_gate:'Termine o desafio de hoje primeiro — ganhe ou use as {max} tentativas.',daily_recover_none:'Tentativas esgotadas por hoje — {max} novas amanhã.',daily_recover_no_streak:'Só a carta — sua sequência não muda.',daily_recover_won_sub:'Carta desbloqueada — sua sequência continua a mesma.',daily_recover_again_sub:'As mesmas 18 cartas daquele dia, em nova ordem. Você ainda tem uma tentativa.',daily_recover_out:'Tentativas de hoje esgotadas — esta carta ganha {max} novas amanhã.',dcard_recovered:'recuperada',daily_view_card_past:'🎴 Ver a Carta do Dia',
    daily_expired_sub:'O desafio de {date} terminou à meia-noite — sua partida foi encerrada com as cartas que você já tinha colocado.',daily_recover_expired_sub:'A recuperação não continua em outro dia — a partida foi encerrada com as cartas que você já tinha colocado.',
    acc_title:'☁️ Conta',acc_pitch:'Guarde seu progresso e jogue em qualquer celular. Opcional — o jogo funciona igual sem conta.',acc_login:'Entrar com Google',acc_starting:'Conectando…',acc_signed_in:'Conectado como',acc_sync_now:'Sincronizar agora',acc_syncing:'Sincronizando…',acc_sync_offline:'Sem conexão com o servidor — tenta de novo sozinho.',acc_sync_update:'Atualize o app para sincronizar (feche e abra de novo).',acc_sync_other:'Este celular guarda o progresso de outra conta. Saia para limpar e entre de novo.',acc_sync_never:'Ainda não sincronizado.',acc_synced_now:'Sincronizado agora.',acc_synced_min:'Sincronizado há {n} min.',acc_synced_h:'Sincronizado há {n} h.',acc_synced_on:'Última sincronização em {date}.',acc_logout_title:'Sair da conta?',acc_logout_body:'Seu progresso fica guardado na sua conta e é removido deste celular. Entre de novo para trazer tudo de volta.',acc_logout_fail_body:'Não foi possível enviar o progresso mais recente deste celular para a sua conta. Sair agora perde o que não foi sincronizado.',acc_logout_anyway:'Sair mesmo assim',acc_cancel:'Cancelar',acc_logout:'Sair',acc_login_failed:'Não foi possível entrar — tente de novo.',acc_offline:'Sem conexão — conecte-se à internet para entrar.',acc_privacy:'Política de privacidade',acc_on:'Conectado',acc_off:'Não conectado',pf_stats:'Estatísticas',
    tab_trophies:'🏆 Troféus',tab_progress:'⭐ Progressão',tp_earned:'conquistados',pf_name_ph:'Seu nome',pf_level:'Nível {n}',pf_xp:'{xp} / {max} XP',pf_custom:'Personalização',pf_total_xp:'Total: {n} XP',pf_to_next:'Faltam {n} XP para o nível {lvl}',go_xp_gain:'+{n} XP',go_level_up:'⬆ Subiu de nível! Você chegou ao nível {n}',go_new_title:'Novo título: {name}',pf_mastery:'Maestria por Era',pf_mastery_help:'Bronze: 25% das cartas da era acertadas · Prata: 60% · Ouro: 90% dominadas (2+ acertos e mais acertos que erros)',pf_mastery_next:'Próximo: {seal} — {n} / {goal} {what}',pf_mastery_done:'{seal} conquistado — {n} / {total} dominadas',pf_mastery_hit:'acertadas',pf_mastery_mastered:'dominadas',cp_mastery_lbl:'MAESTRIA',cp_m_all:'Todas',cp_m_mastered:'Dominadas',cp_m_todo:'A dominar',cp_title:'📚 Compêndio',cp_close:'✕ Fechar',cp_search:'Buscar cartas…',cp_filt_title:'Buscar e filtrar',cp_cnt_mastered:'★ {n} dominadas',cp_hist:'Seu histórico: {ok} · {miss} — {status}',cp_ok1:'1 acerto',cp_okn:'{n} acertos',cp_miss1:'1 erro',cp_missn:'{n} erros',cp_need1:'falta 1 acerto para dominar',cp_needn:'faltam {n} acertos para dominar',cp_done:'★ dominada',cp_empire:'Império/Era',cp_locked:'Jogue esta carta para desbloquear sua história.',pf_records:'Recordes',pf_rec_mode:'Modo',pf_rec_best:'Recorde',pf_rec_cards:'Cartas',pf_rec_streak:'Sequência',pf_rec_runs:'Partidas',pf_records_note:'Só contam partidas com vidas.',go_new_record:'🏆 Novo recorde — {mode}!',em_how_start:'Todo jogador começa como {title}, então este emblema é seu desde a primeira partida.',em_how_title:'Alcance o título {title} (nível {n}).',em_how_level:'Alcance o nível {n}.',em_how_trophy:'Conquiste o troféu {name}.',em_how_free:'Disponível desde o início.',go_xp_free:'O Jogo Livre não dá XP nem maestria',lo_review:'Revisão',review_locked:'A Revisão é liberada no nível {n}',review_empty:'Nenhum erro para revisar neste modo/era',review_all_mastered:'Todas dominadas — revisando as que você mais errou',go_xp_review:'A Revisão dá metade do XP · erros não afetam a maestria',tp_progress:'Progresso: {n} / {goal}.',secret_hint:'Troféu secreto — continue jogando para descobrir.',secret_card:'Troféu secreto',tp_level:'Nível {n}/{total}',tp_next:'Próximo: {name}',tp_all_levels:'Todos os níveis desbloqueados!',em_how_mastery:'Conquiste o selo {seal} de Maestria por Era em {era}.',cu_new_emblem:'Novo emblema: {name}',cu_new_frame:'Nova moldura: {name}',cu_new_title:'Novo título: {name}',cu_new_effect:'Novo efeito de acerto: {name}',cu_new_theme:'Novo tema: {name}',em_how_record:'Faça {n} pontos ou mais numa partida com vidas do modo {mode}.',th_culture_note:'As partidas desta cultura sempre usam este tema.',th_mode_note_run:'Definida pelo tema {name}, que as partidas desta cultura sempre usam.',th_mode_note:'Definida pelo tema {name}. Escolha o tema Clássico em Personalização para usar escuro ou claro.',cu_title_on:'✓ Em uso',cu_title_follow:'✓ Em uso · acompanha seu nível',cu_title_follow_note:'Usar o título do seu nível atual faz seu título voltar a acompanhar o nível.',cu_locked:'🔒 Bloqueado',cu_title_start:'Todo jogador começa com este título.',preview_banner:'🧪 TESTE',pf_preview_badge:'🧪 Pré-visualização'}
};
const t=k=>S[lang][k]||k;
const cName=c=>lang==='pt'?c.name_pt:c.name;
const cCat=c=>lang==='pt'?c.cat_pt:c.cat;
const cHint=c=>lang==='pt'?c.hint_pt:c.hint;
const cClues=c=>lang==='pt'?c.clues_pt:c.clues;
const formatYear=y=>y<0?`${Math.abs(y)} ${lang==='pt'?'AEC':'BCE'}`:String(y);

// Show intro history link if there are saved games
window.addEventListener('DOMContentLoaded',()=>{
  // intro-btns visibility depends on saved data
  const btns=document.getElementById('intro-btns');if(btns&&(gameHistory.length||discoveredCards.size))btns.style.display='flex';
});

// ── INTRO ─────────────────────────────────────────────────────────────────
function setLang(l,btn){
  lang=l;
  try{localStorage.setItem('chronos_lang',l);}catch(e){}
  document.querySelectorAll('.lang-btn').forEach(b=>b.classList.remove('active'));
  if(btn)btn.classList.add('active');
  _applyAllTranslations();
}

function setLangSetting(l) {
  setLang(l);
  updateSettingsUI();
}

function _applyAllTranslations() {
  // Re-run the body of setLang without needing a button element
  var transIds = [
    ['i-sub','i_sub'],['i-desc','i_desc'],
    ['mc-classic-title','mc_classic_title'],['mc-classic-desc','mc_classic_desc'],
    ['mc-empires-title','mc_empires_title'],['mc-empires-desc','mc_empires_desc'],
    ['mc-characters-title','mc_characters_title'],['mc-characters-desc','mc_characters_desc'],
    ['mc-biblical-title','mc_biblical_title'],['mc-biblical-desc','mc_biblical_desc'],['mc-roman-desc','mc_roman_desc'],['mc-eastern-desc','mc_eastern_desc'],['mc-back-desc','mc_back_desc'],['cultures-title','cultures_title'],['cultures-i-sub','cultures_i_sub'],['cultures-i-desc','cultures_i_desc'],['mc-roman-title','mc_roman_title'],['mc-eastern-title','mc_eastern_title'],['mc-back-title','mc_back_title'],['mc-cultures-title','mc_cultures_title'],['mc-cultures-desc','mc_cultures_desc'],
    ['era-label','era_label'],
    ['ec-ancient','era_ancient'],
    ['ec-medieval','era_medieval'],['ec-modern','era_modern'],['ec-contemporary','era_contemporary'],
    ['rules-label','game_mode_lbl'],
  ];
  transIds.forEach(function(p) {
    var el = document.getElementById(p[0]);
    if (el && t(p[1]) !== p[1]) el.textContent = t(p[1]);
  });
  // Intro sub-buttons
  var hb = document.getElementById('intro-hist-btn');
  if (hb) hb.textContent = lang === 'pt' ? '📜 Histórico' : '📜 History';
  var cb = document.getElementById('intro-comp-btn');
  if (cb) cb.textContent = lang === 'pt' ? '📚 Compêndio' : '📚 Compendium';
  var tb = document.getElementById('intro-trophy-btn');
  if (tb) tb.textContent = t('tab_progress');
  var bb = document.getElementById('start-btn');
  if (bb) bb.textContent = t('begin');
  var pv = document.getElementById('preview-banner');
  if (pv) pv.textContent = t('preview_banner');
  // Main hub lives/free
  var lb = document.getElementById('lo-lives-lbl');
  if (lb) lb.textContent = t('lo_lives');
  var rb = document.getElementById('lo-review-lbl');
  if (rb) rb.textContent = t('lo_review');
  var fb = document.getElementById('lo-free-lbl');
  if (fb) fb.textContent = t('lo_free');
  // Cultures hub elements
  var cll = document.getElementById('clo-lives-lbl');
  if (cll) cll.textContent = t('lo_lives');
  var cfl = document.getElementById('clo-free-lbl');
  if (cfl) cfl.textContent = t('lo_free');
  var csb = document.getElementById('cultures-start-btn');
  if (csb) csb.textContent = t('begin');
  var chh = document.getElementById('cult-hist-btn');
  if (chh) chh.textContent = lang === 'pt' ? '📜 Histórico' : '📜 History';
  var chc = document.getElementById('cult-comp-btn');
  if (chc) chc.textContent = lang === 'pt' ? '📚 Compêndio' : '📚 Compendium';
  var cht = document.getElementById('cult-trophy-btn');
  if (cht) cht.textContent = t('tab_progress');
  // Streak tab re-render if open
  if (document.getElementById('history-panel').classList.contains('open') && _hpTab === 'streak') {
    renderStreakTab();
  }
  // Tab labels
  var _tl = document.getElementById('hp-tab-timelines');
  var _ts = document.getElementById('hp-tab-streak');
  if (_tl) _tl.textContent = t('tab_timelines');
  if (_ts) _ts.textContent = t('tab_streak');
  // ── Refresh active game UI immediately on language change ────────────
  if(gameActive){
    // In-game stat labels
    var _hdrm=document.getElementById('hdr-mode');
    if(_hdrm)_hdrm.textContent=_isDailyChallenge?_dailyHeaderLabel():t(MODE_LABEL[gameMode]||'subtitle');
    var _stlbl=document.getElementById('streak-lbl');if(_stlbl)_stlbl.textContent=t('streak');
    var _sclbl=document.getElementById('score-lbl');if(_sclbl)_sclbl.textContent=t('score');
    var _pllbl=document.getElementById('placed-lbl');if(_pllbl)_pllbl.textContent=t('placed_lbl');
    var _btlbl=document.getElementById('bottom-label');
    if(_btlbl)_btlbl.textContent=t(MODE_DRAG_LABEL[gameMode]||'drag_label');
    // Hand card
    if(currentCard){
      var _iv=currentCard.startYear!==undefined;
      var _hcn=document.getElementById('hc-name');if(_hcn)_hcn.textContent=cName(currentCard);
      var _hcc=document.getElementById('hc-cat');if(_hcc)_hcc.textContent=_iv?'':cCat(currentCard);
      var _hch=document.getElementById('hc-hint');if(_hch)_hch.textContent=cHint(currentCard);
      var _gn=document.getElementById('g-name');if(_gn)_gn.textContent=cName(currentCard);
      var _gc=document.getElementById('g-cat');if(_gc)_gc.textContent=_iv?'':cCat(currentCard);
      // Refresh active clue if one is showing
      var _clueEl=document.getElementById('hc-clue');
      if(_clueEl&&_clueEl.classList.contains('show')&&cardCluesUsed>0){
        var _cluePool=lang==='pt'?currentCard.clues_pt:currentCard.clues;
        if(_cluePool&&_cluePool[cardCluesUsed-1])_clueEl.textContent='💡 '+_cluePool[cardCluesUsed-1];
      }
    }
    // Timeline placed cards
    renderTimeline();
    // Hint/skip button labels
    renderSideBtns();
  }
  // Gameover screen if showing
  if(document.getElementById('gameover').classList.contains('show')){
    // Re-translate won/lost title by checking which key currently applies
    var _goTitleEl=document.getElementById('go-title');
    if(_goTitleEl){
      var _curTitle=_goTitleEl.textContent;
      var _wonEn=S.en.go_won;var _wonPt=S.pt.go_won;
      var _wasWon=(_curTitle===_wonEn||_curTitle===_wonPt);
      _goTitleEl.textContent=_wasWon?t('go_won'):t('go_lost');
    }
    var _goscl=document.getElementById('go-score-lbl');if(_goscl)_goscl.textContent=t('final_score');
    var _goag=document.getElementById('go-again-btn');if(_goag)_goag.textContent=t('play_again');
    var _gosv=document.getElementById('go-save-btn');
    if(_gosv&&!_gosv.disabled)_gosv.textContent=lang==='pt'?'💾 Salvar Timeline':'💾 Save Timeline';
    // Re-apply the daily retry/reward labels — they override play_again above
    _renderDailyGameover();
    _renderGameoverXp(false);
  }
  // Daily reward card modal if showing
  if(document.getElementById('dcard-modal')&&document.getElementById('dcard-modal').classList.contains('open')&&_dcardDate){
    _fillDailyCard(_dcardDate);
  }
  // Re-render open panels so dynamic content updates with new language
  if(document.getElementById('fact-panel').classList.contains('open')&&_currentFactCard){
    showFact(_currentFactCard,reviewMode,true);
  }
  if(document.getElementById('history-panel').classList.contains('open')){
    renderHistoryPanel();
  }
  if(document.getElementById('cp').classList.contains('open')){
    renderCP();   // also translates the Compendium header and search box
  }
  if(document.getElementById('tp').classList.contains('open')){
    var _tpt=document.getElementById('tp-title-txt');
    if(_tpt)_tpt.textContent=lang==='pt'?'🏆 Troféus':'🏆 Trophies';
    var _tpc=document.getElementById('tp-close');
    if(_tpc)_tpc.textContent=lang==='pt'?'✕ Fechar':'✕ Close';
    switchTpTab(_tpTab);
  }
}

