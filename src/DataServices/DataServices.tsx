const apiKey = process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY;

export const currentWeather = async (latitude: number, longitude: number) => {
    const weatherApi = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=imperial`)
    const data = weatherApi.json();
    return data;
}

export const fiveDayFore = async (latitude: number, longitude: number) => {
    const weatherApi = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=imperial`)
    const data = weatherApi.json();
    return data;
}
