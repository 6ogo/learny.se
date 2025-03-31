import { Flashcard } from '@/types/flashcard';

export const mathFlashcards: Flashcard[] = [
  // --- Algebra - Beginner ---
  { id: 'math1', question: 'Lös ekvationen: 2x + 3 = 7', answer: 'x = 2', category: 'math', difficulty: 'beginner'},
  { id: 'math2', question: 'Förenkla uttrycket: 3a + 2b - a + 4b', answer: '2a + 6b', category: 'math', difficulty: 'beginner'},
  { id: 'math3', question: 'Vad är prioriteringsreglerna (PEMDAS/BODMAS)?', answer: 'Parentes/Brackets, Exponent/Orders, Multiplikation/Division, Addition/Subtraktion.', category: 'math', difficulty: 'beginner'},
  { id: 'math_alg_beg4', question: 'Vad blir (-2) * (-3)?', answer: '6', category: 'math', difficulty: 'beginner'},
  { id: 'math_alg_beg5', question: 'Vad är x om x / 4 = 5?', answer: 'x = 20', category: 'math', difficulty: 'beginner'},

  // --- Geometry - Beginner ---
  { id: 'math_geo_beg1', question: 'Vad är Pythagoras sats?', answer: 'a² + b² = c² i en rätvinklig triangel, där c är hypotenusan.', category: 'math', difficulty: 'beginner'},
  { id: 'math_geo_beg2', question: 'Vad är arean av en rektangel med sidorna 5 och 4?', answer: '20 (Area = längd * bredd)', category: 'math', difficulty: 'beginner'},
  { id: 'math_geo_beg3', question: 'Vad är omkretsen av en cirkel med radie r?', answer: 'O = 2πr', category: 'math', difficulty: 'beginner'},
  { id: 'math_geo_beg4', question: 'Hur många grader har vinklarna i en triangel totalt?', answer: '180 grader.', category: 'math', difficulty: 'beginner'},
  { id: 'math5', question: 'Vad är arean av en cirkel med radie r?', answer: 'A = πr²', category: 'math', difficulty: 'beginner'},

  // --- Arithmetic/Number Theory - Beginner ---
  { id: 'math_arith_beg1', question: 'Vad är 15% av 200?', answer: '30 (0.15 * 200 = 30)', category: 'math', difficulty: 'beginner'},
  { id: 'math_arith_beg2', question: 'Skriv 0.75 som ett bråk i enklaste form.', answer: '3/4', category: 'math', difficulty: 'beginner'},
  { id: 'math4', question: 'Vad är primtalsfaktorisering av 12?', answer: '2 * 2 * 3 (eller 2² * 3)', category: 'math', difficulty: 'beginner'},
  { id: 'math_arith_beg4', question: 'Vilket är det minsta primtalet?', answer: '2', category: 'math', difficulty: 'beginner'},
  { id: 'math_arith_beg5', question: 'Vad är 1/2 + 1/4?', answer: '3/4', category: 'math', difficulty: 'beginner'},


  // --- Algebra - Intermediate ---
  { id: 'math_alg_int1', question: 'Hur löser man en andragradsekvation (ax² + bx + c = 0)?', answer: 'Med pq-formeln eller kvadratkomplettering. Generell formel: x = [-b ± sqrt(b²-4ac)] / 2a.', category: 'math', difficulty: 'intermediate'},
  { id: 'math_alg_int2', question: 'Faktorisera uttrycket: x² - 9', answer: '(x + 3)(x - 3) (Konjugatregeln)', category: 'math', difficulty: 'intermediate'},
  { id: 'math_alg_int3', question: 'Lös ekvationssystemet: y = 2x+1 och y = -x+4', answer: 'x=1, y=3', category: 'math', difficulty: 'intermediate'},
  { id: 'math_alg_int4', question: 'Vad är en funktion i matematik?', answer: 'En regel som till varje element i en definitionsmängd (input) tilldelar exakt ett element i en värdemängd (output).', category: 'math', difficulty: 'intermediate'},
  { id: 'math_alg_int5', question: 'Vad är logaritmen av ett tal?', answer: 'Logaritmen (med en viss bas) av ett tal y är den exponent x som basen måste upphöjas till för att få y. (Om b^x = y, så är log_b(y) = x).', category: 'math', difficulty: 'intermediate'},

  // --- Geometry/Trigonometry - Intermediate ---
  { id: 'math_geo_int1', question: 'Vad är sinus, cosinus och tangens i en rätvinklig triangel?', answer: 'sin=motstående/hypotenusa, cos=närliggande/hypotenusa, tan=motstående/närliggande.', category: 'math', difficulty: 'intermediate'},
  { id: 'math_geo_int2', question: 'Vad säger Sinussatsen?', answer: 'a/sin(A) = b/sin(B) = c/sin(C) i en godtycklig triangel (sidor a,b,c och motstående vinklar A,B,C).', category: 'math', difficulty: 'intermediate'},
  { id: 'math_geo_int3', question: 'Hur beräknas volymen av en kon?', answer: 'V = (πr²h)/3, där r är basradien och h är höjden.', category: 'math', difficulty: 'intermediate'},
  { id: 'math_geo_int4', question: 'Vad är en vektor?', answer: 'Ett objekt som har både storlek (magnitud) och riktning.', category: 'math', difficulty: 'intermediate'},
  { id: 'math_geo_int5', question: 'Vad är skalärprodukt (dot product) av två vektorer?', answer: 'En operation som tar två vektorer och returnerar ett skalärt värde. a·b = |a||b|cos(θ) = a₁b₁ + a₂b₂ + ...', category: 'math', difficulty: 'intermediate'},

  // --- Statistics/Probability - Intermediate ---
  { id: 'math-int1', question: 'Vad är skillnaden mellan medelvärde, median och typvärde?', answer: 'Medelvärde=summa/antal, Median=mittenvärdet (sorterat), Typvärde=vanligaste värdet.', category: 'math', difficulty: 'intermediate'},
  { id: 'math-int2', question: 'Förklara standardavvikelse.', answer: 'Ett mått på spridningen av data runt medelvärdet; roten ur variansen.', category: 'math', difficulty: 'intermediate'},
  { id: 'math_prob_int3', question: 'Vad är sannolikheten att få en sexa när man kastar en vanlig tärning?', answer: '1/6', category: 'math', difficulty: 'intermediate'},
  { id: 'math_prob_int4', question: 'Vad är skillnaden mellan permutationer och kombinationer?', answer: 'Permutationer tar hänsyn till ordningen (ABC ≠ BAC). Kombinationer gör det inte (ABC = BAC).', category: 'math', difficulty: 'intermediate'},
  { id: 'math_prob_int5', question: 'Vad är Bayes sats grundläggande idé?', answer: 'Uppdaterar sannolikheten för en hypotes baserat på ny evidens. P(H|E) = [P(E|H) * P(H)] / P(E).', category: 'math', difficulty: 'intermediate'},


  // --- Calculus - Advanced ---
  { id: 'calc1', question: 'Vad är en derivata?', answer: 'Derivatan mäter en funktions momentana förändringshastighet vid en given punkt; lutningen på tangentlinjen.', category: 'math', difficulty: 'advanced'},
  { id: 'calc2', question: 'Vad är kedjeregeln inom derivering?', answer: 'Används för att derivera sammansatta funktioner: derivatan av f(g(x)) är f\'(g(x)) * g\'(x).', category: 'math', difficulty: 'advanced'},
  { id: 'calc3', question: 'Vad är en obestämd integral?', answer: 'Antiderivatan till en funktion; familjen av funktioner vars derivata är den ursprungliga funktionen (+ C).', category: 'math', difficulty: 'advanced'},
  { id: 'calc4', question: 'Vad är Fundamentalsatsen i analys (kalkyl)?', answer: 'Kopplar samman derivering och integrering: integralen av f från a till b är F(b) - F(a), där F är en antiderivata till f.', category: 'math', difficulty: 'advanced'},
  { id: 'calc5', question: 'Vad är en partiell derivata?', answer: 'Derivatan av en funktion med flera variabler med avseende på en variabel, där övriga behandlas som konstanter.', category: 'math', difficulty: 'advanced'},
  { id: 'math_calc_adv6', question: 'Vad är L\'Hôpitals regel?', answer: 'En metod för att beräkna gränsvärden av kvoter som ger obestämda uttryck (0/0 eller ∞/∞) genom att ta derivatan av täljare och nämnare.', category: 'math', difficulty: 'advanced'},
  { id: 'math_calc_adv7', question: 'Vad är en Taylor-serie?', answer: 'En representation av en funktion som en oändlig summa av termer beräknade från funktionens derivator vid en enda punkt.', category: 'math', difficulty: 'advanced'},
  { id: 'math_calc_adv8', question: 'Vad är en differentialekvation?', answer: 'En ekvation som innehåller en obekant funktion och en eller flera av dess derivator.', category: 'math', difficulty: 'advanced'},
  { id: 'math_calc_adv9', question: 'Vad är Laplacetransformen?', answer: 'En integraltransform som omvandlar en funktion av en reell variabel (ofta tid) till en funktion av en komplex variabel (frekvens). Används bl.a. för att lösa differentialekvationer.', category: 'math', difficulty: 'advanced'},
  { id: 'math_calc_adv10', question: 'Vad är gradienten av en skalär funktion?', answer: 'En vektor som pekar i den riktning där funktionen ökar snabbast, och vars magnitud är den maximala ökningstakten.', category: 'math', difficulty: 'advanced'},

  // --- Linear Algebra - Advanced ---
  { id: 'math_linalg_adv1', question: 'Vad är en matris?', answer: 'En rektangulär uppsättning av tal, symboler eller uttryck, arrangerade i rader och kolumner.', category: 'math', difficulty: 'advanced'},
  { id: 'math_linalg_adv2', question: 'Vad är en determinant av en kvadratisk matris?', answer: 'Ett skalärt värde som kan beräknas från matrisens element. Ger information om t.ex. inverterbarhet och volymskalning.', category: 'math', difficulty: 'advanced'},
  { id: 'math_linalg_adv3', question: 'Vad är en linjär transformation (avbildning)?', answer: 'En funktion mellan två vektorrum som bevarar vektoraddition och skalärmultiplikation. Kan representeras av en matris.', category: 'math', difficulty: 'advanced'},
  { id: 'math_linalg_adv4', question: 'Vad är egenvärden och egenvektorer?', answer: 'För en linjär transformation (matris A), är en egenvektor v en nollskild vektor vars riktning inte ändras (Av = λv). Skalären λ är det motsvarande egenvärdet.', category: 'math', difficulty: 'advanced'},
  { id: 'math_linalg_adv5', question: 'Vad är ett vektorrum?', answer: 'En mängd vektorer där addition och skalärmultiplikation är definierade och uppfyller vissa axiom.', category: 'math', difficulty: 'advanced'},

  // --- Discrete Math/Abstract Algebra - Advanced ---
  { id: 'math_disc_adv1', question: 'Vad är induktionsbevis?', answer: 'En bevismetod för att visa att ett påstående gäller för alla naturliga tal (eller en oändlig sekvens). Basfall + Induktionssteg.', category: 'math', difficulty: 'advanced'},
  { id: 'math_disc_adv2', question: 'Vad är grafteori?', answer: 'Studiet av grafer, som är matematiska strukturer bestående av noder (hörn) och kanter (bågar) som förbinder dem.', category: 'math', difficulty: 'advanced'},
  { id: 'math_disc_adv3', question: 'Vad är gruppteori inom abstrakt algebra?', answer: 'Studiet av algebraiska strukturer som kallas grupper (en mängd med en binär operation som uppfyller vissa axiom: slutenhet, associativitet, identitet, invers).', category: 'math', difficulty: 'advanced'},
  { id: 'math_disc_adv4', question: 'Vad är kardinalitet för en mängd?', answer: 'Ett mått på antalet element i en mängd. För oändliga mängder jämför man kardinaliteter (uppräknelig vs. överuppräknelig).', category: 'math', difficulty: 'advanced'},
  { id: 'math_disc_adv5', question: 'Vad är Dirichlets lådprincip?', answer: 'Om n objekt placeras i m lådor och n > m, måste minst en låda innehålla mer än ett objekt.', category: 'math', difficulty: 'advanced'},


  // --- Number Theory/Analysis/Topology - Expert ---
  { id: 'math-ex1', question: 'Förklara Fermats sista sats.', answer: 'Satsen säger att ekvationen aⁿ + bⁿ = cⁿ saknar positiva heltalslösningar för heltal n > 2. Bevisades av Andrew Wiles.', category: 'math', difficulty: 'expert'},
  { id: 'math-ex2', question: 'Vad är Riemannhypotesen?', answer: 'En olöst förmodan om placeringen av de icke-triviala nollställena till Riemanns zetafunktion (alla har realdel 1/2). Har djupa kopplingar till primtalens fördelning.', category: 'math', difficulty: 'expert'},
  { id: 'math_ex3', question: 'Förklara Gödels ofullständighetssatser.', answer: 'Första: Varje konsistent formellt system för aritmetik innehåller sanna påståenden som inte kan bevisas inom systemet. Andra: Ett sådant system kan inte bevisa sin egen konsistens.', category: 'math', difficulty: 'expert'},
  { id: 'math_ex4', question: 'Vad är Poincarés förmodan (nu teorem)?', answer: 'Varje enkelt sammanhängande, sluten 3-mångfald är homeomorf (topologiskt ekvivalent) med 3-sfären. Bevisades av Grigorij Perelman.', category: 'math', difficulty: 'expert'},
  { id: 'math_ex5', question: 'Förklara begreppet mått inom måtteori.', answer: 'Ett mått är en funktion som tilldelar en "storlek" (t.ex. längd, area, sannolikhet) till delmängder av en given mängd på ett systematiskt sätt (t.ex. Lebesguemåttet).', category: 'math', difficulty: 'expert'},
  { id: 'math_ex6', question: 'Vad är ett Banachrum?', answer: 'Ett komplett normerat vektorrum. "Komplett" innebär att varje Cauchyföljd konvergerar mot en punkt inom rummet.', category: 'math', difficulty: 'expert'},
  { id: 'math_ex7', question: 'Vad är ett Hilbertrum?', answer: 'Ett komplett inre produktrum. Normen induceras av en inre produkt (skalärprodukt).', category: 'math', difficulty: 'expert'},
  { id: 'math_ex8', question: 'Vad är kontinuumhypotesen?', answer: 'Förmodan att det inte finns någon mängd vars kardinalitet ligger strikt mellan kardinaliteten för heltalen och kardinaliteten för reella talen. Oavgörbar inom ZFC.', category: 'math', difficulty: 'expert'},
  { id: 'math_ex9', question: 'Vad är homologiteori inom algebraisk topologi?', answer: 'Metod för att associera en sekvens av abelska grupper (homologigrupper) till ett topologiskt rum, som beskriver rummets "hål" i olika dimensioner.', category: 'math', difficulty: 'expert'},
  { id: 'math_ex10', question: 'Vad är Navier-Stokes ekvationer?', answer: 'Partiella differentialekvationer som beskriver rörelsen hos viskösa fluider. Existens och släthet för lösningar är ett Millennieproblem.', category: 'math', difficulty: 'expert'},
  { id: 'math_ex11', question: 'Vad är Langlandsprogrammet?', answer: 'Ett omfattande nätverk av förmodanden som kopplar samman talteori (Galoisrepresentationer) och automorfa former (representationsteori).', category: 'math', difficulty: 'expert'},
  { id: 'math_ex12', question: 'Vad är kategoriteori?', answer: 'Studiet av abstrakta matematiska strukturer och relationer mellan dem (objekt och morfismer) på ett mycket generellt plan.', category: 'math', difficulty: 'expert'},
  { id: 'math_ex13', question: 'Vad är Hodgeförmodan?', answer: 'En förmodan inom algebraisk geometri som relaterar topologin hos en komplex projektiv mångfald till dess algebraiska cykler (Hodgecykler).', category: 'math', difficulty: 'expert'},
  { id: 'math_ex14', question: 'Vad är slumpmässiga matriser (random matrix theory)?', answer: 'Studiet av matriser vars element är slumpvariabler. Har tillämpningar inom fysik, talteori, finansiell matematik m.m.', category: 'math', difficulty: 'expert'},
  { id: 'math_ex15', question: 'Vad är Atiyah-Singer indexsats?', answer: 'En fundamental sats som kopplar samman analys (indexet för en elliptisk differentialoperator) och topologi (topologiska invarianter).', category: 'math', difficulty: 'expert'},
  { id: 'math_ex16', question: 'Vad är modulära former?', answer: 'Komplexanalytiska funktioner med specifika symmetriegenskaper. Centrala inom talteori (kopplade till Fermats sista sats, Riemannhypotesen).', category: 'math', difficulty: 'expert'},
  { id: 'math_ex17', question: 'Vad är K-teori?', answer: 'Ett verktyg inom algebra och topologi som associerar ringar eller topologiska rum med en sekvens av abelska grupper (K-grupper).', category: 'math', difficulty: 'expert'},
  { id: 'math_ex18', question: 'Vad är differentierbar geometri?', answer: 'Studiet av släta mångfalder, där man kan använda kalkylens metoder för att analysera geometriska egenskaper.', category: 'math', difficulty: 'expert'},
  { id: 'math_ex19', question: 'Vad är Zorns lemma?', answer: 'Ett axiom inom mängdteori (ekvivalent med urvalsaxiomet) som säger att varje partiellt ordnad mängd där varje kedja har en övre gräns, innehåller minst ett maximalt element.', category: 'math', difficulty: 'expert'},
  { id: 'math_ex20', question: 'Vad är P vs NP-problemet?', answer: 'Ett olöst problem inom datavetenskap/matematik: Är varje problem vars lösning snabbt kan verifieras (NP) också ett problem som snabbt kan lösas (P)?', category: 'math', difficulty: 'expert'},
];
