# AI Providers Setup Guide

This guide explains how to set up multiple AI providers for the MilAssist platform with automatic fallback support.

---

## 🤖 Supported AI Providers

The platform supports 6 AI providers with automatic fallback:

1. **OpenRouter** (Recommended - Access to multiple models)
2. **Claude** (Anthropic)
3. **OpenAI** (GPT-4)
4. **GitHub Copilot**
5. **Grok** (xAI)
6. **Gemini** (Google)

---

## 📋 Environment Variables

Add these to your `payload/.env` file:

```env
# ============================================
# AI PROVIDERS (Multi-provider with fallback)
# ============================================

# OpenRouter (Recommended - Priority 1)
# Provides access to multiple AI models including Claude, GPT-4, etc.
OPENROUTER_API_KEY=sk-or-v1-your-openrouter-api-key
OPENROUTER_MODEL=anthropic/claude-3.5-sonnet  # or any model from OpenRouter

# Claude / Anthropic (Priority 2)
ANTHROPIC_API_KEY=sk-ant-your-anthropic-api-key
CLAUDE_MODEL=claude-3-5-sonnet-20241022

# OpenAI (Priority 3)
OPENAI_API_KEY=sk-your-openai-api-key
OPENAI_MODEL=gpt-4-turbo-preview

# GitHub Copilot (Priority 4)
GITHUB_COPILOT_API_KEY=your-github-copilot-api-key
COPILOT_MODEL=gpt-4

# Grok / xAI (Priority 5)
XAI_API_KEY=xai-your-grok-api-key
GROK_MODEL=grok-beta

# Gemini / Google AI (Priority 6)
GOOGLE_AI_API_KEY=your-google-ai-api-key
GEMINI_MODEL=gemini-pro
```

**Note:** You only need to configure ONE provider minimum. The system will automatically use available providers in priority order with fallback.

---

## 🔑 Getting API Keys

### 1. OpenRouter (Recommended)

**Why OpenRouter?**
- Access to 100+ AI models from one API
- Includes Claude, GPT-4, Llama, Mistral, and more
- Pay-as-you-go pricing
- Automatic fallback between models

