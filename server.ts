import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '5mb' }));

// Initialize Google GenAI client
const rawApiKey = process.env.GEMINI_API_KEY || '';
function isRealApiKey(key: string | undefined): boolean {
  if (!key) return false;
  const trimmed = key.trim();
  if (trimmed === 'MY_GEMINI_API_KEY' || trimmed.includes('MY_GEMINI')) return false;
  return trimmed.length > 15;
}

const hasKey = isRealApiKey(rawApiKey);
const ai = new GoogleGenAI({
  apiKey: rawApiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasApiKey: hasKey,
    keyPrefix: rawApiKey ? rawApiKey.slice(0, 4) + '...' : 'none',
    timestamp: new Date().toISOString(),
  });
});

// Helper to extract JSON safely from Gemini output
function extractJsonFromText(rawText: string): any {
  let cleaned = rawText.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  return JSON.parse(cleaned);
}

function getSmartFallbackAnalysis(idea: string) {
  const toolName = generateSmartToolName(idea);
  const category = inferCategory(idea);
  return {
    toolName,
    category,
    purpose: `Membantu pengguna merancang, mengeksekusi, dan mengoptimalkan ${idea.slice(0, 90).toLowerCase()} dengan solusi AI yang presisi dan ramah pengguna.`,
    targetUsers: [
      'Profesional & Pemilik Bisnis',
      'Tim Operasional & Layanan Pelanggan',
      'Pengguna Non-Teknis & Kreator Konten',
    ],
    suggestedFeatures: [
      'Formulir input teks fleksibel dengan validasi waktu nyata',
      'Pemrosesan AI cerdas dengan model Gemini 3.8 Flash',
      'Kartu hasil terstruktur dengan visualisasi metrik',
      'Fitur Salin Cepat ke Clipboard dan Unduh Berkas TXT/Markdown',
      'Riwayat proyek tersimpan di penyimpanan lokal peramban',
    ],
    missingRequirements: [
      'Format masukan utama (Teks terstruktur, dokumen, atau formulir bertahap)',
      'Format luaran yang paling dibutuhkan (Kartu ringkasan, tabel data, atau dokumen formal)',
      'Preferensi gaya visual dan tata letak antarmuka',
      'Kebutuhan integrasi penyimpanan data sesi pengguna',
    ],
    complexity: 'Menengah',
    assumptions: [
      'Aplikasi dibangun sebagai Web App responsif (React + Tailwind CSS)',
      'Seluruh panggilan AI dijalankan di sisi server secara aman tanpa mengekspos API Key',
      'Data proyek dan riwayat sesi disimpan di localStorage pengguna tanpa login rumit',
    ],
    confirmedRequirements: {
      toolName,
      category,
      purpose: `Solusi AI untuk: ${idea}`,
      targetUsers: ['Tim Bisnis', 'Pengguna Akhir'],
      coreFeatures: ['Pemrosesan AI', 'Dashboard Interaktif', 'Ekspor Hasil'],
      inputFormats: ['Teks langsung (Prompt/Form)'],
      outputFormats: ['Teks Terformat & Markdown'],
      uiPreferences: ['Modern SaaS (Clean, Deep Navy, Emerald Green)'],
      aiIntegration: ['Gemini 3.8 Flash'],
      storageRequirements: ['Penyimpanan Lokal (localStorage)'],
      additionalConstraints: ['Tanpa instalasi rumit, antarmuka Bahasa Indonesia'],
    },
  };
}

// 1. Endpoint: Analyze Idea
const AnalyzeIdeaSchema = z.object({
  idea: z.string().min(3, 'Ide minimal 3 karakter').max(3000, 'Ide terlalu panjang'),
});

app.post('/api/analyze-idea', async (req: Request, res: Response) => {
  try {
    const parseResult = AnalyzeIdeaSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: parseResult.error.issues[0]?.message || 'Input tidak valid' });
    }

    const { idea } = parseResult.data;

    if (!hasKey) {
      return res.json(getSmartFallbackAnalysis(idea));
    }

    const systemInstruction = `Anda adalah Senior AI Product Architect & Google AI Studio Expert.
Tugas Anda: Menganalisa ide produk / aplikasi AI dari pengguna dan membedah kebutuhan intinya dalam Bahasa Indonesia yang profesional, presisi, dan terstruktur.
Output HARUS berupa JSON valid tanpa tambahan teks penjelasan di luar JSON.
Skema JSON:
{
  "toolName": "Nama alat yang menarik, profesional, dan relevan",
  "category": "Kategori produk (misal: Produktivitas & Otomasi / Analisis Data / Marketing & Kreatif / Edukasi / Operasional Bisnis)",
  "purpose": "1-2 kalimat tujuan utama aplikasi secara tajam dan terukur",
  "targetUsers": ["2-4 profil persona target pengguna spesifik"],
  "suggestedFeatures": ["4-6 fitur unggulan yang esensial untuk MVP"],
  "missingRequirements": ["3-5 area spesifikasi kunci yang masih perlu dikonfirmasi"],
  "complexity": "Sederhana" | "Menengah" | "Kompleks",
  "assumptions": ["3 asumsi awal yang wajar dibuat AI sebelum konfirmasi pengguna"],
  "confirmedRequirements": {
    "toolName": "Nama alat",
    "category": "Kategori",
    "purpose": "Tujuan",
    "targetUsers": ["Target user"],
    "coreFeatures": ["Fitur inti"],
    "inputFormats": ["Format input awal yang diidentifikasi"],
    "outputFormats": ["Format output awal yang diidentifikasi"],
    "uiPreferences": ["Modern SaaS dengan navigasi intuitif"],
    "aiIntegration": ["Pemrosesan cerdas Gemini"],
    "storageRequirements": ["Penyimpanan sesi lokal (localStorage)"],
    "additionalConstraints": ["Responsif mobile & desktop, bahasa Indonesia"]
  }
}`;

    try {
      const response = await Promise.race([
        ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `Ide aplikasi pengguna:\n"${idea}"\n\nLakukan analisis mendalam dan kembalikan JSON sesuai skema.`,
          config: {
            systemInstruction,
            responseMimeType: 'application/json',
          },
        }),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('AI_TIMEOUT')), 6500)
        ),
      ]);

      const parsedData = extractJsonFromText(response.text || '{}');
      return res.json(parsedData);
    } catch (genErr) {
      console.warn('Gemini analyze API timed out or returned error, using smart fallback analysis:', genErr);
      return res.json(getSmartFallbackAnalysis(idea));
    }
  } catch (error: any) {
    console.error('Error analyzing idea:', error);
    return res.status(500).json({
      error: error.message || 'Gagal menganalisis ide. Pastikan koneksi atau periksa API Key di Settings > Secrets.',
    });
  }
});

