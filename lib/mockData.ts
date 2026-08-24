import { type LessonBundle } from "./offlineStore";

export const MOCK_LESSON_BUNDLES: LessonBundle[] = [
  // 1. PHYSICS: Electricity & Circuit Builder
  {
    id: "bundle-physics-01",
    slug: "electricity-and-circuit-builder",
    subject: "Physics",
    classLevel: 7,
    estimatedMinutes: 15,
    xpReward: 100,
    sizeKb: 1400,
    isCachedLocally: true,
    title_en: "Electricity & Circuit Builder (Ohm's Law)",
    title_hi: "विद्युत परिपथ और ओम का नियम (Circuit & Ohm's Law)",
    title_or: "ବିଦ୍ୟୁତ୍ ପରିପଥ ଏବଂ ଓମ୍‌ଙ୍କ ନିୟମ (Ohm's Law)",
    description_en: "Construct virtual electric circuits with batteries, switches, resistors, and light bulbs to master Ohm's Law (I = V/R).",
    description_hi: "बैटरी, स्विच, प्रतिरोध और बल्ब जोड़कर विद्युत परिपथ बनाएं और ओम के नियम (I = V/R) को समझें।",
    description_or: "ବ୍ୟାଟେରୀ, ସ୍ୱିଚ୍ ଏବଂ ବଲ୍ବ ସଂଯୋଗ କରି ବିଦ୍ୟୁତ୍ ପରିପଥ ନିର୍ମାଣ କରନ୍ତୁ ଏବଂ ଓମ୍‌ଙ୍କ ନିୟମ ଶିଖନ୍ତୁ।",
    content_en: "An electric circuit is a closed conducting path through which electric current flows. According to Ohm's Law, the current (I) flowing through a conductor between two points is directly proportional to the voltage (V) and inversely proportional to the resistance (R): I = V / R.",
    content_hi: "विद्युत परिपथ (Electric Circuit) वह बंद मार्ग है जिससे होकर विद्युत धारा बहती है। ओम के नियम के अनुसार, चालक में बहने वाली धारा (I) वोल्टेज (V) के समानुपाती और प्रतिरोध (R) के व्युत्क्रमानुपाती होती है: I = V / R।",
    content_or: "ବିଦ୍ୟୁତ୍ ପରିପଥ ହେଉଛି ଏକ ବନ୍ଦ ରାସ୍ତା ଯାହା ଦେଇ ବିଦ୍ୟୁତ୍ ପ୍ରବାହିତ ହୁଏ। ଓମ୍‌ଙ୍କ ନିୟମ ଅନୁସାରେ, ପ୍ରବାହିତ ବିଦ୍ୟୁତ୍ (I) ଭୋଲ୍ଟେଜ୍ (V) ସହିତ ସମାନୁପାତୀ ଏବଂ ପ୍ରତିରୋଧ (R) ସହିତ ବିଲୋମାନୁପାତୀ: I = V / R।",
    exploreContent_en: "Explore how rural solar home lighting systems convert solar panel DC electricity into household lighting using battery storage and emergency cutoff switches.",
    exploreContent_hi: "खोजें कि ग्रामीण सौर ऊर्जा प्रणालियां कैसे सौर पैनल के करंट को बैटरी में स्टोर करके घरों में प्रकाश देती हैं।",
    exploreContent_or: "ଗ୍ରାମୀଣ ସୌର ଶକ୍ତି ପ୍ରଣାଳୀ କିପରି ସୂର୍ଯ୍ୟକିରଣରୁ ବିଦ୍ୟୁତ୍ ସଂଗ୍ରହ କରି ଘରେ ଆଲୋକ ଯୋଗାଏ ତାହା ଦେଖନ୍ତୁ।",
    experimentTitle_en: "Virtual Circuit & Ohm's Law Experiment",
    experimentTitle_hi: "आभासी परिपथ और ओम का नियम प्रयोग",
    experimentTitle_or: "ଭର୍ଚୁଆଲ ପରିପଥ ଏବଂ ଓମ୍ ନିୟମ ପରୀକ୍ଷା",
    experimentSteps_en: [
      "Step 1: Connect a 9V Battery to the circuit loop.",
      "Step 2: Set Resistance box slider to 10 Ohms.",
      "Step 3: Toggle Knife Switch to Closed (ON).",
      "Observation: Ammeter measures exactly 0.900 Amperes (I = 9V / 10Ω)!"
    ],
    experimentSteps_hi: [
      "चरण 1: 9V की बैटरी को परिपथ से जोड़ें।",
      "चरण 2: प्रतिरोध को 10 ओम पर सेट करें।",
      "चरण 3: चाकू स्विच को चालू (ON) करें।",
      "निष्कर्ष: एमीटर ठीक 0.900 एम्पीयर (9V / 10Ω) करंट मापता है!"
    ],
    experimentSteps_or: [
      "ପଦକ୍ଷେପ ୧: ୯V ବ୍ୟାଟେରୀକୁ ପରିପଥ ସହିତ ଯୋଡ଼ନ୍ତୁ।",
      "ପଦକ୍ଷେପ ୨: ପ୍ରତିରୋଧକୁ ୧୦ ଓମ୍‌ରେ ସେଟ୍ କରନ୍ତୁ।",
      "ପଦକ୍ଷେପ ୩: ସ୍ୱିଚ୍ ଅନ୍ (ON) କରନ୍ତୁ।",
      "ସିଦ୍ଧାନ୍ତ: ଆମିଟର ଠିକ୍ ୦.୯୦୦ ଆମ୍ପିୟର ବିଦ୍ୟୁତ୍ ପ୍ରବାହ ଦର୍ଶାଏ!"
    ],
    keyVocabKeys: ["force", "friction"],
    questions: [
      {
        id: "pq1",
        question_en: "If a 12V battery is connected to a 20 Ohm bulb, what is the current in the circuit?",
        question_hi: "यदि 12V की बैटरी 20 ओम के बल्ब से जुड़ी है, तो परिपथ में कितनी धारा बहेगी?",
        question_or: "ଯଦି ୧୨V ବ୍ୟାଟେରୀ ୨୦ ଓମ୍ ବଲ୍ବ ସହ ସଂଯୁକ୍ତ ହୁଏ, ତେବେ କେତେ ବିଦ୍ୟୁତ୍ ପ୍ରବାହିତ ହେବ?",
        options_en: ["0.60 Amperes (I = 12/20)", "2.40 Amperes", "240 Amperes", "0.12 Amperes"],
        options_hi: ["0.60 एम्पीयर (12/20)", "2.40 एम्पीयर", "240 एम्पीयर", "0.12 एम्पीयर"],
        options_or: ["୦.୬୦ ଆମ୍ପିୟର (12/20)", "୨.୪୦ ଆମ୍ପିୟର", "୨୪୦ ଆମ୍ପିୟର", "୦.୧୨ ଆମ୍ପିୟର"],
        correctAnswerIndex: 0,
        explanation_en: "Using Ohm's Law: I = V / R = 12V / 20Ω = 0.60 A.",
        explanation_hi: "ओम के नियम से: I = V / R = 12 / 20 = 0.60 एम्पीयर।",
        explanation_or: "ଓମ୍‌ଙ୍କ ନିୟମ ଅନୁଯାୟୀ: I = V / R = ୧୨ / ୨୦ = ୦.୬୦ ଆମ୍ପିୟର।",
      }
    ],
  },

  // 2. CHEMISTRY: Water Quality & pH Indicator Lab
  {
    id: "bundle-chem-01",
    slug: "water-quality-and-ph-indicator-lab",
    subject: "Chemistry",
    classLevel: 7,
    estimatedMinutes: 14,
    xpReward: 95,
    sizeKb: 1300,
    isCachedLocally: true,
    title_en: "Water Quality & pH Indicator Lab",
    title_hi: "जल गुणवत्ता और pH सूचक प्रयोगशाला",
    title_or: "ଜଳ ଗୁଣବତ୍ତା ଏବଂ pH ସୂଚକ ପରୀକ୍ଷାଗାର",
    description_en: "Test village well water and farm runoff with universal indicators and manage soil/water acidity for safe agriculture.",
    description_hi: "प्राकृतिक सूचकों से गाँव के कुएं और खेत के पानी का pH मापें और अम्लीय जल का उपचार सीखें।",
    description_or: "ପ୍ରାକୃତିକ ସୂଚକ ବ୍ୟବହାର କରି ଗାଁ କୂଅ ଓ କ୍ଷେତ ପାଣିର pH ପରୀକ୍ଷା କରନ୍ତୁ।",
    content_en: "pH is a scale from 0 to 14 measuring hydrogen ion concentration. pH 7 is neutral (pure water), pH < 7 is acidic (lemon juice, vinegar), and pH > 7 is basic/alkaline (slaked lime, soap). Neutralization occurs when an acid reacts with a base to form salt and water.",
    content_hi: "pH मान 0 से 14 तक का पैमाना है। pH 7 उदासीन (शुद्ध जल) होता है, pH < 7 अम्लीय (नींबू, सिरका) और pH > 7 क्षारीय (चूना, साबुन) होता है। अम्ल और क्षार के मिलने से उदासीनीकरण (Neutralization) होता है।",
    content_or: "pH ମୂଲ୍ୟ ୦ ରୁ ୧୪ ମଧ୍ୟରେ ଥାଏ। pH ୭ ହେଉଛି ନିରପେକ୍ଷ (ପବିତ୍ର ଜଳ), pH ୭ ରୁ କମ୍ ହେଲେ ଅମ୍ଳୀୟ ଏବଂ pH ୭ ରୁ ଅଧିକ ହେଲେ କ୍ଷାରୀୟ ଅଟେ।",
    exploreContent_en: "Farmers use turmeric and litmus strips to determine whether agricultural soil requires slaked lime conditioning before sowing paddy seeds.",
    exploreContent_hi: "किसान धान बोने से पहले हल्दी और लिटमस से मिट्टी का pH जांचते हैं और आवश्यकतानुसार चूना मिलाते हैं।",
    exploreContent_or: "ଚାଷୀମାନେ ଧାନ ବୁଣିବା ପୂର୍ବରୁ ହଳଦୀ ଓ ଲିଟମସ୍ ଦ୍ୱାରା ମାଟି ପରୀକ୍ଷା କରି ଚୂନ ପ୍ରୟୋଗ କରନ୍ତି।",
    experimentTitle_en: "Village Well Water pH Neutralization",
    experimentTitle_hi: "गाँव के कुएं के पानी का pH उदासीनीकरण",
    experimentTitle_or: "କୂଅ ପାଣିର pH ନିରପେକ୍ଷୀକରଣ ପରୀକ୍ଷା",
    experimentSteps_en: [
      "Step 1: Take 50ml of acidic well water sample (pH 4.8).",
      "Step 2: Add 4 scoops of agricultural slaked lime powder.",
      "Step 3: Stir gently and add 2 drops of universal indicator.",
      "Observation: Liquid turns safe green neutral shade (pH 7.0)!"
    ],
    experimentSteps_hi: [
      "चरण 1: 50 मिलीलीटर अम्लीय कुएं का पानी (pH 4.8) लें।",
      "चरण 2: 4 चम्मच बुझा हुआ चूना (Slaked Lime) मिलाएं।",
      "चरण 3: घोल को हिलाएं और 2 बूंद यूनिवर्सल इंडिकेटर डालें।",
      "निष्कर्ष: पानी सुरक्षित हरा उदासीन रंग (pH 7.0) में बदल जाता है!"
    ],
    experimentSteps_or: [
      "ପଦକ୍ଷେପ ୧: ୫୦ ମିଲି ଅମ୍ଳୀୟ କୂଅ ପାଣି (pH ୪.୮) ନିଅନ୍ତୁ।",
      "ପଦକ୍ଷେପ ୨: ୪ ଚାମଚ କୃଷି ଚୂନ ପାଉଡ଼ର ମିଶାନ୍ତୁ।",
      "ପଦକ୍ଷେପ ୩: ଭଲଭାବେ ଗୋଳାଇ ସୂଚକର ୨ ଟୋପା ପକାନ୍ତୁ।",
      "ସିଦ୍ଧାନ୍ତ: ପାଣି ନିରପେକ୍ଷ ସବୁଜ ରଙ୍ଗ (pH ୭.୦) ଧାରଣ କରେ!"
    ],
    keyVocabKeys: ["force", "friction"],
    questions: [
      {
        id: "cq1",
        question_en: "What substance is added to neutralize overly acidic farm soil and water?",
        question_hi: "अत्यधिक अम्लीय मिट्टी और पानी को उदासीन करने के लिए क्या मिलाया जाता है?",
        question_or: "ଅତ୍ୟଧିକ ଅମ୍ଳୀୟ ମାଟି ଓ ପାଣିକୁ ସୁଧାରିବା ପାଇଁ କଣ ମିଶାଯାଏ?",
        options_en: ["Slaked Lime / Calcium Hydroxide (Base)", "Lemon Juice", "Battery Acid", "Common Salt"],
        options_hi: ["बुझा हुआ चूना / क्षार (Slaked Lime)", "नींबू का रस", "अम्ल", "साधारण नमक"],
        options_or: ["ଚୂନ / କ୍ଷାର (Slaked Lime)", "ଲେମ୍ବୁ ରସ", "ଏସିଡ୍", "ଲୁଣ"],
        correctAnswerIndex: 0,
        explanation_en: "Slaked lime is a chemical base that neutralizes excess soil acids.",
        explanation_hi: "बुझा हुआ चूना एक क्षार है जो मिट्टी के अम्ल को उदासीन करता है।",
        explanation_or: "ଚୂନ ଏକ କ୍ଷାର ଯାହା ଅମ୍ଳକୁ ନିରପେକ୍ଷ କରେ।",
      }
    ],
  },

  // 3. MATHEMATICS: Farm Field Area & Perimeter Slider Mission
  {
    id: "bundle-math-01",
    slug: "farm-field-area-and-perimeter-mission",
    subject: "Mathematics",
    classLevel: 7,
    estimatedMinutes: 12,
    xpReward: 90,
    sizeKb: 1100,
    isCachedLocally: true,
    title_en: "Farm Field Area & Perimeter Optimization",
    title_hi: "खेत का क्षेत्रफल और परिमाप अनुकूलन (Area & Perimeter)",
    title_or: "ଚାଷ ଜମି କ୍ଷେତ୍ରଫଳ ଏବଂ ପରିସୀମା ଅନୁକୂଳନ",
    description_en: "Optimize farm crop surface area under fixed wire fencing perimeter constraints for maximum harvest yield.",
    description_hi: "सीमित तार बाड़ (Perimeter) में अधिकतम फसल क्षेत्रफल (Area) प्राप्त करने के लिए लंबाई और चौड़ाई सेट करें।",
    description_or: "ନିର୍ଦ୍ଦିଷ୍ଟ ତାର ବାଡ଼ ମଧ୍ୟରେ ସର୍ବାଧିକ ଫସଲ କ୍ଷେତ୍ରଫଳ ପାଇବା ପାଇଁ ଅନୁକୂଳନ ଶିଖନ୍ତୁ।",
    content_en: "The perimeter (P) of a rectangle is the total distance around its outer boundary: P = 2(Length + Width). The area (A) is the enclosed surface: A = Length × Width. For a fixed perimeter, a square layout (Length = Width) always yields the maximum possible surface area.",
    content_hi: "आयत का परिमाप (Perimeter) बाहरी सीमा की कुल लंबाई है: P = 2(लंबाई + चौड़ाई)। क्षेत्रफल (Area) अंदर की सतह है: A = लंबाई × चौड़ाई। निश्चित परिमाप के लिए वर्गाकार (Square) खेत में सबसे अधिक क्षेत्रफल मिलता है।",
    content_or: "ଏକ ଆୟତକ୍ଷେତ୍ରର ପରିସୀମା ହେଉଛି ଚାରିପାଖର ମୋଟ ଦୂରତା: P = ୨(ଦୈର୍ଘ୍ୟ + ପ୍ରସ୍ଥ)। କ୍ଷେତ୍ରଫଳ ହେଉଛି: A = ଦୈର୍ଘ୍ୟ × ପ୍ରସ୍ଥ। ସମାନ ପରିସୀମା ପାଇଁ ଏକ ବର୍ଗାକାର ଜମି ସବୁଠାରୁ ବଡ଼ କ୍ଷେତ୍ରଫଳ ପ୍ରଦାନ କରେ।",
    exploreContent_en: "Discover how village farmers partition land into rectangular and square plots to manage canal water flow and seed plantation efficiency.",
    exploreContent_hi: "जानें कि ग्रामीण किसान नहर के पानी के वितरण और बीज बोने के लिए खेतों को कैसे बांटते हैं।",
    exploreContent_or: "କେନାଲ ପାଣି ବଣ୍ଟନ ଏବଂ ବିହନ ବୁଣିବା ପାଇଁ ଚାଷୀମାନେ ଜମିକୁ କିପରି ଭାଗ କରନ୍ତି ତାହା ଦେଖନ୍ତୁ।",
    experimentTitle_en: "Interactive Field Optimization Experiment",
    experimentTitle_hi: "आभासी खेत क्षेत्रफल अनुकूलन प्रयोग",
    experimentTitle_or: "ଭର୍ଚୁଆଲ ଜମି କ୍ଷେତ୍ରଫଳ ପରୀକ୍ଷା",
    experimentSteps_en: [
      "Step 1: Fix wire perimeter budget to 40 meters.",
      "Step 2: Adjust sliders to Length = 10m and Width = 10m.",
      "Step 3: Calculate Area = 10m × 10m = 100 sq. meters.",
      "Observation: Square configuration produces the highest possible harvest area!"
    ],
    experimentSteps_hi: [
      "चरण 1: बाड़ का परिमाप 40 मीटर रखें।",
      "चरण 2: लंबाई को 10 मीटर और चौड़ाई को 10 मीटर पर सेट करें।",
      "चरण 3: क्षेत्रफल की गणना करें = 10 × 10 = 100 वर्ग मीटर।",
      "निष्कर्ष: वर्गाकार आकार अधिकतम 100 वर्ग मीटर फसल क्षेत्र देता है!"
    ],
    experimentSteps_or: [
      "ପଦକ୍ଷେପ ୧: ତାର ପରିସୀମା ୪୦ ମିଟର ସ୍ଥିର କରନ୍ତୁ।",
      "ପଦକ୍ଷେପ ୨: ଦୈର୍ଘ୍ୟ ୧୦ ମିଟର ଏବଂ ପ୍ରସ୍ଥ ୧୦ ମିଟର ସେଟ୍ କରନ୍ତୁ।",
      "ପଦକ୍ଷେପ ୩: କ୍ଷେତ୍ରଫଳ ଗଣନା କରନ୍ତୁ = ୧୦ × ୧୦ = ୧୦୦ ବର୍ଗ ମିଟର।",
      "ସିଦ୍ଧାନ୍ତ: ବର୍ଗାକାର କ୍ଷେତ୍ର ସର୍ବାଧିକ ଫସଲ କ୍ଷେତ୍ରଫଳ ପ୍ରଦାନ କରେ!"
    ],
    keyVocabKeys: ["fraction", "numerator", "denominator"],
    questions: [
      {
        id: "mq1",
        question_en: "What dimensions for a 40m fencing wire perimeter enclose the largest area?",
        question_hi: "40 मीटर तार के परिमाप के लिए कौन सी विमाएं सबसे बड़ा क्षेत्रफल घेरती हैं?",
        question_or: "୪୦ ମିଟର ପରିସୀମା ବିଶିଷ୍ଟ ତାର ପାଇଁ କେଉଁ ମାପ ସବୁଠାରୁ ବଡ଼ କ୍ଷେତ୍ରଫଳ ଦିଏ?",
        options_en: ["10m × 10m (Square, Area = 100 m²)", "14m × 6m (Area = 84 m²)", "18m × 2m (Area = 36 m²)", "15m × 5m (Area = 75 m²)"],
        options_hi: ["10m × 10m (वर्ग, क्षेत्रफल = 100 m²)", "14m × 6m (क्षेत्रफल = 84 m²)", "18m × 2m (क्षेत्रफल = 36 m²)", "15m × 5m (क्षेत्रफल = 75 m²)"],
        options_or: ["୧୦m × ୧୦m (ବର୍ଗ, କ୍ଷେତ୍ରଫଳ = ୧୦୦ m²)", "୧୪m × ୬m (କ୍ଷେତ୍ରଫଳ = ୮୪ m²)", "୧୮m × ୨m (କ୍ଷେତ୍ରଫଳ = ୩୬ m²)", "୧୫m × ୫m (କ୍ଷେତ୍ରଫଳ = ୭୫ m²)"],
        correctAnswerIndex: 0,
        explanation_en: "A square (10 × 10) achieves the maximum area of 100 m² for a 40m perimeter.",
        explanation_hi: "10 × 10 का वर्गाकार खेत 40 मीटर परिमाप में सबसे बड़ा 100 वर्ग मीटर क्षेत्रफल देता है।",
        explanation_or: "୧୦ × ୧୦ ବର୍ଗାକାର କ୍ଷେତ୍ର ସର୍ବାଧିକ ୧୦୦ ବର୍ଗ ମିଟର କ୍ଷେତ୍ରଫଳ ପ୍ରଦାନ କରେ।",
      }
    ],
  },

  // 4. BIOLOGY: Virtual Cell Organelles & Solar Photosynthesis Explorer
  {
    id: "bundle-bio-01",
    slug: "virtual-cell-organelles-explorer",
    subject: "Biology",
    classLevel: 7,
    estimatedMinutes: 13,
    xpReward: 95,
    sizeKb: 1250,
    isCachedLocally: true,
    title_en: "Virtual Cell Organelles & Solar Photosynthesis",
    title_hi: "कोशिका के अंग और सौर प्रकाश संश्लेषण (Cell Organelles)",
    title_or: "କୋଷର ଅଙ୍ଗିକା ଏବଂ ସୌର ଆଲୋକ ସଂଶ୍ଳେଷଣ",
    description_en: "Explore plant cell structures, chloroplasts, stomata pores, and the biochemical engine of solar photosynthesis.",
    description_hi: "पादप कोशिका, क्लोरोप्लास्ट (हरितलवक), रंध्र और सौर ऊर्जा से भोजन बनाने की प्रक्रिया को देखें।",
    description_or: "ଉଦ୍ଭିଦ କୋଷର ଗଠନ, କ୍ଲୋରୋପ୍ଲାଷ୍ଟ ଏବଂ ଆଲୋକ ସଂଶ୍ଳେଷଣ ପ୍ରକ୍ରିୟା ଅନୁସନ୍ଧାନ କରନ୍ତୁ।",
    content_en: "A plant cell is the structural unit of plant life. It features a rigid cell wall, cell membrane, nucleus (genetic control center), large central vacuole for water storage, and chloroplasts containing green chlorophyll that captures sunlight energy to perform photosynthesis: 6CO2 + 6H2O + Sunlight -> C6H12O6 + 6O2.",
    content_hi: "पादप कोशिका (Plant Cell) पौधों की संरचनात्मक इकाई है। इसमें कोशिका भित्ति (Cell Wall), केंद्रक (Nucleus), रिक्तिका (Vacuole) और क्लोरोप्लास्ट (Chloroplast) होते हैं जो सूर्य के प्रकाश को ग्रहण कर भोजन और ऑक्सीजन बनाते हैं।",
    content_or: "ଉଦ୍ଭିଦ କୋଷରେ କୋଷ ଭିତ୍ତି, ନ୍ୟୁକ୍ଲିୟସ୍, ରସଧାନୀ ଏବଂ କ୍ଲୋରୋପ୍ଲାଷ୍ଟ ଥାଏ। କ୍ଲୋରୋପ୍ଲାଷ୍ଟ ସୂର୍ଯ୍ୟାଲୋକ ବ୍ୟବହାର କରି ଖାଦ୍ୟ ଏବଂ ଅମ୍ଳଜାନ ପ୍ରସ୍ତୁତ କରେ।",
    exploreContent_en: "Under a village microscope, onion peel cells reveal rectangular brick-like patterns with visible cell walls and dark stained nuclei.",
    exploreContent_hi: "प्याज के छिलके की कोशिकाएं माइक्रोस्कोप में ईंट जैसी जालीदार संरचना और स्पष्ट केंद्रक दिखाती हैं।",
    exploreContent_or: "ଅଣୁବୀକ୍ଷଣ ଯନ୍ତ୍ରରେ ପିଆଜ ଚୋପା କୋଷଗୁଡ଼ିକ ଇଟା ଭଳି ସୁନ୍ଦର ଭାବରେ ସଜ୍ଜିତ ଦେଖାଯାଏ।",
    experimentTitle_en: "Plant Leaf Starch Iodine Experiment",
    experimentTitle_hi: "पत्ती में स्टार्च का आयोडीन परीक्षण",
    experimentTitle_or: "ପତ୍ରରେ ଶ୍ୱେତସାର ପରୀକ୍ଷା",
    experimentSteps_en: [
      "Step 1: Pluck a healthy green leaf exposed to bright sunlight.",
      "Step 2: Boil in alcohol bath to extract green chlorophyll.",
      "Step 3: Add dilute iodine reagent drops on leaf surface.",
      "Observation: Turns deep blue-black, proving presence of synthesized glucose starch!"
    ],
    experimentSteps_hi: [
      "चरण 1: धूप में रखी हरी पत्ती लें।",
      "चरण 2: क्लोरोफिल निकालने के लिए इसे अल्कोहल में उबालें।",
      "चरण 3: पत्ती पर आयोडीन की बूंदें डालें।",
      "निष्कर्ष: पत्ती नीली-काली हो जाती है, जो स्टार्च बनने का प्रमाण है!"
    ],
    experimentSteps_or: [
      "ପଦକ୍ଷେପ ୧: ଖରାରେ ଥିବା ସବୁଜ ପତ୍ର ନିଅନ୍ତୁ।",
      "ପଦକ୍ଷେପ ୨: କ୍ଲୋରୋଫିଲ ବାହାର କରିବା ପାଇଁ ଆଲକୋହଲରେ ଫୁଟାନ୍ତୁ।",
      "ପଦକ୍ଷେପ ୩: ଆୟୋଡିନ୍ ଦ୍ରବଣ ପକାନ୍ତୁ।",
      "ସିଦ୍ଧାନ୍ତ: ପତ୍ର ନୀଳ-କଳା ରଙ୍ଗ ହୋଇ ଶ୍ୱେତସାରର ଉପସ୍ଥିତି ପ୍ରମାଣ କରେ!"
    ],
    keyVocabKeys: ["photosynthesis", "chlorophyll", "oxygen", "solar_energy"],
    questions: [
      {
        id: "bq1",
        question_en: "Which plant cell organelle houses chlorophyll and performs photosynthesis?",
        question_hi: "पादप कोशिका का कौन सा अंगक क्लोरोफिल रखता है और प्रकाश संश्लेषण करता है?",
        question_or: "ଉଦ୍ଭିଦ କୋଷର କେଉଁ ଅଙ୍ଗିକାରେ କ୍ଲୋରୋଫିଲ ଥାଏ ଏବଂ ଆଲୋକ ସଂଶ୍ଳେଷଣ ହୁଏ?",
        options_en: ["Chloroplast (हरितलवक)", "Mitochondria", "Cell Wall", "Ribosome"],
        options_hi: ["क्लोरोप्लास्ट / हरितलवक (Chloroplast)", "माइटोकॉन्ड्रिया", "कोशिका भित्ति", "राइबोसोम"],
        options_or: ["କ୍ଲୋରୋପ୍ଲାଷ୍ଟ / ହରିତଲବକ (Chloroplast)", "ମାଇଟୋକଣ୍ଡ୍ରିଆ", "କୋଷ ଭିତ୍ତି", "ରାଇବୋଜୋମ୍"],
        correctAnswerIndex: 0,
        explanation_en: "Chloroplasts contain chlorophyll pigments and serve as the plant cell's solar food factory.",
        explanation_hi: "क्लोरोप्लास्ट में क्लोरोफिल होता है जो सौर ऊर्जा से भोजन बनाता है।",
        explanation_or: "କ୍ଲୋରୋପ୍ଲାଷ୍ଟ ସୂର୍ଯ୍ୟାଲୋକରୁ ଖାଦ୍ୟ ପ୍ରସ୍ତୁତ କରେ।",
      }
    ],
  },
];
