import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const askAI = async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.json({ success: false, message: "Please type a message." });
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const result = await model.generateContent([
            
            message,
        ]);

        const answer = result.response.text();
        res.json({ success: true, answer });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};
