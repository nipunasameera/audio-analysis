"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progressRadix"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  FileText,
  BarChart3,
  Users,
  Brain,
  Download,
  Share2,
  Play,
  Pause,
  TrendingUp,
  TrendingDown,
  Minus,
  Import
} from "lucide-react"
import { useUploadStore } from "@/hooks/useUpload"
import PieChart from "@/components/ui/PieChart"
import DoughnutChart from "@/components/ui/Doughnut"

const emotionToEmoji = {
  admiration: "🌟",
  amusement: "😂",
  anger: "😠",
  annoyance: "😒",
  approval: "👍",
  caring: "🤗",
  confusion: "😕",
  curiosity: "🧐",
  desire: "😍",
  disappointment: "😞",
  disapproval: "👎",
  disgust: "🤢",
  embarrassment: "😳",
  excitement: "🤩",
  fear: "😨",
  gratitude: "🙏",
  grief: "💔",
  joy: "😊",
  love: "❤️",
  nervousness: "😬",
  optimism: "🌈",
  pride: "😌",
  realization: "💡",
  relief: "😌",
  remorse: "😔",
  sadness: "😢",
  surprise: "😲",
  neutral: "😐"
};

export default function ResultsPage() {
  const [isPlaying, setIsPlaying] = useState(false)
  const { transcript, summary, sentiment, entities, topics, topics_summary, highlights, setData, emotions } = useUploadStore();

  // Mock data for demonstration
  // const analysisResults = {
  //   transcript: {
  //     text: "Hello, welcome to our quarterly business review. Today we'll be discussing our performance metrics and future strategies. I'm excited to share some positive developments in our sales department. However, we do need to address some challenges in our customer service area. Overall, I believe we're moving in the right direction and I'm optimistic about our future prospects.",
  //     segments: [
  //       { start: 0, end: 5, text: "Hello, welcome to our quarterly business review.", speaker: "Speaker 1" },
  //       {
  //         start: 5,
  //         end: 12,
  //         text: "Today we'll be discussing our performance metrics and future strategies.",
  //         speaker: "Speaker 1",
  //       },
  //       {
  //         start: 12,
  //         end: 18,
  //         text: "I'm excited to share some positive developments in our sales department.",
  //         speaker: "Speaker 1",
  //       },
  //       {
  //         start: 18,
  //         end: 25,
  //         text: "However, we do need to address some challenges in our customer service area.",
  //         speaker: "Speaker 1",
  //       },
  //       {
  //         start: 25,
  //         end: 32,
  //         text: "Overall, I believe we're moving in the right direction and I'm optimistic about our future prospects.",
  //         speaker: "Speaker 1",
  //       },
  //     ],
  //   },
  //   sentiment: {
  //     overall: { score: 0.65, label: "Positive" },
  //     timeline: [
  //       { time: "050 - 205", score: 0.8, label: "POSITIVE", text: "I'm excited to share some positive developments in our sales department." },
  //       { time: "5", score: 0.7, label: "POSITIVE", text: "Today we'll be discussing our performance metrics and future strategies." },
  //       { time: "10", score: 0.9, label: "NEUTRAL", text: "I'm excited to share some positive developments in our sales department." },
  //       { time: "15", score: -0.3, label: "NEGATIVE", text: "However, we do need to address some challenges in our customer service area." },
  //       { time: "20", score: 0.6, label: "NEGATIVE", text: "Overall, I believe we're moving in the right direction and I'm optimistic about our future prospects." },
  //       { time: "25", score: 0.8, label: "NEGATIVE", text: "Overall, I believe we're moving in the right direction and I'm optimistic about our future prospects." },
  //     ],
  //   },
  //   entities: [
  //     { text: "quarterly business review", type: "EVENT", confidence: 0.95 },
  //     { text: "sales department", type: "ORGANIZATION", confidence: 0.88 },
  //     { text: "customer service", type: "ORGANIZATION", confidence: 0.92 },
  //   ],
  //   emotions: {
  //     joy: 35,
  //     optimism: 28,
  //     concern: 20,
  //     excitement: 12,
  //     neutral: 5,
  //   },
  //   topics: [
  //     {
  //       topic: "Business Performance",
  //       subtopics: [
  //         {
  //           topic: "Sales Performance",
  //           weight: 0.44,
  //         },
  //         {
  //           topic: "Sales Performance",
  //           weight: 0.35,
  //         },
  //       ]
  //     },
  //     {
  //       topic: "Sales Strategy",
  //       subtopics: [
  //         {
  //           topic: "Sales Persance",
  //           weight: 0.25,
  //         },
  //         {
  //           topic: "Sales Performance",
  //           weight: 0.85,
  //         },
  //       ]
  //     },
  //   ],
  //   keywords: [
  //     { word: "performance", frequency: 3, relevance: 0.89 },
  //     { word: "positive", frequency: 2, relevance: 0.85 },
  //     { word: "challenges", frequency: 2, relevance: 0.78 },
  //     { word: "future", frequency: 2, relevance: 0.72 },
  //   ],
  // }

  // const getSentimentColor = (score: number) => {
  //   if (score > 0.3) return "text-white"
  //   if (score > 0) return "text-orange-500"
  //   if (score > -0.3) return "text-orange-500"
  //   return "text-red-500"
  // }

  const getSentimentColor = (result: string) => {
    if (result === "POSITIVE") return "text-green-500"
    if (result === "NEGATIVE") return "text-red-500"
    if (result === "NEUTRAL") return "text-yellow-500"
    return "text-white"
  }

  const getSentimentIcon = (result: string) => {
    if (result === "POSITIVE") return <TrendingUp className="w-4 h-4" />
    if (result === "NEGATIVE") return <TrendingDown className="w-4 h-4" />
    if (result === "NEUTRAL") return <Minus className="w-4 h-4" />
    return <Minus className="w-4 h-4" />
  }

  const handleExport = () => {
    if (!transcript || !summary || !sentiment || !entities || !topics || !highlights || !topics_summary) {
      console.log("No data to export");
      return;
    }

    const filenamewithext = sessionStorage.getItem("fileName");
    const filename = filenamewithext?.split(".").slice(0, -1).join(".");

    const data = {
      transcript: transcript,
      summary: summary,
      sentiment: sentiment,
      entities: entities,
      topics: topics,
      highlights: highlights,
      topics_summary: topics_summary,
    }

    const json = JSON.stringify(data, null, 2); // pretty-print

    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}-dataset.json`;
    a.click();

    URL.revokeObjectURL(url);
  }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        setData(json);
        //console.log(json);
      } catch (err) {
        alert("Invalid JSON file");
        console.error(err);
      }
    };
    reader.readAsText(file);
  };

  const handleDownload = () => {
    if (!transcript || !summary || !sentiment || !entities || !topics || !highlights || !topics_summary) {
      console.log("No data to export");
      return;
    }
    const data =
      `
Transcript
---------- 

${transcript}\n\n
Summary
-------

${summary}\n\n
Overall Sentiment: ${sentiment.overall.label} - Score: ${sentiment.overall.score.toFixed(2)}\n\n
Sentiment Timeline
------------------

${sentiment.timeline.map((item) => `(${item.time}) - ${item.label} - Confidence: ${(item.score * 100).toFixed(2)}% - ${item.text}`).join("\n")}\n\n
Entities
--------

${entities.map((item) => `(${item.timeFrame}) - ${item.text} - ${item.type}`).join("\n")}\n\n
Topics
------

${topics.map((item) => `"${item.text}"
${item.related_topics.map((topic) => `${topic.text} - ${(topic.relevance * 100).toFixed(2)}%`).join("\n")}`).join("\n\n")}\n\n
Topics Summary
--------------

${topics_summary.map((item) => `${item.topic} - ${(item.relevance * 100).toFixed(2)}%`).join("\n")}\n\n

Highlights
----------

${highlights.map((item) => `Keyphrase: ${item.text} - Count: ${item.count} - Rank: ${(item.rank * 100).toFixed(2)}%`).join("\n")}
`;

    console.log(data);

    const blob = new Blob([data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const filenamewithext = sessionStorage.getItem("fileName");
    const filename = filenamewithext?.split(".").slice(0, -1).join(".");
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}-sentiment-analysis.txt`;
    a.click();

    URL.revokeObjectURL(url); // clean up
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wider">ANALYSIS RESULTS</h1>
          <p className="text-sm text-neutral-400">AI-powered sentiment and content analysis</p>
        </div>
        <div className="flex gap-2">
          <input type="file" id="import-file" accept=".json" className="hidden" onChange={handleImport} />
          <Button className="bg-orange-500 hover:bg-orange-600 text-white cursor-pointer" onClick={() => document.getElementById("import-file")?.click()}>
            <Import className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white cursor-pointer" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white cursor-pointer" onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">OVERALL SENTIMENT</p>
                {sentiment && sentiment.overall && (
                  <>
                    <p className={`text-2xl font-bold ${getSentimentColor(sentiment.overall.label)} font-mono`}>{sentiment.overall.label}</p>
                    <p className="text-xs text-neutral-400">Score: {sentiment.overall.score.toFixed(2)}</p>
                  </>
                )}
              </div>
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">ENTITIES FOUND</p>
                {entities && entities.length > 0 && (
                  <>
                    <p className="text-2xl font-bold text-white font-mono">{entities.length}</p>
                    <p className="text-xs text-neutral-400">Named entities</p>
                  </>
                )}

              </div>
              <Users className="w-8 h-8 text-white" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">TOPICS DETECTED</p>
                {topics && topics.length > 0 && (
                  <>
                    <p className="text-2xl font-bold text-white font-mono">{topics.length}</p>
                    <p className="text-xs text-neutral-400">Main topics</p>
                  </>
                )}
              </div>
              <Brain className="w-8 h-8 text-white" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">WORD COUNT</p>
                {transcript && (
                  <>
                    <p className="text-2xl font-bold text-white font-mono">
                      {transcript.split(" ").length}
                    </p>
                    <p className="text-xs text-neutral-400">Total words</p>
                  </>
                )}
              </div>
              <FileText className="w-8 h-8 text-white" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Results */}
      <Tabs defaultValue="transcript" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6 bg-neutral-800">
          <TabsTrigger value="transcript" className="data-[state=active]:bg-orange-500">
            Transcript
          </TabsTrigger>
          <TabsTrigger value="sentiment" className="data-[state=active]:bg-orange-500">
            Sentiment
          </TabsTrigger>
          <TabsTrigger value="entities" className="data-[state=active]:bg-orange-500">
            Entities
          </TabsTrigger>
          <TabsTrigger value="emotions" className="data-[state=active]:bg-orange-500">
            Emotions
          </TabsTrigger>
          <TabsTrigger value="topics" className="data-[state=active]:bg-orange-500">
            Topics
          </TabsTrigger>
          <TabsTrigger value="keywords" className="data-[state=active]:bg-orange-500">
            Keywords
          </TabsTrigger>
        </TabsList>

        <TabsContent value="transcript">
          <Card className="bg-neutral-900 border-neutral-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">
                  SPEECH-TO-TEXT TRANSCRIPT
                </CardTitle>
                <div className="flex items-center gap-2">
                  {transcript && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="text-neutral-400 hover:text-orange-500"
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {transcript && (
                  <div
                    className="flex p-3 rounded bg-neutral-800 hover:bg-neutral-750 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="text-sm text-white">{transcript}</div>
                      {/* <div className="text-xs text-neutral-500 mt-1">{segment.speaker}</div> */}
                    </div>
                  </div>
                )}
                {(!transcript || transcript.length === 0) && (
                  <div className="text-sm text-neutral-400">No transcript analysis results</div>
                )}
              </div>
            </CardContent>
            <CardContent className="space-y-4">
              <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">
                SUMMARY
              </CardTitle>
              {summary && (
                <div className="flex p-3 rounded bg-neutral-800 hover:bg-neutral-750 transition-colors">
                  <div className="text-sm text-white">{summary}</div>
                </div>
              )}
              {(!summary || summary.length === 0) && (
                <div className="text-sm text-neutral-400">No summary analysis results</div>
              )}
            </CardContent>
            {/* <CardContent className="space-y-4">
              <div className="space-y-3">
                {analysisResults.transcript.segments.map((segment, index) => (
                  <div
                    key={index}
                    className="flex gap-4 p-3 rounded bg-neutral-800 hover:bg-neutral-750 transition-colors"
                  >
                    <div className="text-xs text-neutral-400 font-mono min-w-[60px]">
                      {Math.floor(segment.start / 60)}:{(segment.start % 60).toString().padStart(2, "0")}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-white">{segment.text}</div>
                      <div className="text-xs text-neutral-500 mt-1">{segment.speaker}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent> */}
          </Card>
        </TabsContent>

        <TabsContent value="sentiment">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-neutral-900 border-neutral-700">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">
                  SENTIMENT TIMELINE
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sentiment && sentiment.timeline.length > 0 && sentiment.timeline.map((point, index) => (
                    <div key={index} className="flex flex-col gap-2 p-3 bg-neutral-800 rounded">
                      <div className="flex items-center justify-between ">
                        <div className="flex items-center gap-3">
                          <div className="text-xs text-neutral-400 font-mono min-w-[40px]">
                            {/* //{Math.floor(point.time / 60)}:{(point.time % 60).toString().padStart(2, "0")} */}
                            {point.time}
                          </div>
                          <div className={`flex items-center gap-2 ${getSentimentColor(point.label)}`}>
                            {getSentimentIcon(point.label)}
                            <span className="text-sm font-medium">{point.label}</span>
                          </div>
                        </div>
                        <div className="text-sm font-mono text-white">
                          Confidence: {(point.score * 100).toFixed(2)}%
                        </div>
                      </div>
                      <div className="text-sm text-neutral-400">{point.text}</div>
                    </div>
                  ))}
                  {(!sentiment || sentiment.timeline.length === 0) && (
                    <div className="text-sm text-neutral-400">No sentiment analysis results</div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-neutral-900 border-neutral-700">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">
                  SENTIMENT DISTRIBUTION
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sentiment && sentiment.overall && (
                    <>
                      <div className="text-center">
                        <div className={`text-3xl font-bold ${getSentimentColor(sentiment.overall.label)} mb-2`}>{sentiment.overall.label}</div>
                        <div className="text-sm text-neutral-400">
                          Overall Score: {sentiment.overall.score.toFixed(2)}%
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-neutral-400">Positive Segments</span>
                            <span className="text-white font-mono">{sentiment.overall.positiveConfidence.toFixed(2)}%</span>
                          </div>
                          <Progress value={sentiment.overall.positiveConfidence} color="bg-green-500" className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-neutral-400">Neutral Segments</span>
                            <span className="text-white font-mono">{sentiment.overall.neutralConfidence.toFixed(2)}%</span>
                          </div>
                          <Progress value={sentiment.overall.neutralConfidence} color="bg-yellow-500" className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-neutral-400">Negative Segments</span>
                            <span className="text-white font-mono">{sentiment.overall.negativeConfidence.toFixed(2)}%</span>
                          </div>
                          <Progress value={sentiment.overall.negativeConfidence} color="bg-red-500" className="h-2" />
                        </div>
                      </div>

                      <div className="flex justify-center items-center mt-14">
                        <PieChart />
                      </div>
                    </>
                  )}
                  {(!sentiment || sentiment.overall === null) && (
                    <div className="text-sm text-neutral-400">No sentiment analysis results</div>
                  )}

                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="entities">
          <Card className="bg-neutral-900 border-neutral-700">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">
                NAMED ENTITY RECOGNITION
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {entities && entities.length > 0 && entities.map((entity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-neutral-800 rounded">
                    <div className="flex items-center gap-3">
                      <div className="text-sm font-medium text-white">{entity.text}</div>
                      <Badge className="bg-orange-500/20 text-white text-xs">{entity.type}</Badge>
                    </div>
                    <div className="text-sm text-neutral-400 font-mono">{entity.timeFrame}</div>
                  </div>
                ))}
                {(!entities || entities.length === 0) && (
                  <div className="text-sm text-neutral-400">No entities found</div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="emotions">
          <Card className="bg-neutral-900 border-neutral-700">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">Overall Emotions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-sm text-neutral-400">Transcript: {emotions?.text}</div>
                {emotions?.overall_emotions.map((emotion, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white capitalize">{emotionToEmoji[emotion.label as keyof typeof emotionToEmoji]} {emotion.label}</span>
                      <span className="text-white font-mono">{(emotion.score * 100).toFixed(2)}%</span>
                    </div>
                    <Progress value={emotion.score * 100} className="h-2" color="bg-green-500" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-neutral-900 border-neutral-700 mt-4">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">Emotions Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {emotions?.timeline_emotions.map((emotion, index) => (
                  <div key={index} className="flex flex-col gap-2 p-3 mb-6 bg-neutral-800 rounded">
                    <div className="text-sm text-neutral-400 mb-2">Transcript: {emotion.text}</div>
                    {emotion.emotions.map((emotion, index) => (
                      <>  
                      <div key={index} className="flex justify-between text-sm mb-2">
                        <span className="text-white capitalize">{emotionToEmoji[emotion.label as keyof typeof emotionToEmoji]} {emotion.label}</span>
                        <span className="text-white font-mono">{(emotion.score * 100).toFixed(2)}%</span>
                      </div>
                      <Progress value={emotion.score * 100} className="h-2" color="bg-green-500" /> 
                      </>
                    ))}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="topics">
          <Card className="bg-neutral-900 border-neutral-700">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">TOPIC MODELING</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topics && topics.length > 0 && topics.map((topic, index) => (
                  <div key={index} className="flex flex-col gap-3 items-center p-3 bg-neutral-800 rounded">

                    <div className="flex flex-row items-center justify-between w-full text-sm text-neutral-400">
                      {topic.text}
                    </div>
                    {topic.related_topics.map((related_topic, index) => (
                      <div key={index} className="flex flex-row items-center justify-start w-full gap-6">
                        <div className="flex justify-start items-center w-full text-sm mb-2">
                          <span className="text-white">{related_topic.text}</span>
                        </div>
                        <span className="text-white font-mono">{(related_topic.relevance * 100).toFixed(1)}%</span>
                        <Progress value={related_topic.relevance * 100} color="bg-green-500" className="h-2" />
                      </div>
                    ))}
                  </div>
                ))}
                {(!topics || topics.length === 0) && (
                  <div className="text-sm text-neutral-400">No topics found</div>
                )}
              </div>
            </CardContent>
            <CardContent className="space-y-4">
              <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">
                TOPIC SUMMARY
              </CardTitle>
              <div className="space-y-4">
                {topics_summary && topics_summary.length > 0 && topics_summary.slice(0, 3).map((topic, index) => (
                  <div key={index} className="flex flex-col gap-3 items-center p-3 bg-neutral-800 rounded">
                    <div className="flex flex-row items-center justify-between w-full text-sm text-neutral-400">
                      {topic.topic}
                    </div>
                    <div className="flex flex-row items-center justify-between w-full text-sm text-neutral-400 gap-6">
                      <span className="text-white font-mono w-[50px]">{(topic.relevance * 100).toFixed(1)}%</span>
                      <Progress value={topic.relevance * 100} color="bg-green-500" className="h-2" />
                    </div>
                  </div>


                ))}
                {topics_summary && topics_summary.length > 0 && (
                  <div className="flex justify-center items-center mt-14">
                    <DoughnutChart />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="keywords">
          <Card className="bg-neutral-900 border-neutral-700">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">KEYWORD EXTRACTION</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {highlights && highlights.length > 0 && highlights.map((highlight, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-neutral-800 rounded">
                    <div className="flex items-center gap-3">
                      <div className="text-sm font-medium text-white">{highlight.text}</div>
                      <Badge className="bg-neutral-600 text-neutral-300 text-xs">{highlight.count}x</Badge>
                    </div>
                    <div className="text-sm text-neutral-400 font-mono">{(highlight.rank * 100).toFixed(1)}%</div>
                  </div>
                ))}
                {(!highlights || highlights.length === 0) && (
                  <div className="text-sm text-neutral-400">No highlights found</div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
