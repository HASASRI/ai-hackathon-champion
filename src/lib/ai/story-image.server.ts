// Server-only: generates one chapter illustration and stores it once.

const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/images/generations";
const IMAGE_MODEL = "openai/gpt-image-2.5-sunburst";
const BUCKET = "story-images";
const ONE_YEAR = 60 * 60 * 24 * 365;

export const STORYBOOK_STYLE =
  "Colorful children's storybook illustration, friendly and playful, expressive characters, clean shapes, soft lighting, not photorealistic, not scary, age appropriate, no text or letters.";

export async function generateChapterImageFile(input: {
  storyId: string;
  chapterIndex: number;
  scene: string;
  characterSheet: string;
  topic: string;
}): Promise<string> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new Error("AI key not configured");

  const prompt = [
    STORYBOOK_STYLE,
    input.characterSheet ? `Characters (keep exactly this look): ${input.characterSheet}` : "",
    `Scene: ${input.scene}`,
    `The picture should help a child understand: ${input.topic}.`,
  ]
    .filter(Boolean)
    .join("\n");

  const res = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Lovable-API-Key": apiKey,
      "X-Lovable-AIG-SDK": "fetch",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ model: IMAGE_MODEL, prompt, size: "1536x1024", quality: "low" }),
  });
  if (!res.ok) throw new Error(`Image generation failed (${res.status})`);
  const json = (await res.json()) as { data?: { b64_json?: string }[] };
  const b64 = json.data?.[0]?.b64_json;
  if (!b64) throw new Error("No image returned");

  const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const path = `${input.storyId}/ch${input.chapterIndex + 1}.png`;
  const up = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(path, bytes, { contentType: "image/png", upsert: true });
  if (up.error) throw new Error(up.error.message);
  const signed = await supabaseAdmin.storage.from(BUCKET).createSignedUrl(path, ONE_YEAR);
  if (signed.error || !signed.data) throw new Error("Could not save image");
  return signed.data.signedUrl;
}
