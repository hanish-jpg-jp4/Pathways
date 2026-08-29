import { useState, useEffect, useRef } from "react";
import { ClerkProvider, SignIn, SignUp, useUser, UserButton } from "@clerk/clerk-react";
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
  {
    id: "career_software_engineer",
    name: "Software Engineer",
    fields: ["technology", "computer science"],
    description: "Designs, builds, and maintains software systems and applications.",
    riasec: { R:55, I:95, A:65, S:40, E:55, C:65 },
    reality: { academicDifficulty:75, competition:70, workPressure:60, computerTime:95, teamwork:65, independentWork:80, routine:40, creativity:70 },
    workEnvironment: { handsOn:30, peopleInteraction:45, computerBased:95, remotePotential:90 },
    explorationActivities: ["Build a simple app or website", "Learn Python or JavaScript online", "Contribute to an open source project", "Create a personal project to solve a problem you have"],
    relatedCareers: ["career_data_scientist", "career_cybersecurity_analyst", "career_ux_designer"],
    tags: ["tech", "coding", "remote-friendly", "high-salary"]
  },
  {
    id: "career_data_scientist",
    name: "Data Scientist",
    fields: ["technology", "mathematics", "research"],
    description: "Uses statistics, programming, and analytical methods to extract insights from data.",
    riasec: { R:25, I:100, A:45, S:35, E:45, C:80 },
    reality: { academicDifficulty:85, competition:75, workPressure:55, computerTime:95, teamwork:55, independentWork:85, routine:40, creativity:55 },
    workEnvironment: { handsOn:20, peopleInteraction:40, computerBased:95, remotePotential:85 },
    explorationActivities: ["Analyze a dataset using Excel or Google Sheets", "Take a free statistics course online", "Explore Kaggle beginner datasets", "Build a simple chart or visualization from real data"],
    relatedCareers: ["career_software_engineer", "career_research_scientist", "career_financial_analyst"],
    tags: ["tech", "math", "research", "high-salary"]
  },
  {
    id: "career_physician",
    name: "Physician",
    fields: ["healthcare", "medicine"],
    description: "Diagnoses and treats patients, helping manage their overall health.",
    riasec: { R:35, I:95, A:30, S:90, E:55, C:65 },
    reality: { academicDifficulty:95, competition:85, workPressure:95, computerTime:55, teamwork:80, independentWork:60, routine:35, creativity:45 },
    workEnvironment: { handsOn:75, peopleInteraction:95, computerBased:45, remotePotential:15 },
    explorationActivities: ["Shadow a doctor at a clinic or hospital", "Volunteer at a healthcare facility", "Take a first aid or CPR course", "Interview a physician about their daily routine"],
    relatedCareers: ["career_nurse", "career_biomedical_researcher", "career_psychologist"],
    tags: ["healthcare", "helping", "high-salary", "long-training"]
  },
  {
    id: "career_nurse",
    name: "Registered Nurse",
    fields: ["healthcare", "medicine"],
    description: "Provides patient care, administers treatments, and coordinates with medical teams.",
    riasec: { R:45, I:65, A:35, S:95, E:45, C:60 },
    reality: { academicDifficulty:70, competition:55, workPressure:85, computerTime:45, teamwork:90, independentWork:50, routine:55, creativity:35 },
    workEnvironment: { handsOn:85, peopleInteraction:95, computerBased:40, remotePotential:10 },
    explorationActivities: ["Volunteer at a hospital or nursing home", "Shadow a nurse for a day", "Take a CNA (Certified Nursing Assistant) course", "Join a health-related club at school"],
    relatedCareers: ["career_physician", "career_psychologist", "career_physical_therapist"],
    tags: ["healthcare", "helping", "hands-on", "stable"]
  },
  {
    id: "career_psychologist",
    name: "Psychologist",
    fields: ["healthcare", "social sciences"],
    description: "Studies human behavior and mental processes and helps people address challenges.",
    riasec: { R:15, I:85, A:50, S:100, E:45, C:45 },
    reality: { academicDifficulty:80, competition:65, workPressure:70, computerTime:45, teamwork:55, independentWork:70, routine:45, creativity:55 },
    workEnvironment: { handsOn:25, peopleInteraction:90, computerBased:40, remotePotential:60 },
    explorationActivities: ["Read an introductory psychology book", "Take a free psychology course online", "Volunteer at a mental health awareness event", "Interview a counselor or therapist about their work"],
    relatedCareers: ["career_social_worker", "career_physician", "career_teacher"],
    tags: ["helping", "research", "social", "graduate-degree"]
  },
  {
    id: "career_mechanical_engineer",
    name: "Mechanical Engineer",
    fields: ["engineering", "manufacturing"],
    description: "Designs, develops, and tests mechanical systems and products.",
    riasec: { R:90, I:85, A:55, S:35, E:55, C:65 },
    reality: { academicDifficulty:80, competition:60, workPressure:65, computerTime:70, teamwork:65, independentWork:70, routine:45, creativity:70 },
    workEnvironment: { handsOn:80, peopleInteraction:50, computerBased:65, remotePotential:40 },
    explorationActivities: ["Build something with basic materials", "Take a free CAD (computer-aided design) course", "Join a robotics or engineering club", "Shadow an engineer at a local company"],
    relatedCareers: ["career_civil_engineer", "career_robotics_engineer", "career_software_engineer"],
    tags: ["engineering", "hands-on", "building", "stable"]
  },
  {
    id: "career_civil_engineer",
    name: "Civil Engineer",
    fields: ["engineering", "construction"],
    description: "Designs and oversees construction of infrastructure like bridges, roads, and buildings.",
    riasec: { R:85, I:80, A:50, S:40, E:60, C:70 },
    reality: { academicDifficulty:75, competition:55, workPressure:70, computerTime:65, teamwork:70, independentWork:65, routine:50, creativity:60 },
    workEnvironment: { handsOn:75, peopleInteraction:55, computerBased:60, remotePotential:25 },
    explorationActivities: ["Visit a construction site with a professional", "Research how local bridges or buildings were designed", "Take a free structural engineering course online", "Build a bridge using household materials and test its strength"],
    relatedCareers: ["career_mechanical_engineer", "career_architect", "career_environmental_scientist"],
    tags: ["engineering", "building", "stable", "hands-on"]
  },
  {
    id: "career_architect",
    name: "Architect",
    fields: ["design", "engineering", "arts"],
    description: "Designs buildings and spaces, balancing aesthetics, function, and engineering.",
    riasec: { R:80, I:60, A:100, S:40, E:50, C:70 },
    reality: { academicDifficulty:75, competition:70, workPressure:75, computerTime:80, teamwork:60, independentWork:75, routine:30, creativity:100 },
    workEnvironment: { handsOn:55, peopleInteraction:55, computerBased:80, remotePotential:55 },
    explorationActivities: ["Sketch designs of buildings or spaces you'd want to create", "Take a free architectural drawing course", "Visit a local architecture firm or studio", "Design a room layout using a free tool like Planner 5D"],
    relatedCareers: ["career_civil_engineer", "career_ux_designer", "career_mechanical_engineer"],
    tags: ["creative", "design", "building", "art"]
  },
  {
    id: "career_ux_designer",
    name: "UX Designer",
    fields: ["technology", "design", "arts"],
    description: "Designs user interfaces and experiences for apps, websites, and digital products.",
    riasec: { R:40, I:65, A:95, S:65, E:55, C:55 },
    reality: { academicDifficulty:60, competition:70, workPressure:65, computerTime:90, teamwork:70, independentWork:70, routine:30, creativity:95 },
    workEnvironment: { handsOn:30, peopleInteraction:65, computerBased:90, remotePotential:85 },
    explorationActivities: ["Download Figma (free) and design a simple app screen", "Analyze the UX of an app you use daily", "Take a free UX design course on Google or Coursera", "Interview 3 people about how they use an app"],
    relatedCareers: ["career_software_engineer", "career_graphic_designer", "career_marketing_manager"],
    tags: ["creative", "tech", "design", "remote-friendly"]
  },
  {
    id: "career_graphic_designer",
    name: "Graphic Designer",
    fields: ["design", "arts", "media"],
    description: "Creates visual content for brands, media, marketing, and digital platforms.",
    riasec: { R:30, I:45, A:100, S:50, E:55, C:50 },
    reality: { academicDifficulty:55, competition:75, workPressure:60, computerTime:85, teamwork:55, independentWork:75, routine:25, creativity:100 },
    workEnvironment: { handsOn:35, peopleInteraction:50, computerBased:85, remotePotential:80 },
    explorationActivities: ["Create a logo or poster using Canva or Adobe Express (free)", "Redesign the logo of a brand you like", "Follow graphic designers on Behance or Dribbble", "Take a free graphic design course online"],
    relatedCareers: ["career_ux_designer", "career_marketing_manager", "career_architect"],
    tags: ["creative", "art", "design", "freelance-friendly"]
  },
  {
    id: "career_marketing_manager",
    name: "Marketing Manager",
    fields: ["business", "communications", "media"],
    description: "Develops strategies to promote products, services, and brands.",
    riasec: { R:15, I:50, A:90, S:75, E:95, C:55 },
    reality: { academicDifficulty:60, competition:70, workPressure:75, computerTime:70, teamwork:80, independentWork:60, routine:25, creativity:90 },
    workEnvironment: { handsOn:25, peopleInteraction:80, computerBased:70, remotePotential:70 },
    explorationActivities: ["Create a social media campaign for a cause you care about", "Analyze the marketing strategy of a brand you like", "Run a small promotion for a school club or event", "Take a free digital marketing course from Google"],
    relatedCareers: ["career_entrepreneur", "career_ux_designer", "career_journalist"],
    tags: ["business", "creative", "leadership", "social"]
  },
  {
    id: "career_entrepreneur",
    name: "Entrepreneur",
    fields: ["business", "leadership"],
    description: "Creates and grows businesses, products, or services from the ground up.",
    riasec: { R:45, I:60, A:70, S:70, E:100, C:45 },
    reality: { academicDifficulty:55, competition:90, workPressure:90, computerTime:60, teamwork:70, independentWork:90, routine:10, creativity:90 },
    workEnvironment: { handsOn:50, peopleInteraction:75, computerBased:60, remotePotential:70 },
    explorationActivities: ["Start a small side hustle (sell something, offer a service)", "Read about a founder you admire", "Participate in a startup or business competition", "Develop a business plan for an idea you have"],
    relatedCareers: ["career_marketing_manager", "career_software_engineer", "career_financial_analyst"],
    tags: ["leadership", "business", "risk", "freedom"]
  },
  {
    id: "career_teacher",
    name: "Teacher",
    fields: ["education", "social sciences"],
    description: "Educates students, develops curriculum, and fosters learning and growth.",
    riasec: { R:15, I:55, A:55, S:100, E:60, C:55 },
    reality: { academicDifficulty:60, competition:40, workPressure:75, computerTime:40, teamwork:75, independentWork:55, routine:65, creativity:70 },
    workEnvironment: { handsOn:50, peopleInteraction:100, computerBased:35, remotePotential:40 },
    explorationActivities: ["Tutor a younger student in a subject you're good at", "Volunteer at a local school or after-school program", "Teach a skill to a friend or family member", "Create a short lesson on something you know well"],
    relatedCareers: ["career_psychologist", "career_social_worker", "career_curriculum_designer"],
    tags: ["helping", "social", "stable", "impact"]
  },
  {
    id: "career_social_worker",
    name: "Social Worker",
    fields: ["social sciences", "healthcare"],
    description: "Helps individuals and families navigate challenges and access support services.",
    riasec: { R:15, I:55, A:40, S:100, E:55, C:50 },
    reality: { academicDifficulty:65, competition:40, workPressure:80, computerTime:40, teamwork:80, independentWork:60, routine:40, creativity:45 },
    workEnvironment: { handsOn:40, peopleInteraction:100, computerBased:35, remotePotential:35 },
    explorationActivities: ["Volunteer at a community center or shelter", "Shadow a social worker or case manager", "Research social issues in your community", "Interview someone who works in social services"],
    relatedCareers: ["career_psychologist", "career_teacher", "career_nurse"],
    tags: ["helping", "impact", "social", "community"]
  },
  {
    id: "career_financial_analyst",
    name: "Financial Analyst",
    fields: ["business", "finance", "mathematics"],
    description: "Analyzes financial data to guide investment decisions and business strategy.",
    riasec: { R:20, I:85, A:35, S:40, E:70, C:90 },
    reality: { academicDifficulty:75, competition:75, workPressure:80, computerTime:85, teamwork:55, independentWork:75, routine:55, creativity:40 },
    workEnvironment: { handsOn:15, peopleInteraction:55, computerBased:90, remotePotential:65 },
    explorationActivities: ["Track a stock portfolio (use a simulator — no real money)", "Read a book on personal finance", "Analyze the financials of a company you know", "Take a free accounting or finance course online"],
    relatedCareers: ["career_data_scientist", "career_entrepreneur", "career_economist"],
    tags: ["business", "math", "high-salary", "analytical"]
  },
  {
    id: "career_cybersecurity_analyst",
    name: "Cybersecurity Analyst",
    fields: ["technology", "computer science"],
    description: "Protects computer systems and networks from digital threats and attacks.",
    riasec: { R:60, I:90, A:40, S:35, E:45, C:80 },
    reality: { academicDifficulty:75, competition:70, workPressure:75, computerTime:90, teamwork:55, independentWork:80, routine:40, creativity:55 },
    workEnvironment: { handsOn:50, peopleInteraction:40, computerBased:90, remotePotential:80 },
    explorationActivities: ["Try a free cybersecurity challenge on Hack The Box or TryHackMe", "Learn what phishing attacks look like", "Take a free cybersecurity course on Coursera", "Research a famous cyberattack and how it happened"],
    relatedCareers: ["career_software_engineer", "career_data_scientist", "career_network_engineer"],
    tags: ["tech", "security", "high-salary", "remote-friendly"]
  },
  {
    id: "career_biomedical_researcher",
    name: "Biomedical Researcher",
    fields: ["science", "healthcare", "research"],
    description: "Conducts research to advance medicine and develop new treatments and technologies.",
    riasec: { R:50, I:100, A:40, S:55, E:40, C:65 },
    reality: { academicDifficulty:90, competition:85, workPressure:65, computerTime:70, teamwork:65, independentWork:80, routine:40, creativity:65 },
    workEnvironment: { handsOn:75, peopleInteraction:50, computerBased:65, remotePotential:30 },
    explorationActivities: ["Apply for a summer research program at a university", "Read a scientific paper about a topic you find interesting", "Shadow a researcher at a lab", "Enter a science fair with original research"],
    relatedCareers: ["career_physician", "career_research_scientist", "career_data_scientist"],
    tags: ["science", "research", "healthcare", "graduate-degree"]
  },
  {
    id: "career_research_scientist",
    name: "Research Scientist",
    fields: ["science", "research", "academia"],
    description: "Conducts original research to expand knowledge in a scientific field.",
    riasec: { R:45, I:100, A:50, S:45, E:40, C:70 },
    reality: { academicDifficulty:90, competition:80, workPressure:60, computerTime:75, teamwork:60, independentWork:85, routine:35, creativity:70 },
    workEnvironment: { handsOn:65, peopleInteraction:45, computerBased:70, remotePotential:45 },
    explorationActivities: ["Enter a science fair or research competition", "Find a university lab that accepts high school volunteers", "Read about a scientist whose work interests you", "Take an advanced science course or online seminar"],
    relatedCareers: ["career_biomedical_researcher", "career_data_scientist", "career_environmental_scientist"],
    tags: ["science", "research", "discovery", "graduate-degree"]
  },
  {
    id: "career_environmental_scientist",
    name: "Environmental Scientist",
    fields: ["science", "environment", "policy"],
    description: "Studies the environment and develops solutions to environmental problems.",
    riasec: { R:70, I:85, A:45, S:60, E:50, C:60 },
    reality: { academicDifficulty:70, competition:60, workPressure:55, computerTime:60, teamwork:65, independentWork:70, routine:40, creativity:60 },
    workEnvironment: { handsOn:75, peopleInteraction:55, computerBased:55, remotePotential:35 },
    explorationActivities: ["Volunteer for a local environmental cleanup", "Monitor air or water quality data in your area", "Read about a current environmental challenge", "Join or start an environmental club at school"],
    relatedCareers: ["career_research_scientist", "career_civil_engineer", "career_biomedical_researcher"],
    tags: ["science", "environment", "impact", "outdoor"]
  },
  {
    id: "career_journalist",
    name: "Journalist",
    fields: ["media", "communications", "writing"],
    description: "Investigates and reports on news, events, and stories for public audiences.",
    riasec: { R:20, I:70, A:85, S:75, E:70, C:45 },
    reality: { academicDifficulty:60, competition:75, workPressure:80, computerTime:70, teamwork:55, independentWork:70, routine:15, creativity:85 },
    workEnvironment: { handsOn:40, peopleInteraction:80, computerBased:65, remotePotential:65 },
    explorationActivities: ["Write an article about something happening at your school", "Start a blog or newsletter on a topic you care about", "Interview someone in your community", "Shadow a journalist or editor for a day"],
    relatedCareers: ["career_marketing_manager", "career_graphic_designer", "career_social_worker"],
    tags: ["creative", "writing", "social", "media"]
  },
  {
    id: "career_attorney",
    name: "Attorney",
    fields: ["law", "policy"],
    description: "Represents clients in legal matters, provides legal advice, and argues cases.",
    riasec: { R:20, I:80, A:55, S:70, E:90, C:65 },
    reality: { academicDifficulty:85, competition:80, workPressure:85, computerTime:70, teamwork:60, independentWork:70, routine:30, creativity:60 },
    workEnvironment: { handsOn:25, peopleInteraction:85, computerBased:65, remotePotential:50 },
    explorationActivities: ["Attend a mock trial or debate competition", "Watch a real court case (many are public)", "Read about a famous legal case", "Volunteer with a legal aid organization"],
    relatedCareers: ["career_policy_analyst", "career_journalist", "career_entrepreneur"],
    tags: ["law", "leadership", "high-salary", "long-training"]
  },
  {
    id: "career_policy_analyst",
    name: "Policy Analyst",
    fields: ["policy", "government", "social sciences"],
    description: "Researches and evaluates policies to help governments and organizations make better decisions.",
    riasec: { R:15, I:85, A:50, S:65, E:70, C:70 },
    reality: { academicDifficulty:75, competition:65, workPressure:65, computerTime:75, teamwork:65, independentWork:75, routine:40, creativity:55 },
    workEnvironment: { handsOn:20, peopleInteraction:60, computerBased:75, remotePotential:65 },
    explorationActivities: ["Research a local policy issue you care about", "Write an opinion piece on a policy topic", "Attend a town hall or city council meeting", "Intern with a local government office or nonprofit"],
    relatedCareers: ["career_attorney", "career_journalist", "career_social_worker"],
    tags: ["policy", "research", "impact", "government"]
  },
  {
    id: "career_physical_therapist",
    name: "Physical Therapist",
    fields: ["healthcare", "sports", "rehabilitation"],
    description: "Helps patients recover from injuries and improve physical function through exercise and treatment.",
    riasec: { R:65, I:65, A:40, S:90, E:55, C:55 },
    reality: { academicDifficulty:70, competition:55, workPressure:65, computerTime:35, teamwork:75, independentWork:55, routine:55, creativity:50 },
    workEnvironment: { handsOn:90, peopleInteraction:90, computerBased:30, remotePotential:15 },
    explorationActivities: ["Shadow a physical therapist at a clinic or hospital", "Volunteer at a sports medicine or rehabilitation center", "Take a sports first aid course", "Research what a PT does differently from a doctor"],
    relatedCareers: ["career_nurse", "career_physician", "career_social_worker"],
    tags: ["healthcare", "hands-on", "helping", "sports"]
  },
  {
    id: "career_robotics_engineer",
    name: "Robotics Engineer",
    fields: ["engineering", "technology", "computer science"],
    description: "Designs and builds robotic systems for manufacturing, medicine, exploration, and more.",
    riasec: { R:90, I:90, A:60, S:35, E:50, C:65 },
    reality: { academicDifficulty:85, competition:70, workPressure:65, computerTime:80, teamwork:65, independentWork:75, routine:35, creativity:80 },
    workEnvironment: { handsOn:85, peopleInteraction:40, computerBased:75, remotePotential:40 },
    explorationActivities: ["Join a robotics team or competition", "Build a simple robot with a kit (like LEGO Mindstorms or Arduino)", "Watch videos about robotic systems in industry", "Take a free intro to robotics course online"],
    relatedCareers: ["career_mechanical_engineer", "career_software_engineer", "career_research_scientist"],
    tags: ["engineering", "tech", "hands-on", "building"]
  },
  {
    id: "career_curriculum_designer",
    name: "Curriculum Designer",
    fields: ["education", "instructional design"],
    description: "Develops educational programs, courses, and learning materials for schools and organizations.",
    riasec: { R:20, I:65, A:75, S:80, E:55, C:70 },
    reality: { academicDifficulty:60, competition:45, workPressure:55, computerTime:70, teamwork:65, independentWork:70, routine:50, creativity:80 },
    workEnvironment: { handsOn:30, peopleInteraction:65, computerBased:70, remotePotential:75 },
    explorationActivities: ["Design a short lesson plan on a topic you love", "Critique a textbook chapter and suggest improvements", "Volunteer to help teach or run a workshop", "Take a course on instructional design principles"],
    relatedCareers: ["career_teacher", "career_ux_designer", "career_journalist"],
    tags: ["education", "creative", "design", "remote-friendly"]
  },
  {
    id: "career_economist",
    name: "Economist",
    fields: ["economics", "policy", "research"],
    description: "Studies how people, businesses, and governments allocate resources and make decisions.",
    riasec: { R:20, I:95, A:40, S:50, E:65, C:80 },
    reality: { academicDifficulty:85, competition:70, workPressure:60, computerTime:80, teamwork:50, independentWork:85, routine:45, creativity:50 },
    workEnvironment: { handsOn:15, peopleInteraction:50, computerBased:85, remotePotential:70 },
    explorationActivities: ["Read about a current economic issue in the news", "Take a free introductory economics course", "Analyze the economy of a country that interests you", "Model a simple supply and demand scenario"],
    relatedCareers: ["career_financial_analyst", "career_policy_analyst", "career_data_scientist"],
    tags: ["research", "math", "policy", "analytical"]
  }
];

