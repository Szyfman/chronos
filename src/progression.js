// ── progression.js ───────────────────────────────────────────────────────
// Player profile: name, XP → level, level titles, unlockable UI
// customizations, per-mode records and era mastery. Data + logic only;
// rendering is in ui.js.
// XP = final score of each run (awarded by endGame in game.js).
// Depends on: state.js (playerName, playerXp, playerCustom, customKnown,
//             cardStats, modeRecords), cards.js (CARDS, INTERVALS),
//             game.js (earnedTrophies), trophies.js (TROPHY_DEFS)
// ─────────────────────────────────────────────────────────────────────────

const PLAYER_NAME_MAX = 20;

// Highest entry whose minLevel the player has reached is the current title.
// `id` is what emblem unlocks point to ({ title: id }).
const PLAYER_TITLES = [
  { id: 'student',     minLevel: 1,   name: 'Student',               name_pt: 'Aluno' },
  { id: 'scribe',      minLevel: 5,   name: 'Scribe',                name_pt: 'Escriba' },
  { id: 'chronicler',  minLevel: 10,  name: 'Chronicler',            name_pt: 'Cronista' },
  { id: 'historian',   minLevel: 20,  name: 'Historian',             name_pt: 'Historiador' },
  { id: 'guardian',    minLevel: 35,  name: "Alexandria's Guardian", name_pt: 'Guardião de Alexandria' },
  { id: 'time_lord',   minLevel: 50,  name: 'Time Lord',             name_pt: 'Senhor do Tempo' },
  { id: 'lore_keeper', minLevel: 100, name: 'The Lore Keeper',       name_pt: 'The Lore Keeper' }
];

// Each category holds exactly one selected item in playerCustom[cat.id].
const CUSTOM_CATEGORIES = [
  { id: 'emblem', name: 'Emblem',        name_pt: 'Emblema' },
  { id: 'frame',  name: 'Profile Frame', name_pt: 'Moldura do Perfil' }
];

/* unlock: null            → available from the start
           { title: id }   → reach that title (PLAYER_TITLES id)
           { level: n }    → reach player level n
           { trophy: id }  → earn that trophy (TROPHY_DEFS id)
           { mastery: { era, seal } } → earn that Era Mastery seal (or a
                             higher one) in that era (MASTERY_ERAS /
                             MASTERY_SEALS ids)
   secret: true → while locked, the item shows as ❓ / ??? and its modal
   only says to keep playing (like a secret trophy).
   The first item of each category must always be unlocked: it is the
   fallback when a saved choice is missing or locked.
   Emblems: one per title, in title order, then the trophy ones, the era
   ones (Silver mastery seal) and the secret ones. Frames: level ones, then
   trophy ones. Every item carries trivia/trivia_pt for the detail modal (the
   unlock rule is described from `unlock`, so it never drifts from the data).
   Frames carry `style`, mapped to the .pf-frame-<style> (avatar) and
   .cf-<style> (cards) CSS classes in index.html. */
