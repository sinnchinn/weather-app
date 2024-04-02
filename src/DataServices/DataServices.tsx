import { I5DayForecast, ICity, ICurrentWeather } from "@/Interfaces/Interfaces";

const apiKey = process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY;

export const currentWeather = async (latitude: number, longitude: number) => {
    const weatherApi = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=imperial`)
    const data: ICurrentWeather = await weatherApi.json();
    return data;
}

export const fiveDayFore = async (latitude: number, longitude: number) => {
    const weatherApi = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=imperial`)
    const data: I5DayForecast = await weatherApi.json();
    return data;
}

export const cityApi = async (city: string) => {
    const weatherApi = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=10&appid=${apiKey}`);
    const data: ICity[] = await weatherApi.json();
    return data;
}
