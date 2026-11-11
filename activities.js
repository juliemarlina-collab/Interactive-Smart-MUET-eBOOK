/* =====================================================================
   SMART MUET GUIDE · Interactive eBook · ACTIVITIES (edit me!)
   ---------------------------------------------------------------------
   One block per unit (chapter). Each unit has 4 activity types:
     mcq   : multiple choice          {q, options:[..], answer:index, why, say?}
     tf    : true / false             {q, answer:true|false, why}
     fill  : fill in the blank        {q:"text with ___", answers:[..], why}
     match : matching pairs           {title, pairs:[[left,right],...]}
   `end` = the page number where the unit ends (the checkpoint appears there).
   `say` (optional, on mcq) = text read aloud by the device voice.
   ===================================================================== */

window.BOOK_CONFIG = {
  title: "Smart MUET Guide · Band Up! 2027",
  totalPages: 53,
  pagePattern: "pages/p-{nn}.jpg",
  REQUIRE_COMPLETE: true,   // true  = readers must finish a unit's checkpoint before going on
                            // false = checkpoint is optional (they can skip)
  PASS_PERCENT: 0,          // 0 = finishing is enough. e.g. 60 = need 60% to unlock the next unit
  STORAGE_KEY: "smartMuetFlipbook.v1"
};

/* Media players placed on pages (x,y,w,h are % of the page). */
window.BOOK_MEDIA = [
  { page: 20, type: "tts", label: "🔊 Play dialogue", x: 65, y: 19.2, w: 28, h: 3.6,
    times: 2,
    lines: [
      ["Hana", "Are we still meeting on Tuesday morning for the study group?"],
      ["Ravi", "That was the plan, but the lab is booked then. Wednesday afternoon is free."],
      ["Hana", "Wednesday's no good for me. I've got a presentation. What about Thursday?"],
      ["Ravi", "Thursday afternoon works. Let's make it then."]
    ] }
  /* More examples (remove the comment marks to use):
  ,{ page: 19, type: "audio", label: "▶ Listen", x: 60, y: 10, w: 25, h: 3.5, src: "media/clue.mp3" }
  ,{ page: 25, type: "video", label: "▶ Watch", x: 60, y: 10, w: 25, h: 3.5, src: "media/speaking.mp4" }
  ,{ page: 25, type: "youtube", label: "▶ Watch", x: 60, y: 10, w: 25, h: 3.5, id: "955xJ2Jjh14" }
  */
];

