import { useState, useEffect, useRef } from "react";
import { ClerkProvider, SignIn, SignUp, useUser, UserButton, useAuth } from "@clerk/clerk-react";
import { createClient } from "@supabase/supabase-js";

const CLERK_KEY = "pk_test_c3BlY2lhbC10ZWFsLTg0NTIuY2xlcmsuYWNjb3VudHMuZGV2JA";
const supabase = createClient(
  "https://jeulrrupcqwhmghmhcnw.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpldWxycnVwY3F3aG1naG1oY253Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc5OTE0OTgsImV4cCI6MjEwMzU2NzQ5OH0.dpJv3tJROqqiYDmvl-6CFb6acA99yz3xSchS5vXSUQQ"
);

// ============================================================
// PATHWAYS CAREER DATABASE
// ============================================================
const CAREERS = [
  { id:"career_software_engineer",name:"Software Engineer",fields:["Technology","Computer Science"],description:"Designs, builds, and maintains software systems and applications.",riasec:{R:55,I:95,A:65,S:40,E:55,C:65},reality:{academicDifficulty:75,competition:70,workPressure:60,computerTime:95,teamwork:65,independentWork:80,routine:40,creativity:70},workEnvironment:{handsOn:30,peopleInteraction:45,computerBased:95,remotePotential:90},skills:["Programming","Problem-Solving","System Design","Collaboration"],education:{common:["Computer Science degree","Coding bootcamp"],alternative:["Self-taught","Online certifications"]},explorationActivities:["Build a simple app or website","Learn Python or JavaScript online","Contribute to an open source project","Create a project to solve a daily problem"],relatedCareers:["career_data_scientist","career_cybersecurity_analyst","career_ux_designer"],tags:["tech","coding","remote-friendly","high-salary"] },
  { id:"career_data_scientist",name:"Data Scientist",fields:["Technology","Mathematics"],description:"Uses statistics, programming, and analytics to extract insights from data.",riasec:{R:25,I:100,A:45,S:35,E:45,C:80},reality:{academicDifficulty:85,competition:75,workPressure:55,computerTime:95,teamwork:55,independentWork:85,routine:40,creativity:55},workEnvironment:{handsOn:20,peopleInteraction:40,computerBased:95,remotePotential:85},skills:["Statistics","Python/R","Data Visualization","Machine Learning"],education:{common:["Statistics or CS degree","Data Science bootcamp"],alternative:["Self-taught with portfolio","Online certifications"]},explorationActivities:["Analyze a dataset using Excel","Take a free statistics course","Explore Kaggle beginner datasets","Build a simple chart from real data"],relatedCareers:["career_software_engineer","career_research_scientist","career_financial_analyst"],tags:["tech","math","research","high-salary"] },
  { id:"career_physician",name:"Physician",fields:["Healthcare","Medicine"],description:"Diagnoses and treats patients, helping manage their overall health.",riasec:{R:35,I:95,A:30,S:90,E:55,C:65},reality:{academicDifficulty:95,competition:85,workPressure:95,computerTime:55,teamwork:80,independentWork:60,routine:35,creativity:45},workEnvironment:{handsOn:75,peopleInteraction:95,computerBased:45,remotePotential:15},skills:["Clinical Diagnosis","Patient Care","Communication","Decision Making"],education:{common:["Medical degree (MD/DO)","Residency program"],alternative:[]},explorationActivities:["Shadow a doctor","Volunteer at a clinic","Take a first aid course","Interview a physician"],relatedCareers:["career_nurse","career_biomedical_researcher","career_psychologist"],tags:["healthcare","helping","high-salary","long-training"] },
  { id:"career_ux_designer",name:"UX Designer",fields:["Technology","Design"],description:"Designs user interfaces and experiences for apps, websites, and digital products.",riasec:{R:40,I:65,A:95,S:65,E:55,C:55},reality:{academicDifficulty:60,competition:70,workPressure:65,computerTime:90,teamwork:70,independentWork:70,routine:30,creativity:95},workEnvironment:{handsOn:30,peopleInteraction:65,computerBased:90,remotePotential:85},skills:["Figma","User Research","Prototyping","Visual Design"],education:{common:["Design degree","UX bootcamp"],alternative:["Self-taught with portfolio","Online certifications"]},explorationActivities:["Download Figma and design an app screen","Analyze the UX of an app you use","Take a free UX course","Interview 3 people about an app"],relatedCareers:["career_software_engineer","career_graphic_designer","career_marketing_manager"],tags:["creative","tech","design","remote-friendly"] },
  { id:"career_mechanical_engineer",name:"Mechanical Engineer",fields:["Engineering","Manufacturing"],description:"Designs, develops, and tests mechanical systems and products.",riasec:{R:90,I:85,A:55,S:35,E:55,C:65},reality:{academicDifficulty:80,competition:60,workPressure:65,computerTime:70,teamwork:65,independentWork:70,routine:45,creativity:70},workEnvironment:{handsOn:80,peopleInteraction:50,computerBased:65,remotePotential:40},skills:["CAD Software","Physics","Problem-Solving","Materials Science"],education:{common:["Mechanical Engineering degree"],alternative:["Technical certifications","Community college pathway"]},explorationActivities:["Build something with basic materials","Take a free CAD course","Join a robotics club","Shadow an engineer"],relatedCareers:["career_civil_engineer","career_robotics_engineer","career_software_engineer"],tags:["engineering","hands-on","building","stable"] },
  { id:"career_psychologist",name:"Psychologist",fields:["Healthcare","Social Sciences"],description:"Studies human behavior and mental processes and helps people address challenges.",riasec:{R:15,I:85,A:50,S:100,E:45,C:45},reality:{academicDifficulty:80,competition:65,workPressure:70,computerTime:45,teamwork:55,independentWork:70,routine:45,creativity:55},workEnvironment:{handsOn:25,peopleInteraction:90,computerBased:40,remotePotential:60},skills:["Active Listening","Research","Empathy","Assessment"],education:{common:["Psychology degree","Doctoral program"],alternative:["Counseling degree","Social work pathway"]},explorationActivities:["Read intro psychology","Take a free psych course","Volunteer at a mental health event","Interview a counselor"],relatedCareers:["career_social_worker","career_physician","career_teacher"],tags:["helping","research","social","graduate-degree"] },
  { id:"career_entrepreneur",name:"Entrepreneur",fields:["Business","Leadership"],description:"Creates and grows businesses, products, or services from the ground up.",riasec:{R:45,I:60,A:70,S:70,E:100,C:45},reality:{academicDifficulty:55,competition:90,workPressure:90,computerTime:60,teamwork:70,independentWork:90,routine:10,creativity:90},workEnvironment:{handsOn:50,peopleInteraction:75,computerBased:60,remotePotential:70},skills:["Leadership","Sales","Product Development","Resilience"],education:{common:["Business degree","No formal requirement"],alternative:["Self-taught","Accelerators and bootcamps"]},explorationActivities:["Start a small side hustle","Read about a founder you admire","Enter a business competition","Develop a business plan"],relatedCareers:["career_marketing_manager","career_software_engineer","career_financial_analyst"],tags:["leadership","business","risk","freedom"] },
  { id:"career_teacher",name:"Teacher",fields:["Education","Social Sciences"],description:"Educates students, develops curriculum, and fosters learning and growth.",riasec:{R:15,I:55,A:55,S:100,E:60,C:55},reality:{academicDifficulty:60,competition:40,workPressure:75,computerTime:40,teamwork:75,independentWork:55,routine:65,creativity:70},workEnvironment:{handsOn:50,peopleInteraction:100,computerBased:35,remotePotential:40},skills:["Communication","Patience","Curriculum Design","Leadership"],education:{common:["Education degree","Teaching credential"],alternative:["Alternative certification","Charter school pathways"]},explorationActivities:["Tutor a younger student","Volunteer at a school","Teach a skill to a friend","Create a short lesson"],relatedCareers:["career_psychologist","career_social_worker","career_curriculum_designer"],tags:["helping","social","stable","impact"] },
  { id:"career_environmental_scientist",name:"Environmental Scientist",fields:["Science","Environment"],description:"Studies the environment and develops solutions to environmental problems.",riasec:{R:70,I:85,A:45,S:60,E:50,C:60},reality:{academicDifficulty:70,competition:60,workPressure:55,computerTime:60,teamwork:65,independentWork:70,routine:40,creativity:60},workEnvironment:{handsOn:75,peopleInteraction:55,computerBased:55,remotePotential:35},skills:["Field Research","Data Analysis","Environmental Policy","Lab Skills"],education:{common:["Environmental Science degree","Biology degree"],alternative:["GIS certifications","Ecology programs"]},explorationActivities:["Volunteer for an environmental cleanup","Monitor local air/water quality","Research an environmental challenge","Join an environmental club"],relatedCareers:["career_research_scientist","career_civil_engineer","career_biomedical_researcher"],tags:["science","environment","impact","outdoor"] },
  { id:"career_marketing_manager",name:"Marketing Manager",fields:["Business","Communications"],description:"Develops strategies to promote products, services, and brands.",riasec:{R:15,I:50,A:90,S:75,E:95,C:55},reality:{academicDifficulty:60,competition:70,workPressure:75,computerTime:70,teamwork:80,independentWork:60,routine:25,creativity:90},workEnvironment:{handsOn:25,peopleInteraction:80,computerBased:70,remotePotential:70},skills:["Strategy","Creative Thinking","Analytics","Communication"],education:{common:["Marketing degree","Communications degree"],alternative:["Digital marketing certifications","Portfolio-based hiring"]},explorationActivities:["Create a campaign for a cause you care about","Analyze a brand strategy","Run a school event promotion","Take a Google marketing course"],relatedCareers:["career_entrepreneur","career_ux_designer","career_journalist"],tags:["business","creative","leadership","social"] },
  { id:"career_attorney",name:"Attorney",fields:["Law","Policy"],description:"Represents clients in legal matters, provides legal advice, and argues cases.",riasec:{R:20,I:80,A:55,S:70,E:90,C:65},reality:{academicDifficulty:85,competition:80,workPressure:85,computerTime:70,teamwork:60,independentWork:70,routine:30,creativity:60},workEnvironment:{handsOn:25,peopleInteraction:85,computerBased:65,remotePotential:50},skills:["Legal Research","Writing","Argumentation","Client Relations"],education:{common:["Law degree (JD)","Bar exam"],alternative:[]},explorationActivities:["Attend a mock trial","Watch a real court case","Read about a famous legal case","Volunteer with legal aid"],relatedCareers:["career_policy_analyst","career_journalist","career_entrepreneur"],tags:["law","leadership","high-salary","long-training"] },
  { id:"career_biomedical_researcher",name:"Biomedical Researcher",fields:["Science","Healthcare"],description:"Conducts research to advance medicine and develop new treatments.",riasec:{R:50,I:100,A:40,S:55,E:40,C:65},reality:{academicDifficulty:90,competition:85,workPressure:65,computerTime:70,teamwork:65,independentWork:80,routine:40,creativity:65},workEnvironment:{handsOn:75,peopleInteraction:50,computerBased:65,remotePotential:30},skills:["Lab Techniques","Data Analysis","Scientific Writing","Critical Thinking"],education:{common:["Biology/Chemistry degree","PhD or MD program"],alternative:["Research technician pathway"]},explorationActivities:["Apply for a summer research program","Read a scientific paper","Shadow a researcher","Enter a science fair"],relatedCareers:["career_physician","career_research_scientist","career_data_scientist"],tags:["science","research","healthcare","graduate-degree"] },
  { id:"career_financial_analyst",name:"Financial Analyst",fields:["Business","Finance"],description:"Analyzes financial data to guide investment decisions and business strategy.",riasec:{R:20,I:85,A:35,S:40,E:70,C:90},reality:{academicDifficulty:75,competition:75,workPressure:80,computerTime:85,teamwork:55,independentWork:75,routine:55,creativity:40},workEnvironment:{handsOn:15,peopleInteraction:55,computerBased:90,remotePotential:65},skills:["Financial Modeling","Excel","Valuation","Communication"],education:{common:["Finance or Economics degree","CFA certification"],alternative:["Accounting pathway","Business analytics"]},explorationActivities:["Track a stock portfolio simulator","Read a personal finance book","Analyze a company's financials","Take a free finance course"],relatedCareers:["career_data_scientist","career_entrepreneur","career_economist"],tags:["business","math","high-salary","analytical"] },
  { id:"career_cybersecurity_analyst",name:"Cybersecurity Analyst",fields:["Technology","Computer Science"],description:"Protects computer systems and networks from digital threats and attacks.",riasec:{R:60,I:90,A:40,S:35,E:45,C:80},reality:{academicDifficulty:75,competition:70,workPressure:75,computerTime:90,teamwork:55,independentWork:80,routine:40,creativity:55},workEnvironment:{handsOn:50,peopleInteraction:40,computerBased:90,remotePotential:80},skills:["Network Security","Ethical Hacking","Risk Assessment","Problem-Solving"],education:{common:["Cybersecurity or CS degree","Security certifications"],alternative:["Self-taught with certs","Bootcamps"]},explorationActivities:["Try TryHackMe or Hack The Box","Learn about phishing attacks","Take a free cybersecurity course","Research a famous cyberattack"],relatedCareers:["career_software_engineer","career_data_scientist","career_robotics_engineer"],tags:["tech","security","high-salary","remote-friendly"] },
  { id:"career_social_worker",name:"Social Worker",fields:["Social Sciences","Healthcare"],description:"Helps individuals and families navigate challenges and access support services.",riasec:{R:15,I:55,A:40,S:100,E:55,C:50},reality:{academicDifficulty:65,competition:40,workPressure:80,computerTime:40,teamwork:80,independentWork:60,routine:40,creativity:45},workEnvironment:{handsOn:40,peopleInteraction:100,computerBased:35,remotePotential:35},skills:["Empathy","Case Management","Communication","Crisis Intervention"],education:{common:["Social Work degree (BSW/MSW)"],alternative:["Psychology degree","Community college pathway"]},explorationActivities:["Volunteer at a community center","Shadow a social worker","Research social issues locally","Interview someone in social services"],relatedCareers:["career_psychologist","career_teacher","career_nurse"],tags:["helping","impact","social","community"] },
  { id:"career_policy_analyst",name:"Policy Analyst",fields:["Policy","Government"],description:"Researches and evaluates policies to help governments make better decisions.",riasec:{R:15,I:85,A:50,S:65,E:70,C:70},reality:{academicDifficulty:75,competition:65,workPressure:65,computerTime:75,teamwork:65,independentWork:75,routine:40,creativity:55},workEnvironment:{handsOn:20,peopleInteraction:60,computerBased:75,remotePotential:65},skills:["Research","Data Analysis","Writing","Policy Evaluation"],education:{common:["Political Science degree","Public Policy degree"],alternative:["Economics degree","Law pathway"]},explorationActivities:["Research a local policy issue","Write an opinion piece","Attend a city council meeting","Intern with a government office"],relatedCareers:["career_attorney","career_journalist","career_social_worker"],tags:["policy","research","impact","government"] },
  { id:"career_robotics_engineer",name:"Robotics Engineer",fields:["Engineering","Technology"],description:"Designs and builds robotic systems for manufacturing, medicine, exploration, and more.",riasec:{R:90,I:90,A:60,S:35,E:50,C:65},reality:{academicDifficulty:85,competition:70,workPressure:65,computerTime:80,teamwork:65,independentWork:75,routine:35,creativity:80},workEnvironment:{handsOn:85,peopleInteraction:40,computerBased:75,remotePotential:40},skills:["Robotics Programming","Mechanical Design","Electronics","Problem-Solving"],education:{common:["Robotics or Mechanical Engineering degree"],alternative:["CS degree","Self-taught with projects"]},explorationActivities:["Join a robotics team","Build an Arduino or LEGO robot","Watch robotics industry videos","Take a free intro robotics course"],relatedCareers:["career_mechanical_engineer","career_software_engineer","career_research_scientist"],tags:["engineering","tech","hands-on","building"] },
  { id:"career_journalist",name:"Journalist",fields:["Media","Communications"],description:"Investigates and reports on news, events, and stories for public audiences.",riasec:{R:20,I:70,A:85,S:75,E:70,C:45},reality:{academicDifficulty:60,competition:75,workPressure:80,computerTime:70,teamwork:55,independentWork:70,routine:15,creativity:85},workEnvironment:{handsOn:40,peopleInteraction:80,computerBased:65,remotePotential:65},skills:["Writing","Research","Interviewing","Storytelling"],education:{common:["Journalism degree","Communications degree"],alternative:["English degree","Self-taught with portfolio"]},explorationActivities:["Write an article about your school","Start a blog or newsletter","Interview someone in your community","Shadow a journalist"],relatedCareers:["career_marketing_manager","career_policy_analyst","career_social_worker"],tags:["creative","writing","social","media"] },
  { id:"career_research_scientist",name:"Research Scientist",fields:["Science","Academia"],description:"Conducts original research to expand knowledge in a scientific field.",riasec:{R:45,I:100,A:50,S:45,E:40,C:70},reality:{academicDifficulty:90,competition:80,workPressure:60,computerTime:75,teamwork:60,independentWork:85,routine:35,creativity:70},workEnvironment:{handsOn:65,peopleInteraction:45,computerBased:70,remotePotential:45},skills:["Experimental Design","Data Analysis","Scientific Writing","Critical Thinking"],education:{common:["Science degree","PhD program"],alternative:["Research technician","Master's pathway"]},explorationActivities:["Enter a science fair","Find a university lab","Read about a scientist you admire","Take an advanced science seminar"],relatedCareers:["career_biomedical_researcher","career_data_scientist","career_environmental_scientist"],tags:["science","research","discovery","graduate-degree"] },
  { id:"career_graphic_designer",name:"Graphic Designer",fields:["Design","Arts"],description:"Creates visual content for brands, media, marketing, and digital platforms.",riasec:{R:30,I:45,A:100,S:50,E:55,C:50},reality:{academicDifficulty:55,competition:75,workPressure:60,computerTime:85,teamwork:55,independentWork:75,routine:25,creativity:100},workEnvironment:{handsOn:35,peopleInteraction:50,computerBased:85,remotePotential:80},skills:["Adobe Creative Suite","Typography","Color Theory","Visual Storytelling"],education:{common:["Graphic Design degree"],alternative:["Self-taught with portfolio","Online courses"]},explorationActivities:["Create a logo using Canva","Redesign a brand logo","Follow designers on Behance","Take a free design course"],relatedCareers:["career_ux_designer","career_marketing_manager","career_journalist"],tags:["creative","art","design","freelance-friendly"] },
  { id:"career_civil_engineer",name:"Civil Engineer",fields:["Engineering","Construction"],description:"Designs and oversees construction of infrastructure like bridges, roads, and buildings.",riasec:{R:85,I:80,A:50,S:40,E:60,C:70},reality:{academicDifficulty:75,competition:55,workPressure:70,computerTime:65,teamwork:70,independentWork:65,routine:50,creativity:60},workEnvironment:{handsOn:75,peopleInteraction:55,computerBased:60,remotePotential:25},skills:["Structural Analysis","CAD","Project Management","Problem-Solving"],education:{common:["Civil Engineering degree","PE license"],alternative:["Construction management pathway"]},explorationActivities:["Visit a construction site","Research how local infrastructure was built","Take a free structural engineering course","Build a bridge with household materials"],relatedCareers:["career_mechanical_engineer","career_architect","career_environmental_scientist"],tags:["engineering","building","stable","hands-on"] },
  { id:"career_architect",name:"Architect",fields:["Design","Engineering"],description:"Designs buildings and spaces, balancing aesthetics, function, and engineering.",riasec:{R:80,I:60,A:100,S:40,E:50,C:70},reality:{academicDifficulty:75,competition:70,workPressure:75,computerTime:80,teamwork:60,independentWork:75,routine:30,creativity:100},workEnvironment:{handsOn:55,peopleInteraction:55,computerBased:80,remotePotential:55},skills:["Architectural Drawing","3D Modeling","Building Codes","Spatial Thinking"],education:{common:["Architecture degree (B.Arch/M.Arch)","Licensure"],alternative:[]},explorationActivities:["Sketch building designs","Take a free architectural drawing course","Visit an architecture firm","Design a room with Planner 5D"],relatedCareers:["career_civil_engineer","career_ux_designer","career_mechanical_engineer"],tags:["creative","design","building","art"] },
  { id:"career_nurse",name:"Registered Nurse",fields:["Healthcare","Medicine"],description:"Provides patient care, administers treatments, and coordinates with medical teams.",riasec:{R:45,I:65,A:35,S:95,E:45,C:60},reality:{academicDifficulty:70,competition:55,workPressure:85,computerTime:45,teamwork:90,independentWork:50,routine:55,creativity:35},workEnvironment:{handsOn:85,peopleInteraction:95,computerBased:40,remotePotential:10},skills:["Patient Care","Clinical Assessment","Medication Administration","Communication"],education:{common:["Nursing degree (BSN/ADN)","NCLEX license"],alternative:["LPN to RN pathway","Accelerated BSN"]},explorationActivities:["Volunteer at a hospital","Shadow a nurse","Take a CNA course","Join a health club at school"],relatedCareers:["career_physician","career_psychologist","career_physical_therapist"],tags:["healthcare","helping","hands-on","stable"] },
  { id:"career_physical_therapist",name:"Physical Therapist",fields:["Healthcare","Sports"],description:"Helps patients recover from injuries and improve physical function through treatment.",riasec:{R:65,I:65,A:40,S:90,E:55,C:55},reality:{academicDifficulty:70,competition:55,workPressure:65,computerTime:35,teamwork:75,independentWork:55,routine:55,creativity:50},workEnvironment:{handsOn:90,peopleInteraction:90,computerBased:30,remotePotential:15},skills:["Exercise Therapy","Anatomy","Patient Education","Assessment"],education:{common:["Physical Therapy degree (DPT)"],alternative:["Occupational therapy pathway","Athletic training"]},explorationActivities:["Shadow a PT at a clinic","Volunteer at a sports medicine center","Take a sports first aid course","Research PT vs OT differences"],relatedCareers:["career_nurse","career_physician","career_social_worker"],tags:["healthcare","hands-on","helping","sports"] },
  { id:"career_economist",name:"Economist",fields:["Economics","Policy"],description:"Studies how people, businesses, and governments allocate resources and make decisions.",riasec:{R:20,I:95,A:40,S:50,E:65,C:80},reality:{academicDifficulty:85,competition:70,workPressure:60,computerTime:80,teamwork:50,independentWork:85,routine:45,creativity:50},workEnvironment:{handsOn:15,peopleInteraction:50,computerBased:85,remotePotential:70},skills:["Statistical Analysis","Economic Modeling","Research","Writing"],education:{common:["Economics degree","Graduate degree"],alternative:["Finance pathway","Data analytics pathway"]},explorationActivities:["Read about a current economic issue","Take a free economics course","Analyze a country's economy","Model a supply/demand scenario"],relatedCareers:["career_financial_analyst","career_policy_analyst","career_data_scientist"],tags:["research","math","policy","analytical"] },
  { id:"career_curriculum_designer",name:"Curriculum Designer",fields:["Education","Instructional Design"],description:"Develops educational programs, courses, and learning materials for schools and organizations.",riasec:{R:20,I:65,A:75,S:80,E:55,C:70},reality:{academicDifficulty:60,competition:45,workPressure:55,computerTime:70,teamwork:65,independentWork:70,routine:50,creativity:80},workEnvironment:{handsOn:30,peopleInteraction:65,computerBased:70,remotePotential:75},skills:["Instructional Design","Curriculum Writing","Education Technology","Assessment Design"],education:{common:["Education degree","Instructional Design degree"],alternative:["Online certifications","Teaching experience pathway"]},explorationActivities:["Design a lesson plan on a topic you love","Critique a textbook chapter","Volunteer to run a workshop","Take an instructional design course"],relatedCareers:["career_teacher","career_ux_designer","career_journalist"],tags:["education","creative","design","remote-friendly"] },
];