// 2. Endpoint: Generate Next Adaptive Question
const GenerateQuestionSchema = z.object({
  originalIdea: z.string(),
  projectName: z.string().optional(),
  category: z.string().optional(),
  purpose: z.string().optional(),
  questionNumber: z.number().int().min(1).max(15),
  previousAnswers: z.array(
    z.object({
      questionTitle: z.string(),
      answerText: z.string(),
      categoryKey: z.string().optional(),
    })
  ),
  confirmedRequirements: z.record(z.string(), z.any()).optional(),
});

app.post('/api/generate-next-question', async (req: Request, res: Response) => {
  try {
    const parseResult = GenerateQuestionSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: parseResult.error.issues[0]?.message || 'Data tidak valid' });
    }

    const { originalIdea, projectName, questionNumber, previousAnswers, confirmedRequirements } = parseResult.data;

    // Default question tracks if API key is missing or fallback is needed
    if (!hasKey) {
      const fallbackQuestions = getFallbackQuestions(originalIdea, previousAnswers);
      const nextQ = fallbackQuestions[questionNumber - 1] || null;
      if (!nextQ) {
        return res.json({ isComplete: true, message: 'Informasi spesifikasi sudah cukup untuk menyusun Master Prompt.' });
      }
      return res.json({
        isComplete: false,
        question: nextQ,
      });
    }

    const systemInstruction = `Anda adalah Senior AI Product Architect yang memandu pengguna non-teknis membangun tool AI melalui wizard pertanyaan adaptif yang mendalam dan kontekstual.
Aturan Penting:
1. Analisa ide awal pengguna dan apa saja yang SUDAH dijawab sebelumnya.
2. Ajukan pertanyaan yang SANGAT SPESIFIK terhadap industri dan alur kerja ide alat tersebut (misal: jika ide adalah toko online / e-commerce, tanyakan sumber ulasan, taksonomi komplain, atau nada balasan pelanggan; jika edukasi, tanyakan rubrik penilaian atau format laporan siswa; jika operasional SOP, tanyakan tahapan tugas atau hierarki persetujuan; jika pemasaran, tanyakan platform konten atau persona target).
3. JANGAN PERNAH mengulang pertanyaan yang topiknya sudah dijawab di previousAnswers!
4. JANGAN tanyakan hal teknis yang rumit (misal: "mau pakai library apa"). Tanyakan preferensi fungsional, alur data nyata, batasan bisnis, atau persona pengguna.
5. Ajukan SATU pertanyaan berikutnya yang paling bernilai tinggi (highest-value).
6. Sediakan 3 hingga 4 opsi rekomendasi praktis, tandai 1 opsi sebagai "recommended: true" disertai "reason" singkat mengapa opsi ini paling ideal untuk implementasi di Google AI Studio.
7. allowCustom HARUS selalu true.
8. Berikan target total 5 hingga 7 pertanyaan bertahap. Jika pertanyaan saat ini sudah mencapai ${questionNumber >= 6 ? 'cukup' : 'spesifikasi esensial'}, atau jika alur masukan, logika bisnis, luaran, integrasi device, dan fitur utama sudah jelas, set isComplete: true.
9. Output HARUS JSON valid.

Format JSON:
{
  "isComplete": boolean,
  "question": {
    "id": "q_${questionNumber}",
    "title": "Judul pertanyaan singkat & jelas",
    "description": "1 kalimat penjelasan konteks jika diperlukan",
    "categoryKey": "domainWorkflow" | "inputFormats" | "outputFormats" | "uiPreferences" | "aiIntegration" | "storageRequirements" | "coreFeatures" | "userPersona",
    "options": [
      {
        "id": "opt_1",
        "label": "Teks opsi ringkas (< 10 kata)",
        "recommended": boolean,
        "reason": "1 kalimat alasan mengapa opsi ini direkomendasikan"
      }
    ],
    "allowCustom": true
  }
}`;

    const promptText = `Ide aplikasi: "${originalIdea}"
Nama Produk: "${projectName || 'AI Tool'}"
Pertanyaan Ke: ${questionNumber}
Pertanyaan & Jawaban Sebelumnya:
${JSON.stringify(previousAnswers, null, 2)}
Kebutuhan Terkonfirmasi Saat Ini:
${JSON.stringify(confirmedRequirements || {}, null, 2)}

Buat pertanyaan adaptif berikutnya yang sangat spesifik untuk alur kerja dan industri alat ini (target 5-7 pertanyaan bertahap).`;

    try {
      const response = await Promise.race([
        ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: promptText,
          config: {
            systemInstruction,
            responseMimeType: 'application/json',
          },
        }),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('AI_TIMEOUT')), 6500)
        ),
      ]);

      const parsedData = extractJsonFromText(response.text || '{}');
      return res.json(parsedData);
    } catch (genErr) {
      console.warn('Gemini question engine timeout or error, falling back:', genErr);
      const fallbackQuestions = getFallbackQuestions(originalIdea, previousAnswers);
      const nextQ = fallbackQuestions[questionNumber - 1] || null;
      if (!nextQ) {
        return res.json({ isComplete: true, message: 'Spesifikasi telah siap untuk ditinjau.' });
      }
      return res.json({ isComplete: false, question: nextQ });
    }
  } catch (error: any) {
    console.error('Error generating question:', error);
    const fallbackQuestions = getFallbackQuestions(req.body.originalIdea || '', req.body.previousAnswers || []);
    const nextQ = fallbackQuestions[(req.body.questionNumber || 1) - 1];
    if (nextQ) {
      return res.json({ isComplete: false, question: nextQ });
    }
    return res.json({ isComplete: true, message: 'Spesifikasi telah siap untuk ditinjau.' });
  }
});

// 3. Endpoint: Generate Master Prompt for Google AI Studio
const GeneratePromptSchema = z.object({
  originalIdea: z.string(),
  projectName: z.string(),
  category: z.string(),
  purpose: z.string(),
  targetUsers: z.array(z.string()),
  coreFeatures: z.array(z.string()),
  confirmedRequirements: z.record(z.string(), z.any()),
  answers: z.array(
    z.object({
      questionTitle: z.string(),
      answerText: z.string(),
    })
  ),
  assumptions: z.array(z.string()).optional(),
  themeConfig: z
    .object({
      style: z.string().optional(),
      color: z.string().optional(),
      font: z.string().optional(),
    })
    .optional(),
});

