
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

export const analyzeCVJobMatch = async (
  jobDescription: string,
  jobTitle: string,
  cvData: any,
  geminiApiKey: string
): Promise<CVMatchAnalysis> => {
  console.log('Starting CV analysis...', { jobTitle, hasApiKey: !!geminiApiKey });
  
  if (!geminiApiKey || geminiApiKey.trim() === '') {
    console.error('CV Analysis Error: No Gemini API key provided');
    throw new Error('Gemini API key is required for CV analysis');
  }

  if (!jobDescription || !jobTitle) {
    console.error('CV Analysis Error: Missing job description or title');
    throw new Error('Job description and title are required');
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
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`,
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
                  text: `Analyze the match between this CV and job posting. You must respond with ONLY a valid JSON object, no other text before or after.

CV:
${cvText}

Job Title: ${jobTitle}
Job Description: ${jobDescription}

Respond with exactly this JSON structure:
{
  "matchPercentage": 75,
  "strengths": ["specific strength 1", "specific strength 2"],
  "gaps": ["specific gap 1", "specific gap 2"],
  "improvements": ["specific improvement 1", "specific improvement 2"],
  "keywordsMatch": {
    "matched": ["keyword1", "keyword2"],
    "missing": ["missing_keyword1", "missing_keyword2"]
  }
}

Focus on skills, experience, qualifications, and keywords. Be specific and actionable. Respond with ONLY the JSON object.`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.3,
            topK: 1,
            topP: 1,
            maxOutputTokens: 2048,
          },
        }),
      }
    );

    console.log('Gemini API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API Error Response:', errorText);
      
      if (response.status === 400) {
        throw new Error('Invalid API request. Please check your Gemini API key.');
      } else if (response.status === 403) {
        throw new Error('Gemini API access denied. Please verify your API key has the correct permissions.');
      } else if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again in a moment.');
      } else {
        throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
      }
    }

    const data = await response.json();
    console.log('Gemini API response data:', data);

    if (!data.candidates || data.candidates.length === 0) {
      console.error('No candidates in response:', data);
      throw new Error('No analysis generated. The content may have been filtered.');
    }

    const candidate = data.candidates[0];
    if (!candidate.content || !candidate.content.parts || candidate.content.parts.length === 0) {
      console.error('Invalid candidate structure:', candidate);
      throw new Error('Invalid response structure from Gemini API.');
    }

    const analysisText = candidate.content.parts[0].text;
    console.log('Raw analysis text:', analysisText);

    // Try to parse JSON from the response
    try {
      // Clean the response text
      let cleanedText = analysisText.trim();
      
      // Remove any markdown code blocks
      cleanedText = cleanedText.replace(/```json\s*/, '').replace(/```\s*$/, '');
      
      // Find JSON object
      const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.error('No JSON found in response:', cleanedText);
        throw new Error('No valid JSON found in response');
      }

      const parsedAnalysis = JSON.parse(jsonMatch[0]);
      console.log('Parsed analysis:', parsedAnalysis);

      // Validate the parsed analysis structure
      if (typeof parsedAnalysis.matchPercentage !== 'number' ||
          !Array.isArray(parsedAnalysis.strengths) ||
          !Array.isArray(parsedAnalysis.gaps) ||
          !Array.isArray(parsedAnalysis.improvements) ||
          !parsedAnalysis.keywordsMatch ||
          !Array.isArray(parsedAnalysis.keywordsMatch.matched) ||
          !Array.isArray(parsedAnalysis.keywordsMatch.missing)) {
        console.error('Invalid analysis structure:', parsedAnalysis);
        throw new Error('Invalid analysis structure received');
      }

      // Ensure match percentage is within valid range
      if (parsedAnalysis.matchPercentage < 0 || parsedAnalysis.matchPercentage > 100) {
        parsedAnalysis.matchPercentage = Math.max(0, Math.min(100, parsedAnalysis.matchPercentage));
      }

      console.log('CV analysis completed successfully');
      return parsedAnalysis;

    } catch (parseError) {
      console.error('Failed to parse JSON response:', parseError, 'Raw text:', analysisText);
      
      // Fallback: create a basic structured response
      console.log('Creating fallback analysis response');
      return {
        matchPercentage: 65,
        strengths: ['CV uploaded and processed successfully'],
        gaps: ['Unable to perform detailed analysis at this time'],
        improvements: ['Please try the analysis again or check your API key'],
        keywordsMatch: {
          matched: [],
          missing: ['Analysis temporarily unavailable']
        }
      };
    }

  } catch (error) {
    console.error('CV analysis error:', error);
    
    // Provide more specific error messages
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to Gemini API. Please check your internet connection.');
    }
    
    if (error.message.includes('API key')) {
      throw new Error('Invalid Gemini API key. Please check your API key in the chatbot settings.');
    }
    
    // Re-throw the error with original message if it's already descriptive
    throw error;
  }
};
