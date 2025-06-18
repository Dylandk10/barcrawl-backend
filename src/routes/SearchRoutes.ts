import { Router, Request, Response } from "express";

export class SearchRoute {
  private router: Router;

  constructor() {
    this.router = Router();
    this.registerRoutes();
  }


  private registerRoutes(): void {
    this.router.get("/searchTest", this.index);
  }



  private index(req: Request, res: Response): void {
    res.send("This is the test route for search routing");
  }




  public getRouter(): Router {
    return this.router;
  }


}