// ============================================================
// OPPORTUNITIES DATABASE
// ============================================================

const OPPORTUNITIES = [
  { id: "opp_nasa", name: "NASA OSTEM Internships", organization: "NASA", type: "internship", description: "Student internships across engineering, science, technology, and business.", fields: ["engineering","science","technology","math"], interestCodes: ["R","I","C","E"], difficulty: "highly_competitive", url: "https://www.nasa.gov/learning-resources/internship-programs/", educationLevels: ["college"] },
  { id: "opp_nsf_reu", name: "NSF Research Experiences for Undergraduates", organization: "National Science Foundation", type: "research", description: "Paid research at NSF-funded institutions across science and engineering.", fields: ["science","engineering","math","research"], interestCodes: ["I","R","C"], difficulty: "competitive", url: "https://www.nsf.gov/funding/initiatives/reu/students", educationLevels: ["college"] },
  { id: "opp_smithsonian", name: "Smithsonian Internships", organization: "Smithsonian Institution", type: "internship", description: "Internships spanning science, arts, education, research, and communications.", fields: ["science","arts","education","research"], interestCodes: ["I","A","S","C"], difficulty: "competitive", url: "https://www.si.edu/support/internships", educationLevels: ["high_school","college"] },
  { id: "opp_nih", name: "NIH Summer Internship Program", organization: "National Institutes of Health", type: "research", description: "Research experience at NIH laboratories for students interested in biomedical sciences.", fields: ["healthcare","science","research"], interestCodes: ["I","R","S"], difficulty: "competitive", url: "https://www.training.nih.gov/programs/sip", educationLevels: ["high_school","college"] },
  { id: "opp_google_step", name: "Google STEP Internship", organization: "Google", type: "internship", description: "Software engineering internship for first and second year college students.", fields: ["technology","computer science"], interestCodes: ["I","R","C"], difficulty: "highly_competitive", url: "https://buildyourfuture.withgoogle.com/programs/step", educationLevels: ["college"] },
  { id: "opp_microsoft_explore", name: "Microsoft Explore Internship", organization: "Microsoft", type: "internship", description: "Software engineering and program management internship for first and second year students.", fields: ["technology","computer science"], interestCodes: ["I","R","E","C"], difficulty: "highly_competitive", url: "https://careers.microsoft.com/students/", educationLevels: ["college"] },
  { id: "opp_legal_aid", name: "Legal Aid Clinic Volunteer", organization: "Local Legal Aid", type: "volunteering", description: "Help provide legal assistance to underserved communities alongside attorneys.", fields: ["law","policy","social sciences"], interestCodes: ["S","E","C"], difficulty: "accessible", url: "", educationLevels: ["high_school","college"] },
  { id: "opp_teach_america", name: "Teach For America", organization: "Teach For America", type: "internship", description: "Teaching fellows program placing graduates in under-resourced schools.", fields: ["education"], interestCodes: ["S","E","A"], difficulty: "competitive", url: "https://www.teachforamerica.org", educationLevels: ["college"] },
  { id: "opp_robotics", name: "FIRST Robotics Competition", organization: "FIRST", type: "competition", description: "Hands-on robotics competition involving engineering, programming, and teamwork.", fields: ["engineering","computer science","robotics"], interestCodes: ["R","I","C"], difficulty: "accessible", url: "https://www.firstinspires.org", educationLevels: ["high_school"] },
  { id: "opp_science_fair", name: "Science Fair / Research Competition", organization: "Various", type: "competition", description: "Present original research at regional, state, or national competitions.", fields: ["science","research","engineering"], interestCodes: ["I","R"], difficulty: "moderate", url: "", educationLevels: ["high_school"] },
  { id: "opp_job_shadow", name: "Professional Job Shadow", organization: "Local Employer", type: "job_shadow", description: "Spend a day with a professional to see what their job actually looks like.", fields: ["all"], interestCodes: ["R","I","A","S","E","C"], difficulty: "accessible", url: "", educationLevels: ["high_school","college"] },
  { id: "opp_mentor", name: "Career Mentor", organization: "Local Network", type: "mentorship", description: "Connect with a professional in a field you're exploring for guidance and insight.", fields: ["all"], interestCodes: ["R","I","A","S","E","C"], difficulty: "accessible", url: "", educationLevels: ["high_school","college"] },
  { id: "opp_goldman", name: "Goldman Sachs Freshman Summit", organization: "Goldman Sachs", type: "internship", description: "Early career exposure to finance, business, and professional development.", fields: ["finance","business"], interestCodes: ["E","C","I"], difficulty: "highly_competitive", url: "https://www.goldmansachs.com/careers/students/programs/", educationLevels: ["college"] },
  { id: "opp_city_year", name: "City Year", organization: "City Year", type: "volunteering", description: "Year of service supporting students in under-resourced schools.", fields: ["education","social sciences"], interestCodes: ["S","E"], difficulty: "moderate", url: "https://www.cityyear.org", educationLevels: ["college"] },
  { id: "opp_hackathon", name: "Hackathon", organization: "Various", type: "competition", description: "Time-limited coding and design challenge to build a product or solve a problem.", fields: ["technology","design","business"], interestCodes: ["I","R","A","E"], difficulty: "accessible", url: "https://devpost.com", educationLevels: ["high_school","college"] },
];

