
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  // responseMimeType: "text/plain",
};

async function runGeminiScript(str) {
  try {
    const chatSession = model.startChat({
      generationConfig,
    });
  
    const result = await chatSession.sendMessage(str)
    return result.response.text();
  } catch (error) {
    console.log(error)
    console.log(error)
    // return  toast.error("try after some time we are facing problem while generating problem")
  }
  
}

export default runGeminiScript;