const OPPORTUNITIES = [
  {id:"opp_nasa",name:"NASA OSTEM Internships",organization:"NASA",type:"Internship",description:"Student internships across engineering, science, technology, and business.",fields:["engineering","science","technology"],interestCodes:["R","I","C","E"],difficulty:"Highly Competitive",url:"https://www.nasa.gov/learning-resources/internship-programs/"},
  {id:"opp_nsf_reu",name:"NSF Research Experiences for Undergraduates",organization:"National Science Foundation",type:"Research",description:"Paid research at NSF-funded institutions across science and engineering.",fields:["science","engineering","math"],interestCodes:["I","R","C"],difficulty:"Competitive",url:"https://www.nsf.gov/funding/initiatives/reu/students"},
  {id:"opp_smithsonian",name:"Smithsonian Internships",organization:"Smithsonian Institution",type:"Internship",description:"Internships spanning science, arts, education, research, and communications.",fields:["science","arts","education"],interestCodes:["I","A","S","C"],difficulty:"Competitive",url:"https://www.si.edu/support/internships"},
  {id:"opp_nih",name:"NIH Summer Internship Program",organization:"National Institutes of Health",type:"Research",description:"Research experience at NIH laboratories for biomedical sciences.",fields:["healthcare","science","research"],interestCodes:["I","R","S"],difficulty:"Competitive",url:"https://www.training.nih.gov/programs/sip"},
  {id:"opp_google_step",name:"Google STEP Internship",organization:"Google",type:"Internship",description:"Software engineering internship for first and second year college students.",fields:["technology","computer science"],interestCodes:["I","R","C"],difficulty:"Highly Competitive",url:"https://buildyourfuture.withgoogle.com/programs/step"},
  {id:"opp_microsoft_explore",name:"Microsoft Explore Internship",organization:"Microsoft",type:"Internship",description:"Software engineering and program management for first and second year students.",fields:["technology","computer science"],interestCodes:["I","R","E","C"],difficulty:"Highly Competitive",url:"https://careers.microsoft.com/students/"},
  {id:"opp_robotics",name:"FIRST Robotics Competition",organization:"FIRST",type:"Competition",description:"Hands-on robotics competition involving engineering, programming, and teamwork.",fields:["engineering","computer science"],interestCodes:["R","I","C"],difficulty:"Accessible",url:"https://www.firstinspires.org"},
  {id:"opp_science_fair",name:"Science Fair / Research Competition",organization:"Various",type:"Competition",description:"Present original research at regional, state, or national competitions.",fields:["science","research","engineering"],interestCodes:["I","R"],difficulty:"Moderate",url:""},
  {id:"opp_job_shadow",name:"Professional Job Shadow",organization:"Local Employer",type:"Job Shadow",description:"Spend a day with a professional to see what their job actually looks like.",fields:["all"],interestCodes:["R","I","A","S","E","C"],difficulty:"Accessible",url:""},
  {id:"opp_mentor",name:"Career Mentor",organization:"Local Network",type:"Mentorship",description:"Connect with a professional in a field you're exploring for guidance.",fields:["all"],interestCodes:["R","I","A","S","E","C"],difficulty:"Accessible",url:""},
  {id:"opp_hackathon",name:"Hackathon",organization:"Various",type:"Competition",description:"Time-limited coding and design challenge to build a product or solve a problem.",fields:["technology","design","business"],interestCodes:["I","R","A","E"],difficulty:"Accessible",url:"https://devpost.com"},
  {id:"opp_teach_america",name:"Teach For America",organization:"Teach For America",type:"Fellowship",description:"Teaching fellows program placing graduates in under-resourced schools.",fields:["education"],interestCodes:["S","E","A"],difficulty:"Competitive",url:"https://www.teachforamerica.org"},
  {id:"opp_goldman",name:"Goldman Sachs Freshman Summit",organization:"Goldman Sachs",type:"Internship",description:"Early career exposure to finance, business, and professional development.",fields:["finance","business"],interestCodes:["E","C","I"],difficulty:"Highly Competitive",url:"https://www.goldmansachs.com/careers/students/programs/"},
  {id:"opp_legal_aid",name:"Legal Aid Clinic Volunteer",organization:"Local Legal Aid",type:"Volunteering",description:"Help provide legal assistance to underserved communities alongside attorneys.",fields:["law","policy"],interestCodes:["S","E","C"],difficulty:"Accessible",url:""},
];

