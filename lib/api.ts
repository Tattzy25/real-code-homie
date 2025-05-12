export async function callHuggingFace(endpoint: string, payload: any) {
  const res = await fetch(`https://api-inference.huggingface.co/models/${endpoint}`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
  return res.json();
}