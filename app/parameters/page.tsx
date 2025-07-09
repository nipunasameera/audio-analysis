"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Settings, Brain, FileText, BarChart3, Users, MessageSquare, Play } from "lucide-react"
//import { getTheTranscript } from "@/lib/analysis"
import { useUploadStore } from "@/hooks/useUpload"

import { useRouter } from "next/navigation"

import { RingLoader } from "react-spinners";

export default function ParametersPage() {

  const { analysis, isProcessing, done } = useUploadStore();

  const router = useRouter();

  const [selectedParameters, setSelectedParameters] = useState<{
    transcript: boolean;
    sentiment: boolean;
    entities: boolean;
    summary: boolean;
    topics: boolean;
    topics_summary: boolean;
    emotions: boolean;
    speakers: boolean;
    keywords: boolean;
  }>({
    transcript: true,
    sentiment: true,
    entities: false,
    summary: true,
    topics: false,
    topics_summary: false,
    emotions: false,
    speakers: false,
    keywords: false,
  })

  const [advancedSettings, setAdvancedSettings] = useState({
    confidence: [75],
    language: "auto",
    model: "neural-v3",
    chunkSize: "30s",
  })

  const handleParameterChange = (param: string, checked: boolean) => {
    setSelectedParameters((prev) => ({
      ...prev,
      [param]: checked,
    }))
  }

  const parameters = [
    {
      id: "transcript",
      label: "Speech-to-Text Transcript",
      description: "Convert audio to text with timestamps",
      icon: <FileText className="w-5 h-5" />,
      category: "core",
      estimatedTime: "2-5 min",
    },
    {
      id: "sentiment",
      label: "Sentiment Analysis",
      description: "Analyze emotional tone and polarity",
      icon: <BarChart3 className="w-5 h-5" />,
      category: "core",
      estimatedTime: "1-2 min",
    },
    {
      id: "entities",
      label: "Named Entity Recognition",
      description: "Identify people, places, organizations",
      icon: <Users className="w-5 h-5" />,
      category: "advanced",
      estimatedTime: "1-3 min",
    },
    {
      id: "summary",
      label: "Document Summary",
      description: "Generate concise summary of content",
      icon: <FileText className="w-5 h-5" />,
      category: "core",
      estimatedTime: "1-2 min",
    },
    {
      id: "topics",
      label: "Topic Modeling",
      description: "Extract main themes and topics",
      icon: <Brain className="w-5 h-5" />,
      category: "advanced",
      estimatedTime: "2-4 min",
    },
    {
      id: "emotions",
      label: "Emotion Detection",
      description: "Detect specific emotions (joy, anger, fear, etc.)",
      icon: <MessageSquare className="w-5 h-5" />,
      category: "advanced",
      estimatedTime: "1-3 min",
    },
    {
      id: "topics_summary",
      label: "Topics Summary",
      description: "Generate concise summary of topics",
      icon: <FileText className="w-5 h-5" />,
      category: "advanced",
      estimatedTime: "3-6 min",
    },
    {
      id: "keywords",
      label: "Keyword Extraction",
      description: "Extract important keywords and phrases",
      icon: <Settings className="w-5 h-5" />,
      category: "advanced",
      estimatedTime: "1 min",
    },
  ]

  const selectedCount = Object.values(selectedParameters).filter(Boolean).length

  const estimatedTime = parameters
    .filter((p) => selectedParameters[p.id as keyof typeof selectedParameters])
    .reduce((total, p) => {
      const time = Number.parseInt(p.estimatedTime.split("-")[1] || p.estimatedTime.split(" ")[0])
      return total + time
    }, 0)

  const startAnalysis = async () => {
    
    const fileUrl = sessionStorage.getItem("fileUrl");
    
    if (!fileUrl) {
      console.error("No file URL found");
      return;
    }

    await analysis(fileUrl, selectedParameters);

    // const emotion = await getEmotion("I'm really happy with my life");
    // console.log("emotion", emotion);
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">

        <div>
          <h1 className="text-2xl font-bold text-white tracking-wider">ANALYSIS PARAMETERS</h1>
          <p className="text-sm text-neutral-400">Configure AI models and analysis options</p>
        </div>

        <div className="flex flex-row items-center justify-end gap-14 w-[50%]">

          {isProcessing && (
            <div className=" flex flex-col text-sm text-neutral-400 items-center justify-center gap-2">
              <RingLoader color="#ff7300" size={50} />
              <span className="text-white font-mono">Processing...</span>
            </div>
          )}

          {done && !isProcessing && (
            <div className=" flex flex-col text-sm text-neutral-400 items-center justify-center gap-2">
              <span className="text-white font-mono">Processing Completed</span>
            </div>
          )}

          <div className="flex gap-2">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white cursor-pointer" onClick={() => {
              if (!isProcessing && !done) {
                startAnalysis();
              } else if (!isProcessing && done) {
                router.push("/results");
              } else {
                console.log("Processing already in progress");
              }
            }} disabled={isProcessing}>
              <Play className="w-4 h-4 mr-2" />
              {!isProcessing && !done ? "Start Analysis" : !isProcessing && done ? "Go to Results" : "Processing..."}
            </Button>
          </div>
        </div>


      </div>

      {/* Selection Summary */}
      <Card className="bg-neutral-900 border-neutral-700">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="text-sm text-neutral-400">
                Selected: <span className="text-white font-mono">{selectedCount}</span> parameters
              </div>
              <div className="text-sm text-neutral-400">
                Est. Time: <span className="text-orange-500 font-mono">{estimatedTime}</span> minutes
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setSelectedParameters({
                    transcript: true,
                    sentiment: true,
                    entities: true,
                    summary: true,
                    topics: true,
                    topics_summary: true,
                    emotions: true,
                    speakers: true,
                    keywords: true,
                  })
                }
                className="border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent"
              >
                Select All
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setSelectedParameters({
                    transcript: false,
                    sentiment: false,
                    entities: false,
                    summary: false,
                    topics: false,
                    topics_summary: false,
                    emotions: false,
                    speakers: false,
                    keywords: false,
                  })
                }
                className="border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent"
              >
                Clear All
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Parameter Selection */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Core Parameters */}
        <Card className="bg-neutral-900 border-neutral-700">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">CORE ANALYSIS</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {parameters
              .filter((p) => p.category === "core")
              .map((param) => (
                <div
                  key={param.id}
                  className="flex items-start space-x-3 p-3 rounded border border-neutral-700 hover:border-orange-500/50 transition-colors"
                >
                  <Checkbox
                    id={param.id}
                    checked={selectedParameters[param.id as keyof typeof selectedParameters]}
                    onCheckedChange={(checked) => handleParameterChange(param.id, checked as boolean)}
                    className="mt-1"
                  />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="text-orange-500">{param.icon}</div>
                      <label htmlFor={param.id} className="text-sm font-medium text-white cursor-pointer">
                        {param.label}
                      </label>
                      <Badge className="bg-orange-500/20 text-orange-500 text-xs">{param.estimatedTime}</Badge>
                    </div>
                    <p className="text-xs text-neutral-400">{param.description}</p>
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>

        {/* Advanced Parameters */}
        <Card className="bg-neutral-900 border-neutral-700">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">ADVANCED ANALYSIS</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {parameters
              .filter((p) => p.category === "advanced")
              .map((param) => (
                <div
                  key={param.id}
                  className="flex items-start space-x-3 p-3 rounded border border-neutral-700 hover:border-orange-500/50 transition-colors"
                >
                  <Checkbox
                    id={param.id}
                    checked={selectedParameters[param.id as keyof typeof selectedParameters]}
                    onCheckedChange={(checked) => handleParameterChange(param.id, checked as boolean)}
                    className="mt-1"
                  />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="text-orange-500">{param.icon}</div>
                      <label htmlFor={param.id} className="text-sm font-medium text-white cursor-pointer">
                        {param.label}
                      </label>
                      <Badge className="bg-neutral-500/20 text-neutral-300 text-xs">{param.estimatedTime}</Badge>
                    </div>
                    <p className="text-xs text-neutral-400">{param.description}</p>
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>
      </div>

      {/* Basic Parameters */}
      {/* <Card className="bg-neutral-900 border-neutral-700">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">BASIC ANALYSIS</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {parameters
              .filter((p) => p.category === "basic")
              .map((param) => (
                <div
                  key={param.id}
                  className="flex items-start space-x-3 p-3 rounded border border-neutral-700 hover:border-orange-500/50 transition-colors"
                >
                  <Checkbox
                    id={param.id}
                    checked={selectedParameters[param.id as keyof typeof selectedParameters]}
                    onCheckedChange={(checked) => handleParameterChange(param.id, checked as boolean)}
                    className="mt-1"
                  />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="text-orange-500">{param.icon}</div>
                      <label htmlFor={param.id} className="text-sm font-medium text-white cursor-pointer">
                        {param.label}
                      </label>
                    </div>
                    <p className="text-xs text-neutral-400">{param.description}</p>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card> */}

      {/* Advanced Settings */}
      <Card className="bg-neutral-900 border-neutral-700">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">ADVANCED SETTINGS</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-white mb-2 block">Confidence Threshold</label>
                <div className="space-y-2">
                  <Slider
                    value={advancedSettings.confidence}
                    onValueChange={(value) => setAdvancedSettings((prev) => ({ ...prev, confidence: value }))}
                    max={100}
                    min={50}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-neutral-400">
                    <span>50%</span>
                    <span className="text-white font-mono">{advancedSettings.confidence[0]}%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-white mb-2 block">Language Detection</label>
                <Select
                  value={advancedSettings.language}
                  onValueChange={(value) => setAdvancedSettings((prev) => ({ ...prev, language: value }))}
                >
                  <SelectTrigger className="bg-neutral-800 border-neutral-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-neutral-800 border-neutral-600">
                    <SelectItem value="auto">Auto-detect</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                    <SelectItem value="it">Italian</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-white mb-2 block">AI Model</label>
                <Select
                  value={advancedSettings.model}
                  onValueChange={(value) => setAdvancedSettings((prev) => ({ ...prev, model: value }))}
                >
                  <SelectTrigger className="bg-neutral-800 border-neutral-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-neutral-800 border-neutral-600">
                    <SelectItem value="neural-v3">Neural v3.0 (Recommended)</SelectItem>
                    <SelectItem value="neural-v2">Neural v2.1</SelectItem>
                    <SelectItem value="transformer">Transformer Base</SelectItem>
                    <SelectItem value="fast">Fast Processing</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-white mb-2 block">Processing Chunk Size</label>
                <Select
                  value={advancedSettings.chunkSize}
                  onValueChange={(value) => setAdvancedSettings((prev) => ({ ...prev, chunkSize: value }))}
                >
                  <SelectTrigger className="bg-neutral-800 border-neutral-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-neutral-800 border-neutral-600">
                    <SelectItem value="15s">15 seconds</SelectItem>
                    <SelectItem value="30s">30 seconds</SelectItem>
                    <SelectItem value="60s">1 minute</SelectItem>
                    <SelectItem value="120s">2 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
