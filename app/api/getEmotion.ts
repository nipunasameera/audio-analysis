// Create a new API route to get the emotion
export async function getEmotion(text: string) {

const res = await fetch("https://api-inference.huggingface.co/models/SamLowe/roberta-base-go_emotions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ inputs: text }),
  });
    const data = await res.json();
    return data;
}