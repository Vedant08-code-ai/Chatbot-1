
import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Atom, 
  Trash2, 
  BookOpen, 
  Zap, 
  Plus, 
  MessageSquare,
  Sparkles,
  ChevronRight,
  Menu,
  X,
  History
} from 'lucide-react';
import { Message, PhysicsTopic } from './types';
import { getPhysicsResponse } from './services/gemini';
import MathRenderer from './components/MathRenderer';

const SUGGESTED_PROBLEMS = [
  "A car accelerates from rest at $2.5 m/s^2$ for 10 seconds. How far does it travel?",
  "Calculate the gravitational force between Earth ($6 \times 10^{24} kg$) and a 70kg person.",
  "What is the efficiency of a heat engine that takes 500J of heat and does 150J of work?",
  "Explain the difference between transverse and longitudinal waves."
];

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const textToSend = customText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const response = await getPhysicsResponse([...messages, userMsg]);

    const assistantMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, assistantMsg]);
    setIsLoading(false);
  };

  const clearChat = () => {
    if (window.confirm("Are you sure you want to clear this session?")) {
      setMessages([]);
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden text-slate-100">
      {/* Mobile Menu Toggle */}
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-4 left-4 z-50 p-2 bg-slate-800 rounded-lg lg:hidden"
      >
        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside className={`
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        fixed inset-y-0 left-0 z-40 w-72 bg-slate-900 border-r border-slate-800 transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
      `}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-slate-800 flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-xl shadow-lg shadow-blue-900/20">
              <Atom className="text-white" size={24} />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              PhyQuest
            </h1>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            <div>
              <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3 px-2">
                <Plus size={14} />
                <span>Quick Topics</span>
              </div>
              <div className="grid grid-cols-1 gap-1">
                {Object.values(PhysicsTopic).map((topic) => (
                  <button
                    key={topic}
                    onClick={() => handleSend(undefined, `Tell me about ${topic} in 11th grade physics.`)}
                    className="flex items-center gap-3 w-full px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors group"
                  >
                    <BookOpen size={16} className="group-hover:text-blue-400" />
                    {topic}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3 px-2">
                <History size={14} />
                <span>Controls</span>
              </div>
              <button
                onClick={clearChat}
                className="flex items-center gap-3 w-full px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-950/30 rounded-lg transition-colors"
              >
                <Trash2 size={16} />
                Clear Session
              </button>
            </div>
          </div>

          <div className="p-4 bg-slate-950/50 border-t border-slate-800">
            <div className="flex items-center gap-3 px-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xs font-bold">
                11
              </div>
              <div>
                <p className="text-sm font-medium">Grade 11 Student</p>
                <p className="text-xs text-slate-500">Curriculum: Standard HS</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative min-w-0">
        {/* Header */}
        <header className="h-16 border-b border-slate-800 bg-slate-950/50 backdrop-blur-md flex items-center justify-between px-6 lg:px-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="hidden lg:block">
              <MessageSquare className="text-blue-400" size={20} />
            </div>
            <h2 className="font-semibold">Interactive Solving Session</h2>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs px-2 py-1 bg-green-500/10 text-green-400 rounded-full border border-green-500/20 font-medium hidden sm:block">
              Gemini 3 Pro Active
            </span>
          </div>
        </header>

        {/* Chat Area */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 lg:p-10 space-y-8 scroll-smooth"
        >
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-8 max-w-2xl mx-auto">
              <div className="relative">
                <div className="absolute -inset-4 bg-blue-500/20 blur-2xl rounded-full"></div>
                <div className="relative p-6 bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl">
                  <Sparkles className="text-blue-400 w-12 h-12" />
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-3xl font-bold">Welcome to PhyQuest</h3>
                <p className="text-slate-400 leading-relaxed">
                  I'm your dedicated physics tutor. Paste a problem from your homework, 
                  ask for a conceptual explanation, or try one of the examples below.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                {SUGGESTED_PROBLEMS.map((prob, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(undefined, prob)}
                    className="p-4 text-left text-sm text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl transition-all hover:scale-[1.02] active:scale-95 flex group items-start gap-3"
                  >
                    <ChevronRight size={16} className="shrink-0 mt-0.5 text-blue-500 group-hover:translate-x-1 transition-transform" />
                    <span className="line-clamp-2">{prob}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-8 pb-12">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex gap-4 lg:gap-6 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`
                    shrink-0 w-8 h-8 lg:w-10 lg:h-10 rounded-xl flex items-center justify-center shadow-lg
                    ${msg.role === 'user' ? 'bg-slate-700' : 'bg-blue-600'}
                  `}>
                    {msg.role === 'user' ? (
                      <span className="font-bold text-sm">U</span>
                    ) : (
                      <Atom size={20} className="text-white" />
                    )}
                  </div>
                  <div className={`
                    max-w-[85%] px-5 py-4 rounded-2xl shadow-sm border
                    ${msg.role === 'user' 
                      ? 'bg-slate-800 border-slate-700 text-slate-100' 
                      : 'bg-slate-900 border-slate-800 text-slate-200'}
                  `}>
                    <MathRenderer content={msg.content} />
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-4 lg:gap-6 items-center animate-pulse">
                  <div className="shrink-0 w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center">
                    <Zap size={20} className="text-blue-500 animate-bounce" />
                  </div>
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl px-6 py-4 flex gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-.15s]"></span>
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-.3s]"></span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 lg:p-8 bg-gradient-to-t from-slate-950 via-slate-950 to-transparent shrink-0">
          <form 
            onSubmit={handleSend}
            className="max-w-4xl mx-auto relative group"
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Paste your physics problem here..."
              className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-2xl py-4 pl-5 pr-14 text-slate-100 placeholder:text-slate-500 resize-none transition-all shadow-xl h-24 sm:h-auto sm:min-h-[64px]"
              rows={2}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="absolute right-3 bottom-3 p-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-xl transition-all active:scale-95"
            >
              <Send size={20} />
            </button>
          </form>
          <p className="text-center text-[10px] text-slate-600 mt-4 uppercase tracking-widest">
            Powered by Gemini AI • Enhanced for Physics Logic
          </p>
        </div>
      </main>
    </div>
  );
};

export default App;
