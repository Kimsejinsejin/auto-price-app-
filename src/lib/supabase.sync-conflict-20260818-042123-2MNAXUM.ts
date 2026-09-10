import { createClient } from '@supabase/supabase-js';

// 프론트엔드 통신을 위한 Anonymous(public) Key를 사용합니다.
// 훗날 사용자님이 실제 발급받은 URL과 Key로 교체하시면 됩니다.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://YOUR_SUPABASE_PROJECT_ID.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseKey);
