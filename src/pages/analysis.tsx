import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import DashboardLayout from "../components/Layout";
import axios from 'axios';

// Mock data for demonstration
const MOCK_RESUME_ANALYSIS = {
  score: 78,
  jobTitle: "Frontend Developer",
  company: "TechCorp Inc.",
  matchingSkills: [
    { name: "React", level: "Advanced", match: 96 },
    { name: "JavaScript", level: "Advanced", match: 92 },
    { name: "TypeScript", level: "Intermediate", match: 85 },
    { name: "CSS", level: "Advanced", match: 88 },
    { name: "HTML", level: "Advanced", match: 95 },
  ],
  missingSkills: [
    { name: "Next.js", importance: "High", difficulty: "Medium" },
    { name: "GraphQL", importance: "Medium", difficulty: "Medium" },
    { name: "Redux", importance: "High", difficulty: "Medium" },
  ],
  suggestions: [
    "Add more quantifiable achievements",
    "Include keywords like 'component optimization' and 'state management'",
    "Mention experience with CI/CD pipelines",
    "Highlight team collaboration and agile methodology experience"
  ]
};

// Roadmap paths for different skills
const SKILL_ROADMAPS = {
  "Next.js": "/frontend",
  "GraphQL": "/graphql",
  "Redux": "/react",
  "Vue.js": "/vue",
  "Node.js": "/nodejs",
  "Docker": "/docker",
  "Kubernetes": "/kubernetes",
  "AWS": "/aws",
  "React Native": "/react-native",
  "Angular": "/angular",
  "DevOps": "/devops",
  "Blockchain": "/blockchain",
  "Python": "/python",
  "Java": "/java",
  "Go": "/golang",
};