// ============================================================
// CAREER ENGINE
// ============================================================

const questions = [
  { id:"R1",section:1,type:"slider",text:"I enjoy figuring out how things work.",cat:"R" },
  { id:"R2",section:1,type:"slider",text:"I like building or fixing things.",cat:"R" },
  { id:"R3",section:1,type:"slider",text:"I would enjoy creating something that solves a real problem.",cat:"R" },
  { id:"R4",section:1,type:"slider",text:"I like working with technology.",cat:"R" },
  { id:"R5",section:1,type:"slider",text:"I would rather learn by doing something than only reading about it.",cat:"R" },
  { id:"I1",section:1,type:"slider",text:"I enjoy solving difficult problems.",cat:"I" },
  { id:"I2",section:1,type:"slider",text:"I get curious about how or why something works.",cat:"I" },
  { id:"I3",section:1,type:"slider",text:"I enjoy researching things I am interested in.",cat:"I" },
  { id:"I4",section:1,type:"slider",text:"I like finding answers to questions that don't have an obvious solution.",cat:"I" },
  { id:"I5",section:1,type:"slider",text:"I enjoy subjects that challenge me to think deeply.",cat:"I" },
  { id:"A1",section:1,type:"slider",text:"I enjoy creating things that other people can see or experience.",cat:"A" },
  { id:"A2",section:1,type:"slider",text:"I often think of different ways to solve the same problem.",cat:"A" },
  { id:"A3",section:1,type:"slider",text:"I care about how something looks, feels, or is presented.",cat:"A" },
  { id:"A4",section:1,type:"slider",text:"I would enjoy turning an idea into something original.",cat:"A" },
  { id:"S1",section:1,type:"slider",text:"I feel good when I help someone solve a problem.",cat:"S" },
  { id:"S2",section:1,type:"slider",text:"I would enjoy teaching someone something I know.",cat:"S" },
  { id:"S3",section:1,type:"slider",text:"I care about making a positive difference in people's lives.",cat:"S" },
  { id:"S4",section:1,type:"slider",text:"I enjoy understanding why people think or act differently.",cat:"S" },
  { id:"E1",section:1,type:"slider",text:"I enjoy taking charge when a group needs direction.",cat:"E" },
  { id:"E2",section:1,type:"slider",text:"I would like to start my own project, organization, or business.",cat:"E" },
  { id:"E3",section:1,type:"slider",text:"I enjoy convincing people to support an idea.",cat:"E" },
  { id:"E4",section:1,type:"slider",text:"I like turning an idea into something successful.",cat:"E" },
  { id:"C1",section:1,type:"slider",text:"I like organizing messy information.",cat:"C" },
  { id:"C2",section:1,type:"slider",text:"I enjoy making plans.",cat:"C" },
  { id:"C3",section:1,type:"slider",text:"I notice when a process could be improved.",cat:"C" },
  { id:"C4",section:1,type:"slider",text:"I like knowing that things are accurate and organized.",cat:"C" },
  { id:"EXP1",section:2,type:"choice",text:"Have you ever built something outside of a school assignment?" },
  { id:"EXP2",section:2,type:"choice",text:"Have you ever joined a club because you were genuinely interested in it?" },
  { id:"EXP3",section:2,type:"choice",text:"Have you ever led a group or project?" },
  { id:"EXP4",section:2,type:"choice",text:"Have you ever started your own project?" },
  { id:"EXP5",section:2,type:"choice",text:"Have you ever helped someone learn something?" },
  { id:"EXP6",section:2,type:"choice",text:"Have you ever volunteered?" },
  { id:"EXP7",section:2,type:"choice",text:"Have you ever participated in a competition?" },
  { id:"EXP8",section:2,type:"choice",text:"Have you ever shadowed someone at their job?" },
  { id:"EXP9",section:2,type:"choice",text:"Have you ever talked to someone about their career?" },
  { id:"EXP10",section:2,type:"choice",text:"Have you ever taken an online course just because you were interested?" },
  { id:"EXP11",section:2,type:"choice",text:"Have you ever made money from something you created or did?" },
  { id:"P1",section:3,type:"slider",text:"I would be comfortable spending several years learning or training for a career." },
  { id:"P2",section:3,type:"slider",text:"Having a high salary is important to me." },
  { id:"P3",section:3,type:"slider",text:"Having free time outside of work is important to me." },
  { id:"P4",section:3,type:"slider",text:"I would rather have a stable career than take big risks for greater rewards." },
  { id:"P5",section:3,type:"slider",text:"I would enjoy working with people every day." },
  { id:"P6",section:3,type:"slider",text:"I would enjoy spending a large amount of time solving problems independently." },
  { id:"P7",section:3,type:"slider",text:"I want my work to make a noticeable difference in people's lives." },
  { id:"RL1",section:4,type:"slider",text:"I would be okay with a job where I sometimes work long hours." },
  { id:"RL2",section:4,type:"slider",text:"I would be comfortable speaking in front of groups." },
  { id:"RL3",section:4,type:"slider",text:"I would enjoy sitting at a computer for several hours a day." },
  { id:"RL4",section:4,type:"slider",text:"I would be comfortable making important decisions under pressure." },
  { id:"RL5",section:4,type:"slider",text:"I would enjoy working with the same type of problem repeatedly and becoming an expert." },
  { id:"RL6",section:4,type:"slider",text:"I would rather have a predictable routine than a job where every day is different." },
  { id:"TRY1",section:5,type:"explore",text:"Would you try designing a robot to complete a challenge?" },
  { id:"TRY2",section:5,type:"explore",text:"Would you try helping diagnose why something isn't working?" },
  { id:"TRY3",section:5,type:"explore",text:"Would you try creating an app that solves a problem?" },
  { id:"TRY4",section:5,type:"explore",text:"Would you try teaching younger students?" },
  { id:"TRY5",section:5,type:"explore",text:"Would you try running a business for a month?" },
  { id:"TRY6",section:5,type:"explore",text:"Would you try designing a social media campaign?" },
  { id:"TRY7",section:5,type:"explore",text:"Would you try analyzing evidence to solve a mystery?" },
  { id:"TRY8",section:5,type:"explore",text:"Would you try interviewing someone about their life?" },
  { id:"TRY9",section:5,type:"explore",text:"Would you try designing a building?" },
  { id:"TRY10",section:5,type:"explore",text:"Would you try conducting a science experiment?" },
  { id:"TRY11",section:5,type:"explore",text:"Would you try organizing an event for hundreds of people?" },
];

