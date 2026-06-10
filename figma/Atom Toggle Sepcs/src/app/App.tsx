import { useState } from "react";
import { Switch } from "./components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import { Power, Wifi, Volume2, ChevronDown, Target, Users, TrendingUp, MessageSquare, BarChart, Zap, Award, Star } from "lucide-react";

export default function App() {
  // Toggle states for demonstrations
  const [toggleStates, setToggleStates] = useState({
    power: false,
    notifications: true,
    darkMode: false,
    wifi: true,
    bluetooth: false,
    sound: false,
    aiAssist: true,
    privacy: false,
    autoSave: true,
    experimental: false,
    sync: true,
    locationServices: false,
    biometrics: true,
    airplane: false,
    dataRoaming: false,
    // Table toggles
    emailNotifications: true,
    pushNotifications: false,
    smsAlerts: true,
    weeklyDigest: false,
    productUpdates: true,
    securityAlerts: true,
    newsletter: false,
    accountActivity: true,
    // Expandable toggles
    salesExpert: true,
    leadAnalyzer: true,
    autoScoreLeads: false,
    continuousReScoring: false,
    priorityAlerts: false,
    scoreVisibility: false,
    followUpManager: false,
    autoSendFollowUps: false,
    businessHoursOnly: false,
    followUpCadence: false,
    skipManualActivity: false,
    territorySpecialist: false,
    dealCloser: true,
    performanceCoach: false,
    customerInsights: true,
    quickResponse: false,
    // Sales Expert sub-toggles
    autoQualifyLeads: true,
    pipelineAutoUpdate: false,
    notifyHighValue: true,
    minLeadScore: false,
    // Territory Specialist sub-toggles
    autoGenerateReports: false,
    performanceAlerts: true,
    competitiveBenchmarking: false,
    realTimeUpdates: true,
    // Deal Closer sub-toggles
    autoSuggestNextSteps: true,
    riskAlertLevel: false,
    stageSpecificTactics: true,
    approvalRequired: false,
    // Performance Coach sub-toggles
    proactiveCoaching: false,
    privacyLevel: true,
    coachingFrequency: false,
    benchmarkComparisons: true,
    // Customer Insights sub-toggles
    autoGenerateInsights: true,
    behaviorChangeAlerts: false,
    analysisDepth: true,
    segmentFiltering: false,
    // Quick Response sub-toggles
    autoReply: false,
    approvalWorkflow: true,
    businessHoursOnlyQuick: false,
    escalationRules: true
  });

  const handleToggleChange = (key: string) => (checked: boolean) => {
    setToggleStates(prev => ({ ...prev, [key]: checked }));
  };

  // Expandable items state
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    salesExpert: false,
    leadAnalyzer: false,
    followUpManager: false,
    territorySpecialist: false,
    dealCloser: false,
    performanceCoach: false,
    customerInsights: false,
    quickResponse: false
  });

  const toggleExpand = (key: string) => {
    setExpandedItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Plain theme styles
  const getCardStyles = () => {
    return `border-0 backdrop-blur-xl transition-all duration-300 bg-white/70 shadow-2xl`;
  };

  const getToggleLabelColor = () => {
    return 'text-slate-700';
  };

  return (
    <div className="min-h-screen p-6 transition-all duration-500 bg-gray-50">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="space-y-2">
            <h1 className="text-4xl tracking-tight transition-colors duration-300 text-slate-900">
              Atom Toggle
            </h1>
            <h2 className="text-2xl transition-colors duration-300 text-slate-600">
              finAtomToggle: Circle Switch, Check Toggle, Vertical & Label Positioning
            </h2>
          </div>
          <p className="text-lg max-w-3xl mx-auto transition-colors duration-300 text-slate-600">
            Comprehensive showcase of toggle component variations including 
            circle switches, check toggles, vertical orientations, and flexible label positioning options.
          </p>
        </div>

        {/* Circle Switch Toggles */}
        <Card className={getCardStyles()}>
          <CardHeader>
            <CardTitle className="text-xl transition-colors duration-300 text-slate-800">
              Circle Switch Toggles
            </CardTitle>
            <CardDescription className="transition-colors duration-300 text-slate-600">
              Standard circle switch toggles with different label positioning options
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Label Position: Right */}
            <div>
              <h3 className="mb-4 transition-colors duration-300 text-slate-600">
                Label Position: Right
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Switch 
                      checked={toggleStates.notifications}
                      onCheckedChange={handleToggleChange('notifications')}
                    />
                    <span className={getToggleLabelColor()}>
                      Enable notifications
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Switch 
                      checked={toggleStates.darkMode}
                      onCheckedChange={handleToggleChange('darkMode')}
                    />
                    <span className={getToggleLabelColor()}>
                      Dark mode
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Switch 
                      checked={toggleStates.wifi}
                      onCheckedChange={handleToggleChange('wifi')}
                    />
                    <span className={getToggleLabelColor()}>
                      Wi-Fi connection
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Switch 
                      checked={toggleStates.sound}
                      onCheckedChange={handleToggleChange('sound')}
                    />
                    <span className={getToggleLabelColor()}>
                      Sound effects
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Switch 
                      checked={toggleStates.autoSave}
                      onCheckedChange={handleToggleChange('autoSave')}
                    />
                    <span className={getToggleLabelColor()}>
                      Auto-save documents
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Switch 
                      checked={toggleStates.sync}
                      onCheckedChange={handleToggleChange('sync')}
                    />
                    <span className={getToggleLabelColor()}>
                      Cloud sync
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Label Position: Left */}
            <div>
              <h3 className="mb-4 transition-colors duration-300 text-slate-600">
                Label Position: Left
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <span className={getToggleLabelColor()}>
                      Privacy mode
                    </span>
                    <Switch 
                      checked={toggleStates.privacy}
                      onCheckedChange={handleToggleChange('privacy')}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className={getToggleLabelColor()}>
                      AI assistant
                    </span>
                    <Switch 
                      checked={toggleStates.aiAssist}
                      onCheckedChange={handleToggleChange('aiAssist')}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <span className={getToggleLabelColor()}>
                      Experimental features
                    </span>
                    <Switch 
                      checked={toggleStates.experimental}
                      onCheckedChange={handleToggleChange('experimental')}
                    />
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className={getToggleLabelColor()}>
                      Location services
                    </span>
                    <Switch 
                      checked={toggleStates.basic}
                      onCheckedChange={handleToggleChange('basic')}
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Check Toggle Styles */}
        <Card className={getCardStyles()}>
          <CardHeader>
            <CardTitle className="text-xl transition-colors duration-300 text-slate-800">
              Check Toggle Styles & Vertical Layouts
            </CardTitle>
            <CardDescription className="transition-colors duration-300 text-slate-600">
              Alternative toggle designs with checkbox styling and vertical orientations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Top Labels */}
            <div>
              <h3 className="mb-4 transition-colors duration-300 text-slate-600">
                Label Position: Top
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2 text-center">
                  <span className={getToggleLabelColor()}>
                    Power
                  </span>
                  <div className="flex justify-center">
                    <Switch 
                      checked={toggleStates.basic}
                      onCheckedChange={handleToggleChange('basic')}
                    />
                  </div>
                </div>

                <div className="space-y-2 text-center">
                  <span className={getToggleLabelColor()}>
                    Wi-Fi
                  </span>
                  <div className="flex justify-center">
                    <Switch 
                      checked={toggleStates.wifi}
                      onCheckedChange={handleToggleChange('wifi')}
                    />
                  </div>
                </div>

                <div className="space-y-2 text-center">
                  <span className={getToggleLabelColor()}>
                    Bluetooth
                  </span>
                  <div className="flex justify-center">
                    <Switch 
                      checked={toggleStates.sound}
                      onCheckedChange={handleToggleChange('sound')}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Labels */}
            <div>
              <h3 className="mb-4 transition-colors duration-300 text-slate-600">
                Label Position: Bottom
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2 text-center">
                  <div className="flex justify-center">
                    <Switch 
                      checked={toggleStates.notifications}
                      onCheckedChange={handleToggleChange('notifications')}
                    />
                  </div>
                  <span className={getToggleLabelColor()}>
                    Notifications
                  </span>
                </div>

                <div className="space-y-2 text-center">
                  <div className="flex justify-center">
                    <Switch 
                      checked={toggleStates.autoSave}
                      onCheckedChange={handleToggleChange('autoSave')}
                    />
                  </div>
                  <span className={getToggleLabelColor()}>
                    Auto-save
                  </span>
                </div>

                <div className="space-y-2 text-center">
                  <div className="flex justify-center">
                    <Switch 
                      checked={toggleStates.sync}
                      onCheckedChange={handleToggleChange('sync')}
                    />
                  </div>
                  <span className={getToggleLabelColor()}>
                    Cloud sync
                  </span>
                </div>
              </div>
            </div>

            {/* No Labels - Icon Only */}
            <div>
              <h3 className="mb-4 transition-colors duration-300 text-slate-600">
                No Labels - Icon Only Toggles
              </h3>
              <div className="flex justify-center space-x-8">
                <div className="p-4 rounded-lg border transition-all duration-300 bg-slate-50/50 border-slate-200">
                  <div className="flex items-center space-x-3">
                    <Power className={`h-4 w-4 ${getToggleLabelColor()}`} />
                    <Switch 
                      checked={toggleStates.basic}
                      onCheckedChange={handleToggleChange('basic')}
                    />
                  </div>
                </div>

                <div className="p-4 rounded-lg border transition-all duration-300 bg-slate-50/50 border-slate-200">
                  <div className="flex items-center space-x-3">
                    <Wifi className={`h-4 w-4 ${getToggleLabelColor()}`} />
                    <Switch 
                      checked={toggleStates.wifi}
                      onCheckedChange={handleToggleChange('wifi')}
                    />
                  </div>
                </div>

                <div className="p-4 rounded-lg border transition-all duration-300 bg-slate-50/50 border-slate-200">
                  <div className="flex items-center space-x-3">
                    <Volume2 className={`h-4 w-4 ${getToggleLabelColor()}`} />
                    <Switch 
                      checked={toggleStates.sound}
                      onCheckedChange={handleToggleChange('sound')}
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table Layout Toggles */}
        <Card className={getCardStyles()}>
          <CardHeader>
            <CardTitle className="text-xl transition-colors duration-300 text-slate-800">
              Table Layout - Settings & Preferences
            </CardTitle>
            <CardDescription className="transition-colors duration-300 text-slate-600">
              Toggle settings presented in a clean table format with descriptions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-hidden transition-colors duration-300 border-slate-200">
              <table className="w-full">
                <thead className="bg-slate-50/50">
                  <tr>
                    <th className="text-left px-6 py-3 transition-colors duration-300 text-slate-700">
                      Setting
                    </th>
                    <th className="text-right px-6 py-3 w-24 transition-colors duration-300 text-slate-700">
                      Enable
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y transition-colors duration-300 divide-slate-200">
                  <tr className="transition-colors duration-300 hover:bg-slate-50/30">
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className={getToggleLabelColor()}>
                          Email Notifications
                        </div>
                        <div className="text-sm transition-colors duration-300 text-slate-500">
                          Receive email updates about your account activity
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Switch 
                        checked={toggleStates.emailNotifications}
                        onCheckedChange={handleToggleChange('emailNotifications')}
                      />
                    </td>
                  </tr>
                  <tr className="transition-colors duration-300 hover:bg-slate-50/30">
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className={getToggleLabelColor()}>
                          Push Notifications
                        </div>
                        <div className="text-sm transition-colors duration-300 text-slate-500">
                          Get real-time push notifications on your device
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Switch 
                        checked={toggleStates.pushNotifications}
                        onCheckedChange={handleToggleChange('pushNotifications')}
                      />
                    </td>
                  </tr>
                  <tr className="transition-colors duration-300 hover:bg-slate-50/30">
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className={getToggleLabelColor()}>
                          SMS Alerts
                        </div>
                        <div className="text-sm transition-colors duration-300 text-slate-500">
                          Receive text message alerts for important events
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Switch 
                        checked={toggleStates.smsAlerts}
                        onCheckedChange={handleToggleChange('smsAlerts')}
                      />
                    </td>
                  </tr>
                  <tr className="transition-colors duration-300 hover:bg-slate-50/30">
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className={getToggleLabelColor()}>
                          Weekly Digest
                        </div>
                        <div className="text-sm transition-colors duration-300 text-slate-500">
                          Get a weekly summary of your activity and updates
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Switch 
                        checked={toggleStates.weeklyDigest}
                        onCheckedChange={handleToggleChange('weeklyDigest')}
                      />
                    </td>
                  </tr>
                  <tr className="transition-colors duration-300 hover:bg-slate-50/30">
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className={getToggleLabelColor()}>
                          Product Updates
                        </div>
                        <div className="text-sm transition-colors duration-300 text-slate-500">
                          Stay informed about new features and improvements
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Switch 
                        checked={toggleStates.productUpdates}
                        onCheckedChange={handleToggleChange('productUpdates')}
                      />
                    </td>
                  </tr>
                  <tr className="transition-colors duration-300 hover:bg-slate-50/30">
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className={getToggleLabelColor()}>
                          Security Alerts
                        </div>
                        <div className="text-sm transition-colors duration-300 text-slate-500">
                          Critical security notifications and warnings
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Switch 
                        checked={toggleStates.securityAlerts}
                        onCheckedChange={handleToggleChange('securityAlerts')}
                      />
                    </td>
                  </tr>
                  <tr className="transition-colors duration-300 hover:bg-slate-50/30">
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className={getToggleLabelColor()}>
                          Newsletter
                        </div>
                        <div className="text-sm transition-colors duration-300 text-slate-500">
                          Monthly newsletter with tips and best practices
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Switch 
                        checked={toggleStates.newsletter}
                        onCheckedChange={handleToggleChange('newsletter')}
                      />
                    </td>
                  </tr>
                  <tr className="transition-colors duration-300 hover:bg-slate-50/30">
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className={getToggleLabelColor()}>
                          Account Activity
                        </div>
                        <div className="text-sm transition-colors duration-300 text-slate-500">
                          Monitor and track all account-related activities
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Switch 
                        checked={toggleStates.accountActivity}
                        onCheckedChange={handleToggleChange('accountActivity')}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Expandable/Collapsible Layout */}
        <Card className={getCardStyles()}>
          <CardHeader>
            <CardTitle className="text-xl transition-colors duration-300 text-slate-800">
              Expandable/Collapsible Layout - Feature Modules
            </CardTitle>
            <CardDescription className="transition-colors duration-300 text-slate-600">
              Hierarchical toggle layout with expandable sections and nested settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {/* Sales Expert */}
              <div className="border rounded-lg overflow-hidden transition-colors duration-300 border-slate-200 bg-slate-50/30">
                <div className="px-4 py-3 flex items-center justify-between hover:bg-slate-50/50 transition-colors duration-200">
                  <div className="flex items-center gap-3 flex-1">
                    <button
                      onClick={() => toggleExpand('salesExpert')}
                      className="p-1 hover:bg-slate-200/50 rounded transition-colors"
                    >
                      <ChevronDown 
                        className={`h-4 w-4 text-slate-600 transition-transform duration-200 ${
                          expandedItems.salesExpert ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    <Target className="h-5 w-5 text-slate-600" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={getToggleLabelColor()}>Sales Expert</span>
                        <Badge variant="outline" className="px-2 py-0 text-xs border-green-400 text-green-600 bg-green-50">
                          Active
                        </Badge>
                      </div>
                      <div className="text-sm transition-colors duration-300 text-slate-500">
                        Specialized in lead qualification and pipeline management
                      </div>
                    </div>
                  </div>
                  <Switch 
                    checked={toggleStates.salesExpert}
                    onCheckedChange={handleToggleChange('salesExpert')}
                  />
                </div>
                {expandedItems.salesExpert && (
                  <div className="border-t transition-colors duration-300 border-slate-200 bg-white">
                    <div className="px-4 py-3 flex items-center justify-between hover:bg-slate-50/30 transition-colors">
                      <span className="text-sm pl-10 text-slate-700">Auto-Qualify Leads</span>
                      <Switch 
                        checked={toggleStates.autoQualifyLeads}
                        onCheckedChange={handleToggleChange('autoQualifyLeads')}
                      />
                    </div>
                    <div className="text-xs px-4 pb-3 pl-14 text-slate-500">
                      Automatically qualify incoming leads vs. suggest only
                    </div>
                    
                    <div className="px-4 py-3 flex items-center justify-between hover:bg-slate-50/30 transition-colors">
                      <span className="text-sm pl-10 text-slate-700">Pipeline Auto-Update</span>
                      <Switch 
                        checked={toggleStates.pipelineAutoUpdate}
                        onCheckedChange={handleToggleChange('pipelineAutoUpdate')}
                      />
                    </div>
                    <div className="text-xs px-4 pb-3 pl-14 text-slate-500">
                      Update pipeline stages automatically vs. recommend changes
                    </div>

                    <div className="px-4 py-3 flex items-center justify-between hover:bg-slate-50/30 transition-colors">
                      <span className="text-sm pl-10 text-slate-700">Notify on High-Value Opportunities</span>
                      <Switch 
                        checked={toggleStates.notifyHighValue}
                        onCheckedChange={handleToggleChange('notifyHighValue')}
                      />
                    </div>
                    <div className="text-xs px-4 pb-3 pl-14 text-slate-500">
                      Alert threshold for significant deals
                    </div>

                    <div className="px-4 py-3 flex items-center justify-between hover:bg-slate-50/30 transition-colors">
                      <span className="text-sm pl-10 text-slate-700">Minimum Lead Score Threshold</span>
                      <Switch 
                        checked={toggleStates.minLeadScore}
                        onCheckedChange={handleToggleChange('minLeadScore')}
                      />
                    </div>
                    <div className="text-xs px-4 pb-3 pl-14 text-slate-500">
                      Set qualification criteria
                    </div>
                  </div>
                )}
              </div>

              {/* Lead Analyzer */}
              <div className="border rounded-lg overflow-hidden transition-colors duration-300 border-slate-200 bg-slate-50/30">
                <div className="px-4 py-3 flex items-center justify-between hover:bg-slate-50/50 transition-colors duration-200">
                  <div className="flex items-center gap-3 flex-1">
                    <button
                      onClick={() => toggleExpand('leadAnalyzer')}
                      className="p-1 hover:bg-slate-200/50 rounded transition-colors"
                    >
                      <ChevronDown 
                        className={`h-4 w-4 text-slate-600 transition-transform duration-200 ${
                          expandedItems.leadAnalyzer ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    <BarChart className="h-5 w-5 text-slate-600" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={getToggleLabelColor()}>Lead Analyzer</span>
                        <Badge variant="outline" className="px-2 py-0 text-xs border-green-400 text-green-600 bg-green-50">
                          Active
                        </Badge>
                      </div>
                      <div className="text-sm transition-colors duration-300 text-slate-500">
                        AI-powered lead scoring and prioritization
                      </div>
                    </div>
                  </div>
                  <Switch 
                    checked={toggleStates.leadAnalyzer}
                    onCheckedChange={handleToggleChange('leadAnalyzer')}
                  />
                </div>
                {expandedItems.leadAnalyzer && (
                  <div className="border-t transition-colors duration-300 border-slate-200 bg-white">
                    <div className="px-4 py-3 flex items-center justify-between hover:bg-slate-50/30 transition-colors">
                      <span className="text-sm pl-10 text-slate-700">Auto-Score New Leads</span>
                      <Switch 
                        checked={toggleStates.autoScoreLeads}
                        onCheckedChange={handleToggleChange('autoScoreLeads')}
                      />
                    </div>
                    <div className="text-xs px-4 pb-3 pl-14 text-slate-500">
                      Score immediately on creation vs. manual trigger
                    </div>
                    
                    <div className="px-4 py-3 flex items-center justify-between hover:bg-slate-50/30 transition-colors">
                      <span className="text-sm pl-10 text-slate-700">Continuous Re-Scoring</span>
                      <Switch 
                        checked={toggleStates.continuousReScoring}
                        onCheckedChange={handleToggleChange('continuousReScoring')}
                      />
                    </div>
                    <div className="text-xs px-4 pb-3 pl-14 text-slate-500">
                      Refresh scores periodically vs. one-time scoring
                    </div>

                    <div className="px-4 py-3 flex items-center justify-between hover:bg-slate-50/30 transition-colors">
                      <span className="text-sm pl-10 text-slate-700">Priority Alerts</span>
                      <Switch 
                        checked={toggleStates.priorityAlerts}
                        onCheckedChange={handleToggleChange('priorityAlerts')}
                      />
                    </div>
                    <div className="text-xs px-4 pb-3 pl-14 text-slate-500">
                      Notify on high-priority leads
                    </div>

                    <div className="px-4 py-3 flex items-center justify-between hover:bg-slate-50/30 transition-colors">
                      <span className="text-sm pl-10 text-slate-700">Score Visibility</span>
                      <Switch 
                        checked={toggleStates.scoreVisibility}
                        onCheckedChange={handleToggleChange('scoreVisibility')}
                      />
                    </div>
                    <div className="text-xs px-4 pb-3 pl-14 text-slate-500">
                      Share scores with team vs. rep-only
                    </div>
                  </div>
                )}
              </div>

              {/* Follow-up Manager */}
              <div className="border rounded-lg overflow-hidden transition-colors duration-300 border-slate-200 bg-slate-50/30">
                <div className="px-4 py-3 flex items-center justify-between hover:bg-slate-50/50 transition-colors duration-200">
                  <div className="flex items-center gap-3 flex-1">
                    <button
                      onClick={() => toggleExpand('followUpManager')}
                      className="p-1 hover:bg-slate-200/50 rounded transition-colors"
                    >
                      <ChevronDown 
                        className={`h-4 w-4 text-slate-600 transition-transform duration-200 ${
                          expandedItems.followUpManager ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    <MessageSquare className="h-5 w-5 text-slate-600" />
                    <div className="flex-1">
                      <span className={getToggleLabelColor()}>Follow-up Manager</span>
                      <div className="text-sm transition-colors duration-300 text-slate-500">
                        Automate and optimize customer follow-ups
                      </div>
                    </div>
                  </div>
                  <Switch 
                    checked={toggleStates.followUpManager}
                    onCheckedChange={handleToggleChange('followUpManager')}
                  />
                </div>
                {expandedItems.followUpManager && (
                  <div className="border-t transition-colors duration-300 border-slate-200 bg-white">
                    <div className="px-4 py-3 flex items-center justify-between hover:bg-slate-50/30 transition-colors">
                      <span className="text-sm pl-10 text-slate-700">Auto-Send Follow-Ups</span>
                      <Switch 
                        checked={toggleStates.autoSendFollowUps}
                        onCheckedChange={handleToggleChange('autoSendFollowUps')}
                      />
                    </div>
                    <div className="text-xs px-4 pb-3 pl-14 text-slate-500">
                      Send automatically vs. draft for review
                    </div>

                    <div className="px-4 py-3 flex items-center justify-between hover:bg-slate-50/30 transition-colors">
                      <span className="text-sm pl-10 text-slate-700">Business Hours Only</span>
                      <Switch 
                        checked={toggleStates.businessHoursOnly}
                        onCheckedChange={handleToggleChange('businessHoursOnly')}
                      />
                    </div>
                    <div className="text-xs px-4 pb-3 pl-14 text-slate-500">
                      Respect working hours
                    </div>

                    <div className="px-4 py-3 flex items-center justify-between hover:bg-slate-50/30 transition-colors">
                      <span className="text-sm pl-10 text-slate-700">Follow-Up Cadence</span>
                      <Switch 
                        checked={toggleStates.followUpCadence}
                        onCheckedChange={handleToggleChange('followUpCadence')}
                      />
                    </div>
                    <div className="text-xs px-4 pb-3 pl-14 text-slate-500">
                      Timing intervals (daily, weekly, custom)
                    </div>

                    <div className="px-4 py-3 flex items-center justify-between hover:bg-slate-50/30 transition-colors">
                      <span className="text-sm pl-10 text-slate-700">Skip on Manual Activity</span>
                      <Switch 
                        checked={toggleStates.skipManualActivity}
                        onCheckedChange={handleToggleChange('skipManualActivity')}
                      />
                    </div>
                    <div className="text-xs px-4 pb-3 pl-14 text-slate-500">
                      Pause if rep engages manually
                    </div>
                  </div>
                )}
              </div>

              {/* Territory Specialist */}
              <div className="border rounded-lg overflow-hidden transition-colors duration-300 border-slate-200 bg-slate-50/30">
                <div className="px-4 py-3 flex items-center justify-between hover:bg-slate-50/50 transition-colors duration-200">
                  <div className="flex items-center gap-3 flex-1">
                    <button
                      onClick={() => toggleExpand('territorySpecialist')}
                      className="p-1 hover:bg-slate-200/50 rounded transition-colors"
                    >
                      <ChevronDown 
                        className={`h-4 w-4 text-slate-600 transition-transform duration-200 ${
                          expandedItems.territorySpecialist ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    <Target className="h-5 w-5 text-slate-600" />
                    <div className="flex-1">
                      <span className={getToggleLabelColor()}>Territory Specialist</span>
                      <div className="text-sm transition-colors duration-300 text-slate-500">
                        Regional sales insights and performance tracking
                      </div>
                    </div>
                  </div>
                  <Switch 
                    checked={toggleStates.territorySpecialist}
                    onCheckedChange={handleToggleChange('territorySpecialist')}
                  />
                </div>
                {expandedItems.territorySpecialist && (
                  <div className="border-t transition-colors duration-300 border-slate-200 bg-white">
                    <div className="px-4 py-3 flex items-center justify-between hover:bg-slate-50/30 transition-colors">
                      <span className="text-sm pl-10 text-slate-700">Auto-Generate Reports</span>
                      <Switch 
                        checked={toggleStates.autoGenerateReports}
                        onCheckedChange={handleToggleChange('autoGenerateReports')}
                      />
                    </div>
                    <div className="text-xs px-4 pb-3 pl-14 text-slate-500">
                      Scheduled vs. on-demand
                    </div>
                    
                    <div className="px-4 py-3 flex items-center justify-between hover:bg-slate-50/30 transition-colors">
                      <span className="text-sm pl-10 text-slate-700">Performance Alerts</span>
                      <Switch 
                        checked={toggleStates.performanceAlerts}
                        onCheckedChange={handleToggleChange('performanceAlerts')}
                      />
                    </div>
                    <div className="text-xs px-4 pb-3 pl-14 text-slate-500">
                      Notify on territory anomalies
                    </div>

                    <div className="px-4 py-3 flex items-center justify-between hover:bg-slate-50/30 transition-colors">
                      <span className="text-sm pl-10 text-slate-700">Competitive Benchmarking</span>
                      <Switch 
                        checked={toggleStates.competitiveBenchmarking}
                        onCheckedChange={handleToggleChange('competitiveBenchmarking')}
                      />
                    </div>
                    <div className="text-xs px-4 pb-3 pl-14 text-slate-500">
                      Compare territories
                    </div>

                    <div className="px-4 py-3 flex items-center justify-between hover:bg-slate-50/30 transition-colors">
                      <span className="text-sm pl-10 text-slate-700">Real-Time Updates</span>
                      <Switch 
                        checked={toggleStates.realTimeUpdates}
                        onCheckedChange={handleToggleChange('realTimeUpdates')}
                      />
                    </div>
                    <div className="text-xs px-4 pb-3 pl-14 text-slate-500">
                      Live data vs. daily refresh
                    </div>
                  </div>
                )}
              </div>

              {/* Deal Closer */}
              <div className="border rounded-lg overflow-hidden transition-colors duration-300 border-slate-200 bg-slate-50/30">
                <div className="px-4 py-3 flex items-center justify-between hover:bg-slate-50/50 transition-colors duration-200">
                  <div className="flex items-center gap-3 flex-1">
                    <button
                      onClick={() => toggleExpand('dealCloser')}
                      className="p-1 hover:bg-slate-200/50 rounded transition-colors"
                    >
                      <ChevronDown 
                        className={`h-4 w-4 text-slate-600 transition-transform duration-200 ${
                          expandedItems.dealCloser ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    <Award className="h-5 w-5 text-slate-600" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={getToggleLabelColor()}>Deal Closer</span>
                        <Badge variant="outline" className="px-2 py-0 text-xs border-green-400 text-green-600 bg-green-50">
                          Active
                        </Badge>
                      </div>
                      <div className="text-sm transition-colors duration-300 text-slate-500">
                        Strategies and tactics for closing deals
                      </div>
                    </div>
                  </div>
                  <Switch 
                    checked={toggleStates.dealCloser}
                    onCheckedChange={handleToggleChange('dealCloser')}
                  />
                </div>
                {expandedItems.dealCloser && (
                  <div className="border-t transition-colors duration-300 border-slate-200 bg-white">
                    <div className="px-4 py-3 flex items-center justify-between hover:bg-slate-50/30 transition-colors">
                      <span className="text-sm pl-10 text-slate-700">Auto-Suggest Next Steps</span>
                      <Switch 
                        checked={toggleStates.autoSuggestNextSteps}
                        onCheckedChange={handleToggleChange('autoSuggestNextSteps')}
                      />
                    </div>
                    <div className="text-xs px-4 pb-3 pl-14 text-slate-500">
                      Proactive recommendations vs. query-based
                    </div>
                    
                    <div className="px-4 py-3 flex items-center justify-between hover:bg-slate-50/30 transition-colors">
                      <span className="text-sm pl-10 text-slate-700">Risk Alert Level</span>
                      <Switch 
                        checked={toggleStates.riskAlertLevel}
                        onCheckedChange={handleToggleChange('riskAlertLevel')}
                      />
                    </div>
                    <div className="text-xs px-4 pb-3 pl-14 text-slate-500">
                      Sensitivity for at-risk deals
                    </div>

                    <div className="px-4 py-3 flex items-center justify-between hover:bg-slate-50/30 transition-colors">
                      <span className="text-sm pl-10 text-slate-700">Stage-Specific Tactics</span>
                      <Switch 
                        checked={toggleStates.stageSpecificTactics}
                        onCheckedChange={handleToggleChange('stageSpecificTactics')}
                      />
                    </div>
                    <div className="text-xs px-4 pb-3 pl-14 text-slate-500">
                      Customize by opportunity stage
                    </div>

                    <div className="px-4 py-3 flex items-center justify-between hover:bg-slate-50/30 transition-colors">
                      <span className="text-sm pl-10 text-slate-700">Approval Required</span>
                      <Switch 
                        checked={toggleStates.approvalRequired}
                        onCheckedChange={handleToggleChange('approvalRequired')}
                      />
                    </div>
                    <div className="text-xs px-4 pb-3 pl-14 text-slate-500">
                      Review suggestions before applying
                    </div>
                  </div>
                )}
              </div>

              {/* Performance Coach */}
              <div className="border rounded-lg overflow-hidden transition-colors duration-300 border-slate-200 bg-slate-50/30">
                <div className="px-4 py-3 flex items-center justify-between hover:bg-slate-50/50 transition-colors duration-200">
                  <div className="flex items-center gap-3 flex-1">
                    <button
                      onClick={() => toggleExpand('performanceCoach')}
                      className="p-1 hover:bg-slate-200/50 rounded transition-colors"
                    >
                      <ChevronDown 
                        className={`h-4 w-4 text-slate-600 transition-transform duration-200 ${
                          expandedItems.performanceCoach ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    <TrendingUp className="h-5 w-5 text-slate-600" />
                    <div className="flex-1">
                      <span className={getToggleLabelColor()}>Performance Coach</span>
                      <div className="text-sm transition-colors duration-300 text-slate-500">
                        Personalized coaching based on your metrics
                      </div>
                    </div>
                  </div>
                  <Switch 
                    checked={toggleStates.performanceCoach}
                    onCheckedChange={handleToggleChange('performanceCoach')}
                  />
                </div>
                {expandedItems.performanceCoach && (
                  <div className="border-t transition-colors duration-300 border-slate-200 bg-white">
                    <div className="px-4 py-3 flex items-center justify-between hover:bg-slate-50/30 transition-colors">
                      <span className="text-sm pl-10 text-slate-700">Proactive Coaching</span>
                      <Switch 
                        checked={toggleStates.proactiveCoaching}
                        onCheckedChange={handleToggleChange('proactiveCoaching')}
                      />
                    </div>
                    <div className="text-xs px-4 pb-3 pl-14 text-slate-500">
                      Push suggestions vs. pull on-demand
                    </div>
                    
                    <div className="px-4 py-3 flex items-center justify-between hover:bg-slate-50/30 transition-colors">
                      <span className="text-sm pl-10 text-slate-700">Privacy Level</span>
                      <Switch 
                        checked={toggleStates.privacyLevel}
                        onCheckedChange={handleToggleChange('privacyLevel')}
                      />
                    </div>
                    <div className="text-xs px-4 pb-3 pl-14 text-slate-500">
                      Individual-only vs. team visibility
                    </div>

                    <div className="px-4 py-3 flex items-center justify-between hover:bg-slate-50/30 transition-colors">
                      <span className="text-sm pl-10 text-slate-700">Coaching Frequency</span>
                      <Switch 
                        checked={toggleStates.coachingFrequency}
                        onCheckedChange={handleToggleChange('coachingFrequency')}
                      />
                    </div>
                    <div className="text-xs px-4 pb-3 pl-14 text-slate-500">
                      Daily, weekly, or milestone-based
                    </div>

                    <div className="px-4 py-3 flex items-center justify-between hover:bg-slate-50/30 transition-colors">
                      <span className="text-sm pl-10 text-slate-700">Benchmark Comparisons</span>
                      <Switch 
                        checked={toggleStates.benchmarkComparisons}
                        onCheckedChange={handleToggleChange('benchmarkComparisons')}
                      />
                    </div>
                    <div className="text-xs px-4 pb-3 pl-14 text-slate-500">
                      Compare to team/region/company
                    </div>
                  </div>
                )}
              </div>

              {/* Customer Insights */}
              <div className="border rounded-lg overflow-hidden transition-colors duration-300 border-slate-200 bg-slate-50/30">
                <div className="px-4 py-3 flex items-center justify-between hover:bg-slate-50/50 transition-colors duration-200">
                  <div className="flex items-center gap-3 flex-1">
                    <button
                      onClick={() => toggleExpand('customerInsights')}
                      className="p-1 hover:bg-slate-200/50 rounded transition-colors"
                    >
                      <ChevronDown 
                        className={`h-4 w-4 text-slate-600 transition-transform duration-200 ${
                          expandedItems.customerInsights ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    <Star className="h-5 w-5 text-slate-600" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={getToggleLabelColor()}>Customer Insights</span>
                        <Badge variant="outline" className="px-2 py-0 text-xs border-green-400 text-green-600 bg-green-50">
                          Active
                        </Badge>
                      </div>
                      <div className="text-sm transition-colors duration-300 text-slate-500">
                        Deep analysis of customer behavior and trends
                      </div>
                    </div>
                  </div>
                  <Switch 
                    checked={toggleStates.customerInsights}
                    onCheckedChange={handleToggleChange('customerInsights')}
                  />
                </div>
                {expandedItems.customerInsights && (
                  <div className="border-t transition-colors duration-300 border-slate-200 bg-white">
                    <div className="px-4 py-3 flex items-center justify-between hover:bg-slate-50/30 transition-colors">
                      <span className="text-sm pl-10 text-slate-700">Auto-Generate Insights</span>
                      <Switch 
                        checked={toggleStates.autoGenerateInsights}
                        onCheckedChange={handleToggleChange('autoGenerateInsights')}
                      />
                    </div>
                    <div className="text-xs px-4 pb-3 pl-14 text-slate-500">
                      Continuous analysis vs. manual
                    </div>
                    
                    <div className="px-4 py-3 flex items-center justify-between hover:bg-slate-50/30 transition-colors">
                      <span className="text-sm pl-10 text-slate-700">Behavior Change Alerts</span>
                      <Switch 
                        checked={toggleStates.behaviorChangeAlerts}
                        onCheckedChange={handleToggleChange('behaviorChangeAlerts')}
                      />
                    </div>
                    <div className="text-xs px-4 pb-3 pl-14 text-slate-500">
                      Notify on significant shifts
                    </div>

                    <div className="px-4 py-3 flex items-center justify-between hover:bg-slate-50/30 transition-colors">
                      <span className="text-sm pl-10 text-slate-700">Analysis Depth</span>
                      <Switch 
                        checked={toggleStates.analysisDepth}
                        onCheckedChange={handleToggleChange('analysisDepth')}
                      />
                    </div>
                    <div className="text-xs px-4 pb-3 pl-14 text-slate-500">
                      30/60/90-day or custom time frames
                    </div>

                    <div className="px-4 py-3 flex items-center justify-between hover:bg-slate-50/30 transition-colors">
                      <span className="text-sm pl-10 text-slate-700">Segment Filtering</span>
                      <Switch 
                        checked={toggleStates.segmentFiltering}
                        onCheckedChange={handleToggleChange('segmentFiltering')}
                      />
                    </div>
                    <div className="text-xs px-4 pb-3 pl-14 text-slate-500">
                      Focus on specific customer types
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Response */}
              <div className="border rounded-lg overflow-hidden transition-colors duration-300 border-slate-200 bg-slate-50/30">
                <div className="px-4 py-3 flex items-center justify-between hover:bg-slate-50/50 transition-colors duration-200">
                  <div className="flex items-center gap-3 flex-1">
                    <button
                      onClick={() => toggleExpand('quickResponse')}
                      className="p-1 hover:bg-slate-200/50 rounded transition-colors"
                    >
                      <ChevronDown 
                        className={`h-4 w-4 text-slate-600 transition-transform duration-200 ${
                          expandedItems.quickResponse ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    <Zap className="h-5 w-5 text-slate-600" />
                    <div className="flex-1">
                      <span className={getToggleLabelColor()}>Quick Response</span>
                      <div className="text-sm transition-colors duration-300 text-slate-500">
                        Rapid responses for time-sensitive inquiries
                      </div>
                    </div>
                  </div>
                  <Switch 
                    checked={toggleStates.quickResponse}
                    onCheckedChange={handleToggleChange('quickResponse')}
                  />
                </div>
                {expandedItems.quickResponse && (
                  <div className="border-t transition-colors duration-300 border-slate-200 bg-white">
                    <div className="px-4 py-3 flex items-center justify-between hover:bg-slate-50/30 transition-colors">
                      <span className="text-sm pl-10 text-slate-700">Auto-Reply</span>
                      <Switch 
                        checked={toggleStates.autoReply}
                        onCheckedChange={handleToggleChange('autoReply')}
                      />
                    </div>
                    <div className="text-xs px-4 pb-3 pl-14 text-slate-500">
                      Send immediately vs. draft for review
                    </div>
                    
                    <div className="px-4 py-3 flex items-center justify-between hover:bg-slate-50/30 transition-colors">
                      <span className="text-sm pl-10 text-slate-700">Approval Workflow</span>
                      <Switch 
                        checked={toggleStates.approvalWorkflow}
                        onCheckedChange={handleToggleChange('approvalWorkflow')}
                      />
                    </div>
                    <div className="text-xs px-4 pb-3 pl-14 text-slate-500">
                      Require review for certain scenarios
                    </div>

                    <div className="px-4 py-3 flex items-center justify-between hover:bg-slate-50/30 transition-colors">
                      <span className="text-sm pl-10 text-slate-700">Business Hours Only</span>
                      <Switch 
                        checked={toggleStates.businessHoursOnlyQuick}
                        onCheckedChange={handleToggleChange('businessHoursOnlyQuick')}
                      />
                    </div>
                    <div className="text-xs px-4 pb-3 pl-14 text-slate-500">
                      Queue off-hours messages
                    </div>

                    <div className="px-4 py-3 flex items-center justify-between hover:bg-slate-50/30 transition-colors">
                      <span className="text-sm pl-10 text-slate-700">Escalation Rules</span>
                      <Switch 
                        checked={toggleStates.escalationRules}
                        onCheckedChange={handleToggleChange('escalationRules')}
                      />
                    </div>
                    <div className="text-xs px-4 pb-3 pl-14 text-slate-500">
                      Auto-escalate complex queries
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}