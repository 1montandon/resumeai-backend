import { Ollama } from "ollama";
import { z } from "zod";

export const responseSchema = z.object({
  strong: z
    .array(z.string())
    .length(3, "Must contain exactly 3 strong points")
    .describe(
      "An array of exactly 3 strings, each describing a strong point highly relevant to the job description.",
    ),

  weaks: z
    .array(z.string())
    .length(3, "Must contain exactly 3 weak points")
    .describe(
      "An array of exactly 3 strings, each describing a weak point or area for improvement relative to the job.",
    ),

  compatibility: z
    .number()
    .min(0.0, "Compatibility must be at least 0.0")
    .max(1.0, "Compatibility must be at most 1.0")
    .describe(
      "A floating-point number between 0.0 and 1.0 representing the compatibility score.",
    ),

  summary: z
    .string()
    .max(1000, "Summary must be concise (recommended max 100 words)")
    .describe(
      "A concise overview (maximum 100 words) of the resume's alignment with the job, highlighting key strengths and gaps.",
    ),
});

const ollama = new Ollama();

export async function lammaAnalyzeResume(
  resumeText: string,
  jobDescription: string,
) {
  const prompt = `You are an expert AI assistant specializing in job application analysis. 

Analyze the candidate's resume against the job description and provide a structured assessment, 
reply in the same language as the resume text.

**IMPORTANT DEFINITIONS:**
- "strong": Skills, experiences, or qualifications the candidate HAS that match or exceed the job requirements
- "weaks": Skills, experiences, or qualifications the candidate LACKS or needs improvement in based on the job requirements
- "compatibility": Overall match score (0.0 = no match, 1.0 = perfect match)
- "summary": Brief overview of fit, highlighting both matches and gaps

**Job Description:**
${jobDescription}

**Candidate's Resume:**
${resumeText}

Respond with a valid JSON object following the specified schema. Ensure "strong" points are what the candidate DOES have, and "weaks" are what they DON'T have or lack.`;

  const response = await ollama.chat({
    model: "llama3.2",
    messages: [{ content: prompt, role: "user" }],
     // Changed to "user"
    format: z.toJSONSchema(responseSchema), // Pass Zod schema directly if supported, or use toJSONSchema
  });

  // Parse and validate
  const parsed = JSON.parse(response.message.content);
  const validated = responseSchema.parse(parsed); // This will throw if invalid

  return validated;
}

// export async function lammaAnalyzeResume(
//   resumeText: string,
//   jobDescription: string,
// ) {
//   const prompt = `You are an expert AI assistant specializing in job application analysis. 

// Analyze the candidate's resume against the job description and provide a structured assessment.

// **IMPORTANT DEFINITIONS:**
// - "strong": Skills, experiences, or qualifications the candidate HAS that match or exceed the job requirements
// - "weaks": Skills, experiences, or qualifications the candidate LACKS or needs improvement in based on the job requirements
// - "compatibility": Overall match score (0.0 = no match, 1.0 = perfect match)
// - "summary": Brief overview of fit, highlighting both matches and gaps

// **Job Description:**
// ${jobDescription}

// **Candidate's Resume:**
// ${resumeText}

// Respond in the same language as the resume text with a valid JSON object following the specified schema. Ensure "strong" points are what the candidate DOES have, and "weaks" are what they DON'T have or lack.`;

//   console.log("🤖 Starting AI analysis...\n");

//   const response = await ollama.chat({
//     model: "llama3.2",
//     messages: [{ content: prompt, role: "user" }],
//     format: z.toJSONSchema(responseSchema),
//     stream: true, // Enable streaming
//   });

//   let fullContent = "";

//   // Stream and display chunks in real-time
//   for await (const chunk of response) {
//     const content = chunk.message.content;
//     fullContent += content;
//     process.stdout.write(content); // Show in terminal as it generates
//   }

//   console.log("\n\n✅ Analysis complete!\n");

//   // Parse and validate the complete response
//   const parsed = JSON.parse(fullContent);
//   const validated = responseSchema.parse(parsed);

//   return validated;
// }