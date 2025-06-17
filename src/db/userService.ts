import { supabase }from "./supabaseClient";

//public fields for User do not include timestamps or sensitive data like password
interface User {
  id: number;
  email: string;
}

class UserService {
  //create a secure user and have control over the meta
  async createUser(email: string, password: string) {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, //change to false to make sure they have to confirm email 
    });

    if (error) return error;
    return data;
  }

  async login(email: string, password: string) {
    const { data: sessionData, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      return loginError;
    }

    const jwt = sessionData.session?.access_token;
    const refreshToken = sessionData.session?.refresh_token;

    return {
      jwt,
      refreshToken,
      user: sessionData.user,
    };
  }

  //DO NOT USE - keep pthis though as we may want to do some signups in the future
  async signup(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });

      if(error) {
        return error;
      }

      return data;

    } catch(error: any) {
      throw new Error(error);
    }
  }
}

export default new UserService();