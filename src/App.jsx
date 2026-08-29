import { useState, useEffect, useRef } from "react";
import { ClerkProvider, SignIn, SignUp, useClerk, useUser, UserButton } from "@clerk/clerk-react";
import { createClient } from "@supabase/supabase-js";

const CLERK_KEY = "pk_test_c3BlY2lhbC10ZWFsLTg0NTIuY2xlcmsuYWNjb3VudHMuZGV2JA";
const supabase = createClient(
  "https://jeulrrupcqwhmghmhcnw.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpldWxycnVwY3F3aG1naG1oY253Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc5OTE0OTgsImV4cCI6MjEwMzU2NzQ5OH0.dpJv3tJROqqiYDmvl-6CFb6acA99yz3xSchS5vXSUQQ"
);

// ============================================================
// CAREER ENGINE
// ============================================================

const questions = [
  // SECTION 1 — INTERESTS
  { id: "S1_R01", section: 1, type: "slider", text: "I enjoy figuring out how things work.", weights: { R: 1.0, I: 0.25 } },
  { id: "S1_R02", section: 1, type: "slider", text: "I like building or fixing things.", weights: { R: 1.0 } },
  { id: "S1_R03", section: 1, type: "slider", text: "I would enjoy creating something that solves a real problem.", weights: { R: 0.75, I: 0.5 } },
  { id: "S1_R04", section: 1, type: "slider", text: "I like working with technology.", weights: { R: 0.75, I: 0.5 } },
  { id: "S1_R05", section: 1, type: "slider", text: "I would rather learn by doing something than only reading about it.", weights: { R: 1.0 } },
  { id: "S1_I01", section: 1, type: "slider", text: "I enjoy solving difficult problems.", weights: { I: 1.0 } },
  { id: "S1_I02", section: 1, type: "slider", text: "I get curious about how or why something works.", weights: { I: 1.0 } },
  { id: "S1_I03", section: 1, type: "slider", text: "I enjoy researching things I am interested in.", weights: { I: 1.0 } },
  { id: "S1_I04", section: 1, type: "slider", text: "I like finding answers to questions that don't have an obvious solution.", weights: { I: 1.0 } },
  { id: "S1_I05", section: 1, type: "slider", text: "I enjoy subjects that challenge me to think deeply.", weights: { I: 1.0 } },
  { id: "S1_A01", section: 1, type: "slider", text: "I enjoy creating things that other people can see or experience.", weights: { A: 1.0 } },
  { id: "S1_A02", section: 1, type: "slider", text: "I often think of different ways to solve the same problem.", weights: { A: 0.75, I: 0.5 } },
  { id: "S1_A03", section: 1, type: "slider", text: "I care about how something looks, feels, or is presented.", weights: { A: 1.0 } },
  { id: "S1_A04", section: 1, type: "slider", text: "I would enjoy turning an idea into something original.", weights: { A: 1.0 } },
  { id: "S1_S01", section: 1, type: "slider", text: "I feel good when I help someone solve a problem.", weights: { S: 1.0 } },
  { id: "S1_S02", section: 1, type: "slider", text: "I would enjoy teaching someone something I know.", weights: { S: 1.0 } },
  { id: "S1_S03", section: 1, type: "slider", text: "I care about making a positive difference in people's lives.", weights: { S: 1.0 } },
  { id: "S1_S04", section: 1, type: "slider", text: "I enjoy understanding why people think or act differently.", weights: { S: 1.0, I: 0.25 } },
  { id: "S1_E01", section: 1, type: "slider", text: "I enjoy taking charge when a group needs direction.", weights: { E: 1.0 } },
  { id: "S1_E02", section: 1, type: "slider", text: "I would like to start my own project, organization, or business.", weights: { E: 1.0 } },
  { id: "S1_E03", section: 1, type: "slider", text: "I enjoy convincing people to support an idea.", weights: { E: 1.0 } },
  { id: "S1_E04", section: 1, type: "slider", text: "I like turning an idea into something successful.", weights: { E: 1.0 } },
  { id: "S1_C01", section: 1, type: "slider", text: "I like organizing messy information.", weights: { C: 1.0 } },
  { id: "S1_C02", section: 1, type: "slider", text: "I enjoy making plans.", weights: { C: 1.0 } },
  { id: "S1_C03", section: 1, type: "slider", text: "I notice when a process could be improved.", weights: { C: 1.0, I: 0.25 } },
  { id: "S1_C04", section: 1, type: "slider", text: "I like knowing that things are accurate and organized.", weights: { C: 1.0 } },
  // SECTION 2 — EXPERIENCE
  { id: "S2_E01", section: 2, type: "choice", text: "Have you ever built something outside of a school assignment?", tags: ["building"] },
  { id: "S2_E02", section: 2, type: "choice", text: "Have you ever joined a club because you were genuinely interested in it?", tags: ["club"] },
  { id: "S2_E03", section: 2, type: "choice", text: "Have you ever led a group or project?", tags: ["leadership"] },
  { id: "S2_E04", section: 2, type: "choice", text: "Have you ever started your own project?", tags: ["project"] },
  { id: "S2_E05", section: 2, type: "choice", text: "Have you ever helped someone learn something?", tags: ["teaching"] },
  { id: "S2_E06", section: 2, type: "choice", text: "Have you ever volunteered?", tags: ["volunteering"] },
  { id: "S2_E07", section: 2, type: "choice", text: "Have you ever participated in a competition?", tags: ["competition"] },
  { id: "S2_E08", section: 2, type: "choice", text: "Have you ever shadowed someone at their job?", tags: ["shadowing"] },
  { id: "S2_E09", section: 2, type: "choice", text: "Have you ever talked to someone about their career?", tags: ["careerConversation"] },
  { id: "S2_E10", section: 2, type: "choice", text: "Have you ever taken an online course just because you were interested?", tags: ["selfLearning"] },
  { id: "S2_E11", section: 2, type: "choice", text: "Have you ever made money from something you created or did?", tags: ["earning"] },
  // SECTION 3 — PREFERENCES
  { id: "S3_P01", section: 3, type: "slider", text: "I would be comfortable spending several years learning or training for a career.", weights: { growth: 1.0 } },
  { id: "S3_P02", section: 3, type: "slider", text: "Having a high salary is important to me.", weights: { income: 1.0 } },
  { id: "S3_P03", section: 3, type: "slider", text: "Having free time outside of work is important to me.", weights: { balance: 1.0 } },
  { id: "S3_P04", section: 3, type: "slider", text: "I would rather have a stable career than take big risks for greater rewards.", weights: { stability: 1.0 } },
  { id: "S3_P05", section: 3, type: "slider", text: "I would enjoy working with people every day.", weights: { social: 1.0 } },
  { id: "S3_P06", section: 3, type: "slider", text: "I would enjoy spending a large amount of time solving problems independently.", weights: { independence: 1.0 } },
  { id: "S3_P07", section: 3, type: "slider", text: "I want my work to make a noticeable difference in people's lives.", weights: { impact: 1.0 } },
  // SECTION 4 — REALITY
  { id: "S4_R01", section: 4, type: "slider", text: "I would be okay with a job where I sometimes work long hours.", weights: { longHours: 1.0 } },
  { id: "S4_R02", section: 4, type: "slider", text: "I would be comfortable speaking in front of groups.", weights: { publicSpeaking: 1.0 } },
  { id: "S4_R03", section: 4, type: "slider", text: "I would enjoy sitting at a computer for several hours a day.", weights: { computer: 1.0 } },
  { id: "S4_R04", section: 4, type: "slider", text: "I would be comfortable making important decisions under pressure.", weights: { pressure: 1.0 } },
  { id: "S4_R05", section: 4, type: "slider", text: "I would enjoy working with the same type of problem repeatedly and becoming an expert.", weights: { specialization: 1.0 } },
  { id: "S4_R06", section: 4, type: "slider", text: "I would rather have a predictable routine than a job where every day is different.", weights: { routine: 1.0 } },
  // SECTION 5 — EXPLORATION
  { id: "S5_T01", section: 5, type: "choice", text: "Would you try designing a robot to complete a challenge?", tags: ["robotics"] },
  { id: "S5_T02", section: 5, type: "choice", text: "Would you try helping diagnose why something isn't working?", tags: ["diagnosis"] },
  { id: "S5_T03", section: 5, type: "choice", text: "Would you try creating an app that solves a problem?", tags: ["appDevelopment"] },
  { id: "S5_T04", section: 5, type: "choice", text: "Would you try teaching younger students?", tags: ["teaching"] },
  { id: "S5_T05", section: 5, type: "choice", text: "Would you try running a business for a month?", tags: ["business"] },
  { id: "S5_T06", section: 5, type: "choice", text: "Would you try designing a social media campaign?", tags: ["marketing"] },
  { id: "S5_T07", section: 5, type: "choice", text: "Would you try analyzing evidence to solve a mystery?", tags: ["investigation"] },
  { id: "S5_T08", section: 5, type: "choice", text: "Would you try interviewing someone about their life?", tags: ["interviewing"] },
  { id: "S5_T09", section: 5, type: "choice", text: "Would you try designing a building?", tags: ["architecture"] },
  { id: "S5_T10", section: 5, type: "choice", text: "Would you try conducting a science experiment?", tags: ["science"] },
  { id: "S5_T11", section: 5, type: "choice", text: "Would you try organizing an event for hundreds of people?", tags: ["event"] },
];

