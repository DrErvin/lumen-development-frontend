import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
//const supabaseUrl = 'https://bbecuxasdgkjkkxibiys.supabase.co'; // Replace with your Supabase URL
//const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJiZWN1eGFzZGdramtreGliaXlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4MjY2ODMsImV4cCI6MjA1ODQwMjY4M30.QUabkzPiuzLQrOfm4cOuoOZChpnvaZ0dL8BwY4F9lsI'; // Replace with your anon public key
//export const supabase = createClient(supabaseUrl, supabaseKey);
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
// provjeriti da li radi samo ovaj nacin u produkciji i developmentu enviroment varijable

if (!supabaseUrl || !supabaseKey) {
  console.error("Supabase URL or Key is missing. Please check your environment variables.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Helper function to fetch data from Supabase
export const fetchData = async (table, filters = {}) => {
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .match(filters);

  if (error) throw new Error(error.message);
  return data;
};

// Helper function to insert data into Supabase
export const insertData = async (table, record) => {
  const { data, error } = await supabase
    .from(table)
    .insert([record]);

  if (error) throw new Error(error.message);
  return data;
};

// Helper function to upload files to Supabase Storage
export const uploadFile = async (bucket, file) => {
  const filePath = `${Date.now()}-${file.name}`;
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file);

  if (error) throw new Error(error.message);
  return data;
};

// Retain calculateRemainingDays and scrollToTop as they are
export const calculateRemainingDays = (endingDate) => {
  const currentDate = new Date();
  const targetDate = new Date(endingDate);
  const remainingDays = Math.ceil(
    (targetDate - currentDate) / (1000 * 60 * 60 * 24)
  );

  return remainingDays >= 0
    ? `${remainingDays} Days Left`
    : `Deadline Passed`;
};

export function scrollToTop(smooth = true) {
  window.scrollTo({
    top: 0,
    behavior: smooth ? "smooth" : "auto",
  });
}