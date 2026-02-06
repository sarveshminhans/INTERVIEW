import { AssessmentAnswers, AssessmentResult, CategoryScore, ActionItem, WeeklyPlan } from '../types/assessment';

function getLevel(percentage: number): 'weak' | 'developing' | 'strong' | 'excellent' {
  if (percentage < 40) return 'weak';
  if (percentage < 60) return 'developing';
  if (percentage < 80) return 'strong';
  return 'excellent';
}

function calculateTechnicalScore(answers: AssessmentAnswers): CategoryScore {
  let score = 0;
  const maxScore = 100;
  const strengths: string[] = [];
  const improvements: string[] = [];
  const actions: ActionItem[] = [];

  // Programming languages (up to 20 points)
  const langCount = answers.programmingLanguages.length;
  const langScore = Math.min(langCount * 5, 20);
  score += langScore;
  if (langCount >= 2) strengths.push(`Proficient in ${langCount} programming languages`);
  else {
    improvements.push('Limited programming language exposure');
    actions.push({
      priority: 'high',
      task: 'Learn at least one more programming language relevant to your target role',
      timeEstimate: '2-4 weeks',
      resource: 'Codecademy, freeCodeCamp'
    });
  }

  // Frameworks (up to 20 points)
  const fwCount = answers.frameworks.length;
  const fwScore = Math.min(fwCount * 5, 20);
  score += fwScore;
  if (fwCount >= 2) strengths.push(`Experience with ${fwCount} frameworks/libraries`);
  else {
    improvements.push('Need more framework experience');
    actions.push({
      priority: 'medium',
      task: 'Build a project using a popular framework in your domain',
      timeEstimate: '1-2 weeks',
      resource: 'Official documentation, YouTube tutorials'
    });
  }

  // DSA Level (up to 30 points)
  const dsaScore = answers.dsaLevel * 6;
  score += dsaScore;
  if (answers.dsaLevel >= 4) strengths.push('Strong DSA foundation');
  else if (answers.dsaLevel <= 2) {
    improvements.push('Data Structures & Algorithms need work');
    actions.push({
      priority: 'high',
      task: 'Practice 2-3 LeetCode problems daily, focus on arrays, strings, and trees',
      timeEstimate: '4-8 weeks for solid foundation',
      resource: 'LeetCode, NeetCode 150, Striver\'s SDE Sheet'
    });
  }

  // System Design (up to 30 points)
  const sdScore = answers.systemDesign * 6;
  score += sdScore;
  if (answers.systemDesign >= 4) strengths.push('Good system design knowledge');
  else if (answers.systemDesign <= 2) {
    improvements.push('System design concepts need strengthening');
    actions.push({
      priority: 'medium',
      task: 'Study common system design patterns and practice designing systems',
      timeEstimate: '3-4 weeks',
      resource: 'System Design Primer (GitHub), Gaurav Sen YouTube'
    });
  }

  const percentage = Math.round((score / maxScore) * 100);
  return { score, maxScore, percentage, level: getLevel(percentage), strengths, improvements, actions };
}

function calculateResumeScore(answers: AssessmentAnswers): CategoryScore {
  let score = 0;
  const maxScore = 100;
  const strengths: string[] = [];
  const improvements: string[] = [];
  const actions: ActionItem[] = [];

  if (!answers.hasResume) {
    improvements.push('No resume prepared');
    actions.push({
      priority: 'high',
      task: 'Create a professional resume immediately',
      timeEstimate: '2-3 hours',
      resource: 'Overleaf templates, Jake\'s Resume template'
    });
    return { score: 0, maxScore, percentage: 0, level: 'weak', strengths, improvements, actions };
  }

  score += 20; // Has resume

  // Resume quality (up to 30 points)
  const qualityScore = answers.resumeQuality * 6;
  score += qualityScore;
  if (answers.resumeQuality >= 4) strengths.push('Well-crafted resume');
  else {
    improvements.push('Resume needs polishing');
    actions.push({
      priority: 'high',
      task: 'Get resume reviewed by peers or use resume review services',
      timeEstimate: '1-2 days',
      resource: 'r/resumes subreddit, TopResume free review'
    });
  }

  // Quantified achievements
  if (answers.hasQuantifiedAchievements) {
    score += 20;
    strengths.push('Quantified achievements showcase impact');
  } else {
    improvements.push('Missing quantified achievements');
    actions.push({
      priority: 'high',
      task: 'Add metrics to your achievements (%, $, time saved, users impacted)',
      timeEstimate: '1 hour',
    });
  }

  // Relevant experience
  if (answers.hasRelevantExperience) {
    score += 15;
    strengths.push('Relevant experience highlighted');
  } else {
    improvements.push('Need more relevant experience/projects');
    actions.push({
      priority: 'medium',
      task: 'Add relevant projects or internship experience',
      timeEstimate: '1-2 weeks for a solid project',
    });
  }

  // One page
  if (answers.isOnePage) {
    score += 15;
    strengths.push('Concise one-page format');
  } else {
    improvements.push('Resume too long');
    actions.push({
      priority: 'low',
      task: 'Condense resume to one page, remove less relevant content',
      timeEstimate: '30 minutes',
    });
  }

  const percentage = Math.round((score / maxScore) * 100);
  return { score, maxScore, percentage, level: getLevel(percentage), strengths, improvements, actions };
}

