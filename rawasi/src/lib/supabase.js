// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js'

// Supabase credentials
const supabaseUrl = 'https://clokjrgjijzwqjryjkvn.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsb2tqcmdqaWp6d3Fqcnlqa3ZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4MDk0NTUsImV4cCI6MjA3NDM4NTQ1NX0.kOjRLgVAivbwoOqWxZeKOtDHR1v2BORa2g_JzvPb2nQ'  // Replace with your actual key

export const supabase = createClient(supabaseUrl, supabaseAnonKey)