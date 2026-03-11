import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vmboycplmuakipgxxblz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZtYm95Y3BsbXVha2lwZ3h4Ymx6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxOTEwNjcsImV4cCI6MjA4ODc2NzA2N30.deMR0NEhlGqnv-9vsfG-1pSVYurxDVSHKfT6j0xydFI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
