// import React, { useState } from 'react';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { useAuth } from '../App';

// interface DashboardLayoutProps {
//   children: React.ReactNode;
// }

// const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const { logout, user } = useAuth();
//   const location = useLocation();
//   const navigate = useNavigate();
  
//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };
  
//   const navigation = [
//     { name: 'Dashboard', href: '/dashboard', icon: 
//       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
//         <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
//       </svg>
//     },
//     { name: 'Resume Builder', href: '/resume-builder', icon: 
//       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
//         <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
//       </svg>
//     },
//     { name: 'ATS Scoring', href: '/ats-scoring', icon: 
//       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
//         <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
//       </svg>
//     },
//     { name: 'Cover Letter', href: '/cover-letter', icon: 
//       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
//         <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
//       </svg>
//     },
//     { name: 'Profile Builder', href: '/profile-builder', icon: 
//       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
//         <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
//       </svg>
//     },
//   ];

//   return (
//     <div className="flex h-screen bg-gray-50">
//       {/* Sidebar for desktop */}
//       <div className="hidden md:flex md:w-64 md:flex-col">
//         <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
//           <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
//             <div className="flex flex-shrink-0 items-center px-4">
//               <Link to="/" className="flex items-center">
//                 <div className="h-8 w-8 rounded-md gradient-bg flex items-center justify-center">
//                   <span className="text-white font-bold text-xl">R</span>
//                 </div>
//                 <span className="ml-2 font-display font-bold text-xl">RACE</span>
//               </Link>
//             </div>
//             <nav className="mt-8 flex-1 space-y-1 px-2">
//               {navigation.map((item) => {
//                 const isActive = location.pathname === item.href;
//                 return (
//                   <Link
//                     key={item.name}
//                     to={item.href}
//                     className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
//                       isActive
//                         ? 'bg-primary-50 text-primary-600'
//                         : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
//                     }`}
//                   >
//                     <div
//                       className={`mr-3 flex-shrink-0 ${
//                         isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-500'
//                       }`}
//                     >
//                       {item.icon}
//                     </div>
//                     {item.name}
//                   </Link>
//                 );
//               })}
//             </nav>
//           </div>
//           <div className="flex flex-shrink-0 border-t border-gray-200 p-4">
//             <div className="flex items-center">
//               <div className="flex-shrink-0">
//                 <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center">
//                   <span className="text-white font-medium text-sm">
//                     {user?.name?.substring(0, 2).toUpperCase() || "U"}
//                   </span>
//                 </div>
//               </div>
//               <div className="ml-3 min-w-0 flex-1">
//                 <div className="truncate text-sm font-medium text-gray-900">{user?.name || "User"}</div>
//                 <div className="truncate text-sm text-gray-500">{user?.email || "user@example.com"}</div>
//               </div>
//               <button
//                 onClick={handleLogout}
//                 className="ml-auto flex-shrink-0 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500"
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
//                   <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
//                 </svg>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Mobile menu */}
//       <div className="md:hidden">
//         <div className={`fixed inset-0 z-40 ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
//           <div className="fixed inset-0 bg-gray-600 bg-opacity-75"></div>
//           <div className="fixed inset-0 z-40 flex">
//             <div className="relative flex w-full max-w-xs flex-1 flex-col bg-white">
//               <div className="absolute top-0 right-0 -mr-12 pt-2">
//                 <button
//                   type="button"
//                   className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
//                   onClick={() => setIsMobileMenuOpen(false)}
//                 >
//                   <span className="sr-only">Close sidebar</span>
//                   <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
//                     <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
//                   </svg>
//                 </button>
//               </div>

//               <div className="h-0 flex-1 overflow-y-auto pt-5 pb-4">
//                 <div className="flex flex-shrink-0 items-center px-4">
//                   <Link to="/" className="flex items-center">
//                     <div className="h-8 w-8 rounded-md gradient-bg flex items-center justify-center">
//                       <span className="text-white font-bold text-xl">R</span>
//                     </div>
//                     <span className="ml-2 font-display font-bold text-xl">RACE</span>
//                   </Link>
//                 </div>
//                 <nav className="mt-5 space-y-1 px-2">
//                   {navigation.map((item) => {
//                     const isActive = location.pathname === item.href;
//                     return (
//                       <Link
//                         key={item.name}
//                         to={item.href}
//                         className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
//                           isActive
//                             ? 'bg-primary-50 text-primary-600'
//                             : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
//                         }`}
//                         onClick={() => setIsMobileMenuOpen(false)}
//                       >
//                         <div
//                           className={`mr-4 flex-shrink-0 ${
//                             isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-500'
//                           }`}
//                         >
//                           {item.icon}
//                         </div>
//                         {item.name}
//                       </Link>
//                     );
//                   })}
//                 </nav>
//               </div>
//               <div className="flex flex-shrink-0 border-t border-gray-200 p-4">
//                 <div className="flex items-center">
//                   <div className="flex-shrink-0">
//                     <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center">
//                       <span className="text-white font-medium text-sm">
//                         {user?.name?.substring(0, 2).toUpperCase() || "U"}
//                       </span>
//                     </div>
//                   </div>
//                   <div className="ml-3 min-w-0 flex-1">
//                     <div className="truncate text-sm font-medium text-gray-900">{user?.name || "User"}</div>
//                     <div className="truncate text-sm text-gray-500">{user?.email || "user@example.com"}</div>
//                   </div>
//                   <button
//                     onClick={handleLogout}
//                     className="ml-auto flex-shrink-0 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500"
//                   >
//                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
//                       <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
//                     </svg>
//                   </button>
//                 </div>
//               </div>
//             </div>
//             <div className="w-14 flex-shrink-0">{/* Force sidebar to shrink to fit close icon */}</div>
//           </div>
//         </div>
//       </div>

//       {/* Main content */}
//       <div className="flex flex-1 flex-col overflow-hidden">
//         {/* Top navigation for mobile */}
//         <div className="md:hidden bg-white shadow-sm">
//           <div className="flex items-center justify-between h-16 px-4">
//             <Link to="/" className="flex items-center">
//               <div className="h-8 w-8 rounded-md gradient-bg flex items-center justify-center">
//                 <span className="text-white font-bold text-xl">R</span>
//               </div>
//               <span className="ml-2 font-display font-bold text-xl">RACE</span>
//             </Link>
//             <button
//               type="button"
//               className="text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
//               onClick={() => setIsMobileMenuOpen(true)}
//             >
//               <span className="sr-only">Open sidebar</span>
//               <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
//               </svg>
//             </button>
//           </div>
//         </div>

//         {/* Main content area */}
//         <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6">
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// };

// export default DashboardLayout;