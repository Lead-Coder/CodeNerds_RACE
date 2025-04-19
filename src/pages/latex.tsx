import { useState } from 'react';
import DashboardLayout from "../components/Layout";

export default function LaTeXEditor() {
  const [latexCode, setLatexCode] = useState('');
  const [activePreview, setActivePreview] = useState('resume'); // 'resume' or 'business'
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { sender: 'bot', message: 'Hello! I can help you edit your LaTeX document. What would you like to create today?' }
  ]);

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    
    // Add user message to chat
    setChatHistory([...chatHistory, { sender: 'user', message: chatMessage }]);
    
    // Simple bot response (in a real app, this would connect to your backend)
    setTimeout(() => {
      setChatHistory(prev => [...prev, { 
        sender: 'bot', 
        message: `I can help you with your LaTeX document. Would you like some code examples or formatting guidance?` 
      }]);
    }, 600);
    
    setChatMessage('');
  };

  return (
    <DashboardLayout>
    <div className="h-full flex flex-col">
      <h1 className="text-2xl font-bold text-gray-900 mb-4 ml-7">LaTeX Editor</h1>
      
      <div className="flex flex-1 gap-4 h-full">
        {/* Left side: LaTeX Editor */}
        <div className="w-1/2 flex flex-col bg-white rounded-lg shadow-sm">
          <div className="p-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-gray-700">Editor</div>
              <div className="flex space-x-2">
                <button className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-50 rounded hover:bg-blue-100 transition-colors">
                  Save
                </button>
                <button className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors">
                  Check for error
                </button>
                <button className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors">
                  Go back
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex-1 p-4">
            <textarea
              className="w-full h-full p-3 text-sm font-mono border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 resize-none"
              value={latexCode}
              onChange={(e) => setLatexCode(e.target.value)}
              placeholder="Enter your LaTeX code here..."
            />
          </div>
        </div>
        
        {/* Right side: Preview and Chat */}
        <div className="w-1/2 flex flex-col">
          {/* Preview section */}
          <div className="bg-white rounded-lg shadow-sm mb-4 flex flex-col">
            <div className="p-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-gray-700">Preview</div>
                <div className="flex space-x-2">
                  <button 
                    className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                      activePreview === 'resume' 
                        ? 'text-blue-700 bg-blue-50 hover:bg-blue-100' 
                        : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                    }`}
                    onClick={() => setActivePreview('resume')}
                  >
                    Resume View
                  </button>
                  <button 
                    className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                      activePreview === 'business' 
                        ? 'text-blue-700 bg-blue-50 hover:bg-blue-100' 
                        : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                    }`}
                    onClick={() => setActivePreview('business')}
                  >
                    Business View
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex-1 p-6 flex items-center justify-center border-b border-gray-200">
              {latexCode ? (
                <div className="text-center text-gray-500">
                  {activePreview === 'resume' ? (
                    <p>Resume PDF preview would appear here</p>
                  ) : (
                    <p>Business document preview would appear here</p>
                  )}
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="mt-2">Enter LaTeX code to see preview</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Chat section */}
          <div className="bg-white rounded-lg shadow-sm flex-1 flex flex-col">
            <div className="p-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
              <div className="text-sm font-medium text-gray-700">LaTeX Assistant</div>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-3">
                {chatHistory.map((chat, index) => (
                  <div 
                    key={index} 
                    className={`flex ${chat.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div 
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        chat.sender === 'user' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                      <p className="text-sm">{chat.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-3 border-t border-gray-200">
              <form onSubmit={handleChatSubmit} className="flex">
                <input
                  type="text"
                  className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ask for help with your LaTeX document..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}/>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    </DashboardLayout>
  );
}