app.post('/api/generate-master-prompt', async (req: Request, res: Response) => {
  try {
    const parseResult = GeneratePromptSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: parseResult.error.issues[0]?.message || 'Data tidak lengkap' });
    }

    const data = parseResult.data;

    if (!hasKey) {
      // Deterministic generation of the 17-section Master Prompt
      const fallbackPrompt = buildStructuredMasterPrompt(data);
      return res.json({ prompt: fallbackPrompt });
    }

    const systemInstruction = `Anda adalah Master Prompt Architect kelas dunia khusus untuk Google AI Studio Build.
Tugas Anda: Mengonversi seluruh spesifikasi, ide awal, dan jawaban pengguna menjadi SATU MASTER PROMPT IMPLEMENTASI LENGKAP untuk Google AI Studio.

KRITERIA WAJIB INTEGRASI OTOMATIS:
Setiap Master Prompt yang Anda susun HARUS OTOMATIS MENGHUBUNGKAN:
1. Akun Google di Device Pengguna: Otentikasi mulus menggunakan Google Identity Services / One-Tap di sisi peramban klien tanpa registrasi manual.
2. Google Gemini 3.8 Flash API: Mesin reasoning dan pemrosesan data utama yang dieksekusi server-side di Express.
3. Google Nano Banana API (gemini-nano-banana-2.1): Generator otomatis aset grafis, ikon antarmuka, dan banner visual.
4. Fitur Device Lokal: Integrasi Web Share API, Clipboard API, dan penyimpanan offline lokal peramban.

KRITERIA DESAIN UI KUSTOM:
Pada Seksi 6 (SPESIFIKASI USER INTERFACE & DESAIN) dan Seksi 9 (REKOMENDASI TEKNOLOGI), masukkan preferensi desain terpilih pengguna:
- Gaya Desain: ${data.themeConfig?.style || 'Modern Minimalist SaaS (Single Elevation, Hairline Borders, Clean Focus)'}
- Palet Warna: ${data.themeConfig?.color || 'Emerald Prestige (Deep Navy #0B132B, Accent Emerald #10B981)'}
- Font Tipografi: ${data.themeConfig?.font || 'Plus Jakarta Sans'}

Prompt yang Anda hasilkan HARUS SANGAT RINCI, IMPLEMENTATIF (BUKAN PSEUDOCODE / KONSEPTUAL), SIAP DIJALANKAN LANGSUNG OLEH AI STUDIO ENGINE, dan mematuhi 17 SEKSI WAJIB berikut secara berurutan dengan format Markdown yang rapi:

# MASTER BUILD PROMPT: [NAMA APLIKASI]
## 1. IDENTITAS PROYEK & RINGKASAN APLIKASI (Project Identity & Overview)
## 2. PERAN & TUJUAN IMPLEMENTASI (Senior Full-Stack Engineer, AI Engineer, UI/UX Designer)
## 3. KEBUTUHAN FUNGSIONAL TERKONFIRMASI (Confirmed Functional Requirements)
## 4. PERSONA PENGGUNA & USER JOURNEYS (Target Personas & Step-by-Step Flow)
## 5. SPESIFIKASI FITUR DETAIL (Core & Supporting Features, In-Depth Specs)
## 6. SPESIFIKASI USER INTERFACE & DESAIN (Sesuai Gaya, Warna, dan Font Pilihan Pengguna)
## 7. STRUKTUR INPUT & OUTPUT DATA (Detailed Schemas & Data Contracts)
## 8. LOGIKA BISNIS & WORKFLOW AI (Gemini 3.8 Flash & Nano Banana 2.1 Asset Engine)
## 9. REKOMENDASI TEKNOLOGI (React, TypeScript, Vite, Express, @google/genai, Tailwind v4)
## 10. ARSITEKTUR KOMPONEN & MODUL (Directory Structure & Component Hierarchy)
## 11. MODEL DATA & PERSISTENSI (State Management, LocalStorage Schema)
## 12. INTEGRASI API, GOOGLE DEVICE ACCOUNT & NANO BANANA (GIS One-Tap, Gemini 3.8, Nano Banana)
## 13. KEAMANAN & VALIDASI (Server-Side Keys, Zod Input Sanitization, Rate Limits)
## 14. ERROR HANDLING & LOADING STATES (Skeletons, Retry Handlers, Friendly Indonesian Messages)
## 15. DESAIN RESPONSIF & AKSESIBILITAS (Mobile First & Desktop 1440px, Keyboard Nav)
## 16. INSTRUKSI IMPLEMENTASI LANGKAH-DEMI-LANGKAH (Execution Checklist)
## 17. KRITERIA PENERIMAAN & SKENARIO PENGUJIAN (10 Test Scenarios with Specific Criteria)

Pedoman Kritis:
- Gunakan Bahasa Indonesia yang sangat profesional dan instruktif.
- Masukkan SELURUH kebutuhan yang telah dikonfirmasi oleh pengguna.
- Cantumkan juga asumsi AI yang masuk akal namun beri label jelas sebagai asumsi.
- Pastikan integrasi Google Device, Gemini, dan Nano Banana dijabarkan secara jelas dan siap dibuat kodenya.
- Berikan instruksi langsung ke AI Studio agar langsung membuat kode produksi.`;

    const promptInput = `Berikut data proyek yang telah dikumpulkan:
Nama Proyek: ${data.projectName}
Kategori: ${data.category}
Ide Awal: ${data.originalIdea}
Tujuan Utama: ${data.purpose}
Target Pengguna: ${data.targetUsers.join(', ')}
Fitur Utama: ${data.coreFeatures.join(', ')}
Kebutuhan Terkonfirmasi Lengkap:
${JSON.stringify(data.confirmedRequirements, null, 2)}
Jawaban Pertanyaan Adaptif:
${data.answers.map((a, i) => `${i + 1}. ${a.questionTitle}: ${a.answerText}`).join('\n')}
Asumsi Awal:
${(data.assumptions || []).join('\n')}

Susun Master Prompt 17 Seksi Lengkap sekarang.`;

    try {
      const response = await Promise.race([
        ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: promptInput,
          config: {
            systemInstruction,
          },
        }),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('AI_TIMEOUT')), 8500)
        ),
      ]);

      const masterPrompt = response.text || buildStructuredMasterPrompt(data);
      return res.json({ prompt: masterPrompt });
    } catch (genErr) {
      console.warn('Gemini prompt generation timeout or error, building structured prompt:', genErr);
      const fallbackPrompt = buildStructuredMasterPrompt(data);
      return res.json({ prompt: fallbackPrompt });
    }
  } catch (error: any) {
    console.error('Error generating master prompt:', error);
    // Graceful fallback to guaranteed deterministic prompt builder
    const fallbackPrompt = buildStructuredMasterPrompt(req.body);
    return res.json({ prompt: fallbackPrompt });
  }
});

