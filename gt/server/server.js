const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { OpenAI } = require('openai'); // OpenAI SDK for Perplexity API
const { MongoClient, ServerApiVersion } = require('mongodb');
const bcrypt = require('bcrypt');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const uri = process.env.MONGO_KEY;
let mongoClient;

const app = express();
app.use(cors());
app.use(express.json());

async function connectToMongo() {
  try {
    const client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("✅ Connected to MongoDB");
    mongoClient = client;
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
}

const perplexity = new OpenAI({
  apiKey: process.env.PERPLEXITY_API_KEY,
  baseURL: 'https://api.perplexity.ai',
});

// Chatbot endpoint
app.post('/chatbox', async (req, res) => {
  const { message } = req.body;
  console.log('💬 User Message:', message);
  try {
    const systemPrompt = `You are a world-class financial analyst bot named 'FinBot'. Your sole purpose is to provide expert, data-driven financial advice.
- When asked about your identity, respond with: "I am FinBot, your personal financial assistant."
- For financial questions, provide clear, concise, and actionable advice on investments, savings, budgeting, and planning. Justify your recommendations with recent data, statistics, and trends. Use latest information from reputable financial news outlets like Bloomberg, Reuters, The Economic Times, and Moneycontrol etc for your analysis. Explain the 'why' behind your advice, referencing relevant geopolitical events, government policies, and macroeconomic principles.
- If the user's question is not related to finance, you must politely decline by saying: "As FinBot, my expertise is strictly in financial matters. I can't assist with that request."`;

    const response = await perplexity.chat.completions.create({
      model: 'sonar-pro',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
    });

    console.log('Raw API response:', response);

    if (
      response &&
      Array.isArray(response.choices) &&
      response.choices[0] &&
      response.choices[0].message &&
      typeof response.choices[0].message.content === 'string'
    ) {
      const reply = response.choices[0].message.content;
      console.log('✅ AI Response:', reply);
      res.json({ text: reply });
    } else {
      console.error('❌ Unexpected API response structure:', response);
      res.status(500).json({ error: 'Unexpected AI response structure.' });
    }
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

// User signin
app.post('/signin', async (req, res) => {
  const { username, password } = req.body;
  try {
    const db = mongoClient.db('FINTECH');
    const usersCollection = db.collection('CREDENTIALS');
    const user = await usersCollection.findOne({ USERNAME: username });
    if (user && await bcrypt.compare(password, user.PASSWORD)) {
      res.json({ success: true, message: 'Sign-in successful' });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('❌ Sign-in error:', error);
    res.status(500).json({ error: 'Something went wrong during sign-in.' });
  }
});

// User signup
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  try {
    const db = mongoClient.db('FINTECH');
    const usersCollection = db.collection('CREDENTIALS');
    const user = await usersCollection.findOne({ USERNAME: username });
    if (user) {
      res.json({ success: false, message: 'USER EXISTS' });
    } else {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      await usersCollection.insertOne({ USERNAME: username, PASSWORD: hashedPassword });
      res.status(201).json({ success: true, message: 'Signup successful' });
    }
  } catch (error) {
    console.error('❌ Sign-up error:', error);
    res.status(500).json({ error: 'Something went wrong during sign-up.' });
  }
});

// Get portfolio
app.post('/portfolio', async (req, res) => {
  const { username } = req.body;
  try {
    const db = mongoClient.db('FINTECH');
    const portfolioCollection = db.collection('PORTFOLIO');
    const portfolio = await portfolioCollection.findOne({ USERNAME: username });
    if (portfolio) {
      res.json({ success: true, portfolio });
    } else {
      res.json({ success: false, message: 'No portfolio found' });
    }
  } catch (error) {
    console.error('❌ Portfolio retrieval error:', error);
    res.status(500).json({ error: 'Something went wrong during portfolio retrieval.' });
  }
});

// Update portfolio
app.post('/updatePortfolio', async (req, res) => {
  const { username, name, phone, stocks, crypto, gold } = req.body;
  try {
    const db = mongoClient.db('FINTECH');
    const portfolioCollection = db.collection('PORTFOLIO');
    const filter = { USERNAME: username };
    const updateDoc = { $set: { NAME: name, PHONE: phone, STOCKS: stocks, CRYPTO: crypto, GOLD: gold } };
    const options = { upsert: true };
    await portfolioCollection.updateOne(filter, updateDoc, options);
    res.json({ success: true, message: 'Portfolio updated successfully' });
  } catch (error) {
    console.error('❌ Portfolio update error:', error);
    res.status(500).json({ error: 'Something went wrong during portfolio update.' });
  }
});

// News summary and portfolio rating
app.post('/news', async (req, res) => {
  const { portfolio } = req.body;
  try {
    const systemPrompt = `You are a financial news analyst. Your task is to analyze the user's investment portfolio and provide a concise, up-to-the-minute news summary and a portfolio rating. Also give a concise analysis of the portfolio and suggestions for the investor if needed. You MUST respond with ONLY a valid JSON object. Do not include any text before or after the JSON. The JSON object must have three keys: "news_summary", "portfolio_rating", and "analysis_and_suggestions".
- "news_summary": A string containing a bulleted list of the top 5 most relevant and recent news headlines that could impact the user's holdings.
- "portfolio_rating": An integer between 1 and 10. This rating should reflect the portfolio's health and positioning based on current market conditions, geopolitical events, government policies, and macroeconomic trends.
Analyze the following portfolio:`;

    const userPortfolio = JSON.stringify(portfolio, null, 2);
    const response = await perplexity.chat.completions.create({
      model: 'sonar-pro',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPortfolio }
      ],
    });

    const rawReply = response.choices?.[0]?.message?.content;
    if (!rawReply) throw new Error('AI response content missing');

    let parsedReply;
    try {
      parsedReply = JSON.parse(rawReply);
    } catch (parseError) {
      console.error('❌ JSON Parsing Error in /news route:', parseError);
      console.error('Raw AI Response that failed parsing:', rawReply);
      throw new Error('Failed to parse AI response as JSON.');
    }

    res.json({ news: parsedReply.news_summary, rating: parsedReply.portfolio_rating, analysis: parsedReply.analysis_and_suggestions });

  } catch (error) {
    console.error('❌ News Error:', error);
    res.status(500).json({ error: 'Something went wrong while fetching news.' });
  }
});

// Fetch asset price info
app.post('/price', async (req, res) => {
  const { assetType, name } = req.body;
  try {
    const prompt = `
You are a financial data API. Provide the current market price, the market price from exactly 7 days ago, and the percentage return for a given asset.
You MUST respond with ONLY a valid JSON object. Do not include any other text or markdown.
The JSON object must have three keys: "current_price", "previous_price", and "weekly_return_percentage".
All prices must be a number in INDIAN RUPEES (INR). The return must also be a number.
Asset Type: ${assetType}
Asset Name: ${name}
`;

    const response = await perplexity.chat.completions.create({
      model: 'sonar-pro',
      messages: [{ role: 'user', content: prompt }],
    });

    const rawReply = response.choices?.[0]?.message?.content;
    if (!rawReply) throw new Error('AI response content missing');

    let parsedData;
    try {
      parsedData = JSON.parse(rawReply);
    } catch (parseError) {
      console.error('❌ JSON Parsing Error in /price route:', parseError);
      console.error('Raw AI Response that failed parsing:', rawReply);
      throw new Error('Failed to parse AI response as JSON.');
    }

    res.json({
      success: true,
      currentPrice: parsedData.current_price,
      previousPrice: parsedData.previous_price,
      weeklyReturn: parsedData.weekly_return_percentage
    });

  } catch (error) {
    console.error('❌ Price Error:', error);
    res.status(500).json({ error: 'Something went wrong while fetching the price.' });
  }
});

const PORT = process.env.PORT || 5000;

connectToMongo().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
});