const CUSTOMIZATIONS = [
  { id: 'emblem_hourglass', cat: 'emblem', icon: '⏳', name: 'Hourglass', name_pt: 'Ampulheta', unlock: { title: 'student' },
    trivia: 'No one knows who invented the hourglass, but it appears suddenly in 14th-century Europe — its first known picture is in Ambrogio Lorenzetti\'s fresco of Good Government in Siena, painted around 1338. Sand glasses were prized at sea, where a rolling ship made water clocks useless: sailors turned a half-hour glass day and night and struck a bell at every turn — the origin of the "bells" that still mark the watches on a ship.',
    trivia_pt: 'Ninguém sabe quem inventou a ampulheta, mas ela surge de repente na Europa do século XIV — sua primeira imagem conhecida está no afresco do Bom Governo de Ambrogio Lorenzetti, em Siena, pintado por volta de 1338. As ampulhetas eram preciosas no mar, onde o balanço do navio tornava inúteis os relógios de água: os marinheiros viravam uma ampulheta de meia hora dia e noite e tocavam um sino a cada virada — a origem dos "toques de sino" que ainda marcam os turnos a bordo.' },
  { id: 'emblem_scroll', cat: 'emblem', icon: '📜', name: 'Scroll', name_pt: 'Pergaminho', unlock: { title: 'scribe' },
    trivia: 'Before books had pages, they were rolled. A Roman book was a volumen — from volvere, "to roll" — which is why we still speak of a "volume". The Greek word for a papyrus roll, biblion, came from Byblos, the Phoenician port through which Egyptian papyrus reached Greece; from it come "Bible" and "bibliography". A reader unrolled the scroll with one hand while rolling up the part already read with the other.',
    trivia_pt: 'Antes de os livros terem páginas, eles eram enrolados. Um livro romano era um volumen — de volvere, "enrolar" — e por isso ainda falamos em "volume". A palavra grega para rolo de papiro, biblion, veio de Biblos, o porto fenício por onde o papiro egípcio chegava à Grécia; dela vêm "Bíblia" e "bibliografia". O leitor desenrolava o rolo com uma mão enquanto enrolava com a outra a parte já lida.' },
  { id: 'emblem_owl', cat: 'emblem', icon: '🦉', name: 'Owl', name_pt: 'Coruja', unlock: { title: 'chronicler' },
    trivia: 'The little owl was the bird of Athena, goddess of wisdom and patron of Athens, and from the 5th century BCE it was stamped on the city\'s silver tetradrachms — coins so trusted across the Mediterranean that people simply called them "owls". In Aristophanes\' comedy The Birds, "bringing owls to Athens" already meant doing something pointless, like carrying coals to Newcastle. Greece put the same owl on its modern one-euro coin.',
    trivia_pt: 'A pequena coruja era a ave de Atena, deusa da sabedoria e protetora de Atenas, e a partir do século V AEC foi cunhada nos tetradracmas de prata da cidade — moedas tão confiáveis em todo o Mediterrâneo que as pessoas as chamavam simplesmente de "corujas". Na comédia As Aves, de Aristófanes, "levar corujas a Atenas" já significava fazer algo inútil, como chover no molhado. A Grécia pôs a mesma coruja na sua moeda moderna de um euro.' },
  { id: 'emblem_dragon', cat: 'emblem', icon: '🐉', name: 'Dragon', name_pt: 'Dragão', unlock: { title: 'historian' },
    trivia: 'In imperial China the dragon stood for the emperor himself, the "True Dragon, Son of Heaven". Under the Ming and Qing dynasties the five-clawed dragon was reserved for the emperor and his closest family; officials had to make do with four-clawed creatures, and using the imperial dragon without permission could be punished as treason. Unlike the dragons of Western legend, the Chinese long was a benevolent spirit of water and rain, not a monster to be slain.',
    trivia_pt: 'Na China imperial, o dragão representava o próprio imperador, o "Verdadeiro Dragão, Filho do Céu". Nas dinastias Ming e Qing, o dragão de cinco garras era reservado ao imperador e à sua família mais próxima; os funcionários tinham de se contentar com criaturas de quatro garras, e usar o dragão imperial sem permissão podia ser punido como traição. Diferente dos dragões das lendas ocidentais, o long chinês era um espírito benevolente da água e da chuva, não um monstro a ser abatido.' },
  { id: 'emblem_key', cat: 'emblem', icon: '🗝️', name: 'Key', name_pt: 'Chave', unlock: { title: 'guardian' },
    trivia: 'The guardians of the Library of Alexandria were famously ruthless collectors. According to the physician Galen, Ptolemy III ordered every ship that docked at Alexandria to be searched for books: the scrolls were copied, the library kept the originals and the owners got the copies. He is also said to have borrowed Athens\' official texts of Aeschylus, Sophocles and Euripides against a huge deposit of 15 talents of silver — and then kept the books, happily giving up the money.',
    trivia_pt: 'Os guardiões da Biblioteca de Alexandria eram colecionadores famosos pela falta de escrúpulos. Segundo o médico Galeno, Ptolomeu III mandou revistar em busca de livros todo navio que atracasse em Alexandria: os rolos eram copiados, a biblioteca ficava com os originais e os donos recebiam as cópias. Conta-se também que ele pediu emprestados os textos oficiais de Atenas de Ésquilo, Sófocles e Eurípides em troca de um enorme depósito de 15 talentos de prata — e depois ficou com os livros, abrindo mão do dinheiro de bom grado.' },
  { id: 'emblem_clock', cat: 'emblem', icon: '🕰️', name: 'Clock', name_pt: 'Relógio', unlock: { title: 'time_lord' },
    trivia: 'Around 1090, in the Song capital of Kaifeng, the scholar Su Song built an astronomical clock tower more than ten metres tall. A great water wheel, held back by an escapement, turned an armillary sphere, a celestial globe and wooden figures that struck bells and gongs to announce the hours — long before mechanical clocks appeared on European towers. When the Jurchen took Kaifeng in 1127 they dismantled it and carried it north, and no one ever managed to make it run again.',
    trivia_pt: 'Por volta de 1090, em Kaifeng, capital da dinastia Song, o erudito Su Song construiu uma torre-relógio astronômica com mais de dez metros de altura. Uma grande roda d\'água, contida por um escapamento, girava uma esfera armilar, um globo celeste e bonecos de madeira que tocavam sinos e gongos para anunciar as horas — muito antes de os relógios mecânicos aparecerem nas torres europeias. Quando os jurchéns tomaram Kaifeng em 1127, desmontaram a torre e a levaram para o norte, e ninguém conseguiu fazê-la funcionar de novo.' },
  { id: 'emblem_crown', cat: 'emblem', icon: '👑', name: 'Crown', name_pt: 'Coroa', unlock: { title: 'lore_keeper' },
    trivia: 'Few crowns carry as much legend as the Iron Crown of Lombardy, kept in the cathedral of Monza. Tradition says its thin inner band was hammered from a nail of the True Cross, brought from Jerusalem by Helena, mother of Constantine. Medieval kings of Italy were crowned with it — and in 1805 Napoleon placed it on his own head in Milan, declaring: "God gave it to me; beware whoever touches it." Modern analysis found that the famous "iron" band is in fact almost entirely silver.',
    trivia_pt: 'Poucas coroas carregam tanta lenda quanto a Coroa de Ferro da Lombardia, guardada na catedral de Monza. Segundo a tradição, seu fino aro interno foi forjado com um prego da Verdadeira Cruz, trazido de Jerusalém por Helena, mãe de Constantino. Reis medievais da Itália foram coroados com ela — e em 1805 Napoleão a pôs na própria cabeça em Milão, declarando: "Deus me deu; ai de quem tocá-la." Análises modernas revelaram que o famoso aro "de ferro" é, na verdade, quase todo de prata.' },
  { id: 'emblem_column', cat: 'emblem', icon: '🏛️', name: 'Column', name_pt: 'Coluna', unlock: { trophy: 'pax_romana' },
    trivia: 'Trajan\'s Column, dedicated in 113 CE, is a 30-metre comic strip in marble: a carved band about 190 metres long winds 23 times around the shaft, telling the story of Trajan\'s two wars in Dacia through some 2,600 figures. A spiral staircase of 185 steps runs up inside it, and its base became the tomb of the emperor\'s ashes. In 1587 Pope Sixtus V crowned it with a bronze statue of Saint Peter, which replaced the long-lost statue of Trajan and still stands there today.',
    trivia_pt: 'A Coluna de Trajano, inaugurada em 113 EC, é uma história em quadrinhos de mármore com 30 metros: uma faixa esculpida de cerca de 190 metros dá 23 voltas em torno do fuste, contando as duas guerras de Trajano na Dácia com cerca de 2.600 figuras. Uma escada em caracol de 185 degraus sobe por dentro, e sua base se tornou o túmulo das cinzas do imperador. Em 1587, o Papa Sisto V colocou no topo uma estátua de bronze de São Pedro, que substituiu a estátua de Trajano, perdida havia muito tempo, e continua lá até hoje.' },
  { id: 'emblem_rocket', cat: 'emblem', icon: '🚀', name: 'Rocket', name_pt: 'Foguete', unlock: { trophy: 'rocket_man' },
    trivia: 'Rockets are centuries older than spaceflight: by the 13th century Chinese armies were firing gunpowder "fire arrows", and the Mongols helped carry the idea west. Spaceflight itself began with a deaf Russian schoolteacher, Konstantin Tsiolkovsky, who published the rocket equation in 1903 — the formula that still tells engineers how much fuel a launch needs. He summed up his dream in one line: "Earth is the cradle of humanity, but one cannot live in the cradle forever."',
    trivia_pt: 'Os foguetes são séculos mais velhos que o voo espacial: no século XIII os exércitos chineses já disparavam "flechas de fogo" movidas a pólvora, e os mongóis ajudaram a levar a ideia para o Ocidente. O voo espacial em si começou com um professor russo surdo, Konstantin Tsiolkovsky, que publicou a equação do foguete em 1903 — a fórmula que ainda diz aos engenheiros quanto combustível um lançamento exige. Ele resumiu seu sonho numa frase: "A Terra é o berço da humanidade, mas não se pode viver no berço para sempre."' },

  // Era emblems: the Silver seal of Era Mastery in that era, in era order
  { id: 'emblem_wheat', cat: 'emblem', icon: '🌾', name: 'Wheat', name_pt: 'Espiga', unlock: { mastery: { era: 'Ancient', seal: 'silver' } },
    trivia: 'The crews who built the pyramids of Giza were paid largely in food, and the staples of every ration were bread and beer. Egyptian beer was thick, mildly alcoholic and nourishing — closer to a drinkable porridge than to modern beer — and safer than river water. Beer was just as central in Mesopotamia: the Sumerian Hymn to Ninkasi, written down around 1800 BCE, is both a prayer to the goddess of beer and one of the oldest recipes in the world, describing step by step how to soak the grain, bake it into loaves and ferment it.',
    trivia_pt: 'As equipes que construíram as pirâmides de Gizé eram pagas em boa parte com comida, e a base de toda ração era pão e cerveja. A cerveja egípcia era espessa, pouco alcoólica e nutritiva — mais perto de um mingau para beber do que da cerveja moderna — e mais segura que a água do rio. Na Mesopotâmia ela era igualmente central: o Hino a Ninkasi sumério, registrado por volta de 1800 AEC, é ao mesmo tempo uma oração à deusa da cerveja e uma das receitas mais antigas do mundo, descrevendo passo a passo como molhar o grão, assá-lo em pães e fermentá-lo.' },
  { id: 'emblem_amphora', cat: 'emblem', icon: '🏺', name: 'Amphora', name_pt: 'Ânfora', unlock: { mastery: { era: 'Classical', seal: 'silver' } },
    trivia: 'On the edge of ancient Rome rises Monte Testaccio, an artificial hill more than 30 metres high made almost entirely of broken pottery. It is a Roman rubbish heap: tens of millions of amphorae that carried olive oil, most of them from the province of Baetica in southern Spain, smashed and stacked in orderly terraces from the reign of Augustus until the 3rd century. Oil soaked into the clay made the jars impossible to reuse, so they were broken once emptied — and many still carry stamps and painted labels naming the producer, the weight and the year.',
    trivia_pt: 'Na beira da Roma antiga ergue-se o Monte Testaccio, uma colina artificial com mais de 30 metros de altura feita quase só de cerâmica quebrada. É um lixão romano: dezenas de milhões de ânforas que traziam azeite, a maioria da província da Bética, no sul da Hispânia, quebradas e empilhadas em terraços organizados do reinado de Augusto até o século III. O azeite entranhado no barro tornava os jarros impossíveis de reaproveitar, então eram quebrados depois de esvaziados — e muitos ainda trazem selos e rótulos pintados com o nome do produtor, o peso e o ano.' },
  { id: 'emblem_shield', cat: 'emblem', icon: '🛡️', name: 'Shield', name_pt: 'Escudo', unlock: { mastery: { era: 'Medieval', seal: 'silver' } },
    trivia: 'Heraldry was born on the battlefield in the 12th century, when helmets closed over the face and knights became impossible to tell apart. Bold, simple designs painted on shields solved the problem, and they soon became hereditary, passed from father to son. The English term "coat of arms" comes from the surcoat, the cloth tunic worn over the armour that carried the same design. Heralds, who had to recognise every knight at a tournament, developed a language of their own, rooted in Norman French: a red field is "gules" and a blue one "azure".',
    trivia_pt: 'A heráldica nasceu no campo de batalha no século XII, quando os elmos passaram a cobrir o rosto e ficou impossível distinguir um cavaleiro do outro. Desenhos simples e marcantes pintados nos escudos resolveram o problema, e logo se tornaram hereditários, passando de pai para filho. A expressão inglesa "coat of arms" vem da sobreveste, a túnica de pano usada por cima da armadura com o mesmo desenho. Os arautos, que precisavam reconhecer cada cavaleiro num torneio, criaram uma língua própria: na heráldica, o vermelho se chama "goles" e o azul, "blau".' },
  { id: 'emblem_palette', cat: 'emblem', icon: '🎨', name: 'Palette', name_pt: 'Paleta', unlock: { mastery: { era: 'Renaissance', seal: 'silver' } },
    trivia: 'The deepest blue of the Renaissance, ultramarine, was ground from lapis lazuli mined in the mountains of Badakhshan, in today\'s Afghanistan, and shipped "beyond the sea" — oltremare — to Venice. Purifying the pigment was so laborious that the best grades cost more than gold. Patrons wrote it into contracts: in 1485 the painter Domenico Ghirlandaio was bound to use ultramarine worth about four florins an ounce for an altarpiece. That is why it was saved for the most important figure in a picture — usually the robe of the Virgin Mary.',
    trivia_pt: 'O azul mais profundo do Renascimento, o ultramarino, era moído do lápis-lazúli extraído nas montanhas de Badakhshan, no atual Afeganistão, e levado "além-mar" — oltremare — até Veneza. Purificar o pigmento era tão trabalhoso que os melhores graus custavam mais que ouro. Os clientes o colocavam em contrato: em 1485 o pintor Domenico Ghirlandaio foi obrigado a usar ultramarino de cerca de quatro florins a onça num retábulo. Por isso ele era reservado à figura mais importante do quadro — quase sempre o manto da Virgem Maria.' },
  { id: 'emblem_compass', cat: 'emblem', icon: '🧭', name: 'Compass', name_pt: 'Bússola', unlock: { mastery: { era: 'Early Modern', seal: 'silver' } },
    trivia: 'The magnetic compass came from China. Around 1088 the scholar Shen Kuo described a magnetised needle — Chinese compasses were thought of as pointing south — and noticed that it did not point exactly south, the first known record of magnetic declination. By the early 12th century Chinese sailors were steering by it when the sky was overcast, and by the end of that century it appears in European writings. Without it, the long ocean crossings of the Age of Discovery would have been far more dangerous.',
    trivia_pt: 'A bússola magnética veio da China. Por volta de 1088 o erudito Shen Kuo descreveu uma agulha magnetizada — as bússolas chinesas eram pensadas como apontando para o sul — e notou que ela não apontava exatamente para o sul, o primeiro registro conhecido da declinação magnética. No início do século XII os marinheiros chineses já se guiavam por ela quando o céu estava encoberto, e no fim desse século ela aparece em textos europeus. Sem ela, as longas travessias oceânicas das Grandes Navegações teriam sido muito mais perigosas.' },
  { id: 'emblem_gear', cat: 'emblem', icon: '⚙️', name: 'Gear', name_pt: 'Engrenagem', unlock: { mastery: { era: 'Modern', seal: 'silver' } },
    trivia: 'Before the railways, every town kept its own time, set by the Sun: noon in Bristol came about ten minutes after noon in London. Trains turned that into chaos, so British railways adopted London time — "railway time" — in the 1840s, and some town clocks were given two minute hands, one for local time and one for the trains. In North America the railroads introduced standard time zones on 18 November 1883, remembered as "the day of two noons", because many towns reset their clocks at midday and lived through noon twice.',
    trivia_pt: 'Antes das ferrovias, cada cidade tinha sua própria hora, marcada pelo Sol: o meio-dia em Bristol chegava uns dez minutos depois do meio-dia em Londres. Os trens transformaram isso em caos, então as ferrovias britânicas adotaram a hora de Londres — a "hora da ferrovia" — na década de 1840, e alguns relógios de cidade ganharam dois ponteiros de minutos, um para a hora local e outro para os trens. Na América do Norte as ferrovias criaram os fusos horários em 18 de novembro de 1883, lembrado como "o dia dos dois meios-dias", porque muitas cidades acertaram os relógios ao meio-dia e viveram o meio-dia duas vezes.' },
  { id: 'emblem_satellite', cat: 'emblem', icon: '🛰️', name: 'Satellite', name_pt: 'Satélite', unlock: { mastery: { era: 'Contemporary', seal: 'silver' } },
    trivia: 'On 4 October 1957 the Soviet Union launched Sputnik 1, a polished metal sphere just 58 cm across, weighing about 84 kg, trailing four long antennas. It carried little more than a radio transmitter, which sent out a simple "beep-beep" that radio amateurs around the world could tune in to as it passed overhead. Its batteries died after about three weeks, and in January 1958 it fell back and burned up in the atmosphere — but those beeps had already started the Space Race.',
    trivia_pt: 'Em 4 de outubro de 1957 a União Soviética lançou o Sputnik 1, uma esfera de metal polido de apenas 58 cm de diâmetro, pesando cerca de 84 kg, com quatro longas antenas. Ele levava pouco mais que um transmissor de rádio, que emitia um simples "bip-bip" que radioamadores do mundo todo podiam sintonizar quando ele passava por cima. As baterias acabaram depois de umas três semanas, e em janeiro de 1958 ele caiu e se desintegrou na atmosfera — mas aqueles bipes já tinham dado a largada na Corrida Espacial.' },

  // Secret emblems: won through secret trophies, hidden until then
  { id: 'emblem_dagger', cat: 'emblem', icon: '🗡️', name: 'Dagger', name_pt: 'Punhal', unlock: { trophy: 'ides_of_march' }, secret: true,
    trivia: 'After the murder of Julius Caesar, Brutus did something no Roman had dared: he boasted of the deed on money. Around 42 BCE his mint struck coins showing two daggers on either side of a pileus — the cap given to freed slaves — above the words EID MAR, the Ides of March. The message was that Rome had been freed from a tyrant. Only three gold examples are known; one sold at auction in London in 2020 for about £3.2 million, a record for an ancient coin.',
    trivia_pt: 'Depois do assassinato de Júlio César, Brutus fez algo que nenhum romano tinha ousado: estampou o feito no dinheiro. Por volta de 42 AEC sua casa da moeda cunhou moedas com dois punhais ladeando um píleo — o barrete dado aos escravos libertos — acima das palavras EID MAR, os Idos de Março. A mensagem era que Roma fora libertada de um tirano. Só se conhecem três exemplares de ouro; um foi leiloado em Londres em 2020 por cerca de 3,2 milhões de libras, recorde para uma moeda antiga.' },
  { id: 'emblem_black_cat', cat: 'emblem', icon: '🐈‍⬛', name: 'Black Cat', name_pt: 'Gato Preto', unlock: { trophy: 'friday_13' }, secret: true,
    trivia: 'Fridays and the number 13 were each thought unlucky for centuries — Friday as the day of the Crucifixion, 13 as the number at the table of the Last Supper — but the fear of the two together only shows up in writing in the 19th century. A 1907 bestseller, Friday, the Thirteenth, in which a stockbroker uses the superstition to crash the market, helped spread it. The link with the arrest of the Knights Templar on Friday 13 October 1307 was made only in the 20th century. Black cats had their own reputation: medieval Europe tied them to witches, yet in parts of Britain a black cat crossing your path is still a sign of good luck.',
    trivia_pt: 'A sexta-feira e o número 13 eram considerados de azar havia séculos, cada um por si — a sexta como o dia da Crucificação, o 13 como o número de pessoas à mesa da Última Ceia —, mas o medo dos dois juntos só aparece por escrito no século XIX. Um best-seller de 1907, Friday, the Thirteenth, em que um corretor usa a superstição para derrubar a bolsa, ajudou a espalhá-la. A ligação com a prisão dos Templários na sexta-feira, 13 de outubro de 1307, só foi feita no século XX. Os gatos pretos tinham fama própria: a Europa medieval os associava às bruxas, mas em partes da Grã-Bretanha um gato preto cruzando o caminho ainda é sinal de boa sorte.' },

  { id: 'frame_classic',  cat: 'frame', style: 'classic',  name: 'Classic',  name_pt: 'Clássica', unlock: null,
    trivia: 'All the gold ever mined in human history — about 216,000 tonnes, by the World Gold Council\'s count — would fit in a single cube roughly 22 metres on each side. Because gold does not rust or tarnish, almost all of it still exists: a ring bought today may hold metal once struck into Roman coins or worked into Inca ornaments. And about two thirds of it was dug up only after 1950.',
    trivia_pt: 'Todo o ouro já extraído na história humana — cerca de 216 mil toneladas, pelas contas do Conselho Mundial do Ouro — caberia num único cubo de uns 22 metros de lado. Como o ouro não enferruja nem escurece, quase todo ele ainda existe: um anel comprado hoje pode conter metal que um dia foi cunhado em moedas romanas ou trabalhado em adornos incas. E cerca de dois terços dele só foram extraídos depois de 1950.' },
  { id: 'frame_bronze',   cat: 'frame', style: 'bronze',   name: 'Bronze',   name_pt: 'Bronze',   unlock: { level: 3 },
    trivia: 'Around 280 BCE the people of Rhodes celebrated surviving a year-long siege by raising a bronze statue of their sun god Helios, about 33 metres tall — the Colossus, the work of the sculptor Chares of Lindos, paid for partly by selling the siege engines the enemy had left behind. It stood for only about 54 years before an earthquake around 226 BCE snapped it at the knees. Even fallen it drew visitors: Pliny the Elder wrote that few people could wrap their arms around its thumb. According to the Byzantine chronicler Theophanes, after Arab forces took Rhodes in the 650s the bronze was sold to a merchant and carried off on 900 camels — a story many historians doubt.',
    trivia_pt: 'Por volta de 280 AEC o povo de Rodes celebrou ter resistido a um cerco de um ano erguendo uma estátua de bronze de seu deus-sol Hélio, com cerca de 33 metros — o Colosso, obra do escultor Cares de Lindos, pago em parte com a venda das máquinas de cerco que o inimigo deixou para trás. Ficou de pé só uns 54 anos, até que um terremoto por volta de 226 AEC o quebrou na altura dos joelhos. Mesmo caído atraía visitantes: Plínio, o Velho, escreveu que poucas pessoas conseguiam abraçar seu polegar. Segundo o cronista bizantino Teófanes, depois que forças árabes tomaram Rodes na década de 650, o bronze foi vendido a um mercador e levado em 900 camelos — história da qual muitos historiadores duvidam.' },
  { id: 'frame_silver',   cat: 'frame', style: 'silver',   name: 'Silver',   name_pt: 'Prata',    unlock: { level: 10 },
    trivia: 'Argentina is often said to be the only country named after a chemical element: its name comes from the Latin argentum, "silver", just like the Río de la Plata, the "River of Silver". Early 16th-century Spanish explorers met people there wearing silver ornaments and heard tales of a "Sierra de la Plata", a mountain of silver somewhere inland. That silver had really travelled from the distant Andes — the River Plate region itself had almost none. The mountain did exist, though: Potosí, in today\'s Bolivia, found by the Spanish in 1545.',
    trivia_pt: 'Costuma-se dizer que a Argentina é o único país com nome de elemento químico: o nome vem do latim argentum, "prata", assim como o Rio da Prata. Exploradores espanhóis do início do século XVI encontraram ali povos usando adornos de prata e ouviram falar de uma "Serra da Prata", uma montanha de prata em algum lugar do interior. Aquela prata, na verdade, tinha vindo dos distantes Andes — a região do Prata quase não tinha nenhuma. A montanha existia, porém: Potosí, na atual Bolívia, encontrada pelos espanhóis em 1545.' },
  { id: 'frame_imperial', cat: 'frame', style: 'imperial', name: 'Imperial', name_pt: 'Imperial', unlock: { level: 20 },
    trivia: 'Tyrian purple, made from the glands of murex sea snails, was the most expensive dye of antiquity: in 1909 a chemist needed some 12,000 snails to extract just 1.4 grams of it. Rome came to reserve the deepest purple for the emperor, and in Byzantium a child born to a reigning emperor was called porphyrogennetos, "born in the purple", after the porphyry-lined chamber of the Great Palace of Constantinople where empresses gave birth. Constantine VII made the title part of his name, to remind rivals that he, unlike them, had been born to rule.',
    trivia_pt: 'A púrpura de Tiro, feita das glândulas de caramujos marinhos do gênero Murex, era o corante mais caro da Antiguidade: em 1909 um químico precisou de cerca de 12 mil caramujos para extrair apenas 1,4 grama. Roma passou a reservar a púrpura mais intensa ao imperador, e em Bizâncio o filho nascido de um imperador reinante era chamado de porfirogênito, "nascido na púrpura", por causa da câmara revestida de pórfiro do Grande Palácio de Constantinopla onde as imperatrizes davam à luz. Constantino VII fez do título parte do próprio nome, para lembrar aos rivais que ele, ao contrário deles, nascera para reinar.' },
  { id: 'frame_ember',    cat: 'frame', style: 'ember',    name: 'Ember',    name_pt: 'Brasa',    unlock: { trophy: 'on_fire' },
    trivia: 'In the round temple of Vesta in the Roman Forum, the Vestal Virgins kept a sacred fire burning day and night for more than a thousand years; Romans believed the city would endure as long as the flame did. A Vestal who let it go out was whipped by the pontifex maximus, and the fire had to be rekindled the ancient way — by friction or, later, with sunlight focused by a mirror. The flame was finally put out in 394 CE, when Theodosius I disbanded the order.',
    trivia_pt: 'No templo redondo de Vesta, no Fórum Romano, as Vestais mantiveram um fogo sagrado aceso dia e noite por mais de mil anos; os romanos acreditavam que a cidade duraria enquanto a chama durasse. A Vestal que a deixasse apagar era açoitada pelo pontífice máximo, e o fogo tinha de ser reaceso à moda antiga — por atrito ou, mais tarde, com a luz do sol concentrada por um espelho. A chama foi finalmente apagada em 394 EC, quando Teodósio I dissolveu a ordem.' },

  // Long-term trophy frames
  { id: 'frame_illumination', cat: 'frame', style: 'illumination', name: 'Illumination', name_pt: 'Iluminura', unlock: { trophy: 'librarian' },
    trivia: 'The Codex Gigas, made in a Bohemian monastery in the early 13th century, is the largest medieval manuscript known: almost a metre tall and weighing about 75 kg. It holds the whole Bible and much more — histories, medical texts, magic formulas — and a full-page portrait of the Devil, which earned it the name "Devil\'s Bible". Legend says a monk condemned to be walled up alive promised to write it in a single night, and sold his soul for the Devil\'s help. The handwriting tells another story: a single scribe, working for perhaps twenty years. Carried off from Prague by the Swedish army in 1648, it is kept today in Stockholm.',
    trivia_pt: 'O Codex Gigas, feito num mosteiro da Boêmia no início do século XIII, é o maior manuscrito medieval conhecido: quase um metro de altura e cerca de 75 kg. Ele contém a Bíblia inteira e muito mais — crônicas, textos de medicina, fórmulas mágicas — e um retrato do Diabo de página inteira, que lhe valeu o apelido de "Bíblia do Diabo". A lenda diz que um monge condenado a ser emparedado vivo prometeu escrevê-lo numa única noite e vendeu a alma em troca da ajuda do Diabo. A caligrafia conta outra história: um único escriba, trabalhando talvez por vinte anos. Levado de Praga pelo exército sueco em 1648, ele está hoje em Estocolmo.' },
  { id: 'frame_maya', cat: 'frame', style: 'maya', name: 'Maya Stela', name_pt: 'Estela Maia', unlock: { trophy: 'daily_forty' },
    trivia: 'Maya kings raised tall stone slabs, or stelae, to mark the endings of periods of the Long Count, carving them with their own portraits and long columns of dates. For decades scholars believed these texts were only about astronomy and the calendar. Then in 1960 Tatiana Proskouriakoff, comparing the stelae of Piedras Negras, showed that the dates traced real lives — the births, accessions and victories of kings — and Maya history suddenly had names. The tallest of all, Stela E at Quiriguá, raised in 771 CE, stands about 10.6 metres above the ground and weighs some 65 tonnes.',
    trivia_pt: 'Os reis maias erguiam altas lajes de pedra, as estelas, para marcar o fim dos períodos da Conta Longa, esculpindo nelas os próprios retratos e longas colunas de datas. Por décadas os estudiosos acreditaram que esses textos tratavam só de astronomia e calendário. Até que em 1960 Tatiana Proskouriakoff, comparando as estelas de Piedras Negras, mostrou que as datas seguiam vidas reais — nascimentos, coroações e vitórias de reis — e a história maia de repente ganhou nomes. A mais alta de todas, a Estela E de Quiriguá, erguida em 771 EC, tem cerca de 10,6 metros acima do chão e pesa umas 65 toneladas.' },
  { id: 'frame_zodiac', cat: 'frame', style: 'zodiac', name: 'Zodiac', name_pt: 'Zodíaco', unlock: { trophy: 'wheel_of_the_year' },
    trivia: 'The twelve signs of the zodiac were fixed by Babylonian astronomers around the 5th century BCE, who split the Sun\'s yearly path across the sky into twelve equal parts of 30 degrees, each named after a nearby constellation. But the Earth\'s axis slowly wobbles like a spinning top — a movement called precession, about one degree every 72 years. As a result, signs and constellations no longer line up: at the March equinox the Sun, which once stood in Aries, now rises in Pisces and is drifting toward Aquarius — the origin of the "Age of Aquarius".',
    trivia_pt: 'Os doze signos do zodíaco foram fixados por astrônomos babilônios por volta do século V AEC, que dividiram o caminho anual do Sol no céu em doze partes iguais de 30 graus, cada uma batizada com o nome de uma constelação próxima. Mas o eixo da Terra oscila lentamente como um pião — um movimento chamado precessão, de cerca de um grau a cada 72 anos. Por isso signos e constelações já não coincidem: no equinócio de março o Sol, que antes ficava em Áries, hoje nasce em Peixes e caminha para Aquário — a origem da "Era de Aquário".' },
  { id: 'frame_iron', cat: 'frame', style: 'iron', name: 'Iron', name_pt: 'Ferro', unlock: { trophy: 'veteran' },
    trivia: 'Among the treasures of Tutankhamun\'s tomb lay a dagger with a blade of iron that had never rusted — made at a time when Egypt had barely begun to work iron. In 2016 an analysis of its nickel and cobalt content showed that the metal came from a meteorite. The Egyptians would later call iron "metal of the sky". One of the Amarna letters records a king of Mitanni sending an iron dagger as a gift to Tutankhamun\'s grandfather, Amenhotep III — perhaps this very blade.',
    trivia_pt: 'Entre os tesouros do túmulo de Tutancâmon havia um punhal com lâmina de ferro que nunca enferrujou — feito numa época em que o Egito mal começara a trabalhar o ferro. Em 2016 uma análise do teor de níquel e cobalto mostrou que o metal veio de um meteorito. Os egípcios mais tarde chamariam o ferro de "metal do céu". Uma das cartas de Amarna registra um rei de Mitani enviando um punhal de ferro de presente ao avô de Tutancâmon, Amenhotep III — talvez esta mesma lâmina.' }
];