**Setup:**
1. Go to [openrouter.ai](https://openrouter.ai)
2. Sign up for an account
3. Navigate to Keys section
4. Create a new API key
5. Add credits to your account ($5 minimum)

**Available Models:**
- `anthropic/claude-3.5-sonnet` (Recommended)
- `openai/gpt-4-turbo-preview`
- `google/gemini-pro`
- `meta-llama/llama-3-70b-instruct`
- And 100+ more

**Cost:** ~$0.003 per 1K tokens (varies by model)

---

### 2. Claude (Anthropic)

**Setup:**
1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Sign up for an account
3. Navigate to API Keys
4. Create a new API key
5. Add payment method

**Available Models:**
- `claude-3-5-sonnet-20241022` (Recommended)
- `claude-3-opus-20240229`
- `claude-3-sonnet-20240229`
- `claude-3-haiku-20240307`

**Cost:** $3 per million input tokens, $15 per million output tokens (Sonnet)

---

### 3. OpenAI

**Setup:**
1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign up for an account
3. Navigate to API Keys
4. Create a new API key
5. Add payment method

**Available Models:**
- `gpt-4-turbo-preview` (Recommended)
- `gpt-4`
- `gpt-3.5-turbo`

**Cost:** $10 per million input tokens, $30 per million output tokens (GPT-4 Turbo)

---

### 4. GitHub Copilot

**Setup:**
1. Have an active GitHub Copilot subscription
2. Go to [GitHub Settings](https://github.com/settings/copilot)
3. Enable API access
4. Generate API token

**Available Models:**
- `gpt-4` (via Copilot)
- `gpt-3.5-turbo`

**Cost:** Included with GitHub Copilot subscription ($10-19/month)

---

### 5. Grok (xAI)

**Setup:**
1. Go to [x.ai](https://x.ai)
2. Request API access (currently in beta)
3. Once approved, get your API key from console

**Available Models:**
- `grok-beta`

**Cost:** Pricing TBA (currently in beta)

---

### 6. Gemini (Google AI)

**Setup:**
1. Go to [ai.google.dev](https://ai.google.dev)
2. Sign in with Google account
3. Navigate to API Keys
4. Create a new API key

**Available Models:**
- `gemini-pro` (Recommended)
- `gemini-pro-vision`

**Cost:** Free tier available, then $0.00025 per 1K characters

---

## 🚀 How It Works

### Automatic Fallback System

The AI service tries providers in priority order:

```
1. OpenRouter → 2. Claude → 3. OpenAI → 4. Copilot → 5. Grok → 6. Gemini
```

If a provider fails (rate limit, error, timeout), it automatically tries the next one.

### Example Flow:

```
User sends message
    ↓
Try OpenRouter → Success! ✅
    ↓
Return response
```

Or with fallback:

```
User sends message
    ↓
Try OpenRouter → Failed (rate limit) ❌
    ↓
Try Claude → Failed (timeout) ❌
    ↓
Try OpenAI → Success! ✅
    ↓
Return response
```

---

## 📡 API Endpoints

### Chat Endpoint

**POST** `/api/ai/chat`

Send a message and get AI response.

**Request:**
```json
{
  "message": "Help me plan a trip to Hawaii",
  "conversationHistory": [
    {
      "role": "user",
      "content": "Previous message"
    },
    {
      "role": "assistant",
      "content": "Previous response"
    }
  ],
  "context": {
    "userName": "John Doe",
    "userRole": "client",
    "taskContext": "Travel planning"
  }
}
```

**Response:**
```json
{
  "success": true,
  "response": "I'd be happy to help you plan your trip to Hawaii...",
  "provider": "OpenRouter",
  "model": "anthropic/claude-3.5-sonnet",
  "tokensUsed": 245
}
```

### Analysis Endpoint

**POST** `/api/ai/analyze`

Analyze text for sentiment, summary, or keywords.

**Request:**
```json
{
  "text": "The service was excellent and the staff was very helpful.",
  "analysisType": "sentiment"
}
```

**Response:**
```json
{
  "success": true,
  "analysis": "The sentiment is overwhelmingly positive...",
  "provider": "Claude",
  "model": "claude-3-5-sonnet-20241022",
  "tokensUsed": 156
}
```

**Analysis Types:**
- `sentiment` - Analyze sentiment (positive/negative/neutral)
- `summary` - Generate a summary
- `keywords` - Extract keywords and topics
- `custom` - Custom analysis with your own prompt

### Status Endpoint

**GET** `/api/ai/chat`

Check which AI providers are configured.

**Response:**
```json
{
  "available": true,
  "providers": ["OpenRouter", "Claude", "OpenAI"]
}
```

---

## 💡 Usage Examples

### In Your React Frontend

```typescript
// Send a chat message
const response = await fetch('/api/ai/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: 'Help me with travel planning',
    context: {
      userName: user.name,
      userRole: user.role,
    }
  })
})

const data = await response.json()
console.log(data.response) // AI response
console.log(data.provider) // Which provider was used
```

### Analyze Text

```typescript
const response = await fetch('/api/ai/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    text: 'Your text here',
    analysisType: 'summary'
  })
})

const data = await response.json()
console.log(data.analysis) // Summary of the text
```

### Check Available Providers

```typescript
const response = await fetch('/api/ai/chat')
const data = await response.json()

if (data.available) {
  console.log('AI providers:', data.providers)
} else {
  console.log('No AI providers configured')
}
```

---

## 🔧 Configuration Tips

### Recommended Setup

**For Development:**
- Use OpenRouter with free credits
- Or use Gemini (has free tier)

**For Production:**
- Configure at least 2 providers for redundancy
- Recommended: OpenRouter + Claude
- Or: OpenAI + Claude + Gemini

### Cost Optimization

1. **Use OpenRouter** - Access multiple models at competitive prices
2. **Set up rate limiting** - Prevent excessive API usage
3. **Cache responses** - Store common queries
4. **Use cheaper models** - For simple tasks, use GPT-3.5 or Gemini

### Security Best Practices

1. **Never commit API keys** - Use environment variables only
2. **Rotate keys regularly** - Change keys every 90 days
3. **Monitor usage** - Set up billing alerts
4. **Implement authentication** - Require user login for AI features
5. **Rate limit requests** - Prevent abuse

---

## 🐛 Troubleshooting

### "No AI providers configured"

**Solution:** Add at least one API key to your `.env` file and restart the server.

### "All AI providers failed"

**Possible causes:**
- Invalid API keys
- Rate limits exceeded
- Network issues
- Provider outages

**Solution:** Check your API keys, verify account status, and ensure you have credits/quota available.

### High costs

**Solution:**
- Switch to cheaper models (GPT-3.5, Gemini)
- Implement caching
- Add rate limiting
- Use OpenRouter for better pricing

### Slow responses

**Solution:**
- Use faster models (GPT-3.5, Claude Haiku)
- Reduce max_tokens parameter
- Implement streaming responses
- Use CDN/edge functions

---

## 📊 Provider Comparison

| Provider | Speed | Cost | Quality | Availability |
|----------|-------|------|---------|--------------|
| OpenRouter | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Claude | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| OpenAI | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Copilot | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| Grok | ⭐⭐⭐ | ❓ | ⭐⭐⭐⭐ | ⭐⭐ |
| Gemini | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

**Recommendation:** Start with OpenRouter for best balance of cost, quality, and availability.

---

## 📞 Support

- **OpenRouter:** [docs.openrouter.ai](https://docs.openrouter.ai)
- **Claude:** [docs.anthropic.com](https://docs.anthropic.com)
- **OpenAI:** [platform.openai.com/docs](https://platform.openai.com/docs)
- **Gemini:** [ai.google.dev/docs](https://ai.google.dev/docs)

---

**Last Updated:** 2024-01-09
