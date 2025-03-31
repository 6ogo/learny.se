import { Flashcard } from '@/types/flashcard';

export const vehiclesFlashcards: Flashcard[] = [
  // --- Cars - Beginner ---
  { id: 'veh1', question: 'Vilka är de fyra huvudtakterna i en fyrtakts bensinmotor?', answer: 'Insugning, kompression, förbränning (arbete), avgas.', category: 'vehicles', difficulty: 'beginner'},
  { id: 'veh2', question: 'Vad är funktionen hos ett bilbatteri?', answer: 'Starta motorn och driva elsystemet när motorn är av.', category: 'vehicles', difficulty: 'beginner'},
  { id: 'veh3', question: 'Vad står ABS för (bilbromsar)?', answer: 'Anti-lock Braking System (låsningsfria bromsar). Förhindrar att hjulen låser sig vid hård inbromsning.', category: 'vehicles', difficulty: 'beginner'},
  { id: 'veh4', question: 'Vad är skillnaden mellan automatisk och manuell växellåda i en bil?', answer: 'Automatisk växlar själv, manuell kräver att föraren använder koppling och växelspak.', category: 'vehicles', difficulty: 'beginner'},
  { id: 'veh5', question: 'Vad mäter en hastighetsmätare i en bil?', answer: 'Bilens aktuella hastighet (oftast i km/h).', category: 'vehicles', difficulty: 'beginner'},
  { id: 'car_beg6', question: 'Vad är en ratt i en bil?', answer: 'Används för att styra bilens riktning.', category: 'vehicles', difficulty: 'beginner'},
  { id: 'car_beg7', question: 'Vad är en gaspedal i en bil?', answer: 'Pedal som reglerar motorns varvtal och därmed bilens hastighet.', category: 'vehicles', difficulty: 'beginner'},
  { id: 'car_beg8', question: 'Vad är en bromspedal i en bil?', answer: 'Pedal som används för att sakta ner eller stanna bilen.', category: 'vehicles', difficulty: 'beginner'},
  { id: 'car_beg9', question: 'Vad är motorolja i en bil?', answer: 'Smörjmedel som minskar friktion och slitage i motorns rörliga delar.', category: 'vehicles', difficulty: 'beginner'},
  { id: 'car_beg10', question: 'Vad är ett däck på en bil?', answer: 'Den gummidel av hjulet som har kontakt med vägen.', category: 'vehicles', difficulty: 'beginner'},

  // --- Cars - Intermediate ---
  { id: 'veh6', question: 'Vad är skillnaden mellan en tvåtakts- och en fyrtaktsmotor?', answer: 'Tvåtakt: en arbetstakt per varv. Fyrtakt: en arbetstakt per två varv. Fyrtakt är vanligare i bilar.', category: 'vehicles', difficulty: 'intermediate'},
  { id: 'veh7', question: 'Förklara principen bakom en turbo (turboladdare) i en bilmotor.', answer: 'Använder avgaserna för att driva en kompressor som trycker in mer luft i motorn, vilket ökar effekten.', category: 'vehicles', difficulty: 'intermediate'},
  { id: 'veh8', question: 'Vad är ett chassi på ett fordon?', answer: 'Fordonets bärande ramstruktur som motor, hjulupphängning och kaross är fästa vid.', category: 'vehicles', difficulty: 'intermediate'},
  { id: 'veh9', question: 'Vad är ESP (Electronic Stability Program) i en bil?', answer: 'Antisladdsystem som hjälper föraren att behålla kontrollen genom att individuellt bromsa hjulen vid sladd.', category: 'vehicles', difficulty: 'intermediate'},
  { id: 'veh10', question: 'Vad är skillnaden mellan bakhjulsdrift (RWD), framhjulsdrift (FWD) och fyrhjulsdrift (AWD/4WD) i bilar?', answer: 'RWD driver bakhjulen, FWD driver framhjulen, AWD/4WD driver alla fyra hjulen.', category: 'vehicles', difficulty: 'intermediate'},
  { id: 'car_int6', question: 'Vad är en differential i en bil?', answer: 'Mekanism i drivaxeln som tillåter drivhjulen att rotera med olika hastighet vid svängning.', category: 'vehicles', difficulty: 'intermediate'},
  { id: 'car_int7', question: 'Vad är funktionen hos en katalysator i en bil?', answer: 'Renar avgaserna genom att omvandla skadliga ämnen (CO, NOx, HC) till mindre skadliga (CO₂, N₂, H₂O).', category: 'vehicles', difficulty: 'intermediate'},
  { id: 'car_int8', question: 'Vad är en kamaxel i en bilmotor?', answer: 'Axel med kammar som styr öppning och stängning av insugs- och avgasventilerna.', category: 'vehicles', difficulty: 'intermediate'},
  { id: 'car_int9', question: 'Vad är ett kylsystem i en bil?', answer: 'System (oftast vätskebaserat med kylare och termostat) som förhindrar att motorn överhettas.', category: 'vehicles', difficulty: 'intermediate'},
  { id: 'car_int10', question: 'Vad är en stötdämpare i en bil?', answer: 'Komponent i hjulupphängningen som dämpar svängningar från fjädrarna och ojämnheter i vägen.', category: 'vehicles', difficulty: 'intermediate'},

  // --- Cars - Advanced ---
  { id: 'car_adv1', question: 'Vad är en CVT (Continuously Variable Transmission) i en bil?', answer: 'Växellåda utan fasta steg; använder remmar/kedjor och variabla skivor för att ge en kontinuerlig variation av utväxlingsförhållanden.', category: 'vehicles', difficulty: 'advanced'},
  { id: 'car_adv2', question: 'Förklara skillnaden mellan hybrid (HEV), laddhybrid (PHEV) och elbil (BEV).', answer: 'HEV: laddar batteri via motor/bromsning. PHEV: kan laddas externt, längre elräckvidd än HEV. BEV: endast elmotor, laddas externt.', category: 'vehicles', difficulty: 'advanced'},
  { id: 'car_adv3', question: 'Vad är Atkinson-cykeln jämfört med Otto-cykeln i bilmotorer?', answer: 'Atkinson-cykeln har en längre expansionstakt än kompressionstakt, vilket ger högre termisk verkningsgrad (vanligt i hybrider).', category: 'vehicles', difficulty: 'advanced'},
  { id: 'car_adv4', question: 'Vad är aktiv fjädring i en bil?', answer: 'Fjädringssystem som använder sensorer och aktuatorer för att aktivt justera fjädringens egenskaper i realtid för komfort och väghållning.', category: 'vehicles', difficulty: 'advanced'},
  { id: 'car_adv5', question: 'Vad är LiDAR (Light Detection and Ranging) i autonoma bilar?', answer: 'En fjärranalysteknik som använder laserljus för att mäta avstånd och skapa en detaljerad 3D-karta av omgivningen.', category: 'vehicles', difficulty: 'advanced'},

  // --- Cars - Expert ---
  { id: 'car_ex1', question: 'Vad är regenerativ bromsning i el-/hybridbilar?', answer: 'Omvandlar bilens rörelseenergi tillbaka till elektrisk energi vid inbromsning och lagrar den i batteriet.', category: 'vehicles', difficulty: 'expert'},
  { id: 'car_ex2', question: 'Jämför synkrona och asynkrona elmotorers egenskaper i elbilar.', answer: 'Synkron (ofta PM): högre effektivitet/effekttäthet, dyrare. Asynkron (induktion): robust, billigare, något lägre effektivitet.', category: 'vehicles', difficulty: 'expert'},
  { id: 'car_ex3', question: 'Förklara Homogen Laddningskompressions Tändning (HCCI) i bilmotorer.', answer: 'En avancerad förbränningsprocess där en homogen bränsle-luftblandning komprimeras tills den självantänder (låga NOx/sot-utsläpp).', category: 'vehicles', difficulty: 'expert'},
  { id: 'car_ex4', question: 'Vad är AdBlue (Diesel Exhaust Fluid - DEF) i dieselbilar?', answer: 'En urealösning som sprutas in i avgassystemet (med SCR-katalysator) för att reducera utsläpp av kväveoxider (NOx).', category: 'vehicles', difficulty: 'expert'},
  { id: 'car_ex5', question: 'Diskutera materialval i moderna bilkonstruktioner (t.ex. höghållfast stål, aluminium, kolfiber).', answer: 'Balans mellan vikt, styrka, krocksäkerhet, kostnad. Aluminium/kolfiber minskar vikt (bränsleeffektivitet/prestanda) men är dyrare.', category: 'vehicles', difficulty: 'expert'},

  // --- Boats - Beginner ---
  { id: 'boat_beg1', question: 'Vad kallas framsidan och baksidan på en båt?', answer: 'För (fram) och akter (bak).', category: 'vehicles', difficulty: 'beginner'},
  { id: 'boat_beg2', question: 'Vad är styrbord och babord?', answer: 'Styrbord är höger sida sett från aktern framåt, babord är vänster sida.', category: 'vehicles', difficulty: 'beginner'},
  { id: 'boat_beg3', question: 'Vad är en flytväst?', answer: 'Ett plagg som hjälper en person att flyta i vattnet.', category: 'vehicles', difficulty: 'beginner'},
  { id: 'boat_beg4', question: 'Vad är en propeller på en båt?', answer: 'Roterande blad som skapar dragkraft för att driva båten framåt i vattnet.', category: 'vehicles', difficulty: 'beginner'},
  { id: 'boat_beg5', question: 'Vad är ett ankare?', answer: 'Ett tungt föremål som sänks ner för att hålla båten på plats.', category: 'vehicles', difficulty: 'beginner'},

  // --- Boats - Intermediate ---
  { id: 'boat_int1', question: 'Vad är deplacement (för båtar/fartyg)?', answer: 'Vikten av det vatten som båten tränger undan, vilket är lika med båtens totala vikt.', category: 'vehicles', difficulty: 'intermediate'},
  { id: 'boat_int2', question: 'Vad är skillnaden mellan en motorbåt och en segelbåt?', answer: 'Motorbåt drivs av motor. Segelbåt drivs primärt av vind i seglen.', category: 'vehicles', difficulty: 'intermediate'},
  { id: 'boat_int3', question: 'Vad är ett roder på en båt?', answer: 'Rörlig fena under aktern som används för att styra båtens riktning.', category: 'vehicles', difficulty: 'intermediate'},
  { id: 'boat_int4', question: 'Vad är en köl på en segelbåt?', answer: 'En fena under skrovet som motverkar avdrift i sidled och ger stabilitet.', category: 'vehicles', difficulty: 'intermediate'},
  { id: 'boat_int5', question: 'Vad är en knop (fartmått)?', answer: 'En enhet för hastighet till sjöss, motsvarar en nautisk mil per timme (ca 1.852 km/h).', category: 'vehicles', difficulty: 'intermediate'},

  // --- Boats - Advanced ---
  { id: 'boat_adv1', question: 'Förklara begreppet planing för en båt.', answer: 'När båten vid tillräckligt hög fart lyfter och glider ovanpå vattnet istället för att plöja igenom det, vilket minskar motståndet.', category: 'vehicles', difficulty: 'advanced'},
  { id: 'boat_adv2', question: 'Vad är barlast och dess funktion i ett fartyg?', answer: 'Vikt (ofta vatten) som tas in i tankar för att förbättra fartygets stabilitet, djupgående och trim.', category: 'vehicles', difficulty: 'advanced'},
  { id: 'boat_adv3', question: 'Vad är skillnaden mellan lovart och lä?', answer: 'Lovart är den sida som vinden kommer ifrån. Lä är den sida som är i skydd från vinden.', category: 'vehicles', difficulty: 'advanced'},
  { id: 'boat_adv4', question: 'Vad är bogpropeller (bow thruster) på fartyg?', answer: 'En propeller installerad i en tunnel tvärs genom fartygets för, används för att manövrera fartyget i sidled vid låga hastigheter.', category: 'vehicles', difficulty: 'advanced'},
  { id: 'boat_adv5', question: 'Vad är AIS (Automatic Identification System)?', answer: 'System som automatiskt sänder och tar emot fartygsidentitet, position, kurs och fart för att öka säkerheten till sjöss.', category: 'vehicles', difficulty: 'advanced'},

  // --- Boats - Expert ---
  { id: 'veh16', question: 'Vad är Arkimedes princip och dess relevans för båtars flytkraft/stabilitet?', answer: 'Lyftkraften = tyngden av undanträngd fluid. Stabilitet beror på relationen mellan tyngdpunkt (G) och flytkraftens centrum (B) / metacentrum (M).', category: 'vehicles', difficulty: 'expert'},
  { id: 'veh17', question: 'Vad är skillnaden mellan deplacement och olika typer av tonnage för fartyg?', answer: 'Deplacement=fartygets vikt (massa). Tonnage (brutto/netto)=mått på fartygets inre volym/lastkapacitet.', category: 'vehicles', difficulty: 'expert'},
  { id: 'veh18', question: 'Hur skapar ett roder ett styrmoment på ett fartyg?', answer: 'Vinklat roder ändrar vattenflödet, skapar en lågtrycks-/högtryckssida och därmed en sidokraft på aktern som får fartyget att gira.', category: 'vehicles', difficulty: 'expert'},
  { id: 'veh19', question: 'Vad är kavitation och dess effekter på båtpropellrar?', answer: 'Bildning/kollaps av ångbubblor pga lokalt lågt tryck på propellerbladen. Orsakar erosion, buller, vibrationer och minskad verkningsgrad.', category: 'vehicles', difficulty: 'expert'},
  { id: 'veh20', question: 'Förklara metacentrisk höjd (GM) och dess betydelse för fartygsstabilitet.', answer: 'Avståndet mellan tyngdpunkt (G) och metacentrum (M). Positiv GM ger initial stabilitet (rätande moment vid krängning). För stor GM ger snabb/obekväm rullning.', category: 'vehicles', difficulty: 'expert'},

  // --- Airplanes - Beginner ---
  { id: 'plane_beg1', question: 'Vad är en vinge på ett flygplan?', answer: 'Den stora, platta delen som genererar lyftkraft.', category: 'vehicles', difficulty: 'beginner'},
  { id: 'plane_beg2', question: 'Vad är en cockpit?', answer: 'Utrymmet där piloterna sitter och styr flygplanet.', category: 'vehicles', difficulty: 'beginner'},
  { id: 'plane_beg3', question: 'Vad är en flygplats?', answer: 'En plats där flygplan kan starta och landa.', category: 'vehicles', difficulty: 'beginner'},
  { id: 'plane_beg4', question: 'Vad är en pilot?', answer: 'Personen som flyger och styr ett flygplan.', category: 'vehicles', difficulty: 'beginner'},
  { id: 'plane_beg5', question: 'Vad är en jetmotor?', answer: 'En motor som driver flygplanet framåt genom att skjuta ut heta gaser bakåt.', category: 'vehicles', difficulty: 'beginner'},

  // --- Airplanes - Intermediate ---
  { id: 'plane_int1', question: 'Förklara de fyra grundläggande krafterna på ett flygplan i flykt.', answer: 'Lyftkraft (uppåt), Tyngdkraft (nedåt), Dragkraft (framåt), Luftmotstånd (bakåt). För planflykt är Lyftkraft = Tyngdkraft och Dragkraft = Luftmotstånd.', category: 'vehicles', difficulty: 'intermediate'},
  { id: 'plane_int2', question: 'Vad är skevroder (ailerons)?', answer: 'Rörliga klaffar längst ut på vingarna som styr planets roll (lutning i sidled).', category: 'vehicles', difficulty: 'intermediate'},
  { id: 'plane_int3', question: 'Vad är höjdroder (elevators)?', answer: 'Rörliga klaffar på den horisontella stabilisatorn (bak) som styr planets pitch (nos upp/ner).', category: 'vehicles', difficulty: 'intermediate'},
  { id: 'plane_int4', question: 'Vad är sidoroder (rudder)?', answer: 'Rörlig klaff på den vertikala stabilisatorn (bak) som styr planets yaw (girning, nos vänster/höger).', category: 'vehicles', difficulty: 'intermediate'},
  { id: 'plane_int5', question: 'Vad är flyghöjd (altitude)?', answer: 'Höjden över en referensnivå, oftast havsytan.', category: 'vehicles', difficulty: 'intermediate'},

  // --- Airplanes - Advanced ---
  { id: 'veh11', question: 'Förklara de fyra grundläggande krafterna på ett flygplan i flykt.', answer: 'Lyftkraft (uppåt, skapas av vingarna), Tyngdkraft (nedåt), Dragkraft (framåt, från motorer), Luftmotstånd (bakåt).', category: 'vehicles', difficulty: 'advanced'},
  { id: 'veh12', question: 'Hur fungerar en jetmotor (turbojet/turbofan)?', answer: 'Suger in luft, komprimerar den, blandar med bränsle, antänder, och skjuter ut heta gaser bakåt med hög hastighet för att skapa dragkraft. Turbofan har en stor fläkt för extra luftflöde (bypass).', category: 'vehicles', difficulty: 'advanced'},
  { id: 'veh13', question: 'Varför behövs tryckkabin i flygplan på hög höjd?', answer: 'Lufttrycket och syrehalten minskar med höjden. Tryckkabinen upprätthåller ett tryck och syrenivå som är säker för passagerare och besättning.', category: 'vehicles', difficulty: 'advanced'},
  { id: 'veh14', question: 'Vad är vingklaffar (flaps) och spoilers funktion på ett flygplan?', answer: 'Flaps (på vingens bakkant) ökar lyftkraften och luftmotståndet vid låg fart. Spoilers (på vingens ovansida) minskar lyftkraften och ökar luftmotståndet.', category: 'vehicles', difficulty: 'advanced'},
  { id: 'veh15', question: 'Vad innebär "stall" för ett flygplan?', answer: 'Ett aerodynamiskt tillstånd där vingens anfallsvinkel blir för hög, luftströmmen separerar från vingens ovansida och lyftkraften minskar drastiskt.', category: 'vehicles', difficulty: 'advanced'},

  // --- Airplanes - Expert ---
  { id: 'plane_ex1', question: 'Förklara Bernoullis princip och dess roll i att skapa lyftkraft.', answer: 'Snabbare luftström över vingens välvda ovansida ger lägre tryck än under vingen (där luften färdas kortare sträcka/långsammare), vilket resulterar i en nettokraft uppåt.', category: 'vehicles', difficulty: 'expert'},
  { id: 'plane_ex2', question: 'Vad är L/D-förhållandet (Lift-to-Drag ratio) och dess betydelse?', answer: 'Förhållandet mellan lyftkraft och luftmotstånd. Ett mått på flygplanets aerodynamiska effektivitet (glidtal). Högre L/D ger bättre bränsleekonomi/räckvidd.', category: 'vehicles', difficulty: 'expert'},
  { id: 'plane_ex3', question: 'Vad är Mach-talet och vilka flygregimer definierar det?', answer: 'Förhållandet mellan flygplanets hastighet och ljudhastigheten. Subsonisk (<1), Transsonisk (~0.8-1.2), Supersonisk (>1), Hypersonisk (>5).', category: 'vehicles', difficulty: 'expert'},
  { id: 'plane_ex4', question: 'Vad är ett fly-by-wire-system?', answer: 'Styrsystem där pilotens input omvandlas till elektroniska signaler som via datorer styr flygplanets roder och kontrollytor, istället för direkta mekaniska länkar.', category: 'vehicles', difficulty: 'expert'},
  { id: 'plane_ex5', question: 'Förklara begreppet "area rule" (Whitcomb area rule) inom flygplansdesign.', answer: 'Designprincip för att minska luftmotståndet vid transsoniska och supersoniska hastigheter genom att jämna ut flygplanets tvärsnittsarea längs dess längd.', category: 'vehicles', difficulty: 'expert'},
];