// ── XP CURVE ──────────────────────────────────────────────────────────────
/* XP to go from level L to L+1:
     L < capLevel:  base + growth × (L−1)^exponent, rounded to the nearest `step`
     L ≥ capLevel:  flat — same cost as (capLevel−1) → capLevel, forever
   XP comes from the final score of each run, so ~400 XP ≈ one average game.
   With the values below: L2 ≈ 4 games, L10 ≈ 44 games, L50 ≈ 1,100 games,
   L100 ≈ 6,200 games; past 100, ~160 games per level.
   Tuning: `base` sets how fast the first levels feel, `growth` scales the
   whole mid/late game, `exponent` bends the curve (1 = linear, higher =
   steeper end). Changing any of them re-levels every player, since only
   total XP is stored. */
const XP_CURVE = { base: 1500, growth: 40, exponent: 1.6, capLevel: 100, step: 100 };

function xpToNextLevel(level) {
  var L = Math.min(level, XP_CURVE.capLevel - 1);
  var raw = XP_CURVE.base + XP_CURVE.growth * Math.pow(L - 1, XP_CURVE.exponent);
  return Math.round(raw / XP_CURVE.step) * XP_CURVE.step;
}

// Total XP → level, XP into that level, and XP the level costs.
// Spare XP carries over, so one big gain can climb several levels at once.
function levelInfoFor(totalXp) {
  var level = 1, xpLeft = Math.max(0, Math.floor(totalXp || 0));
  while (level < XP_CURVE.capLevel && xpLeft >= xpToNextLevel(level)) {
    xpLeft -= xpToNextLevel(level);
    level++;
  }
  // Past the cap every level costs the same, so skip the loop
  if (level === XP_CURVE.capLevel) {
    var flat = xpToNextLevel(level);
    level += Math.floor(xpLeft / flat);
    xpLeft = xpLeft % flat;
  }
  return { level: level, xp: xpLeft, xpNeeded: xpToNextLevel(level), totalXp: Math.max(0, Math.floor(totalXp || 0)) };
}

