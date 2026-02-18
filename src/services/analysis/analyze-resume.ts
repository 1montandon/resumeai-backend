import { PDFParse } from "pdf-parse";
import { handleUpload } from "../../config/cloudinary.ts";
import { lammaAnalyzeResume } from "../../config/ollama.ts";
import prisma from "../../prisma/client.ts";
import type { Analysis } from "../../types/analysis.ts";

export async function analyzeResume(
  resumeFile: Express.Multer.File,
  jobDescription: string,
  userId: string,
): Promise<Analysis> {
  const resumeBuffer = resumeFile.buffer;

  const parsedResume = new PDFParse({ data: resumeBuffer });
  const resumeText = await (await parsedResume.getText()).text;

  console.log(resumeText);

  const aiAnalysis = await lammaAnalyzeResume(resumeText, jobDescription);

  const b64 = resumeBuffer.toString("base64");
  const dataURI = `data:${resumeFile.mimetype};base64,${b64}`;
  const cldRes = await handleUpload(dataURI);

  const analysis = await prisma.analyses.create({
    data: {
      jobDescription,
      resumeUrl: cldRes.url,
      score: aiAnalysis.compatibility, // Usa o compatibility do aiAnalysis
      strengths: JSON.stringify(aiAnalysis.strong), // Converte array para string JSON
      weaknesses: JSON.stringify(aiAnalysis.weaks), // Converte array para string JSON
      overview: aiAnalysis.summary, // Usa o summary do aiAnalysis
      user: {
        connect: { id: userId },
      },
    },
  });
  return analysis; // Retorna o objeto de análise criado no Prisma
}
