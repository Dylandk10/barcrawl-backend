import { supabase } from "./supabaseClient";
import { Request } from "express";
import { User as SupaBaseUser } from "@supabase/supabase-js";

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
    const { data: sessionData, error: loginError } =
      await supabase.auth.signInWithPassword({
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

  async authorizeWebToken(req: Request): Promise<SupaBaseUser | null> {
    const token = req.cookies?.["sb-access-token"];

    if (!token) {
      return null;
    }

    try {
      const { data, error } = await supabase.auth.getUser(token);

      if (error || !data.user) {
        return null;
      }

      return data.user;
    } catch (err) {
      throw new Error("Breakdown in supabase!");
    }
  }

  //DO NOT USE - keep pthis though as we may want to do some signups in the future
  async signup(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });

      if (error) {
        return error;
      }

      return data;
    } catch (error: any) {
      throw new Error(error);
    }
  }
}

export default new UserService();
