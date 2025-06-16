    import { Request, Response, NextFunction } from 'express';
    import { ZodSchema } from 'zod';

    // pass the zod schema for validation then simple assignt he z.infer to the type in the route method.
    export const validateZod = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
      try {
        schema.parse(req.body);
        next();
      } catch (error: any) {
        res.status(400).json({ message: error.errors });
      }
    }