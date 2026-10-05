import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Helper for fallback rule-based classification if GEMINI_API_KEY is unavailable or fails
function getRuleBasedClassification(description: string, initialCategory?: string) {
  const text = (description + ' ' + (initialCategory || '')).toLowerCase();

  if (text.includes('car') || text.includes('vehicle') || text.includes('motorcycle') || text.includes('stolen bike') || text.includes('catalytic') || text.includes('license plate')) {
    return {
      suggestedCategory: 'Vehicle Theft',
      confidence: 0.94,
      reasoning: 'Incident details specify theft or tampering of a motor vehicle or vehicular components.',
      urgencyPriority: 'High',
      humanReviewRecommended: false,
      similarPatternNotes: 'Consistent with regional motor vehicle theft reports in transit/parking lots.',
    };
  }

  if (text.includes('hit') || text.includes('punched') || text.includes('attack') || text.includes('fight') || text.includes('physical') || text.includes('threat') || text.includes('weapon')) {
    return {
      suggestedCategory: 'Assault',
      confidence: 0.96,
      reasoning: 'Verbal or physical violent altercation reported requiring prompt investigator review.',
      urgencyPriority: 'Critical',
      humanReviewRecommended: false,
      similarPatternNotes: 'Violent confrontation patterns; potential immediate safety concern.',
    };
  }

  if (text.includes('break-in') || text.includes('broke into') || text.includes('entered home') || text.includes('window broken') || text.includes('intruder') || text.includes('lock picked')) {
    return {
      suggestedCategory: 'Burglary',
      confidence: 0.92,
      reasoning: 'Unlawful forced entry into a residential or commercial building detected in report description.',
      urgencyPriority: 'High',
      humanReviewRecommended: false,
      similarPatternNotes: 'Matches residential forced entry and property intrusion trends.',
    };
  }

  if (text.includes('phishing') || text.includes('hacked') || text.includes('ransomware') || text.includes('crypto') || text.includes('scam online') || text.includes('email wire') || text.includes('identity theft')) {
    return {
      suggestedCategory: 'Cyber Crime',
      confidence: 0.91,
      reasoning: 'Incident involves digital unauthorized access, phishing vectors, or online digital fraud.',
      urgencyPriority: 'Medium',
      humanReviewRecommended: false,
      similarPatternNotes: 'Corresponds with cyber extortion and digital credential compromises.',
    };
  }

  if (text.includes('bank') || text.includes('credit card') || text.includes('check fraud') || text.includes('scam') || text.includes('fake contractor') || text.includes('money transfer')) {
    return {
      suggestedCategory: 'Fraud',
      confidence: 0.89,
      reasoning: 'Financial deception or misappropriation of assets through misrepresentation.',
      urgencyPriority: 'Medium',
      humanReviewRecommended: false,
      similarPatternNotes: 'Financial fraud pattern; documentation of transaction records recommended.',
    };
  }

  if (text.includes('spray') || text.includes('graffiti') || text.includes('smashed glass') || text.includes('property damage') || text.includes('keyed car') || text.includes('slashed tires')) {
    return {
      suggestedCategory: 'Vandalism',
      confidence: 0.93,
      reasoning: 'Intentional physical damage or defacement of public or private property.',
      urgencyPriority: 'Low',
      humanReviewRecommended: false,
      similarPatternNotes: 'Matches neighborhood property defacement and vandalism markers.',
    };
  }

  if (text.includes('stalking') || text.includes('following') || text.includes('unwanted calls') || text.includes('harass') || text.includes('intimidation')) {
    return {
      suggestedCategory: 'Harassment',
      confidence: 0.88,
      reasoning: 'Repeated unwanted contact, intimidation, or stalking behavior reported.',
      urgencyPriority: 'High',
      humanReviewRecommended: false,
      similarPatternNotes: 'Escalating behavioral pattern; protection assessment advised.',
    };
  }

  if (text.includes('wallet') || text.includes('phone stolen') || text.includes('bag') || text.includes('shoplift') || text.includes('picked pocket') || text.includes('stealing')) {
    return {
      suggestedCategory: 'Theft',
      confidence: 0.92,
      reasoning: 'Deprivation of personal property without forcible entry or physical violence.',
      urgencyPriority: 'Medium',
      humanReviewRecommended: false,
      similarPatternNotes: 'Standard petty or grand theft pattern in public/commercial spaces.',
    };
  }

  // Ambiguous case:
  return {
    suggestedCategory: initialCategory || 'Other',
    confidence: 0.65,
    reasoning: 'Description is brief or multifaceted. Human investigator assessment is recommended to confirm correct classification.',
    urgencyPriority: 'Medium',
    humanReviewRecommended: true,
    similarPatternNotes: 'Insufficient distinct incident markers for automated category assignment.',
  };
}

// API endpoint for Gemini-powered crime report analysis
app.post('/api/analyze-report', async (req: Request, res: Response) => {
  const { description, userCategory, location, dateTime } = req.body;

  if (!description || typeof description !== 'string') {
    return res.status(400).json({ error: 'Description is required' });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    // Graceful fallback to rule-based engine when API key is not yet set
    const fallback = getRuleBasedClassification(description, userCategory);
    return res.json(fallback);
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const prompt = `You are the AI Crime Classification Engine for Crime Watch, an academic community safety reporting system.
Analyze the following incident report submitted by a citizen and classify it objectively.

SAFETY DIRECTIVES:
- AI is solely advisory for law enforcement review.
- AI cannot determine guilt, assign legal blame, or predict individual criminals.
- If confidence is below 0.75, set humanReviewRecommended to true.
- Categories MUST be one of: "Theft", "Vehicle Theft", "Assault", "Burglary", "Vandalism", "Fraud", "Cyber Crime", "Harassment", "Other".
- UrgencyPriority MUST be one of: "Low", "Medium", "High", "Critical".

INCIDENT DATA:
- Citizen Description: "${description.replace(/"/g, "'")}"
- Citizen Selected Category: "${userCategory || 'Unspecified'}"
- Location: "${location || 'Unspecified'}"
- Date/Time: "${dateTime || 'Unspecified'}"

Return ONLY a JSON object with this exact schema:
{
  "suggestedCategory": string,
  "confidence": number, // between 0.0 and 1.0
  "reasoning": string, // 1-2 concise sentences explaining why this fits the category
  "urgencyPriority": string, // "Low" | "Medium" | "High" | "Critical"
  "humanReviewRecommended": boolean,
  "similarPatternNotes": string // brief descriptive pattern observation
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    const responseText = response.text?.trim() || '';
    let parsedData;

    try {
      parsedData = JSON.parse(responseText);
    } catch {
      // If parsing fails, fall back to rule-based
      parsedData = getRuleBasedClassification(description, userCategory);
    }

    // Ensure valid boundaries
    if (typeof parsedData.confidence === 'number') {
      parsedData.confidence = Math.max(0.4, Math.min(0.99, parsedData.confidence));
    } else {
      parsedData.confidence = 0.85;
    }

    if (parsedData.confidence < 0.75) {
      parsedData.humanReviewRecommended = true;
    }

    return res.json(parsedData);
  } catch (error) {
    console.error('Gemini API call failed, using fallback rule-based classification:', error);
    const fallback = getRuleBasedClassification(description, userCategory);
    return res.json(fallback);
  }
});

// Vite middleware in development vs static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
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

  app.listen(port, () => {
    console.log(`Crime Watch server running on port ${port}`);
  });
}

startServer();
