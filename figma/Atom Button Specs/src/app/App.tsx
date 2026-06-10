import { useState } from "react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Textarea } from "./components/ui/textarea";
import { Checkbox } from "./components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import { 
  Calendar, 
  Clock, 
  Download, 
  Save, 
  Trash2, 
  Edit, 
  Share, 
  Heart, 
  Star, 
  ThumbsUp, 
  MessageSquare, 
  Send, 
  Check, 
  X, 
  ArrowRight, 
  Plus, 
  Settings, 
  Search, 
  Filter, 
  MoreHorizontal,
  Zap,
  Rocket,
  Coffee,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  FileText,
  RotateCw,
  FilePlus
} from "lucide-react";

export default function App() {
  const [selectedTheme, setSelectedTheme] = useState("Dark");
  
  // Button states
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [selectedFilters, setSelectedFilters] = useState(new Set(['recent']));
  const [aiResponse, setAiResponse] = useState("");
  const [currentPage, setCurrentPage] = useState(3);
  const totalPages = 10;
  
  // Rename states
  const [renamingItem, setRenamingItem] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [labelNames, setLabelNames] = useState({
    document: "Document Actions",
    project: "Favorite Projects",
    template: "Template Settings"
  });

  const toggleLike = (postId: string) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const toggleFilter = (filterId: string) => {
    setSelectedFilters(prev => {
      const newSet = new Set(prev);
      if (newSet.has(filterId)) {
        newSet.delete(filterId);
      } else {
        newSet.add(filterId);
      }
      return newSet;
    });
  };

  const themes = [
    {
      name: "Default",
      variant: "outline" as const,
      bgClass: "bg-gradient-to-br from-slate-50 to-slate-100",
    },
    {
      name: "Standard",
      variant: "default" as const,
      bgClass: "bg-gradient-to-br from-blue-50 to-indigo-100",
    },
    {
      name: "Dark",
      variant: "secondary" as const,
      bgClass:
        "bg-gradient-to-br from-black via-slate-950 to-black",
    },
    {
      name: "Green",
      variant: "outline" as const,
      bgClass: "bg-emerald-800",
    },
    {
      name: "Plain",
      variant: "ghost" as const,
      bgClass: "bg-gray-50",
    },
    {
      name: "Brand",
      variant: "outline" as const,
      bgClass: "bg-gradient-to-br from-purple-50 to-pink-100",
    },
  ];

  const isDark = selectedTheme === "Dark";
  const isGreen = selectedTheme === "Green";
  const isBrand = selectedTheme === "Brand";
  const currentTheme = themes.find(
    (t) => t.name === selectedTheme,
  );

  // Glass input styles for dark, green, and brand themes
  const getInputStyles = (additionalClasses = "") => {
    if (isDark) {
      return `transition-all duration-300 ${additionalClasses} bg-slate-950/40 border-slate-600/40 text-white placeholder:text-slate-400 focus:border-blue-400/60 focus:ring-blue-400/20 focus:ring-offset-0 backdrop-blur-lg shadow-lg shadow-black/20`;
    } else if (isGreen) {
      return `transition-all duration-300 ${additionalClasses} bg-emerald-950/60 border-emerald-600/40 text-emerald-50 placeholder:text-emerald-300 focus:border-emerald-400/80 focus:ring-emerald-400/30 focus:ring-offset-0 backdrop-blur-lg shadow-lg shadow-emerald-900/40`;
    } else if (isBrand) {
      return `transition-all duration-300 ${additionalClasses} bg-blue-950/60 border-blue-600/40 text-blue-50 placeholder:text-blue-300 focus:border-blue-400/80 focus:ring-blue-400/30 focus:ring-offset-0 backdrop-blur-lg shadow-lg shadow-blue-900/40`;
    } else {
      return `transition-all duration-300 ${additionalClasses} bg-white/80 border-slate-200 focus:border-blue-400 focus:ring-blue-400/20`;
    }
  };

  const getCardStyles = () => {
    if (isDark) {
      return `border-0 backdrop-blur-xl transition-all duration-300 bg-slate-950/20 border-slate-700/30 shadow-[0_0_50px_-12px_rgba(148,163,184,0.4),0_0_0_1px_rgba(59,130,246,0.05),0_0_20px_rgba(148,163,184,0.3)]`;
    } else if (isGreen) {
      return `border-0 backdrop-blur-xl transition-all duration-300 bg-emerald-950/30 border-emerald-600/30 shadow-[0_0_50px_-12px_rgba(16,185,129,0.5),0_0_0_1px_rgba(52,211,153,0.1),0_0_25px_rgba(6,78,59,0.6)]`;
    } else if (isBrand) {
      return `border-0 backdrop-blur-xl transition-all duration-300 bg-blue-950/30 border-blue-600/30 shadow-[0_0_50px_-12px_rgba(29,78,216,0.5),0_0_0_1px_rgba(59,130,246,0.1),0_0_25px_rgba(30,58,138,0.6)]`;
    } else {
      return `border-0 backdrop-blur-xl transition-all duration-300 bg-white/70 shadow-2xl`;
    }
  };

  return (
    <div
      className={`min-h-screen p-6 transition-all duration-500 ${currentTheme?.bgClass || themes[0].bgClass} ${isDark ? "dark" : ""}`}
    >
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="space-y-2">
            <h1
              className={`text-4xl tracking-tight transition-colors duration-300 ${
                isDark
                  ? "text-white drop-shadow-lg"
                  : isGreen
                    ? "text-emerald-50 drop-shadow-lg"
                    : isBrand
                      ? "text-blue-50 drop-shadow-lg"
                      : "text-slate-900"
              }`}
            >
              Atom Button
            </h1>
            <h2
              className={`text-2xl transition-colors duration-300 ${
                isDark
                  ? "text-slate-300"
                  : isGreen
                    ? "text-emerald-200"
                    : isBrand
                      ? "text-blue-300"
                      : "text-slate-600"
              }`}
            >
              finAtomButton: Design Specifications for LWC
              Component
            </h2>
          </div>
          <p
            className={`text-lg max-w-3xl mx-auto transition-colors duration-300 ${
              isDark
                ? "text-slate-300"
                : isGreen
                  ? "text-emerald-200"
                  : isBrand
                    ? "text-blue-300"
                    : "text-slate-600"
            }`}
          >
            A comprehensive showcase of modern button
            patterns with various styles, groupings, AI chat responses,
            and enhanced interactive experiences.
          </p>
        </div>



        {/* CSS Properties Specifications for All Themes */}
        {selectedTheme === "Default" && (
          <Card className={getCardStyles()}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className="px-3 py-1"
                >
                  CSS
                </Badge>
                <CardTitle className="text-xl text-slate-800">
                  Default Theme - Key CSS Properties
                </CardTitle>
              </div>
              <CardDescription className="text-slate-600">
                Vanilla CSS properties used in the Default theme
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg text-slate-700 border-b border-slate-200 pb-2">
                    Background Colors
                  </h3>
                  <div className="space-y-3 font-mono text-sm">
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <div className="text-slate-600 mb-1">
                        /* Page Background */
                      </div>
                      <div className="text-slate-800">
                        background: linear-gradient(to bottom
                        right, #f8fafc, #e2e8f0);
                      </div>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <div className="text-slate-600 mb-1">
                        /* Glass Card Background */
                      </div>
                      <div className="text-slate-800">
                        background: rgba(255, 255, 255, 0.7);
                      </div>
                      <div className="text-slate-800">
                        backdrop-filter: blur(24px);
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg text-slate-700 border-b border-slate-200 pb-2">
                    Typography
                  </h3>
                  <div className="space-y-3 font-mono text-sm">
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <div className="text-slate-600 mb-1">
                        /* Primary Text */
                      </div>
                      <div className="text-slate-800">
                        color: #0f172a;
                      </div>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <div className="text-slate-600 mb-1">
                        /* Input Focus */
                      </div>
                      <div className="text-slate-800">
                        border-color: #3b82f6;
                      </div>
                      <div className="text-slate-800">
                        box-shadow: 0 0 0 3px rgba(59, 130, 246,
                        0.2);
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {selectedTheme === "Standard" && (
          <Card className={getCardStyles()}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Badge variant="default" className="px-3 py-1">
                  CSS
                </Badge>
                <CardTitle className="text-xl text-slate-800">
                  Standard Theme - Key CSS Properties
                </CardTitle>
              </div>
              <CardDescription className="text-slate-600">
                Vanilla CSS properties used in the Standard
                theme
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg text-blue-600 border-b border-blue-200 pb-2">
                    Background Colors
                  </h3>
                  <div className="space-y-3 font-mono text-sm">
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <div className="text-blue-600 mb-1">
                        /* Page Background */
                      </div>
                      <div className="text-slate-800">
                        background: linear-gradient(to bottom
                        right, #dbeafe, #e0e7ff);
                      </div>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <div className="text-blue-600 mb-1">
                        /* Glass Card Background */
                      </div>
                      <div className="text-slate-800">
                        background: rgba(255, 255, 255, 0.7);
                      </div>
                      <div className="text-slate-800">
                        backdrop-filter: blur(24px);
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg text-blue-600 border-b border-blue-200 pb-2">
                    Typography & Focus
                  </h3>
                  <div className="space-y-3 font-mono text-sm">
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <div className="text-blue-600 mb-1">
                        /* Primary Text */
                      </div>
                      <div className="text-slate-800">
                        color: #0f172a;
                      </div>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <div className="text-blue-600 mb-1">
                        /* Input Focus */
                      </div>
                      <div className="text-slate-800">
                        border-color: #3b82f6;
                      </div>
                      <div className="text-slate-800">
                        box-shadow: 0 0 0 3px rgba(59, 130, 246,
                        0.2);
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {isGreen && (
          <Card className={getCardStyles()}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="px-3 py-1 border-emerald-500/60 text-emerald-300 bg-emerald-600/20 backdrop-blur-sm"
                >
                  CSS
                </Badge>
                <CardTitle className="text-xl text-emerald-50">
                  Green Glass Theme - Key CSS Properties
                </CardTitle>
              </div>
              <CardDescription className="text-emerald-300">
                Vanilla CSS properties used in the enhanced
                Green Glass theme
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Background Colors */}
                <div className="space-y-4">
                  <h3 className="text-lg text-emerald-400 border-b border-emerald-700/50 pb-2">
                    Background Colors
                  </h3>
                  <div className="space-y-3 font-mono text-sm">
                    <div className="bg-emerald-950/80 p-3 rounded-lg border border-emerald-700/40 backdrop-blur-sm shadow-inner">
                      <div className="text-emerald-300 mb-1">
                        /* Page Background */
                      </div>
                      <div className="text-emerald-50">
                        background: #065f46;
                      </div>
                    </div>
                    <div className="bg-emerald-950/80 p-3 rounded-lg border border-emerald-700/40 backdrop-blur-sm shadow-inner">
                      <div className="text-emerald-300 mb-1">
                        /* Glass Card Background */
                      </div>
                      <div className="text-emerald-50">
                        background: rgba(6, 78, 59, 0.3);
                      </div>
                      <div className="text-emerald-50">
                        backdrop-filter: blur(24px);
                      </div>
                      <div className="text-emerald-50">
                        box-shadow: 0 0 0 1px rgba(52, 211, 153,
                        0.1);
                      </div>
                    </div>
                    <div className="bg-emerald-950/80 p-3 rounded-lg border border-emerald-700/40 backdrop-blur-sm shadow-inner">
                      <div className="text-emerald-300 mb-1">
                        /* Glass Input Background */
                      </div>
                      <div className="text-emerald-50">
                        background: rgba(6, 78, 59, 0.6);
                      </div>
                      <div className="text-emerald-50">
                        backdrop-filter: blur(16px);
                      </div>
                    </div>
                  </div>
                </div>

                {/* Typography */}
                <div className="space-y-4">
                  <h3 className="text-lg text-emerald-400 border-b border-emerald-700/50 pb-2">
                    Typography
                  </h3>
                  <div className="space-y-3 font-mono text-sm">
                    <div className="bg-emerald-950/80 p-3 rounded-lg border border-emerald-700/40 backdrop-blur-sm shadow-inner">
                      <div className="text-emerald-300 mb-1">
                        /* Font Family */
                      </div>
                      <div className="text-emerald-50">
                        font-family: -apple-system,
                        BlinkMacSystemFont,
                      </div>
                      <div className="text-emerald-50">
                        {" "}
                        'Segoe UI', Roboto, sans-serif;
                      </div>
                    </div>
                    <div className="bg-emerald-950/80 p-3 rounded-lg border border-emerald-700/40 backdrop-blur-sm shadow-inner">
                      <div className="text-emerald-300 mb-1">
                        /* Primary Text */
                      </div>
                      <div className="text-emerald-50">
                        color: #ecfdf5;
                      </div>
                      <div className="text-emerald-50">
                        text-shadow: 0 0 20px rgba(16, 185, 129,
                        0.1);
                      </div>
                    </div>
                    <div className="bg-emerald-950/80 p-3 rounded-lg border border-emerald-700/40 backdrop-blur-sm shadow-inner">
                      <div className="text-emerald-300 mb-1">
                        /* Label Text */
                      </div>
                      <div className="text-emerald-50">
                        color: #a7f3d0;
                      </div>
                    </div>
                    <div className="bg-emerald-950/80 p-3 rounded-lg border border-emerald-700/40 backdrop-blur-sm shadow-inner">
                      <div className="text-emerald-300 mb-1">
                        /* Muted Text */
                      </div>
                      <div className="text-emerald-50">
                        color: #6ee7b7;
                      </div>
                    </div>
                  </div>
                </div>

                {/* Borders & Shadows */}
                <div className="space-y-4">
                  <h3 className="text-lg text-emerald-400 border-b border-emerald-700/50 pb-2">
                    Glass Effects
                  </h3>
                  <div className="space-y-3 font-mono text-sm">
                    <div className="bg-emerald-950/80 p-3 rounded-lg border border-emerald-700/40 backdrop-blur-sm shadow-inner">
                      <div className="text-emerald-300 mb-1">
                        /* Glass Border */
                      </div>
                      <div className="text-emerald-50">
                        border: 1px solid rgba(5, 150, 105,
                        0.3);
                      </div>
                    </div>
                    <div className="bg-emerald-950/80 p-3 rounded-lg border border-emerald-700/40 backdrop-blur-sm shadow-inner">
                      <div className="text-emerald-300 mb-1">
                        /* Emerald Glow Shadow */
                      </div>
                      <div className="text-emerald-50">
                        box-shadow: 0 0 50px -12px rgba(16, 185,
                        129, 0.5),
                      </div>
                      <div className="text-emerald-50">
                        {" "}
                        0 0 0 1px rgba(52, 211, 153, 0.1),
                      </div>
                      <div className="text-emerald-50">
                        {" "}
                        0 0 25px rgba(6, 78, 59, 0.6);
                      </div>
                    </div>
                  </div>
                </div>

                {/* Focus & Interactive States */}
                <div className="space-y-4">
                  <h3 className="text-lg text-emerald-400 border-b border-emerald-700/50 pb-2">
                    Focus & Interactive
                  </h3>
                  <div className="space-y-3 font-mono text-sm">
                    <div className="bg-emerald-950/80 p-3 rounded-lg border border-emerald-700/40 backdrop-blur-sm shadow-inner">
                      <div className="text-emerald-300 mb-1">
                        /* Focus Glow */
                      </div>
                      <div className="text-emerald-50">
                        border-color: rgba(52, 211, 153, 0.8);
                      </div>
                      <div className="text-emerald-50">
                        box-shadow: 0 0 0 3px rgba(52, 211, 153,
                        0.3),
                      </div>
                      <div className="text-emerald-50">
                        {" "}
                        0 0 20px rgba(16, 185, 129, 0.2);
                      </div>
                    </div>
                    <div className="bg-emerald-950/80 p-3 rounded-lg border border-emerald-700/40 backdrop-blur-sm shadow-inner">
                      <div className="text-emerald-300 mb-1">
                        /* Glass Transitions */
                      </div>
                      <div className="text-emerald-50">
                        transition: all 0.3s cubic-bezier(0.4,
                        0, 0.2, 1);
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {selectedTheme === "Plain" && (
          <Card className={getCardStyles()}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Badge variant="ghost" className="px-3 py-1">
                  CSS
                </Badge>
                <CardTitle className="text-xl text-slate-800">
                  Plain Theme - Key CSS Properties
                </CardTitle>
              </div>
              <CardDescription className="text-slate-600">
                Vanilla CSS properties used in the Plain theme
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg text-gray-600 border-b border-gray-200 pb-2">
                    Background Colors
                  </h3>
                  <div className="space-y-3 font-mono text-sm">
                    <div className="bg-gray-100 p-3 rounded-lg border border-gray-200">
                      <div className="text-gray-600 mb-1">
                        /* Page Background */
                      </div>
                      <div className="text-slate-800">
                        background: #f9fafb;
                      </div>
                    </div>
                    <div className="bg-gray-100 p-3 rounded-lg border border-gray-200">
                      <div className="text-gray-600 mb-1">
                        /* Card Background */
                      </div>
                      <div className="text-slate-800">
                        background: rgba(255, 255, 255, 0.7);
                      </div>
                      <div className="text-slate-800">
                        backdrop-filter: blur(24px);
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg text-gray-600 border-b border-gray-200 pb-2">
                    Typography & Focus
                  </h3>
                  <div className="space-y-3 font-mono text-sm">
                    <div className="bg-gray-100 p-3 rounded-lg border border-gray-200">
                      <div className="text-gray-600 mb-1">
                        /* Primary Text */
                      </div>
                      <div className="text-slate-800">
                        color: #111827;
                      </div>
                    </div>
                    <div className="bg-gray-100 p-3 rounded-lg border border-gray-200">
                      <div className="text-gray-600 mb-1">
                        /* Minimal Styling */
                      </div>
                      <div className="text-slate-800">
                        border: 1px solid #d1d5db;
                      </div>
                      <div className="text-slate-800">
                        focus: border-color: #3b82f6;
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {isBrand && (
          <Card className={getCardStyles()}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="px-3 py-1 border-blue-500/60 text-blue-300 bg-blue-600/20 backdrop-blur-sm"
                >
                  CSS
                </Badge>
                <CardTitle className="text-xl text-blue-50">
                  Brand Theme - Key CSS Properties
                </CardTitle>
              </div>
              <CardDescription className="text-blue-300">
                Vanilla CSS properties used in the Brand theme
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Background Colors */}
                <div className="space-y-4">
                  <h3 className="text-lg text-blue-400 border-b border-blue-700/50 pb-2">
                    Background Colors
                  </h3>
                  <div className="space-y-3 font-mono text-sm">
                    <div className="bg-blue-950/80 p-3 rounded-lg border border-blue-700/40 backdrop-blur-sm shadow-inner">
                      <div className="text-blue-300 mb-1">
                        /* Page Background */
                      </div>
                      <div className="text-blue-50">
                        background: linear-gradient(to bottom
                        right, #faf5ff, #fdf2f8);
                      </div>
                    </div>
                    <div className="bg-blue-950/80 p-3 rounded-lg border border-blue-700/40 backdrop-blur-sm shadow-inner">
                      <div className="text-blue-300 mb-1">
                        /* Glass Card Background */
                      </div>
                      <div className="text-blue-50">
                        background: rgba(30, 58, 138, 0.3);
                      </div>
                      <div className="text-blue-50">
                        backdrop-filter: blur(24px);
                      </div>
                      <div className="text-blue-50">
                        box-shadow: 0 0 0 1px rgba(59, 130, 246,
                        0.1);
                      </div>
                    </div>
                    <div className="bg-blue-950/80 p-3 rounded-lg border border-blue-700/40 backdrop-blur-sm shadow-inner">
                      <div className="text-blue-300 mb-1">
                        /* Glass Input Background */
                      </div>
                      <div className="text-blue-50">
                        background: rgba(30, 58, 138, 0.6);
                      </div>
                      <div className="text-blue-50">
                        backdrop-filter: blur(16px);
                      </div>
                    </div>
                  </div>
                </div>

                {/* Typography */}
                <div className="space-y-4">
                  <h3 className="text-lg text-blue-400 border-b border-blue-700/50 pb-2">
                    Typography
                  </h3>
                  <div className="space-y-3 font-mono text-sm">
                    <div className="bg-blue-950/80 p-3 rounded-lg border border-blue-700/40 backdrop-blur-sm shadow-inner">
                      <div className="text-blue-300 mb-1">
                        /* Font Family */
                      </div>
                      <div className="text-blue-50">
                        font-family: -apple-system,
                        BlinkMacSystemFont,
                      </div>
                      <div className="text-blue-50">
                        {" "}
                        'Segoe UI', Roboto, sans-serif;
                      </div>
                    </div>
                    <div className="bg-blue-950/80 p-3 rounded-lg border border-blue-700/40 backdrop-blur-sm shadow-inner">
                      <div className="text-blue-300 mb-1">
                        /* Primary Text */
                      </div>
                      <div className="text-blue-50">
                        color: #eff6ff;
                      </div>
                      <div className="text-blue-50">
                        text-shadow: 0 0 20px rgba(29, 78, 216,
                        0.1);
                      </div>
                    </div>
                    <div className="bg-blue-950/80 p-3 rounded-lg border border-blue-700/40 backdrop-blur-sm shadow-inner">
                      <div className="text-blue-300 mb-1">
                        /* Label Text */
                      </div>
                      <div className="text-blue-50">
                        color: #a5b4fc;
                      </div>
                    </div>
                    <div className="bg-blue-950/80 p-3 rounded-lg border border-blue-700/40 backdrop-blur-sm shadow-inner">
                      <div className="text-blue-300 mb-1">
                        /* Muted Text */
                      </div>
                      <div className="text-blue-50">
                        color: #93c5fd;
                      </div>
                    </div>
                  </div>
                </div>

                {/* Borders & Shadows */}
                <div className="space-y-4">
                  <h3 className="text-lg text-blue-400 border-b border-blue-700/50 pb-2">
                    Glass Effects
                  </h3>
                  <div className="space-y-3 font-mono text-sm">
                    <div className="bg-blue-950/80 p-3 rounded-lg border border-blue-700/40 backdrop-blur-sm shadow-inner">
                      <div className="text-blue-300 mb-1">
                        /* Glass Border */
                      </div>
                      <div className="text-blue-50">
                        border: 1px solid rgba(37, 99, 235,
                        0.3);
                      </div>
                    </div>
                    <div className="bg-blue-950/80 p-3 rounded-lg border border-blue-700/40 backdrop-blur-sm shadow-inner">
                      <div className="text-blue-300 mb-1">
                        /* Blue Glow Shadow */
                      </div>
                      <div className="text-blue-50">
                        box-shadow: 0 0 50px -12px rgba(29, 78,
                        216, 0.5),
                      </div>
                      <div className="text-blue-50">
                        {" "}
                        0 0 0 1px rgba(59, 130, 246, 0.1),
                      </div>
                      <div className="text-blue-50">
                        {" "}
                        0 0 25px rgba(30, 58, 138, 0.6);
                      </div>
                    </div>
                  </div>
                </div>

                {/* Focus & Interactive States */}
                <div className="space-y-4">
                  <h3 className="text-lg text-blue-400 border-b border-blue-700/50 pb-2">
                    Focus & Interactive
                  </h3>
                  <div className="space-y-3 font-mono text-sm">
                    <div className="bg-blue-950/80 p-3 rounded-lg border border-blue-700/40 backdrop-blur-sm shadow-inner">
                      <div className="text-blue-300 mb-1">
                        /* Focus Glow */
                      </div>
                      <div className="text-blue-50">
                        border-color: rgba(59, 130, 246, 0.8);
                      </div>
                      <div className="text-blue-50">
                        box-shadow: 0 0 0 3px rgba(59, 130, 246,
                        0.3),
                      </div>
                      <div className="text-blue-50">
                        {" "}
                        0 0 20px rgba(29, 78, 216, 0.2);
                      </div>
                    </div>
                    <div className="bg-blue-950/80 p-3 rounded-lg border border-blue-700/40 backdrop-blur-sm shadow-inner">
                      <div className="text-blue-300 mb-1">
                        /* Glass Transitions */
                      </div>
                      <div className="text-blue-50">
                        transition: all 0.3s cubic-bezier(0.4,
                        0, 0.2, 1);
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Single Buttons with Icons */}
          <Card className={getCardStyles()}>
            <CardHeader>
              <CardTitle
                className={`text-xl transition-colors duration-300 ${
                  isDark
                    ? "text-white"
                    : isGreen
                      ? "text-emerald-50"
                      : isBrand
                        ? "text-blue-50"
                        : "text-slate-800"
                }`}
              >
                Single Buttons with Icons & Emojis
              </CardTitle>
              <CardDescription
                className={`transition-colors duration-300 ${
                  isDark
                    ? "text-slate-400"
                    : isGreen
                      ? "text-emerald-300"
                      : isBrand
                        ? "text-blue-300"
                        : "text-slate-600"
                }`}
              >
                Various button styles with icons, emojis, and different variants
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-3">
                <Button 
                  variant="default" 
                  className={`transition-all duration-200 hover:scale-105 ${
                    isDark 
                      ? 'bg-blue-600/80 hover:bg-blue-700/80 text-white border-blue-600/60 backdrop-blur-lg shadow-lg shadow-blue-500/20' 
                      : isGreen
                        ? 'bg-emerald-600/80 hover:bg-emerald-700/80 text-emerald-50 border-emerald-600/60 backdrop-blur-lg shadow-lg shadow-emerald-500/30'
                        : isBrand
                          ? 'bg-blue-600/80 hover:bg-blue-700/80 text-blue-50 border-blue-600/60 backdrop-blur-lg shadow-lg shadow-blue-500/30'
                          : ''
                  }`}
                >
                  <Save className="w-4 h-4 mr-2" />
                  💾 Save Changes
                </Button>
                
                <Button 
                  variant="destructive"
                  className="transition-all duration-200 hover:scale-105"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  🗑️ Delete
                </Button>
                
                <Button 
                  variant="outline"
                  className={`transition-all duration-200 hover:scale-105 ${
                    isDark 
                      ? 'border-slate-600/50 text-slate-300 hover:bg-slate-800/50 hover:text-white backdrop-blur-lg' 
                      : isGreen
                        ? 'border-emerald-600/50 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800'
                        : isBrand
                          ? 'border-blue-600/50 text-blue-700 hover:bg-blue-50 hover:text-blue-800'
                          : ''
                  }`}
                >
                  📤 Share
                  <Share className="w-4 h-4 ml-2" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button 
                  variant="secondary" 
                  size="sm"
                  className="transition-all duration-200 hover:scale-105"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="transition-all duration-200 hover:scale-105"
                >
                  ⚙️ Settings
                </Button>
                
                <Button 
                  variant="link" 
                  size="sm"
                  className="transition-all duration-200"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit Profile
                </Button>
              </div>

              <div className="flex gap-3">
                <Button 
                  variant="default" 
                  size="lg"
                  className={`transition-all duration-200 hover:scale-105 ${
                    isDark 
                      ? 'bg-blue-600/80 hover:bg-blue-700/80 text-white border-blue-600/60 backdrop-blur-lg shadow-lg shadow-blue-500/20' 
                      : isGreen
                        ? 'bg-emerald-600/80 hover:bg-emerald-700/80 text-emerald-50 border-emerald-600/60 backdrop-blur-lg shadow-lg shadow-emerald-500/30'
                        : isBrand
                          ? 'bg-blue-600/80 hover:bg-blue-700/80 text-blue-50 border-blue-600/60 backdrop-blur-lg shadow-lg shadow-blue-500/30'
                          : ''
                  }`}
                >
                  🚀 Deploy Now
                  <Rocket className="w-5 h-5 ml-2" />
                </Button>
              </div>

              {/* Icon-only buttons */}
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="transition-all duration-200 hover:scale-110"
                  onClick={() => toggleLike('post1')}
                >
                  <Heart className={`w-4 h-4 ${likedPosts.has('post1') ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="transition-all duration-200 hover:scale-110"
                >
                  <Star className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="transition-all duration-200 hover:scale-110"
                >
                  <MessageSquare className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="transition-all duration-200 hover:scale-110"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* AI Chat Response Buttons */}
          <Card className={getCardStyles()}>
            <CardHeader>
              <CardTitle
                className={`text-xl transition-colors duration-300 ${
                  isDark
                    ? "text-white"
                    : isGreen
                      ? "text-emerald-50"
                      : isBrand
                        ? "text-blue-50"
                        : "text-slate-800"
                }`}
              >
                AI Chat Response Buttons
              </CardTitle>
              <CardDescription
                className={`transition-colors duration-300 ${
                  isDark
                    ? "text-slate-400"
                    : isGreen
                      ? "text-emerald-300"
                      : isBrand
                        ? "text-blue-300"
                        : "text-slate-600"
                }`}
              >
                Interactive buttons that appear below AI chat messages for user feedback
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* AI Message Example */}
              <div className={`p-4 rounded-lg border transition-colors duration-300 ${
                isDark 
                  ? 'bg-slate-950/30 border-slate-600/30 backdrop-blur-lg' 
                  : isGreen
                    ? 'bg-emerald-950/40 border-emerald-600/30 backdrop-blur-lg'
                    : isBrand
                      ? 'bg-blue-950/40 border-blue-600/30 backdrop-blur-lg'
                      : 'bg-slate-50/50 border-slate-200'
              }`}>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isDark ? 'bg-blue-500/20 text-blue-400' : isGreen ? 'bg-emerald-500/20 text-emerald-600' : isBrand ? 'bg-blue-500/20 text-blue-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      🤖
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm leading-relaxed ${
                        isDark ? 'text-slate-300' : isGreen ? 'text-emerald-200' : isBrand ? 'text-blue-200' : 'text-slate-700'
                      }`}>
                        I can help you create a comprehensive project plan. Based on your requirements, I recommend starting with a requirements analysis phase, followed by system design and implementation. Would you like me to break this down into specific actionable steps?
                      </p>
                    </div>
                  </div>
                  
                  {/* AI Response Buttons */}
                  <div className="flex flex-wrap gap-2 mt-4 pl-11">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className={`text-xs transition-all duration-200 hover:scale-105 ${
                        isDark 
                          ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50' 
                          : isGreen
                            ? 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50'
                            : isBrand
                              ? 'text-blue-600 hover:text-blue-700 hover:bg-blue-50'
                              : 'text-slate-600 hover:text-slate-700'
                      }`}
                      onClick={() => setAiResponse("helpful")}
                    >
                      <ThumbsUp className="w-3 h-3 mr-1" />
                      This was helpful
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className={`text-xs transition-all duration-200 hover:scale-105 ${
                        isDark 
                          ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50' 
                          : isGreen
                            ? 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50'
                            : isBrand
                              ? 'text-blue-600 hover:text-blue-700 hover:bg-blue-50'
                              : 'text-slate-600 hover:text-slate-700'
                      }`}
                      onClick={() => setAiResponse("more")}
                    >
                      Tell me more
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className={`text-xs transition-all duration-200 hover:scale-105 ${
                        isDark 
                          ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50' 
                          : isGreen
                            ? 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50'
                            : isBrand
                              ? 'text-blue-600 hover:text-blue-700 hover:bg-blue-50'
                              : 'text-slate-600 hover:text-slate-700'
                      }`}
                      onClick={() => setAiResponse("different")}
                    >
                      Try a different approach
                    </Button>
                  </div>
                </div>
              </div>

              {/* Feedback Response */}
              {aiResponse && (
                <div className={`p-3 rounded-lg border transition-all duration-300 ${
                  isDark 
                    ? 'bg-blue-950/30 border-blue-600/30 backdrop-blur-lg' 
                    : isGreen
                      ? 'bg-emerald-50 border-emerald-200'
                      : isBrand
                        ? 'bg-blue-50 border-blue-200'
                        : 'bg-blue-50 border-blue-200'
                }`}>
                  <p className={`text-sm ${
                    isDark ? 'text-blue-300' : isGreen ? 'text-emerald-700' : isBrand ? 'text-blue-700' : 'text-blue-700'
                  }`}>
                    {aiResponse === "helpful" && "Thanks for the feedback! 👍"}
                    {aiResponse === "more" && "I'll provide more detailed information..."}
                    {aiResponse === "different" && "Let me try a different approach..."}
                  </p>
                </div>
              )}

              {/* Alternative AI Button Styles */}
              <div className="space-y-3">
                <h4 className={`text-sm font-medium ${
                  isDark ? 'text-slate-300' : isGreen ? 'text-emerald-200' : isBrand ? 'text-blue-200' : 'text-slate-700'
                }`}>
                  Alternative Response Button Styles
                </h4>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" className="text-xs">
                    <Check className="w-3 h-3 mr-1" />
                    Accept
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs">
                    <X className="w-3 h-3 mr-1" />
                    Decline  
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs">
                    <Zap className="w-3 h-3 mr-1" />
                    Quick Action
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Horizontal Button Groups */}
          <Card className={getCardStyles()}>
            <CardHeader>
              <CardTitle
                className={`text-xl transition-colors duration-300 ${
                  isDark
                    ? "text-white"
                    : isGreen
                      ? "text-emerald-50"
                      : isBrand
                        ? "text-blue-50"
                        : "text-slate-800"
                }`}
              >
                Horizontal Button Groups
              </CardTitle>
              <CardDescription
                className={`transition-colors duration-300 ${
                  isDark
                    ? "text-slate-400"
                    : isGreen
                      ? "text-emerald-300"
                      : isBrand
                        ? "text-blue-300"
                        : "text-slate-600"
                }`}
              >
                Connected button groups for related actions and filter controls
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Action Button Group */}
              <div>
                <h4 className={`text-sm font-medium mb-3 transition-colors duration-300 ${
                  isDark ? 'text-slate-300' : isGreen ? 'text-emerald-200' : isBrand ? 'text-blue-200' : 'text-slate-700'
                }`}>
                  Document Actions
                </h4>
                <div className={`inline-flex rounded-lg border transition-colors duration-300 ${
                  isDark
                    ? "border-slate-600/50 bg-slate-950/30 backdrop-blur-lg"
                    : isGreen
                      ? "border-emerald-600/50 bg-emerald-950/40 backdrop-blur-lg"
                      : isBrand
                        ? "border-blue-600/50 bg-blue-950/40 backdrop-blur-lg"
                        : "border-slate-200 bg-white/80"
                }`}>
                  {[
                    { id: 'save', label: 'Save', icon: Save },
                    { id: 'download', label: 'Download', icon: Download },
                    { id: 'share', label: 'Share', icon: Share },
                    { id: 'delete', label: 'Delete', icon: Trash2 }
                  ].map((action, index) => (
                    <Button
                      key={action.id}
                      variant="ghost"
                      size="sm"
                      className={`
                        px-4 py-2 text-sm font-medium transition-all duration-200
                        ${index === 0 ? "rounded-l-lg" : ""}
                        ${index === 3 ? "rounded-r-lg" : ""}
                        ${index !== 3 ? "border-r" : ""}
                        ${isDark ? "border-slate-600/50 hover:bg-slate-800/50" : isGreen ? "border-emerald-600/50 hover:bg-emerald-800/50" : isBrand ? "border-blue-600/50 hover:bg-blue-800/50" : "border-slate-200 hover:bg-slate-50"}
                        ${action.id === 'delete' ? 'text-red-500 hover:text-red-400 hover:bg-red-950/20' : ''}
                      `}
                    >
                      <action.icon className="w-4 h-4 mr-2" />
                      {action.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Filter Button Group */}
              <div>
                <h4 className={`text-sm font-medium mb-3 transition-colors duration-300 ${
                  isDark ? 'text-slate-300' : isGreen ? 'text-emerald-200' : isBrand ? 'text-blue-200' : 'text-slate-700'
                }`}>
                  Content Filters
                </h4>
                <div className={`inline-flex rounded-lg border transition-colors duration-300 ${
                  isDark
                    ? "border-slate-600/50 bg-slate-950/30 backdrop-blur-lg"
                    : isGreen
                      ? "border-emerald-600/50 bg-emerald-950/40 backdrop-blur-lg"
                      : isBrand
                        ? "border-blue-600/50 bg-blue-950/40 backdrop-blur-lg"
                        : "border-slate-200 bg-white/80"
                }`}>
                  {[
                    { id: 'all', label: 'All' },
                    { id: 'recent', label: 'Recent' },
                    { id: 'starred', label: 'Starred' },
                    { id: 'archived', label: 'Archived' }
                  ].map((filter, index) => (
                    <Button
                      key={filter.id}
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleFilter(filter.id)}
                      className={`
                        px-4 py-2 text-sm font-medium transition-all duration-200
                        ${index === 0 ? "rounded-l-lg" : ""}
                        ${index === 3 ? "rounded-r-lg" : ""}
                        ${index !== 3 ? "border-r" : ""}
                        ${isDark ? "border-slate-600/50" : isGreen ? "border-emerald-600/50" : isBrand ? "border-blue-600/50" : "border-slate-200"}
                        ${
                          selectedFilters.has(filter.id)
                            ? isDark
                              ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
                              : isGreen
                                ? "bg-emerald-500/20 text-emerald-700 border-emerald-500/30"
                                : isBrand
                                  ? "bg-blue-500/20 text-blue-700 border-blue-500/30"
                                  : "bg-blue-50 text-blue-700"
                            : isDark
                              ? "text-slate-400 hover:text-slate-300 hover:bg-slate-800/50"
                              : isGreen
                                ? "text-emerald-300 hover:text-emerald-200 hover:bg-emerald-800/50"
                                : isBrand
                                  ? "text-blue-300 hover:text-blue-200 hover:bg-blue-800/50"
                                  : "text-slate-600 hover:text-slate-700 hover:bg-slate-50"
                        }
                      `}
                    >
                      {filter.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Icon Button Group */}
              <div>
                <h4 className={`text-sm font-medium mb-3 transition-colors duration-300 ${
                  isDark ? 'text-slate-300' : isGreen ? 'text-emerald-200' : isBrand ? 'text-blue-200' : 'text-slate-700'
                }`}>
                  Quick Actions
                </h4>
                <div className={`inline-flex rounded-lg border transition-colors duration-300 ${
                  isDark
                    ? "border-slate-600/50 bg-slate-950/30 backdrop-blur-lg"
                    : isGreen
                      ? "border-emerald-600/50 bg-emerald-950/40 backdrop-blur-lg"
                      : isBrand
                        ? "border-blue-600/50 bg-blue-950/40 backdrop-blur-lg"
                        : "border-slate-200 bg-white/80"
                }`}>
                  {[
                    { id: 'search', icon: Search },
                    { id: 'filter', icon: Filter },
                    { id: 'settings', icon: Settings },
                    { id: 'more', icon: MoreHorizontal }
                  ].map((action, index) => (
                    <Button
                      key={action.id}
                      variant="ghost"
                      size="icon"
                      className={`
                        w-10 h-10 transition-all duration-200 hover:scale-110
                        ${index === 0 ? "rounded-l-lg" : ""}
                        ${index === 3 ? "rounded-r-lg" : ""}
                        ${index !== 3 ? "border-r" : ""}
                        ${isDark ? "border-slate-600/50 hover:bg-slate-800/50" : isGreen ? "border-emerald-600/50 hover:bg-emerald-800/50" : isBrand ? "border-blue-600/50 hover:bg-blue-800/50" : "border-slate-200 hover:bg-slate-50"}
                      `}
                    >
                      <action.icon className="w-4 h-4" />
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vertical Button Stack */}
          <Card className={getCardStyles()}>
            <CardHeader>
              <CardTitle
                className={`text-xl transition-colors duration-300 ${
                  isDark
                    ? "text-white"
                    : isGreen
                      ? "text-emerald-50"
                      : isBrand
                        ? "text-blue-50"
                        : "text-slate-800"
                }`}
              >
                Vertical Button Stack
              </CardTitle>
              <CardDescription
                className={`transition-colors duration-300 ${
                  isDark
                    ? "text-slate-400"
                    : isGreen
                      ? "text-emerald-300"
                      : isBrand
                        ? "text-blue-300"
                        : "text-slate-600"
                }`}
              >
                Stacked button layouts for navigation and primary actions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Primary Action Stack */}
              <div className="space-y-3">
                <h4 className={`text-sm font-medium transition-colors duration-300 ${
                  isDark ? 'text-slate-300' : isGreen ? 'text-emerald-200' : isBrand ? 'text-blue-200' : 'text-slate-700'
                }`}>
                  Primary Actions
                </h4>
                <div className="space-y-2">
                  <Button 
                    variant="default" 
                    className={`w-full transition-all duration-200 hover:scale-105 ${
                      isDark 
                        ? 'bg-blue-600/80 hover:bg-blue-700/80 text-white border-blue-600/60 backdrop-blur-lg shadow-lg shadow-blue-500/20' 
                        : isGreen
                          ? 'bg-emerald-600/80 hover:bg-emerald-700/80 text-emerald-50 border-emerald-600/60 backdrop-blur-lg shadow-lg shadow-emerald-500/30'
                          : isBrand
                            ? 'bg-blue-600/80 hover:bg-blue-700/80 text-blue-50 border-blue-600/60 backdrop-blur-lg shadow-lg shadow-blue-500/30'
                            : ''
                    }`}
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    ⚡ Quick Start Project
                  </Button>
                  <Button 
                    variant="outline" 
                    className={`w-full transition-all duration-200 hover:scale-105 ${
                      isDark 
                        ? 'border-slate-600/50 text-slate-300 hover:bg-slate-800/50 hover:text-white backdrop-blur-lg' 
                        : isGreen
                          ? 'border-emerald-600/50 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800'
                          : isBrand
                            ? 'border-blue-600/50 text-blue-700 hover:bg-blue-50 hover:text-blue-800'
                            : ''
                    }`}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Project
                  </Button>
                  <Button 
                    variant="secondary" 
                    className="w-full transition-all duration-200 hover:scale-105"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    ⚙️ Project Settings
                  </Button>
                </div>
              </div>

              {/* Menu Button Stack */}
              <div className="space-y-3">
                <h4 className={`text-sm font-medium transition-colors duration-300 ${
                  isDark ? 'text-slate-300' : isGreen ? 'text-emerald-200' : isBrand ? 'text-blue-200' : 'text-slate-700'
                }`}>
                  Navigation Menu
                </h4>
                <div className={`border rounded-lg transition-colors duration-300 ${
                  isDark
                    ? "border-slate-600/50 bg-slate-950/30 backdrop-blur-lg"
                    : isGreen
                      ? "border-emerald-600/50 bg-emerald-950/40 backdrop-blur-lg"
                      : isBrand
                        ? "border-blue-600/50 bg-blue-950/40 backdrop-blur-lg"
                        : "border-slate-200 bg-white/80"
                }`}>
                  {[
                    { id: 'dashboard', label: '📊 Dashboard', desc: 'Overview and analytics' },
                    { id: 'projects', label: '📁 Projects', desc: 'Manage your projects' },
                    { id: 'team', label: '👥 Team', desc: 'Team collaboration' },
                    { id: 'settings', label: '⚙️ Settings', desc: 'Account preferences' }
                  ].map((item, index) => (
                    <Button
                      key={item.id}
                      variant="ghost"
                      className={`
                        w-full justify-start px-4 py-3 text-left transition-all duration-200 hover:scale-105
                        ${index === 0 ? "rounded-t-lg" : ""}
                        ${index === 3 ? "rounded-b-lg" : ""}
                        ${index !== 3 ? "border-b" : ""}
                        ${isDark ? "border-slate-600/30 hover:bg-slate-800/50" : isGreen ? "border-emerald-600/30 hover:bg-emerald-800/50" : isBrand ? "border-blue-600/30 hover:bg-blue-800/50" : "border-slate-200 hover:bg-slate-50"}
                      `}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div>
                          <div className={`font-medium ${
                            isDark ? 'text-slate-300' : isGreen ? 'text-emerald-200' : isBrand ? 'text-blue-200' : 'text-slate-700'
                          }`}>
                            {item.label}
                          </div>
                          <div className={`text-xs ${
                            isDark ? 'text-slate-400' : isGreen ? 'text-emerald-300' : isBrand ? 'text-blue-300' : 'text-slate-500'
                          }`}>
                            {item.desc}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 opacity-50" />
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Interactive Button Workflows */}
          <Card className={getCardStyles()}>
            <CardHeader>
              <CardTitle
                className={`text-xl transition-colors duration-300 ${
                  isDark
                    ? "text-white"
                    : isGreen
                      ? "text-emerald-50"
                      : isBrand
                        ? "text-blue-50"
                        : "text-slate-800"
                }`}
              >
                Interactive Button Workflows
              </CardTitle>
              <CardDescription
                className={`transition-colors duration-300 ${
                  isDark
                    ? "text-slate-400"
                    : isGreen
                      ? "text-emerald-300"
                      : isBrand
                        ? "text-blue-300"
                        : "text-slate-600"
                }`}
              >
                Connected button groups for step-by-step processes and workflow controls
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
              {/* Project Setup Workflow */}
              <div className="flex items-start gap-6">
                {/* Left Label */}
                <div className="flex-shrink-0 pt-2">
                  <Label className={`text-right transition-colors duration-300 ${
                    isDark
                      ? "text-slate-300"
                      : isGreen
                        ? "text-emerald-200"
                        : isBrand
                          ? "text-blue-200"
                          : "text-slate-700"
                  }`}>
                    Project Setup:
                  </Label>
                </div>

                {/* Connected Button Flow */}
                <div className="flex-1">
                  <div className={`inline-flex rounded-lg border transition-colors duration-300 ${
                    isDark
                      ? "border-slate-600/50 bg-slate-950/30 backdrop-blur-lg"
                      : isGreen
                        ? "border-emerald-600/50 bg-emerald-950/40 backdrop-blur-lg"
                        : isBrand
                          ? "border-blue-600/50 bg-blue-950/40 backdrop-blur-lg"
                          : "border-slate-200 bg-white/80"
                  }`}>
                    {[
                      { id: 'step1', num: '1', label: 'Planning', status: 'completed' },
                      { id: 'step2', num: '2', label: 'Design', status: 'completed' },
                      { id: 'step3', num: '3', label: 'Development', status: 'active' },
                      { id: 'step4', num: '4', label: 'Testing', status: 'pending' }
                    ].map((step, index) => (
                      <Button
                        key={step.id}
                        variant="ghost"
                        className={`
                          px-4 py-2 text-sm font-medium transition-all duration-200 flex items-center gap-3
                          ${index === 0 ? "rounded-l-lg" : ""}
                          ${index === 3 ? "rounded-r-lg" : ""}
                          ${index !== 3 ? "border-r" : ""}
                          ${isDark ? "border-slate-600/50" : isGreen ? "border-emerald-600/50" : isBrand ? "border-blue-600/50" : "border-slate-200"}
                          ${
                            step.status === 'completed'
                              ? isDark
                                ? "bg-green-500/20 text-green-300 border-green-500/30"
                                : isGreen
                                  ? "bg-emerald-500/20 text-emerald-700 border-emerald-500/30"
                                  : isBrand
                                    ? "bg-green-500/20 text-green-700 border-green-500/30"
                                    : "bg-green-50 text-green-700 border-green-200"
                              : step.status === 'active'
                                ? isDark
                                  ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
                                  : isGreen
                                    ? "bg-emerald-600/20 text-emerald-700 border-emerald-600/30"
                                    : isBrand
                                      ? "bg-blue-600/20 text-blue-700 border-blue-600/30"
                                      : "bg-blue-50 text-blue-700 border-blue-200"
                                : isDark
                                  ? "text-slate-400 hover:text-slate-300 hover:bg-slate-800/50"
                                  : isGreen
                                    ? "text-emerald-400 hover:text-emerald-300 hover:bg-emerald-800/50"
                                    : isBrand
                                      ? "text-blue-400 hover:text-blue-300 hover:bg-blue-800/50"
                                      : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                          }
                        `}
                      >
                        <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs ${
                          step.status === 'completed'
                            ? 'bg-green-500 border-green-500 text-white'
                            : step.status === 'active'
                              ? isDark
                                ? 'bg-blue-500/80 border-blue-500/60 text-white'
                                : isGreen
                                  ? 'bg-emerald-500/80 border-emerald-500/60 text-emerald-50'
                                  : isBrand
                                    ? 'bg-blue-600 border-blue-600 text-white'
                                    : 'bg-blue-600 border-blue-600 text-white'
                              : isDark
                                ? 'border-slate-500/50 text-slate-400'
                                : isGreen
                                  ? 'border-emerald-500/50 text-emerald-400'
                                  : isBrand
                                    ? 'border-blue-500/50 text-blue-400'
                                    : 'border-slate-300 text-slate-500'
                        }`}>
                          {step.status === 'completed' ? '✓' : step.num}
                        </span>
                        <span>{step.label}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Deployment Pipeline */}
              <div className="flex items-start gap-6">
                {/* Left Label */}
                <div className="flex-shrink-0 pt-2">
                  <Label className={`text-right transition-colors duration-300 ${
                    isDark
                      ? "text-slate-300"
                      : isGreen
                        ? "text-emerald-200"
                        : isBrand
                          ? "text-blue-200"
                          : "text-slate-700"
                  }`}>
                    Deploy Pipeline:
                  </Label>
                </div>

                {/* Connected Deployment Buttons */}
                <div className="flex-1">
                  <div className={`inline-flex rounded-lg border transition-colors duration-300 ${
                    isDark
                      ? "border-slate-600/50 bg-slate-950/30 backdrop-blur-lg"
                      : isGreen
                        ? "border-emerald-600/50 bg-emerald-950/40 backdrop-blur-lg"
                        : isBrand
                          ? "border-blue-600/50 bg-blue-950/40 backdrop-blur-lg"
                          : "border-slate-200 bg-white/80"
                  }`}>
                    {[
                      { id: 'build', label: 'Build', status: 'completed' },
                      { id: 'test', label: 'Test', status: 'completed' },
                      { id: 'stage', label: 'Stage', status: 'active' },
                      { id: 'prod', label: 'Production', status: 'pending' },
                      { id: 'monitor', label: 'Monitor', status: 'pending' }
                    ].map((step, index) => (
                      <Button
                        key={step.id}
                        variant="ghost"
                        size="sm"
                        className={`
                          px-3 py-2 text-sm font-medium transition-all duration-200
                          ${index === 0 ? "rounded-l-lg" : ""}
                          ${index === 4 ? "rounded-r-lg" : ""}
                          ${index !== 4 ? "border-r" : ""}
                          ${isDark ? "border-slate-600/50" : isGreen ? "border-emerald-600/50" : isBrand ? "border-blue-600/50" : "border-slate-200"}
                          ${
                            step.status === 'completed'
                              ? 'text-green-500 hover:text-green-400'
                              : step.status === 'active'
                                ? isDark
                                  ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
                                  : isGreen
                                    ? "bg-emerald-600/20 text-emerald-700 border-emerald-600/30"
                                    : isBrand
                                      ? "bg-blue-600/20 text-blue-700 border-blue-600/30"
                                      : "bg-blue-50 text-blue-700 border-blue-200"
                                : isDark
                                  ? "text-slate-400 hover:text-slate-300 hover:bg-slate-800/50"
                                  : isGreen
                                    ? "text-emerald-400 hover:text-emerald-300 hover:bg-emerald-800/50"
                                    : isBrand
                                      ? "text-blue-400 hover:text-blue-300 hover:bg-blue-800/50"
                                      : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                          }
                        `}
                      >
                        {step.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
              </div>
            </CardContent>
          </Card>

          {/* Pagination Button Groups */}
          <Card className={getCardStyles()}>
            <CardHeader>
              <CardTitle
                className={`text-xl transition-colors duration-300 ${
                  isDark
                    ? "text-white"
                    : isGreen
                      ? "text-emerald-50"
                      : isBrand
                        ? "text-blue-50"
                        : "text-slate-800"
                }`}
              >
                Pagination Button Groups
              </CardTitle>
              <CardDescription
                className={`transition-colors duration-300 ${
                  isDark
                    ? "text-slate-400"
                    : isGreen
                      ? "text-emerald-300"
                      : isBrand
                        ? "text-blue-300"
                        : "text-slate-600"
                }`}
              >
                Navigation controls for paginated content with different styles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Simple Previous/Next */}
              <div>
                <h4 className={`text-sm font-medium mb-3 transition-colors duration-300 ${
                  isDark ? 'text-slate-300' : isGreen ? 'text-emerald-200' : isBrand ? 'text-blue-200' : 'text-slate-700'
                }`}>
                  Simple Navigation
                </h4>
                <div className="flex items-center justify-center">
                  <div className={`inline-flex rounded-lg border transition-colors duration-300 ${
                    isDark
                      ? "border-slate-600/50 bg-slate-950/30 backdrop-blur-lg"
                      : isGreen
                        ? "border-emerald-600/50 bg-emerald-950/40 backdrop-blur-lg"
                        : isBrand
                          ? "border-blue-600/50 bg-blue-950/40 backdrop-blur-lg"
                          : "border-slate-200 bg-white/80"
                  }`}>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(1)}
                      className={`
                        px-3 py-2 transition-all duration-200 rounded-l-lg border-r
                        ${isDark ? "border-slate-600/50 hover:bg-slate-800/50" : isGreen ? "border-emerald-600/50 hover:bg-emerald-800/50" : isBrand ? "border-blue-600/50 hover:bg-blue-800/50" : "border-slate-200 hover:bg-slate-50"}
                      `}
                    >
                      <ChevronsLeft className="w-4 h-4 mr-1" />
                      First
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      className={`
                        px-3 py-2 transition-all duration-200 border-r
                        ${isDark ? "border-slate-600/50 hover:bg-slate-800/50" : isGreen ? "border-emerald-600/50 hover:bg-emerald-800/50" : isBrand ? "border-blue-600/50 hover:bg-blue-800/50" : "border-slate-200 hover:bg-slate-50"}
                      `}
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      Previous
                    </Button>
                    
                    <div className={`px-4 py-2 text-sm font-medium flex items-center border-r transition-colors duration-300 ${
                      isDark ? 'text-slate-300 border-slate-600/50' : isGreen ? 'text-emerald-200 border-emerald-600/50' : isBrand ? 'text-blue-200 border-blue-600/50' : 'text-slate-700 border-slate-200'
                    }`}>
                      Page {currentPage} of {totalPages}
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      className={`
                        px-3 py-2 transition-all duration-200 border-r
                        ${isDark ? "border-slate-600/50 hover:bg-slate-800/50" : isGreen ? "border-emerald-600/50 hover:bg-emerald-800/50" : isBrand ? "border-blue-600/50 hover:bg-blue-800/50" : "border-slate-200 hover:bg-slate-50"}
                      `}
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(totalPages)}
                      className={`
                        px-3 py-2 transition-all duration-200 rounded-r-lg
                        ${isDark ? "hover:bg-slate-800/50" : isGreen ? "hover:bg-emerald-800/50" : isBrand ? "hover:bg-blue-800/50" : "hover:bg-slate-50"}
                      `}
                    >
                      Last
                      <ChevronsRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Compact Pagination */}
              <div>
                <h4 className={`text-sm font-medium mb-3 transition-colors duration-300 ${
                  isDark ? 'text-slate-300' : isGreen ? 'text-emerald-200' : isBrand ? 'text-blue-200' : 'text-slate-700'
                }`}>
                  Compact Style
                </h4>
                <div className="flex items-center justify-center">
                  <div className={`inline-flex items-center rounded-lg border transition-colors duration-300 ${
                    isDark
                      ? "border-slate-600/50 bg-slate-950/30 backdrop-blur-lg"
                      : isGreen
                        ? "border-emerald-600/50 bg-emerald-950/40 backdrop-blur-lg"
                        : isBrand
                          ? "border-blue-600/50 bg-blue-950/40 backdrop-blur-lg"
                          : "border-slate-200 bg-white/80"
                  }`}>
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(1)}
                      className={`
                        w-10 h-10 transition-all duration-200 rounded-l-lg border-r
                        ${isDark ? "border-slate-600/50 hover:bg-slate-800/50" : isGreen ? "border-emerald-600/50 hover:bg-emerald-800/50" : isBrand ? "border-blue-600/50 hover:bg-blue-800/50" : "border-slate-200 hover:bg-slate-50"}
                      `}
                    >
                      <ChevronsLeft className="w-4 h-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      className={`
                        w-10 h-10 border-r transition-all duration-200
                        ${isDark ? "border-slate-600/50 hover:bg-slate-800/50" : isGreen ? "border-emerald-600/50 hover:bg-emerald-800/50" : isBrand ? "border-blue-600/50 hover:bg-blue-800/50" : "border-slate-200 hover:bg-slate-50"}
                      `}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    
                    <div className={`px-4 h-10 text-sm font-medium flex items-center gap-1 border-r transition-colors duration-300 ${
                      isDark ? 'text-slate-300 border-slate-600/50' : isGreen ? 'text-emerald-200 border-emerald-600/50' : isBrand ? 'text-blue-200 border-blue-600/50' : 'text-slate-700 border-slate-200'
                    }`}>
                      <span>{currentPage}</span>
                      <span className={isDark ? 'text-slate-500' : isGreen ? 'text-emerald-400' : isBrand ? 'text-blue-400' : 'text-slate-400'}>/</span>
                      <span className={isDark ? 'text-slate-400' : isGreen ? 'text-emerald-300' : isBrand ? 'text-blue-300' : 'text-slate-500'}>{totalPages}</span>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      className={`
                        w-10 h-10 border-r transition-all duration-200
                        ${isDark ? "border-slate-600/50 hover:bg-slate-800/50" : isGreen ? "border-emerald-600/50 hover:bg-emerald-800/50" : isBrand ? "border-blue-600/50 hover:bg-blue-800/50" : "border-slate-200 hover:bg-slate-50"}
                      `}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(totalPages)}
                      className={`
                        w-10 h-10 transition-all duration-200 rounded-r-lg
                        ${isDark ? "hover:bg-slate-800/50" : isGreen ? "hover:bg-emerald-800/50" : isBrand ? "hover:bg-blue-800/50" : "hover:bg-slate-50"}
                      `}
                    >
                      <ChevronsRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>



        <div className="grid lg:grid-cols-2 gap-8">
          {/* Compact Button Grid */}
          <Card className={getCardStyles()}>
            <CardHeader>
              <CardTitle
                className={`text-xl transition-colors duration-300 ${
                  isDark
                    ? "text-white"
                    : isGreen
                      ? "text-emerald-50"
                      : isBrand
                        ? "text-blue-50"
                        : "text-slate-800"
                }`}
              >
                Compact Button Grid
              </CardTitle>
              <CardDescription
                className={`transition-colors duration-300 ${
                  isDark
                    ? "text-slate-400"
                    : isGreen
                      ? "text-emerald-300"
                      : isBrand
                        ? "text-blue-300"
                        : "text-slate-600"
                }`}
              >
                Space-efficient layout for multiple action options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className={`text-sm font-medium mb-3 transition-colors duration-300 ${
                  isDark ? 'text-slate-300' : isGreen ? 'text-emerald-200' : isBrand ? 'text-blue-200' : 'text-slate-700'
                }`}>
                  Quick Actions
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'create', label: 'Create', icon: Plus, variant: 'default' as const },
                    { id: 'edit', label: 'Edit', icon: Edit, variant: 'outline' as const },
                    { id: 'share', label: 'Share', icon: Share, variant: 'secondary' as const },
                    { id: 'archive', label: 'Archive', icon: Download, variant: 'ghost' as const }
                  ].map((item) => (
                    <Button
                      key={item.id}
                      variant={item.variant}
                      size="sm"
                      className={`justify-start transition-all duration-200 hover:scale-105 ${
                        item.variant === 'default' && (
                          isDark 
                            ? 'bg-blue-600/80 hover:bg-blue-700/80 text-white border-blue-600/60 backdrop-blur-lg shadow-lg shadow-blue-500/20' 
                            : isGreen
                              ? 'bg-emerald-600/80 hover:bg-emerald-700/80 text-emerald-50 border-emerald-600/60 backdrop-blur-lg shadow-lg shadow-emerald-500/30'
                              : isBrand
                                ? 'bg-blue-600/80 hover:bg-blue-700/80 text-blue-50 border-blue-600/60 backdrop-blur-lg shadow-lg shadow-blue-500/30'
                                : ''
                        )
                      } ${
                        item.variant === 'outline' && (
                          isDark 
                            ? 'border-slate-600/50 text-slate-300 hover:bg-slate-800/50 hover:text-white backdrop-blur-lg' 
                            : isGreen
                              ? 'border-emerald-600/50 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800'
                              : isBrand
                                ? 'border-blue-600/50 text-blue-700 hover:bg-blue-50 hover:text-blue-800'
                                : ''
                        )
                      }`}
                    >
                      <item.icon className="w-4 h-4 mr-2" />
                      {item.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className={`text-sm font-medium mb-3 transition-colors duration-300 ${
                  isDark ? 'text-slate-300' : isGreen ? 'text-emerald-200' : isBrand ? 'text-blue-200' : 'text-slate-700'
                }`}>
                  Social Actions
                </h4>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'like', icon: Heart, label: 'Like' },
                    { id: 'star', icon: Star, label: 'Star' },
                    { id: 'comment', icon: MessageSquare, label: 'Comment' },
                    { id: 'bookmark', icon: Coffee, label: 'Bookmark' }
                  ].map((item) => (
                    <Button
                      key={item.id}
                      variant="ghost"
                      size="sm"
                      className="transition-all duration-200 hover:scale-110"
                    >
                      <item.icon className="w-4 h-4 mr-1" />
                      {item.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className={`text-sm font-medium mb-3 transition-colors duration-300 ${
                  isDark ? 'text-slate-300' : isGreen ? 'text-emerald-200' : isBrand ? 'text-blue-200' : 'text-slate-700'
                }`}>
                  Status Actions
                </h4>
                <div className="space-y-2">
                  {[
                    { id: 'approve', label: 'Approve Request', variant: 'default' as const },
                    { id: 'pending', label: 'Mark as Pending', variant: 'secondary' as const },
                    { id: 'reject', label: 'Reject Request', variant: 'destructive' as const }
                  ].map((item) => (
                    <Button
                      key={item.id}
                      variant={item.variant}
                      size="sm"
                      className={`w-full justify-start transition-all duration-200 hover:scale-105 ${
                        item.variant === 'default' && (
                          isDark 
                            ? 'bg-blue-600/80 hover:bg-blue-700/80 text-white border-blue-600/60 backdrop-blur-lg shadow-lg shadow-blue-500/20' 
                            : isGreen
                              ? 'bg-emerald-600/80 hover:bg-emerald-700/80 text-emerald-50 border-emerald-600/60 backdrop-blur-lg shadow-lg shadow-emerald-500/30'
                              : isBrand
                                ? 'bg-blue-600/80 hover:bg-blue-700/80 text-blue-50 border-blue-600/60 backdrop-blur-lg shadow-lg shadow-blue-500/30'
                                : ''
                        )
                      }`}
                    >
                      {item.label}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Minimal & Text-Style Buttons */}
          <Card className={getCardStyles()}>
            <CardHeader>
              <CardTitle
                className={`text-xl transition-colors duration-300 ${
                  isDark
                    ? "text-white"
                    : isGreen
                      ? "text-emerald-50"
                      : isBrand
                        ? "text-blue-50"
                        : "text-slate-800"
                }`}
              >
                Minimal & Text-Style Buttons
              </CardTitle>
              <CardDescription
                className={`transition-colors duration-300 ${
                  isDark
                    ? "text-slate-400"
                    : isGreen
                      ? "text-emerald-300"
                      : isBrand
                        ? "text-blue-300"
                        : "text-slate-600"
                }`}
              >
                Clean interface with subtle button styles
                and text-based interactions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Simple inline buttons */}
              <div>
                <h4 className={`text-sm font-medium mb-3 transition-colors duration-300 ${
                  isDark ? 'text-slate-300' : isGreen ? 'text-emerald-200' : isBrand ? 'text-blue-200' : 'text-slate-700'
                }`}>
                  Link-Style Actions
                </h4>
                <div className="flex flex-wrap gap-4">
                  {['View Details', 'Learn More', 'Get Started'].map((text, index) => (
                    <Button
                      key={text}
                      variant="link"
                      size="sm"
                      className={`p-0 h-auto transition-all duration-200 ${
                        isDark ? 'text-blue-400 hover:text-blue-300' : isGreen ? 'text-emerald-600 hover:text-emerald-500' : isBrand ? 'text-blue-600 hover:text-blue-500' : 'text-blue-600 hover:text-blue-500'
                      }`}
                    >
                      {text} →
                    </Button>
                  ))}
                </div>
              </div>

              {/* Ghost buttons */}
              <div>
                <h4 className={`text-sm font-medium mb-3 transition-colors duration-300 ${
                  isDark ? 'text-slate-300' : isGreen ? 'text-emerald-200' : isBrand ? 'text-blue-200' : 'text-slate-700'
                }`}>
                  Subtle Actions
                </h4>
                <div className="flex flex-wrap gap-2">
                  {[
                    { text: '🔄 Refresh', icon: null },
                    { text: '🔍 Search', icon: Search },
                    { text: '⚙️ Settings', icon: Settings },
                    { text: '📊 Analytics', icon: null }
                  ].map((item, index) => (
                    <Button
                      key={item.text}
                      variant="ghost"
                      size="sm"
                      className="transition-all duration-200 hover:scale-105"
                    >
                      {item.icon && <item.icon className="w-4 h-4 mr-1" />}
                      {item.text}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Call-to-action card */}
              <div className={`p-4 rounded-lg border transition-all duration-300 ${
                isDark 
                  ? 'bg-slate-950/30 border-slate-600/30 backdrop-blur-lg' 
                  : isGreen
                    ? 'bg-emerald-950/40 border-emerald-600/30 backdrop-blur-lg'
                    : isBrand
                      ? 'bg-blue-950/40 border-blue-600/30 backdrop-blur-lg'
                      : 'bg-slate-50/50 border-slate-200'
              }`}>
                <div className="space-y-3">
                  <h5 className={`font-medium transition-colors duration-300 ${
                    isDark ? 'text-slate-300' : isGreen ? 'text-emerald-200' : isBrand ? 'text-blue-200' : 'text-slate-700'
                  }`}>
                    🚀 Ready to get started?
                  </h5>
                  <p className={`text-sm transition-colors duration-300 ${
                    isDark ? 'text-slate-400' : isGreen ? 'text-emerald-300' : isBrand ? 'text-blue-300' : 'text-slate-600'
                  }`}>
                    Choose your preferred action to continue with the setup process.
                  </p>
                  <div className="flex gap-2 pt-2">
                    <Button 
                      size="sm"
                      className={`transition-all duration-200 hover:scale-105 ${
                        isDark 
                          ? 'bg-blue-600/80 hover:bg-blue-700/80 text-white border-blue-600/60 backdrop-blur-lg shadow-lg shadow-blue-500/20' 
                          : isGreen
                            ? 'bg-emerald-600/80 hover:bg-emerald-700/80 text-emerald-50 border-emerald-600/60 backdrop-blur-lg shadow-lg shadow-emerald-500/30'
                            : isBrand
                              ? 'bg-blue-600/80 hover:bg-blue-700/80 text-blue-50 border-blue-600/60 backdrop-blur-lg shadow-lg shadow-blue-500/30'
                              : ''
                      }`}
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Accept & Continue
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="transition-all duration-200 hover:scale-105"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Skip for now
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Label with Action Buttons */}
        <div className="grid lg:grid-cols-2 gap-8">
          <Card className={getCardStyles()}>
            <CardHeader>
              <CardTitle
                className={`text-xl transition-colors duration-300 ${
                  isDark
                    ? "text-white"
                    : isGreen
                      ? "text-emerald-50"
                      : isBrand
                        ? "text-blue-50"
                        : "text-slate-800"
                }`}
              >
                Label with Action Buttons
              </CardTitle>
              <CardDescription
                className={`transition-colors duration-300 ${
                  isDark
                    ? "text-slate-400"
                    : isGreen
                      ? "text-emerald-300"
                      : isBrand
                        ? "text-blue-300"
                        : "text-slate-600"
                }`}
              >
                Contextual labels with subtle action buttons for common operations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Document Actions */}
              <div className="space-y-3">
                {renamingItem === 'document' ? (
                  <div className="flex items-center gap-2">
                    <FileText className={`w-4 h-4 transition-colors duration-300 ${
                      isDark ? 'text-blue-400' : isGreen ? 'text-emerald-600' : isBrand ? 'text-blue-600' : 'text-blue-600'
                    }`} />
                    <Input
                      autoFocus
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      className={`flex-1 ${getInputStyles()}`}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          setLabelNames(prev => ({ ...prev, document: renameValue }));
                          setRenamingItem(null);
                          setRenameValue("");
                        } else if (e.key === 'Escape') {
                          setRenamingItem(null);
                          setRenameValue("");
                        }
                      }}
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <FileText className={`w-4 h-4 transition-colors duration-300 ${
                      isDark ? 'text-blue-400' : isGreen ? 'text-emerald-600' : isBrand ? 'text-blue-600' : 'text-blue-600'
                    }`} />
                    <Label className={`transition-colors duration-300 border-b pb-1 ${
                      isDark
                        ? "text-slate-300 border-slate-600/40"
                        : isGreen
                          ? "text-emerald-200 border-emerald-600/40"
                          : isBrand
                            ? "text-blue-200 border-blue-600/40"
                            : "text-slate-700 border-slate-300"
                    }`}>
                      {labelNames.document}
                    </Label>
                  </div>
                )}
                <div className="flex gap-2 pl-6">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setRenamingItem('document');
                      setRenameValue(labelNames.document);
                    }}
                    className={`text-sm transition-all duration-200 hover:scale-105 ${
                      isDark
                        ? "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                        : isGreen
                          ? "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                          : isBrand
                            ? "text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            : "text-slate-600 hover:text-slate-700"
                    }`}
                  >
                    <RotateCw className="w-3 h-3 mr-1" />
                    Rename
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`text-sm transition-all duration-200 hover:scale-105 ${
                      isDark
                        ? "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                        : isGreen
                          ? "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                          : isBrand
                            ? "text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            : "text-slate-600 hover:text-slate-700"
                    }`}
                  >
                    <Save className="w-3 h-3 mr-1" />
                    Save
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`text-sm transition-all duration-200 hover:scale-105 ${
                      isDark
                        ? "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                        : isGreen
                          ? "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                          : isBrand
                            ? "text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            : "text-slate-600 hover:text-slate-700"
                    }`}
                  >
                    <Check className="w-3 h-3 mr-1" />
                    Select
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`text-sm transition-all duration-200 hover:scale-105 ${
                      isDark
                        ? "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                        : isGreen
                          ? "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                          : isBrand
                            ? "text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            : "text-slate-600 hover:text-slate-700"
                    }`}
                  >
                    <FilePlus className="w-3 h-3 mr-1" />
                    New
                  </Button>
                </div>
              </div>

              {/* Project Selection */}
              <div className="space-y-3">
                {renamingItem === 'project' ? (
                  <div className="flex items-center gap-2">
                    <Star className={`w-4 h-4 transition-colors duration-300 ${
                      isDark ? 'text-yellow-400' : isGreen ? 'text-yellow-500' : isBrand ? 'text-yellow-500' : 'text-yellow-600'
                    }`} />
                    <Input
                      autoFocus
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      className={`flex-1 ${getInputStyles()}`}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          setLabelNames(prev => ({ ...prev, project: renameValue }));
                          setRenamingItem(null);
                          setRenameValue("");
                        } else if (e.key === 'Escape') {
                          setRenamingItem(null);
                          setRenameValue("");
                        }
                      }}
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Star className={`w-4 h-4 transition-colors duration-300 ${
                      isDark ? 'text-yellow-400' : isGreen ? 'text-yellow-500' : isBrand ? 'text-yellow-500' : 'text-yellow-600'
                    }`} />
                    <Label className={`transition-colors duration-300 border-b pb-1 ${
                      isDark
                        ? "text-slate-300 border-slate-600/40"
                        : isGreen
                          ? "text-emerald-200 border-emerald-600/40"
                          : isBrand
                            ? "text-blue-200 border-blue-600/40"
                            : "text-slate-700 border-slate-300"
                    }`}>
                      {labelNames.project}
                    </Label>
                  </div>
                )}
                <div className="flex gap-2 pl-6">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setRenamingItem('project');
                      setRenameValue(labelNames.project);
                    }}
                    className={`text-sm transition-all duration-200 hover:scale-105 ${
                      isDark
                        ? "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                        : isGreen
                          ? "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                          : isBrand
                            ? "text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            : "text-slate-600 hover:text-slate-700"
                    }`}
                  >
                    Rename
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`text-sm transition-all duration-200 hover:scale-105 ${
                      isDark
                        ? "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                        : isGreen
                          ? "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                          : isBrand
                            ? "text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            : "text-slate-600 hover:text-slate-700"
                    }`}
                  >
                    Save
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`text-sm transition-all duration-200 hover:scale-105 ${
                      isDark
                        ? "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                        : isGreen
                          ? "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                          : isBrand
                            ? "text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            : "text-slate-600 hover:text-slate-700"
                    }`}
                  >
                    Select
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`text-sm transition-all duration-200 hover:scale-105 ${
                      isDark
                        ? "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                        : isGreen
                          ? "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                          : isBrand
                            ? "text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            : "text-slate-600 hover:text-slate-700"
                    }`}
                  >
                    <FilePlus className="w-3 h-3 mr-1" />
                    New
                  </Button>
                </div>
              </div>

              {/* Template Options */}
              <div className="space-y-3">
                {renamingItem === 'template' ? (
                  <div className="flex items-center gap-2">
                    <Settings className={`w-4 h-4 transition-colors duration-300 ${
                      isDark ? 'text-slate-400' : isGreen ? 'text-emerald-600' : isBrand ? 'text-blue-600' : 'text-slate-600'
                    }`} />
                    <Input
                      autoFocus
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      className={`flex-1 ${getInputStyles()}`}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          setLabelNames(prev => ({ ...prev, template: renameValue }));
                          setRenamingItem(null);
                          setRenameValue("");
                        } else if (e.key === 'Escape') {
                          setRenamingItem(null);
                          setRenameValue("");
                        }
                      }}
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Settings className={`w-4 h-4 transition-colors duration-300 ${
                      isDark ? 'text-slate-400' : isGreen ? 'text-emerald-600' : isBrand ? 'text-blue-600' : 'text-slate-600'
                    }`} />
                    <Label className={`transition-colors duration-300 border-b pb-1 ${
                      isDark
                        ? "text-slate-300 border-slate-600/40"
                        : isGreen
                          ? "text-emerald-200 border-emerald-600/40"
                          : isBrand
                            ? "text-blue-200 border-blue-600/40"
                            : "text-slate-700 border-slate-300"
                    }`}>
                      {labelNames.template}
                    </Label>
                  </div>
                )}
                <div className="flex gap-2 pl-6">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setRenamingItem('template');
                      setRenameValue(labelNames.template);
                    }}
                    className={`text-sm transition-all duration-200 hover:scale-105 ${
                      isDark
                        ? "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                        : isGreen
                          ? "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                          : isBrand
                            ? "text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            : "text-slate-600 hover:text-slate-700"
                    }`}
                  >
                    Rename
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`text-sm transition-all duration-200 hover:scale-105 ${
                      isDark
                        ? "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                        : isGreen
                          ? "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                          : isBrand
                            ? "text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            : "text-slate-600 hover:text-slate-700"
                    }`}
                  >
                    Save
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`text-sm transition-all duration-200 hover:scale-105 ${
                      isDark
                        ? "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                        : isGreen
                          ? "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                          : isBrand
                            ? "text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            : "text-slate-600 hover:text-slate-700"
                    }`}
                  >
                    Select
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`text-sm transition-all duration-200 hover:scale-105 ${
                      isDark
                        ? "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                        : isGreen
                          ? "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                          : isBrand
                            ? "text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            : "text-slate-600 hover:text-slate-700"
                    }`}
                  >
                    <FilePlus className="w-3 h-3 mr-1" />
                    New
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}