const careers = [
  { id: "mechanical-engineer", name: "Mechanical Engineer", description: "Designs, develops, tests, and improves machines, products, and mechanical systems.", interests: { R:90,I:85,A:55,S:35,E:55,C:65 }, workStyle: { independence:70,structure:65,social:45,risk:40 }, values: { income:75,impact:65,balance:60,stability:70,freedom:55,creativity:65,growth:80,leadership:55,discovery:75 }, reality: { computer:75,specialization:75,pressure:60,longHours:45,routine:45 } },
  { id: "software-engineer", name: "Software Engineer", description: "Designs, builds, tests, and maintains software systems and applications.", interests: { R:55,I:95,A:65,S:40,E:55,C:65 }, workStyle: { independence:80,structure:55,social:45,risk:55 }, values: { income:85,impact:60,balance:65,stability:70,freedom:75,creativity:70,growth:90,leadership:50,discovery:90 }, reality: { computer:95,specialization:85,pressure:55,longHours:45,routine:40 } },
  { id: "doctor", name: "Physician", description: "Diagnoses and treats patients and helps manage their health.", interests: { R:35,I:95,A:30,S:90,E:55,C:65 }, workStyle: { independence:60,structure:70,social:90,risk:35 }, values: { income:85,impact:95,balance:35,stability:90,freedom:45,creativity:40,growth:90,leadership:70,discovery:85 }, reality: { computer:55,specialization:90,pressure:95,longHours:90,routine:35 } },
  { id: "entrepreneur", name: "Entrepreneur", description: "Creates and develops businesses, products, or services.", interests: { R:45,I:60,A:70,S:70,E:100,C:45 }, workStyle: { independence:95,structure:25,social:75,risk:95 }, values: { income:90,impact:70,balance:35,stability:20,freedom:100,creativity:90,growth:100,leadership:100,discovery:80 }, reality: { computer:60,specialization:45,pressure:90,longHours:85,routine:15 } },
  { id: "psychologist", name: "Psychologist", description: "Studies behavior and mental processes and helps people understand and address problems.", interests: { R:15,I:85,A:50,S:100,E:45,C:45 }, workStyle: { independence:65,structure:55,social:90,risk:30 }, values: { income:65,impact:100,balance:60,stability:70,freedom:65,creativity:55,growth:85,leadership:40,discovery:90 }, reality: { computer:45,specialization:80,pressure:70,longHours:45,routine:45 } },
  { id: "marketing-manager", name: "Marketing Manager", description: "Develops strategies to promote products, services, organizations, or brands.", interests: { R:15,I:50,A:90,S:75,E:95,C:55 }, workStyle: { independence:65,structure:40,social:85,risk:65 }, values: { income:80,impact:65,balance:55,stability:55,freedom:65,creativity:95,growth:90,leadership:90,discovery:70 }, reality: { computer:75,specialization:50,pressure:75,longHours:60,routine:25 } },
  { id: "data-scientist", name: "Data Scientist", description: "Uses data, statistics, and analytical methods to solve problems and discover insights.", interests: { R:25,I:100,A:45,S:35,E:45,C:80 }, workStyle: { independence:80,structure:65,social:40,risk:40 }, values: { income:85,impact:65,balance:65,stability:75,freedom:70,creativity:50,growth:95,leadership:40,discovery:100 }, reality: { computer:95,specialization:90,pressure:50,longHours:40,routine:40 } },
  { id: "teacher", name: "Teacher", description: "Educates students, develops learning experiences, and helps students grow.", interests: { R:15,I:55,A:55,S:100,E:60,C:55 }, workStyle: { independence:55,structure:70,social:100,risk:20 }, values: { income:50,impact:100,balance:55,stability:80,freedom:50,creativity:70,growth:80,leadership:65,discovery:65 }, reality: { computer:40,specialization:55,pressure:75,longHours:55,routine:65 } },
  { id: "architect", name: "Architect", description: "Designs buildings and spaces balancing creativity, engineering, and practical requirements.", interests: { R:80,I:60,A:100,S:40,E:50,C:70 }, workStyle: { independence:75,structure:55,social:55,risk:40 }, values: { income:70,impact:70,balance:50,stability:65,freedom:70,creativity:100,growth:80,leadership:55,discovery:70 }, reality: { computer:85,specialization:80,pressure:75,longHours:70,routine:30 } },
];

