import React, { useEffect, useMemo, useState } from "react";
import { MessageSquare, Paperclip, Send, ArrowLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Messages({ onProceed }) {
  const location = useLocation();
  const navigate = useNavigate();
  
  const initialProvider = useMemo(() => {
    return (
      location.state?.provider ||
      (() => {
        try {
          return JSON.parse(localStorage.getItem("lastChatProvider") || "null");
        } catch {
          return null;
        }
      })() ||
      (() => {
        try {
          return JSON.parse(localStorage.getItem("selectedProvider") || "null");
        } catch {
          return null;
        }
      })()
    );
  }, [location.state]);

  const [provider] = useState(initialProvider);
  const headerName = provider?.name || "Provider";

  const [messages, setMessages] = useState([
    {
      from: headerName,
      text: "Thanks for your interest! Could you share drawings?",
      time: "09:12",
    },
    {
      from: "You",
      text: "Uploading shortly. What is current lead time?",
      time: "09:14",
    },
  ]);
  const [text, setText] = useState("");

  useEffect(() => {
    if (provider)
      localStorage.setItem("lastChatProvider", JSON.stringify(provider));
  }, [provider]);

  const send = () => {
    if (!text.trim()) return;
    setMessages((m) => [
      ...m,
      {
        from: "You",
        text: text.trim(),
        time: new Date().toLocaleTimeString().slice(0, 5),
      },
    ]);
    setText("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
            title="Back"
          >
            <ArrowLeft className="h-5 w-5 text-slate-600" />
          </button>
          <h1 className="text-lg font-semibold text-slate-900">Messages</h1>
        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Chat Header */}
          <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-amber-50/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 p-3 text-white shadow-lg shadow-amber-500/25">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-lg">Chat with {headerName}</div>
                  <div className="text-slate-600 text-sm">Secure messaging • Real-time communication</div>
                </div>
              </div>
              <button className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2">
                <Paperclip className="h-4 w-4" />
                Attach Files
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="h-96 overflow-y-auto p-6 bg-white">
            <div className="space-y-4">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.from === "You" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`${
                      m.from === "You"
                        ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/25"
                        : "bg-gradient-to-r from-blue-50 to-blue-100 text-slate-800 border border-blue-200"
                    } max-w-[80%] rounded-2xl px-4 py-3 transition-all duration-200`}
                  >
                    <div className={`text-xs font-medium mb-1 ${m.from === "You" ? "text-amber-100" : "text-blue-600"}`}>
                      {m.from}
                    </div>
                    <div className="text-sm mb-1">{m.text}</div>
                    <div className={`text-xs ${m.from === "You" ? "text-amber-200" : "text-slate-500"}`}>
                      {m.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-3">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Type your message here..."
                className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:ring-2 focus:ring-amber-200 focus:border-amber-500 transition-all"
              />
              <button
                onClick={send}
                className="rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:from-amber-600 hover:to-amber-700 transition-all flex items-center gap-2"
              >
                <Send className="h-4 w-4" />
                Send
              </button>
            </div>
          </div>
        </div>

        {/* Proceed Button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={onProceed}
            className="rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center gap-2"
          >
            <MessageSquare className="h-4 w-4" />
            Mark as engaged → Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}