import supabase from "./supabaseClient";

//public fields for User do not include timestamps or sensitive data like password
interface User {
  id: number;
  email: string;
}

class UserService {
  async createUser(email: string, password: string){
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: false, // set to false for now while building out route
    });

    if (error) return null;
    return data;
  }
}

export default new UserService();