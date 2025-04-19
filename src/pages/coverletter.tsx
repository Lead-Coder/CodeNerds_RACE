import DashboardLayout from "../components/Layout";
import { useState } from "react";

const CoverLetterGenerator = () => {
  const [activeTab, setActiveTab] = useState("generator");

  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");
  
  // Mock data
  const myCoverLetters = [
    { id: 1, name: "Product Manager Application", company: "TechCorp", date: "1 week ago" },
    { id: 2, name: "Software Engineer - Acme Inc", company: "Six Ladders", date: "2 weeks ago" },
  ];
  

  const handleGenerate = () => {
    if (!company || !position || !jobDescription) return;
    
    setIsGenerating(true);
    setTimeout(() => {
      const sampleContent = `Dear Dear ${company} Hiring Team,

I am excited to apply for the position of ${position} at ${company}. With a strong background and deep interest in this field, I believe I am well-suited for this opportunity.

${jobDescription.slice(0, 150)}`
      
      setGeneratedContent(sampleContent);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <DashboardLayout>
      <div className="mb-8 mx-auto my-auto">
        <h1 className="text-2xl font-bold text-gray-900">Cover Letter Generator</h1>
        <p className="text-gray-600">Create customized cover letters for your job applications</p>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("generator")}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "generator"
                ? "border-primary-500 text-primary-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}>
            Generate New
          </button>
          <button
            onClick={() => setActiveTab("my-letters")}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "my-letters"
                ? "border-primary-500 text-primary-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}>
            My Cover Letters
          </button>
        </nav>
      </div>

      {activeTab === "generator" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Cover Letter Details</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name
                  </label>
                  <input 
                    type="text" 
                    id="company" 
                    className="input-w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g. Six Ladders"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}/>
                </div>
                
                <div>
                  <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
                    Position
                  </label>
                  <input 
                    type="text" 
                    id="position" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g. Senior Developer"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}/>
                </div>
                
                <div>
                  <label htmlFor="template" className="block text-sm font-medium text-gray-700 mb-1">
                    Template Style
                  </label>
                  <select 
                    id="template" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                    <option value="professional">Professional</option>
                    <option value="creative">Creative</option>
                    <option value="technical">Technical</option>
                    <option value="entry-level">Entry-Level</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="resume" className="block text-sm font-medium text-gray-700 mb-1">
                    Select Resume to Match
                  </label>
                  <select 
                    id="resume" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                    <option value="1">Senior Developer Resume</option>
                    <option value="2">Junior Web Developer</option>
                    <option value="3">Software Engineer - General</option>
                    <option value="4">Intern</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="job-description" className="block text-sm font-medium text-gray-700 mb-1">
                    Job Description
                  </label>
                  <textarea 
                    id="job-description" 
                    rows={6} 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Paste the job description here to create a tailored cover letter..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                  ></textarea>
                  <p className="mt-1 text-xs text-gray-500">This helps our AI tailor the letter to the specific job</p>
                </div>
                
                <div className="pt-2">
                  <button 
                    className="ml-28 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    onClick={handleGenerate}
                    disabled={isGenerating || !company || !position || !jobDescription}>
                    {isGenerating ? (
                      <div className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                        Generating Cover Letter...
                      </div>
                    ) : (
                      "Generate Cover Letter"
                    )}
                  </button>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-200 bg-gray-50 p-4">
              <div className="flex items-center text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-primary-600 mr-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                </svg>
                <span className="text-gray-600">
                  Our AI analyzes the job description and your resume to create a personalized letter
                </span>
              </div>
            </div>
          </div>
          
          {/* Preview */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">Preview</h2>
                {generatedContent && (
                  <div className="flex space-x-2">
                    <button className="btn btn-outline py-1.5 px-3 text-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21h-9.5A2.25 2.25 0 014 18.75V8.25A2.25 2.25 0 016.25 6H11" />
                      </svg>
                    </button>
                    <button className="btn btn-outline py-1.5 px-3 text-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                      </svg>
                    </button>
                    <button className="btn btn-outline py-1.5 px-3 text-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
              
              {!generatedContent && !isGenerating ? (
                <div className="flex flex-col items-center justify-center h-80 text-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-primary-600">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Cover Letter Generated Yet</h3>
                  <p className="text-gray-500 max-w-sm">
                    Fill in the details on the left to generate a customized cover letter for your job application.
                  </p>
                </div>
              ) : isGenerating ? (
                <div className="flex flex-col items-center justify-center h-80 text-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4 animate-pulse">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-primary-600">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Generating Your Cover Letter</h3>
                  <p className="text-gray-500 max-w-sm">
                    Our AI is creating a personalized cover letter based on your resume and the job details...
                  </p>
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-md p-6 h-[500px] overflow-auto font-serif text-[15px] whitespace-pre-line">
                  {generatedContent}
                </div>
              )}
            </div>
            
            {generatedContent && (
              <div className="border-t border-gray-200 p-6 bg-gray-50">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="text-sm text-gray-600">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-primary-600 mr-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21h-9.5A2.25 2.25 0 014 18.75V8.25A2.25 2.25 0 016.25 6H11" />
                      </svg>
                      <span>You can edit this letter before saving</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <button className="btn btn-outline py-2">Regenerate</button>
                    <button className="btn btn-primary py-2">Save Cover Letter</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* My Cover Letters Tab */}
      {activeTab === "my-letters" && (
        <div>
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Your Cover Letters</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myCoverLetters.map((letter) => (
              <div key={letter.id} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-lg transition">
                <div className="h-40 bg-gradient-to-r from-secondary-500 to-accent-500 p-6 flex items-center justify-center">
                  <div className="w-full max-w-[240px] h-32 bg-white rounded-md shadow-md flex items-center justify-center">
                    <div className="text-center p-4">
                      <div className="w-16 h-2 bg-gray-300 rounded mb-2 mx-auto"></div>
                      <div className="w-24 h-2 bg-gray-200 rounded mb-4 mx-auto"></div>
                      <div className="space-y-2">
                        <div className="w-32 h-2 bg-gray-100 rounded mx-auto"></div>
                        <div className="w-28 h-2 bg-gray-100 rounded mx-auto"></div>
                        <div className="w-24 h-2 bg-gray-100 rounded mx-auto"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{letter.name}</h3>
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Company:</span> {letter.company}
                    </p>
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Created:</span> {letter.date}
                    </p>
                  </div>
                  <div className="mt-4 flex space-x-2">
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default CoverLetterGenerator;