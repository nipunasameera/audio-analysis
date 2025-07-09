import { create } from "zustand";
import { AssemblyAI, TranscribeParams } from "assemblyai";
import { getEmotion } from "@/app/api/getEmotion";

const client = new AssemblyAI({
    apiKey: process.env.NEXT_PUBLIC_ASSEMBLYAI_API_KEY!,
});

function calculateOverallSentiment(timeline: { time: string; score: number; label: string; text: string; }[]) {

    const positiveCount = timeline.filter(item => item.label === "POSITIVE").length;
    const negativeCount = timeline.filter(item => item.label === "NEGATIVE").length;
    const neutralCount = timeline.filter(item => item.label === "NEUTRAL").length;

    let positiveConfidence = timeline.filter(item => item.label === "POSITIVE").reduce((acc, curr) => acc + curr.score, 0);
    let negativeConfidence = timeline.filter(item => item.label === "NEGATIVE").reduce((acc, curr) => acc + curr.score, 0);

    let neutralConfidence = 0;
    timeline.forEach(element => {
        if (element.label === "NEUTRAL") {
            if (element.score < 0.5 && positiveCount > negativeCount) {
                positiveConfidence += 0.5 - element.score;
            } else if (element.score < 0.5 && negativeCount > positiveCount) {
                negativeConfidence += 0.5 - element.score;
            }
            neutralConfidence += element.score;
        }
    });
    //const neutralConfidence = timeline.filter(item => item.label === "NEUTRAL").reduce((acc, curr) => curr.score < 0.5 && positiveCount > negativeCount ? positiveConfidence + 0.5 - curr.score : curr.score < 0.5 && negativeCount > positiveCount ? negativeConfidence + 0.5 - curr.score : acc + curr.score, 0);

    const overallSentiment = {
        score: positiveConfidence > negativeConfidence ? (positiveConfidence * 100) / (positiveConfidence + negativeConfidence + neutralConfidence) : negativeConfidence > positiveConfidence ? (negativeConfidence * 100) / (positiveConfidence + negativeConfidence + neutralConfidence) : neutralConfidence * 100 / (positiveConfidence + negativeConfidence + neutralConfidence),
        label: positiveConfidence > negativeConfidence ? "POSITIVE" : negativeConfidence > positiveConfidence ? "NEGATIVE" : "NEUTRAL",
        positiveConfidence: positiveConfidence * 100 / (positiveConfidence + negativeConfidence + neutralConfidence),
        negativeConfidence: negativeConfidence * 100 / (positiveConfidence + negativeConfidence + neutralConfidence),
        neutralConfidence: neutralConfidence * 100 / (positiveConfidence + negativeConfidence + neutralConfidence)
    }
    return overallSentiment;
}