const SECTION_LABELS = ["Interests","Experience","Preferences","Career Reality","Exploration"];
const SECTION_DESCS = [
  "Rate how much each statement applies to you (0 = strongly disagree, 100 = strongly agree).",
  "Tell us about your past experiences.",
  "What matters to you in a career?",
  "How do you feel about real-world job realities?",
  "Would you try any of these activities?",
];

function clamp(v,min=0,max=100){return Math.max(min,Math.min(max,v));}
function avg(vals){return vals.length===0?0:vals.reduce((s,v)=>s+v,0)/vals.length;}

function calcRiasec(answers) {
  const totals={R:0,I:0,A:0,S:0,E:0,C:0}, counts={R:0,I:0,A:0,S:0,E:0,C:0};
  for (const q of questions) {
    if (q.section!==1||!q.cat) continue;
    const a=answers[q.id];
    if (typeof a!=="number") continue;
    totals[q.cat]+=clamp(a); counts[q.cat]++;
  }
  return {
    R:counts.R?Math.round(totals.R/counts.R):0,
    I:counts.I?Math.round(totals.I/counts.I):0,
    A:counts.A?Math.round(totals.A/counts.A):0,
    S:counts.S?Math.round(totals.S/counts.S):0,
    E:counts.E?Math.round(totals.E/counts.E):0,
    C:counts.C?Math.round(totals.C/counts.C):0,
  };
}

