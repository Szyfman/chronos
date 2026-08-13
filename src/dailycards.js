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

  '08-02': [
    {
      year: -216,
      title: 'Hannibal Destroys a Roman Army at Cannae',
      title_pt: 'Aníbal Destrói um Exército Romano em Canas',
      era: 'Classical',
      region: 'Apulia, southern Italy', region_pt: 'Apúlia, sul da Itália',
      tag: 'Battle', tag_pt: 'Batalha',
      text: 'Hannibal let his own centre buckle on purpose. As the legions pressed into the sagging line, his veterans held the flanks and his cavalry closed the ring from behind — between 50,000 and 70,000 Romans died in a single afternoon, packed too tightly to raise their swords. It is the most studied tactical victory ever won, and it did not win the war.',
      text_pt: 'Aníbal deixou o próprio centro ceder de propósito. Enquanto as legiões avançavam sobre a linha que recuava, seus veteranos seguraram os flancos e sua cavalaria fechou o cerco por trás — entre 50 mil e 70 mil romanos morreram em uma única tarde, comprimidos demais para erguer a espada. É a vitória tática mais estudada da história, e não venceu a guerra.',
      facts: [
        'Among the dead were one of the two consuls, eighty senators and twenty-nine of the forty-eight military tribunes. Public mourning was capped at thirty days because the city could not function otherwise.',
        'Rome refused to ransom the survivors, refused to negotiate, armed slaves and boys of seventeen — and buried four foreigners alive in the Forum as a sacrifice. Surrender never reached a vote, and that is the reason Hannibal ultimately lost.',
        'His cavalry commander Maharbal begged him to march on Rome at once. Hannibal declined, and Maharbal is said to have answered: "You know how to win a victory, but not how to use one."'
      ],
      facts_pt: [
        'Entre os mortos estavam um dos dois cônsules, oitenta senadores e vinte e nove dos quarenta e oito tribunos militares. O luto público foi limitado a trinta dias porque, de outro modo, a cidade não teria como funcionar.',
        'Roma se recusou a resgatar os sobreviventes, recusou negociar, armou escravos e meninos de dezessete anos — e enterrou quatro estrangeiros vivos no Fórum como sacrifício. A rendição nunca chegou a ser votada, e é por isso que Aníbal acabou perdendo.',
        'Seu comandante de cavalaria, Maarbal, implorou que marchasse sobre Roma imediatamente. Aníbal recusou, e Maarbal teria respondido: "Tu sabes vencer, Aníbal, mas não sabes usar a vitória."'
      ]
    },
    {
      year: 1492,
      title: 'Spain Expels Its Jews — and the Sultan Sends Ships',
      title_pt: 'A Espanha Expulsa Seus Judeus — e o Sultão Envia Navios',
      era: 'Jewish History',
      region: 'Spain to the Ottoman Empire', region_pt: 'Espanha ao Império Otomano',
      tag: 'Exile', tag_pt: 'Exílio',
      text: 'The Alhambra Decree gave Spain’s Jews four months to convert or go, and the final deadline fell on 2 August. Somewhere between 40,000 and 200,000 people left a country their families had lived in for more than a thousand years. Sultan Bayezid II sent the Ottoman navy to carry them east.',
      text_pt: 'O Decreto de Alhambra deu aos judeus da Espanha quatro meses para se converter ou partir, e o prazo final caiu em 2 de agosto. Entre 40 mil e 200 mil pessoas deixaram um país onde suas famílias viviam havia mais de mil anos. O sultão Bayezid II enviou a marinha otomana para levá-las ao oriente.',
      facts: [
        'By tradition the deadline fell on the Ninth of Av, the fast that already mourned the destruction of both Temples in Jerusalem — the date on which Jewish memory files its catastrophes.',
        'Columbus sailed from Palos the next morning, 3 August, through harbours crowded with exiles. He opens his journal by placing the voyage in the same breath as the expulsion: the monarchs, he writes, having driven the Jews out of all their kingdoms.',
        'Thessaloniki took in the most of them and stayed a Jewish-majority city for four and a half centuries, speaking Ladino — Spanish frozen as it sounded in 1492. In 1943 the Germans deported almost all of it to Auschwitz.'
      ],
      facts_pt: [
        'Por tradição, o prazo caiu em Tishá BeAv, o jejum que já lamentava a destruição dos dois Templos de Jerusalém — a data em que a memória judaica arquiva suas catástrofes.',
        'Colombo partiu de Palos na manhã seguinte, 3 de agosto, por portos apinhados de exilados. Ele abre seu diário colocando a viagem na mesma frase que a expulsão: os monarcas, escreve, tendo expulsado os judeus de todos os seus reinos.',
        'Salonica recebeu a maior parte deles e permaneceu uma cidade de maioria judaica por quatro séculos e meio, falando ladino — o espanhol congelado como soava em 1492. Em 1943, os alemães deportaram quase toda ela para Auschwitz.'
      ]
    }
  ],

  '08-03': [
    {
      year: 1031,
      title: 'Norway Makes a Saint of the King It Killed',
      title_pt: 'A Noruega Faz Santo o Rei que Matou',
      era: 'Medieval',
      region: 'Nidaros, Norway', region_pt: 'Nidaros, Noruega',
      tag: 'Religion', tag_pt: 'Religião',
      text: 'Thirteen months after Norwegian farmers cut him down at Stiklestad, Olaf Haraldsson was dug out of a sandbank beside the river and declared holy. The bishop who did it, Grimkell, was English. The country that had risen against Olaf and driven him from his throne now had a saint — and it would build itself around him.',
      text_pt: 'Treze meses depois de camponeses noruegueses o abaterem em Stiklestad, Olaf Haraldsson foi desenterrado de um banco de areia à beira do rio e declarado santo. O bispo que fez isso, Grimkell, era inglês. O país que se levantara contra Olaf e o expulsara do trono agora tinha um santo — e passaria a se construir em torno dele.',
      facts: [
        'No pope was involved, and none could have been: Rome only reserved canonisation to itself some 140 years later. Grimkell followed the ordinary medieval procedure — exhume the body, declare it holy, move it into a church. Olaf is a saint by local acclamation.',
        'He became Rex Perpetuus Norvegiae, Norway’s eternal king. Later monarchs were held to reign as his vassals, and the cathedral raised over his grave at Nidaros — today Trondheim — grew into the greatest pilgrimage site in northern Europe.',
        'The Reformation reached Norway in 1537. The shrine was stripped and the body reburied somewhere beneath the cathedral floor, unmarked. For almost five centuries nobody has known where Norway’s eternal king actually lies.'
      ],
      facts_pt: [
        'Nenhum papa participou, e nenhum poderia: Roma só reservaria a canonização para si cerca de 140 anos depois. Grimkell seguiu o procedimento medieval comum — exumar o corpo, declará-lo santo, transladá-lo para uma igreja. Olaf é santo por aclamação local.',
        'Tornou-se Rex Perpetuus Norvegiae, o rei eterno da Noruega. Os monarcas seguintes eram tidos como seus vassalos, e a catedral erguida sobre seu túmulo em Nidaros — a atual Trondheim — virou o maior destino de peregrinação do norte da Europa.',
        'A Reforma chegou à Noruega em 1537. O relicário foi saqueado e o corpo enterrado outra vez em algum ponto sob o piso da catedral, sem marca alguma. Há quase cinco séculos ninguém sabe onde de fato jaz o rei eterno da Noruega.'
      ]
    }
  ],

  '08-04': [
    {
      year: 1854,
      title: 'The Hinomaru Is Raised for Foreign Eyes',
      title_pt: 'O Hinomaru é Erguido para Olhos Estrangeiros',
      era: 'Modern',
      region: 'Edo, Japan', region_pt: 'Edo, Japão',
      tag: 'Symbols', tag_pt: 'Símbolos',
      text: 'Four months after Perry’s gunboats forced the end of two centuries of seclusion, the shogunate ordered that every Japanese ship fly a white banner with a red sun. Japan had never had a national flag, because a country closed to the world has nobody to identify itself to. The Hinomaru was born as an answer to strangers.',
      text_pt: 'Quatro meses depois de os navios de guerra de Perry forçarem o fim de dois séculos de reclusão, o xogunato ordenou que todo navio japonês hasteasse um pano branco com um sol vermelho. O Japão nunca tivera bandeira nacional, porque um país fechado ao mundo não tem a quem se identificar. O Hinomaru nasceu como resposta a estranhos.',
      facts: [
        'The sun disc itself was ancient: "Nippon" means the origin of the sun, and the imperial line claims descent from the sun goddess Amaterasu. What was new in 1854 was not the symbol but the European idea that a country ought to have one.',
        'No law made it the national flag until 1999. For 145 years the Hinomaru flew by custom and proclamation alone — through the empire, the war and the occupation — with no statute behind it.',
        'That 1999 act quietly redrew it. The 1870 specification had set the disc slightly toward the mast on a 7:10 field; the law centred it on a 2:3 field. The banner people had saluted for over a century was a subtly different shape.'
      ],
      facts_pt: [
        'O disco solar em si era antigo: "Nippon" significa origem do sol, e a linhagem imperial se diz descendente da deusa solar Amaterasu. O que era novo em 1854 não era o símbolo, mas a ideia europeia de que um país deve ter um.',
        'Nenhuma lei o tornou bandeira nacional até 1999. Por 145 anos o Hinomaru tremulou apenas por costume e proclamação — atravessando o império, a guerra e a ocupação — sem nenhum estatuto que o sustentasse.',
        'E essa lei de 1999 o redesenhou em silêncio. A especificação de 1870 punha o disco levemente deslocado para o lado do mastro, num campo 7:10; a lei o centralizou num campo 2:3. O pano que as pessoas saudavam havia mais de um século tinha, discretamente, outra forma.'
      ]
    }
  ],

  '08-05': [
    {
      year: 25,
      title: 'The Han Dynasty Comes Back from the Dead',
      title_pt: 'A Dinastia Han Ressuscita',
      era: 'Classical',
      region: 'Northern China', region_pt: 'Norte da China',
      tag: 'Dynasty', tag_pt: 'Dinastia',
      text: 'Sixteen years after Wang Mang seized the throne and abolished the Han, a distant imperial cousin declared himself emperor and took it back. Guangwu moved the capital east to Luoyang and reassembled a house that had been formally extinct — a restoration Chinese history almost never permitted. The Han would run another two centuries.',
      text_pt: 'Dezesseis anos depois de Wang Mang tomar o trono e abolir os Han, um primo imperial distante se declarou imperador e o retomou. Guangwu mudou a capital para leste, Luoyang, e reergueu uma casa formalmente extinta — uma restauração que a história chinesa quase nunca permitiu. Os Han durariam mais dois séculos.',
      facts: [
        'The Xin dynasty was undone in good part by hydrology. Around AD 11 the Yellow River burst its banks and changed course across the plain, drowning farmland and uprooting millions. The famine that followed raised the rebel armies — among them the Red Eyebrows, who painted their brows to tell friend from foe — that pulled Wang Mang down.',
        'Guangwu was a ninth-generation descendant of an emperor, which in a house with hundreds of concubines meant a provincial landowner with a famous surname. When a rival Han claimant had his elder brother executed, he survived by refusing to mourn in public, eating and drinking and apologising as though nothing had happened.',
        'The restored dynasty held until AD 220, giving the Han some four centuries in all. Its name outlasted it by two thousand years: "Han" is still what the largest ethnic group on earth calls itself, around 1.4 billion people.'
      ],
      facts_pt: [
        'A dinastia Xin foi derrubada em boa parte pela hidrologia. Por volta do ano 11, o rio Amarelo rompeu as margens e mudou de curso pela planície, afogando lavouras e desalojando milhões. A fome que se seguiu levantou os exércitos rebeldes — entre eles as Sobrancelhas Vermelhas, que as pintavam para distinguir amigo de inimigo — que puxaram Wang Mang para baixo.',
        'Guangwu era descendente de um imperador em nona geração, o que numa casa com centenas de concubinas significava um proprietário de terras provinciano com um sobrenome famoso. Quando um pretendente Han rival mandou executar seu irmão mais velho, ele sobreviveu recusando-se a demonstrar luto em público, comendo, bebendo e pedindo desculpas como se nada tivesse acontecido.',
        'A dinastia restaurada durou até 220, dando aos Han cerca de quatro séculos no total. O nome sobreviveu a ela por dois mil anos: "Han" é como o maior grupo étnico da Terra ainda se chama, cerca de 1,4 bilhão de pessoas.'
      ]
    }
  ],

  '08-06': [
    {
      year: 1806,
      title: 'Francis II Abolishes His Own Empire',
      title_pt: 'Francisco II Abole o Próprio Império',
      era: 'Modern',
      region: 'Vienna', region_pt: 'Viena',
      tag: 'Empire', tag_pt: 'Império',
      text: 'Facing a Napoleonic ultimatum to give up the imperial title, Francis II did something stranger than surrender: he declared the Holy Roman Empire itself extinct, releasing every prince, city and official from allegiance to it. Rather than let a thousand-year-old crown pass to Napoleon, he abolished the office — and kept the Austrian throne he had invented for himself two years earlier.',
      text_pt: 'Diante de um ultimato napoleônico para abrir mão do título imperial, Francisco II fez algo mais estranho que se render: declarou extinto o próprio Sacro Império Romano-Germânico, liberando cada príncipe, cidade e funcionário do juramento de fidelidade. Em vez de deixar uma coroa milenar passar a Napoleão, aboliu o cargo — e ficou com o trono austríaco que inventara para si dois anos antes.',
      facts: [
        'He had seen it coming. In August 1804, months after Napoleon crowned himself Emperor of the French, Francis carved an Austrian Empire out of his hereditary lands and took a second imperial title. For two years he was emperor twice over — a spare crown, kept ready.',
        'Napoleon had demanded only an abdication. Declaring the empire extinct went further, and that was the point: an office nobody holds cannot be claimed. The imperial regalia were carried off to Vienna, where they still sit.',
        'Almost nobody noticed. Travelling the next day, Goethe wrote in his diary that a shouting match between his servant and the coachman stirred more feeling in the carriage than the news that the thousand-year empire had ended.'
      ],
      facts_pt: [
        'Ele viu aquilo chegando. Em agosto de 1804, meses depois de Napoleão se coroar Imperador dos Franceses, Francisco recortou um Império Austríaco de suas terras hereditárias e assumiu um segundo título imperial. Por dois anos foi imperador em dobro — uma coroa reserva, deixada pronta.',
        'Napoleão exigira apenas a abdicação. Declarar o império extinto ia além, e era esse o ponto: um cargo que ninguém ocupa não pode ser reivindicado. As insígnias imperiais foram levadas para Viena, onde estão até hoje.',
        'Quase ninguém notou. Viajando no dia seguinte, Goethe anotou no diário que uma discussão entre seu criado e o cocheiro agitou mais a carruagem do que a notícia de que o império milenar havia acabado.'
      ]
    }
  ],

  '08-07': [
    {
      year: 461,
      title: 'Majorian, the Last Emperor Who Tried',
      title_pt: 'Majoriano, o Último Imperador que Tentou',
      era: 'Classical',
      region: 'Northern Italy', region_pt: 'Norte da Itália',
      tag: 'Execution', tag_pt: 'Execução',
      text: 'Ricimer, the Germanic general who actually ran the Western Empire, could not be emperor himself — so he appointed men who would not govern. Majorian governed. He recovered Gaul and Hispania, legislated against corruption, and built a fleet to take Africa back from the Vandals. Five days after stripping him of the purple, Ricimer had him beheaded beside the river Iria. The West had fifteen years left.',
      text_pt: 'Ricimer, o general germânico que de fato comandava o Império do Ocidente, não podia ser imperador — então nomeava homens que não governassem. Majoriano governou. Retomou a Gália e a Hispânia, legislou contra a corrupção e construiu uma frota para tomar a África dos vândalos. Cinco dias depois de arrancar-lhe a púrpura, Ricimer mandou decapitá-lo à beira do rio Iria. Ao Ocidente restavam quinze anos.',
      facts: [
        'Ricimer was a barbarian and an Arian Christian, which closed the throne to him absolutely. He ran the West for fifteen years instead through emperors he raised and removed at will. Majorian was not deposed for failing — he was deposed for succeeding.',
        'The fleet decided it. Some three hundred ships lay at Cartagena, ready to retake Africa and its grain, when Vandal agents reached them in harbour and destroyed them before they sailed. Majorian never recovered the prestige, and with no army of his own left nothing stood between him and Ricimer.',
        'In 458 he had made it a crime to quarry Rome for building stone, fining the magistrates who let ancient monuments be pulled down for material. The last emperor who tried to save the empire also tried to stop people carrying the city away piece by piece.'
      ],
      facts_pt: [
        'Ricimer era bárbaro e cristão ariano, o que lhe fechava o trono em definitivo. Comandou o Ocidente por quinze anos através de imperadores que erguia e removia à vontade. Majoriano não foi deposto por fracassar — foi deposto por dar certo.',
        'A frota decidiu tudo. Cerca de trezentos navios estavam em Cartagena, prontos para retomar a África e seu trigo, quando agentes vândalos chegaram a eles ainda no porto e os destruíram antes que zarpassem. Majoriano nunca recuperou o prestígio e, sem exército próprio, nada mais restava entre ele e Ricimer.',
        'Em 458 ele tornara crime extrair pedra de Roma para construção, multando os magistrados que deixassem monumentos antigos ser derrubados por material. O último imperador que tentou salvar o império também tentou impedir que carregassem a cidade embora aos pedaços.'
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

  '08-09': [
    {
      year: 1945,
      title: 'Nagasaki Was the Second Choice',
      title_pt: 'Nagasaki Era a Segunda Opção',
      era: 'Contemporary',
      region: 'Urakami valley, Nagasaki', region_pt: 'Vale de Urakami, Nagasaki',
      tag: 'Nuclear', tag_pt: 'Nuclear',
      text: 'The target that morning was Kokura. Bockscar circled it three times for the better part of an hour while haze and smoke from a firebombing the day before hid the aiming point, then ran short of fuel and turned to its secondary target. Over Nagasaki the cloud broke for a moment, and the bomb fell some three kilometres off the intended mark, over the Urakami valley. About 35,000 people were killed outright.',
      text_pt: 'O alvo daquela manhã era Kokura. O Bockscar sobrevoou a cidade três vezes por quase uma hora enquanto a neblina e a fumaça de um bombardeio incendiário do dia anterior escondiam o ponto de mira; ficando sem combustível, voltou-se para o alvo secundário. Sobre Nagasaki as nuvens se abriram por um instante, e a bomba caiu cerca de três quilômetros fora da marca pretendida, sobre o vale de Urakami. Cerca de 35 mil pessoas morreram na hora.',
      facts: [
        'Among the dead were some 2,000 Korean forced labourers, brought to Japan to work the war plants. Japanese records counted roughly 23,000 to 28,000 industrial workers and 150 soldiers among those killed instantly.',
        'Urakami held the oldest Christian community in Japan, its cathedral the largest church in East Asia — built by families who had kept the faith through two and a half centuries of persecution. The bomb detonated almost directly above it.',
        'Japanese has a phrase for what happened to the first city: "Kokura’s luck", a disaster escaped without ever knowing it. And the hills enclosing the Urakami valley contained the blast, which is why Nagasaki, struck by the more powerful of the two bombs, lost fewer people than Hiroshima.'
      ],
      facts_pt: [
        'Entre os mortos havia cerca de 2 mil trabalhadores forçados coreanos, levados ao Japão para as fábricas de guerra. Os registros japoneses contaram entre 23 mil e 28 mil operários e 150 soldados entre os que morreram na hora.',
        'Urakami abrigava a mais antiga comunidade cristã do Japão, e sua catedral era a maior igreja do Leste Asiático — erguida por famílias que haviam mantido a fé através de dois séculos e meio de perseguição. A bomba detonou quase exatamente sobre ela.',
        'O japonês tem uma expressão para o que aconteceu com a primeira cidade: "a sorte de Kokura", o desastre do qual se escapa sem jamais saber. E as colinas que cercam o vale de Urakami contiveram a explosão — razão pela qual Nagasaki, atingida pela mais potente das duas bombas, perdeu menos gente que Hiroshima.'
      ]
    }
  ],

  '08-10': [
    {
      year: 1519,
      title: 'The Mutineer Who Finished Magellan’s Voyage',
      title_pt: 'O Amotinado que Terminou a Viagem de Magalhães',
      era: 'Renaissance',
      region: 'Seville, Spain', region_pt: 'Sevilha, Espanha',
      tag: 'Exploration', tag_pt: 'Exploração',
      text: 'Five ships left Seville for the Spice Islands under a Portuguese commander his own king had refused and Portugal now called a traitor. Magellan would be killed in the Philippines; four of the ships would be wrecked, burned or deserted. Three years later one vessel came back up the Guadalquivir under Juan Sebastián Elcano — a Basque officer Magellan had once condemned for mutiny.',
      text_pt: 'Cinco navios deixaram Sevilha rumo às Ilhas das Especiarias sob um comandante português que seu próprio rei recusara e que Portugal agora chamava de traidor. Magalhães seria morto nas Filipinas; quatro dos navios naufragariam, seriam queimados ou desertariam. Três anos depois, uma embarcação subiu de volta o Guadalquivir sob Juan Sebastián Elcano — um oficial basco que Magalhães um dia condenara por motim.',
      facts: [
        'At Port St. Julian in 1520 the Spanish captains rose against their Portuguese commander. Magellan had one beheaded, marooned two more on the shore, and put the rest in chains at hard labour — Elcano among them. Two years later the emperor granted Elcano a coat of arms bearing a globe and the words Primus circumdedisti me: you were the first to encircle me.',
        'Nobody knew how large the Pacific was. The crossing ran ninety-eight days with no fresh food, and the men ate ox-hide stripped from the yardarms and softened in seawater, along with sawdust and rats, which changed hands at half a ducat each.',
        'The voyage still turned a profit. The single ship that made it home carried some twenty-six tonnes of cloves — enough to cover the cost of the whole five-ship expedition and pay the investors besides.'
      ],
      facts_pt: [
        'No Porto de São Julião, em 1520, os capitães espanhóis se levantaram contra o comandante português. Magalhães mandou decapitar um, abandonou outros dois em terra e pôs os demais a ferros em trabalhos forçados — Elcano entre eles. Dois anos depois, o imperador concedeu a Elcano um brasão com um globo e a inscrição Primus circumdedisti me: foste o primeiro a me circundar.',
        'Ninguém sabia o tamanho do Pacífico. A travessia durou noventa e oito dias sem comida fresca, e os homens comeram couro de boi arrancado das vergas e amolecido na água do mar, além de serragem e ratos, que trocavam de mãos por meio ducado cada.',
        'E a viagem ainda deu lucro. O único navio que chegou em casa trazia cerca de vinte e seis toneladas de cravo — o bastante para cobrir o custo da expedição inteira, de cinco navios, e ainda pagar os investidores.'
      ]
    }
  ],

  '08-11': [
    {
      year: -3114,
      title: 'The Maya Long Count Begins — Before the Maya',
      title_pt: 'A Conta Longa Maia Começa — Antes dos Maias',
      era: 'Ancient',
      region: 'Mesoamerica', region_pt: 'Mesoamérica',
      tag: 'Calendar', tag_pt: 'Calendário',
      text: 'Mesoamerican peoples kept cyclical calendars that repeated every fifty-two years, and the Maya added something none of their neighbours had: a running tally of days that never reset. Writing it required a true positional zero — one of the very few times zero was invented anywhere on earth. Day one of that tally is the day the current world was made.',
      text_pt: 'Os povos mesoamericanos mantinham calendários cíclicos que se repetiam a cada cinquenta e dois anos, e os maias acrescentaram algo que nenhum vizinho tinha: uma contagem corrida de dias que nunca zerava. Escrevê-la exigiu um zero posicional verdadeiro — uma das pouquíssimas vezes em que o zero foi inventado em toda a Terra. O dia um dessa contagem é o dia em que o mundo atual foi feito.',
      facts: [
        'No Maya ever wrote "11 August 3114 BCE". That is a modern back-projection into a calendar which would not exist for another forty-six centuries; the Maya wrote 4 Ahau 8 Cumku. Scholars still disagree by two days about how to line the two systems up.',
        'There were no Maya in 3114 BCE, and no cities anywhere in Mesoamerica. Maya writing appears around 300 BCE. The count begins nearly three thousand years before the people who devised it — its day one is mythology, placed on purpose in deep time.',
        'The tally reached 13.0.0.0.0 on 21 December 2012, which the modern world read as a prophecy of the end. The Maya had not: their own inscriptions schedule events far beyond it, one at Palenque naming a date in AD 4772. The odometer simply turned over.'
      ],
      facts_pt: [
        'Nenhum maia jamais escreveu "11 de agosto de 3114 a.C.". Isso é uma retroprojeção moderna para um calendário que só existiria quarenta e seis séculos depois; os maias escreviam 4 Ahau 8 Cumku. E os estudiosos ainda divergem em dois dias sobre como alinhar os dois sistemas.',
        'Não havia maias em 3114 a.C., nem cidade alguma em toda a Mesoamérica. A escrita maia aparece por volta de 300 a.C. A contagem começa quase três mil anos antes do povo que a concebeu — seu dia um é mitologia, posta de propósito em tempo profundo.',
        'A contagem chegou a 13.0.0.0.0 em 21 de dezembro de 2012, que o mundo moderno leu como profecia do fim. Os maias não: suas próprias inscrições marcam eventos muito além disso, uma delas em Palenque nomeando uma data em 4772 d.C. O hodômetro apenas virou.'
      ]
    }
  ],

  '08-12': [
    {
      year: 1099,
      title: 'The First Crusade Ends With a Wasted Victory',
      title_pt: 'A Primeira Cruzada Termina com uma Vitória Desperdiçada',
      era: 'Medieval',
      region: 'Ascalon', region_pt: 'Ascalão',
      tag: 'Crusades', tag_pt: 'Cruzadas',
      text: 'Four weeks after Jerusalem fell, the Egyptian relief army arrived to take it back — and found the crusaders waiting. Caught at dawn outside Ascalon, the Fatimid force broke and its commander fled by ship, leaving his camp behind. It was the last battle of the First Crusade, and within weeks most of the victorious army had sailed home, their vow discharged.',
      text_pt: 'Quatro semanas depois da queda de Jerusalém, o exército egípcio de socorro chegou para retomá-la — e encontrou os cruzados à espera. Surpreendida ao amanhecer diante de Ascalão, a força fatímida se desfez e seu comandante fugiu de navio, deixando para trás o acampamento. Foi a última batalha da Primeira Cruzada e, em poucas semanas, a maior parte do exército vitorioso navegou de volta para casa, cumprido o voto.',
      facts: [
        'They won the battle and lost the city. Ascalon’s garrison offered to surrender, but to Raymond of Toulouse rather than to Godfrey, who refused to allow it. The talks collapsed, the town stayed Egyptian, and for the next fifty-four years it served as the base for raids into the kingdom the crusaders had just founded.',
        'The Fatimids were Shia, and had taken Jerusalem from the Sunni Seljuks only the year before. They had negotiated with the crusaders on the way south, seemingly reading them as Byzantine mercenaries who would fight Turks in the north while Egypt kept Palestine. Ascalon was where that reading ran out.',
        'Then almost everyone left. Godfrey was held to the new kingdom with a few hundred knights, and refused to be called king — saying, it was reported, that he would not wear gold where Christ had worn thorns. He was dead within the year, and his brother took the crown without hesitating.'
      ],
      facts_pt: [
        'Venceram a batalha e perderam a cidade. A guarnição de Ascalão ofereceu-se para se render, mas a Raimundo de Toulouse e não a Godofredo, que se recusou a permitir. As negociações ruíram, a praça continuou egípcia e, pelos cinquenta e quatro anos seguintes, serviu de base para incursões contra o reino que os cruzados acabavam de fundar.',
        'Os fatímidas eram xiitas e haviam tomado Jerusalém dos seljúcidas sunitas apenas no ano anterior. Tinham negociado com os cruzados durante a descida, aparentemente lendo-os como mercenários bizantinos que combateriam turcos ao norte enquanto o Egito ficava com a Palestina. Ascalão foi onde essa leitura se esgotou.',
        'Depois disso, quase todos foram embora. Godofredo ficou preso ao novo reino com algumas centenas de cavaleiros e recusou ser chamado de rei — dizendo, ao que se conta, que não usaria ouro onde Cristo usara espinhos. Morreu antes de completar um ano, e seu irmão aceitou a coroa sem hesitar.'
      ]
    }
  ],

  '08-13': [
    {
      year: -29,
      title: 'Octavian Triumphs for Three Days Running',
      title_pt: 'Otaviano Triunfa por Três Dias Seguidos',
      era: 'Classical',
      region: 'Rome', region_pt: 'Roma',
      tag: 'Triumph', tag_pt: 'Triunfo',
      text: 'On three consecutive days Octavian rode through Rome in triumph — first for the Dalmatian campaigns, then for Actium, then for Egypt. He was thirty-four, and the last man standing after a century of civil war. Two years later the Senate would hand him the name Augustus.',
      text_pt: 'Em três dias consecutivos, Otaviano desfilou por Roma em triunfo — primeiro pelas campanhas da Dalmácia, depois por Áccio, depois pelo Egito. Tinha trinta e quatro anos e era o último homem de pé depois de um século de guerra civil. Dois anos mais tarde o Senado lhe entregaria o nome de Augusto.',
      facts: [
        'The Egyptian treasure was large enough to move the Roman economy. Interest rates are reported to have fallen from twelve per cent to four, and land prices climbed: one conquest had refinanced the state.',
        'Cleopatra had killed herself the year before and could not be marched through the streets, so an effigy of her was carried instead — with her children by Mark Antony walking behind it.',
        'Afterwards he closed the doors of the temple of Janus, shut only when Rome was at war nowhere at all, which by tradition had happened twice in seven centuries. The triumph itself soon became a family privilege: the last one granted to a general outside the imperial house came ten years later.'
      ],
      facts_pt: [
        'O tesouro egípcio era grande o bastante para mexer com a economia romana. Diz-se que os juros caíram de doze por cento para quatro, e o preço da terra subiu: uma conquista havia refinanciado o Estado.',
        'Cleópatra se matara no ano anterior e não podia ser levada pelas ruas, então carregaram uma efígie dela — com seus filhos com Marco Antônio caminhando atrás.',
        'Em seguida ele fechou as portas do templo de Jano, cerradas apenas quando Roma não estava em guerra em lugar nenhum, o que pela tradição ocorrera duas vezes em sete séculos. E o próprio triunfo logo virou privilégio de família: o último concedido a um general de fora da casa imperial veio dez anos depois.'
      ]
    },
    {
      year: 1415,
      title: 'Henry V Wins France and Dies Two Months Short',
      title_pt: 'Henrique V Conquista a França e Morre Dois Meses Antes',
      era: 'Medieval',
      region: 'Normandy', region_pt: 'Normandia',
      tag: 'Invasion', tag_pt: 'Invasão',
      text: 'Henry V put his army ashore at the mouth of the Seine and revived the English claim to the French crown. Harfleur fell after five weeks; Agincourt came in October. By 1420 he had been named heir to France and had married the French king’s daughter. He died of dysentery in August 1422, two months before the mad king whose throne he had been promised.',
      text_pt: 'Henrique V desembarcou seu exército na foz do Sena e reavivou a reivindicação inglesa ao trono francês. Harfleur caiu em cinco semanas; Azincourt veio em outubro. Em 1420 ele já fora nomeado herdeiro da França e casara com a filha do rei francês. Morreu de disenteria em agosto de 1422, dois meses antes do rei louco cujo trono lhe havia sido prometido.',
      facts: [
        'Days before sailing he uncovered a conspiracy to depose him and crown a rival. Three noblemen were tried and beheaded at Southampton on 5 August, and the fleet left within the week.',
        'Harfleur cost him far more men to disease than to fighting. Dysentery ran through the siege camp for five weeks, killing or invaliding thousands including an earl and a bishop. He marched to Agincourt with an army already gutted.',
        'His nine-month-old son was proclaimed king of both kingdoms. By the time that boy had grown, England had lost everything won here except Calais.'
      ],
      facts_pt: [
        'Dias antes de zarpar, descobriu uma conspiração para depô-lo e coroar um rival. Três nobres foram julgados e decapitados em Southampton em 5 de agosto, e a frota partiu na mesma semana.',
        'Harfleur lhe custou muito mais homens por doença do que por combate. A disenteria varreu o acampamento do cerco por cinco semanas, matando ou incapacitando milhares, entre eles um conde e um bispo. Ele marchou para Azincourt com um exército já destroçado.',
        'Seu filho de nove meses foi proclamado rei dos dois reinos. Quando esse menino cresceu, a Inglaterra já havia perdido tudo o que se ganhou aqui, exceto Calais.'
      ]
    },
    {
      year: 1792,
      title: 'The King Is Locked in the Templars’ Tower',
      title_pt: 'O Rei é Trancado na Torre dos Templários',
      era: 'Modern',
      region: 'Paris', region_pt: 'Paris',
      tag: 'Revolution', tag_pt: 'Revolução',
      text: 'Three days after the crowd stormed the Tuileries and the Assembly stripped him of his functions, Louis XVI was taken with his family to the Temple — a fortified keep raised centuries earlier by the Knights Templar. He would leave it twice: once for his trial, and once for the scaffold.',
      text_pt: 'Três dias depois de a multidão invadir as Tulherias e a Assembleia suspendê-lo de suas funções, Luís XVI foi levado com a família para o Temple — uma torre fortificada erguida séculos antes pelos Cavaleiros Templários. Sairia de lá duas vezes: uma para o julgamento e outra para o cadafalso.',
      facts: [
        'No tribunal arrested him. The Legislative Assembly had suspended him on 10 August, and it was the insurrectionary Commune of Paris that took custody and chose the prison. The Revolutionary Tribunal did not yet exist — it would be created seven months later.',
        'He spent the imprisonment teaching his son Latin and geography. The boy, called Louis XVII by royalists, never left the Temple at all: he died inside it in 1795, aged ten.',
        'Napoleon had the tower demolished between 1808 and 1811, precisely so that it could not become a place of royalist pilgrimage. Nothing of it survives.'
      ],
      facts_pt: [
        'Nenhum tribunal o prendeu. A Assembleia Legislativa o suspendera em 10 de agosto, e foi a Comuna insurrecional de Paris que assumiu a custódia e escolheu a prisão. O Tribunal Revolucionário ainda não existia — seria criado sete meses depois.',
        'Passou o cativeiro ensinando latim e geografia ao filho. O menino, chamado Luís XVII pelos monarquistas, nunca chegou a deixar o Temple: morreu lá dentro em 1795, aos dez anos.',
        'Napoleão mandou demolir a torre entre 1808 e 1811, justamente para que ela não virasse lugar de peregrinação monarquista. Não sobrou nada dela.'
      ]
    }
  ],

  '08-14': [
    {
      year: 1791,
      title: 'The Only Slave Revolt That Ever Won',
      title_pt: 'A Única Revolta de Escravizados que Venceu',
      era: 'Modern',
      region: 'Saint-Domingue', region_pt: 'Saint-Domingue',
      tag: 'Revolution', tag_pt: 'Revolução',
      text: 'In the woods at Bois Caïman, on the northern plain of the richest colony on earth, enslaved people held a Vodou ceremony led by the houngan Dutty Boukman and swore to rise. Within days the plantations of the north were burning. Thirteen years later they had beaten Spain, Britain and Napoleon, and founded Haiti — the only nation in history created by an uprising of the enslaved.',
      text_pt: 'Na mata de Bois Caïman, na planície norte da colônia mais rica do mundo, pessoas escravizadas realizaram uma cerimônia vodu conduzida pelo houngan Dutty Boukman e juraram se levantar. Em poucos dias as plantações do norte ardiam. Treze anos depois haviam derrotado Espanha, Grã-Bretanha e Napoleão, e fundado o Haiti — a única nação da história criada por uma insurreição de escravizados.',
      facts: [
        'Saint-Domingue produced something near two fifths of the world’s sugar and more than half its coffee, on a death rate that required constant new shipments of people to sustain it. Within weeks about a thousand plantations were alight. Boukman was killed inside three months and his head put on public display.',
        'They defeated three empires. Napoleon sent tens of thousands of men to retake the colony and lost them to the fighting and to yellow fever; the failure convinced him to give up the Americas altogether, and in 1803 he sold Louisiana to the United States.',
        'France then charged them for it. In 1825 a French squadron appeared off Port-au-Prince demanding compensation for the slave owners’ lost property in exchange for recognising Haiti as a country. Haiti agreed, and finished paying in 1947.'
      ],
      facts_pt: [
        'Saint-Domingue produzia perto de dois quintos do açúcar do mundo e mais da metade do café, sobre uma taxa de mortalidade que exigia remessas constantes de novas pessoas para se sustentar. Em poucas semanas cerca de mil engenhos ardiam. Boukman foi morto em menos de três meses e sua cabeça, exposta em praça pública.',
        'Derrotaram três impérios. Napoleão enviou dezenas de milhares de homens para retomar a colônia e os perdeu entre o combate e a febre amarela; o fracasso o convenceu a desistir das Américas por completo, e em 1803 ele vendeu a Louisiana aos Estados Unidos.',
        'A França então lhes cobrou por isso. Em 1825 uma esquadra francesa surgiu diante de Porto Príncipe exigindo indenização pela propriedade perdida dos donos de escravizados, em troca de reconhecer o Haiti como país. O Haiti aceitou, e terminou de pagar em 1947.'
      ]
    }
  ],

  '08-15': [
    {
      year: 1261,
      title: 'The Emperor Walks Back into Constantinople',
      title_pt: 'O Imperador Volta a Pé a Constantinopla',
      era: 'Medieval',
      region: 'Constantinople', region_pt: 'Constantinopla',
      tag: 'Restoration', tag_pt: 'Restauração',
      text: 'Fifty-seven years after the Fourth Crusade took the city from fellow Christians, a Greek emperor came back. Michael VIII entered on foot through the Golden Gate behind an icon of the Virgin, and was crowned in Hagia Sophia. The empire he restored would last another 192 years and never again be strong.',
      text_pt: 'Cinquenta e sete anos depois de a Quarta Cruzada tomar a cidade de outros cristãos, um imperador grego voltou. Miguel VIII entrou a pé pela Porta Dourada atrás de um ícone da Virgem, e foi coroado em Santa Sofia. O império que ele restaurou duraria mais 192 anos e nunca mais seria forte.',
      facts: [
        'Nobody had planned it. Three weeks earlier a Nicaean general out scouting with some eight hundred men learned that the Latin garrison and the Venetian fleet had sailed off to raid an island, and sympathisers inside showed him an unguarded gate. Michael was two hundred miles away, asleep; his sister woke him with the news and he refused to believe her.',
        'What he recovered was a wreck. Fifty-seven years of Latin rule had emptied and stripped the city — the last Latin emperor had sold the Crown of Thorns to Louis IX of France, which is why the Sainte-Chapelle exists, and had lead stripped from palace roofs to cover his debts.',
        'Four months later Michael had the rightful emperor blinded. John IV Laskaris was eleven years old, and the patriarch excommunicated Michael for it. The restored empire began with that.'
      ],
      facts_pt: [
        'Ninguém havia planejado. Três semanas antes, um general niceno em reconhecimento com uns oitocentos homens soube que a guarnição latina e a frota veneziana haviam partido para atacar uma ilha, e simpatizantes de dentro lhe mostraram um portão desguarnecido. Miguel estava a trezentos quilômetros dali, dormindo; a irmã o acordou com a notícia e ele se recusou a acreditar nela.',
        'O que ele recuperou era um destroço. Cinquenta e sete anos de domínio latino haviam esvaziado e despojado a cidade — o último imperador latino vendera a Coroa de Espinhos a Luís IX da França, razão pela qual a Sainte-Chapelle existe, e mandara arrancar o chumbo dos telhados dos palácios para cobrir dívidas.',
        'Quatro meses depois, Miguel mandou cegar o imperador legítimo. João IV Láscaris tinha onze anos, e o patriarca o excomungou por isso. Foi assim que começou o império restaurado.'
      ]
    },
    {
      year: 1281,
      title: 'The Wall That Made the Divine Wind Work',
      title_pt: 'A Muralha que Fez o Vento Divino Funcionar',
      era: 'Medieval',
      region: 'Hakata Bay, Japan', region_pt: 'Baía de Hakata, Japão',
      tag: 'Invasion', tag_pt: 'Invasão',
      text: 'Kublai Khan sent perhaps 140,000 men and 4,400 ships against Japan — the largest seaborne invasion anywhere until the twentieth century. They could not get ashore. A typhoon found the fleet still riding at anchor and destroyed most of it, and the Japanese called the storm kamikaze, the divine wind.',
      text_pt: 'Kublai Khan enviou talvez 140 mil homens e 4.400 navios contra o Japão — a maior invasão marítima em qualquer lugar até o século XX. Não conseguiram desembarcar. Um tufão encontrou a frota ainda fundeada e destruiu a maior parte dela, e os japoneses chamaram a tempestade de kamikaze, o vento divino.',
      facts: [
        'The reason they were still at sea was a wall. After the first invasion of 1274 the Japanese built some twenty kilometres of stone rampart around Hakata Bay, and it held. Unable to take a beachhead, the Mongol fleet spent weeks at anchor. Engineering put those ships where the storm could reach them.',
        'Underwater archaeology at Takashima has since shown much of that fleet was unfit for open water. Kublai had demanded it built in roughly a year, and the yards delivered flat-bottomed river craft without keels and with masts badly stepped. The wind had help.',
        'Winning ruined the victors. Samurai who fought expected land as payment, and a defensive war conquers nothing to hand out. The debts and the resentment gnawed at the Kamakura shogunate until it collapsed about fifty years later.'
      ],
      facts_pt: [
        'O motivo de ainda estarem no mar era uma muralha. Depois da primeira invasão, em 1274, os japoneses ergueram uns vinte quilômetros de muro de pedra ao redor da Baía de Hakata, e ele aguentou. Sem conseguir uma cabeça de praia, a frota mongol passou semanas fundeada. Foi a engenharia que pôs aqueles navios onde a tempestade podia alcançá-los.',
        'A arqueologia subaquática em Takashima mostrou desde então que boa parte daquela frota não servia para mar aberto. Kublai exigira que fosse construída em cerca de um ano, e os estaleiros entregaram embarcações fluviais de fundo chato, sem quilha e com mastros mal encaixados. O vento teve ajuda.',
        'Vencer arruinou os vencedores. Os samurais que lutaram esperavam terras como pagamento, e uma guerra defensiva não conquista nada para distribuir. As dívidas e o ressentimento corroeram o xogunato Kamakura até ele ruir cerca de cinquenta anos depois.'
      ]
    }
  ],

  '08-16': [
    {
      year: 1550,
      title: 'A Rabbi Decides the First Copyright Case',
      title_pt: 'Um Rabino Decide o Primeiro Caso de Direito Autoral',
      era: 'Jewish History',
      region: 'Venice and Kraków', region_pt: 'Veneza e Cracóvia',
      tag: 'Printing', tag_pt: 'Tipografia',
      text: 'Two Christian printing houses in Venice put out the same book — Maimonides’ great code of Jewish law — and the second copied the annotations the first had paid a rabbi to write. The dispute went not to a Venetian court but to Kraków, where Rabbi Moses Isserles ruled for the annotator and forbade Jews to buy the rival edition. It is among the earliest copyright judgments anywhere, 160 years before England wrote such a law.',
      text_pt: 'Duas tipografias cristãs de Veneza publicaram o mesmo livro — o grande código de lei judaica de Maimônides — e a segunda copiou as anotações que a primeira pagara a um rabino para escrever. A disputa não foi a um tribunal veneziano, mas a Cracóvia, onde o rabino Moisés Isserles decidiu a favor do anotador e proibiu os judeus de comprar a edição rival. É uma das primeiras decisões de direito autoral de que se tem notícia, 160 anos antes de a Inglaterra escrever uma lei assim.',
      facts: [
        'Isserles had no state behind him, so he used the only instrument he had: a herem, a ban, making it a religious offence to buy the copied edition until the original had sold out. The jurisdiction was entirely voluntary — it worked because people chose to be bound by it.',
        'The two printers then denounced each other to the papal authorities, and the quarrel drew the Church’s attention to what the Hebrew presses of Venice were producing.',
        'In 1553 Pope Julius III ordered the Talmud burned. Copies went up in Rome’s Campo de’ Fiori and then across Italy, and Venice — the greatest centre of Hebrew printing in Europe — never recovered its place. The first copyright fight helped burn the books it was fought over.'
      ],
      facts_pt: [
        'Isserles não tinha Estado algum por trás, então usou o único instrumento que possuía: um herem, um banimento, tornando falta religiosa comprar a edição copiada até que a original se esgotasse. A jurisdição era inteiramente voluntária — funcionou porque as pessoas escolheram se submeter a ela.',
        'Os dois tipógrafos passaram então a se denunciar mutuamente às autoridades papais, e a briga chamou a atenção da Igreja para o que as prensas hebraicas de Veneza andavam produzindo.',
        'Em 1553 o papa Júlio III mandou queimar o Talmude. Exemplares arderam no Campo de’ Fiori, em Roma, e depois por toda a Itália, e Veneza — o maior centro de impressão hebraica da Europa — nunca recuperou seu lugar. A primeira briga por direito autoral ajudou a queimar os livros pelos quais foi travada.'
      ]
    },
    {
      year: 1869,
      title: 'A Battalion of Children at Acosta Ñu',
      title_pt: 'Um Batalhão de Crianças em Acosta Ñu',
      era: 'Modern',
      region: 'Acosta Ñu, Paraguay', region_pt: 'Acosta Ñu, Paraguai',
      tag: 'War', tag_pt: 'Guerra',
      text: 'By 1869 Paraguay had almost no adult men left to conscript. At Acosta Ñu a force of some 3,500, a large part of them boys, was put in the field against roughly 20,000 Brazilian troops. Survivors described children with beards drawn on their faces. Paraguay now marks 16 August as its Children’s Day.',
      text_pt: 'Em 1869 o Paraguai já quase não tinha homens adultos para recrutar. Em Acosta Ñu, uma força de cerca de 3.500, boa parte dela de meninos, foi posta em campo contra cerca de 20 mil soldados brasileiros. Sobreviventes descreveram crianças com barbas desenhadas no rosto. O Paraguai marca hoje o 16 de agosto como seu Dia da Criança.',
      facts: [
        'The war had consumed the country. Estimates of Paraguay’s losses run from half to two thirds of its entire population, with the adult male population all but erased — proportionally among the most destructive wars in modern history.',
        'The Brazilian force was commanded by the Count d’Eu, the French husband of Princess Isabel and son-in-law of Emperor Pedro II. Paraguayan accounts hold that the field was set alight after the fighting with wounded still on it; the charge is still disputed in Brazil.',
        'Paraguay did not stop fighting for another seven months. The war ended on 1 March 1870, when President Solano López was killed at Cerro Corá.'
      ],
      facts_pt: [
        'A guerra havia consumido o país. As estimativas de perdas paraguaias vão de metade a dois terços de toda a população, com a população masculina adulta praticamente apagada — proporcionalmente uma das guerras mais destrutivas da era moderna.',
        'A força brasileira era comandada pelo Conde d’Eu, marido francês da princesa Isabel e genro do imperador Pedro II. Relatos paraguaios sustentam que o campo foi incendiado após o combate com feridos ainda nele; a acusação segue contestada no Brasil.',
        'O Paraguai ainda lutaria mais sete meses. A guerra terminou em 1º de março de 1870, quando o presidente Solano López foi morto em Cerro Corá.'
      ]
    },
    {
      year: 1870,
      title: 'The Charge That Taught Europe the Wrong Lesson',
      title_pt: 'A Carga que Ensinou a Lição Errada à Europa',
      era: 'Modern',
      region: 'Lorraine, France', region_pt: 'Lorena, França',
      tag: 'Cavalry', tag_pt: 'Cavalaria',
      text: 'A Prussian corps blundered into the entire French Army of the Rhine and, badly outnumbered, held the road anyway. To buy time, General von Bredow rode his cavalry brigade straight at the French guns and took them, losing about half his men. Bazaine fell back on Metz and was trapped there, and France lost the war in the field that day.',
      text_pt: 'Um corpo prussiano topou por acidente com todo o Exército francês do Reno e, em enorme inferioridade numérica, segurou a estrada assim mesmo. Para ganhar tempo, o general von Bredow lançou sua brigada de cavalaria direto contra os canhões franceses e os tomou, perdendo cerca de metade dos seus homens. Bazaine recuou para Metz e ficou preso lá, e a França perdeu a guerra em campo naquele dia.',
      facts: [
        'Bredow’s charge became known as the Death Ride, and it worked — which turned out to be the problem. European armies studied it for forty years as proof that cavalry could still take guns, and rode into 1914 believing it.',
        'Neither side had meant to fight there. The Prussians spent the day holding off a force several times their size because falling back would have opened the road the French needed.',
        'Penning Bazaine into Metz set up the encirclement at Sedan three weeks later, where Napoleon III surrendered with his army. Within six months the German Empire was proclaimed at Versailles.'
      ],
      facts_pt: [
        'A carga de Bredow ficou conhecida como a Cavalgada da Morte, e deu certo — o que acabou sendo o problema. Os exércitos europeus a estudaram por quarenta anos como prova de que a cavalaria ainda podia tomar canhões, e entraram em 1914 acreditando nisso.',
        'Nenhum dos dois lados pretendia lutar ali. Os prussianos passaram o dia contendo uma força várias vezes maior porque recuar teria aberto a estrada de que os franceses precisavam.',
        'Prender Bazaine em Metz preparou o cerco de Sedan três semanas depois, onde Napoleão III se rendeu com seu exército. Em seis meses o Império Alemão era proclamado em Versalhes.'
      ]
    }
  ],

  '08-17': [
    {
      year: 1560,
      title: 'Scotland Changes Religion Without Its Queen',
      title_pt: 'A Escócia Troca de Religião sem a Rainha',
      era: 'Renaissance',
      region: 'Edinburgh', region_pt: 'Edimburgo',
      tag: 'Reformation', tag_pt: 'Reforma',
      text: 'A parliament summoned without royal warrant adopted a new confession of faith, written in four days by six men all named John, and within a week had abolished the pope’s authority in Scotland and made saying Mass a crime. The queen was seventeen, Catholic, and in France. She never ratified any of it.',
      text_pt: 'Um parlamento convocado sem autorização régia adotou uma nova confissão de fé, escrita em quatro dias por seis homens todos chamados John, e em uma semana havia abolido a autoridade do papa na Escócia e transformado a celebração da missa em crime. A rainha tinha dezessete anos, era católica e estava na França. Nunca ratificou nada disso.',
      facts: [
        'The parliament had no clear right to sit. It met without the sovereign’s authority, and Mary, Queen of Scots, refused to confirm what it had done — the acts were not formally ratified until 1567, after she had been forced off the throne.',
        'She came home the next year, a Catholic queen in a kingdom that had just outlawed her religion. She was allowed to hear Mass privately in her own chapel, an arrangement John Knox attacked from the pulpit and then to her face.',
        'The reformers also demanded a school in every parish and a university in every substantial town, so that ordinary people could read scripture themselves. The nobles who had helped themselves to church lands declined to pay for it — but the ambition outlived them, and the literacy it eventually produced is a large part of why the Enlightenment happened in Scotland.'
      ],
      facts_pt: [
        'O parlamento não tinha direito claro de se reunir. Sessionou sem autoridade do soberano, e Maria, rainha dos escoceses, recusou-se a confirmar o que ele fizera — os atos só seriam formalmente ratificados em 1567, depois que ela foi forçada a deixar o trono.',
        'Ela voltou para casa no ano seguinte, rainha católica de um reino que acabara de tornar ilegal a sua religião. Foi autorizada a ouvir missa em particular, na própria capela, arranjo que John Knox atacou do púlpito e depois na cara dela.',
        'Os reformadores exigiram também uma escola em cada paróquia e uma universidade em cada cidade de porte, para que as pessoas comuns pudessem ler as escrituras por conta própria. Os nobres que haviam se servido das terras da Igreja recusaram-se a pagar por isso — mas a ambição sobreviveu a eles, e a alfabetização que ela acabou produzindo é boa parte da razão de o Iluminismo ter acontecido na Escócia.'
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
