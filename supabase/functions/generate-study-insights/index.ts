
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const groqApiKey = Deno.env.get('GROQ_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      programName,
      category,
      correctCount,
      incorrectCount,
      incorrectQuestions,
      difficulty
    } = await req.json();

    // Format context for the AI
    const totalQuestions = correctCount + incorrectCount;
    const successRate = totalQuestions > 0 
      ? Math.round((correctCount / totalQuestions) * 100) 
      : 0;
    
    // Construct the prompt
    const prompt = `
      Du är en lärande-expert som ger råd och insikter på svenska.
      
      Information om användarens studiesession:
      - Program: ${programName}
      - Kategori: ${category}
      - Svårighetsgrad: ${difficulty}
      - Resultat: ${correctCount} rätt av ${totalQuestions} (${successRate}%)
      ${incorrectQuestions && incorrectQuestions.length > 0 
        ? `- Felaktiga svar på följande frågor: ${incorrectQuestions.join(', ')}` 
        : '- Inga felaktiga svar'}
      
      Ge personliga och specifika insikter baserat på prestationen. Inkludera:
      1. En analys av resultatet
      2. Konkreta tips för att förbättra inlärningen av detta ämne
      3. En rekommenderad studieplan eller roadmap baserat på deras prestanda
      4. Speciella studiemetoder relevanta för detta ämne och svårighetsnivå
      
      Håll det koncist och skriv på svenska. Formatera svaret med korta, lättlästa stycken.
    `;

    // Make request to GROQ API
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama3-70b-8192',
        messages: [
          { role: 'system', content: 'Du är en pedagogisk lärande-expert som ger specifika och välformulerade insikter på svenska.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.5,
        max_tokens: 1000
      }),
    });

    const data = await response.json();
    const insights = data.choices?.[0]?.message?.content || 'Kunde inte generera insikter.';

    return new Response(
      JSON.stringify({ insights }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error generating insights:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Ett fel uppstod när insikter skulle genereras.',
        insights: null 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
