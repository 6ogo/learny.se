// File: src/data/flashcards/math.ts
import { Flashcard } from '@/types/flashcard';

export const mathFlashcards: Flashcard[] = [
  // --- Algebra - Beginner ---
  { id: 'math1', question: 'Lös ekvationen: 2x + 3 = 7', answer: 'x = 2', category: 'math', difficulty: 'beginner'},
  { id: 'math2', question: 'Förenkla uttrycket: 3a + 2b - a + 4b', answer: '2a + 6b', category: 'math', difficulty: 'beginner'},
  { id: 'math_alg_beg3', question: 'Vad är x om x - 5 = 10?', answer: 'x = 15', category: 'math', difficulty: 'beginner'},
  { id: 'math_alg_beg4', question: 'Vad blir (-2) * (-3)?', answer: '6', category: 'math', difficulty: 'beginner'},
  { id: 'math_alg_beg5', question: 'Vad är x om x / 4 = 5?', answer: 'x = 20', category: 'math', difficulty: 'beginner'},
  { id: 'math_alg_beg6', question: 'Multiplicera ut parentesen: 3(x + 2)', answer: '3x + 6', category: 'math', difficulty: 'beginner'},
  { id: 'math_alg_beg7', question: 'Vad är värdet av uttrycket 5y - 2 när y = 3?', answer: '13 (5*3 - 2 = 15 - 2)', category: 'math', difficulty: 'beginner'},
  { id: 'math_alg_beg8', question: 'Lös ekvationen: x/2 = 6', answer: 'x = 12', category: 'math', difficulty: 'beginner'},
  { id: 'math_alg_beg9', question: 'Förenkla: 4x + x - 2x', answer: '3x', category: 'math', difficulty: 'beginner'},
  { id: 'math_alg_beg10', question: 'Vad betyder "x > 5"?', answer: 'x är större än 5.', category: 'math', difficulty: 'beginner'},
  { id: 'math_alg_beg11', question: 'Lös ekvationen: 10 - x = 4', answer: 'x = 6', category: 'math', difficulty: 'beginner'},
  { id: 'math_alg_beg12', question: 'Förenkla: 2 * (3a)', answer: '6a', category: 'math', difficulty: 'beginner'},
  { id: 'math_alg_beg13', question: 'Vad är y om 3y = 18?', answer: 'y = 6', category: 'math', difficulty: 'beginner'},
  { id: 'math_alg_beg14', question: 'Vad kallas bokstäverna i algebraiska uttryck (t.ex. x, y, a)?', answer: 'Variabler.', category: 'math', difficulty: 'beginner'},
  { id: 'math_alg_beg15', question: 'Förenkla: (2x)²?', answer: '4x²', category: 'math', difficulty: 'beginner'},

  // --- Geometry - Beginner ---
  { id: 'math_geo_beg1', question: 'Vad är Pythagoras sats?', answer: 'a² + b² = c² i en rätvinklig triangel, där c är hypotenusan.', category: 'math', difficulty: 'beginner'},
  { id: 'math_geo_beg2', question: 'Vad är arean av en rektangel med sidorna 5 cm och 4 cm?', answer: '20 cm² (Area = längd * bredd)', category: 'math', difficulty: 'beginner'},
  { id: 'math_geo_beg3', question: 'Vad är omkretsen av en cirkel med radie r?', answer: 'O = 2πr', category: 'math', difficulty: 'beginner'},
  { id: 'math_geo_beg4', question: 'Hur många grader har vinklarna i en triangel totalt?', answer: '180 grader.', category: 'math', difficulty: 'beginner'},
  { id: 'math5', question: 'Vad är arean av en cirkel med radie r?', answer: 'A = πr²', category: 'math', difficulty: 'beginner'},
  { id: 'math_geo_beg6', question: 'Vad kallas en triangel med tre lika långa sidor?', answer: 'Liksidig triangel.', category: 'math', difficulty: 'beginner'},
  { id: 'math_geo_beg7', question: 'Vad är omkretsen av en kvadrat med sidan 6?', answer: '24 (Omkrets = 4 * sidan)', category: 'math', difficulty: 'beginner'},
  { id: 'math_geo_beg8', question: 'Vad kallas en vinkel som är mindre än 90 grader?', answer: 'Spetsig vinkel.', category: 'math', difficulty: 'beginner'},
  { id: 'math_geo_beg9', question: 'Vad kallas en vinkel som är större än 90 grader men mindre än 180 grader?', answer: 'Trubbig vinkel.', category: 'math', difficulty: 'beginner'},
  { id: 'math_geo_beg10', question: 'Hur många sidor har en femhörning (pentagon)?', answer: 'Fem sidor.', category: 'math', difficulty: 'beginner'},
  { id: 'math_geo_beg11', question: 'Vad är skillnaden mellan en cirkel och en sfär?', answer: 'En cirkel är en tvådimensionell figur, en sfär är en tredimensionell kropp (ett klot).', category: 'math', difficulty: 'beginner'},
  { id: 'math_geo_beg12', question: 'Vad kallas avståndet från cirkelns mittpunkt till kanten?', answer: 'Radie.', category: 'math', difficulty: 'beginner'},
  { id: 'math_geo_beg13', question: 'Vad kallas avståndet rakt igenom cirkelns mittpunkt?', answer: 'Diameter (är dubbla radien).', category: 'math', difficulty: 'beginner'},
  { id: 'math_geo_beg14', question: 'Vad kallas en fyrhörning där motsatta sidor är parallella?', answer: 'Parallellogram.', category: 'math', difficulty: 'beginner'},
  { id: 'math_geo_beg15', question: 'Vad är volymen av en kub med sidan 3?', answer: '27 (Volym = sidan * sidan * sidan)', category: 'math', difficulty: 'beginner'},

  // --- Arithmetic/Number Theory - Beginner ---
  { id: 'math_arith_beg1', question: 'Vad är 15% av 200?', answer: '30 (0.15 * 200 = 30)', category: 'math', difficulty: 'beginner'},
  { id: 'math_arith_beg2', question: 'Skriv 0.75 som ett bråk i enklaste form.', answer: '3/4', category: 'math', difficulty: 'beginner'},
  { id: 'math4', question: 'Vad är primtalsfaktorisering av 12?', answer: '2 * 2 * 3 (eller 2² * 3)', category: 'math', difficulty: 'beginner'},
  { id: 'math_arith_beg4', question: 'Vilket är det minsta primtalet?', answer: '2', category: 'math', difficulty: 'beginner'},
  { id: 'math_arith_beg5', question: 'Vad är 1/2 + 1/4?', answer: '3/4 (Gör om till gemensam nämnare: 2/4 + 1/4)', category: 'math', difficulty: 'beginner'},
  { id: 'math3', question: 'Vad är prioriteringsreglerna (PEMDAS/BODMAS)?', answer: 'Parentes/Brackets, Exponent/Orders, Multiplikation/Division (från vänster), Addition/Subtraktion (från vänster).', category: 'math', difficulty: 'beginner'}, // Clarified order
  { id: 'math_arith_beg7', question: 'Vad är 10 upphöjt till 3 (10³)?', answer: '1000 (10 * 10 * 10)', category: 'math', difficulty: 'beginner'},
  { id: 'math_arith_beg8', question: 'Vad är kvadratroten ur 9 (√9)?', answer: '3 (eftersom 3 * 3 = 9)', category: 'math', difficulty: 'beginner'},
  { id: 'math_arith_beg9', question: 'Vad är 2/3 * 1/5?', answer: '2/15 (Multiplicera täljare och nämnare).', category: 'math', difficulty: 'beginner'},
  { id: 'math_arith_beg10', question: 'Vad är 18 delat med 6?', answer: '3', category: 'math', difficulty: 'beginner'},
  { id: 'math_arith_beg11', question: 'Vilka av följande tal är jämna: 3, 8, 11, 14?', answer: '8 och 14 (delbara med 2).', category: 'math', difficulty: 'beginner'},
  { id: 'math_arith_beg12', question: 'Vad kallas resultatet av en multiplikation?', answer: 'Produkt.', category: 'math', difficulty: 'beginner'},
  { id: 'math_arith_beg13', question: 'Vad kallas resultatet av en division?', answer: 'Kvot.', category: 'math', difficulty: 'beginner'},
  { id: 'math_arith_beg14', question: 'Vad är absolutbeloppet av -5 (|-5|)?', answer: '5 (Avståndet från noll).', category: 'math', difficulty: 'beginner'},
  { id: 'math_arith_beg15', question: 'Vilket tal är störst: 0.5 eller 1/3?', answer: '0.5 (eftersom 1/3 ≈ 0.333)', category: 'math', difficulty: 'beginner'},


  // --- Algebra - Intermediate ---
  { id: 'math_alg_int1', question: 'Hur löser man en andragradsekvation ax² + bx + c = 0 med lösningsformeln?', answer: 'x = [-b ± √(b²-4ac)] / 2a.', category: 'math', difficulty: 'intermediate'},
  { id: 'math_alg_int2', question: 'Faktorisera uttrycket: x² - 5x + 6', answer: '(x - 2)(x - 3)', category: 'math', difficulty: 'intermediate'},
  { id: 'math_alg_int3', question: 'Lös ekvationssystemet: 2x + y = 5 och x - y = 1', answer: 'x=2, y=1 (t.ex. via additionsmetoden)', category: 'math', difficulty: 'intermediate'},
  { id: 'math_alg_int4', question: 'Vad är definitionsmängd och värdemängd för en funktion?', answer: 'Definitionsmängd: alla tillåtna indata (x-värden). Värdemängd: alla möjliga utdata (y-värden).', category: 'math', difficulty: 'intermediate'},
  { id: 'math_alg_int5', question: 'Lös ekvationen: log₂(x) = 3', answer: 'x = 8 (eftersom 2³ = 8)', category: 'math', difficulty: 'intermediate'},
  { id: 'math_alg_int6', question: 'Vad är en aritmetisk talföljd?', answer: 'En talföljd där differensen mellan två på varandra följande termer är konstant.', category: 'math', difficulty: 'intermediate'},
  { id: 'math_alg_int7', question: 'Vad är en geometrisk talföljd?', answer: 'En talföljd där kvoten mellan två på varandra följande termer är konstant.', category: 'math', difficulty: 'intermediate'},
  { id: 'math_alg_int8', question: 'Förenkla: (x³)⁵', answer: 'x¹⁵ (Potenslag: (a^m)^n = a^(m*n))', category: 'math', difficulty: 'intermediate'},
  { id: 'math_alg_int9', question: 'Vad är en invers funktion?', answer: 'Om f(a) = b, så är f⁻¹(b) = a. Funktionen "ångrar" vad den ursprungliga funktionen gjorde.', category: 'math', difficulty: 'intermediate'},
  { id: 'math_alg_int10', question: 'Lös olikheten: 3x - 4 < 8', answer: 'x < 4', category: 'math', difficulty: 'intermediate'},
  { id: 'math_alg_int11', question: 'Vad representerar k och m i en linjär funktion y = kx + m?', answer: 'k = lutningskoefficient (linjens lutning). m = y-intercept (där linjen skär y-axeln).', category: 'math', difficulty: 'intermediate'},
  { id: 'math_alg_int12', question: 'Förenkla uttrycket: √(48)', answer: '4√3 (eftersom 48 = 16 * 3)', category: 'math', difficulty: 'intermediate'},
  { id: 'math_alg_int13', question: 'Vad är diskriminanten i andragradsekvationens lösningsformel?', answer: 'Uttrycket under kvadratroten: b² - 4ac. Dess tecken avgör antalet reella lösningar.', category: 'math', difficulty: 'intermediate'},
  { id: 'math_alg_int14', question: 'Lös ekvationen: 2ˣ = 16', answer: 'x = 4 (eftersom 2⁴ = 16)', category: 'math', difficulty: 'intermediate'},
  { id: 'math_alg_int15', question: 'Vad är ett polynom?', answer: 'Ett algebraiskt uttryck bestående av variabler och konstanter, sammansatt med addition, subtraktion och multiplikation, där variablernas exponenter är icke-negativa heltal.', category: 'math', difficulty: 'intermediate'},


  // --- Geometry/Trigonometry - Intermediate ---
  { id: 'math_geo_int1', question: 'Vad är relationen mellan sinus och cosinus enligt trigonometriska ettan?', answer: 'sin²(v) + cos²(v) = 1.', category: 'math', difficulty: 'intermediate'},
  { id: 'math_geo_int2', question: 'Vad säger Cosinussatsen?', answer: 'c² = a² + b² - 2ab*cos(C) (Relaterar sidorna a,b,c till vinkeln C mittemot sidan c i en godtycklig triangel).', category: 'math', difficulty: 'intermediate'}, // Added formula context
  { id: 'math_geo_int3', question: 'Hur beräknas volymen av en pyramid?', answer: 'V = (Basarea * höjd) / 3.', category: 'math', difficulty: 'intermediate'},
  { id: 'math_geo_int4', question: 'Vad är en enhetsvektor?', answer: 'En vektor med längden (magnituden) 1.', category: 'math', difficulty: 'intermediate'},
  { id: 'math_geo_int5', question: 'Vad blir skalärprodukten av två vinkelräta vektorer?', answer: 'Noll (eftersom cos(90°) = 0).', category: 'math', difficulty: 'intermediate'},
  { id: 'math_geo_int6', question: 'Vad är en radian?', answer: 'En vinkelenhet där en hel cirkel är 2π radianer (motsvarar 360°). Vinkeln där båglängden är lika med radien.', category: 'math', difficulty: 'intermediate'},
  { id: 'math_geo_int7', question: 'Vad är en tangent till en cirkel?', answer: 'En linje som nuddar cirkeln vid exakt en punkt.', category: 'math', difficulty: 'intermediate'},
  { id: 'math_geo_int8', question: 'Vad är likformighet mellan två trianglar?', answer: 'Trianglarna har samma form men inte nödvändigtvis samma storlek. Motsvarande vinklar är lika och förhållandet mellan motsvarande sidor är konstant.', category: 'math', difficulty: 'intermediate'},
  { id: 'math_geo_int9', question: 'Hur beräknas arean av en triangel?', answer: 'Area = (bas * höjd) / 2.', category: 'math', difficulty: 'intermediate'},
  { id: 'math_geo_int10', question: 'Vad är komplexa tal på polär form?', answer: 'Ett komplext tal z = a + bi kan skrivas som r(cos(θ) + i*sin(θ)) = r*e^(iθ), där r är absolutbeloppet och θ är argumentet.', category: 'math', difficulty: 'intermediate'}, // Moved complex numbers here


  // --- Statistics/Probability - Intermediate ---
  { id: 'math-int1', question: 'Vad är skillnaden mellan medelvärde, median och typvärde?', answer: 'Medelvärde=summan/antalet. Median=mittenvärdet i sorterad data. Typvärde=det vanligaste värdet.', category: 'math', difficulty: 'intermediate'},
  { id: 'math-int2', question: 'Vad mäter standardavvikelse?', answer: 'Ett mått på den genomsnittliga spridningen av datavärdena kring medelvärdet.', category: 'math', difficulty: 'intermediate'},
  { id: 'math_prob_int3', question: 'Vad är sannolikheten att få exakt en krona vid två myntkast?', answer: '1/2 (Möjliga utfall: KK, KT, TK, TT. Gynnsamma: KT, TK. Sannolikhet = 2/4 = 1/2)', category: 'math', difficulty: 'intermediate'},
  { id: 'math_prob_int4', question: 'Vad är skillnaden mellan permutationer P(n,k) och kombinationer C(n,k)?', answer: 'Permutationer (ordningen spelar roll): P(n,k)=n!/(n-k)!. Kombinationer (ordningen spelar ingen roll): C(n,k)=n!/[k!(n-k)!].', category: 'math', difficulty: 'intermediate'},
  { id: 'math_prob_int5', question: 'Vad är betingad sannolikhet P(A|B)?', answer: 'Sannolikheten att händelse A inträffar givet att händelse B redan har inträffat. P(A|B) = P(A och B) / P(B).', category: 'math', difficulty: 'intermediate'},
  { id: 'math_prob_int6', question: 'Vad är väntevärde för en slumpvariabel?', answer: 'Det genomsnittliga värdet man förväntar sig om experimentet upprepas många gånger. Beräknas som summan av varje utfall multiplicerat med dess sannolikhet.', category: 'math', difficulty: 'intermediate'},
  { id: 'math_prob_int7', question: 'Vad är binomialfördelning?', answer: 'Sannolikhetsfördelning för antalet lyckade utfall i en serie av n oberoende försök, där varje försök har två möjliga utfall (lyckat/misslyckat) med konstant sannolikhet p.', category: 'math', difficulty: 'intermediate'},
  { id: 'math_prob_int8', question: 'Vad är normalfördelning (Gausskurva)?', answer: 'En kontinuerlig sannolikhetsfördelning som är symmetrisk kring medelvärdet och klockformad. Många naturliga fenomen följer denna fördelning.', category: 'math', difficulty: 'intermediate'},
  { id: 'math_prob_int9', question: 'Vad betyder det om två händelser är oberoende?', answer: 'Att utfallet av den ena händelsen inte påverkar sannolikheten för den andra händelsen. P(A och B) = P(A) * P(B).', category: 'math', difficulty: 'intermediate'},
  { id: 'math_prob_int10', question: 'Vad är ett konfidensintervall?', answer: 'Ett intervall som med en viss sannolikhet (konfidensnivå, t.ex. 95%) täcker det sanna värdet av en populationsparameter, baserat på ett stickprov.', category: 'math', difficulty: 'intermediate'},


  // --- Calculus - Advanced ---
  { id: 'calc1', question: 'Vad är derivatan av f(x) = xⁿ?', answer: 'f\'(x) = nxⁿ⁻¹', category: 'math', difficulty: 'advanced'},
  { id: 'calc2', question: 'Vad är derivatan av f(x) = sin(x)?', answer: 'f\'(x) = cos(x)', category: 'math', difficulty: 'advanced'},
  { id: 'calc3', question: 'Vad är den obestämda integralen av f(x) = xⁿ (för n ≠ -1)?', answer: '∫xⁿ dx = (xⁿ⁺¹ / (n+1)) + C', category: 'math', difficulty: 'advanced'},
  { id: 'calc4', question: 'Vad säger fundamentalsatsen i analys?', answer: 'Den kopplar samman derivering och integration. ∫[a,b] f(x)dx = F(b) - F(a), där F\'(x) = f(x).', category: 'math', difficulty: 'advanced'},
  { id: 'calc5', question: 'Vad är den partiella derivatan ∂f/∂x för f(x, y) = x²y³?', answer: '∂f/∂x = 2xy³ (behandla y som konstant).', category: 'math', difficulty: 'advanced'},
  { id: 'math_calc_adv6', question: 'Vad är l\'Hôpitals regel och när används den?', answer: 'Används för att beräkna gränsvärden av typ "0/0" eller "∞/∞". lim [f(x)/g(x)] = lim [f\'(x)/g\'(x)] (om det senare gränsvärdet existerar).', category: 'math', difficulty: 'advanced'},
  { id: 'math_calc_adv7', question: 'Skriv Taylorutvecklingen av eˣ kring x=0 (Maclaurinserie).', answer: 'eˣ = 1 + x + x²/2! + x³/3! + ... = ∑ (xⁿ / n!) från n=0 till ∞.', category: 'math', difficulty: 'advanced'},
  { id: 'math_calc_adv8', question: 'Ge ett exempel på en separabel differentialekvation.', answer: 'En ekvation som kan skrivas på formen dy/dx = g(x)h(y), t.ex. dy/dx = xy². Kan lösas genom att separera variabler.', category: 'math', difficulty: 'advanced'},
  { id: 'math_calc_adv9', question: 'Vad är Laplacetransformen av f(t) = 1?', answer: 'L{1} = 1/s (för s > 0).', category: 'math', difficulty: 'advanced'},
  { id: 'math_calc_adv10', question: 'Beräkna gradienten för f(x, y) = x² + y².', answer: '∇f = (∂f/∂x, ∂f/∂y) = (2x, 2y).', category: 'math', difficulty: 'advanced'},
  { id: 'math_calc_adv11', question: 'Vad är divergens av ett vektorfält F = (P, Q, R)?', answer: 'div F = ∇·F = ∂P/∂x + ∂Q/∂y + ∂R/∂z. Mäter fältets "källstyrka".', category: 'math', difficulty: 'advanced'},
  { id: 'math_calc_adv12', question: 'Vad är rotation (curl) av ett vektorfält F = (P, Q, R)?', answer: 'curl F = ∇xF = (∂R/∂y - ∂Q/∂z, ∂P/∂z - ∂R/∂x, ∂Q/∂x - ∂P/∂y). Mäter fältets "virvelstyrka".', category: 'math', difficulty: 'advanced'},
  { id: 'math_calc_adv13', question: 'Vad säger Greens sats?', answer: 'Relaterar en linjeintegral längs en sluten kurva C i planet till en dubbelintegral över området D som C innesluter: ∫C (Pdx + Qdy) = ∫∫D (∂Q/∂x - ∂P/∂y) dA.', category: 'math', difficulty: 'advanced'},
  { id: 'math_calc_adv14', question: 'Vad är en konvergent serie?', answer: 'En oändlig serie vars partialsummor närmar sig ett ändligt gränsvärde.', category: 'math', difficulty: 'advanced'},
  { id: 'math_calc_adv15', question: 'Vad är Jacobianen?', answer: 'Determinanten av Jacobimatrisen (matrisen av partiella derivator). Används vid variabelbyte i multipelintegraler.', category: 'math', difficulty: 'advanced'},

  // --- Linear Algebra - Advanced ---
  { id: 'math_linalg_adv1', question: 'Vad är rangen av en matris?', answer: 'Antalet linjärt oberoende rader (eller kolumner) i matrisen. Maximalt antal pivotelement.', category: 'math', difficulty: 'advanced'},
  { id: 'math_linalg_adv2', question: 'Hur beräknas determinanten av en 3x3 matris?', answer: 'Med Sarrus regel eller kofaktorutveckling.', category: 'math', difficulty: 'advanced'},
  { id: 'math_linalg_adv3', question: 'Vad innebär det att en matris är inverterbar?', answer: 'Det finns en annan matris (inversen) som multiplicerad med den ursprungliga ger identitetsmatrisen. Kräver att determinanten är nollskild.', category: 'math', difficulty: 'advanced'},
  { id: 'math_linalg_adv4', question: 'Vad är karakteristiska ekvationen för en matris A?', answer: 'det(A - λI) = 0, där λ är egenvärdena och I är identitetsmatrisen.', category: 'math', difficulty: 'advanced'},
  { id: 'math_linalg_adv5', question: 'Vad är en bas för ett vektorrum?', answer: 'En mängd linjärt oberoende vektorer som spänner upp hela vektorrummet.', category: 'math', difficulty: 'advanced'},
  { id: 'math_linalg_adv6', question: 'Vad är Gram-Schmidt-processen?', answer: 'En metod för att omvandla en mängd linjärt oberoende vektorer till en ortonormal bas.', category: 'math', difficulty: 'advanced'},
  { id: 'math_linalg_adv7', question: 'Vad är singulärvärdesuppdelning (SVD)?', answer: 'En faktorisering av en matris A i formen UΣVᵀ, där U och V är ortogonala matriser och Σ är en diagonal matris med singulärvärden.', category: 'math', difficulty: 'advanced'},
  { id: 'math_linalg_adv8', question: 'Vad är nollrummet (kernel) för en linjär avbildning T?', answer: 'Mängden av alla vektorer v som avbildas på nollvektorn: T(v) = 0.', category: 'math', difficulty: 'advanced'},
  { id: 'math_linalg_adv9', question: 'Vad säger dimensionssatsen (Rank-Nullity Theorem)?', answer: 'För en linjär avbildning T: V → W gäller att dim(V) = dim(Ker(T)) + dim(Im(T)) (dimensionen av definitionsmängden = dimensionen av nollrummet + dimensionen av bildrummet/rangen).', category: 'math', difficulty: 'advanced'},
  { id: 'math_linalg_adv10', question: 'Vad innebär det att en matris är diagonaliserbar?', answer: 'Den är similär med en diagonalmatris, dvs A = PDP⁻¹, där D är diagonal. Sker om det finns en bas av egenvektorer.', category: 'math', difficulty: 'advanced'},

  // --- Discrete Math/Abstract Algebra - Advanced ---
  { id: 'math_disc_adv1', question: 'Ge ett exempel på hur induktionsbevis används.', answer: 'Visa basfall (t.ex. n=1). Antag att påståendet P(k) gäller. Visa att P(k) ⇒ P(k+1). Slutsats: gäller för alla n ≥ 1.', category: 'math', difficulty: 'advanced'},
  { id: 'math_disc_adv2', question: 'Vad är Eulers formel för plana grafer?', answer: 'V - E + F = 1 (för sammanhängande grafer utan korsande kanter), där V=antal hörn, E=antal kanter, F=antal regioner (inklusive den yttre). För polyedrar: V - E + F = 2.', category: 'math', difficulty: 'advanced'},
  { id: 'math_disc_adv3', question: 'Vad är en ring inom abstrakt algebra?', answer: 'En mängd med två binära operationer (ofta kallade addition och multiplikation) som uppfyller axiom liknande heltalens (associativitet, distributivitet, additiv identitet/invers).', category: 'math', difficulty: 'advanced'},
  { id: 'math_disc_adv4', question: 'Vad säger Cantors diagonalargument?', answer: 'Ett bevis för att mängden av reella tal är överuppräknelig (har högre kardinalitet än de naturliga talen).', category: 'math', difficulty: 'advanced'},
  { id: 'math_disc_adv5', question: 'Vad är en partiell ordning?', answer: 'En binär relation på en mängd som är reflexiv, antisymmetrisk och transitiv (men inte alla par behöver vara jämförbara).', category: 'math', difficulty: 'advanced'},
  { id: 'math_disc_adv6', question: 'Vad är RSA-kryptering?', answer: 'Ett asymmetriskt krypteringssystem baserat på svårigheten att faktorisera stora heltal. Använder en publik nyckel för kryptering och en privat nyckel för dekryptering.', category: 'math', difficulty: 'advanced'},
  { id: 'math_disc_adv7', question: 'Vad är en ändlig kropp (Galois field)?', answer: 'En kropp (algebraisk struktur med addition, subtraktion, multiplikation, division) med ett ändligt antal element. Används inom kodningsteori och kryptografi.', category: 'math', difficulty: 'advanced'},
  { id: 'math_disc_adv8', question: 'Vad är rekursion?', answer: 'En metod där en funktion anropar sig själv för att lösa ett mindre delproblem av samma typ. Kräver ett basfall för att avslutas.', category: 'math', difficulty: 'advanced'},
  { id: 'math_disc_adv9', question: 'Vad är Fermats lilla sats?', answer: 'Om p är ett primtal, så gäller för varje heltal a som inte är delbart med p att a^(p-1) ≡ 1 (mod p).', category: 'math', difficulty: 'advanced'},
  { id: 'math_disc_adv10', question: 'Vad är en Turingmaskin?', answer: 'En teoretisk beräkningsmodell som består av ett oändligt band, ett läs-/skrivhuvud och en uppsättning tillstånd. Används för att definiera begreppet algoritm/beräkningsbarhet.', category: 'math', difficulty: 'advanced'},


  // --- Number Theory/Analysis/Topology - Expert ---
  { id: 'math-ex1', question: 'Vad var Wiles bevis av Fermats sista sats baserat på?', answer: 'Beviset kopplade satsen till Taniyama-Shimura-Weil-förmodan (om elliptiska kurvor och modulära former), som Wiles sedan bevisade för semistabila elliptiska kurvor.', category: 'math', difficulty: 'expert'},
  { id: 'math-ex2', question: 'Vad säger primtalssatsen om fördelningen av primtal?', answer: 'Antalet primtal π(x) mindre än eller lika med x är asymptotiskt lika med x / ln(x).', category: 'math', difficulty: 'expert'},
  { id: 'math_ex3', question: 'Vad är en analytisk fortsättning?', answer: 'En teknik för att utvidga definitionsområdet för en komplex analytisk funktion. Riemanns zetafunktion definieras initialt för Re(s)>1 men kan analytiskt fortsättas till hela komplexa planet (utom s=1).', category: 'math', difficulty: 'expert'},
  { id: 'math_ex4', question: 'Vad är skillnaden mellan ZFC och andra mängdteoretiska axiomsystem?', answer: 'ZFC (Zermelo-Fraenkel + Choice) är standardaxiomsystemet. Andra system kan sakna urvalsaxiomet (ZF), inkludera ytterligare axiom (stora kardinaltal) eller ha andra grundläggande antaganden (t.ex. NBG).', category: 'math', difficulty: 'expert'},
  { id: 'math_ex5', question: 'Vad är en mångfald (manifold)?', answer: 'Ett topologiskt rum som lokalt liknar ett Euklidiskt rum (av en viss dimension). Släta mångfalder har en differentierbar struktur.', category: 'math', difficulty: 'expert'},
  { id: 'math_ex6', question: 'Vad är Lebesguemåttet och Lebesgueintegralen?', answer: 'En generalisering av längd/area/volym till mer komplexa mängder. Lebesgueintegralen är en kraftfullare generalisering av Riemannintegralen baserad på mått.', category: 'math', difficulty: 'expert'},
  { id: 'math_ex7', question: 'Ge ett exempel på ett Banachrum som inte är ett Hilbertrum.', answer: 'Lᵖ-rummen för p ≠ 2 (t.ex. L¹ eller L^∞). Normen uppfyller inte parallellogramlagen och kan inte härledas från en inre produkt.', category: 'math', difficulty: 'expert'},
  { id: 'math_ex8', question: 'Vad är Gelfand-Naimark-satsen?', answer: 'En fundamental sats inom funktionalanalys som säger att varje C*-algebra är isometriskt *-isomorf med en subalgebra av begränsade operatorer på ett Hilbertrum.', category: 'math', difficulty: 'expert'},
  { id: 'math_ex9', question: 'Vad är fundamentalgruppen π₁(X) för ett topologiskt rum X?', answer: 'Gruppen av homotopiklasser av slutna slingor (loopar) baserade i en given punkt x₀ ∈ X. Beskriver rummets "1-dimensionella hål".', category: 'math', difficulty: 'expert'},
  { id: 'math_ex10', question: 'Vad är en Liegrupp?', answer: 'En grupp som också är en slät mångfald, där gruppoperationerna (multiplikation och inversion) är släta avbildningar.', category: 'math', difficulty: 'expert'},
  { id: 'math_ex11', question: 'Vad är Galoisteori?', answer: 'En teori som kopplar samman kroppsutvidgningar och gruppteori. Används bl.a. för att visa att generella polynom av grad ≥ 5 inte kan lösas med rotutdragningar.', category: 'math', difficulty: 'expert'},
  { id: 'math_ex12', question: 'Vad är representationsteori?', answer: 'Studiet av abstrakta algebraiska strukturer (som grupper, algebror) genom att representera deras element som linjära transformationer av vektorrum.', category: 'math', difficulty: 'expert'},
  { id: 'math_ex13', question: 'Vad är homologisk algebra?', answer: 'En gren av matematiken som studerar homologi i en generell algebraisk kontext, med verktyg som kedjekomplex och härledda funktorer.', category: 'math', difficulty: 'expert'},
  { id: 'math_ex14', question: 'Vad är schemateori inom algebraisk geometri?', answer: 'En modern grundval för algebraisk geometri (introducerad av Grothendieck) som generaliserar begreppet algebraisk varietet till scheman, vilka definieras med hjälp av kommutativa ringar.', category: 'math', difficulty: 'expert'},
  { id: 'math_ex15', question: 'Vad är Wigners halvcirkellag inom random matrix theory?', answer: 'Säger att egenvärdesfördelningen för stora slumpmässiga hermiteska matriser (från Wignerensemblen) approximativt följer en halvcirkelform.', category: 'math', difficulty: 'expert'},
  { id: 'math_ex16', question: 'Vad är Riemann-Rochs sats?', answer: 'En fundamental sats inom algebraisk geometri och komplex analys som relaterar dimensionen av rummet av meromorfa funktioner på en kompakt Riemann-yta (eller algebraisk kurva) till dess genus och graden av en divisor.', category: 'math', difficulty: 'expert'},
  { id: 'math_ex17', question: 'Vad är Hörmanders sats om hypoellipticitet?', answer: 'Ger villkor (Hörmanders villkor på Lie-algebra genererad av vektorfälten) för när en linjär partiell differentialoperator är hypoelliptisk (dvs. om L(u) är slät så är u slät).', category: 'math', difficulty: 'expert'},
  { id: 'math_ex18', question: 'Vad är en symplektisk mångfald?', answer: 'En slät mångfald utrustad med en sluten, icke-degenererad 2-form (den symplektiska formen). Utgör den matematiska grunden för klassisk mekanik (fasrummet).', category: 'math', difficulty: 'expert'},
  { id: 'math_ex19', question: 'Vad är Bairekategorisatsen?', answer: 'En sats inom topologi/analys som säger att ett komplett metriskt rum inte kan skrivas som en uppräknelig union av ingenstans täta delmängder.', category: 'math', difficulty: 'expert'},
  { id: 'math_ex20', question: 'Vad är Church-Turing-tesen?', answer: 'En hypotes (inte en matematisk sats) inom beräkningsbarhetsteori som säger att varje funktion som kan beräknas av en algoritm (i intuitiv mening) också kan beräknas av en Turingmaskin.', category: 'math', difficulty: 'expert'},
];