function formatXp(n) {
  return n.toLocaleString(lang === 'pt' ? 'pt-BR' : 'en-US');
}

function playerLevelInfo() {
  return levelInfoFor(playerXp);
}

/* Adds XP and persists it. Returns before/after level info plus the new
   title when a level-up crossed a title threshold (null otherwise).
   Every XP source (final score now; trophies and daily bonuses later)
   should come through here. */
function awardXp(amount) {
  var gained = Math.max(0, Math.floor(amount || 0));
  var before = playerLevelInfo();
  playerXp += gained;
  try { localStorage.setItem('chronos_xp', String(playerXp)); } catch(e) {}
  var after = playerLevelInfo();
  var oldTitle = playerTitle(before.level), newTitle = playerTitle(after.level);
  return { gained: gained, before: before, after: after, newTitle: newTitle !== oldTitle ? newTitle : null };
}

function playerTitle(level) {
  var title = PLAYER_TITLES[0];
  PLAYER_TITLES.forEach(function(t) { if (level >= t.minLevel) title = t; });
  return title;
}

function isCustomUnlocked(item) {
  if (!item.unlock) return true;
  if (item.unlock.title) {
    var title = PLAYER_TITLES.find(function(t) { return t.id === item.unlock.title; });
    return !!title && playerLevelInfo().level >= title.minLevel;
  }
  if (item.unlock.level) return playerLevelInfo().level >= item.unlock.level;
  if (item.unlock.trophy) return !!earnedTrophies[item.unlock.trophy];
  if (item.unlock.mastery) return eraSealReached(item.unlock.mastery.era, item.unlock.mastery.seal);
  return false;
}

