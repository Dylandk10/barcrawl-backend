import { Router, Request, Response } from "express";
import { type SearchText, searchTextSchema, signupSchema, type signup } from "../validations/validate";
import { validateZod,  authMiddleware} from "../middleware/middleware";
import userService from "../db/userService";
import { AuthError } from "@supabase/supabase-js";



export class HomeRoute {
  private router: Router;

  constructor() {
    this.router = Router();
    this.registerRoutes();
  }


  private registerRoutes(): void {
    this.router.get("/", this.index);
    this.router.post("/searchTextTest", authMiddleware, validateZod(searchTextSchema), this.searchTextTest);
    this.router.post("/signup", validateZod(signupSchema), this.signup);
    this.router.post('/login', validateZod(signupSchema), this.login);
    this.router.get("/authorize", this.authorize);
    this.router.post("/logout", this.logout);
  }



  private index(req: Request, res: Response): void {
    res.send("Hello from class-based TypeScript route!");
  }

  //used to authorize pages and request from front end similar to middleware but instead returning user for frontend
  private async authorize(req: Request, res: Response) {
      const authenticated = await userService.authorizeWebToken(req);

      if(authenticated === null) {
        res.status(401).send("Not Authorized!");
        return;
      }

      res.status(200).json({user: authenticated});
  }



  private searchTextTest(req: Request, res: Response): void {
    const searchText: SearchText = req.body;
    res.status(200).json(searchText);
  }


  private async signup(req: Request, res: Response): Promise<void> {
    const signupData: signup = req.body;
    const user = await userService.createUser(signupData.email, signupData.password);
  
    if(user instanceof AuthError) {
      res.status(user.status || 400).json({error: user});
      return;
    }
    
    res.status(201).json({
      message: 'Signup successful! Please check your email to confirm your account.',
      user: user.user,
    });
  }

  
  private async login(req: Request, res: Response): Promise<void> {
    const loginData: signup = req.body;
    const user = await userService.login(loginData.email, loginData.password);

    if(user instanceof AuthError) {
      res.status(user.status || 400).json({error: user});
      return;
    }

    res.cookie('sb-access-token', user.jwt, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000,
    }).status(201).json({data: "Signin completeed"});

  }

  private logout(req: Request, res: Response): void {
      res.clearCookie('sb-access-token', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: '/', // match the original path
  });

    res.status(200).json({ message: 'Logged out' });
  }


  public getRouter(): Router {
    return this.router;
  }


}
