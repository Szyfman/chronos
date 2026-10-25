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
//   pin         Boolean  optional — always this day's card, whatever the year:
//                        used for the event of an event trophy (special
//                        'card_on_date'). The day's other cards are then shown
//                        after it, one tap away, instead of rotating by year.
// ─────────────────────────────────────────────────────────────────────────

var DAILY_CARDS = {

  '01-01': [
    {
      year: -45,
      title: 'The Year Before Lasted 445 Days',
      title_pt: 'O Ano Anterior Durou 445 Dias',
      era: 'Classical',
      region: 'Rome', region_pt: 'Roma',
      tag: 'Calendar', tag_pt: 'Calendário',
      text: 'On 1 January 45 BCE Rome began to keep the calendar Julius Caesar had ordered with the help of the Alexandrian astronomer Sosigenes: 365 days, with one extra day every fourth year. Getting there had cost a year like no other. The old calendar had drifted so far from the seasons that 46 BCE was stretched to 445 days to pull the months back into place.',
      text_pt: 'Em 1º de janeiro de 45 AEC, Roma passou a seguir o calendário que Júlio César encomendara com a ajuda do astrônomo alexandrino Sosígenes: 365 dias, com um dia a mais a cada quatro anos. Chegar até ali custara um ano como nenhum outro. O calendário antigo se afastara tanto das estações que 46 AEC foi esticado até 445 dias para devolver os meses ao lugar.',
      facts: [
        'The old year had 355 days, and the priests were supposed to insert an extra month when needed. They did it when it suited them — to lengthen a friend’s term in office or shorten an enemy’s — and during the civil wars hardly at all. The man in charge of the calendar, as chief priest, was Caesar himself.',
        'It went wrong at once. After Caesar’s death the priests counted every fourth year inclusively, the Roman way, and added a leap day every three years. Augustus had to suspend leap years for a time, and the calendar only ran as designed from 8 CE.',
        'Two months still carry the reform’s authors. Quintilis, the month of Caesar’s birth, was renamed Julius in his honour in 44 BCE, and Sextilis became Augustus in 8 BCE. The old names meant fifth and sixth, left over from a time when the Roman year began in March — which is also why September to December, named seventh to tenth, are the ninth to twelfth months.'
      ],
      facts_pt: [
        'O ano antigo tinha 355 dias, e cabia aos sacerdotes inserir um mês extra quando necessário. Faziam isso quando lhes convinha — para alongar o mandato de um amigo ou encurtar o de um inimigo — e, durante as guerras civis, quase nunca. O responsável pelo calendário, como sumo sacerdote, era o próprio César.',
        'Deu errado logo de saída. Depois da morte de César, os sacerdotes contaram o “a cada quatro anos” de modo inclusivo, à maneira romana, e acrescentaram um dia bissexto a cada três anos. Augusto teve de suspender os anos bissextos por um tempo, e o calendário só funcionou como planejado a partir de 8 EC.',
        'Dois meses ainda levam os nomes dos autores da reforma. Quintilis, o mês do nascimento de César, passou a se chamar Julius em sua honra em 44 AEC, e Sextilis virou Augustus em 8 AEC. Os nomes antigos significavam quinto e sexto, resquício de um tempo em que o ano romano começava em março — e é por isso também que setembro a dezembro, chamados de sétimo a décimo, são o nono ao décimo segundo meses.'
      ]
    },
    {
      year: 1502,
      title: 'There Is No River in Rio',
      title_pt: 'Não Há Rio no Rio',
      era: 'Renaissance',
      region: 'Guanabara Bay', region_pt: 'Baía de Guanabara',
      tag: 'Exploration', tag_pt: 'Exploração',
      text: 'On 1 January 1502 a Portuguese fleet exploring the coast of Brazil sailed into a vast bay ringed by granite peaks and named it Rio de Janeiro, the River of January. No river reaches the sea there: the city that grew on its shore is named after a bay. The popular explanation — that the sailors mistook the narrow entrance for the mouth of a river — is doubtful, since the word rio was then used loosely for any large inlet of water.',
      text_pt: 'Em 1º de janeiro de 1502, uma frota portuguesa que explorava a costa do Brasil entrou numa baía enorme cercada de picos de granito e a batizou de Rio de Janeiro. Nenhum rio deságua ali: a cidade que cresceu em suas margens tem o nome de uma baía. A explicação popular — a de que os marinheiros confundiram a entrada estreita com a foz de um rio — é duvidosa, já que a palavra rio era usada então, de modo frouxo, para qualquer grande braço de água.',
      facts: [
        'Who led the fleet is disputed — Gonçalo Coelho or Gaspar de Lemos — and so is whether Amerigo Vespucci was aboard. Vespucci’s letters about these voyages were read across Europe, and in 1507 a German mapmaker put the name America on the new continent in his honour.',
        'The bay kept its own name. The Tupi who lived on its shores called it Guanabara, and the name the Portuguese gave the water ended up belonging to the city instead.',
        'The city came sixty-three years later. The Portuguese did not settle the bay until the French had planted a colony in it, and Rio was founded on 1 March 1565 as São Sebastião do Rio de Janeiro, after the saint and the boy king Sebastian of Portugal.'
      ],
      facts_pt: [
        'Quem comandava a frota é discutido — Gonçalo Coelho ou Gaspar de Lemos —, assim como se Américo Vespúcio estava a bordo. As cartas de Vespúcio sobre essas viagens foram lidas por toda a Europa, e em 1507 um cartógrafo alemão pôs o nome América no novo continente em sua homenagem.',
        'A baía guardou o próprio nome. Os tupis que viviam em suas margens a chamavam de Guanabara, e o nome que os portugueses deram às águas acabou pertencendo à cidade.',
        'A cidade veio sessenta e três anos depois. Os portugueses só ocuparam a baía depois que os franceses instalaram nela uma colônia, e o Rio foi fundado em 1º de março de 1565 como São Sebastião do Rio de Janeiro, em honra ao santo e ao jovem rei Sebastião de Portugal.'
      ]
    }
  ],

  '03-15': [
    {
      year: -44,
      pin: true,
      title: 'The Ides of March',
      title_pt: 'Os Idos de Março',
      era: 'Classical',
      region: 'Rome', region_pt: 'Roma',
      tag: 'Politics', tag_pt: 'Política',
      text: 'On 15 March 44 BCE, in a hall beside the Theatre of Pompey, Julius Caesar was stabbed to death by a group of senators, weeks after being made dictator for life. The conspirators believed they were saving the Republic; instead they ended it, and the civil wars that followed produced an emperor.',
      text_pt: 'Em 15 de março de 44 AEC, num salão ao lado do Teatro de Pompeu, Júlio César foi assassinado a punhaladas por um grupo de senadores, semanas depois de ser feito ditador perpétuo. Os conspiradores acreditavam estar salvando a República; em vez disso, deram fim a ela, e as guerras civis que se seguiram produziram um imperador.',
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

  '04-21': [
    {
      year: -753,
      title: 'Rome Was Born at a Shepherds’ Festival',
      title_pt: 'Roma Nasceu Numa Festa de Pastores',
      era: 'Ancient',
      region: 'Rome', region_pt: 'Roma',
      tag: 'Founding', tag_pt: 'Fundação',
      text: 'By the traditional reckoning, Romulus founded Rome on 21 April 753 BCE, ploughing a furrow around the Palatine Hill to mark the sacred boundary of his city. The day was already a festival — the Parilia, when shepherds purified their flocks and leapt over bonfires in honour of Pales, a god of herds — and Rome kept its birthday on it ever after.',
      text_pt: 'Pela contagem tradicional, Rômulo fundou Roma em 21 de abril de 753 AEC, abrindo com o arado um sulco em volta do monte Palatino para marcar o limite sagrado de sua cidade. O dia já era uma festa — a Parília, quando os pastores purificavam os rebanhos e saltavam sobre fogueiras em honra de Pales, divindade dos rebanhos — e Roma passou a celebrar nele seu aniversário para sempre.',
      facts: [
        'The year was worked out centuries later, and Roman writers disagreed by decades: Fabius Pictor put the founding in 748 BCE and Cato in 751. The date that won was the one fixed by the scholar Varro, who even had an astrologer cast Romulus’s horoscope.',
        'The Romans themselves rarely counted years from the founding. They named each year after its two consuls, and numbering years ab urbe condita, from the founding of the city, is mostly a convenience of later historians.',
        'Rome still celebrates. In 121 CE Hadrian chose the city’s birthday to begin his Temple of Venus and Rome, the largest temple in the city, and every 21 April the Natale di Roma fills the streets with parades in Roman costume.'
      ],
      facts_pt: [
        'O ano foi calculado séculos depois, e os escritores romanos discordavam por décadas: Fábio Pictor punha a fundação em 748 AEC e Catão em 751. A data que venceu foi a fixada pelo erudito Varrão, que chegou a mandar um astrólogo levantar o horóscopo de Rômulo.',
        'Os próprios romanos raramente contavam os anos a partir da fundação. Davam a cada ano o nome de seus dois cônsules, e numerar os anos ab urbe condita, desde a fundação da cidade, é sobretudo uma conveniência de historiadores posteriores.',
        'Roma ainda comemora. Em 121 EC, Adriano escolheu o aniversário da cidade para iniciar seu Templo de Vênus e Roma, o maior templo da cidade, e todo 21 de abril o Natale di Roma enche as ruas de desfiles em trajes romanos.'
      ]
    },
    {
      year: 1960,
      title: 'Born on Tiradentes Day',
      title_pt: 'Nascida no Dia de Tiradentes',
      era: 'Contemporary',
      region: 'Brasília', region_pt: 'Brasília',
      tag: 'Politics', tag_pt: 'Política',
      text: 'On 21 April 1960 President Juscelino Kubitschek inaugurated Brasília, a capital raised from empty savannah on the central plateau in about forty-one months. The date was chosen on purpose: it was the anniversary of the execution of Tiradentes. The idea was far older than the city — Brazil’s first republican constitution, in 1891, had already reserved land for a new capital in the interior.',
      text_pt: 'Em 21 de abril de 1960, o presidente Juscelino Kubitschek inaugurou Brasília, uma capital erguida no cerrado vazio do Planalto Central em cerca de quarenta e um meses. A data foi escolhida de propósito: era o aniversário da execução de Tiradentes. A ideia era muito mais velha que a cidade — a primeira Constituição republicana do Brasil, de 1891, já reservava terras no interior para uma nova capital.',
      facts: [
        'The name is older still. José Bonifácio, the statesman of independence, proposed moving the capital inland in 1823 and suggested calling it Brasília.',
        'The plan won a competition in 1957 with a short report and a few freehand sketches by Lúcio Costa. He described it as two axes crossing at right angles — the sign of the cross, the gesture of someone taking possession of a place. The resemblance to an aeroplane came later, from the shape the plan took.',
        'It opened unfinished. Tens of thousands of workers, the candangos, many of them from the Northeast, had built it in shifts around the clock, and for years afterwards much of the government still worked from Rio. Kubitschek had campaigned on fifty years of progress in five.'
      ],
      facts_pt: [
        'O nome é ainda mais antigo. José Bonifácio, o estadista da independência, propôs levar a capital para o interior em 1823 e sugeriu chamá-la de Brasília.',
        'O plano venceu um concurso em 1957 com um relatório curto e alguns esboços à mão livre de Lúcio Costa. Ele o descreveu como dois eixos cruzando-se em ângulo reto — o sinal da cruz, o gesto de quem toma posse de um lugar. A semelhança com um avião veio depois, da forma que o plano tomou.',
        'Foi inaugurada inacabada. Dezenas de milhares de operários, os candangos, muitos vindos do Nordeste, a construíram em turnos dia e noite, e por anos boa parte do governo continuou trabalhando no Rio. Kubitschek fizera campanha com a promessa de cinquenta anos de progresso em cinco.'
      ]
    }
  ],

  '05-13': [
    {
      year: 1888,
      pin: true,
      title: 'The Law of Two Sentences',
      title_pt: 'A Lei de Duas Frases',
      era: 'Modern',
      region: 'Rio de Janeiro', region_pt: 'Rio de Janeiro',
      tag: 'Abolition', tag_pt: 'Abolição',
      text: 'On the afternoon of 13 May 1888, hours after the Senate voted it through, Princess Isabel — regent while her father Pedro II was in Europe — signed the Golden Law at the imperial palace in Rio de Janeiro, and Brazil became the last country in the Americas to abolish slavery. Some 700,000 people still enslaved were freed at once, with no conditions attached — and with nothing else either.',
      text_pt: 'Na tarde de 13 de maio de 1888, horas depois de o Senado aprová-la, a princesa Isabel — regente enquanto o pai, Pedro II, estava na Europa — assinou a Lei Áurea no Paço Imperial, no Rio de Janeiro, e o Brasil se tornou o último país das Américas a abolir a escravidão. Cerca de 700 mil pessoas ainda escravizadas foram libertadas de uma vez, sem nenhuma condição — e também sem mais nada.',
      facts: [
        'It is two sentences long. The first declares slavery extinct in Brazil from that date; the second revokes every provision to the contrary. It says nothing about land, schooling or wages, and the freed were left to fend for themselves.',
        'Unlike Britain in 1834, Brazil paid the owners nothing, and many of them never forgave the Crown. Eighteen months later the monarchy fell, with so many former slaveholders among the new regime’s supporters that they were nicknamed the “republicans of 13 May”.',
        'By then slavery was collapsing from below. Ceará and Amazonas had freed their slaves in 1884, thousands were fleeing the São Paulo plantations with the help of abolitionists, and in 1887 the Military Club, presided over by Marshal Deodoro da Fonseca, asked that the army be spared the job of hunting runaways. Two years later the same Deodoro proclaimed the Republic.'
      ],
      facts_pt: [
        'Ela tem duas frases. A primeira declara extinta a escravidão no Brasil a partir daquela data; a segunda revoga todas as disposições em contrário. Não diz nada sobre terra, escola ou salário, e os libertos foram deixados à própria sorte.',
        'Ao contrário do Reino Unido em 1834, o Brasil não pagou nada aos donos, e muitos deles nunca perdoaram a Coroa. Dezoito meses depois a monarquia caiu, com tantos ex-senhores de escravos entre os apoiadores do novo regime que eles ganharam o apelido de “republicanos de 13 de maio”.',
        'A essa altura a escravidão já desmoronava por baixo. O Ceará e o Amazonas haviam libertado seus escravizados em 1884, milhares fugiam das fazendas de São Paulo com a ajuda de abolicionistas, e em 1887 o Clube Militar, presidido pelo marechal Deodoro da Fonseca, pediu que o Exército fosse dispensado de caçar fugitivos. Dois anos depois, o mesmo Deodoro proclamou a República.'
      ]
    }
  ],

  '05-29': [
    {
      year: 1453,
      title: 'The City Fell on a Tuesday',
      title_pt: 'A Cidade Caiu numa Terça-feira',
      era: 'Medieval',
      region: 'Constantinople', region_pt: 'Constantinopla',
      tag: 'Conquest', tag_pt: 'Conquista',
      text: 'Before dawn on 29 May 1453, after a siege of fifty-three days, the army of Sultan Mehmed II broke into Constantinople. The last emperor, Constantine XI, died in the fighting and his body was never identified. The Roman Empire, which had outlived the fall of the West by nearly a thousand years, ended that morning, and that afternoon the twenty-one-year-old sultan rode to Hagia Sophia and ordered it turned into a mosque.',
      text_pt: 'Antes do amanhecer de 29 de maio de 1453, depois de um cerco de cinquenta e três dias, o exército do sultão Mehmed II invadiu Constantinopla. O último imperador, Constantino XI, morreu nos combates e seu corpo nunca foi identificado. O Império Romano, que sobrevivera quase mil anos à queda do Ocidente, terminou naquela manhã, e à tarde o sultão de vinte e um anos cavalgou até Santa Sofia e mandou transformá-la em mesquita.',
      facts: [
        'It was a Tuesday, and the Greek world has held it against the day ever since. Tuesday is still the unluckiest day of the week in Greek tradition, and the Greek version of Friday the 13th is Tuesday the 13th. Spanish speakers fear Tuesday the 13th too, though they usually blame Mars, the god of war, who gave the day its name.',
        'The gun that broke the walls was offered to the defenders first. A Hungarian founder named Orban went to Constantine XI, who could neither pay him nor supply the bronze; he then went to Mehmed, who gave him everything he asked for. His largest cannon, some eight metres long, needed dozens of oxen to move and could fire only a few times a day.',
        'The city believed it had been warned. A prophecy said Constantinople would not fall while the moon was waxing; on 22 May the full moon rose in partial eclipse, and a few days later a thick fog was followed by a strange light around the dome of Hagia Sophia, which many took to mean the Holy Spirit was leaving the city.'
      ],
      facts_pt: [
        'Era uma terça-feira, e o mundo grego guarda rancor do dia desde então. A terça ainda é o dia mais azarado da semana na tradição grega, e a versão grega da sexta-feira 13 é a terça-feira 13. Os povos de língua espanhola também temem a terça 13, embora costumem culpar Marte, o deus da guerra, que deu nome ao dia.',
        'O canhão que derrubou as muralhas foi oferecido primeiro aos defensores. Um fundidor húngaro chamado Orbán procurou Constantino XI, que não podia pagá-lo nem fornecer o bronze; foi então a Mehmed, que lhe deu tudo o que pediu. Seu maior canhão, com uns oito metros de comprimento, precisava de dezenas de bois para ser movido e só conseguia disparar poucas vezes por dia.',
        'A cidade acreditava ter sido avisada. Uma profecia dizia que Constantinopla não cairia enquanto a lua crescesse; em 22 de maio a lua cheia nasceu em eclipse parcial, e poucos dias depois uma névoa espessa foi seguida de uma luz estranha em torno da cúpula de Santa Sofia, que muitos entenderam como o Espírito Santo deixando a cidade.'
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
      text: 'On 4 July 1776 the Second Continental Congress in Philadelphia approved the final text of the Declaration of Independence, announcing that the thirteen colonies were no longer subject to the British Crown. The vote to separate had already passed two days earlier; what happened on the fourth was the wording.',
      text_pt: 'Em 4 de julho de 1776, o Segundo Congresso Continental, na Filadélfia, aprovou o texto final da Declaração de Independência, anunciando que as treze colônias não estavam mais sujeitas à Coroa Britânica. A votação pela separação já havia passado dois dias antes; o que aconteceu no dia quatro foi a redação.',
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
      text: 'On 4 July 1826, exactly fifty years after the Declaration they had helped create, Thomas Jefferson and John Adams died within hours of each other — rivals for a decade, then friends by letter for fourteen years. The country was in the middle of celebrating the anniversary when the news came in.',
      text_pt: 'Em 4 de julho de 1826, exatamente cinquenta anos depois da Declaração que ajudaram a criar, Thomas Jefferson e John Adams morreram com poucas horas de diferença — rivais por uma década, depois amigos por correspondência durante catorze anos. O país estava no meio das comemorações do aniversário quando a notícia chegou.',
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

  '07-14': [
    {
      year: 1789,
      pin: true,
      title: 'Seven Prisoners',
      title_pt: 'Sete Prisioneiros',
      era: 'Modern',
      region: 'Paris', region_pt: 'Paris',
      tag: 'Revolution', tag_pt: 'Revolução',
      text: 'On 14 July 1789 a crowd of Parisians who had already taken muskets from the Invalides marched on the Bastille in search of gunpowder. After hours of fighting the governor, the Marquis de Launay, surrendered; he was killed on the way to the city hall and his head was paraded on a pike. The fortress had stood for four centuries as the symbol of the king’s power to imprison without trial, and its fall became the founding image of the French Revolution.',
      text_pt: 'Em 14 de julho de 1789, uma multidão de parisienses que já havia tomado mosquetes dos Inválidos marchou sobre a Bastilha em busca de pólvora. Depois de horas de combate, o governador, o marquês de Launay, se rendeu; foi morto a caminho da prefeitura e sua cabeça desfilou espetada numa lança. A fortaleza existia havia quatro séculos como símbolo do poder do rei de prender sem julgamento, e sua queda virou a imagem fundadora da Revolução Francesa.',
      facts: [
        'There were only seven prisoners inside: four forgers, two men held as insane and a nobleman locked up at his own family’s request. The most famous inmate had left ten days earlier — the Marquis de Sade, moved out after shouting from his window that the prisoners were being slaughtered.',
        'Louis XVI wrote a single word in his diary for that day: “Rien” — “Nothing”. It was his hunting journal, and he had caught nothing.',
        'The building was gone within months, and it sold well. The contractor Pierre-François Palloy carved its stones into miniature Bastilles and sent one to every department of France, and Lafayette sent the main key to George Washington, whose house at Mount Vernon still displays it.'
      ],
      facts_pt: [
        'Havia apenas sete prisioneiros lá dentro: quatro falsários, dois homens tidos como loucos e um nobre trancado a pedido da própria família. O detento mais famoso tinha saído dez dias antes — o marquês de Sade, transferido depois de gritar da janela que os prisioneiros estavam sendo massacrados.',
        'Luís XVI escreveu uma única palavra no diário naquele dia: “Rien” — “Nada”. Era seu diário de caça, e ele não tinha caçado nada.',
        'Em poucos meses o prédio tinha sumido, e vendeu bem. O empreiteiro Pierre-François Palloy esculpiu suas pedras em Bastilhas em miniatura e mandou uma para cada departamento da França, e Lafayette enviou a chave principal a George Washington, cuja casa em Mount Vernon ainda a exibe.'
      ]
    }
  ],

  '07-20': [
    {
      year: 1969,
      pin: true,
      title: 'Apollo 11 Lands on the Moon',
      title_pt: 'Apollo 11 Pousa na Lua',
      era: 'Contemporary',
      region: 'Sea of Tranquility', region_pt: 'Mar da Tranquilidade',
      tag: 'Exploration', tag_pt: 'Exploração',
      text: 'On 20 July 1969 the lunar module Eagle touched down in the Sea of Tranquility with Neil Armstrong and Buzz Aldrin aboard, and human beings stood on another world for the first time. The message that the Eagle had landed reached Houston with less than a minute of fuel margin left.',
      text_pt: 'Em 20 de julho de 1969, o módulo lunar Eagle pousou no Mar da Tranquilidade com Neil Armstrong e Buzz Aldrin a bordo, e seres humanos pisaram outro mundo pela primeira vez. O aviso de que a Eagle havia pousado chegou a Houston com menos de um minuto de combustível de reserva.',
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
      text: 'On 25 July 1909 Louis Blériot flew a fragile monoplane from the French coast to Dover in about thirty-seven minutes — the first crossing of the English Channel by a heavier-than-air machine. Britain had been an island in the military sense for a thousand years, and stopped being one that morning.',
      text_pt: 'Em 25 de julho de 1909, Louis Blériot voou um frágil monoplano da costa francesa até Dover em cerca de trinta e sete minutos — a primeira travessia do Canal da Mancha por uma máquina mais pesada que o ar. A Grã-Bretanha era uma ilha no sentido militar havia mil anos, e deixou de ser naquela manhã.',
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
      text: 'On 26 July 1956, in a speech in Alexandria, the Egyptian president Gamal Abdel Nasser announced that the Suez Canal Company was being nationalised, taking from Britain and France the waterway they had owned and run for eighty-seven years. Within months the two of them invaded alongside Israel, and were forced to withdraw.',
      text_pt: 'Em 26 de julho de 1956, num discurso em Alexandria, o presidente egípcio Gamal Abdel Nasser anunciou a nacionalização da Companhia do Canal de Suez, tirando de Reino Unido e França a via que os dois possuíam e operavam havia oitenta e sete anos. Em poucos meses ambos invadiram o país ao lado de Israel, e foram obrigados a recuar.',
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
      text: 'On 28 July 1914, one month after Archduke Franz Ferdinand was shot in Sarajevo, Austria-Hungary declared war on Serbia — meant as a punitive strike against a small neighbour. The alliance system did the rest: within a week Russia, Germany, France and Britain had all been pulled in, and a Balkan quarrel had become the First World War.',
      text_pt: 'Em 28 de julho de 1914, um mês depois de o arquiduque Francisco Ferdinando ser assassinado em Sarajevo, a Áustria-Hungria declarou guerra à Sérvia — pensada como punição pontual contra um vizinho pequeno. O sistema de alianças fez o resto: em uma semana, Rússia, Alemanha, França e Reino Unido haviam sido arrastados, e uma briga nos Bálcãs virara a Primeira Guerra Mundial.',
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
      text: 'On 29 July 1836 the Arc de Triomphe was inaugurated in Paris, thirty years after Napoleon ordered it built for his armies and fifteen years after his death. Louis-Philippe chose the date deliberately: it was the anniversary of the revolution that had made him king six years earlier, and he was dedicating his predecessor\'s monument on his own day.',
      text_pt: 'Em 29 de julho de 1836 o Arco do Triunfo foi inaugurado em Paris, trinta anos depois de Napoleão mandá-lo construir para seus exércitos e quinze anos depois da morte dele. Luís Filipe escolheu a data de propósito: era o aniversário da revolução que o fizera rei seis anos antes, e ele inaugurava o monumento do antecessor em seu próprio dia.',
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
      text: 'On 30 July 762 the caliph al-Mansur began building a new capital on the Tigris, laid out as a perfect circle — ringed walls, four gates, and at the exact centre his own palace and the great mosque. He named it Madinat as-Salam, the City of Peace, and set something like a hundred thousand workers on it. Within fifty years it was probably the largest city on earth.',
      text_pt: 'Em 30 de julho de 762 o califa al-Mansur começou a erguer uma nova capital às margens do Tigre, traçada como um círculo perfeito — muralhas circulares, quatro portões e, no centro exato, seu próprio palácio e a grande mesquita. Batizou-a Madinat as-Salam, a Cidade da Paz, e pôs nela cerca de cem mil trabalhadores. Em cinquenta anos era provavelmente a maior cidade do mundo.',
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
      text: 'On 31 July 1790 George Washington signed the first patent ever issued by the United States, and Thomas Jefferson, who had examined it himself, countersigned. The invention was not a machine but a chemical process: a better way to make potash from wood ash. Samuel Hopkins got fourteen years of monopoly on it, and the American patent system began.',
      text_pt: 'Em 31 de julho de 1790, George Washington assinou a primeira patente já concedida pelos Estados Unidos, e Thomas Jefferson, que a examinara pessoalmente, referendou. A invenção não era uma máquina, mas um processo químico: um jeito melhor de fazer potassa a partir de cinza de madeira. Samuel Hopkins ganhou catorze anos de monopólio sobre ela, e nascia o sistema americano de patentes.',
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
      text: 'On 1 August 1834 the Slavery Abolition Act came into force across most of the British Empire, and some 800,000 people stopped being property. Almost none of them were free that morning: everyone over the age of six was reclassified as an unpaid "apprentice", still bound to the same estate. The only people paid anything that day were the former owners.',
      text_pt: 'Em 1º de agosto de 1834, o Slavery Abolition Act entrou em vigor na maior parte do Império Britânico, e cerca de 800 mil pessoas deixaram de ser propriedade. Quase nenhuma delas estava livre naquela manhã: todos acima de seis anos foram reclassificados como "aprendizes" não remunerados, ainda presos à mesma propriedade. Os únicos que receberam alguma coisa naquele dia foram os antigos donos.',
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
      text: 'On 2 August 216 BCE, on a plain in Apulia, Hannibal surrounded and destroyed the largest army Rome had ever put in the field. He let his own centre buckle on purpose; as the legions pressed into the sagging line his veterans held the flanks and his cavalry closed the ring behind them. Between 50,000 and 70,000 Romans died in a single afternoon, packed too tightly to raise their swords. It is the most studied tactical victory ever won, and it did not win the war.',
      text_pt: 'Em 2 de agosto de 216 AEC, numa planície da Apúlia, Aníbal cercou e destruiu o maior exército que Roma já pusera em campo. Deixou o próprio centro ceder de propósito; enquanto as legiões avançavam sobre a linha que recuava, seus veteranos seguraram os flancos e sua cavalaria fechou o cerco por trás. Entre 50 mil e 70 mil romanos morreram numa única tarde, comprimidos demais para erguer a espada. É a vitória tática mais estudada da história, e não venceu a guerra.',
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
      text: 'On 2 August 1492 the deadline set by the Alhambra Decree ran out and the Jews of Spain had to be gone. Somewhere between 40,000 and 200,000 people left a country their families had lived in for more than a thousand years, forbidden to carry gold or silver out with them. Sultan Bayezid II sent the Ottoman navy to carry them east.',
      text_pt: 'Em 2 de agosto de 1492 esgotou-se o prazo fixado pelo Decreto de Alhambra, e os judeus da Espanha tinham de ter partido. Entre 40 mil e 200 mil pessoas deixaram um país onde suas famílias viviam havia mais de mil anos, proibidas de levar ouro ou prata consigo. O sultão Bayezid II enviou a marinha otomana para levá-las ao oriente.',
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
      text: 'On 3 August 1031, thirteen months after Norwegian farmers cut him down at Stiklestad, Olaf Haraldsson was dug out of a sandbank beside the river at Nidaros and declared a saint. The bishop who did it, Grimkell, was English. The country that had risen against Olaf and driven him from his throne now had a saint, and it would build itself around him.',
      text_pt: 'Em 3 de agosto de 1031, treze meses depois de camponeses noruegueses o abaterem em Stiklestad, Olaf Haraldsson foi desenterrado de um banco de areia à beira do rio, em Nidaros, e declarado santo. O bispo que o fez, Grimkell, era inglês. O país que se levantara contra Olaf e o expulsara do trono agora tinha um santo, e passaria a se construir em torno dele.',
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
      text: 'On 4 August 1854, four months after Perry\'s gunboats forced the end of two centuries of seclusion, the Japanese shogunate ordered that every Japanese ship fly a white banner with a red sun. Japan had never had a national flag, because a country closed to the world has nobody to identify itself to. The Hinomaru was born as an answer to strangers.',
      text_pt: 'Em 4 de agosto de 1854, quatro meses depois de os navios de guerra de Perry forçarem o fim de dois séculos de reclusão, o xogunato ordenou que todo navio japonês hasteasse um pano branco com um sol vermelho. O Japão nunca tivera bandeira nacional, porque um país fechado ao mundo não tem a quem se identificar. O Hinomaru nasceu como resposta a estranhos.',
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
      text: 'On 5 August 25 CE, sixteen years after Wang Mang seized the throne and abolished the Han, a distant imperial cousin named Liu Xiu declared himself emperor and took it back. He moved the capital east to Luoyang and reassembled a house that had been formally extinct — a restoration Chinese history almost never permitted. The Han would run another two centuries.',
      text_pt: 'Em 5 de agosto de 25 EC, dezesseis anos depois de Wang Mang tomar o trono e abolir os Han, um primo imperial distante chamado Liu Xiu declarou-se imperador e o retomou. Mudou a capital para leste, Luoyang, e reergueu uma casa formalmente extinta — uma restauração que a história chinesa quase nunca permitiu. Os Han durariam mais dois séculos.',
      facts: [
        'The Xin dynasty was undone in good part by hydrology. Around 11 CE the Yellow River burst its banks and changed course across the plain, drowning farmland and uprooting millions. The famine that followed raised the rebel armies — among them the Red Eyebrows, who painted their brows to tell friend from foe — that pulled Wang Mang down.',
        'Guangwu was a ninth-generation descendant of an emperor, which in a house with hundreds of concubines meant a provincial landowner with a famous surname. When a rival Han claimant had his elder brother executed, he survived by refusing to mourn in public, eating and drinking and apologising as though nothing had happened.',
        'The restored dynasty held until 220 CE, giving the Han some four centuries in all. Its name outlasted it by two thousand years: "Han" is still what the largest ethnic group on earth calls itself, around 1.4 billion people.'
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
      text: 'On 6 August 1806 Francis II declared the Holy Roman Empire dissolved, ending an institution that had existed in some form for a thousand years. Napoleon had demanded that he give up the imperial title; he did something stranger than surrender and abolished the office itself, releasing every prince, city and official from allegiance to it — and kept the Austrian throne he had invented for himself two years earlier.',
      text_pt: 'Em 6 de agosto de 1806, Francisco II declarou dissolvido o Sacro Império Romano-Germânico, encerrando uma instituição que existia de alguma forma havia mil anos. Napoleão exigira que ele abrisse mão do título imperial; ele fez algo mais estranho que se render e aboliu o próprio cargo, liberando cada príncipe, cidade e funcionário do juramento de fidelidade — e ficou com o trono austríaco que inventara para si dois anos antes.',
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
      text: 'On 7 August 461 the Western Roman emperor Majorian was beheaded beside the river Iria in north-west Italy, five days after his own commander-in-chief had stripped him of the purple. Ricimer, the Germanic general who actually ran the West, could not be emperor himself, so he appointed men who would not govern. Majorian governed: he recovered Gaul and Hispania, legislated against corruption, and built a fleet to take Africa back from the Vandals. The West had fifteen years left.',
      text_pt: 'Em 7 de agosto de 461, o imperador romano do Ocidente Majoriano foi decapitado à beira do rio Iria, no noroeste da Itália, cinco dias depois de seu próprio comandante-em-chefe lhe arrancar a púrpura. Ricimer, o general germânico que de fato comandava o Ocidente, não podia ser imperador, então nomeava homens que não governassem. Majoriano governou: retomou a Gália e a Hispânia, legislou contra a corrupção e construiu uma frota para tomar a África dos vândalos. Ao Ocidente restavam quinze anos.',
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
      text: 'On 8 August 1588 by the Gregorian calendar — 29 July by the Julian one the English still kept — the Spanish Armada was broken off Gravelines. At midnight eight blazing fireships had drifted into the fleet anchored off Calais and the Armada cut its cables and scattered; at dawn the English fell on the broken formation. Philip II\'s invasion of England was finished, though the Armada\'s real destruction came on the long road home.',
      text_pt: 'Em 8 de agosto de 1588 pelo calendário gregoriano — 29 de julho pelo juliano, que os ingleses ainda mantinham —, a Armada Espanhola foi desbaratada ao largo de Gravelines. À meia-noite, oito brulotes em chamas haviam descido sobre a frota ancorada em Calais, e a Armada cortou as amarras e se dispersou; ao amanhecer, os ingleses caíram sobre a formação desfeita. A invasão da Inglaterra planejada por Filipe II terminava ali, embora a destruição real da Armada só viesse no longo caminho de volta.',
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
      text: 'On 9 August 1945 the United States dropped a plutonium bomb on Nagasaki, three days after Hiroshima, killing about 35,000 people outright. The target that morning had been Kokura: Bockscar circled it for the better part of an hour while haze and smoke hid the aiming point, then ran short of fuel and turned to its secondary. Over Nagasaki the cloud broke for a moment, and the bomb fell some three kilometres off the intended mark, over the Urakami valley.',
      text_pt: 'Em 9 de agosto de 1945 os Estados Unidos lançaram uma bomba de plutônio sobre Nagasaki, três dias depois de Hiroshima, matando cerca de 35 mil pessoas na hora. O alvo daquela manhã era Kokura: o Bockscar a sobrevoou por quase uma hora enquanto a neblina e a fumaça escondiam o ponto de mira, depois ficou sem combustível e voltou-se para o alvo secundário. Sobre Nagasaki as nuvens se abriram por um instante, e a bomba caiu cerca de três quilômetros fora da marca pretendida, sobre o vale de Urakami.',
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
      text: 'On 10 August 1519 five ships left Seville for the Spice Islands under Ferdinand Magellan — a Portuguese commander his own king had refused and Portugal now called a traitor. Magellan would be killed in the Philippines; four of the ships would be wrecked, burned or deserted. Three years later one vessel came back up the Guadalquivir under Juan Sebastián Elcano, a Basque officer Magellan had once condemned for mutiny.',
      text_pt: 'Em 10 de agosto de 1519, cinco navios deixaram Sevilha rumo às Ilhas das Especiarias sob Fernão de Magalhães — um comandante português que seu próprio rei recusara e que Portugal agora chamava de traidor. Magalhães seria morto nas Filipinas; quatro dos navios naufragariam, seriam queimados ou desertariam. Três anos depois, uma embarcação subiu de volta o Guadalquivir sob Juan Sebastián Elcano, oficial basco que Magalhães um dia condenara por motim.',
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
      text: 'The Maya Long Count — a running tally of days that never resets — is calculated to begin on 11 August 3114 BCE, the day the current world was made. Mesoamerican peoples kept cyclical calendars that repeated every fifty-two years; the Maya added a count that ran straight, and writing it required a true positional zero, one of the very few times zero was invented anywhere on earth.',
      text_pt: 'A Conta Longa maia — uma contagem corrida de dias que nunca zera — é calculada como tendo início em 11 de agosto de 3114 AEC, o dia em que o mundo atual foi feito. Os povos mesoamericanos mantinham calendários cíclicos que se repetiam a cada cinquenta e dois anos; os maias acrescentaram uma contagem que seguia reto, e escrevê-la exigiu um zero posicional verdadeiro, uma das pouquíssimas vezes em que o zero foi inventado em toda a Terra.',
      facts: [
        'No Maya ever wrote "11 August 3114 BCE". That is a modern back-projection into a calendar which would not exist for another forty-six centuries; the Maya wrote 4 Ahau 8 Cumku. Scholars still disagree by two days about how to line the two systems up.',
        'There were no Maya in 3114 BCE, and no cities anywhere in Mesoamerica. Maya writing appears around 300 BCE. The count begins nearly three thousand years before the people who devised it — its day one is mythology, placed on purpose in deep time.',
        'The tally reached 13.0.0.0.0 on 21 December 2012, which the modern world read as a prophecy of the end. The Maya had not: their own inscriptions schedule events far beyond it, one at Palenque naming a date in 4772 CE. The odometer simply turned over.'
      ],
      facts_pt: [
        'Nenhum maia jamais escreveu "11 de agosto de 3114 AEC". Isso é uma retroprojeção moderna para um calendário que só existiria quarenta e seis séculos depois; os maias escreviam 4 Ahau 8 Cumku. E os estudiosos ainda divergem em dois dias sobre como alinhar os dois sistemas.',
        'Não havia maias em 3114 AEC, nem cidade alguma em toda a Mesoamérica. A escrita maia aparece por volta de 300 AEC A contagem começa quase três mil anos antes do povo que a concebeu — seu dia um é mitologia, posta de propósito em tempo profundo.',
        'A contagem chegou a 13.0.0.0.0 em 21 de dezembro de 2012, que o mundo moderno leu como profecia do fim. Os maias não: suas próprias inscrições marcam eventos muito além disso, uma delas em Palenque nomeando uma data em 4772 EC O hodômetro apenas virou.'
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
      text: 'On 12 August 1099, four weeks after Jerusalem fell, the crusaders met the Egyptian army that had come to retake it and destroyed it outside Ascalon. The Fatimid force was caught at dawn, broke, and its commander fled by ship. It was the last battle of the First Crusade, and within weeks most of the victorious army had sailed home, their vow discharged.',
      text_pt: 'Em 12 de agosto de 1099, quatro semanas depois da queda de Jerusalém, os cruzados encontraram o exército egípcio que viera retomá-la e o destruíram diante de Ascalão. A força fatímida foi surpreendida ao amanhecer, desfez-se, e seu comandante fugiu de navio. Foi a última batalha da Primeira Cruzada e, em poucas semanas, a maior parte do exército vitorioso navegou de volta para casa, cumprido o voto.',
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
      text: 'On 13 August 29 BCE Octavian began three consecutive days of triumph through Rome — first for the Dalmatian campaigns, then for Actium, then for Egypt. He was thirty-four, and the last man standing after a century of civil war. Two years later the Senate would hand him the name Augustus.',
      text_pt: 'Em 13 de agosto de 29 AEC, Otaviano iniciou três dias consecutivos de triunfo por Roma — primeiro pelas campanhas da Dalmácia, depois por Áccio, depois pelo Egito. Tinha trinta e quatro anos e era o último homem de pé depois de um século de guerra civil. Dois anos mais tarde o Senado lhe entregaria o nome de Augusto.',
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
      text: 'On 13 August 1415 Henry V put his army ashore at the mouth of the Seine and reopened the English claim to the French crown. Harfleur fell after five weeks; Agincourt came in October. By 1420 he had been named heir to France and had married the French king\'s daughter. He died of dysentery in August 1422, two months before the mad king whose throne he had been promised.',
      text_pt: 'Em 13 de agosto de 1415, Henrique V desembarcou seu exército na foz do Sena e reabriu a reivindicação inglesa ao trono francês. Harfleur caiu em cinco semanas; Azincourt veio em outubro. Em 1420 ele já fora nomeado herdeiro da França e casara com a filha do rei francês. Morreu de disenteria em agosto de 1422, dois meses antes do rei louco cujo trono lhe havia sido prometido.',
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
      text: 'On 13 August 1792, three days after the crowd stormed the Tuileries and the Assembly stripped him of his functions, Louis XVI was taken with his family to the Temple — a fortified keep raised centuries earlier by the Knights Templar — and became a prisoner. He would leave it twice: once for his trial, and once for the scaffold.',
      text_pt: 'Em 13 de agosto de 1792, três dias depois de a multidão invadir as Tulherias e a Assembleia suspendê-lo de suas funções, Luís XVI foi levado com a família para o Temple — uma torre fortificada erguida séculos antes pelos Cavaleiros Templários — e tornou-se prisioneiro. Sairia de lá duas vezes: uma para o julgamento e outra para o cadafalso.',
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
      text: 'Tradition places on the night of 14 August 1791, in the woods at Bois Caïman, the Vodou ceremony at which enslaved people in Saint-Domingue swore to rise, led by the houngan Dutty Boukman. Within days the plantations of the northern plain were burning. Thirteen years later they had beaten Spain, Britain and Napoleon, and founded Haiti — the only nation in history created by an uprising of the enslaved.',
      text_pt: 'A tradição situa na noite de 14 de agosto de 1791, na mata de Bois Caïman, a cerimônia vodu em que pessoas escravizadas de Saint-Domingue juraram se levantar, conduzida pelo houngan Dutty Boukman. Em poucos dias as plantações da planície norte ardiam. Treze anos depois haviam derrotado Espanha, Grã-Bretanha e Napoleão, e fundado o Haiti — a única nação da história criada por uma insurreição de escravizados.',
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
      text: 'On 15 August 1261 Michael VIII entered Constantinople on foot through the Golden Gate behind an icon of the Virgin and was crowned in Hagia Sophia, fifty-seven years after the Fourth Crusade had taken the city from fellow Christians. The empire he restored would last another 192 years and never again be strong.',
      text_pt: 'Em 15 de agosto de 1261, Miguel VIII entrou em Constantinopla a pé pela Porta Dourada, atrás de um ícone da Virgem, e foi coroado em Santa Sofia, cinquenta e sete anos depois de a Quarta Cruzada tomar a cidade de outros cristãos. O império que ele restaurou duraria mais 192 anos e nunca mais seria forte.',
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
      text: 'On 15 August 1281 a typhoon destroyed the fleet Kublai Khan had sent against Japan — perhaps 140,000 men and 4,400 ships, the largest seaborne invasion anywhere until the twentieth century. They had not been able to get ashore, and the storm found them still riding at anchor. The Japanese called it kamikaze, the divine wind.',
      text_pt: 'Em 15 de agosto de 1281, um tufão destruiu a frota que Kublai Khan enviara contra o Japão — talvez 140 mil homens e 4.400 navios, a maior invasão marítima em qualquer lugar até o século XX. Eles não haviam conseguido desembarcar, e a tempestade os encontrou ainda fundeados. Os japoneses chamaram aquilo de kamikaze, o vento divino.',
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
      text: 'On 16 August 1550 Rabbi Moses Isserles of Kraków ruled in a dispute between two Christian printing houses in Venice that had both published Maimonides\' great code of Jewish law — the second having copied the annotations the first had paid a rabbi to write. He found for the annotator and forbade Jews to buy the rival edition. It is among the earliest copyright judgments anywhere, 160 years before England wrote such a law.',
      text_pt: 'Em 16 de agosto de 1550, o rabino Moisés Isserles, de Cracóvia, decidiu uma disputa entre duas tipografias cristãs de Veneza que haviam publicado o mesmo grande código de lei judaica de Maimônides — tendo a segunda copiado as anotações que a primeira pagara a um rabino para escrever. Decidiu a favor do anotador e proibiu os judeus de comprar a edição rival. É uma das primeiras decisões de direito autoral de que se tem notícia, 160 anos antes de a Inglaterra escrever uma lei assim.',
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
      text: 'On 16 August 1869, at Acosta Ñu, a Paraguayan force of some 3,500 — a large part of them boys — was destroyed by roughly 20,000 Brazilian troops. By that point in the war Paraguay had almost no adult men left to conscript, and survivors described children with beards drawn on their faces. Paraguay now keeps 16 August as its Children\'s Day.',
      text_pt: 'Em 16 de agosto de 1869, em Acosta Ñu, uma força paraguaia de cerca de 3.500 — boa parte dela de meninos — foi destruída por cerca de 20 mil soldados brasileiros. Àquela altura da guerra o Paraguai já quase não tinha homens adultos para recrutar, e sobreviventes descreveram crianças com barbas desenhadas no rosto. O Paraguai mantém hoje o 16 de agosto como seu Dia da Criança.',
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
      text: 'On 16 August 1870, at Mars-la-Tour in Lorraine, a Prussian corps blundered into the entire French Army of the Rhine and, badly outnumbered, held the road anyway. To buy time General von Bredow rode his cavalry brigade straight at the French guns and took them, losing about half his men. Bazaine fell back on Metz and was trapped there, and France lost the war in the field that day.',
      text_pt: 'Em 16 de agosto de 1870, em Mars-la-Tour, na Lorena, um corpo prussiano topou por acidente com todo o Exército francês do Reno e, em enorme inferioridade numérica, segurou a estrada assim mesmo. Para ganhar tempo, o general von Bredow lançou sua brigada de cavalaria direto contra os canhões franceses e os tomou, perdendo cerca de metade dos seus homens. Bazaine recuou para Metz e ficou preso lá, e a França perdeu a guerra em campo naquele dia.',
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
      text: 'On 17 August 1560 the Scottish Parliament adopted a new confession of faith, written in four days by six men all named John, and within a week had abolished the pope\'s authority in Scotland and made saying Mass a crime. The parliament had been summoned without royal warrant. The queen was seventeen, Catholic, and in France, and she never ratified any of it.',
      text_pt: 'Em 17 de agosto de 1560, o Parlamento escocês adotou uma nova confissão de fé, escrita em quatro dias por seis homens todos chamados John, e em uma semana havia abolido a autoridade do papa na Escócia e transformado a celebração da missa em crime. O parlamento fora convocado sem autorização régia. A rainha tinha dezessete anos, era católica e estava na França, e nunca ratificou nada disso.',
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
      text: 'On the evening of 18 August 1783 a fireball crossed the whole length of Britain — first seen over Shetland, running south down the east coast and out over the Channel — bright enough to light the ground, and visible for the better part of half a minute. A party on the north terrace at Windsor Castle watched it pass. One of them wrote it up for the Royal Society; another painted it.',
      text_pt: 'Na noite de 18 de agosto de 1783, uma bola de fogo cruzou a Grã-Bretanha de ponta a ponta — avistada primeiro sobre as Shetland, descendo pela costa leste e saindo sobre o Canal — brilhante o bastante para iluminar o chão, e visível por quase meio minuto. Um grupo no terraço norte do Castelo de Windsor a viu passar. Um deles escreveu o relato para a Royal Society; outro a pintou.',
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
      text: 'On 19 August 797 the Byzantine emperor Constantine VI was seized by his mother\'s supporters and blinded, and Irene took the throne herself. He had spent seven years trying to rule out from under her and had ruined himself doing it: to marry his mistress he put his wife aside, and the church and the monasteries turned against him. They took him in the Porphyra, the purple chamber of the Great Palace, and he is thought to have died of the wounds.',
      text_pt: 'Em 19 de agosto de 797, o imperador bizantino Constantino VI foi rendido por partidários da mãe e cegado, e Irene assumiu ela própria o trono. Ele passara sete anos tentando governar por fora dela e se arruinara no processo: para casar com a amante, repudiou a esposa, e a igreja e os mosteiros se voltaram contra ele. Renderam-no na Porfira, a câmara púrpura do Grande Palácio, e acredita-se que tenha morrido dos ferimentos.',
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
      text: 'On 20 August 917, on the Black Sea coast, Simeon of Bulgaria destroyed one of the largest armies Byzantium had assembled in generations. The collapse began with a rumour that the Byzantine commander had been killed: the line broke, and the killing went on down the shore. It was among the bloodiest days of the medieval centuries and the worst Byzantine defeat in living memory.',
      text_pt: 'Em 20 de agosto de 917, na costa do Mar Negro, Simeão da Bulgária destruiu um dos maiores exércitos que Bizâncio reunira em gerações. O colapso começou com um boato de que o comandante bizantino fora morto: a linha se rompeu, e a matança seguiu costa abaixo. Foi um dos dias mais sangrentos dos séculos medievais e a pior derrota bizantina em memória viva.',
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
      text: 'On 21 August 1778 British troops opened the siege of Pondichéry, a French trading town on the Coromandel coast of India, eight thousand miles from Boston and six months after France had joined the American rebels. What had begun as a quarrel over colonial taxation was now being fought in the Channel, the Caribbean, West Africa and the Bay of Bengal.',
      text_pt: 'Em 21 de agosto de 1778, tropas britânicas abriram o cerco a Pondicherry, feitoria francesa na costa de Coromandel, na Índia, a treze mil quilômetros de Boston e seis meses depois de a França aderir aos rebeldes americanos. O que começara como uma briga por impostos coloniais agora era travado no Canal da Mancha, no Caribe, na África Ocidental e na Baía de Bengala.',
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
      text: 'On 22 August 1942 Brazil declared war on Germany, Japan and Italy. German submarines had sunk five Brazilian ships in three days off the north-east coast, drowning some six hundred people, most of them civilians, and the streets had filled. The man signing the declaration, Getúlio Vargas, ran an authoritarian state built partly on the fascist model.',
      text_pt: 'Em 22 de agosto de 1942 o Brasil declarou guerra à Alemanha, ao Japão e à Itália. Submarinos alemães haviam afundado cinco navios brasileiros em três dias na costa nordeste, matando cerca de seiscentas pessoas, a maioria civis, e as ruas se encheram. O homem que assinava a declaração, Getúlio Vargas, comandava um Estado autoritário erguido em parte sobre o modelo fascista.',
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
      text: 'Tradition puts on 23 August 79 CE — the feast of Vulcan, god of fire — the first tremors before Vesuvius erupted and buried Pompeii and Herculaneum under metres of ash. It is a very tidy story, and the physical evidence coming out of Pompeii keeps pointing somewhere else: to an autumn eruption, two months later than everyone has said for four hundred years.',
      text_pt: 'A tradição põe em 23 de agosto de 79 EC — a festa de Vulcano, deus do fogo — os primeiros tremores antes de o Vesúvio entrar em erupção e soterrar Pompeia e Herculano sob metros de cinza. É uma história muito bem-arrumada, e as evidências físicas que saem de Pompeia insistem em apontar para outro lugar: uma erupção de outono, dois meses depois do que todo mundo diz há quatrocentos anos.',
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
      text: 'On 24 August 1215, ten weeks after King John sealed it at Runnymede, Pope Innocent III declared Magna Carta void and forbade anyone to observe it. The barons went to war, and the charter had to be offered again — and again, and again — as the price of peace. That is how it survived: not because it was honoured in 1215, but because it kept being reissued after it had failed.',
      text_pt: 'Em 24 de agosto de 1215, dez semanas depois de o rei João a selar em Runnymede, o papa Inocêncio III declarou a Magna Carta nula e proibiu que alguém a observasse. Os barões foram à guerra, e a carta teve de ser oferecida de novo — e de novo, e de novo — como preço da paz. Foi assim que sobreviveu: não porque tenha sido cumprida em 1215, mas porque continuou sendo reeditada depois de fracassar.',
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
      text: 'On 25 August 1609 Galileo demonstrated his telescope to the Venetian senate from the bell tower of St Mark\'s, showing them ships that were still two hours from harbour. He pitched the instrument as what it plainly was to a maritime republic: a way to see an approaching fleet before it could see you. They doubled his salary and made his chair at Padua permanent.',
      text_pt: 'Em 25 de agosto de 1609, Galileu demonstrou seu telescópio ao senado veneziano do alto do campanário de São Marcos, mostrando navios que ainda estavam a duas horas do porto. Vendeu o instrumento pelo que ele evidentemente era para uma república marítima: um jeito de ver uma frota se aproximando antes que ela o visse. Dobraram seu salário e tornaram vitalícia sua cátedra em Pádua.',
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
      text: 'On 26 August 1071, at Manzikert in Armenia, the Seljuk sultan Alp Arslan defeated the Byzantine army and captured the emperor Romanos IV — then received him courteously and let him go. The defeat itself was survivable. What followed was not: Constantinople deposed him, blinded him so badly that he died of it, and spent ten years in civil war while Turkish groups settled the countryside nobody was defending.',
      text_pt: 'Em 26 de agosto de 1071, em Manziquerta, na Armênia, o sultão seljúcida Alp Arslan derrotou o exército bizantino e capturou o imperador Romano IV — depois o recebeu com cortesia e o deixou partir. A derrota em si era sobrevivível. O que veio depois não era: Constantinopla o depôs, o cegou de forma tão brutal que ele morreu disso, e passou dez anos em guerra civil enquanto grupos turcos se instalavam no campo que ninguém defendia.',
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
      text: 'On 27 August 410 the Visigoths left Rome after three days of sacking it, and the city was still standing. Alaric was a Christian and had ordered the basilicas of St Peter and St Paul kept as sanctuary; thousands sheltered inside them. By the standards Rome itself had used on Carthage and Corinth this was mild. It still broke the world: no foreign enemy had entered the city in eight hundred years.',
      text_pt: 'Em 27 de agosto de 410, os visigodos deixaram Roma depois de três dias de saque, e a cidade continuava de pé. Alarico era cristão e ordenara que as basílicas de São Pedro e São Paulo fossem preservadas como refúgio; milhares se abrigaram nelas. Pelos critérios que a própria Roma aplicara a Cartago e Corinto, aquilo foi brando. Ainda assim, quebrou o mundo: nenhum inimigo estrangeiro entrava na cidade havia oitocentos anos.',
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
      text: 'On 28 August 632 Fatimah, the daughter of Muhammad and the wife of Ali, died at Medina within months of her father. She asked to be buried at night and quietly, and the place was never marked. Where exactly she lies is unknown, and why she wanted it that way is one of the oldest disagreements in Islam.',
      text_pt: 'Em 28 de agosto de 632, Fátima, filha de Maomé e esposa de Ali, morreu em Medina poucos meses depois do pai. Pediu para ser enterrada à noite e em silêncio, e o lugar nunca foi marcado. Onde exatamente ela jaz é desconhecido, e por que ela quis assim é uma das divergências mais antigas do Islã.',
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
      text: 'On 29 August 1756 Frederick the Great marched into Saxony, opening the Seven Years\' War in Europe. Saxony had not attacked Prussia and was not at war with anyone; he went in reasoning that a coalition was forming against him and that he would rather start the fight than receive it. He was right that the coalition existed. Invading first is what turned it into a real one.',
      text_pt: 'Em 29 de agosto de 1756, Frederico, o Grande, entrou na Saxônia, abrindo a Guerra dos Sete Anos na Europa. A Saxônia não havia atacado a Prússia e não estava em guerra com ninguém; ele entrou pelo raciocínio de que uma coalizão se formava contra ele e de que era melhor começar a briga do que recebê-la. Estava certo quanto à existência da coalizão. Invadir primeiro é o que a transformou numa coalizão de verdade.',
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
      text: 'On 30 August 70 CE the Temple in Jerusalem burned, during the Roman siege under Titus. By Jewish reckoning it fell on the ninth of Av — the same day of the same month on which the Babylonians had destroyed the First Temple some six and a half centuries earlier. That date became the fixed fast of Jewish grief, and later catastrophes were gathered onto it, the expulsion from Spain in 1492 among them.',
      text_pt: 'Em 30 de agosto de 70 EC o Templo de Jerusalém ardeu, durante o cerco romano comandado por Tito. Pela contagem judaica, caiu no nono dia de Av — o mesmo dia do mesmo mês em que os babilônios haviam destruído o Primeiro Templo, uns seis séculos e meio antes. Essa data virou o jejum fixo do luto judaico, e catástrofes posteriores foram reunidas nela, entre elas a expulsão da Espanha em 1492.',
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
      text: 'On 31 August 2016 the Brazilian Senate voted 61 to 20 to remove Dilma Rousseff, the first woman to hold the presidency, over budget manoeuvres carried out without congressional authorisation. It then voted separately on whether to strip her of the right to hold office, and that motion failed. Her vice-president was sworn in the same day.',
      text_pt: 'Em 31 de agosto de 2016, o Senado brasileiro votou 61 a 20 pela destituição de Dilma Rousseff, primeira mulher a ocupar a presidência, por manobras orçamentárias feitas sem autorização do Congresso. Em seguida votou separadamente se lhe retirava o direito de exercer cargo público, e essa moção não passou. Seu vice tomou posse no mesmo dia.',
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
      text: 'On 1 September 1449, at Tumu in northern China, a Mongol force under Esen captured the Zhengtong Emperor of the Ming and destroyed the enormous army he had been talked into leading in person. It should have been the greatest bargaining chip of the century. It turned out to be worth nothing at all.',
      text_pt: 'Em 1º de setembro de 1449, em Tumu, no norte da China, uma força mongol sob Esen capturou o imperador Zhengtong, dos Ming, e destruiu o enorme exército que ele fora convencido a comandar pessoalmente. Deveria ter sido a maior moeda de troca do século. Não valeu absolutamente nada.',
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
      text: 'On 2 September 31 BCE, off the western coast of Greece, Octavian\'s fleet under Agrippa destroyed the forces of Mark Antony and Cleopatra, and the Roman world was left with one master. It was barely a battle: disease and desertion had emptied Antony\'s rowing benches and Agrippa had him blockaded, so what happened was mostly an attempt to break out. Cleopatra\'s squadron got through the middle and ran for Egypt, Antony followed her, and most of what remained surrendered.',
      text_pt: 'Em 2 de setembro de 31 AEC, ao largo da costa ocidental da Grécia, a frota de Otaviano sob o comando de Agripa destruiu as forças de Marco Antônio e Cleópatra, e o mundo romano ficou com um só senhor. Mal foi uma batalha: doença e deserção haviam esvaziado os bancos de remo de Antônio e Agripa o mantinha bloqueado, de modo que o que houve foi sobretudo uma tentativa de escapar. O esquadrão de Cleópatra rompeu pelo meio e correu para o Egito, Antônio a seguiu, e quase tudo o que restou se rendeu.',
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
      text: 'On 2 September 1192 Richard I and Saladin signed the Treaty of Jaffa, ending the Third Crusade. Jerusalem stayed in Muslim hands and was opened to Christian pilgrims; the crusaders kept the coast. Richard sailed home a month later having never entered the city he had come for, and he and Saladin had fought each other for three years without once meeting.',
      text_pt: 'Em 2 de setembro de 1192, Ricardo I e Saladino assinaram o Tratado de Jafa, encerrando a Terceira Cruzada. Jerusalém permaneceu em mãos muçulmanas e foi aberta aos peregrinos cristãos; os cruzados ficaram com a costa. Ricardo partiu um mês depois sem jamais ter entrado na cidade por que viera, e ele e Saladino haviam lutado três anos um contra o outro sem nunca se encontrar.',
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
      text: 'On 3 September 1260, at a spring in the Jezreel valley in Palestine, the Mamluk army of Egypt met a Mongol force and broke it. The Mongols had taken Baghdad two years earlier and had not lost a serious battle in living memory. It was the first defeat they could not shrug off, and the western edge of their empire stopped there for good.',
      text_pt: 'Em 3 de setembro de 1260, junto a uma fonte no vale de Jezreel, na Palestina, o exército mameluco do Egito encontrou uma força mongol e a quebrou. Os mongóis haviam tomado Bagdá dois anos antes e não perdiam uma batalha séria em memória viva. Foi a primeira derrota que não conseguiram ignorar, e a borda ocidental do império deles parou ali para sempre.',
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
      text: 'On 4 September 476 Odoacer deposed Romulus Augustulus, the last emperor in the Roman West, and did not replace him — the date conventionally taken as the end of the Western Roman Empire. He sent the imperial regalia to Constantinople and asked to govern Italy as a patrician under the emperor in the East, presenting the whole thing not as an ending but as a tidying up. One empire, one emperor, and he would run Italy on its behalf.',
      text_pt: 'Em 4 de setembro de 476, Odoacro depôs Rômulo Augústulo, o último imperador do Ocidente romano, e não o substituiu — data convencionalmente tomada como o fim do Império Romano do Ocidente. Mandou as insígnias imperiais a Constantinopla e pediu para governar a Itália como patrício sob o imperador do Oriente, apresentando aquilo não como um fim, mas como uma arrumação. Um império, um imperador, e ele tocaria a Itália em nome dele.',
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
      text: 'On 5 September 1698 Peter the Great imposed a tax on beards across Russia — a hundred roubles a year for a nobleman who wanted to keep his face. He had been away for a year and a half, travelling Europe under a false name and working in Dutch and English shipyards, and he came home, called his nobles in, and started cutting their beards off himself.',
      text_pt: 'Em 5 de setembro de 1698, Pedro, o Grande, impôs um imposto sobre barbas em toda a Rússia — cem rublos por ano para o nobre que quisesse manter o rosto. Ele passara um ano e meio fora, viajando pela Europa sob nome falso e trabalhando em estaleiros holandeses e ingleses, e voltou, convocou seus nobres e começou a cortar as barbas deles com as próprias mãos.',
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
      text: 'On 6 September 2026, under a canopy open on all four sides, Daniel and Carina were married before God in a Jewish ceremony. Everything in the rite is old — the contract read aloud, the seven blessings, the glass broken underfoot — and all of it exists to say one thing: that two people are building a house, and that the house begins today.',
      text_pt: 'Em 6 de setembro de 2026, sob um dossel aberto dos quatro lados, Daniel e Carina se casaram perante Deus numa cerimônia judaica. Tudo no rito é antigo — o contrato lido em voz alta, as sete bênçãos, o copo partido sob o pé — e tudo existe para dizer uma coisa: que duas pessoas estão erguendo uma casa, e que a casa começa hoje.',
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
      text: 'On 7 September 1822, on the bank of the Ipiranga brook outside São Paulo, Dom Pedro declared Brazil independent of Portugal — the country he was governing cut loose from his own father\'s kingdom. Brazil became the only large state in the Americas to leave Europe and keep a monarchy, and the only one to come out of it in one piece.',
      text_pt: 'Em 7 de setembro de 1822, à margem do riacho Ipiranga, nos arredores de São Paulo, Dom Pedro declarou o Brasil independente de Portugal — o país que ele governava separado do reino do próprio pai. O Brasil se tornou o único grande Estado das Américas a deixar a Europa mantendo uma monarquia, e o único a sair disso inteiro.',
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
      text: 'On 8 September 1264 Bolesław the Pious, Duke of Greater Poland, issued the Statute of Kalisz: thirty-six articles setting out what Jews in his lands could expect. Their own courts for their own disputes, the duke rather than the town as their protector, penalties for damaging a synagogue or a cemetery, and a duty on Christian neighbours to come out when a Jewish house was attacked at night. Western Europe in those same decades was drafting badges and expulsions.',
      text_pt: 'Em 8 de setembro de 1264, Bolesław, o Piedoso, duque da Grande Polônia, promulgou o Estatuto de Kalisz: trinta e seis artigos estabelecendo o que os judeus de suas terras podiam esperar. Tribunais próprios para suas próprias disputas, o duque e não a cidade como protetor, penas por danificar uma sinagoga ou um cemitério, e o dever de os vizinhos cristãos acudirem quando uma casa judaica fosse atacada à noite. A Europa Ocidental, nessas mesmas décadas, redigia distintivos e expulsões.',
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
      text: 'On 9 September 337 the three surviving sons of Constantine were proclaimed Augusti together and divided the Roman Empire between them. Their father had been dead for three and a half months, and in that gap the dynasty had been cut down to the three of them and almost nobody else. The arrangement lasted three years before they began killing each other.',
      text_pt: 'Em 9 de setembro de 337, os três filhos sobreviventes de Constantino foram proclamados Augustos em conjunto e dividiram o Império Romano entre si. O pai estava morto havia três meses e meio, e nesse intervalo a dinastia fora podada até sobrarem os três e quase mais ninguém. O arranjo durou três anos, até começarem a se matar.',
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
      text: 'On 10 September 1509 an earthquake in the Sea of Marmara brought down houses, minarets and stretches of the sea wall of Constantinople, and the water came over what was left. Istanbul called it Küçük Kıyamet, the Lesser Judgment Day, and the name stuck, because for a month and a half nobody could be sure it was over.',
      text_pt: 'Em 10 de setembro de 1509, um terremoto no mar de Mármara derrubou casas, minaretes e trechos da muralha marítima de Constantinopla, e a água passou por cima do que sobrou. Istambul o chamou de Küçük Kıyamet, o Pequeno Juízo Final, e o nome pegou, porque por um mês e meio ninguém tinha certeza de que havia acabado.',
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
      text: 'On 11 September 2001 nineteen men hijacked four American airliners. Two were flown into the towers of the World Trade Center, one into the Pentagon, and one came down in a field in Pennsylvania. Two thousand nine hundred and seventy-seven people were killed, citizens of more than ninety countries. It is the deadliest terrorist attack ever carried out.',
      text_pt: 'Em 11 de setembro de 2001, dezenove homens sequestraram quatro aviões de carreira americanos. Dois foram lançados contra as torres do World Trade Center, um contra o Pentágono, e um caiu num campo na Pensilvânia. Morreram duas mil novecentas e setenta e sete pessoas, cidadãs de mais de noventa países. É o atentado terrorista mais letal já cometido.',
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
      text: 'The Battle of Marathon is conventionally dated to 12 September 490 BCE, that reckoning being a modern reconstruction from the Greek lunar calendars. The Athenians and a small contingent from Plataea met the first Persian invasion on the plain and broke it; Herodotus counts one hundred and ninety-two Athenian dead against six thousand four hundred Persians. The race named after the battle commemorates something that, as it is usually told, did not take place.',
      text_pt: 'A Batalha de Maratona é convencionalmente datada de 12 de setembro de 490 AEC, cálculo que é uma reconstrução moderna a partir dos calendários lunares gregos. Os atenienses e um pequeno contingente de Plateia enfrentaram a primeira invasão persa na planície e a quebraram; Heródoto conta cento e noventa e dois mortos atenienses contra seis mil e quatrocentos persas. A corrida que leva o nome da batalha comemora algo que, do modo como costuma ser contado, não aconteceu.',
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
      text: 'On 13 September 509 BCE, the ides of the month, the consuls of the first year of the Roman Republic dedicated the temple of Jupiter Best and Greatest on the Capitoline hill. It was the largest temple in Rome, vowed by one king and built by another, and the men consecrating it had just thrown the second king out. They were finishing the monarchy\'s building.',
      text_pt: 'Em 13 de setembro de 509 AEC, nos idos do mês, os cônsules do primeiro ano da República Romana dedicaram o templo de Júpiter Ótimo Máximo, no monte Capitolino. Era o maior templo de Roma, prometido por um rei e construído por outro, e os homens que o consagravam acabavam de expulsar o segundo rei. Estavam terminando o edifício da monarquia.',
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
      text: 'On 15 September 1440 the Bishop of Nantes had Gilles de Rais arrested, and the case that followed became the earliest well-documented account of a serial murderer. He had relieved Orléans alongside Joan of Arc, carried the holy ampulla at the king\'s coronation, and been made a Marshal of France at twenty-five. Eleven years later he was in custody.',
      text_pt: 'Em 15 de setembro de 1440, o bispo de Nantes mandou prender Gilles de Rais, e o processo que se seguiu tornou-se o primeiro relato bem documentado de um assassino em série. Ele libertara Orléans ao lado de Joana d\'Arc, carregara a santa ampola na coroação do rei e fora feito marechal da França aos vinte e cinco anos. Onze anos depois estava preso.',
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
      text: 'On 16 September 1620 the Mayflower left Plymouth with a hundred and two passengers, bound for the northern edge of the Virginia colony. Sixty-six days later she was off Cape Cod, hundreds of miles north of anywhere her passengers had permission to be, with winter coming and no legal authority over anyone aboard.',
      text_pt: 'Em 16 de setembro de 1620, o Mayflower deixou Plymouth com cento e dois passageiros, rumo à borda norte da colônia da Virgínia. Sessenta e seis dias depois estava diante do cabo Cod, centenas de quilômetros ao norte de qualquer lugar onde seus passageiros tivessem permissão de estar, com o inverno chegando e sem autoridade legal alguma sobre quem estava a bordo.',
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
      text: 'On 17 September 14 CE, a month after Augustus died, the Roman Senate voted that he was a god. It was not a metaphor and not a formality: there were priests, a temple, a cult and a state calendar of his festivals. The man who had spent fifty years insisting he was merely the first citizen was legislated into a deity by the body he had always deferred to.',
      text_pt: 'Em 17 de setembro de 14 EC, um mês depois da morte de Augusto, o Senado romano votou que ele era um deus. Não era metáfora nem formalidade: houve sacerdotes, templo, culto e um calendário estatal de festas em sua honra. O homem que passara cinquenta anos insistindo em ser apenas o primeiro cidadão foi transformado em divindade por decreto do corpo a que sempre fingira obedecer.',
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
      text: 'On 18 September 1850 the United States Congress passed the Fugitive Slave Act, obliging citizens of the free states to help capture people who had escaped from the slave states and denying the accused a jury and the right to speak in their own defence. The federal commissioner who decided each case was paid ten dollars for a ruling that the person before him was property, and five for a ruling that they were not.',
      text_pt: 'Em 18 de setembro de 1850, o Congresso dos Estados Unidos aprovou a Lei do Escravo Fugitivo, obrigando os cidadãos dos estados livres a ajudar na captura de pessoas que haviam fugido dos estados escravistas e negando ao acusado júri e direito de falar em sua própria defesa. O comissário federal que decidia cada caso recebia dez dólares por uma decisão de que a pessoa diante dele era propriedade, e cinco por uma decisão de que não era.',
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
      text: 'On 19 September 634 the Arab army took Damascus from the Byzantine Empire, and took it twice on the same day. Khalid ibn al-Walid stormed one gate by force while, at a gate on the other side of the city, a second commander was accepting its peaceful surrender; the two columns met in the middle. Whether the city had been taken or had given itself up decided what could lawfully be done to it.',
      text_pt: 'Em 19 de setembro de 634, o exército árabe tomou Damasco do Império Bizantino, e a tomou duas vezes no mesmo dia. Khalid ibn al-Walid assaltou um dos portões à força enquanto, num portão do outro lado da cidade, um segundo comandante aceitava sua rendição pacífica; as duas colunas se encontraram no meio. Se a cidade fora tomada ou se entregara decidia o que licitamente se podia fazer com ela.',
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
      text: 'On 20 September 1519 Magellan\'s fleet finally put to sea from Sanlúcar de Barrameda — five ships and about two hundred and seventy men, provisioned for two years, sailing for a strait that nobody had proved existed. They had come down the Guadalquivir from Seville five weeks earlier and had been sitting at the river mouth taking on stores.',
      text_pt: 'Em 20 de setembro de 1519, a frota de Magalhães enfim fez-se ao mar a partir de Sanlúcar de Barrameda — cinco navios e cerca de duzentos e setenta homens, abastecidos para dois anos, rumo a um estreito que ninguém provara existir. Haviam descido o Guadalquivir desde Sevilha cinco semanas antes e estavam parados na foz embarcando mantimentos.',
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
      text: 'On 21 September 1937 The Hobbit was published, in a first printing of fifteen hundred copies. It had begun years earlier when a professor of Anglo-Saxon, marking school examinations, turned a page, found it empty, and wrote on it that in a hole in the ground there lived a hobbit. He had no idea what a hobbit was and spent years finding out.',
      text_pt: 'Em 21 de setembro de 1937, O Hobbit foi publicado, numa primeira tiragem de mil e quinhentos exemplares. Tudo começara anos antes, quando um professor de anglo-saxão, corrigindo provas escolares, virou uma folha, encontrou-a em branco e escreveu nela que num buraco no chão vivia um hobbit. Não fazia ideia do que era um hobbit e levou anos descobrindo.',
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
      text: 'On 22 September 1692 eight people were hanged at Salem, and nobody else ever was. Three days earlier Giles Corey had been pressed to death under stones for refusing to enter a plea at all. Within weeks the court that had condemned them was dissolved and the remaining prisoners were acquitted almost to a person.',
      text_pt: 'Em 22 de setembro de 1692, oito pessoas foram enforcadas em Salem, e nunca mais ninguém o foi. Três dias antes, Giles Corey fora esmagado até a morte sob pedras por se recusar a sequer apresentar defesa. Em poucas semanas o tribunal que os condenara foi dissolvido e os prisioneiros restantes foram absolvidos quase sem exceção.',
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
      text: 'On 23 September 1950, on Hill 282 in Korea, American aircraft napalmed a British battalion that had taken the hill at dawn and was holding it under counterattack. The Argylls had called for air support and laid out their recognition panels. The Mustangs came in and put the napalm on the panels.',
      text_pt: 'Em 23 de setembro de 1950, na Colina 282, na Coreia, aviões americanos despejaram napalm sobre um batalhão britânico que tomara a colina ao amanhecer e a segurava sob contra-ataque. Os Argylls haviam pedido apoio aéreo e estendido seus painéis de reconhecimento. Os Mustangs chegaram e puseram o napalm sobre os painéis.',
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
      text: 'On 24 September 867 the Byzantine emperor Michael III was murdered in his own bedchamber, and his co-emperor Basil — the man he had raised up — took the whole throne. Basil had been a peasant from Macedonia, a wrestler and a groom, and the dynasty he founded that night ruled Byzantium for nearly two hundred years.',
      text_pt: 'Em 24 de setembro de 867, o imperador bizantino Miguel III foi assassinado em seu próprio quarto, e seu co-imperador Basílio — o homem que ele próprio erguera — ficou com o trono inteiro. Basílio fora um camponês da Macedônia, lutador e cavalariço, e a dinastia que fundou naquela noite governou Bizâncio por quase duzentos anos.',
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
      text: 'On 25 September 1768 Prithvi Narayan Shah of Gorkha took Kathmandu during the Indra Jatra festival, walking in while the city was celebrating, and made himself king of the valley. Out of a mountain principality and a long campaign he assembled the state that is Nepal, and described its position between China and India as a yam between two boulders.',
      text_pt: 'Em 25 de setembro de 1768, Prithvi Narayan Shah, de Gorkha, tomou Catmandu durante o festival Indra Jatra, entrando na cidade enquanto ela festejava, e fez-se rei do vale. De um principado de montanha e de uma longa campanha, montou o Estado que é o Nepal, e descreveu sua posição entre a China e a Índia como um inhame entre duas pedras.',
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
      text: 'On 26 September 46 BCE Caesar dedicated a temple to Venus in his new forum in Rome, fulfilling a vow he had made on the morning of Pharsalus four years earlier. When he came to build it he quietly changed the dedication: not Venus the Bringer of Victory, as vowed, but Venus the Ancestress — the goddess from whom his own family claimed descent. A battlefield promise was converted into a genealogy.',
      text_pt: 'Em 26 de setembro de 46 AEC, César dedicou um templo a Vênus em seu novo fórum, em Roma, cumprindo uma promessa feita na manhã de Farsalos quatro anos antes. Quando foi construí-lo, mudou discretamente a dedicatória: não Vênus Vitoriosa, como prometera, mas Vênus Genetriz — a deusa de quem sua própria família alegava descender. Uma promessa de campo de batalha foi convertida em genealogia.',
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
      text: 'On 27 September 1529 Suleiman the Magnificent began the siege of Vienna, with an army that had already taken Belgrade, Rhodes and Hungary. He could not take a city defended by perhaps twenty thousand men, and he was beaten less by the garrison than by the calendar and the weather: an exceptionally wet autumn had already cost him his heavy guns on the roads.',
      text_pt: 'Em 27 de setembro de 1529, Solimão, o Magnífico, iniciou o cerco de Viena, com um exército que já tomara Belgrado, Rodes e a Hungria. Não conseguiu tomar uma cidade defendida por talvez vinte mil homens, e foi derrotado menos pela guarnição do que pelo calendário e pelo clima: um outono excepcionalmente chuvoso já lhe custara a artilharia pesada nas estradas.',
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
      text: 'On 28 September 1066 William of Normandy landed his army at Pevensey on the Sussex coast, and the Norman conquest of England began. He had been sitting on the French coast for six weeks with a fleet he could not sail, waiting for the wind to turn, and it turned at the best possible moment: Harold had just disbanded the militia that had watched the coast all summer, and was four hundred kilometres north, fighting a different invasion.',
      text_pt: 'Em 28 de setembro de 1066, Guilherme da Normandia desembarcou seu exército em Pevensey, na costa de Sussex, e começava a conquista normanda da Inglaterra. Ele passara seis semanas parado na costa francesa com uma frota que não conseguia fazer navegar, esperando o vento virar, e ele virou no melhor momento possível: Haroldo acabara de dispensar a milícia que vigiara a costa o verão inteiro e estava a quatrocentos quilômetros ao norte, combatendo outra invasão.',
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
      text: 'On 29 September 1227 Pope Gregory IX excommunicated the Emperor Frederick II for failing to go on crusade. Frederick had been promising to go for eleven years; when he finally sailed, an epidemic swept the fleet, he fell ill himself and turned back. So he went the following year while excommunicated, and got Jerusalem.',
      text_pt: 'Em 29 de setembro de 1227, o papa Gregório IX excomungou o imperador Frederico II por não ter partido para a cruzada. Frederico prometia ir havia onze anos; quando enfim zarpou, uma epidemia varreu a frota, ele próprio adoeceu e voltou atrás. Então foi no ano seguinte, excomungado, e conseguiu Jerusalém.',
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
      text: 'On 30 September 1960 The Flintstones went out on ABC at half past eight in the evening, in the middle of the adult schedule, and became the first animated series made for prime time. It was a sitcom about a married couple with money problems, lifted almost directly from The Honeymooners and moved to the Stone Age.',
      text_pt: 'Em 30 de setembro de 1960, Os Flintstones foi ao ar na ABC às oito e meia da noite, no meio da grade adulta, e tornou-se a primeira série animada feita para o horário nobre. Era uma comédia sobre um casal com problemas de dinheiro, tirada quase diretamente de The Honeymooners e transportada para a Idade da Pedra.',
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
      text: 'On 1 October 331 BCE, on a plain in northern Mesopotamia, Alexander defeated Darius III and took the Persian Empire. Darius had chosen the ground and had it levelled so that his chariots and his far larger cavalry could work on it; Alexander drew the Persian left out of position, opened a gap in the line, and drove the Companion cavalry through it straight at the king. Darius turned and rode, as he had at Issus two years earlier, and the army he left behind came apart.',
      text_pt: 'Em 1º de outubro de 331 AEC, numa planície do norte da Mesopotâmia, Alexandre derrotou Dario III e tomou o Império Persa. Dario escolhera o terreno e o mandara aplainar para que seus carros de guerra e sua cavalaria, muito maior, pudessem operar nele; Alexandre puxou a esquerda persa para fora de posição, abriu uma brecha na linha e lançou a cavalaria dos Companheiros por ela, direto contra o rei. Dario deu meia-volta e cavalgou, como fizera em Isso dois anos antes, e o exército que deixou para trás se desfez.',
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

  '10-02': [
    {
      year: 1870,
      title: 'Infallible and Dispossessed in the Same Year',
      title_pt: 'Infalível e Despojado no Mesmo Ano',
      era: 'Modern',
      region: 'Rome', region_pt: 'Roma',
      tag: 'Plebiscite', tag_pt: 'Plebiscito',
      text: 'On 2 October 1870 the people of Rome and what was left of the Papal States voted by plebiscite to join the Kingdom of Italy: 133,681 for and 1,507 against. Italian troops had come through the wall at Porta Pia twelve days earlier. It ended eleven hundred years in which the pope had also been a territorial sovereign, and the pope refused to recognise it.',
      text_pt: 'Em 2 de outubro de 1870, o povo de Roma e do que restava dos Estados Pontifícios votou em plebiscito pela anexação ao Reino da Itália: 133.681 a favor e 1.507 contra. As tropas italianas haviam entrado pela brecha de Porta Pia doze dias antes. Encerravam-se mil e cem anos em que o papa fora também soberano territorial, e o papa se recusou a reconhecê-lo.',
      facts: [
        'Three months before losing the city, Pius IX had the First Vatican Council declare the pope infallible in matters of doctrine. He acquired the furthest reach of spiritual authority in the same year he lost the last of his temporal power.',
        'He declared himself a prisoner of the Vatican and stopped going out. His successors kept it up for fifty-nine years, until the Lateran Treaty of 1929 cut a forty-four-hectare state out of Rome and handed it back.',
        'He also forbade Italian Catholics to vote or stand in Italian elections. The prohibition was only lifted in 1919, so for half a century the largest body of believers in the country was told by Rome to stay out of its politics.'
      ],
      facts_pt: [
        'Três meses antes de perder a cidade, Pio IX fizera o Concílio Vaticano I declarar o papa infalível em matéria de doutrina. Obteve o alcance máximo da autoridade espiritual no mesmo ano em que perdeu o que restava do poder temporal.',
        'Declarou-se prisioneiro do Vaticano e parou de sair. Seus sucessores mantiveram isso por cinquenta e nove anos, até o Tratado de Latrão, em 1929, recortar de Roma um Estado de quarenta e quatro hectares e devolvê-lo.',
        'Também proibiu os católicos italianos de votar e de se candidatar em eleições italianas. A proibição só foi levantada em 1919, de modo que por meio século o maior corpo de fiéis do país foi instruído por Roma a ficar fora da política dele.'
      ]
    }
  ],

  '10-03': [
    {
      year: -2457,
      title: 'The Bear That Lasted a Hundred Days',
      title_pt: 'A Ursa que Aguentou Cem Dias',
      era: 'Ancient',
      region: 'Korea', region_pt: 'Coreia',
      tag: 'Myth', tag_pt: 'Mito',
      text: 'Korean tradition dates to 3 October 2457 BCE the descent of Hwanung, son of the Lord of Heaven, onto a mountain with three thousand followers — the day South Korea keeps as its National Foundation Day. A tiger and a bear asked him to make them human; he gave them mugwort and garlic and told them to stay out of the sunlight for a hundred days. The tiger gave up. The bear became a woman, and her son founded the first Korean kingdom.',
      text_pt: 'A tradição coreana data de 3 de outubro de 2457 AEC a descida de Hwanung, filho do Senhor do Céu, sobre uma montanha com três mil seguidores — o dia que a Coreia do Sul mantém como sua Festa da Fundação Nacional. Um tigre e uma ursa lhe pediram que os tornasse humanos; ele lhes deu artemísia e alho e mandou que ficassem longe da luz do sol por cem dias. O tigre desistiu. A ursa virou mulher, e o filho dela fundou o primeiro reino coreano.',
      facts: [
        'The story is first written down in 1281, more than three and a half thousand years after the date it claims, by a Buddhist monk compiling old traditions while Korea was under Mongol domination. A founding myth set down at the moment of deepest subjection.',
        'The descent is dated to 2457 BCE and the kingdom to 2333 BCE, and that second number was the official calendar of South Korea from 1948 to 1961 — public documents counted the years from it.',
        'It is still a national holiday, Gaecheonjeol, the opening of heaven. A country keeps a day off for the morning a bear finished eating garlic in the dark.'
      ],
      facts_pt: [
        'A história só é posta por escrito em 1281, mais de três mil e quinhentos anos depois da data que reivindica, por um monge budista que compilava tradições antigas enquanto a Coreia estava sob domínio mongol. Um mito fundador registrado no momento de maior sujeição.',
        'A descida é datada de 2457 AEC e o reino de 2333 AEC, e esse segundo número foi o calendário oficial da Coreia do Sul de 1948 a 1961 — os documentos públicos contavam os anos a partir dele.',
        'Continua sendo feriado nacional, Gaecheonjeol, a abertura do céu. Um país mantém um dia de folga pela manhã em que uma ursa terminou de comer alho no escuro.'
      ]
    }
  ],

  '10-04': [
    {
      year: 1582,
      title: 'She Died on the Fourth and Was Buried on the Fifteenth',
      title_pt: 'Morreu no Dia 4 e Foi Enterrada no Dia 15',
      era: 'Early Modern',
      region: 'Rome', region_pt: 'Roma',
      tag: 'Calendar', tag_pt: 'Calendário',
      text: 'Thursday 4 October 1582 was followed by Friday 15 October 1582. Ten days were deleted outright to put the calendar back where it belonged. Teresa of Ávila happened to die that night, and was buried the next morning — her death and her funeral are ten days apart on paper and a few hours apart in fact.',
      text_pt: 'À quinta-feira, 4 de outubro de 1582, seguiu-se a sexta-feira, 15 de outubro de 1582. Dez dias foram apagados de uma vez para pôr o calendário de volta onde devia estar. Teresa de Ávila morreu justamente naquela noite e foi enterrada na manhã seguinte — sua morte e seu enterro estão a dez dias de distância no papel e a poucas horas de distância na realidade.',
      facts: [
        'The whole reform exists to protect one feast. The Julian year ran about eleven minutes too long, and over twelve centuries the spring equinox had slid from 21 March to 11 March, which was dragging the calculation of Easter out of position with it.',
        'The change itself is tiny: century years are leap years only when divisible by four hundred. That one rule, plus the ten deleted days, is the entire correction, and it is accurate to within a day in three thousand years.',
        'The man who designed it never saw it adopted. Aloysius Lilius, a physician from Calabria, submitted the scheme and died first; the Jesuit mathematician Christopher Clavius worked out the details and spent decades afterwards defending it against people who were certain it was a papal trick.'
      ],
      facts_pt: [
        'A reforma inteira existe para proteger uma única festa. O ano juliano corria cerca de onze minutos longo demais e, ao longo de doze séculos, o equinócio de primavera escorregara de 21 para 11 de março, arrastando consigo o cálculo da Páscoa para fora do lugar.',
        'A mudança em si é minúscula: anos seculares só são bissextos quando divisíveis por quatrocentos. Essa única regra, mais os dez dias apagados, é a correção inteira, e ela erra menos de um dia em três mil anos.',
        'O homem que a projetou não viu sua adoção. Aloysius Lilius, médico da Calábria, apresentou o esquema e morreu antes; o matemático jesuíta Cristóvão Clávio acertou os detalhes e passou décadas defendendo-a de gente convencida de que aquilo era um truque papal.'
      ]
    }
  ],

  '10-05': [
    {
      year: 1962,
      title: 'The Producer Did Not Trust the Drummer',
      title_pt: 'O Produtor Não Confiava no Baterista',
      era: 'Contemporary',
      region: 'London', region_pt: 'Londres',
      tag: 'Music', tag_pt: 'Música',
      text: 'On 5 October 1962 the first Beatles single, "Love Me Do", was released in Britain on Parlophone. It reached number seventeen, and then nothing happened for three months. Paul had written most of it at about sixteen, skipping school, and on the record he sounds tight, because John needed his mouth for the harmonica and the lead line fell to Paul at the last moment.',
      text_pt: 'Em 5 de outubro de 1962 foi lançado na Grã-Bretanha, pela Parlophone, o primeiro compacto dos Beatles, "Love Me Do". Chegou ao décimo sétimo lugar, e depois nada aconteceu por três meses. Paul escrevera a maior parte dela por volta dos dezesseis anos, matando aula, e no disco ele soa tenso, porque John precisava da boca para a gaita e a linha principal caiu no colo de Paul no último instante.',
      facts: [
        'Ringo had been in the band six weeks and George Martin did not trust him. For the session that mattered the producer hired a session drummer and put Ringo on tambourine. Ringo said afterwards that he thought he was being sacked.',
        'Three different drummers recorded it inside four months — Pete Best at the audition in June, Ringo in September, and the session man a week later. Which version you have heard depends on which pressing you own.',
        'It was not the breakthrough. Seventeen in Britain and nothing abroad; the single that changed everything was the next one, in January.'
      ],
      facts_pt: [
        'Ringo estava na banda havia seis semanas e George Martin não confiava nele. Para a sessão que importava, o produtor contratou um baterista de estúdio e pôs Ringo no pandeiro. Ringo diria depois que achou que estava sendo demitido.',
        'Três bateristas diferentes a gravaram em quatro meses — Pete Best no teste de junho, Ringo em setembro e o músico de estúdio uma semana depois. Qual versão você já ouviu depende de qual prensagem tem.',
        'Não foi o estouro. Décimo sétimo no Reino Unido e nada fora dele; o compacto que mudou tudo foi o seguinte, em janeiro.'
      ]
    }
  ],

  '10-06': [
    {
      year: 618,
      title: 'The Tang Won a Battle They Did Not Fight',
      title_pt: 'Os Tang Venceram uma Batalha que Não Travaram',
      era: 'Medieval',
      region: 'Luoyang, China', region_pt: 'Luoyang, China',
      tag: 'Civil War', tag_pt: 'Guerra Civil',
      text: 'On 6 October 618, at Yanshi near Luoyang, Wang Shichong decisively defeated Li Mi, and the strongest claimant to the collapsed Sui empire was finished. China was being fought over by warlords; Li Mi held the imperial granaries and the largest rebel army. Neither he nor the man who beat him was the Tang, and the Tang are who ended up with the empire.',
      text_pt: 'Em 6 de outubro de 618, em Yanshi, perto de Luoyang, Wang Shichong derrotou decisivamente Li Mi, e acabava o pretendente mais forte ao império Sui em ruínas. A China era disputada por senhores da guerra; Li Mi detinha os celeiros imperiais e o maior exército rebelde. Nem ele nem o homem que o venceu eram Tang, e foram os Tang que acabaram com o império.',
      facts: [
        'Li Mi’s power was grain. He had taken one of the enormous state granaries the Sui had built and opened it to the hungry, and that fed him an army. At a sister granary archaeologists have found hundreds of storage pits, one of them still holding half a million catties of carbonised millet.',
        'The winner lasted three years. Wang Shichong deposed the puppet emperor he had been propping up, declared a dynasty of his own, and in 621 was destroyed along with another warlord in a single campaign by the Tang prince Li Shimin.',
        'That prince went on to kill his elder brother, push his father off the throne, and reign as Taizong — remembered afterwards as one of the best rulers China ever had.'
      ],
      facts_pt: [
        'O poder de Li Mi era grão. Ele tomara um dos enormes celeiros estatais construídos pelos Sui e o abrira aos famintos, e isso lhe alimentou um exército. Num celeiro irmão, arqueólogos encontraram centenas de fossos de armazenagem, um deles ainda com meio milhão de catis de painço carbonizado.',
        'O vencedor durou três anos. Wang Shichong depôs o imperador-fantoche que vinha sustentando, declarou dinastia própria e, em 621, foi destruído junto com outro senhor da guerra numa única campanha do príncipe Tang Li Shimin.',
        'Esse príncipe viria a matar o irmão mais velho, empurrar o pai para fora do trono e reinar como Taizong — lembrado depois como um dos melhores governantes que a China já teve.'
      ]
    }
  ],

  '10-07': [
    {
      year: -3761,
      title: 'Year One, Counted Backwards',
      title_pt: 'Ano Um, Contado de Trás para Frente',
      era: 'Jewish History',
      tag: 'Calendar', tag_pt: 'Calendário',
      text: 'The Hebrew calendar counts its years from 7 October 3761 BCE, and nobody was there to see it. The year was arrived at by adding up the lifespans in Genesis and working backwards, and the count only came into ordinary Jewish use about a thousand years ago — the calendar is far younger than the year it begins from.',
      text_pt: 'O calendário hebraico conta seus anos a partir de 7 de outubro de 3761 AEC, e ninguém estava lá para ver. O ano foi obtido somando as idades do Gênesis e caminhando para trás, e a contagem só entrou no uso judaico corrente há cerca de mil anos — o calendário é muito mais novo que o ano de que parte.',
      facts: [
        'The starting instant is specified to the minute. Tradition fixes the first new moon at a Monday, five hours and 204 parts after nightfall, the hour being divided into 1,080 parts. Everything since is computed forward from that one moment, with no observation of the sky required at all.',
        'Before this count took hold, Jews dated documents by the Seleucid era — the years of a Greek dynasty founded by one of Alexander’s generals — and kept doing so in some communities for centuries after.',
        'It drifts. The fixed year runs about six and a half minutes long, roughly a day every two centuries, and Passover is slowly walking toward summer. The problem has been known for most of a thousand years and deliberately left alone.'
      ],
      facts_pt: [
        'O instante inicial é especificado ao minuto. A tradição fixa a primeira lua nova numa segunda-feira, cinco horas e 204 partes após o anoitecer, sendo a hora dividida em 1.080 partes. Tudo desde então é calculado para a frente a partir desse único momento, sem nenhuma necessidade de observar o céu.',
        'Antes de essa contagem se firmar, os judeus datavam documentos pela era selêucida — os anos de uma dinastia grega fundada por um dos generais de Alexandre — e algumas comunidades seguiram assim por séculos depois.',
        'Ele deriva. O ano fixo corre cerca de seis minutos e meio longo demais, aproximadamente um dia a cada dois séculos, e a Páscoa caminha devagar para o verão. O problema é conhecido há quase mil anos e foi deliberadamente deixado como está.'
      ]
    }
  ],

  '10-08': [
    {
      year: 1480,
      title: 'The Battle Where Nobody Fought',
      title_pt: 'A Batalha em que Ninguém Lutou',
      era: 'Medieval',
      region: 'Ugra River, Russia', region_pt: 'Rio Ugra, Rússia',
      tag: 'Standoff', tag_pt: 'Impasse',
      text: 'On 8 October 1480 the armies of Akhmat, Khan of the Great Horde, and Ivan III of Moscow took up position on opposite banks of the Ugra, and the confrontation conventionally taken as the end of Tatar rule over Moscow began. They stood there for weeks, traded arrows, and waited. When the river froze and the obstacle between them disappeared, both of them turned around and went home.',
      text_pt: 'Em 8 de outubro de 1480, os exércitos de Akhmat, cã da Grande Horda, e de Ivan III de Moscou tomaram posição em margens opostas do Ugra, e começava o confronto convencionalmente tomado como o fim do domínio tártaro sobre Moscou. Ficaram ali semanas, trocaram flechas e esperaram. Quando o rio congelou e o obstáculo entre eles desapareceu, ambos deram meia-volta e foram para casa.',
      facts: [
        'Akhmat was waiting for an ally who never arrived. Casimir of Poland-Lithuania was to join him and was kept occupied by a Crimean raid that Ivan had arranged. Akhmat went home and was killed by a rival khan a few months later.',
        'The tribute had already stopped four years earlier. Whatever ended in 1480 had been ending for some time, and the river was where the two sides looked at each other and privately agreed not to settle it.',
        'The meaning was attached afterwards. Later historians needed a date for the end of two and a half centuries of Tatar overlordship, and chose this one — so the most consequential event in medieval Russian history is a standoff in which nothing was decided by force.'
      ],
      facts_pt: [
        'Akhmat esperava um aliado que nunca chegou. Casimiro, da Polônia-Lituânia, deveria se juntar a ele e foi mantido ocupado por uma incursão da Crimeia que Ivan havia arranjado. Akhmat voltou para casa e foi morto por um cã rival poucos meses depois.',
        'O tributo já havia parado quatro anos antes. O que quer que tenha acabado em 1480 vinha acabando havia tempo, e o rio foi onde os dois lados se olharam e concordaram, sem dizer, em não resolver aquilo.',
        'O significado foi colado depois. Historiadores posteriores precisavam de uma data para o fim de dois séculos e meio de suserania tártara, e escolheram esta — de modo que o acontecimento mais consequente da história medieval russa é um impasse em que nada se decidiu pela força.'
      ]
    }
  ],

  '10-09': [
    {
      year: 1980,
      title: 'A Door That Was Later Closed',
      title_pt: 'Uma Porta que Depois se Fechou',
      era: 'Contemporary',
      region: 'Vatican City', region_pt: 'Vaticano',
      tag: 'Diplomacy', tag_pt: 'Diplomacia',
      text: 'On 9 October 1980 John Paul II received the Dalai Lama in private audience in Vatican City, the first time a pope had done so. One of them came from a Poland whose government treated his church as an enemy; the other had been governing Tibet from exile in India for twenty-one years. Both of them led faiths that a communist state had decided to manage.',
      text_pt: 'Em 9 de outubro de 1980, João Paulo II recebeu o Dalai Lama em audiência privada no Vaticano, a primeira vez que um papa o fazia. Um deles vinha de uma Polônia cujo governo tratava sua igreja como inimiga; o outro governava o Tibete a partir do exílio na Índia havia vinte e um anos. Ambos lideravam religiões que um Estado comunista decidira administrar.',
      facts: [
        'They went on meeting, at least eight times over the next two decades.',
        'In 1986 the pope invited him to Assisi along with leaders of a dozen other religions to pray together for peace. A section of his own church regarded that as a betrayal and has never let it go.',
        'The opening did not hold. In 2014 the Vatican declined a meeting between Pope Francis and the Dalai Lama while he was in Rome for a gathering of Nobel laureates, and relations with Beijing were given as the reason.'
      ],
      facts_pt: [
        'Eles continuaram se encontrando, ao menos oito vezes ao longo das duas décadas seguintes.',
        'Em 1986 o papa o convidou para Assis, junto com líderes de uma dezena de outras religiões, para rezarem juntos pela paz. Uma parte de sua própria igreja considerou aquilo uma traição e nunca deixou o assunto morrer.',
        'A abertura não se sustentou. Em 2014 o Vaticano recusou um encontro entre o papa Francisco e o Dalai Lama enquanto ele estava em Roma para uma reunião de laureados com o Nobel, e as relações com Pequim foram dadas como motivo.'
      ]
    }
  ],

  '10-10': [
    {
      year: 732,
      title: 'The Raid That Made a Dynasty',
      title_pt: 'A Incursão que Fez uma Dinastia',
      era: 'Medieval',
      region: 'near Tours, Francia', region_pt: 'perto de Tours, Frância',
      tag: 'Battle', tag_pt: 'Batalha',
      text: 'On 10 October 732, near Tours, Charles Martel defeated an Umayyad army and killed its commander. He put his infantry on a wooded slope and made the cavalry come to him, and it held — a chronicler described the Franks standing like a wall of ice frozen together. Europe remembers it as the day the continent was saved; what it actually decided was which family would rule the Franks.',
      text_pt: 'Em 10 de outubro de 732, perto de Tours, Carlos Martel derrotou um exército omíada e matou seu comandante. Pôs a infantaria numa encosta arborizada e obrigou a cavalaria a vir até ele, e ela aguentou — um cronista descreveu os francos de pé como uma muralha de gelo congelada. A Europa lembra aquilo como o dia em que o continente foi salvo; o que de fato se decidiu ali foi qual família governaria os francos.',
      facts: [
        'Arab chroniclers barely registered it. They called the place the pavement of the martyrs and treated the setback as one among many; the expedition was a raid for plunder, aimed at the treasury of the monastery at Tours, rather than an attempt to conquer Francia.',
        'Martel was not a king. He was mayor of the palace, running the kingdom for a Merovingian figurehead, and the standing this victory gave his house is what let his son depose the last Merovingian in 751. His grandson was Charlemagne.',
        'He paid his army with church property. The man later celebrated as the shield of Christendom seized monastic estates to fund the troops, and the church spent the following decades trying to get them back.'
      ],
      facts_pt: [
        'Os cronistas árabes quase não registraram o episódio. Chamaram o lugar de calçada dos mártires e trataram o reverso como um entre muitos; a expedição era uma incursão de pilhagem, visando o tesouro do mosteiro de Tours, e não uma tentativa de conquistar a Frância.',
        'Martel não era rei. Era mordomo do palácio, governando o reino em nome de um merovíngio decorativo, e o prestígio que esta vitória deu à sua casa é o que permitiu ao filho dele depor o último merovíngio em 751. Seu neto foi Carlos Magno.',
        'Ele pagou seu exército com propriedade da Igreja. O homem depois celebrado como o escudo da cristandade confiscou terras monásticas para financiar as tropas, e a Igreja passou as décadas seguintes tentando reavê-las.'
      ]
    }
  ],

  '10-11': [
    {
      year: 1962,
      title: 'The Caretaker Pope Who Changed Everything',
      title_pt: 'O Papa de Transição que Mudou Tudo',
      era: 'Contemporary',
      region: 'St Peter’s Basilica', region_pt: 'Basílica de São Pedro',
      tag: 'Council', tag_pt: 'Concílio',
      text: 'On 11 October 1962 the Second Vatican Council opened in St Peter\'s, the first ecumenical council of the Catholic Church in ninety-two years. John XXIII was seventy-seven when he was elected and was understood by everyone, including the men who elected him, to be a stopgap; he announced the council three months in. Two and a half thousand bishops came, more of them from Africa and Asia than had ever attended anything, and the church that came out was not the one that went in.',
      text_pt: 'Em 11 de outubro de 1962 abriu-se o Concílio Vaticano II, em São Pedro, o primeiro concílio ecumênico da Igreja Católica em noventa e dois anos. João XXIII tinha setenta e sete anos quando foi eleito e era entendido por todos, inclusive pelos homens que o elegeram, como solução provisória; anunciou o concílio três meses depois. Vieram dois mil e quinhentos bispos, mais deles da África e da Ásia do que jamais comparecera a qualquer coisa, e a igreja que saiu não era a que entrou.',
      facts: [
        'The bishops threw out the prepared texts. The Curia had drafted some seventy documents to be approved; within days the assembly refused to simply ratify them and insisted on writing its own. That is the moment the council stopped being the one that had been planned.',
        'He did not live to see it finish. John XXIII died after the first of four sessions, and Paul VI carried it to 1965 — so the pope who called it shaped almost none of what it produced.',
        'One of the documents it produced, Nostra Aetate, repudiated the teaching that the Jewish people bore collective guilt for the death of Christ. It was four paragraphs long and reversed something the church had taught for the better part of two thousand years.'
      ],
      facts_pt: [
        'Os bispos descartaram os textos preparados. A Cúria havia redigido cerca de setenta documentos para serem aprovados; em poucos dias a assembleia recusou-se a simplesmente ratificá-los e exigiu escrever os seus. Foi o momento em que o concílio deixou de ser o que havia sido planejado.',
        'Ele não viveu para vê-lo terminar. João XXIII morreu depois da primeira das quatro sessões, e Paulo VI o levou até 1965 — de modo que o papa que o convocou moldou quase nada do que ele produziu.',
        'Um dos documentos que saíram dali, a Nostra Aetate, repudiou o ensinamento de que o povo judeu carregava culpa coletiva pela morte de Cristo. Tinha quatro parágrafos e revertia algo que a igreja ensinara por quase dois mil anos.'
      ]
    }
  ],

  '10-12': [
    {
      year: -539,
      title: 'The Only Foreigner the Bible Calls Messiah',
      title_pt: 'O Único Estrangeiro que a Bíblia Chama de Messias',
      era: 'Classical',
      region: 'Babylon', region_pt: 'Babilônia',
      tag: 'Conquest', tag_pt: 'Conquista',
      text: 'On 12 October 539 BCE the army of Cyrus the Great took Babylon, and the Babylonian empire ended. The city had the most formidable walls in the world and they did not matter: Nabonidus had spent years away from it and had neglected its chief god, the priesthood had turned against him, and the Persians were inside before there was much of a fight. Cyrus then did something conquerors did not do, and sent the deported peoples home.',
      text_pt: 'Em 12 de outubro de 539 AEC, o exército de Ciro, o Grande, tomou a Babilônia, e o império babilônico terminou. A cidade tinha as muralhas mais formidáveis do mundo e elas não fizeram diferença: Nabonido passara anos longe dela e negligenciara seu deus principal, o sacerdócio se voltara contra ele, e os persas estavam dentro antes que houvesse grande combate. Ciro então fez algo que conquistadores não faziam, e mandou os povos deportados de volta para casa.',
      facts: [
        'The Hebrew Bible calls him the Lord’s anointed — mashiach, messiah. Isaiah uses the word for Cyrus and for no other foreigner anywhere in scripture, because he let the exiles return to Jerusalem and rebuild the Temple.',
        'His own account survives, on a clay cylinder dug up in 1879. It says Marduk chose him because the last king had offended the god, and records the restoration of temples and the return of captive peoples and their statues. It is often called the first declaration of human rights; it is more precisely an extremely well-made piece of Mesopotamian royal propaganda, which is not the same thing as being false.',
        'He let the local religion keep its forms and had himself written into them. Where other conquerors replaced gods, Cyrus took the hand of Marduk in the new year ceremony and ruled as a legitimate Babylonian king, which is a large part of why the empire he assembled held together.'
      ],
      facts_pt: [
        'A Bíblia hebraica o chama de ungido do Senhor — mashiach, messias. Isaías usa a palavra para Ciro e para nenhum outro estrangeiro em toda a escritura, porque ele permitiu aos exilados voltar a Jerusalém e reconstruir o Templo.',
        'O relato dele próprio sobreviveu, num cilindro de argila desenterrado em 1879. Diz que Marduk o escolheu porque o rei anterior havia ofendido o deus, e registra a restauração de templos e o retorno dos povos cativos e de suas estátuas. É frequentemente chamado de primeira declaração de direitos humanos; é, mais precisamente, uma peça extremamente bem-feita de propaganda real mesopotâmica, o que não é a mesma coisa que ser falsa.',
        'Ele deixou a religião local manter suas formas e fez-se inscrever nelas. Onde outros conquistadores substituíam deuses, Ciro tomou a mão de Marduk na cerimônia do ano-novo e governou como rei babilônico legítimo, o que é boa parte da razão de o império que montou ter se mantido de pé.'
      ]
    },
    {
      year: 1492,
      pin: true,
      title: 'Who Saw It First',
      title_pt: 'Quem Viu Primeiro',
      era: 'Renaissance',
      region: 'Bahamas', region_pt: 'Bahamas',
      tag: 'Exploration', tag_pt: 'Exploração',
      text: 'At about two in the morning on 12 October 1492, a lookout on the Pinta named Rodrigo de Triana saw land in the moonlight and shouted “Tierra!”. Five weeks after leaving the Canary Islands, Columbus’s three ships had reached an island of the Bahamas that its Taíno inhabitants called Guanahani. That morning he went ashore, raised the banners of Ferdinand and Isabella and renamed it San Salvador.',
      text_pt: 'Por volta das duas da manhã de 12 de outubro de 1492, um vigia da Pinta chamado Rodrigo de Triana avistou terra ao luar e gritou “Tierra!”. Cinco semanas depois de deixarem as Canárias, os três navios de Colombo tinham chegado a uma ilha das Bahamas que seus habitantes taínos chamavam de Guanahani. Naquela manhã ele desembarcou, ergueu os estandartes de Fernando e Isabel e a rebatizou de San Salvador.',
      facts: [
        'The Crown had promised a pension of 10,000 maravedís a year to the first man to sight land. Columbus kept it for himself, saying he had seen a light several hours earlier, and the sailor who shouted got nothing.',
        'Nobody knows for certain which island it was. In 1925 the Bahamas renamed Watling Island as San Salvador, but historians have argued for at least half a dozen others, and in 1986 a National Geographic study made the case for Samana Cay.',
        'His journal records the first meeting that same day. He described the Taíno as gentle, generous and unarmed — they cut themselves taking his swords by the blade, not knowing what they were — and concluded that they would make good servants.'
      ],
      facts_pt: [
        'A Coroa havia prometido uma pensão de 10 mil maravedis por ano ao primeiro homem que avistasse terra. Colombo ficou com ela, dizendo ter visto uma luz horas antes, e o marinheiro que gritou não recebeu nada.',
        'Ninguém sabe ao certo que ilha era. Em 1925 as Bahamas rebatizaram a ilha Watling de San Salvador, mas historiadores já defenderam pelo menos meia dúzia de outras, e em 1986 um estudo da National Geographic apontou Samana Cay.',
        'Seu diário registra o primeiro encontro naquele mesmo dia. Ele descreveu os taínos como gentis, generosos e desarmados — cortavam-se ao pegar suas espadas pela lâmina, sem saber o que eram — e concluiu que dariam bons servos.'
      ]
    }
  ],

  '10-13': [
    {
      year: 1307,
      title: 'The Pope Had Already Cleared Them',
      title_pt: 'O Papa Já os Havia Absolvido',
      era: 'Medieval',
      region: 'France', region_pt: 'França',
      tag: 'Arrest', tag_pt: 'Prisão',
      text: 'On the morning of 13 October 1307, on the orders of Philip IV, almost every Templar in France was arrested at once. Sealed orders had gone out across the kingdom weeks before, with instructions not to break the seal until the appointed dawn. Philip was broke, had already expelled the Jews and seized their property the year before, and the Templars were his creditors.',
      text_pt: 'Na manhã de 13 de outubro de 1307, por ordem de Filipe IV, quase todo templário da França foi preso de uma só vez. Ordens seladas haviam sido distribuídas pelo reino semanas antes, com instruções de não romper o selo até o amanhecer marcado. Filipe estava quebrado, já havia expulsado os judeus e confiscado seus bens no ano anterior, e os templários eram seus credores.',
      facts: [
        'A parchment found misfiled in the Vatican archives in 2001 shows Clement V secretly absolving the Templar leadership of heresy in 1308. He suppressed the order anyway in 1312 — not because he believed the charges, but because the scandal had made it unusable.',
        'Friday the thirteenth has nothing to do with this. The superstition about the date does not appear in writing until the nineteenth century, and nobody tied it to the Templars until the twentieth.',
        'Fifty-four men who retracted their confessions were burned in 1310 for retracting them. The last grand master went to the fire in 1314 and is said to have summoned the king and the pope to judgment within the year; both of them were dead within the year.'
      ],
      facts_pt: [
        'Um pergaminho encontrado arquivado no lugar errado no Vaticano, em 2001, mostra Clemente V absolvendo secretamente a cúpula templária de heresia, em 1308. Ele suprimiu a ordem de todo modo em 1312 — não por acreditar nas acusações, mas porque o escândalo a tornara inutilizável.',
        'A sexta-feira treze não tem nada a ver com isto. A superstição sobre a data só aparece por escrito no século XIX, e ninguém a ligou aos templários antes do século XX.',
        'Cinquenta e quatro homens que se retrataram das confissões foram queimados em 1310 por terem se retratado. O último grão-mestre foi à fogueira em 1314 e teria convocado o rei e o papa a juízo dentro de um ano; ambos estavam mortos dentro de um ano.'
      ]
    }
  ],

  '10-14': [
    {
      year: 1066,
      title: 'A Cow in the Field, Beef on the Table',
      title_pt: 'Vaca no Campo, Carne na Mesa',
      era: 'Medieval',
      region: 'Hastings, Sussex', region_pt: 'Hastings, Sussex',
      tag: 'Battle', tag_pt: 'Batalha',
      text: 'On 14 October 1066, on a ridge outside Hastings, William of Normandy destroyed the army of King Harold Godwinson and killed him, and the Norman conquest of England began. The fighting ran most of the day, which almost no medieval battle did: the English shield wall held for hours and broke only when it chased what looked like a Norman collapse down the slope and found itself in the open. England got a new ruling class, a new architecture and a different language.',
      text_pt: 'Em 14 de outubro de 1066, numa crista nos arredores de Hastings, Guilherme da Normandia destruiu o exército do rei Haroldo Godwinson e o matou, e começava a conquista normanda da Inglaterra. O combate durou quase todo o dia, o que praticamente nenhuma batalha medieval durava: a muralha de escudos inglesa aguentou horas e só se rompeu quando perseguiu o que parecia um colapso normando encosta abaixo e se viu em campo aberto. A Inglaterra ganhou uma nova classe dirigente, uma nova arquitetura e outra língua.',
      facts: [
        'For about three hundred years the business of English government was done in French, and some ten thousand French words came into the language. English has a cow and beef, a pig and pork, a sheep and mutton because one word belonged to whoever raised the animal and the other to whoever ate it.',
        'The arrow in the eye may not be Harold. It comes from the Bayeux Tapestry, which is embroidery rather than tapestry and was almost certainly stitched in England — the conquered sewing the conquerors’ account of events. Written sources say he was cut down.',
        'Twenty years later William had the whole kingdom surveyed, holding by holding, down to the ploughs and the pigs. Nothing like the Domesday Book was attempted anywhere in Europe for centuries, and it exists because a conqueror needed to know exactly what he had taken.'
      ],
      facts_pt: [
        'Por cerca de trezentos anos os negócios do governo inglês foram conduzidos em francês, e umas dez mil palavras francesas entraram na língua. O inglês tem cow e beef, pig e pork, sheep e mutton porque uma palavra pertencia a quem criava o animal e a outra a quem o comia.',
        'A flecha no olho talvez não seja Haroldo. Ela vem da Tapeçaria de Bayeux, que é bordado e não tapeçaria e foi quase certamente costurada na Inglaterra — os conquistados bordando a versão dos conquistadores. As fontes escritas dizem que ele foi abatido a golpes.',
        'Vinte anos depois, Guilherme mandou levantar o reino inteiro, propriedade por propriedade, até os arados e os porcos. Nada parecido com o Domesday Book foi tentado em qualquer lugar da Europa por séculos, e ele existe porque um conquistador precisava saber exatamente o que havia tomado.'
      ]
    }
  ],

  '10-15': [
    {
      year: 1815,
      title: 'He Won the Argument from the Island',
      title_pt: 'Ele Ganhou a Discussão a Partir da Ilha',
      era: 'Modern',
      region: 'Saint Helena', region_pt: 'Santa Helena',
      tag: 'Exile', tag_pt: 'Exílio',
      text: 'On 15 October 1815 Napoleon arrived at Saint Helena to begin his exile, four months after Waterloo. The island is one of the remotest inhabited places on earth — nineteen hundred kilometres from Africa, nearly three thousand from South America — and Britain kept some two thousand eight hundred soldiers and a naval squadron there for one prisoner. He had five and a half years left, in a damp house on a windswept plateau, and he spent them talking.',
      text_pt: 'Em 15 de outubro de 1815, Napoleão chegou a Santa Helena para começar o exílio, quatro meses depois de Waterloo. A ilha é um dos lugares habitados mais remotos da Terra — mil e novecentos quilômetros da África, quase três mil da América do Sul — e a Grã-Bretanha manteve ali cerca de dois mil e oitocentos soldados e um esquadrão naval para um único prisioneiro. Restavam-lhe cinco anos e meio, numa casa úmida sobre um planalto varrido pelo vento, e ele os passou falando.',
      facts: [
        'The memoirs he dictated there did more for his reputation than any of his battles. Napoleon as the thwarted liberal who would have unified Europe, undone by kings and aristocrats, was written at Longwood and sold enormously, and it is substantially the version that survives.',
        'The governor forbade anyone to address him as emperor, which he treated as the one subject worth being obstinate about for five years.',
        'He died in 1821, almost certainly of the stomach cancer that had killed his father, though there is enough arsenic in his hair to have kept the poisoning theories alive for two centuries. In 1840 France brought the body home and carried it under the Arc de Triomphe he had ordered built and never saw finished.'
      ],
      facts_pt: [
        'As memórias que ele ditou ali fizeram mais por sua reputação do que qualquer uma de suas batalhas. Napoleão como o liberal frustrado que teria unificado a Europa, desfeito por reis e aristocratas, foi escrito em Longwood, vendeu enormemente, e é substancialmente a versão que sobreviveu.',
        'O governador proibiu que o tratassem de imperador, o que ele tomou como o único assunto digno de teimosia por cinco anos.',
        'Morreu em 1821, quase certamente do câncer de estômago que matara seu pai, embora haja arsênico suficiente em seus cabelos para manter vivas por dois séculos as teses de envenenamento. Em 1840 a França trouxe o corpo de volta e o levou sob o Arco do Triunfo que ele mandara construir e nunca viu pronto.'
      ]
    }
  ],

  '10-16': [
    {
      year: 1793,
      title: 'The Charge Nature Refuses to Answer',
      title_pt: 'A Acusação que a Natureza Se Recusa a Responder',
      era: 'Modern',
      region: 'Paris', region_pt: 'Paris',
      tag: 'Execution', tag_pt: 'Execução',
      text: 'On 16 October 1793 Marie Antoinette was guillotined in Paris, nine months after her husband. Her trial had lasted two days and the verdict was never in question. She was thirty-seven, her hair had gone white, and she was taken to the scaffold in an open cart, which Louis had not been. The humiliation was the point, and on one count of the indictment it failed completely.',
      text_pt: 'Em 16 de outubro de 1793, Maria Antonieta foi guilhotinada em Paris, nove meses depois do marido. O julgamento durara dois dias e o veredito nunca esteve em questão. Tinha trinta e sete anos, os cabelos embranquecidos, e foi levada ao cadafalso numa carroça aberta, o que Luís não fora. A humilhação era o objetivo, e num dos itens da acusação ela falhou por completo.',
      facts: [
        'The prosecution accused her of incest with her eight-year-old son, on a statement taken from the boy. She refused to answer it, then turned to the women in the courtroom and said that if she had not replied, it was because nature itself refuses to answer such a charge laid against a mother. The room went with her and the subject was dropped.',
        'Let them eat cake is not hers. The line appears in Rousseau years before she ever arrived in France, attributed to an unnamed princess, and no source from her own lifetime puts it in her mouth.',
        'Her last recorded words were an apology. She stepped on the executioner’s foot on the scaffold and said she begged his pardon, she had not meant to do it.'
      ],
      facts_pt: [
        'A acusação a incriminou de incesto com o filho de oito anos, com base num depoimento extraído do menino. Ela se recusou a responder, voltou-se para as mulheres na sala e disse que, se não havia respondido, era porque a própria natureza se recusa a responder a tal acusação feita contra uma mãe. A sala ficou com ela e o assunto foi abandonado.',
        'O "que comam brioches" não é dela. A frase aparece em Rousseau anos antes de ela chegar à França, atribuída a uma princesa sem nome, e nenhuma fonte de seu tempo a põe em sua boca.',
        'Suas últimas palavras registradas foram um pedido de desculpas. Pisou no pé do executor no cadafalso e disse que lhe pedia perdão, não tivera a intenção.'
      ]
    }
  ],

  '10-17': [
    {
      year: 690,
      title: 'The Stele They Left Blank',
      title_pt: 'A Estela que Deixaram em Branco',
      era: 'Medieval',
      region: 'China', region_pt: 'China',
      tag: 'Dynasty', tag_pt: 'Dinastia',
      text: 'On 17 October 690 Wu Zetian declared the Zhou dynasty and took the title of emperor — the only woman in three thousand years of Chinese history to hold it in her own name rather than as a regent. She had been a consort, then the power behind her husband, then the power behind two of her sons. At about sixty-six she stopped working through men.',
      text_pt: 'Em 17 de outubro de 690, Wu Zetian declarou a dinastia Zhou e tomou o título de imperador — a única mulher em três mil anos de história chinesa a detê-lo em seu próprio nome, e não como regente. Fora concubina, depois o poder por trás do marido, depois o poder por trás de dois de seus filhos. Por volta dos sessenta e seis anos parou de agir através de homens.',
      facts: [
        'She widened the examinations. High office had largely belonged to a closed circle of aristocratic families; she recruited by written test and promoted men with no connections at all, partly because men with no connections owed everything to her.',
        'She had new written characters invented, including one for her own name, and commissioned the colossal Buddha at Longmen — whose face, it has long been said, was modelled on hers.',
        'Her memorial tablet at her tomb is blank. A great stele stands there with nothing carved into it, and nobody knows whether she left it that way because she judged her deeds beyond words, or because the men who came after could not agree what to write about a woman who had been emperor.'
      ],
      facts_pt: [
        'Ela ampliou os exames. Os altos cargos pertenciam em grande parte a um círculo fechado de famílias aristocráticas; ela recrutava por prova escrita e promovia homens sem relação alguma, em parte porque homens sem relações deviam tudo a ela.',
        'Mandou inventar novos caracteres escritos, inclusive um para o próprio nome, e encomendou o Buda colossal de Longmen — cujo rosto, diz-se há muito, foi modelado no dela.',
        'A lápide memorial em seu túmulo está em branco. Ali se ergue uma grande estela sem nada entalhado, e ninguém sabe se ela a deixou assim por julgar seus feitos acima das palavras, ou se os homens que vieram depois não conseguiram concordar sobre o que escrever a respeito de uma mulher que foi imperador.'
      ]
    }
  ],

  '10-18': [
    {
      year: 1009,
      title: 'His Mother Was Christian',
      title_pt: 'A Mãe Dele Era Cristã',
      era: 'Medieval',
      region: 'Jerusalem', region_pt: 'Jerusalém',
      tag: 'Destruction', tag_pt: 'Destruição',
      text: 'On 18 October 1009 the Fatimid caliph al-Hakim ordered the Church of the Holy Sepulchre in Jerusalem destroyed, and the work went to bedrock — the rock-cut tomb inside it was hacked away. The same ruler banned chess, prohibited a particular vegetable, and at one point forbade cobblers to make women\'s shoes so that women could not leave their houses.',
      text_pt: 'Em 18 de outubro de 1009, o califa fatímida al-Hakim ordenou a destruição da Igreja do Santo Sepulcro, em Jerusalém, e o trabalho desceu até a rocha viva — o sepulcro escavado em seu interior foi picado fora. O mesmo governante proibiu o xadrez, vetou um determinado legume e, em certo momento, proibiu os sapateiros de fazer calçados femininos para que as mulheres não pudessem sair de casa.',
      facts: [
        'His mother was a Christian and two of his uncles were Orthodox patriarchs. Before the end of his reign he permitted churches to be rebuilt, and the destruction was reversed in the 1040s with Byzantine money.',
        'The consequences landed a continent away. Rumours that Jews had put the caliph up to it led to attacks on Jewish communities in Rouen, Orléans and Mainz within a year or two, and the destruction is routinely named among the long causes of the First Crusade, eighty-seven years later.',
        'He vanished in 1021. He rode out at night into the hills above Cairo and did not come back; his donkey was found, and his bloodstained clothing, and nothing further was ever established. The Druze faith descends from the men who had accepted his claim to divinity and who hold that he did not die.'
      ],
      facts_pt: [
        'Sua mãe era cristã e dois de seus tios eram patriarcas ortodoxos. Antes do fim de seu reinado ele permitiu que igrejas fossem reconstruídas, e a destruição foi revertida na década de 1040 com dinheiro bizantino.',
        'As consequências caíram a um continente de distância. Rumores de que judeus teriam instigado o califa levaram a ataques a comunidades judaicas em Rouen, Orléans e Mainz em um ou dois anos, e a destruição é rotineiramente citada entre as causas longas da Primeira Cruzada, oitenta e sete anos depois.',
        'Ele desapareceu em 1021. Saiu a cavalo de noite para as colinas acima do Cairo e não voltou; acharam seu burro e suas roupas manchadas de sangue, e nada mais foi jamais estabelecido. A fé drusa descende dos homens que aceitaram sua pretensão à divindade e que sustentam que ele não morreu.'
      ]
    }
  ],

  '10-19': [
    {
      year: -202,
      title: 'Rome Finally Had the Better Cavalry',
      title_pt: 'Roma Finalmente Teve a Melhor Cavalaria',
      era: 'Classical',
      region: 'Zama, North Africa', region_pt: 'Zama, Norte da África',
      tag: 'Battle', tag_pt: 'Batalha',
      text: 'On 19 October 202 BCE, at Zama in North Africa, Scipio defeated Hannibal and the Second Punic War was over. Scipio had spent fifteen years studying the man in front of him, and he beat him with his own method. The thing that had made Hannibal unbeatable in Italy was his horsemen; at Zama the horsemen were Roman, because the Numidians had changed sides. Carthage asked for terms within weeks.',
      text_pt: 'Em 19 de outubro de 202 AEC, em Zama, no norte da África, Cipião derrotou Aníbal e a Segunda Guerra Púnica acabou. Cipião passara quinze anos estudando o homem à sua frente, e o venceu com o método dele. O que tornara Aníbal invencível na Itália eram seus cavaleiros; em Zama os cavaleiros eram romanos, porque os númidas haviam trocado de lado. Cartago pediu condições em poucas semanas.',
      facts: [
        'The elephants were turned back on their own army. Scipio opened lanes in his line so the charge could run through it instead of into it, and had the trumpets blown to panic them; a good part of the herd wheeled round into the Carthaginian cavalry.',
        'The two of them are said to have met and talked before the battle, through interpreters, and failed to agree on terms.',
        'Both ended badly. Hannibal went into exile, served Rome’s enemies, and poisoned himself in 183 rather than be handed over. Scipio, prosecuted by rivals at home, withdrew to the country and died at about the same time, reportedly leaving instructions that he not be buried in the city he had saved.'
      ],
      facts_pt: [
        'Os elefantes foram voltados contra o próprio exército. Cipião abriu corredores em sua linha para que a carga passasse por ela em vez de contra ela, e mandou tocar as trombetas para apavorá-los; boa parte da manada girou de volta sobre a cavalaria cartaginesa.',
        'Conta-se que os dois se encontraram e conversaram antes da batalha, por intérpretes, e não chegaram a acordo sobre os termos.',
        'Os dois terminaram mal. Aníbal exilou-se, serviu aos inimigos de Roma e envenenou-se em 183 em vez de ser entregue. Cipião, processado por rivais em casa, retirou-se para o campo e morreu mais ou menos na mesma época, tendo deixado, ao que se conta, a instrução de não ser enterrado na cidade que salvara.'
      ]
    },
    {
      year: 1469,
      title: 'Married on a Forged Dispensation',
      title_pt: 'Casados com uma Dispensa Falsificada',
      era: 'Medieval',
      region: 'Valladolid, Castile', region_pt: 'Valladolid, Castela',
      tag: 'Union', tag_pt: 'União',
      text: 'On 19 October 1469 Ferdinand of Aragon married Isabella of Castile at Valladolid, the union that would eventually produce Spain. He was seventeen and had crossed into Castile disguised as a servant in a merchant\'s party, because her brother the king had men out to stop the wedding. She was eighteen and had left that brother\'s court without permission. They were second cousins, which meant they needed a papal dispensation, and they did not have one.',
      text_pt: 'Em 19 de outubro de 1469, Fernando de Aragão casou-se com Isabel de Castela em Valladolid, a união que acabaria produzindo a Espanha. Ele tinha dezessete anos e entrara em Castela disfarçado de criado numa comitiva de mercadores, porque o irmão dela, o rei, tinha homens em campo para impedir o casamento. Ela tinha dezoito e havia deixado a corte desse irmão sem permissão. Eram primos em segundo grau, o que significava precisar de dispensa papal, e eles não tinham nenhuma.',
      facts: [
        'The dispensation they produced at the ceremony was a counterfeit. The pope had refused to grant one, so a forged bull was manufactured; a genuine one arrived three years later, once the marriage was a fact that had to be dealt with.',
        'It did not unify anything, legally. Aragon and Castile kept their own laws, parliaments, currencies and customs frontiers for more than two centuries after this, and the single state called Spain is an eighteenth-century creation. What 1469 produced was one couple wearing two crowns.',
        'Their own line ran out within two generations. Every child who could have inherited died young or mad, and the two crowns passed to a grandson raised in Flanders who barely spoke Castilian — so the marriage that assembled Spain delivered it to the Habsburgs.'
      ],
      facts_pt: [
        'A dispensa que apresentaram na cerimônia era falsa. O papa havia recusado conceder uma, então fabricou-se uma bula falsificada; a autêntica chegou três anos depois, quando o casamento já era um fato com que havia de se lidar.',
        'Não unificou nada, juridicamente. Aragão e Castela mantiveram suas próprias leis, parlamentos, moedas e fronteiras aduaneiras por mais de dois séculos depois disto, e o Estado único chamado Espanha é uma criação do século XVIII. O que 1469 produziu foi um casal usando duas coroas.',
        'A linhagem deles se esgotou em duas gerações. Todo filho que poderia herdar morreu jovem ou enlouqueceu, e as duas coroas passaram a um neto criado em Flandres que quase não falava castelhano — de modo que o casamento que montou a Espanha a entregou aos Habsburgos.'
      ]
    }
  ],

  '10-20': [
    {
      year: 1781,
      title: 'A Church That Must Not Look Like One',
      title_pt: 'Uma Igreja que Não Podia Parecer uma',
      era: 'Early Modern',
      region: 'Austria', region_pt: 'Áustria',
      tag: 'Tolerance', tag_pt: 'Tolerância',
      text: 'On 20 October 1781 the Patent of Toleration took effect in the Habsburg lands, granting Lutherans, Calvinists and the Orthodox the right to worship, which no Habsburg had done. The permission came with building regulations: a tolerated congregation could put up a prayer house, but it was to have no entrance on the street, no tower and no bells. It had to be a building that did not look like a church from outside.',
      text_pt: 'Em 20 de outubro de 1781, a Patente de Tolerância entrou em vigor nas terras dos Habsburgos, concedendo a luteranos, calvinistas e ortodoxos o direito de culto, o que nenhum Habsburgo havia feito. A permissão vinha com normas de construção: uma congregação tolerada podia erguer uma casa de oração, mas ela não deveria ter entrada para a rua, nem torre, nem sinos. Tinha de ser um edifício que, visto de fora, não parecesse uma igreja.',
      facts: [
        'Tolerated was not equal. The point of the rules was that the faith could exist and could not be seen to exist, and the dates of the patent differ from territory to territory because it was issued piecemeal across the Habsburg lands.',
        'The same reforming impulse abolished serfdom, closed some seven hundred contemplative monasteries, made German the language of administration everywhere, and at one point required reusable coffins to save timber — which produced such an outcry that he withdrew it within months.',
        'Almost all of it was undone. Most of his six thousand decrees were revoked within a few years of his death, and the epitaph he wrote for himself says that here lies a prince of pure intentions who had the misfortune to see all his plans fail.'
      ],
      facts_pt: [
        'Tolerado não era igual. O sentido das regras era que a fé pudesse existir e não pudesse ser vista existindo, e as datas do édito variam de território para território porque ele foi emitido aos pedaços pelas terras dos Habsburgos.',
        'O mesmo impulso reformista aboliu a servidão, fechou cerca de setecentos mosteiros contemplativos, tornou o alemão a língua da administração em toda parte e, em certo momento, exigiu caixões reutilizáveis para economizar madeira — o que gerou tamanho protesto que ele recuou em poucos meses.',
        'Quase tudo foi desfeito. A maior parte de seus seis mil decretos foi revogada poucos anos após sua morte, e o epitáfio que escreveu para si diz que ali jaz um príncipe de intenções puras que teve o infortúnio de ver todos os seus planos fracassarem.'
      ]
    },
    {
      year: 1803,
      title: 'Nobody Knew Where It Ended',
      title_pt: 'Ninguém Sabia Onde Terminava',
      era: 'Modern',
      region: 'Washington', region_pt: 'Washington',
      tag: 'Treaty', tag_pt: 'Tratado',
      text: 'On 20 October 1803 the United States Senate ratified the Louisiana Purchase: two million square kilometres for fifteen million dollars, roughly three cents an acre, doubling the size of the country. The treaty described what was being sold as having the same extent it had in the hands of Spain, which nobody could define, and the American minister in Paris had asked and been told not to worry about it.',
      text_pt: 'Em 20 de outubro de 1803, o Senado dos Estados Unidos ratificou a Compra da Louisiana: dois milhões de quilômetros quadrados por quinze milhões de dólares, algo como três centavos o acre, dobrando o tamanho do país. O tratado descrevia o que estava sendo vendido como tendo a mesma extensão que tinha nas mãos da Espanha, coisa que ninguém sabia definir, e o ministro americano em Paris havia perguntado e ouvido que não se preocupasse com isso.',
      facts: [
        'Asked what exactly France was selling, Talleyrand told the Americans they had made a noble bargain and would no doubt make the most of it. Lewis and Clark set out the following year partly to find out what had been bought.',
        'Jefferson did not believe he had the power to do it. He read the Constitution strictly and it gave no authority to acquire territory; he drafted an amendment to legalise the purchase, then dropped it on the grounds that Napoleon might change his mind, and signed anyway.',
        'The land was home to dozens of nations who were not parties to the treaty and were not told of it, and the sale also moved tens of thousands of residents, enslaved people among them, from one sovereignty to another by signature.'
      ],
      facts_pt: [
        'Perguntado sobre o que exatamente a França estava vendendo, Talleyrand respondeu aos americanos que haviam feito um belo negócio e sem dúvida tirariam o melhor proveito dele. Lewis e Clark partiram no ano seguinte em parte para descobrir o que fora comprado.',
        'Jefferson não acreditava ter poder para fazer aquilo. Lia a Constituição de modo estrito e ela não dava autoridade para adquirir território; chegou a redigir uma emenda que legalizasse a compra, depois a abandonou sob o argumento de que Napoleão poderia mudar de ideia, e assinou mesmo assim.',
        'A terra era o lar de dezenas de nações que não eram parte do tratado e não foram informadas dele, e a venda também transferiu dezenas de milhares de residentes, pessoas escravizadas entre eles, de uma soberania para outra por assinatura.'
      ]
    }
  ],

  '10-21': [
    {
      year: 1879,
      title: 'He Did Not Invent the Light Bulb',
      title_pt: 'Ele Não Inventou a Lâmpada',
      era: 'Modern',
      region: 'Menlo Park, New Jersey', region_pt: 'Menlo Park, Nova Jersey',
      tag: 'Invention', tag_pt: 'Invenção',
      text: 'On 21 October 1879, in the Menlo Park laboratory, Edison\'s carbon-filament lamp burned for thirteen and a half hours before it gave out — the result he had been working toward, and the basis of the patent he filed two weeks later. At least twenty people had made an incandescent lamp before him, and one of them, in England, would sue him and win.',
      text_pt: 'Em 21 de outubro de 1879, no laboratório de Menlo Park, a lâmpada de filamento de carbono de Edison queimou por treze horas e meia antes de ceder — o resultado que ele perseguia, e a base da patente que depositou duas semanas depois. Ao menos vinte pessoas haviam feito uma lâmpada incandescente antes dele, e uma delas, na Inglaterra, o processaria e venceria.',
      facts: [
        'Joseph Swan had demonstrated a working lamp in England and took Edison to court there successfully, which is why the British company ended up being called Ediswan.',
        'What Edison actually contributed was a system rather than a lamp. A high-resistance filament meant many bulbs could run in parallel off one circuit, and around that he built generators, meters, sockets, switches and wiring. He was selling electricity as a service; the bulb was what made people want to buy it.',
        'The filament that went into production was carbonised bamboo. He had people testing thousands of materials, and the one that burned for twelve hundred hours came from Japan.'
      ],
      facts_pt: [
        'Joseph Swan havia demonstrado uma lâmpada funcional na Inglaterra e levou Edison aos tribunais de lá com sucesso, razão pela qual a empresa britânica acabou se chamando Ediswan.',
        'O que Edison de fato contribuiu foi um sistema, não uma lâmpada. Um filamento de alta resistência permitia que muitas lâmpadas funcionassem em paralelo num mesmo circuito, e em torno disso ele construiu geradores, medidores, soquetes, interruptores e fiação. Vendia eletricidade como serviço; a lâmpada era o que fazia as pessoas quererem comprá-la.',
        'O filamento que entrou em produção era bambu carbonizado. Ele tinha gente testando milhares de materiais, e o que queimou por mil e duzentas horas veio do Japão.'
      ]
    }
  ],

  '10-22': [
    {
      year: 1721,
      title: 'Emperor, Not Tsar',
      title_pt: 'Imperador, Não Tsar',
      era: 'Early Modern',
      region: 'Saint Petersburg', region_pt: 'São Petersburgo',
      tag: 'Empire', tag_pt: 'Império',
      text: 'On 22 October 1721, a month after twenty-one years of war with Sweden ended and Russia took the Baltic, the Senate proclaimed Peter emperor and Russia an empire. It offered him three titles, and the one that mattered was imperator. Tsar had come to Russia through Byzantium; imperator was Latin, and choosing it was a statement about which civilisation the country now considered itself part of.',
      text_pt: 'Em 22 de outubro de 1721, um mês depois de terminarem vinte e um anos de guerra com a Suécia e de a Rússia ficar com o Báltico, o Senado proclamou Pedro imperador e a Rússia um império. Ofereceu-lhe três títulos, e o que importava era imperator. Tsar chegara à Rússia pela via bizantina; imperator era latino, e escolhê-lo era uma declaração sobre de qual civilização o país agora se considerava parte.',
      facts: [
        'Several European courts refused to use the title for decades, because emperor implied rank above a king and they were not willing to concede it. Poland held out until 1764.',
        'In the same year he abolished the Patriarchate of Moscow and replaced it with a committee run by a lay official answerable to him, turning the Russian church into a department of state. It did not have a patriarch again until 1917.',
        'The capital he was proclaimed in had been swamp eighteen years earlier. It was built by conscripted labour in conditions that killed an unknown number of workers, and the figure has never been settled because nobody was counting.'
      ],
      facts_pt: [
        'Várias cortes europeias se recusaram a usar o título por décadas, porque imperador implicava posição acima de rei e elas não estavam dispostas a conceder isso. A Polônia resistiu até 1764.',
        'No mesmo ano ele aboliu o Patriarcado de Moscou e o substituiu por um colegiado dirigido por um funcionário leigo subordinado a ele, transformando a igreja russa em repartição do Estado. Ela só voltaria a ter patriarca em 1917.',
        'A capital em que foi proclamado era pântano dezoito anos antes. Foi construída com trabalho forçado em condições que mataram um número desconhecido de operários, e esse número nunca foi estabelecido porque ninguém estava contando.'
      ]
    }
  ],

  '10-23': [
    {
      year: 425,
      title: 'Emperor at Six',
      title_pt: 'Imperador aos Seis',
      era: 'Classical',
      region: 'Rome', region_pt: 'Roma',
      tag: 'Succession', tag_pt: 'Sucessão',
      text: 'On 23 October 425 a six-year-old was installed as Valentinian III, emperor of the Roman West, by his cousin in Constantinople, after an army from the East put down a usurper on his behalf. He went on to reign for thirty years, which is longer than almost anyone managed, and he used the last months of it to destroy the one man holding the West together.',
      text_pt: 'Em 23 de outubro de 425, um menino de seis anos foi instalado como Valentiniano III, imperador do Ocidente romano, por seu primo em Constantinopla, depois que um exército do Oriente derrubou um usurpador em seu nome. Ele reinaria por trinta anos, mais do que quase todos conseguiram, e usou os últimos meses disso para destruir o único homem que mantinha o Ocidente de pé.',
      facts: [
        'His mother ran the empire for him. Galla Placidia had been carried off as a hostage when the Visigoths sacked Rome fifteen years earlier and had married their king’s successor; she governed the West in her son’s name for the next twelve years.',
        'In 455 he stabbed Aetius to death with his own hand in the palace — the general who had stopped Attila four years before. A senator is said to have told him afterwards that he had cut off his right hand with his left.',
        'Six months later two of Aetius’s men killed him while he was practising archery on the Campus Martius. Within three months the Vandals had sacked Rome, and no emperor in the West after him belonged to a dynasty.'
      ],
      facts_pt: [
        'Sua mãe governou o império por ele. Gala Placídia fora levada como refém quando os visigodos saquearam Roma quinze anos antes e se casara com o sucessor do rei deles; governou o Ocidente em nome do filho pelos doze anos seguintes.',
        'Em 455 ele apunhalou Aécio com as próprias mãos dentro do palácio — o general que detivera Átila quatro anos antes. Conta-se que um senador lhe disse depois que ele cortara a mão direita com a esquerda.',
        'Seis meses mais tarde, dois homens de Aécio o mataram enquanto ele praticava arco no Campo de Marte. Em menos de três meses os vândalos saquearam Roma, e nenhum imperador do Ocidente depois dele pertenceu a uma dinastia.'
      ]
    }
  ],

  '10-24': [
    {
      year: 1930,
      title: 'The Pact That Broke',
      title_pt: 'O Pacto que se Rompeu',
      era: 'Modern',
      region: 'Brazil', region_pt: 'Brasil',
      tag: 'Coup', tag_pt: 'Golpe',
      text: 'On 24 October 1930 a military junta removed the Brazilian president and handed power, days later, to a man who had lost the election that March — ending the First Republic and opening fifteen years of Getúlio Vargas. What had actually collapsed was an arrangement: the presidency had been alternating between São Paulo and Minas Gerais by agreement, and the incumbent had broken it by backing a second paulista in a row.',
      text_pt: 'Em 24 de outubro de 1930, uma junta militar depôs o presidente brasileiro e entregou o poder, dias depois, a um homem que perdera a eleição de março — encerrando a Primeira República e abrindo quinze anos de Getúlio Vargas. O que havia ruído, na verdade, era um arranjo: a presidência vinha se alternando entre São Paulo e Minas Gerais por acordo, e o ocupante do cargo o rompera ao apoiar um segundo paulista seguido.',
      facts: [
        'The spark had almost nothing to do with national politics. Vargas’s running mate was shot dead in a Recife pastry shop in a private quarrel over seized letters, and a personal feud became the cause that the movement needed.',
        'It is usually called bloodless, and relative to a civil war it was, but there was fighting in the north-east and the south and the dead were counted in the hundreds rather than in nobody at all.',
        'Vargas held power for fifteen years without ever being elected to it, was removed by the army in 1945, was elected president by popular vote in 1950, and shot himself in the chest in the presidential palace in 1954, leaving a letter.'
      ],
      facts_pt: [
        'O estopim quase nada tinha a ver com política nacional. O companheiro de chapa de Vargas foi morto a tiros numa confeitaria do Recife, numa briga particular por cartas apreendidas, e uma desavença pessoal virou a causa de que o movimento precisava.',
        'Costuma-se chamá-lo de incruento e, comparado a uma guerra civil, foi; mas houve combates no Nordeste e no Sul, e os mortos se contaram às centenas, não em ninguém.',
        'Vargas manteve o poder por quinze anos sem nunca ter sido eleito para ele, foi deposto pelo Exército em 1945, foi eleito presidente pelo voto popular em 1950 e deu um tiro no peito no palácio presidencial em 1954, deixando uma carta.'
      ]
    }
  ],

  '10-25': [
    {
      year: 473,
      title: 'The Child Who Crowned His Father',
      title_pt: 'A Criança que Coroou o Pai',
      era: 'Classical',
      region: 'Constantinople', region_pt: 'Constantinopla',
      tag: 'Coronation', tag_pt: 'Coroação',
      text: 'On 25 October 473 the emperor Leo I raised his grandson, a boy of about six, to imperial rank as Leo II. Leo I had no son of his own. When the old man died a few months later the child was sole emperor of the East — and the first thing done in his name was to make his own father emperor alongside him, because his father could not have become one on his own account.',
      text_pt: 'Em 25 de outubro de 473, o imperador Leão I elevou seu neto, um menino de uns seis anos, à dignidade imperial como Leão II. Leão I não tinha filho homem. Quando o velho morreu poucos meses depois, a criança era imperador único do Oriente — e a primeira coisa feita em seu nome foi tornar o próprio pai imperador ao seu lado, porque o pai não poderia tê-lo sido por conta própria.',
      facts: [
        'Zeno was an Isaurian, from a mountain people Constantinople regarded as barely civilised and had recruited mainly as a counterweight to its Germanic troops. Legitimacy had to pass through the child, who placed the diadem on his father’s head.',
        'The boy reigned about ten months and died at seven. There were immediate rumours that his father or his grandmother had poisoned him, and nothing was ever established either way.',
        'The father he had crowned ruled for seventeen years, and it was to him that Odoacer sent the Western imperial regalia in 476 — so the man who received his title from a small boy is the one who ended up holding the only Roman title left.'
      ],
      facts_pt: [
        'Zenão era isáurico, de um povo de montanha que Constantinopla considerava mal civilizado e recrutara sobretudo como contrapeso às suas tropas germânicas. A legitimidade tinha de passar pela criança, que pôs o diadema na cabeça do pai.',
        'O menino reinou cerca de dez meses e morreu aos sete. Correram de imediato rumores de que o pai ou a avó o haviam envenenado, e nada jamais foi estabelecido num sentido ou no outro.',
        'O pai que ele coroou governou dezessete anos, e foi a ele que Odoacro enviou as insígnias imperiais do Ocidente em 476 — de modo que o homem que recebeu seu título de um menino pequeno é quem acabou com o único título romano que restava.'
      ]
    }
  ],

  '10-26': [
    {
      year: 1520,
      title: 'The Crown the Bankers Paid For',
      title_pt: 'A Coroa que os Banqueiros Pagaram',
      era: 'Renaissance',
      region: 'Aachen', region_pt: 'Aquisgrano',
      tag: 'Election', tag_pt: 'Eleição',
      text: 'On 26 October 1520 Charles V was crowned at Aachen, adding the imperial title to Spain and its American possessions, Naples and Sicily, the Low Countries and the Austrian lands. He was twenty. The imperial crown was elective, and he had won the election the year before by outbidding the king of France for seven votes.',
      text_pt: 'Em 26 de outubro de 1520, Carlos V foi coroado em Aquisgrano, somando o título imperial à Espanha e suas possessões americanas, a Nápoles e Sicília, aos Países Baixos e às terras austríacas. Tinha vinte anos. A coroa imperial era eletiva, e ele vencera a eleição no ano anterior ao cobrir o lance do rei da França por sete votos.',
      facts: [
        'The bill came to something like 850,000 florins, nearly all of it borrowed from the Fugger bank in Augsburg. Jakob Fugger later wrote to the emperor to remind him, in plain terms, that without him he would not be wearing the crown.',
        'None of the inheritance was planned. Spain and the Americas came through one grandmother, Burgundy and the Low Countries through his father, Austria and the imperial claim through the other grandfather — four separate deaths landing on one person.',
        'He gave it all away. In 1555 and 1556 he abdicated everything, which almost no monarch does, divided it between his brother and his son, and retired to a monastery in Spain, where he spent his last years among a collection of clocks.'
      ],
      facts_pt: [
        'A conta chegou a algo como 850 mil florins, quase tudo emprestado pelo banco Fugger, de Augsburgo. Jakob Fugger escreveria depois ao imperador para lembrá-lo, em termos diretos, de que sem ele não estaria usando aquela coroa.',
        'Nada da herança foi planejado. A Espanha e as Américas vieram por uma avó, a Borgonha e os Países Baixos pelo pai, a Áustria e a pretensão imperial pelo outro avô — quatro mortes separadas aterrissando sobre uma só pessoa.',
        'Ele devolveu tudo. Em 1555 e 1556 abdicou de tudo, o que quase nenhum monarca faz, dividiu entre o irmão e o filho, e retirou-se para um mosteiro na Espanha, onde passou os últimos anos em meio a uma coleção de relógios.'
      ]
    }
  ],

  '10-27': [
    {
      year: 312,
      title: 'The Earliest Account Has No Cross',
      title_pt: 'O Relato Mais Antigo Não Tem Cruz',
      era: 'Classical',
      region: 'Milvian Bridge, Rome', region_pt: 'Ponte Mílvia, Roma',
      tag: 'Vision', tag_pt: 'Visão',
      text: 'On 27 October 312, on the eve of the battle at the Milvian Bridge that would make him master of the Roman West, Constantine reported a sign from the Christian God and had his soldiers mark it on their shields. He won the next day, and within a year had made Christianity legal across the empire. The story everyone knows — a cross of light in the afternoon sky, seen by a whole army — comes from a biography written twenty-five years later, after he was dead. The earliest surviving account has no sky and no cross, only a dream the night before.',
      text_pt: 'Em 27 de outubro de 312, na véspera da batalha da Ponte Mílvia que o tornaria senhor do Ocidente romano, Constantino relatou um sinal do Deus cristão e mandou que seus soldados o marcassem nos escudos. Venceu no dia seguinte e, em menos de um ano, tornou o cristianismo legal em todo o império. A história que todos conhecem — uma cruz de luz no céu da tarde, vista por um exército inteiro — vem de uma biografia escrita vinte e cinco anos depois, com ele já morto. O relato mais antigo que sobreviveu não tem céu nem cruz, apenas um sonho na véspera.',
      facts: [
        'Lactantius, the early source, says Constantine was instructed in his sleep to put a sign on his soldiers’ shields and did so in the morning. Eusebius, the late one, adds the vision in the sky and says the emperor swore to him personally that it had happened.',
        'Whatever it was changed his politics quickly and his private religion slowly. He went on minting the unconquered sun on his coinage for years, and was not baptised until he was dying, a quarter of a century later.',
        'His opponent drowned in the retreat. Maxentius had thrown a bridge of boats across the Tiber beside the broken stone one, and it went down under the weight of his own army going back across it.'
      ],
      facts_pt: [
        'Lactâncio, a fonte antiga, diz que Constantino foi instruído durante o sono a pôr um sinal nos escudos de seus soldados e assim fez pela manhã. Eusébio, a fonte tardia, acrescenta a visão no céu e afirma que o imperador lhe jurou pessoalmente que aquilo acontecera.',
        'O que quer que tenha sido mudou sua política depressa e sua religião pessoal devagar. Ele seguiu cunhando o sol invicto em suas moedas por anos, e só foi batizado no leito de morte, um quarto de século depois.',
        'Seu adversário se afogou na retirada. Magêncio mandara lançar uma ponte de barcos sobre o Tibre ao lado da ponte de pedra rompida, e ela cedeu sob o peso do próprio exército voltando por ela.'
      ]
    }
  ],

  '10-28': [
    {
      year: 1492,
      title: 'He Was Looking for Japan',
      title_pt: 'Ele Procurava o Japão',
      era: 'Renaissance',
      region: 'Cuba', region_pt: 'Cuba',
      tag: 'Exploration', tag_pt: 'Exploração',
      text: 'On 28 October 1492 Columbus reached the coast of Cuba and concluded it was Cipango, the island of Japan, or perhaps the edge of the Chinese mainland. He sent a party inland carrying a letter from Ferdinand and Isabella addressed to the Great Khan, with an interpreter who spoke Arabic and Hebrew, those being the languages thought useful in Asia.',
      text_pt: 'Em 28 de outubro de 1492, Colombo alcançou a costa de Cuba e concluiu que era Cipango, a ilha do Japão, ou talvez a borda do continente chinês. Mandou um grupo terra adentro levando uma carta de Fernando e Isabel endereçada ao Grande Cã, com um intérprete que falava árabe e hebraico, por serem essas as línguas tidas como úteis na Ásia.',
      facts: [
        'The embassy came back having found villages, and people rolling dried leaves into tubes, setting fire to one end and drawing the smoke in through the other. It is the first European description of smoking.',
        'The experts who had rejected him were right. His case rested on a small earth and a very wide Asia; the commissions in Portugal and Spain had the circumference roughly correct and told him the crossing could not be survived. It could not. He is in the record at all because two unknown continents happened to be in the way.',
        'He never accepted it. Across four voyages and to the end of his life he maintained that he had reached Asia, and on the third he argued that he had found the earthly paradise.'
      ],
      facts_pt: [
        'A embaixada voltou tendo encontrado aldeias, e pessoas enrolando folhas secas em tubos, ateando fogo a uma ponta e puxando a fumaça pela outra. É a primeira descrição europeia do ato de fumar.',
        'Os especialistas que o haviam rejeitado estavam certos. Seu argumento se apoiava numa Terra pequena e numa Ásia larguíssima; as comissões de Portugal e da Espanha tinham a circunferência aproximadamente correta e lhe disseram que a travessia não era sobrevivível. Não era. Ele está no registro histórico porque dois continentes desconhecidos calharam de estar no caminho.',
        'Ele nunca aceitou isso. Ao longo de quatro viagens e até o fim da vida sustentou que chegara à Ásia, e na terceira argumentou que encontrara o paraíso terreal.'
      ]
    }
  ],

  '10-29': [
    {
      year: 1390,
      title: 'The Day Sorcery Became a Felony',
      title_pt: 'O Dia em que Feitiçaria Virou Crime',
      era: 'Medieval',
      region: 'Paris', region_pt: 'Paris',
      tag: 'Witchcraft', tag_pt: 'Bruxaria',
      text: 'On 29 October 1390 two women were brought before the Parlement of Paris on charges of sorcery, in the first witchcraft trial held in the city, and were condemned. That is what makes the case matter: magic had largely been something confessors dealt with by penance, and here it was tried by the king\'s judges, as a capital crime, in a secular court.',
      text_pt: 'Em 29 de outubro de 1390, duas mulheres foram levadas ao Parlamento de Paris sob acusação de feitiçaria, no primeiro julgamento de bruxaria realizado na cidade, e foram condenadas. É isso que torna o caso importante: magia era, em larga medida, assunto que os confessores resolviam com penitência, e ali foi julgada pelos juízes do rei, como crime capital, num tribunal secular.',
      facts: [
        'That transfer is the whole significance — from sin to felony, from the confessional to the scaffold. The great persecutions were still a century and a half away, and when they came the sentences were handed down overwhelmingly by secular courts like this one.',
        'The first of the accused confessed under torture, withdrew the confession, and was tortured again. Withdrawing it was treated as evidence of deeper guilt rather than as grounds for doubt.',
        'Estimates of those executed for witchcraft across Europe over the following three centuries run to forty or fifty thousand, the great majority of them women. The trials in Massachusetts that ended the practice in the English-speaking world were three hundred years after this one.'
      ],
      facts_pt: [
        'Essa transferência é toda a importância do caso — de pecado a crime, do confessionário ao cadafalso. As grandes perseguições ainda estavam a um século e meio de distância e, quando vieram, as sentenças foram proferidas esmagadoramente por tribunais seculares como este.',
        'A primeira das acusadas confessou sob tortura, retirou a confissão e foi torturada de novo. Retirá-la foi tratado como prova de culpa mais profunda, não como motivo de dúvida.',
        'As estimativas de executados por bruxaria na Europa ao longo dos três séculos seguintes chegam a quarenta ou cinquenta mil pessoas, a grande maioria mulheres. Os julgamentos de Massachusetts que encerraram a prática no mundo de língua inglesa aconteceram trezentos anos depois deste.'
      ]
    }
  ],

  '10-30': [
    {
      year: 130,
      title: 'A God Made for a Drowned Boy',
      title_pt: 'Um Deus Feito para um Menino Afogado',
      era: 'Classical',
      region: 'Nile, Egypt', region_pt: 'Nilo, Egito',
      tag: 'Cult', tag_pt: 'Culto',
      text: 'On 30 October 130 Hadrian founded the city of Antinoöpolis on the Nile, a Greek foundation with Greek laws and settlers, in honour of his companion Antinous — who had drowned in the river a few weeks earlier, and nobody has ever established how. Then he did something no emperor had done for a private person. He made him a god.',
      text_pt: 'Em 30 de outubro de 130, Adriano fundou a cidade de Antinoópolis às margens do Nilo, uma fundação grega com leis e colonos gregos, em honra de seu companheiro Antínoo — que se afogara no rio poucas semanas antes, sem que nunca se estabelecesse como. Em seguida fez algo que nenhum imperador fizera por um particular. Transformou-o num deus.',
      facts: [
        'Deification belonged to emperors and their families. Antinous was a provincial Greek teenager who had held no office and done nothing, and the cult was not a formality: there were temples from Egypt to Italy, games held in his name, and a group of stars that Hadrian identified as him.',
        'More ancient portraits of him survive than of almost anyone else. Something over a hundred sculptures have been identified, a number exceeded only by Augustus and by Hadrian — so one of the three most reproduced faces of the Roman world belongs to a boy of nineteen with no rank at all.',
        'The city he was buried near was still standing in 1800 and was surveyed and drawn by Napoleon’s expedition. Within about twenty years it had been pulled apart for building stone and burned for lime to supply a sugar factory. What survives of Antinoöpolis is mostly those drawings.'
      ],
      facts_pt: [
        'A divinização pertencia aos imperadores e às suas famílias. Antínoo era um adolescente grego de província que não ocupara cargo algum nem fizera nada, e o culto não foi formalidade: houve templos do Egito à Itália, jogos em seu nome e um grupo de estrelas que Adriano identificou como sendo ele.',
        'Sobrevivem mais retratos antigos dele do que de quase qualquer outra pessoa. Foram identificadas pouco mais de cem esculturas, número superado apenas por Augusto e por Adriano — de modo que um dos três rostos mais reproduzidos do mundo romano pertence a um rapaz de dezenove anos sem posição alguma.',
        'A cidade erguida perto de onde ele foi sepultado ainda estava de pé em 1800 e foi levantada e desenhada pela expedição de Napoleão. Em cerca de vinte anos havia sido desmontada para pedra de construção e queimada para cal, a fim de abastecer uma usina de açúcar. O que resta de Antinoópolis são sobretudo aqueles desenhos.'
      ]
    }
  ],

  '10-31': [
    {
      year: 1517,
      title: 'Nobody Saw Him Nail Anything',
      title_pt: 'Ninguém o Viu Pregar Coisa Alguma',
      era: 'Renaissance',
      region: 'Wittenberg', region_pt: 'Wittenberg',
      tag: 'Reformation', tag_pt: 'Reforma',
      text: 'On 31 October 1517 an Augustinian friar and university lecturer at Wittenberg issued ninety-five propositions in Latin against the sale of indulgences, and sent them that same day to the Archbishop of Mainz. Within weeks they had been printed, translated and carried across the empire, and the split they opened in Western Christianity has never closed. The hammer, the door and the crowd came later: no source from Luther’s lifetime mentions them, and he never did either.',
      text_pt: 'Em 31 de outubro de 1517, um frade agostiniano e professor da universidade de Wittenberg lançou noventa e cinco proposições em latim contra a venda de indulgências, e as enviou naquele mesmo dia ao arcebispo de Mainz. Em poucas semanas estavam impressas, traduzidas e circulando pelo império, e a ruptura que abriram na cristandade ocidental nunca mais se fechou. O martelo, a porta e a multidão vieram depois: nenhuma fonte do tempo de Lutero os menciona, e ele tampouco.',
      facts: [
        'The story of the nailing first appears in 1546, in a preface written after Luther was dead by a colleague who had not yet arrived in Wittenberg in 1517. The church door was the university notice board, so posting a disputation there would have been routine rather than defiant.',
        'They were not a break with Rome. The theses attack the sale and abuse of indulgences, not the authority of the pope, and Luther was a friar in good standing asking for a debate among scholars. What happened next was not his plan: within weeks they had been translated, printed and spread across the empire, and he said he was astonished.',
        'The money being raised had a destination. The indulgence campaign in his region was servicing a loan the Archbishop of Mainz had taken from the Fugger bank to buy three bishoprics at once — half the takings went to Rome for the rebuilding of St Peter’s and half went straight to the bankers.'
      ],
      facts_pt: [
        'A história da pregação na porta surge pela primeira vez em 1546, num prefácio escrito depois da morte de Lutero por um colega que ainda nem morava em Wittenberg em 1517. A porta da igreja era o quadro de avisos da universidade, de modo que afixar ali uma disputa seria rotina, não desafio.',
        'Não eram um rompimento com Roma. As teses atacam a venda e o abuso das indulgências, não a autoridade do papa, e Lutero era um frade em boa situação pedindo um debate entre acadêmicos. O que veio depois não era plano dele: em semanas estavam traduzidas, impressas e espalhadas pelo império, e ele disse ter ficado perplexo.',
        'O dinheiro que se levantava tinha destino. A campanha de indulgências em sua região pagava um empréstimo que o arcebispo de Mainz tomara do banco Fugger para comprar três bispados de uma vez — metade da arrecadação ia a Roma para a reconstrução de São Pedro e metade ia direto para os banqueiros.'
      ]
    },
    {
      year: 1956,
      title: 'The War Was Written in Advance',
      title_pt: 'A Guerra Foi Escrita de Antemão',
      era: 'Contemporary',
      region: 'Suez', region_pt: 'Suez',
      tag: 'Crisis', tag_pt: 'Crise',
      text: 'On 31 October 1956 British and French aircraft began bombing Egyptian airfields, five days after Israel had invaded Sinai and two days after London and Paris had demanded that both sides pull back from the canal. The demand had been drafted before the invasion it was pretending to respond to.',
      text_pt: 'Em 31 de outubro de 1956, aviões britânicos e franceses começaram a bombardear aeródromos egípcios, cinco dias depois de Israel invadir o Sinai e dois dias depois de Londres e Paris exigirem que os dois lados se afastassem do canal. A exigência fora redigida antes da invasão a que fingia responder.',
      facts: [
        'The three governments had agreed it at a villa outside Paris the week before: Israel would attack, Britain and France would then order both sides away from the canal and move in to separate them. Eden had the British copy of the protocol destroyed. The French and Israeli copies survived.',
        'The United States stopped it with money. Eisenhower had not been told and was furious; Washington blocked support for the pound and made clear it would sell its holdings of British debt. Sterling could not have taken it, and Britain accepted a ceasefire within a week of opening fire.',
        'It produced United Nations peacekeeping. To let the invaders withdraw without total humiliation, a force of neutral troops was improvised to hold the canal zone — the first of its kind, and the idea won its Canadian author the Nobel Peace Prize.'
      ],
      facts_pt: [
        'Os três governos haviam combinado aquilo numa casa nos arredores de Paris, na semana anterior: Israel atacaria, e então Reino Unido e França ordenariam que ambos os lados se afastassem do canal e entrariam para separá-los. Eden mandou destruir a cópia britânica do protocolo. As cópias francesa e israelense sobreviveram.',
        'Os Estados Unidos puseram fim àquilo com dinheiro. Eisenhower não fora avisado e estava furioso; Washington bloqueou o apoio à libra e deixou claro que venderia seus títulos da dívida britânica. A libra não teria aguentado, e o Reino Unido aceitou um cessar-fogo uma semana depois de abrir fogo.',
        'Daquilo nasceram as forças de paz da ONU. Para que os invasores pudessem se retirar sem humilhação completa, improvisou-se uma tropa neutra para ocupar a zona do canal — a primeira do gênero, e a ideia rendeu ao seu autor canadense o Nobel da Paz.'
      ]
    }
  ],

  '11-01': [
    {
      year: 1520,
      title: 'The Strait of All Saints',
      title_pt: 'O Estreito de Todos os Santos',
      era: 'Renaissance',
      region: 'Tierra del Fuego', region_pt: 'Terra do Fogo',
      tag: 'Navigation', tag_pt: 'Navegação',
      text: 'On 1 November 1520, All Saints’ Day, Magellan’s ships entered the channel at the southern end of South America that joins the Atlantic to the Pacific, and he named it the Strait of All Saints. It took thirty-eight days of channels, squalls and dead ends to get through, and they came out into an ocean no European had crossed.',
      text_pt: 'Em 1º de novembro de 1520, Dia de Todos os Santos, os navios de Magalhães entraram no canal na ponta sul da América do Sul que liga o Atlântico ao Pacífico, e ele o batizou de Estreito de Todos os Santos. Foram trinta e oito dias de canais, rajadas e becos sem saída para atravessá-lo, e saíram num oceano que nenhum europeu havia cruzado.',
      facts: [
        'The largest ship deserted inside the strait. The San Antonio turned around carrying a heavy share of the stores and sailed home, where her officers accused Magellan of treason. The starvation on the Pacific crossing follows directly from that.',
        'The name Pacific came from a run of good weather. Having come out of five weeks of squalls into a calm sea, he called it the peaceful ocean, and the name stuck to the largest and frequently least peaceful body of water on earth.',
        'Tierra del Fuego was named for fires seen burning on the shore at night. Magellan reported a land of smoke; the king is said to have renamed it the land of fire, on the grounds that there is no smoke without it.'
      ],
      facts_pt: [
        'O maior navio desertou dentro do estreito. O San Antonio deu meia-volta levando boa parte dos mantimentos e navegou de volta, onde seus oficiais acusaram Magalhães de traição. A fome na travessia do Pacífico decorre diretamente disso.',
        'O nome Pacífico veio de uma sequência de bom tempo. Tendo saído de cinco semanas de rajadas para um mar calmo, ele o chamou de oceano pacífico, e o nome grudou na maior e frequentemente menos pacífica massa de água da Terra.',
        'A Terra do Fogo recebeu o nome de fogueiras vistas na costa durante a noite. Magalhães relatou uma terra de fumaça; conta-se que o rei a rebatizou de terra do fogo, sob o argumento de que não há fumaça sem ele.'
      ]
    },
    {
      year: 1555,
      title: 'Rio Was Founded to Expel Them',
      title_pt: 'O Rio Foi Fundado para Expulsá-los',
      era: 'Renaissance',
      region: 'Guanabara Bay', region_pt: 'Baía de Guanabara',
      tag: 'Colony', tag_pt: 'Colônia',
      text: 'On 1 November 1555 a French expedition under Villegaignon established a colony on an island in Guanabara Bay and called it France Antarctique. A large part of the settlers were Huguenots, Calvinists looking for somewhere to be Protestant in peace. The Portuguese destroyed it inside twelve years, and founded a city in order to do it.',
      text_pt: 'Em 1º de novembro de 1555, uma expedição francesa sob Villegaignon estabeleceu uma colônia numa ilha da baía de Guanabara e a chamou de França Antártica. Boa parte dos colonos eram huguenotes, calvinistas em busca de um lugar onde ser protestante em paz. Os portugueses a destruíram em menos de doze anos, e fundaram uma cidade para isso.',
      facts: [
        'Rio de Janeiro exists because of this colony. The Portuguese founded the city in 1565 as a base for driving the French out of the bay, and finished the job in 1567.',
        'The settlement tore itself apart over doctrine before anyone attacked it. Villegaignon fell out with the Calvinists he had invited; three of them wrote a statement of belief — the first Protestant confession of faith composed in the Americas — and were executed on his orders for it.',
        'One survivor, Jean de Léry, wrote an account of the Tupinambá that is still read as one of the founding works of ethnography, and the reports coming out of this colony fed Montaigne’s essay on cannibals, which in turn fed The Tempest.'
      ],
      facts_pt: [
        'O Rio de Janeiro existe por causa dessa colônia. Os portugueses fundaram a cidade em 1565 como base para expulsar os franceses da baía, e terminaram o serviço em 1567.',
        'O povoado se despedaçou por doutrina antes que alguém o atacasse. Villegaignon rompeu com os calvinistas que ele mesmo convidara; três deles escreveram uma declaração de fé — a primeira confissão protestante redigida nas Américas — e foram executados por ordem dele por causa disso.',
        'Um sobrevivente, Jean de Léry, escreveu sobre os tupinambás um relato que ainda é lido como uma das obras fundadoras da etnografia, e as notícias saídas dessa colônia alimentaram o ensaio de Montaigne sobre os canibais, que por sua vez alimentou A Tempestade.'
      ]
    }
  ],

  '11-02': [
    {
      year: 1917,
      title: 'Sixty-Seven Words',
      title_pt: 'Sessenta e Sete Palavras',
      era: 'Modern',
      region: 'London', region_pt: 'Londres',
      tag: 'Declaration', tag_pt: 'Declaração',
      text: 'On 2 November 1917 the British Foreign Secretary sent a letter of sixty-seven words to Lord Rothschild, stating that His Majesty’s Government viewed with favour the establishment in Palestine of a national home for the Jewish people, with nothing to be done that might prejudice the civil and religious rights of the existing non-Jewish communities there. It was published a week later and has been argued over ever since.',
      text_pt: 'Em 2 de novembro de 1917, o chanceler britânico enviou uma carta de sessenta e sete palavras a lorde Rothschild, declarando que o Governo de Sua Majestade via com bons olhos o estabelecimento na Palestina de um lar nacional para o povo judeu, sem que nada se fizesse que pudesse prejudicar os direitos civis e religiosos das comunidades não judaicas ali existentes. Foi publicada uma semana depois e é discutida desde então.',
      facts: [
        'Britain did not hold the territory it was writing about. Palestine was Ottoman when the letter was sent; British troops took Jerusalem five weeks later.',
        'The central phrase was left undefined on purpose. A national home is not a state, and nobody involved would say what it was instead. The people already living there, about nine in ten of the population, appear in the text only as the existing non-Jewish communities — named by what they were not.',
        'Britain had already promised the same region, in different terms, to other parties: Arab independence in the wartime correspondence with Sharif Hussein, and a division of the Ottoman provinces with France under the Sykes–Picot agreement. The three undertakings could not all be kept.'
      ],
      facts_pt: [
        'A Grã-Bretanha não controlava o território sobre o qual escrevia. A Palestina era otomana quando a carta foi enviada; as tropas britânicas tomariam Jerusalém cinco semanas depois.',
        'A expressão central foi deixada indefinida de propósito. Um lar nacional não é um Estado, e ninguém envolvido dizia o que seria em vez disso. As pessoas que já viviam ali, cerca de nove em cada dez habitantes, aparecem no texto apenas como as comunidades não judaicas existentes — nomeadas pelo que não eram.',
        'A Grã-Bretanha já havia prometido a mesma região, em termos diferentes, a outras partes: independência árabe na correspondência de guerra com o xarife Hussein, e uma divisão das províncias otomanas com a França pelo acordo Sykes-Picot. Os três compromissos não podiam ser cumpridos ao mesmo tempo.'
      ]
    }
  ],

  '11-03': [
    {
      year: 1930,
      title: 'The Provisional Government That Lasted Fifteen Years',
      title_pt: 'O Governo Provisório que Durou Quinze Anos',
      era: 'Modern',
      region: 'Rio de Janeiro', region_pt: 'Rio de Janeiro',
      tag: 'Government', tag_pt: 'Governo',
      text: 'On 3 November 1930 Getúlio Vargas was installed as head of the provisional government of Brazil, ten days after the junta that had removed the president. Provisional meant ruling by decree: Congress dissolved, every state legislature and municipal chamber closed, the constitution suspended, and appointed men sent out to run the states.',
      text_pt: 'Em 3 de novembro de 1930, Getúlio Vargas foi empossado como chefe do governo provisório do Brasil, dez dias depois da junta que depusera o presidente. Provisório queria dizer governar por decreto: Congresso dissolvido, todas as assembleias estaduais e câmaras municipais fechadas, a constituição suspensa, e interventores nomeados para tocar os estados.',
      facts: [
        'The same government that abolished every elected body in the country also fixed the voting. The electoral code of 1932 created the secret ballot, the electoral courts and the vote for women, and it is the reason Brazilian elections stopped being openly falsified.',
        'São Paulo rose against him in 1932 demanding a constitution, and was beaten in about three months — but it forced the constituent assembly that produced one in 1934.',
        'In 1937 he closed Congress again and ruled under a charter drafted for him and modelled on an authoritarian European one, which required a plebiscite that was never held. He was removed by the army in 1945, elected president by popular vote in 1950, and shot himself in the presidential palace in 1954.'
      ],
      facts_pt: [
        'O mesmo governo que aboliu todos os corpos eleitos do país também consertou a votação. O código eleitoral de 1932 criou o voto secreto, a Justiça Eleitoral e o voto feminino, e é a razão de as eleições brasileiras deixarem de ser abertamente falsificadas.',
        'São Paulo se levantou contra ele em 1932 exigindo uma constituição, e foi derrotada em cerca de três meses — mas forçou a assembleia constituinte que produziu uma em 1934.',
        'Em 1937 ele fechou o Congresso de novo e passou a governar sob uma carta redigida para ele, espelhada numa carta autoritária europeia, que previa um plebiscito jamais realizado. Foi deposto pelo Exército em 1945, eleito presidente pelo voto popular em 1950, e deu um tiro no peito no palácio presidencial em 1954.'
      ]
    }
  ],

  '11-04': [
    {
      year: 1677,
      title: 'She Cried Through the Wedding',
      title_pt: 'Ela Chorou o Casamento Inteiro',
      era: 'Early Modern',
      region: 'St James’s Palace, London', region_pt: 'Palácio de St James, Londres',
      tag: 'Dynasty', tag_pt: 'Dinastia',
      text: 'On 4 November 1677 Mary, the fifteen-year-old daughter of the heir to the English throne, was married to William of Orange — her first cousin, twelve years older, and a foreign head of state. The match had been arranged by her uncle the king for diplomatic reasons, and she is said to have wept for days beforehand and through the ceremony itself.',
      text_pt: 'Em 4 de novembro de 1677, Maria, filha de quinze anos do herdeiro do trono inglês, casou-se com Guilherme de Orange — primo em primeiro grau, doze anos mais velho e chefe de Estado estrangeiro. O arranjo fora feito por seu tio, o rei, por razões diplomáticas, e conta-se que ela chorou por dias antes e durante a própria cerimônia.',
      facts: [
        'Eleven years later her husband invaded her father’s kingdom and took his throne, and she came with him. They were crowned together — the only time in English history that two sovereigns held equal regal power, rather than one reigning and the other serving as consort.',
        'She governed alone whenever he was away at war, which was most summers, and contemporaries generally thought she did it better than he did.',
        'She died of smallpox at thirty-two, childless. He outlived her by eight years and died after his horse stumbled on a molehill, which Jacobites went on toasting for decades as the little gentleman in the black velvet waistcoat.'
      ],
      facts_pt: [
        'Onze anos depois, o marido dela invadiu o reino do pai dela e tomou o trono, e ela veio junto. Foram coroados juntos — a única vez na história inglesa em que dois soberanos detiveram poder régio igual, em vez de um reinar e o outro servir como consorte.',
        'Ela governou sozinha sempre que ele estava fora na guerra, o que acontecia quase todo verão, e os contemporâneos em geral achavam que ela o fazia melhor do que ele.',
        'Morreu de varíola aos trinta e dois anos, sem filhos. Ele a sobreviveu oito anos e morreu depois de o cavalo tropeçar num monte de terra de toupeira, coisa que os jacobitas passaram décadas brindando como o pequeno cavalheiro de colete de veludo preto.'
      ]
    }
  ],

  '11-05': [
    {
      year: 1940,
      title: 'The Rule He Broke Became a Law',
      title_pt: 'A Regra que Ele Quebrou Virou Lei',
      era: 'Contemporary',
      region: 'United States', region_pt: 'Estados Unidos',
      tag: 'Election', tag_pt: 'Eleição',
      text: 'On 5 November 1940 Franklin Roosevelt was elected to a third term as president of the United States, which nobody had ever held. The two-term limit was a convention and not a law: Washington had stepped down after two, and for a hundred and forty-four years nobody had tested whether it was binding.',
      text_pt: 'Em 5 de novembro de 1940, Franklin Roosevelt foi eleito para um terceiro mandato de presidente dos Estados Unidos, coisa que ninguém jamais tivera. O limite de dois mandatos era costume e não lei: Washington se retirara depois de dois, e por cento e quarenta e quatro anos ninguém testara se aquilo obrigava alguém.',
      facts: [
        'He went on to win a fourth term in 1944 and died eighty-two days into it.',
        'Because of him it became law. The Twenty-Second Amendment, ratified in 1951, wrote the two-term limit into the Constitution — so the one man who ever exceeded it is the reason nobody else can.',
        'He campaigned on staying out of the war. France had fallen in June and Britain was fighting alone, and he told an audience in Boston that their boys were not going to be sent into any foreign wars. Pearl Harbor came thirteen months later.'
      ],
      facts_pt: [
        'Ele ainda venceria um quarto mandato em 1944, e morreu oitenta e dois dias depois de iniciá-lo.',
        'Por causa dele aquilo virou lei. A Vigésima Segunda Emenda, ratificada em 1951, escreveu o limite de dois mandatos na Constituição — de modo que o único homem que já o ultrapassou é a razão de mais ninguém poder.',
        'Ele fez campanha prometendo ficar fora da guerra. A França caíra em junho e a Grã-Bretanha lutava sozinha, e ele disse a uma plateia em Boston que os filhos deles não seriam enviados a nenhuma guerra estrangeira. Pearl Harbor veio treze meses depois.'
      ]
    }
  ],

  '11-06': [
    {
      year: 447,
      title: 'The Racing Gangs Rebuilt the Walls',
      title_pt: 'As Torcidas Reconstruíram as Muralhas',
      era: 'Classical',
      region: 'Constantinople', region_pt: 'Constantinopla',
      tag: 'Walls', tag_pt: 'Muralhas',
      text: 'On 6 November 447 an earthquake brought down long stretches of the walls of Constantinople, including fifty-seven towers. Attila was in the Balkans at that moment, and those walls were the only thing standing between his army and the richest city in the world. They were back up in under two months.',
      text_pt: 'Em 6 de novembro de 447, um terremoto derrubou longos trechos das muralhas de Constantinopla, incluindo cinquenta e sete torres. Átila estava nos Bálcãs naquele momento, e aquelas muralhas eram a única coisa entre seu exército e a cidade mais rica do mundo. Estavam de pé de novo em menos de dois meses.',
      facts: [
        'The work was done by the circus factions. The Blues and the Greens — the chariot-racing gangs who spent the rest of their time rioting against each other — put some sixteen thousand men on the walls, and an inscription went up recording that it had taken under sixty days.',
        'They did not just repair what had fallen. An outer wall and a moat were added, and the result is the strongest fortification the ancient world produced.',
        'What they built held for a thousand years. The Theodosian walls were not forced by an enemy until 1453, and what finally did it was artillery, which did not exist when they were rebuilt.'
      ],
      facts_pt: [
        'O trabalho foi feito pelas facções do circo. Os Azuis e os Verdes — as torcidas das corridas de biga, que passavam o resto do tempo se enfrentando em tumultos — puseram uns dezesseis mil homens nas muralhas, e uma inscrição registrou que levara menos de sessenta dias.',
        'Eles não se limitaram a consertar o que caíra. Acrescentaram uma muralha externa e um fosso, e o resultado é a fortificação mais forte que o mundo antigo produziu.',
        'O que construíram aguentou mil anos. As muralhas teodosianas não foram rompidas por inimigo algum até 1453, e o que afinal as rompeu foi a artilharia, que não existia quando elas foram refeitas.'
      ]
    }
  ],

  '11-07': [
    {
      year: 1971,
      title: 'Greenpeace Was Named After the Boat',
      title_pt: 'O Greenpeace Tem o Nome do Barco',
      era: 'Contemporary',
      region: 'Amchitka, Alaska', region_pt: 'Amchitka, Alasca',
      tag: 'Nuclear', tag_pt: 'Nuclear',
      text: 'On 7 November 1971 the United States detonated Cannikin, a five-megaton hydrogen bomb, in a shaft nearly two kilometres deep beneath Amchitka Island in the Aleutians — the largest underground test it ever carried out. The ground lifted some six metres, and a lake formed where the island had been solid rock.',
      text_pt: 'Em 7 de novembro de 1971, os Estados Unidos detonaram o Cannikin, uma bomba de hidrogênio de cinco megatons, num poço de quase dois quilômetros de profundidade sob a ilha de Amchitka, nas Aleutas — o maior teste subterrâneo que já realizaram. O terreno subiu uns seis metros, e formou-se um lago onde a ilha era rocha maciça.',
      facts: [
        'Greenpeace exists because of this test. A small committee chartered a fishing boat to sail to Amchitka and physically get in the way; they were intercepted and never arrived, the bomb went off regardless, and the organisation kept the name that had been painted on the boat.',
        'The blast registered around seven on the Richter scale. The island sits in one of the most seismically active places on earth, which is a large part of what the protests were about, though the tsunami that was feared did not happen.',
        'The Supreme Court was asked to stop it and declined, by four votes to three, hours before the detonation. It was the last test at Amchitka, and the site is still monitored for leakage.'
      ],
      facts_pt: [
        'O Greenpeace existe por causa desse teste. Um pequeno comitê fretou um barco de pesca para navegar até Amchitka e atravancar fisicamente o caminho; foram interceptados e nunca chegaram, a bomba explodiu de todo modo, e a organização ficou com o nome que estava pintado no barco.',
        'A explosão registrou cerca de sete na escala Richter. A ilha fica num dos pontos sismicamente mais ativos da Terra, o que era boa parte do motivo dos protestos, embora o tsunami temido não tenha acontecido.',
        'A Suprema Corte foi chamada a interromper o teste e recusou, por quatro votos a três, horas antes da detonação. Foi o último teste em Amchitka, e o local segue monitorado por vazamentos.'
      ]
    }
  ],

  '11-08': [
    {
      year: 1519,
      title: 'Everything He Said Passed Through Her',
      title_pt: 'Tudo o que Ele Disse Passou por Ela',
      era: 'Renaissance',
      region: 'Tenochtitlan', region_pt: 'Tenochtitlán',
      tag: 'Encounter', tag_pt: 'Encontro',
      text: 'On 8 November 1519 Hernán Cortés entered Tenochtitlan and was received on the causeway by Moctezuma with a formal welcome and an exchange of gifts. The city on the lake held something like two hundred thousand people, more than any city in Spain, and the Spaniards had no frame of reference for it.',
      text_pt: 'Em 8 de novembro de 1519, Hernán Cortés entrou em Tenochtitlán e foi recebido na calçada por Montezuma, com uma recepção formal e troca de presentes. A cidade sobre o lago abrigava algo como duzentas mil pessoas, mais do que qualquer cidade da Espanha, e os espanhóis não tinham parâmetro para aquilo.',
      facts: [
        'Nothing he said reached Moctezuma except through a woman. Malintzin, handed to him as a slave on the coast, spoke Nahuatl and Maya and translated through a Spaniard who had learned Maya in captivity. Nahua sources sometimes call Cortés himself Malinche, after her.',
        'He did not arrive with five hundred men. He arrived with five hundred Spaniards and thousands of Indigenous allies, above all Tlaxcalteca, who had been at war with the Mexica for generations. What followed is better described as a war among Mesoamerican powers in which the Spanish took part.',
        'Within two years the city was gone. Moctezuma was dead by the following summer, the Spanish were driven out and came back, smallpox killed a large share of the population before the siege, and the lake city was dismantled to build another one on top of it.'
      ],
      facts_pt: [
        'Nada do que ele disse chegou a Montezuma senão através de uma mulher. Malintzin, entregue a ele como escrava no litoral, falava náuatle e maia e traduzia através de um espanhol que aprendera maia no cativeiro. Fontes nauas chamam o próprio Cortés de Malinche, por causa dela.',
        'Ele não chegou com quinhentos homens. Chegou com quinhentos espanhóis e milhares de aliados indígenas, sobretudo tlaxcaltecas, que guerreavam contra os mexicas havia gerações. O que se seguiu é mais bem descrito como uma guerra entre potências mesoamericanas da qual os espanhóis participaram.',
        'Em dois anos a cidade não existia mais. Montezuma estava morto no verão seguinte, os espanhóis foram expulsos e voltaram, a varíola matou boa parte da população antes do cerco, e a cidade sobre o lago foi desmontada para erguerem outra por cima.'
      ]
    }
  ],

  '11-09': [
    {
      year: 1938,
      title: 'They Were Billed for the Damage',
      title_pt: 'Cobraram Deles o Prejuízo',
      era: 'Modern',
      region: 'Germany', region_pt: 'Alemanha',
      tag: 'Pogrom', tag_pt: 'Pogrom',
      text: 'On the night of 9 November 1938 the Nazi regime unleashed a coordinated pogrom across Germany and Austria. Around fourteen hundred synagogues were burned, Jewish shops and homes were wrecked, and some thirty thousand Jewish men were arrested and sent to concentration camps. The pretext was the shooting of a German diplomat in Paris two days earlier by a seventeen-year-old whose family had just been expelled from Germany.',
      text_pt: 'Na noite de 9 de novembro de 1938, o regime nazista desencadeou um pogrom coordenado por toda a Alemanha e a Áustria. Cerca de mil e quatrocentas sinagogas foram incendiadas, lojas e casas judaicas destruídas, e uns trinta mil homens judeus presos e enviados a campos de concentração. O pretexto foi o assassinato de um diplomata alemão em Paris dois dias antes, por um rapaz de dezessete anos cuja família acabara de ser expulsa da Alemanha.',
      facts: [
        'The victims were then charged for it. The government imposed a collective fine of one billion Reichsmarks on German Jews for the damage done to them, and confiscated the insurance payments owed to the owners of the wrecked property.',
        'The name counts the windows. Night of broken glass is a German phrase, and German usage now generally prefers the November pogroms, on the grounds that the glass was the smallest thing broken that week.',
        'Germans call 9 November the day of fate. The Kaiser abdicated and a republic was proclaimed on it in 1918, Hitler attempted his putsch on it in 1923, this happened on it in 1938, and the Berlin Wall opened on it in 1989. When reunified Germany needed a national day it chose 3 October instead, because this date could not be celebrated.'
      ],
      facts_pt: [
        'Em seguida, cobraram das vítimas. O governo impôs aos judeus alemães uma multa coletiva de um bilhão de Reichsmarks pelos danos causados a eles, e confiscou os pagamentos de seguro devidos aos donos das propriedades destruídas.',
        'O nome conta as vidraças. Noite dos cristais é uma expressão alemã, e o uso alemão hoje prefere em geral pogroms de novembro, pelo entendimento de que o vidro foi a menor coisa quebrada naquela semana.',
        'Os alemães chamam o 9 de novembro de dia do destino. Nele o Kaiser abdicou e uma república foi proclamada, em 1918; nele Hitler tentou seu putsch, em 1923; nele aconteceu isto, em 1938; e nele o Muro de Berlim se abriu, em 1989. Quando a Alemanha reunificada precisou de uma data nacional, escolheu 3 de outubro — porque esta não podia ser comemorada.'
      ]
    },
    {
      year: 1989,
      pin: true,
      title: 'The Berlin Wall Opens',
      title_pt: 'O Muro de Berlim se Abre',
      era: 'Contemporary',
      region: 'Berlin', region_pt: 'Berlim',
      tag: 'Politics', tag_pt: 'Política',
      text: 'On the evening of 9 November 1989 an East German official announced at a press conference that citizens could cross the border — and, pressed on when, said "immediately". Crowds gathered at the checkpoints until the guards simply let them through, and the Berlin Wall was open.',
      text_pt: 'Na noite de 9 de novembro de 1989, um dirigente da Alemanha Oriental anunciou numa coletiva de imprensa que os cidadãos poderiam cruzar a fronteira — e, pressionado sobre quando, respondeu "imediatamente". Multidões se formaram nos postos até que os guardas simplesmente as deixaram passar, e o Muro de Berlim estava aberto.',
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
  ],

  '11-20': [
    {
      year: 1945,
      title: 'Four Languages at Once',
      title_pt: 'Quatro Línguas ao Mesmo Tempo',
      era: 'Contemporary',
      region: 'Nuremberg', region_pt: 'Nuremberg',
      tag: 'Justice', tag_pt: 'Justiça',
      text: 'On 20 November 1945, in the Palace of Justice at Nuremberg, the leading surviving Nazis went on trial before judges from the United States, Britain, France and the Soviet Union. Every word spoken in the courtroom was heard at the same moment in English, Russian, French and German, through headphones at every seat. Translated the old way, sentence by sentence, a trial in four languages would have lasted several times as long.',
      text_pt: 'Em 20 de novembro de 1945, no Palácio da Justiça de Nuremberg, os principais nazistas sobreviventes foram a julgamento diante de juízes dos Estados Unidos, do Reino Unido, da França e da União Soviética. Cada palavra dita no tribunal era ouvida no mesmo instante em inglês, russo, francês e alemão, por fones de ouvido em todos os lugares. Traduzido à moda antiga, frase por frase, um julgamento em quatro línguas teria durado várias vezes mais.',
      facts: [
        'The equipment came from IBM, which had sold a version of it to League of Nations conferences, but it had never carried a long, unscripted trial. Three teams of twelve interpreters took turns, each interpreter working into a single language. After Nuremberg the United Nations adopted the system, and conference interpreting as a profession grew from it.',
        'Speakers were controlled by lights. A monitor watching the interpreters could flash a yellow light at whoever had the floor to tell them to slow down, and a red one to tell them to stop and repeat.',
        'Nuremberg was chosen partly because its Palace of Justice had survived the bombing with a prison attached, and partly for the symbol: it was the city of the Nazi party rallies. Twenty-one defendants sat in the dock, and on 1 October 1946 twelve of the accused were sentenced to death.'
      ],
      facts_pt: [
        'O equipamento era da IBM, que já vendera uma versão dele a conferências da Liga das Nações, mas ele nunca sustentara um julgamento longo e sem roteiro. Três equipes de doze intérpretes se revezavam, cada intérprete trabalhando para uma única língua. Depois de Nuremberg, as Nações Unidas adotaram o sistema, e dele nasceu a interpretação de conferências como profissão.',
        'Quem falava era controlado por luzes. Um supervisor que acompanhava os intérpretes podia acender uma luz amarela para quem estivesse com a palavra, pedindo que falasse mais devagar, e uma vermelha, pedindo que parasse e repetisse.',
        'Nuremberg foi escolhida em parte porque seu Palácio da Justiça sobrevivera aos bombardeios com uma prisão anexa, e em parte pelo símbolo: era a cidade dos comícios do partido nazista. Vinte e um réus sentaram no banco, e em 1º de outubro de 1946 doze dos acusados foram condenados à morte.'
      ]
    }
  ],

  '12-25': [
    {
      year: 800,
      title: 'He Said He Did Not Know',
      title_pt: 'Ele Disse Que Não Sabia',
      era: 'Medieval',
      region: 'Rome', region_pt: 'Roma',
      tag: 'Politics', tag_pt: 'Política',
      text: 'On Christmas Day 800, as Charlemagne rose from prayer before the altar of St Peter’s in Rome, Pope Leo III placed a crown on his head and the crowd acclaimed him emperor of the Romans — the first in the West for more than three centuries. His biographer Einhard insists he would not have set foot in the church that day had he known what the pope intended.',
      text_pt: 'No dia de Natal de 800, quando Carlos Magno se levantava da oração diante do altar de São Pedro, em Roma, o papa Leão III pôs uma coroa em sua cabeça e a multidão o aclamou imperador dos romanos — o primeiro no Ocidente em mais de três séculos. Seu biógrafo Eginhardo garante que ele não teria posto os pés na igreja naquele dia se soubesse o que o papa pretendia.',
      facts: [
        'In the West the throne could be called empty. The emperor in Constantinople was a woman, Irene, who had taken power by blinding her own son, and many in the Latin church did not accept that a woman could hold the title.',
        'The pope needed him. A year earlier Leo had been attacked in the streets of Rome by enemies who tried to put out his eyes and cut out his tongue, and he had fled to Charlemagne for protection. After the crowning, the annals say, the pope knelt before him, as popes once had before the emperors of old.',
        'Constantinople took twelve years to accept it. Only in 812 did Byzantine envoys hail Charlemagne as emperor — and even then not as emperor of the Romans, a title Constantinople kept for its own ruler.'
      ],
      facts_pt: [
        'No Ocidente, o trono podia ser dado como vago. Quem reinava em Constantinopla era uma mulher, Irene, que tomara o poder cegando o próprio filho, e muitos na Igreja latina não aceitavam que uma mulher ocupasse o título.',
        'O papa precisava dele. Um ano antes, Leão fora atacado nas ruas de Roma por inimigos que tentaram lhe arrancar os olhos e a língua, e fugira para junto de Carlos Magno em busca de proteção. Depois da coroação, dizem os anais, o papa se ajoelhou diante dele, como os papas outrora diante dos antigos imperadores.',
        'Constantinopla levou doze anos para aceitar. Só em 812 enviados bizantinos saudaram Carlos Magno como imperador — e mesmo assim não como imperador dos romanos, título que Constantinopla guardava para o seu soberano.'
      ]
    },
    {
      year: 1066,
      title: 'The Cheers Sounded Like a Riot',
      title_pt: 'Os Vivas Soaram Como um Motim',
      era: 'Medieval',
      region: 'London', region_pt: 'Londres',
      tag: 'Politics', tag_pt: 'Política',
      text: 'On Christmas Day 1066, ten weeks after Hastings, William of Normandy was crowned king of England in Westminster Abbey. When the congregation was asked, in English and then in French, whether it accepted him, the shout was so loud that the Norman guards outside took it for an attack on their duke and began setting fire to the houses around the abbey. The church filled with smoke and most of the congregation ran out, leaving the clergy to finish crowning him almost alone.',
      text_pt: 'No dia de Natal de 1066, dez semanas depois de Hastings, Guilherme da Normandia foi coroado rei da Inglaterra na Abadia de Westminster. Quando os presentes foram perguntados, em inglês e depois em francês, se o aceitavam, o grito foi tão alto que os guardas normandos do lado de fora o tomaram por um ataque ao seu duque e começaram a incendiar as casas em volta da abadia. A igreja se encheu de fumaça e a maior parte dos presentes fugiu, deixando o clero terminar a coroação quase sozinho.',
      facts: [
        'He was crowned by Ealdred, archbishop of York, and not by the archbishop of Canterbury, Stigand, whose appointment Rome had never accepted. A king anointed by a prelate the pope considered illegitimate would have handed his enemies an argument.',
        'The abbey was almost new. Edward the Confessor had rebuilt it and seen it consecrated barely a year earlier, and was buried in it days later. By being crowned beside Edward’s tomb, William presented himself as his rightful heir — and every crowned English and British monarch since has been crowned in the same church.',
        'The story of the fire comes from the monk Orderic Vitalis, writing some decades later. He adds that after that day the English never trusted the Normans again.'
      ],
      facts_pt: [
        'Quem o coroou foi Ealdred, arcebispo de York, e não o arcebispo de Cantuária, Stigand, cuja nomeação Roma nunca aceitara. Um rei ungido por um prelado que o papa considerava ilegítimo daria um argumento aos seus inimigos.',
        'A abadia era quase nova. Eduardo, o Confessor, a reconstruíra e a vira consagrada apenas um ano antes, e foi sepultado nela dias depois. Coroando-se ao lado do túmulo de Eduardo, Guilherme se apresentava como seu herdeiro legítimo — e todos os monarcas ingleses e britânicos coroados desde então o foram na mesma igreja.',
        'A história do incêndio vem do monge Orderico Vital, que escreveu algumas décadas depois. Ele acrescenta que, depois daquele dia, os ingleses nunca mais confiaram nos normandos.'
      ]
    },
    {
      year: 1914,
      title: 'The Truce Nobody Ordered',
      title_pt: 'A Trégua Que Ninguém Ordenou',
      era: 'Modern',
      region: 'Western Front', region_pt: 'Frente Ocidental',
      tag: 'War', tag_pt: 'Guerra',
      text: 'On Christmas Day 1914, along stretches of the Western Front, British and German soldiers climbed out of their trenches, met in no man’s land, shook hands and swapped cigarettes, food and souvenirs. No one had ordered it. Weeks earlier the pope had asked for a Christmas ceasefire, and the warring governments had turned him down.',
      text_pt: 'No dia de Natal de 1914, em trechos da Frente Ocidental, soldados britânicos e alemães saíram de suas trincheiras, encontraram-se na terra de ninguém, apertaram as mãos e trocaram cigarros, comida e lembranças. Ninguém dera essa ordem. Semanas antes, o papa pedira um cessar-fogo de Natal, e os governos em guerra o recusaram.',
      facts: [
        'It began on Christmas Eve. Germans put small trees lit with candles along their parapets and sang carols, and the British answered with their own from across the lines.',
        'Many used the quiet to bury their dead, who had lain between the lines since the autumn battles, sometimes in services held together. Letters home describe games of football with makeshift balls, though the organised match of legend is much less certain.',
        'It was never universal: in some sectors the shooting went on all day. In later Christmases of the war, commanders forbade fraternising, and nothing on the scale of 1914 happened again.'
      ],
      facts_pt: [
        'Começou na véspera de Natal. Os alemães puseram pequenas árvores com velas acesas ao longo de seus parapeitos e cantaram canções de Natal, e os britânicos responderam com as suas do outro lado das linhas.',
        'Muitos aproveitaram a calma para enterrar seus mortos, que jaziam entre as linhas desde as batalhas do outono, às vezes em cerimônias feitas em conjunto. Cartas para casa descrevem jogos de futebol com bolas improvisadas, embora a partida organizada da lenda seja bem menos certa.',
        'Nunca foi geral: em alguns setores os tiros continuaram o dia inteiro. Nos Natais seguintes da guerra, os comandantes proibiram a confraternização, e nada na escala de 1914 voltou a acontecer.'
      ]
    },
    {
      year: 1991,
      title: 'The Flag Came Down at 7:32',
      title_pt: 'A Bandeira Desceu às 19h32',
      era: 'Contemporary',
      region: 'Moscow', region_pt: 'Moscou',
      tag: 'Politics', tag_pt: 'Política',
      text: 'On the evening of 25 December 1991 Mikhail Gorbachev resigned as president of the Soviet Union in a televised address of about ten minutes. At 7:32 pm the red flag over the Kremlin was lowered and the Russian tricolour raised in its place. In Moscow it was an ordinary working day: the Russian Orthodox Church keeps Christmas on 7 January, and the Soviet state had not kept it at all.',
      text_pt: 'Na noite de 25 de dezembro de 1991, Mikhail Gorbachev renunciou à presidência da União Soviética num pronunciamento de cerca de dez minutos na televisão. Às 19h32, a bandeira vermelha do Kremlin foi arriada e a tricolor russa, hasteada em seu lugar. Em Moscou era um dia comum de trabalho: a Igreja Ortodoxa Russa celebra o Natal em 7 de janeiro, e o Estado soviético não o celebrava de modo algum.',
      facts: [
        'By then he presided over almost nothing. On 8 December the leaders of Russia, Ukraine and Belarus had declared that the Soviet Union no longer existed, and on 21 December eleven republics confirmed it. The next day the Union’s last parliament voted it out of existence.',
        'The nuclear briefcase, with the codes for the Soviet arsenal, passed to Boris Yeltsin, president of Russia, that same evening.',
        'The Soviet state had replaced Christmas with New Year. After years in which Christmas trees were banned as religious, they came back in the 1930s as New Year trees, and the gifts and Grandfather Frost moved with them to the night of 31 December, where they still are in Russia.'
      ],
      facts_pt: [
        'Àquela altura ele presidia quase nada. Em 8 de dezembro, os líderes da Rússia, da Ucrânia e da Bielorrússia haviam declarado que a União Soviética não existia mais, e em 21 de dezembro onze repúblicas o confirmaram. No dia seguinte, o último parlamento da União votou sua própria extinção.',
        'A maleta nuclear, com os códigos do arsenal soviético, passou a Boris Iéltsin, presidente da Rússia, naquela mesma noite.',
        'O Estado soviético trocara o Natal pelo Ano-Novo. Depois de anos em que as árvores de Natal foram proibidas por serem religiosas, elas voltaram nos anos 1930 como árvores de Ano-Novo, e os presentes e o Ded Moroz, o Avô Gelo, mudaram-se com elas para a noite de 31 de dezembro, onde continuam na Rússia.'
      ]
    }
  ]

};