// ============================================================
// QUIZ QUESTIONS
// ============================================================
const questions = [
  {id:"R1",section:1,type:"slider",text:"I enjoy figuring out how things work.",cat:"R"},
  {id:"R2",section:1,type:"slider",text:"I like building or fixing things.",cat:"R"},
  {id:"R3",section:1,type:"slider",text:"I would enjoy creating something that solves a real problem.",cat:"R"},
  {id:"R4",section:1,type:"slider",text:"I like working with technology.",cat:"R"},
  {id:"R5",section:1,type:"slider",text:"I would rather learn by doing than only reading about it.",cat:"R"},
  {id:"I1",section:1,type:"slider",text:"I enjoy solving difficult problems.",cat:"I"},
  {id:"I2",section:1,type:"slider",text:"I get curious about how or why something works.",cat:"I"},
  {id:"I3",section:1,type:"slider",text:"I enjoy researching things I'm interested in.",cat:"I"},
  {id:"I4",section:1,type:"slider",text:"I like finding answers to questions without obvious solutions.",cat:"I"},
  {id:"I5",section:1,type:"slider",text:"I enjoy subjects that challenge me to think deeply.",cat:"I"},
  {id:"A1",section:1,type:"slider",text:"I enjoy creating things other people can see or experience.",cat:"A"},
  {id:"A2",section:1,type:"slider",text:"I often think of different ways to solve the same problem.",cat:"A"},
  {id:"A3",section:1,type:"slider",text:"I care about how something looks, feels, or is presented.",cat:"A"},
  {id:"A4",section:1,type:"slider",text:"I would enjoy turning an idea into something original.",cat:"A"},
  {id:"S1",section:1,type:"slider",text:"I feel good when I help someone solve a problem.",cat:"S"},
  {id:"S2",section:1,type:"slider",text:"I would enjoy teaching someone something I know.",cat:"S"},
  {id:"S3",section:1,type:"slider",text:"I care about making a positive difference in people's lives.",cat:"S"},
  {id:"S4",section:1,type:"slider",text:"I enjoy understanding why people think or act differently.",cat:"S"},
  {id:"E1",section:1,type:"slider",text:"I enjoy taking charge when a group needs direction.",cat:"E"},
  {id:"E2",section:1,type:"slider",text:"I would like to start my own project, organization, or business.",cat:"E"},
  {id:"E3",section:1,type:"slider",text:"I enjoy convincing people to support an idea.",cat:"E"},
  {id:"E4",section:1,type:"slider",text:"I like turning an idea into something successful.",cat:"E"},
  {id:"C1",section:1,type:"slider",text:"I like organizing messy information.",cat:"C"},
  {id:"C2",section:1,type:"slider",text:"I enjoy making plans.",cat:"C"},
  {id:"C3",section:1,type:"slider",text:"I notice when a process could be improved.",cat:"C"},
  {id:"C4",section:1,type:"slider",text:"I like knowing that things are accurate and organized.",cat:"C"},
  {id:"EXP1",section:2,type:"choice",text:"Have you ever built something outside of a school assignment?"},
  {id:"EXP2",section:2,type:"choice",text:"Have you ever joined a club because you were genuinely interested in it?"},
  {id:"EXP3",section:2,type:"choice",text:"Have you ever led a group or project?"},
  {id:"EXP4",section:2,type:"choice",text:"Have you ever started your own project?"},
  {id:"EXP5",section:2,type:"choice",text:"Have you ever helped someone learn something?"},
  {id:"EXP6",section:2,type:"choice",text:"Have you ever volunteered?"},
  {id:"EXP7",section:2,type:"choice",text:"Have you ever participated in a competition?"},
  {id:"EXP8",section:2,type:"choice",text:"Have you ever shadowed someone at their job?"},
  {id:"EXP9",section:2,type:"choice",text:"Have you ever talked to someone about their career?"},
  {id:"EXP10",section:2,type:"choice",text:"Have you ever taken an online course just because you were interested?"},
  {id:"EXP11",section:2,type:"choice",text:"Have you ever made money from something you created or did?"},
  {id:"P1",section:3,type:"slider",text:"I'd be comfortable spending years training for a career I love."},
  {id:"P2",section:3,type:"slider",text:"Having a high salary is important to me."},
  {id:"P3",section:3,type:"slider",text:"Having free time outside of work is important to me."},
  {id:"P4",section:3,type:"slider",text:"I'd rather have a stable career than take big risks for greater rewards."},
  {id:"P5",section:3,type:"slider",text:"I'd enjoy working with people every day."},
  {id:"P6",section:3,type:"slider",text:"I'd enjoy spending a lot of time solving problems independently."},
  {id:"P7",section:3,type:"slider",text:"I want my work to make a noticeable difference in people's lives."},
  {id:"RL1",section:4,type:"slider",text:"I'd be okay with a job where I sometimes work long hours."},
  {id:"RL2",section:4,type:"slider",text:"I'd be comfortable speaking in front of groups."},
  {id:"RL3",section:4,type:"slider",text:"I'd enjoy sitting at a computer for several hours a day."},
  {id:"RL4",section:4,type:"slider",text:"I'd be comfortable making important decisions under pressure."},
  {id:"RL5",section:4,type:"slider",text:"I'd enjoy becoming an expert at one type of problem."},
  {id:"RL6",section:4,type:"slider",text:"I'd rather have a predictable routine than a job where every day is different."},
  {id:"TRY1",section:5,type:"explore",text:"Would you try designing a robot to complete a challenge?"},
  {id:"TRY2",section:5,type:"explore",text:"Would you try helping diagnose why something isn't working?"},
  {id:"TRY3",section:5,type:"explore",text:"Would you try creating an app that solves a problem?"},
  {id:"TRY4",section:5,type:"explore",text:"Would you try teaching younger students?"},
  {id:"TRY5",section:5,type:"explore",text:"Would you try running a business for a month?"},
  {id:"TRY6",section:5,type:"explore",text:"Would you try designing a social media campaign?"},
  {id:"TRY7",section:5,type:"explore",text:"Would you try analyzing evidence to solve a mystery?"},
  {id:"TRY8",section:5,type:"explore",text:"Would you try interviewing someone about their life?"},
  {id:"TRY9",section:5,type:"explore",text:"Would you try designing a building?"},
  {id:"TRY10",section:5,type:"explore",text:"Would you try conducting a science experiment?"},
  {id:"TRY11",section:5,type:"explore",text:"Would you try organizing an event for hundreds of people?"},
];

const SECTION_LABELS=["Interests","Experience","Preferences","Career Reality","Exploration"];
const SECTION_DESCS=["Rate how much each statement applies to you.","Tell us about your past experiences.","What matters to you in a career?","How do you feel about real-world job realities?","Would you try any of these activities?"];

// ============================================================
// ENGINE
// ============================================================
function clamp(v,min=0,max=100){return Math.max(min,Math.min(max,v));}
function avg(vals){return vals.length===0?0:vals.reduce((s,v)=>s+v,0)/vals.length;}

function calcRiasec(answers){
  const t={R:0,I:0,A:0,S:0,E:0,C:0},c={R:0,I:0,A:0,S:0,E:0,C:0};
  for(const q of questions){if(q.section!==1||!q.cat)continue;const a=answers[q.id];if(typeof a!=="number")continue;t[q.cat]+=clamp(a);c[q.cat]++;}
  return{R:c.R?Math.round(t.R/c.R):0,I:c.I?Math.round(t.I/c.I):0,A:c.A?Math.round(t.A/c.A):0,S:c.S?Math.round(t.S/c.S):0,E:c.E?Math.round(t.E/c.E):0,C:c.C?Math.round(t.C/c.C):0};
}
function top3(s){return Object.entries(s).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([c])=>c).join("");}
function calcConf(answers){const ids=questions.filter(q=>q.section===2).map(q=>q.id);const tried=ids.filter(id=>answers[id]==="yes");return tried.length===0?10:Math.round(clamp((tried.length/ids.length)*100));}
function simScore(u,c){const k=["R","I","A","S","E","C"];const d=k.reduce((s,k)=>s+Math.abs((u[k]??50)-(c[k]??50)),0);return clamp(100-(d/k.length));}
function mLevel(s){if(s>=85)return{label:"Excellent Match",color:"#4ade80"};if(s>=72)return{label:"Strong Match",color:"#FF6B35"};if(s>=55)return{label:"Possible Match",color:"#FFE66D"};return{label:"Explore",color:"#888"};}

function buildRoadmap(career){
  return{
    next30Days:[`Learn the basics of ${career.name}.`,`Try this: ${career.explorationActivities[0]}.`,"Talk to someone working in or near this field.","Research three real opportunities related to this career."],
    next90Days:[`Complete a larger ${career.name}-related project.`,"Join a club, competition, or group connected to the field.","Apply to at least two relevant opportunities.",`Compare ${career.name} with related careers.`],
    beforeChoosing:["Talk to someone currently working in the career.","Find out what a normal Tuesday looks like in this field.","Research education and training required.","Research salary ranges for entry-level and experienced workers.","Try the work yourself before making a major education decision."],
  };
}

