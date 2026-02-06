export interface SkillOption {
  id: string;
  name: string;
  category: 'language' | 'framework' | 'tool' | 'concept';
}

export interface AssessmentAnswers {
  // Technical Skills
  programmingLanguages: string[];
  frameworks: string[];
  dsaLevel: number;
  systemDesign: number;
  
  // Resume
  hasResume: boolean;
  resumeQuality: number;
  hasQuantifiedAchievements: boolean;
  hasRelevantExperience: boolean;
  isOnePage: boolean;
  
  // Communication
  communicationConfidence: number;
  canExplainProjects: boolean;
  hasPreppedStories: boolean;
  behavioralReady: boolean;
  
  // Portfolio
  hasPortfolio: boolean;
  hasGithub: boolean;
  githubActivity: number;
  hasProjects: number;
  hasLinkedIn: boolean;
}

export interface CategoryScore {
  score: number;
  maxScore: number;
  percentage: number;
  level: 'weak' | 'developing' | 'strong' | 'excellent';
  strengths: string[];
  improvements: string[];
  actions: ActionItem[];
}

export interface ActionItem {
  priority: 'high' | 'medium' | 'low';
  task: string;
  timeEstimate: string;
  resource?: string;
}

export interface AssessmentResult {
  overallScore: number;
  readinessLevel: 'Not Ready' | 'Getting There' | 'Almost Ready' | 'Interview Ready';
  technicalScore: CategoryScore;
  resumeScore: CategoryScore;
  communicationScore: CategoryScore;
  portfolioScore: CategoryScore;
  timeToReady: string;
  topStrengths: string[];
  criticalGaps: string[];
  weeklyPlan: WeeklyPlan[];
}

export interface WeeklyPlan {
  week: number;
  focus: string;
  tasks: string[];
}
