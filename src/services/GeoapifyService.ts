import axios from "axios";
import { ENV } from "../env";

class GeoapifyService {
  private apiKey;
  constructor() {
    this.apiKey = ENV.Geoapify_api_key;
  }

  /*
        @param category is the category example would be catering.restaurant or catering.bar or catering.nightclub
        @param raduis is the raduis in meters. Meaning 100000 is about 62 mile search
        @param limit is the amount of places you want returned 10 will be the default to save api request but we can increase to maybe say 25 per search
    */
  async getPlacesNearMe(
    category: string,
    lon: string,
    lat: string,
    radius: string = "100000",
    limit: string = "10"
  ) {
    try {
      const url = `https://api.geoapify.com/v2/places?categories=${category}&filter=circle:${lon},${lat},${radius}&bias=proximity:${lon},${lat}&limit=${limit}&apiKey=${this.apiKey}`;

      const response = await axios.get(url);
      const places = response.data.features.map((place: any) => ({
        name: place.properties.name || "Unnamed",
        address: place.properties.address_line1,
        lat: place.geometry.coordinates[1],
        on: place.geometry.coordinates[0],
      }));

      //for debugging
      console.log(places);
      return places;
    } catch (error) {
      console.log(error);
    }
  }

  /*
    @param placeId - this should be the id match coming from the frontend list
  */
  async getPlaceDetails(placeId: string) {
    try {
      const url = `https://api.geoapify.com/v2/places/${placeId}?apiKey=${this.apiKey}`;
      const response = await axios.get(url);

      const place = response.data.features[0];
      if (!place) {
        console.log("Place not found");
        return;
      }

      console.log("Place Details:");
      console.log("Name:", place.properties.name);
      console.log("Address:", place.properties.formatted);
      console.log("Phone:", place.properties.phone);
      console.log("Website:", place.properties.website);
      console.log("Opening Hours:", place.properties.opening_hours);
      console.log("Categories:", place.properties.categories);
    } catch (error: any) {
      console.error(
        "Error fetching place details:",
        error.response?.data || error.message
      );
    }
  }
}

export default new GeoapifyService();
