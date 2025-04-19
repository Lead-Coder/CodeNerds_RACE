import { Link } from "react-router-dom";
import { useState } from "react";

const Landing = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      {/* Navigation */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-900 flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-xl">R</span>
              </div>
              <span className="font-bold text-2xl tracking-tight">RESUME ACE</span>
            </Link>

            <div className="hidden md:flex items-center space-x-6">
              <Link to="/" className="hover:text-publuerple-600 font-medium transition-colors">Home</Link>
              <a href="/" className="px-2.5 hover:text-publuerple-600 font-medium transition-colors">About</a>
              <Link to="/login" className="px-5 py-2 border border-blue-500 text-blue-600 rounded-lg hover:bg-purple-50 transition-colors font-medium">Log in</Link>
              <Link to="/signup" className="px-5 py-2 bg-gradient-to-r from-blue-900 to-blue-600 text-white rounded-lg hover:opacity-90 transition-all shadow-sm font-medium">Sign up</Link>
            </div>

            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {isMenuOpen && (
            <div className="md:hidden mt-4 py-3 space-y-3 border-t border-gray-100">
              <Link to="/" className="block py-2 hover:text-blue-600 font-medium">Home</Link>
              <a href="#features" className="block py-2 hover:text-blue-600 font-medium">Features</a>
              <a href="#pricing" className="block py-2 hover:text-blue-600 font-medium">Pricing</a>
              <div className="flex flex-col space-y-2 pt-2">
                <Link to="/login" className="block px-4 py-2 border border-purple-500 text-purple-600 rounded-lg text-center hover:bg-purple-50">Log in</Link>
                <Link to="/signup" className="block px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg text-center hover:opacity-90">Sign up</Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-16 pb-20 md:pt-20 md:pb-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-12">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-blue-600">Reimagine</span> Your Resume with AI
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
                Transform your resume, ace ATS systems, and land more interviews with our advanced AI-powered platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 group">
                <Link
                to="/signup"
                className="relative inline-block px-8 py-3 text-white rounded-lg text-center font-medium shadow-sm overflow-hidden group"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-pink-500 transition-opacity duration-300 group-hover:opacity-0 z-0"></span>

                <span className="absolute inset-0 bg-gradient-to-r from-black to-blue-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-0"></span>

                <span className="relative z-10">Get Started Free</span>
              </Link>
                <Link to="/#features" className="px-8 py-3 border border-blue-500 text-indigo-600 rounded-lg hover:bg-purple-50 transition-colors text-center font-medium">
                  Explore Features
                </Link>
              </div>
              
              <div className="mt-8 flex items-center space-x-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white overflow-hidden shadow-sm">
                      {/* User avatars would go here */}
                    </div>
                  ))}
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-900">5,000+</span> job seekers improved their resumes this week
                </div>
              </div>
            </div>
            
            <div className="md:w-1/2 md:pl-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl transform rotate-2 shadow-lg"></div>
                <div className="relative bg-white rounded-xl shadow-lg p-6 transition-transform hover:-translate-y-1 duration-300">
                  <div className="mb-4 flex justify-between items-center">
                    <div className="font-semibold text-lg">Resume Score</div>
                    <div className="text-green-500 font-bold text-lg">87%</div>
                  </div>
                  
                  <div className="mb-6">
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                      <div className="h-full bg-gradient-to-r from-purple-500 to-green-500 rounded-full" style={{width: '87%'}}></div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-gray-50 border border-gray-100 shadow-sm hover:border-purple-100 transition-colors">
                      <div className="flex items-start">
                        <div className="p-2 rounded-full bg-green-100 text-green-600 mr-3 flex-shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-medium">Keywords Match</div>
                          <div className="text-sm text-gray-600 mt-1">Your resume matches 92% of required skills</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 rounded-lg bg-gray-50 border border-gray-100 shadow-sm hover:border-purple-100 transition-colors">
                      <div className="flex items-start">
                        <div className="p-2 rounded-full bg-blue-100 text-blue-400 mr-3 flex-shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-medium">Improvement Suggestion</div>
                          <div className="text-sm text-gray-600 mt-1">Add more quantifiable achievements</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 rounded-lg bg-gray-50 border border-gray-100 shadow-sm hover:border-purple-100 transition-colors">
                      <div className="flex items-start">
                        <div className="p-2 rounded-full bg-purple-100 text-purple-600 mr-3 flex-shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-medium">Action Verbs Analysis</div>
                          <div className="text-sm text-gray-600 mt-1">Strong action verbs used throughout</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powered by AI, Built for Success</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform transforms how job seekers create and optimize their application materials
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-100">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center mb-4 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="white" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="font-bold text-xl mb-2">Resume Conversion</h3>
              <p className="text-gray-600">
                Transform resumes from any format into clean, professional layouts using AI-powered parsing
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-100">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center mb-4 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="white" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-bold text-xl mb-2">Content Polishing</h3>
              <p className="text-gray-600">
                Enhance impact with action verb optimization and industry-aligned phrasing
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-100">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center mb-4 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="white" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="font-bold text-xl mb-2">ATS Scoring</h3>
              <p className="text-gray-600">
                Real-time compatibility analysis with actionable feedback for improvement
              </p>
            </div>
            
            {/* Feature 4 */}
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-100">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center mb-4 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="white" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-bold text-xl mb-2">Cover Letters</h3>
              <p className="text-gray-600">
                Job-specific letters that preserve your voice while targeting key requirements
              </p>
            </div>
          </div>
          
          <div className="mt-16 grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all hover:-translate-y-1 duration-300 border border-gray-100">
              <div className="flex items-start">
                <div className="w-12 h-12 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center mr-4 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2">Career Profile Builder</h3>
                  <p className="text-gray-600">
                    Consolidate resume data into a living profile with skill mapping, timeline visualizations, 
                    and smart prompts to fill missing information gaps.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all hover:-translate-y-1 duration-300 border border-gray-100">
              <div className="flex items-start">
                <div className="w-12 h-12 rounded-lg bg-pink-100 text-pink-600 flex items-center justify-center mr-4 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2">Document Version Control</h3>
                  <p className="text-gray-600">
                    Track improvements across versions with ATS score comparisons, edit history, 
                    and content density trends to measure your progress.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all hover:-translate-y-1 duration-300 border border-gray-100">
              <div className="flex items-start">
                <div className="w-12 h-12 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center mr-4 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2">Opportunity Sync & Gap Analysis</h3>
                  <p className="text-gray-600">
                    Match with ideal roles while identifying missing skills and recommending 
                    growth paths based on real-time market trends.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all hover:-translate-y-1 duration-300 border border-gray-100">
              <div className="flex items-start">
                <div className="w-12 h-12 rounded-lg bg-green-100 text-green-600 flex items-center justify-center mr-4 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2">Resume Templates</h3>
                  <p className="text-gray-600">
                    Industry-specific LaTeX templates curated for sectors like tech, finance, 
                    academia, and design with modular customization.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-purple-500 to-pink-400 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your Resume?
            </h2>
            <p className="text-xl mb-4 text-white/90">
              Join thousands of job seekers who have improved their career prospects with RACE.
            </p>
            <Link to="/signup" className="inline-block px-8 py-4 bg-white text-purple-600 rounded-lg hover:bg-white/90 transition-colors text-base font-medium shadow-lg">
              Get Started For Free
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-400">
        <div className="container-custom">
          <div className="my-3 py-3 border-t border-gray-800 text-center">
            <p>© 2025 RACE. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;