function calculateCommunicationScore(answers: AssessmentAnswers): CategoryScore {
  let score = 0;
  const maxScore = 100;
  const strengths: string[] = [];
  const improvements: string[] = [];
  const actions: ActionItem[] = [];

  // Communication confidence (up to 40 points)
  const confScore = answers.communicationConfidence * 8;
  score += confScore;
  if (answers.communicationConfidence >= 4) strengths.push('Confident communicator');
  else if (answers.communicationConfidence <= 2) {
    improvements.push('Communication confidence needs work');
    actions.push({
      priority: 'high',
      task: 'Practice mock interviews with friends or use Pramp/interviewing.io',
      timeEstimate: '2-3 sessions per week',
      resource: 'Pramp (free), Interviewing.io'
    });
  }

  // Can explain projects
  if (answers.canExplainProjects) {
    score += 25;
    strengths.push('Can articulate project details clearly');
  } else {
    improvements.push('Struggle to explain projects');
    actions.push({
      priority: 'high',
      task: 'Prepare 2-3 minute summaries for each project using STAR format',
      timeEstimate: '2-3 hours',
    });
  }

  // Has prepped stories
  if (answers.hasPreppedStories) {
    score += 20;
    strengths.push('Prepared behavioral stories');
  } else {
    improvements.push('No prepared behavioral stories');
    actions.push({
      priority: 'medium',
      task: 'Prepare 5-7 STAR stories covering leadership, conflict, failure, success',
      timeEstimate: '3-4 hours',
      resource: 'Amazon Leadership Principles as guide'
    });
  }

  // Behavioral ready
  if (answers.behavioralReady) {
    score += 15;
    strengths.push('Ready for behavioral questions');
  } else {
    improvements.push('Not prepared for behavioral rounds');
    actions.push({
      priority: 'medium',
      task: 'Practice common behavioral questions out loud',
      timeEstimate: '1 hour daily for a week',
    });
  }

  const percentage = Math.round((score / maxScore) * 100);
  return { score, maxScore, percentage, level: getLevel(percentage), strengths, improvements, actions };
}

function calculatePortfolioScore(answers: AssessmentAnswers): CategoryScore {
  let score = 0;
  const maxScore = 100;
  const strengths: string[] = [];
  const improvements: string[] = [];
  const actions: ActionItem[] = [];

  // Portfolio website
  if (answers.hasPortfolio) {
    score += 25;
    strengths.push('Personal portfolio website');
  } else {
    improvements.push('No portfolio website');
    actions.push({
      priority: 'medium',
      task: 'Create a simple portfolio website showcasing your projects',
      timeEstimate: '1-2 days',
      resource: 'GitHub Pages, Vercel, Netlify (all free)'
    });
  }

  // GitHub presence
  if (answers.hasGithub) {
    score += 15;
    strengths.push('Active GitHub presence');
    
    // GitHub activity (up to 20 points)
    const ghActivityScore = answers.githubActivity * 4;
    score += ghActivityScore;
    if (answers.githubActivity >= 4) strengths.push('Strong GitHub contribution history');
    else if (answers.githubActivity <= 2) {
      improvements.push('Low GitHub activity');
      actions.push({
        priority: 'medium',
        task: 'Commit code regularly, contribute to open source',
        timeEstimate: 'Ongoing - aim for daily commits',
        resource: 'Good First Issues, Up For Grabs'
      });
    }
  } else {
    improvements.push('No GitHub profile');
    actions.push({
      priority: 'high',
      task: 'Create GitHub profile and push your projects',
      timeEstimate: '1-2 hours',
    });
  }

  // Projects (up to 25 points)
  const projectScore = Math.min(answers.hasProjects * 5, 25);
  score += projectScore;
  if (answers.hasProjects >= 4) strengths.push(`${answers.hasProjects} showcase-worthy projects`);
  else if (answers.hasProjects <= 2) {
    improvements.push('Need more portfolio projects');
    actions.push({
      priority: 'high',
      task: 'Build 2-3 substantial projects demonstrating different skills',
      timeEstimate: '2-4 weeks per project',
      resource: 'Project ideas: fullstackopen.com, roadmap.sh'
    });
  }

  // LinkedIn
  if (answers.hasLinkedIn) {
    score += 15;
    strengths.push('Professional LinkedIn presence');
  } else {
    improvements.push('No LinkedIn profile');
    actions.push({
      priority: 'medium',
      task: 'Create and optimize LinkedIn profile',
      timeEstimate: '2-3 hours',
    });
  }

  const percentage = Math.round((score / maxScore) * 100);
  return { score, maxScore, percentage, level: getLevel(percentage), strengths, improvements, actions };
}

