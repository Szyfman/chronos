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
