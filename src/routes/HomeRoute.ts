import { Router, Request, Response } from "express";
import { PlacesClientAPI } from "../services/PlacesClientAPI";
import { type SearchText, searchTextSchema, signupSchema, type signup } from "../validations/validate";
import { validateZod,  authMiddleware} from "../middleware/middleware";
import userService from "../db/userService";
import { AuthError } from "@supabase/supabase-js";



export class HomeRoute {
  private router: Router;
  private googleClient;

  constructor() {
    this.router = Router();
    this.googleClient = new PlacesClientAPI();
    this.registerRoutes();
  }


  private registerRoutes(): void {
    this.router.get("/", this.index);
    this.router.post("/searchTextTest", authMiddleware, validateZod(searchTextSchema), this.searchTextTest);
    this.router.post("/searchForPlace", this.searchByText);
    this.router.post("/signup", validateZod(signupSchema), this.signup);
    this.router.post('/login', validateZod(signupSchema), this.login);
  }



  private index(req: Request, res: Response): void {
    res.send("Hello from class-based TypeScript route!");
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


  private async searchByText(req: Request, res: Request): Promise<void> {
    const searchText = req.body;
    //just to test the google call
    await this.googleClient.searchByTest(searchText);
  }


  public getRouter(): Router {
    return this.router;
  }


}