function topThree(scores) {
  return Object.entries(scores).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([c])=>c).join("");
}

function calcExplorationConfidence(answers) {
  const expIds = questions.filter(q=>q.section===2).map(q=>q.id);
  const tried = expIds.filter(id=>answers[id]==="yes");
  if (tried.length===0) return 10;
  return Math.round(clamp((tried.length/expIds.length)*100));
}

function similarityScore(userRiasec, careerRiasec) {
  const keys=["R","I","A","S","E","C"];
  const diff=keys.reduce((s,k)=>s+Math.abs((userRiasec[k]??50)-(careerRiasec[k]??50)),0);
  return clamp(100-(diff/keys.length));
}

function matchLevel(score) {
  if (score>=85) return "Excellent Match";
  if (score>=72) return "Strong Match";
  if (score>=55) return "Possible Match";
  return "Explore";
}

function matchLevelColor(score) {
  if (score>=85) return "#4ade80";
  if (score>=72) return "#FF6B35";
  if (score>=55) return "#FFE66D";
  return "#888";
}

function buildRoadmap(career) {
  return {
    next30Days: [
      `Learn the basics of ${career.name}.`,
      `Complete one small activity: ${career.explorationActivities[0]}.`,
      `Talk to at least one person working in or near ${career.name}.`,
      `Research three real opportunities related to ${career.name}.`,
    ],
    next90Days: [
      `Complete a larger ${career.name}-related project or experience.`,
      "Join a club, competition, or volunteer group connected to the field.",
      "Apply to at least two relevant opportunities.",
      `Compare ${career.name} with at least two related careers: ${career.relatedCareers.slice(0,2).map(id=>CAREERS.find(c=>c.id===id)?.name||id).join(" and ")}.`,
    ],
    beforeChoosing: [
      "Talk to someone currently working in the career.",
      "Find out what a normal Tuesday actually looks like in this field.",
      "Research the education and training required.",
      "Research salary ranges for entry-level and experienced workers.",
      "Identify the parts of the job that are less exciting.",
      "Try the work yourself before making a major education decision.",
    ],
  };
}

