import { useState, useEffect } from "react";
import { Label } from "./components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import { Separator } from "./components/ui/separator";
import { Calendar, Clock, User, Mail, Phone, MessageSquare, Heart, Star, Zap, Settings, Globe, Lock, Bot, CheckCircle, AlertCircle, Loader2, Send, Brain, Sparkles, AlignLeft, Bell, ShoppingCart, Inbox, AlertTriangle } from "lucide-react";
import { ComicBubble } from "./components/ComicBubble";

export default function App() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [aiMessageVisible, setAiMessageVisible] = useState(false);
  const [typingAnimation, setTypingAnimation] = useState("");
  
  // Cumulative typing animation state
  const [cumulativeLines, setCumulativeLines] = useState<Array<{ text: string; status: string }>>([]);
  const [currentTypingLine, setCurrentTypingLine] = useState(0);
  const [currentTypingText, setCurrentTypingText] = useState("");

  // Animation cycles for demo
  useEffect(() => {
    const interval = setInterval(() => {
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
        }, 2000);
      }, 3000);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  // Error state animation cycle
  useEffect(() => {
    const interval = setInterval(() => {
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 1500);
    }, 11000);

    return () => clearInterval(interval);
  }, []);

  // AI Message typing animation
  useEffect(() => {
    const messages = [
      "Processing your request...",
      "Analyzing data patterns...", 
      "Generating insights...",
      "Task completed successfully!"
    ];
    
    let messageIndex = 0;
    let charIndex = 0;
    
    const typeInterval = setInterval(() => {
      if (charIndex < messages[messageIndex].length) {
        setTypingAnimation(messages[messageIndex].substring(0, charIndex + 1));
        charIndex++;
      } else {
        setTimeout(() => {
          messageIndex = (messageIndex + 1) % messages.length;
          charIndex = 0;
          setTypingAnimation("");
        }, 2000);
      }
    }, 100);

    return () => clearInterval(typeInterval);
  }, []);

  // AI message visibility cycle
  useEffect(() => {
    const interval = setInterval(() => {
      setAiMessageVisible(true);
      setTimeout(() => setAiMessageVisible(false), 4000);
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  // Cumulative typing animation
  useEffect(() => {
    const lines = [
      { text: "Initializing system", completion: "[✓] Done!" },
      { text: "Loading components", completion: "[✓] Finished!" },
      { text: "Connecting to services", completion: "[✓] Complete!" },
      { text: "Ready to start", completion: "[✓] Ready!" }
    ];
    
    let lineIndex = 0;
    let charIndex = 0;
    let completed: Array<{ text: string; status: string }> = [];
    
    const typeInterval = setInterval(() => {
      if (lineIndex >= lines.length) {
        // Reset animation
        setTimeout(() => {
          lineIndex = 0;
          charIndex = 0;
          completed = [];
          setCumulativeLines([]);
          setCurrentTypingText("");
          setCurrentTypingLine(0);
        }, 2000);
        return;
      }
      
      const currentLine = lines[lineIndex];
      
      if (charIndex < currentLine.text.length) {
        // Still typing current line
        setCurrentTypingText(currentLine.text.substring(0, charIndex + 1));
        setCurrentTypingLine(lineIndex);
        charIndex++;
      } else {
        // Finished typing current line
        completed.push({
          text: currentLine.text,
          status: currentLine.completion
        });
        setCumulativeLines([...completed]);
        setCurrentTypingText("");
        lineIndex++;
        charIndex = 0;
      }
    }, 80);

    return () => clearInterval(typeInterval);
  }, []);

  // Using Plain theme only
  const currentTheme = { name: "Plain", variant: "ghost" as const, bgClass: "bg-gray-50" };
  const isDark = false;
  const isGreen = false;
  const isBrand = false;

  // Simplified styles for plain theme only
  const getInputStyles = (additionalClasses = "") => {
    return `transition-all duration-300 ${additionalClasses} bg-white/80 border-slate-200 focus:border-blue-400 focus:ring-blue-400/20`;
  };

  const getCardStyles = () => {
    return `border-0 backdrop-blur-xl transition-all duration-300 bg-white/70 shadow-2xl`;
  };

  const getLabelColor = () => {
    return 'text-slate-700';
  };

  return (
    <div className={`min-h-screen p-6 transition-all duration-500 ${currentTheme.bgClass}`}>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="space-y-2">
            <h1 className="text-4xl tracking-tight text-slate-900">
              Atom Label
            </h1>
            <h2 className="text-2xl text-slate-600">
              finAtomLabel: Single, Multi-line, Icon, Emoji & AI Interaction Labels
            </h2>
          </div>
          <p className="text-lg max-w-3xl mx-auto text-slate-600">
            Comprehensive showcase of label styling patterns with single-line labels, 
            multi-line descriptions, icons, emojis, and plain labels for AI interactions.
          </p>
        </div>



        {/* Label Animations */}
        <Card className={getCardStyles()}>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={`px-3 py-1 transition-colors duration-300 ${
                isDark ? 'border-purple-500/60 text-purple-300 bg-purple-900/30' : 
                isGreen ? 'border-teal-500/60 text-teal-300 bg-teal-600/20' :
                isBrand ? 'border-indigo-500/60 text-indigo-300 bg-indigo-600/20' :
                'border-purple-400 text-purple-600 bg-purple-100'
              }`}>
                <Sparkles className="h-3 w-3 mr-1" />
                Animated
              </Badge>
              <CardTitle className={`text-xl transition-colors duration-300 ${
                isDark ? 'text-white' : 
                isGreen ? 'text-emerald-50' : 
                isBrand ? 'text-blue-50' :
                'text-slate-800'
              }`}>
                Label Animations & AI Notifications
              </CardTitle>
            </div>
            <CardDescription className={`transition-colors duration-300 ${
              isDark ? 'text-slate-400' : 
              isGreen ? 'text-emerald-300' : 
              isBrand ? 'text-blue-300' :
              'text-slate-600'
            }`}>
              Dynamic labels with animations, processing states, and AI message notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Processing States */}
            <div>
              <h3 className={`mb-4 transition-colors duration-300 ${
                isDark ? 'text-blue-400' : 
                isGreen ? 'text-emerald-400' : 
                isBrand ? 'text-indigo-400' :
                'text-purple-600'
              }`}>
                Processing States
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className={`p-4 rounded-lg border transition-all duration-300 ${
                    isDark 
                      ? 'bg-slate-950/30 border-slate-600/30 backdrop-blur-lg' 
                      : isGreen
                        ? 'bg-emerald-950/40 border-emerald-600/30 backdrop-blur-lg'
                        : isBrand
                          ? 'bg-blue-950/40 border-blue-600/30 backdrop-blur-lg'
                          : 'bg-slate-50/50 border-slate-200'
                  }`}>
                    <Label className={`flex items-center gap-2 ${getLabelColor()} ${isProcessing ? 'animate-pulse' : ''}`}>
                      <Loader2 className={`h-4 w-4 ${isProcessing ? 'animate-spin' : ''}`} />
                      {isProcessing ? 'Processing Request...' : 'Ready to Process'}
                    </Label>
                  </div>

                  <div className={`p-4 rounded-lg border transition-all duration-500 ${
                    showSuccess 
                      ? isDark
                        ? 'bg-green-950/40 border-green-500/50 shadow-lg shadow-green-500/20 animate-bounce'
                        : 'bg-green-50 border-green-300 shadow-lg shadow-green-200/50 animate-bounce'
                      : isDark 
                        ? 'bg-slate-950/30 border-slate-600/30' 
                        : 'bg-slate-50/50 border-slate-200'
                  }`}>
                    <Label className={`flex items-center gap-2 transition-colors duration-300 ${
                      showSuccess 
                        ? 'text-green-400' 
                        : getLabelColor()
                    }`}>
                      <CheckCircle className={`h-4 w-4 ${showSuccess ? 'animate-pulse' : ''}`} />
                      {showSuccess ? 'Success! Task Completed' : 'Waiting for Success'}
                    </Label>
                  </div>

                  <div className={`p-4 rounded-lg border transition-all duration-300 ${
                    showError
                      ? 'bg-red-950/40 border-red-500/50 animate-shake'
                      : isDark 
                        ? 'bg-slate-950/30 border-slate-600/30' 
                        : 'bg-slate-50/50 border-slate-200'
                  }`}>
                    <Label className={`flex items-center gap-2 transition-colors duration-300 ${
                      showError 
                        ? 'text-red-400' 
                        : getLabelColor()
                    }`}>
                      <AlertCircle className="h-4 w-4" />
                      Error State Example
                    </Label>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className={`p-4 rounded-lg border transition-all duration-300 ${
                    isDark 
                      ? 'bg-slate-950/30 border-slate-600/30 backdrop-blur-lg hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/20' 
                      : isGreen
                        ? 'bg-emerald-950/40 border-emerald-600/30 backdrop-blur-lg hover:border-emerald-500/60 hover:shadow-lg hover:shadow-emerald-500/30'
                        : isBrand
                          ? 'bg-blue-950/40 border-blue-600/30 backdrop-blur-lg hover:border-blue-500/60 hover:shadow-lg hover:shadow-blue-500/30'
                          : 'bg-slate-50/50 border-slate-200 hover:border-purple-300 hover:shadow-lg'
                  }`}>
                    <Label className={`flex items-center gap-2 ${getLabelColor()} group cursor-pointer`}>
                      <Heart className="h-4 w-4 group-hover:animate-pulse group-hover:text-red-400 transition-colors duration-300" />
                      <span className="group-hover:translate-x-1 transition-transform duration-300">Hover Animation</span>
                    </Label>
                  </div>

                  <div className={`p-4 rounded-lg border transition-all duration-700 ${
                    isDark 
                      ? 'bg-slate-950/30 border-slate-600/30 backdrop-blur-lg animate-pulse' 
                      : 'bg-slate-50/50 border-slate-200 animate-pulse'
                  }`}>
                    <Label className={`flex items-center gap-2 ${getLabelColor()}`}>
                      <Star className="h-4 w-4 animate-spin" />
                      Continuous Pulse
                    </Label>
                  </div>

                  <div className={`p-4 rounded-lg border transition-all duration-300 ${
                    isDark 
                      ? 'bg-gradient-to-r from-slate-950/30 via-blue-950/20 to-slate-950/30 border-slate-600/30 bg-[length:200%_100%] animate-shimmer' 
                      : 'bg-gradient-to-r from-slate-50 via-blue-50 to-slate-50 border-slate-200 bg-[length:200%_100%] animate-shimmer'
                  }`}>
                    <Label className={`flex items-center gap-2 ${getLabelColor()}`}>
                      <Zap className="h-4 w-4" />
                      Shimmer Effect
                    </Label>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Message Notifications */}
            <div>
              <h3 className={`mb-4 transition-colors duration-300 ${
                isDark ? 'text-blue-400' : 
                isGreen ? 'text-emerald-400' : 
                isBrand ? 'text-indigo-400' :
                'text-purple-600'
              }`}>
                AI Message Notifications
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className={`p-4 rounded-lg border transition-all duration-500 ${
                    aiMessageVisible
                      ? isDark
                        ? 'bg-blue-950/40 border-blue-500/50 shadow-lg shadow-blue-500/20 animate-fadeInUp'
                        : 'bg-blue-50 border-blue-300 shadow-lg animate-fadeInUp'
                      : isDark 
                        ? 'bg-slate-950/30 border-slate-600/30 opacity-50' 
                        : 'bg-slate-50/50 border-slate-200 opacity-50'
                  }`}>
                    <Label className={`flex items-center gap-2 transition-colors duration-300 ${
                      aiMessageVisible 
                        ? isDark ? 'text-blue-300' : 'text-blue-600'
                        : getLabelColor()
                    }`}>
                      <Bot className={`h-4 w-4 ${aiMessageVisible ? 'animate-bounce' : ''}`} />
                      <span className="relative">
                        AI Assistant
                        {aiMessageVisible && (
                          <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-ping"></span>
                        )}
                      </span>
                    </Label>
                  </div>

                  <div className={`p-4 rounded-lg border transition-all duration-300 ${
                    isDark 
                      ? 'bg-slate-950/30 border-slate-600/30 backdrop-blur-lg' 
                      : 'bg-slate-50/50 border-slate-200'
                  }`}>
                    <Label className={`flex items-center gap-2 ${getLabelColor()}`}>
                      <Brain className="h-4 w-4 animate-pulse" />
                      <span className="flex items-center">
                        Thinking
                        <span className="ml-2 flex space-x-1">
                          <span className="w-1 h-1 bg-current rounded-full animate-bounce" style={{animationDelay: '0ms'}}></span>
                          <span className="w-1 h-1 bg-current rounded-full animate-bounce" style={{animationDelay: '150ms'}}></span>
                          <span className="w-1 h-1 bg-current rounded-full animate-bounce" style={{animationDelay: '300ms'}}></span>
                        </span>
                      </span>
                    </Label>
                  </div>

                  <div className={`p-4 rounded-lg border transition-all duration-300 ${
                    isDark 
                      ? 'bg-slate-950/30 border-slate-600/30 backdrop-blur-lg' 
                      : 'bg-slate-50/50 border-slate-200'
                  }`}>
                    <Label className={`flex items-center gap-2 ${getLabelColor()}`}>
                      <MessageSquare className="h-4 w-4" />
                      <span className="min-h-[1.5rem] flex items-center">
                        {typingAnimation}
                        <span className="ml-1 w-0.5 h-4 bg-current animate-pulse"></span>
                      </span>
                    </Label>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className={`p-4 rounded-lg border transition-all duration-300 group hover:scale-105 ${
                    isDark 
                      ? 'bg-slate-950/30 border-slate-600/30 backdrop-blur-lg hover:border-green-500/50 hover:shadow-lg hover:shadow-green-500/20' 
                      : 'bg-slate-50/50 border-slate-200 hover:border-green-300 hover:shadow-lg'
                  }`}>
                    <Label className={`flex items-center gap-2 ${getLabelColor()} group-hover:text-green-400 transition-colors duration-300`}>
                      <Send className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                      Message Sent
                    </Label>
                  </div>

                  <div className={`p-4 rounded-lg border transition-all duration-1000 ${
                    isDark 
                      ? 'bg-gradient-to-r from-purple-950/30 via-blue-950/30 to-purple-950/30 border-purple-500/30 bg-[length:200%_100%] animate-gradient' 
                      : 'bg-gradient-to-r from-purple-50 via-blue-50 to-purple-50 border-purple-200 bg-[length:200%_100%] animate-gradient'
                  }`}>
                    <Label className={`flex items-center gap-2 ${getLabelColor()}`}>
                      <Sparkles className="h-4 w-4 animate-spin" />
                      <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-gradient bg-[length:200%_100%]">
                        AI Magic
                      </span>
                    </Label>
                  </div>

                  <div className={`p-4 rounded-lg border relative overflow-hidden ${
                    isDark 
                      ? 'bg-slate-950/30 border-slate-600/30 backdrop-blur-lg' 
                      : 'bg-slate-50/50 border-slate-200'
                  }`}>
                    <div className={`absolute inset-0 ${
                      isDark 
                        ? 'bg-gradient-to-r from-transparent via-blue-500/10 to-transparent' 
                        : 'bg-gradient-to-r from-transparent via-blue-200/50 to-transparent'
                    } animate-scan`}></div>
                    <Label className={`flex items-center gap-2 ${getLabelColor()} relative z-10`}>
                      <Settings className="h-4 w-4 animate-pulse" />
                      Processing Data
                    </Label>
                  </div>
                </div>
              </div>
            </div>

            {/* Cumulative Typing Animation */}
            <div>
              <h3 className={`mb-4 transition-colors duration-300 ${
                isDark ? 'text-blue-400' : 
                isGreen ? 'text-emerald-400' : 
                isBrand ? 'text-indigo-400' :
                'text-purple-600'
              }`}>
                Cumulative Typing Animation
              </h3>
              <div className={`p-6 rounded-lg border transition-all duration-300 ${
                isDark 
                  ? 'bg-slate-950/30 border-slate-600/30 backdrop-blur-lg' 
                  : 'bg-slate-50/50 border-slate-200'
              }`}>
                <div className="space-y-2 font-mono text-sm min-h-[136px]">
                  {cumulativeLines.map((line, index) => (
                    <div key={index} className={`flex items-center gap-2 transition-colors duration-300 h-[26px] ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      <span>{line.text}</span>
                      <span className="text-green-500">{line.status}</span>
                    </div>
                  ))}
                  {currentTypingText && (
                    <div className={`flex items-center gap-2 transition-colors duration-300 h-[26px] ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      <span>{currentTypingText}</span>
                      <span className={`transition-colors duration-300 ${
                        isDark ? 'text-slate-500' : 'text-slate-400'
                      }`}>...</span>
                      <span className="ml-1 w-0.5 h-4 bg-blue-500 animate-pulse"></span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Interactive Animations */}
            <div>
              <h3 className={`mb-4 transition-colors duration-300 ${
                isDark ? 'text-blue-400' : 
                isGreen ? 'text-emerald-400' : 
                isBrand ? 'text-indigo-400' :
                'text-purple-600'
              }`}>
                Interactive Label Effects
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { icon: Calendar, text: "Schedule Meeting", animation: "hover:rotate-12" },
                  { icon: Globe, text: "Connect Global", animation: "hover:scale-110" },
                  { icon: Lock, text: "Secure Access", animation: "hover:animate-bounce" },
                  { icon: Phone, text: "Call Contact", animation: "hover:animate-pulse" },
                  { icon: Mail, text: "Send Email", animation: "hover:animate-ping" },
                  { icon: User, text: "View Profile", animation: "hover:animate-wiggle" }
                ].map((item, index) => (
                  <div key={index} className={`p-4 rounded-lg border transition-all duration-300 cursor-pointer group ${
                    isDark 
                      ? 'bg-slate-950/30 border-slate-600/30 backdrop-blur-lg hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/20' 
                      : isGreen
                        ? 'bg-emerald-950/40 border-emerald-600/30 backdrop-blur-lg hover:border-emerald-500/60 hover:shadow-lg hover:shadow-emerald-500/30'
                        : isBrand
                          ? 'bg-blue-950/40 border-blue-600/30 backdrop-blur-lg hover:border-blue-500/60 hover:shadow-lg hover:shadow-blue-500/30'
                          : 'bg-slate-50/50 border-slate-200 hover:border-purple-300 hover:shadow-lg'
                  }`}>
                    <Label className={`flex items-center gap-2 ${getLabelColor()} group-hover:scale-105 transition-transform duration-300`}>
                      <item.icon className={`h-4 w-4 ${item.animation} transition-all duration-300`} />
                      {item.text}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Single Line Labels */}
        <Card className={getCardStyles()}>
          <CardHeader>
            <CardTitle className={`text-xl transition-colors duration-300 ${
              isDark ? 'text-white' : 
              isGreen ? 'text-emerald-50' : 
              isBrand ? 'text-blue-50' :
              'text-slate-800'
            }`}>
              Single Line Labels
            </CardTitle>
            <CardDescription className={`transition-colors duration-300 ${
              isDark ? 'text-slate-400' : 
              isGreen ? 'text-emerald-300' : 
              isBrand ? 'text-blue-300' :
              'text-slate-600'
            }`}>
              Clean, concise single-line labels for form inputs
            </CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Label className={getLabelColor()}>
                Full Name
              </Label>
              
              <Label className={getLabelColor()}>
                Email Address
              </Label>

              <Label className={getLabelColor()}>
                Phone Number
              </Label>
            </div>

            <div className="space-y-4">
              <Label className={getLabelColor()}>
                Company
              </Label>

              <Label className={getLabelColor()}>
                Job Title
              </Label>

              <Label className={getLabelColor()}>
                Website
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Multi-line Labels */}
        <Card className={getCardStyles()}>
          <CardHeader>
            <CardTitle className={`text-xl transition-colors duration-300 ${
              isDark ? 'text-white' : 
              isGreen ? 'text-emerald-50' : 
              isBrand ? 'text-blue-50' :
              'text-slate-800'
            }`}>
              Multi-line Labels with Descriptions
            </CardTitle>
            <CardDescription className={`transition-colors duration-300 ${
              isDark ? 'text-slate-400' : 
              isGreen ? 'text-emerald-300' : 
              isBrand ? 'text-blue-300' :
              'text-slate-600'
            }`}>
              Detailed labels with helpful descriptions and context
            </CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className={getLabelColor()}>
                  Password
                </Label>
                <p className={`text-sm mt-1 transition-colors duration-300 ${
                  isDark ? 'text-slate-400' : 
                  isGreen ? 'text-emerald-300' : 
                  isBrand ? 'text-blue-300' :
                  'text-slate-500'
                }`}>
                  Must be at least 8 characters with uppercase, lowercase, and numbers
                </p>
              </div>

              <div className="space-y-2">
                <Label className={getLabelColor()}>
                  Biography
                </Label>
                <p className={`text-sm mt-1 transition-colors duration-300 ${
                  isDark ? 'text-slate-400' : 
                  isGreen ? 'text-emerald-300' : 
                  isBrand ? 'text-blue-300' :
                  'text-slate-500'
                }`}>
                  Tell us about yourself, your interests, and professional background. 
                  This information will be displayed on your public profile.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label className={getLabelColor()}>
                  API Configuration
                </Label>
                <p className={`text-sm mt-1 transition-colors duration-300 ${
                  isDark ? 'text-slate-400' : 
                  isGreen ? 'text-emerald-300' : 
                  isBrand ? 'text-blue-300' :
                  'text-slate-500'
                }`}>
                  Enter your API key to connect external services. 
                  This key will be encrypted and stored securely.
                </p>
              </div>

              <div className="space-y-2">
                <Label className={getLabelColor()}>
                  Project Feedback
                </Label>
                <p className={`text-sm mt-1 transition-colors duration-300 ${
                  isDark ? 'text-slate-400' : 
                  isGreen ? 'text-emerald-300' : 
                  isBrand ? 'text-blue-300' :
                  'text-slate-500'
                }`}>
                  Share your thoughts on the project goals, timeline, and any specific 
                  requirements or concerns you might have.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Labels with Icons */}
        <Card className={getCardStyles()}>
          <CardHeader>
            <CardTitle className={`text-xl transition-colors duration-300 ${
              isDark ? 'text-white' : 
              isGreen ? 'text-emerald-50' : 
              isBrand ? 'text-blue-50' :
              'text-slate-800'
            }`}>
              Labels with Icons
            </CardTitle>
            <CardDescription className={`transition-colors duration-300 ${
              isDark ? 'text-slate-400' : 
              isGreen ? 'text-emerald-300' : 
              isBrand ? 'text-blue-300' :
              'text-slate-600'
            }`}>
              Enhanced labels with meaningful icons for better visual hierarchy
            </CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Label className={`flex items-center gap-2 ${getLabelColor()}`}>
                <User className="h-4 w-4" />
                User Account
              </Label>

              <Label className={`flex items-center gap-2 ${getLabelColor()}`}>
                <Mail className="h-4 w-4" />
                Email Contact
              </Label>

              <Label className={`flex items-center gap-2 ${getLabelColor()}`}>
                <Phone className="h-4 w-4" />
                Phone Contact
              </Label>

              <Label className={`flex items-center gap-2 ${getLabelColor()}`}>
                <Globe className="h-4 w-4" />
                Website URL
              </Label>
            </div>

            <div className="space-y-4">
              <Label className={`flex items-center gap-2 ${getLabelColor()}`}>
                <Calendar className="h-4 w-4" />
                Event Date
              </Label>

              <Label className={`flex items-center gap-2 ${getLabelColor()}`}>
                <Clock className="h-4 w-4" />
                Meeting Time
              </Label>

              <Label className={`flex items-center gap-2 ${getLabelColor()}`}>
                <Lock className="h-4 w-4" />
                Security Key
              </Label>

              <Label className={`flex items-center gap-2 ${getLabelColor()}`}>
                <Settings className="h-4 w-4" />
                Configuration
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Labels with Emojis */}
        <Card className={getCardStyles()}>
          <CardHeader>
            <CardTitle className={`text-xl transition-colors duration-300 ${
              isDark ? 'text-white' : 
              isGreen ? 'text-emerald-50' : 
              isBrand ? 'text-blue-50' :
              'text-slate-800'
            }`}>
              Labels with Emojis
            </CardTitle>
            <CardDescription className={`transition-colors duration-300 ${
              isDark ? 'text-slate-400' : 
              isGreen ? 'text-emerald-300' : 
              isBrand ? 'text-blue-300' :
              'text-slate-600'
            }`}>
              Fun and expressive labels using emojis for personality and visual appeal
            </CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Label className={getLabelColor()}>
                👤 Personal Name
              </Label>

              <Label className={getLabelColor()}>
                🎯 Favorite Hobby
              </Label>

              <Label className={getLabelColor()}>
                🍕 Favorite Food
              </Label>

              <Label className={getLabelColor()}>
                😊 Current Mood
              </Label>
            </div>

            <div className="space-y-4">
              <Label className={getLabelColor()}>
                ✈️ Dream Destination
              </Label>

              <Label className={getLabelColor()}>
                🎯 2024 Goal
              </Label>

              <Label className={getLabelColor()}>
                ⚡ Superpower Wish
              </Label>

              <Label className={getLabelColor()}>
                💡 Daily Inspiration
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Plain Labels for AI Interaction */}
        <Card className={getCardStyles()}>
          <CardHeader>
            <CardTitle className={`text-xl transition-colors duration-300 ${
              isDark ? 'text-white' : 
              isGreen ? 'text-emerald-50' : 
              isBrand ? 'text-blue-50' :
              'text-slate-800'
            }`}>
              Plain Labels for AI Interaction
            </CardTitle>
            <CardDescription className={`transition-colors duration-300 ${
              isDark ? 'text-slate-400' : 
              isGreen ? 'text-emerald-300' : 
              isBrand ? 'text-blue-300' :
              'text-slate-600'
            }`}>
              Clean, functional labels optimized for AI processing and interaction
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Label className={getLabelColor()}>
                  prompt
                </Label>

                <Label className={getLabelColor()}>
                  model
                </Label>

                <Label className={getLabelColor()}>
                  temperature
                </Label>

                <Label className={getLabelColor()}>
                  max_tokens
                </Label>
              </div>

              <div className="space-y-4">
                <Label className={getLabelColor()}>
                  system_message
                </Label>

                <Label className={getLabelColor()}>
                  user_id
                </Label>

                <Label className={getLabelColor()}>
                  session_id
                </Label>

                <Label className={getLabelColor()}>
                  context
                </Label>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className={`flex items-center space-x-3 p-4 rounded-lg border transition-all duration-300 ${
                isDark 
                  ? 'bg-slate-950/30 border-slate-600/30 backdrop-blur-lg' 
                  : isGreen
                    ? 'bg-emerald-950/40 border-emerald-600/30 backdrop-blur-lg'
                    : isBrand
                      ? 'bg-blue-950/40 border-blue-600/30 backdrop-blur-lg'
                      : 'bg-slate-50/50 border-slate-200'
              }`}>
                <Label className={`${getLabelColor()}`}>
                  stream
                </Label>
              </div>

              <div className={`flex items-center space-x-3 p-4 rounded-lg border transition-all duration-300 ${
                isDark 
                  ? 'bg-slate-950/30 border-slate-600/30 backdrop-blur-lg' 
                  : isGreen
                    ? 'bg-emerald-950/40 border-emerald-600/30 backdrop-blur-lg'
                    : isBrand
                      ? 'bg-blue-950/40 border-blue-600/30 backdrop-blur-lg'
                      : 'bg-slate-50/50 border-slate-200'
              }`}>
                <Label className={`${getLabelColor()}`}>
                  save_history
                </Label>
              </div>

              <div className={`flex items-center space-x-3 p-4 rounded-lg border transition-all duration-300 ${
                isDark 
                  ? 'bg-slate-950/30 border-slate-600/30 backdrop-blur-lg' 
                  : isGreen
                    ? 'bg-emerald-950/40 border-emerald-600/30 backdrop-blur-lg'
                    : isBrand
                      ? 'bg-blue-950/40 border-blue-600/30 backdrop-blur-lg'
                      : 'bg-slate-50/50 border-slate-200'
              }`}>
                <Label className={`${getLabelColor()}`}>
                  debug_mode
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Chat Message Labels */}
        <Card className={getCardStyles()}>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="px-3 py-1 border-blue-400 text-blue-600 bg-blue-100">
                <MessageSquare className="h-3 w-3 mr-1" />
                Chat
              </Badge>
              <CardTitle className={`text-xl transition-colors duration-300 ${
                isDark ? 'text-white' : 
                isGreen ? 'text-emerald-50' : 
                isBrand ? 'text-blue-50' :
                'text-slate-800'
              }`}>
                Chat Message Labels
              </CardTitle>
            </div>
            <CardDescription className={`transition-colors duration-300 ${
              isDark ? 'text-slate-400' : 
              isGreen ? 'text-emerald-300' : 
              isBrand ? 'text-blue-300' :
              'text-slate-600'
            }`}>
              Conversational labels for chat interfaces and human-AI interactions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Chat Container with Narrow Width */}
            <div className="max-w-2xl mx-auto space-y-8">
              {/* Human Messages */}
              <div>
                <h3 className={`mb-4 transition-colors duration-300 ${
                  isDark ? 'text-blue-400' : 
                  isGreen ? 'text-emerald-400' : 
                  isBrand ? 'text-indigo-400' :
                  'text-blue-600'
                }`}>
                  Human Messages
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Badge variant="secondary" className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-100 text-blue-700 border border-blue-200 shadow-sm">
                      <User className="h-3 w-3" />
                      <span className="text-xs">Human</span>
                    </Badge>
                    <p className={`text-sm leading-relaxed transition-colors duration-300 ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      Can you help me analyze this data and create a summary report?
                    </p>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Badge variant="secondary" className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-100 text-green-700 border border-green-200 shadow-sm">
                      <User className="h-3 w-3" />
                      <span className="text-xs">User</span>
                    </Badge>
                    <p className={`text-sm leading-relaxed transition-colors duration-300 ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      What's the weather like today? I need to plan my outdoor activities.
                    </p>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Badge variant="secondary" className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-purple-100 text-purple-700 border border-purple-200 shadow-sm">
                      <User className="h-3 w-3" />
                      <span className="text-xs">Customer</span>
                    </Badge>
                    <p className={`text-sm leading-relaxed transition-colors duration-300 ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      I'm having trouble with my order. Can you check the status and provide an update?
                    </p>
                  </div>
                </div>
              </div>

              {/* AI Responses */}
              <div>
                <h3 className={`mb-4 transition-colors duration-300 ${
                  isDark ? 'text-blue-400' : 
                  isGreen ? 'text-emerald-400' : 
                  isBrand ? 'text-indigo-400' :
                  'text-blue-600'
                }`}>
                  AI Assistant Responses
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Badge variant="secondary" className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-100 text-blue-700 border border-blue-200 shadow-sm">
                      <Bot className="h-3 w-3" />
                      <span className="text-xs">AI Assistant</span>
                    </Badge>
                    <p className={`text-sm leading-relaxed transition-colors duration-300 ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      I'd be happy to help you analyze your data. Please share the dataset, and I'll create a comprehensive summary report with key insights and visualizations.
                    </p>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Badge variant="secondary" className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-100 text-emerald-700 border border-emerald-200 shadow-sm">
                      <Brain className="h-3 w-3" />
                      <span className="text-xs">AI Agent</span>
                    </Badge>
                    <p className={`text-sm leading-relaxed transition-colors duration-300 ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      Based on current weather data, it's partly cloudy with a temperature of 72°F. Perfect conditions for outdoor activities! Would you like specific recommendations?
                    </p>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Badge variant="secondary" className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-purple-100 text-purple-700 border border-purple-200 shadow-sm">
                      <Sparkles className="h-3 w-3" />
                      <span className="text-xs">Support AI</span>
                    </Badge>
                    <p className={`text-sm leading-relaxed transition-colors duration-300 ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      I've located your order #12345. It's currently in transit and expected to arrive tomorrow by 2 PM. I'll send you tracking details via email.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Chat Status Labels */}
            <div className="max-w-2xl mx-auto">
              <h3 className={`mb-4 transition-colors duration-300 ${
                isDark ? 'text-blue-400' : 
                isGreen ? 'text-emerald-400' : 
                isBrand ? 'text-indigo-400' :
                'text-blue-600'
              }`}>
                Chat Status Indicators
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className={`flex items-center gap-2 p-2 rounded-lg border transition-all duration-300 ${
                  isDark 
                    ? 'bg-slate-950/30 border-slate-600/30 backdrop-blur-lg' 
                    : 'bg-slate-50/50 border-slate-200'
                }`}>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <Label className={`${getLabelColor()} text-sm`}>
                    Online
                  </Label>
                </div>

                <div className={`flex items-center gap-2 p-2 rounded-lg border transition-all duration-300 ${
                  isDark 
                    ? 'bg-slate-950/30 border-slate-600/30 backdrop-blur-lg' 
                    : 'bg-slate-50/50 border-slate-200'
                }`}>
                  <Loader2 className="w-3 h-3 animate-spin text-blue-400" />
                  <Label className={`${getLabelColor()} text-sm`}>
                    Typing...
                  </Label>
                </div>

                <div className={`flex items-center gap-2 p-2 rounded-lg border transition-all duration-300 ${
                  isDark 
                    ? 'bg-slate-950/30 border-slate-600/30 backdrop-blur-lg' 
                    : 'bg-slate-50/50 border-slate-200'
                }`}>
                  <CheckCircle className="w-3 h-3 text-green-400" />
                  <Label className={`${getLabelColor()} text-sm`}>
                    Delivered
                  </Label>
                </div>

                <div className={`flex items-center gap-2 p-2 rounded-lg border transition-all duration-300 ${
                  isDark 
                    ? 'bg-slate-950/30 border-slate-600/30 backdrop-blur-lg' 
                    : 'bg-slate-50/50 border-slate-200'
                }`}>
                  <Clock className="w-3 h-3 text-yellow-400" />
                  <Label className={`${getLabelColor()} text-sm`}>
                    Away
                  </Label>
                </div>
              </div>
            </div>

            {/* Conversation Threading */}
            <div className="max-w-2xl mx-auto">
              <h3 className={`mb-4 transition-colors duration-300 ${
                isDark ? 'text-blue-400' : 
                isGreen ? 'text-emerald-400' : 
                isBrand ? 'text-indigo-400' :
                'text-blue-600'
              }`}>
                Conversation Threading
              </h3>
              <div className="space-y-2">
                <div className={`flex items-start gap-2 p-2 rounded-lg border-l-4 border-l-blue-400 transition-all duration-300 ${
                  isDark 
                    ? 'bg-slate-950/30 border-slate-600/30 backdrop-blur-lg' 
                    : 'bg-slate-50/50 border-slate-200'
                }`}>
                  <MessageSquare className="h-3 w-3 mt-1 text-blue-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <Label className={`${getLabelColor()} block text-sm`}>
                      Thread: Project Discussion
                    </Label>
                    <p className={`text-xs mt-0.5 transition-colors duration-300 truncate ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                      3 messages • Last reply 2 min ago
                    </p>
                  </div>
                </div>

                <div className={`flex items-start gap-2 p-2 rounded-lg border-l-4 border-l-green-400 transition-all duration-300 ${
                  isDark 
                    ? 'bg-slate-950/30 border-slate-600/30 backdrop-blur-lg' 
                    : 'bg-slate-50/50 border-slate-200'
                }`}>
                  <MessageSquare className="h-3 w-3 mt-1 text-green-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <Label className={`${getLabelColor()} block text-sm`}>
                      Thread: Bug Report #4521
                    </Label>
                    <p className={`text-xs mt-0.5 transition-colors duration-300 truncate ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                      7 messages • Last reply 1 hour ago
                    </p>
                  </div>
                </div>

                <div className={`flex items-start gap-2 p-2 rounded-lg border-l-4 border-l-purple-400 transition-all duration-300 ${
                  isDark 
                    ? 'bg-slate-950/30 border-slate-600/30 backdrop-blur-lg' 
                    : 'bg-slate-50/50 border-slate-200'
                }`}>
                  <MessageSquare className="h-3 w-3 mt-1 text-purple-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <Label className={`${getLabelColor()} block text-sm`}>
                      Thread: Feature Request
                    </Label>
                    <p className={`text-xs mt-0.5 transition-colors duration-300 truncate ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                      12 messages • Last reply yesterday
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification & Message Bubbles */}
        <Card className={getCardStyles()}>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="px-3 py-1 border-red-400 text-red-600 bg-red-100">
                <Bell className="h-3 w-3 mr-1" />
                Badges
              </Badge>
              <CardTitle className={`text-xl transition-colors duration-300 ${
                isDark ? 'text-white' : 
                isGreen ? 'text-emerald-50' : 
                isBrand ? 'text-blue-50' :
                'text-slate-800'
              }`}>
                Notification & Message Bubbles
              </CardTitle>
            </div>
            <CardDescription className={`transition-colors duration-300 ${
              isDark ? 'text-slate-400' : 
              isGreen ? 'text-emerald-300' : 
              isBrand ? 'text-blue-300' :
              'text-slate-600'
            }`}>
              Attention-grabbing badges and bubbles for counts, status, and notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">

            {/* Count Badges on Icons */}
            <div>
              <h3 className={`mb-4 transition-colors duration-300 ${
                isDark ? 'text-blue-400' : 
                isGreen ? 'text-emerald-400' : 
                isBrand ? 'text-indigo-400' :
                'text-red-600'
              }`}>
                Icon Count Badges
              </h3>
              <div className="grid md:grid-cols-4 gap-6">
                <div className={`p-6 rounded-lg border transition-all duration-300 ${
                  isDark 
                    ? 'bg-slate-950/30 border-slate-600/30 backdrop-blur-lg' 
                    : 'bg-slate-50/50 border-slate-200'
                }`}>
                  <div className="flex flex-col items-center gap-3">
                    <div className="relative">
                      <Bell className="h-8 w-8 text-slate-600" />
                      <span className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 text-xs bg-red-500 text-white rounded-full animate-pulse">
                        3
                      </span>
                    </div>
                    <Label className={`${getLabelColor()} text-center text-sm`}>
                      Notifications
                    </Label>
                  </div>
                </div>

                <div className={`p-6 rounded-lg border transition-all duration-300 ${
                  isDark 
                    ? 'bg-slate-950/30 border-slate-600/30 backdrop-blur-lg' 
                    : 'bg-slate-50/50 border-slate-200'
                }`}>
                  <div className="flex flex-col items-center gap-3">
                    <div className="relative">
                      <Mail className="h-8 w-8 text-slate-600" />
                      <span className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 text-xs bg-blue-500 text-white rounded-full">
                        12
                      </span>
                    </div>
                    <Label className={`${getLabelColor()} text-center text-sm`}>
                      Messages
                    </Label>
                  </div>
                </div>

                <div className={`p-6 rounded-lg border transition-all duration-300 ${
                  isDark 
                    ? 'bg-slate-950/30 border-slate-600/30 backdrop-blur-lg' 
                    : 'bg-slate-50/50 border-slate-200'
                }`}>
                  <div className="flex flex-col items-center gap-3">
                    <div className="relative">
                      <ShoppingCart className="h-8 w-8 text-slate-600" />
                      <span className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 text-xs bg-orange-500 text-white rounded-full">
                        5
                      </span>
                    </div>
                    <Label className={`${getLabelColor()} text-center text-sm`}>
                      Cart Items
                    </Label>
                  </div>
                </div>

                <div className={`p-6 rounded-lg border transition-all duration-300 ${
                  isDark 
                    ? 'bg-slate-950/30 border-slate-600/30 backdrop-blur-lg' 
                    : 'bg-slate-50/50 border-slate-200'
                }`}>
                  <div className="flex flex-col items-center gap-3">
                    <div className="relative">
                      <MessageSquare className="h-8 w-8 text-slate-600" />
                      <span className="absolute -top-2 -right-2 flex items-center justify-center min-w-5 h-5 px-1.5 text-xs bg-green-500 text-white rounded-full">
                        99+
                      </span>
                    </div>
                    <Label className={`${getLabelColor()} text-center text-sm`}>
                      Chat Messages
                    </Label>
                  </div>
                </div>
              </div>
            </div>

            {/* Inline Number Bubbles */}
            <div>
              <h3 className={`mb-4 transition-colors duration-300 ${
                isDark ? 'text-blue-400' : 
                isGreen ? 'text-emerald-400' : 
                isBrand ? 'text-indigo-400' :
                'text-red-600'
              }`}>
                Inline Number Bubbles
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className={`p-4 rounded-lg border transition-all duration-300 ${
                    isDark 
                      ? 'bg-slate-950/30 border-slate-600/30 backdrop-blur-lg' 
                      : 'bg-slate-50/50 border-slate-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <Label className={getLabelColor()}>Inbox</Label>
                      <span className="flex items-center justify-center min-w-6 h-6 px-2 text-xs bg-blue-500 text-white rounded-full">
                        24
                      </span>
                    </div>
                  </div>

                  <div className={`p-4 rounded-lg border transition-all duration-300 ${
                    isDark 
                      ? 'bg-slate-950/30 border-slate-600/30 backdrop-blur-lg' 
                      : 'bg-slate-50/50 border-slate-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <Label className={getLabelColor()}>Pending Tasks</Label>
                      <span className="flex items-center justify-center min-w-6 h-6 px-2 text-xs bg-amber-500 text-white rounded-full">
                        8
                      </span>
                    </div>
                  </div>

                  <div className={`p-4 rounded-lg border transition-all duration-300 ${
                    isDark 
                      ? 'bg-slate-950/30 border-slate-600/30 backdrop-blur-lg' 
                      : 'bg-slate-50/50 border-slate-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <Label className={getLabelColor()}>Completed</Label>
                      <span className="flex items-center justify-center min-w-6 h-6 px-2 text-xs bg-green-500 text-white rounded-full">
                        156
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className={`p-4 rounded-lg border transition-all duration-300 ${
                    isDark 
                      ? 'bg-slate-950/30 border-slate-600/30 backdrop-blur-lg' 
                      : 'bg-slate-50/50 border-slate-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <Label className={getLabelColor()}>Active Projects</Label>
                      <span className="flex items-center justify-center min-w-6 h-6 px-2 text-xs bg-purple-500 text-white rounded-full">
                        12
                      </span>
                    </div>
                  </div>

                  <div className={`p-4 rounded-lg border transition-all duration-300 ${
                    isDark 
                      ? 'bg-slate-950/30 border-slate-600/30 backdrop-blur-lg' 
                      : 'bg-slate-50/50 border-slate-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <Label className={getLabelColor()}>Team Members</Label>
                      <span className="flex items-center justify-center min-w-6 h-6 px-2 text-xs bg-indigo-500 text-white rounded-full">
                        47
                      </span>
                    </div>
                  </div>

                  <div className={`p-4 rounded-lg border transition-all duration-300 ${
                    isDark 
                      ? 'bg-slate-950/30 border-slate-600/30 backdrop-blur-lg' 
                      : 'bg-slate-50/50 border-slate-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <Label className={getLabelColor()}>Alerts</Label>
                      <span className="flex items-center justify-center min-w-6 h-6 px-2 text-xs bg-red-500 text-white rounded-full animate-pulse">
                        2
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Indicator Bubbles */}
            <div>
              <h3 className={`mb-4 transition-colors duration-300 ${
                isDark ? 'text-blue-400' : 
                isGreen ? 'text-emerald-400' : 
                isBrand ? 'text-indigo-400' :
                'text-red-600'
              }`}>
                Status Indicator Bubbles
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className={`p-4 rounded-lg border transition-all duration-300 ${
                  isDark 
                    ? 'bg-slate-950/30 border-slate-600/30 backdrop-blur-lg' 
                    : 'bg-slate-50/50 border-slate-200'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <User className="h-10 w-10 text-slate-600" />
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                    </div>
                    <div>
                      <Label className={`${getLabelColor()} block`}>
                        Sarah Chen
                      </Label>
                      <p className="text-xs text-green-600">Online</p>
                    </div>
                  </div>
                </div>

                <div className={`p-4 rounded-lg border transition-all duration-300 ${
                  isDark 
                    ? 'bg-slate-950/30 border-slate-600/30 backdrop-blur-lg' 
                    : 'bg-slate-50/50 border-slate-200'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <User className="h-10 w-10 text-slate-600" />
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-amber-500 rounded-full border-2 border-white"></span>
                    </div>
                    <div>
                      <Label className={`${getLabelColor()} block`}>
                        Mike Johnson
                      </Label>
                      <p className="text-xs text-amber-600">Away</p>
                    </div>
                  </div>
                </div>

                <div className={`p-4 rounded-lg border transition-all duration-300 ${
                  isDark 
                    ? 'bg-slate-950/30 border-slate-600/30 backdrop-blur-lg' 
                    : 'bg-slate-50/50 border-slate-200'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <User className="h-10 w-10 text-slate-600" />
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-slate-400 rounded-full border-2 border-white"></span>
                    </div>
                    <div>
                      <Label className={`${getLabelColor()} block`}>
                        Alex Park
                      </Label>
                      <p className="text-xs text-slate-500">Offline</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Message Notification Bubbles */}
            <div>
              <h3 className={`mb-4 transition-colors duration-300 ${
                isDark ? 'text-blue-400' : 
                isGreen ? 'text-emerald-400' : 
                isBrand ? 'text-indigo-400' :
                'text-red-600'
              }`}>
                Message Notification Styles
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className={`p-4 rounded-lg border-l-4 border-l-blue-500 transition-all duration-300 relative ${
                    isDark 
                      ? 'bg-blue-950/20 border-blue-500/30' 
                      : 'bg-blue-50 border-blue-200'
                  }`}>
                    <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                    <Label className={`${getLabelColor()} block mb-1`}>
                      New Feature Available
                    </Label>
                    <p className="text-sm text-blue-700">
                      Check out our latest updates
                    </p>
                  </div>

                  <div className={`p-4 rounded-lg border-l-4 border-l-green-500 transition-all duration-300 relative ${
                    isDark 
                      ? 'bg-green-950/20 border-green-500/30' 
                      : 'bg-green-50 border-green-200'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <Label className={`${getLabelColor()} block mb-1`}>
                          Task Completed
                        </Label>
                        <p className="text-sm text-green-700">
                          Your report has been generated
                        </p>
                      </div>
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    </div>
                  </div>

                  <div className={`p-4 rounded-lg border-l-4 border-l-red-500 transition-all duration-300 relative ${
                    isDark 
                      ? 'bg-red-950/20 border-red-500/30' 
                      : 'bg-red-50 border-red-200'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <Label className={`${getLabelColor()} block mb-1`}>
                          Action Required
                        </Label>
                        <p className="text-sm text-red-700">
                          Please review and approve
                        </p>
                      </div>
                      <span className="flex items-center justify-center min-w-5 h-5 px-1.5 text-xs bg-red-500 text-white rounded-full">
                        !
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className={`p-4 rounded-lg border-l-4 border-l-purple-500 transition-all duration-300 ${
                    isDark 
                      ? 'bg-purple-950/20 border-purple-500/30' 
                      : 'bg-purple-50 border-purple-200'
                  }`}>
                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-purple-500 text-white rounded-full text-xs flex-shrink-0">
                        AI
                      </div>
                      <div>
                        <Label className={`${getLabelColor()} block mb-1`}>
                          AI Assistant Ready
                        </Label>
                        <p className="text-sm text-purple-700">
                          I can help you with your tasks
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className={`p-4 rounded-lg border-l-4 border-l-amber-500 transition-all duration-300 ${
                    isDark 
                      ? 'bg-amber-950/20 border-amber-500/30' 
                      : 'bg-amber-50 border-amber-200'
                  }`}>
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <Label className={`${getLabelColor()} block mb-1`}>
                          Warning Notice
                        </Label>
                        <p className="text-sm text-amber-700">
                          Your session will expire soon
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className={`p-4 rounded-lg border-l-4 border-l-indigo-500 transition-all duration-300 ${
                    isDark 
                      ? 'bg-indigo-950/20 border-indigo-500/30' 
                      : 'bg-indigo-50 border-indigo-200'
                  }`}>
                    <div className="flex items-start gap-3">
                      <Inbox className="h-5 w-5 text-indigo-500 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <Label className={getLabelColor()}>
                            New Message
                          </Label>
                          <span className="text-xs text-indigo-600">2 min ago</span>
                        </div>
                        <p className="text-sm text-indigo-700">
                          You have a new message from team
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pill-shaped Badges */}
            <div>
              <h3 className={`mb-4 transition-colors duration-300 ${
                isDark ? 'text-blue-400' : 
                isGreen ? 'text-emerald-400' : 
                isBrand ? 'text-indigo-400' :
                'text-red-600'
              }`}>
                Pill-shaped Status Badges
              </h3>
              <div className="grid md:grid-cols-4 gap-4">
                <div className={`p-4 rounded-lg border transition-all duration-300 ${
                  isDark 
                    ? 'bg-slate-950/30 border-slate-600/30 backdrop-blur-lg' 
                    : 'bg-slate-50/50 border-slate-200'
                }`}>
                  <Label className={`${getLabelColor()} block mb-3`}>
                    Project Status
                  </Label>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-green-100 text-green-700">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                    Active
                  </span>
                </div>

                <div className={`p-4 rounded-lg border transition-all duration-300 ${
                  isDark 
                    ? 'bg-slate-950/30 border-slate-600/30 backdrop-blur-lg' 
                    : 'bg-slate-50/50 border-slate-200'
                }`}>
                  <Label className={`${getLabelColor()} block mb-3`}>
                    Priority Level
                  </Label>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-red-100 text-red-700">
                    High Priority
                  </span>
                </div>

                <div className={`p-4 rounded-lg border transition-all duration-300 ${
                  isDark 
                    ? 'bg-slate-950/30 border-slate-600/30 backdrop-blur-lg' 
                    : 'bg-slate-50/50 border-slate-200'
                }`}>
                  <Label className={`${getLabelColor()} block mb-3`}>
                    Task Type
                  </Label>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                    Development
                  </span>
                </div>

                <div className={`p-4 rounded-lg border transition-all duration-300 ${
                  isDark 
                    ? 'bg-slate-950/30 border-slate-600/30 backdrop-blur-lg' 
                    : 'bg-slate-50/50 border-slate-200'
                }`}>
                  <Label className={`${getLabelColor()} block mb-3`}>
                    Team Size
                  </Label>
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs bg-purple-100 text-purple-700">
                    <User className="h-3 w-3" />
                    8 Members
                  </span>
                </div>
              </div>
            </div>

            {/* Comic Book Style Bubbles - All Pointer Positions */}
            <div>
              <h3 className={`mb-4 transition-colors duration-300 ${
                isDark ? 'text-blue-400' : 
                isGreen ? 'text-emerald-400' : 
                isBrand ? 'text-indigo-400' :
                'text-red-600'
              }`}>
                Comic Book Bubbles - All Pointer Positions
              </h3>
              
              <div className="space-y-8">
                {/* Bottom Pointers */}
                <div>
                  <h4 className={`text-sm mb-4 transition-colors duration-300 ${getLabelColor()}`}>
                    Bottom Pointer Positions
                  </h4>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="flex flex-col items-center gap-3">
                      <div className="relative w-full bg-blue-100 border-2 border-blue-400 rounded-2xl p-4 shadow-md bubble-bottom-left">
                        <p className="text-sm text-blue-800 text-center">
                          Bottom Left Pointer
                        </p>
                      </div>
                      <Label className={`text-xs ${getLabelColor()}`}>Pointer: Bottom Left</Label>
                    </div>

                    <div className="flex flex-col items-center gap-3">
                      <div className="relative w-full bg-pink-100 border-2 border-pink-400 rounded-2xl p-4 shadow-md bubble-bottom-center">
                        <p className="text-sm text-pink-800 text-center">
                          Bottom Center Pointer
                        </p>
                      </div>
                      <Label className={`text-xs ${getLabelColor()}`}>Pointer: Bottom Center</Label>
                    </div>

                    <div className="flex flex-col items-center gap-3">
                      <div className="relative w-full bg-purple-100 border-2 border-purple-400 rounded-2xl p-4 shadow-md bubble-bottom-right">
                        <p className="text-sm text-purple-800 text-center">
                          Bottom Right Pointer
                        </p>
                      </div>
                      <Label className={`text-xs ${getLabelColor()}`}>Pointer: Bottom Right</Label>
                    </div>
                  </div>
                </div>

                {/* Top Pointers */}
                <div>
                  <h4 className={`text-sm mb-4 transition-colors duration-300 ${getLabelColor()}`}>
                    Top Pointer Positions
                  </h4>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="flex flex-col items-center gap-3">
                      <Label className={`text-xs ${getLabelColor()}`}>Pointer: Top Left</Label>
                      <div className="relative w-full bg-yellow-100 border-2 border-yellow-400 rounded-2xl p-4 shadow-md bubble-top-left">
                        <p className="text-sm text-yellow-800 text-center">
                          Top Left Pointer
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-center gap-3">
                      <Label className={`text-xs ${getLabelColor()}`}>Pointer: Top Center</Label>
                      <div className="relative w-full bg-cyan-100 border-2 border-cyan-400 rounded-2xl p-4 shadow-md bubble-top-center">
                        <p className="text-sm text-cyan-800 text-center">
                          Top Center Pointer
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-center gap-3">
                      <Label className={`text-xs ${getLabelColor()}`}>Pointer: Top Right</Label>
                      <div className="relative w-full bg-green-100 border-2 border-green-400 rounded-2xl p-4 shadow-md bubble-top-right">
                        <p className="text-sm text-green-800 text-center">
                          Top Right Pointer
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Left Side Pointers */}
                <div>
                  <h4 className={`text-sm mb-4 transition-colors duration-300 ${getLabelColor()}`}>
                    Left Side Pointer Positions
                  </h4>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="flex items-center gap-3">
                      <Label className={`text-xs ${getLabelColor()} w-20 text-center`}>Left Top</Label>
                      <div className="relative flex-1 bg-red-100 border-2 border-red-400 rounded-2xl p-4 shadow-md bubble-left-top">
                        <p className="text-sm text-red-800">
                          Left Top Pointer
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Label className={`text-xs ${getLabelColor()} w-20 text-center`}>Left Center</Label>
                      <div className="relative flex-1 bg-orange-100 border-2 border-orange-400 rounded-2xl p-4 shadow-md bubble-left-center">
                        <p className="text-sm text-orange-800">
                          Left Center Pointer
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Label className={`text-xs ${getLabelColor()} w-20 text-center`}>Left Bottom</Label>
                      <div className="relative flex-1 bg-teal-100 border-2 border-teal-400 rounded-2xl p-4 shadow-md bubble-left-bottom">
                        <p className="text-sm text-teal-800">
                          Left Bottom Pointer
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side Pointers */}
                <div>
                  <h4 className={`text-sm mb-4 transition-colors duration-300 ${getLabelColor()}`}>
                    Right Side Pointer Positions
                  </h4>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="flex items-center gap-3">
                      <div className="relative flex-1 bg-indigo-100 border-2 border-indigo-400 rounded-2xl p-4 shadow-md bubble-right-top">
                        <p className="text-sm text-indigo-800">
                          Right Top Pointer
                        </p>
                      </div>
                      <Label className={`text-xs ${getLabelColor()} w-20 text-center`}>Right Top</Label>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="relative flex-1 bg-rose-100 border-2 border-rose-400 rounded-2xl p-4 shadow-md bubble-right-center">
                        <p className="text-sm text-rose-800">
                          Right Center Pointer
                        </p>
                      </div>
                      <Label className={`text-xs ${getLabelColor()} w-20 text-center`}>Right Center</Label>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="relative flex-1 bg-lime-100 border-2 border-lime-400 rounded-2xl p-4 shadow-md bubble-right-bottom">
                        <p className="text-sm text-lime-800">
                          Right Bottom Pointer
                        </p>
                      </div>
                      <Label className={`text-xs ${getLabelColor()} w-20 text-center`}>Right Bottom</Label>
                    </div>
                  </div>
                </div>

                {/* Special Shapes */}
                <div>
                  <h4 className={`text-sm mb-4 transition-colors duration-300 ${getLabelColor()}`}>
                    Special Comic Book Shapes
                  </h4>
                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Circle with pointer */}
                    <div className="flex flex-col items-center gap-3">
                      <div className="relative w-32 h-32 bg-purple-100 border-2 border-purple-400 rounded-full p-4 shadow-md bubble-bottom-center flex items-center justify-center">
                        <p className="text-sm text-purple-800 text-center">
                          Circle
                        </p>
                      </div>
                      <Label className={`text-xs ${getLabelColor()}`}>Circle w/ Bottom Pointer</Label>
                    </div>

                    {/* Scalloped/Cloud shape */}
                    <div className="flex flex-col items-center gap-3">
                      <div className="relative bubble-bottom-left">
                        <div className="relative bg-blue-100 border-2 border-blue-400 shadow-md px-6 py-4" style={{
                          borderRadius: '50% 60% 70% 40% / 60% 50% 50% 70%',
                          position: 'relative'
                        }}>
                          <div className="absolute -top-3 left-4 w-8 h-8 bg-blue-100 border-2 border-blue-400 rounded-full"></div>
                          <div className="absolute -top-2 right-6 w-6 h-6 bg-blue-100 border-2 border-blue-400 rounded-full"></div>
                          <div className="absolute top-0 left-10 w-10 h-10 bg-blue-100 border-2 border-blue-400 rounded-full"></div>
                          <p className="text-sm text-blue-800 text-center relative z-10">
                            Cloud Shape
                          </p>
                        </div>
                      </div>
                      <Label className={`text-xs ${getLabelColor()}`}>Cloud/Thought Style</Label>
                    </div>

                    {/* With decorative elements */}
                    <div className="flex flex-col items-center gap-3">
                      <div className="relative bg-yellow-100 border-2 border-yellow-400 rounded-2xl p-4 shadow-md bubble-top-right">
                        <div className="absolute -top-2 -right-2 flex gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-300" />
                          <Sparkles className="h-3 w-3 text-yellow-500" />
                        </div>
                        <p className="text-sm text-yellow-800 text-center">
                          With Stars!
                        </p>
                      </div>
                      <Label className={`text-xs ${getLabelColor()}`}>With Decorations</Label>
                    </div>
                  </div>
                </div>

                {/* Multiple Bubble Styles */}
                <div>
                  <h4 className={`text-sm mb-4 transition-colors duration-300 ${getLabelColor()}`}>
                    Different Visual Styles
                  </h4>
                  <div className="grid md:grid-cols-4 gap-4">
                    {/* Thick border */}
                    <div className="flex flex-col items-center gap-2">
                      <div className="relative w-full bg-white border-4 border-slate-800 rounded-2xl p-3 shadow-lg bubble-bottom-left">
                        <p className="text-xs text-slate-800 text-center">
                          Bold Comic
                        </p>
                      </div>
                      <Label className={`text-xs ${getLabelColor()}`}>Bold Border</Label>
                    </div>

                    {/* Dashed */}
                    <div className="flex flex-col items-center gap-2">
                      <div className="relative w-full bg-cyan-50 border-2 border-dashed border-cyan-400 rounded-2xl p-3 shadow-sm bubble-bottom-center">
                        <p className="text-xs text-cyan-800 text-center">
                          Dashed
                        </p>
                      </div>
                      <Label className={`text-xs ${getLabelColor()}`}>Dashed Line</Label>
                    </div>

                    {/* Gradient */}
                    <div className="flex flex-col items-center gap-2">
                      <div className="relative w-full bg-gradient-to-br from-pink-200 to-purple-300 border-2 border-purple-400 rounded-2xl p-3 shadow-md bubble-bottom-right">
                        <p className="text-xs text-purple-900 text-center">
                          Gradient
                        </p>
                      </div>
                      <Label className={`text-xs ${getLabelColor()}`}>Gradient Fill</Label>
                    </div>

                    {/* Shadow emphasis */}
                    <div className="flex flex-col items-center gap-2">
                      <div className="relative w-full bg-amber-200 border-2 border-amber-500 rounded-2xl p-3 shadow-2xl bubble-top-center">
                        <p className="text-xs text-amber-900 text-center">
                          Shadow
                        </p>
                      </div>
                      <Label className={`text-xs ${getLabelColor()}`}>Heavy Shadow</Label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Original Comic Book Style Bubbles */}
            <div>
              <h3 className={`mb-4 transition-colors duration-300 ${
                isDark ? 'text-blue-400' : 
                isGreen ? 'text-emerald-400' : 
                isBrand ? 'text-indigo-400' :
                'text-red-600'
              }`}>
                Comic Book Conversation Examples
              </h3>
              
              <div className="space-y-8">
                {/* Speech Bubbles - User Messages */}
                <div className="space-y-4">
                  <h4 className={`text-sm transition-colors duration-300 ${getLabelColor()}`}>
                    Speech Bubbles (User)
                  </h4>
                  
                  <div className="flex gap-3">
                    <User className="h-8 w-8 text-slate-600 flex-shrink-0" />
                    <div className="relative max-w-md bg-white border-2 border-slate-300 rounded-2xl p-4 shadow-md speech-bubble-left">
                      <p className="text-sm text-slate-700">
                        Hey! Can you help me understand how this feature works?
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 justify-end">
                    <div className="relative max-w-md bg-blue-500 rounded-2xl p-4 shadow-md speech-bubble-right">
                      <p className="text-sm text-white">
                        Of course! I'd be happy to walk you through it step by step.
                      </p>
                    </div>
                    <Bot className="h-8 w-8 text-blue-600 flex-shrink-0" />
                  </div>

                  <div className="flex gap-3">
                    <User className="h-8 w-8 text-slate-600 flex-shrink-0" />
                    <div className="relative max-w-md bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-4 shadow-md speech-bubble-left">
                      <p className="text-sm text-emerald-800">
                        That would be great, thanks!
                      </p>
                    </div>
                  </div>
                </div>

                {/* Thought Bubbles */}
                <div className="space-y-4">
                  <h4 className={`text-sm transition-colors duration-300 ${getLabelColor()}`}>
                    Thought Bubbles (Internal Processing)
                  </h4>
                  
                  <div className="flex gap-3">
                    <Brain className="h-8 w-8 text-purple-600 flex-shrink-0" />
                    <div className="relative max-w-md bg-purple-50 border-2 border-purple-300 rounded-3xl p-4 shadow-md thought-bubble-left">
                      <p className="text-sm text-purple-800 italic">
                        Processing user request... analyzing context...
                      </p>
                      <div className="flex gap-1 mt-2">
                        <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></span>
                        <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></span>
                        <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 justify-end">
                    <div className="relative max-w-md bg-amber-50 border-2 border-amber-300 rounded-3xl p-4 shadow-md thought-bubble-right">
                      <p className="text-sm text-amber-800 italic">
                        Hmm, I wonder if there's a better way to explain this concept...
                      </p>
                    </div>
                    <Sparkles className="h-8 w-8 text-amber-600 flex-shrink-0" />
                  </div>
                </div>

                {/* Exclamation Bubbles */}
                <div className="space-y-4">
                  <h4 className={`text-sm transition-colors duration-300 ${getLabelColor()}`}>
                    Exclamation & Alert Bubbles
                  </h4>
                  
                  <div className="flex gap-3">
                    <AlertCircle className="h-8 w-8 text-red-600 flex-shrink-0 animate-pulse" />
                    <div className="relative max-w-md bg-red-50 border-2 border-red-400 rounded-2xl p-4 shadow-lg speech-bubble-left animate-bounce">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">⚠️</span>
                        <Label className="text-red-700">Alert!</Label>
                      </div>
                      <p className="text-sm text-red-700">
                        This action requires immediate attention!
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 justify-end">
                    <div className="relative max-w-md bg-green-400 border-2 border-green-600 rounded-2xl p-4 shadow-lg speech-bubble-right">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">✨</span>
                        <Label className="text-white">Success!</Label>
                      </div>
                      <p className="text-sm text-white">
                        Everything completed perfectly!
                      </p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-600 flex-shrink-0" />
                  </div>
                </div>

                {/* Styled Variants */}
                <div className="space-y-4">
                  <h4 className={`text-sm transition-colors duration-300 ${getLabelColor()}`}>
                    Styled Bubble Variations
                  </h4>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Gradient bubble */}
                    <div className="flex gap-3">
                      <Bot className="h-8 w-8 text-indigo-600 flex-shrink-0" />
                      <div className="relative max-w-md bg-gradient-to-br from-indigo-500 to-purple-600 border-2 border-indigo-600 rounded-2xl p-4 shadow-xl speech-bubble-left">
                        <p className="text-sm text-white">
                          I can process complex queries with advanced AI capabilities!
                        </p>
                      </div>
                    </div>

                    {/* Outlined bubble */}
                    <div className="flex gap-3 justify-end">
                      <div className="relative max-w-md bg-white border-4 border-slate-800 rounded-2xl p-4 shadow-md speech-bubble-right">
                        <p className="text-sm text-slate-800">
                          Classic comic book style with bold outlines!
                        </p>
                      </div>
                      <MessageSquare className="h-8 w-8 text-slate-800 flex-shrink-0" />
                    </div>

                    {/* Dashed bubble */}
                    <div className="flex gap-3">
                      <Send className="h-8 w-8 text-cyan-600 flex-shrink-0" />
                      <div className="relative max-w-md bg-cyan-50 border-2 border-cyan-400 rounded-2xl p-4 shadow-sm speech-bubble-left" style={{borderStyle: 'dashed'}}>
                        <p className="text-sm text-cyan-800">
                          This message is being transmitted...
                        </p>
                        <div className="flex gap-1 mt-2">
                          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>
                        </div>
                      </div>
                    </div>

                    {/* Shadow emphasis bubble */}
                    <div className="flex gap-3 justify-end">
                      <div className="relative max-w-md bg-yellow-300 border-2 border-yellow-600 rounded-2xl p-4 shadow-2xl speech-bubble-right">
                        <p className="text-sm text-yellow-900">
                          Important information with extra emphasis!
                        </p>
                      </div>
                      <Star className="h-8 w-8 text-yellow-600 flex-shrink-0 animate-spin" />
                    </div>
                  </div>
                </div>

                {/* Multi-bubble Conversation */}
                <div className="space-y-4">
                  <h4 className={`text-sm transition-colors duration-300 ${getLabelColor()}`}>
                    Conversation Flow
                  </h4>
                  
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <User className="h-6 w-6 text-slate-600 flex-shrink-0 mt-1" />
                      <div className="relative max-w-xs bg-white border-2 border-slate-300 rounded-2xl p-3 shadow-md speech-bubble-left">
                        <p className="text-sm text-slate-700">
                          What's the weather today?
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3 justify-end">
                      <div className="relative max-w-xs bg-blue-500 rounded-2xl p-3 shadow-md speech-bubble-right">
                        <p className="text-sm text-white">
                          It's sunny and 72°F! Perfect day!
                        </p>
                      </div>
                      <Bot className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                    </div>

                    <div className="flex gap-3">
                      <User className="h-6 w-6 text-slate-600 flex-shrink-0 mt-1" />
                      <div className="relative max-w-xs bg-white border-2 border-slate-300 rounded-2xl p-3 shadow-md speech-bubble-left">
                        <p className="text-sm text-slate-700">
                          Great! Should I bring an umbrella?
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3 justify-end">
                      <div className="relative max-w-xs bg-blue-500 rounded-2xl p-3 shadow-md speech-bubble-right">
                        <p className="text-sm text-white">
                          No need! Clear skies all day. ☀️
                        </p>
                      </div>
                      <Bot className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                    </div>

                    <div className="flex gap-3">
                      <User className="h-6 w-6 text-slate-600 flex-shrink-0 mt-1" />
                      <div className="relative max-w-xs bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-3 shadow-md speech-bubble-left">
                        <p className="text-sm text-emerald-800">
                          Perfect, thank you! 🎉
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Compact Count Indicators */}
            <div>
              <h3 className={`mb-4 transition-colors duration-300 ${
                isDark ? 'text-blue-400' : 
                isGreen ? 'text-emerald-400' : 
                isBrand ? 'text-indigo-400' :
                'text-red-600'
              }`}>
                Compact Count Indicators
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className={`p-6 rounded-lg border transition-all duration-300 ${
                  isDark 
                    ? 'bg-slate-950/30 border-slate-600/30 backdrop-blur-lg' 
                    : 'bg-slate-50/50 border-slate-200'
                }`}>
                  <div className="flex items-center justify-between mb-4">
                    <Label className={getLabelColor()}>Navigation Menu</Label>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 rounded hover:bg-slate-100 transition-colors">
                      <span className="text-sm">Dashboard</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded hover:bg-slate-100 transition-colors">
                      <span className="text-sm">Messages</span>
                      <span className="w-5 h-5 flex items-center justify-center text-xs bg-blue-500 text-white rounded-full">
                        5
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded hover:bg-slate-100 transition-colors">
                      <span className="text-sm">Notifications</span>
                      <span className="w-5 h-5 flex items-center justify-center text-xs bg-red-500 text-white rounded-full animate-pulse">
                        3
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded hover:bg-slate-100 transition-colors">
                      <span className="text-sm">Tasks</span>
                      <span className="w-5 h-5 flex items-center justify-center text-xs bg-amber-500 text-white rounded-full">
                        12
                      </span>
                    </div>
                  </div>
                </div>

                <div className={`p-6 rounded-lg border transition-all duration-300 ${
                  isDark 
                    ? 'bg-slate-950/30 border-slate-600/30 backdrop-blur-lg' 
                    : 'bg-slate-50/50 border-slate-200'
                }`}>
                  <div className="flex items-center justify-between mb-4">
                    <Label className={getLabelColor()}>Activity Feed</Label>
                  </div>
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <div className="relative flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Mail className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white"></span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-slate-700">New email received</p>
                        <p className="text-xs text-slate-500">5 minutes ago</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="relative flex-shrink-0">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-slate-700">Task completed</p>
                        <p className="text-xs text-slate-500">1 hour ago</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="relative flex-shrink-0">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <Star className="h-4 w-4 text-purple-600" />
                        </div>
                        <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 text-xs bg-purple-500 text-white rounded-full">
                          3
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-slate-700">New favorites</p>
                        <p className="text-xs text-slate-500">2 hours ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </CardContent>
        </Card>

        {/* Paragraph Variations */}
        <Card className={getCardStyles()}>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="px-3 py-1 border-emerald-400 text-emerald-600 bg-emerald-100">
                <AlignLeft className="h-3 w-3 mr-1" />
                Text
              </Badge>
              <CardTitle className={`text-xl transition-colors duration-300 ${
                isDark ? 'text-white' : 
                isGreen ? 'text-emerald-50' : 
                isBrand ? 'text-blue-50' :
                'text-slate-800'
              }`}>
                Paragraph Variations
              </CardTitle>
            </div>
            <CardDescription className={`transition-colors duration-300 ${
              isDark ? 'text-slate-400' : 
              isGreen ? 'text-emerald-300' : 
              isBrand ? 'text-blue-300' :
              'text-slate-600'
            }`}>
              Comprehensive paragraph styling patterns for different content types and reading experiences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            
            {/* Standard Content Paragraphs */}
            <div>
              <h3 className={`mb-4 transition-colors duration-300 ${
                isDark ? 'text-blue-400' : 
                isGreen ? 'text-emerald-400' : 
                isBrand ? 'text-indigo-400' :
                'text-emerald-600'
              }`}>
                Standard Content Paragraphs
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className={`p-6 rounded-lg border transition-all duration-300 ${
                    isDark 
                      ? 'bg-slate-950/30 border-slate-600/30 backdrop-blur-lg' 
                      : 'bg-slate-50/50 border-slate-200'
                  }`}>
                    <h4 className={`mb-3 transition-colors duration-300 ${getLabelColor()}`}>Introduction Paragraph</h4>
                    <p className={`transition-colors duration-300 ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      Welcome to our comprehensive design system that showcases various typography patterns and interactive elements. This introduction paragraph demonstrates standard paragraph styling with comfortable line spacing and readable text sizing for optimal user experience across different devices and reading contexts.
                    </p>
                  </div>

                  <div className={`p-6 rounded-lg border transition-all duration-300 ${
                    isDark 
                      ? 'bg-slate-950/30 border-slate-600/30 backdrop-blur-lg' 
                      : 'bg-slate-50/50 border-slate-200'
                  }`}>
                    <h4 className={`mb-3 transition-colors duration-300 ${getLabelColor()}`}>Body Content</h4>
                    <p className={`mb-4 transition-colors duration-300 ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      This paragraph represents typical body content that might appear in articles, blog posts, or documentation. The spacing and typography are optimized for sustained reading while maintaining visual hierarchy.
                    </p>
                    <p className={`transition-colors duration-300 ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      Multiple paragraphs flow naturally with appropriate spacing between them. This creates a comfortable reading rhythm that guides users through longer content without overwhelming them.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className={`p-6 rounded-lg border transition-all duration-300 ${
                    isDark 
                      ? 'bg-slate-950/30 border-slate-600/30 backdrop-blur-lg' 
                      : 'bg-slate-50/50 border-slate-200'
                  }`}>
                    <h4 className={`mb-3 transition-colors duration-300 ${getLabelColor()}`}>Compact Paragraph</h4>
                    <p className={`text-sm leading-relaxed transition-colors duration-300 ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      Sometimes you need more compact paragraphs for dense information, captions, or supplementary content. This style uses smaller text and tighter spacing while maintaining readability.
                    </p>
                  </div>

                  <div className={`p-6 rounded-lg border transition-all duration-300 ${
                    isDark 
                      ? 'bg-slate-950/30 border-slate-600/30 backdrop-blur-lg' 
                      : 'bg-slate-50/50 border-slate-200'
                  }`}>
                    <h4 className={`mb-3 transition-colors duration-300 ${getLabelColor()}`}>Emphasized Content</h4>
                    <p className={`text-lg leading-relaxed transition-colors duration-300 ${
                      isDark ? 'text-slate-200' : 'text-slate-800'
                    }`}>
                      Important paragraphs can be emphasized through larger text size and improved contrast. This style draws attention to key information without overwhelming the overall design hierarchy.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Legal and Formal Document Styles */}
            <div>
              <h3 className={`mb-4 transition-colors duration-300 ${
                isDark ? 'text-blue-400' : 
                isGreen ? 'text-emerald-400' : 
                isBrand ? 'text-indigo-400' :
                'text-emerald-600'
              }`}>
                Legal and Formal Document Styles
              </h3>
              <div className="max-w-4xl">
                <div className={`p-8 rounded-lg border transition-all duration-300 ${
                  isDark 
                    ? 'bg-slate-950/30 border-slate-600/30 backdrop-blur-lg' 
                    : 'bg-slate-50/50 border-slate-200'
                }`}>
                  <h4 className={`mb-6 transition-colors duration-300 ${getLabelColor()}`}>Funds for Escrow Items</h4>
                  
                  <p className={`mb-6 text-justify leading-relaxed transition-colors duration-300 ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    <span className="font-medium">Funds for Escrow Items.</span> Borrower shall pay to Lender on the day Periodic Payments are due under the Note, until the Note is paid in full, a sum (the "Funds") to provide for payment of amounts due for: (a) taxes and assessments and other items which can attain priority over this Security Instrument as a mortgage, lien, or encumbrance on the Property; (b) leasehold payments or ground rents on the Property, if any; and (c) premiums for any and all insurance required by Lender under Section 5. These items are called "Escrow Items." At origination or at any time during the term of the Loan, Lender may require that Community Association Dues, Fees, and assessments, if any, be escrowed by Borrower, and such dues, fees and assessments shall be an Escrow Item.
                  </p>

                  <p className={`mb-6 text-justify leading-relaxed transition-colors duration-300 ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    Borrower shall promptly furnish to Lender all notices of amounts to be paid under this Section. Borrower shall pay Lender the Funds for Escrow Items unless Lender waives Borrower's obligation to pay the Funds for any or all Escrow Items. Lender may waive Borrower's obligation to pay to Lender Funds for any or all Escrow Items at any time. Any such waiver may only be in writing. In the event of such waiver, Borrower shall pay directly, when and where payable, the amounts due for any Escrow Items for which payment of Funds has been waived by Lender and, if Lender requires, shall furnish to Lender receipts evidencing such payment within such time period as Lender may require.
                  </p>

                  <p className={`mb-6 text-justify leading-relaxed transition-colors duration-300 ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    Lender may, at any time, collect and hold Funds in an amount (a) sufficient to permit Lender to apply the Funds, and (b) not to exceed the maximum amount a lender can require. Lender shall estimate the amount of Funds due on the basis of current data and reasonable estimates of expenditures of future Escrow Items or otherwise in accordance with Applicable Law.
                  </p>

                  <p className={`text-justify leading-relaxed transition-colors duration-300 ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    The Funds shall be held in an institution whose deposits are insured by a federal agency, instrumentality, or entity (including Lender, if Lender is an institution whose deposits are so insured) or in any Federal Home Loan Bank. Lender shall apply the Funds to pay the Escrow Items no later than the time specified. Lender shall not charge Borrower for holding and applying the Funds, annually analyzing the escrow account, or verifying the Escrow Items, unless Lender pays Borrower interest on the Funds and Applicable Law permits Lender to make such a charge.
                  </p>
                </div>
              </div>
            </div>

            {/* Specialized Content Formats */}
            <div>
              <h3 className={`mb-4 transition-colors duration-300 ${
                isDark ? 'text-blue-400' : 
                isGreen ? 'text-emerald-400' : 
                isBrand ? 'text-indigo-400' :
                'text-emerald-600'
              }`}>
                Specialized Content Formats
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                
                {/* Numbered List Paragraphs */}
                <div className={`p-6 rounded-lg border transition-all duration-300 ${
                  isDark 
                    ? 'bg-slate-950/30 border-slate-600/30 backdrop-blur-lg' 
                    : 'bg-slate-50/50 border-slate-200'
                }`}>
                  <h4 className={`mb-4 transition-colors duration-300 ${getLabelColor()}`}>Numbered Guidelines</h4>
                  <div className="space-y-4">
                    <p className={`transition-colors duration-300 ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs mr-3 ${
                        isDark ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'
                      }`}>1</span>
                      <span className="align-top">Review all documentation carefully before proceeding with any implementation. This ensures compliance with established protocols and reduces potential errors.</span>
                    </p>
                    <p className={`transition-colors duration-300 ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs mr-3 ${
                        isDark ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'
                      }`}>2</span>
                      <span className="align-top">Coordinate with all relevant stakeholders to ensure alignment on project objectives and timelines.</span>
                    </p>
                    <p className={`transition-colors duration-300 ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs mr-3 ${
                        isDark ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'
                      }`}>3</span>
                      <span className="align-top">Monitor progress regularly and adjust strategies as needed to maintain project momentum and quality standards.</span>
                    </p>
                  </div>
                </div>

                {/* Quote and Citation Style */}
                <div className={`p-6 rounded-lg border transition-all duration-300 ${
                  isDark 
                    ? 'bg-slate-950/30 border-slate-600/30 backdrop-blur-lg' 
                    : 'bg-slate-50/50 border-slate-200'
                }`}>
                  <h4 className={`mb-4 transition-colors duration-300 ${getLabelColor()}`}>Quoted Content</h4>
                  <blockquote className={`pl-4 border-l-4 italic mb-4 transition-colors duration-300 ${
                    isDark 
                      ? 'border-l-blue-400 text-slate-300 bg-blue-950/20' 
                      : 'border-l-blue-400 text-slate-600 bg-blue-50/50'
                  }`}>
                    <p className="py-2">
                      "Design is not just what it looks like and feels like. Design is how it works. Great design creates a seamless experience that users intuitively understand and enjoy using."
                    </p>
                  </blockquote>
                  <p className={`text-sm transition-colors duration-300 ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    — Attributed to design philosophy principles
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive and Status Paragraphs */}
            <div>
              <h3 className={`mb-4 transition-colors duration-300 ${
                isDark ? 'text-blue-400' : 
                isGreen ? 'text-emerald-400' : 
                isBrand ? 'text-indigo-400' :
                'text-emerald-600'
              }`}>
                Interactive and Status Content
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                
                {/* Success Message */}
                <div className={`p-4 rounded-lg border-l-4 border-l-green-400 transition-all duration-300 ${
                  isDark 
                    ? 'bg-green-950/20 border-green-500/30' 
                    : 'bg-green-50 border-green-200'
                }`}>
                  <div className="flex items-start gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <h4 className={`text-sm transition-colors duration-300 ${
                      isDark ? 'text-green-300' : 'text-green-700'
                    }`}>Success</h4>
                  </div>
                  <p className={`text-sm leading-relaxed transition-colors duration-300 ${
                    isDark ? 'text-green-200' : 'text-green-700'
                  }`}>
                    Your request has been processed successfully. All changes have been saved and will take effect immediately.
                  </p>
                </div>

                {/* Warning Message */}
                <div className={`p-4 rounded-lg border-l-4 border-l-yellow-400 transition-all duration-300 ${
                  isDark 
                    ? 'bg-yellow-950/20 border-yellow-500/30' 
                    : 'bg-yellow-50 border-yellow-200'
                }`}>
                  <div className="flex items-start gap-2 mb-2">
                    <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <h4 className={`text-sm transition-colors duration-300 ${
                      isDark ? 'text-yellow-300' : 'text-yellow-700'
                    }`}>Important Notice</h4>
                  </div>
                  <p className={`text-sm leading-relaxed transition-colors duration-300 ${
                    isDark ? 'text-yellow-200' : 'text-yellow-700'
                  }`}>
                    This action cannot be undone. Please review your selections carefully before proceeding.
                  </p>
                </div>

                {/* Info Message */}
                <div className={`p-4 rounded-lg border-l-4 border-l-blue-400 transition-all duration-300 ${
                  isDark 
                    ? 'bg-blue-950/20 border-blue-500/30' 
                    : 'bg-blue-50 border-blue-200'
                }`}>
                  <div className="flex items-start gap-2 mb-2">
                    <Bot className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <h4 className={`text-sm transition-colors duration-300 ${
                      isDark ? 'text-blue-300' : 'text-blue-700'
                    }`}>AI Assistant</h4>
                  </div>
                  <p className={`text-sm leading-relaxed transition-colors duration-300 ${
                    isDark ? 'text-blue-200' : 'text-blue-700'
                  }`}>
                    I'm analyzing your data patterns. This process may take a few moments to complete.
                  </p>
                </div>
              </div>
            </div>

            {/* Text Sizing Variations */}
            <div>
              <h3 className={`mb-4 transition-colors duration-300 ${
                isDark ? 'text-blue-400' : 
                isGreen ? 'text-emerald-400' : 
                isBrand ? 'text-indigo-400' :
                'text-emerald-600'
              }`}>
                Text Sizing and Spacing Variations
              </h3>
              <div className="space-y-6">
                
                {/* Large Header Paragraph */}
                <div className={`p-6 rounded-lg border transition-all duration-300 ${
                  isDark 
                    ? 'bg-slate-950/30 border-slate-600/30 backdrop-blur-lg' 
                    : 'bg-slate-50/50 border-slate-200'
                }`}>
                  <h4 className={`mb-3 transition-colors duration-300 ${getLabelColor()}`}>Large Display Text</h4>
                  <p className={`text-2xl leading-relaxed transition-colors duration-300 ${
                    isDark ? 'text-slate-200' : 'text-slate-800'
                  }`}>
                    This paragraph uses larger text sizing for hero sections, landing pages, or when you need to make a strong visual impact with minimal text content.
                  </p>
                </div>

                {/* Medium Content */}
                <div className={`p-6 rounded-lg border transition-all duration-300 ${
                  isDark 
                    ? 'bg-slate-950/30 border-slate-600/30 backdrop-blur-lg' 
                    : 'bg-slate-50/50 border-slate-200'
                }`}>
                  <h4 className={`mb-3 transition-colors duration-300 ${getLabelColor()}`}>Standard Reading Text</h4>
                  <p className={`text-lg leading-relaxed transition-colors duration-300 ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    This represents the optimal text size for most reading content. It provides excellent readability across devices while maintaining comfortable line spacing for extended reading sessions.
                  </p>
                </div>

                {/* Small Detail Text */}
                <div className={`p-6 rounded-lg border transition-all duration-300 ${
                  isDark 
                    ? 'bg-slate-950/30 border-slate-600/30 backdrop-blur-lg' 
                    : 'bg-slate-50/50 border-slate-200'
                }`}>
                  <h4 className={`mb-3 transition-colors duration-300 ${getLabelColor()}`}>Detail and Caption Text</h4>
                  <p className={`text-sm leading-relaxed transition-colors duration-300 ${
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    Smaller text works well for captions, metadata, footnotes, and supplementary information that supports the main content without competing for attention. This size maintains readability while clearly establishing content hierarchy.
                  </p>
                </div>

                {/* Extra Small Fine Print */}
                <div className={`p-6 rounded-lg border transition-all duration-300 ${
                  isDark 
                    ? 'bg-slate-950/30 border-slate-600/30 backdrop-blur-lg' 
                    : 'bg-slate-50/50 border-slate-200'
                }`}>
                  <h4 className={`mb-3 transition-colors duration-300 ${getLabelColor()}`}>Fine Print</h4>
                  <p className={`text-xs leading-relaxed transition-colors duration-300 ${
                    isDark ? 'text-slate-500' : 'text-slate-500'
                  }`}>
                    This extra small text size is reserved for legal disclaimers, copyright information, technical specifications, and other fine print content that needs to be present but not prominent. Use sparingly to maintain accessibility standards.
                  </p>
                </div>
              </div>
            </div>

          </CardContent>
        </Card>

        {/* Footnote Variations */}
        <Card className={getCardStyles()}>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="px-3 py-1 border-slate-400 text-slate-600 bg-slate-100">
                <AlignLeft className="h-3 w-3 mr-1" />
                Academic
              </Badge>
              <CardTitle className={`text-xl transition-colors duration-300 ${
                isDark ? 'text-white' : 
                isGreen ? 'text-emerald-50' : 
                isBrand ? 'text-blue-50' :
                'text-slate-800'
              }`}>
                Footnote Variations
              </CardTitle>
            </div>
            <CardDescription className={`transition-colors duration-300 ${
              isDark ? 'text-slate-400' : 
              isGreen ? 'text-emerald-300' : 
              isBrand ? 'text-blue-300' :
              'text-slate-600'
            }`}>
              Academic-style footnotes with superscript references and citations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Academic Paper Style */}
            <div>
              <h3 className={`mb-4 transition-colors duration-300 ${
                isDark ? 'text-blue-400' : 
                isGreen ? 'text-emerald-400' : 
                isBrand ? 'text-indigo-400' :
                'text-purple-600'
              }`}>
                Academic Paper Format
              </h3>
              <div className={`p-6 rounded-lg border transition-all duration-300 ${
                isDark 
                  ? 'bg-slate-950/30 border-slate-600/30 backdrop-blur-lg' 
                  : 'bg-white border-slate-200'
              }`}>
                {/* Main Text with Footnotes */}
                <div className="space-y-4">
                  <p className={`leading-relaxed transition-colors duration-300 ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    The development of artificial intelligence has transformed modern computing.<sup className="text-blue-600">1</sup> Recent advances in machine learning algorithms have enabled unprecedented capabilities in pattern recognition and data analysis.<sup className="text-blue-600">2</sup> These technologies continue to evolve at a rapid pace, with significant implications for various industries.<sup className="text-blue-600">3</sup>
                  </p>
                </div>

                {/* Footnote Separator */}
                <div className="my-6">
                  <Separator className="bg-slate-300" />
                </div>

                {/* Footnotes */}
                <div className="space-y-2">
                  <div className={`text-xs leading-relaxed transition-colors duration-300 ${
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    <sup className="text-blue-600 mr-1">1</sup>
                    McCarthy, J., Minsky, M. L., Rochester, N., & Shannon, C. E. (2006). A proposal for the Dartmouth summer research project on artificial intelligence. <em>AI Magazine</em>, 27(4), 12-14.
                  </div>
                  <div className={`text-xs leading-relaxed transition-colors duration-300 ${
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    <sup className="text-blue-600 mr-1">2</sup>
                    LeCun, Y., Bengio, Y., & Hinton, G. (2015). Deep learning. <em>Nature</em>, 521(7553), 436-444.
                  </div>
                  <div className={`text-xs leading-relaxed transition-colors duration-300 ${
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    <sup className="text-blue-600 mr-1">3</sup>
                    For a comprehensive review of AI applications across industries, see Russell, S., & Norvig, P. (2020). <em>Artificial Intelligence: A Modern Approach</em> (4th ed.). Pearson Education.
                  </div>
                </div>
              </div>
            </div>

            {/* Explanatory Footnotes */}
            <div>
              <h3 className={`mb-4 transition-colors duration-300 ${
                isDark ? 'text-blue-400' : 
                isGreen ? 'text-emerald-400' : 
                isBrand ? 'text-indigo-400' :
                'text-purple-600'
              }`}>
                Explanatory Notes
              </h3>
              <div className={`p-6 rounded-lg border transition-all duration-300 ${
                isDark 
                  ? 'bg-slate-950/30 border-slate-600/30 backdrop-blur-lg' 
                  : 'bg-white border-slate-200'
              }`}>
                {/* Main Text */}
                <div className="space-y-4">
                  <p className={`leading-relaxed transition-colors duration-300 ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    The study examined three primary methodologies<sup className="text-purple-600">*</sup> across multiple demographic groups<sup className="text-purple-600">†</sup> to ensure comprehensive data collection and analysis.
                  </p>
                </div>

                {/* Footnote Separator */}
                <div className="my-6">
                  <Separator className="bg-slate-300" />
                </div>

                {/* Footnotes */}
                <div className="space-y-2">
                  <div className={`text-xs leading-relaxed transition-colors duration-300 ${
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    <sup className="text-purple-600 mr-1">*</sup>
                    The three methodologies include: quantitative surveys (n=1,250), qualitative interviews (n=45), and longitudinal case studies (n=12).
                  </div>
                  <div className={`text-xs leading-relaxed transition-colors duration-300 ${
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    <sup className="text-purple-600 mr-1">†</sup>
                    Demographic groups were categorized by age (18-34, 35-54, 55+), education level, and geographic region to ensure representative sampling.
                  </div>
                </div>
              </div>
            </div>

            {/* Multiple Reference Styles */}
            <div>
              <h3 className={`mb-4 transition-colors duration-300 ${
                isDark ? 'text-blue-400' : 
                isGreen ? 'text-emerald-400' : 
                isBrand ? 'text-indigo-400' :
                'text-purple-600'
              }`}>
                Mixed Notation Styles
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {/* Numbered Style */}
                <div className={`p-4 rounded-lg border transition-all duration-300 ${
                  isDark 
                    ? 'bg-slate-950/30 border-slate-600/30 backdrop-blur-lg' 
                    : 'bg-white border-slate-200'
                }`}>
                  <Label className={`${getLabelColor()} mb-2 block`}>Numbered References</Label>
                  <p className={`text-sm leading-relaxed mb-3 transition-colors duration-300 ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    Research findings<sup className="text-blue-600">1</sup> indicate significant correlation.
                  </p>
                  <Separator className="my-3 bg-slate-300" />
                  <p className={`text-xs transition-colors duration-300 ${
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    <sup className="text-blue-600 mr-1">1</sup>Smith et al., 2023
                  </p>
                </div>

                {/* Symbolic Style */}
                <div className={`p-4 rounded-lg border transition-all duration-300 ${
                  isDark 
                    ? 'bg-slate-950/30 border-slate-600/30 backdrop-blur-lg' 
                    : 'bg-white border-slate-200'
                }`}>
                  <Label className={`${getLabelColor()} mb-2 block`}>Symbolic References</Label>
                  <p className={`text-sm leading-relaxed mb-3 transition-colors duration-300 ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    Statistical significance<sup className="text-green-600">*</sup> was achieved at p&lt;0.05.
                  </p>
                  <Separator className="my-3 bg-slate-300" />
                  <p className={`text-xs transition-colors duration-300 ${
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    <sup className="text-green-600 mr-1">*</sup>Two-tailed t-test, n=847
                  </p>
                </div>

                {/* Alphabetic Style */}
                <div className={`p-4 rounded-lg border transition-all duration-300 ${
                  isDark 
                    ? 'bg-slate-950/30 border-slate-600/30 backdrop-blur-lg' 
                    : 'bg-white border-slate-200'
                }`}>
                  <Label className={`${getLabelColor()} mb-2 block`}>Alphabetic References</Label>
                  <p className={`text-sm leading-relaxed mb-3 transition-colors duration-300 ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    Multiple studies<sup className="text-purple-600">a,b</sup> support this conclusion.
                  </p>
                  <Separator className="my-3 bg-slate-300" />
                  <div className="space-y-1">
                    <p className={`text-xs transition-colors duration-300 ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      <sup className="text-purple-600 mr-1">a</sup>Johnson, 2022
                    </p>
                    <p className={`text-xs transition-colors duration-300 ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      <sup className="text-purple-600 mr-1">b</sup>Williams, 2023
                    </p>
                  </div>
                </div>

                {/* Dagger Style */}
                <div className={`p-4 rounded-lg border transition-all duration-300 ${
                  isDark 
                    ? 'bg-slate-950/30 border-slate-600/30 backdrop-blur-lg' 
                    : 'bg-white border-slate-200'
                }`}>
                  <Label className={`${getLabelColor()} mb-2 block`}>Dagger Notation</Label>
                  <p className={`text-sm leading-relaxed mb-3 transition-colors duration-300 ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    Data collection<sup className="text-orange-600">†</sup> spanned 18 months.
                  </p>
                  <Separator className="my-3 bg-slate-300" />
                  <p className={`text-xs transition-colors duration-300 ${
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    <sup className="text-orange-600 mr-1">†</sup>Jan 2023 - Jun 2024
                  </p>
                </div>
              </div>
            </div>

            {/* Legal and Disclaimer Footnotes */}
            <div>
              <h3 className={`mb-4 transition-colors duration-300 ${
                isDark ? 'text-blue-400' : 
                isGreen ? 'text-emerald-400' : 
                isBrand ? 'text-indigo-400' :
                'text-purple-600'
              }`}>
                Legal and Disclaimer Format
              </h3>
              <div className={`p-6 rounded-lg border transition-all duration-300 ${
                isDark 
                  ? 'bg-slate-950/30 border-slate-600/30 backdrop-blur-lg' 
                  : 'bg-white border-slate-200'
              }`}>
                <p className={`leading-relaxed transition-colors duration-300 ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  Investment returns are subject to market conditions and individual performance may vary.<sup className="text-red-600">1</sup> Past performance does not guarantee future results.<sup className="text-red-600">2</sup>
                </p>

                <div className="mt-6 pt-4 border-t border-slate-300">
                  <div className="space-y-2">
                    <p className={`text-xs leading-relaxed transition-colors duration-300 ${
                      isDark ? 'text-slate-500' : 'text-slate-500'
                    }`}>
                      <sup className="text-red-600 mr-1">1</sup>
                      Returns are calculated based on net asset value and include reinvested dividends. Individual results may vary based on timing of investment, fees, and market conditions. Consult a financial advisor for personalized guidance.
                    </p>
                    <p className={`text-xs leading-relaxed transition-colors duration-300 ${
                      isDark ? 'text-slate-500' : 'text-slate-500'
                    }`}>
                      <sup className="text-red-600 mr-1">2</sup>
                      Historical performance data is provided for illustrative purposes only and should not be considered as indicative of future performance. All investments carry risk, including potential loss of principal.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}