// Unlocked, or anything at all in preview mode
function isCustomSelectable(item) {
  return customPreview || isCustomUnlocked(item);
}

// Falls back to the category's first item if the saved one is missing or
// no longer unlocked (e.g. definitions changed between versions, or the
// game was reopened without ?preview).
function selectedCustom(catId) {
  var id = customPreview && _previewCustom[catId] ? _previewCustom[catId] : playerCustom[catId];
  var item = CUSTOMIZATIONS.find(function(c) { return c.id === id; });
  if (item && item.cat === catId && isCustomSelectable(item)) return item;
  return CUSTOMIZATIONS.find(function(c) { return c.cat === catId; });
}

function selectCustomization(id) {
  var item = CUSTOMIZATIONS.find(function(c) { return c.id === id; });
  if (!item || !isCustomSelectable(item)) return false;
  if (customPreview) { _previewCustom[item.cat] = id; return true; }   // never saved
  playerCustom[item.cat] = id;
  try { localStorage.setItem('chronos_custom', JSON.stringify(playerCustom)); } catch(e) {}
  return true;
}

// ── PREVIEW (TEST) MODE ───────────────────────────────────────────────────
/* Opening the game with ?preview makes every customization selectable and
   shows the trivia of locked and secret items, so new visuals can be checked
   without earning them. Choices made in preview live only in memory: the
   saved profile and the real unlock state are never touched, so reopening
   without ?preview brings the real profile back.
   PREVIEW_ENABLED must be false on main — switch it off before merging. */
