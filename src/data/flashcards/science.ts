import { Flashcard } from '@/types/flashcard';

export const scienceFlashcards: Flashcard[] = [
  // --- Biology - Beginner ---
  { id: 'sci-beg1', question: 'Vad är fotosyntes?', answer: 'Processen där växter använder solljus, vatten och koldioxid för att skapa sin egen näring (socker) och syre.', category: 'science', difficulty: 'beginner'},
  { id: 'sci_bio_beg2', question: 'Vad är en cell?', answer: 'Den grundläggande byggstenen i allt levande.', category: 'science', difficulty: 'beginner'},
  { id: 'sci_bio_beg3', question: 'Vad är skillnaden mellan en växtcell och en djurcell?', answer: 'Växtceller har cellvägg, kloroplaster och oftast en stor vakuol, vilket djurceller saknar.', category: 'science', difficulty: 'beginner'},
  { id: 'sci_bio_beg4', question: 'Vad är DNA?', answer: 'Molekylen som bär den genetiska informationen (arvsmassan).', category: 'science', difficulty: 'beginner'},
  { id: 'sci_bio_beg5', question: 'Vad är ett ekosystem?', answer: 'Ett område där levande organismer interagerar med varandra och sin icke-levande miljö.', category: 'science', difficulty: 'beginner'},

  // --- Chemistry - Beginner ---
  { id: 'sci-beg2', question: 'Vilka är de tre vanligaste aggregationstillstånden för materia?', answer: 'Fast, flytande och gas.', category: 'science', difficulty: 'beginner'},
  { id: 'sci_chem_beg2', question: 'Vad är en atom?', answer: 'Den minsta byggstenen av ett grundämne som behåller ämnets kemiska egenskaper.', category: 'science', difficulty: 'beginner'},
  { id: 'sci_chem_beg3', question: 'Vad är en molekyl?', answer: 'Två eller flera atomer som är kemiskt bundna till varandra.', category: 'science', difficulty: 'beginner'},
  { id: 'sci_chem_beg4', question: 'Vad är den kemiska formeln för vatten?', answer: 'H₂O (två väteatomer och en syreatom).', category: 'science', difficulty: 'beginner'},
  { id: 'sci_chem_beg5', question: 'Vad är en kemisk reaktion?', answer: 'En process där ett eller flera ämnen (reaktanter) omvandlas till nya ämnen (produkter) genom att bindningar bryts och bildas.', category: 'science', difficulty: 'beginner'},

  // --- Physics - Beginner ---
  { id: 'sci_phy_beg1', question: 'Vad är gravitation?', answer: 'Den attraherande kraften mellan objekt som har massa.', category: 'science', difficulty: 'beginner'},
  { id: 'sci_phy_beg2', question: 'Vad är energi?', answer: 'Förmågan att utföra arbete. Kan inte skapas eller förstöras, bara omvandlas.', category: 'science', difficulty: 'beginner'},
  { id: 'sci_phy_beg3', question: 'Vad är ljud?', answer: 'Vibrationer som färdas som vågor genom ett medium (t.ex. luft, vatten).', category: 'science', difficulty: 'beginner'},
  { id: 'sci_phy_beg4', question: 'Vad är ljus?', answer: 'Elektromagnetisk strålning som är synlig för det mänskliga ögat.', category: 'science', difficulty: 'beginner'},
  { id: 'sci_phy_beg5', question: 'Vad är en magnet?', answer: 'Ett objekt som skapar ett magnetfält och kan attrahera järn.', category: 'science', difficulty: 'beginner'},


  // --- Biology - Intermediate ---
  { id: 'sci_bio_int1', question: 'Vad är cellandning?', answer: 'Processen där celler bryter ner glukos med syre för att frigöra energi (ATP), koldioxid och vatten. Sker främst i mitokondrierna.', category: 'science', difficulty: 'intermediate'},
  { id: 'sci_bio_int2', question: 'Vad är evolution genom naturligt urval?', answer: 'Processen där organismer med fördelaktiga egenskaper har större chans att överleva och fortplanta sig, vilket leder till anpassning över tid.', category: 'science', difficulty: 'intermediate'},
  { id: 'sci_bio_int3', question: 'Vad är skillnaden mellan mitos och meios?', answer: 'Mitos = vanlig celldelning (två identiska diploida celler). Meios = reduktionsdelning (producerar haploida könsceller).', category: 'science', difficulty: 'intermediate'},
  { id: 'sci_bio_int4', question: 'Vad är ett enzym?', answer: 'Ett protein som fungerar som en biologisk katalysator och påskyndar specifika kemiska reaktioner i cellen.', category: 'science', difficulty: 'intermediate'},
  { id: 'bio-adv1', question: 'Vad är ATP och dess roll i cellen?', answer: 'ATP (Adenosintrifosfat) är den primära, universella energibäraren i celler, används för att driva de flesta energikrävande processer.', category: 'science', difficulty: 'intermediate'}, // Reclassified as Intermediate

  // --- Chemistry - Intermediate ---
  { id: 'sci_int6', question: 'Vad är pH-skalan och vad mäter den?', answer: 'Mäter surhetsgrad (koncentration av vätejoner). Lågt pH (<7) = surt, högt pH (>7) = basiskt, 7 = neutralt.', category: 'science', difficulty: 'intermediate'},
  { id: 'sci_int9', question: 'Vad är en kemisk bindning? Ge exempel.', answer: 'Kraften som håller samman atomer. Exempel: Kovalent (delade elektroner), Jonbindning (elektrostatisk attraktion), Metallbindning.', category: 'science', difficulty: 'intermediate'},
  { id: 'sci_int10', question: 'Vad är det periodiska systemet?', answer: 'En tabell som organiserar grundämnen efter atomnummer, elektronkonfiguration och återkommande kemiska egenskaper.', category: 'science', difficulty: 'intermediate'},
  { id: 'sci_int16', question: 'Vad är en katalysator inom kemi?', answer: 'Ett ämne som ökar reaktionshastigheten utan att själv förbrukas permanent i reaktionen.', category: 'science', difficulty: 'intermediate'},
  { id: 'sci_chem_int5', question: 'Vad är en isotop?', answer: 'Atomer av samma grundämne (samma antal protoner) men med olika antal neutroner (olika masstal).', category: 'science', difficulty: 'intermediate'},

  // --- Physics - Intermediate ---
  { id: 'phys1', question: 'Vad är Newtons första lag (tröghetslagen)?', answer: 'Ett objekt förblir i vila eller likformig rörelse om ingen yttre nettokraft verkar på det.', category: 'science', difficulty: 'intermediate'},
  { id: 'phys2', question: 'Vad mäter enheten Newton (N)?', answer: 'Kraft. Definition: den kraft som ger massan 1 kg accelerationen 1 m/s². (F=ma).', category: 'science', difficulty: 'intermediate'},
  { id: 'phys3', question: 'Vad är energiprincipen (energibevarande)?', answer: 'Energi kan varken skapas eller förstöras, endast omvandlas mellan olika former (t.ex. kinetisk, potentiell, termisk).', category: 'science', difficulty: 'intermediate'},
  { id: 'phys4', question: 'Vad är skillnaden mellan massa och tyngd?', answer: 'Massa är ett mått på mängden materia (kg). Tyngd är gravitationskraften som verkar på massan (N).', category: 'science', difficulty: 'intermediate'}, // Renamed from 'vikt' to 'tyngd'
  { id: 'phys5', question: 'Vad är Pascals princip?', answer: 'Tryckförändringar i en innesluten, inkompressibel vätska fortplantas oförminskat till alla delar av vätskan och kärlets väggar.', category: 'science', difficulty: 'intermediate'},
  { id: 'sci_phy_int6', question: 'Vad är Arkimedes princip?', answer: 'Lyftkraften på ett helt eller delvis nedsänkt föremål är lika stor som tyngden av den vätska som föremålet tränger undan.', category: 'science', difficulty: 'intermediate'},
  { id: 'sci_phy_int7', question: 'Vad är skillnaden mellan värme och temperatur?', answer: 'Temperatur är ett mått på partiklarnas genomsnittliga kinetiska energi. Värme är överföringen av termisk energi pga temperaturskillnad.', category: 'science', difficulty: 'intermediate'},
  { id: 'sci_phy_int8', question: 'Vad är en våglängd och frekvens för en våg?', answer: 'Våglängd (λ) är avståndet mellan två motsvarande punkter. Frekvens (f) är antalet svängningar per sekund (Hz). Relaterade via v = λf (v=våghastighet).', category: 'science', difficulty: 'intermediate'},
  { id: 'sci_phy_int9', question: 'Vad är det elektromagnetiska spektrumet?', answer: 'Hela omfånget av elektromagnetisk strålning ordnat efter våglängd/frekvens (radio, mikro, IR, synligt ljus, UV, röntgen, gamma).', category: 'science', difficulty: 'intermediate'},
  { id: 'sci_phy_int10', question: 'Vad är Dopplereffekten?', answer: 'Förändringen i observerad frekvens hos en våg när källan och observatören rör sig relativt varandra.', category: 'science', difficulty: 'intermediate'},

  // --- Biology - Advanced ---
  { id: 'sci_bio_adv1', question: 'Förklara den centrala dogmen inom molekylärbiologi.', answer: 'Beskriver informationsflödet: DNA -> (transkription) -> RNA -> (translation) -> Protein. (Undantag finns, t.ex. retrovirus).', category: 'science', difficulty: 'advanced'},
  { id: 'sci_bio_adv2', question: 'Vad är PCR (Polymerase Chain Reaction)?', answer: 'En metod för att exponentiellt amplifiera (kopiera) specifika DNA-segment in vitro.', category: 'science', difficulty: 'advanced'},
  { id: 'sci_bio_adv3', question: 'Vad är apoptos?', answer: 'Programmerad, kontrollerad celldöd som är nödvändig för normal utveckling och vävnadshomeostas.', category: 'science', difficulty: 'advanced'},
  { id: 'sci_bio_adv4', question: 'Vad är neurotransmittorer? Ge exempel.', answer: 'Kemiska signalsubstanser som överför nervsignaler över synapser. Exempel: acetylkolin, dopamin, serotonin, GABA.', category: 'science', difficulty: 'advanced'},
  { id: 'sci_bio_adv5', question: 'Vad är ett antigen och en antikropp?', answer: 'Antigen: molekyl (ofta främmande) som kan trigga immunsvar. Antikropp: protein producerat av B-celler som specifikt binder till ett antigen.', category: 'science', difficulty: 'advanced'},

  // --- Chemistry - Advanced ---
  { id: 'chem-adv1', question: 'Förklara begreppet entalpi (H).', answer: 'Ett termodynamiskt tillståndsmått som representerar systemets totala värmeinnehåll vid konstant tryck. ΔH = värmeutbytet i en reaktion.', category: 'science', difficulty: 'advanced'},
  { id: 'sci_adv8', question: 'Vad är en redoxreaktion?', answer: 'En kemisk reaktion där oxidationstal ändras; innebär överföring av elektroner. Oxidation = ökning i oxidationstal, Reduktion = minskning.', category: 'science', difficulty: 'advanced'},
  { id: 'sci_chem_adv3', question: 'Vad är termodynamikens andra huvudsats (entropi)?', answer: 'Den totala entropin (mått på oordning/energispridning) i ett isolerat system ökar alltid eller förblir konstant vid spontana processer.', category: 'science', difficulty: 'advanced'},
  { id: 'sci_chem_adv4', question: 'Vad är en isomer inom kemi?', answer: 'Molekyler som har samma molekylformel men olika struktur (atomernas arrangemang) och därmed olika egenskaper.', category: 'science', difficulty: 'advanced'},
  { id: 'sci_chem_adv5', question: 'Vad är aktiveringsenergi?', answer: 'Den minimienergi som krävs för att starta en kemisk reaktion.', category: 'science', difficulty: 'advanced'},

  // --- Physics - Advanced ---
  { id: 'sci_adv5', question: 'Vad är den speciella relativitetsteorin?', answer: 'Einsteins teori (1905) baserad på två postulat: fysikens lagar är desamma i alla inertialsystem & ljushastigheten i vakuum är konstant för alla observatörer. Leder till tidsdilation, längdkontraktion, E=mc².', category: 'science', difficulty: 'advanced'},
  { id: 'sci_adv6', question: 'Vad är kvantmekanikens våg-partikeldualitet?', answer: 'Konceptet att mikroskopiska objekt (t.ex. elektroner, fotoner) kan uppvisa egenskaper hos både vågor (interferens, diffraktion) och partiklar (lokaliserad position, rörelsemängd).', category: 'science', difficulty: 'advanced'},
  { id: 'sci_adv7', question: 'Förklara Heisenbergs osäkerhetsprincip.', answer: 'Det finns en fundamental gräns för hur exakt man samtidigt kan känna till vissa par av komplementära variabler för en partikel, t.ex. position (Δx) och rörelsemängd (Δp): Δx * Δp ≥ ħ/2.', category: 'science', difficulty: 'advanced'},
  { id: 'sci_phy_adv4', question: 'Vad är Big Bang-teorin?', answer: 'Den ledande kosmologiska modellen som beskriver universums expansion från ett extremt hett och tätt initialtillstånd för ca 13.8 miljarder år sedan.', category: 'science', difficulty: 'advanced'},
  { id: 'sci_phy_adv5', question: 'Vad är radioaktivt sönderfall?', answer: 'Spontan process där instabila atomkärnor omvandlas till stabilare kärnor genom att utsända partiklar (alfa, beta) och/eller energi (gamma).', category: 'science', difficulty: 'advanced'},


  // --- Biology - Expert ---
  { id: 'sci_bio_ex1', question: 'Diskutera CRISPR-Cas9 genredigering.', answer: 'Ett system (ursprungligen bakteriellt immunförsvar) som möjliggör precis redigering av DNA-sekvenser. Cas9-enzymet klipper DNA vid en plats specificerad av ett guide-RNA.', category: 'science', difficulty: 'expert'},
  { id: 'sci_bio_ex2', question: 'Vad är epigenetik?', answer: 'Studiet av ärftliga förändringar i genuttryck som inte beror på ändringar i DNA-sekvensen (t.ex. DNA-metylering, histonmodifiering).', category: 'science', difficulty: 'expert'},
  { id: 'sci_bio_ex3', question: 'Förklara mekanismen bakom långtidspotentiering (LTP) i nervsystemet.', answer: 'En varaktig förstärkning av synaptisk signalöverföring, tros vara viktig för inlärning/minne. Involverar ofta NMDA-receptoraktivering och postsynaptiska förändringar.', category: 'science', difficulty: 'expert'},
  { id: 'sci_bio_ex4', question: 'Vad är HPA-axeln (Hypothalamus-Pituitary-Adrenal axis)?', answer: 'Ett centralt neuroendokrint system som reglerar stressrespons och många kroppsfunktioner via frisättning av CRH, ACTH och kortisol.', category: 'science', difficulty: 'expert'},
  { id: 'sci_bio_ex5', question: 'Diskutera betydelsen av mikrobiomet för människans hälsa.', answer: 'Samlingen mikroorganismer (främst i tarmen) påverkar matsmältning, immunförsvar, metabolism och kan kopplas till diverse sjukdomar.', category: 'science', difficulty: 'expert'},

  // --- Chemistry - Expert ---
  { id: 'sci_chem_ex1', question: 'Vad är Schrödingerekvationen?', answer: 'En fundamental ekvation i kvantmekaniken som beskriver hur kvanttillståndet (vågfunktionen) för ett fysikaliskt system förändras över tid.', category: 'science', difficulty: 'expert'},
  { id: 'sci_chem_ex2', question: 'Vad är kvantfältteori (QFT)?', answer: 'Teoretiskt ramverk som kombinerar kvantmekanik, speciell relativitetsteori och klassisk fältteori för att beskriva elementarpartiklar och deras interaktioner.', category: 'science', difficulty: 'expert'},
  { id: 'sci_chem_ex3', question: 'Förklara begreppet kiralitet inom kemi.', answer: 'Egenskapen hos en molekyl att vara icke-överlagringsbar med sin spegelbild (som händer). Leder till enantiomerer.', category: 'science', difficulty: 'expert'},
  { id: 'sci_chem_ex4', question: 'Vad är Ficks diffusionslagar?', answer: 'Beskriver diffusion (partikeltransport pga koncentrationsgradient). Första lagen: flöde ~ gradient. Andra lagen: koncentrationsändring över tid.', category: 'science', difficulty: 'expert'},
  { id: 'sci_chem_ex5', question: 'Förklara principen bakom NMR-spektroskopi.', answer: 'Nuclear Magnetic Resonance utnyttjar atomkärnors spinn i magnetfält för att bestämma molekylers struktur och dynamik.', category: 'science', difficulty: 'expert'},

  // --- Physics - Expert ---
  { id: 'sci_ex2', question: 'Vad är Maxwells ekvationer?', answer: 'Fyra fundamentala ekvationer som beskriver klassisk elektromagnetism (elektriska/magnetiska fält, laddningar, strömmar).', category: 'science', difficulty: 'expert'},
  { id: 'sci_ex3', question: 'Förklara den allmänna relativitetsteorin.', answer: 'Einsteins teori (1915) som beskriver gravitationen som en geometrisk egenskap hos rumtiden, vilken kröks av massa och energi.', category: 'science', difficulty: 'expert'},
  { id: 'sci_ex4', question: 'Vad är Standardmodellen inom partikelfysik?', answer: 'Teori som beskriver de kända elementarpartiklarna (kvarkar, leptoner), deras interaktioner via kraftförmedlare (bosoner) för de starka, svaga och elektromagnetiska krafterna.', category: 'science', difficulty: 'expert'},
  { id: 'sci_ex6', question: 'Vad är kvantsammanflätning (entanglement)?', answer: 'Ett kvantmekaniskt fenomen där partiklars tillstånd är korrelerade oavsett avstånd, så mätning på en omedelbart påverkar den andra.', category: 'science', difficulty: 'expert'},
  { id: 'sci_ex10', question: 'Vad är Hawkingstrålning?', answer: 'Teoretisk termisk strålning som förutsägs emitteras från svarta hål pga kvanteffekter nära händelsehorisonten.', category: 'science', difficulty: 'expert'},
];
