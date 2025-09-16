import fetch from 'node-fetch';

export const askAI = async (req, res) => {
    const {message} = req.body;

    try {
        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + process.env.GEMINI_API_KEY,
            {
                method: "POST",
                headers: { "Content-Type" : "application/json"},
                body: JSON.stringify({
                    contents: [{role: "user", parts: [{ text: message}]}]
                })
            }
        )

        const data = await response.json();
        console.log(data);
        const aiReply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a response.";

        res.json({success: true, reply: aiReply});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}