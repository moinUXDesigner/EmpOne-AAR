import { useState } from 'react';
import { Award, TrendingUp, ArrowLeft, Calendar, FileText, MessageSquare, Check, Star, BookOpen, LayoutGrid, List, Clock, CheckCircle, Database, Unlock, Gavel } from 'lucide-react';
import { useNavigate } from 'react-router';

// Medal image URLs - trying alternative format
const platinumMedal = 'https://lh3.googleusercontent.com/d/1bwqTnvgL9cBnTbDwQIfxsa_Sj4vyzWfs';
const goldMedal = 'https://lh3.googleusercontent.com/d/1aux4YIMvh5vmvdAxT_C1AFToRjuD8VFf';
const silverMedal = 'https://lh3.googleusercontent.com/d/1UxKqpr3-svDOMy40FiwObJyQVCIzSvVr';
const bronzeMedal = 'https://lh3.googleusercontent.com/d/1Syofn0zawFQf8bPyZnMHyROiSWkNumey';

const FinalScore = () => {
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
  const navigate = useNavigate();

  // Helper function to get letter grade from score
  const getLetterGrade = (score: number): string => {
    if (score >= 9.0) return 'A';
    if (score >= 8.0) return 'B';
    if (score >= 7.0) return 'C';
    if (score >= 6.0) return 'D';
    return 'E';
  };

  // Helper function to get badge info
  const getBadgeInfo = (score: number) => {
    const grade = getLetterGrade(score);
    switch (grade) {
      case 'A':
        return { 
          name: 'Platinum', 
          color: 'from-slate-300 via-slate-100 to-slate-300',
          borderColor: 'border-slate-400',
          textColor: 'text-slate-800',
          shine: 'bg-gradient-to-br from-white/40 to-transparent'
        };
      case 'B':
        return { 
          name: 'Gold', 
          color: 'from-yellow-400 via-yellow-200 to-yellow-400',
          borderColor: 'border-yellow-500',
          textColor: 'text-yellow-900',
          shine: 'bg-gradient-to-br from-white/40 to-transparent'
        };
      case 'C':
        return { 
          name: 'Silver', 
          color: 'from-gray-300 via-gray-100 to-gray-300',
          borderColor: 'border-gray-400',
          textColor: 'text-gray-800',
          shine: 'bg-gradient-to-br from-white/40 to-transparent'
        };
      case 'D':
        return { 
          name: 'Bronze', 
          color: 'from-orange-400 via-orange-200 to-orange-400',
          borderColor: 'border-orange-500',
          textColor: 'text-orange-900',
          shine: 'bg-gradient-to-br from-white/40 to-transparent'
        };
      default: // E Grade
        return { 
          name: 'Development', 
          color: 'from-blue-400 via-purple-300 to-blue-400',
          borderColor: 'border-blue-500',
          textColor: 'text-blue-900',
          shine: 'bg-gradient-to-br from-white/30 to-transparent'
        };
    }
  };

  // Helper function to get star color based on grade
  const getStarColor = (score: number): string => {
    const grade = getLetterGrade(score);
    switch (grade) {
      case 'A':
      case 'B':
        return '#FFD700'; // Gold
      case 'C':
        return '#C0C0C0'; // Silver
      case 'D':
        return '#CD7F32'; // Bronze
      default: // E Grade
        return '#9CA3AF'; // Gray
    }
  };

  // Star Rating Component
  const StarRating = ({ score }: { score: number }) => {
    const starColor = getStarColor(score);
    const starRating = (score / 10) * 5; // Convert 10-point to 5-star scale
    const fullStars = Math.floor(starRating);
    const hasHalfStar = starRating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center gap-1">
        {/* Full Stars */}
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="w-5 h-5" fill={starColor} stroke={starColor} />
        ))}
        {/* Half Star */}
        {hasHalfStar && (
          <div className="relative w-5 h-5">
            <Star className="w-5 h-5 absolute" fill="none" stroke={starColor} />
            <div className="overflow-hidden w-1/2 absolute">
              <Star className="w-5 h-5" fill={starColor} stroke={starColor} />
            </div>
          </div>
        )}
        {/* Empty Stars */}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className="w-5 h-5" fill="none" stroke={starColor} />
        ))}
      </div>
    );
  };

  // Badge Component
  const AchievementBadge = ({ score }: { score: number }) => {
    const badge = getBadgeInfo(score);
    const grade = getLetterGrade(score);

    // For E Grade, show Development badge with icon
    if (grade === 'E') {
      return (
        <div className="flex flex-col items-center">
          <div className={`relative w-16 h-20 bg-gradient-to-br ${badge.color} ${badge.borderColor} border-2 rounded-t-full rounded-b-sm shadow-lg`}>
            {/* Shine effect */}
            <div className={`absolute inset-0 ${badge.shine} rounded-t-full rounded-b-sm`}></div>
            
            {/* Icon */}
            <div className="absolute inset-0 flex items-center justify-center pt-2">
              <BookOpen className={`w-8 h-8 ${badge.textColor}`} />
            </div>
            
            {/* Ribbon bottom */}
            <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-3 bg-gradient-to-b ${badge.color}`}>
              <div className="absolute -bottom-2 left-0 w-0 h-0 border-l-[20px] border-l-transparent border-t-[8px] border-t-current" style={{ color: '#3b82f6' }}></div>
              <div className="absolute -bottom-2 right-0 w-0 h-0 border-r-[20px] border-r-transparent border-t-[8px] border-t-current" style={{ color: '#3b82f6' }}></div>
            </div>
          </div>
          <p className={`text-xs font-semibold mt-2 ${badge.textColor}`}>{badge.name}</p>
        </div>
      );
    }

    // For A, B, C, D grades - use individual medal images
    let medalImage = silverMedal;
    if (grade === 'A') medalImage = platinumMedal;
    if (grade === 'B') medalImage = goldMedal;
    if (grade === 'C') medalImage = silverMedal;
    if (grade === 'D') medalImage = bronzeMedal;

    return (
      <div className="flex flex-col items-center">
        <div className="w-20 h-20 flex items-center justify-center">
          <img 
            src={medalImage} 
            alt={`${badge.name} Medal`}
            className="w-14 h-14 object-contain drop-shadow-lg"
          />
        </div>
      </div>
    );
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'Outstanding': return 'bg-green-100 text-green-800 border-green-200';
      case 'Very Good': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Good': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 9) return 'from-green-50 to-green-100 border-green-200';
    if (score >= 8) return 'from-blue-50 to-blue-100 border-blue-200';
    if (score >= 7) return 'from-yellow-50 to-yellow-100 border-yellow-200';
    return 'from-gray-50 to-gray-100 border-gray-200';
  };

  // Performance reports data for different financial years
  const performanceReports = [
    {
      id: 1,
      financialYear: '2025-26',
      period: 'Apr 2025 - Mar 2026',
      status: 'approved',
      disclosedDate: 'March 15, 2026',
      scores: {
        kra: { score: 8.5, weight: 60, weighted: 5.1 },
        personalAttributes: { score: 9.0, weight: 20, weighted: 1.8 },
        functionalCompetency: { score: 8.0, weight: 20, weighted: 1.6 },
        total: 8.5,
        grade: 'Very Good'
      },
      kraBreakdown: [
        { title: 'Project Delivery', weight: 40, rating: 9, weighted: 3.6 },
        { title: 'Team Management', weight: 30, rating: 8, weighted: 2.4 },
        { title: 'Client Satisfaction', weight: 30, rating: 8, weighted: 2.4 },
      ],
      summary: {
        keyOutcomes: 'Successfully delivered 5 major projects ahead of schedule. Demonstrated excellent leadership in managing cross-functional teams. Maintained high client satisfaction throughout the year.',
        strengths: [
          'Strong project management and execution capabilities',
          'Excellent communication and stakeholder management',
          'Proactive problem-solving approach'
        ],
        improvements: [
          'Can improve on technical documentation',
          'Opportunity to enhance strategic planning skills'
        ]
      }
    },
    {
      id: 2,
      financialYear: '2024-25',
      period: 'Apr 2024 - Mar 2025',
      status: 'in-process',
      currentStage: 'ro',
      disclosedDate: 'March 20, 2025',
      scores: {
        kra: { score: 8.0, weight: 60, weighted: 4.8 },
        personalAttributes: { score: 8.5, weight: 20, weighted: 1.7 },
        functionalCompetency: { score: 7.5, weight: 20, weighted: 1.5 },
        total: 8.0,
        grade: 'Very Good'
      },
      kraBreakdown: [
        { title: 'Project Delivery', weight: 40, rating: 8, weighted: 3.2 },
        { title: 'Team Management', weight: 30, rating: 8, weighted: 2.4 },
        { title: 'Client Satisfaction', weight: 30, rating: 8, weighted: 2.4 },
      ],
      summary: {
        keyOutcomes: 'Delivered all assigned projects within timeline. Good team collaboration and stakeholder management.',
        strengths: [
          'Consistent project delivery',
          'Good technical skills',
          'Team player attitude'
        ],
        improvements: [
          'Scope for leadership development',
          'Can enhance innovation in approach'
        ]
      }
    },
    {
      id: 3,
      financialYear: '2023-24',
      period: 'Apr 2023 - Mar 2024',
      status: 'completed',
      disclosedDate: 'March 18, 2024',
      scores: {
        kra: { score: 7.5, weight: 60, weighted: 4.5 },
        personalAttributes: { score: 8.0, weight: 20, weighted: 1.6 },
        functionalCompetency: { score: 7.0, weight: 20, weighted: 1.4 },
        total: 7.5,
        grade: 'Good'
      },
      kraBreakdown: [
        { title: 'Project Delivery', weight: 40, rating: 7, weighted: 2.8 },
        { title: 'Team Management', weight: 30, rating: 8, weighted: 2.4 },
        { title: 'Client Satisfaction', weight: 30, rating: 8, weighted: 2.4 },
      ],
      summary: {
        keyOutcomes: 'Met all project deliverables. Showed steady improvement in technical and soft skills.',
        strengths: [
          'Dedication and commitment',
          'Willingness to learn',
          'Good interpersonal skills'
        ],
        improvements: [
          'Need to improve time management',
          'Can work on technical depth'
        ]
      }
    },
    {
      id: 4,
      financialYear: '2022-23',
      period: 'Apr 2022 - Mar 2023',
      status: 'completed',
      disclosedDate: 'March 22, 2023',
      scores: {
        kra: { score: 9.2, weight: 60, weighted: 5.52 },
        personalAttributes: { score: 9.5, weight: 20, weighted: 1.9 },
        functionalCompetency: { score: 9.0, weight: 20, weighted: 1.8 },
        total: 9.2,
        grade: 'Outstanding'
      },
      kraBreakdown: [
        { title: 'Project Delivery', weight: 40, rating: 10, weighted: 4.0 },
        { title: 'Team Management', weight: 30, rating: 9, weighted: 2.7 },
        { title: 'Client Satisfaction', weight: 30, rating: 9, weighted: 2.7 },
      ],
      summary: {
        keyOutcomes: 'Exceptional performance across all parameters. Led critical organizational initiatives and exceeded all targets. Demonstrated exemplary leadership and innovation.',
        strengths: [
          'Outstanding strategic vision and execution',
          'Exceptional stakeholder management and influence',
          'Innovative problem-solving and continuous improvement mindset',
          'Mentored junior team members effectively'
        ],
        improvements: [
          'Continue to share best practices across teams',
          'Opportunity to take on enterprise-level initiatives'
        ]
      }
    },
    {
      id: 5,
      financialYear: '2021-22',
      period: 'Apr 2021 - Mar 2022',
      status: 'completed',
      disclosedDate: 'March 25, 2022',
      scores: {
        kra: { score: 6.5, weight: 60, weighted: 3.9 },
        personalAttributes: { score: 6.8, weight: 20, weighted: 1.36 },
        functionalCompetency: { score: 6.2, weight: 20, weighted: 1.24 },
        total: 6.5,
        grade: 'Satisfactory'
      },
      kraBreakdown: [
        { title: 'Project Delivery', weight: 40, rating: 6, weighted: 2.4 },
        { title: 'Team Management', weight: 30, rating: 7, weighted: 2.1 },
        { title: 'Client Satisfaction', weight: 30, rating: 7, weighted: 2.1 },
      ],
      summary: {
        keyOutcomes: 'Completed assigned tasks with acceptable quality. Showed improvement in the second half of the year. Met basic expectations.',
        strengths: [
          'Improved consistency in the latter half',
          'Good attitude and willingness to learn',
          'Responsive to feedback'
        ],
        improvements: [
          'Need significant improvement in technical skills',
          'Should focus on timely delivery',
          'Can enhance attention to detail',
          'Needs to be more proactive in communication'
        ]
      }
    }
  ];

  // Find selected report
  const selectedReport = performanceReports.find(r => r.financialYear === selectedYear);

  // If no year selected, show list view
  if (!selectedYear || !selectedReport) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Performance Reports</h1>
          <p className="text-gray-600 mt-1">View your performance evaluation results across financial years</p>
        </div>

        {/* APAR Cell Status — current year */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">APAR Cell Processing Status</h2>
            <span className="text-xs text-gray-500">FY 2025–2026</span>
          </div>
          <div className="flex flex-wrap gap-0">
            {[
              { icon: CheckCircle, label: 'AA Approved', date: 'Mar 10, 2026', done: true, color: 'text-green-600' },
              { icon: Unlock, label: 'PO Disclosed', date: 'Mar 15, 2026', done: true, color: 'text-green-600' },
              { icon: MessageSquare, label: 'Representation Filed', date: 'Mar 20, 2026', done: true, color: 'text-orange-600' },
              { icon: Gavel, label: 'Appeal Committee', date: 'Pending', done: false, color: 'text-purple-500' },
              { icon: Database, label: 'Published to SAP', date: '—', done: false, color: 'text-gray-400' },
            ].map((step, idx, arr) => (
              <div key={idx} className="flex items-center">
                <div className="flex flex-col items-center text-center w-28 sm:w-32">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center mb-2 ${step.done ? 'bg-green-50 border-2 border-green-500' : 'bg-gray-50 border-2 border-gray-200'}`}>
                    <step.icon className={`w-4 h-4 ${step.done ? step.color : 'text-gray-300'}`} />
                  </div>
                  <p className={`text-xs font-medium leading-tight ${step.done ? 'text-gray-900' : 'text-gray-400'}`}>{step.label}</p>
                  <p className={`text-[10px] mt-0.5 ${step.done ? 'text-gray-500' : 'text-gray-300'}`}>{step.date}</p>
                </div>
                {idx < arr.length - 1 && (
                  <div className={`w-4 h-0.5 mb-6 ${step.done ? 'bg-green-300' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-orange-50 border border-orange-100 rounded-lg">
            <p className="text-xs text-orange-700">
              <span className="font-semibold">Status:</span> Your representation for FY 2025–2026 has been forwarded to the Appeal Committee by the Personnel Officer. Awaiting final decision.
            </p>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center justify-end">
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('card')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors ${
                viewMode === 'card'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="text-sm font-medium">Card</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors ${
                viewMode === 'table'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <List className="w-4 h-4" />
              <span className="text-sm font-medium">Table</span>
            </button>
          </div>
        </div>

        {/* Card View */}
        {viewMode === 'card' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {performanceReports.map((report) => (
              <div 
                key={report.id}
                onClick={() => setSelectedYear(report.financialYear)}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all cursor-pointer group"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                      <Calendar className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">FY {report.financialYear}</h3>
                      <p className="text-xs text-gray-500">{report.period}</p>
                    </div>
                  </div>
                  
                  {/* Approved Badge */}
                  {report.status === 'approved' && (
                    <div className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                      <Award className="w-3 h-3" />
                      Approved
                    </div>
                  )}
                </div>

                {/* Score Display */}
                <div className={`bg-gradient-to-br ${getScoreColor(report.scores.total)} rounded-lg border-2 p-4 mb-4`}>
                  {/* Overall Score and View Report - flex justify-between */}
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-medium text-gray-600">Overall Score</p>
                    <span className="text-sm text-blue-600 group-hover:text-blue-700 font-medium inline-flex items-center gap-1">
                      View Report
                      <FileText className="w-4 h-4" />
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-3xl font-bold text-gray-900">{report.scores.total}</span>
                    <span className="text-lg text-gray-600">/10</span>
                  </div>
                  {/* Grade Badge and Disclosed Date - flex justify-between */}
                  <div className="flex items-center justify-between">
                    <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getGradeColor(report.scores.grade)}`}>
                      <Award className="w-3 h-3" />
                      {report.scores.grade}
                    </div>
                    <span className="text-xs text-gray-500">
                      Disclosed: {report.disclosedDate}
                    </span>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">KRA Score</span>
                    <span className="font-semibold text-gray-900">{report.scores.kra.score}/10</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Personal Attributes</span>
                    <span className="font-semibold text-gray-900">{report.scores.personalAttributes.score}/10</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Functional Competency</span>
                    <span className="font-semibold text-gray-900">{report.scores.functionalCompetency.score}/10</span>
                  </div>
                </div>

                {/* Footer - Timeline for in-process reports */}
                {report.status === 'in-process' && (
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                        report.currentStage === 'submitted' || report.currentStage === 'ro' || report.currentStage === 'rvo' || report.currentStage === 'aa'
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-300 text-gray-600'
                      }`}>
                        <Check className="w-3 h-3" />
                      </div>
                      
                      <div className={`flex-1 h-0.5 ${
                        report.currentStage === 'ro' || report.currentStage === 'rvo' || report.currentStage === 'aa'
                          ? 'bg-green-500'
                          : 'bg-gray-300'
                      }`}></div>
                      
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                        report.currentStage === 'ro' || report.currentStage === 'rvo' || report.currentStage === 'aa'
                          ? 'bg-green-500 text-white'
                          : report.currentStage === 'submitted'
                          ? 'bg-blue-500 text-white animate-pulse'
                          : 'bg-gray-300 text-gray-600'
                      }`}>
                        {(report.currentStage === 'ro' || report.currentStage === 'rvo' || report.currentStage === 'aa') && (
                          <Check className="w-3 h-3" />
                        )}
                      </div>
                      
                      <div className={`flex-1 h-0.5 ${
                        report.currentStage === 'rvo' || report.currentStage === 'aa'
                          ? 'bg-green-500'
                          : 'bg-gray-300'
                      }`}></div>
                      
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                        report.currentStage === 'rvo' || report.currentStage === 'aa'
                          ? 'bg-green-500 text-white'
                          : report.currentStage === 'ro'
                          ? 'bg-blue-500 text-white animate-pulse'
                          : 'bg-gray-300 text-gray-600'
                      }`}>
                        {(report.currentStage === 'rvo' || report.currentStage === 'aa') && (
                          <Check className="w-3 h-3" />
                        )}
                      </div>
                      
                      <div className={`flex-1 h-0.5 ${
                        report.currentStage === 'aa'
                          ? 'bg-green-500'
                          : 'bg-gray-300'
                      }`}></div>
                      
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                        report.currentStage === 'aa'
                          ? 'bg-green-500 text-white'
                          : report.currentStage === 'rvo'
                          ? 'bg-blue-500 text-white animate-pulse'
                          : 'bg-gray-300 text-gray-600'
                      }`}>
                        {report.currentStage === 'aa' && (
                          <Check className="w-3 h-3" />
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-600 w-6 text-center">Sub</span>
                      <span className="text-xs text-gray-600 w-6 text-center">RO</span>
                      <span className="text-xs text-gray-600 w-6 text-center">RVO</span>
                      <span className="text-xs text-gray-600 w-6 text-center">AA</span>
                    </div>
                  </div>
                )}

                {/* Footer - Stars & Badge for approved/completed reports */}
                {(report.status === 'approved' || report.status === 'completed') && (
                  <div className="border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <StarRating score={report.scores.total} />
                      <AchievementBadge score={report.scores.total} />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Table View */}
        {viewMode === 'table' && (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Financial Year</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Period</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-700">Overall Score</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-700">Grade</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-700">KRA Score</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-700">PA Score</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-700">FC Score</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {performanceReports.map((report) => (
                    <tr key={report.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="font-semibold text-gray-900">FY {report.financialYear}</div>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">{report.period}</td>
                      <td className="py-4 px-4">
                        {report.status === 'approved' && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                            <Award className="w-3 h-3" />
                            Approved
                          </span>
                        )}
                        {report.status === 'in-process' && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                            <Clock className="w-3 h-3" />
                            In-Process
                          </span>
                        )}
                        {report.status === 'completed' && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
                            <Check className="w-3 h-3" />
                            Completed
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="text-2xl font-bold text-gray-900">{report.scores.total}</div>
                        <div className="text-xs text-gray-500">/10</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex justify-center">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getGradeColor(report.scores.grade)}`}>
                            <Award className="w-3 h-3" />
                            {report.scores.grade}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="font-semibold text-gray-900">{report.scores.kra.score}</div>
                        <div className="text-xs text-gray-500">({report.scores.kra.weight}%)</div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="font-semibold text-gray-900">{report.scores.personalAttributes.score}</div>
                        <div className="text-xs text-gray-500">({report.scores.personalAttributes.weight}%)</div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="font-semibold text-gray-900">{report.scores.functionalCompetency.score}</div>
                        <div className="text-xs text-gray-500">({report.scores.functionalCompetency.weight}%)</div>
                      </td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => setSelectedYear(report.financialYear)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                          <FileText className="w-4 h-4" />
                          View Report
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Detailed Report View
  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div>
        <button
          onClick={() => setSelectedYear(null)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to All Reports</span>
        </button>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Performance Report</h1>
            <p className="text-gray-600 mt-1">Financial Year {selectedReport.financialYear} ({selectedReport.period})</p>
          </div>
          <button 
            onClick={() => navigate('/my-pms/representation')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            Make Representation
          </button>
        </div>
      </div>

      {/* Overall Score Card */}
      <div className={`bg-gradient-to-br ${getScoreColor(selectedReport.scores.total)} rounded-lg border-2 p-4`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-600 mb-1">Overall Performance Score</p>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-gray-900">{selectedReport.scores.total}</span>
              <span className="text-lg text-gray-600">/10</span>
            </div>
          </div>
          <div className={`px-4 py-2 rounded-lg border-2 ${getGradeColor(selectedReport.scores.grade)}`}>
            <Award className="w-6 h-6 mx-auto mb-1" />
            <p className="text-xs font-medium text-center">Grade</p>
            <p className="text-lg font-bold text-center">{selectedReport.scores.grade}</p>
          </div>
        </div>
      </div>

      {/* Section-wise Breakdown */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Section-wise Score Breakdown</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {/* KRA Score */}
            <div className="border border-gray-200 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">KRA Performance</h3>
                  <p className="text-xs text-gray-600">Weight: {selectedReport.scores.kra.weight}%</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-gray-900">{selectedReport.scores.kra.score}</p>
                  <p className="text-xs text-gray-600">Weighted: {selectedReport.scores.kra.weighted}</p>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${(selectedReport.scores.kra.score / 10) * 100}%` }}
                />
              </div>
            </div>

            {/* Personal Attributes */}
            <div className="border border-gray-200 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Personal Attributes</h3>
                  <p className="text-xs text-gray-600">Weight: {selectedReport.scores.personalAttributes.weight}%</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-gray-900">{selectedReport.scores.personalAttributes.score}</p>
                  <p className="text-xs text-gray-600">Weighted: {selectedReport.scores.personalAttributes.weighted}</p>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: `${(selectedReport.scores.personalAttributes.score / 10) * 100}%` }}
                />
              </div>
            </div>

            {/* Functional Competency */}
            <div className="border border-gray-200 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Functional Competency</h3>
                  <p className="text-xs text-gray-600">Weight: {selectedReport.scores.functionalCompetency.weight}%</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-gray-900">{selectedReport.scores.functionalCompetency.score}</p>
                  <p className="text-xs text-gray-600">Weighted: {selectedReport.scores.functionalCompetency.weighted}</p>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full"
                  style={{ width: `${(selectedReport.scores.functionalCompetency.score / 10) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KRA-wise Breakdown */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Individual KRA Scores</h2>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">KRA Title</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-700">Weight %</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-700">Rating</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-700">Weighted Score</th>
                </tr>
              </thead>
              <tbody>
                {selectedReport.kraBreakdown.map((kra, idx) => (
                  <tr key={idx} className="border-b border-gray-100">
                    <td className="py-3 px-4 text-sm text-gray-900">{kra.title}</td>
                    <td className="py-3 px-4 text-sm text-gray-900 text-center">{kra.weight}%</td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-semibold">
                        {kra.rating}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900 text-center font-medium">{kra.weighted}</td>
                  </tr>
                ))}
                <tr className="bg-gray-50 font-semibold">
                  <td className="py-3 px-4 text-sm text-gray-900">Total KRA Score</td>
                  <td className="py-3 px-4 text-sm text-gray-900 text-center">100%</td>
                  <td className="py-3 px-4 text-sm text-gray-900 text-center">{selectedReport.scores.kra.score}</td>
                  <td className="py-3 px-4 text-sm text-gray-900 text-center">{selectedReport.scores.kra.weighted}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Performance Summary</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Key Outcomes</h3>
              <p className="text-sm text-gray-700">
                {selectedReport.summary.keyOutcomes}
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Strengths</h3>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                {selectedReport.summary.strengths.map((strength, idx) => (
                  <li key={idx}>{strength}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Areas for Improvement</h3>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                {selectedReport.summary.improvements.map((improvement, idx) => (
                  <li key={idx}>{improvement}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="text-sm text-gray-600">
          Disclosed on: {selectedReport.disclosedDate}
        </div>
      </div>
    </div>
  );
};

export default FinalScore;