const PREVIEW_ENABLED = false;
var customPreview = false;
var _previewCustom = {};
try { customPreview = PREVIEW_ENABLED && new URLSearchParams(location.search).has('preview'); } catch(e) {}

// ── UNLOCK NOTICES ────────────────────────────────────────────────────────
/* customKnown (state.js) holds the ids the player was already told about.
   checkCustomUnlocks() returns the items unlocked since the last call and
   records them; game.js turns them into notices. Items available from the
   start are never announced. On the very first call (no saved list yet),
   the items that existed before unlock notices are recorded silently —
   newer ones the player already qualifies for are still announced. */
const _CUSTOM_PRE_NOTICE = ['emblem_hourglass', 'emblem_scroll', 'emblem_owl', 'emblem_dragon',
  'emblem_key', 'emblem_clock', 'emblem_crown', 'emblem_column', 'emblem_rocket',
  'frame_classic', 'frame_bronze', 'frame_silver', 'frame_imperial', 'frame_ember'];

function checkCustomUnlocks() {
  var first = !customKnown;
  if (first) customKnown = [];
  var fresh = [];
  CUSTOMIZATIONS.forEach(function(item) {
    if (customKnown.indexOf(item.id) >= 0 || !isCustomUnlocked(item)) return;
    customKnown.push(item.id);
    if (item.unlock && !(first && _CUSTOM_PRE_NOTICE.indexOf(item.id) >= 0)) fresh.push(item);
  });
  if (first || fresh.length) saveCustomKnown();
  return fresh;
}

