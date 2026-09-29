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

  '08-18': [
    {
      year: 1783,
      title: 'The Fireball Nobody Could Explain',
      title_pt: 'A Bola de Fogo que Ninguém Soube Explicar',
      era: 'Early Modern',
      region: 'Great Britain', region_pt: 'Grã-Bretanha',
      tag: 'Astronomy', tag_pt: 'Astronomia',
      text: 'On a summer evening a fireball crossed the whole length of Britain — first seen over Shetland, running south down the east coast and out over the Channel — bright enough to light the ground, and visible for the better part of half a minute. A party on the north terrace at Windsor Castle watched it pass. One of them wrote it up for the Royal Society; another painted it.',
      text_pt: 'Numa noite de verão, uma bola de fogo cruzou a Grã-Bretanha de ponta a ponta — avistada primeiro sobre as Shetland, descendo pela costa leste e saindo sobre o Canal — brilhante o bastante para iluminar o chão, e visível por quase meio minuto. Um grupo no terraço norte do Castelo de Windsor a viu passar. Um deles escreveu o relato para a Royal Society; outro a pintou.',
      facts: [
        'Europe was already living under a strange sky. The Laki fissure in Iceland had been erupting since June, and a sulphurous haze lay over the continent all summer — the sun rising blood-red, crops failing, the air smelling of brimstone. The fireball crossed a sky people had spent months finding ominous.',
        'Almost nobody thought it came from space. Meteors were classed as weather — the word still shares its root with meteorology — and stones falling from the sky were dismissed as a country superstition. Because so many trained observers fixed its position that night, its height could be worked out at tens of miles, far above any cloud. The question was not settled for another twenty years.',
        'Nine days later the first hydrogen balloon rose over Paris, and in November two men left the ground for the first time. 1783 was the year Europeans could not stop looking up.'
      ],
      facts_pt: [
        'A Europa já vivia sob um céu estranho. A fissura de Laki, na Islândia, entrara em erupção em junho, e uma névoa sulfurosa cobriu o continente o verão inteiro — o sol nascendo vermelho-sangue, lavouras perdidas, cheiro de enxofre no ar. A bola de fogo cruzou um céu que as pessoas já achavam agourento havia meses.',
        'Quase ninguém achava que aquilo vinha do espaço. Meteoros eram classificados como fenômeno do tempo — a palavra ainda divide a raiz com meteorologia — e pedras caindo do céu eram tidas como superstição de camponês. Como muitos observadores treinados fixaram sua posição naquela noite, foi possível calcular sua altura em dezenas de quilômetros, muito acima de qualquer nuvem. A questão só se resolveria vinte anos depois.',
        'Nove dias depois, o primeiro balão de hidrogênio subiu sobre Paris, e em novembro dois homens deixaram o chão pela primeira vez. 1783 foi o ano em que os europeus não conseguiram parar de olhar para cima.'
      ]
    }
  ],

  '08-19': [
    {
      year: 797,
      title: 'Blinded in the Room Where He Was Born',
      title_pt: 'Cegado no Quarto Onde Nasceu',
      era: 'Medieval',
      region: 'Great Palace, Constantinople', region_pt: 'Grande Palácio, Constantinopla',
      tag: 'Succession', tag_pt: 'Sucessão',
      text: 'Constantine VI had spent seven years trying to rule out from under his mother, and had ruined himself doing it: to marry his mistress he put his wife aside, and the church and the monasteries turned against him. When Irene’s people came, they took him in the Porphyra, the purple chamber of the Great Palace, and blinded him there. He is thought to have died of the wounds.',
      text_pt: 'Constantino VI passara sete anos tentando governar por fora da mãe, e havia se arruinado no processo: para casar com a amante, repudiou a esposa, e a igreja e os mosteiros se voltaram contra ele. Quando os homens de Irene vieram, renderam-no na Porfira, a câmara púrpura do Grande Palácio, e o cegaram ali mesmo. Acredita-se que tenha morrido dos ferimentos.',
      facts: [
        'The Porphyra was the room imperial children were delivered in, so that they could be called porphyrogennetos — born in the purple. It was the proof of legitimacy that had made him co-emperor at the age of five.',
        'Byzantium blinded people for a reason. An emperor had to be physically whole, so mutilation disqualified a man from the throne for good without the sin or the danger of killing him. It became the ordinary way to retire a rival, used on emperors, patriarchs and generals for centuries.',
        'The chronicler Theophanes records that the sun then dimmed for seventeen days, so badly that ships lost their course, and that everyone said it had withheld its light because of the blinding of the emperor.'
      ],
      facts_pt: [
        'A Porfira era o cômodo onde os filhos imperiais nasciam, para que pudessem ser chamados de porfirogênitos — nascidos na púrpura. Era a prova de legitimidade que o tornara co-imperador aos cinco anos de idade.',
        'Bizâncio cegava por um motivo. Um imperador precisava ser fisicamente íntegro, de modo que a mutilação desqualificava um homem do trono para sempre, sem o pecado nem o risco de matá-lo. Virou a forma corriqueira de aposentar um rival, aplicada a imperadores, patriarcas e generais por séculos.',
        'O cronista Teófanes registra que o sol então escureceu por dezessete dias, a ponto de os navios perderem o rumo, e que todos diziam ter ele retido sua luz por causa do cegamento do imperador.'
      ]
    }
  ],

  '08-20': [
    {
      year: 917,
      title: 'The Bones Were Still There Seventy Years Later',
      title_pt: 'Os Ossos Ainda Estavam Lá Setenta Anos Depois',
      era: 'Medieval',
      region: 'Black Sea coast, Bulgaria', region_pt: 'Costa do Mar Negro, Bulgária',
      tag: 'Battle', tag_pt: 'Batalha',
      text: 'One of the largest armies Byzantium had assembled in generations met Simeon of Bulgaria on the Black Sea coast, and lost it all. The collapse began with a rumour that the Byzantine commander had been killed: the line broke, and the killing went on down the shore. It was among the bloodiest days of the medieval centuries and the worst Byzantine defeat in living memory.',
      text_pt: 'Um dos maiores exércitos que Bizâncio reunira em gerações encontrou Simeão da Bulgária na costa do Mar Negro, e perdeu tudo. O colapso começou com um boato de que o comandante bizantino fora morto: a linha se rompeu, e a matança seguiu costa abaixo. Foi um dos dias mais sangrentos dos séculos medievais e a pior derrota bizantina em memória viva.',
      facts: [
        'Seventy-odd years afterwards the historian Leo the Deacon wrote that the heaps of bones were still lying there by the river. Nobody had ever come to bury them.',
        'The plan had depended on help that never came. The Pechenegs were to attack from the north and did not, after falling out with the admiral Romanos Lekapenos, whose fleet then failed to support the army either. Three years later Lekapenos took the throne for himself and ruled as emperor for a quarter of a century.',
        'This was the high-water mark, and it did not hold. Bulgarian power ebbed after Simeon died in 927, and within a century Basil II had broken the country and earned the name Bulgar-Slayer for how he did it.'
      ],
      facts_pt: [
        'Uns setenta anos depois, o historiador Leão, o Diácono, escreveu que os montes de ossos ainda estavam lá, junto ao rio. Ninguém jamais fora enterrá-los.',
        'O plano dependia de uma ajuda que não veio. Os pechenegues deveriam atacar pelo norte e não atacaram, após se desentenderem com o almirante Romano Lecapeno, cuja frota também deixou de apoiar o exército. Três anos mais tarde, Lecapeno tomou o trono para si e governou como imperador por um quarto de século.',
        'Este foi o ponto mais alto, e ele não se sustentou. O poder búlgaro refluiu depois da morte de Simeão, em 927, e em menos de um século Basílio II havia quebrado o país e ganhado o nome de Matador de Búlgaros pelo modo como o fez.'
      ]
    }
  ],

  '08-21': [
    {
      year: 1778,
      title: 'The American War Reaches India',
      title_pt: 'A Guerra Americana Chega à Índia',
      era: 'Early Modern',
      region: 'Pondichéry, India', region_pt: 'Pondicherry, Índia',
      tag: 'Siege', tag_pt: 'Cerco',
      text: 'Six months after France joined the American rebels, British troops opened a siege eight thousand miles from Boston, around a French trading town on the Coromandel coast. What had begun as a quarrel over colonial taxation was now being fought in the Channel, the Caribbean, West Africa and the Bay of Bengal.',
      text_pt: 'Seis meses depois de a França aderir aos rebeldes americanos, tropas britânicas abriram um cerco a treze mil quilômetros de Boston, em torno de uma feitoria francesa na costa de Coromandel. O que começara como uma briga por impostos coloniais agora era travado no Canal da Mancha, no Caribe, na África Ocidental e na Baía de Bengala.',
      facts: [
        'France turned a colonial revolt into a world war. Within two years Britain was fighting France, Spain and the Dutch Republic at once, with no ally in Europe, and had to defend Gibraltar, the sugar islands and India while trying to hold America.',
        'Pondichéry changed hands so often it became a kind of barometer of Anglo-French relations — taken, returned by treaty, taken again. It stayed French long after the rest of India was not, and was only handed over to India in 1954.',
        'Britain lost the war and the thirteen colonies, and came out of it with a firmer grip on India. The empire that emerged from 1783 had its centre of gravity in Asia rather than the Atlantic.'
      ],
      facts_pt: [
        'A França transformou uma revolta colonial em guerra mundial. Em dois anos a Grã-Bretanha lutava contra França, Espanha e República Holandesa ao mesmo tempo, sem aliado algum na Europa, tendo de defender Gibraltar, as ilhas do açúcar e a Índia enquanto tentava segurar a América.',
        'Pondicherry trocou de mãos tantas vezes que virou uma espécie de barômetro das relações anglo-francesas — tomada, devolvida por tratado, tomada de novo. Continuou francesa muito depois de o resto da Índia não ser, e só foi entregue à Índia em 1954.',
        'A Grã-Bretanha perdeu a guerra e as treze colônias, e saiu dela com a Índia mais firme na mão. O império que emergiu de 1783 tinha seu centro de gravidade na Ásia, não no Atlântico.'
      ]
    }
  ],

  '08-22': [
    {
      year: 1942,
      title: 'A Dictatorship Declares War on Fascism',
      title_pt: 'Uma Ditadura Declara Guerra ao Fascismo',
      era: 'Contemporary',
      region: 'Brazil', region_pt: 'Brasil',
      tag: 'War', tag_pt: 'Guerra',
      text: 'German submarines had sunk five Brazilian ships in three days off the north-east coast, drowning some six hundred people, most of them civilians. The streets filled, and Getúlio Vargas — who ran an authoritarian state built partly on the fascist model — declared war on Germany, Japan and Italy.',
      text_pt: 'Submarinos alemães haviam afundado cinco navios brasileiros em três dias na costa nordeste, matando cerca de seiscentas pessoas, a maioria civis. As ruas se encheram, e Getúlio Vargas — que comandava um Estado autoritário erguido em parte sobre o modelo fascista — declarou guerra à Alemanha, ao Japão e à Itália.',
      facts: [
        'Brazil was the only South American country to put soldiers on the ground in Europe. Some twenty-five thousand men of the Brazilian Expeditionary Force fought in Italy under American command from 1944.',
        'People had said it was likelier for a snake to smoke than for Brazil to send troops to the front. The force adopted a smoking snake as its insignia and painted it on its equipment.',
        'The war undid the regime that fought it. Vargas was removed in October 1945, two months after the surrender — a government that had sent men to fight dictatorship abroad could not easily explain itself at home when they came back.'
      ],
      facts_pt: [
        'O Brasil foi o único país sul-americano a pôr soldados em terra na Europa. Cerca de vinte e cinco mil homens da Força Expedicionária Brasileira combateram na Itália sob comando americano a partir de 1944.',
        'Diziam ser mais fácil uma cobra fumar do que o Brasil mandar tropas para o front. A força adotou a cobra fumando como emblema e a pintou em seus equipamentos.',
        'A guerra desfez o regime que a travou. Vargas foi deposto em outubro de 1945, dois meses depois da rendição — um governo que mandara homens combater a ditadura lá fora tinha dificuldade de se explicar em casa quando eles voltaram.'
      ]
    }
  ],

  '08-23': [
    {
      year: 79,
      title: 'The Date of the Eruption May Be Wrong',
      title_pt: 'A Data da Erupção Talvez Esteja Errada',
      era: 'Classical',
      region: 'Bay of Naples', region_pt: 'Baía de Nápoles',
      tag: 'Archaeology', tag_pt: 'Arqueologia',
      text: 'Tradition puts the first tremors on the feast of Vulcan, god of fire, with the mountain opening the next day. It is a very tidy story, and the physical evidence coming out of Pompeii keeps pointing somewhere else — to an autumn eruption, two months later than everyone has said for four hundred years.',
      text_pt: 'A tradição põe os primeiros tremores na festa de Vulcano, deus do fogo, com a montanha se abrindo no dia seguinte. É uma história muito bem-arrumada, e as evidências físicas que saem de Pompeia insistem em apontar para outro lugar — uma erupção de outono, dois meses depois do que todo mundo diz há quatrocentos anos.',
      facts: [
        'In 2018 excavators found a line of charcoal writing on a wall, dated by its own text to the sixteenth day before the calends of November — 17 October. Charcoal smudges away within weeks, so it was written shortly before the ash arrived.',
        'The food and the clothing agree with it. Pomegranates and walnuts, braziers set up against the cold, wine still fermenting in sealed jars, victims found in heavy garments: an autumn household, not one in late August.',
        'The August date rests on a single sentence in a letter Pliny the Younger wrote about twenty-five years afterwards, and the surviving copies of that letter do not agree with each other on what the date was.'
      ],
      facts_pt: [
        'Em 2018, escavadores encontraram uma linha escrita a carvão numa parede, datada pelo próprio texto do décimo sexto dia antes das calendas de novembro — 17 de outubro. Carvão se apaga em poucas semanas, então aquilo foi escrito pouco antes de a cinza chegar.',
        'A comida e a roupa concordam. Romãs e nozes, braseiros armados contra o frio, vinho ainda fermentando em jarros lacrados, vítimas encontradas com vestes pesadas: uma casa de outono, não de fim de agosto.',
        'A data de agosto se apoia numa única frase de uma carta que Plínio, o Jovem, escreveu uns vinte e cinco anos depois — e as cópias sobreviventes dessa carta não concordam entre si sobre qual era a data.'
      ]
    }
  ],

  '08-24': [
    {
      year: 1215,
      title: 'The Pope Kills Magna Carta, and Saves It',
      title_pt: 'O Papa Mata a Magna Carta, e a Salva',
      era: 'Medieval',
      region: 'Rome and England', region_pt: 'Roma e Inglaterra',
      tag: 'Law', tag_pt: 'Direito',
      text: 'Ten weeks after King John sealed it, Innocent III declared the charter void and forbade anyone to observe it. The barons went to war, and Magna Carta had to be offered again — and again, and again — as the price of peace. That is how it survived: not because it was honoured in 1215, but because it kept being reissued after it had failed.',
      text_pt: 'Dez semanas depois de o rei João a selar, Inocêncio III declarou a carta nula e proibiu que alguém a observasse. Os barões foram à guerra, e a Magna Carta teve de ser oferecida de novo — e de novo, e de novo — como preço da paz. Foi assim que sobreviveu: não porque tenha sido cumprida em 1215, mas porque continuou sendo reeditada depois de fracassar.',
      facts: [
        'England at that moment belonged to the pope. Two years earlier John had surrendered his kingdom to Innocent III and received it back as a papal fief, paying annual tribute — which is why a bishop in Rome had any standing to annul an English charter.',
        'The annulment started a civil war. The barons offered the English crown to Prince Louis of France, who landed in 1216, was proclaimed in London and held over half the country. John died of dysentery that October, leaving a nine-year-old heir.',
        'The version that actually entered English law is not the one sealed at Runnymede. It is the reissue of 1225 under Henry III, the fourth attempt, cut down and confirmed in exchange for a tax.'
      ],
      facts_pt: [
        'A Inglaterra naquele momento pertencia ao papa. Dois anos antes, João entregara seu reino a Inocêncio III e o recebera de volta como feudo papal, pagando tributo anual — razão pela qual um bispo em Roma tinha alguma legitimidade para anular uma carta inglesa.',
        'A anulação começou uma guerra civil. Os barões ofereceram a coroa inglesa ao príncipe Luís da França, que desembarcou em 1216, foi proclamado em Londres e chegou a controlar mais da metade do país. João morreu de disenteria em outubro, deixando um herdeiro de nove anos.',
        'A versão que de fato entrou no direito inglês não é a selada em Runnymede. É a reedição de 1225, sob Henrique III, a quarta tentativa, encurtada e confirmada em troca de um imposto.'
      ]
    }
  ],

  '08-25': [
    {
      year: 1609,
      title: 'He Sold It as a Spyglass',
      title_pt: 'Ele o Vendeu como Luneta',
      era: 'Early Modern',
      region: 'Venice', region_pt: 'Veneza',
      tag: 'Optics', tag_pt: 'Óptica',
      text: 'From the bell tower of St Mark’s, Galileo showed the Venetian senators ships that were still two hours from harbour. He pitched the instrument as what it plainly was to a maritime republic: a way to see an approaching fleet before it could see you. They doubled his salary and made his chair at Padua permanent.',
      text_pt: 'Do campanário de São Marcos, Galileu mostrou aos senadores venezianos navios que ainda estavam a duas horas do porto. Vendeu o instrumento pelo que ele evidentemente era para uma república marítima: um jeito de ver uma frota se aproximando antes que ela o visse. Dobraram seu salário e tornaram vitalícia sua cátedra em Pádua.',
      facts: [
        'He had not invented it. A spectacle-maker in the Netherlands had applied for a patent the year before; Galileo heard the thing described, worked out the optics himself and ground better lenses, going from roughly three times magnification to eight, and then to twenty.',
        'Four months later he turned it on Jupiter and found four points of light that moved — things going round something that was not the Earth. He named them for the Medici, took a post in Florence, and left Venice and the salary behind.',
        'The Venetians had bought a naval instrument. What they had actually financed was the end of the idea that everything in the sky went around us.'
      ],
      facts_pt: [
        'Ele não o inventara. Um fabricante de óculos nos Países Baixos pedira patente no ano anterior; Galileu ouviu a descrição, deduziu a óptica sozinho e poliu lentes melhores, passando de cerca de três vezes de ampliação para oito, e depois para vinte.',
        'Quatro meses depois apontou-o para Júpiter e encontrou quatro pontos de luz que se moviam — coisas girando em torno de algo que não era a Terra. Batizou-os em honra dos Médici, aceitou um cargo em Florença e deixou para trás Veneza e o salário.',
        'Os venezianos haviam comprado um instrumento naval. O que financiaram, na verdade, foi o fim da ideia de que tudo no céu girava em torno de nós.'
      ]
    }
  ],

  '08-26': [
    {
      year: 1071,
      title: 'Anatolia Was Lost After the Battle, Not In It',
      title_pt: 'A Anatólia Foi Perdida Depois da Batalha, Não Nela',
      era: 'Medieval',
      region: 'Manzikert, Armenia', region_pt: 'Manziquerta, Armênia',
      tag: 'Battle', tag_pt: 'Batalha',
      text: 'The Byzantine emperor was beaten and captured by the Seljuk sultan, who received him courteously and let him go. The defeat itself was survivable. What followed was not: Constantinople deposed him, blinded him so badly that he died of it, and spent ten years in civil war while Turkish groups settled the countryside nobody was defending.',
      text_pt: 'O imperador bizantino foi derrotado e capturado pelo sultão seljúcida, que o recebeu com cortesia e o deixou partir. A derrota em si era sobrevivível. O que veio depois não era: Constantinopla o depôs, o cegou de forma tão brutal que ele morreu disso, e passou dez anos em guerra civil enquanto grupos turcos se instalavam no campo que ninguém defendia.',
      facts: [
        'Alp Arslan is said to have asked Romanos what he would have done had their places been reversed. Romanos answered that he would have had him beaten to death. The sultan replied that his own punishment was the heavier one: he forgave him and set him free.',
        'Rival Byzantine claimants then hired Turkish troops against one another and paid them in land. Anatolia was not so much conquered as handed over piecemeal by men bidding for the throne in Constantinople.',
        'Anatolia was where the empire raised its soldiers and much of its grain. Twenty-four years later an emperor wrote to the pope asking for mercenaries to win it back, and got the First Crusade instead.'
      ],
      facts_pt: [
        'Conta-se que Alp Arslan perguntou a Romano o que ele teria feito se os papéis estivessem invertidos. Romano respondeu que o teria mandado espancar até a morte. O sultão retrucou que seu próprio castigo era o mais pesado: perdoava-o e o punha em liberdade.',
        'Pretendentes bizantinos rivais passaram então a contratar tropas turcas uns contra os outros e a pagá-las com terra. A Anatólia não foi tanto conquistada quanto entregue aos pedaços por homens que disputavam o trono em Constantinopla.',
        'A Anatólia era de onde o império tirava seus soldados e boa parte de seu trigo. Vinte e quatro anos depois, um imperador escreveu ao papa pedindo mercenários para retomá-la, e recebeu a Primeira Cruzada.'
      ]
    }
  ],

  '08-27': [
    {
      year: 410,
      title: 'The Gentlest Sack in Roman Memory',
      title_pt: 'O Saque Mais Brando da Memória Romana',
      era: 'Classical',
      region: 'Rome', region_pt: 'Roma',
      tag: 'Sack', tag_pt: 'Saque',
      text: 'After three days the Visigoths left, and Rome was still standing. Alaric was a Christian, and had ordered the basilicas of St Peter and St Paul kept as sanctuary; thousands sheltered inside them. By the standards Rome itself had used on Carthage and Corinth, this was mild. It still broke the world.',
      text_pt: 'Ao fim de três dias os visigodos partiram, e Roma continuava de pé. Alarico era cristão e ordenara que as basílicas de São Pedro e São Paulo fossem preservadas como refúgio; milhares se abrigaram nelas. Pelos critérios que a própria Roma aplicara a Cartago e Corinto, aquilo foi brando. Ainda assim, quebrou o mundo.',
      facts: [
        'The shock was not the damage but the fact of it. Rome had not been entered by a foreign enemy in eight hundred years, and had not been the imperial capital for a century — the emperor sat safely at Ravenna and did not come.',
        'Among the hostages carried off was Galla Placidia, the emperor’s half-sister. Four years later she married Alaric’s successor in a Roman ceremony at Narbonne, and ended her life ruling the Western Empire as regent for her son.',
        'Alaric died within months. His men are said to have diverted the river Busento, buried him in the dry bed with his share of the plunder, let the water back over him, and killed the labourers so the place could never be found. It never has been.'
      ],
      facts_pt: [
        'O choque não foi o estrago, foi o fato. Roma não era invadida por inimigo estrangeiro havia oitocentos anos, e já não era capital imperial havia um século — o imperador estava seguro em Ravena e não veio.',
        'Entre os reféns levados estava Gala Placídia, meia-irmã do imperador. Quatro anos depois casou-se com o sucessor de Alarico numa cerimônia romana em Narbona, e terminou a vida governando o Império do Ocidente como regente do próprio filho.',
        'Alarico morreu poucos meses depois. Conta-se que seus homens desviaram o rio Busento, o enterraram no leito seco com sua parte do saque, deixaram a água voltar por cima e mataram os trabalhadores para que o lugar jamais fosse achado. Nunca foi.'
      ]
    }
  ],

  '08-28': [
    {
      year: 632,
      title: 'The Grave Nobody Marked',
      title_pt: 'O Túmulo que Ninguém Marcou',
      era: 'Medieval',
      region: 'Medina', region_pt: 'Medina',
      tag: 'Islam', tag_pt: 'Islã',
      text: 'Fatimah, the daughter of Muhammad and the wife of Ali, died within months of her father. She asked to be buried at night and quietly, and the place was never marked. Where exactly she lies is unknown, and why she wanted it that way is one of the oldest disagreements in Islam.',
      text_pt: 'Fátima, filha de Maomé e esposa de Ali, morreu poucos meses depois do pai. Pediu para ser enterrada à noite e em silêncio, e o lugar nunca foi marcado. Onde exatamente ela jaz é desconhecido, e por que ela quis assim é uma das divergências mais antigas do Islã.',
      facts: [
        'The dispute over her death is really a dispute about the succession. Shia tradition holds that she was injured when a delegation came to compel her husband’s allegiance to the first caliph, and never recovered. Sunni tradition holds that she died of illness and grief in the months after losing her father.',
        'Both traditions agree on the burial itself: at night, without ceremony, in an unmarked place, at her own request. They read that request very differently.',
        'Hers is the only line of Muhammad’s that continued. From her sons Hasan and Husayn descend the millions who today claim the title of sayyid, and dynasties running from the Fatimids of Egypt to the ruling houses of Morocco and Jordan.'
      ],
      facts_pt: [
        'A divergência sobre a morte dela é, no fundo, uma divergência sobre a sucessão. A tradição xiita sustenta que ela se feriu quando uma delegação veio forçar o juramento de fidelidade do marido ao primeiro califa, e nunca se recuperou. A tradição sunita sustenta que morreu de doença e de luto nos meses após perder o pai.',
        'As duas tradições concordam quanto ao sepultamento em si: à noite, sem cerimônia, em lugar não marcado, a pedido dela. E leem esse pedido de maneiras muito diferentes.',
        'A dela é a única linhagem de Maomé que teve continuidade. De seus filhos Hasan e Huceine descendem os milhões que hoje reivindicam o título de sayyid, e dinastias que vão dos fatímidas do Egito às casas reinantes do Marrocos e da Jordânia.'
      ]
    }
  ],

  '08-29': [
    {
      year: 1756,
      title: 'He Invaded a Neutral Country to Prevent a War',
      title_pt: 'Ele Invadiu um País Neutro para Evitar uma Guerra',
      era: 'Early Modern',
      region: 'Saxony', region_pt: 'Saxônia',
      tag: 'Alliances', tag_pt: 'Alianças',
      text: 'Saxony had not attacked Prussia and was not at war with anyone. Frederick marched in regardless, reasoning that a coalition was forming against him and that he would rather start the fight than receive it. He was right that the coalition existed. Invading first is what turned it into a real one.',
      text_pt: 'A Saxônia não havia atacado a Prússia e não estava em guerra com ninguém. Frederico entrou assim mesmo, pelo raciocínio de que uma coalizão se formava contra ele e de que era melhor começar a briga do que recebê-la. Estava certo quanto à existência da coalizão. Invadir primeiro é o que a transformou numa coalizão de verdade.',
      facts: [
        'Europe had just swapped partners wholesale. Austria and France, enemies for two and a half centuries, signed an alliance against Prussia; Britain, long tied to Austria, went with Frederick instead. Contemporaries called it the reversal of alliances, and it happened in a matter of months.',
        'He held Saxony for the whole war and bled it: its army pressed into Prussian service, enormous levies extracted, its currency counterfeited to pay his troops.',
        'By January 1762 Prussia was finished, and then the Empress Elizabeth of Russia died. Her heir admired Frederick to the point of devotion, made peace at once and changed sides. Prussians called it the miracle of the House of Brandenburg: he survived because a woman in Saint Petersburg happened to die.'
      ],
      facts_pt: [
        'A Europa acabara de trocar de par por atacado. Áustria e França, inimigas havia dois séculos e meio, assinaram uma aliança contra a Prússia; a Grã-Bretanha, havia muito ligada à Áustria, foi com Frederico. Os contemporâneos chamaram aquilo de inversão das alianças, e aconteceu em questão de meses.',
        'Ele manteve a Saxônia pela guerra inteira e a sangrou: o exército saxão incorporado à força ao prussiano, contribuições enormes extraídas, a moeda falsificada para pagar suas tropas.',
        'Em janeiro de 1762 a Prússia estava acabada, e então a imperatriz Isabel da Rússia morreu. Seu herdeiro admirava Frederico a ponto de devoção, fez a paz imediatamente e mudou de lado. Os prussianos chamaram aquilo de milagre da Casa de Brandemburgo: ele sobreviveu porque uma mulher em São Petersburgo por acaso morreu.'
      ]
    }
  ],

  '08-30': [
    {
      year: 70,
      title: 'The Ninth of Av, Again',
      title_pt: 'O Nono Dia de Av, Outra Vez',
      era: 'Classical',
      region: 'Jerusalem', region_pt: 'Jerusalém',
      tag: 'Destruction', tag_pt: 'Destruição',
      text: 'The Temple burned. By Jewish reckoning it fell on the ninth of Av — the same day of the same month on which the Babylonians had destroyed the First Temple some six and a half centuries earlier. That date became the fixed fast of Jewish grief, and later catastrophes were gathered onto it, the expulsion from Spain in 1492 among them.',
      text_pt: 'O Templo ardeu. Pela contagem judaica, caiu no nono dia de Av — o mesmo dia do mesmo mês em que os babilônios haviam destruído o Primeiro Templo, uns seis séculos e meio antes. Essa data virou o jejum fixo do luto judaico, e catástrofes posteriores foram reunidas nela, entre elas a expulsão da Espanha em 1492.',
      facts: [
        'The Arch of Titus still stands in Rome, and the relief inside it shows the menorah and the Temple vessels being carried through the streets in triumph. For centuries Jews in Rome would not walk under it. In 1948, when Israel was declared, some walked under it deliberately, in the other direction.',
        'Josephus was in the Roman camp and wrote that Titus had ordered the Temple spared, and that a soldier threw the firebrand against orders. Josephus was a Jewish commander who had surrendered and was living on Roman patronage. Other ancient accounts say Titus ordered the destruction.',
        'Without a Temple there could be no sacrifice and no priesthood as it had existed. What replaced them was study, prayer and law, worked out by rabbis over the following centuries — the shape Judaism has kept for two thousand years. The catastrophe forced the invention of what outlived it.'
      ],
      facts_pt: [
        'O Arco de Tito ainda está de pé em Roma, e o relevo em seu interior mostra a menorá e os utensílios do Templo sendo carregados pelas ruas em triunfo. Por séculos, os judeus de Roma se recusaram a passar sob ele. Em 1948, quando Israel foi declarado, alguns passaram de propósito, no sentido contrário.',
        'Josefo estava no acampamento romano e escreveu que Tito ordenara poupar o Templo, e que um soldado atirou o tição contra as ordens. Josefo era um comandante judeu que se rendera e vivia sob patrocínio romano. Outros relatos antigos dizem que Tito mandou destruí-lo.',
        'Sem Templo não podia haver sacrifício nem sacerdócio como existira. O que os substituiu foi o estudo, a oração e a lei, elaborados pelos rabinos nos séculos seguintes — a forma que o judaísmo manteve por dois mil anos. A catástrofe obrigou a inventar aquilo que a sobreviveu.'
      ]
    }
  ],

  '08-31': [
    {
      year: 2016,
      title: 'Removed From Office, but Not Barred',
      title_pt: 'Destituída do Cargo, mas Não Inelegível',
      era: 'Contemporary',
      region: 'Brasília', region_pt: 'Brasília',
      tag: 'Politics', tag_pt: 'Política',
      text: 'The Senate voted 61 to 20 to remove Dilma Rousseff, the first woman to hold the Brazilian presidency, over budget manoeuvres carried out without congressional authorisation. It then voted separately on whether to strip her of the right to hold office, and that motion failed. Her vice-president was sworn in the same day.',
      text_pt: 'O Senado votou 61 a 20 pela destituição de Dilma Rousseff, primeira mulher a ocupar a presidência do Brasil, por manobras orçamentárias feitas sem autorização do Congresso. Em seguida votou separadamente se lhe retirava o direito de exercer cargo público, e essa moção não passou. Seu vice tomou posse no mesmo dia.',
      facts: [
        'The split verdict had no clear precedent: 61 votes to remove her, but only 42 of the 54 needed to disqualify her from future office. She left the presidency with her political rights intact.',
        'The charge concerned the pedaladas fiscais — decrees opening supplementary credit without authorisation, and delayed transfers to state banks, which had the effect of understating the deficit. Whether that conduct met the constitutional standard for a crime of responsibility is still argued in Brazil, as is whether the process was a legitimate impeachment or a parliamentary manoeuvre.',
        'Eduardo Cunha, the speaker of the lower house who had admitted the petition against her, lost his own mandate twelve days later and was afterwards convicted and imprisoned for corruption.'
      ],
      facts_pt: [
        'O placar dividido não tinha precedente claro: 61 votos pela destituição, mas apenas 42 dos 54 necessários para torná-la inelegível. Ela deixou a presidência com os direitos políticos preservados.',
        'A acusação tratava das pedaladas fiscais — decretos de crédito suplementar sem autorização e atrasos em repasses a bancos públicos, com o efeito de subestimar o déficit. Se essa conduta atendia ao padrão constitucional de crime de responsabilidade segue em disputa no Brasil, assim como se o processo foi um impeachment legítimo ou uma manobra parlamentar.',
        'Eduardo Cunha, presidente da Câmara que admitira a denúncia contra ela, perdeu o próprio mandato doze dias depois e foi em seguida condenado e preso por corrupção.'
      ]
    }
  ],

  '09-01': [
    {
      year: 1449,
      title: 'The Emperor Was Captured and China Shrugged',
      title_pt: 'O Imperador Foi Capturado e a China Deu de Ombros',
      era: 'Medieval',
      region: 'Tumu, northern China', region_pt: 'Tumu, norte da China',
      tag: 'Capture', tag_pt: 'Captura',
      text: 'Talked into leading a campaign in person by a favourite eunuch, the Zhengtong Emperor marched an enormous army north, had it mismanaged into a waterless position, and lost it. The Mongols took him alive. It should have been the greatest bargaining chip of the century, and it turned out to be worth nothing at all.',
      text_pt: 'Convencido por um eunuco favorito a comandar pessoalmente uma campanha, o imperador Zhengtong marchou um exército enorme para o norte, viu-o ser conduzido a uma posição sem água, e o perdeu. Os mongóis o capturaram vivo. Deveria ter sido a maior moeda de troca do século, e não valeu absolutamente nada.',
      facts: [
        'The court in Beijing refused to pay. It enthroned his brother, declared the prisoner a retired emperor, and went on governing. With a hostage nobody wanted back, Esen eventually released him for free the following year.',
        'His brother then kept him under house arrest for seven years. In 1457 he seized the throne back and reigned a second time under a new name — and executed Yu Qian, the minister who had organised the defence of Beijing and saved the dynasty while he was a prisoner.',
        'After Tumu the Ming gave up campaigning on the steppe and spent their money on walls instead. The brick and stone Great Wall that people photograph today is largely a product of the century that followed this defeat.'
      ],
      facts_pt: [
        'A corte em Pequim recusou-se a pagar. Entronizou o irmão dele, declarou o prisioneiro imperador aposentado e seguiu governando. Com um refém que ninguém queria de volta, Esen acabou soltando-o de graça no ano seguinte.',
        'O irmão então o manteve em prisão domiciliar por sete anos. Em 1457 ele retomou o trono e reinou uma segunda vez sob outro nome — e mandou executar Yu Qian, o ministro que organizara a defesa de Pequim e salvara a dinastia enquanto ele estava preso.',
        'Depois de Tumu, os Ming desistiram de campanhas na estepe e gastaram seu dinheiro em muralhas. A Grande Muralha de tijolo e pedra que as pessoas fotografam hoje é em boa parte produto do século que se seguiu a essa derrota.'
      ]
    }
  ],

  '09-02': [
    {
      year: -31,
      title: 'The Battle That Was Barely a Battle',
      title_pt: 'A Batalha que Mal Foi uma Batalha',
      era: 'Classical',
      region: 'Actium, Greece', region_pt: 'Áccio, Grécia',
      tag: 'Naval', tag_pt: 'Naval',
      text: 'Antony had the bigger fleet and could not row it. Disease and desertion had emptied his benches, and Agrippa had him blockaded. What is remembered as the battle that decided the Roman world was mostly an attempt to break out of a trap: Cleopatra’s squadron got through the middle and ran for Egypt, Antony followed her, and most of what remained surrendered.',
      text_pt: 'Antônio tinha a frota maior e não conseguia remá-la. Doença e deserção haviam esvaziado seus bancos, e Agripa o mantinha bloqueado. O que se lembra como a batalha que decidiu o mundo romano foi sobretudo uma tentativa de escapar de uma armadilha: o esquadrão de Cleópatra rompeu pelo meio e correu para o Egito, Antônio a seguiu, e quase tudo o que restou se rendeu.',
      facts: [
        'Octavian had declared war on Cleopatra, not on Antony. Framing a civil war as a foreign one let him fight a Roman rival without admitting he was doing it, and the framing held: two thousand years later this is still remembered as Rome against the East.',
        'Antony’s army did not fight at all. Nineteen legions were waiting on shore, and a week after the fleet broke they surrendered without a battle.',
        'Octavian did not win it. Agrippa, his friend since boyhood, commanded the fleet and won most of his wars for him; Octavian had a habit of falling ill at the decisive moment of his own campaigns.'
      ],
      facts_pt: [
        'Otaviano declarara guerra a Cleópatra, não a Antônio. Enquadrar uma guerra civil como guerra estrangeira permitiu-lhe combater um rival romano sem admitir que o fazia, e o enquadramento pegou: dois mil anos depois, isso ainda é lembrado como Roma contra o Oriente.',
        'O exército de Antônio não chegou a lutar. Dezenove legiões esperavam em terra e, uma semana depois de a frota se romper, renderam-se sem combate.',
        'Não foi Otaviano quem venceu. Agripa, seu amigo de infância, comandava a frota e ganhou a maior parte de suas guerras por ele; Otaviano tinha o hábito de adoecer no momento decisivo das próprias campanhas.'
      ]
    },
    {
      year: 1192,
      title: 'The King Who Would Not Look at Jerusalem',
      title_pt: 'O Rei que Não Quis Olhar para Jerusalém',
      era: 'Medieval',
      region: 'Jaffa', region_pt: 'Jafa',
      tag: 'Crusades', tag_pt: 'Cruzadas',
      text: 'The treaty left Jerusalem in Muslim hands and opened it to Christian pilgrims, and gave the crusaders the coast. Richard sailed home a month later having never entered the city he had come for. He and Saladin had fought each other for three years and never once met.',
      text_pt: 'O tratado deixou Jerusalém em mãos muçulmanas e a abriu aos peregrinos cristãos, e deu a costa aos cruzados. Ricardo partiu um mês depois sem jamais ter entrado na cidade por que viera. Ele e Saladino haviam lutado três anos um contra o outro e nunca se encontraram.',
      facts: [
        'He came within sight of Jerusalem twice and turned back both times, knowing he could take it and could not hold it. The story told afterwards is that he raised his shield over his eyes rather than look at a city he would not enter.',
        'The courtesies between them were real and so was the savagery. Saladin sent fruit and snow from Mount Hermon when Richard was ill, and two horses when Richard’s was killed under him. Richard had some two thousand seven hundred prisoners executed at Acre the year before.',
        'Richard had proposed ending the war by marrying his sister to Saladin’s brother and making Jerusalem their joint capital; she refused outright. Saladin died six months after the treaty. Richard was seized on his way home and ransomed for something close to two years of England’s revenue.'
      ],
      facts_pt: [
        'Chegou a avistar Jerusalém duas vezes e voltou atrás nas duas, sabendo que podia tomá-la e não podia mantê-la. Conta-se que ergueu o escudo sobre os olhos em vez de olhar para uma cidade em que não entraria.',
        'As cortesias entre os dois eram reais, e a selvageria também. Saladino mandou frutas e neve do monte Hermon quando Ricardo adoeceu, e dois cavalos quando o dele foi morto. Ricardo mandara executar cerca de dois mil e setecentos prisioneiros em Acre no ano anterior.',
        'Ricardo propusera encerrar a guerra casando sua irmã com o irmão de Saladino e fazendo de Jerusalém a capital conjunta dos dois; ela recusou de imediato. Saladino morreu seis meses depois do tratado. Ricardo foi capturado no caminho de volta e resgatado por algo próximo de dois anos da receita da Inglaterra.'
      ]
    }
  ],

  '09-03': [
    {
      year: 1260,
      title: 'The Slaves Who Stopped the Mongols',
      title_pt: 'Os Escravos que Detiveram os Mongóis',
      era: 'Medieval',
      region: 'Jezreel Valley, Palestine', region_pt: 'Vale de Jezreel, Palestina',
      tag: 'Battle', tag_pt: 'Batalha',
      text: 'The Mongols had taken Baghdad two years before and had not lost a serious battle in living memory. At a spring in the Jezreel valley the army of Egypt met them and broke them. It was the first defeat the Mongols could not shrug off, and the western edge of their empire stopped there for good.',
      text_pt: 'Os mongóis haviam tomado Bagdá dois anos antes e não perdiam uma batalha séria em memória viva. Junto a uma fonte no vale de Jezreel, o exército do Egito os encontrou e os quebrou. Foi a primeira derrota que os mongóis não conseguiram ignorar, e a borda ocidental do império deles parou ali para sempre.',
      facts: [
        'The army they beat was a remnant. The Great Khan had died in China the year before, and Hulagu had pulled the bulk of his forces east to be near the succession, leaving a fraction of them behind. The Mongol advance was halted partly by a death four thousand miles away.',
        'The victors had been sold as children. The Mamluks were Turkic and Circassian boys bought, converted and trained as heavy cavalry; ten years earlier they had overthrown the dynasty that owned them and taken Egypt for themselves. A slave army stopped the largest empire on earth.',
        'The crusaders at Acre let them pass. Given a choice between the Mongols, whose commander here was a Christian, and the Mamluks, the Franks granted the Muslim army passage and supplies. On the ride home from the victory, Baibars murdered his own sultan and took the throne.'
      ],
      facts_pt: [
        'O exército que derrotaram era um resto. O Grande Cã morrera na China no ano anterior, e Hulagu levara o grosso de suas forças para leste a fim de estar perto da sucessão, deixando para trás uma fração delas. O avanço mongol foi detido em parte por uma morte a seis mil quilômetros dali.',
        'Os vencedores haviam sido vendidos quando crianças. Os mamelucos eram meninos turcos e circassianos comprados, convertidos e treinados como cavalaria pesada; dez anos antes haviam derrubado a dinastia que os possuía e tomado o Egito para si. Um exército de escravos deteve o maior império da Terra.',
        'Os cruzados de Acre os deixaram passar. Diante da escolha entre os mongóis, cujo comandante ali era cristão, e os mamelucos, os francos concederam passagem e suprimentos ao exército muçulmano. Na volta da vitória, Baibars assassinou o próprio sultão e tomou o trono.'
      ]
    }
  ],

  '09-04': [
    {
      year: 476,
      title: 'Nobody Noticed the Empire Had Ended',
      title_pt: 'Ninguém Percebeu que o Império Havia Acabado',
      era: 'Classical',
      region: 'Ravenna', region_pt: 'Ravena',
      tag: 'Deposition', tag_pt: 'Deposição',
      text: 'Odoacer removed a teenage emperor and did not replace him. He sent the imperial regalia to Constantinople and asked to govern Italy as a patrician under the emperor in the East — presenting the whole thing not as an ending but as a tidying up. One empire, one emperor, and he would run Italy on its behalf.',
      text_pt: 'Odoacro removeu um imperador adolescente e não o substituiu. Mandou as insígnias imperiais a Constantinopla e pediu para governar a Itália como patrício sob o imperador do Oriente — apresentando aquilo não como um fim, mas como uma arrumação. Um império, um imperador, e ele tocaria a Itália em nome dele.',
      facts: [
        'Romulus was not even the legitimate emperor. He was a usurper’s son, never recognised in Constantinople, and the emperor the East did recognise was alive in exile in Dalmatia for another four years. What ended in 476 was the reign of a boy with no proper claim.',
        'He was not killed. Odoacer gave him an allowance and a villa in Campania, and he vanishes from the record — nobody knows when he died. The last emperor in the West was named for the man who founded the city and the man who founded the empire, and he ended as a private citizen with a pension.',
        'The date became famous much later. Contemporaries barely remarked on it; it took historians centuries, and Gibbon above all, to decide that this was the year the Roman Empire fell.'
      ],
      facts_pt: [
        'Rômulo nem sequer era o imperador legítimo. Era filho de um usurpador, nunca reconhecido em Constantinopla, e o imperador que o Oriente de fato reconhecia esteve vivo, exilado na Dalmácia, por mais quatro anos. O que acabou em 476 foi o reinado de um menino sem título próprio.',
        'Ele não foi morto. Odoacro lhe deu uma pensão e uma villa na Campânia, e ele desaparece dos registros — ninguém sabe quando morreu. O último imperador do Ocidente tinha o nome do homem que fundou a cidade e do homem que fundou o império, e terminou como cidadão comum com uma renda.',
        'A data ficou famosa muito depois. Os contemporâneos quase não a comentaram; foram precisos séculos de historiadores, e Gibbon acima de todos, para decidir que aquele fora o ano em que o Império Romano caiu.'
      ]
    }
  ],

  '09-05': [
    {
      year: 1698,
      title: 'A Tax on the Image of God',
      title_pt: 'Um Imposto sobre a Imagem de Deus',
      era: 'Early Modern',
      region: 'Moscow', region_pt: 'Moscou',
      tag: 'Taxation', tag_pt: 'Tributação',
      text: 'Peter had been away for a year and a half, travelling Europe under a false name and working in Dutch and English shipyards. He came home, called his nobles in, and started cutting their beards off himself. What could not be shaved by hand was then taxed: a hundred roubles a year for a nobleman who wanted to keep his face.',
      text_pt: 'Pedro passara um ano e meio fora, viajando pela Europa sob nome falso e trabalhando em estaleiros holandeses e ingleses. Voltou, convocou seus nobres e começou a cortar as barbas deles com as próprias mãos. O que não desse para raspar à mão passou a ser tributado: cem rublos por ano para o nobre que quisesse manter o rosto.',
      facts: [
        'This was not a tax on fashion. In Russian Orthodox teaching a man’s beard belonged to the image of God he was made in, and shaving it was a sin; the Old Believers held a shaven face to be a mark of the Antichrist. Peter was putting a price on a religious obligation.',
        'Those who paid were issued a bronze token to carry, stamped with a beard and the words "the tax has been taken", so they could prove it to anyone who stopped them in the street.',
        'He had spent the Grand Embassy as Peter Mikhailov, labouring as a shipwright at Zaandam and Deptford — a tsar of two metres and three, unmistakable to everyone, insisting on being treated as a carpenter.'
      ],
      facts_pt: [
        'Não era um imposto sobre moda. Na doutrina ortodoxa russa, a barba de um homem pertencia à imagem de Deus à qual ele fora feito, e raspá-la era pecado; os Velhos Crentes tinham o rosto raspado por marca do Anticristo. Pedro estava pondo preço numa obrigação religiosa.',
        'Quem pagava recebia uma ficha de bronze para carregar, cunhada com uma barba e os dizeres "o imposto foi cobrado", para provar a quem o parasse na rua.',
        'Ele passara a Grande Embaixada como Piotr Mikhailov, trabalhando como carpinteiro naval em Zaandam e Deptford — um tsar de dois metros e três, inconfundível para qualquer um, insistindo em ser tratado como marceneiro.'
      ]
    }
  ],

  '09-06': [
    {
      year: 2026,
      title: 'Daniel and Carina, Under the Chuppah',
      title_pt: 'Daniel e Carina, Sob a Chupá',
      era: 'Contemporary',
      tag: 'Wedding', tag_pt: 'Casamento',
      text: 'Under a canopy open on all four sides, Daniel and Carina were married before God in a Jewish ceremony. Everything in the rite is old — the contract read aloud, the seven blessings, the glass broken underfoot — and all of it exists to say one thing: that two people are building a house, and that the house begins today.',
      text_pt: 'Sob um dossel aberto dos quatro lados, Daniel e Carina se casaram perante Deus numa cerimônia judaica. Tudo no rito é antigo — o contrato lido em voz alta, as sete bênçãos, o copo partido sob o pé — e tudo existe para dizer uma coisa: que duas pessoas estão erguendo uma casa, e que a casa começa hoje.',
      facts: [
        'The chuppah has a roof and no walls, in memory of the tent of Abraham, which was said to stand open on every side so that no traveller would have to look for the door. A marriage begins as a shelter anyone can walk into.',
        'At the highest point of the celebration the glass is broken. The custom recalls the destruction of the Temple in Jerusalem: joy is never quite whole while something in the world remains broken, and the two are held in the same moment rather than kept apart.',
        'The seven blessings end by asking that the voice of joy and the voice of gladness, the voice of the groom and the voice of the bride, be heard again in the streets of Jerusalem. Close to two thousand years of couples have been sent off with those same words.'
      ],
      facts_pt: [
        'A chupá tem teto e não tem paredes, em memória da tenda de Abraão, que se dizia aberta dos quatro lados para que nenhum viajante precisasse procurar a porta. Um casamento começa como um abrigo em que qualquer um pode entrar.',
        'No ponto mais alto da festa, o copo é partido. O costume lembra a destruição do Templo em Jerusalém: a alegria nunca é inteira enquanto algo no mundo continua quebrado, e as duas coisas são seguradas no mesmo instante, em vez de mantidas separadas.',
        'As sete bênçãos terminam pedindo que a voz da alegria e a voz do júbilo, a voz do noivo e a voz da noiva, sejam ouvidas outra vez nas ruas de Jerusalém. Há quase dois mil anos os casais são despedidos com essas mesmas palavras.'
      ]
    }
  ],

  '09-07': [
    {
      year: 1822,
      title: 'Independence or Death !!!',
      title_pt: 'Independência ou Morte !!!',
      era: 'Modern',
      region: 'São Paulo', region_pt: 'São Paulo',
      tag: 'Independence', tag_pt: 'Independência',
      text: 'On the bank of a stream outside São Paulo, the heir to the Portuguese throne declared the country he was governing independent of his own father’s kingdom. Brazil became the only large state in the Americas to leave Europe and keep a monarchy — and the only one to come out of it in one piece.',
      text_pt: 'À margem de um riacho nos arredores de São Paulo, o herdeiro do trono português declarou independente o país que governava, separando-o do reino do próprio pai. O Brasil se tornou o único grande Estado das Américas a deixar a Europa mantendo uma monarquia — e o único a sair disso inteiro.',
      facts: [
        'The painting is not the event. Pedro Américo painted it in 1888, sixty-six years afterwards; the escort was riding mules, not chargers, and Pedro had stopped at the stream because he was badly ill with a stomach complaint. The uniforms and the poses were invented for the empire’s final years.',
        'Independence was not a single morning. Portuguese garrisons held Bahia, Maranhão and Pará, and the fighting ran into 1824. Salvador was only taken on 2 July 1823, which Bahia still keeps as its own independence day.',
        'Portugal recognised the new country in 1825 in exchange for two million pounds sterling. Brazil borrowed the money from British banks to pay it, and began its national life in debt for the purchase of its own independence.'
      ],
      facts_pt: [
        'O quadro não é o acontecimento. Pedro Américo o pintou em 1888, sessenta e seis anos depois; a comitiva ia em mulas, não em corcéis, e Pedro parara no riacho porque estava passando muito mal do estômago. Os uniformes e as poses foram inventados para os anos finais do império.',
        'A independência não foi uma só manhã. Guarnições portuguesas seguravam Bahia, Maranhão e Pará, e o combate se estendeu até 1824. Salvador só foi tomada em 2 de julho de 1823, data que a Bahia mantém até hoje como sua própria independência.',
        'Portugal reconheceu o novo país em 1825 em troca de dois milhões de libras esterlinas. O Brasil tomou o dinheiro emprestado de bancos britânicos para pagar, e começou a vida nacional endividado pela compra da própria independência.'
      ]
    }
  ],

  '09-08': [
    {
      year: 1264,
      title: 'The Charter That Went the Other Way',
      title_pt: 'A Carta que Foi na Contramão',
      era: 'Jewish History',
      region: 'Kalisz, Poland', region_pt: 'Kalisz, Polônia',
      tag: 'Law', tag_pt: 'Direito',
      text: 'Bolesław the Pious put his name to thirty-six articles setting out what Jews in Greater Poland could expect: their own courts for their own disputes, the duke rather than the town as their protector, penalties for damaging a synagogue or a cemetery, and a duty on Christian neighbours to come out when a Jewish house was attacked at night. Western Europe in those same decades was drafting badges and expulsions.',
      text_pt: 'Bolesław, o Piedoso, assinou trinta e seis artigos estabelecendo o que os judeus da Grande Polônia podiam esperar: tribunais próprios para suas próprias disputas, o duque e não a cidade como protetor, penas por danificar uma sinagoga ou um cemitério, e o dever de os vizinhos cristãos acudirem quando uma casa judaica fosse atacada à noite. A Europa Ocidental, nessas mesmas décadas, redigia distintivos e expulsões.',
      facts: [
        'One clause took direct aim at the blood libel. A Christian accusing a Jew of ritual murder had to produce three Christian witnesses and three Jewish ones, and if he could not, he suffered the punishment the accused would have suffered. The accusation was spreading across Europe at exactly that moment, and Poland made it expensive to make.',
        'It was not only conscience. The Mongol invasions had emptied the country twenty years earlier, and the dukes wanted settlers, merchants and credit. Protection was written down because it was worth something to the man writing it.',
        'Casimir the Great confirmed and widened the charter in the next century, and it held in some form until Poland itself was partitioned. By the eighteenth century most of the Jews alive were living in the Polish-Lithuanian Commonwealth. Hebrew reads the country’s name, Polin, as po lin — here, dwell.'
      ],
      facts_pt: [
        'Um dos artigos mirava diretamente na difamação de sangue. O cristão que acusasse um judeu de assassinato ritual tinha de apresentar três testemunhas cristãs e três judias, e, se não conseguisse, sofria a pena que o acusado teria sofrido. A acusação se espalhava pela Europa exatamente naquele momento, e a Polônia tornou caro fazê-la.',
        'Não era só consciência. As invasões mongóis haviam esvaziado o país vinte anos antes, e os duques queriam colonos, mercadores e crédito. A proteção foi posta no papel porque valia alguma coisa para quem a escrevia.',
        'Casimiro, o Grande, confirmou e ampliou a carta no século seguinte, e ela vigorou de alguma forma até a própria Polônia ser repartida. No século XVIII, a maior parte dos judeus vivos morava na Comunidade Polaco-Lituana. O hebraico lê o nome do país, Polin, como po lin — aqui, habita.'
      ]
    }
  ],

  '09-09': [
    {
      year: 337,
      title: 'Three Brothers Divide an Empty Family',
      title_pt: 'Três Irmãos Dividem uma Família Vazia',
      era: 'Classical',
      region: 'Roman Empire', region_pt: 'Império Romano',
      tag: 'Succession', tag_pt: 'Sucessão',
      text: 'Constantine had been dead for three and a half months, and in that gap the dynasty had been cut down to the three sons and almost nobody else. On this day they were proclaimed Augusti together and split the empire between them. It lasted three years before they began killing each other.',
      text_pt: 'Constantino estava morto havia três meses e meio, e nesse intervalo a dinastia fora podada até sobrarem os três filhos e quase mais ninguém. Neste dia eles foram proclamados Augustos em conjunto e dividiram o império entre si. Durou três anos, até começarem a se matar.',
      facts: [
        'Two of Constantine’s half-brothers and seven of his nephews were killed in those months, reportedly by the army, on the story that the dead emperor had been poisoned by his own relatives. Two boys were spared as too young to matter.',
        'One of the two was five years old and named Julian. Twenty-four years later he was emperor, and he spent his short reign trying to undo his uncle’s religion — the last pagan to rule Rome.',
        'The division did not hold. Constantine II invaded his brother’s territory in 340 and was killed in an ambush; Constans was murdered by a usurper in 350; Constantius II ruled alone and died in 361 while marching to fight Julian.'
      ],
      facts_pt: [
        'Dois meios-irmãos de Constantino e sete de seus sobrinhos foram mortos nesses meses, ao que se conta pelo exército, sob a versão de que o imperador morto fora envenenado pelos próprios parentes. Dois meninos foram poupados por serem novos demais para importar.',
        'Um dos dois tinha cinco anos e se chamava Juliano. Vinte e quatro anos depois era imperador, e passou seu curto reinado tentando desfazer a religião do tio — o último pagão a governar Roma.',
        'A divisão não se sustentou. Constantino II invadiu o território do irmão em 340 e morreu numa emboscada; Constante foi assassinado por um usurpador em 350; Constâncio II governou sozinho e morreu em 361, marchando para enfrentar Juliano.'
      ]
    }
  ],

  '09-10': [
    {
      year: 1509,
      title: 'The Lesser Judgment Day',
      title_pt: 'O Pequeno Juízo Final',
      era: 'Renaissance',
      region: 'Constantinople', region_pt: 'Constantinopla',
      tag: 'Earthquake', tag_pt: 'Terremoto',
      text: 'The earthquake that struck the Sea of Marmara brought down houses, minarets and stretches of the sea wall, and the water came over what was left. Istanbul called it Küçük Kıyamet — the Lesser Judgment Day — and the name stuck, because for a month and a half nobody could be sure it was over.',
      text_pt: 'O terremoto que atingiu o mar de Mármara derrubou casas, minaretes e trechos da muralha marítima, e a água passou por cima do que sobrou. Istambul o chamou de Küçük Kıyamet — o Pequeno Juízo Final — e o nome pegou, porque por um mês e meio ninguém tinha certeza de que havia acabado.',
      facts: [
        'The aftershocks ran for forty-five days. The city moved outdoors into tents and open ground, the sultan among them, and people did not go back inside for something close to two months.',
        'Bayezid II rebuilt by conscription. Every household in the region had to send a labourer or pay for one, and something like eighty thousand men were put to work on the city.',
        'Hagia Sophia stood. It lost a minaret and kept its dome, as it had through earthquakes for nearly a thousand years by then, and it is standing still.'
      ],
      facts_pt: [
        'Os tremores secundários duraram quarenta e cinco dias. A cidade se mudou para tendas e terrenos abertos, o sultão entre eles, e as pessoas só voltaram para dentro perto de dois meses depois.',
        'Bayezid II reconstruiu por convocação. Cada domicílio da região tinha de enviar um trabalhador ou pagar por um, e cerca de oitenta mil homens foram postos a trabalhar na cidade.',
        'Santa Sofia ficou de pé. Perdeu um minarete e manteve a cúpula, como já fizera em terremotos por quase mil anos até ali, e continua de pé.'
      ]
    }
  ],

  '09-11': [
    {
      year: 2001,
      title: 'Four Planes',
      title_pt: 'Quatro Aviões',
      era: 'Contemporary',
      region: 'United States', region_pt: 'Estados Unidos',
      tag: 'Attack', tag_pt: 'Atentado',
      text: 'Nineteen men hijacked four airliners. Two were flown into the towers of the World Trade Center, one into the Pentagon, and one came down in a field in Pennsylvania. Two thousand nine hundred and seventy-seven people were killed, citizens of more than ninety countries. It is the deadliest terrorist attack ever carried out.',
      text_pt: 'Dezenove homens sequestraram quatro aviões de carreira. Dois foram lançados contra as torres do World Trade Center, um contra o Pentágono, e um caiu num campo na Pensilvânia. Morreram duas mil novecentas e setenta e sete pessoas, cidadãs de mais de noventa países. É o atentado terrorista mais letal já cometido.',
      facts: [
        'The fourth aircraft never reached its target. The passengers learned from telephone calls what had already happened in New York, decided together what to do, and went for the cockpit; the plane went into the ground about twenty minutes’ flying time short of Washington.',
        'Half a million people were taken off Manhattan by boat that day. The Coast Guard put out a call for any vessel available and ferries, tugs, and private craft answered; the lift ran some nine hours and moved more people than the evacuation of Dunkirk.',
        'The dying did not stop that day. Thousands of firefighters, police officers, cleanup workers and residents have since died of illnesses caused by the dust, and people are still being certified for them a quarter of a century on.'
      ],
      facts_pt: [
        'O quarto avião nunca chegou ao alvo. Os passageiros souberam por telefone o que já havia acontecido em Nova York, decidiram juntos o que fazer e partiram para a cabine; o avião caiu a cerca de vinte minutos de voo de Washington.',
        'Meio milhão de pessoas saíram de Manhattan de barco naquele dia. A Guarda Costeira pediu qualquer embarcação disponível e balsas, rebocadores e barcos particulares atenderam; a operação durou umas nove horas e transportou mais gente que a evacuação de Dunquerque.',
        'As mortes não pararam naquele dia. Milhares de bombeiros, policiais, trabalhadores da remoção de escombros e moradores morreram depois de doenças causadas pela poeira, e há pessoas sendo diagnosticadas até hoje, um quarto de século depois.'
      ]
    }
  ],

  '09-12': [
    {
      year: -490,
      title: 'The Run That Did Not Happen',
      title_pt: 'A Corrida que Não Aconteceu',
      era: 'Classical',
      region: 'Marathon, Attica', region_pt: 'Maratona, Ática',
      tag: 'Battle', tag_pt: 'Batalha',
      text: 'The Athenians and a small contingent from Plataea met the first Persian invasion on the plain at Marathon and broke it. Herodotus counts one hundred and ninety-two Athenian dead against six thousand four hundred Persians. The race named after the battle commemorates something that, as it is usually told, did not take place.',
      text_pt: 'Os atenienses e um pequeno contingente de Plateia enfrentaram a primeira invasão persa na planície de Maratona e a quebraram. Heródoto conta cento e noventa e dois mortos atenienses contra seis mil e quatrocentos persas. A corrida que leva o nome da batalha comemora algo que, do modo como costuma ser contado, não aconteceu.',
      facts: [
        'Herodotus does have a runner, but he runs the other way and before the fighting: Pheidippides sent to Sparta, some two hundred and fifty kilometres, to ask for help — and the Spartans replied that they could not march until the moon was full. The man dying as he announces the victory turns up centuries later, in sources that name different men.',
        'What the army actually did was harder than the legend. Having won, the Athenians marched the forty kilometres back to Athens the same day, in armour, to reach the shore before the Persian fleet could round the cape and land.',
        'The hundred and ninety-two were buried where they fell, under a mound that is still on the plain. Athens normally brought its war dead home; this was the exception. Aeschylus fought in the battle, and the epitaph he is said to have chosen mentions Marathon and not one of his plays.'
      ],
      facts_pt: [
        'Heródoto tem sim um corredor, mas ele corre no sentido contrário e antes do combate: Fidípides enviado a Esparta, uns duzentos e cinquenta quilômetros, para pedir ajuda — e os espartanos responderam que não podiam marchar antes da lua cheia. O homem que morre ao anunciar a vitória aparece séculos depois, em fontes que dão nomes diferentes.',
        'O que o exército de fato fez foi mais duro que a lenda. Tendo vencido, os atenienses marcharam os quarenta quilômetros de volta a Atenas no mesmo dia, de armadura, para chegar à praia antes que a frota persa contornasse o cabo e desembarcasse.',
        'Os cento e noventa e dois foram enterrados onde caíram, sob um montículo que ainda está na planície. Atenas normalmente trazia seus mortos de guerra para casa; este foi a exceção. Ésquilo lutou na batalha, e o epitáfio que se diz ter escolhido menciona Maratona e nenhuma de suas peças.'
      ]
    }
  ],

  '09-13': [
    {
      year: -509,
      title: 'The Republic Dedicates the Last King’s Temple',
      title_pt: 'A República Dedica o Templo do Último Rei',
      era: 'Classical',
      region: 'Rome', region_pt: 'Roma',
      tag: 'Temple', tag_pt: 'Templo',
      text: 'The greatest temple in Rome was vowed by one king and built by another, and the men who dedicated it had just thrown the second one out. In the first year of the Republic, on the ides of September, the consuls consecrated the Capitoline temple of Jupiter Best and Greatest — the building the monarchy left behind.',
      text_pt: 'O maior templo de Roma foi prometido por um rei e construído por outro, e os homens que o dedicaram acabavam de expulsar o segundo. No primeiro ano da República, nos idos de setembro, os cônsules consagraram o templo capitolino de Júpiter Ótimo Máximo — o edifício que a monarquia deixou para trás.',
      facts: [
        'Every year on that same day a nail was driven into the temple wall to mark the year that had passed. It was a calendar kept in iron, from a time when very few people could write one down.',
        'Livy tells that as the consul held the doorpost to speak the words of dedication, a rival had word brought to him that his son had died, so that grief would make him let go and forfeit the honour. He answered that they could bury the boy, and finished the sentence.',
        'Triumphs ended here. For the next five centuries every general who was granted one climbed the Capitoline to this building at the end of the procession, and almost nothing of it survives now but foundations under a later palace.'
      ],
      facts_pt: [
        'Todo ano, nesse mesmo dia, um prego era cravado na parede do templo para marcar o ano que passara. Era um calendário guardado em ferro, de uma época em que pouquíssimos sabiam escrever um.',
        'Lívio conta que, enquanto o cônsul segurava o batente para pronunciar as palavras da dedicação, um rival mandou avisá-lo de que seu filho havia morrido, para que a dor o fizesse soltar e perder a honra. Ele respondeu que podiam enterrar o menino, e terminou a frase.',
        'Os triunfos terminavam aqui. Pelos cinco séculos seguintes, todo general que recebia um subia o Capitólio até este edifício ao fim do cortejo, e hoje quase nada resta dele além de fundações sob um palácio posterior.'
      ]
    }
  ],

  '09-14': [
    {
      year: 1752,
      title: 'Eleven Days That Never Existed',
      title_pt: 'Onze Dias que Nunca Existiram',
      era: 'Early Modern',
      region: 'Britain', region_pt: 'Grã-Bretanha',
      tag: 'Calendar', tag_pt: 'Calendário',
      text: 'Britain went to bed on Wednesday 2 September and got up on Thursday 14 September. Catholic Europe had made the correction a hundred and seventy years earlier; Protestant Britain had refused it that long because the arithmetic came from a pope. When it finally gave in, it had eleven days of drift to delete.',
      text_pt: 'A Grã-Bretanha foi dormir na quarta-feira, 2 de setembro, e acordou na quinta-feira, 14 de setembro. A Europa católica fizera a correção cento e setenta anos antes; a Grã-Bretanha protestante a recusara todo esse tempo porque a aritmética vinha de um papa. Quando enfim cedeu, tinha onze dias de atraso para apagar.',
      facts: [
        'The riots probably never happened. "Give us our eleven days" comes from a Hogarth painting of an election three years later, where it appears on a stolen banner in a partisan brawl; there is very little evidence that crowds ever demanded the days back.',
        'The year moved as well. Until then the English legal year had begun on 25 March, so the same Act cut 1751 down to two hundred and eighty-two days, running from March to December.',
        'The change is still visible on paper. The British tax year begins on 6 April, which is 25 March shifted by the eleven days skipped here and one more added in 1800. Three centuries later the Treasury still keeps its books on a Julian date.'
      ],
      facts_pt: [
        'Os tumultos provavelmente nunca existiram. "Devolvam nossos onze dias" vem de um quadro de Hogarth sobre uma eleição três anos depois, onde a frase aparece num estandarte roubado em meio a uma pancadaria partidária; há pouquíssima evidência de que multidões tenham exigido os dias de volta.',
        'O ano também mudou. Até ali o ano legal inglês começava em 25 de março, de modo que a mesma lei encurtou 1751 para duzentos e oitenta e dois dias, de março a dezembro.',
        'A mudança ainda é visível no papel. O ano fiscal britânico começa em 6 de abril, que é 25 de março deslocado pelos onze dias saltados aqui mais um acrescentado em 1800. Três séculos depois, o Tesouro britânico ainda fecha suas contas numa data juliana.'
      ]
    }
  ],

  '09-15': [
    {
      year: 1440,
      title: 'The Marshal Who Fought Beside Joan of Arc',
      title_pt: 'O Marechal que Lutou ao Lado de Joana d’Arc',
      era: 'Medieval',
      region: 'Nantes, Brittany', region_pt: 'Nantes, Bretanha',
      tag: 'Trial', tag_pt: 'Julgamento',
      text: 'Gilles de Rais had relieved Orléans with Joan of Arc, carried the holy ampulla at the king’s coronation, and been made a Marshal of France at twenty-five. Eleven years later the Bishop of Nantes had him arrested, and the case that followed turned into the earliest well-documented account of a serial murderer.',
      text_pt: 'Gilles de Rais libertara Orléans ao lado de Joana d’Arc, carregara a santa ampola na coroação do rei e fora feito marechal da França aos vinte e cinco anos. Onze anos depois, o bispo de Nantes mandou prendê-lo, e o processo que se seguiu tornou-se o primeiro relato bem documentado de um assassino em série.',
      facts: [
        'The arrest was not for the killings. It began as a property quarrel — he had seized a cleric out of a church during a fight over a castle he had sold and wanted back, which handed jurisdiction to the bishop. The investigation widened from there.',
        'He had spent a colossal inheritance on spectacle, including a staged play about the siege of Orléans with hundreds of costumed performers and free food and drink for anyone who came. His own family obtained a royal decree forbidding him to sell any more land.',
        'He confessed under threat of excommunication and the rack, and was hanged and burned five weeks later. Both the duke who tried him and the bishop who accused him stood to gain from his estates, which is why some historians have argued the case was built to take them — though the testimony from the families of missing children was extensive and independent.'
      ],
      facts_pt: [
        'A prisão não foi pelos assassinatos. Começou como uma disputa de propriedade — ele arrancara um clérigo de dentro de uma igreja durante uma briga por um castelo que vendera e queria de volta, o que entregou a jurisdição ao bispo. A investigação se ampliou a partir daí.',
        'Ele torrara uma herança colossal em espetáculo, incluindo uma peça encenada sobre o cerco de Orléans com centenas de figurantes e comida e bebida de graça para quem aparecesse. A própria família obteve um decreto real proibindo-o de vender mais terras.',
        'Confessou sob ameaça de excomunhão e de tortura, e foi enforcado e queimado cinco semanas depois. Tanto o duque que o julgou quanto o bispo que o acusou tinham a ganhar com seus bens, razão pela qual alguns historiadores sustentam que o caso foi montado para tomá-los — embora os depoimentos das famílias das crianças desaparecidas fossem numerosos e independentes entre si.'
      ]
    }
  ],

  '09-16': [
    {
      year: 1620,
      title: 'They Were Aiming for Virginia',
      title_pt: 'Eles Miravam a Virgínia',
      era: 'Early Modern',
      region: 'Plymouth, England', region_pt: 'Plymouth, Inglaterra',
      tag: 'Voyage', tag_pt: 'Viagem',
      text: 'The Mayflower left Plymouth with a hundred and two passengers, bound for the northern edge of the Virginia colony. Sixty-six days later she was off Cape Cod, hundreds of miles north of anywhere her passengers had permission to be, with winter coming and no legal authority over anyone aboard.',
      text_pt: 'O Mayflower deixou Plymouth com cento e dois passageiros, rumo à borda norte da colônia da Virgínia. Sessenta e seis dias depois estava diante do cabo Cod, centenas de quilômetros ao norte de qualquer lugar onde seus passageiros tivessem permissão de estar, com o inverno chegando e sem autoridade legal alguma sobre quem estava a bordo.',
      facts: [
        'Two ships had set out and one had to be given up. The Speedwell leaked so badly that they turned back twice, losing six weeks; some have argued her crew over-masted her deliberately to get out of the crossing, and her passengers were crammed onto the Mayflower instead.',
        'Landing outside their patent is exactly why they wrote a compact. With the document that gave them a government pointing at a place they had not reached, they drew up one of their own and signed it before going ashore.',
        'Fewer than half were religious separatists. The rest had been recruited by the investors as labour and were called Strangers by the others. About half of everyone aboard was dead by spring.'
      ],
      facts_pt: [
        'Dois navios haviam partido e um teve de ser abandonado. O Speedwell fazia água a tal ponto que voltaram atrás duas vezes, perdendo seis semanas; alguns sustentam que sua tripulação o sobrecarregou de mastreação de propósito para escapar da travessia, e seus passageiros foram espremidos no Mayflower.',
        'Desembarcar fora da concessão é exatamente a razão de terem escrito um pacto. Como o documento que lhes dava um governo apontava para um lugar onde não haviam chegado, redigiram um próprio e o assinaram antes de pisar em terra.',
        'Menos da metade eram separatistas religiosos. Os demais haviam sido recrutados pelos investidores como mão de obra e eram chamados de Estranhos pelos outros. Cerca de metade de todos a bordo estava morta na primavera.'
      ]
    }
  ],

  '09-17': [
    {
      year: 14,
      title: 'A Senator Swore He Saw Him Rise',
      title_pt: 'Um Senador Jurou Tê-lo Visto Subir',
      era: 'Classical',
      region: 'Rome', region_pt: 'Roma',
      tag: 'Deification', tag_pt: 'Divinização',
      text: 'A month after Augustus died, the Senate voted that he was a god. It was not a metaphor and not a formality: there were priests, a temple, a cult and a state calendar of his festivals. The man who had spent fifty years insisting he was merely the first citizen was legislated into a deity by the body he had always deferred to.',
      text_pt: 'Um mês depois da morte de Augusto, o Senado votou que ele era um deus. Não era metáfora nem formalidade: houve sacerdotes, templo, culto e um calendário estatal de festas em sua honra. O homem que passara cinquenta anos insistindo em ser apenas o primeiro cidadão foi transformado em divindade por decreto do corpo a que sempre fingira obedecer.',
      facts: [
        'A senator swore under oath that he had watched the emperor’s spirit rise from the funeral pyre into the sky. Livia paid him a million sesterces. Dio records both halves of that.',
        'He had written his own record first. The Res Gestae, a first-person account of everything he had done and everything he had paid for, was set up in bronze at his tomb and copied across the provinces; the surviving version is cut into a temple wall in Ankara.',
        'Deification turned into a grading system. Emperors who were liked got a vote like this one; emperors who were not had their names chiselled off their own monuments. Vespasian, dying, is supposed to have said: dear me, I think I am becoming a god.'
      ],
      facts_pt: [
        'Um senador jurou sob juramento ter visto o espírito do imperador subir da pira funerária para o céu. Lívia lhe pagou um milhão de sestércios. Dião registra as duas metades disso.',
        'Ele havia escrito seu próprio registro antes. As Res Gestae, um relato em primeira pessoa de tudo o que fizera e de tudo o que custeara, foram fixadas em bronze junto a seu túmulo e copiadas pelas províncias; a versão sobrevivente está entalhada na parede de um templo em Ancara.',
        'A divinização virou um sistema de notas. Imperadores queridos recebiam um voto como este; os que não eram tinham os nomes raspados dos próprios monumentos. Vespasiano, morrendo, teria dito: ai de mim, acho que estou virando um deus.'
      ]
    }
  ],

  '09-18': [
    {
      year: 1850,
      title: 'Ten Dollars to Rule Him a Slave, Five to Set Him Free',
      title_pt: 'Dez Dólares para Declará-lo Escravo, Cinco para Libertá-lo',
      era: 'Modern',
      region: 'United States', region_pt: 'Estados Unidos',
      tag: 'Slavery', tag_pt: 'Escravidão',
      text: 'The new law obliged citizens of the free states to help capture people who had escaped from the slave states, and denied the accused a jury and the right to speak in their own defence. The federal commissioner who decided each case was paid ten dollars for a ruling that the person before him was property, and five for a ruling that they were not.',
      text_pt: 'A nova lei obrigava os cidadãos dos estados livres a ajudar na captura de pessoas que haviam fugido dos estados escravistas, e negava ao acusado júri e direito de falar em sua própria defesa. O comissário federal que decidia cada caso recebia dez dólares por uma decisão de que a pessoa diante dele era propriedade, e cinco por uma decisão de que não era.',
      facts: [
        'It made the free North a hunting ground. Any Black person could be seized on a claimant’s sworn affidavit with no way to answer it, and thousands of free people left for Canada in the decade that followed.',
        'The section of the country that defended states’ rights had demanded federal power to override the states. Northern legislatures answered with personal liberty laws written to obstruct the federal officers, and the argument about who could nullify whom changed sides.',
        'Compelling ordinary Northerners to take part did more for abolition than any argument had. Harriet Beecher Stowe said this law was the reason she wrote Uncle Tom’s Cabin, which came out two years later and sold three hundred thousand copies in its first year.'
      ],
      facts_pt: [
        'Ela transformou o Norte livre em território de caça. Qualquer pessoa negra podia ser detida mediante declaração juramentada de um reclamante, sem meio de contestá-la, e milhares de pessoas livres partiram para o Canadá na década seguinte.',
        'A parte do país que defendia os direitos dos estados exigiu poder federal para passar por cima dos estados. As assembleias do Norte responderam com leis de liberdade pessoal escritas para obstruir os agentes federais, e o debate sobre quem podia anular quem trocou de lado.',
        'Obrigar nortistas comuns a participar fez mais pelo abolicionismo do que qualquer argumento. Harriet Beecher Stowe disse que foi por causa dessa lei que escreveu A Cabana do Pai Tomás, publicado dois anos depois e vendido em trezentos mil exemplares no primeiro ano.'
      ]
    }
  ],

  '09-19': [
    {
      year: 634,
      title: 'The City Fell Twice in One Day',
      title_pt: 'A Cidade Caiu Duas Vezes no Mesmo Dia',
      era: 'Medieval',
      region: 'Damascus', region_pt: 'Damasco',
      tag: 'Conquest', tag_pt: 'Conquista',
      text: 'Khalid ibn al-Walid stormed one gate of Damascus by force while, at a gate on the other side of the city, a second Muslim commander was accepting its peaceful surrender. The two columns met in the middle. Whether the city had been taken or had given itself up decided what could lawfully be done to it, and the commanders had to settle which had happened.',
      text_pt: 'Khalid ibn al-Walid tomou de assalto um dos portões de Damasco enquanto, num portão do outro lado da cidade, um segundo comandante muçulmano aceitava sua rendição pacífica. As duas colunas se encontraram no meio. Se a cidade fora tomada ou se entregara decidia o que licitamente se podia fazer com ela, e os comandantes tiveram de resolver qual das duas coisas ocorrera.',
      facts: [
        'They ruled for the treaty. Taken by storm, Damascus could have been plundered and its people enslaved; taken by agreement, it was owed protection. The peaceful terms were extended over the whole city, including the quarter that had been carried by force.',
        'Khalid had never lost a battle, and four years later the caliph dismissed him at the height of his reputation — by most accounts because people were starting to credit victories to Khalid rather than to God. He accepted it and went on serving under the man sent to replace him.',
        'Heraclius had just spent a lifetime beating Persia and carrying the True Cross back to Jerusalem, and lost Syria within a few years of this. Damascus became the capital of a caliphate that reached from Spain to the Indus.'
      ],
      facts_pt: [
        'Decidiram pelo tratado. Tomada de assalto, Damasco poderia ser saqueada e sua população escravizada; tomada por acordo, era-lhe devida proteção. Os termos pacíficos foram estendidos a toda a cidade, inclusive ao bairro que fora conquistado à força.',
        'Khalid nunca perdera uma batalha, e quatro anos depois o califa o destituiu no auge de sua fama — pela maior parte dos relatos, porque as pessoas começavam a atribuir as vitórias a Khalid e não a Deus. Ele aceitou e seguiu servindo sob o homem enviado para substituí-lo.',
        'Heráclio acabara de passar uma vida derrotando a Pérsia e levando a Vera Cruz de volta a Jerusalém, e perdeu a Síria poucos anos depois disto. Damasco tornou-se a capital de um califado que ia da Espanha ao Indo.'
      ]
    }
  ],

  '09-20': [
    {
      year: 1519,
      title: 'Two Hundred and Seventy Went, Eighteen Came Back',
      title_pt: 'Partiram Duzentos e Setenta, Voltaram Dezoito',
      era: 'Renaissance',
      region: 'Sanlúcar de Barrameda', region_pt: 'Sanlúcar de Barrameda',
      tag: 'Voyage', tag_pt: 'Viagem',
      text: 'The fleet had come down the Guadalquivir from Seville five weeks earlier and sat at the river mouth taking on stores. On this day it finally put to sea — five ships and about two hundred and seventy men, provisioned for two years, sailing for a strait that nobody had proved existed.',
      text_pt: 'A frota descera o Guadalquivir desde Sevilha cinco semanas antes e ficara na foz embarcando mantimentos. Neste dia ela enfim fez-se ao mar — cinco navios e cerca de duzentos e setenta homens, abastecidos para dois anos, rumo a um estreito que ninguém provara existir.',
      facts: [
        'Almost everything known about the voyage comes from one passenger who had no job on it. Antonio Pigafetta, a Venetian, signed on as a supernumerary because he wanted to see the wonders of the world, kept a journal the whole way, and was one of the handful who survived to bring it home.',
        'Portugal treated Magellan as a traitor and tried to stop him. Agents worked against the fitting-out in Seville, and ships were sent after the fleet; his Spanish captains, for their part, distrusted him precisely because he was Portuguese.',
        'The strait took fourteen months to find. They searched every opening down the length of South America, wintered on a freezing coast, and only entered the passage in October 1520 — thirty-eight days of channels and dead ends before the ocean on the other side.'
      ],
      facts_pt: [
        'Quase tudo o que se sabe da viagem vem de um passageiro que não tinha função nela. Antonio Pigafetta, veneziano, embarcou como supranumerário porque queria ver as maravilhas do mundo, manteve um diário o tempo todo e foi um dos poucos que sobreviveram para trazê-lo de volta.',
        'Portugal tratava Magalhães como traidor e tentou impedi-lo. Agentes trabalharam contra o aprestamento em Sevilha, e navios foram enviados atrás da frota; seus capitães espanhóis, por sua vez, desconfiavam dele justamente por ser português.',
        'O estreito levou catorze meses para ser achado. Vasculharam cada abertura ao longo da América do Sul, invernaram numa costa gelada, e só entraram na passagem em outubro de 1520 — trinta e oito dias de canais e becos sem saída até o oceano do outro lado.'
      ]
    }
  ],

  '09-21': [
    {
      year: 1937,
      title: 'A Blank Page in a Pile of Exam Papers',
      title_pt: 'Uma Página em Branco numa Pilha de Provas',
      era: 'Modern',
      region: 'Oxford', region_pt: 'Oxford',
      tag: 'Literature', tag_pt: 'Literatura',
      text: 'Marking school examinations one summer, a professor of Anglo-Saxon turned a page, found it empty, and wrote on it that in a hole in the ground there lived a hobbit. He had no idea what a hobbit was and spent years finding out. The book came out on this day in a first printing of fifteen hundred copies.',
      text_pt: 'Corrigindo provas escolares num verão, um professor de anglo-saxão virou uma folha, encontrou-a em branco e escreveu nela que num buraco no chão vivia um hobbit. Não fazia ideia do que era um hobbit e levou anos descobrindo. O livro saiu neste dia, numa primeira tiragem de mil e quinhentos exemplares.',
      facts: [
        'The publisher paid his ten-year-old son a shilling to read the manuscript and write a report. Rayner Unwin recommended it, noting that with maps it would need no illustrations and should suit children between five and nine. It is often called the best shilling ever spent in publishing.',
        'That same boy, grown up, pushed through The Lord of the Rings years later against the firm’s own expectation of losing money on it.',
        'There was a sequel only because the publisher asked for more about hobbits. Tolkien took seventeen years to answer, and the answer became the best-selling novel of the century.'
      ],
      facts_pt: [
        'O editor pagou um xelim ao filho de dez anos para ler o manuscrito e escrever um parecer. Rayner Unwin recomendou a publicação, observando que, com mapas, o livro não precisaria de ilustrações e serviria a crianças entre cinco e nove anos. É frequentemente chamado de o melhor xelim já gasto na história editorial.',
        'Esse mesmo menino, adulto, empurrou anos depois a publicação de O Senhor dos Anéis contra a expectativa da própria editora de perder dinheiro com ele.',
        'Só houve continuação porque o editor pediu mais coisas sobre hobbits. Tolkien levou dezessete anos para responder, e a resposta virou o romance mais vendido do século.'
      ]
    }
  ],

  '09-22': [
    {
      year: 1692,
      title: 'The Ones Who Would Not Confess',
      title_pt: 'Os que Não Quiseram Confessar',
      era: 'Early Modern',
      region: 'Salem, Massachusetts', region_pt: 'Salem, Massachusetts',
      tag: 'Trial', tag_pt: 'Julgamento',
      text: 'Eight people were hanged at Salem on this day, and nobody else ever was. Three days earlier Giles Corey had been pressed to death under stones for refusing to enter a plea at all. Within weeks the court that had condemned them was dissolved and the remaining prisoners were acquitted almost to a person.',
      text_pt: 'Oito pessoas foram enforcadas em Salem neste dia, e nunca mais ninguém o foi. Três dias antes, Giles Corey fora esmagado até a morte sob pedras por se recusar a sequer apresentar defesa. Em poucas semanas o tribunal que os condenara foi dissolvido e os prisioneiros restantes foram absolvidos quase sem exceção.',
      facts: [
        'Confessing saved your life. Everyone who admitted to witchcraft was spared; everyone who was hanged had refused to say they were guilty. By the court’s own workings, the nineteen who died were the ones who would not lie.',
        'The trials did not end because people stopped believing in witches. They ended because the rules of evidence changed: spectral evidence — testimony that the accused’s spirit had appeared and tormented the witness — was barred that October, after Increase Mather argued it were better that ten suspected witches escape than one innocent be condemned.',
        'Massachusetts kept clearing names for centuries. The last of them, Elizabeth Johnson Jr., was formally exonerated in 2022, three hundred and twenty-nine years later, after a class of schoolchildren took up her case.'
      ],
      facts_pt: [
        'Confessar salvava a vida. Todos os que admitiram bruxaria foram poupados; todos os enforcados haviam se recusado a se dizer culpados. Pela própria lógica do tribunal, os dezenove que morreram foram os que não quiseram mentir.',
        'Os julgamentos não terminaram porque as pessoas deixaram de acreditar em bruxas. Terminaram porque as regras de prova mudaram: a prova espectral — o depoimento de que o espírito do acusado aparecera e atormentara a testemunha — foi proibida em outubro, depois de Increase Mather argumentar que era melhor dez suspeitas de bruxaria escaparem do que um inocente ser condenado.',
        'Massachusetts seguiu limpando nomes por séculos. O último deles, Elizabeth Johnson Jr., foi formalmente inocentado em 2022, trezentos e vinte e nove anos depois, após uma turma de estudantes assumir sua causa.'
      ]
    }
  ],

  '09-23': [
    {
      year: 1950,
      title: 'Hit by Their Own Side',
      title_pt: 'Atingidos pelo Próprio Lado',
      era: 'Contemporary',
      region: 'Hill 282, Korea', region_pt: 'Colina 282, Coreia',
      tag: 'Friendly Fire', tag_pt: 'Fogo Amigo',
      text: 'The Argyll and Sutherland Highlanders had taken the hill at dawn and were holding it under counterattack when they called for air support. They laid out their recognition panels. The Mustangs came in and put napalm on the panels.',
      text_pt: 'Os Argyll and Sutherland Highlanders haviam tomado a colina ao amanhecer e a seguravam sob contra-ataque quando pediram apoio aéreo. Estenderam seus painéis de reconhecimento. Os Mustangs chegaram e despejaram napalm sobre os painéis.',
      facts: [
        'The markers were out and the position had been identified. That is what makes the incident notorious rather than merely tragic: the aircraft attacked a position that had been correctly marked, and roughly ninety men were killed or wounded by their own air support.',
        'Major Kenny Muir gathered what was left and led them back up through the burning ground to retake the summit. He was killed doing it and received a posthumous Victoria Cross.',
        'It was the first time since the Second World War that American fire had killed British troops, and it happened in a war that Britain fought for three years and largely stopped talking about afterwards.'
      ],
      facts_pt: [
        'Os marcadores estavam estendidos e a posição fora identificada. É isso que torna o episódio notório, e não apenas trágico: as aeronaves atacaram uma posição corretamente sinalizada, e cerca de noventa homens foram mortos ou feridos pelo próprio apoio aéreo.',
        'O major Kenny Muir reuniu o que restava e os conduziu de volta pelo terreno em chamas para retomar o cume. Morreu ao fazê-lo e recebeu a Victoria Cross póstuma.',
        'Foi a primeira vez desde a Segunda Guerra que fogo americano matou tropas britânicas, e aconteceu numa guerra que o Reino Unido lutou por três anos e sobre a qual depois praticamente parou de falar.'
      ]
    }
  ],

  '09-24': [
    {
      year: 867,
      title: 'The Bodyguard Who Took the Throne',
      title_pt: 'O Guarda-Costas que Ficou com o Trono',
      era: 'Medieval',
      region: 'Constantinople', region_pt: 'Constantinopla',
      tag: 'Murder', tag_pt: 'Assassinato',
      text: 'Basil had been a peasant from Macedonia, a wrestler and a groom, taken up by the emperor Michael III as a favourite and raised to co-emperor. One night he had the man who had made him killed in his own bedchamber, and took the whole of it. The dynasty he founded ruled Byzantium for nearly two hundred years.',
      text_pt: 'Basílio fora um camponês da Macedônia, lutador e cavalariço, adotado como favorito pelo imperador Miguel III e elevado a co-imperador. Certa noite mandou matar em seu próprio quarto o homem que o fizera, e ficou com tudo. A dinastia que fundou governou Bizâncio por quase duzentos anos.',
      facts: [
        'He had been promoted for his body. Basil came to notice by beating a Bulgarian champion at wrestling and by breaking a horse nobody else could, and he rose from stable work to the imperial bedchamber in about ten years.',
        'The Macedonian dynasty he began produced the empire’s strongest period since Justinian, including the legal codification of the Basilika and the reign of Basil II, who annexed Bulgaria. It began with a murdered patron and a locked door.',
        'Michael III went into the histories as Michael the Drunkard. Those histories were written under the dynasty of the man who killed him.'
      ],
      facts_pt: [
        'Ele fora promovido pelo corpo. Basílio chamou atenção ao vencer um campeão búlgaro na luta e ao domar um cavalo que ninguém domava, e subiu do trabalho nas cavalariças ao quarto imperial em cerca de dez anos.',
        'A dinastia macedônica que ele iniciou produziu o período mais forte do império desde Justiniano, incluindo a codificação legal das Basílicas e o reinado de Basílio II, que anexou a Bulgária. Começou com um patrono assassinado e uma porta trancada.',
        'Miguel III entrou para as histórias como Miguel, o Beberrão. Essas histórias foram escritas sob a dinastia do homem que o matou.'
      ]
    }
  ],

  '09-25': [
    {
      year: 1768,
      title: 'A Yam Between Two Boulders',
      title_pt: 'Um Inhame Entre Duas Pedras',
      era: 'Early Modern',
      region: 'Kathmandu', region_pt: 'Catmandu',
      tag: 'Unification', tag_pt: 'Unificação',
      text: 'Prithvi Narayan Shah of Gorkha took Kathmandu during the Indra Jatra festival, walking in while the city was celebrating, and made himself king of the valley. Out of a mountain principality and a long campaign he assembled the state that is Nepal, and described its position between China and India as a yam between two boulders.',
      text_pt: 'Prithvi Narayan Shah, de Gorkha, tomou Catmandu durante o festival Indra Jatra, entrando na cidade enquanto ela festejava, e fez-se rei do vale. De um principado de montanha e de uma longa campanha, montou o Estado que é o Nepal, e descreveu sua posição entre a China e a Índia como um inhame entre duas pedras.',
      facts: [
        'The phrase was a foreign policy. A yam between two boulders survives by not pressing on either, and Nepal spent the next two centuries keeping both neighbours at a distance — he expelled the European missionaries already in the valley and closed the country to outsiders.',
        'His kingdom of Gorkha gave the world the word Gurkha. The regiments that name would later attach to were recruited by the British precisely because the Gorkhali had fought them so hard.',
        'The dynasty he founded lasted two hundred and forty years. It effectively ended after the palace massacre of 2001, in which most of the royal family was shot dead, and formally in 2008, when Nepal abolished the monarchy.'
      ],
      facts_pt: [
        'A frase era uma política externa. Um inhame entre duas pedras sobrevive não pressionando nenhuma das duas, e o Nepal passou os dois séculos seguintes mantendo ambos os vizinhos à distância — ele expulsou os missionários europeus que já estavam no vale e fechou o país a estrangeiros.',
        'Seu reino de Gorkha deu ao mundo a palavra gurkha. Os regimentos a que esse nome se ligaria depois foram recrutados pelos britânicos justamente porque os gorkhali haviam lutado tão duro contra eles.',
        'A dinastia que fundou durou duzentos e quarenta anos. Acabou na prática após o massacre do palácio em 2001, no qual quase toda a família real foi morta a tiros, e formalmente em 2008, quando o Nepal aboliu a monarquia.'
      ]
    }
  ],

  '09-26': [
    {
      year: -46,
      title: 'He Vowed It to Victory and Dedicated It to Motherhood',
      title_pt: 'Prometeu-o à Vitória e Dedicou-o à Maternidade',
      era: 'Classical',
      region: 'Rome', region_pt: 'Roma',
      tag: 'Temple', tag_pt: 'Templo',
      text: 'On the morning of Pharsalus, Caesar had vowed a temple to Venus if she gave him the battle. When he came to build it he quietly changed the dedication: not Venus the Bringer of Victory but Venus the Ancestress — the goddess from whom his own family claimed descent. A battlefield promise was converted into a genealogy.',
      text_pt: 'Na manhã de Farsalos, César prometera um templo a Vênus se ela lhe desse a batalha. Quando foi construí-lo, mudou discretamente a dedicatória: não Vênus Vitoriosa, mas Vênus Genetriz — a deusa de quem sua própria família alegava descender. Uma promessa de campo de batalha foi convertida em genealogia.',
      facts: [
        'He put a gold statue of Cleopatra beside the goddess. A living foreign queen, mother of a child he had not publicly acknowledged, standing in a Roman temple next to the ancestress of his house.',
        'The temple anchored a whole new forum built alongside the old one, paid for with the spoils of Gaul. Caesar had bought the land for it at a cost that contemporaries found obscene.',
        'The genealogy was the point. Claiming descent from Venus through Aeneas put the family above the Republic’s other houses by an order of magnitude, and eighteen months later that claim made his heir something more than a great-nephew.'
      ],
      facts_pt: [
        'Ele pôs uma estátua de ouro de Cleópatra ao lado da deusa. Uma rainha estrangeira viva, mãe de um filho que ele não reconhecera publicamente, de pé num templo romano ao lado da ancestral de sua casa.',
        'O templo ancorava um fórum inteiramente novo, construído ao lado do antigo e pago com o espólio da Gália. César comprara o terreno por um valor que os contemporâneos acharam obsceno.',
        'A genealogia era o ponto. Alegar descendência de Vênus por Eneias punha a família acima das outras casas da República por uma ordem de grandeza, e dezoito meses depois essa alegação fez de seu herdeiro algo mais do que um sobrinho-neto.'
      ]
    }
  ],

  '09-27': [
    {
      year: 1529,
      title: 'The Empire Finds Its Radius',
      title_pt: 'O Império Descobre Seu Raio',
      era: 'Renaissance',
      region: 'Vienna', region_pt: 'Viena',
      tag: 'Siege', tag_pt: 'Cerco',
      text: 'Suleiman arrived under the walls of Vienna with an army that had taken Belgrade, Rhodes and Hungary, and could not take a city defended by perhaps twenty thousand men. He was beaten less by the garrison than by the calendar and the weather: an exceptionally wet autumn had already cost him his heavy guns on the roads.',
      text_pt: 'Solimão chegou sob as muralhas de Viena com um exército que tomara Belgrado, Rodes e a Hungria, e não conseguiu tomar uma cidade defendida por talvez vinte mil homens. Foi derrotado menos pela guarnição do que pelo calendário e pelo clima: um outono excepcionalmente chuvoso já lhe custara a artilharia pesada nas estradas.',
      facts: [
        'The siege train never arrived. Rain turned the Balkan roads to mud and the heavy cannon had to be abandoned along the way, leaving him to mine the walls instead of breaching them.',
        'Vienna sat at about the limit of what an Ottoman army could reach and still get home before winter closed the passes. The campaign discovered the radius of the empire, and for a century and a half nobody tried to go further.',
        'The defence was commanded by a man of seventy, Niklas Graf Salm, who was injured by a falling stone in the last assaults and died of it the following spring.'
      ],
      facts_pt: [
        'O trem de cerco nunca chegou. A chuva transformou as estradas balcânicas em lama e os canhões pesados tiveram de ser abandonados pelo caminho, restando-lhe minar as muralhas em vez de arrombá-las.',
        'Viena ficava mais ou menos no limite do que um exército otomano alcançava e ainda conseguia voltar antes que o inverno fechasse as passagens. A campanha descobriu o raio do império, e por um século e meio ninguém tentou ir além.',
        'A defesa era comandada por um homem de setenta anos, Niklas Graf Salm, ferido por uma pedra que caiu nos últimos assaltos e morto por esse ferimento na primavera seguinte.'
      ]
    }
  ],

  '09-28': [
    {
      year: 1066,
      title: 'He Waited for the Wind',
      title_pt: 'Ele Esperou o Vento',
      era: 'Medieval',
      region: 'Pevensey, Sussex', region_pt: 'Pevensey, Sussex',
      tag: 'Invasion', tag_pt: 'Invasão',
      text: 'William had been sitting on the French coast for six weeks with a fleet he could not sail, waiting for the wind to turn. It turned at the best possible moment: Harold had just disbanded the militia that had watched the coast all summer, and was four hundred kilometres north, fighting a different invasion.',
      text_pt: 'Guilherme passara seis semanas parado na costa francesa com uma frota que não conseguia fazer navegar, esperando o vento virar. Virou no melhor momento possível: Haroldo acabara de dispensar a milícia que vigiara a costa o verão inteiro, e estava a quatrocentos quilômetros ao norte, combatendo outra invasão.',
      facts: [
        'Harold had held the south coast all summer and ran out of supplies. He stood the fyrd down on 8 September because he could not feed it any longer. William landed twenty days later.',
        'Three days before that, Harold had destroyed a Norwegian invasion at Stamford Bridge in Yorkshire. He then marched his army the length of England and fought at Hastings nineteen days after that battle, with men who had walked hundreds of kilometres twice.',
        'William is said to have fallen flat on his face as he stepped ashore, and to have turned it into an omen on the spot by standing up with fists full of sand and declaring he had taken England with both hands.'
      ],
      facts_pt: [
        'Haroldo guardara a costa sul o verão inteiro e ficou sem mantimentos. Dispensou o fyrd em 8 de setembro porque já não conseguia alimentá-lo. Guilherme desembarcou vinte dias depois.',
        'Três dias antes disso, Haroldo destruíra uma invasão norueguesa em Stamford Bridge, em Yorkshire. Em seguida marchou seu exército de ponta a ponta da Inglaterra e combateu em Hastings dezenove dias depois daquela batalha, com homens que haviam caminhado centenas de quilômetros duas vezes.',
        'Conta-se que Guilherme caiu de cara no chão ao pisar em terra, e converteu aquilo em presságio na hora, levantando-se com os punhos cheios de areia e declarando que tomara a Inglaterra com as duas mãos.'
      ]
    }
  ],

  '09-29': [
    {
      year: 1227,
      title: 'Excommunicated for Not Going, Excommunicated for Going',
      title_pt: 'Excomungado por Não Ir, Excomungado por Ir',
      era: 'Medieval',
      region: 'Rome', region_pt: 'Roma',
      tag: 'Excommunication', tag_pt: 'Excomunhão',
      text: 'Frederick II had promised to go on crusade for eleven years and kept postponing. When he finally sailed, an epidemic swept the fleet, he fell ill himself and turned back — and Gregory IX excommunicated him for it. So he went the following year while excommunicated, and got Jerusalem.',
      text_pt: 'Frederico II prometia ir à cruzada havia onze anos e adiava sempre. Quando enfim zarpou, uma epidemia varreu a frota, ele próprio adoeceu e voltou atrás — e Gregório IX o excomungou por isso. Então foi no ano seguinte, excomungado, e conseguiu Jerusalém.',
      facts: [
        'He took the city without a battle. Frederick negotiated a treaty with the sultan al-Kamil, who ceded Jerusalem, Bethlehem and Nazareth for ten years, and crowned himself king of Jerusalem in the Holy Sepulchre in 1229 — an excommunicate, so no churchman would perform it.',
        'Rome was not grateful. The pope excommunicated him again for having done it, and the patriarch of Jerusalem placed the recovered city under interdict. A Christian had regained Jerusalem and the Church shut its churches.',
        'He was excommunicated four times in his life and called the Antichrist from the pulpit. He was also called stupor mundi, the astonishment of the world: he spoke six languages, kept Muslim and Jewish scholars at his Sicilian court, and wrote a book on falconry that is still read as natural history.'
      ],
      facts_pt: [
        'Ele tomou a cidade sem batalha. Frederico negociou um tratado com o sultão al-Kamil, que cedeu Jerusalém, Belém e Nazaré por dez anos, e coroou a si mesmo rei de Jerusalém no Santo Sepulcro em 1229 — excomungado, de modo que nenhum clérigo faria a cerimônia.',
        'Roma não agradeceu. O papa o excomungou de novo por tê-lo feito, e o patriarca de Jerusalém pôs a cidade recuperada sob interdito. Um cristão reavia Jerusalém e a Igreja fechava suas igrejas.',
        'Foi excomungado quatro vezes na vida e chamado de Anticristo do púlpito. Também foi chamado de stupor mundi, o assombro do mundo: falava seis línguas, mantinha sábios muçulmanos e judeus em sua corte siciliana, e escreveu um tratado de falcoaria que ainda se lê como história natural.'
      ]
    }
  ],

  '09-30': [
    {
      year: 1960,
      title: 'A Cartoon Made for Adults',
      title_pt: 'Um Desenho Feito para Adultos',
      era: 'Contemporary',
      region: 'United States', region_pt: 'Estados Unidos',
      tag: 'Television', tag_pt: 'Televisão',
      text: 'The Flintstones went out at half past eight in the evening, in the middle of the adult schedule, and was the first animated series made for prime time. It was a sitcom about a married couple with money problems, lifted almost directly from The Honeymooners and moved to the Stone Age.',
      text_pt: 'Os Flintstones foi ao ar às oito e meia da noite, no meio da grade adulta, e foi a primeira série animada feita para o horário nobre. Era uma comédia sobre um casal com problemas de dinheiro, tirada quase diretamente de The Honeymooners e transportada para a Idade da Pedra.',
      facts: [
        'It was sponsored by a cigarette company. For the first two seasons Fred and Barney appeared in commercials lighting up Winstons, and the show was written for the audience those advertisements were aimed at.',
        'It ran six seasons and a hundred and sixty-six episodes, and held the record for the longest-running prime-time animated series for thirty-seven years, until The Simpsons passed it.',
        'It was among the first American programmes to show a married couple sharing a bed. By the time the reruns had turned it into children’s television, none of that was what anyone remembered about it.'
      ],
      facts_pt: [
        'Era patrocinado por uma empresa de cigarros. Nas duas primeiras temporadas, Fred e Barney apareciam em comerciais acendendo Winstons, e o programa era escrito para o público a que esses anúncios se dirigiam.',
        'Durou seis temporadas e cento e sessenta e seis episódios, e manteve o recorde de série animada mais longa do horário nobre por trinta e sete anos, até Os Simpsons o superarem.',
        'Foi um dos primeiros programas americanos a mostrar um casal dividindo a mesma cama. Quando as reprises já o haviam transformado em programa infantil, nada disso era o que alguém lembrava dele.'
      ]
    }
  ],

  '10-01': [
    {
      year: -331,
      title: 'Darius Ran Again',
      title_pt: 'Dario Fugiu de Novo',
      era: 'Classical',
      region: 'Northern Mesopotamia', region_pt: 'Norte da Mesopotâmia',
      tag: 'Battle', tag_pt: 'Batalha',
      text: 'Darius had chosen the ground and had it levelled so that his chariots and his far larger cavalry could work on it. Alexander drew the Persian left out of position by marching obliquely across its front, opened a gap in the line, and drove the Companion cavalry through it straight at the king. Darius turned and rode, as he had at Issus two years earlier, and the army he left behind came apart.',
      text_pt: 'Dario escolhera o terreno e o mandara aplainar para que seus carros de guerra e sua cavalaria, muito maior, pudessem operar nele. Alexandre puxou a esquerda persa para fora de posição marchando obliquamente diante dela, abriu uma brecha na linha e lançou a cavalaria dos Companheiros por ela, direto contra o rei. Dario deu meia-volta e cavalgou, como fizera em Isso dois anos antes, e o exército que deixou para trás se desfez.',
      facts: [
        'There is a record of that day that no Greek wrote. A Babylonian clay tablet, one of a routine series of astronomical diaries, notes the lunar eclipse eleven days earlier and then the battle and its outcome — dry, contemporary, in cuneiform, and entirely independent of Alexander’s own historians.',
        'One Persian flank was winning. While Darius fled, his left had driven into Parmenion’s wing and got as far as the Macedonian baggage camp. What decided the day was the king leaving it, not the fighting on it.',
        'Gaugamela is Aramaic for the camel’s house. Ancient writers thought that beneath the dignity of so large a battle and named it instead after Arbela, a town a hundred kilometres away, which is why it comes down to us under two names.'
      ],
      facts_pt: [
        'Existe um registro daquele dia que nenhum grego escreveu. Uma tábua de argila babilônica, de uma série rotineira de diários astronômicos, anota o eclipse lunar de onze dias antes e em seguida a batalha e seu resultado — seco, contemporâneo, em cuneiforme, e inteiramente independente dos historiadores de Alexandre.',
        'Um dos flancos persas estava vencendo. Enquanto Dario fugia, sua ala esquerda havia furado a ala de Parmênio e chegado até o acampamento de bagagens macedônio. O que decidiu o dia foi o rei ter saído dele, não o combate travado nele.',
        'Gaugamela é aramaico para a casa do camelo. Os autores antigos acharam o nome indigno de uma batalha tão grande e a batizaram de Arbela, uma cidade a cem quilômetros dali, razão pela qual ela nos chega com dois nomes.'
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
