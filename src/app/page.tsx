'use client'
import { currentWeather, fiveDayFore, cityApi } from "@/DataServices/DataServices";
import { I5DayForecast, ICity, ICurrentWeather } from "@/Interfaces/Interfaces";
import { TextInput } from "flowbite-react"
import { use, useEffect, useState } from "react";

// notes: could not figure out what was wrong with my interface. received help from isaiah who could also not figure out why, was told to pu my list to type any. that was the only way i could access any other index besides 0. anything other than that would be possibly undefined, even though we know that there was data showing in the console.

export default function Home() {

  const [currentLoc, setCurrentLoc] = useState<ICurrentWeather | null>(null);
  const [fiveDay, setFiveDay] = useState<I5DayForecast>();
  const [search, setSearch] = useState<string>("");


  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const getDays = (date: string) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const dayFunc = new Date(date).getDay();
    return days[dayFunc];
  }

  const getFirst = (list: any[]): any[] => {
    const firstForecasts: any[] = [];
    let prevDay = '';

    list.forEach((day: any) => {
      const dayOfWeek = new Date(day.dt_txt).toLocaleDateString('en-US', { weekday: 'long' });
      if (dayOfWeek !== prevDay) {
        firstForecasts.push(day);
        prevDay = dayOfWeek;
      }
    });

    return firstForecasts;
  };

  const handleSearch = async (cityName: string) => {
  
      const cities: ICity[] = await cityApi(cityName);

      if (cities.length > 0) {
        const city: ICity = cities[0];
        const getCurrent = await currentWeather(city.lat, city.lon);
        const getFive = await fiveDayFore(city.lat, city.lon);

        setCurrentLoc(getCurrent);
        setFiveDay(getFive);
      } else {
        console.log("No matching cities found");
      }

  }


  const fetchData = async (latitude: number, longitude: number) => {
    const data = await currentWeather(latitude, longitude);
    const dataFive = await fiveDayFore(latitude, longitude)

    setCurrentLoc(data);
    setFiveDay(dataFive);

    console.log(data);
    console.log(dataFive);
  }


  const current = async () => {

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;

        await fetchData(latitude, longitude);

      }, function (error) {
        console.error("Error getting geolocation:", error);
      });
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }


  useEffect(() => {

    current();

  }, [])


  return (
    <div className="bg-weather-bg bg-cover bg-center w-screen h-screen flex font-mainFont">

      <div style={{ width: '30%' }} className="flex flex-col p-10">

        <div className="border-0 h-screen rounded-2xl bg-mainBg">
          <h1 className="text-center text-3xl text-white mt-4">Favorites</h1>
        </div>

      </div>

      <div style={{ width: '68%' }} className="flex flex-col">
        <div className="flex justify-center p-10 ">
          <TextInput onKeyDown={(e) => {
            if(e.key === "Enter"){
              {handleSearch(search)}
            }
          }} onChange={(e) => setSearch(e.target.value)} className="w-72" />
        </div>

        {/* city name and favorite button */}
        <div className="inline-flex justify-between bg-darkBg p-4 rounded-t-2xl">
          <h1 className="text-white text-4xl">{currentLoc?.name}</h1>
          <span>
            <img src='/Star.png' />
          </span>
        </div>

        {/* weather info */}
        <div className="grid grid-cols-2 bg-mainBg rounded-b-2xl pb-4">

          {/* icon & icon info */}
          <div>
            <div className="flex justify-center">
              <img className="w-72 h-72" src={'https://openweathermap.org/img/wn/' + currentLoc?.weather[0].icon + '@2x.png'} />
            </div>

            <div className="flex justify-center">
              <p className="text-white text-lg"> {currentLoc?.weather[0].description} </p>
            </div>

          </div>

          {/* more info right side */}
          <div className="pr-5">
            <p className="text-center mt-10 text-2xl text-white">{formattedDate}</p>
            <hr className="border" />


            <div className="grid grid-cols-2 pl-14 mt-5 text-white">

              <div>
                <div>
                  {/* checking to see if currentLoc?.main.temp is not undefined, then use Math.round to round up the number, else give an empty string */}
                  <p className="text-9xl">{currentLoc?.main.temp !== undefined ? Math.round(currentLoc.main.temp) + '°' : ''}</p>
                </div>

                <div className="inline-flex">
                  <div className="grid grid-cols-3">
                    <p>{currentLoc?.main.temp_max !== undefined ? 'Hi: ' + Math.round(currentLoc.main.temp_max) + '°' : ''}</p>
                    <div></div>
                    <p>{currentLoc?.main.temp_min !== undefined ? 'Lo: ' + Math.round(currentLoc.main.temp_min) + '°' : ''}</p>
                  </div>
                </div>
              </div>

              <div className="pl-5 text-lg">
                <p>{currentLoc?.main.feels_like !== undefined ? 'Feels Like: ' + Math.round(currentLoc.main.feels_like) + '°' : ''}</p>
                <p>Humidity: {currentLoc?.main.humidity}%</p>
                <p>Wind: {currentLoc?.wind.speed} MPH</p>
              </div>

              <div>

              </div>
            </div>
          </div>
        </div>

        {/* 5 day cards */}
        <div className="grid grid-cols-5 text-white mt-5">

        {getFirst(fiveDay?.list || []).map((day: any, index: number) => (index !== 0 && (

            <div key={index} className="bg-mainBg rounded-2xl w-48 p-2">
              <p className="text-center text-2xl font-extrabold"> {getDays(day.dt_txt)} </p>

              <div className="flex justify-center">
                <img className="" src={'https://openweathermap.org/img/wn/' + day.weather[0].icon + '@2x.png'} />
              </div>

              <p className="text-center">Hi: {Math.round(day.main.temp_max)}° </p>
              <p className="text-center"> Lo: {Math.round(day.main.temp_min)}° </p>
            </div>

          )))}

        </div>
      </div>



    </div>
  );
}
