import React, { useContext, useState, useEffect } from 'react';
import { WeatherContext } from './WeatherProvider';

import '../../styles/common/Style.css';
import weatherStyle from '../../styles/weather/Weather.module.css';

import TitleBar from '../common/TitleBar';
import WeatherInfo from './WeatherInfo';
import WeatherSearch from './WeatherSearch';
import WeatherShow from './WeatherShow';

function Weather() {
    const [forecast, setForecast] = useState(null);
    const [hourlyWeather, setHourlyWeather] = useState([]);

    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate() - 1).padStart(2, '0');
    const currentDate = `${year}${month}${day}`;
    
    const { selectedX, selectedY } = useContext(WeatherContext);

    const baseTime = [];
    for (let i = 0; i < 24; i++) {
        const time = (i < 10 ? '0' : '') + i + '30';
        baseTime.push(time);
    }

    const maxTemperature = () => {
        if (hourlyWeather.length === 0) return null;
        return Math.max(...hourlyWeather.map(item => item.temperature));
    };

    const minTemperature = () => {
        if (hourlyWeather.length === 0) return null;
        return Math.min(...hourlyWeather.map(item => item.temperature));
    };

    const fetchData = async () => {
        try {
            const hourlyWeatherData = [];

            for (let i = 0; i < baseTime.length; i++) {
                const currentTime = baseTime[i].toString();
                const apiUrl = `${process.env.REACT_APP_WEATHERHOST}?serviceKey=${process.env.REACT_APP_WEATHERAPIKEY}&numOfRows=60&dataType=JSON&base_date=${currentDate}&base_time=${currentTime}&nx=${selectedY}&ny=${selectedX}`;

                const response = await fetch(apiUrl);
                if (!response.ok) {
                    console.log("날씨 정보 불러오기 실패", response.status);
                }

                const forecasts = await response.json();
                setForecast(forecasts);

                // 데이터 처리
                const PTY = forecasts?.response?.body?.items?.item[6]; // 강수형태
                const SKY = forecasts?.response?.body?.items?.item[18]; // 하늘상태
                const T1H = forecasts?.response?.body?.items?.item[24]; // 기온

                if (PTY && SKY && T1H) {
                    const time = PTY.fcstTime.substring(0, 2); // 시간
                    const temperature = T1H.fcstValue; // 기온
                    const location = { x: PTY.nx, y: PTY.ny }; // 위치
                    const sky = SKY.fcstValue; // 하늘상태
                    const pty = PTY.fcstValue; // 강수형태

                    const hourlyWeatherDataItem = {
                        time: time,
                        temperature: temperature,
                        location: location,
                        sky: sky,
                        pty: pty,
                    };
                    hourlyWeatherData.push(hourlyWeatherDataItem);
                }
            }

            setHourlyWeather(hourlyWeatherData);
        } catch (error) {
            console.error('서버 연결 실패', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [selectedX, selectedY, currentDate]);

    useEffect(() => {
        setHourlyWeather([]);
    }, [selectedX, selectedY]);

    return(
        <div className={weatherStyle['container']}>
            <div className={weatherStyle['background']}>
                <div className={weatherStyle['allDiv']}>
                    {/* 정보*/}
                    <WeatherInfo hourlyWeather={hourlyWeather} maxTemperature={maxTemperature} minTemperature={minTemperature} />
                    <div className={weatherStyle['bottomContainer']}>
                        <div className={weatherStyle['searchAndshow']}>
                            {/* 검색창 */}
                            <WeatherSearch />
                            {/* 날씨 보여주는 */}
                            <WeatherShow hourlyWeather={hourlyWeather} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Weather;