function setPlayerName(name) {
  playerName = String(name || '').trim().slice(0, PLAYER_NAME_MAX);
  try { localStorage.setItem('chronos_player_name', playerName); } catch(e) {}
}

// ── MODE RECORDS ──────────────────────────────────────────────────────────
// Shown in this order. `label` is an i18n key. The daily challenge runs as
// classic but keeps its own record, since its 18-card deck isn't comparable.
const RECORD_MODES = [
  { id: 'classic',    icon: '📜', label: 'classic_lbl' },
  { id: 'empires',    icon: '🏛️', label: 'empires_lbl' },
  { id: 'characters', icon: '👤', label: 'characters_lbl' },
  { id: 'abrahamic',  icon: '✡️', label: 'biblical_lbl' },
  { id: 'roman',      icon: '🏛️', label: 'mc_roman_title' },
  { id: 'eastern',    icon: '☯️', label: 'mc_eastern_title' },
  { id: 'daily',      icon: '📅', label: 'daily_title' }
];

/* Called by endGame for every run with at least one card placed. Only runs
   with lives count: Free play has no stakes, so its scores aren't records.
   Returns true when the run beat an earlier record of its mode — the very
   first run of a mode sets the record but isn't announced as a new one. */
function recordModeResult(modeId, finalScore, placedCount, maxStreak, withLives) {
  if (!withLives || !modeId) return false;
  var r = modeRecords[modeId];
  if (!r || typeof r !== 'object') r = modeRecords[modeId] = { best: 0, bestDate: '', mostPlaced: 0, runs: 0 };
  var hadRuns = (r.runs | 0) > 0;
  r.runs = (r.runs | 0) + 1;
  r.mostPlaced = Math.max(r.mostPlaced | 0, placedCount | 0);
  r.bestStreak = Math.max(r.bestStreak | 0, maxStreak | 0);
  var isBest = finalScore > (r.best | 0);
  if (isBest) { r.best = finalScore; r.bestDate = new Date().toISOString(); }
  saveModeRecords();
  return isBest && hadRuns;
}

