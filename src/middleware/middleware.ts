    import { Request, Response, NextFunction } from 'express';
    import { ZodSchema } from 'zod';
    import { User } from '@supabase/supabase-js';

    import { supabase } from '../db/supabaseClient';

    // pass the zod schema for validation then simple assignt he z.infer to the type in the route method.
    export const validateZod = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
      try {
        schema.parse(req.body);
        next();
      } catch (error: any) {
        res.status(400).json({ message: error.errors });
      }
    }



// authentication for supabase


// Extend Express Request interface to add user property
declare module 'express-serve-static-core' {
  interface Request {
    user?: User;
  }
}

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.cookies?.['sb-access-token'];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  try {
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }

    req.user = data.user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized: Token verification failed' });
  }
}