function calculateTimeToReady(overallScore: number): string {
  if (overallScore >= 85) return '1-2 weeks of polish';
  if (overallScore >= 70) return '2-4 weeks of focused preparation';
  if (overallScore >= 50) return '1-2 months of dedicated effort';
  if (overallScore >= 30) return '2-3 months of comprehensive preparation';
  return '3-4 months of intensive preparation';
}

function generateWeeklyPlan(result: Omit<AssessmentResult, 'weeklyPlan'>): WeeklyPlan[] {
  const plans: WeeklyPlan[] = [];
  const allActions: { category: string; action: ActionItem }[] = [];

  // Collect all high-priority actions first
  ['technical', 'resume', 'communication', 'portfolio'].forEach(cat => {
    const score = result[`${cat}Score` as keyof typeof result] as CategoryScore;
    score.actions.forEach(action => {
      allActions.push({ category: cat, action });
    });
  });

  // Sort by priority
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  allActions.sort((a, b) => priorityOrder[a.action.priority] - priorityOrder[b.action.priority]);

  // Generate 4-week plan
  const highPriority = allActions.filter(a => a.action.priority === 'high');
  const mediumPriority = allActions.filter(a => a.action.priority === 'medium');
  const lowPriority = allActions.filter(a => a.action.priority === 'low');

  if (highPriority.length > 0) {
    plans.push({
      week: 1,
      focus: 'Critical Foundations',
      tasks: highPriority.slice(0, 3).map(a => a.action.task)
    });
  }

  if (highPriority.length > 3 || mediumPriority.length > 0) {
    plans.push({
      week: 2,
      focus: 'Building Strength',
      tasks: [...highPriority.slice(3, 5), ...mediumPriority.slice(0, 2)].map(a => a.action.task)
    });
  }

  if (mediumPriority.length > 2 || lowPriority.length > 0) {
    plans.push({
      week: 3,
      focus: 'Refinement',
      tasks: [...mediumPriority.slice(2, 4), ...lowPriority.slice(0, 2)].map(a => a.action.task)
    });
  }

  plans.push({
    week: 4,
    focus: 'Interview Practice',
    tasks: [
      'Do 2-3 mock interviews',
      'Review and refine all materials',
      'Practice explaining your projects',
      'Research target companies'
    ]
  });

  return plans;
}

export function calculateResults(answers: AssessmentAnswers): AssessmentResult {
  const technicalScore = calculateTechnicalScore(answers);
  const resumeScore = calculateResumeScore(answers);
  const communicationScore = calculateCommunicationScore(answers);
  const portfolioScore = calculatePortfolioScore(answers);

  // Weighted average (Technical: 35%, Resume: 20%, Communication: 25%, Portfolio: 20%)
  const overallScore = Math.round(
    technicalScore.percentage * 0.35 +
    resumeScore.percentage * 0.20 +
    communicationScore.percentage * 0.25 +
    portfolioScore.percentage * 0.20
  );

  let readinessLevel: AssessmentResult['readinessLevel'];
  if (overallScore >= 80) readinessLevel = 'Interview Ready';
  else if (overallScore >= 60) readinessLevel = 'Almost Ready';
  else if (overallScore >= 40) readinessLevel = 'Getting There';
  else readinessLevel = 'Not Ready';

  // Collect top strengths
  const allStrengths = [
    ...technicalScore.strengths,
    ...resumeScore.strengths,
    ...communicationScore.strengths,
    ...portfolioScore.strengths
  ];
  const topStrengths = allStrengths.slice(0, 4);

  // Collect critical gaps
  const allGaps = [
    ...technicalScore.improvements,
    ...resumeScore.improvements,
    ...communicationScore.improvements,
    ...portfolioScore.improvements
  ];
  const criticalGaps = allGaps.slice(0, 4);

  const timeToReady = calculateTimeToReady(overallScore);

  const partialResult = {
    overallScore,
    readinessLevel,
    technicalScore,
    resumeScore,
    communicationScore,
    portfolioScore,
    timeToReady,
    topStrengths,
    criticalGaps,
    weeklyPlan: [] as WeeklyPlan[]
  };

  const weeklyPlan = generateWeeklyPlan(partialResult);

  return { ...partialResult, weeklyPlan };
}
