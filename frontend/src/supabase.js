import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://ymhdpyhhxlfgzkgftpog.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltaGRweWhoeGxmZ3prZ2Z0cG9nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2MzMyODUsImV4cCI6MjA5MTIwOTI4NX0.roDcdXidxv1YvbYVDKwhA8NFP0S1F4V2piKsk_j6_yw";

export const supabase = createClient(supabaseUrl, supabaseKey);