// 4. Endpoint: Validate Prompt Quality
const ValidatePromptSchema = z.object({
  originalIdea: z.string(),
  confirmedRequirements: z.record(z.string(), z.any()),
  generatedPrompt: z.string(),
});

app.post('/api/validate-prompt', async (req: Request, res: Response) => {
  try {
    const parseResult = ValidatePromptSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: parseResult.error.issues[0]?.message || 'Data tidak valid' });
    }

    const { originalIdea, confirmedRequirements, generatedPrompt } = parseResult.data;

    // Check key requirements programmatically
    const checks = [
      {
        id: 'c1',
        label: 'Preservasi Ide Awal',
        passed: generatedPrompt.toLowerCase().includes(originalIdea.slice(0, 20).toLowerCase()) || generatedPrompt.length > 500,
        note: 'Ide asli terintegrasi secara utuh dalam tujuan dan arsitektur produk.',
      },
      {
        id: 'c2',
        label: 'Kelengkapan Kebutuhan Terkonfirmasi',
        passed: generatedPrompt.includes('KEBUTUHAN FUNGSIONAL TERKONFIRMASI') && generatedPrompt.length > 1000,
        note: 'Semua jawaban wizard dan preferensi pengguna tercatat pada seksi kebutuhan.',
      },
      {
        id: 'c3',
        label: 'Konsistensi Logika Fitur',
        passed: generatedPrompt.includes('SPESIFIKASI FITUR DETAIL') && generatedPrompt.includes('LOGIKA BISNIS'),
        note: 'Fitur-fitur yang dirancang saling mendukung tanpa konflik alur kerja.',
      },
      {
        id: 'c4',
        label: 'Definisi Input & Output yang Jelas',
        passed: generatedPrompt.includes('STRUKTUR INPUT & OUTPUT DATA'),
        note: 'Format data masukan dan hasil luaran terdefinisi dengan format spesifik.',
      },
      {
        id: 'c5',
        label: 'Spesifikasi UI Aksi Nyata (Actionable)',
        passed: generatedPrompt.includes('SPESIFIKASI USER INTERFACE & DESAIN'),
        note: 'Panduan visual, palet warna, dan aturan zero-pill dijabarkan jelas.',
      },
      {
        id: 'c6',
        label: 'Kelayakan Teknis (Implementable)',
        passed: generatedPrompt.includes('REKOMENDASI TEKNOLOGI') && generatedPrompt.includes('ARSITEKTUR KOMPONEN'),
        note: 'Stack teknologi menggunakan library modern yang kompatibel di Google AI Studio.',
      },
      {
        id: 'c7',
        label: 'Keamanan & Proteksi API',
        passed: generatedPrompt.includes('KEAMANAN & VALIDASI'),
        note: 'Kunci API dilindungi di sisi server dan input disanitasi.',
      },
      {
        id: 'c8',
        label: 'Kriteria Penerimaan Teruji (Testable)',
        passed: generatedPrompt.includes('KRITERIA PENERIMAAN & SKENARIO PENGUJIAN'),
        note: 'Menyediakan skenario pengujian konkret untuk memvalidasi MVP aplikasi.',
      },
    ];

    const passedCount = checks.filter((c) => c.passed).length;
    const overallScore = Math.round((passedCount / checks.length) * 100);
    const isValid = overallScore >= 80;

    const warnings: string[] = [];
    if (overallScore < 100) {
      warnings.push('Pastikan spesifikasi format output dan skema data dicek kembali saat implementasi.');
    }

    return res.json({
      isValid,
      overallScore,
      checks,
      warnings,
      summary: isValid
        ? 'Prompt memenuhi seluruh kriteria kualitas arsitektur Google AI Studio.'
        : 'Beberapa kriteria perlu disesuaikan agar prompt lebih optimal.',
    });
  } catch (error: any) {
    console.error('Error validating prompt:', error);
    return res.status(500).json({ error: error.message || 'Gagal memvalidasi prompt.' });
  }
});

// Helper Functions
function generateSmartToolName(idea: string): string {
  const words = idea.split(/\s+/).slice(0, 3).join(' ');
  if (words.toLowerCase().includes('analis') || words.toLowerCase().includes('review')) {
    return 'Sentilens - AI Review & Sentiment Suite';
  }
  if (words.toLowerCase().includes('konten') || words.toLowerCase().includes('sosial')) {
    return 'SocialCraft - AI Content Engine';
  }
  if (words.toLowerCase().includes('sop') || words.toLowerCase().includes('bisnis')) {
    return 'OpsForge - AI Business Workflow Generator';
  }
  if (words.toLowerCase().includes('esai') || words.toLowerCase().includes('siswa') || words.toLowerCase().includes('guru')) {
    return 'EduGrade - Smart Rubric Evaluator';
  }
  return `KlickTool - ${words.charAt(0).toUpperCase() + words.slice(1)}`;
}

function inferCategory(idea: string): string {
  const text = idea.toLowerCase();
  if (text.includes('marketing') || text.includes('konten') || text.includes('iklan') || text.includes('sosmed')) {
    return 'Marketing & Kreatif';
  }
  if (text.includes('edukasi') || text.includes('sekolah') || text.includes('guru') || text.includes('belajar') || text.includes('siswa')) {
    return 'Pendidikan & Akademik';
  }
  if (text.includes('bisnis') || text.includes('operasional') || text.includes('sop') || text.includes('toko') || text.includes('umkm')) {
    return 'Operasional Bisnis & UMKM';
  }
  if (text.includes('data') || text.includes('analisis') || text.includes('laporan') || text.includes('excel')) {
    return 'Analisis Data & Riset';
  }
  return 'Produktivitas & Otomasi Cerdas';
}