export const useUploadStore = create<UploadStore>((set, get) => ({
    transcript: null,
    summary: null,
    sentiment: null,
    entities: null,
    topics: null,
    topics_summary: null,
    highlights: null,
    isProcessing: false,
    done: false,
    analysis: async (fileUrl: string, selectedParameters: {
        transcript: boolean;
        sentiment: boolean;
        entities: boolean;
        summary: boolean;
        topics: boolean;
        topics_summary: boolean;
        emotions: boolean;
        speakers: boolean;
        keywords: boolean;
    }) => {

        set({ isProcessing: true });
        set({ done: false });

        try {
            const transcript = await client.transcripts.transcribe({
                audio: fileUrl,
                speech_model: "best",
                sentiment_analysis: true,
                entity_detection: true,
                iab_categories: true,
                summarization: true,
                punctuate: true,
                format_text: true,
                speaker_labels: true,
                summary_model: "conversational",
                summary_type: "paragraph",
                auto_highlights: true,
            });

            if (transcript.status === "error") {
                console.error(`Transcription failed: ${transcript.error}`);
            }

            //setTranscript(transcript.text!);
            if (selectedParameters.transcript) {
                set({ transcript: transcript.text! });
            } else {
                set({ transcript: null });
            }

            if (selectedParameters.summary) {
                set({ summary: transcript.summary });
            } else {
                set({ summary: null });
            }

            if (selectedParameters.sentiment) {
                const sentiment = {
                    overall: calculateOverallSentiment(transcript.sentiment_analysis_results!.map((result) => ({
                        time: result.start.toString() + " - " + result.end.toString(),
                        score: result.confidence,
                        label: result.sentiment,
                        text: result.text
                    }))),
                    timeline: transcript.sentiment_analysis_results!.map((result) => ({
                        time: result.start.toString() + " - " + result.end.toString(),
                        score: result.confidence,
                        label: result.sentiment,
                        text: result.text
                    }))
                }
                set({ sentiment: sentiment });
            } else {
                set({ sentiment: null });
            }

            if (selectedParameters.entities) {
                const entities = transcript.entities!.map((entity) => ({
                    text: entity.text,
                    type: entity.entity_type,
                    timeFrame: entity.start.toString() + " - " + entity.end.toString()
                }));
                set({ entities: entities });
            } else {
                set({ entities: null });
            }

            if (selectedParameters.topics) {
                const topics = transcript.iab_categories_result?.results?.map((result) => ({
                    text: result.text,
                    related_topics: result.labels?.map((related_topics) => ({
                        text: related_topics.label,
                        relevance: related_topics.relevance
                    }))
                        .sort((a, b) => b.relevance - a.relevance)
                        .slice(0, 3) || []
                }));
                set({ topics: topics });
            } else {
                set({ topics: null });
            }

            if (selectedParameters.topics_summary) {
                const topics_summary = Object.entries(transcript.iab_categories_result?.summary || {})
                    .map(([key, value]) => ({
                        topic: key,
                        relevance: value
                    }))
                    .sort((a, b) => b.relevance - a.relevance);
                set({ topics_summary: topics_summary });
            } else {
                set({ topics_summary: null });
            }

            if (selectedParameters.keywords) {
                const highlights = transcript.auto_highlights_result?.results?.map((result) => ({
                    text: result.text,
                    count: result.count,
                    rank: result.rank
                })) || [];
                set({ highlights: highlights });
            } else {
                set({ highlights: null });
            }

            const overall_emotion_result = await getEmotion(transcript.text!);

            const timeline_emotion_result = transcript.sentiment_analysis_results!.map(async (result) => {
                const emotion_result = await getEmotion(result.text);
                return {
                    text: result.text,
                    emotions: emotion_result[0]
                }
            });

            const emotions = {
                text: transcript.text!,
                overall_emotions: overall_emotion_result[0]!,
                timeline_emotions: await Promise.all(timeline_emotion_result)
            }

            console.log("emotionssss", emotions);

            set({ emotions: emotions });

            set({ isProcessing: false });
            set({ done: true });

        } catch (error) {
            console.error(`Transcription failed: ${error}`);
            set({ isProcessing: false });
            set({ done: true });
        }
    },
    setData: (data) => {
        set({ transcript: data.transcript });
        set({ summary: data.summary });
        set({ sentiment: data.sentiment });
        set({ entities: data.entities });
        set({ topics: data.topics });
        set({ topics_summary: data.topics_summary });
        set({ highlights: data.highlights });
    },
    emotions: null,
}))

interface UploadStore {
    transcript: string | null;
    summary: string | null;
    sentiment: {
        overall: { score: number; label: string; positiveConfidence: number; negativeConfidence: number; neutralConfidence: number; };
        timeline: { time: string; score: number; label: string; text: string; }[];
    } | null;
    entities: {
        text: string;
        type: string;
        timeFrame: string;
    }[] | null;
    topics: {
        text: string;
        related_topics: {
            text: string;
            relevance: number;
        }[];
    }[] | null;
    topics_summary: {
        topic: string;
        relevance: number;
    }[] | null;
    highlights: {
        text: string;
        count: number;
        rank: number;
    }[] | null;
    isProcessing: boolean;
    done: boolean;
    analysis: (fileUrl: string, selectedParameters: {
        transcript: boolean;
        sentiment: boolean;
        entities: boolean;
        summary: boolean;
        topics: boolean;
        topics_summary: boolean;
        emotions: boolean;
        speakers: boolean;
        keywords: boolean;
    }) => Promise<void>;
    setData: (data: any) => void;
    emotions: {
        text: string,
        overall_emotions: {
            label: string,
            score: number
        }[],
        timeline_emotions: {
            text: string,
            emotions: {
                label: string,
                score: number
            }[]
        }[]
    } | null;
}
