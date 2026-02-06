import { useState, useEffect } from 'react';
import { AssessmentAnswers, AssessmentResult } from './types/assessment';
import { calculateResults } from './utils/scoring';
import { cn } from './utils/cn';

// Initial state
const initialAnswers: AssessmentAnswers = {
  programmingLanguages: [],
  frameworks: [],
  dsaLevel: 3,
  systemDesign: 2,
  hasResume: true,
  resumeQuality: 3,
  hasQuantifiedAchievements: false,
  hasRelevantExperience: false,
  isOnePage: true,
  communicationConfidence: 3,
  canExplainProjects: false,
  hasPreppedStories: false,
  behavioralReady: false,
  hasPortfolio: false,
  hasGithub: true,
  githubActivity: 2,
  hasProjects: 2,
  hasLinkedIn: true,
};

// Skills data
const programmingLanguages = [
  'JavaScript', 'Python', 'Java', 'C++', 'TypeScript', 'Go', 'Rust', 'C#', 'Ruby', 'Swift', 'Kotlin', 'PHP'
];

const frameworks = [
  'React', 'Node.js', 'Django', 'Spring Boot', 'Vue.js', 'Angular', 'Express.js', 'Flask', 'Next.js', 'FastAPI', 'Laravel', 'Ruby on Rails'
];

type Step = 'welcome' | 'technical' | 'resume' | 'communication' | 'portfolio' | 'results';