function matchOpportunities(riasec, career) {
  const code = topThree(riasec);
  return OPPORTUNITIES.map(opp => {
    const interestMatch = opp.interestCodes.filter(c=>code.includes(c)).length/Math.max(opp.interestCodes.length,1)*100;
    const fieldMatch = opp.fields.includes("all")||opp.fields.some(f=>career.fields.includes(f))?80:40;
    const score = Math.round(interestMatch*0.4+fieldMatch*0.6);
    return {...opp, score};
  }).sort((a,b)=>b.score-a.score).slice(0,6);
}

function calculatePersonality(answers) {
  const riasec = calcRiasec(answers);
  const code = topThree(riasec);
  const explorationConfidence = calcExplorationConfidence(answers);

  const careerMatches = CAREERS.map(career => {
    const score = Math.round(similarityScore(riasec, career.riasec));
    return { ...career, score, matchLevel: matchLevel(score) };
  }).sort((a,b)=>b.score-a.score);

  const topCareer = careerMatches[0];
  const roadmap = topCareer ? buildRoadmap(topCareer) : null;
  const opportunities = topCareer ? matchOpportunities(riasec, topCareer) : [];

  const topValues = [];
  if ((answers.P7||0)>60) topValues.push("Impact");
  if ((answers.P2||0)>60) topValues.push("Income");
  if ((answers.P3||0)>60) topValues.push("Balance");
  if ((answers.P6||0)>60) topValues.push("Independence");
  if ((answers.P4||0)>60) topValues.push("Stability");
  if (topValues.length===0) topValues.push("Growth","Discovery");

  return { code, riasec, explorationConfidence, careerMatches, topValues, roadmap, opportunities };
}

// ============================================================
// HOOKS
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

// ============================================================
// COMPONENTS
// ============================================================

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
function QuizFlow({onComplete}) {
  const sectionQs=[1,2,3,4,5].map(s=>questions.filter(q=>q.section===s));
  const[section,setSection]=useState(0);
  const[qIndex,setQIndex]=useState(0);
  const[answers,setAnswers]=useState({});
  const[sliderVal,setSliderVal]=useState(50);
  const[visible,setVisible]=useState(true);

  const currentQ=sectionQs[section][qIndex];
  const overallDone=[0,1,2,3,4].slice(0,section).reduce((s,i)=>s+sectionQs[i].length,0)+qIndex;
  const progress=Math.round((overallDone/questions.length)*100);

  function transition(fn){setVisible(false);setTimeout(()=>{fn();setVisible(true);},250);}

  function answer(val){
    const newAnswers={...answers,[currentQ.id]:val};
    setAnswers(newAnswers);
    if(currentQ.type==="slider")setSliderVal(50);
    transition(()=>{
      if(qIndex<sectionQs[section].length-1){setQIndex(q=>q+1);}
      else if(section<4){setSection(s=>s+1);setQIndex(0);}
      else{onComplete(newAnswers);}
    });
  }

  function goBack(){
    transition(()=>{
      if(qIndex>0)setQIndex(q=>q-1);
      else if(section>0){setSection(s=>s-1);setQIndex(sectionQs[section-1].length-1);}
    });
  }

  return(
    <div style={{maxWidth:680,margin:"0 auto",padding:"0 0 40px"}}>
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

      <div style={{opacity:visible?1:0,transform:visible?"translateY(0)":"translateY(16px)",transition:"all 0.25s ease"}}>
        <div style={{background:"#111",border:"1px solid #1e1e1e",borderRadius:24,padding:"36px 32px",marginBottom:24}}>
          <div style={{color:"#444",fontSize:12,marginBottom:16}}>Q{qIndex+1} of {sectionQs[section].length}</div>
          <p style={{fontSize:20,fontWeight:600,lineHeight:1.5,marginBottom:32,color:"#fff"}}>{currentQ.text}</p>

          {currentQ.type==="slider"?(
            <div>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}>
                <span style={{color:"#555",fontSize:13}}>Strongly disagree</span>
                <span style={{color:"#FF6B35",fontSize:15,fontWeight:700}}>{sliderVal}</span>
                <span style={{color:"#555",fontSize:13}}>Strongly agree</span>
              </div>
              <input type="range" min={0} max={100} value={sliderVal} onChange={e=>setSliderVal(Number(e.target.value))}
                style={{width:"100%",accentColor:"#FF6B35",cursor:"pointer",height:6}}/>
              <div style={{display:"flex",justifyContent:"center",marginTop:24}}>
                <button onClick={()=>answer(sliderVal)} style={{background:"#FF6B35",color:"#fff",border:"none",borderRadius:999,padding:"13px 40px",fontSize:15,fontWeight:600,cursor:"pointer"}}>Next →</button>
              </div>
            </div>
          ):(
            <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
              {(currentQ.type==="explore"?["yes","no","maybe"]:["yes","no"]).map(opt=>(
                <button key={opt} onClick={()=>answer(opt)}
                  style={{flex:1,minWidth:100,background:"#0d0d0d",border:"1px solid #2a2a2a",color:"#ccc",borderRadius:14,padding:"14px 20px",fontSize:15,fontWeight:500,cursor:"pointer",textTransform:"capitalize"}}>
                  {opt==="yes"?"✅ Yes":opt==="no"?"❌ No":"🤔 Maybe"}
                </button>
              ))}
            </div>
          )}
        </div>
        {(section>0||qIndex>0)&&(
          <button onClick={goBack} style={{background:"transparent",color:"#555",border:"1px solid #222",borderRadius:999,padding:"8px 20px",fontSize:13,cursor:"pointer"}}>← Back</button>
        )}
      </div>
    </div>
  );
}

// ── Results ───────────────────────────────────────────────────
function RatingRing({value,size=80,strokeWidth=5}) {
  const r=(size/2)-strokeWidth, circ=2*Math.PI*r, dash=(value/100)*circ;
  return(
    <div style={{position:"relative",width:size,height:size,flexShrink:0}}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{transform:"rotate(-90deg)"}}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#2a2a2a" strokeWidth={strokeWidth}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#FF6B35" strokeWidth={strokeWidth} strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" style={{transition:"stroke-dasharray 1.2s cubic-bezier(.4,0,.2,1)"}}/>
      </svg>
      <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column"}}>
        <span style={{fontSize:size*0.22,fontWeight:800,color:"#fff"}}>{value}</span>
        <span style={{fontSize:size*0.1,color:"#888"}}>/100</span>
      </div>
    </div>
  );
}

