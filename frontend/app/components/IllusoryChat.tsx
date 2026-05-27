"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Phone, Mail, Globe, Moon, Sun, MoreHorizontal } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

type Message = {
    id: string;
    role: 'ai' | 'user';
    content: string | React.ReactNode;
    timestamp: Date;
};

type UserType = 'Individual' | 'Company' | null;

type LeadData = {
    name: string;
    phone: string;
    email: string;
    userType: UserType;
    companyName?: string;
};

const IllusoryChat = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [isTyping, setIsTyping] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [theme, setTheme] = useState<'light' | 'dark'>('dark');
    const [leadData, setLeadData] = useState<LeadData>({
        name: '',
        phone: '',
        email: '',
        userType: null,
    });

    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Auto-open after 3 seconds on first visit
        const hasVisited = localStorage.getItem('illusory_has_visited');
        if (!hasVisited) {
            const timer = setTimeout(() => {
                setIsOpen(true);
                localStorage.setItem('illusory_has_visited', 'true');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, []);

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            addMessage("Hi 👋 I’m KAIRO AI. How can I help you today?", 'ai');
            // Start lead capture flow immediately after greeting if not captured
            const hasLead = localStorage.getItem('illusory_lead_captured');
            if (!hasLead) {
                setTimeout(() => {
                    setCurrentStep(1);
                    addAiFollowUp(
                        <div className="flex flex-col gap-2">
                            <p>Before we begin, may I know your full name?</p>
                            <p className="text-[10px] opacity-50">By continuing, you agree to our privacy policy. Your data is handled securely.</p>
                        </div>
                    );
                }, 1500);
            }
        }
    }, [isOpen, messages.length]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const addMessage = (content: string | React.ReactNode, role: 'ai' | 'user') => {
        const newMessage: Message = {
            id: Math.random().toString(36).substring(7),
            role,
            content,
            timestamp: new Date(),
        };
        setMessages(prev => [...prev, newMessage]);
    };

    const addAiFollowUp = async (content: string | React.ReactNode) => {
        setIsTyping(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsTyping(false);
        addMessage(content, 'ai');
    };

    const validatePhone = (phone: string) => {
        const regex = /^[6789]\d{9}$/;
        return regex.test(phone);
    };

    const validateEmail = (email: string) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleSend = async () => {
        if (!inputValue.trim()) return;

        const userText = inputValue.trim();
        addMessage(userText, 'user');
        setInputValue('');

        // Handle lead capture steps
        if (currentStep === 1) {
            setLeadData(prev => ({ ...prev, name: userText }));
            setCurrentStep(2);
            addAiFollowUp("Great! Can I have your phone number? (10 digits starting with 6,7,8 or 9)");
        } else if (currentStep === 2) {
            if (validatePhone(userText)) {
                setLeadData(prev => ({ ...prev, phone: userText }));
                setCurrentStep(3);
                addAiFollowUp("And your email address?");
            } else {
                addAiFollowUp("That doesn't look like a valid Indian phone number. Please provide a 10-digit number starting with 6, 7, 8, or 9.");
            }
        } else if (currentStep === 3) {
            if (validateEmail(userText)) {
                setLeadData(prev => ({ ...prev, email: userText }));
                setCurrentStep(4);
                addAiFollowUp(
                    <div className="flex flex-col gap-2">
                        <p>Are you inquiring as an Individual or a Company?</p>
                        <div className="flex gap-2 mt-1">
                            <button
                                onClick={() => handleUserTypeSelect('Individual')}
                                className="px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors text-sm"
                            >
                                Individual
                            </button>
                            <button
                                onClick={() => handleUserTypeSelect('Company')}
                                className="px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors text-sm"
                            >
                                Company
                            </button>
                        </div>
                    </div>
                );
            } else {
                addAiFollowUp("Please provide a valid email address.");
            }
        } else if (currentStep === 4) {
            // User Type is "Buttons only", so we ignore text input and prompt to use buttons
            addAiFollowUp("Please select either 'Individual' or 'Company' using the buttons above to proceed.");
        } else if (currentStep === 5) {
            const updatedLead = { ...leadData, companyName: userText };
            setLeadData(updatedLead);
            saveLead(updatedLead);
            setCurrentStep(6);
            addAiFollowUp("Thanks! How can I assist you today?");
        } else {
            // Normal chat response fallback
            handleFallbackResponse(userText);
        }
    };

    const handleUserTypeSelect = (type: UserType) => {
        addMessage(type as string, 'user');
        if (type === 'Company') {
            setLeadData(prev => ({ ...prev, userType: type }));
            setCurrentStep(5);
            addAiFollowUp("What is your company name?");
        } else {
            const updatedLead = { ...leadData, userType: type };
            setLeadData(updatedLead);
            saveLead(updatedLead);
            setCurrentStep(6);
            addAiFollowUp("Thanks! How can I assist you today?");
        }
    };

    const saveLead = (data: LeadData) => {
        const leadEntry = {
            ...data,
            timestamp: new Date().toISOString(),
        };
        localStorage.setItem('illusory_lead_captured', JSON.stringify(leadEntry));
        // Here you would normally send to MongoDB/API
        console.log("Lead captured:", leadEntry);
    };

    const handleFallbackResponse = (query: string) => {
        const q = query.toLowerCase();

        if (q.includes('history') || q.includes('about') || q.includes('founder') || q.includes('director') || q.includes('who started')) {
            addAiFollowUp(
                <span>
                    Illusory Design Studios is a creative rebellion based in Bhubaneswar. We don’t just follow trends—we set them.
                    Led by a crew of visionaries, we turn "what if" into "watch this." Learn more on our <a href="/about" className="underline font-semibold">About page</a>.
                </span>
            );
        } else if (q.includes('service') || q.includes('work') || q.includes('do you do') || q.includes('offer')) {
            addAiFollowUp(
                <span>
                    We offer high-end design, digital marketing, and tech solutions.
                    Our mission is to move with brands that break patterns and build presence.
                    View our <a href="/services" className="underline font-semibold">Services here</a>.
                </span>
            );
        } else if (q.includes('portfolio') || q.includes('past') || q.includes('project') || q.includes('example')) {
            addAiFollowUp(
                <span>
                    We build legacies, not just projects. You can explore our featured work in our <a href="https://drive.google.com/file/d/your-portfolio-link" target="_blank" rel="noopener noreferrer" className="underline font-semibold">Portfolio (PDF)</a>.
                </span>
            );
        } else if (q.includes('price') || q.includes('cost') || q.includes('pricing') || q.includes('how much')) {
            addAiFollowUp("Pricing depends on project scope. Our team can guide you.");
        } else if (q.includes('vision') || q.includes('mission') || q.includes('goal')) {
            addAiFollowUp("Our vision is to lead in shaping how brands influence and endure. We aspire to be the benchmark in creative innovation, where every idea sparks progress.");
        } else if (q.includes('contact') || q.includes('location') || q.includes('address') || q.includes('where')) {
            addAiFollowUp(
                <div className="flex flex-col gap-1">
                    <p>We are located in Bhubaneswar, Odisha.</p>
                    <p>Email: <a href="mailto:official@illusory.design" className="underline">official@illusory.design</a></p>
                    <p>Phone (Team 1): <a href="tel:7681842303" className="underline">+91 7681842303</a></p>
                    <p>Phone (Team 2): <a href="tel:8763923036" className="underline">+91 8763923036</a></p>
                </div>
            );
        } else {
            addAiFollowUp("I want to make sure I give you accurate information. Let me connect you with our team.");
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[9999] font-jakartaSans">
            {/* Floating Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                animate={{
                    boxShadow: [
                        "0 0 0 0px rgba(92, 107, 192, 0.4)",
                        "0 0 0 15px rgba(92, 107, 192, 0)",
                    ]
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                onClick={() => setIsOpen(!isOpen)}
                className="w-16 h-16 rounded-full bg-gradient-to-br from-[#5C6BC0] to-[#E91E63] shadow-lg flex items-center justify-center text-white overflow-hidden border-2 border-white/20"
            >
                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.div
                            key="close"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                        >
                            <X size={30} />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="chat"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            className="w-full h-full"
                        >
                            <img
                                src="/kairo-bot.jpg"
                                alt="Kairo AI Chat"
                                className="w-full h-full object-cover"
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20, originX: 1, originY: 1 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className={cn(
                            "absolute bottom-20 right-0 w-[350px] sm:w-[400px] h-[500px] sm:h-[600px] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-white/20 backdrop-blur-xl",
                            theme === 'dark' ? "bg-black/80 text-white" : "bg-white/80 text-black"
                        )}
                    >
                        {/* Header */}
                        <div className="p-4 bg-gradient-to-r from-[#5C6BC0]/60 to-[#FF4081]/30 flex items-center justify-between border-b border-white/10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20 bg-gradient-to-br from-[#5C6BC0] to-[#E91E63]">
                                    <img
                                        src="/kairo-bot.jpg"
                                        alt="KAIRO AI"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg leading-tight">KAIRO AI</h3>
                                    <p className="text-xs opacity-70 flex items-center gap-2">
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                        </span>
                                        Online
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                    className="p-2 rounded-full hover:bg-white/10 transition-colors"
                                >
                                    {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                                </button>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 rounded-full hover:bg-white/10 transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div
                            ref={scrollRef}
                            className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hidden"
                        >
                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    className={cn(
                                        "flex gap-2 max-w-[85%]",
                                        msg.role === 'ai' ? "self-start" : "self-end flex-row-reverse"
                                    )}
                                >
                                    {msg.role === 'ai' && (
                                        <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-white/10 mt-1">
                                            <img src="/kairo-bot.jpg" alt="Kairo AI" className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                    <div className={cn(
                                        "flex flex-col",
                                        msg.role === 'ai' ? "items-start" : "items-end"
                                    )}>
                                        <div className={cn(
                                            "p-3 rounded-2xl",
                                            msg.role === 'ai'
                                                ? (theme === 'dark' ? "bg-white/10 text-white border border-white/10" : "bg-gray-100 text-black border border-gray-200")
                                                : "bg-gradient-to-br from-[#5C6BC0] to-[#3949AB] text-white shadow-lg"
                                        )}>
                                            {msg.content}
                                        </div>
                                        <span className="text-[10px] opacity-40 mt-1 px-1">
                                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}

                            {isTyping && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex gap-2 self-start"
                                >
                                    <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-white/10">
                                        <img src="/kairo-bot.jpg" alt="Kairo AI" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="bg-white/10 p-3 rounded-2xl border border-white/10">
                                        <div className="flex gap-1">
                                            <motion.span
                                                animate={{ opacity: [0.4, 1, 0.4] }}
                                                transition={{ duration: 1, repeat: Infinity }}
                                                className="w-1.5 h-1.5 rounded-full bg-current"
                                            />
                                            <motion.span
                                                animate={{ opacity: [0.4, 1, 0.4] }}
                                                transition={{ duration: 1, delay: 0.2, repeat: Infinity }}
                                                className="w-1.5 h-1.5 rounded-full bg-current"
                                            />
                                            <motion.span
                                                animate={{ opacity: [0.4, 1, 0.4] }}
                                                transition={{ duration: 1, delay: 0.4, repeat: Infinity }}
                                                className="w-1.5 h-1.5 rounded-full bg-current"
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Quick Actions */}
                        <div className="px-4 py-2 flex gap-2 overflow-x-auto scrollbar-hidden border-t border-white/10">
                            <a
                                href="tel:7681842303"
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs shrink-0 transition-colors"
                            >
                                <Phone size={12} /> Call Team 1
                            </a>
                            <a
                                href="tel:8763923036"
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs shrink-0 transition-colors"
                            >
                                <Phone size={12} /> Call Team 2
                            </a>
                            <a
                                href="mailto:official@illusory.design"
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs shrink-0 transition-colors"
                            >
                                <Mail size={12} /> Email
                            </a>
                            <a
                                href="/"
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs shrink-0 transition-colors"
                            >
                                <Globe size={12} /> Website
                            </a>
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white/5 border-t border-white/10">
                            <div className="relative flex items-center">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder={currentStep === 4 ? "Please select an option above..." : "Type your message..."}
                                    disabled={currentStep === 4}
                                    className={cn(
                                        "w-full bg-transparent border rounded-full py-3 px-5 pr-12 focus:outline-none transition-all text-sm disabled:opacity-50",
                                        theme === 'dark'
                                            ? "border-white/20 focus:border-white/40"
                                            : "border-black/10 focus:border-black/20"
                                    )}
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!inputValue.trim()}
                                    className="absolute right-2 p-2 rounded-full bg-gradient-to-br from-[#5C6BC0] to-[#E91E63] text-white disabled:opacity-50 disabled:grayscale transition-all hover:scale-105 active:scale-95 shadow-md"
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default IllusoryChat;
