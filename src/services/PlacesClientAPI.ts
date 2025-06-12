import { PlacesClient } from "@googlemaps/places";
import { ENV } from "../env";
import { error } from "console";

export class PlacesClientAPI {
  private places;

  constructor() {
    this.places = new PlacesClient({
      apiKey: ENV.Google_API_Key,
      region: "US",
    });
  }

  public async searchByTest(query: string): Promise<void> {
    try {
      const searchResult = await this.places.searchText({
        textQuery: query,
      });

      console.log(searchResult);
    } catch(err) {
        console.log(`Error: ${error}`);
    }
  }
}
