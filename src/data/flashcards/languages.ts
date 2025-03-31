// File: src/data/flashcards/languages.ts
import { Flashcard } from '@/types/flashcard';

export const languagesFlashcards: Flashcard[] = [
  // --- Swedish - Beginner ---
  { id: 'swe1', question: 'Hur säger man "hello" på svenska?', answer: '"Hej".', category: 'languages', difficulty: 'beginner'},
  { id: 'swe2', question: 'Hur säger man "thank you" på svenska?', answer: '"Tack".', category: 'languages', difficulty: 'beginner'},
  { id: 'swe3', question: 'Hur säger man "my name is..." på svenska?', answer: '"Jag heter...".', category: 'languages', difficulty: 'beginner'},
  { id: 'swe4', question: 'Hur säger man "how are you?" på svenska?', answer: '"Hur mår du?".', category: 'languages', difficulty: 'beginner'},
  { id: 'swe5', question: 'Hur räknar man från 1 till 5 på svenska?', answer: '"Ett, två, tre, fyra, fem".', category: 'languages', difficulty: 'beginner'},
  { id: 'swe_beg6', question: 'Vad betyder "ursäkta"?', answer: '"Excuse me" eller "sorry".', category: 'languages', difficulty: 'beginner'},
  { id: 'swe_beg7', question: 'Hur säger man "yes" och "no" på svenska?', answer: '"Ja" och "Nej".', category: 'languages', difficulty: 'beginner'},
  { id: 'swe_beg8', question: 'Vad heter veckodagarna på svenska (mån-fre)?', answer: 'Måndag, tisdag, onsdag, torsdag, fredag.', category: 'languages', difficulty: 'beginner'},
  { id: 'swe_beg9', question: 'Hur säger man "good morning" på svenska?', answer: '"God morgon".', category: 'languages', difficulty: 'beginner'},
  { id: 'swe_beg10', question: 'Hur säger man "good evening" på svenska?', answer: '"God kväll".', category: 'languages', difficulty: 'beginner'},
  { id: 'swe_beg11', question: 'Vad betyder "vatten"?', answer: 'Water.', category: 'languages', difficulty: 'beginner'},
  { id: 'swe_beg12', question: 'Vad betyder "mat"?', answer: 'Food.', category: 'languages', difficulty: 'beginner'},
  { id: 'swe_beg13', question: 'Hur frågar man "vad kostar det?"?', answer: '"Vad kostar det?" eller "Hur mycket kostar det?".', category: 'languages', difficulty: 'beginner'},
  { id: 'swe_beg14', question: 'Hur säger man "I don\'t understand" på svenska?', answer: '"Jag förstår inte".', category: 'languages', difficulty: 'beginner'},
  { id: 'swe_beg15', question: 'Vad heter färgerna röd, blå, grön på svenska?', answer: 'Röd, blå, grön.', category: 'languages', difficulty: 'beginner'},
  { id: 'swe_beg16', question: 'Hur säger man "where is the toilet?" på svenska?', answer: '"Var är toaletten?".', category: 'languages', difficulty: 'beginner'},
  { id: 'swe_beg17', question: 'Vad betyder "idag", "imorgon", "igår"?', answer: '"Idag" = today, "imorgon" = tomorrow, "igår" = yesterday.', category: 'languages', difficulty: 'beginner'},
  { id: 'swe_beg18', question: 'Hur säger man "please" på svenska?', answer: '"Snälla" (används sällan ensamt), oftare inbakat i artiga fraser (t.ex. "Kan jag få...").', category: 'languages', difficulty: 'beginner'}, // Clarification
  { id: 'swe_beg19', question: 'Vad heter årstiderna på svenska?', answer: 'Vår, sommar, höst, vinter.', category: 'languages', difficulty: 'beginner'},
  { id: 'swe_beg20', question: 'Hur säger man "help" på svenska?', answer: '"Hjälp!".', category: 'languages', difficulty: 'beginner'},
  { id: 'swe_beg21', question: 'Vad betyder "stor" och "liten"?', answer: '"Stor" = big/large, "Liten" = small/little.', category: 'languages', difficulty: 'beginner'},
  { id: 'swe_beg22', question: 'Hur säger man "goodbye" på svenska?', answer: '"Hej då".', category: 'languages', difficulty: 'beginner'},
  { id: 'swe_beg23', question: 'Vad heter siffrorna 6 till 10 på svenska?', answer: 'Sex, sju, åtta, nio, tio.', category: 'languages', difficulty: 'beginner'},
  { id: 'swe_beg24', question: 'Vad betyder "jag älskar dig"?', answer: 'I love you.', category: 'languages', difficulty: 'beginner'},
  { id: 'swe_beg25', question: 'Hur frågar man "vad är klockan?"?', answer: '"Vad är klockan?" eller "Hur mycket är klockan?".', category: 'languages', difficulty: 'beginner'},

  // --- Swedish - Intermediate ---
  { id: 'swe-int1', question: 'Vad är skillnaden mellan "en" och "ett" substantiv (genus)?', answer: 'Utrum (en-ord) och neutrum (ett-ord). Genus påverkar artikel (en/ett) och adjektivböjning.', category: 'languages', difficulty: 'intermediate'},
  { id: 'swe-int2', question: 'Hur bildas bestämd form singular för substantiv?', answer: 'En-ord: lägg till -en/-n (bok -> boken). Ett-ord: lägg till -et/-t (hus -> huset). Vissa undantag finns.', category: 'languages', difficulty: 'intermediate'},
  { id: 'swe_int3', question: 'Hur bildas plural obestämd form för vanliga substantiv?', answer: 'Fem huvudtyper: -or (flickor), -ar (pojkar), -er (böcker), -n (äpplen), oförändrad (hus).', category: 'languages', difficulty: 'intermediate'}, // Added more detail
  { id: 'swe_int4', question: 'Förklara skillnaden mellan "var" och "vart".', answer: '"Var" frågar om/anger befintlighet (plats). "Vart" frågar om/anger riktning (rörelse mot plats).', category: 'languages', difficulty: 'intermediate'},
  { id: 'swe_int5', question: 'Hur kongruensböjs adjektiv efter substantivet?', answer: 'Singular obestämd: efter genus (en stor bil, ett stort hus). Bestämd form och plural: oftast -a (den stora bilen, stora hus).', category: 'languages', difficulty: 'intermediate'}, // Combined two cards
  { id: 'swe_int7', question: 'Vilka är de fem huvudtempusformerna i svenskan?', answer: 'Presens (gör), Preteritum (gjorde), Perfekt (har gjort), Pluskvamperfekt (hade gjort), Futurum (ska göra/kommer att göra).', category: 'languages', difficulty: 'intermediate'}, // Slight rephrasing
  { id: 'swe_int8', question: 'Ge exempel på modala hjälpverb och deras betydelse.', answer: 'Kunna (can), vilja (want to), ska (shall/will), måste (must), få (may/allowed to), böra (ought to).', category: 'languages', difficulty: 'intermediate'},
  { id: 'swe_int9', question: 'Hur används possessiva pronomen och när används "sin/sitt/sina"?', answer: 'Anger ägande (min, din...). "Sin/sitt/sina" används när ägaren är subjektet i samma sats (Han älskar *sin* fru).', category: 'languages', difficulty: 'intermediate'},
  { id: 'swe_int10', question: 'Vad är skillnaden mellan positionsverben (ligga/lägga, sitta/sätta, stå/ställa)?', answer: 'Första i paret anger befintlighet (är i positionen). Andra anger placering (sätter i positionen).', category: 'languages', difficulty: 'intermediate'},
  { id: 'swe_int11', question: 'Hur bildas komparativ och superlativ av adjektiv?', answer: 'Oftast med -are (komparativ) och -ast (superlativ). Vissa är oregelbundna (bra, bättre, bäst) eller behöver "mer/mest".', category: 'languages', difficulty: 'intermediate'},
  { id: 'swe_int12', question: 'Vad är ett partikelverb och hur skiljer det sig från verb + preposition?', answer: 'Verb + betonad partikel som ändrar betydelsen (t.ex. "hålla med"). Vid verb + preposition behåller prepositionen sin vanliga betydelse (t.ex. "titta på").', category: 'languages', difficulty: 'intermediate'},
  { id: 'swe_int13', question: 'Nämn några vanliga prepositioner för tid och rum.', answer: 'Rum: i, på, under, över, bredvid, framför, bakom. Tid: i, på, om, före, efter, sedan.', category: 'languages', difficulty: 'intermediate'},
  { id: 'swe_int14', question: 'Vad är skillnaden mellan huvudsats och bisats?', answer: 'Huvudsats kan stå ensam. Bisats kan inte stå ensam och fungerar som en satsdel i huvudsatsen, inleds ofta av subjunktion (att, om, när...).', category: 'languages', difficulty: 'intermediate'},
  { id: 'swe_int15', question: 'Hur används "som" (relativt pronomen)?', answer: 'Inleder en relativbisats som beskriver ett substantiv eller pronomen i huvudsatsen (korrelatet). Ex: "Kvinnan *som* bor där."', category: 'languages', difficulty: 'intermediate'},
  { id: 'swe_int16', question: 'Vad är rak ordföljd och omvänd ordföljd i huvudsatser?', answer: 'Rak: Subjekt-Verb (Jag äter). Omvänd: (Annat satsled)-Verb-Subjekt (Idag äter jag). Gäller V2-regeln.', category: 'languages', difficulty: 'intermediate'},
  { id: 'swe_int17', question: 'Hur bildas passiv form i svenskan?', answer: 'Vanligast med s-passiv (verbstam + -s: "boken läses"). Kan även bildas med "bli" + perfekt particip ("boken blir läst").', category: 'languages', difficulty: 'intermediate'},
  { id: 'swe_int18', question: 'Vad är skillnaden mellan perfekt och preteritum i användning?', answer: 'Preteritum (åt): avslutad dåtid. Perfekt (har ätit): koppling till nutid (resultat, erfarenhet, pågående tillstånd).', category: 'languages', difficulty: 'intermediate'},
  { id: 'swe_int19', question: 'Var placeras satsadverbialet "inte" i huvudsatser och bisatser?', answer: 'Huvudsats: efter det finita (böjda) verbet ("Jag kan *inte* komma"). Bisats: före det finita verbet ("...att jag *inte* kan komma"). (BIFF-regeln)', category: 'languages', difficulty: 'intermediate'},
  { id: 'swe_int20', question: 'Vad är skillnaden mellan "någon/något/några" och "ingen/inget/inga"?', answer: 'Första gruppen = obestämt pronomen (jakande/frågande). Andra gruppen = negerande pronomen.', category: 'languages', difficulty: 'intermediate'},

  // --- Swedish - Advanced ---
  { id: 'swe-adv1', question: 'När används konjunktiv i modern svenska?', answer: 'Främst i fasta uttryck (Leve kungen!), önskesatser (Gud vare lov!), formella uppmaningar (Man taga vad man haver), och i vissa bisatser (Om jag vore du...).', category: 'languages', difficulty: 'advanced'},
  { id: 'swe_adv2', question: 'Förklara V2-regeln mer i detalj.', answer: 'Det finita (tempusböjda) verbet kommer alltid på andra plats i deklarativa (påstående) huvudsatser, oavsett vad som står på första plats (fundamentet).', category: 'languages', difficulty: 'advanced'},
  { id: 'swe_adv3', question: 'Hur fungerar det reflexiva possessiva pronomenet "sin/sitt/sina"?', answer: 'Används när det syftar tillbaka på subjektet i samma (finita) sats. Jämför: "Anna ser *sin* bil" vs. "Anna ser *hennes* bil" (någon annans).', category: 'languages', difficulty: 'advanced'},
  { id: 'swe_adv4', question: 'Vilka substantiv är oregelbundna i plural?', answer: 'Exempel: man-män, mus-möss, fot-fötter, öga-ögon, hand-händer, bok-böcker.', category: 'languages', difficulty: 'advanced'},
  { id: 'swe_adv5', question: 'Vad är BIFF-regeln?', answer: 'En minnesregel för placering av satsadverbial (som "inte") i bisatser: Bisats-Inte-Före-Finit verb.', category: 'languages', difficulty: 'advanced'},
  { id: 'swe_adv6', question: 'Vad är supinum och hur används det?', answer: 'En verbform (slutar oftast på -t: sprungit, läst) som används tillsammans med hjälpverbet "ha" för att bilda perfekt och pluskvamperfekt.', category: 'languages', difficulty: 'advanced'},
  { id: 'swe_adv7', question: 'Vad är presens particip och perfekt particip? Ge exempel.', answer: 'Presens particip (-ande/-ende: "gående") beskriver pågående. Perfekt particip (böjs som adjektiv: "målad", "målat", "målade") beskriver resultat/passiv.', category: 'languages', difficulty: 'advanced'},
  { id: 'swe_adv8', question: 'Ge exempel på korrelativa konjunktioner.', answer: 'Par som binder samman: både...och, antingen...eller, varken...eller, såväl...som, dels...dels.', category: 'languages', difficulty: 'advanced'},
  { id: 'swe_adv9', question: 'Hur omvandlas direkt tal till indirekt tal (tempusförskjutning)?', answer: 'Ofta sker en tillbakaflyttning av tempus: presens -> preteritum, preteritum -> pluskvamperfekt. ("Jag kommer" -> Han sa att han *kom* / *skulle komma*).', category: 'languages', difficulty: 'advanced'},
  { id: 'swe_adv10', question: 'Vad är skillnaden mellan "vilken/vilket/vilka" och "vars" som relativa pronomen?', answer: '"Vilken/vilket/vilka" syftar på substantiv (mer formellt än "som"). "Vars" är genitivformen (ägande): "Mannen *vars* bil blev stulen...".', category: 'languages', difficulty: 'advanced'},
  { id: 'swe_adv11', question: 'Vad är en nominalfras och dess struktur?', answer: 'Fras med substantiv/pronomen som huvudord. Kan innehålla bestämningar: artikel (den), possessiv (min), adjektiv (stora), prepositionsfras (på bordet).', category: 'languages', difficulty: 'advanced'},
  { id: 'swe_adv12', question: 'Förklara tema och rema.', answer: 'Tema: det satsen handlar om (ofta känd info, först i satsen). Rema: det som sägs om temat (ofta ny info, senare i satsen).', category: 'languages', difficulty: 'advanced'},
  { id: 'swe_adv13', question: 'Ge exempel på formellt vs informellt språkbruk.', answer: 'Formellt: "undertecknad anhåller om", "vederbörande". Informellt: "jag vill ha", "den där personen", slang.', category: 'languages', difficulty: 'advanced'},
  { id: 'swe_adv14', question: 'När används genitiv-s och när används prepositionsfras för ägande?', answer: 'Genitiv-s främst vid personer/djur ("Annas bok"). Prepositionsfras ofta vid saker ("taket *på huset*").', category: 'languages', difficulty: 'advanced'},
  { id: 'swe_adv15', question: 'Vad är skillnaden mellan transitiva, intransitiva och ditransitiva verb?', answer: 'Transitiva tar direkt objekt (ser *en film*). Intransitiva tar inget objekt (sover). Ditransitiva tar både direkt och indirekt objekt (gav *henne* *en bok*).', category: 'languages', difficulty: 'advanced'},

  // --- Swedish - Expert ---
  { id: 'swe_ex1', question: 'Diskutera aspekt i svenskan (perfektiv/imperfektiv).', answer: 'Svenskan markerar inte aspekt lika tydligt som slaviska språk. Preteritum ses ofta som perfektivt (avslutad helhet), medan presens/konstruktioner med "hålla på" kan vara imperfektiva (pågående).', category: 'languages', difficulty: 'expert'},
  { id: 'swe_ex2', question: 'Vad är skillnaden mellan satsadverbial och andra adverbial?', answer: 'Satsadverbial modifierar hela satsen (dess sanningsvärde/modalitet, t.ex. "inte", "kanske", "tyvärr"). Andra adverbial (tid, rum, sätt) modifierar verbet/predikatet.', category: 'languages', difficulty: 'expert'},
  { id: 'swe_ex3', question: 'Hur påverkar partikelns position syntaxen i satser med partikelverb?', answer: 'I huvudsatser står partikeln ofta sist ("Han tog *på sig* jackan"). I bisatser står partikeln direkt efter verbet ("...att han tog *på sig* jackan").', category: 'languages', difficulty: 'expert'},
  { id: 'swe_ex4', question: 'Vad är topikaliseringsinversion?', answer: 'När ett annat satsled än subjektet (t.ex. adverbial, objekt) placeras först i huvudsatsen (i fundamentposition), vilket kräver omvänd ordföljd (Verb-Subjekt).', category: 'languages', difficulty: 'expert'},
  { id: 'swe_ex5', question: 'Ge exempel på olika typer av nominala bisatser.', answer: 'Att-satser ("*Att du kom* gladde mig"), indirekta frågesatser ("Jag undrar *vem som kommer*"), infinitivfraser ("*Att resa* är roligt" - mer fras än bisats).', category: 'languages', difficulty: 'expert'},
  { id: 'swe_ex6', question: 'Vad är avljud (ablaut)?', answer: 'Systematisk vokalväxling som används för att bilda böjningsformer, främst hos starka verb (t.ex. dricka-drack-druckit).', category: 'languages', difficulty: 'expert'},
  { id: 'swe_ex7', question: 'Förklara kongruensböjning av perfekt particip.', answer: 'Böjs som adjektiv: efter huvudordets genus, numerus och bestämdhet (en *målad* dörr, ett *målat* fönster, *målade* dörrar, den *målade* dörren).', category: 'languages', difficulty: 'expert'},
  { id: 'swe_ex8', question: 'Vad är subjektiv och objektiv predikativ (predikatsfyllnad)?', answer: 'Subjektiv: beskriver subjektet via kopulaverb ("Han är *läkare*"). Objektiv: beskriver objektet efter vissa verb ("De valde henne *till ordförande*").', category: 'languages', difficulty: 'expert'},
  { id: 'swe_ex11', question: 'Diskutera tendenser i modern svensk språkutveckling (t.ex. engelsk påverkan, förenklingar).', answer: 'Stor engelsk påverkan (lånord, syntax), tendens till förenklad meningsbyggnad i vissa genrer, ökad användning av "hen", debatt om "de/dem".', category: 'languages', difficulty: 'expert'},
  { id: 'swe_ex12', question: 'Vad är skillnaden mellan fonem och allofon?', answer: 'Fonem: minsta betydelseskiljande ljudenheten (t.ex. /r/ i "ris" vs "fis"). Allofon: uttalsvariant av ett fonem som inte ändrar betydelsen (t.ex. olika r-ljud).', category: 'languages', difficulty: 'expert'},
  { id: 'swe_ex13', question: 'Vilka kasus finns kvar i modern standardsvenska?', answer: 'Nominativ (grundform) och Genitiv (ägande, -s). Pronomen har även ackusativ/objektsform (mig, dig, honom, henne, oss, er, dem).', category: 'languages', difficulty: 'expert'},
  { id: 'swe_ex14', question: 'Vad är skillnaden mellan semantik och pragmatik?', answer: 'Semantik: ords/satsers bokstavliga, kontextoberoende betydelse. Pragmatik: hur språket används i kontext, hur talare menar/tolkar (implikaturer).', category: 'languages', difficulty: 'expert'},
  { id: 'swe_ex15', question: 'Vad innebar du-reformen?', answer: 'Informell övergång (främst sent 60-tal) från att använda titlar + efternamn eller "Ni" till det generella tilltalsordet "du", vilket minskade hierarkiska markörer i språket.', category: 'languages', difficulty: 'expert'},

  // --- English - Beginner ---
  { id: 'eng_beg1', question: 'What is "cat" in English?', answer: 'Cat.', category: 'languages', difficulty: 'beginner'},
  { id: 'eng_beg2', question: 'How do you say "tack" in English?', answer: '"Thank you".', category: 'languages', difficulty: 'beginner'},
  { id: 'eng_beg3', question: 'How do you count to five in English?', answer: '"One, two, three, four, five".', category: 'languages', difficulty: 'beginner'},
  { id: 'eng_beg4', question: 'What is the English word for "vatten"?', answer: '"Water".', category: 'languages', difficulty: 'beginner'},
  { id: 'eng_beg5', question: 'How do you say "jag heter..." in English?', answer: '"My name is...".', category: 'languages', difficulty: 'beginner'},
  { id: 'eng_beg6', question: 'How do you say "hej då" in English?', answer: '"Goodbye" or "Bye".', category: 'languages', difficulty: 'beginner'},
  { id: 'eng_beg7', question: 'What are the English words for "ja" and "nej"?', answer: '"Yes" and "No".', category: 'languages', difficulty: 'beginner'},
  { id: 'eng_beg8', question: 'How do you say "snälla" (please) in English?', answer: '"Please".', category: 'languages', difficulty: 'beginner'},
  { id: 'eng_beg9', question: 'What is the English word for "hund"?', answer: '"Dog".', category: 'languages', difficulty: 'beginner'},
  { id: 'eng_beg10', question: 'How do you ask "Vad är klockan?" in English?', answer: '"What time is it?".', category: 'languages', difficulty: 'beginner'},

  // --- English - Intermediate ---
  { id: 'eng_int1', question: 'What is the past tense of "go", "eat", "see"?', answer: '"Went", "ate", "saw".', category: 'languages', difficulty: 'intermediate'},
  { id: 'eng_int2', question: 'Explain the difference between "its" and "it\'s".', answer: '"Its" = possessive pronoun (The dog wagged *its* tail). "It\'s" = contraction of "it is" or "it has" (*It\'s* raining).', category: 'languages', difficulty: 'intermediate'},
  { id: 'eng_int3', question: 'What are the comparative and superlative forms of "good"?', answer: '"Better" (comparative), "best" (superlative).', category: 'languages', difficulty: 'intermediate'},
  { id: 'eng_int4', question: 'When do you use "a" and when "an"?', answer: '"A" before consonant sounds (a cat, a university). "An" before vowel sounds (an apple, an hour).', category: 'languages', difficulty: 'intermediate'},
  { id: 'eng_int5', question: 'How do you form the present continuous tense?', answer: 'Subject + form of "to be" (am/is/are) + verb-ing. (Example: "They *are playing*.")', category: 'languages', difficulty: 'intermediate'},
  { id: 'eng_int6', question: 'What is the difference between "there", "their", and "they\'re"?', answer: '"There" = place (over there). "Their" = possessive (their car). "They\'re" = contraction of "they are" (they\'re happy).', category: 'languages', difficulty: 'intermediate'},
  { id: 'eng_int7', question: 'How do you make a noun plural in most cases?', answer: 'Add "-s" (cat -> cats). Exceptions exist (child -> children, mouse -> mice).', category: 'languages', difficulty: 'intermediate'},
  { id: 'eng_int8', question: 'What is the simple past tense used for?', answer: 'To describe completed actions or states in the past (e.g., "She *visited* London last year.").', category: 'languages', difficulty: 'intermediate'},
  { id: 'eng_int9', question: 'What does the modal verb "can" express?', answer: 'Ability ("I *can* swim") or permission ("*Can* I go?").', category: 'languages', difficulty: 'intermediate'},
  { id: 'eng_int10', question: 'What is the difference between "who" and "whom"?', answer: '"Who" is used as the subject of a verb. "Whom" is used as the object of a verb or preposition (less common in informal speech).', category: 'languages', difficulty: 'intermediate'},

  // --- English - Advanced ---
  { id: 'eng_adv1', question: 'Explain the use of the present perfect continuous tense.', answer: 'Used for actions that started in the past and are still continuing, or recently stopped actions with present results, emphasizing duration. (e.g., "I *have been waiting* for an hour.").', category: 'languages', difficulty: 'advanced'},
  { id: 'eng_adv2', question: 'What is a common structure for phrasal verbs? Give separable/inseparable examples.', answer: 'Verb + particle (adverb/preposition). Separable: "turn *the light* off" / "turn off *the light*". Inseparable: "look after *the children*" (not "look the children after").', category: 'languages', difficulty: 'advanced'},
  { id: 'eng_adv3', question: 'Explain the difference between "affect" and "effect".', answer: '"Affect" (verb) = to influence/impact. "Effect" (noun) = a result/consequence. (Less common: "effect" (verb) = to bring about).', category: 'languages', difficulty: 'advanced'},
  { id: 'eng_adv4', question: 'Give examples of the three main types of conditional sentences.', answer: 'Type 1 (real): "If it rains, we will stay inside." Type 2 (unreal present): "If I had money, I would travel." Type 3 (unreal past): "If I had studied, I would have passed."', category: 'languages', difficulty: 'advanced'},
  { id: 'eng_adv5', question: 'When is the subjunctive mood typically used?', answer: 'In "that"-clauses after verbs of demand/request/suggestion ("I demand that he *be* present"), for wishes ("I wish I *were* rich"), and certain fixed expressions ("God save the Queen").', category: 'languages', difficulty: 'advanced'},
  { id: 'eng_adv6', question: 'What is reported speech (indirect speech)?', answer: 'Reporting what someone said without using their exact words, often involving changes in tense, pronouns, and time/place expressions.', category: 'languages', difficulty: 'advanced'},
  { id: 'eng_adv7', question: 'What are participles and how can they be used as adjectives?', answer: 'Present participle (-ing form): describes something performing an action ("a *boring* film"). Past participle (-ed/-en form): describes something receiving an action ("a *broken* window").', category: 'languages', difficulty: 'advanced'},
  { id: 'eng_adv8', question: 'Explain the use of definite and zero articles with abstract/general nouns.', answer: 'Definite article ("the"): specific reference ("*The* happiness she felt..."). Zero article: general sense ("*Happiness* is important.").', category: 'languages', difficulty: 'advanced'},
  { id: 'eng_adv9', question: 'What is a gerund?', answer: 'A verb form ending in -ing that functions as a noun (e.g., "*Swimming* is fun.", "I enjoy *reading*.").', category: 'languages', difficulty: 'advanced'},
  { id: 'eng_adv10', question: 'What is the difference between "used to" and "be used to"?', answer: '"Used to + infinitive": past habit/state no longer true ("I *used to live* there"). "Be used to + -ing/noun": accustomed to something ("I *am used to waking* up early").', category: 'languages', difficulty: 'advanced'},

  // --- English - Expert ---
  { id: 'eng_ex1', question: 'Provide examples of inversion after negative adverbials.', answer: '"*Never before* had I seen such a sight." "*Rarely* do we get the chance..." "*Under no circumstances* should you open that door."', category: 'languages', difficulty: 'expert'},
  { id: 'eng_ex2', question: 'What defines restrictive and non-restrictive relative clauses syntactically and semantically?', answer: 'Restrictive: essential for identifying the noun, no commas, "that" possible. Non-restrictive: adds extra info, set off by commas, "that" not possible.', category: 'languages', difficulty: 'expert'},
  { id: 'eng_ex3', question: 'Discuss the deontic vs. epistemic meanings of modal verbs.', answer: 'Deontic: relates to permission, obligation, duty ("You *must* leave"). Epistemic: relates to possibility, probability, certainty ("It *must* be late").', category: 'languages', difficulty: 'expert'},
  { id: 'eng_ex4', question: 'Explain the structure and function of "it-cleft" and "wh-cleft" sentences.', answer: 'It-cleft: "It is/was [emphasized element] that/who [rest of clause]" (Emphasizes noun phrase/prepositional phrase). Wh-cleft: "What/Where/Why... is/was [emphasized element]" (Emphasizes clause/verb phrase).', category: 'languages', difficulty: 'expert'},
  { id: 'eng_ex5', question: 'Describe the key vowel changes in the Great Vowel Shift.', answer: 'Long high vowels [i:, u:] became diphthongs [aɪ, aʊ] (e.g., "mīs" > "mice", "hūs" > "house"). Other long vowels generally raised their position (e.g., [e:] > [i:], [ɔ:] > [o:] > [u:]).', category: 'languages', difficulty: 'expert'},
  { id: 'eng_ex6', question: 'What are dangling modifiers?', answer: 'A modifying phrase (often participial) whose implied subject does not match the subject of the main clause (e.g., "*Walking down the street*, the buildings looked tall." - Who is walking?).', category: 'languages', difficulty: 'expert'},
  { id: 'eng_ex7', question: 'What is grammaticalization?', answer: 'The process whereby lexical words (nouns, verbs) or constructions evolve into grammatical markers (affixes, prepositions, auxiliaries). E.g., "going to" -> "gonna" (future marker).', category: 'languages', difficulty: 'expert'},
  { id: 'eng_ex8', question: 'Discuss stylistic differences between British and American English (e.g., vocabulary, spelling).', answer: 'Vocab: lift/elevator, flat/apartment, lorry/truck. Spelling: -our/-or (colour/color), -ise/-ize (realise/realize), -re/-er (centre/center).', category: 'languages', difficulty: 'expert'},
  { id: 'eng_ex9', question: 'What is deixis in language?', answer: 'Words or phrases whose meaning depends on the context of utterance (speaker, listener, time, place). E.g., "I", "you", "here", "now", "yesterday".', category: 'languages', difficulty: 'expert'},
  { id: 'eng_ex10', question: 'What is aspect in English verbs (perfective/progressive)?', answer: 'Perfective aspect (simple/perfect tenses): views event as completed whole. Progressive aspect (-ing forms): views event as ongoing/in progress.', category: 'languages', difficulty: 'expert'},

  // --- General Linguistics - Beginner ---
  { id: 'lang_beg21', question: 'Vad är ett substantiv?', answer: 'Ett ord som betecknar personer, platser, saker eller idéer (t.ex. hund, stad, bok).', category: 'languages', difficulty: 'beginner'},
  { id: 'lang_beg22', question: 'Vad är ett verb?', answer: 'Ett ord som beskriver en handling, händelse eller ett tillstånd (t.ex. springa, äta, vara).', category: 'languages', difficulty: 'beginner'},
  { id: 'lang_beg23', question: 'Vad är ett adjektiv?', answer: 'Ett ord som beskriver ett substantiv eller pronomen (t.ex. stor, röd, glad).', category: 'languages', difficulty: 'beginner'},
  { id: 'lang_beg24', question: 'Vad är ett pronomen?', answer: 'Ett ord som ersätter ett substantiv (t.ex. jag, hon, den, vi).', category: 'languages', difficulty: 'beginner'},
  { id: 'lang_beg25', question: 'Vad är singular och plural?', answer: 'Singular = ental (en bok). Plural = flertal (flera böcker).', category: 'languages', difficulty: 'beginner'},

  // --- General Linguistics - Intermediate ---
  { id: 'lang_int21', question: 'Vad är fonetik?', answer: 'Studiet av språkljudens fysiska egenskaper (produktion, akustik, perception).', category: 'languages', difficulty: 'intermediate'},
  { id: 'lang_int22', question: 'Vad är fonologi?', answer: 'Studiet av ljudsystemet i ett språk och hur ljud fungerar för att skilja betydelser (fonem).', category: 'languages', difficulty: 'intermediate'},
  { id: 'lang_int23', question: 'Vad är morfologi?', answer: 'Studiet av ords struktur och hur ord bildas (böjningar, avledningar).', category: 'languages', difficulty: 'intermediate'},
  { id: 'lang_int24', question: 'Vad är syntax?', answer: 'Studiet av hur ord kombineras för att bilda fraser och satser; grammatiska regler för meningsbyggnad.', category: 'languages', difficulty: 'intermediate'},
  { id: 'lang_int25', question: 'Vad är semantik?', answer: 'Studiet av betydelse i språk, både för enskilda ord och för satser.', category: 'languages', difficulty: 'intermediate'},

  // --- General Linguistics - Advanced ---
  { id: 'lang_adv21', question: 'Vad är en språkfamilj?', answer: 'En grupp språk som har utvecklats från ett gemensamt urspråk (protospråk). Ex: Indoeuropeiska, Sinotibetanska.', category: 'languages', difficulty: 'advanced'},
  { id: 'lang_adv22', question: 'Vad är skillnaden mellan en dialekt och ett språk?', answer: 'Gränsen är flytande och ofta politisk/social. Generellt: dialekter av samma språk är (oftast) ömsesidigt förståeliga.', category: 'languages', difficulty: 'advanced'},
  { id: 'lang_adv23', question: 'Vad är pragmatik inom lingvistik?', answer: 'Studiet av hur kontext påverkar tolkningen av språklig betydelse; hur vi förstår mer än vad som bokstavligen sägs.', category: 'languages', difficulty: 'advanced'},
  { id: 'lang_adv24', question: 'Vad är sociolingvistik?', answer: 'Studiet av sambandet mellan språk och samhälle, inklusive språklig variation baserad på sociala faktorer (klass, kön, ålder etc.).', category: 'languages', difficulty: 'advanced'},
  { id: 'lang_adv25', question: 'Vad är historisk lingvistik?', answer: 'Studiet av hur språk förändras över tid och hur språk är relaterade till varandra.', category: 'languages', difficulty: 'advanced'},

  // --- General Linguistics - Expert ---
  { id: 'lang_ex21', question: 'Vad är universell grammatik (Chomsky)?', answer: 'Teori att människor föds med en medfödd förmåga för språk, en underliggande grammatisk struktur som är gemensam för alla mänskliga språk.', category: 'languages', difficulty: 'expert'},
  { id: 'lang_ex22', question: 'Vad är Sapir-Whorf-hypotesen?', answer: 'Hypotesen (i stark/svag form) att språket vi talar påverkar eller till och med bestämmer hur vi tänker och uppfattar världen.', category: 'languages', difficulty: 'expert'},
  { id: 'lang_ex23', question: 'Vad är kognitiv lingvistik?', answer: 'Inriktning som ser språk som en integrerad del av mänsklig kognition och studerar hur språkliga strukturer relaterar till tänkande, perception och kategorisering.', category: 'languages', difficulty: 'expert'},
  { id: 'lang_ex24', question: 'Diskutera olika teorier om språkinlärning (behaviorism, innatism, interaktionism).', answer: 'Behaviorism (imitation/förstärkning), Innatism (medfödd språkförmåga, LAD), Interaktionism (social interaktion och kognitiv utveckling driver språkinlärning).', category: 'languages', difficulty: 'expert'},
  { id: 'lang_ex25', question: 'Vad är korpuslingvistik?', answer: 'Metod där man studerar språk genom att analysera stora samlingar av autentisk text och tal (korpusar) med hjälp av datorverktyg.', category: 'languages', difficulty: 'expert'},

];