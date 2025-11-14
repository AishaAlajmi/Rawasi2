// C:\Users\aisha\Downloads\Rawasi\rawasi\src\pages\Messages.jsx
// COMPLETE USER CHAT INBOX WITH CONVERSATION LIST
import React, { useEffect, useState, useRef } from "react";
import {
  MessageSquare,
  Paperclip,
  Send,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Search,
  MoreVertical,
  Phone,
  Video,
  Image as ImageIcon,
  File,
  Smile,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function Messages({ onProceed }) {
  const location = useLocation();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  // State
  const [conversations, setConversations] = useState([]);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Get current conversation
  const selectedConversation = conversations.find(
    (c) => c.id === selectedConversationId
  );

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Get current user
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();
        if (error) throw error;
        if (user) {
          setCurrentUserId(user.id);
          console.log("✅ Current user ID:", user.id);
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

  // Load all conversations for current user
  useEffect(() => {
    if (!currentUserId) return;

    const loadConversations = async () => {
      try {
        setLoading(true);
        console.log("📋 Loading all conversations for user:", currentUserId);

        const { data: conversationsData, error: convError } = await supabase
          .from("conversations")
          .select("*")
          .eq("user_id", currentUserId)
          .order("updated_at", { ascending: false });

        if (convError) throw convError;

        console.log(`✅ Loaded ${conversationsData.length} conversations`);
        setConversations(conversationsData);

        // If we have a provider from navigation, create/select that conversation
        const provider = location.state?.provider;
        if (provider?.email) {
          const existingConv = conversationsData.find(
            (c) => c.provider_email === provider.email
          );

          if (existingConv) {
            setSelectedConversationId(existingConv.id);
          } else {
            // Create new conversation
            await createConversation(provider);
          }
        } else if (conversationsData.length > 0) {
          // Select first conversation by default
          setSelectedConversationId(conversationsData[0].id);
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
  }, [currentUserId, location.state]);

  // Create new conversation with provider
  const createConversation = async (provider) => {
    try {
      console.log("🆕 Creating conversation with provider:", provider);

      // Get provider auth_user_id
      let providerAuthId = provider.auth_user_id;

      if (!providerAuthId && provider.email) {
        const { data, error } = await supabase
          .from("provider")
          .select("auth_user_id")
          .eq("email", provider.email)
          .single();

        if (error) throw error;
        providerAuthId = data.auth_user_id;
      }

      if (!providerAuthId) {
        throw new Error("Provider not found in database");
      }

      const { data: newConv, error: createError } = await supabase
        .from("conversations")
        .insert({
          user_id: currentUserId,
          provider_id: providerAuthId,
          provider_name: provider.name || provider.company_name,
          provider_email: provider.email,
          last_message: "Conversation started",
          last_message_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (createError) throw createError;

      console.log("✅ Created conversation:", newConv.id);

      // Add to conversations list and select it
      setConversations((prev) => [newConv, ...prev]);
      setSelectedConversationId(newConv.id);
    } catch (err) {
      console.error("❌ Error creating conversation:", err);
      setError(err.message);
    }
  };

  // Load messages for selected conversation
  useEffect(() => {
    if (!selectedConversationId) return;

    const loadMessages = async () => {
      try {
        console.log(
          "💬 Loading messages for conversation:",
          selectedConversationId
        );

        const { data: messagesData, error: messagesError } = await supabase
          .from("messages")
          .select("*")
          .eq("conversation_id", selectedConversationId)
          .order("created_at", { ascending: true });

        if (messagesError) throw messagesError;

        console.log(`✅ Loaded ${messagesData.length} messages`);

        const formattedMessages = messagesData.map((msg) => ({
          id: msg.id,
          from:
            msg.sender_id === currentUserId
              ? "You"
              : selectedConversation?.provider_name || "Provider",
          text: msg.message_text,
          time: new Date(msg.created_at).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }),
          sender_id: msg.sender_id,
          type: msg.sender_id === currentUserId ? "sent" : "received",
        }));

        setMessages(formattedMessages);
      } catch (err) {
        console.error("❌ Error loading messages:", err);
      }
    };

    loadMessages();
  }, [selectedConversationId, currentUserId, selectedConversation]);

  // Subscribe to real-time updates for all conversations
  useEffect(() => {
    if (!currentUserId) return;

    console.log("🔔 Setting up real-time subscription for all conversations");

    // Subscribe to new messages
    const messagesChannel = supabase
      .channel(`user_messages:${currentUserId}`)
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

          // If it's for the current conversation, add it to messages
          if (newMsg.conversation_id === selectedConversationId) {
            setMessages((prev) => {
              const exists = prev.some((m) => m.id === newMsg.id);
              if (exists) return prev;

              return [
                ...prev,
                {
                  id: newMsg.id,
                  from:
                    newMsg.sender_id === currentUserId
                      ? "You"
                      : selectedConversation?.provider_name || "Provider",
                  text: newMsg.message_text,
                  time: new Date(newMsg.created_at).toLocaleTimeString(
                    "en-US",
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    }
                  ),
                  sender_id: newMsg.sender_id,
                  type:
                    newMsg.sender_id === currentUserId ? "sent" : "received",
                },
              ];
            });
          }

          // Update conversations list
          setConversations((prev) => {
            return prev
              .map((conv) => {
                if (conv.id === newMsg.conversation_id) {
                  return {
                    ...conv,
                    last_message: newMsg.message_text,
                    last_message_at: newMsg.created_at,
                    updated_at: newMsg.created_at,
                  };
                }
                return conv;
              })
              .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
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
    if (!text.trim() || !selectedConversationId || !currentUserId || sending)
      return;

    try {
      setSending(true);
      console.log("📤 Sending message...");

      const { data, error } = await supabase
        .from("messages")
        .insert({
          conversation_id: selectedConversationId,
          sender_id: currentUserId,
          message_text: text.trim(),
        })
        .select()
        .single();

      if (error) throw error;

      console.log("✅ Message sent:", data.id);
      setText("");
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

  // Filter conversations
  const filteredConversations = conversations.filter(
    (conv) =>
      conv.provider_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.provider_email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
            title="Back"
          >
            <ArrowLeft className="h-5 w-5 text-slate-600" />
          </button>
          <h1 className="text-lg font-semibold text-slate-900">Messages</h1>
          {conversations.length > 0 && (
            <span className="ml-auto text-sm text-slate-600">
              {conversations.length} conversation
              {conversations.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-73px)]">
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
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-500 text-sm"
              />
            </div>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
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
                      ? "bg-amber-50 border-l-4 border-l-amber-500"
                      : "hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white font-bold shadow-md flex-shrink-0">
                      {conv.provider_name?.substring(0, 2).toUpperCase() || "P"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="font-semibold text-slate-900 text-sm truncate">
                          {conv.provider_name || "Provider"}
                        </h4>
                        <span className="text-xs text-slate-500 flex-shrink-0 ml-2">
                          {new Date(conv.updated_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mb-1 truncate">
                        {conv.provider_email}
                      </p>
                      <p className="text-sm text-slate-600 truncate">
                        {conv.last_message || "No messages yet"}
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
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white font-bold shadow-md">
                      {selectedConversation.provider_name
                        ?.substring(0, 2)
                        .toUpperCase() || "P"}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {selectedConversation.provider_name || "Provider"}
                      </h3>
                      <p className="text-xs text-slate-600">
                        {selectedConversation.provider_email}
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

              {/* Error Display */}
              {error && (
                <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-red-800 font-medium text-sm">Error</p>
                    <p className="text-red-700 text-xs">{error}</p>
                  </div>
                </div>
              )}

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-slate-400 text-sm">
                    No messages yet. Start the conversation! 👋
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${
                        msg.type === "sent" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`flex items-end gap-2 max-w-md ${
                          msg.type === "sent" ? "flex-row-reverse" : "flex-row"
                        }`}
                      >
                        {msg.type === "received" && (
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                            {selectedConversation.provider_name
                              ?.substring(0, 2)
                              .toUpperCase() || "P"}
                          </div>
                        )}
                        <div>
                          <div
                            className={`px-4 py-3 rounded-2xl ${
                              msg.type === "sent"
                                ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/25"
                                : "bg-white text-slate-900 border border-slate-200"
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap break-words">
                              {msg.text}
                            </p>
                          </div>
                          <p
                            className={`text-xs text-slate-500 mt-1 ${
                              msg.type === "sent" ? "text-right" : "text-left"
                            }`}
                          >
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
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      onKeyDown={handleKeyPress}
                      disabled={!!error}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-500 pr-12 disabled:bg-slate-100 disabled:cursor-not-allowed"
                    />
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-slate-200 rounded-lg transition-all">
                      <Smile className="w-5 h-5 text-slate-600" />
                    </button>
                  </div>
                  <button
                    onClick={send}
                    disabled={!text.trim() || sending || !!error}
                    className="p-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl hover:shadow-lg hover:shadow-amber-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
                  {loading
                    ? "Loading conversations..."
                    : "Select a conversation to start messaging"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
