import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from "../components/Layout";
import axios from 'axios';

const ResumeBuilder: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    jobDescription: '',
    resumeUrl:'',
    resumeText: '',
  });
  const [generatedResumeUrl, setGeneratedResumeUrl] = useState('');

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
  
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
  
      try {
        // Upload the file to backend (localhost:3000)
        const response = await axios.post("http://localhost:3000/api/file/upload", formDataUpload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
  
        const uploadedUrl = response.data.fileUrl;
        console.log('File uploaded:', uploadedUrl);
  
        // Update formData with the uploaded file URL
        const updatedForm = {
          ...formData,
          resumeUrl: uploadedUrl,
        };
        setFormData(updatedForm); // If needed in state later
        setGeneratedResumeUrl(uploadedUrl); // Optional
        console.log('Updated form data:', updatedForm);
        const response2 = await axios.post('http://localhost:5000/generate_resume', updatedForm, {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true, // only needed if you are using cookies/tokens
        });
      } catch (error) {
        console.error('Error uploading or processing file:', error);
      }
    }
  };
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Mock API call - replace with actual API endpoint
      // const response = await fetch('/api/parse-resume', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(formData),
      // });
      
      // const data = await response.json();
      // setGeneratedResumeUrl(data.pdfUrl);
      
      // Mock response for demonstration
      setTimeout(() => {
        setGeneratedResumeUrl('/sample-resume.pdf');
        setSuccess(true);
        setLoading(false);
      }, 2000);
      
    } catch (error) {
      console.error('Error generating resume:', error);
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      companyName: '',
      jobDescription: '',
      resumeText: '',
      resumeUrl: '',
    });
    setSuccess(false);
    setGeneratedResumeUrl('');
  };

  return (
    <DashboardLayout>
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Resume Builder</h1>
        <p className="mt-2 text-gray-600">
          Tailor your resume to match job requirements and increase your chances of getting hired.
        </p>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Steps Indicator */}
        <div className="bg-blue-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-sm font-medium">
              1
            </div>
            <div className="text-blue-800 font-medium">Enter Details</div>
            <div className="flex-1 h-0.5 bg-blue-200"></div>
            <div className={`flex items-center justify-center w-6 h-6 rounded-full ${success ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'} text-sm font-medium`}>
              2
            </div>
            <div className={`${success ? 'text-blue-800' : 'text-blue-400'} font-medium`}>Get Resume</div>
          </div>
        </div>

        {!success ? (
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
              {/* Company Name */}
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  name="companyName"
                  id="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="Enter the company name you're applying to"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              {/* Job Description */}
              <div>
                <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-700 mb-1">
                  Job Description
                </label>
                <textarea
                  name="jobDescription"
                  id="jobDescription"
                  value={formData.jobDescription}
                  onChange={handleChange}
                  placeholder="Paste the job description here"
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <p className="mt-1 text-sm text-gray-500">
                  Copy and paste the full job description to help our AI match your resume to the job requirements.
                </p>
              </div>

              {/* File Input */}
      <div className="flex items-center justify-center w-full">
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-8 h-8 text-gray-500 mb-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
              />
            </svg>
            <p className="text-sm text-gray-600">
              <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">PDF, DOCX or files (max. 5MB)</p>
          </div>
          <input
            type="file"
            accept=".pdf,.docx,.txt"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      </div>

            {/* File Preview */}
            {selectedFile && (
                <div className="mt-3 p-3 border rounded bg-white shadow text-sm text-gray-700">
                <p><strong>Selected File:</strong> {selectedFile.name}</p>
                <p><strong>Size:</strong> {(selectedFile.size / 1024).toFixed(2)} KB</p>
                </div>)}
                </div>

              <div>
                <label htmlFor="resumeText" className="mt-5 block text-sm font-medium text-gray-700 mb-1">
                  Upload resume above or paste your text content here.
                </label>
                <textarea
                  name="resumeText"
                  id="resumeText"
                  value={formData.resumeText}
                  onChange={handleChange}
                  placeholder="Paste your current resume content here"
                  rows={10}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"/>
              </div>      

            <div className="mt-8 flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
                Reset
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}>
                {loading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </div>
                ) : (
                  'Generate Resume'
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="p-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-blue-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              
              <h3 className="mt-4 text-lg font-medium text-gray-900">Resume Generated Successfully!</h3>
              <p className="mt-2 text-gray-600">Your optimized resume is ready for download.</p>
              
              <div className="mt-6 space-y-4">
                <a 
                  href={generatedResumeUrl} 
                  download
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  Download PDF
                </a>
                
                <a 
                  href={generatedResumeUrl.replace('.pdf', '.tex')} 
                  download
                  className="inline-flex items-center px-4 py-2 border border-blue-600 text-sm font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                  Download LaTeX Source
                </a>
              </div>
              
              <div className="mt-6">
                <button
                  onClick = {() => navigate("/analysis")}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Analyse the Resume
                </button>
              </div>
            </div>
            
            {/* Preview section */}
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Resume Preview</h3>
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 h-96 flex items-center justify-center">
                <div className="text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-gray-400 mx-auto mb-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                  <p className="text-gray-600">
                    Preview is available when you download the PDF
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 bg-blue-50 rounded-lg p-6 border border-blue-100">
        <h3 className="text-lg font-medium text-blue-800 mb-4">Resume Optimization Tips</h3>
        <ul className="space-y-3 text-blue-700">
          <li className="flex">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 text-blue-500 flex-shrink-0 mt-0.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Use keywords from the job description in your resume to pass ATS screening.</span>
          </li>
          <li className="flex">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 text-blue-500 flex-shrink-0 mt-0.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Keep your resume to 1-2 pages maximum for most industries.</span>
          </li>
        </ul>
      </div>

      <div className="mt-8 mb-12">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Frequently Asked Questions</h3>
        <div className="space-y-4">
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <button className="flex justify-between w-full px-6 py-4 text-left text-gray-800 font-medium bg-white hover:bg-gray-50">
              <span>How does the resume builder work?</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <p className="text-gray-600">
                Our AI-powered resume builder analyzes your existing resume and the job description to identify keywords and skills that match the job requirements. It then restructures your resume to highlight relevant experience and skills, formatting it professionally in LaTeX for a polished PDF output.
              </p>
            </div>
          </div>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <button className="flex justify-between w-full px-6 py-4 text-left text-gray-800 font-medium bg-white hover:bg-gray-50">
              <span>Can I edit the generated resume?</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <p className="text-gray-600">
                Yes, you can edit your resume in the edit section.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </DashboardLayout>
  );
};

export default ResumeBuilder;