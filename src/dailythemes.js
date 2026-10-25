// ── dailythemes.js ───────────────────────────────────────────────────────
// Themed dailies: on these days of the year the Daily Challenge deck always
// holds the listed cards, so the day's 18 cards share a theme with that day's
// reward card (dailycards.js) or event trophy. The rest of the deck stays
// random. The theme is never announced — the player is meant to notice it.
//
// Keyed by MM-DD, so a theme comes back every year (the random cards around
// it change with the year). Each entry lists 3–9 card names — the exact
// `name` of a CARDS or INTERVALS entry (cards.js). A card is matched by that
// name only: renaming a card silently drops it from every theme here, so
// cards are never renamed (if one ever must be, update this file too).
// Preview mode checks every name and count on load (console warnings) and
// can play any day of the calendar (Streak tab) to test a theme.
//
// The card of an event trophy dated that day (special 'card_on_date') is
// always added by the game; it is listed here anyway so each theme reads as
// a whole. Keep the cards spread out in time: a cluster of near years around
// the trophy card makes that card harder to place.
// ─────────────────────────────────────────────────────────────────────────

var DAILY_THEMES = {

  // Carpe Diem — things that began on a 1st of January
  '01-01': ['Julius Caesar', 'Founding of Rio de Janeiro', 'Haitian Revolution',
            'Abraham Lincoln', 'Fidel Castro', 'Euro Enters Circulation'],

  // Ides of March — Caesar and Rome
  '03-15': ['Julius Caesar', 'Founding of Rome', 'Roman Republic',
            'Caesar Crosses the Rubicon', 'Augustus', 'William Shakespeare'],

  // 21 April — Rome founded, Tiradentes executed, Brasília inaugurated
  '04-21': ['Founding of Rome', 'Romulus Augustulus', 'Tiradentes',
            'Minas Gerais Conspiracy', 'Juscelino Kubitschek', 'Oscar Niemeyer'],

  // Golden Law — the end of slavery
  '05-13': ['Abolition of Slavery in Brazil', 'Zumbi dos Palmares', 'Haitian Revolution',
            'Abraham Lincoln', 'Pedro II of Brazil', 'Princess Isabel'],

  // Fall of Constantinople — the city of Constantine
  '05-29': ['Fall of Constantinople', 'Constantine the Great', 'Justinian I', 'Hagia Sophia',
            'Sack of Constantinople', 'Mehmed II', 'Suleiman the Magnificent'],

  // US Independence Day
  '07-04': ['US Declaration of Independence', 'Mayflower Voyage', 'Benjamin Franklin',
            'George Washington', 'Thomas Jefferson', 'US Constitution',
            'Louisiana Purchase', 'Mount Rushmore'],

  // Storming of the Bastille — the French monarchy and its end
  '07-14': ['French Revolution', 'Hugh Capet', 'Louis XIV', 'Palace of Versailles',
            'Voltaire', 'Jean-Jacques Rousseau', 'Napoleon Bonaparte'],

  // Moon Landing — from astronomy to spaceflight
  '07-20': ['Moon Landing', 'Nicolaus Copernicus', 'Galileo Galilei', 'Isaac Newton',
            'Wright Brothers\' First Flight', 'Yuri Gagarin', 'Neil Armstrong'],

  // Nagasaki — the atomic age
  '08-09': ['Atomic Bombing of Hiroshima & Nagasaki', 'Marie Curie', 'Albert Einstein',
            'J. Robert Oppenheimer', 'Harry S. Truman', 'Attack on Pearl Harbor'],

  // Brazilian Independence
  '09-07': ['Independence of Brazil', 'Pedro Álvares Cabral', 'Tiradentes', 'John VI of Portugal',
            'Portuguese Court Arrives in Brazil', 'Pedro I of Brazil', 'Empire of Brazil',
            'Pedro II of Brazil'],

  // Marathon — the Persian Wars and the race named after it
  '09-12': ['Darius the Great', 'Persian Wars', 'Herodotus', 'Battle of Thermopylae',
            'The First Olympics', 'First Modern Olympic Games'],

  // The Gregorian reform — 4 October 1582 was followed by the 15th
  '10-04': ['Gregorian Calendar', 'Pope Gregory XIII', 'Julius Caesar', 'Council of Nicaea',
            'Dionysius Exiguus', 'Nicolaus Copernicus'],

  // Land Ho! — reaching the Americas
  '10-12': ['Columbus Reaches the Americas', 'Leif Erikson', 'Marco Polo Travels to China',
            'Ferdinand II of Aragon', 'Treaty of Tordesillas', 'Magellan\'s Circumnavigation'],

  // Friday 13 October 1307 — the arrest of the Templars
  '10-13': ['Knights Templar Era', 'First Crusade', 'Saladin', 'Richard I of England',
            'Capetian Dynasty', 'Avignon Papacy'],

  // Hastings — the Norman conquest
  '10-14': ['Battle of Hastings', 'Rollo the Walker', 'Alfred the Great', 'Viking Age',
            'William the Conqueror', 'Magna Carta'],

  // Zama — Hannibal, Scipio and the generals Hannibal admired
  '10-19': ['Battle of Zama', 'Alexander the Great', 'Pyrrhus of Epirus', 'Hannibal Barca',
            'Scipio Africanus', 'Battle of Cannae', 'Carthaginian Empire'],

  // Reformation Day
  '10-31': ['Martin Luther\'s 95 Theses', 'Gutenberg Bible Printed', 'Martin Luther', 'Henry VIII',
            'John Calvin', 'Council of Trent', 'Publication of the King James Bible',
            'Thirty Years\' War'],

  // Checkpoint Charlie — Germany from unification to the Wall
  '11-09': ['Fall of the Berlin Wall', 'Otto von Bismarck', 'Treaty of Versailles', 'Adolf Hitler',
            'World War II', 'John F. Kennedy', 'Mikhail Gorbachev',
            'Dissolution of the Soviet Union'],

  // Black Consciousness Day (Brazil) — Zumbi and the fight against slavery and segregation
  '11-20': ['Zumbi dos Palmares', 'Quilombo dos Palmares', 'Mansa Musa', 'Haitian Revolution',
            'Abolition of Slavery in Brazil', 'Martin Luther King Jr.', 'Nelson Mandela',
            'The End of Apartheid'],

  // Christmas — and what else happened on a 25th of December
  '12-25': ['Birth of Jesus', 'Constantine the Great', 'Dionysius Exiguus',
            'Charlemagne Crowned Emperor', 'William the Conqueror',
            'Dissolution of the Soviet Union']

};