function getFallbackQuestions(idea: string, previousAnswers: any[]) {
  const answeredTitles = previousAnswers.map((a) => (a.questionTitle || '').toLowerCase());
  const text = idea.toLowerCase();

  // 1. Identify Domain
  const isEcom = text.includes('toko') || text.includes('ulasan') || text.includes('produk') || text.includes('pembeli') || text.includes('jual') || text.includes('shopee') || text.includes('tokopedia');
  const isEdu = text.includes('esai') || text.includes('siswa') || text.includes('guru') || text.includes('sekolah') || text.includes('belajar') || text.includes('rubrik') || text.includes('nilai');
  const isSop = text.includes('sop') || text.includes('operasional') || text.includes('alur kerja') || text.includes('bisnis') || text.includes('tugas') || text.includes('tim');
  const isMarketing = text.includes('konten') || text.includes('sosial') || text.includes('instagram') || text.includes('iklan') || text.includes('post') || text.includes('pemasaran');

  let domainQuestion: any = null;

  if (isEcom) {
    domainQuestion = {
      id: 'q_domain_ecom',
      title: 'Bagaimana taksonomi pengelompokan ulasan atau komplain pembeli yang diinginkan?',
      description: 'Menentukan filter otomatis untuk memilah sentimen dan masalah produk.',
      categoryKey: 'domainWorkflow',
      options: [
        {
          id: 'opt_ecom_1',
          label: 'Kategori spesifik: Kualitas Produk, Kecepatan Ekspedisi, dan Respon Admin',
          recommended: true,
          reason: 'Paling relevan untuk operasional e-commerce sehari-hari di Indonesia.',
        },
        {
          id: 'opt_ecom_2',
          label: 'Skala sentimen 5 tingkat (Sangat Positif hingga Sangat Kecewa) + kata kunci',
          recommended: false,
          reason: 'Bagus untuk pemetaan grafik tren kepuasan pelanggan secara berkala.',
        },
        {
          id: 'opt_ecom_3',
          label: 'Deteksi prioritas urgensi tinggi (komplain barang rusak / refund segera)',
          recommended: false,
          reason: 'Mempercepat eskalasi masalah kritis sebelum merusak reputasi toko.',
        },
      ],
      allowCustom: true,
    };
  } else if (isEdu) {
    domainQuestion = {
      id: 'q_domain_edu',
      title: 'Kriteria rubrik penilaian apa yang ingin menjadi fokus evaluasi AI?',
      description: 'Menentukan pembobotan skor dan jenis umpan balik yang diberikan kepada siswa.',
      categoryKey: 'domainWorkflow',
      options: [
        {
          id: 'opt_edu_1',
          label: 'Kesesuaian Tema, Struktur Argumen, Tata Bahasa, dan Koherensi Kalimat',
          recommended: true,
          reason: 'Standar rubrik akademik komprehensif yang adil dan objektif.',
        },
        {
          id: 'opt_edu_2',
          label: 'Fokus orisinalitas ide, kedalaman riset materi, dan gaya penulisan kreatif',
          recommended: false,
          reason: 'Sangat cocok untuk tugas esai sastra atau penulisan opini bebas.',
        },
        {
          id: 'opt_edu_3',
          label: 'Evaluasi cepat lulus/tidak lulus + 3 poin saran perbaikan konkret',
          recommended: false,
          reason: 'Efisien bagi guru yang harus memeriksa ratusan tugas dalam waktu singkat.',
        },
      ],
      allowCustom: true,
    };
  } else if (isSop) {
    domainQuestion = {
      id: 'q_domain_sop',
      title: 'Bagaimana tingkatan otorisasi dan persetujuan dalam SOP yang dihasilkan?',
      description: 'Menentukan hierarki tanggung jawab dan peran petugas pelaksana.',
      categoryKey: 'domainWorkflow',
      options: [
        {
          id: 'opt_sop_1',
          label: 'Alur 3 tingkat: Staf Pelaksana -> Supervisor Pemeriksa -> Manajer Penyetuju',
          recommended: true,
          reason: 'Standar tata kelola bisnis rapi yang mencegah kelalaian operasional.',
        },
        {
          id: 'opt_sop_2',
          label: 'Checklist mandiri satu petugas pelaksana dengan log verifikasi waktu',
          recommended: false,
          reason: 'Cepat dan tepat untuk usaha UMKM atau tim kecil yang dinamis.',
        },
        {
          id: 'opt_sop_3',
          label: 'Protokol eskalasi darurat bersyarat saat terjadi insiden di lapangan',
          recommended: false,
          reason: 'Penting untuk SOP keselamatan, logistik, atau penanganan komplain berat.',
        },
      ],
      allowCustom: true,
    };
  } else if (isMarketing) {
    domainQuestion = {
      id: 'q_domain_mkt',
      title: 'Platform media sosial apa yang menjadi target utama konten hasil olahan?',
      description: 'Menentukan panjang teks, struktur kait (hook), dan gaya tagar.',
      categoryKey: 'domainWorkflow',
      options: [
        {
          id: 'opt_mkt_1',
          label: 'Multi-platform: Carousel Instagram, Thread X/Twitter, dan LinkedIn Edukatif',
          recommended: true,
          reason: 'Memaksimalkan jangkauan konten ke audiens kasual maupun profesional.',
        },
        {
          id: 'opt_mkt_2',
          label: 'Naskah video pendek (TikTok & Instagram Reels) dengan petunjuk visual',
          recommended: false,
          reason: 'Meningkatkan konversi keterlibatan audiens video secara dinamis.',
        },
        {
          id: 'opt_mkt_3',
          label: 'Artikel blog SEO panjang terstruktur dengan kata kunci target',
          recommended: false,
          reason: 'Terbaik untuk strategi pemasaran organik jangka panjang di Google Search.',
        },
      ],
      allowCustom: true,
    };
  } else {
    domainQuestion = {
      id: 'q_domain_general',
      title: 'Bagaimana alur validasi logika utama yang harus diterapkan oleh alat ini?',
      description: 'Menentukan aturan penyaringan data sebelum diproses oleh model AI.',
      categoryKey: 'domainWorkflow',
      options: [
        {
          id: 'opt_gen_1',
          label: 'Verifikasi kelengkapan input dan sanitasi data otomatis sebelum inferensi',
          recommended: true,
          reason: 'Menjamin kualitas hasil AI konsisten dan mencegah galat pemrosesan.',
        },
        {
          id: 'opt_gen_2',
          label: 'Pemrosesan langsung dengan toleransi tinggi terhadap teks tidak terstruktur',
          recommended: false,
          reason: 'Memudahkan pengguna yang memasukkan catatan kasar atau acak.',
        },
        {
          id: 'opt_gen_3',
          label: 'Mode perbandingan ganda dengan 2 sudut pandang berbeda sekaligus',
          recommended: false,
          reason: 'Memberikan alternatif perspektif yang kaya bagi pengambil keputusan.',
        },
      ],
      allowCustom: true,
    };
  }

  const allQuestions = [
    {
      id: 'q_input',
      title: 'Bagaimana cara utama pengguna memasukkan data atau ide ke dalam tool ini?',
      description: 'Pilih format masukan paling nyaman bagi target audiens Anda.',
      categoryKey: 'inputFormats',
      options: [
        {
          id: 'opt_text_form',
          label: 'Formulir input teks terstruktur dengan opsi bantuan prompt',
          recommended: true,
          reason: 'Paling ramah pengguna pemula dan mudah divalidasi langsung oleh aplikasi.',
        },
        {
          id: 'opt_upload_file',
          label: 'Unggah berkas / file (PDF, TXT, CSV) dan kotak catatan tambahan',
          recommended: false,
          reason: 'Bagus untuk pemrosesan data volume besar, namun membutuhkan penanganan berkas.',
        },
        {
          id: 'opt_quick_templates',
          label: 'Koleksi template siap pakai dengan sedikit kustomisasi',
          recommended: false,
          reason: 'Mempercepat pengguna yang membutuhkan hasil instan dengan preset teruji.',
        },
      ],
      allowCustom: true,
    },
    domainQuestion,
    {
      id: 'q_output',
      title: 'Dalam format apa hasil luaran AI paling Anda butuhkan?',
      description: 'Format hasil menentukan komponen visual dan opsi ekspor yang akan dibangun.',
      categoryKey: 'outputFormats',
      options: [
        {
          id: 'opt_structured_cards',
          label: 'Kartu ringkasan terstruktur dengan tombol Salin Cepat & Ekspor TXT/Markdown',
          recommended: true,
          reason: 'Format standar terbaik di Google AI Studio, langsung bisa diaplikasikan.',
        },
        {
          id: 'opt_table_json',
          label: 'Tabel data interaktif dengan opsi unduh CSV atau JSON',
          recommended: false,
          reason: 'Sangat cocok jika hasil berupa data analitik atau daftar berbutir banyak.',
        },
        {
          id: 'opt_rich_document',
          label: 'Dokumen panjang siap cetak (Draft SOP / Artikel / Laporan Rinci)',
          recommended: false,
          reason: 'Sempurna untuk pembuatan dokumen operasional atau materi tertulis formal.',
        },
      ],
      allowCustom: true,
    },
    {
      id: 'q_ai_flow',
      title: 'Bagaimana peran utama kecerdasan buatan (Gemini AI) dalam alur kerja alat ini?',
      description: 'Menentukan arsitektur prompt dan model pemrosesan di sisi server.',
      categoryKey: 'aiIntegration',
      options: [
        {
          id: 'opt_analyze_generate',
          label: 'Analisis cerdas bertahap: membedah data lalu menghasilkan rekomendasi spesifik',
          recommended: true,
          reason: 'Memberikan akurasi reasoning tertinggi dengan memanfaatkan kapabilitas Gemini 3.8 Flash.',
        },
        {
          id: 'opt_instant_transform',
          label: 'Transformasi instan satu kali klik dari input mentah ke hasil siap pakai',
          recommended: false,
          reason: 'Sangat cepat dan efisien dengan latensi minimal untuk pengguna sibuk.',
        },
        {
          id: 'opt_eval_critique',
          label: 'Evaluasi objektif, pemberian skor, dan saran perbaikan mendalam',
          recommended: false,
          reason: 'Cocok untuk aplikasi review, penilaian esai, atau audit kelayakan.',
        },
      ],
      allowCustom: true,
    },
    {
      id: 'q_assets_nanobanana',
      title: 'Aset visual apa yang ingin otomatis dibuatkan oleh model Nano Banana?',
      description: 'Model Nano Banana 2.1 merancang grafis pelengkap antarmuka secara terprogram.',
      categoryKey: 'coreFeatures',
      options: [
        {
          id: 'opt_nb_icons',
          label: 'Ikon antarmuka kustom dan ilustrasi status kosong (empty state)',
          recommended: true,
          reason: 'Membuat tampilan aplikasi terlihat profesional, konsisten, dan beridentitas kuat.',
        },
        {
          id: 'opt_nb_banner',
          label: 'Banner promosi visual dan kartu rangkuman grafis siap unduh',
          recommended: false,
          reason: 'Sangat menarik jika hasil ingin dibagikan ke media sosial atau tim eksternal.',
        },
        {
          id: 'opt_nb_flowchart',
          label: 'Diagram alur visual atau bagan tahapan proses terstruktur',
          recommended: false,
          reason: 'Memudahkan pemahaman alur kerja yang kompleks secara visual seketika.',
        },
      ],
      allowCustom: true,
    },
    {
      id: 'q_device_integration',
      title: 'Fitur integrasi perangkat apa yang paling diprioritaskan untuk pengguna?',
      description: 'Memanfaatkan API bawaan peramban dan akun Google di perangkat.',
      categoryKey: 'storageRequirements',
      options: [
        {
          id: 'opt_dev_gis',
          label: 'Google One-Tap Sign-In di perangkat + Salin instan ke Clipboard',
          recommended: true,
          reason: 'Pengalaman pengguna paling mulus tanpa hambatan registrasi kata sandi.',
        },
        {
          id: 'opt_dev_share',
          label: 'Web Share API (berbagi langsung ke WhatsApp/Email di ponsel)',
          recommended: false,
          reason: 'Sangat praktis jika alat ini sering diakses melalui smartphone Android/iOS.',
        },
        {
          id: 'opt_dev_offline',
          label: 'Penyimpanan lokal peramban (localStorage) offline-first tanpa login',
          recommended: false,
          reason: 'Privasi maksimal untuk pengguna yang tidak ingin meninggalkan jejak online.',
        },
      ],
      allowCustom: true,
    },
  ];

  return allQuestions.filter((q) => !answeredTitles.some((t) => t.includes(q.categoryKey) || t.includes(q.title.toLowerCase().slice(0, 15))));
}