function ResultsView({result,onRetake,onChat}) {
  const[tab,setTab]=useState("careers");
  const[ref,inView]=useInView(0.05);
  const riasecLabels={R:"Realistic",I:"Investigative",A:"Artistic",S:"Social",E:"Enterprising",C:"Conventional"};

  return(
    <div ref={ref} style={{maxWidth:780,margin:"0 auto",opacity:inView?1:0,transform:inView?"translateY(0)":"translateY(30px)",transition:"all 0.7s ease"}}>
      {/* Header */}
      <div style={{textAlign:"center",marginBottom:32}}>
        <div style={{display:"inline-block",background:"#FF6B3522",border:"1px solid #FF6B3566",borderRadius:999,padding:"6px 20px",marginBottom:12}}>
          <span style={{color:"#FF6B35",fontWeight:700,fontSize:13,letterSpacing:1}}>{result.code}</span>
        </div>
        <h2 style={{fontWeight:800,fontSize:"clamp(24px,4vw,42px)",letterSpacing:-2,marginBottom:8}}>Your Career Personality</h2>
        <p style={{color:"#555",fontSize:14}}>Top values: {result.topValues.join(" · ")} · Exploration confidence: {result.explorationConfidence}%</p>
      </div>

      {/* RIASEC */}
      <div style={{background:"#111",border:"1px solid #1e1e1e",borderRadius:20,padding:24,marginBottom:16}}>
        <div style={{color:"#FF6B35",fontSize:11,letterSpacing:2,textTransform:"uppercase",marginBottom:14}}>Interest Profile</div>
        {Object.entries(result.riasec).map(([code,score])=>(
          <div key={code} style={{display:"flex",alignItems:"center",gap:12,marginBottom:10}}>
            <span style={{color:"#666",fontSize:13,width:100,flexShrink:0}}>{riasecLabels[code]}</span>
            <div style={{flex:1,height:6,background:"#1a1a1a",borderRadius:999}}>
              <div style={{height:"100%",background:"#FF6B35",borderRadius:999,width:`${score}%`,transition:"width 1s ease"}}/>
            </div>
            <span style={{color:"#555",fontSize:13,width:36,textAlign:"right"}}>{score}</span>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{display:"flex",gap:8,marginBottom:20}}>
        {["careers","opportunities","roadmap"].map(t=>(
          <button key={t} onClick={()=>setTab(t)}
            style={{background:tab===t?"#FF6B35":"#111",color:tab===t?"#fff":"#555",border:`1px solid ${tab===t?"#FF6B35":"#222"}`,borderRadius:999,padding:"8px 20px",fontSize:13,fontWeight:600,cursor:"pointer",textTransform:"capitalize"}}>
            {t==="careers"?"🎯 Careers":t==="opportunities"?"🚀 Opportunities":"🗺️ Roadmap"}
          </button>
        ))}
      </div>

      {/* Careers Tab */}
      {tab==="careers"&&(
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          {result.careerMatches.slice(0,5).map((c,i)=>(
            <div key={c.id} style={{background:"#111",border:"1px solid #1e1e1e",borderRadius:20,padding:22,display:"flex",gap:18,alignItems:"flex-start"}}>
              <RatingRing value={c.score}/>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6,flexWrap:"wrap"}}>
                  <span style={{fontWeight:700,fontSize:17}}>{c.name}</span>
                  <span style={{background:matchLevelColor(c.score)+"22",color:matchLevelColor(c.score),fontSize:11,fontWeight:700,borderRadius:999,padding:"2px 10px"}}>{c.matchLevel}</span>
                  {i===0&&<span style={{background:"#FF6B3522",color:"#FF6B35",fontSize:11,fontWeight:700,borderRadius:999,padding:"2px 10px"}}>Best Match</span>}
                </div>
                <p style={{color:"#666",fontSize:13,lineHeight:1.6,marginBottom:10}}>{c.description}</p>
                <div style={{color:"#FF6B35",fontSize:11,letterSpacing:1,textTransform:"uppercase",marginBottom:6}}>Try This</div>
                <p style={{color:"#888",fontSize:13}}>{c.explorationActivities[0]}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Opportunities Tab */}
      {tab==="opportunities"&&(
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {result.opportunities.map(opp=>(
            <div key={opp.id} style={{background:"#111",border:"1px solid #1e1e1e",borderRadius:16,padding:20}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                <div>
                  <div style={{fontWeight:700,fontSize:15,marginBottom:2}}>{opp.name}</div>
                  <div style={{color:"#555",fontSize:12}}>{opp.organization} · {opp.type} · {opp.difficulty}</div>
                </div>
                <div style={{background:"#FF6B3522",color:"#FF6B35",fontSize:12,fontWeight:700,borderRadius:999,padding:"3px 12px",flexShrink:0}}>{opp.score}%</div>
              </div>
              <p style={{color:"#666",fontSize:13,lineHeight:1.6,marginBottom:10}}>{opp.description}</p>
              {opp.url&&<a href={opp.url} target="_blank" rel="noopener noreferrer" style={{color:"#FF6B35",fontSize:13,textDecoration:"none"}}>Learn more →</a>}
              {!opp.url&&<span style={{color:"#444",fontSize:13}}>Search online to find current openings</span>}
            </div>
          ))}
        </div>
      )}

      {/* Roadmap Tab */}
      {tab==="roadmap"&&result.roadmap&&(
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          {[
            {label:"📅 Next 30 Days",items:result.roadmap.next30Days,color:"#4ade80"},
            {label:"🗓️ Next 90 Days",items:result.roadmap.next90Days,color:"#FF6B35"},
            {label:"✅ Before You Commit",items:result.roadmap.beforeChoosing,color:"#FFE66D"},
          ].map(section=>(
            <div key={section.label} style={{background:"#111",border:"1px solid #1e1e1e",borderRadius:16,padding:22}}>
              <div style={{color:section.color,fontSize:13,fontWeight:700,marginBottom:14}}>{section.label}</div>
              {section.items.map((item,i)=>(
                <div key={i} style={{display:"flex",gap:10,marginBottom:10,alignItems:"flex-start"}}>
                  <div style={{width:6,height:6,borderRadius:"50%",background:section.color,flexShrink:0,marginTop:6}}/>
                  <span style={{color:"#aaa",fontSize:14,lineHeight:1.6}}>{item}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      <div style={{display:"flex",gap:12,flexWrap:"wrap",marginTop:24}}>
        <button onClick={onRetake} style={{background:"transparent",color:"#555",border:"1px solid #222",borderRadius:999,padding:"12px 28px",fontSize:14,cursor:"pointer"}}>← Retake Quiz</button>
        <button onClick={onChat} style={{background:"#FF6B35",color:"#fff",border:"none",borderRadius:999,padding:"12px 28px",fontSize:14,fontWeight:600,cursor:"pointer"}}>Talk to Aria about your results →</button>
      </div>
    </div>
  );
}

// ── Aria Chat ─────────────────────────────────────────────────
function TalkToUs({onBack,initialContext}) {
  const greeting=initialContext
    ?`Hi! I'm Aria 👋 I can see you got the **${initialContext.code}** personality type with top careers in ${initialContext.topCareers}. What would you like to explore?`
    :"Hi! I'm Aria, your Pathways career counselor 👋 What personality code did you get from the quiz?";

  const[messages,setMessages]=useState([{role:"assistant",text:greeting}]);
  const[input,setInput]=useState("");
  const[loading,setLoading]=useState(false);
  const bottomRef=useRef(null);

  useEffect(()=>{bottomRef.current?.scrollIntoView({behavior:"smooth"});},[messages,loading]);

  const send=async()=>{
    const text=input.trim();
    if(!text||loading)return;
    setInput("");
    const newMessages=[...messages,{role:"user",text}];
    setMessages(newMessages);
    setLoading(true);
    try{
      const res=await fetch("https://pathways-backend-production.up.railway.app/api/chat",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          messages:newMessages.map(m=>({role:m.role,content:m.text})),
          pathway:initialContext?.code??null,
          personalityName:initialContext?.code??null,
          topCareers:initialContext?.topCareers??null,
          topValues:initialContext?.topValues??null,
        })
      });
      const data=await res.json();
      const reply=data.reply||"Sorry, something went wrong. Try again!";
      setMessages(prev=>[...prev,{role:"assistant",text:reply}]);
    }catch{
      setMessages(prev=>[...prev,{role:"assistant",text:"Hmm, something went wrong. Give it another try!"}]);
    }
    setLoading(false);
  };

  const onKey=e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}};

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

// ── Auth ──────────────────────────────────────────────────────
function AuthPage({mode}) {
  return(
    <div style={{background:"#0a0a0a",minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:"system-ui,sans-serif"}}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:40}}>
        <div style={{width:28,height:28,borderRadius:8,background:"#FF6B35",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1L13 7L7 13M1 7H13" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <span style={{fontWeight:800,fontSize:20,color:"#fff"}}>Pathways</span>
      </div>
      {mode==="sign-in"?<SignIn routing="hash"/>:<SignUp routing="hash"/>}
    </div>
  );
}

function AppContent() {
  const{isSignedIn,isLoaded}=useUser();
  const[authMode,setAuthMode]=useState(null);
  if(!isLoaded)return(<div style={{background:"#0a0a0a",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{color:"#FF6B35",fontSize:16}}>Loading...</div></div>);
  if(authMode==="sign-in")return<AuthPage mode="sign-in"/>;
  if(authMode==="sign-up")return<AuthPage mode="sign-up"/>;
  return<Pathways isSignedIn={isSignedIn} onSignIn={()=>setAuthMode("sign-in")} onSignUp={()=>setAuthMode("sign-up")}/>;
}

export default function App() {
  return(
    <ClerkProvider publishableKey={CLERK_KEY}>
      <AppContent/>
    </ClerkProvider>
  );
}

// ── Main App ──────────────────────────────────────────────────
function Pathways({isSignedIn,onSignIn,onSignUp}) {
  const[page,setPage]=useState("home");
  const[quizStep,setQuizStep]=useState("intro");
  const[result,setResult]=useState(null);
  const[ariaContext,setAriaContext]=useState(null);
  const[scrollY,setScrollY]=useState(0);
  const[featRef,featInView]=useInView(0.1);

  useEffect(()=>{
    const onScroll=()=>setScrollY(window.scrollY);
    window.addEventListener("scroll",onScroll);
    return()=>window.removeEventListener("scroll",onScroll);
  },[]);

  if(page==="ourstory")return<OurStory onBack={()=>setPage("home")}/>;
  if(page==="talktous")return<TalkToUs onBack={()=>setPage("home")} initialContext={ariaContext}/>;

  const scrollTo=id=>document.getElementById(id)?.scrollIntoView({behavior:"smooth"});

  async function handleQuizComplete(answers) {
    const r=calculatePersonality(answers);
    setResult(r);
    setQuizStep("result");
    if(isSignedIn){
      try{
        await supabase.from("quiz_results").insert({
          user_id:"clerk_user",
          personality_code:r.code,
          personality_name:r.code,
          riasec:r.riasec,
          top_values:r.topValues,
          career_matches:r.careerMatches.slice(0,3).map(c=>({id:c.id,name:c.name,score:c.score})),
        });
      }catch(e){console.error("Save failed:",e);}
    }
  }

  function handleChatFromResult(){
    if(result){
      setAriaContext({
        code:result.code,
        topCareers:result.careerMatches.slice(0,3).map(c=>c.name).join(", "),
        topValues:result.topValues.join(", "),
      });
    }
    setPage("talktous");
  }

  const stats=[{num:"25+",label:"Career Paths Mapped"},{num:"97%",label:"Find Clearer Direction"},{num:"15+",label:"Opportunities Matched"}];
  const features=[
    {num:"01",title:"Career Discovery",sub:"Know yourself first.",desc:"Answer 57 questions across 5 sections. We score your RIASEC personality type and match you to careers that actually fit — not just the ones that pay well.",tags:["RIASEC scoring","Personality fit","25+ careers"]},
    {num:"02",title:"Opportunity Matching",sub:"Connections, made for you.",desc:"Get matched to real internships, research programs, competitions, and job shadows based on your results.",tags:["Internships","Research programs","Competitions"]},
    {num:"03",title:"Your Roadmap",sub:"A plan, not just a result.",desc:"Walk away with a 30-day and 90-day action plan specific to your top career match — with real next steps.",tags:["30-day plan","90-day plan","Before you commit"]},
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
          {isSignedIn?(
            <UserButton afterSignOutUrl="#" appearance={{elements:{avatarBox:{width:36,height:36}}}}/>
          ):(
            <div style={{display:"flex",gap:10}}>
              <button onClick={onSignIn} style={{background:"transparent",color:"#888",border:"1px solid #333",borderRadius:999,padding:"9px 22px",fontSize:14,cursor:"pointer"}}>Log In</button>
              <button className="cta-btn" onClick={onSignUp} style={{background:"#FF6B35",color:"#fff",border:"none",borderRadius:999,padding:"9px 22px",fontSize:14,fontWeight:600,cursor:"pointer",transition:"all 0.2s"}}>Sign Up →</button>
            </div>
          )}
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

      {/* Quiz */}
      <section id="quiz" style={{padding:"100px 5%",background:"#050505"}}>
        <div style={{textAlign:"center",marginBottom:56}}>
          <div style={{color:"#FF6B35",fontSize:11,letterSpacing:3,textTransform:"uppercase",marginBottom:16}}>Try It Now</div>
          <h2 style={{fontWeight:800,fontSize:"clamp(32px,5vw,54px)",letterSpacing:-2}}>Discover your career personality.</h2>
          <p style={{color:"#555",marginTop:16,fontSize:15}}>57 questions · 5 sections · Instant results with roadmap and opportunities.</p>
        </div>

        {quizStep==="intro"&&(
          <div style={{maxWidth:560,margin:"0 auto",textAlign:"center"}}>
            <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:8,marginBottom:32}}>
              {SECTION_LABELS.map((l,i)=>(
                <div key={l} style={{background:"#111",border:"1px solid #1e1e1e",borderRadius:12,padding:"12px 8px",textAlign:"center"}}>
                  <div style={{color:"#FF6B35",fontSize:11,fontWeight:700,marginBottom:4}}>{i+1}</div>
                  <div style={{color:"#666",fontSize:11}}>{l}</div>
                </div>
              ))}
            </div>
            <p style={{color:"#555",fontSize:14,marginBottom:28}}>~8 minutes · 57 questions · Careers + Opportunities + Roadmap</p>
            <button className="cta-btn" onClick={()=>setQuizStep("quiz")} style={{background:"#FF6B35",color:"#fff",border:"none",borderRadius:999,padding:"15px 40px",fontSize:16,fontWeight:600,cursor:"pointer",transition:"all 0.2s"}}>Start the Quiz →</button>
          </div>
        )}

        {quizStep==="quiz"&&<QuizFlow onComplete={handleQuizComplete}/>}

        {quizStep==="result"&&result&&(
          <ResultsView result={result} onRetake={()=>{setQuizStep("intro");setResult(null);}} onChat={handleChatFromResult}/>
        )}
      </section>

      {/* Problem */}
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