function matchOpps(riasec,career){
  const code=top3(riasec);
  return OPPORTUNITIES.map(o=>{
    const im=o.interestCodes.filter(c=>code.includes(c)).length/Math.max(o.interestCodes.length,1)*100;
    const fm=o.fields.includes("all")||o.fields.some(f=>career.fields.map(x=>x.toLowerCase()).includes(f))?80:40;
    return{...o,score:Math.round(im*0.4+fm*0.6)};
  }).sort((a,b)=>b.score-a.score).slice(0,6);
}

function calculatePersonality(answers){
  const riasec=calcRiasec(answers);
  const code=top3(riasec);
  const explorationConfidence=calcConf(answers);
  const careerMatches=CAREERS.map(c=>({...c,score:Math.round(simScore(riasec,c.riasec)),...mLevel(Math.round(simScore(riasec,c.riasec)))})).sort((a,b)=>b.score-a.score);
  const topCareer=careerMatches[0];
  const roadmap=topCareer?buildRoadmap(topCareer):null;
  const opportunities=topCareer?matchOpps(riasec,topCareer):[];
  const topValues=[];
  if((answers.P7||0)>60)topValues.push("Impact");
  if((answers.P2||0)>60)topValues.push("Income");
  if((answers.P3||0)>60)topValues.push("Balance");
  if((answers.P6||0)>60)topValues.push("Independence");
  if((answers.P4||0)>60)topValues.push("Stability");
  if(topValues.length===0)topValues.push("Growth","Discovery");
  return{code,riasec,explorationConfidence,careerMatches,topValues,roadmap,opportunities};
}

// ============================================================
// HOOKS
// ============================================================
function useInView(threshold=0.1){
  const ref=useRef(null);const[inView,setInView]=useState(false);
  useEffect(()=>{const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting)setInView(true);},{threshold});if(ref.current)obs.observe(ref.current);return()=>obs.disconnect();},[]);
  return[ref,inView];
}

