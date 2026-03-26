"use client"

import { useState } from "react"
import { MessageSquare, X, Send, Sparkles, Bot } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<{ role: "user" | "bot"; content: string }[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const suggestions = [
    "Tell me about Rubenius",
    "What services do you provide?",
    "How can I start a project?",
  ]

  const handleSendMessage = async (text?: string) => {
    const query = text || message
    if (!query.trim() || isLoading) return

    const userMessage = { role: "user" as const, content: query }
    setMessages((prev) => [...prev, userMessage])
    setMessage("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessages((prev) => [...prev, { role: "bot", content: data.answer }])
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "bot", content: "I'm sorry, I encountered an error. Please try again later." },
        ])
      }
    } catch (error) {
      console.error("Chatbot Error:", error)
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "Connection error. Please check your internet and try again." },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[350px] md:w-[400px] h-[550px] bg-white rounded-[32px] shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-8 fade-in duration-500">
          {/* Header */}
          <div className="bg-black p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-black text-sm uppercase tracking-widest">Rubi AI</h3>
                <div className="flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-[10px] text-white/60 font-black uppercase tracking-widest">Always Active</span>
                </div>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/10 rounded-full h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Body */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6 custom-scrollbar bg-gray-50/50">
            {/* Initial Message */}
            <div className="flex gap-3">
              <div className="h-8 w-8 bg-black rounded-xl flex items-center justify-center shrink-0">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="space-y-3 max-w-[80%]">
                <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm text-sm font-medium text-black leading-relaxed">
                  Greetings! I am <span className="font-bold">Rubi</span>, your dedicated AI concierge for Rubenius Interiors. How may I assist you today?
                </div>
                
                {messages.length === 0 && (
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((s, i) => (
                      <button 
                        key={i}
                        onClick={() => handleSendMessage(s)}
                        className="px-4 py-2 bg-white border border-gray-100 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-500 hover:border-black hover:text-black transition-all shadow-sm"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Chat History */}
            {messages.map((msg, i) => (
              <div key={i} className={cn("flex gap-3", msg.role === "user" ? "flex-row-reverse" : "")}>
                <div className={cn(
                  "h-8 w-8 rounded-xl flex items-center justify-center shrink-0",
                  msg.role === "user" ? "bg-gray-200" : "bg-black"
                )}>
                  {msg.role === "user" ? (
                    <div className="text-[10px] font-bold">YOU</div>
                  ) : (
                    <Bot className="h-4 w-4 text-white" />
                  )}
                </div>
                <div className={cn(
                  "max-w-[80%] p-4 rounded-2xl text-sm font-medium leading-relaxed shadow-sm border",
                  msg.role === "user" 
                    ? "bg-black text-white rounded-tr-none border-black" 
                    : "bg-white text-black rounded-tl-none border-gray-100"
                )}>
                  {msg.content}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3">
                <div className="h-8 w-8 bg-black rounded-xl flex items-center justify-center shrink-0">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="h-1.5 w-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <div className="h-1.5 w-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <div className="h-1.5 w-1.5 bg-gray-300 rounded-full animate-bounce" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-6 bg-white border-t border-gray-100">
            <div className="relative flex items-center gap-2">
              <Input 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Compose your inquiry..."
                disabled={isLoading}
                className="h-12 pr-12 rounded-2xl border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-black/5 transition-all text-sm font-medium"
              />
              <Button 
                onClick={() => handleSendMessage()}
                disabled={isLoading}
                size="icon" 
                className="absolute right-1.5 h-9 w-9 bg-black text-white rounded-xl hover:bg-gray-800 transition-all active:scale-90 disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "h-16 w-16 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl relative group overflow-hidden",
          isOpen ? "bg-white text-black rotate-180" : "bg-black text-white hover:scale-110 active:scale-90"
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-black/0 via-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        {isOpen ? <X className="h-7 w-7" /> : <Sparkles className="h-7 w-7" />}
        
        {/* Tooltip */}
        {!isOpen && (
          <div className="absolute right-20 bg-black text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300 shadow-xl pointer-events-none">
            Query Reminious
          </div>
        )}
      </button>
    </div>
  )
}

export default Chatbot
