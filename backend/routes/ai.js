const router = require('express').Router();
let openai;
let fallbackMode = false;

try {
  const { Configuration, OpenAIApi } = require('openai');
  const config = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
  openai = new OpenAIApi(config);
} catch (e) {
  console.warn('OpenAI SDK not available or API key missing. Using fallback mode.');
  fallbackMode = true;
}

router.post('/ai/messages', async (req, res) => {
  const { name } = req.body;

  if (fallbackMode || !process.env.OPENAI_API_KEY) {
    return res.json({
      messages: [
        `Hey! Don’t miss out — we’ve got something special for you.`,
        `Come back soon! We’re saving a surprise just for you.`,
        `It’s been a while! Enjoy 10% off your next order.`
      ]
    });
  }

  try {
    const prompt = `Suggest 3 short marketing messages for a campaign named "${name}". Tone: friendly, casual.`;
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt,
      max_tokens: 100,
      temperature: 0.7,
      n: 1,
      stop: ['\n\n']
    });

    const rawText = response.data.choices[0].text.trim();
    const messages = rawText.split('\n').filter(Boolean).map(s => s.replace(/^[-*\d.\s]+/, ''));

    res.json({ messages });
  } catch (err) {
    console.error('AI Error:', err.message);
    res.status(500).json({ error: 'Failed to generate messages.' });
  }
});

module.exports = router;