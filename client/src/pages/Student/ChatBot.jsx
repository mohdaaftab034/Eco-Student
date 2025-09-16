import { useContext, useState } from "react";
import { motion } from "framer-motion";
import { Send, Leaf } from "lucide-react";
import { userDataContext } from "../../Context/UserContext";

const ChatBox = () => {
    const { user, axios } = useContext(userDataContext);
    const [messages, setMessages] = useState([
        { role: "ai", text: "🌍 Hello! I’m your Eco-AI. Ask me anything about the environment!" }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const newMsg = { role: "student", text: input };
        setMessages((prev) => [...prev, newMsg]);
        setInput("");
        setLoading(true);

        try {
            const res = await axios.post(
                "/api/chat/ai",
                { message: input }, // data payload
                { headers: { "Content-Type": "application/json" } } //  config
            );

            // Axios automatically gives parsed JSON in res.data
            setMessages((prev) => [...prev, { role: "ai", text: res.data.reply }]);
        } catch (err) {
            setMessages((prev) => [...prev, { role: "ai", text: " Error connecting to AI" }]);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="flex justify-center items-center bg-transparent w-full h-full">
            <div className="flex flex-col h-[100vh] w-full max-w-2xl mx-auto border border-black bg-gradient-to-br from-green-50 via-green-100 to-green-200 rounded-2xl shadow-lg p-4">

                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto space-y-3 mb-3 p-2">
                    {messages.map((msg, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className={`flex ${msg.role === "student" ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`px-4 py-2 rounded-2xl max-w-[70%] shadow-md text-sm ${msg.role === "student"
                                    ? "bg-gradient-to-r from-green-400 to-green-500 text-white"
                                    : "bg-white text-gray-800 border border-green-200 flex items-start gap-2"
                                    }`}
                            >
                                {msg.role === "ai" && <Leaf className="w-4 h-4 text-green-500 mt-1" />}
                                <span>{msg.text}</span>
                            </div>
                        </motion.div>
                    ))}
                    {loading && <p className="text-gray-500 text-sm">AI is typing...</p>}
                </div>

                {/* Input Area */}
                <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-md">
                    <input
                        type="text"
                        className="flex-1 outline-none p-2 text-sm"
                        placeholder="Ask about the environment..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    />
                    <button
                        onClick={sendMessage}
                        className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ChatBox;
