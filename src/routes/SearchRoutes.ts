import { Router, Request, Response } from "express";
import geoapifyService from "../services/GeoapifyService";

export class SearchRoute {
  private router: Router;

  constructor() {
    this.router = Router();
    this.registerRoutes();
  }


  private registerRoutes(): void {
    this.router.get("/searchTest", this.index);
    this.router.post("/searchNearByPlace", this.searchForNearByPlaces);
    this.router.post("/searchNearByPlacesByName", this.searchForNearByPlacesByName);
  }



  private index(req: Request, res: Response): void {
    res.send("This is the test route for search routing");
  }

  private async searchForNearByPlaces(req: Request, res: Response): Promise<void> {
    const placesData = req.body;
    const places = await geoapifyService.getPlacesNearMe(placesData.long, placesData.lat);

    if(places === null) {
      res.status(400).send("Error with searching for nearby places");
      return;
    }

    res.status(200).json(places);
  }

    private async searchForNearByPlacesByName(req: Request, res: Response): Promise<void> {
    const placesData = req.body;
    const places = await geoapifyService.getPlacesNearMeByName(placesData.name, placesData.long, placesData.lat);

    if(places === null) {
      res.status(400).send("Error with searching for nearby places");
      return;
    }

    res.status(200).json(places);
  }



  public getRouter(): Router {
    return this.router;
  }


}