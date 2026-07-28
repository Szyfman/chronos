// ── dailycards.js ────────────────────────────────────────────────────────
// "On this day in history" reward cards for the Daily Challenge.
// Winning the daily (all 18 cards placed) unlocks that day's card in the
// challenge calendar.
//
// Keyed by MM-DD (month-day, always 2 digits) so the same 366 keys serve
// every year. Each key holds an ARRAY of cards: one entry today, but extra
// alternates can be added per day at any time — _dailyCardFor() (game.js)
// rotates by year, so a single-entry array stays stable forever.
//
// Days with no entry here are NOT broken: the modal still opens with the
// run's stats plus a "coming soon" placeholder, so content can be filled
// in gradually.
//
// CARD SCHEMA (all text fields need a _pt sibling — bilingual parity is a
// project rule; no images, the app must work offline):
//   year        Number   event year — negative = BCE
//   title       String   short headline
//   era         String   an ERA_COLORS key (i18n.js:8) — drives the card colour:
//                        Ancient · Classical · Medieval · Renaissance ·
//                        Early Modern · Modern · Contemporary · Biblical ·
//                        Jewish History
//   region      String   optional — place, shown in the meta line
//   tag         String   optional — category label (Politics, Science, …)
//   text        String   the main paragraph
//   facts       Array    optional — short bullet points
// ─────────────────────────────────────────────────────────────────────────

