import { supabase } from "../config/supabase.js";

const fetchUserProfile = async (uid) => {
  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("user_id", uid)
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Error fetching profile:", error.message);
    return null;
  }
  console.log("Fetched profile:", data);
  return data;
};

export { fetchUserProfile };