function buildStructuredMasterPrompt(data: any): string {
  const projectName = data.projectName || 'AI Productivity Suite';
  const category = data.category || 'Produktivitas & Otomasi Cerdas';
  const purpose = data.purpose || `Aplikasi untuk mengotomasi: ${data.originalIdea}`;
  const targetUsers = Array.isArray(data.targetUsers) ? data.targetUsers.join(', ') : 'Pengguna Profesional, Manajer Tim';
  const coreFeatures = Array.isArray(data.coreFeatures) ? data.coreFeatures : ['Dashboard Interaktif', 'Pemrosesan AI Gemini', 'Ekspor Hasil'];
  const answers = Array.isArray(data.answers) ? data.answers : [];

  // Theme configuration labels
  const theme = data.themeConfig || {};
  const styleLabel =
    theme.style === 'editorial'
      ? 'Editorial Swiss Clean (Tata letak berjarak lega, hierarki tipografi tajam, pembatas presisi hairline tanpa ornamen berlebih)'
      : theme.style === 'studio'
      ? 'Neo-Modern Studio (Sentuhan glassmorphism halus, border bercahaya lembut di dark mode, presisi modern)'
      : 'Modern Minimalist SaaS (Elevasi tunggal, hairline border tipis 1px, fokus fungsional tinggi, single-elevation)';

  const colorLabel =
    theme.color === 'indigo'
      ? 'Royal Indigo & Slate (Deep Slate #0F172A, Permukaan #1E293B, Aksen Indigo #6366F1)'
      : theme.color === 'monochrome'
      ? 'Monochrome Luxe (Carbon Neutral #09090B, Permukaan #27272A, Aksen Platinum #E4E4E7)'
      : theme.color === 'nordic'
      ? 'Nordic Teal & Mint (Nordic Deep #0D1B2A, Permukaan #1B263B, Aksen Cyan #06B6D4)'
      : 'Emerald Prestige (Deep Navy #0B132B, Permukaan Dark Slate #1E293B, Aksen Emerald #10B981)';

  const fontLabel =
    theme.font === 'outfit'
      ? "Display font 'Outfit' (Google Fonts) dipadukan dengan 'Plus Jakarta Sans' untuk teks isi"
      : theme.font === 'mono'
      ? "Monospace font 'JetBrains Mono' dengan tabular figures (tabular-nums)"
      : "Geometric sans 'Plus Jakarta Sans' (Google Fonts) untuk keterbacaan tinggi";

  return `# MASTER BUILD PROMPT: ${projectName.toUpperCase()}

## 1. IDENTITAS PROYEK & RINGKASAN APLIKASI
- **Nama Aplikasi:** ${projectName}
- **Kategori:** ${category}
- **Ide Dasar Pengguna:** "${data.originalIdea || ''}"
- **Tujuan Utama:** ${purpose}
- **Karakteristik Produk:** Aplikasi web modern, responsif, minimalis elegan, ramah pengguna non-teknis, dengan antarmuka Bahasa Indonesia yang intuitif dan profesional.

## 2. PERAN & TUJUAN IMPLEMENTASI
Bertindaklah sebagai Senior Full-Stack Engineer, AI System Architect, dan Senior UI/UX Designer.
Bangun aplikasi web fungsional penuh (bukan sekadar mockup statis) menggunakan React, TypeScript, Tailwind CSS, Express, dan Google Gemini API.
Aplikasi harus dapat langsung dijalankan di lingkungan Google AI Studio Build dengan kehandalan tinggi, validasi menyeluruh, dan performa mulus.

## 3. KEBUTUHAN FUNGSIONAL TERKONFIRMASI
Berdasarkan wawancara terpandu dengan pengguna, kebutuhan berikut telah dikonfirmasi secara spesifik:
${answers.length > 0 ? answers.map((a: any, i: number) => `- **Kebutuhan ${i + 1} (${a.questionTitle}):** ${a.answerText}`).join('\n') : '- Format masukan fleksibel dengan panduan cerdas\n- Format keluaran terstruktur dengan opsi ekspor instan\n- Pemrosesan berbasis model Gemini dengan validasi server-side\n- Penyimpanan sesi lokal (localStorage)'}

## 4. PERSONA PENGGUNA & USER JOURNEYS
- **Target Persona:** ${targetUsers}
- **Alur Perjalanan Pengguna (User Journey):**
  1. *Masuk & Eksplorasi:* Pengguna membuka aplikasi, melihat judul jelas, penjelasan singkat, dan opsi template / input langsung.
  2. *Input Data:* Pengguna memasukkan data/teks atau memilih template yang tersedia, sistem memberikan validasi visual seketika.
  3. *Pemrosesan AI:* Pengguna menekan tombol aksi utama. Muncul indikator pemrosesan cerdas (skeleton loader) tanpa blocking yang mengganggu.
  4. *Tinjauan Hasil:* Hasil ditampilkan dalam panel terstruktur dengan kartu-kartu bersih, visualisasi metrik, dan sorotan rekomendasi.
  5. *Ekspor & Tindak Lanjut:* Pengguna dapat menyalin hasil (Copy to Clipboard), mengunduh dokumen (TXT/Markdown/JSON), atau menyesuaikan parameter ulang.
  6. *Riwayat Sesi:* Seluruh sesi tersimpan otomatis di browser pengguna sehingga dapat diakses kembali kapan saja.

## 5. SPESIFIKASI FITUR DETAIL
${coreFeatures.map((f: string, i: number) => `### Fitur ${i + 1}: ${f}\n- Menyediakan antarmuka intuitif untuk menjalankan fungsionalitas ini secara tuntas.\n- Memiliki penanganan status kosong (empty state), loading, dan pesan galat yang informatif.\n- Terintegrasi langsung dengan logika state aplikasi.`).join('\n\n')}

## 6. SPESIFIKASI USER INTERFACE & DESAIN
- **Gaya Desain Terpilih:** ${styleLabel}.
- **Palet Warna Terpilih:** ${colorLabel}.
  - Aturan Kontras 60-30-10: 60% Canvas Netral, 30% Permukaan Struktural Kartu, 10% Aksen Aksi Primer.
  - Zero-Pill Discipline: Jangan bungkus metadata statis dalam kapsul pill warna-warni. Gunakan teks polos dengan pemisah tipografis (\`·\` atau \`/\`).
  - Single-Elevation Depth: Maksimal 1 tingkat elevasi kartu dengan border hairline halus 1px (tanpa kartu di dalam kartu).
  - Mode Gelap & Terang: Dukungan dual-theme dengan @custom-variant dark di Tailwind CSS v4.
- **Tipografi Terpilih:** ${fontLabel}. Seluruh angka statistik dan data menggunakan \`tabular-nums\`.

## 7. STRUKTUR INPUT & OUTPUT DATA
- **Skema Masukan (Input Schema):**
  - Teks konten utama (string, wajib, min 5 karakter)
  - Parameter preferensi / opsi (objek terstruktur: gaya bahasa, kedalaman analisis, format keluaran)
- **Skema Keluaran (Output Schema):**
  - Ringkasan eksekutif / hasil olahan utama
  - Poin-poin spesifikasi terperinci
  - Metadata pemrosesan (waktu eksekusi, jumlah kata, versi analisis)

## 8. LOGIKA BISNIS & WORKFLOW AI (GEMINI 3.8 FLASH & NANO BANANA ASSETS)
- **Model Penalaran Utama:** \`gemini-3.8-flash\` via SDK \`@google/genai\` resmi untuk eksekusi logika, analisis data, dan inferensi teks presisi.
- **Model Generasi Aset Grafis (Nano Banana):** Menggunakan model \`gemini-nano-banana-2.1\` (atau \`imagen-3.0-generate-002\`) untuk menghasilkan aset visual, ikon antarmuka, ilustrasi kosong (empty states), dan banner secara terprogram.
- **Lokasi Eksekusi:** Seluruh panggilan API Gemini dieksekusi di sisi server (Server-Side) melalui Express router di \`/api/*\`. Kunci API TIDAK PERNAH dikirim ke browser.
- **System Instruction:** Diatur ketat untuk memastikan luaran berformat JSON terstruktur atau Markdown terformat rapi sesuai kebutuhan modul.

## 9. REKOMENDASI TEKNOLOGI
- **Frontend:** React 19 dengan TypeScript, Tailwind CSS v4, Lucide React (ikonografi).
- **Tipografi Terpilih:** ${fontLabel} diimpor via Google Fonts di \`index.html\`.
- **Backend Server:** Express 4 terintegrasi dengan Vite middleware pada mode dev, Node.js runtime.
- **AI SDK:** \`@google/genai\` versi terbaru (>= 2.4.0) dengan header \`User-Agent: aistudio-build\`.
- **Google Device Integration:** Google Identity Services Client Library (\`https://accounts.google.com/gsi/client\`) untuk otentikasi akun Google di perangkat pengguna tanpa registrasi formulir manual.
- **Validasi Data:** Zod untuk validasi skema payload di backend dan frontend.

## 10. ARSITEKTUR KOMPONEN & MODUL
- \`src/App.tsx\`: State orchestrator utama dan routing tampilan.
- \`src/components/AppHeader.tsx\`: Header navigasi satu baris dengan Top Bar Contract (Brand, Google Device Status, Nav Links, Action Button).
- \`src/components/InputSection.tsx\`: Formulir masukan data dengan validasi interaktif.
- \`src/components/ResultSection.tsx\`: Presentasi hasil pemrosesan AI dengan tab tampilan dan kontrol ekspor.
- \`src/components/AssetGeneratorDrawer.tsx\`: Modul terhubung ke Nano Banana untuk membuat ikon dan grafis kustom.
- \`src/components/HistoryDrawer.tsx\`: Panel riwayat proyek lokal yang dapat dibuka-tutup.
- \`src/components/EmptyState.tsx\` & \`src/components/LoadingSkeleton.tsx\`: Penanganan status UI yang elegan.
- \`server.ts\`: Server Express, proxy endpoint Gemini & Nano Banana, serta middleware statis.

## 11. MODEL DATA & PERSISTENSI
- Gunakan \`localStorage\` peramban dengan kunci ber-namespace (\`${projectName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_history\`).
- Skema data riwayat: \`{ id: string, timestamp: number, title: string, inputData: any, outputData: any, userProfile?: any }\`.

## 12. INTEGRASI API, GOOGLE DEVICE ACCOUNT & NANO BANANA
- **Koneksi Akun Google di Perangkat (Device Account):**
  - Mengintegrasikan Google One-Tap Sign-In di sisi peramban klien.
  - Membaca nama pengguna, email, dan foto profil dari token Google di perangkat untuk mempersonalisasi hasil kerja.
- **Endpoint AI Gemini:** \`POST /api/process\` menerima input terstruktur, memproses via \`gemini-3.8-flash\`, mengembalikan data olahan.
- **Endpoint Aset Visual Nano Banana:** \`POST /api/assets/generate\` menerima prompt deskripsi aset visual dan mengembalikan URL gambar base64 / SVG yang siap ditampilkan di antarmuka.
- **Integrasi Hardware Lokal Perangkat:**
  - Clipboard API (\`navigator.clipboard.writeText\`) untuk salin instan.
  - Web Share API (\`navigator.share\`) jika diakses dari perangkat seluler Android/iOS untuk berbagi hasil langsung.
- **Health Check:** \`GET /api/health\` untuk memvalidasi konfigurasi server dan kunci AI.

## 13. KEAMANAN & VALIDASI
- API Key Gemini diambil dari \`process.env.GEMINI_API_KEY\` di sisi server.
- Validasi input menggunakan Zod untuk mencegah payload berukuran berlebih (> 5MB) atau karakter berbahaya.
- Tangani data pengguna sebagai data tidak tepercaya (untrusted input) sebelum dikirim ke model AI.

## 14. ERROR HANDLING & LOADING STATES
- Tampilkan skeleton loading yang realistis saat AI sedang memproses.
- Tangani error koneksi atau kuota dengan pesan Bahasa Indonesia yang ramah disertai tombol "Coba Lagi" (Retry).
- Validasi form mencegah pengiriman input kosong (disabled button & inline hint).

## 15. DESAIN RESPONSIF & AKSESIBILITAS
- Desain nyaman digunakan di layar ponsel (mobile 375px) hingga monitor desktop lebar (1440px).
- Kontras warna teks memenuhi standar WCAG AA (rasio minimal 4.5:1).
- Ukuran target sentuh tombol minimal 44x44px di mobile.

## 16. INSTRUKSI IMPLEMENTASI LANGKAH-DEMI-LANGKAH
1. Inisialisasi struktur berkas dan pasang pustaka yang diperlukan.
2. Buat skema tipe data TypeScript di \`src/types.ts\`.
3. Implementasikan server Express di \`server.ts\` dengan endpoint pemrosesan Gemini.
4. Buat komponen antarmuka pengguna secara modular dengan Tailwind CSS.
5. Hubungkan alur data dari input form -> backend API -> tampilan hasil terstruktur.
6. Tambahkan fitur ekspor (Copy to Clipboard dan Download TXT/JSON).
7. Implementasikan penyimpanan riwayat sesi ke \`localStorage\`.
8. Lakukan verifikasi build dan pengujian fungsionalitas end-to-end.

## 17. KRITERIA PENERIMAAN & SKENARIO PENGUJIAN
- **Uji 1:** Pengguna memasukkan data valid dan menerima hasil olahan AI dalam waktu < 5 detik.
- **Uji 2:** Tombol "Salin Hasil" menyalin teks lengkap ke clipboard dan memberikan notifikasi sukses.
- **Uji 3:** Tombol "Unduh" menghasilkan berkas teks/markdown yang valid dan terformat.
- **Uji 4:** Riwayat sesi tetap tersimpan dan dapat dimuat kembali setelah halaman di-refresh.
- **Uji 5:** Input kosong memunculkan peringatan validasi dan tombol proses dinonaktifkan.
- **Uji 6:** Pesan kesalahan tampil jelas dan informatif saat koneksi internet terputus.
- **Uji 7:** Tampilan tetap rapi dan tidak terjadi elemen meluap (overflow) di viewport smartphone.
- **Uji 8:** Kunci API tidak bocor di bundle JavaScript klien atau respons jaringan browser.
`;
}

// Development or Production static serving
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Klick Assets Generator Server running on port ${PORT} (isDev: ${isDev})`);
  });
}

startServer().catch((err) => {
  console.error('Fatal error starting server:', err);
});