const personalityNames = {
  RIA:"The Engineering Creator",RIE:"The Technical Innovator",RIS:"The Practical Problem Solver",RIC:"The Systems Builder",REI:"The Technical Leader",
  IRE:"The Technical Strategist",IER:"The Technical Innovator",IAE:"The Innovative Creator",IAS:"The Creative Researcher",ISA:"The Human-Centered Investigator",ISE:"The Impact Strategist",IRC:"The Analytical Engineer",
  ARI:"The Creative Builder",AIE:"The Innovative Entrepreneur",ASE:"The Creative Leader",AIS:"The Human-Centered Creator",AER:"The Creative Entrepreneur",AIC:"The Design Strategist",
  SIA:"The Insightful Helper",SIE:"The Impact Strategist",SEA:"The Community Builder",SAI:"The Human-Centered Creator",SEI:"The Strategic Helper",
  EIA:"The Innovative Leader",EIS:"The Strategic Leader",EAS:"The Creative Leader",ERI:"The Technical Entrepreneur",ESA:"The People-Centered Entrepreneur",ECS:"The Organized Leader",
  CIS:"The Analytical Organizer",CIE:"The Systems Strategist",CES:"The Organizational Leader",CIR:"The Systems Builder",CRE:"The Operations Strategist",CSE:"The People Systems Leader"
};

function clamp(v, min=0, max=100) { return Math.max(min, Math.min(max, v)); }
function avg(vals) { return vals.length === 0 ? 0 : vals.reduce((s,v)=>s+v,0)/vals.length; }
function normalize(weighted, max) { return max<=0?0:Math.round(clamp((weighted/max)*100)); }

function calcRiasec(answers) {
  const totals={R:0,I:0,A:0,S:0,E:0,C:0}, maxes={R:0,I:0,A:0,S:0,E:0,C:0};
  for (const q of questions) {
    if (q.section!==1||q.type!=="slider"||!q.weights) continue;
    const a = answers[q.id];
    if (typeof a!=="number") continue;
    for (const [t,w] of Object.entries(q.weights)) {
      if (!["R","I","A","S","E","C"].includes(t)) continue;
      totals[t]+=clamp(a)*Math.abs(w); maxes[t]+=100*Math.abs(w);
    }
  }
  return { R:normalize(totals.R,maxes.R),I:normalize(totals.I,maxes.I),A:normalize(totals.A,maxes.A),S:normalize(totals.S,maxes.S),E:normalize(totals.E,maxes.E),C:normalize(totals.C,maxes.C) };
}

function sliderAvg(answers, ids, invert=false) {
  const vals = ids.map(id=>answers[id]).filter(v=>typeof v==="number").map(v=>invert?100-v:v);
  return Math.round(avg(vals));
}

function calcWorkStyle(answers) {
  return {
    independence: sliderAvg(answers,["S3_P06"]),
    social: sliderAvg(answers,["S3_P05"]),
    risk: sliderAvg(answers,["S3_P04"],true),
    structure: sliderAvg(answers,["S4_R06"],true),
  };
}

function calcValues(answers) {
  return {
    income: sliderAvg(answers,["S3_P02"]),
    impact: sliderAvg(answers,["S3_P07"]),
    balance: sliderAvg(answers,["S3_P03"]),
    stability: sliderAvg(answers,["S3_P04"]),
    freedom: sliderAvg(answers,["S3_P06"]),
    creativity: sliderAvg(answers,["S1_A01","S1_A02","S1_A03","S1_A04"]),
    growth: sliderAvg(answers,["S3_P01"]),
    leadership: sliderAvg(answers,["S1_E01","S1_E02","S1_E03","S1_E04"]),
    discovery: sliderAvg(answers,["S1_I01","S1_I02","S1_I03","S1_I04","S1_I05"]),
  };
}

function topThreeRiasec(scores) {
  return Object.entries(scores).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([c])=>c).join("");
}

function similarity(user, target) {
  const keys = Object.keys(target);
  if (!keys.length) return 0;
  const diff = keys.reduce((s,k)=>s+Math.abs((user[k]??50)-(target[k]??50)),0);
  return clamp(100-(diff/keys.length));
}

function matchCareers(riasec, workStyle, values) {
  return careers.map(c => {
    const iScore = similarity(riasec, c.interests);
    const wScore = similarity(workStyle, c.workStyle);
    const vScore = similarity(values, c.values);
    const score = Math.round(iScore*0.5+wScore*0.3+vScore*0.2);
    const reasons = [];
    if (iScore>=80) reasons.push("Your interests strongly align with this career.");
    else if (iScore>=65) reasons.push("Your interests have several connections to this career.");
    if (wScore>=80) reasons.push("The work style is highly compatible with your preferences.");
    if (vScore>=80) reasons.push("This career aligns strongly with what you value in work.");
    return { id:c.id, name:c.name, description:c.description, score, reasons };
  }).sort((a,b)=>b.score-a.score);
}

function calculatePersonality(answers) {
  const riasec = calcRiasec(answers);
  const workStyle = calcWorkStyle(answers);
  const values = calcValues(answers);
  const top3 = topThreeRiasec(riasec);
  const personalityName = personalityNames[top3] ?? `The ${top3} Explorer`;
  const topValues = Object.entries(values).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([k])=>k);
  const careerMatches = matchCareers(riasec, workStyle, values);
  return { code:top3, name:personalityName, riasec, workStyle, values, topValues, careerMatches };
}

// ============================================================
// SECTION METADATA
// ============================================================
const SECTION_LABELS = ["Interests","Experience","Preferences","Career Reality","Exploration"];
const SECTION_DESCS = [
  "Rate how much each statement applies to you.",
  "Tell us about your past experiences.",
  "What matters to you in a career?",
  "How do you feel about real-world job realities?",
  "Would you try any of these activities?",
];

// ============================================================
// COMPONENTS
// ============================================================

function useInView(threshold=0.15) {
  const ref=useRef(null); const [inView,setInView]=useState(false);
  useEffect(()=>{
    const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting)setInView(true);},{threshold});
    if(ref.current)obs.observe(ref.current);
    return()=>obs.disconnect();
  },[]);
  return[ref,inView];
}

