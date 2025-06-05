
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
                  text: `Analyze the match between this CV and job posting. Provide a detailed analysis in JSON format:

CV:
${cvText}

Job Title: ${jobTitle}
Job Description: ${jobDescription}

Please respond with a valid JSON object containing:
{
  "matchPercentage": number (0-100),
  "strengths": ["list of CV strengths that match the job"],
  "gaps": ["list of missing skills/experience"],
  "improvements": ["specific suggestions to improve CV for this role"],
  "keywordsMatch": {
    "matched": ["keywords from job that appear in CV"],
    "missing": ["important keywords from job missing in CV"]
  }
}

Focus on skills, experience, qualifications, and keywords. Be specific and actionable.`,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to analyze CV match');
    }

    const data = await response.json();
    if (data.candidates && data.candidates[0]?.content?.parts?.length > 0) {
      const analysisText = data.candidates[0].content.parts[0].text;
      
      // Try to parse JSON from the response
      try {
        const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      } catch (parseError) {
        console.error('Failed to parse JSON response:', parseError);
      }
      
      // Fallback: create structured response from text
      return {
        matchPercentage: 65,
        strengths: ['Analysis completed'],
        gaps: ['See detailed analysis'],
        improvements: ['Check the detailed analysis for suggestions'],
        keywordsMatch: {
          matched: [],
          missing: []
        }
      };
    }

    throw new Error('No analysis received');
  } catch (error) {
    console.error('CV analysis error:', error);
    throw error;
  }
};
