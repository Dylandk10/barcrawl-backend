import { Router, Request, Response } from "express";
import { PlacesClientAPI } from "../services/PlacesClientAPI";


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
    this.router.post("/searchTextTest", this.searchTextTest);
    this.router.post("/searchForPlace", this.searchByText);
  }

  private index(req: Request, res: Response): void {
    res.send("Hello from class-based TypeScript route!");
  }

  private searchTextTest(req: Request, res: Response): void {
    const data = req.body;
    console.log(data);
    res.json(data);
  }

  private async searchByText(req: Request, res: Request): Promise<void> {
    const searchText = req.body;
    //just to text the google call
    await this.googleClient.searchByTest(searchText);
  }
  public getRouter(): Router {
    return this.router;
  }
}