// ============================================================
// GLOBAL STYLES
// ============================================================
const G = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  html{scroll-behavior:smooth;}
  body{font-family:'Inter',system-ui,sans-serif;background:#080808;color:#fff;overflow-x:hidden;}
  ::-webkit-scrollbar{width:3px;}::-webkit-scrollbar-track{background:#080808;}::-webkit-scrollbar-thumb{background:#FF6B35;border-radius:4px;}
  ::selection{background:#FF6B3544;color:#fff;}
  .fade-in{opacity:0;transform:translateY(24px);transition:opacity 0.7s ease,transform 0.7s ease;}
  .fade-in.visible{opacity:1;transform:translateY(0);}
  .slide-left{opacity:0;transform:translateX(-30px);transition:opacity 0.6s ease,transform 0.6s ease;}
  .slide-left.visible{opacity:1;transform:translateX(0);}
  input[type=range]{-webkit-appearance:none;appearance:none;background:transparent;width:100%;}
  input[type=range]::-webkit-slider-runnable-track{height:4px;background:#1e1e1e;border-radius:999px;}
  input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:22px;height:22px;border-radius:50%;background:#FF6B35;margin-top:-9px;cursor:pointer;box-shadow:0 0 12px #FF6B3566;transition:transform 0.15s;}
  input[type=range]:hover::-webkit-slider-thumb{transform:scale(1.15);}
  @keyframes pulse-slow{0%,100%{opacity:0.4;transform:scale(1);}50%{opacity:0.7;transform:scale(1.05);}}
  @keyframes float{0%,100%{transform:translateY(0);}50%{transform:translateY(-8px);}}
  @keyframes spin-slow{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}
  @keyframes dot-pulse{0%,100%{opacity:0.3;}50%{opacity:1;}}
  @keyframes shimmer{0%{background-position:-200% 0;}100%{background-position:200% 0;}}
  @media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important;}}
`;

// ============================================================
// COMPONENTS
// ============================================================

function Logo(){
  return(
    <div style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer"}}>
      <div style={{width:32,height:32,borderRadius:10,background:"linear-gradient(135deg,#FF6B35,#ff9a6c)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 16px #FF6B3540"}}>
        <svg width="16" height="16" viewBox="0 0 14 14" fill="none"><path d="M7 1L13 7L7 13M1 7H13" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>
      <span style={{fontWeight:800,fontSize:19,letterSpacing:-0.5,color:"#fff"}}>Pathways</span>
    </div>
  );
}

function Pill({children,color="#FF6B35"}){
  return(
    <span style={{display:"inline-flex",alignItems:"center",gap:6,background:`${color}18`,border:`1px solid ${color}44`,borderRadius:999,padding:"5px 14px",color,fontSize:12,fontWeight:600,letterSpacing:0.5,textTransform:"uppercase"}}>
      <span style={{width:5,height:5,borderRadius:"50%",background:color,display:"inline-block"}}/>
      {children}
    </span>
  );
}

function Btn({children,onClick,variant="primary",style={}}){
  const[hov,setHov]=useState(false);
  const base={display:"inline-flex",alignItems:"center",gap:8,borderRadius:999,padding:"13px 28px",fontSize:15,fontWeight:600,cursor:"pointer",border:"none",transition:"all 0.25s ease",outline:"none",...style};
  const styles={
    primary:{...base,background:"#FF6B35",color:"#fff",boxShadow:hov?"0 8px 32px #FF6B3560":"0 4px 16px #FF6B3530",transform:hov?"translateY(-2px) scale(1.02)":"translateY(0) scale(1)"},
    secondary:{...base,background:"transparent",color:"#888",border:"1px solid #222",transform:hov?"translateY(-1px)":"translateY(0)",color:hov?"#fff":"#888",borderColor:hov?"#444":"#222"},
    ghost:{...base,background:"transparent",color:"#FF6B35",padding:"10px 20px",fontSize:14},
  };
  return<button style={styles[variant]||styles.primary} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} onClick={onClick}>{children}</button>;
}

// ── Auth ──────────────────────────────────────────────────────
function AuthPage({mode}){
  return(
    <div style={{background:"#080808",minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
      <style>{G}</style>
      <div style={{marginBottom:40}}><Logo/></div>
      {mode==="sign-in"?<SignIn routing="hash"/>:<SignUp routing="hash"/>}
    </div>
  );
}

// ── Quiz ──────────────────────────────────────────────────────
function QuizFlow({onComplete}){
  const sQs=[1,2,3,4,5].map(s=>questions.filter(q=>q.section===s));
  const[sec,setSec]=useState(0);
  const[qi,setQi]=useState(0);
  const[ans,setAns]=useState({});
  const[sv,setSv]=useState(50);
  const[vis,setVis]=useState(true);

  const cq=sQs[sec][qi];
  const done=[0,1,2,3,4].slice(0,sec).reduce((s,i)=>s+sQs[i].length,0)+qi;
  const prog=Math.round((done/questions.length)*100);

  function go(fn){setVis(false);setTimeout(()=>{fn();setVis(true);},220);}
  function answer(val){
    const na={...ans,[cq.id]:val};setAns(na);
    if(cq.type==="slider")setSv(50);
    go(()=>{if(qi<sQs[sec].length-1)setQi(q=>q+1);else if(sec<4){setSec(s=>s+1);setQi(0);}else onComplete(na);});
  }
  function back(){go(()=>{if(qi>0)setQi(q=>q-1);else if(sec>0){setSec(s=>s-1);setQi(sQs[sec-1].length-1);}});}

  return(
    <div style={{maxWidth:640,margin:"0 auto",padding:"0 20px 60px"}}>
      <style>{G}</style>
      {/* Progress */}
      <div style={{marginBottom:40}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <span style={{color:"#FF6B35",fontSize:11,letterSpacing:2,textTransform:"uppercase",fontWeight:600}}>{SECTION_LABELS[sec]} · Section {sec+1} of 5</span>
          <span style={{color:"#444",fontSize:13,fontWeight:500}}>{prog}%</span>
        </div>
        <div style={{height:2,background:"#111",borderRadius:999,overflow:"hidden"}}>
          <div style={{height:"100%",background:"linear-gradient(90deg,#FF6B35,#ff9a6c)",width:`${prog}%`,transition:"width 0.5s ease",borderRadius:999}}/>
        </div>
        <p style={{color:"#333",fontSize:13,marginTop:10}}>{SECTION_DESCS[sec]}</p>
      </div>

      <div style={{opacity:vis?1:0,transform:vis?"translateY(0)":"translateY(12px)",transition:"all 0.22s ease"}}>
        <div style={{background:"#0e0e0e",border:"1px solid #1a1a1a",borderRadius:24,padding:"40px 36px",marginBottom:20,boxShadow:"0 20px 60px #00000060"}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:20}}>
            <span style={{background:"#FF6B3520",border:"1px solid #FF6B3540",borderRadius:8,color:"#FF6B35",fontWeight:700,fontSize:12,padding:"4px 10px"}}>{qi+1}</span>
            <span style={{color:"#333",fontSize:13}}>of {sQs[sec].length}</span>
          </div>
          <p style={{fontSize:21,fontWeight:600,lineHeight:1.5,marginBottom:36,color:"#f0f0f0",letterSpacing:-0.3}}>{cq.text}</p>

          {cq.type==="slider"?(
            <div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                <span style={{color:"#333",fontSize:13}}>Strongly disagree</span>
                <div style={{background:"#FF6B3520",border:"1px solid #FF6B3550",borderRadius:999,padding:"4px 16px"}}>
                  <span style={{color:"#FF6B35",fontSize:16,fontWeight:700}}>{sv}</span>
                </div>
                <span style={{color:"#333",fontSize:13}}>Strongly agree</span>
              </div>
              <input type="range" min={0} max={100} value={sv} onChange={e=>setSv(Number(e.target.value))}/>
              <div style={{display:"flex",justifyContent:"center",marginTop:28}}>
                <Btn onClick={()=>answer(sv)}>Continue →</Btn>
              </div>
            </div>
          ):(
            <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
              {(cq.type==="explore"?["yes","no","maybe"]:["yes","no"]).map(opt=>{
                const icons={yes:"✓",no:"✗",maybe:"?"};
                const colors={yes:"#4ade80",no:"#f87171",maybe:"#FFE66D"};
                return(
                  <button key={opt} onClick={()=>answer(opt)}
                    style={{flex:1,minWidth:120,background:"#141414",border:"1px solid #222",color:"#ccc",borderRadius:16,padding:"16px 20px",fontSize:15,fontWeight:500,cursor:"pointer",transition:"all 0.2s",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor=colors[opt];e.currentTarget.style.color=colors[opt];e.currentTarget.style.background=`${colors[opt]}18`;}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor="#222";e.currentTarget.style.color="#ccc";e.currentTarget.style.background="#141414";}}>
                    <span style={{fontSize:13,fontWeight:700}}>{icons[opt]}</span>
                    <span style={{textTransform:"capitalize"}}>{opt==="yes"?"Yes":opt==="no"?"No":"Maybe"}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
        {(sec>0||qi>0)&&(
          <button onClick={back} style={{background:"transparent",color:"#444",border:"none",fontSize:13,cursor:"pointer",padding:"8px 0",display:"flex",alignItems:"center",gap:6}}
            onMouseEnter={e=>e.currentTarget.style.color="#888"} onMouseLeave={e=>e.currentTarget.style.color="#444"}>
            ← Back
          </button>
        )}
      </div>
    </div>
  );
}

// ── Results ───────────────────────────────────────────────────
function RatingRing({value,size=80,sw=5}){
  const r=(size/2)-sw,circ=2*Math.PI*r,dash=(value/100)*circ;
  const col=value>=85?"#4ade80":value>=72?"#FF6B35":value>=55?"#FFE66D":"#666";
  return(
    <div style={{position:"relative",width:size,height:size,flexShrink:0}}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{transform:"rotate(-90deg)"}}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#1a1a1a" strokeWidth={sw}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={col} strokeWidth={sw} strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" style={{transition:"stroke-dasharray 1.2s cubic-bezier(.4,0,.2,1)"}}/>
      </svg>
      <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column"}}>
        <span style={{fontSize:size*0.22,fontWeight:800,color:"#fff"}}>{value}</span>
        <span style={{fontSize:size*0.1,color:"#444"}}>/100</span>
      </div>
    </div>
  );
}

function ResultsView({result,onRetake,onChat}){
  const[tab,setTab]=useState("careers");
  const[ref,inView]=useInView();
  const rl={R:"Realistic",I:"Investigative",A:"Artistic",S:"Social",E:"Enterprising",C:"Conventional"};
  const[hovCard,setHovCard]=useState(null);

  return(
    <div ref={ref} style={{maxWidth:800,margin:"0 auto",opacity:inView?1:0,transform:inView?"translateY(0)":"translateY(30px)",transition:"all 0.8s ease",padding:"0 20px"}}>
      <style>{G}</style>
      {/* Header */}
      <div style={{textAlign:"center",marginBottom:36}}>
        <div style={{display:"inline-flex",gap:8,marginBottom:16}}>
          <Pill>{result.code} · Career Personality</Pill>
          <Pill color="#4ade80">Confidence: {result.explorationConfidence}%</Pill>
        </div>
        <h2 style={{fontWeight:800,fontSize:"clamp(28px,4vw,48px)",letterSpacing:-2,marginBottom:10,lineHeight:1.1}}>Your Career Profile</h2>
        <p style={{color:"#555",fontSize:15}}>Top values: {result.topValues.join(" · ")}</p>
      </div>

      {/* RIASEC */}
      <div style={{background:"#0e0e0e",border:"1px solid #1a1a1a",borderRadius:20,padding:"24px 28px",marginBottom:16,boxShadow:"0 8px 40px #00000040"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18}}>
          <span style={{color:"#FF6B35",fontSize:11,letterSpacing:2,textTransform:"uppercase",fontWeight:600}}>Interest Profile · RIASEC</span>
          <span style={{color:"#333",fontSize:12}}>Based on your answers</span>
        </div>
        {Object.entries(result.riasec).map(([c,s])=>(
          <div key={c} style={{display:"flex",alignItems:"center",gap:14,marginBottom:11}}>
            <span style={{color:"#444",fontSize:13,width:110,flexShrink:0}}>{rl[c]}</span>
            <div style={{flex:1,height:4,background:"#141414",borderRadius:999,overflow:"hidden"}}>
              <div style={{height:"100%",background:s>=70?"#FF6B35":s>=50?"#FF6B3580":"#333",borderRadius:999,width:`${s}%`,transition:"width 1.2s cubic-bezier(.4,0,.2,1)"}}/>
            </div>
            <span style={{color:"#444",fontSize:13,width:30,textAlign:"right",fontWeight:600}}>{s}</span>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{display:"flex",gap:6,marginBottom:16,background:"#0a0a0a",border:"1px solid #141414",borderRadius:16,padding:6}}>
        {[["careers","🎯 Careers"],["opportunities","🚀 Opportunities"],["roadmap","🗺️ Roadmap"]].map(([t,l])=>(
          <button key={t} onClick={()=>setTab(t)} style={{flex:1,background:tab===t?"#FF6B35":"transparent",color:tab===t?"#fff":"#555",border:"none",borderRadius:12,padding:"10px 0",fontSize:13,fontWeight:600,cursor:"pointer",transition:"all 0.2s"}}>{l}</button>
        ))}
      </div>

      {/* Careers */}
      {tab==="careers"&&(
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {result.careerMatches.slice(0,6).map((c,i)=>(
            <div key={c.id} onMouseEnter={()=>setHovCard(i)} onMouseLeave={()=>setHovCard(null)}
              style={{background:"#0e0e0e",border:`1px solid ${hovCard===i?"#FF6B3544":"#1a1a1a"}`,borderRadius:20,padding:"22px 24px",display:"flex",gap:18,alignItems:"flex-start",transform:hovCard===i?"translateY(-2px)":"translateY(0)",transition:"all 0.25s ease",cursor:"default",boxShadow:hovCard===i?"0 8px 40px #00000060":"none"}}>
              <RatingRing value={c.score}/>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6,flexWrap:"wrap"}}>
                  <span style={{fontWeight:700,fontSize:17,color:"#f0f0f0"}}>{c.name}</span>
                  <span style={{background:`${c.color}18`,color:c.color,fontSize:11,fontWeight:700,borderRadius:999,padding:"2px 10px",border:`1px solid ${c.color}44`}}>{c.label}</span>
                  {i===0&&<span style={{background:"#FF6B3520",color:"#FF6B35",fontSize:11,fontWeight:700,borderRadius:999,padding:"2px 10px",border:"1px solid #FF6B3544"}}>⭐ Best Match</span>}
                </div>
                <p style={{color:"#555",fontSize:13,lineHeight:1.6,marginBottom:10}}>{c.description}</p>
                <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:10}}>
                  {c.fields.map(f=><span key={f} style={{background:"#141414",border:"1px solid #1e1e1e",color:"#555",fontSize:11,borderRadius:999,padding:"3px 10px"}}>{f}</span>)}
                  {c.tags?.slice(0,2).map(t=><span key={t} style={{background:"#141414",border:"1px solid #1e1e1e",color:"#555",fontSize:11,borderRadius:999,padding:"3px 10px"}}>#{t}</span>)}
                </div>
                {c.explorationActivities&&<p style={{color:"#FF6B35",fontSize:13}}><span style={{color:"#444"}}>Try: </span>{c.explorationActivities[0]}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Opportunities */}
      {tab==="opportunities"&&(
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {result.opportunities.map(o=>(
            <div key={o.id} style={{background:"#0e0e0e",border:"1px solid #1a1a1a",borderRadius:16,padding:"20px 22px",display:"flex",gap:16,alignItems:"flex-start"}}>
              <div style={{flexShrink:0,background:"#FF6B3515",border:"1px solid #FF6B3530",borderRadius:12,padding:"8px 12px",textAlign:"center",minWidth:52}}>
                <div style={{color:"#FF6B35",fontSize:14,fontWeight:700}}>{o.score}%</div>
                <div style={{color:"#444",fontSize:10}}>match</div>
              </div>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4,flexWrap:"wrap"}}>
                  <span style={{fontWeight:600,fontSize:15,color:"#f0f0f0"}}>{o.name}</span>
                  <span style={{background:"#141414",border:"1px solid #222",color:"#555",fontSize:11,borderRadius:999,padding:"2px 8px"}}>{o.type}</span>
                  <span style={{background:"#141414",border:"1px solid #222",color:"#555",fontSize:11,borderRadius:999,padding:"2px 8px"}}>{o.difficulty}</span>
                </div>
                <p style={{color:"#444",fontSize:12,marginBottom:4}}>{o.organization}</p>
                <p style={{color:"#555",fontSize:13,lineHeight:1.5,marginBottom:8}}>{o.description}</p>
                {o.url?<a href={o.url} target="_blank" rel="noopener noreferrer" style={{color:"#FF6B35",fontSize:13,textDecoration:"none",fontWeight:500}}>Learn more →</a>:<span style={{color:"#333",fontSize:13}}>Search online for current openings</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Roadmap */}
      {tab==="roadmap"&&result.roadmap&&(
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {[{label:"📅 Next 30 Days",items:result.roadmap.next30Days,col:"#4ade80"},{label:"🗓️ Next 90 Days",items:result.roadmap.next90Days,col:"#FF6B35"},{label:"✅ Before You Commit",items:result.roadmap.beforeChoosing,col:"#FFE66D"}].map(s=>(
            <div key={s.label} style={{background:"#0e0e0e",border:"1px solid #1a1a1a",borderRadius:16,padding:"22px 24px"}}>
              <div style={{color:s.col,fontSize:13,fontWeight:700,marginBottom:14,display:"flex",alignItems:"center",gap:8}}>{s.label}</div>
              {s.items.map((item,i)=>(
                <div key={i} style={{display:"flex",gap:12,marginBottom:12,alignItems:"flex-start"}}>
                  <div style={{width:20,height:20,borderRadius:6,background:`${s.col}20`,border:`1px solid ${s.col}40`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:10,color:s.col,fontWeight:700}}>{i+1}</div>
                  <span style={{color:"#888",fontSize:14,lineHeight:1.6}}>{item}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      <div style={{display:"flex",gap:10,flexWrap:"wrap",marginTop:24}}>
        <Btn variant="secondary" onClick={onRetake}>← Retake Quiz</Btn>
        <Btn onClick={onChat}>Talk to Aria about your results →</Btn>
      </div>
    </div>
  );
}

// ── Aria Chat ─────────────────────────────────────────────────
function TalkToUs({onBack,initialContext}){
  const g=initialContext?`Hi! I'm Aria 👋 I can see you got the **${initialContext.code}** personality type with top careers in ${initialContext.topCareers}. What would you like to explore?`:"Hi! I'm Aria, your Pathways career counselor 👋 What personality code did you get from the quiz?";
  const[msgs,setMsgs]=useState([{role:"assistant",text:g}]);
  const[inp,setInp]=useState("");
  const[load,setLoad]=useState(false);
  const btm=useRef(null);
  useEffect(()=>{btm.current?.scrollIntoView({behavior:"smooth"});},[msgs,load]);

  const send=async()=>{
    const text=inp.trim();if(!text||load)return;
    setInp("");const nm=[...msgs,{role:"user",text}];setMsgs(nm);setLoad(true);
    try{
      const res=await fetch("https://pathways-backend-production.up.railway.app/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:nm.map(m=>({role:m.role,content:m.text})),pathway:initialContext?.code??null,personalityName:initialContext?.code??null,topCareers:initialContext?.topCareers??null,topValues:initialContext?.topValues??null})});
      const data=await res.json();
      setMsgs(prev=>[...prev,{role:"assistant",text:data.reply||"Sorry, something went wrong."}]);
    }catch{setMsgs(prev=>[...prev,{role:"assistant",text:"Hmm, something went wrong. Give it another try!"}]);}
    setLoad(false);
  };

  return(
    <div style={{background:"#080808",minHeight:"100vh",display:"flex",flexDirection:"column"}}>
      <style>{G}</style>
      <nav style={{padding:"0 5%",height:68,display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:"1px solid #111",flexShrink:0}}>
        <Logo/>
        <Btn variant="secondary" onClick={onBack} style={{padding:"8px 20px",fontSize:13}}>← Back</Btn>
      </nav>
      <div style={{padding:"20px 5% 16px",borderBottom:"1px solid #0e0e0e",flexShrink:0}}>
        <div style={{maxWidth:720,margin:"0 auto",display:"flex",alignItems:"center",gap:14}}>
          <div style={{width:44,height:44,borderRadius:"50%",background:"linear-gradient(135deg,#FF6B35,#ff9a6c)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0,boxShadow:"0 4px 20px #FF6B3540"}}>✨</div>
          <div>
            <div style={{fontWeight:700,fontSize:17}}>Aria <span style={{color:"#FF6B35",fontSize:11,fontWeight:600,background:"#FF6B3518",border:"1px solid #FF6B3540",borderRadius:999,padding:"2px 10px",marginLeft:8}}>AI Counselor</span></div>
            <div style={{color:"#444",fontSize:13}}>Ask about careers, internships, or your next step.</div>
          </div>
          <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:6}}>
            <div style={{width:7,height:7,borderRadius:"50%",background:"#4ade80",animation:"pulse-slow 2s infinite"}}/>
            <span style={{color:"#444",fontSize:12}}>Online</span>
          </div>
        </div>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"28px 5%"}}>
        <div style={{maxWidth:720,margin:"0 auto",display:"flex",flexDirection:"column",gap:18}}>
          {msgs.map((m,i)=>(
            <div key={i} style={{display:"flex",gap:10,flexDirection:m.role==="user"?"row-reverse":"row",alignItems:"flex-end"}}>
              {m.role==="assistant"&&<div style={{width:30,height:30,borderRadius:"50%",background:"linear-gradient(135deg,#FF6B35,#ff9a6c)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,flexShrink:0}}>✨</div>}
              <div style={{maxWidth:"78%",background:m.role==="user"?"#FF6B35":"#0e0e0e",border:m.role==="user"?"none":"1px solid #1a1a1a",borderRadius:m.role==="user"?"18px 18px 4px 18px":"18px 18px 18px 4px",padding:"12px 16px",fontSize:14,lineHeight:1.65,color:"#f0f0f0",whiteSpace:"pre-wrap"}}>{m.text}</div>
            </div>
          ))}
          {load&&<div style={{display:"flex",gap:10,alignItems:"flex-end"}}><div style={{width:30,height:30,borderRadius:"50%",background:"linear-gradient(135deg,#FF6B35,#ff9a6c)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,flexShrink:0}}>✨</div><div style={{background:"#0e0e0e",border:"1px solid #1a1a1a",borderRadius:"18px 18px 18px 4px",padding:"14px 18px",display:"flex",gap:5}}>{[0,1,2].map(i=><div key={i} style={{width:6,height:6,borderRadius:"50%",background:"#FF6B35",animation:`dot-pulse 1.2s ease-in-out ${i*0.2}s infinite`}}/>)}</div></div>}
          <div ref={btm}/>
        </div>
      </div>
      <div style={{padding:"14px 5% 22px",borderTop:"1px solid #0e0e0e",flexShrink:0}}>
        <div style={{maxWidth:720,margin:"0 auto",display:"flex",gap:10,alignItems:"flex-end"}}>
          <textarea value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}} placeholder="Ask Aria anything..." rows={1}
            style={{flex:1,background:"#0e0e0e",border:"1px solid #1a1a1a",borderRadius:14,padding:"13px 16px",color:"#f0f0f0",fontSize:14,outline:"none",resize:"none",fontFamily:"inherit",lineHeight:1.5}}/>
          <button onClick={send} disabled={!inp.trim()||load}
            style={{background:inp.trim()&&!load?"#FF6B35":"#111",color:inp.trim()&&!load?"#fff":"#333",border:"none",borderRadius:12,width:46,height:46,fontSize:16,cursor:inp.trim()&&!load?"pointer":"default",transition:"all 0.2s",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:inp.trim()&&!load?"0 4px 16px #FF6B3540":"none"}}>→</button>
        </div>
        <div style={{maxWidth:720,margin:"8px auto 0",color:"#222",fontSize:12,textAlign:"center"}}>Enter to send · Shift+Enter for new line</div>
      </div>
    </div>
  );
}

// ── Our Story ─────────────────────────────────────────────────
function OurStory({onBack}){
  return(
    <div style={{background:"#080808",minHeight:"100vh",color:"#fff"}}>
      <style>{G}</style>
      <nav style={{padding:"0 5%",height:68,display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:"1px solid #111"}}>
        <Logo/><Btn variant="secondary" onClick={onBack} style={{padding:"8px 20px",fontSize:13}}>← Back</Btn>
      </nav>
      <section style={{padding:"80px 5% 60px",maxWidth:860,margin:"0 auto"}}>
        <Pill style={{marginBottom:28}}>Who we are</Pill>
        <h1 style={{fontWeight:800,fontSize:"clamp(44px,7vw,80px)",lineHeight:1.0,letterSpacing:-3,marginBottom:24,marginTop:20}}>Built by students,<br/>for <span style={{color:"#FF6B35"}}>students.</span></h1>
        <p style={{color:"#555",fontSize:18,lineHeight:1.8,maxWidth:560,fontWeight:300}}>We got tired of watching our peers pick careers based on salary charts and parental pressure — with no real sense of what their future actually looked like day-to-day. So we built Pathways.</p>
      </section>
      <section style={{padding:"0 5% 80px",maxWidth:860,margin:"0 auto"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:40}}>
          {[{year:"2023",title:"The Problem",desc:"Students were picking majors based on salary charts and parental pressure — with no real sense of what the day-to-day looked like.",icon:"🔍"},{year:"2024",title:"The Idea",desc:"A simple quiz turned into a full platform — matching interests to careers, internships, and real field experiences.",icon:"💡"},{year:"2025",title:"First Students",desc:"We launched a beta with 200 students across 12 schools. 97% said they found clearer direction within a single session.",icon:"🚀"},{year:"2026",title:"Today",desc:"Pathways is growing. We're expanding our career database, refining our AI counselor, and partnering with schools nationwide.",icon:"🌍"}].map(item=>(
            <div key={item.year} style={{background:"#0e0e0e",border:"1px solid #161616",borderRadius:20,padding:"28px 24px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
                <span style={{color:"#FF6B35",fontSize:11,letterSpacing:2,textTransform:"uppercase",fontWeight:600}}>{item.year}</span>
                <span style={{fontSize:20}}>{item.icon}</span>
              </div>
              <h3 style={{fontWeight:700,fontSize:20,marginBottom:10}}>{item.title}</h3>
              <p style={{color:"#444",fontSize:14,lineHeight:1.7}}>{item.desc}</p>
            </div>
          ))}
        </div>
        <div style={{background:"linear-gradient(135deg,#FF6B35,#e05a28)",borderRadius:24,padding:"36px 40px",display:"flex",gap:24,alignItems:"center",marginBottom:40,boxShadow:"0 20px 60px #FF6B3530"}}>
          <div style={{fontSize:36,flexShrink:0}}>🎯</div>
          <div>
            <div style={{fontWeight:800,fontSize:20,marginBottom:8}}>Our Mission</div>
            <p style={{color:"rgba(255,255,255,0.85)",fontSize:15,lineHeight:1.7}}>Every student deserves to explore their future before committing to it. Pathways exists to make that possible — regardless of background, school, or zip code.</p>
          </div>
        </div>
        <div>
          <div style={{color:"#FF6B35",fontSize:11,letterSpacing:2,textTransform:"uppercase",fontWeight:600,marginBottom:16}}>The Team</div>
          <div style={{display:"flex",gap:14}}>
            {[{name:"Hanish Dudam",role:"Founder"},{name:"Sriman Padamatinti",role:"Co-Founder"}].map(p=>(
              <div key={p.role} style={{flex:1,background:"#0e0e0e",border:"1px solid #161616",borderRadius:16,padding:"22px 18px",textAlign:"center"}}>
                <div style={{width:48,height:48,borderRadius:"50%",background:"#141414",border:"1px solid #222",margin:"0 auto 12px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>👤</div>
                <div style={{fontWeight:600,fontSize:14,marginBottom:3}}>{p.name}</div>
                <div style={{color:"#444",fontSize:13}}>{p.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <footer style={{borderTop:"1px solid #0e0e0e",padding:"28px 5%",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <Logo/><span style={{color:"#222",fontSize:13}}>Helping the next generation find their direction.</span>
      </footer>
    </div>
  );
}

// ── AppContent ────────────────────────────────────────────────
// ── Dashboard ─────────────────────────────────────────────────
function Dashboard({onBack,onChat}){
  const{user}=useUser();
  const[results,setResults]=useState([]);
  const[loading,setLoading]=useState(true);
  const[selected,setSelected]=useState(null);
  const rl={R:"Realistic",I:"Investigative",A:"Artistic",S:"Social",E:"Enterprising",C:"Conventional"};

  useEffect(()=>{
    async function load(){
      if(!user)return;
      try{
        const{data,error}=await supabase.from("quiz_results").select("*").eq("user_id",user.id).order("created_at",{ascending:false});
        if(!error)setResults(data||[]);
      }catch(e){console.error(e);}
      setLoading(false);
    }
    load();
  },[user]);

  return(
    <div style={{background:"#080808",minHeight:"100vh",color:"#fff"}}>
      <style>{G}</style>
      <nav style={{padding:"0 5%",height:64,display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:"1px solid #111"}}>
        <Logo/>
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          <Btn variant="secondary" onClick={onBack} style={{padding:"8px 18px",fontSize:13}}>← Home</Btn>
          <UserButton afterSignOutUrl="#" appearance={{elements:{avatarBox:{width:34,height:34}}}}/>
        </div>
      </nav>

      <div style={{maxWidth:860,margin:"0 auto",padding:"48px 5%"}}>
        {/* Header */}
        <div style={{marginBottom:40}}>
          <Pill style={{marginBottom:16}}>My Dashboard</Pill>
          <h1 style={{fontWeight:800,fontSize:"clamp(28px,4vw,44px)",letterSpacing:-2,marginTop:12,marginBottom:8}}>
            Welcome back{user?.firstName?`, ${user.firstName}`:""}. 👋
          </h1>
          <p style={{color:"#444",fontSize:15}}>Here are your past career discovery results.</p>
        </div>

        {loading&&(
          <div style={{textAlign:"center",padding:"60px 0",color:"#333",fontSize:15}}>Loading your results...</div>
        )}

        {!loading&&results.length===0&&(
          <div style={{background:"#0e0e0e",border:"1px solid #141414",borderRadius:24,padding:"60px 40px",textAlign:"center"}}>
            <div style={{fontSize:48,marginBottom:16}}>🔍</div>
            <h3 style={{fontWeight:700,fontSize:22,marginBottom:10}}>No results yet</h3>
            <p style={{color:"#444",fontSize:15,marginBottom:28}}>Take the career quiz to discover your personality type and top career matches.</p>
            <Btn onClick={onBack}>Take the Quiz →</Btn>
          </div>
        )}

        {!loading&&results.length>0&&(
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            {results.map((r,i)=>{
              const isOpen=selected===i;
              const careers=Array.isArray(r.career_matches)?r.career_matches:[];
              const riasec=r.riasec||{};
              const topVals=Array.isArray(r.top_values)?r.top_values:[];
              const date=new Date(r.created_at).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"});
              return(
                <div key={r.id} style={{background:"#0e0e0e",border:`1px solid ${isOpen?"#FF6B3544":"#141414"}`,borderRadius:20,overflow:"hidden",transition:"border-color 0.3s"}}>
                  {/* Row header */}
                  <button onClick={()=>setSelected(isOpen?null:i)} style={{width:"100%",background:"none",border:"none",cursor:"pointer",padding:"22px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:16,textAlign:"left"}}>
                    <div style={{display:"flex",alignItems:"center",gap:16,flex:1,minWidth:0}}>
                      <div style={{width:48,height:48,borderRadius:14,background:"#FF6B3520",border:"1px solid #FF6B3540",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                        <span style={{color:"#FF6B35",fontWeight:800,fontSize:13}}>{r.personality_code||"?"}</span>
                      </div>
                      <div style={{minWidth:0}}>
                        <div style={{fontWeight:700,fontSize:16,color:"#f0f0f0",marginBottom:3}}>{r.personality_code} — Career Personality</div>
                        <div style={{color:"#444",fontSize:13}}>{date} · {careers.length} career matches</div>
                      </div>
                    </div>
                    <div style={{display:"flex",gap:8,alignItems:"center",flexShrink:0}}>
                      {careers.slice(0,2).map(c=><span key={c.name||c.id} style={{background:"#141414",border:"1px solid #1e1e1e",color:"#555",fontSize:11,borderRadius:999,padding:"3px 10px",display:"none"}}>{c.name}</span>)}
                      <span style={{color:"#444",fontSize:18,transition:"transform 0.3s",transform:isOpen?"rotate(180deg)":"rotate(0deg)"}}>⌄</span>
                    </div>
                  </button>

                  {/* Expanded content */}
                  {isOpen&&(
                    <div style={{padding:"0 24px 28px",borderTop:"1px solid #141414"}}>
                      {/* Top values */}
                      {topVals.length>0&&(
                        <div style={{marginTop:20,marginBottom:20}}>
                          <div style={{color:"#FF6B35",fontSize:11,letterSpacing:2,textTransform:"uppercase",fontWeight:600,marginBottom:10}}>Top Values</div>
                          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                            {topVals.map(v=><span key={v} style={{background:"#FF6B3515",border:"1px solid #FF6B3530",color:"#FF6B35",fontSize:12,borderRadius:999,padding:"4px 12px",fontWeight:500}}>{v}</span>)}
                          </div>
                        </div>
                      )}

                      {/* RIASEC */}
                      {Object.keys(riasec).length>0&&(
                        <div style={{marginBottom:20}}>
                          <div style={{color:"#FF6B35",fontSize:11,letterSpacing:2,textTransform:"uppercase",fontWeight:600,marginBottom:12}}>Interest Profile</div>
                          {Object.entries(riasec).map(([c,s])=>(
                            <div key={c} style={{display:"flex",alignItems:"center",gap:12,marginBottom:8}}>
                              <span style={{color:"#444",fontSize:12,width:90,flexShrink:0}}>{rl[c]||c}</span>
                              <div style={{flex:1,height:3,background:"#141414",borderRadius:999,overflow:"hidden"}}>
                                <div style={{height:"100%",background:s>=70?"#FF6B35":s>=50?"#FF6B3580":"#222",borderRadius:999,width:`${s}%`,transition:"width 1s ease"}}/>
                              </div>
                              <span style={{color:"#333",fontSize:12,width:28,textAlign:"right"}}>{s}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Career matches */}
                      {careers.length>0&&(
                        <div style={{marginBottom:20}}>
                          <div style={{color:"#FF6B35",fontSize:11,letterSpacing:2,textTransform:"uppercase",fontWeight:600,marginBottom:12}}>Top Career Matches</div>
                          <div style={{display:"flex",flexDirection:"column",gap:10}}>
                            {careers.map((c,j)=>{
                              const fullCareer=CAREERS.find(x=>x.id===c.id||x.name===c.name);
                              return(
                                <div key={j} style={{background:"#141414",border:"1px solid #1a1a1a",borderRadius:14,padding:"16px 18px",display:"flex",gap:14,alignItems:"flex-start"}}>
                                  <div style={{flexShrink:0,textAlign:"center",minWidth:52}}>
                                    <div style={{fontWeight:800,fontSize:18,color:"#FF6B35"}}>{c.score}</div>
                                    <div style={{color:"#333",fontSize:10}}>/100</div>
                                  </div>
                                  <div style={{flex:1}}>
                                    <div style={{fontWeight:600,fontSize:15,marginBottom:3}}>{c.name}</div>
                                    {fullCareer&&<p style={{color:"#444",fontSize:13,lineHeight:1.5,marginBottom:6}}>{fullCareer.description}</p>}
                                    {fullCareer&&<div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                                      {fullCareer.fields.map(f=><span key={f} style={{background:"#1a1a1a",border:"1px solid #222",color:"#444",fontSize:11,borderRadius:999,padding:"2px 8px"}}>{f}</span>)}
                                    </div>}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div style={{display:"flex",gap:10,flexWrap:"wrap",marginTop:8}}>
                        <Btn onClick={()=>onChat({code:r.personality_code,topCareers:careers.map(c=>c.name).join(", "),topValues:topVals.join(", ")})} style={{padding:"10px 20px",fontSize:13}}>Talk to Aria about this →</Btn>
                        <Btn variant="secondary" onClick={onBack} style={{padding:"10px 20px",fontSize:13}}>Retake Quiz</Btn>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function AppContent(){
  const{isSignedIn,isLoaded,user}=useUser();
  const[authMode,setAuthMode]=useState(null);
  if(!isLoaded)return(<div style={{background:"#080808",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}}><style>{G}</style><div style={{color:"#FF6B35",fontSize:15}}>Loading...</div></div>);
  if(authMode==="sign-in")return<AuthPage mode="sign-in"/>;
  if(authMode==="sign-up")return<AuthPage mode="sign-up"/>;
  return<Pathways isSignedIn={isSignedIn} userId={user?.id} onSignIn={()=>setAuthMode("sign-in")} onSignUp={()=>setAuthMode("sign-up")}/>;
}

export default function App(){
  return<ClerkProvider publishableKey={CLERK_KEY}><AppContent/></ClerkProvider>;
}

// ── Pathway Visualization SVG ─────────────────────────────────
function PathwayViz(){
  const nodes=[
    {x:50,y:50,label:"YOU",size:14,main:true},
    {x:20,y:20,label:"Tech",size:8},{x:80,y:20,label:"Health",size:8},
    {x:10,y:50,label:"Law",size:8},{x:90,y:50,label:"Science",size:8},
    {x:20,y:80,label:"Arts",size:8},{x:80,y:80,label:"Business",size:8},
  ];
  return(
    <svg viewBox="0 0 100 100" style={{width:"100%",height:"100%",opacity:0.35}} preserveAspectRatio="xMidYMid meet">
      {nodes.slice(1).map((n,i)=>(
        <line key={i} x1="50" y1="50" x2={n.x} y2={n.y} stroke="#FF6B35" strokeWidth="0.3" strokeDasharray="1,2" opacity="0.5"/>
      ))}
      {nodes.map((n,i)=>(
        <g key={i}>
          <circle cx={n.x} cy={n.y} r={n.size} fill={n.main?"#FF6B35":"#FF6B3520"} stroke={n.main?"#FF6B35":"#FF6B3560"} strokeWidth="0.5"
            style={{animation:`pulse-slow ${2+i*0.3}s ease-in-out infinite`,transformOrigin:`${n.x}px ${n.y}px`}}/>
          {!n.main&&<text x={n.x} y={n.y+0.5} textAnchor="middle" dominantBaseline="middle" fill="#FF6B35" fontSize="3.5" fontWeight="600" opacity="0.8">{n.label}</text>}
          {n.main&&<text x={n.x} y={n.y+0.5} textAnchor="middle" dominantBaseline="middle" fill="#fff" fontSize="4" fontWeight="800">YOU</text>}
        </g>
      ))}
    </svg>
  );
}

// ── Career Preview Cards ──────────────────────────────────────
function CareerPreviewCard({career}){
  const[hov,setHov]=useState(false);
  return(
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{background:"#0e0e0e",border:`1px solid ${hov?"#FF6B3544":"#141414"}`,borderRadius:20,padding:"24px 22px",transition:"all 0.3s ease",transform:hov?"translateY(-4px)":"translateY(0)",boxShadow:hov?"0 16px 48px #00000060":"none",cursor:"default",flex:1,minWidth:220}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
        <div>
          <div style={{fontWeight:700,fontSize:16,color:"#f0f0f0",marginBottom:4}}>{career.name}</div>
          <div style={{color:"#444",fontSize:12}}>{career.fields[0]}</div>
        </div>
        <span style={{color:"#FF6B35",fontSize:18,transition:"transform 0.3s",transform:hov?"translateX(3px)":"translateX(0)"}}>→</span>
      </div>
      <p style={{color:"#444",fontSize:13,lineHeight:1.6,marginBottom:14}}>{career.description}</p>
      <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
        {career.skills?.slice(0,3).map(s=><span key={s} style={{background:"#141414",border:"1px solid #1e1e1e",color:"#555",fontSize:11,borderRadius:999,padding:"3px 10px"}}>{s}</span>)}
      </div>
      {hov&&<div style={{marginTop:14,paddingTop:14,borderTop:"1px solid #1a1a1a"}}>
        <div style={{color:"#FF6B35",fontSize:11,fontWeight:600,letterSpacing:0.5,textTransform:"uppercase",marginBottom:6}}>Try This</div>
        <p style={{color:"#555",fontSize:12,lineHeight:1.5}}>{career.explorationActivities[0]}</p>
      </div>}
    </div>
  );
}

// ── Main Home ─────────────────────────────────────────────────
function Pathways({isSignedIn,userId,onSignIn,onSignUp}){
  const[page,setPage]=useState("home");
  const[step,setStep]=useState("intro");
  const[result,setResult]=useState(null);
  const[ctx,setCtx]=useState(null);
  const[scrollY,setScrollY]=useState(0);
  const[heroRef,heroInView]=useInView(0.1);
  const[howRef,howInView]=useInView(0.1);
  const[prevRef,prevInView]=useInView(0.1);
  const[ctaRef,ctaInView]=useInView(0.1);

  useEffect(()=>{const s=()=>setScrollY(window.scrollY);window.addEventListener("scroll",s);return()=>window.removeEventListener("scroll",s);},[]);

  if(page==="ourstory")return<OurStory onBack={()=>setPage("home")}/>;
  if(page==="talktous")return<TalkToUs onBack={()=>setPage("home")} initialContext={ctx}/>;
  if(page==="dashboard")return<Dashboard onBack={()=>setPage("home")} onChat={(c)=>{setCtx(c);setPage("talktous");}}/>;

  const scrollTo=id=>document.getElementById(id)?.scrollIntoView({behavior:"smooth"});

  async function handleQuizComplete(answers){
    const r=calculatePersonality(answers);
    setResult(r);setStep("result");
    if(isSignedIn&&userId){
      try{await supabase.from("quiz_results").insert({user_id:userId,personality_code:r.code,personality_name:r.code,riasec:r.riasec,top_values:r.topValues,career_matches:r.careerMatches.slice(0,3).map(c=>({id:c.id,name:c.name,score:c.score}))});}
      catch(e){console.error("Save failed:",e);}
    }
  }

  function handleChat(){
    if(result)setCtx({code:result.code,topCareers:result.careerMatches.slice(0,3).map(c=>c.name).join(", "),topValues:result.topValues.join(", ")});
    setPage("talktous");
  }

  const previewCareers=["career_software_engineer","career_ux_designer","career_biomedical_researcher","career_entrepreneur"].map(id=>CAREERS.find(c=>c.id===id)).filter(Boolean);

  return(
    <div style={{background:"#080808",minHeight:"100vh",color:"#fff",overflowX:"hidden"}}>
      <style>{G}</style>

      {/* NAV */}
      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:100,padding:"0 5%",height:64,display:"flex",alignItems:"center",justifyContent:"space-between",background:scrollY>40?"rgba(8,8,8,0.92)":"transparent",backdropFilter:scrollY>40?"blur(20px)":"none",borderBottom:scrollY>40?"1px solid #111":"none",transition:"all 0.4s ease"}}>
        <Logo/>
        <div style={{display:"flex",gap:28,alignItems:"center"}}>
          {[["How It Works","howitworks"],["Our Story","ourstory"],["Want Help?","talktous"]].map(([l,t])=>(
            <a key={l} href="#" onClick={e=>{e.preventDefault();t==="ourstory"?setPage("ourstory"):t==="talktous"?setPage("talktous"):scrollTo(t);}}
              style={{color:"#555",fontSize:14,fontWeight:500,textDecoration:"none",transition:"color 0.2s"}}
              onMouseEnter={e=>e.currentTarget.style.color="#fff"} onMouseLeave={e=>e.currentTarget.style.color="#555"}>{l}</a>
          ))}
          {isSignedIn?(
            <div style={{display:"flex",gap:10,alignItems:"center"}}>
              <Btn variant="ghost" onClick={()=>setPage("dashboard")} style={{padding:"8px 16px",fontSize:13,color:"#555"}}>My Results</Btn>
              <UserButton afterSignOutUrl="#" appearance={{elements:{avatarBox:{width:34,height:34}}}}/>
            </div>
          ):(
            <div style={{display:"flex",gap:8}}>
              <Btn variant="secondary" onClick={onSignIn} style={{padding:"8px 18px",fontSize:13}}>Log In</Btn>
              <Btn onClick={onSignUp} style={{padding:"8px 18px",fontSize:13}}>Sign Up →</Btn>
            </div>
          )}
        </div>
      </nav>

      {/* HERO */}
      <section style={{minHeight:"100vh",display:"flex",alignItems:"center",padding:"100px 5% 60px",position:"relative",overflow:"hidden"}}>
        {/* Background glow */}
        <div style={{position:"absolute",top:"30%",left:"50%",transform:"translate(-50%,-50%)",width:600,height:600,borderRadius:"50%",background:"radial-gradient(circle,rgba(255,107,53,0.06) 0%,transparent 70%)",pointerEvents:"none"}}/>
        {/* Animated dots */}
        {[...Array(6)].map((_,i)=>(
          <div key={i} style={{position:"absolute",width:2,height:2,borderRadius:"50%",background:"#FF6B35",opacity:0.3,left:`${15+i*14}%`,top:`${20+Math.sin(i)*30}%`,animation:`float ${3+i*0.5}s ease-in-out infinite`,animationDelay:`${i*0.4}s`,pointerEvents:"none"}}/>
        ))}

        <div style={{display:"flex",alignItems:"center",width:"100%",gap:60,maxWidth:1200,margin:"0 auto"}}>
          {/* Left: text */}
          <div style={{flex:"0 0 55%",maxWidth:"55%"}} ref={heroRef}>
            <div style={{marginBottom:24,opacity:heroInView?1:0,transform:heroInView?"translateY(0)":"translateY(20px)",transition:"all 0.7s ease 0.1s"}}>
              <Pill>Career discovery built for your generation</Pill>
            </div>
            <h1 style={{fontWeight:900,fontSize:"clamp(48px,6.5vw,88px)",lineHeight:0.95,letterSpacing:-3,marginBottom:24,opacity:heroInView?1:0,transform:heroInView?"translateY(0)":"translateY(30px)",transition:"all 0.7s ease 0.2s"}}>
              Stop picking<br/><span style={{color:"#FF6B35",display:"inline-block"}}>careers</span><br/>in the dark.
            </h1>
            <p style={{color:"#555",fontSize:"clamp(15px,1.8vw,18px)",lineHeight:1.75,maxWidth:480,marginBottom:36,fontWeight:400,opacity:heroInView?1:0,transform:heroInView?"translateY(0)":"translateY(20px)",transition:"all 0.7s ease 0.3s"}}>
              Most students choose their future based on salary or parental advice — without ever living a day in that field. Pathways changes that.
            </p>
            <div style={{display:"flex",gap:12,flexWrap:"wrap",opacity:heroInView?1:0,transform:heroInView?"translateY(0)":"translateY(20px)",transition:"all 0.7s ease 0.4s"}}>
              <Btn onClick={()=>scrollTo("quiz")} style={{padding:"14px 32px",fontSize:16}}>Find My Path →</Btn>
              <Btn variant="secondary" onClick={()=>scrollTo("howitworks")} style={{padding:"14px 24px",fontSize:15}}>See How It Works</Btn>
            </div>
            {/* Not a personality test */}
            <div style={{display:"flex",gap:16,marginTop:40,flexWrap:"wrap",opacity:heroInView?1:0,transition:"all 0.7s ease 0.5s"}}>
              {["Not a personality test.","Not a list of random careers.","Built around you."].map(t=>(
                <div key={t} style={{display:"flex",alignItems:"center",gap:6}}>
                  <div style={{width:16,height:16,borderRadius:"50%",background:"#FF6B3520",border:"1px solid #FF6B3550",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:"#FF6B35",flexShrink:0}}>✓</div>
                  <span style={{color:"#444",fontSize:13,fontWeight:500}}>{t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: viz */}
          <div style={{flex:1,height:380,position:"relative",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <div style={{width:"100%",maxWidth:360,height:360,position:"relative"}}>
              <div style={{position:"absolute",inset:0,borderRadius:"50%",background:"radial-gradient(circle,rgba(255,107,53,0.04) 0%,transparent 70%)"}}/>
              <PathwayViz/>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"0 5%",borderTop:"1px solid #0e0e0e"}}>
          <div style={{maxWidth:1200,margin:"0 auto",display:"flex",gap:0}}>
            {[{n:"25+",l:"Career Paths"},{n:"5",l:"Discovery Sections"},{n:"15+",l:"Opportunities Matched"}].map((s,i)=>(
              <div key={s.l} style={{flex:1,padding:"20px 0",paddingRight:40,borderRight:i<2?"1px solid #0e0e0e":"none",paddingLeft:i>0?40:0}}>
                <div style={{fontWeight:800,fontSize:32,letterSpacing:-1,color:"#fff"}}>{s.n}</div>
                <div style={{color:"#333",fontSize:13,marginTop:2,fontWeight:500}}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="howitworks" style={{padding:"100px 5%",borderTop:"1px solid #0e0e0e"}}>
        <div ref={howRef} style={{maxWidth:1100,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:64,opacity:howInView?1:0,transform:howInView?"translateY(0)":"translateY(24px)",transition:"all 0.8s ease"}}>
            <Pill style={{marginBottom:20}}>How It Works</Pill>
            <h2 style={{fontWeight:800,fontSize:"clamp(32px,5vw,56px)",letterSpacing:-2,lineHeight:1.1,marginTop:16,marginBottom:16}}>Your future shouldn't<br/>be a <span style={{color:"#FF6B35"}}>guess.</span></h2>
            <p style={{color:"#444",fontSize:16,maxWidth:500,margin:"0 auto",lineHeight:1.7}}>Pathways considers your interests, experience, work style, and what you're actually willing to try.</p>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:16}}>
            {[
              {n:"01",icon:"🔍",title:"Discover",desc:"Answer questions about what interests you, how you think, and what you actually enjoy doing."},
              {n:"02",icon:"⚡",title:"Match",desc:"Pathways analyzes your answers against 25+ career profiles using your RIASEC personality type."},
              {n:"03",icon:"🌍",title:"Explore",desc:"See what careers actually look like — skills, education, work environment, and real opportunities."},
              {n:"04",icon:"🗺️",title:"Choose Your Path",desc:"Walk away with a 30-day roadmap, matched opportunities, and a clearer direction for your future."},
            ].map((s,i)=>(
              <div key={s.n} style={{background:"#0a0a0a",border:"1px solid #111",borderRadius:20,padding:"32px 28px",opacity:howInView?1:0,transform:howInView?"translateY(0)":"translateY(30px)",transition:`all 0.7s ease ${i*0.12}s`}}>
                <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
                  <div style={{width:40,height:40,borderRadius:12,background:"#FF6B3518",border:"1px solid #FF6B3530",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{s.icon}</div>
                  <span style={{color:"#333",fontSize:12,fontWeight:700,letterSpacing:1}}>{s.n}</span>
                </div>
                <h3 style={{fontWeight:700,fontSize:22,marginBottom:10,letterSpacing:-0.5}}>{s.title}</h3>
                <p style={{color:"#444",fontSize:14,lineHeight:1.7}}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT PATHWAYS CONSIDERS */}
      <section style={{padding:"80px 5%",background:"#050505"}}>
        <div style={{maxWidth:1100,margin:"0 auto",display:"flex",gap:60,alignItems:"center",flexWrap:"wrap"}}>
          <div style={{flex:"0 0 40%",minWidth:280}}>
            <Pill style={{marginBottom:20}}>What We Consider</Pill>
            <h2 style={{fontWeight:800,fontSize:"clamp(28px,4vw,44px)",letterSpacing:-1.5,lineHeight:1.1,marginTop:16,marginBottom:16}}>Not just what<br/>you <span style={{color:"#FF6B35"}}>like.</span><br/>What fits <span style={{color:"#FF6B35"}}>you.</span></h2>
            <p style={{color:"#444",fontSize:15,lineHeight:1.7}}>Most career quizzes stop at interests. Pathways goes further — matching you based on how you actually want to work.</p>
          </div>
          <div style={{flex:1,display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {[["🧠","Interests","What you genuinely enjoy"],["💼","Experience","What you've actually done"],["⚙️","Work Style","How you like to work"],["🎯","Preferences","What matters in a career"],["⚡","Reality","What you can handle day-to-day"],["🔬","Exploration","What you'd be willing to try"]].map(([icon,label,desc])=>(
              <div key={label} style={{background:"#0e0e0e",border:"1px solid #141414",borderRadius:16,padding:"18px 16px",display:"flex",gap:12,alignItems:"flex-start"}}>
                <div style={{width:34,height:34,borderRadius:10,background:"#FF6B3518",border:"1px solid #FF6B3530",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{icon}</div>
                <div>
                  <div style={{fontWeight:600,fontSize:14,marginBottom:3}}>{label}</div>
                  <div style={{color:"#444",fontSize:12,lineHeight:1.5}}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CAREER PREVIEW */}
      <section style={{padding:"100px 5%"}}>
        <div style={{maxWidth:1100,margin:"0 auto"}} ref={prevRef}>
          <div style={{textAlign:"center",marginBottom:52,opacity:prevInView?1:0,transform:prevInView?"translateY(0)":"translateY(24px)",transition:"all 0.8s ease"}}>
            <Pill style={{marginBottom:20}}>Example Results</Pill>
            <h2 style={{fontWeight:800,fontSize:"clamp(28px,4vw,48px)",letterSpacing:-2,lineHeight:1.1,marginTop:16,marginBottom:14}}>Don't just get a career.<br/>Get a <span style={{color:"#FF6B35"}}>direction.</span></h2>
            <p style={{color:"#444",fontSize:15,maxWidth:480,margin:"0 auto",lineHeight:1.7}}>Here's a preview of the career cards you'll receive. Take the quiz to see which ones match you.</p>
          </div>
          <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>
            {previewCareers.map((c,i)=>(
              <div key={c.id} style={{opacity:prevInView?1:0,transform:prevInView?"translateY(0)":"translateY(30px)",transition:`all 0.7s ease ${i*0.1}s`,flex:"1 1 200px"}}>
                <CareerPreviewCard career={c}/>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QUIZ SECTION */}
      <section id="quiz" style={{padding:"80px 5% 100px",background:"#050505"}}>
        {step==="intro"&&(
          <div ref={ctaRef} style={{maxWidth:700,margin:"0 auto",textAlign:"center",opacity:ctaInView?1:0,transform:ctaInView?"translateY(0)":"translateY(24px)",transition:"all 0.8s ease"}}>
            <div style={{background:"radial-gradient(ellipse at center,rgba(255,107,53,0.08) 0%,transparent 70%)",borderRadius:32,padding:"60px 40px",border:"1px solid #111",boxShadow:"0 40px 80px #00000060"}}>
              <Pill style={{marginBottom:20}}>Take the Quiz</Pill>
              <h2 style={{fontWeight:800,fontSize:"clamp(30px,5vw,52px)",letterSpacing:-2,lineHeight:1.05,marginTop:16,marginBottom:16}}>Your future has<br/>more than one <span style={{color:"#FF6B35"}}>path.</span></h2>
              <p style={{color:"#555",fontSize:16,lineHeight:1.7,maxWidth:480,margin:"0 auto 36px"}}>You don't need to know exactly what you want to do yet. You just need to start exploring.</p>
              <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap",marginBottom:36}}>
                {[["📋","57 Questions"],["⏱️","~8 Minutes"],["🎯","25+ Careers"],["🚀","Instant Results"]].map(([i,l])=>(
                  <div key={l} style={{background:"#0e0e0e",border:"1px solid #141414",borderRadius:999,padding:"8px 16px",display:"flex",alignItems:"center",gap:6}}>
                    <span style={{fontSize:14}}>{i}</span><span style={{color:"#555",fontSize:13,fontWeight:500}}>{l}</span>
                  </div>
                ))}
              </div>
              <Btn onClick={()=>setStep("quiz")} style={{padding:"16px 40px",fontSize:16}}>Find My Path →</Btn>
            </div>
          </div>
        )}
        {step==="quiz"&&<QuizFlow onComplete={handleQuizComplete}/>}
        {step==="result"&&result&&<ResultsView result={result} onRetake={()=>{setStep("intro");setResult(null);}} onChat={handleChat}/>}
      </section>

      {/* PROBLEM SECTION */}
      <section style={{padding:"80px 5%"}}>
        <div style={{maxWidth:1000,margin:"0 auto"}}>
          <div style={{marginBottom:32}}>
            <Pill style={{marginBottom:16}}>The Problem We're Solving</Pill>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:32}}>
            {[{l:"Pick classes for friends, not fit",i:"👥"},{l:"Choose majors for salary alone",i:"💰"},{l:"No idea what internships exist",i:"🔍"},{l:"Never lived a day in their future field",i:"📆"},{l:"Doing work, but losing curiosity",i:"📉"},{l:"No one sees the middle group",i:"🫥"}].map(p=>(
              <div key={p.l} style={{background:"#0a0a0a",border:"1px solid #0e0e0e",borderRadius:14,padding:"18px 20px",display:"flex",alignItems:"center",gap:14}}>
                <span style={{fontSize:20}}>{p.i}</span><span style={{color:"#444",fontSize:14,lineHeight:1.5}}>{p.l}</span>
              </div>
            ))}
          </div>
          <div style={{background:"linear-gradient(135deg,#FF6B35,#e05a28)",borderRadius:20,padding:"28px 32px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:20,boxShadow:"0 20px 60px #FF6B3530"}}>
            <div>
              <div style={{fontWeight:800,fontSize:24,marginBottom:4}}>Pathways fixes all of this.</div>
              <div style={{color:"rgba(255,255,255,0.7)",fontSize:14}}>One platform. Built for students who want real answers.</div>
            </div>
            <Btn variant="secondary" onClick={()=>scrollTo("quiz")} style={{borderColor:"rgba(255,255,255,0.3)",color:"#fff",padding:"12px 28px"}}>Start the Quiz →</Btn>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{borderTop:"1px solid #0a0a0a",padding:"48px 5% 32px"}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:40,flexWrap:"wrap",gap:32}}>
            <div style={{maxWidth:280}}>
              <Logo/>
              <p style={{color:"#333",fontSize:14,lineHeight:1.7,marginTop:14}}>Career discovery built for your generation.</p>
            </div>
            <div style={{display:"flex",gap:48,flexWrap:"wrap"}}>
              <div>
                <div style={{color:"#555",fontSize:12,fontWeight:600,letterSpacing:1,textTransform:"uppercase",marginBottom:16}}>Navigate</div>
                {[["How It Works",()=>scrollTo("howitworks")],["Our Story",()=>setPage("ourstory")],["Find My Path",()=>scrollTo("quiz")],["Talk to Aria",()=>setPage("talktous")]].map(([l,fn])=>(
                  <div key={l} style={{marginBottom:10}}>
                    <a href="#" onClick={e=>{e.preventDefault();fn();}} style={{color:"#333",fontSize:14,textDecoration:"none",transition:"color 0.2s"}}
                      onMouseEnter={e=>e.currentTarget.style.color="#fff"} onMouseLeave={e=>e.currentTarget.style.color="#333"}>{l}</a>
                  </div>
                ))}
              </div>
              <div>
                <div style={{color:"#555",fontSize:12,fontWeight:600,letterSpacing:1,textTransform:"uppercase",marginBottom:16}}>Legal</div>
                {[["Privacy Policy","#"],["Terms of Use","#"]].map(([l,h])=>(
                  <div key={l} style={{marginBottom:10}}>
                    <a href={h} style={{color:"#333",fontSize:14,textDecoration:"none"}}
                      onMouseEnter={e=>e.currentTarget.style.color="#fff"} onMouseLeave={e=>e.currentTarget.style.color="#333"}>{l}</a>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={{borderTop:"1px solid #0a0a0a",paddingTop:24,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
            <span style={{color:"#222",fontSize:13}}>© 2026 Pathways. All rights reserved.</span>
            <span style={{color:"#222",fontSize:13}}>Helping the next generation find their direction.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}