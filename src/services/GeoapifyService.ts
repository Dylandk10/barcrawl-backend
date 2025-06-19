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
    lon: string,
    lat: string,
    category: string = "catering.restaurant",
    radius: string = "10000",
    limit: string = "8"
  ) {
    try {
      const url = `https://api.geoapify.com/v2/places?categories=${category}&filter=circle:${lon},${lat},${radius}&limit=${limit}&apiKey=${this.apiKey}`;

      const response = await axios.get(url);

      if (response.status === 200) {
        const places = response.data.features.map((place: any) => ({
          name: place.properties.name || "Unnamed",
          address: place.properties.address_line2,
          lat: place.geometry.coordinates[1],
          on: place.geometry.coordinates[0],
          id: place.properties.place_id,
        }));

        return places;
      }

      // bad request return null
      return null;
    } catch (error) {
      console.log(error);
    }
  }

  async getPlacesNearMeByName(
    name: string,
    lon: string,
    lat: string,
    category: string = "catering.restaurant",
    radius: string = "10000",
    limit: string = "30"
  ) {
    try {
      const url = `https://api.geoapify.com/v2/places?categories=${category}&filter=circle:${lon},${lat},${radius}&name=${encodeURIComponent(name)}&limit=${limit}&apiKey=${this.apiKey}`;

      const response = await axios.get(url);

      if (response.status === 200) {
        const places = response.data.features.map((place: any) => ({
          name: place.properties.name || "Unnamed",
          address: place.properties.address_line2,
          lat: place.geometry.coordinates[1],
          on: place.geometry.coordinates[0],
          id: place.properties.place_id,
          website: place.properties.website || "No Website",
        }));

        return places;
      }

      // bad request return null
      return null;
    } catch (error) {
      console.log(error);
    }
  }

  /*
    @param placeId - this should be the id match coming from the frontend list aka place.properties.place_id from the searchnearbyplaces
  */
  public async getPlaceDetails(placeId: string) {
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

  /*
    geoaplify only takes meters for its radius however most americans use miles to we will have to convert to meters if miles is passed
  */
  private milesToMeters(miles: number): number {
    const METERS_PER_MILE = 1609.34;
    return miles * METERS_PER_MILE;
  }
}

export default new GeoapifyService();