// ── ERA MASTERY ───────────────────────────────────────────────────────────
// Eras in chronological order; `id` matches card.era.
const MASTERY_ERAS = [
  { id: 'Ancient',      name: 'Ancient',      name_pt: 'Antiguidade' },
  { id: 'Classical',    name: 'Classical',    name_pt: 'Antiguidade Clássica' },
  { id: 'Medieval',     name: 'Medieval',     name_pt: 'Idade Média' },
  { id: 'Renaissance',  name: 'Renaissance',  name_pt: 'Renascimento' },
  { id: 'Early Modern', name: 'Early Modern', name_pt: 'Início da Idade Moderna' },
  { id: 'Modern',       name: 'Modern',       name_pt: 'Era Moderna' },
  { id: 'Contemporary', name: 'Contemporary', name_pt: 'Contemporânea' }
];

/* Seals, lowest first. A card is "hit" once placed correctly at least once,
   and "mastered" once it has 2+ correct placements and more hits than misses.
   `share` is the fraction of the era's cards that must meet `need`. */
const MASTERY_SEALS = [
  { id: 'bronze', icon: '🥉', need: 'hit',      share: 0.25, name: 'Bronze', name_pt: 'Bronze' },
  { id: 'silver', icon: '🥈', need: 'hit',      share: 0.60, name: 'Silver', name_pt: 'Prata' },
  { id: 'gold',   icon: '🥇', need: 'mastered', share: 0.90, name: 'Gold',   name_pt: 'Ouro' }
];

function isCardHit(s)      { return !!s && (s.ok | 0) >= 1; }
function isCardMastered(s) { return !!s && (s.ok | 0) >= 2 && (s.ok | 0) > (s.miss | 0); }

/* Per-era summary from cardStats (state.js):
   { era, total, hit, mastered, seal (highest earned or null),
     next ({ seal, count, goal }, or null once gold) } */
function eraMastery() {
  var all = CARDS.concat(INTERVALS);
  return MASTERY_ERAS.map(function(era) {
    var cards = all.filter(function(c) { return c.era === era.id; });
    var hit = 0, mastered = 0;
    cards.forEach(function(c) {
      var s = cardStats[c.name];
      if (isCardHit(s)) hit++;
      if (isCardMastered(s)) mastered++;
    });
    var total = cards.length, seal = null, next = null;
    MASTERY_SEALS.forEach(function(m) {
      var count = m.need === 'mastered' ? mastered : hit;
      var goal = Math.ceil(total * m.share);
      if (total && count >= goal) seal = m;
      else if (!next) next = { seal: m, count: count, goal: goal };
    });
    return { era: era, total: total, hit: hit, mastered: mastered, seal: seal, next: next };
  });
}

// True once the era's highest seal is sealId or above it
function eraSealReached(eraId, sealId) {
  var need = MASTERY_SEALS.findIndex(function(s) { return s.id === sealId; });
  var m = eraMastery().find(function(x) { return x.era.id === eraId; });
  return need >= 0 && !!m && !!m.seal && MASTERY_SEALS.indexOf(m.seal) >= need;
}
