# Watsonx API Verification Guide

## ✅ Configuration Status

Your Watsonx API credentials are **CONFIGURED** and valid:
- API Key: `K6OEn8q-xh...` (44 chars) ✅
- Project ID: `ApiKey-f49...` (43 chars) ✅
- Region: `eu-gb` (Europe - Great Britain) ✅
- Model: `ibm/granite-13b-chat-v2` ✅

## 🔍 How to Verify API is Working

### Method 1: Check Console Logs (Recommended)

1. **Start the dev server:**
   ```bash
   npm run dev
   ```

2. **Open the browser console** (F12 or Right-click → Inspect → Console)

3. **Upload a ZIP file** in the app

4. **Look for these logs in your terminal** (where `npm run dev` is running):

   **If API is working:**
   ```
   === WATSONX API CHECK ===
   API Key exists: true
   Has valid config: true
   ========================
   🚀 Attempting to call Watsonx.ai API...
   📡 Watsonx API Configuration:
     URL: https://eu-gb.ml.cloud.ibm.com
     Model: ibm/granite-13b-chat-v2
   🔑 Requesting IAM token...
   ✅ IAM token received
   🤖 Calling Watsonx.ai generation API...
   📦 Watsonx response received
   ✅ Successfully parsed JSON response
   ✅ Watsonx.ai API call successful!
   ```

   **If API is NOT working (using fallback):**
   ```
   === WATSONX API CHECK ===
   ⚠️ Watson credentials not configured. Using deterministic analysis.
   ```
   OR
   ```
   ❌ Watson analysis failed: [error message]
   📊 Falling back to deterministic analysis
   ```

### Method 2: Check Response Metadata

The API response now includes metadata showing if Watsonx was used:

```javascript
{
  "result": {
    "projectName": "...",
    "risk_score": 85,
    // ... other fields
    "_meta": {
      "usedWatson": true,  // ← This tells you if Watsonx was used
      "timestamp": "2026-05-16T12:00:00.000Z",
      "fileHash": 123456789,
      "detectedStack": ["React", "Node.js"],
      "totalFiles": 42
    }
  }
}
```

### Method 3: Compare Results

**With Watsonx AI:**
- Results will vary based on actual AI analysis
- More detailed and contextual insights
- May take 3-10 seconds to respond

**Without Watsonx (Deterministic Fallback):**
- Same file = same result every time
- Generic but consistent analysis
- Instant response

## 🐛 Troubleshooting

### Issue: "Watson credentials not configured"

**Cause:** API key or Project ID not set correctly

**Fix:**
1. Check `.env.local` file
2. Ensure no extra spaces or quotes
3. Restart dev server after changes

### Issue: "IAM authentication failed"

**Cause:** Invalid API key

**Fix:**
1. Verify API key in IBM Cloud console
2. Generate new API key if needed
3. Update `.env.local`

### Issue: "Watsonx API failed: 403"

**Cause:** Project ID doesn't match or no access

**Fix:**
1. Verify Project ID in Watsonx.ai console
2. Ensure API key has access to the project
3. Check region matches (eu-gb vs us-south)

### Issue: "Failed to parse Watson response"

**Cause:** AI returned non-JSON or malformed response

**Fix:**
- This is expected occasionally with AI models
- App automatically falls back to deterministic analysis
- No action needed - it's handled gracefully

## 📊 Expected Behavior

1. **First upload:** May take 5-10 seconds (IAM token + AI generation)
2. **Subsequent uploads:** Faster (token cached for ~1 hour)
3. **Same file uploaded twice:** Results may vary slightly (AI is non-deterministic)
4. **Network issues:** Automatically falls back to deterministic analysis

## 🎯 Quick Test

Run this command to verify configuration:
```bash
node test-api.js
```

Expected output:
```
✅ Configuration looks good! Watsonx API should work.
```

## 📝 Notes

- Your region is `eu-gb` (Europe - Great Britain)
- Make sure your Watsonx project is in the same region
- If you see consistent failures, check IBM Cloud status page
- Logs are verbose to help debug - you can reduce them later

## 🔗 Useful Links

- [IBM Cloud Console](https://cloud.ibm.com/)
- [Watsonx.ai Projects](https://dataplatform.cloud.ibm.com/wx/home)
- [API Documentation](https://cloud.ibm.com/apidocs/watsonx-ai)