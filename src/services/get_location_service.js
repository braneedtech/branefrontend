import axios from "axios";
import { location_api_key, location_api_url } from "../constants/urls";

const fetchAddressDetails = async (latitude, longitude) => {
  const url = `${location_api_url}?q=${latitude}+${longitude}&key=${location_api_key}`;

  try {
    const response = await axios.get(url);
    const data = response.data;
    if (data.results && data.results.length > 0) {
      const result = data.results[0];
      const address = {
        country: result.components.country,
        state: result.components.state,
        city: result.components.city,
        pincode: result.components.postcode,
        address: result.formatted,
        district: result.components.state_district,
      };
      return address;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching address details", error);
    return null;
  }
};

export default fetchAddressDetails