
interface CVMatchAnalysis {
  matchPercentage: number;
  strengths: string[];
  gaps: string[];
  improvements: string[];
  keywordsMatch: {
    matched: string[];
    missing: string[];
  };
}

const isValidGeminiApiKey = (apiKey: string): boolean => {
  // Gemini API keys should be alphanumeric and around 39 characters
  // They should not contain URLs or curl commands
  if (!apiKey || apiKey.trim() === '') return false;
  if (apiKey.includes('curl') || apiKey.includes('http') || apiKey.includes('key=')) return false;
  if (apiKey.length < 30 || apiKey.length > 50) return false;
  return /^[a-zA-Z0-9_-]+$/.test(apiKey.trim());
};

export const analyzeCVJobMatch = async (
  jobDescription: string,
  jobTitle: string,
  cvData: any,
  geminiApiKey: string
): Promise<CVMatchAnalysis> => {
  console.log('Starting CV analysis...', { jobTitle, hasApiKey: !!geminiApiKey });
  
  // Validate API key format
  if (!isValidGeminiApiKey(geminiApiKey)) {
    console.error('CV Analysis Error: Invalid Gemini API key format');
    throw new Error('Invalid Gemini API key. Please get a valid API key from Google AI Studio and update it in the chatbot settings.');
  }

  if (!jobDescription || !jobTitle) {
    console.error('CV Analysis Error: Missing job description or title');
    throw new Error('Job description and title are required');
  }

  if (!cvData || !cvData.name) {
    console.error('CV Analysis Error: Invalid CV data');
    throw new Error('Valid CV data is required for analysis');
  }

  try {
    const cvText = `
      Name: ${cvData.name || 'Not specified'}
      Email: ${cvData.email || 'Not specified'}
      Phone: ${cvData.phone || 'Not specified'}
      Experience: ${cvData.experience || 'Not specified'}
      Skills: ${cvData.skills || 'Not specified'}
      Education: ${cvData.education || 'Not specified'}
      Additional Info: ${cvData.additionalInfo || 'Not specified'}
    `;

    console.log('Sending request to Gemini API...');

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey.trim()}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Analyze the match between this CV and job posting. Respond with ONLY a valid JSON object.

CV Information:
${cvText}

Job Title: ${jobTitle}
Job Description: ${jobDescription}

Respond with exactly this JSON structure (no other text):
{
  "matchPercentage": 75,
  "strengths": ["specific strength 1", "specific strength 2"],
  "gaps": ["specific gap 1", "specific gap 2"],
  "improvements": ["specific improvement 1", "specific improvement 2"],
  "keywordsMatch": {
    "matched": ["keyword1", "keyword2"],
    "missing": ["missing_keyword1", "missing_keyword2"]
  }
}`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.1,
            topK: 1,
            topP: 0.8,
            maxOutputTokens: 1024,
          },
        }),
      }
    );

    console.log('Gemini API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API Error Response:', errorText);
      
      if (response.status === 400) {
        throw new Error('Invalid Gemini API key. Please get a valid API key from Google AI Studio.');
      } else if (response.status === 403) {
        throw new Error('Gemini API access denied. Please verify your API key permissions.');
      } else if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please wait a moment and try again.');
      } else {
        throw new Error(`Gemini API error (${response.status}). Please check your API key.`);
      }
    }

    const data = await response.json();
    console.log('Gemini API response data:', data);

    if (!data.candidates || data.candidates.length === 0) {
      console.error('No candidates in response:', data);
      throw new Error('No analysis generated. Content may have been filtered.');
    }

    const candidate = data.candidates[0];
    if (!candidate.content?.parts?.[0]?.text) {
      console.error('Invalid candidate structure:', candidate);
      throw new Error('Invalid response structure from Gemini API.');
    }

    const analysisText = candidate.content.parts[0].text.trim();
    console.log('Raw analysis text:', analysisText);

    try {
      // Clean the response and extract JSON
      let cleanedText = analysisText
        .replace(/```json\s*/g, '')
        .replace(/```\s*$/g, '')
        .replace(/^[^{]*/, '')
        .replace(/[^}]*$/, '');

      // Find the JSON object
      const jsonStart = cleanedText.indexOf('{');
      const jsonEnd = cleanedText.lastIndexOf('}');
      
      if (jsonStart === -1 || jsonEnd === -1) {
        throw new Error('No valid JSON found in response');
      }

      const jsonString = cleanedText.substring(jsonStart, jsonEnd + 1);
      const parsedAnalysis = JSON.parse(jsonString);
      
      // Validate required fields
      if (typeof parsedAnalysis.matchPercentage !== 'number' ||
          !Array.isArray(parsedAnalysis.strengths) ||
          !Array.isArray(parsedAnalysis.gaps) ||
          !Array.isArray(parsedAnalysis.improvements) ||
          !parsedAnalysis.keywordsMatch?.matched ||
          !parsedAnalysis.keywordsMatch?.missing) {
        throw new Error('Invalid analysis structure');
      }

      // Ensure match percentage is valid
      parsedAnalysis.matchPercentage = Math.max(0, Math.min(100, parsedAnalysis.matchPercentage));

      console.log('CV analysis completed successfully:', parsedAnalysis);
      return parsedAnalysis;

    } catch (parseError) {
      console.error('Failed to parse analysis response:', parseError);
      console.error('Raw response text:', analysisText);
      
      // Return a basic fallback response
      return {
        matchPercentage: 50,
        strengths: ['CV was successfully processed'],
        gaps: ['Unable to perform detailed analysis - please check API key'],
        improvements: ['Ensure your Gemini API key is valid and try again'],
        keywordsMatch: {
          matched: [],
          missing: ['Analysis unavailable']
        }
      };
    }

  } catch (error) {
    console.error('CV analysis error:', error);
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error. Please check your internet connection.');
    }
    
    // Re-throw with original message if it's already descriptive
    throw error;
  }
};