export function App() {
  const [step, setStep] = useState<Step>('welcome');
  const [answers, setAnswers] = useState<AssessmentAnswers>(initialAnswers);
  const [results, setResults] = useState<AssessmentResult | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  const steps: Step[] = ['technical', 'resume', 'communication', 'portfolio'];
  const currentStepIndex = steps.indexOf(step);

  useEffect(() => {
    if (startTime && step !== 'welcome' && step !== 'results') {
      const interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [startTime, step]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setStartTime(Date.now());
    setStep('technical');
  };

  const handleNext = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setStep(steps[nextIndex]);
    } else {
      const calculatedResults = calculateResults(answers);
      setResults(calculatedResults);
      setStep('results');
    }
  };

  const handleBack = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setStep(steps[prevIndex]);
    }
  };

  const handleRestart = () => {
    setAnswers(initialAnswers);
    setResults(null);
    setStartTime(null);
    setElapsedTime(0);
    setStep('welcome');
  };

  const toggleArrayItem = (key: 'programmingLanguages' | 'frameworks', item: string) => {
    setAnswers(prev => ({
      ...prev,
      [key]: prev[key].includes(item)
        ? prev[key].filter(i => i !== item)
        : [...prev[key], item]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 font-[Inter]">
      {/* Header */}
      {step !== 'welcome' && step !== 'results' && (
        <div className="fixed top-0 left-0 right-0 bg-slate-900/80 backdrop-blur-lg border-b border-white/10 z-50">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <span className="text-white text-sm font-bold">IR</span>
              </div>
              <span className="text-white font-semibold hidden sm:block">InterviewReady</span>
            </div>
            
            {/* Progress */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {steps.map((s, i) => (
                  <div
                    key={s}
                    className={cn(
                      "w-2.5 h-2.5 rounded-full transition-all",
                      i <= currentStepIndex ? "bg-violet-400" : "bg-white/20"
                    )}
                  />
                ))}
              </div>
              <div className={cn(
                "text-sm font-medium px-3 py-1 rounded-full",
                elapsedTime > 90 ? "bg-amber-500/20 text-amber-300" : "bg-violet-500/20 text-violet-300"
              )}>
                ⏱️ {formatTime(elapsedTime)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className={cn(
        "max-w-4xl mx-auto px-4",
        step !== 'welcome' && step !== 'results' ? "pt-20 pb-8" : "py-8"
      )}>
        
        {/* Welcome Screen */}
        {step === 'welcome' && (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center space-y-8 animate-fade-in">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-xl shadow-purple-500/30">
                <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="space-y-3">
                <h1 className="text-4xl sm:text-5xl font-bold text-white">
                  Interview<span className="text-violet-400">Ready</span>
                </h1>
                <p className="text-lg text-slate-300 max-w-md mx-auto">
                  Get your personalized Interview Readiness Score in under 2 minutes
                </p>
              </div>
              
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                {[
                  { icon: '⚡', text: 'Quick 2-min assessment' },
                  { icon: '📊', text: 'Detailed scoring' },
                  { icon: '🎯', text: 'Actionable feedback' },
                  { icon: '📅', text: 'Personalized plan' }
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full text-slate-300">
                    <span>{item.icon}</span>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={handleStart}
                className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all hover:scale-105"
              >
                Start Assessment
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>

              <p className="text-slate-500 text-sm">
                Free • No signup required • Instant results
              </p>
            </div>
          </div>
        )}

        {/* Technical Skills */}
        {step === 'technical' && (
          <div className="space-y-8 animate-slide-up">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-violet-500/20 rounded-full text-violet-300 text-sm font-medium">
                <span>1/4</span>
                <span>•</span>
                <span>Technical Skills</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">What's in your tech stack?</h2>
              <p className="text-slate-400">Select all that apply - be honest for accurate results</p>
            </div>

            <div className="space-y-6">
              {/* Programming Languages */}
              <div className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <span className="text-xl">💻</span> Programming Languages
                </h3>
                <div className="flex flex-wrap gap-2">
                  {programmingLanguages.map(lang => (
                    <button
                      key={lang}
                      onClick={() => toggleArrayItem('programmingLanguages', lang)}
                      className={cn(
                        "px-4 py-2 rounded-lg font-medium transition-all text-sm",
                        answers.programmingLanguages.includes(lang)
                          ? "bg-violet-500 text-white shadow-lg shadow-violet-500/30"
                          : "bg-white/10 text-slate-300 hover:bg-white/20"
                      )}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              {/* Frameworks */}
              <div className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <span className="text-xl">🛠️</span> Frameworks & Libraries
                </h3>
                <div className="flex flex-wrap gap-2">
                  {frameworks.map(fw => (
                    <button
                      key={fw}
                      onClick={() => toggleArrayItem('frameworks', fw)}
                      className={cn(
                        "px-4 py-2 rounded-lg font-medium transition-all text-sm",
                        answers.frameworks.includes(fw)
                          ? "bg-violet-500 text-white shadow-lg shadow-violet-500/30"
                          : "bg-white/10 text-slate-300 hover:bg-white/20"
                      )}
                    >
                      {fw}
                    </button>
                  ))}
                </div>
              </div>

              {/* DSA Level */}
              <div className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <span className="text-xl">🧮</span> DSA Proficiency
                </h3>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={answers.dsaLevel}
                  onChange={(e) => setAnswers(prev => ({ ...prev, dsaLevel: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-2">
                  <span>Beginner</span>
                  <span>Can solve Easy</span>
                  <span>Medium problems</span>
                  <span>Hard problems</span>
                  <span>Expert</span>
                </div>
              </div>

              {/* System Design */}
              <div className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <span className="text-xl">🏗️</span> System Design Knowledge
                </h3>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={answers.systemDesign}
                  onChange={(e) => setAnswers(prev => ({ ...prev, systemDesign: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-2">
                  <span>No idea</span>
                  <span>Basic concepts</span>
                  <span>Can discuss</span>
                  <span>Can design</span>
                  <span>Expert</span>
                </div>
              </div>
            </div>

            <NavigationButtons onBack={handleBack} onNext={handleNext} showBack={false} />
          </div>
        )}

        {/* Resume */}
        {step === 'resume' && (
          <div className="space-y-8 animate-slide-up">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 rounded-full text-emerald-300 text-sm font-medium">
                <span>2/4</span>
                <span>•</span>
                <span>Resume</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">How's your resume?</h2>
              <p className="text-slate-400">Your resume is often the first impression</p>
            </div>

            <div className="space-y-4">
              {/* Has Resume */}
              <ToggleCard
                icon="📄"
                title="Do you have a resume ready?"
                checked={answers.hasResume}
                onChange={(checked) => setAnswers(prev => ({ ...prev, hasResume: checked }))}
              />

              {answers.hasResume && (
                <>
                  {/* Resume Quality */}
                  <div className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10">
                    <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                      <span className="text-xl">✨</span> How polished is your resume?
                    </h3>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={answers.resumeQuality}
                      onChange={(e) => setAnswers(prev => ({ ...prev, resumeQuality: parseInt(e.target.value) }))}
                      className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-2">
                      <span>Rough draft</span>
                      <span>Needs work</span>
                      <span>Decent</span>
                      <span>Good</span>
                      <span>Excellent</span>
                    </div>
                  </div>

                  <ToggleCard
                    icon="📊"
                    title="Does it have quantified achievements?"
                    subtitle="E.g., 'Improved performance by 40%', 'Served 10K+ users'"
                    checked={answers.hasQuantifiedAchievements}
                    onChange={(checked) => setAnswers(prev => ({ ...prev, hasQuantifiedAchievements: checked }))}
                  />

                  <ToggleCard
                    icon="💼"
                    title="Relevant experience or projects?"
                    subtitle="Internships, projects, or work related to your target role"
                    checked={answers.hasRelevantExperience}
                    onChange={(checked) => setAnswers(prev => ({ ...prev, hasRelevantExperience: checked }))}
                  />

                  <ToggleCard
                    icon="📏"
                    title="Is it one page?"
                    subtitle="Recommended for students and early-career professionals"
                    checked={answers.isOnePage}
                    onChange={(checked) => setAnswers(prev => ({ ...prev, isOnePage: checked }))}
                  />
                </>
              )}
            </div>

            <NavigationButtons onBack={handleBack} onNext={handleNext} />
          </div>
        )}

        {/* Communication */}
        {step === 'communication' && (
          <div className="space-y-8 animate-slide-up">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 rounded-full text-amber-300 text-sm font-medium">
                <span>3/4</span>
                <span>•</span>
                <span>Communication</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">Can you articulate your value?</h2>
              <p className="text-slate-400">Communication can make or break an interview</p>
            </div>

            <div className="space-y-4">
              {/* Communication Confidence */}
              <div className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <span className="text-xl">🗣️</span> How confident are you speaking in interviews?
                </h3>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={answers.communicationConfidence}
                  onChange={(e) => setAnswers(prev => ({ ...prev, communicationConfidence: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-2">
                  <span>Very nervous</span>
                  <span>Anxious</span>
                  <span>Okay</span>
                  <span>Confident</span>
                  <span>Very confident</span>
                </div>
              </div>

              <ToggleCard
                icon="🎤"
                title="Can you explain your projects clearly?"
                subtitle="Without looking at notes, in 2-3 minutes"
                checked={answers.canExplainProjects}
                onChange={(checked) => setAnswers(prev => ({ ...prev, canExplainProjects: checked }))}
              />

              <ToggleCard
                icon="📖"
                title="Have you prepared STAR stories?"
                subtitle="Situation, Task, Action, Result format for behavioral questions"
                checked={answers.hasPreppedStories}
                onChange={(checked) => setAnswers(prev => ({ ...prev, hasPreppedStories: checked }))}
              />

              <ToggleCard
                icon="🧠"
                title="Ready for behavioral questions?"
                subtitle="'Tell me about a time when...' type questions"
                checked={answers.behavioralReady}
                onChange={(checked) => setAnswers(prev => ({ ...prev, behavioralReady: checked }))}
              />
            </div>

            <NavigationButtons onBack={handleBack} onNext={handleNext} />
          </div>
        )}

        {/* Portfolio */}
        {step === 'portfolio' && (
          <div className="space-y-8 animate-slide-up">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 rounded-full text-blue-300 text-sm font-medium">
                <span>4/4</span>
                <span>•</span>
                <span>Portfolio & Presence</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">Show your work</h2>
              <p className="text-slate-400">Your online presence speaks volumes</p>
            </div>

            <div className="space-y-4">
              <ToggleCard
                icon="🌐"
                title="Do you have a portfolio website?"
                subtitle="Personal site showcasing your work"
                checked={answers.hasPortfolio}
                onChange={(checked) => setAnswers(prev => ({ ...prev, hasPortfolio: checked }))}
              />

              <ToggleCard
                icon="🐙"
                title="Active GitHub profile?"
                subtitle="With public repositories"
                checked={answers.hasGithub}
                onChange={(checked) => setAnswers(prev => ({ ...prev, hasGithub: checked }))}
              />

              {answers.hasGithub && (
                <div className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10">
                  <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <span className="text-xl">📈</span> How active is your GitHub?
                  </h3>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={answers.githubActivity}
                    onChange={(e) => setAnswers(prev => ({ ...prev, githubActivity: parseInt(e.target.value) }))}
                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-2">
                    <span>Empty</span>
                    <span>Few repos</span>
                    <span>Some activity</span>
                    <span>Regular</span>
                    <span>Very active</span>
                  </div>
                </div>
              )}

              <div className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <span className="text-xl">🚀</span> How many substantial projects do you have?
                </h3>
                <div className="flex gap-2 flex-wrap">
                  {[0, 1, 2, 3, 4, 5].map(num => (
                    <button
                      key={num}
                      onClick={() => setAnswers(prev => ({ ...prev, hasProjects: num }))}
                      className={cn(
                        "px-5 py-3 rounded-lg font-medium transition-all",
                        answers.hasProjects === num
                          ? "bg-violet-500 text-white shadow-lg"
                          : "bg-white/10 text-slate-300 hover:bg-white/20"
                      )}
                    >
                      {num === 5 ? '5+' : num}
                    </button>
                  ))}
                </div>
              </div>

              <ToggleCard
                icon="💼"
                title="LinkedIn profile set up?"
                subtitle="Professional networking presence"
                checked={answers.hasLinkedIn}
                onChange={(checked) => setAnswers(prev => ({ ...prev, hasLinkedIn: checked }))}
              />
            </div>

            <NavigationButtons onBack={handleBack} onNext={handleNext} nextLabel="Get Results" />
          </div>
        )}

        {/* Results */}
        {step === 'results' && results && (
          <ResultsScreen results={results} elapsedTime={elapsedTime} onRestart={handleRestart} />
        )}
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.5s ease-out; }
        .animate-slide-up { animation: slide-up 0.4s ease-out; }
        
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 4px 10px rgba(139, 92, 246, 0.4);
        }
        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
          border-radius: 50%;
          cursor: pointer;
          border: none;
          box-shadow: 0 4px 10px rgba(139, 92, 246, 0.4);
        }
      `}</style>
    </div>
  );
}

// Toggle Card Component
function ToggleCard({ 
  icon, 
  title, 
  subtitle, 
  checked, 
  onChange 
}: { 
  icon: string; 
  title: string; 
  subtitle?: string; 
  checked: boolean; 
  onChange: (checked: boolean) => void; 
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={cn(
        "w-full p-5 rounded-2xl border transition-all text-left flex items-center justify-between gap-4",
        checked 
          ? "bg-violet-500/20 border-violet-500/50" 
          : "bg-white/5 border-white/10 hover:bg-white/10"
      )}
    >
      <div className="flex items-center gap-4">
        <span className="text-2xl">{icon}</span>
        <div>
          <p className="text-white font-medium">{title}</p>
          {subtitle && <p className="text-slate-400 text-sm">{subtitle}</p>}
        </div>
      </div>
      <div className={cn(
        "w-12 h-7 rounded-full p-1 transition-all",
        checked ? "bg-violet-500" : "bg-white/20"
      )}>
        <div className={cn(
          "w-5 h-5 rounded-full bg-white transition-all shadow",
          checked ? "translate-x-5" : "translate-x-0"
        )} />
      </div>
    </button>
  );
}

// Navigation Buttons
function NavigationButtons({ 
  onBack, 
  onNext, 
  showBack = true, 
  nextLabel = "Continue" 
}: { 
  onBack: () => void; 
  onNext: () => void; 
  showBack?: boolean; 
  nextLabel?: string; 
}) {
  return (
    <div className="flex justify-between pt-4">
      {showBack ? (
        <button
          onClick={onBack}
          className="px-6 py-3 text-slate-400 hover:text-white transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
          </svg>
          Back
        </button>
      ) : (
        <div />
      )}
      <button
        onClick={onNext}
        className="group px-8 py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all hover:scale-105 flex items-center gap-2"
      >
        {nextLabel}
        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </button>
    </div>
  );
}

// Score Gauge Component
function ScoreGauge({ score, size = 'large' }: { score: number; size?: 'large' | 'small' }) {
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (score / 100) * circumference;
  
  const getColor = (score: number) => {
    if (score >= 80) return { stroke: '#10b981', glow: 'rgba(16, 185, 129, 0.3)' };
    if (score >= 60) return { stroke: '#8b5cf6', glow: 'rgba(139, 92, 246, 0.3)' };
    if (score >= 40) return { stroke: '#f59e0b', glow: 'rgba(245, 158, 11, 0.3)' };
    return { stroke: '#ef4444', glow: 'rgba(239, 68, 68, 0.3)' };
  };
  
  const colors = getColor(score);
  const dimensions = size === 'large' ? 'w-48 h-48' : 'w-24 h-24';
  const textSize = size === 'large' ? 'text-5xl' : 'text-xl';
  
  return (
    <div className={cn("relative", dimensions)}>
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="50%"
          cy="50%"
          r="45%"
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="8"
        />
        <circle
          cx="50%"
          cy="50%"
          r="45%"
          fill="none"
          stroke={colors.stroke}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ 
            transition: 'stroke-dashoffset 1s ease-out',
            filter: `drop-shadow(0 0 8px ${colors.glow})`
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={cn("font-bold text-white", textSize)}>{score}</span>
      </div>
    </div>
  );
}

// Category Score Card
function CategoryScoreCard({ 
  title, 
  icon, 
  score, 
  color 
}: { 
  title: string; 
  icon: string; 
  score: { percentage: number; level: string }; 
  color: string; 
}) {
  const levelColors = {
    weak: 'text-red-400',
    developing: 'text-amber-400',
    strong: 'text-violet-400',
    excellent: 'text-emerald-400'
  };
  
  return (
    <div className="bg-white/5 backdrop-blur rounded-xl p-4 border border-white/10">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{icon}</span>
          <span className="text-white font-medium text-sm">{title}</span>
        </div>
        <span className={cn("text-xs font-medium capitalize", levelColors[score.level as keyof typeof levelColors])}>
          {score.level}
        </span>
      </div>
      <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
        <div 
          className={cn("absolute left-0 top-0 h-full rounded-full transition-all duration-1000", color)}
          style={{ width: `${score.percentage}%` }}
        />
      </div>
      <div className="text-right mt-1">
        <span className="text-white text-sm font-semibold">{score.percentage}%</span>
      </div>
    </div>
  );
}

// Results Screen Component
function ResultsScreen({ 
  results, 
  elapsedTime, 
  onRestart 
}: { 
  results: AssessmentResult; 
  elapsedTime: number; 
  onRestart: () => void; 
}) {
  const [showDetails, setShowDetails] = useState(false);
  
  const readinessColors = {
    'Not Ready': { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30' },
    'Getting There': { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30' },
    'Almost Ready': { bg: 'bg-violet-500/20', text: 'text-violet-400', border: 'border-violet-500/30' },
    'Interview Ready': { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30' }
  };
  
  const colors = readinessColors[results.readinessLevel];
  const mins = Math.floor(elapsedTime / 60);
  const secs = elapsedTime % 60;
  
  return (
    <div className="py-8 space-y-8 animate-slide-up">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full text-slate-300 text-sm">
          <span>✅</span>
          <span>Completed in {mins}:{secs.toString().padStart(2, '0')}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white">Your Interview Readiness Report</h1>
      </div>

      {/* Main Score */}
      <div className="flex flex-col items-center space-y-4">
        <ScoreGauge score={results.overallScore} />
        <div className={cn(
          "px-6 py-2 rounded-full font-semibold border",
          colors.bg, colors.text, colors.border
        )}>
          {results.readinessLevel}
        </div>
        <p className="text-slate-400 text-center">
          Estimated time to interview-ready: <span className="text-white font-medium">{results.timeToReady}</span>
        </p>
      </div>

      {/* Category Scores */}
      <div className="grid grid-cols-2 gap-4">
        <CategoryScoreCard 
          title="Technical" 
          icon="💻" 
          score={results.technicalScore}
          color="bg-gradient-to-r from-blue-500 to-cyan-500"
        />
        <CategoryScoreCard 
          title="Resume" 
          icon="📄" 
          score={results.resumeScore}
          color="bg-gradient-to-r from-emerald-500 to-green-500"
        />
        <CategoryScoreCard 
          title="Communication" 
          icon="🗣️" 
          score={results.communicationScore}
          color="bg-gradient-to-r from-amber-500 to-orange-500"
        />
        <CategoryScoreCard 
          title="Portfolio" 
          icon="🌐" 
          score={results.portfolioScore}
          color="bg-gradient-to-r from-violet-500 to-purple-500"
        />
      </div>

      {/* Strengths & Gaps */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-emerald-500/10 backdrop-blur rounded-2xl p-6 border border-emerald-500/20">
          <h3 className="text-emerald-400 font-semibold mb-4 flex items-center gap-2">
            <span>💪</span> Your Strengths
          </h3>
          <ul className="space-y-2">
            {results.topStrengths.length > 0 ? results.topStrengths.map((strength, i) => (
              <li key={i} className="flex items-start gap-2 text-slate-300 text-sm">
                <span className="text-emerald-400 mt-0.5">✓</span>
                {strength}
              </li>
            )) : (
              <li className="text-slate-400 text-sm">Keep building - strengths will emerge!</li>
            )}
          </ul>
        </div>
        
        <div className="bg-red-500/10 backdrop-blur rounded-2xl p-6 border border-red-500/20">
          <h3 className="text-red-400 font-semibold mb-4 flex items-center gap-2">
            <span>🎯</span> Critical Gaps
          </h3>
          <ul className="space-y-2">
            {results.criticalGaps.length > 0 ? results.criticalGaps.map((gap, i) => (
              <li key={i} className="flex items-start gap-2 text-slate-300 text-sm">
                <span className="text-red-400 mt-0.5">!</span>
                {gap}
              </li>
            )) : (
              <li className="text-slate-400 text-sm">Great job - no critical gaps!</li>
            )}
          </ul>
        </div>
      </div>

      {/* Action Plan Toggle */}
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white font-medium transition-all flex items-center justify-center gap-2"
      >
        {showDetails ? 'Hide' : 'Show'} Detailed Action Plan
        <svg 
          className={cn("w-5 h-5 transition-transform", showDetails && "rotate-180")} 
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Detailed Action Plan */}
      {showDetails && (
        <div className="space-y-6 animate-slide-up">
          {/* Weekly Plan */}
          <div className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10">
            <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
              <span>📅</span> Your 4-Week Improvement Plan
            </h3>
            <div className="space-y-4">
              {results.weeklyPlan.map((week) => (
                <div key={week.week} className="relative pl-6 pb-4 border-l-2 border-violet-500/30 last:pb-0">
                  <div className="absolute left-0 top-0 w-4 h-4 -translate-x-[9px] rounded-full bg-violet-500" />
                  <div className="mb-2">
                    <span className="text-violet-400 font-medium">Week {week.week}</span>
                    <span className="text-white ml-2">- {week.focus}</span>
                  </div>
                  <ul className="space-y-1">
                    {week.tasks.map((task, i) => (
                      <li key={i} className="text-slate-400 text-sm flex items-start gap-2">
                        <span className="text-slate-500">•</span>
                        {task}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Category Actions */}
          {[
            { key: 'technicalScore', title: 'Technical Skills', icon: '💻' },
            { key: 'resumeScore', title: 'Resume', icon: '📄' },
            { key: 'communicationScore', title: 'Communication', icon: '🗣️' },
            { key: 'portfolioScore', title: 'Portfolio', icon: '🌐' }
          ].map(({ key, title, icon }) => {
            const score = results[key as keyof AssessmentResult] as typeof results.technicalScore;
            if (score.actions.length === 0) return null;
            
            return (
              <div key={key} className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <span>{icon}</span> {title} Actions
                </h3>
                <div className="space-y-3">
                  {score.actions.map((action, i) => (
                    <div 
                      key={i} 
                      className={cn(
                        "p-4 rounded-xl border",
                        action.priority === 'high' 
                          ? "bg-red-500/10 border-red-500/20" 
                          : action.priority === 'medium'
                          ? "bg-amber-500/10 border-amber-500/20"
                          : "bg-blue-500/10 border-blue-500/20"
                      )}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={cn(
                              "text-xs font-medium px-2 py-0.5 rounded-full",
                              action.priority === 'high' 
                                ? "bg-red-500/20 text-red-400" 
                                : action.priority === 'medium'
                                ? "bg-amber-500/20 text-amber-400"
                                : "bg-blue-500/20 text-blue-400"
                            )}>
                              {action.priority.toUpperCase()}
                            </span>
                            <span className="text-slate-500 text-xs">⏱️ {action.timeEstimate}</span>
                          </div>
                          <p className="text-white text-sm">{action.task}</p>
                          {action.resource && (
                            <p className="text-slate-400 text-xs mt-1">📚 {action.resource}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <button
          onClick={onRestart}
          className="flex-1 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-medium transition-all flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Retake Assessment
        </button>
        <button
          onClick={() => {
            const text = `📊 My Interview Readiness Score: ${results.overallScore}/100\n\n🎯 Status: ${results.readinessLevel}\n⏱️ Time to ready: ${results.timeToReady}\n\n✅ Try it yourself!`;
            if (navigator.share) {
              navigator.share({ title: 'InterviewReady Results', text });
            } else {
              navigator.clipboard.writeText(text);
              alert('Results copied to clipboard!');
            }
          }}
          className="flex-1 py-4 bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Share Results
        </button>
      </div>

      {/* Footer */}
      <div className="text-center pt-8 pb-4">
        <p className="text-slate-500 text-sm">
          Built for students preparing for their dream interviews 🚀
        </p>
      </div>
    </div>
  );
}
