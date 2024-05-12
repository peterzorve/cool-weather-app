import axios from "axios";

const apiKey = "2f82fbab701d477a8f3225600240905"

const forecastEndpoint = params => `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${params.cityName}&days=${params.days}&aqi=no&alerts=no`
const locationEndpoint = params => `http://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${params.cityName}`
                                    

const apiCall = async (endpoint) => {
    const options = {
        method: "GET", 
        url: endpoint
    }
    try {
        const response = await axios.request(options)
        // console.log("33333", response.data)
        return response.data;
    } catch (error) {
        // console.log("error: ", error)
        return null;
    }
}

export const fetchWeatherForcast = params => {
    return apiCall(forecastEndpoint(params))
}

export const fetchLocations = params => {
    return apiCall(locationEndpoint(params))
}