function FeatureRow({f,i}) {
  const[ref,inView]=useInView();
  return(
    <div ref={ref} style={{display:"grid",gridTemplateColumns:"80px 1fr 1fr",gap:40,padding:"52px 0",borderBottom:"1px solid #141414",opacity:inView?1:0,transform:inView?"translateX(0)":"translateX(-30px)",transition:`all 0.7s cubic-bezier(.4,0,.2,1) ${i*0.15}s`}}>
      <div style={{fontWeight:800,fontSize:14,color:"#333",paddingTop:6}}>{f.num}</div>
      <div>
        <div style={{color:"#FF6B35",fontSize:13,marginBottom:8}}>{f.sub}</div>
        <h3 style={{fontWeight:700,fontSize:30,letterSpacing:-0.8,marginBottom:16}}>{f.title}</h3>
        <p style={{color:"#666",lineHeight:1.7,fontSize:15,maxWidth:420}}>{f.desc}</p>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:10,justifyContent:"center"}}>
        {f.tags.map(t=>(
          <div key={t} style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:20,height:1,background:"#FF6B35"}}/>
            <span style={{color:"#555",fontSize:14}}>{t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TeamCard({name,role,desc}) {
  const[hovered,setHovered]=useState(false);
  return(
    <div onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)}
      style={{flex:1,background:"#0d0d0d",border:`1px solid ${hovered?"#FF6B35":"#191919"}`,borderRadius:16,padding:"24px 20px",textAlign:"center",transition:"all 0.3s ease",cursor:"pointer"}}>
      <div style={{width:52,height:52,borderRadius:"50%",background:"#1a1a1a",border:"1px solid #333",margin:"0 auto 14px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>👤</div>
      <div style={{fontWeight:600,fontSize:15,marginBottom:4}}>{name}</div>
      <div style={{color:"#555",fontSize:13,marginBottom:hovered?12:0,transition:"margin 0.3s"}}>{role}</div>
      <div style={{overflow:"hidden",maxHeight:hovered?"80px":"0px",opacity:hovered?1:0,transition:"all 0.3s ease"}}>
        <p style={{color:"#666",fontSize:13,lineHeight:1.6}}>{desc}</p>
      </div>
    </div>
  );
}

// ── Quiz ──────────────────────────────────────────────────────

function QuizFlow({ onComplete }) {
  const sectionQuestions = [1,2,3,4,5].map(s=>questions.filter(q=>q.section===s));
  const [section, setSection] = useState(0);
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [sliderVal, setSliderVal] = useState(50);
  const [animDir, setAnimDir] = useState(1);
  const [visible, setVisible] = useState(true);

  const currentQ = sectionQuestions[section][qIndex];
  const totalSections = 5;
  const totalInSection = sectionQuestions[section].length;
  const overallTotal = questions.length;
  const overallDone = [0,1,2,3,4].slice(0,section).reduce((s,i)=>s+sectionQuestions[i].length,0)+qIndex;
  const progress = Math.round((overallDone/overallTotal)*100);

  function transition(fn) {
    setVisible(false);
    setTimeout(()=>{ fn(); setVisible(true); }, 250);
  }

  function answer(val) {
    const newAnswers = {...answers, [currentQ.id]: val};
    setAnswers(newAnswers);
    if (currentQ.type==="slider") setSliderVal(50);
    transition(()=>{
      if (qIndex < totalInSection-1) { setAnimDir(1); setQIndex(q=>q+1); }
      else if (section < totalSections-1) { setAnimDir(1); setSection(s=>s+1); setQIndex(0); }
      else { onComplete(newAnswers); }
    });
  }

  function goBack() {
    transition(()=>{
      setAnimDir(-1);
      if (qIndex>0) setQIndex(q=>q-1);
      else if (section>0) { setSection(s=>s-1); setQIndex(sectionQuestions[section-1].length-1); }
    });
  }

  const prevId = qIndex>0 ? sectionQuestions[section][qIndex-1]?.id : section>0 ? sectionQuestions[section-1][sectionQuestions[section-1].length-1]?.id : null;
  const canBack = prevId && answers[prevId] !== undefined || qIndex>0 || section>0;

  return (
    <div style={{maxWidth:680,margin:"0 auto",padding:"0 0 40px"}}>
      {/* Progress */}
      <div style={{marginBottom:36}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <span style={{color:"#FF6B35",fontSize:11,letterSpacing:2,textTransform:"uppercase"}}>Section {section+1} of 5 — {SECTION_LABELS[section]}</span>
          <span style={{color:"#444",fontSize:13}}>{progress}% complete</span>
        </div>
        <div style={{height:3,background:"#1a1a1a",borderRadius:999}}>
          <div style={{height:"100%",background:"#FF6B35",borderRadius:999,width:`${progress}%`,transition:"width 0.4s ease"}}/>
        </div>
        <p style={{color:"#444",fontSize:13,marginTop:10}}>{SECTION_DESCS[section]}</p>
      </div>

      {/* Question card */}
      <div style={{opacity:visible?1:0,transform:visible?"translateY(0)":"translateY(16px)",transition:"all 0.25s ease"}}>
        <div style={{background:"#111",border:"1px solid #1e1e1e",borderRadius:24,padding:"36px 32px",marginBottom:24}}>
          <div style={{color:"#444",fontSize:12,marginBottom:16}}>Q{qIndex+1} of {totalInSection}</div>
          <p style={{fontSize:20,fontWeight:600,lineHeight:1.5,marginBottom:32,color:"#fff"}}>{currentQ.text}</p>

          {currentQ.type==="slider" ? (
            <div>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}>
                <span style={{color:"#555",fontSize:13}}>Strongly disagree</span>
                <span style={{color:"#FF6B35",fontSize:15,fontWeight:700}}>{sliderVal}</span>
                <span style={{color:"#555",fontSize:13}}>Strongly agree</span>
              </div>
              <input type="range" min={0} max={100} value={sliderVal}
                onChange={e=>setSliderVal(Number(e.target.value))}
                style={{width:"100%",accentColor:"#FF6B35",cursor:"pointer",height:6}}/>
              <div style={{display:"flex",justifyContent:"center",marginTop:24}}>
                <button onClick={()=>answer(sliderVal)}
                  style={{background:"#FF6B35",color:"#fff",border:"none",borderRadius:999,padding:"13px 40px",fontSize:15,fontWeight:600,cursor:"pointer",transition:"all 0.2s"}}>
                  Next →
                </button>
              </div>
            </div>
          ) : (
            <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
              {(currentQ.section===5?["yes","no","maybe"]:["yes","no"]).map(opt=>(
                <button key={opt} onClick={()=>answer(opt)}
                  style={{flex:1,minWidth:100,background:"#0d0d0d",border:"1px solid #2a2a2a",color:"#ccc",borderRadius:14,padding:"14px 20px",fontSize:15,fontWeight:500,cursor:"pointer",textTransform:"capitalize",transition:"all 0.2s"}}>
                  {opt==="yes"?"✅ Yes":opt==="no"?"❌ No":"🤔 Maybe"}
                </button>
              ))}
            </div>
          )}
        </div>

        {(section>0||qIndex>0) && (
          <button onClick={goBack} style={{background:"transparent",color:"#555",border:"1px solid #222",borderRadius:999,padding:"8px 20px",fontSize:13,cursor:"pointer"}}>← Back</button>
        )}
      </div>
    </div>
  );
}

// ── Results ───────────────────────────────────────────────────

function RatingRing({value,size=96,strokeWidth=6}) {
  const r=(size/2)-strokeWidth, circ=2*Math.PI*r, dash=(value/100)*circ;
  return(
    <div style={{position:"relative",width:size,height:size}}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{transform:"rotate(-90deg)"}}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#2a2a2a" strokeWidth={strokeWidth}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#FF6B35" strokeWidth={strokeWidth} strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" style={{transition:"stroke-dasharray 1.2s cubic-bezier(.4,0,.2,1)"}}/>
      </svg>
      <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column"}}>
        <span style={{fontSize:size*0.22,fontWeight:800,color:"#fff"}}>{value}</span>
        <span style={{fontSize:size*0.1,color:"#888",letterSpacing:1}}>/100</span>
      </div>
    </div>
  );
}

function ResultsView({ result, onRetake, onChat }) {
  const [ref, inView] = useInView(0.05);
  const top3 = result.careerMatches.slice(0,3);
  const riasecLabels = {R:"Realistic",I:"Investigative",A:"Artistic",S:"Social",E:"Enterprising",C:"Conventional"};
  const valueLabels = {income:"Income",impact:"Impact",balance:"Balance",stability:"Stability",freedom:"Freedom",creativity:"Creativity",growth:"Growth",leadership:"Leadership",discovery:"Discovery"};

  return(
    <div ref={ref} style={{maxWidth:780,margin:"0 auto",opacity:inView?1:0,transform:inView?"translateY(0)":"translateY(30px)",transition:"all 0.7s ease"}}>
      {/* Header */}
      <div style={{textAlign:"center",marginBottom:40}}>
        <div style={{display:"inline-block",background:"#FF6B3522",border:"1px solid #FF6B3566",borderRadius:999,padding:"6px 20px",marginBottom:16}}>
          <span style={{color:"#FF6B35",fontWeight:700,fontSize:13,letterSpacing:1}}>{result.code}</span>
        </div>
        <h2 style={{fontWeight:800,fontSize:"clamp(28px,4vw,48px)",letterSpacing:-2,marginBottom:8}}>{result.name}</h2>
        <p style={{color:"#555",fontSize:15}}>Top values: {result.topValues.map(v=>valueLabels[v]).join(" · ")}</p>
      </div>

      {/* RIASEC bars */}
      <div style={{background:"#111",border:"1px solid #1e1e1e",borderRadius:20,padding:28,marginBottom:20}}>
        <div style={{color:"#FF6B35",fontSize:11,letterSpacing:2,textTransform:"uppercase",marginBottom:16}}>Interest Profile</div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {Object.entries(result.riasec).map(([code,score])=>(
            <div key={code} style={{display:"flex",alignItems:"center",gap:12}}>
              <span style={{color:"#666",fontSize:13,width:90,flexShrink:0}}>{riasecLabels[code]}</span>
              <div style={{flex:1,height:6,background:"#1a1a1a",borderRadius:999}}>
                <div style={{height:"100%",background:"#FF6B35",borderRadius:999,width:`${score}%`,transition:"width 1s ease"}}/>
              </div>
              <span style={{color:"#555",fontSize:13,width:36,textAlign:"right"}}>{score}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Career matches */}
      <div style={{color:"#FF6B35",fontSize:11,letterSpacing:2,textTransform:"uppercase",marginBottom:16}}>Top Career Matches</div>
      <div style={{display:"flex",flexDirection:"column",gap:16,marginBottom:24}}>
        {top3.map((c,i)=>(
          <div key={c.id} style={{background:"#111",border:"1px solid #1e1e1e",borderRadius:20,padding:24,display:"flex",gap:20,alignItems:"flex-start"}}>
            <div style={{flexShrink:0}}>
              <RatingRing value={c.score} size={72} strokeWidth={5}/>
            </div>
            <div style={{flex:1}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
                <span style={{fontWeight:700,fontSize:18}}>{c.name}</span>
                {i===0&&<span style={{background:"#FF6B3522",color:"#FF6B35",fontSize:11,fontWeight:700,borderRadius:999,padding:"2px 10px"}}>Best Match</span>}
              </div>
              <p style={{color:"#666",fontSize:13,lineHeight:1.6,marginBottom:10}}>{c.description}</p>
              {c.reasons.map((r,j)=>(
                <div key={j} style={{display:"flex",alignItems:"flex-start",gap:8,marginBottom:4}}>
                  <div style={{width:5,height:5,borderRadius:"50%",background:"#FF6B35",flexShrink:0,marginTop:5}}/>
                  <span style={{color:"#888",fontSize:13}}>{r}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
        <button onClick={onRetake} style={{background:"transparent",color:"#555",border:"1px solid #222",borderRadius:999,padding:"12px 28px",fontSize:14,cursor:"pointer"}}>← Retake Quiz</button>
        <button onClick={onChat} style={{background:"#FF6B35",color:"#fff",border:"none",borderRadius:999,padding:"12px 28px",fontSize:14,fontWeight:600,cursor:"pointer"}}>Talk to Aria about your results →</button>
      </div>
    </div>
  );
}

// ── Aria Chat ─────────────────────────────────────────────────

function TalkToUs({ onBack, initialContext }) {
  const greeting = initialContext
    ? `Hi! I'm Aria 👋 I can see you got **${initialContext.name}** (${initialContext.code}) with top careers in ${initialContext.topCareers}. What would you like to explore?`
    : "Hi! I'm Aria, your Pathways career counselor 👋 What Career Pathway did you get from the quiz?";

  const [messages, setMessages] = useState([{ role:"assistant", text:greeting }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(()=>{ bottomRef.current?.scrollIntoView({behavior:"smooth"}); },[messages,loading]);

  const send = async () => {
    const text = input.trim();
    if (!text||loading) return;
    setInput("");
    const newMessages = [...messages, {role:"user",text}];
    setMessages(newMessages);
    setLoading(true);
    try {
      const res = await fetch("https://pathways-backend-production.up.railway.app/api/chat", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          messages: newMessages.map(m=>({role:m.role,content:m.text})),
          pathway: initialContext?.code ?? null,
          personalityName: initialContext?.name ?? null,
          topCareers: initialContext?.topCareers ?? null,
          topValues: initialContext?.topValues ?? null,
        })
      });
      const data = await res.json();
      const reply = data.reply||"Sorry, something went wrong. Try again!";
      setMessages(prev=>[...prev,{role:"assistant",text:reply}]);
    } catch {
      setMessages(prev=>[...prev,{role:"assistant",text:"Hmm, something went wrong. Give it another try!"}]);
    }
    setLoading(false);
  };

  const onKey = e => { if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();} };

  return(
    <div style={{background:"#0a0a0a",minHeight:"100vh",fontFamily:"system-ui,sans-serif",color:"#fff",display:"flex",flexDirection:"column"}}>
      <nav style={{padding:"0 5%",height:68,display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:"1px solid #1a1a1a",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:28,height:28,borderRadius:8,background:"#FF6B35",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1L13 7L7 13M1 7H13" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <span style={{fontWeight:800,fontSize:18}}>Pathways</span>
        </div>
        <button onClick={onBack} style={{background:"transparent",color:"#888",border:"1px solid #222",borderRadius:999,padding:"8px 20px",fontSize:14,cursor:"pointer"}}>← Back to Home</button>
      </nav>
      <div style={{padding:"24px 5% 20px",borderBottom:"1px solid #111",flexShrink:0}}>
        <div style={{maxWidth:720,margin:"0 auto",display:"flex",alignItems:"center",gap:16}}>
          <div style={{width:48,height:48,borderRadius:"50%",background:"linear-gradient(135deg,#FF6B35,#ff9a6c)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>✨</div>
          <div>
            <div style={{fontWeight:700,fontSize:18}}>Aria <span style={{color:"#FF6B35",fontSize:12,fontWeight:500,background:"#FF6B3522",border:"1px solid #FF6B3544",borderRadius:999,padding:"2px 10px",marginLeft:6}}>AI Counselor</span></div>
            <div style={{color:"#555",fontSize:13,marginTop:2}}>Ask me anything about careers, internships, or your future path.</div>
          </div>
          <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:6}}>
            <div style={{width:7,height:7,borderRadius:"50%",background:"#4ade80"}}/>
            <span style={{color:"#555",fontSize:12}}>Online</span>
          </div>
        </div>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"28px 5%"}}>
        <div style={{maxWidth:720,margin:"0 auto",display:"flex",flexDirection:"column",gap:20}}>
          {messages.map((m,i)=>(
            <div key={i} style={{display:"flex",gap:12,flexDirection:m.role==="user"?"row-reverse":"row",alignItems:"flex-end"}}>
              {m.role==="assistant"&&<div style={{width:32,height:32,borderRadius:"50%",background:"linear-gradient(135deg,#FF6B35,#ff9a6c)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>✨</div>}
              <div style={{maxWidth:"75%",background:m.role==="user"?"#FF6B35":"#111",border:m.role==="user"?"none":"1px solid #1e1e1e",borderRadius:m.role==="user"?"18px 18px 4px 18px":"18px 18px 18px 4px",padding:"12px 16px",fontSize:14,lineHeight:1.6,color:"#fff",whiteSpace:"pre-wrap"}}>{m.text}</div>
            </div>
          ))}
          {loading&&(
            <div style={{display:"flex",gap:12,alignItems:"flex-end"}}>
              <div style={{width:32,height:32,borderRadius:"50%",background:"linear-gradient(135deg,#FF6B35,#ff9a6c)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>✨</div>
              <div style={{background:"#111",border:"1px solid #1e1e1e",borderRadius:"18px 18px 18px 4px",padding:"14px 18px",display:"flex",gap:5}}>
                {[0,1,2].map(i=><div key={i} style={{width:7,height:7,borderRadius:"50%",background:"#FF6B35",animation:`pulse 1.2s ease-in-out ${i*0.2}s infinite`}}/>)}
              </div>
            </div>
          )}
          <div ref={bottomRef}/>
        </div>
      </div>
      <div style={{padding:"16px 5% 24px",borderTop:"1px solid #111",flexShrink:0}}>
        <div style={{maxWidth:720,margin:"0 auto",display:"flex",gap:10,alignItems:"flex-end"}}>
          <textarea value={input} onChange={e=>setInput(e.target.value)} onKeyDown={onKey} placeholder="Ask Aria anything..." rows={1}
            style={{flex:1,background:"#0d0d0d",border:"1px solid #222",borderRadius:14,padding:"13px 16px",color:"#fff",fontSize:14,outline:"none",resize:"none",fontFamily:"system-ui,sans-serif",lineHeight:1.5}}/>
          <button onClick={send} disabled={!input.trim()||loading}
            style={{background:input.trim()&&!loading?"#FF6B35":"#1a1a1a",color:input.trim()&&!loading?"#fff":"#444",border:"none",borderRadius:12,width:46,height:46,fontSize:18,cursor:input.trim()&&!loading?"pointer":"default",transition:"all 0.2s",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>→</button>
        </div>
        <div style={{maxWidth:720,margin:"8px auto 0",color:"#333",fontSize:12,textAlign:"center"}}>Press Enter to send · Shift+Enter for new line</div>
      </div>
    </div>
  );
}

function OurStory({onBack}) {
  return(
    <div style={{background:"#0a0a0a",minHeight:"100vh",fontFamily:"system-ui,sans-serif",color:"#fff"}}>
      <nav style={{padding:"0 5%",height:68,display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:"1px solid #1a1a1a"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:28,height:28,borderRadius:8,background:"#FF6B35",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1L13 7L7 13M1 7H13" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <span style={{fontWeight:800,fontSize:18}}>Pathways</span>
        </div>
        <button onClick={onBack} style={{background:"transparent",color:"#888",border:"1px solid #222",borderRadius:999,padding:"8px 20px",fontSize:14,cursor:"pointer"}}>← Back to Home</button>
      </nav>
      <section style={{padding:"80px 5% 60px",maxWidth:900,margin:"0 auto"}}>
        <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"#141414",border:"1px solid #222",borderRadius:999,padding:"6px 16px",marginBottom:28}}>
          <div style={{width:6,height:6,borderRadius:"50%",background:"#FF6B35"}}/>
          <span style={{color:"#888",fontSize:13}}>Who we are</span>
        </div>
        <h1 style={{fontWeight:800,fontSize:"clamp(48px,7vw,86px)",lineHeight:1.0,letterSpacing:-3,marginBottom:24}}>Built by students,<br/>for <span style={{color:"#FF6B35"}}>students.</span></h1>
        <p style={{color:"#666",fontSize:18,lineHeight:1.8,maxWidth:580,fontWeight:300}}>We got tired of watching our peers pick careers based on salary charts and parental pressure — with no real sense of what their future actually looked like day-to-day. So we built Pathways.</p>
      </section>
      <section style={{padding:"20px 5% 80px",maxWidth:900,margin:"0 auto"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginBottom:48}}>
          {[{year:"2023",title:"The Problem",desc:"We watched our peers pick majors based on salary charts and parental pressure — with no real sense of what the day-to-day looked like.",icon:"🔍"},{year:"2024",title:"The Idea",desc:"We started building a simple quiz. It turned into a full platform — matching interests to careers, internships, and real field experiences.",icon:"💡"},{year:"2025",title:"First Students",desc:"We launched a beta with 200 students across 12 schools. 97% said they found clearer direction within a single session.",icon:"🚀"},{year:"2026",title:"Today",desc:"Pathways is growing. We're expanding our internship network, adding AI-powered guidance, and partnering with schools nationwide.",icon:"🌍"}].map(item=>(
            <div key={item.year} style={{background:"#0d0d0d",border:"1px solid #191919",borderRadius:20,padding:"32px 28px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
                <div style={{color:"#FF6B35",fontSize:12,letterSpacing:2,textTransform:"uppercase"}}>{item.year}</div>
                <span style={{fontSize:22}}>{item.icon}</span>
              </div>
              <h3 style={{fontWeight:700,fontSize:22,marginBottom:12}}>{item.title}</h3>
              <p style={{color:"#555",fontSize:14,lineHeight:1.8}}>{item.desc}</p>
            </div>
          ))}
        </div>
        <div style={{background:"#FF6B35",borderRadius:24,padding:"40px 44px",display:"flex",gap:28,alignItems:"center",marginBottom:48}}>
          <div style={{fontSize:40,flexShrink:0}}>🎯</div>
          <div>
            <div style={{fontWeight:800,fontSize:22,marginBottom:10}}>Our Mission</div>
            <p style={{color:"rgba(255,255,255,0.8)",fontSize:15,lineHeight:1.7}}>Every student deserves to explore their future before committing to it. Pathways exists to make that possible — regardless of background, school, or zip code.</p>
          </div>
        </div>
        <div>
          <div style={{color:"#FF6B35",fontSize:11,letterSpacing:3,textTransform:"uppercase",marginBottom:20}}>The Team</div>
          <div style={{display:"flex",gap:16}}>
            {[{name:"Coming Soon",role:"Founder",desc:"Placeholder description for the Founder."},{name:"Coming Soon",role:"Co-Founder",desc:"Placeholder description for the Co-Founder."}].map(p=>(
              <TeamCard key={p.role} {...p}/>
            ))}
          </div>
        </div>
      </section>
      <footer style={{borderTop:"1px solid #111",padding:"32px 5%",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span style={{fontWeight:700,fontSize:15}}>Pathways</span>
        <span style={{color:"#333",fontSize:13}}>Helping the next generation find their direction.</span>
      </footer>
    </div>
  );
}

// ── Home / Main ───────────────────────────────────────────────

function AuthPage({ mode }) {
  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 40 }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: "#FF6B35", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1L13 7L7 13M1 7H13" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <span style={{ fontWeight: 800, fontSize: 20, color: "#fff" }}>Pathways</span>
      </div>
      {mode === "sign-in" ? <SignIn routing="hash" /> : <SignUp routing="hash" />}
    </div>
  );
}

function AppContent() {
  const { isSignedIn, isLoaded } = useUser();
  const [authMode, setAuthMode] = useState(null);

  if (!isLoaded) return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: "#FF6B35", fontSize: 16 }}>Loading...</div>
    </div>
  );

  if (authMode === "sign-in") return <AuthPage mode="sign-in" />;
  if (authMode === "sign-up") return <AuthPage mode="sign-up" />;

  return <Pathways isSignedIn={isSignedIn} onSignIn={() => setAuthMode("sign-in")} onSignUp={() => setAuthMode("sign-up")} />;
}

export default function App() {
  return (
    <ClerkProvider publishableKey={CLERK_KEY}>
      <AppContent />
    </ClerkProvider>
  );
}

function Pathways({ isSignedIn, onSignIn, onSignUp }) {
  const [page, setPage] = useState("home");
  const [quizStep, setQuizStep] = useState("intro"); // intro | quiz | result
  const [result, setResult] = useState(null);
  const [ariaContext, setAriaContext] = useState(null);
  const [scrollY, setScrollY] = useState(0);
  const [featRef, featInView] = useInView(0.1);

  useEffect(()=>{
    const onScroll=()=>setScrollY(window.scrollY);
    window.addEventListener("scroll",onScroll);
    return()=>window.removeEventListener("scroll",onScroll);
  },[]);

  if (page==="ourstory") return <OurStory onBack={()=>setPage("home")}/>;
  if (page==="talktous") return <TalkToUs onBack={()=>setPage("home")} initialContext={ariaContext}/>;

  const scrollTo = id => document.getElementById(id)?.scrollIntoView({behavior:"smooth"});

  async function handleQuizComplete(answers) {
    const r = calculatePersonality(answers);
    setResult(r);
    setQuizStep("result");
    // Save to Supabase if logged in
    if (isSignedIn) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        const userId = user?.id ?? "anonymous";
        await supabase.from("quiz_results").insert({
          user_id: userId,
          personality_code: r.code,
          personality_name: r.name,
          riasec: r.riasec,
          top_values: r.topValues,
          career_matches: r.careerMatches.slice(0, 3),
        });
      } catch (e) {
        console.error("Failed to save quiz results:", e);
      }
    }
  }

  function handleChatFromResult() {
    if (result) {
      setAriaContext({
        name: result.name,
        code: result.code,
        topCareers: result.careerMatches.slice(0,3).map(c=>c.name).join(", "),
        topValues: result.topValues.join(", "),
      });
    }
    setPage("talktous");
  }

  const stats = [{num:"2,400+",label:"Internship Opportunities"},{num:"97%",label:"Find Clearer Direction"},{num:"180+",label:"Career Paths Mapped"}];
  const features = [
    {num:"01",title:"Career Discovery",sub:"Know yourself first.",desc:"We analyze your interests, work style, and values to map genuine career paths — not just the ones that pay well, but ones you'll actually want to show up for.",tags:["Interest mapping","Personality fit","Real-world alignment"]},
    {num:"02",title:"Internship Matching",sub:"Connections, made for you.",desc:"Stop cold-emailing into the void. We connect you with local businesses and known programs sorted by your pathway, proximity, acceptance rate, and fit score.",tags:["Local + remote options","Application guides","Fit rating"]},
    {num:"03",title:"Live the Day",sub:"Before you commit.",desc:"Most students choose careers based on salary and parents' advice — without ever seeing a normal Tuesday. We simulate and connect you to real job shadow experiences.",tags:["Job shadowing","Day-in-life previews","Field experiences"]},
  ];

  return(
    <div style={{background:"#0a0a0a",minHeight:"100vh",fontFamily:"system-ui,sans-serif",color:"#fff",overflowX:"hidden"}}>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:4px;}::-webkit-scrollbar-track{background:#0a0a0a;}::-webkit-scrollbar-thumb{background:#FF6B35;border-radius:4px;}
        .nav-link:hover{color:#FF6B35!important;}
        .cta-btn:hover{background:#e05a28!important;transform:translateY(-1px);}
        input[type=range]{-webkit-appearance:none;appearance:none;background:transparent;}
        input[type=range]::-webkit-slider-runnable-track{height:6px;background:#2a2a2a;border-radius:999px;}
        input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:20px;height:20px;border-radius:50%;background:#FF6B35;margin-top:-7px;cursor:pointer;}
        @keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.4;}}
      `}</style>

      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:100,padding:"0 5%",background:scrollY>40?"rgba(10,10,10,0.92)":"transparent",backdropFilter:scrollY>40?"blur(16px)":"none",borderBottom:scrollY>40?"1px solid #1a1a1a":"none",transition:"all 0.4s ease",display:"flex",alignItems:"center",justifyContent:"space-between",height:68}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:28,height:28,borderRadius:8,background:"#FF6B35",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1L13 7L7 13M1 7H13" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <span style={{fontWeight:800,fontSize:18,letterSpacing:-0.5}}>Pathways</span>
        </div>
        <div style={{display:"flex",gap:32,alignItems:"center"}}>
          {["How It Works","Our Story","Want Help?"].map(l=>(
            <a key={l} className="nav-link" href="#" onClick={e=>{e.preventDefault();l==="Our Story"?setPage("ourstory"):l==="Want Help?"?setPage("talktous"):scrollTo(l==="How It Works"?"howitworks":"quiz");}}
              style={{color:"#888",fontSize:14,textDecoration:"none",transition:"color 0.2s",cursor:"pointer"}}>{l}</a>
          ))}
          <button className="cta-btn" onClick={()=>scrollTo("quiz")} style={{background:"#FF6B35",color:"#fff",border:"none",borderRadius:999,padding:"9px 22px",fontSize:14,fontWeight:600,cursor:"pointer",transition:"all 0.2s"}}>Try It →</button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{minHeight:"100vh",display:"flex",flexDirection:"column",justifyContent:"center",padding:"100px 5% 60px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:"20%",right:"5%",width:500,height:500,borderRadius:"50%",background:"radial-gradient(circle,rgba(255,107,53,0.08) 0%,transparent 70%)",pointerEvents:"none"}}/>
        <div style={{maxWidth:900}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"#141414",border:"1px solid #222",borderRadius:999,padding:"6px 16px",marginBottom:32}}>
            <div style={{width:6,height:6,borderRadius:"50%",background:"#FF6B35",animation:"pulse 2s infinite"}}/>
            <span style={{color:"#888",fontSize:13}}>Built for your generation, not your parents'</span>
          </div>
          <h1 style={{fontWeight:800,fontSize:"clamp(52px,8vw,96px)",lineHeight:1.0,letterSpacing:-3,marginBottom:28}}>Stop picking<br/><span style={{color:"#FF6B35"}}>careers</span><br/>in the dark.</h1>
          <p style={{color:"#888",fontSize:"clamp(16px,2vw,20px)",lineHeight:1.7,maxWidth:560,marginBottom:44,fontWeight:300}}>Most students choose their future based on salary or parent advice — without ever living a day in that field. Pathways changes that.</p>
          <button className="cta-btn" onClick={()=>scrollTo("quiz")} style={{background:"#FF6B35",color:"#fff",border:"none",borderRadius:999,padding:"15px 36px",fontSize:16,fontWeight:600,cursor:"pointer",transition:"all 0.2s"}}>Find My Path →</button>
        </div>
        <div style={{display:"flex",gap:0,marginTop:80,borderTop:"1px solid #1a1a1a",paddingTop:40,flexWrap:"wrap"}}>
          {stats.map((s,i)=>(
            <div key={s.label} style={{flex:1,minWidth:160,paddingRight:40,borderRight:i<stats.length-1?"1px solid #1a1a1a":"none",paddingLeft:i>0?40:0}}>
              <div style={{fontWeight:800,fontSize:36,letterSpacing:-1}}>{s.num}</div>
              <div style={{color:"#555",fontSize:13,marginTop:4}}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="howitworks" style={{padding:"100px 5%",borderTop:"1px solid #111"}}>
        <div ref={featRef} style={{opacity:featInView?1:0,transform:featInView?"translateY(0)":"translateY(30px)",transition:"all 0.8s ease",marginBottom:64}}>
          <div style={{color:"#FF6B35",fontSize:11,letterSpacing:3,textTransform:"uppercase",marginBottom:16}}>What We Do</div>
          <h2 style={{fontWeight:800,fontSize:"clamp(36px,5vw,60px)",letterSpacing:-2,lineHeight:1.1,maxWidth:700}}>Three tools.<br/>One clear direction.</h2>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:2}}>
          {features.map((f,i)=><FeatureRow key={f.num} f={f} i={i}/>)}
        </div>
      </section>

      {/* Quiz Section */}
      <section id="quiz" style={{padding:"100px 5%",background:"#050505"}}>
        <div style={{textAlign:"center",marginBottom:56}}>
          <div style={{color:"#FF6B35",fontSize:11,letterSpacing:3,textTransform:"uppercase",marginBottom:16}}>Try It Now</div>
          <h2 style={{fontWeight:800,fontSize:"clamp(32px,5vw,54px)",letterSpacing:-2}}>Discover your career personality.</h2>
          <p style={{color:"#555",marginTop:16,fontSize:15}}>A 5-section quiz that maps your real interests, values, and work style to the careers that fit you best.</p>
        </div>

        {quizStep==="intro" && (
          <div style={{maxWidth:560,margin:"0 auto",textAlign:"center"}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr 1fr",gap:8,marginBottom:32}}>
              {SECTION_LABELS.map((l,i)=>(
                <div key={l} style={{background:"#111",border:"1px solid #1e1e1e",borderRadius:12,padding:"12px 8px",textAlign:"center"}}>
                  <div style={{color:"#FF6B35",fontSize:11,fontWeight:700,marginBottom:4}}>{i+1}</div>
                  <div style={{color:"#666",fontSize:11}}>{l}</div>
                </div>
              ))}
            </div>
            <p style={{color:"#555",fontSize:14,marginBottom:28}}>~5 minutes · {questions.length} questions · Instant results</p>
            <button className="cta-btn" onClick={()=>setQuizStep("quiz")} style={{background:"#FF6B35",color:"#fff",border:"none",borderRadius:999,padding:"15px 40px",fontSize:16,fontWeight:600,cursor:"pointer",transition:"all 0.2s"}}>Start the Quiz →</button>
          </div>
        )}

        {quizStep==="quiz" && (
          <QuizFlow onComplete={handleQuizComplete}/>
        )}

        {quizStep==="result" && result && (
          <ResultsView result={result} onRetake={()=>{setQuizStep("intro");setResult(null);}} onChat={handleChatFromResult}/>
        )}
      </section>

      {/* Problem section */}
      <section style={{padding:"100px 5%"}}>
        <div style={{maxWidth:900,margin:"0 auto"}}>
          <div style={{color:"#FF6B35",fontSize:11,letterSpacing:3,textTransform:"uppercase",marginBottom:24}}>The Problem We're Solving</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            {[{label:"Pick classes for friends, not fit",icon:"👥"},{label:"Choose majors for salary alone",icon:"💰"},{label:"No idea what internships exist",icon:"🔍"},{label:"Never lived a day in their future field",icon:"📆"},{label:"Doing work, but losing curiosity",icon:"📉"},{label:"No one sees the middle group",icon:"🫥"}].map(p=>(
              <div key={p.label} style={{background:"#0d0d0d",border:"1px solid #191919",borderRadius:16,padding:"20px 24px",display:"flex",alignItems:"center",gap:16}}>
                <span style={{fontSize:22}}>{p.icon}</span>
                <span style={{color:"#666",fontSize:14,lineHeight:1.5}}>{p.label}</span>
              </div>
            ))}
          </div>
          <div style={{marginTop:40,padding:"32px 36px",background:"#FF6B35",borderRadius:20,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:20}}>
            <div>
              <div style={{fontWeight:800,fontSize:26,marginBottom:6}}>Pathways fixes all of this.</div>
              <div style={{color:"rgba(255,255,255,0.7)",fontSize:14}}>One platform. Built for students who want real answers.</div>
            </div>
            <button style={{background:"#fff",color:"#FF6B35",border:"none",borderRadius:999,padding:"13px 32px",fontSize:15,fontWeight:700,cursor:"pointer"}}>Join the Waitlist</button>
          </div>
        </div>
      </section>

      <footer style={{borderTop:"1px solid #111",padding:"40px 5%",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:16}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:24,height:24,borderRadius:6,background:"#FF6B35",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M7 1L13 7L7 13M1 7H13" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <span style={{fontWeight:700,fontSize:16}}>Pathways</span>
        </div>
        <span style={{color:"#333",fontSize:13}}>Helping the next generation find their direction.</span>
      </footer>
    </div>
  );
}