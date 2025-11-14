import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  BarChart3,
  Building2,
  Clock,
  DollarSign,
  Shield,
  TrendingUp,
  Download,
  Share2,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Target,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { AdvancedRecommendationEngine } from './advanced-recommend';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Analysis Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
          <div className="text-slate-500">Analysis temporarily unavailable</div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Then wrap your main component
export function RecommendationAnalysis(props) {
  return (
    <ErrorBoundary>
      <RecommendationAnalysisContent {...props} />
    </ErrorBoundary>
  );
}
function RecommendationAnalysisContent({ project, providers, selectedProviders = [] }) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState(new Set(['executiveSummary']));
  const [engine, setEngine] = useState(null);

  useEffect(() => {
    if (project && providers.length > 0) {
      const recommendationEngine = new AdvancedRecommendationEngine(project, providers);
      setEngine(recommendationEngine);
      
      loadAnalysis(recommendationEngine);
    }
  }, [project, providers]);

  const loadAnalysis = async (engine) => {
    setLoading(true);
    try {
      const report = await engine.generateMasterRecommendationReport();
      setAnalysis(report);
    } catch (error) {
      console.error('Failed to load analysis:', error);
    }
    setLoading(false);
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <span className="ml-3 text-slate-600">Generating comprehensive analysis...</span>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
        <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Analysis Unavailable</h3>
        <p className="text-slate-600">Unable to generate analysis at this time. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Executive Summary - Always visible */}
      <AnalysisSection
        title="Executive Summary"
        icon={Brain}
        isExpanded={true}
        onToggle={() => {}}
        alwaysOpen
      >
        <div className="prose prose-sm max-w-none">
          <p className="text-slate-700 leading-relaxed">{analysis.executiveSummary}</p>
        </div>
        
        {/* Key Metrics Grid */}
        {analysis.calculatedMetrics && (
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard
              icon={DollarSign}
              label="Budget Adequacy"
              value={`${Math.round(analysis.calculatedMetrics.budgetAdequacyScore * 100)}%`}
              color={analysis.calculatedMetrics.budgetAdequacyScore > 0.8 ? 'green' : 
                     analysis.calculatedMetrics.budgetAdequacyScore > 0.6 ? 'amber' : 'red'}
            />
            <MetricCard
              icon={Clock}
              label="Timeline Feasibility"
              value={`${Math.round(analysis.calculatedMetrics.timelineFeasibility * 100)}%`}
              color={analysis.calculatedMetrics.timelineFeasibility > 0.8 ? 'green' : 
                     analysis.calculatedMetrics.timelineFeasibility > 0.6 ? 'amber' : 'red'}
            />
            <MetricCard
              icon={Building2}
              label="Market Competitiveness"
              value={`${Math.round(analysis.calculatedMetrics.marketCompetitiveness * 100)}%`}
              color={analysis.calculatedMetrics.marketCompetitiveness > 0.7 ? 'green' : 'amber'}
            />
            <MetricCard
              icon={TrendingUp}
              label="Technology Readiness"
              value={`${Math.round(analysis.calculatedMetrics.technologyReadiness * 100)}%`}
              color={analysis.calculatedMetrics.technologyReadiness > 0.8 ? 'green' : 
                     analysis.calculatedMetrics.technologyReadiness > 0.6 ? 'amber' : 'red'}
            />
          </div>
        )}
      </AnalysisSection>

      {/* Market Analysis */}
      <AnalysisSection
        title="Saudi Market Intelligence"
        icon={BarChart3}
        isExpanded={expandedSections.has('market')}
        onToggle={() => toggleSection('market')}
      >
        {analysis.marketAnalysis && (
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-lg p-4">
                <h4 className="font-semibold text-slate-900 mb-2">Regional Trends</h4>
                <p className="text-sm text-slate-700">{analysis.marketAnalysis.regionalTrends}</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-4">
                <h4 className="font-semibold text-slate-900 mb-2">Regulatory Environment</h4>
                <p className="text-sm text-slate-700">{analysis.marketAnalysis.regulatoryEnvironment}</p>
              </div>
            </div>
            
            {analysis.saudiMarketIntelligence && (
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">Market Specific Insights</h4>
                <div className="grid sm:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="font-medium">Growth Rate:</span>{' '}
                    {analysis.saudiMarketIntelligence.growthRate}
                  </div>
                  <div>
                    <span className="font-medium">Key Drivers:</span>{' '}
                    {analysis.saudiMarketIntelligence.keyDrivers?.join(', ')}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </AnalysisSection>

      {/* Technology Recommendations */}
      <AnalysisSection
        title="Technology Recommendations"
        icon={Lightbulb}
        isExpanded={expandedSections.has('technology')}
        onToggle={() => toggleSection('technology')}
      >
        {analysis.technologyRecommendations?.map((tech, index) => (
          <TechnologyCard key={index} technology={tech} />
        ))}
      </AnalysisSection>

      {/* Provider Analysis */}
      <AnalysisSection
        title="Provider Analysis"
        icon={Building2}
        isExpanded={expandedSections.has('providers')}
        onToggle={() => toggleSection('providers')}
      >
        {analysis.providerAnalysis?.map((provider, index) => (
          <ProviderAnalysisCard key={index} provider={provider} />
        ))}
      </AnalysisSection>

      {/* Risk Assessment */}
      <AnalysisSection
        title="Risk Assessment & Mitigation"
        icon={Shield}
        isExpanded={expandedSections.has('risk')}
        onToggle={() => toggleSection('risk')}
      >
        {analysis.riskAssessment && (
          <RiskAssessment riskData={analysis.riskAssessment} />
        )}
      </AnalysisSection>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t border-slate-200">
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          <Download className="h-4 w-4" />
          Download Full Report
        </button>
        <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:border-slate-400 transition-colors">
          <Share2 className="h-4 w-4" />
          Share Analysis
        </button>
      </div>
    </div>
  );
}

function AnalysisSection({ title, icon: Icon, isExpanded, onToggle, alwaysOpen = false, children }) {
  return (
    <motion.div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <button
        onClick={onToggle}
        className={`w-full px-6 py-4 flex items-center justify-between text-left ${
          !alwaysOpen ? 'hover:bg-slate-50 cursor-pointer' : 'cursor-default'
        }`}
        disabled={alwaysOpen}
      >
        <div className="flex items-center gap-3">
          <Icon className="h-5 w-5 text-indigo-600" />
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        </div>
        {!alwaysOpen && (
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="h-5 w-5 text-slate-400" />
          </motion.div>
        )}
      </button>
      
      <AnimatePresence>
        {(isExpanded || alwaysOpen) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-6 pb-6">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function MetricCard({ icon: Icon, label, value, color = 'slate' }) {
  const colorClasses = {
    green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    red: 'bg-red-50 text-red-700 border-red-200',
    slate: 'bg-slate-50 text-slate-700 border-slate-200'
  };

  return (
    <div className={`rounded-lg border p-3 text-center ${colorClasses[color]}`}>
      <Icon className="h-6 w-6 mx-auto mb-2" />
      <div className="text-lg font-bold">{value}</div>
      <div className="text-xs opacity-80">{label}</div>
    </div>
  );
}

function TechnologyCard({ technology }) {
  return (
    <div className="bg-slate-50 rounded-lg p-4 mb-4 last:mb-0">
      <h4 className="font-semibold text-slate-900 mb-3">{technology.technology}</h4>
      
      <div className="grid md:grid-cols-2 gap-4 text-sm">
        <div>
          <h5 className="font-medium text-slate-700 mb-1">Justification</h5>
          <p className="text-slate-600">{technology.justification}</p>
        </div>
        
        <div>
          <h5 className="font-medium text-slate-700 mb-1">Saudi Advantages</h5>
          <p className="text-slate-600">{technology.saudiAdvantages}</p>
        </div>
        
        <div>
          <h5 className="font-medium text-slate-700 mb-1">Financial Impact</h5>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>Cost Impact:</span>
              <span className="font-medium">{technology.costImpact}</span>
            </div>
            <div className="flex justify-between">
              <span>Timeline Impact:</span>
              <span className="font-medium">{technology.timelineImpact}</span>
            </div>
          </div>
        </div>
        
        <div>
          <h5 className="font-medium text-slate-700 mb-1">Risk Assessment</h5>
          <p className="text-slate-600">{technology.riskAssessment}</p>
        </div>
      </div>
    </div>
  );
}

function ProviderAnalysisCard({ provider }) {
  return (
    <div className="border border-slate-200 rounded-lg p-4 mb-4 last:mb-0">
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-semibold text-slate-900">{provider.providerName}</h4>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
          provider.recommendationLevel === 'High' 
            ? 'bg-emerald-100 text-emerald-800'
            : provider.recommendationLevel === 'Medium'
            ? 'bg-amber-100 text-amber-800'
            : 'bg-slate-100 text-slate-800'
        }`}>
          {provider.recommendationLevel} Recommendation
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-4 text-sm">
        <div>
          <h5 className="font-medium text-slate-700 mb-2">Strengths</h5>
          <ul className="space-y-1">
            {provider.strengths?.map((strength, index) => (
              <li key={index} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h5 className="font-medium text-slate-700 mb-2">Project Fit</h5>
          <p className="text-slate-600 mb-3">{provider.projectFit}</p>
          
          <div className="flex items-center justify-between">
            <span className="text-slate-700">Saudi Experience:</span>
            <span className="font-medium">{provider.saudiExperience}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-slate-700">Innovation Score:</span>
            <span className="font-medium">{provider.innovationScore}/10</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function RiskAssessment({ riskData }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-slate-900">Overall Risk Level</h4>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
          riskData.overallRiskLevel === 'Low' 
            ? 'bg-emerald-100 text-emerald-800'
            : riskData.overallRiskLevel === 'Medium'
            ? 'bg-amber-100 text-amber-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {riskData.overallRiskLevel} Risk
        </div>
      </div>
      
      {riskData.riskCategories?.map((category, index) => (
        <div key={index} className="border border-slate-200 rounded-lg p-4">
          <h5 className="font-semibold text-slate-900 mb-3">{category.category} Risks</h5>
          
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h6 className="font-medium text-slate-700 mb-2">Identified Risks</h6>
              <ul className="space-y-1">
                {category.risks?.map((risk, riskIndex) => (
                  <li key={riskIndex} className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span>{risk}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h6 className="font-medium text-slate-700 mb-2">Mitigation Strategies</h6>
              <ul className="space-y-1">
                {category.mitigation?.map((strategy, strategyIndex) => (
                  <li key={strategyIndex} className="flex items-start gap-2">
                    <Shield className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span>{strategy}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}