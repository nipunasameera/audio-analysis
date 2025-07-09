"use client"

import { useState } from "react"
import { ChevronRight, Upload, Settings, BarChart3, Bell, RefreshCw, LogIn, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogTitle, DialogTrigger, DialogHeader } from "@/components/ui/dialog"
import UploadPage from "./upload/page"
import ParametersPage from "./parameters/page"
import ResultsPage from "./results/page"

export default function SentimentAnalysisDashboard() {
  const [activeSection, setActiveSection] = useState("upload")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loginError, setLoginError] = useState("")
  const [isSignup, setIsSignup] = useState(false)

  // const handleSubmit = async () => {
  //   try {
  //     setLoginError("")
      
  //     if (isSignup) {
  //       // Signup logic
  //       if (loginPassword !== confirmPassword) {
  //         setLoginError("Passwords do not match")
  //         return
  //       }
        
  //       await signup(loginEmail, loginPassword)
  //     } else {
  //       // Login logic
  //       await login(loginEmail, loginPassword)
  //     }
      
  //     // Clear form on successful login/signup
  //     setLoginEmail("")
  //     setLoginPassword("")
  //     setConfirmPassword("")
  //   } catch (error: any) {
  //     setLoginError(error.message || "Authentication failed")
  //     console.error("Authentication error:", error)
  //   }
  // }

  

  // if (loading) {
  //   return (
  //     <div className="flex h-screen items-center justify-center bg-neutral-900">
  //       <div className="flex flex-col items-center">
  //         <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
  //         <p className="text-neutral-400 mt-4">Authenticating...</p>
  //       </div>
  //     </div>
  //   )
  // }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`${sidebarCollapsed ? "w-16" : "w-70"} bg-neutral-900 border-r border-neutral-700 transition-all duration-300 fixed md:relative z-50 md:z-auto h-full md:h-auto ${!sidebarCollapsed ? "md:block" : ""}`}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-8">
            <div className={`${sidebarCollapsed ? "hidden" : "block"}`}>
              <h1 className="text-orange-500 font-bold text-lg tracking-wider">SENTIMENT AI</h1>
              <p className="text-neutral-500 text-xs">v3.2.1 NEURAL ANALYSIS</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="text-neutral-400 hover:text-orange-500"
            >
              <ChevronRight
                className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform ${sidebarCollapsed ? "" : "rotate-180"}`}
              />
            </Button>
          </div>

          <nav className="space-y-2">
            {[
              { id: "upload", icon: Upload, label: "UPLOAD FILE" },
              { id: "parameters", icon: Settings, label: "PARAMETERS" },
              { id: "results", icon: BarChart3, label: "RESULTS" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 p-3 rounded transition-colors ${
                  activeSection === item.id
                    ? "bg-orange-500 text-white"
                    : "text-neutral-400 hover:text-white hover:bg-neutral-800"
                }`}
              >
                <item.icon className="w-5 h-5 md:w-5 md:h-5 sm:w-6 sm:h-6" />
                {!sidebarCollapsed && <span className="text-sm font-medium">{item.label}</span>}
              </button>
            ))}
          </nav>

          {!sidebarCollapsed && (
            <div className="mt-8 p-4 bg-neutral-800 border border-neutral-700 rounded">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span className="text-xs text-white">AI ONLINE</span>
              </div>
              <div className="text-xs text-neutral-500">
                <div>MODELS: 12 LOADED</div>
                <div>QUEUE: 0 PENDING</div>
                <div>ACCURACY: 97.3%</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Overlay */}
      {!sidebarCollapsed && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarCollapsed(true)} />
      )}

      {/* Main Content */}
      <div className={`flex-1 flex flex-col ${!sidebarCollapsed ? "md:ml-0" : ""}`}>
        {/* Top Toolbar */}
        <div className="h-16 bg-neutral-800 border-b border-neutral-700 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <div className="text-sm text-neutral-400">
              SENTIMENT ANALYSIS / <span className="text-orange-500">{activeSection.toUpperCase()}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* <div className="text-xs text-neutral-500">LAST UPDATE: {new Date().toLocaleString()}</div> */}
            <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-orange-500">
              <Bell className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-orange-500">
              <RefreshCw className="w-4 h-4" />
            </Button>
            
            {true ? (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-neutral-400" />
                <span className="text-xs text-neutral-400">test@test.com</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-neutral-400 hover:text-red-500"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-neutral-400 hover:text-orange-500"
                    onClick={() => {
                      setIsSignup(false)
                      setLoginError("")
                    }}
                  >
                    <LogIn className="w-4 h-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-neutral-900 border-neutral-700 max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-white text-xl">
                      {isSignup ? "Sign Up" : "Login"} to Sentiment AI
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 p-4">
                    <div>
                      <label className="block text-sm text-neutral-400 mb-2">Email</label>
                      <Input 
                        type="email" 
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="bg-neutral-800 border-neutral-700 text-white placeholder-neutral-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-neutral-400 mb-2">Password</label>
                      <Input 
                        type="password" 
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="bg-neutral-800 border-neutral-700 text-white placeholder-neutral-500"
                      />
                    </div>
                    {isSignup && (
                      <div>
                        <label className="block text-sm text-neutral-400 mb-2">Confirm Password</label>
                        <Input 
                          type="password" 
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm your password"
                          className="bg-neutral-800 border-neutral-700 text-white placeholder-neutral-500"
                        />
                      </div>
                    )}
                    {loginError && (
                      <div className="text-red-500 text-sm">{loginError}</div>
                    )}
                    <Button 
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white mt-4"
                    >
                      {isSignup ? "Sign Up" : "Login"}
                    </Button>
                    <div className="text-center mt-4">
                      <button 
                        onClick={() => {
                          setIsSignup(!isSignup)
                          setLoginError("")
                        }}
                        className="text-sm text-neutral-400 hover:text-orange-500 transition-colors"
                      >
                        {isSignup 
                          ? "Already have an account? Login" 
                          : "Don't have an account? Sign Up"}
                      </button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-auto">
          {activeSection === "upload" && <UploadPage />}
          {activeSection === "parameters" && <ParametersPage />}
          {activeSection === "results" && <ResultsPage />}
        </div>
      </div>
    </div>
  )
}