window.BOOK_UNITS = [
/* ---------------------------------------------------------------- 1 */
{ id: 1, end: 10, from: 4, icon: "📘", color: "#3542E8", title: "Know your MUET",
  mcq: [
    { q: "Who sets and runs MUET?",
      options: ["Majlis Peperiksaan Malaysia (MPM)", "Your own university", "Each polytechnic", "A private language school"],
      answer: 0, why: "MUET is set and run by the Malaysian Examinations Council, Majlis Peperiksaan Malaysia (MPM)." },
    { q: "How long is a MUET result valid?",
      options: ["2 years", "3 years", "5 years", "10 years"],
      answer: 2, why: "A result is valid for five years from the date it is released." },
    { q: "Each of the four MUET papers is worth…",
      options: ["60 marks", "75 marks", "90 marks", "100 marks"],
      answer: 2, why: "Each paper is 90 marks, or 25% of your total (4 × 90 = 360)." },
    { q: "On the written day, in which order do you sit the papers?",
      options: ["Reading, Writing, Listening", "Listening, Reading, Writing", "Writing, Listening, Reading", "Speaking, Reading, Writing"],
      answer: 0, why: "Speaking is on its own day. On the written day: Reading, then Writing, then Listening." }
  ],
  tf: [
    { q: "Speaking is taken on a different day from the written papers.", answer: true,
      why: "Speaking is taken on its own day." },
    { q: "Your four paper scores add up to a total out of 360.", answer: true,
      why: "4 papers × 90 marks = 360." },
    { q: "You need an SPM result to register for MUET.", answer: false,
      why: "MPM sets no entry conditions: anyone can sit MUET." },
    { q: "Band 5.0 is CEFR level C1.", answer: true,
      why: "Band 5.0+ is C1 (B2 = Band 4.0–4.5, B1 = Band 3.0–3.5)." }
  ],
  fill: [
    { q: "Each MUET paper is worth ___ marks.", answers: ["90"], why: "Each paper = 90 marks." },
    { q: "Your MUET result stays valid for ___ years.", answers: ["5", "five"], why: "Valid for five years." },
    { q: "MUET results are reported on the ___ scale.", answers: ["CEFR"], why: "CEFR = Common European Framework of Reference for Languages." },
    { q: "The Reading and Writing papers each last ___ minutes.", answers: ["75"], why: "Reading and Writing are 75 minutes each." }
  ],
  match: { title: "Match each paper to its format",
    pairs: [["Listening", "5 parts · 30 questions"], ["Speaking", "2 parts · groups of 2–4"],
            ["Reading", "7 parts · 40 questions"], ["Writing", "2 tasks · 100+ and 250+ words"]] }
},
/* ---------------------------------------------------------------- 2 */
{ id: 2, end: 16, from: 11, icon: "🗓️", color: "#00A88E", title: "MUET admin (MPM portal)",
  mcq: [
    { q: "How much is the MUET fee for Malaysian citizens?",
      options: ["RM25", "RM150", "RM350", "RM500"],
      answer: 1, why: "RM150 for citizens and RM350 for non-citizens. (RM25 is the cost of changing details later.)" },
    { q: "Which MPM page shows your exam centre, Speaking date and session?",
      options: ["The MUET/D exam slip", "The MUETR result page", "The eSijil page", "The fees page"],
      answer: 0, why: "MUET/D is your exam slip. Bring it with your IC." },
    { q: "Which MUET option is computer-based and offered through the year?",
      options: ["A regular session", "MUET on Demand (MoD)", "A re-check", "A transfer of centre"],
      answer: 1, why: "MUET on Demand (MoD) is computer-based, with separate registration and result pages." },
    { q: "How many regular MUET sessions are there each year?",
      options: ["One", "Two", "Three", "Six"],
      answer: 2, why: "Regular sessions run three times a year." }
  ],
  tf: [
    { q: "Type every detail exactly as it appears on your IC or passport.", answer: true,
      why: "Check before you tap Next. Changing details later costs RM25." },
    { q: "Private candidates need a PIN MEC to choose an exam centre.", answer: false,
      why: "No PIN MEC is needed for private candidates." },
    { q: "MPM exam dates never change.", answer: false,
      why: "Dates may change. Always check the official announcements on the MPM portal." },
    { q: "If you do not finish paying in time, you may lose your centre seat.", answer: true,
      why: "Finish before the time shown, and keep your receipt." }
  ],
  fill: [
    { q: "Citizens pay RM___ to register for MUET.", answers: ["150"], why: "RM150 for citizens." },
    { q: "You print your exam slip from the ___ page.", answers: ["MUET/D", "MUETD", "MUET D"], why: "MUET/D shows your centre, Speaking date and session." },
    { q: "Changing your details after you submit costs RM___.", answers: ["25"], why: "RM25, so check carefully first." },
    { q: "You check your result on MPM's ___ page.", answers: ["MUETR"], why: "MUETR is the result page." }
  ],
  match: { title: "Match each task to the MPM service",
    pairs: [["Register and pay online", "muet.mpm.edu.my"], ["Print your exam slip", "MUET/D"],
            ["Check your result", "MUETR"], ["Get your certificate", "eSijil MUET"],
            ["Ask for a re-check", "Rayuan semak semula"]] }
},
/* ---------------------------------------------------------------- 3 */
{ id: 3, end: 23, from: 17, icon: "🎧", color: "#3542E8", title: "Listening · CLUE",
  mcq: [
    { q: "In CLUE, what does the C stand for?",
      options: ["Check", "Copy", "Choose", "Count"],
      answer: 0, why: "C = Check: read the question first and predict the answer type." },
    { q: "How many times is each Listening recording played?",
      options: ["Once", "Twice", "Three times", "As many times as you like"],
      answer: 1, why: "Each recording is played twice: answer on the first play, confirm on the second." },
    { q: "Listen to the dialogue. When will the study group meet?",
      say: [["Hana", "Are we still meeting on Tuesday morning?"], ["Ravi", "That was the plan, but the lab is booked then. Wednesday afternoon is free."],
            ["Hana", "Wednesday's no good for me. I've got a presentation. What about Thursday?"], ["Ravi", "Thursday afternoon works. Let's make it then."]],
      options: ["Tuesday morning", "Wednesday afternoon", "Thursday afternoon", "Friday morning"],
      answer: 2, why: "The final agreement is Thursday afternoon. Being mentioned is not the same as being chosen." },
    { q: "Listen. “I'd love to come, but I've got a test tomorrow.” The speaker is…",
      say: [["", "I'd love to come, but I've got a test tomorrow."]],
      options: ["accepting", "refusing politely", "asking a question", "changing the topic"],
      answer: 1, why: "“I'd love to… but…” is a polite refusal. The word “but” is the signpost." }
  ],
  tf: [
    { q: "Speakers often mention a wrong option first, then change their mind.", answer: true,
      why: "That is the word-match trap. Wait for the final decision." },
    { q: "You should always choose the first detail you hear.", answer: false,
      why: "Follow the final meaning, not the first word you hear." },
    { q: "Words like “actually”, “instead” and “but” usually come just before the real answer.", answer: true,
      why: "These signposts warn you that the speaker is changing or correcting something." },
    { q: "If an option is mentioned in the recording, it must be the answer.", answer: false,
      why: "Being mentioned is not the same as being chosen." }
  ],
  fill: [
    { q: "CLUE = Check, Listen, Understand and ___.", answers: ["Eliminate"], why: "E = Eliminate: reject each wrong option with a reason." },
    { q: "Follow the ___ decision, not the first word.", answers: ["final"], why: "The final decision is what counts." },
    { q: "Signpost words such as “however” and “instead” show ___.", answers: ["contrast"], why: "However, actually, but, instead = contrast." },
    { q: "The MUET Listening paper has ___ questions.", answers: ["30"], why: "5 parts · 30 questions · about 50 minutes." }
  ],
  match: { title: "Match each signpost word to its job",
    pairs: [["however", "Contrast"], ["moreover", "Adding"], ["for instance", "Example"],
            ["because", "Reason"], ["overall", "Conclusion"]] }
},
/* ---------------------------------------------------------------- 4 */
{ id: 4, end: 30, from: 24, icon: "🎤", color: "#00A88E", title: "Speaking · PREP",
  mcq: [
    { q: "PREP starts with…",
      options: ["An example", "Your point", "A question", "A reason"],
      answer: 1, why: "P = Point: answer the task in one clear sentence." },
    { q: "How long is the preparation time for Part 1?",
      options: ["1 minute", "2 minutes", "3 minutes", "5 minutes"],
      answer: 1, why: "Part 1 is 2 minutes to prepare and 2 minutes to speak." },
    { q: "Which phrase invites a partner to speak?",
      options: ["In conclusion…", "For example…", "What do you think about this, Aina?", "I disagree."],
      answer: 2, why: "Inviting others in is an important Part 2 skill." },
    { q: "Best Reason for “Join a club”:",
      options: ["Clubs are fun.", "You work with people who share your interests.", "My friend joined one.", "It looks good on a CV."],
      answer: 1, why: "A reason explains HOW the point works." }
  ],
  tf: [
    { q: "Write every sentence during preparation time, then read it out.", answer: false,
      why: "That is the script-reader freeze. Use keywords, not full sentences." },
    { q: "Your notes should be keywords, not full sentences.", answer: true,
      why: "Plan in 2 minutes with keywords." },
    { q: "Speaking is taken in groups, on its own day.", answer: true,
      why: "Part 1 is an individual presentation; Part 2 is a group discussion." },
    { q: "You should arrive 30 minutes early with your MUET/D slip and IC.", answer: true,
      why: "Be in the waiting room 30 minutes early." }
  ],
  fill: [
    { q: "PREP = Point, Reason, ___, Point again.", answers: ["Example"], why: "E = Example: give a real case (who, what, how)." },
    { q: "Be in the waiting room ___ minutes early.", answers: ["30", "thirty"], why: "30 minutes early, with your slip and IC." },
    { q: "Part 2 is a group ___ that uses a mind map.", answers: ["discussion"], why: "Listen and build on others' ideas." },
    { q: "In the group discussion, listen and ___ on others' ideas by name.", answers: ["build"], why: "Build on ideas: “That's a fair point, and I'd add that…”." }
  ],
  match: { title: "Match each Part 2 job to a useful phrase",
    pairs: [["Invite", "What do you think about this, Aina?"],
            ["Agree and add", "That's a fair point, and I'd add that…"],
            ["Disagree politely", "I see your point, but I'm not sure it would work because…"],
            ["Compare", "Could we compare how easy these ideas are to apply?"],
            ["Conclude", "So, would you all agree that our main recommendation is…?"]] }
},
/* ---------------------------------------------------------------- 5 */
{ id: 5, end: 37, from: 31, icon: "📖", color: "#FF751F", title: "Reading · SCAN",
  mcq: [
    { q: "In SCAN, what does the N stand for?",
      options: ["Note", "Name", "Nail", "Next"],
      answer: 2, why: "N = Nail: pick what the text supports and reject the rest." },
    { q: "How many questions are there in the MUET Reading paper?",
      options: ["30", "40", "50", "60"],
      answer: 1, why: "7 parts · 40 questions · 75 minutes." },
    { q: "An option is true in real life but is not stated in the text. Which trap is this?",
      options: ["The word-match trap", "The own-knowledge trap", "The too-far trap", "The paraphrase trap"],
      answer: 1, why: "Your own knowledge is not evidence. Use only what the text says." },
    { q: "In a gapped text, what should you check on both sides of each gap?",
      options: ["Pictures and titles", "Pronouns and linkers", "Page numbers", "The longest option"],
      answer: 1, why: "Check this/these/they and however/therefore before AND after the gap." }
  ],
  tf: [
    { q: "A familiar word in an option makes that option correct.", answer: false,
      why: "A familiar word does not make an option correct. Confirm the whole meaning." },
    { q: "Read the question first, then scan the text for its key words.", answer: true,
      why: "Question-first tip: underline the key words, then scan." },
    { q: "It is fine to leave an answer blank when you are not sure.", answer: false,
      why: "Never leave a blank. Choose the option the text supports best." },
    { q: "“Demand increased sharply” means about the same as “more people wanted to join”.", answer: true,
      why: "That is paraphrase: same idea, different words." }
  ],
  fill: [
    { q: "SCAN = Study, ___, Analyse, Nail.", answers: ["Circle"], why: "C = Circle the key meaning and words like only and not." },
    { q: "The Reading paper lasts ___ minutes.", answers: ["75"], why: "75 minutes: about 10 minutes per part plus 5 to check." },
    { q: "Read the sentence before AND ___ the gap.", answers: ["after"], why: "Meaning must fit on both sides of the gap." },
    { q: "A paraphrase is the same idea in different ___.", answers: ["words"], why: "Keep a small list of meaning pairs." }
  ],
  match: { title: "Word Detective: match each word to its meaning",
    pairs: [["in advance", "before a set time"], ["qualifier", "a small word that limits meaning (only, most)"],
            ["paraphrase", "same idea, different words"], ["relocate", "move to a new place"],
            ["evidence", "the words that prove an answer"], ["inference", "a conclusion the text supports"]] }
},
/* ---------------------------------------------------------------- 6 */
{ id: 6, end: 44, from: 38, icon: "✍️", color: "#C80DA0", title: "Writing · PEEL",
  mcq: [
    { q: "In this eBook, what does the second E in PEEL stand for?",
      options: ["Essay", "Example", "Ending", "Error"],
      answer: 1, why: "PEEL = Point, Explain, Example, Link." },
    { q: "Which sentence EXPLAINS why “Internships help”?",
      options: ["Internships are good.", "Students apply theory to real work.", "I like internships.", "Internships are popular."],
      answer: 1, why: "An explanation shows why or how the point is true." },
    { q: "Best opening for an email to a lecturer:",
      options: ["Hey sir!", "Dear Encik Rahman,", "Yo, got your message.", "Hi there"],
      answer: 1, why: "Match the reader: formal greeting for a lecturer." },
    { q: "What is the minimum length for Writing Task 2?",
      options: ["100 words", "200 words", "250 words", "400 words"],
      answer: 2, why: "Task 1: 100+ words. Task 2: 250+ words." }
  ],
  tf: [
    { q: "PEEL is a template you should use for Task 1 emails.", answer: false,
      why: "For Task 1, answer every note in a sensible order. PEEL is for Task 2 body paragraphs." },
    { q: "Task 1 needs at least 100 words.", answer: true, why: "Task 1: reply to an email or letter (100+ words)." },
    { q: "Plan for about 5 minutes first, and keep 3 minutes to check spelling and count words.", answer: true,
      why: "Plan 5 minutes; keep 3 minutes for checking." },
    { q: "Examiners mark task fulfilment, organisation, structure and lexis.", answer: true,
      why: "These are the four marking criteria." }
  ],
  fill: [
    { q: "PEEL = Point, Explain, ___, Link.", answers: ["Example"], why: "A specific case: who, what, how." },
    { q: "Writing Task 2 needs at least ___ words.", answers: ["250"], why: "An academic essay of 250+ words." },
    { q: "End a formal email to a lecturer with “Yours ___,”.", answers: ["sincerely"], why: "“Yours sincerely,” is formal." },
    { q: "The four criteria: task fulfilment, organisation, structure and ___.", answers: ["lexis"], why: "Lexis = precise vocabulary in the right register." }
  ],
  match: { title: "Match each marking criterion to what it checks",
    pairs: [["Task fulfilment", "Cover every note, answer the whole question"],
            ["Organisation", "Clear paragraphs and linkers in a logical order"],
            ["Structure", "Accurate grammar and a range of sentences"],
            ["Lexis", "Precise vocabulary in the right register"]] }
},
/* ---------------------------------------------------------------- 7 */
{ id: 7, end: 47, from: 45, icon: "🏆", color: "#FFB400", title: "Game Zone · Quiz Show",
  mcq: [
    { q: "How many times is each Listening recording played?",
      options: ["Once", "Twice", "Three times", "Four times"], answer: 1, why: "Twice." },
    { q: "How many questions are there in the MUET Reading paper?",
      options: ["30", "40", "50", "60"], answer: 1, why: "40 questions." },
    { q: "What should you check on both sides of each gap in a gapped text?",
      options: ["Pictures and titles", "Pronouns and linkers", "Page numbers", "Paragraph length"], answer: 1, why: "Pronouns and linkers." },
    { q: "Which sign-off suits a formal email to a director?",
      options: ["See ya!", "Yours sincerely,", "Take care,", "Cheers"], answer: 1, why: "“Yours sincerely,” is formal." }
  ],
  tf: [
    { q: "The Quiz Show has eight questions, two from every paper.", answer: true, why: "Two from Listening, Speaking, Reading and Writing." },
    { q: "You score one star for each correct answer.", answer: true, why: "One star per correct answer." },
    { q: "Each Listening recording is played only once.", answer: false, why: "Each recording is played twice." },
    { q: "Writing Task 2 needs at least 250 words.", answer: true, why: "250+ words." }
  ],
  fill: [
    { q: "Collect ___ stars to become Quiz Show Champion.", answers: ["8", "eight"], why: "8 stars = Champion." },
    { q: "The Quiz Show has two questions from every ___.", answers: ["paper"], why: "Four papers × 2 = 8 questions." },
    { q: "6–7 stars makes you a Rising ___.", answers: ["Star"], why: "6–7 stars: Rising Star." },
    { q: "Writing Task 1 needs 100+ words and Task 2 needs ___+ words.", answers: ["250"], why: "250+ words for the essay." }
  ],
  match: { title: "Match each paper to its technique",
    pairs: [["Listening", "CLUE"], ["Speaking", "PREP"], ["Reading", "SCAN"], ["Writing", "PEEL"]] }
},
/* ---------------------------------------------------------------- 8 */
{ id: 8, end: 53, from: 48, icon: "🎓", color: "#17151E", title: "Review & next steps",
  mcq: [
    { q: "Which technique goes with the Speaking paper?",
      options: ["CLUE", "PREP", "SCAN", "PEEL"], answer: 1, why: "PREP: Point, Reason, Example, Point again." },
    { q: "The four paper scores add up to a total out of…",
      options: ["100", "300", "360", "400"], answer: 2, why: "4 × 90 = 360." },
    { q: "Which MPM page gives your exam slip?",
      options: ["MUETR", "MUET/D", "eSijil", "Fees"], answer: 1, why: "MUET/D = exam slip." },
    { q: "How long is a MUET result valid?",
      options: ["1 year", "3 years", "5 years", "10 years"], answer: 2, why: "Five years from release." }
  ],
  tf: [
    { q: "SCAN is the technique for the Reading paper.", answer: true, why: "SCAN: Study, Circle, Analyse, Nail." },
    { q: "CLUE is the technique for the Writing paper.", answer: false, why: "CLUE is for Listening. Writing uses PEEL." },
    { q: "MPM dates may change, so check the portal before you plan.", answer: true, why: "Always check official announcements." },
    { q: "Part 1 of Speaking is a 2-minute individual presentation.", answer: true, why: "Part 2 is a group discussion." }
  ],
  fill: [
    { q: "CLUE, PREP, SCAN and ___ are the four techniques.", answers: ["PEEL"], why: "PEEL for Writing." },
    { q: "Band 5.0 is CEFR level ___.", answers: ["C1"], why: "Band 5.0+ = C1." },
    { q: "Writing Task 2 needs at least ___ words.", answers: ["250"], why: "Task 2: 250+ words." },
    { q: "Each MUET paper is worth ___ marks.", answers: ["90"], why: "90 marks each." }
  ],
  match: { title: "Match each score range to its CEFR level",
    pairs: [["Band 3.0–3.5", "B1"], ["Band 4.0–4.5", "B2"], ["Band 5.0 and above", "C1"],
            ["Total score out of", "360"], ["Result validity", "5 years"]] }
}
];
