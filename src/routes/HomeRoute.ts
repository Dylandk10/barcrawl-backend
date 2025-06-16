import { Router, Request, Response } from "express";
import { PlacesClientAPI } from "../services/PlacesClientAPI";
import { type SearchText, searchTextSchema, signupSchema, type signup } from "../validations/validate";
import { validateZod } from "../middleware/middleware";
import userService from "../db/userService";



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
    this.router.post("/searchTextTest", validateZod(searchTextSchema), this.searchTextTest);
    this.router.post("/searchForPlace", this.searchByText);
    this.router.post("/signup", validateZod(signupSchema), this.signup);
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
    if(user === null) {
      res.status(500).json({error: "Error with creasting a user"});
    }

    res.status(200).json(user);
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
