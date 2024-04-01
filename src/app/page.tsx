'use client'
import { currentWeather, fiveDayFore } from "@/DataServices/DataServices";
import { I5DayForecast, ICurrentWeather } from "@/Interfaces/Interfaces";
import FiveDayComponent from "@/components/FiveDayComponent";
import { TextInput } from "flowbite-react"
import Image from "next/image";
import { format } from "path";
import { use, useEffect, useState } from "react";

type weatherData = {
  date: string
  max: number
  min: number
  icon: string
}

export default function Home() {

  const [currentLoc, setCurrentLoc] = useState<ICurrentWeather | null>(null);
  const [fiveDay, setFiveDay] = useState<I5DayForecast>();
  const [dayUno, setDayUno] = useState<string>("");
  

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

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
        const {latitude, longitude} = position.coords;
        
        await fetchData(latitude, longitude);
        
      }, function(error) {
        console.error("Error getting geolocation:", error);
      });
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }


  useEffect(() => {

    current();

  }, [])



  // const fiveDay2 = async (lat: number, lon: number) => {
  //   const dataFive = await fiveDayFore(lat, lon);


  //   let dayData: weatherData[] = dataFive.list.map(date => {
  //     return ({
  //       date: date.dt_txt.slice(0, 10),
  //       max: date.main.temp_max,
  //       min: date.main.temp_min,
  //       icon: date.weather[0].icon
  //     })
  //   })
  // }



  return (
    <div className="bg-weather-bg bg-cover bg-center w-screen h-screen flex font-mainFont">

      <div style={{ width: '30%' }} className="flex flex-col p-10">

        <div className="border-0 h-screen rounded-2xl bg-mainBg">
          <h1 className="text-center text-3xl text-white mt-4">Favorites</h1>
        </div>

      </div>

      <div style={{ width: '68%' }} className="flex flex-col">
        <div className="flex justify-center p-10 ">
          <TextInput className="w-72" />
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


          <div className="bg-mainBg rounded-2xl w-48 p-2">
            <p className="text-center text-2xl font-extrabold"> {dayUno} </p>

            <div className="flex justify-center">
              <img className="" src={'https://openweathermap.org/img/wn/' + fiveDay?.list[0].weather[0].icon + '@2x.png'} />
            </div>

            <p className="text-center">Hi: {fiveDay && fiveDay?.list[8].main.temp_max} </p>
            <p className="text-center"> Lo: 60°</p>
          </div>

          {/* <div className="bg-mainBg rounded-2xl w-48 p-2">
            <p className="text-center text-2xl font-extrabold"> {dayDos} </p>

            <div className="flex justify-center">
              <img className="" src={'https://openweathermap.org/img/wn/' + fiveDay?.list[0].weather[0].icon + '@2x.png'} />
            </div>

            <p className="text-center"> Hi: </p>
            <p className="text-center"> Lo: 60°</p>
          </div>

          <div className="bg-mainBg rounded-2xl w-48 p-2">
            <p className="text-center text-2xl font-extrabold"> {dayTres} </p>

            <div className="flex justify-center">
              <img className="w-28 h-28" src="/cloudy.png" />
            </div>

            <p className="text-center"> Hi: </p>
            <p className="text-center"> Lo: 60°</p>
          </div>

          <div className="bg-mainBg rounded-2xl w-48 p-2">
            <p className="text-center text-2xl font-extrabold"> {dayQuad} </p>

            <div className="flex justify-center">
              <img className="w-28 h-28" src="/cloudy.png" />
            </div>

            <p className="text-center"> Hi: </p>
            <p className="text-center"> Lo: 60°</p>
          </div>

          <div className="bg-mainBg rounded-2xl w-48 p-2">
            <p className="text-center text-2xl font-extrabold"> {dayCinco} </p>

            <div className="flex justify-center">
              <img className="w-28 h-28" src="/cloudy.png" />
            </div>

            <p className="text-center"> Hi: </p>
            <p className="text-center"> Lo: 60°</p>
          </div> */}


        </div>
      </div>



    </div>
  );
}
