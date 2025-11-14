// src/services/chatService.js
import { supabase } from "../lib/supabase";

const meId = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  return user.id;
};

export const chatService = {
  // create or get an existing conversation (projectId must be provided)
  getOrCreateConversation: async (otherId, projectId) => {
    const me = await meId();
    const [a, b] = me < otherId ? [me, otherId] : [otherId, me];
    const { data, error } = await supabase
      .from("conversations")
      .upsert({ project_id: projectId, a, b }, { onConflict: "project_id,a,b" })
      .select("id")
      .single();
    if (error) throw error;
    return data; // { id }
  },

  listConversations: async () => {
    const me = await meId();
    const { data: convs, error } = await supabase
      .from("conversations")
      .select("id, project_id, a, b, created_at")
      .or(`a.eq.${me},b.eq.${me}`)
      .order("created_at", { ascending: false });
    if (error) throw error;

    // enrich with other participant + last message
    const rows = await Promise.all(convs.map(async (c) => {
      const otherId = c.a === me ? c.b : c.a;
      const [{ data: other }, { data: last }] = await Promise.all([
        supabase.from("profiles").select("id,name,role").eq("id", otherId).single(),
        supabase.from("messages")
          .select("body,created_at,sender,is_read")
          .eq("conversation_id", c.id)
          .order("created_at", { ascending: false })
          .limit(1)
      ]);
      return { ...c, other, last: last?.[0] || null };
    }));
    return rows;
  },

  fetchMessages: async (conversationId) => {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });
    if (error) throw error;
    return data;
  },

  subscribe: (conversationId, onNew) => {
    const channel = supabase
      .channel("chat-" + conversationId)
      .on("postgres_changes",
          { event: "INSERT", schema: "public", table: "messages", filter: `conversation_id=eq.${conversationId}` },
          (payload) => onNew(payload.new))
      .subscribe();
    return () => supabase.removeChannel(channel);
  },

  send: async (conversationId, text) => {
    const me = await meId();
    const { error } = await supabase.from("messages").insert([{
      conversation_id: conversationId, sender: me, body: text
    }]);
    if (error) throw error;
  },

  markRead: async (conversationId) => {
    const me = await meId();
    await supabase.from("messages")
      .update({ is_read: true })
      .eq("conversation_id", conversationId)
      .neq("sender", me);
  }
};