const ATSAnalysis: React.FC = () => {
  const location = useLocation();
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [data,setData] = useState<any>(null);
  // In a real app, you would fetch the analysis results from your API
  useEffect(() => {
    // Mock API call
    const fetchAnalysis = async () => {
      try {
        const result = await axios.post(
          "http://localhost:5000/ats_score_remarks",
          {
            resumeUrl: "your_resume_url_here",
            jobDescription: "your_job_description_here"
          },
          {
            headers: {
              "Content-Type": "application/json"
            }
          }
        );
        console.log(result.data)
        setData(result.data);
        setTimeout(() => {
          setAnalysisData(MOCK_RESUME_ANALYSIS);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching analysis:', error);
        setLoading(false);
      }
    };
    
    fetchAnalysis();
  }, [location]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getMatchColor = (match: number) => {
    if (match >= 80) return 'bg-green-500';
    if (match >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'Advanced':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Advanced</span>;
      case 'Intermediate':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Intermediate</span>;
      case 'Beginner':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Beginner</span>;
      default:
        return null;
    }
  };

  const getImportanceBadge = (importance: string) => {
    switch (importance) {
      case 'High':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">High Priority</span>;
      case 'Medium':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Medium Priority</span>;
      case 'Low':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Low Priority</span>;
      default:
        return null;
    }
  };

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'High':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Hard</span>;
      case 'Medium':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Medium</span>;
      case 'Low':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Easy</span>;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto pt-10">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 flex flex-col items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Analyzing your resume...</p>
        </div>
      </div>
    );
  }

  if (!analysisData) {
    return (
      <div className="max-w-5xl mx-auto pt-10">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto text-gray-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          <h2 className="mt-2 text-lg font-medium text-gray-900">No analysis data found</h2>
          <p className="mt-1 text-gray-500">Please generate a resume first using our Resume Builder.</p>
          <div className="mt-6">
            <Link to="/resume-builder" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
              Go to Resume Builder
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">ATS Score Analysis</h1>
        <p className="mt-2 text-gray-600">
          See how your resume performs against ATS systems and get recommendations for improvement.
        </p>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Summary Header */}
        <div className="p-6 border-b border-gray-200 bg-blue-50">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center">
                <div className="ml-4 flex-shrink-0">
                  <span className={`inline-flex items-center px-1 py-0.5 rounded-full text-sm font-medium ${getScoreColor(analysisData.score)} bg-gray-100`}>
                    ATS Score: {analysisData.score}/100
                  </span>
                </div>
              </div>
              <p className="mt-1 text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link to="/resume-builder" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                Update Resume
              </Link>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('skills')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'skills'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Skills Analysis
            </button>
            <button
              onClick={() => setActiveTab('roadmap')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'roadmap'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Learning Roadmap
            </button>
            <button
              onClick={() => setActiveTab('suggestions')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'suggestions'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Improvement Suggestions
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">ATS Score Breakdown</h3>
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-500">ATS Score</span>
                    <span className={`text-sm font-medium ${getScoreColor(analysisData.score)}`}>{analysisData.score}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${analysisData.score >= 80 ? 'bg-green-600' : analysisData.score >= 60 ? 'bg-yellow-500' : 'bg-red-600'}`}
                      style={{ width: `${analysisData.score}%` }}
                    ></div>
                  </div>
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded border border-gray-200">
                      <div className="text-sm font-medium text-gray-500">Keyword Match</div>
                      <div className="mt-1 text-2xl font-semibold">{data.matrix1[0]}%</div>
                    </div>
                    <div className="bg-white p-4 rounded border border-gray-200">
                      <div className="text-sm font-medium text-gray-500">Skills Match</div>
                      <div className="mt-1 text-2xl font-semibold">{data.matrix1[1]}%</div>
                    </div>
                    <div className="bg-white p-4 rounded border border-gray-200">
                      <div className="text-sm font-medium text-gray-500">Format Score</div>
                      <div className="mt-1 text-2xl font-semibold">{data.matrix1[2]}%</div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Skills Summary</h3>
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-3">Matching Skills</h4>
                      <ul className="space-y-2">
                      {data.matrix2.slice(0, 3).map((skill: string, index: number) => (
                        <li key={index} className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-green-500 mr-2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-gray-700">{skill}</span>
                        </li>
                      ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-3">Missing Skills</h4>
                      <ul className="space-y-2">
                      {data.matrix3.slice(0, 3).map((skill: string, index: number) => (
                        <li key={index} className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-red-500 mr-2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                          </svg>
                          <span className="text-gray-700">{skill}</span>
                        </li>
                      ))}

                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Skills Analysis Tab */}
          {activeTab === 'skills' && (
            <div>
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Matching Skills</h3>
                <div className="bg-gray-50 rounded-lg border border-gray-200">
                  <div className="overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-100">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Skill</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Your Level</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Match Score</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {analysisData.matchingSkills.map((skill: any, index: number) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{skill.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {getLevelBadge(skill.level)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                                  <div className={`h-2 rounded-full ${getMatchColor(skill.match)}`} style={{ width: `${skill.match}%` }}></div>
                                </div>
                                <span className="text-sm font-medium text-gray-900">{skill.match}%</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Missing Skills</h3>
                <div className="bg-gray-50 rounded-lg border border-gray-200">
                  <div className="overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-100">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Skill</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Importance</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Difficulty</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {analysisData.missingSkills.map((skill: any, index: number) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{skill.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {getImportanceBadge(skill.importance)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {getDifficultyBadge(skill.difficulty)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <button 
                                onClick={() => setActiveTab('roadmap')}
                                className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200"
                              >
                                View Roadmap
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Learning Roadmap Tab */}
          {activeTab === 'roadmap' && (
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Learning Roadmaps</h3>
                 <Link
                 to="/roadmap"
                 className="mb-8 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition duration-200">Get Roadmap
                 </Link>
                <p className="text-gray-600 my-4">
                  Below are recommended learning paths from <a href="https://roadmap.sh" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">roadmap.sh</a> to help you acquire the missing skills for this position.
                </p>
              </div>

              {analysisData.missingSkills.map((skill: any, index: number) => (
                <div key={index} className="mb-8 bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                  <div className="bg-blue-50 px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-medium text-gray-900">{skill.name} Learning Path</h4>
                      {getImportanceBadge(skill.importance)}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="space-y-6">
                      {/* Step 1 */}
                      <div className="relative pl-8 pb-6 border-l-2 border-blue-200">
                        <div className="absolute left-0 top-0 -translate-x-1/2 w-4 h-4 rounded-full bg-blue-500"></div>
                        <h5 className="font-medium text-gray-900">Fundamentals</h5>
                        <p className="mt-2 text-sm text-gray-600">
                          Learn the basic concepts and core principles of {skill.name}.
                        </p>
                        <div className="mt-3">
                          <a 
                            href={`https://roadmap.sh${SKILL_ROADMAPS[skill.name as keyof typeof SKILL_ROADMAPS] || '/frontend'}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline">
                            View detailed guide on roadmap.sh
                          </a>
                        </div>
                      </div>
                      
                      {/* Step 2 */}
                      <div className="relative pl-8 pb-6 border-l-2 border-blue-200">
                        <div className="absolute left-0 top-0 -translate-x-1/2 w-4 h-4 rounded-full bg-blue-500"></div>
                        <h5 className="font-medium text-gray-900">Hands-on Projects</h5>
                        <p className="mt-2 text-sm text-gray-600">
                          Build practical projects to solidify your understanding of {skill.name}.
                        </p>
                        <div className="mt-3">
                          <button className="text-sm text-blue-600 hover:underline">
                            View recommended projects
                          </button>
                        </div>
                      </div>
                      
                      {/* Step 3 */}
                      <div className="relative pl-8">
                        <div className="absolute left-0 top-0 -translate-x-1/2 w-4 h-4 rounded-full bg-blue-500"></div>
                        <h5 className="font-medium text-gray-900">Advanced Topics</h5>
                        <p className="mt-2 text-sm text-gray-600">
                          Explore advanced concepts and best practices for {skill.name}.
                        </p>
                        <div className="mt-3">
                          <button className="text-sm text-blue-600 hover:underline">
                            View advanced resources
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h5 className="font-medium text-gray-900 mb-3">Recommended Resources</h5>
                      <div className="space-y-3">
                        <div className="flex items-start">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-blue-500 mr-2 mt-0.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                          </svg>
                          <div>
                            <h6 className="text-sm font-medium text-gray-900">Official Documentation</h6>
                            <p className="text-sm text-gray-600">{skill.name} comprehensive guide</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-blue-500 mr-2 mt-0.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" />
                          </svg>
                          <div>
                            <h6 className="text-sm font-medium text-gray-900">Video Course</h6>
                            <p className="text-sm text-gray-600">Complete {skill.name} tutorial series</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-blue-500 mr-2 mt-0.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
                          </svg>
                          <div>
                            <h6 className="text-sm font-medium text-gray-900">Interactive Learning</h6>
                            <p className="text-sm text-gray-600">Practice-based {skill.name} learning platform</p>
                          </div>
                        </div>
                    </div>
                 </div>
              </div>          
           </div>))}
          </div>)}
        </div>
      </div>
    </div>
    </DashboardLayout>
)}

export default ATSAnalysis;