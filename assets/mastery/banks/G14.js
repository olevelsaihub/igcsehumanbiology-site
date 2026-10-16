/* Group G14 mastery bank: Pathogens, immunity and public health (A-Grade Block 14).
 * AI-written practice questions (Claude), checked in a separate AI examiner pass. Not past-paper questions. */
(function () {
  'use strict';
  var B = window.MASTERY_BANKS = window.MASTERY_BANKS || {};
  var R = window.Mastery;   // R.roundDp(x, dp), R.roundSf(x, n): correct half-up rounding

  // ---------- helpers local to this file ----------
  function rint(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function commas(x) { var p = String(x).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function M(skill, q, right, wrong, why, extra) { var o = { skill: skill, kind: 'mcq', q: q, options: [right].concat(wrong), answer: 0, why: why }; if (extra) for (var k in extra) o[k] = extra[k]; return o; }
  function S(skill, q, rights, wrongs, why, extra) { var o = { skill: skill, kind: 'multi', q: q, options: rights.concat(wrongs), answers: rights.map(function (_, i) { return i; }), why: why }; if (extra) for (var k in extra) o[k] = extra[k]; return o; }
  function N(skill, q, answer, unit, why, extra) { var o = { skill: skill, kind: 'num', q: q, answer: answer, unit: unit, why: why }; if (extra) for (var k in extra) o[k] = extra[k]; return o; }
  function mq(q, right, wrong, why, extra) { var o = { kind: 'mcq', q: q, options: [right].concat(wrong), answer: 0, why: why }; if (extra) for (var k in extra) o[k] = extra[k]; return o; }
  function nq(q, answer, unit, why, extra) { var o = { kind: 'num', q: q, answer: answer, unit: unit, why: why }; if (extra) for (var k in extra) o[k] = extra[k]; return o; }
  function F(note, item) { item.ex = 'fixed: ' + note; return item; }
  // Registers a type. `exam` is the examiner record ({ date, dropped: [reasons] }); without it the items have no verdict yet.
  function T(id, title, items, exam) {
    var review = null;
    if (exam) {
      items.forEach(function (it) { if (!it.ex) it.ex = 'pass'; });
      review = { writer: 'AI (Claude), writer pass', examiner: 'AI (Claude), separate examiner pass against the brief', date: exam.date,
        checked: items.length + exam.dropped.length, passed: items.filter(function (i) { return i.ex === 'pass'; }).length,
        fixed: items.filter(function (i) { return i.ex !== 'pass'; }).length, dropped: exam.dropped };
    }
    B[id] = { title: title, review: review, items: items };
  }
  var INK = '#303a4c', HI = '#e4464f', BLUE = '#195d9b', GREY = '#9aa5b8';


  function lab(x1, y1, x2, y2, t, anchor) { return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + INK + '" stroke-width="1.3"/><text x="' + (anchor === 'end' ? x2 - 6 : x2 + 6) + '" y="' + (y2 + 5) + '" font-size="16" font-weight="700" text-anchor="' + (anchor || 'start') + '" fill="' + INK + '">' + t + '</text>'; }
  // Bacterial cell: Q cell wall, R cell membrane, S loop of DNA, T plasmid, U flagellum.
  var BACT = (function () {
    var g = '<path d="M372 140 q20 -18 40 0 t40 0 t40 0" fill="none" stroke="' + INK + '" stroke-width="3"/>';
    g += '<rect x="70" y="60" width="310" height="160" rx="80" fill="#dfe9d2" stroke="' + INK + '" stroke-width="6"/>';
    g += '<rect x="82" y="72" width="286" height="136" rx="68" fill="#f4f8ee" stroke="#7a9a4a" stroke-width="2"/>';
    g += '<path d="M150 140 C150 100 200 95 225 120 C245 140 260 100 290 110 C320 120 310 170 280 170 C250 170 240 150 215 165 C185 182 150 175 150 140 Z" fill="none" stroke="' + BLUE + '" stroke-width="3"/>';
    g += '<circle cx="320" cy="90" r="11" fill="none" stroke="' + HI + '" stroke-width="3"/><circle cx="130" cy="185" r="9" fill="none" stroke="' + HI + '" stroke-width="3"/>';
    [[120, 110], [140, 95], [180, 190], [240, 90], [300, 190], [340, 150], [110, 150], [260, 195]].forEach(function (d) { g += '<circle cx="' + d[0] + '" cy="' + d[1] + '" r="3" fill="' + INK + '"/>'; });
    g += lab(160, 62, 120, 25, 'Q', 'end') + lab(250, 72, 290, 25, 'R') + lab(215, 165, 190, 260, 'S', 'end') + lab(326, 99, 360, 250, 'T') + lab(452, 140, 470, 200, 'U');
    return '<svg class="mc-svg mc-svg-small" viewBox="0 0 520 280" role="img" aria-label="Bacterial cell with five structures labelled Q to U, not to scale">' + g + '</svg>';
  })();

  /* ====================================================================== HBI-DEFINE-PATHOGEN-AND-NAME-CAUSE */
  T('HBI-DEFINE-PATHOGEN-AND-NAME-CAUSE', 'Define pathogen, classify diseases and name the organism type causing each', [
    M('pathogen', "What is a pathogen?",
      "A microorganism that causes disease", ["Any bacterium, because all bacteria cause disease", "A white blood cell that fights infection", "A chemical made by the body to kill microbes"], "Many bacteria are harmless; pathogens are the ones that cause disease."),
    M('communicable', "What is a communicable disease?",
      "A disease caused by a pathogen that can pass from person to person", ["A disease that is not serious and cannot kill", "A disease caused by a lack of a vitamin", "A disease that runs in families and is passed from parents to children"], "Communicable means it can be caught."),
    M('non-communicable', "Why is diabetes called non-communicable?",
      "It is not caused by a pathogen, so it cannot be caught from another person", ["It is never serious, so doctors do not treat it", "It is caused by a virus that cannot survive outside the body", "It only affects older people, so it does not spread to the young"],
      "Non-communicable means not passed from person to person."),
    M('bacteria', "Which disease is caused by a bacterium?",
      "Cholera", ["Influenza", "Malaria", "Athlete's foot"], "Bacteria cause cholera, typhoid, TB and gonorrhoea."),
    M('viruses', "Which disease is caused by a virus?",
      "Polio", ["Tuberculosis", "Typhoid", "Malaria"], "Viruses cause Ebola, AIDS, polio, influenza and hepatitis B."),
    M('malaria', "What causes malaria?",
      "A protozoan (Plasmodium)", ["A mosquito", "A virus", "A fungus"], "The mosquito is the vector that carries it, not the cause."),
    M('fungi', "Which disease is caused by a fungus?",
      "Athlete's foot", ["Gonorrhoea", "Hepatitis B", "Cholera"], "Athlete's foot is a fungal skin infection."),
    M('HIV', "Which statement about HIV is correct?",
      "HIV is a virus that causes AIDS", ["HIV is a bacterium that causes AIDS", "AIDS is the virus and HIV is the disease", "HIV is a protozoan carried by mosquitoes"], "HIV is the virus; AIDS is the disease it leads to."),
    F("replaced an implausible distractor ('reservoir that is never bitten')", M('vector', "What is the role of the mosquito in malaria?",
      "It is the vector that carries the pathogen to people", ["It is the pathogen that causes the disease", "It is the host that the protozoan finally kills", "It is the vaccine that protects people"], "A vector carries a pathogen from one host to another.")),
    M('typhoid', "How is typhoid often spread?",
      "In food or water, often carried by houseflies", ["By mosquito bites at night", "By sexual intercourse only", "By breathing in fungal spores"], "Typhoid is a bacterial disease spread through food and water."),
    S('organism types', "Which of these are viruses?", ["Influenza", "Ebola"], ["Tuberculosis", "Gonorrhoea", "Athlete's foot"],
      "TB and gonorrhoea are bacterial; athlete's foot is fungal."),
    M('common errors', "A student writes 'mosquito' as the cause of malaria. What is correct?",
      "A protozoan causes malaria; the mosquito carries it", ["A bacterium causes malaria; the mosquito eats it", "A virus causes malaria; the mosquito kills it", "A fungus causes malaria; the mosquito grows it"], "Cause and vector are different.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-BACTERIAL-CELL-STRUCTURE */
  T('HBI-BACTERIAL-CELL-STRUCTURE', 'Identify bacterial cell structures and compare with human cells', [
    M('label', "The diagram shows a bacterial cell. Which letter labels a plasmid?", "T", ["Q", "S", "U"],
      "T is a small ring of DNA, separate from the main loop.", { svg: BACT, family: 'g14-bact' }),
    M('label', "Using the same diagram, which structure is labelled S?", "Loop of DNA", ["Nucleus", "Plasmid", "Ribosome"],
      "S is the single large loop of DNA. It is not inside a nucleus.", { svg: BACT, family: 'g14-bact' }),
    M('label', "Using the same diagram, which structure is labelled U?", "Flagellum", ["Cilium", "Pilus", "Plasmid"],
      "U is the long whip-like structure used for movement.", { svg: BACT, family: 'g14-bact' }),
    M('label', "Using the same diagram, which letter labels the cell wall?", "Q", ["R", "S", "T"],
      "Q is the thick outer layer. R is the cell membrane just inside it.", { svg: BACT, family: 'g14-bact' }),
    M('DNA', "Where is the DNA in a bacterial cell?",
      "In a loop in the cytoplasm, and in plasmids", ["In a nucleus, like a human cell", "In the cell wall", "Bacteria have no DNA"], "Bacteria have DNA but no nucleus."),
    M('functions', "What do ribosomes do?",
      "Make proteins", ["Control what enters the cell", "Help the cell move", "Store the genetic code"], "Ribosomes are found in bacteria and human cells."),
    M('functions', "What is the function of the cell membrane?",
      "It controls what enters and leaves the cell", ["It makes proteins for the cell", "It helps the cell to swim", "It supports the cell against bursting"], "The cell wall gives support; the membrane controls entry and exit."),
    M('similarities', "Which structures are found in both a bacterial cell and a human skin cell?",
      "Cell membrane, cytoplasm, ribosomes and DNA", ["Cell wall, plasmids and a flagellum", "Nucleus and mitochondria", "Cell wall and nucleus"], "Both cells share these basic parts."),
    M('differences', "Which is a correct difference between a bacterial cell and a human cell?",
      "A bacterium has a cell wall; a human cell does not", ["A bacterium has a nucleus; a human cell does not", "A human cell has plasmids; a bacterium does not", "A human cell has a cell wall; a bacterium does not"], "Say which cell has which feature."),
    M('differences', "Which structure is found in a human cell but not in a bacterium?",
      "Mitochondria", ["Ribosomes", "Cytoplasm", "Cell membrane"], "Bacteria have no mitochondria and no nucleus."),
    M('capsule', "In a photograph, what might the slimy outer layer of a bacterium be called?",
      "Capsule or slime coat", ["Nucleus or nucleolus", "Mitochondrion", "Cytoplasm"], "Some bacteria have a slime capsule outside the cell wall."),
    M('common errors', "A student says a bacterium has no DNA because it has no nucleus. What is correct?",
      "It has DNA in a loop and in plasmids, free in the cytoplasm", ["It has no DNA and uses RNA instead", "Its DNA is in the cell wall", "Its DNA is in the flagellum"], "No nucleus does not mean no DNA.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-DISEASE-TRANSMISSION-PREVENTION */
  T('HBI-DISEASE-TRANSMISSION-PREVENTION', 'Describe how a named infection spreads, shows itself and is prevented', [
    M('course', "What happens during the incubation period of an infection?",
      "The pathogen multiplies, but there are no symptoms yet", ["The symptoms are at their worst and the person feels very unwell", "The pathogen leaves the body", "The person becomes immune"], "Symptoms appear once there are enough pathogens to cause harm."),
    M('delay', "Why do symptoms appear some days after infection?",
      "Only a few pathogens enter, and they need time to multiply to large numbers", ["The pathogens must travel through the blood to every organ before any harm is done", "The body hides the symptoms until the pathogens have all died", "Pathogens cannot cause harm until the person is tired"],
      "Link the delay to reproduction."),
    M('cholera', "How is cholera spread from one person to another?",
      "In water or food contaminated with faeces from an infected person", ["By breathing in droplets that an infected person releases when coughing or sneezing", "By mosquito bites carrying the bacteria between people", "By sharing towels and shoes in changing rooms"],
      "Mention the faeces of an infected person."),
    M('cholera', "Which measure prevents cholera?",
      "Boiling drinking water and treating sewage", ["Sleeping under a mosquito net", "Using condoms", "Wearing goggles"], "Cholera is a water-borne disease."),
    M('Ebola', "Which set of precautions helps stop Ebola spreading?",
      "Protective clothing, isolating patients and safe burial", ["Giving antibiotics to everyone in the area and handing out mosquito nets", "Boiling water and wearing sunscreen", "Eating more vitamin C and resting"], "Ebola spreads through body fluids."),
    M('Ebola', "Why do fruit bats matter in Ebola outbreaks?",
      "They are a reservoir: they carry the virus without becoming ill", ["They are the vector: they bite people and inject the virus into the blood", "They are the cure for the virus", "They kill the virus in the wild"], "A reservoir keeps the pathogen in the environment."),
    M('HIV', "Which is a way that HIV is spread?",
      "Sharing needles with infected blood", ["Drinking water that is contaminated with faeces", "Mosquito bites", "Shaking hands"], "HIV spreads by sex, infected blood and from mother to baby."),
    M('HIV', "Which measure helps prevent the spread of HIV?",
      "Screening donated blood and using condoms", ["Boiling all drinking water before using it for cooking", "Sleeping under nets", "Taking antibiotics"], "There is no cure; prevention stops spread."),
    M('gonorrhoea', "How is gonorrhoea prevented and treated?",
      "Prevented by condoms; treated with antibiotics", ["Prevented by nets; treated with antifungal cream", "Prevented by boiling water; treated with insulin", "Prevented by goggles; treated with rehydration"], "Gonorrhoea is a bacterial infection spread by sex."),
    M('pinworm', "Which measure breaks the pinworm cycle?",
      "Washing hands and keeping nails short", ["Sleeping under a mosquito net", "Taking antibiotics daily", "Boiling all drinking water"], "Eggs pass from the anus to fingers to mouths."),
    M('athlete\'s foot', "How is athlete's foot treated?",
      "With antifungal creams or powders", ["With antibiotics", "With a vaccine", "With rehydration salts"], "Athlete's foot is a fungal infection; antibiotics do not work on fungi."),
    M('common errors', "A student writes 'wash hands' and 'good hygiene' as two precautions. Why might only one mark be given?",
      "They are the same idea", ["Hand washing does not help at all", "Good hygiene means eating well", "Only vaccination counts as a precaution"], "Give two different precautions.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-ANTIGEN-ANTIBODY-SPECIFICITY */
  T('HBI-ANTIGEN-ANTIBODY-SPECIFICITY', 'Explain antigen-antibody specificity and how monoclonal antibodies are made', [
    M('antigen', "What is an antigen?",
      "A chemical, usually a protein, on the surface of a cell or pathogen", ["A protein made by lymphocytes that binds to pathogens and helps destroy them", "A white blood cell that engulfs bacteria", "A drug that kills bacteria"], "The immune system recognises foreign antigens."),
    M('antibody', "What is an antibody?",
      "A protein made by lymphocytes", ["A white blood cell that engulfs pathogens", "A type of bacterium", "A drug made by fungi"], "Antibodies are proteins, not cells."),
    M('specificity', "Why does each antibody bind to only one type of antigen?",
      "Its binding site has a shape complementary to that one antigen", ["Its binding site has exactly the same shape as the antigen it meets", "It is made from the antigen itself", "It is larger than every other antibody"],
      "Complementary, not 'the same'."),
    M('variable region', "What is different between different antibodies?",
      "The shape of the binding site", ["The number of lymphocytes that made it", "The colour of the protein", "The cell they live in"], "Each antibody has its own binding site shape."),
    M('autoimmune', "In coeliac disease, the immune system treats some of the body's own proteins as foreign. What happens?",
      "Antibodies attach to the body's own cells and damage them", ["The body stops making antibodies and cannot fight any infection", "The body makes antibiotics against itself", "Phagocytes stop working"], "This is an autoimmune disease."),
    M('animal insulin', "Why might insulin from animals cause an immune response in some people?",
      "Its proteins can be recognised as foreign antigens", ["It contains bacteria that cause disease in people who inject it", "It is not a protein at all", "It makes the body produce more insulin"], "Proteins from another species may be treated as foreign."),
    M('monoclonal', "Which is the correct order for making monoclonal antibodies?",
      "Inject a mouse, take lymphocytes, fuse with tumour cells, clone the hybridomas", ["Take tumour cells, inject a mouse, clone lymphocytes, add antibiotics", "Clone lymphocytes, inject a mouse, remove tumour cells, fuse with bacteria", "Inject a mouse, take red blood cells, fuse with plasma, freeze them"],
      "The fused cells (hybridomas) divide and make one type of antibody."),
    M('hybridoma', "Why are lymphocytes fused with tumour cells?",
      "Tumour cells divide many times, so the fused cells can be grown in large numbers", ["Tumour cells make antibodies, so lymphocytes are not needed", "Tumour cells kill the lymphocytes so only antibodies remain", "Tumour cells change the shape of the antibody"],
      "The hybridoma combines antibody-making with endless division."),
    M('monoclonal', "What does 'monoclonal' mean?",
      "All the antibodies are identical, made by one clone of cells", ["The antibodies come from many different animals and many cell types", "The antibodies have many different shapes", "The antibodies are made by one tumour only"], "One clone makes one antibody type."),
    M('antigen presenting', "After digesting a pathogen, a phagocyte shows the pathogen's antigens on its surface. Why does this help?",
      "Lymphocytes recognise the antigen sooner, so the response is faster", ["The phagocyte turns into a lymphocyte and starts making antibodies itself", "The antigens kill other pathogens", "It stops lymphocytes from working"], "Presenting antigens speeds up the immune response."),
    M('common errors', "A student writes: 'Antibodies engulf bacteria.' What is correct?",
      "Phagocytes engulf; antibodies are proteins that bind to antigens", ["Antibodies engulf viruses but not bacteria", "Lymphocytes engulf bacteria; antibodies digest them inside the cell", "Antibiotics engulf; antibodies kill"], "Antibodies are not cells."),
    M('common errors', "A student mixes up 'antibody' and 'antibiotic'. Which is correct?",
      "Antibodies are made by the body; antibiotics are drugs that kill bacteria", ["Antibodies are drugs; antibiotics are made by lymphocytes", "Both are made by the body", "Both are drugs from fungi"], "The names look alike.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-VACCINATION-ACTIVE-IMMUNITY */
  T('HBI-VACCINATION-ACTIVE-IMMUNITY', 'Explain how vaccination or infection gives active immunity', [
    M('contents', "What does a vaccine contain?",
      "Antigens, such as a dead or weakened pathogen", ["Antibodies taken from the blood of another person", "Antibiotics to kill bacteria", "Live, full-strength pathogens"], "The body makes its own antibodies in response."),
    M('response', "What do lymphocytes do when they detect antigens from a vaccine?",
      "They make specific antibodies, and some become memory cells", ["They engulf the vaccine and destroy it at once without any other response", "They make antibiotics against the antigens", "They turn into red blood cells"], "Memory cells give long-term protection."),
    F("accuracy: memory cells trigger fast antibody production rather than making antibodies themselves", M('memory cells', "What happens if the real pathogen enters later?",
      "Memory cells respond quickly, so many antibodies are made before symptoms appear", ["The person becomes ill for longer than before", "The vaccine antigens attack the pathogen", "The body makes antibiotics instead"],
      "This is the faster, larger secondary response.")),
    M('secondary', "Compared with the first response, how is the secondary response different?",
      "Faster and with more antibodies", ["Slower and with fewer antibodies", "The same speed and amount", "Slower but with more antibodies"], "Memory cells are ready to respond."),
    M('natural', "How does catching a disease give immunity?",
      "Lymphocytes make antibodies and memory cells against its antigens", ["The pathogen passes its own antibodies to the person, who keeps them", "Antibiotics stay in the blood", "The body stops making new lymphocytes"], "This is natural active immunity."),
    M('booster', "Why is a booster dose sometimes given?",
      "Antibody levels fall over time; the booster raises them and makes more memory cells", ["The first dose made too many antibodies", "The booster removes the memory cells", "Boosters contain antibiotics"], "Boosters top up protection."),
    M('herd immunity', "How does vaccinating most people protect people who are not vaccinated?",
      "Fewer people carry the pathogen, so it spreads less", ["Vaccinated people pass their antibodies on to others", "The vaccine spreads through the air to others", "Unvaccinated people make memory cells by being near vaccinated people"],
      "This is herd immunity."),
    F("clearer wording ('times greater than the first') and accurate memory-cell explanation", { skill: 'antibody graph', gen: function () {
      var d1 = rint(8, 14), d2 = d1 + rint(3, 6), peak1 = rint(10, 30), mult = rint(8, 15), peak2 = peak1 * mult;
      return nq("A person is vaccinated. The antibody level peaks at " + peak1 + " units after " + d1 + " days. After a booster the peak is " + peak2 + " units. How many times greater is the second peak than the first?", mult, 'times',
        peak2 + " ÷ " + peak1 + " = " + mult + ". The second response is much larger because memory cells respond quickly and many antibodies are made.");
    } }),
    M('attenuated', "What is an attenuated pathogen?",
      "A weakened pathogen that cannot cause the disease", ["A pathogen that is stronger than normal and spreads faster", "A pathogen that has been turned into an antibody", "A pathogen that only infects animals"], "It still has the antigens."),
    M('timing', "Why does a vaccine not make a person ill with the disease?",
      "The pathogen in it is dead or weakened, or only its antigens are used", ["The vaccine contains antibiotics", "The vaccine kills all lymphocytes", "The vaccine is given only to healthy adults"], "It provides antigens without causing the disease."),
    M('common errors', "A student writes: 'The vaccine contains antibodies.' What is correct?",
      "It contains antigens; the body makes the antibodies", ["It contains antibiotics; the body then makes antigens", "It contains memory cells from a donor", "It contains white blood cells"], "Antigens in, antibodies made."),
    M('common errors', "A student writes: 'The body remembers the disease.' What should be named?",
      "Memory cells", ["Antibiotics", "Red blood cells", "Platelets"], "Name memory cells: lymphocytes that stay in the blood and recognise the antigen later.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-CLASSIFY-IMMUNITY-TYPES */
  T('HBI-CLASSIFY-IMMUNITY-TYPES', 'Classify immunity as natural or artificial and active or passive', [
    M('vaccine', "What type of immunity does a vaccine give?",
      "Artificial active", ["Artificial passive", "Natural active", "Natural passive"], "Your own cells make antibodies (active) after a medical procedure (artificial)."),
    M('breast milk', "A baby gets antibodies in breast milk. What type of immunity is this?",
      "Natural passive", ["Natural active", "Artificial passive", "Artificial active"], "Ready-made antibodies (passive) in normal life (natural)."),
    M('catching', "A person catches chickenpox and recovers. What type of immunity do they gain?",
      "Natural active", ["Artificial active", "Natural passive", "Artificial passive"], "Their own lymphocytes made the antibodies."),
    M('injection', "A patient is injected with ready-made antibodies. What type of immunity is this?",
      "Artificial passive", ["Artificial active", "Natural passive", "Natural active"], "Received antibodies by a medical procedure."),
    M('active vs passive', "Why does passive immunity not last long?",
      "No memory cells are made, and the antibodies are broken down", ["Too many memory cells are made, so the immune system becomes overloaded", "The antibodies multiply too fast", "The person's lymphocytes destroy the memory cells"], "Active immunity lasts longer because memory cells form."),
    M('speed', "Why does passive immunity work faster than active immunity?",
      "The antibodies are ready-made, so the body does not need to make them", ["The body makes antibodies faster after an injection", "Memory cells are injected with the antibodies", "Passive immunity uses antibiotics"], "Active immunity takes days to develop."),
    M('placenta', "How do antibodies reach a baby before birth?",
      "Across the placenta from the mother's blood", ["Through the umbilical cord from the baby's own lymphocytes", "In the amniotic fluid from the father", "Through the baby's lungs"], "Antibodies pass from the mother's blood across the placenta. This is natural passive immunity."),
    M('plasma therapy', "How does plasma from a person who has recovered from Ebola help a patient?",
      "Its antibodies bind to the virus antigens so phagocytes can destroy it", ["Its red blood cells carry extra oxygen to fight the virus", "Its antibiotics kill the virus", "Its memory cells stay in the patient for life"],
      "This is artificial passive immunity."),
    M('plasma therapy', "Why are the red cells removed before giving plasma to a patient?",
      "So the blood does not clump (agglutinate)", ["So the plasma carries more oxygen to the patient's cells", "So the antibodies are destroyed", "So the patient makes memory cells"], "Removing red cells avoids blood group reactions."),
    M('plasma screening', "Why is donated plasma tested before use?",
      "So no other disease is passed on", ["So it contains more red cells", "So it becomes active immunity", "So the antibodies in it are removed first"], "Screening stops other infections spreading."),
    M('common errors', "A student says a vaccine gives passive immunity 'because the person does nothing'. What is correct?",
      "A vaccine gives active immunity because the person's own cells make antibodies", ["A vaccine gives passive immunity because antibodies are injected", "A vaccine gives no immunity at all", "A vaccine gives natural immunity"], "Active means your own cells respond."),
    M('common errors', "A student says antibodies in breast milk give artificial immunity. What is correct?",
      "It is natural, because it happens in normal life", ["It is artificial, because the baby is fed by the mother", "It is active, because the baby drinks it", "It is not immunity at all"], "Breast milk is natural passive immunity.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-ANTIBIOTICS-AND-RESISTANCE */
  T('HBI-ANTIBIOTICS-AND-RESISTANCE', 'State what antibiotics treat and explain how resistance develops', [
    M('source', "Where do antibiotics such as penicillin come from?",
      "Microorganisms, mainly fungi such as Penicillium", ["White blood cells in the human body, mainly lymphocytes", "Viruses grown in a laboratory", "Plants that grow in soil only"], "Give the source organism, not an antibiotic name."),
    M('action', "What do antibiotics do?",
      "Kill bacteria or stop them growing", ["Kill viruses inside the cells they infect", "Make antibodies against bacteria", "Kill fungi on the skin"], "They treat bacterial diseases."),
    M('viruses', "Why do antibiotics not work against Ebola?",
      "Ebola is a virus; it lives inside cells and lacks the structures antibiotics attack", ["Ebola is a bacterium with a very thick cell wall that no antibiotic can pass through", "Ebola is a fungus that grows too fast for antibiotics", "Antibiotics only work on diseases spread by mosquitoes"],
      "Antibiotics target bacterial structures."),
    M('fungi', "Why can athlete's foot not be treated with antibiotics?",
      "It is caused by a fungus, and antibiotics act on bacteria", ["It is caused by a virus that hides deep inside the skin cells", "It is caused by a bacterium with no cell wall", "It is an inherited condition, not an infection"],
      "Antifungal creams are used instead."),
    S('treatable', "Which of these diseases can be treated with antibiotics?", ["Cholera", "Tuberculosis", "Gonorrhoea"], ["Influenza", "Athlete's foot"],
      "Influenza is viral; athlete's foot is fungal."),
    M('mutation', "How does antibiotic resistance first arise?",
      "A random mutation in a bacterium's DNA", ["The antibiotic causes the bacterium to change", "The patient's antibodies change the bacterium", "Bacteria learn to avoid the antibiotic"], "The mutation happens first, by chance."),
    M('selection', "Which sequence explains how resistance spreads in a population of bacteria?",
      "Non-resistant bacteria die, resistant ones survive, reproduce and pass on the gene", ["All the bacteria become immune to the antibiotic at the same time", "The antibiotic gives every bacterium a resistance gene", "Resistant bacteria die and non-resistant bacteria reproduce"],
      "This is natural selection."),
    M('overuse', "How does not finishing a course of antibiotics help resistance to develop?",
      "The most resistant bacteria may survive and multiply", ["It kills the resistant bacteria first", "It makes the bacteria mutate faster than they would otherwise", "It stops the patient making antibodies"], "Survivors are the toughest bacteria."),
    M('MRSA', "What is MRSA?",
      "A strain of S. aureus resistant to many antibiotics", ["A virus that causes influenza", "A new type of antibiotic used in hospitals to treat infections", "A fungus that grows on skin"], "MRSA infections are hard to treat and spread in hospitals."),
    M('MRSA', "Why is MRSA a particular problem in hospitals?",
      "It spreads easily between patients and is hard to treat", ["It only affects healthy visitors", "Hospitals use no antibiotics", "It is a virus that antibiotics cure"], "Many patients are already weak."),
    M('common errors', "A student writes: 'The bacteria become immune to the antibiotic.' What word should be used?",
      "Resistant", ["Immune", "Vaccinated", "Allergic"], "Immunity is about antibodies; bacteria become resistant."),
    M('common errors', "A student writes: 'The antibiotic causes the mutation.' What is correct?",
      "The mutation is random and happens before the antibiotic is used", ["The antibiotic is the only cause of mutation", "Mutations never happen in bacteria", "The mutation happens in the patient's DNA"], "The antibiotic selects; it does not cause.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-PRAC-ASEPTIC-AGAR-PLATE-TEST */
  T('HBI-PRAC-ASEPTIC-AGAR-PLATE-TEST', 'Use aseptic technique to test antibacterial agents on agar', [
    M('purpose', "What is the purpose of aseptic technique?",
      "To stop unwanted microorganisms getting in and stop the culture escaping", ["To make the bacteria grow as fast as possible, so the results come sooner", "To kill all the bacteria in the culture", "To make the agar set more quickly"], "It protects the culture and the people."),
    M('loop', "How should an inoculating loop be sterilised?",
      "Heat it in a Bunsen flame until red hot, then let it cool", ["Wipe it with a clean tissue and then rinse it in tap water", "Rinse it in tap water", "Leave it on the bench overnight"], "Let it cool so it does not kill the bacteria being transferred."),
    M('lid', "Why should the lid of the Petri dish only be lifted a little and briefly?",
      "To reduce the chance of microorganisms from the air getting in", ["To stop the agar drying out and cracking during the investigation", "To keep the bacteria warm", "To let the antibiotic evaporate"], "Less exposure means less contamination."),
    F("correct option overstated ('cannot be opened')", M('tape', "Why is the lid taped on before incubation?",
      "So it does not come off by accident and let bacteria escape", ["So the agar does not melt", "So the bacteria grow faster in the warm, dark space inside the dish", "So the lid does not steam up"], "Do not seal it all the way round; just secure it.")),
    M('temperature', "Why are plates incubated at 25 °C or below in school?",
      "Harmful bacteria that grow at body temperature are less likely to grow", ["Bacteria cannot grow at all above 25 °C", "Agar melts above 25 °C", "Antibiotics only work at 25 °C"], "37 °C would favour human pathogens."),
    M('judging', "How can the effectiveness of an antibacterial agent be judged?",
      "Measure the clear zone around it; a larger zone means more effective", ["Count how many Petri dishes were used and how many bacteria were added", "Smell the dish after incubation", "Open the dish and touch the colonies"], "The clear zone shows where bacteria were killed or stopped."),
    { skill: 'clear zone', gen: function () {
      var vals = [rint(6, 14), rint(15, 24), rint(25, 34)].sort(function () { return Math.random() - 0.5; }), names = ['P', 'Q', 'R'];
      var best = vals.indexOf(Math.max.apply(null, vals)), d = vals;
      var rows = names.map(function (n, i) { return '<tr><td>' + n + '</td><td>' + vals[i] + '</td></tr>'; }).join('');
      return mq("Three antibacterial solutions, P, Q and R, were tested on agar. The table shows the diameter of the clear zone around each.<table class=\"mc-table\"><tr><th>Solution</th><th>Diameter of clear zone in mm</th></tr>" + rows + "</table>Which solution was most effective?",
        names[best], names.filter(function (n, i) { return i !== best; }), names[best] + " has the largest clear zone (" + vals[best] + " mm), so it killed or stopped the most bacteria.");
    } },
    { skill: 'area of clear zone', gen: function () {
      var dia = pick([10, 12, 14, 16, 18, 20, 22]), r = dia / 2, a = Math.round(3.14 * r * r);
      return nq("A clear zone has a diameter of " + dia + " mm. Use area = 3.14 × r² to calculate its area. Give your answer to the nearest whole number.", a, 'mm²',
        "Radius = " + dia + " ÷ 2 = " + r + " mm. Area = 3.14 × " + r + " × " + r + " = " + (3.14 * r * r).toFixed(2) + ", so " + a + " mm².", { tol: 1 });
    } },
    M('surface test', "To test a cleaner on a surface, what should be done after cleaning and waiting a set time?",
      "Wipe with a sterile swab, spread it on agar, incubate and count the colonies", ["Look at the surface to see if it is shiny", "Pour the cleaner onto agar and measure its pH", "Touch the surface and then touch the agar"], "Fewer colonies means a more effective cleaner."),
    M('MRSA test', "Bacteria grow right up to a methicillin disc with no clear zone. What does this suggest?",
      "The bacteria are resistant to methicillin, like MRSA", ["Methicillin kills these bacteria very well, even at low doses", "The agar has no bacteria on it", "The disc was not sterile"], "No clear zone means the antibiotic did not stop them."),
    M('control variables', "When comparing two disinfectants, which must be kept the same?",
      "The volume and concentration of each solution", ["The colour of each solution and the size of its bottle", "The name of each solution", "The price of each solution"], "Only the type of disinfectant should change."),
    M('common errors', "A student opens the dish after incubation to look closely at the colonies. Why is this unsafe?",
      "Bacteria, possibly harmful ones, could escape", ["The colonies would die at once", "The agar would melt", "The clear zones would disappear"], "Keep the dish closed and view through the lid.")
  ], { date: '2026-10-13', dropped: [] });
})();