var DAILY_CARDS = {

  '03-15': [
    {
      year: -44,
      title: 'The Ides of March',
      title_pt: 'Os Idos de Março',
      era: 'Classical',
      region: 'Rome', region_pt: 'Roma',
      tag: 'Politics', tag_pt: 'Política',
      text: 'Julius Caesar was stabbed to death by a group of senators at the Theatre of Pompey, weeks after being named dictator for life. The conspirators believed they were saving the Republic; instead they ended it.',
      text_pt: 'Júlio César foi assassinado a punhaladas por um grupo de senadores no Teatro de Pompeu, semanas depois de ser nomeado ditador perpétuo. Os conspiradores acreditavam estar salvando a República; na prática, deram fim a ela.',
      facts: [
        'The plot was led by Marcus Junius Brutus and Gaius Cassius Longinus.',
        'Suetonius counted 23 wounds, only one of them fatal.',
        'The civil wars that followed ended with Caesar’s heir Octavian as the first Roman emperor.'
      ],
      facts_pt: [
        'A conspiração foi liderada por Marco Júnio Bruto e Caio Cássio Longino.',
        'Suetônio contou 23 ferimentos, apenas um deles fatal.',
        'As guerras civis seguintes terminaram com Otaviano, herdeiro de César, como primeiro imperador romano.'
      ]
    }
  ],

  '07-04': [
    {
      year: 1776,
      title: 'The Declaration of Independence',
      title_pt: 'A Declaração de Independência',
      era: 'Early Modern',
      region: 'Philadelphia', region_pt: 'Filadélfia',
      tag: 'Politics', tag_pt: 'Política',
      text: 'The Second Continental Congress approved the final text of the Declaration of Independence, announcing that the thirteen colonies were no longer subject to the British Crown.',
      text_pt: 'O Segundo Congresso Continental aprovou o texto final da Declaração de Independência, anunciando que as treze colônias não estavam mais sujeitas à Coroa Britânica.',
      facts: [
        'The vote for independence itself had already passed two days earlier, on 2 July.',
        'Thomas Jefferson wrote the draft in about seventeen days.',
        'Most delegates only signed the engrossed copy on 2 August.'
      ],
      facts_pt: [
        'A votação pela independência já havia sido aprovada dois dias antes, em 2 de julho.',
        'Thomas Jefferson escreveu o rascunho em cerca de dezessete dias.',
        'A maioria dos delegados só assinou a cópia oficial em 2 de agosto.'
      ]
    },
    {
      year: 1826,
      title: 'Jefferson and Adams Die Hours Apart',
      title_pt: 'Jefferson e Adams Morrem no Mesmo Dia',
      era: 'Modern',
      region: 'United States', region_pt: 'Estados Unidos',
      tag: 'Coincidence', tag_pt: 'Coincidência',
      text: 'Exactly fifty years after the Declaration they had helped create, Thomas Jefferson and John Adams — rivals, then friends by letter — died within hours of each other.',
      text_pt: 'Exatamente cinquenta anos após a Declaração que ajudaram a criar, Thomas Jefferson e John Adams — rivais e depois amigos por correspondência — morreram com poucas horas de diferença.',
      facts: [
        'Jefferson died at Monticello in the early afternoon; Adams at Quincy later the same day.',
        'Adams’ reported last words were "Thomas Jefferson survives" — he did not know Jefferson had already died.',
        'The two had exchanged 158 letters in their final fourteen years.'
      ],
      facts_pt: [
        'Jefferson morreu em Monticello no início da tarde; Adams em Quincy, mais tarde no mesmo dia.',
        'As últimas palavras atribuídas a Adams foram "Thomas Jefferson sobrevive" — ele não sabia que Jefferson já havia morrido.',
        'Os dois trocaram 158 cartas em seus últimos catorze anos de vida.'
      ]
    }
  ],

  '07-20': [
    {
      year: 1969,
      title: 'Apollo 11 Lands on the Moon',
      title_pt: 'Apollo 11 Pousa na Lua',
      era: 'Contemporary',
      region: 'Sea of Tranquility', region_pt: 'Mar da Tranquilidade',
      tag: 'Exploration', tag_pt: 'Exploração',
      text: 'The lunar module Eagle touched down in the Sea of Tranquility with Neil Armstrong and Buzz Aldrin aboard. "The Eagle has landed" reached Houston with less than a minute of fuel margin left.',
      text_pt: 'O módulo lunar Eagle pousou no Mar da Tranquilidade com Neil Armstrong e Buzz Aldrin a bordo. O aviso "a Eagle pousou" chegou a Houston com menos de um minuto de combustível de reserva.',
      facts: [
        'Armstrong took over manual control to steer clear of a boulder field.',
        'His first step came hours after landing, already 21 July in universal time.',
        'An estimated 600 million people watched — a fifth of humanity at the time.'
      ],
      facts_pt: [
        'Armstrong assumiu o controle manual para desviar de um campo de rochas.',
        'O primeiro passo veio horas depois do pouso, já 21 de julho no horário universal.',
        'Cerca de 600 milhões de pessoas assistiram — um quinto da humanidade na época.'
      ]
    }
  ],

  '07-25': [
    {
      year: 1909,
      title: 'Blériot Flies the English Channel',
      title_pt: 'Blériot Cruza o Canal da Mancha',
      era: 'Modern',
      region: 'Calais to Dover', region_pt: 'Calais a Dover',
      tag: 'Aviation', tag_pt: 'Aviação',
      text: 'Louis Blériot flew his fragile monoplane from the French coast to Dover in about 37 minutes — the first crossing of the English Channel by a heavier-than-air machine. Britain was no longer an island in the old sense.',
      text_pt: 'Louis Blériot voou seu frágil monoplano da costa francesa até Dover em cerca de 37 minutos — a primeira travessia do Canal da Mancha por uma máquina mais pesada que o ar. A Grã-Bretanha deixava de ser uma ilha no sentido antigo.',
      facts: [
        'The flight won the Daily Mail’s £1,000 prize for the first Channel crossing.',
        'Blériot had no compass and briefly lost sight of land entirely.',
        'He was flying with a foot still injured from an earlier crash.'
      ],
      facts_pt: [
        'O voo rendeu o prêmio de £1.000 do Daily Mail pela primeira travessia do Canal.',
        'Blériot não levava bússola e chegou a perder a terra de vista por completo.',
        'Ele voou com um pé ainda machucado de um acidente anterior.'
      ]
    }
  ],

  '07-26': [
    {
      year: 1956,
      title: 'Nasser Nationalises the Suez Canal',
      title_pt: 'Nasser Nacionaliza o Canal de Suez',
      era: 'Contemporary',
      region: 'Alexandria, Egypt', region_pt: 'Alexandria, Egito',
      tag: 'Politics', tag_pt: 'Política',
      text: 'In a speech in Alexandria, Egyptian president Gamal Abdel Nasser announced that the Suez Canal Company was being nationalised. Within months Britain, France and Israel invaded — and were forced to withdraw.',
      text_pt: 'Em um discurso em Alexandria, o presidente egípcio Gamal Abdel Nasser anunciou a nacionalização da Companhia do Canal de Suez. Em poucos meses, Reino Unido, França e Israel invadiram o país — e foram obrigados a recuar.',
      facts: [
        'Nasser used the name "de Lesseps" in the speech as the signal for Egyptian forces to seize the canal offices.',
        'The revenue was meant to fund the Aswan High Dam after Western financing was withdrawn.',
        'The crisis is widely read as the moment Britain ceased to act as a global power on its own terms.'
      ],
      facts_pt: [
        'Nasser usou o nome "de Lesseps" no discurso como sinal para as forças egípcias ocuparem os escritórios do canal.',
        'A receita deveria financiar a Represa de Assuã, depois que o financiamento ocidental foi retirado.',
        'A crise é lida como o momento em que o Reino Unido deixou de agir como potência global em seus próprios termos.'
      ]
    }
  ],

  '07-28': [
    {
      year: 1914,
      title: 'Austria-Hungary Declares War on Serbia',
      title_pt: 'A Áustria-Hungria Declara Guerra à Sérvia',
      era: 'Modern',
      region: 'Vienna to Belgrade', region_pt: 'Viena a Belgrado',
      tag: 'War', tag_pt: 'Guerra',
      text: 'One month after Archduke Franz Ferdinand was shot in Sarajevo, Austria-Hungary declared war on Serbia — meant as a punitive strike against a small neighbour. The alliance system did the rest: within a week Russia, Germany, France and Britain had all been pulled in, and a Balkan quarrel had become a world war.',
      text_pt: 'Um mês depois de o arquiduque Francisco Ferdinando ser assassinado em Sarajevo, a Áustria-Hungria declarou guerra à Sérvia — pensada como uma punição pontual contra um vizinho pequeno. O sistema de alianças fez o resto: em uma semana, Rússia, Alemanha, França e Reino Unido haviam sido arrastados, e uma briga nos Bálcãs virou uma guerra mundial.',
      facts: [
        'The declaration arrived by telegram — the first in history sent that way — and Belgrade at first suspected a hoax, wiring other capitals to confirm it was real.',
        'Serbia had already accepted nearly every demand of the Austrian ultimatum. Reading that reply the same day, Kaiser Wilhelm II noted that "every reason for war disappears" — the telegram had already gone out.',
        'Austro-Hungarian gunboats on the Danube shelled Belgrade that night: the Serbian capital sat on the border, and the war’s first shots fell on it within hours.'
      ],
      facts_pt: [
        'A declaração chegou por telegrama — o primeiro da história enviado assim — e Belgrado a princípio suspeitou de um trote, telegrafando a outras capitais para confirmar se era verdadeira.',
        'A Sérvia já havia aceitado quase todas as exigências do ultimato austríaco. Ao ler essa resposta no mesmo dia, o Kaiser Guilherme II anotou que "desaparece qualquer motivo para a guerra" — o telegrama já havia sido enviado.',
        'Canhoneiras austro-húngaras no Danúbio bombardearam Belgrado naquela noite: a capital sérvia ficava na fronteira, e os primeiros tiros da guerra caíram sobre ela em poucas horas.'
      ]
    }
  ],

  '07-29': [
    {
      year: 1836,
      title: 'The Arc de Triomphe Opens Without Napoleon',
      title_pt: 'O Arco do Triunfo é Inaugurado sem Napoleão',
      era: 'Modern',
      region: 'Paris', region_pt: 'Paris',
      tag: 'Architecture', tag_pt: 'Arquitetura',
      text: 'Thirty years after Napoleon ordered a triumphal arch for his armies, Paris finally got one — under a different king, a different regime, and without the emperor, dead for fifteen years. Louis-Philippe picked 29 July for the ceremony: the anniversary of the revolution that had made him king six years earlier.',
      text_pt: 'Trinta anos depois de Napoleão encomendar um arco triunfal para seus exércitos, Paris finalmente ganhou o seu — sob outro rei, outro regime e sem o imperador, morto havia quinze anos. Luís Filipe escolheu 29 de julho para a cerimônia: o aniversário da revolução que o fizera rei seis anos antes.',
      facts: [
        'Napoleon commissioned it in 1806, after Austerlitz. By his wedding procession in 1810 the arch was still a stump, so a full-size mock-up in wood and painted canvas was raised on the site for the couple to ride under.',
        'He passed beneath the finished arch exactly once — in December 1840, in a coffin, when his remains were brought back from Saint Helena.',
        'The ceremony was kept deliberately quiet. A year earlier, at the same July commemorations, a bomb aimed at Louis-Philippe had killed eighteen people.'
      ],
      facts_pt: [
        'Napoleão o encomendou em 1806, depois de Austerlitz. No cortejo de seu casamento, em 1810, o arco ainda era um toco: ergueram no local uma réplica em tamanho real, de madeira e lona pintada, para que os noivos passassem por baixo.',
        'Ele passou sob o arco pronto exatamente uma vez — em dezembro de 1840, dentro de um caixão, quando seus restos mortais voltaram de Santa Helena.',
        'A cerimônia foi mantida deliberadamente discreta. Um ano antes, nas mesmas comemorações de julho, uma bomba dirigida a Luís Filipe havia matado dezoito pessoas.'
      ]
    }
  ],

  '07-30': [
    {
      year: 762,
      title: 'Baghdad Is Founded as a Perfect Circle',
      title_pt: 'Bagdá é Fundada como um Círculo Perfeito',
      era: 'Medieval',
      region: 'Mesopotamia', region_pt: 'Mesopotâmia',
      tag: 'Cities', tag_pt: 'Cidades',
      text: 'The caliph al-Mansur had astrologers choose the hour, then set some hundred thousand workers to raise a city shaped as a perfect circle — ringed walls, four gates, and at the exact centre his own palace and the great mosque. He named it Madinat as-Salam, the City of Peace. Within fifty years it was probably the largest city on earth.',
      text_pt: 'O califa al-Mansur mandou astrólogos escolherem a hora e pôs cerca de cem mil trabalhadores para erguer uma cidade em forma de círculo perfeito — muralhas circulares, quatro portões e, no centro exato, seu próprio palácio e a grande mesquita. Batizou-a Madinat as-Salam, a Cidade da Paz. Em cinquenta anos, era provavelmente a maior cidade do mundo.',
      facts: [
        'The founding date came from a horoscope. Nawbakht, a Persian convert from Zoroastrianism, and Mashallah, a Jewish astrologer from Basra, waited for Jupiter to rise in Sagittarius.',
        'The geometry was the argument: four gates on the roads to Kufa, Basra, Khorasan and Syria, every one of them exactly the same distance from the caliph. He sat at the centre of the world by design.',
        'The official name never stuck. People kept calling it by the name of the old Persian village on the site — Baghdad — and that is the name that survived, while not one stone of the Round City has ever been found.'
      ],
      facts_pt: [
        'A data da fundação saiu de um horóscopo. Nawbakht, persa convertido do zoroastrismo, e Mashallah, astrólogo judeu de Basra, esperaram Júpiter subir em Sagitário.',
        'A geometria era o argumento: quatro portões para as estradas de Kufa, Basra, Khorasan e Síria, todos exatamente à mesma distância do califa. Ele ficava no centro do mundo por projeto.',
        'O nome oficial nunca pegou. As pessoas continuaram chamando a cidade pelo nome da antiga aldeia persa que ali existia — Bagdá — e foi esse que sobreviveu, enquanto nenhuma pedra da Cidade Redonda jamais foi encontrada.'
      ]
    }
  ],

  '07-31': [
    {
      year: 1790,
      title: 'Washington Signs the First American Patent',
      title_pt: 'Washington Assina a Primeira Patente Americana',
      era: 'Modern',
      region: 'Philadelphia', region_pt: 'Filadélfia',
      tag: 'Invention', tag_pt: 'Invenção',
      text: 'George Washington signed the first patent ever issued by the United States, and Thomas Jefferson — who had examined it himself — countersigned. The invention was not a machine but a chemical process: a better way to make potash from wood ash. Samuel Hopkins got a monopoly on it for fourteen years, and the American patent system began.',
      text_pt: 'George Washington assinou a primeira patente já concedida pelos Estados Unidos, e Thomas Jefferson — que a examinara pessoalmente — referendou. A invenção não era uma máquina, mas um processo químico: um jeito melhor de fazer potassa a partir de cinza de madeira. Samuel Hopkins ganhou o monopólio dela por catorze anos, e nascia o sistema americano de patentes.',
      facts: [
        'Potash was one of the young republic’s most valuable exports — the raw material of soap, glass, gunpowder and fertiliser. Settlers clearing forests burned the trees and sold the ashes, which turned the obstacle in the field into cash.',
        'The whole patent office was three cabinet officers reading applications by hand. Jefferson, an inventor who distrusted monopolies, ran it — and only three patents were granted in all of 1790.',
        'For two centuries the patent was credited to a Samuel Hopkins of Vermont; research in the 1990s showed he was a Quaker from Philadelphia. The original document survives at all only because it was in private hands when the 1836 Patent Office fire destroyed some ten thousand early patents.'
      ],
      facts_pt: [
        'A potassa era um dos produtos de exportação mais valiosos da jovem república — matéria-prima de sabão, vidro, pólvora e fertilizante. Colonos que desmatavam para plantar queimavam as árvores e vendiam as cinzas, transformando o obstáculo do terreno em dinheiro.',
        'Todo o escritório de patentes eram três membros do gabinete lendo pedidos à mão. Jefferson, inventor que desconfiava de monopólios, tocava o sistema — e apenas três patentes foram concedidas em todo o ano de 1790.',
        'Por dois séculos a patente foi atribuída a um Samuel Hopkins de Vermont; pesquisas nos anos 1990 mostraram que ele era um quacre da Filadélfia. O documento original só sobreviveu porque estava em mãos particulares quando o incêndio do escritório de patentes, em 1836, destruiu cerca de dez mil patentes antigas.'
      ]
    }
  ],

  '08-01': [
    {
      year: 1834,
      title: 'The British Empire Abolishes Slavery — and Pays the Owners',
      title_pt: 'O Império Britânico Abole a Escravidão — e Indeniza os Donos',
      era: 'Modern',
      region: 'British Caribbean', region_pt: 'Caribe Britânico',
      tag: 'Abolition', tag_pt: 'Abolição',
      text: 'The Slavery Abolition Act came into force across most of the British Empire, and some 800,000 people stopped being property. Almost none of them were free that morning: everyone over the age of six was reclassified as an unpaid "apprentice", still bound to the same estate. The only people paid anything that day were the former owners.',
      text_pt: 'O Slavery Abolition Act entrou em vigor na maior parte do Império Britânico, e cerca de 800 mil pessoas deixaram de ser propriedade. Quase nenhuma delas estava livre naquela manhã: todos acima de seis anos foram reclassificados como "aprendizes" não remunerados, ainda presos à mesma propriedade. Os únicos que receberam alguma coisa naquele dia foram os antigos donos.',
      facts: [
        'Britain paid £20 million in compensation to roughly 46,000 slave owners — about 40 per cent of the national budget, borrowed rather than raised. The loan was only finished being repaid in 2015, which means descendants of the enslaved spent their lives helping to pay off the enslavers.',
        'Apprenticeship was meant to run six years for field workers. Resistance and protest killed it early and full freedom came on 1 August 1838 — though Antigua and Bermuda had refused the scheme and freed everyone outright in 1834.',
        'Parliament did not act out of conscience alone. Two years earlier some 60,000 enslaved people had risen in Jamaica under Samuel Sharpe; the revolt was crushed with mass executions, and it persuaded London that the alternative to abolition was revolution.'
      ],
      facts_pt: [
        'O Reino Unido pagou £20 milhões de indenização a cerca de 46 mil donos de escravizados — perto de 40% do orçamento nacional, tomado emprestado em vez de arrecadado. O empréstimo só terminou de ser quitado em 2015, ou seja, descendentes dos escravizados passaram a vida ajudando a pagar os escravizadores.',
        'O regime de "aprendizado" deveria durar seis anos para os trabalhadores do campo. A resistência e os protestos o encerraram antes, e a liberdade plena veio em 1º de agosto de 1838 — embora Antígua e Bermudas tenham recusado o esquema e libertado todos de imediato, em 1834.',
        'O Parlamento não agiu apenas por consciência. Dois anos antes, cerca de 60 mil escravizados haviam se levantado na Jamaica sob Samuel Sharpe; a revolta foi esmagada com execuções em massa, e convenceu Londres de que a alternativa à abolição era a revolução.'
      ]
    }
  ],

  '08-08': [
    {
      year: 1588,
      title: 'The Armada Is Broken at Gravelines',
      title_pt: 'A Armada Espanhola se Desfaz em Gravelines',
      era: 'Early Modern',
      region: 'Gravelines, Flanders', region_pt: 'Gravelines, Flandres',
      tag: 'Naval', tag_pt: 'Naval',
      text: 'At midnight, eight blazing fireships drifted into the Spanish fleet anchored off Calais; the Armada cut its cables and scattered. At dawn the English fell on the broken formation off Gravelines. Philip II’s invasion of England was finished — though the Armada’s real destruction came on the long road home.',
      text_pt: 'À meia-noite, oito navios incendiários — brulotes — desceram sobre a frota espanhola ancorada em Calais; a Armada cortou as amarras e se dispersou. Ao amanhecer, os ingleses caíram sobre a formação desfeita ao largo de Gravelines. A invasão da Inglaterra planejada por Filipe II terminava ali — embora a destruição real da Armada só viesse no longo caminho de volta.',
      facts: [
        'The two sides dated their own war differently: what Madrid recorded as 8 August, London recorded as 29 July. England was still on the Julian calendar, rejecting the Gregorian reform as a Catholic invention.',
        'The fireships sank nothing at all. They only had to be terrifying — the crescent formation that had held the Armada together for a week was never re-formed.',
        'Barely five ships were lost in the battle itself. The fleet died on the retreat, driven around Scotland and Ireland by storms: of roughly 130 ships, about half never reached Spain.'
      ],
      facts_pt: [
        'Os dois lados datavam a própria guerra de forma diferente: o que Madri registrou como 8 de agosto, Londres registrou como 29 de julho. A Inglaterra ainda usava o calendário juliano, rejeitando a reforma gregoriana como invenção católica.',
        'Os brulotes não afundaram absolutamente nada. Bastava que fossem aterrorizantes — a formação em crescente que mantivera a Armada coesa por uma semana nunca mais foi refeita.',
        'Mal se perderam cinco navios na batalha em si. A frota morreu na retirada, empurrada por tempestades ao redor da Escócia e da Irlanda: de cerca de 130 navios, aproximadamente metade nunca voltou à Espanha.'
      ]
    }
  ],

  '11-09': [
    {
      year: 1989,
      title: 'The Berlin Wall Opens',
      title_pt: 'O Muro de Berlim se Abre',
      era: 'Contemporary',
      region: 'Berlin', region_pt: 'Berlim',
      tag: 'Politics', tag_pt: 'Política',
      text: 'At an evening press conference an East German official announced that citizens could cross the border — and, pressed on when, said "immediately". Crowds gathered at the checkpoints until the guards simply let them through.',
      text_pt: 'Em uma coletiva de imprensa noturna, um dirigente da Alemanha Oriental anunciou que os cidadãos poderiam cruzar a fronteira — e, pressionado sobre quando, respondeu "imediatamente". Multidões se formaram nos postos até que os guardas simplesmente as deixaram passar.',
      facts: [
        'The spokesman, Günter Schabowski, had not been briefed that the rule was meant to start the next day.',
        'Bornholmer Straße was the first crossing to give way, late that night.',
        'The wall had divided the city for 28 years.'
      ],
      facts_pt: [
        'O porta-voz, Günter Schabowski, não havia sido informado de que a regra só valeria a partir do dia seguinte.',
        'Bornholmer Straße foi a primeira passagem a ceder, no fim daquela noite.',
        'O muro dividia a cidade havia 28 anos.'
      ]
    }
  ]

};
