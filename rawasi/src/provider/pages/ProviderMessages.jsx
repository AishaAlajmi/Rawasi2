// C:\Users\aisha\Downloads\Rawasi\rawasi\src\pages\ProviderMessages.jsx
// COMPLETE PROVIDER CHAT INBOX WITH CONVERSATION LIST
import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  BarChart3, Bell, Briefcase, ChevronRight, FolderOpen, Home,
  MessageSquare, User, Menu, Send, Paperclip, Search, MoreVertical,
  Phone, Video, Image as ImageIcon, File, Smile, Loader2, AlertCircle
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function ProviderMessages() {
  const location = useLocation();
  const messagesEndRef = useRef(null);
  
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [error, setError] = useState(null);

  const selectedConversation = conversations.find(c => c.id === selectedConversationId);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Get current user (provider)
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        if (user) {
          setCurrentUserId(user.id);
          console.log("✅ Provider user ID:", user.id);
        } else {
          setError("Please log in to send messages");
        }
      } catch (err) {
        console.error("❌ Error getting user:", err);
        setError("Failed to authenticate user");
      }
    };
    getCurrentUser();
  }, []);

  // Load all conversations for provider
  useEffect(() => {
    if (!currentUserId) return;

    const loadConversations = async () => {
      try {
        setLoading(true);
        console.log("📋 Loading all conversations for provider:", currentUserId);

        // Get conversations where current user is the provider
        const { data: conversationsData, error: convError } = await supabase
          .from("conversations")
          .select("*")
          .eq("provider_id", currentUserId)
          .order("updated_at", { ascending: false });

        if (convError) throw convError;

        console.log(`✅ Loaded ${conversationsData.length} conversations`);
        
        // Get user info from profiles for each conversation
        const conversationIds = conversationsData.map(c => c.user_id);
        const { data: profilesData } = await supabase
          .from("profiles")
          .select("id, name, role")
          .in("id", conversationIds);
        
        // Create a map of user_id to profile
        const profilesMap = {};
        if (profilesData) {
          profilesData.forEach(profile => {
            profilesMap[profile.id] = profile;
          });
        }
        
        // Format conversations with user info
        const formattedConversations = conversationsData.map(conv => {
          const profile = profilesMap[conv.user_id];
          return {
            ...conv,
            userName: profile?.name || conv.user_id?.substring(0, 8) || 'User',
            userEmail: '', // Not available in profiles, but we don't strictly need it
            userProfile: profile
          };
        });

        setConversations(formattedConversations);

        if (formattedConversations.length > 0) {
          setSelectedConversationId(formattedConversations[0].id);
        }

        setError(null);
      } catch (err) {
        console.error("❌ Error loading conversations:", err);
        setError(err.message || "Failed to load conversations");
      } finally {
        setLoading(false);
      }
    };

    loadConversations();
  }, [currentUserId]);

  // Load messages for selected conversation
  useEffect(() => {
    if (!selectedConversationId) return;

    const loadMessages = async () => {
      try {
        console.log("💬 Loading messages for conversation:", selectedConversationId);

        const { data: messagesData, error: messagesError } = await supabase
          .from("messages")
          .select("*")
          .eq("conversation_id", selectedConversationId)
          .order("created_at", { ascending: true });

        if (messagesError) throw messagesError;

        console.log(`✅ Loaded ${messagesData.length} messages`);

        const formattedMessages = messagesData.map((msg) => ({
          id: msg.id,
          sender: msg.sender_id === currentUserId ? "You" : selectedConversation?.userName || "User",
          message: msg.message_text,
          time: new Date(msg.created_at).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }),
          type: msg.sender_id === currentUserId ? "sent" : "received",
          avatar: msg.sender_id === currentUserId ? null : selectedConversation?.userName?.substring(0, 2).toUpperCase()
        }));

        setMessages(formattedMessages);
      } catch (err) {
        console.error("❌ Error loading messages:", err);
      }
    };

    loadMessages();
  }, [selectedConversationId, currentUserId, selectedConversation]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!currentUserId) return;

    console.log("🔔 Setting up real-time subscription for provider conversations");

    const messagesChannel = supabase
      .channel(`provider_messages:${currentUserId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        async (payload) => {
          console.log("📩 New message received:", payload);
          const newMsg = payload.new;

          // If it's for the current conversation, add it
          if (newMsg.conversation_id === selectedConversationId) {
            setMessages((prev) => {
              const exists = prev.some(m => m.id === newMsg.id);
              if (exists) return prev;
              
              return [
                ...prev,
                {
                  id: newMsg.id,
                  sender: newMsg.sender_id === currentUserId ? "You" : selectedConversation?.userName || "User",
                  message: newMsg.message_text,
                  time: new Date(newMsg.created_at).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  }),
                  type: newMsg.sender_id === currentUserId ? "sent" : "received",
                  avatar: newMsg.sender_id === currentUserId ? null : selectedConversation?.userName?.substring(0, 2).toUpperCase()
                },
              ];
            });
          }

          // Update conversations list
          setConversations(prev => {
            return prev.map(conv => {
              if (conv.id === newMsg.conversation_id) {
                return {
                  ...conv,
                  last_message: newMsg.message_text,
                  last_message_at: newMsg.created_at,
                  updated_at: newMsg.created_at
                };
              }
              return conv;
            }).sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
          });
        }
      )
      .subscribe();

    return () => {
      console.log("🔕 Cleaning up subscriptions");
      supabase.removeChannel(messagesChannel);
    };
  }, [currentUserId, selectedConversationId, selectedConversation]);

  // Send message
  const send = async () => {
    if (!message.trim() || !selectedConversationId || !currentUserId || sending) return;

    try {
      setSending(true);
      console.log("📤 Sending message...");
      
      const { data, error } = await supabase
        .from("messages")
        .insert({
          conversation_id: selectedConversationId,
          sender_id: currentUserId,
          message_text: message.trim(),
        })
        .select()
        .single();

      if (error) throw error;

      console.log("✅ Message sent:", data.id);
      setMessage("");
      setError(null);
      
    } catch (err) {
      console.error("❌ Error sending message:", err);
      setError("Failed to send message: " + err.message);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.last_message?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const navItems = [
    { label: "Overview", icon: Home, to: "/provider/dashboard" },
    { label: "Dashboards", icon: Briefcase, badge: 4, to: "/provider/dashboards" },
    { label: "Requests", icon: FolderOpen, badge: 3, to: "/provider/requests" },
    { label: "Messages", icon: MessageSquare, badge: conversations.length, to: "/provider/messages" },
    { label: "Reports", icon: BarChart3, to: "/provider/reports" },
    { label: "Profile", icon: User, to: "/provider/profile" }
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-orange-50/20">
      {/* Left Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 text-white transition-all duration-300 z-50 ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <img 
              src="/photo_2025-08-13_21-03-51.png" 
              alt="Rawasi" 
              className="w-10 h-10 rounded-xl shadow-lg"
            />
            {sidebarOpen && (
              <div>
                <div className="text-xl font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                  RAWASI
                </div>
                <div className="text-xs text-orange-400 font-medium -mt-0.5">Provider Portal</div>
              </div>
            )}
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;

            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                  isActive
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/50'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && (
                  <>
                    <span className="font-medium">{item.label}</span>
                    {item.badge && (
                      <span className="ml-auto px-2 py-0.5 text-xs font-semibold bg-orange-500 text-white rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-3 top-20 bg-slate-800 text-white p-1.5 rounded-full shadow-lg hover:bg-slate-700 transition-all"
        >
          {sidebarOpen ? <ChevronRight className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>

        {sidebarOpen && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700/50">
            <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 cursor-pointer transition-all">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white font-bold shadow-lg">
                AM
              </div>
              <div>
                <p className="text-sm font-medium text-white">Ahmad Mohammed</p>
                <p className="text-xs text-slate-400">Provider</p>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Top Bar */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Messages</h1>
                <p className="text-sm text-slate-600 mt-1">
                  {conversations.length} conversation{conversations.length !== 1 ? 's' : ''} with clients
                </p>
              </div>
              <button className="relative p-2.5 rounded-xl hover:bg-orange-50 text-slate-600 hover:text-orange-600 transition-all">
                <Bell className="h-5 w-5" />
                {conversations.some(c => c.last_message) && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Messages Layout */}
        <div className="flex h-[calc(100vh-88px)]">
          {/* Conversations List */}
          <div className="w-80 border-r border-slate-200 bg-white flex flex-col">
            {/* Search */}
            <div className="p-4 border-b border-slate-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                />
              </div>
            </div>

            {/* Conversations */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="p-6 text-center text-slate-500 text-sm">
                  {searchTerm ? "No conversations found" : "No conversations yet"}
                </div>
              ) : (
                filteredConversations.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => setSelectedConversationId(conv.id)}
                    className={`p-4 border-b border-slate-100 cursor-pointer transition-all ${
                      selectedConversationId === conv.id
                        ? 'bg-orange-50 border-l-4 border-l-orange-500'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-md flex-shrink-0">
                        {conv.userName?.substring(0, 2).toUpperCase() || 'U'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <h4 className="font-semibold text-slate-900 text-sm truncate">
                            {conv.userName || 'User'}
                          </h4>
                          <span className="text-xs text-slate-500 flex-shrink-0 ml-2">
                            {new Date(conv.updated_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mb-1 truncate">
                          {conv.userEmail}
                        </p>
                        <p className="text-sm text-slate-600 truncate">
                          {conv.last_message || 'No messages yet'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col bg-slate-50">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="bg-white px-6 py-4 border-b border-slate-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-md">
                        {selectedConversation.userName?.substring(0, 2).toUpperCase() || 'U'}
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {selectedConversation.userName || 'User'}
                        </h3>
                        <p className="text-xs text-slate-600">
                          {selectedConversation.userEmail}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-slate-100 rounded-lg transition-all">
                        <Phone className="w-5 h-5 text-slate-600" />
                      </button>
                      <button className="p-2 hover:bg-slate-100 rounded-lg transition-all">
                        <Video className="w-5 h-5 text-slate-600" />
                      </button>
                      <button className="p-2 hover:bg-slate-100 rounded-lg transition-all">
                        <MoreVertical className="w-5 h-5 text-slate-600" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                )}

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-slate-400">
                      No messages yet
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.type === 'sent' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex items-end gap-2 max-w-md ${msg.type === 'sent' ? 'flex-row-reverse' : 'flex-row'}`}>
                          {msg.type === 'received' && (
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                              {msg.avatar}
                            </div>
                          )}
                          <div>
                            <div className={`px-4 py-3 rounded-2xl ${
                              msg.type === 'sent'
                                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white'
                                : 'bg-white text-slate-900 border border-slate-200'
                            }`}>
                              <p className="text-sm">{msg.message}</p>
                            </div>
                            <p className={`text-xs text-slate-500 mt-1 ${msg.type === 'sent' ? 'text-right' : 'text-left'}`}>
                              {msg.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="bg-white px-6 py-4 border-t border-slate-200">
                  <div className="flex items-end gap-2">
                    <button className="p-2 hover:bg-slate-100 rounded-lg transition-all">
                      <Paperclip className="w-5 h-5 text-slate-600" />
                    </button>
                    <button className="p-2 hover:bg-slate-100 rounded-lg transition-all">
                      <ImageIcon className="w-5 h-5 text-slate-600" />
                    </button>
                    <button className="p-2 hover:bg-slate-100 rounded-lg transition-all">
                      <File className="w-5 h-5 text-slate-600" />
                    </button>
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        placeholder="Type a message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyPress}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 pr-12"
                      />
                      <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-slate-200 rounded-lg transition-all">
                        <Smile className="w-5 h-5 text-slate-600" />
                      </button>
                    </div>
                    <button 
                      onClick={send}
                      disabled={!message.trim() || sending}
                      className="p-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:shadow-lg hover:shadow-orange-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {sending ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Send className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <MessageSquare className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500 text-lg font-medium">
                    {loading ? 'Loading conversations...' : 'Select a conversation to start messaging'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}