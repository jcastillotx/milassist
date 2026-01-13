# OpenRouter Setup Guide

**Quick Start:** Get your MilAssist AI assistant running with OpenRouter in 10 minutes.

---

## 🚀 Step 1: Get OpenRouter API Key

### 1. Visit OpenRouter
Go to [openrouter.ai](https://openrouter.ai)

### 2. Sign Up
- Click "Sign Up" (top right)
- Use email or GitHub account
- Verify your email

### 3. Add Credits
- Click "Add Credits" in the dashboard
- Minimum: $5 (gives you ~$10-15 in API credits)
- Pay with card or crypto

### 4. Get API Key
- Go to "Keys" section
- Click "Create Key"
- Copy the API key (starts with `sk-or-v1-`)

---

## 🔧 Step 2: Configure Environment

### 1. Edit Environment File
```bash
cd /Users/jlaptop/Documents/GitHub/milassist/payload
nano .env
```

### 2. Add OpenRouter Configuration
```env
# OpenRouter AI Provider
OPENROUTER_API_KEY=sk-or-v1-your-actual-api-key-here
OPENROUTER_MODEL=anthropic/claude-3.5-sonnet
```

### 3. Save and Exit
- Press `Ctrl+X`, then `Y`, then `Enter`

---

## 🧪 Step 3: Test the Integration

### 1. Install Dependencies
```bash
cd /Users/jlaptop/Documents/GitHub/milassist/payload
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Test Chat Endpoint
```bash
curl -X POST http://localhost:3000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello! Can you help me with travel planning?"}'
```

**Expected Response:**
```json
{
  "success": true,
  "response": "Hello! I'd be happy to help you with travel planning...",
  "provider": "OpenRouter",
  "model": "anthropic/claude-3.5-sonnet",
  "tokensUsed": 45
}
```

### 4. Test Analysis Endpoint
```bash
curl -X POST http://localhost:3000/api/ai/analyze \
  -H "Content-Type: application/json" \
  -d '{"text": "The service was excellent and very helpful!", "analysisType": "sentiment"}'
```

**Expected Response:**
```json
{
  "success": true,
  "analysis": "The sentiment is overwhelmingly positive...",
  "provider": "OpenRouter",
  "model": "anthropic/claude-3.5-sonnet",
  "tokensUsed": 32
}
```

### 5. Check Available Providers
```bash
curl http://localhost:3000/api/ai/chat
```

**Expected Response:**
```json
{
  "available": true,
  "providers": ["OpenRouter"]
}
```

---

## 🎯 Step 4: Use in Your Frontend

### Update AIAssistant Component

Edit `src/components/AIAssistant.jsx`:

```jsx
import { useState } from 'react'

export default function AIAssistant() {
  const [message, setMessage] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)

  const sendMessage = async () => {
    if (!message.trim()) return

    setLoading(true)
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: message,
          context: {
            userName: 'John Doe', // Get from auth context
            userRole: 'client',   // Get from auth context
            taskContext: 'General assistance'
          }
        })
      })

      const data = await res.json()
      if (data.success) {
        setResponse(data.response)
      } else {
        setResponse('Error: ' + data.message)
      }
    } catch (error) {
      setResponse('Error: ' + error.message)
    }
    setLoading(false)
  }

  return (
    <div className="ai-assistant">
      <div className="response">
        {response && <p>{response}</p>}
      </div>
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask me anything..."
        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
      />
      <button onClick={sendMessage} disabled={loading}>
        {loading ? 'Thinking...' : 'Send'}
      </button>
    </div>
  )
}
```

---

## 💰 Cost Information

### OpenRouter Pricing
- **Claude 3.5 Sonnet:** ~$3 per million input tokens, ~$15 per million output tokens
- **GPT-4 Turbo:** ~$10 per million input tokens, ~$30 per million output tokens
- **Most other models:** $1-5 per million tokens

### Your $5 Credit Gives You
- **~3,000-5,000 messages** with Claude 3.5 Sonnet
- **~1,000-2,000 messages** with GPT-4
- **Enough for development and testing**

### Monitoring Usage
- Check your OpenRouter dashboard for usage
- API responses include `tokensUsed` field
- Set up billing alerts in OpenRouter

---

## 🔧 Advanced Configuration

### Change Model
Edit your `.env` file:

```env
# Different models available:
OPENROUTER_MODEL=anthropic/claude-3.5-sonnet    # Recommended
OPENROUTER_MODEL=openai/gpt-4-turbo-preview    # GPT-4
OPENROUTER_MODEL=meta-llama/llama-3-70b-instruct # Llama
OPENROUTER_MODEL=google/gemini-pro             # Gemini
```

### Add Multiple Providers
For redundancy, add other providers:

```env
# Primary: OpenRouter
OPENROUTER_API_KEY=sk-or-v1-...
OPENROUTER_MODEL=anthropic/claude-3.5-sonnet

# Backup: Claude (direct)
ANTHROPIC_API_KEY=sk-ant-...
CLAUDE_MODEL=claude-3-5-sonnet-20241022

# Backup: OpenAI (direct)
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4-turbo-preview
```

The system will automatically use OpenRouter first, then fall back to others if needed.

---

## 🐛 Troubleshooting

### "No AI providers configured"
**Solution:** Check your `.env` file has the correct `OPENROUTER_API_KEY`

### "Invalid API key"
**Solution:** Make sure you copied the full API key from OpenRouter (starts with `sk-or-v1-`)

### "Insufficient credits"
**Solution:** Add more credits in your OpenRouter dashboard

### "Model not available"
**Solution:** Check available models at [openrouter.ai/models](https://openrouter.ai/models)

### Server won't start
**Solution:** Make sure you ran `npm install` first

---

## 📚 Available Models

### Recommended for MilAssist
- `anthropic/claude-3.5-sonnet` - Best balance of quality and cost
- `anthropic/claude-3-opus` - Highest quality (more expensive)
- `openai/gpt-4-turbo-preview` - Good alternative

### Other Options
- `meta-llama/llama-3-70b-instruct` - Free alternative
- `google/gemini-pro` - Google's model
- `mistralai/mistral-7b-instruct` - Fast and efficient

---

## 🎯 Next Steps

1. ✅ Get OpenRouter API key
2. ✅ Configure environment
3. ✅ Test endpoints
4. 🔄 Update your frontend components
5. 🔄 Add AI features to relevant pages

---

## 📞 Support

- **OpenRouter Docs:** [openrouter.ai/docs](https://openrouter.ai/docs)
- **Model Comparison:** [openrouter.ai/models](https://openrouter.ai/models)
- **API Reference:** [openrouter.ai/docs#api-reference](https://openrouter.ai/docs#api-reference)

---

**Ready to get started?** Follow the steps above and you'll have AI-powered features in your MilAssist platform in minutes! 🚀

**Last Updated:** 2024-01-09
