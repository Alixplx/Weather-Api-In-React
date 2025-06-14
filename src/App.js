import Container from '@mui/material/Container';
import './App.css';
import {createTheme, ThemeProvider } from "@mui/material/styles";
import Typography from '@mui/material/Typography';
import CloudIcon from '@mui/icons-material/Cloud';
import { Button } from '@mui/material';
import axios from 'axios';
import moment from 'moment';
import 'moment/min/locales';
import { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';


const theme = createTheme({

  typography: {

    fontFamily:["Cairo"]
  }
})

moment.locale("ar")

const API_WEATHER = "https://api.openweathermap.org/data/2.5/weather?lat=33.312805&lon=44.361488&appid=118845b254a88108b332bc19dadfba9d"
let cancelAxios = null


function App() {

  const { t, i18n } = useTranslation()
  const [dateTime, setDateTime] = useState("")
  const [temp, setTemp] = useState({

    number: null,
    description: "",
    min: null,
    max: null,
    icon: null
  })
  const [locale, setLocale] = useState("ar")

  function handleChangeLang() {

    if (locale == "en") {
      
      setLocale("ar")
      i18n.changeLanguage("ar")
      moment.locale("ar")
      
    } else {
      
      setLocale("en")
      i18n.changeLanguage("en")
      moment.locale("en")
    }

    setDateTime(moment().format("MMMM Do YYYY, h:mm:ss a"))
  }

  useEffect(() => {
    
    i18n.changeLanguage(locale)
    
  }, [])
  
  useEffect(() => {
    
    setDateTime(moment().format("MMMM Do YYYY, h:mm:ss a"))
    
    axios.get(API_WEATHER, {cancelToken: new axios.CancelToken((c) => {cancelAxios = c})})
    .then(function(response) {

      const responseTemp = Math.round(response.data.main.temp - 272.15)
      const min = Math.round(response.data.main.temp_min - 272.15)
      const max = Math.round(response.data.main.temp_max - 272.15)
      const description = response.data.weather[0].description
      const icon = response.data.weather[0].icon
      
      setTemp({

        number: responseTemp, description: description, min: min, max: max, 
        icon: `https://openweathermap.org/img/wn/${icon}@2x.png`,
      })
    })
    .catch(function(error) {

      console.log(error)
    })

    return () => {

      cancelAxios()
    }

  }, [])

  return (

    <div className="App">

      <ThemeProvider theme={theme}>

        <Container maxWidth="sm">

          <div style={{height: "100vh", display: "flex", flexDirection: "column",
                      justifyContent: "center", alignItems: "center"}}>

            <div dir={locale == "ar" ? "rtl" : "ltr"} style={{background: "rgb(28 52 91 / 36%)", 
                        boxShadow: "0px 11px 1px rgba(0,0,0,0.05)", color: "white", 
                        padding: "10px", borderRadius: "15px", width: "100%"}}>

              <div>

                <div style={{display: "flex", alignItems: "end", justifyContent: "start"}} dir={locale == "ar" ? "rtl" : "ltr"}>
                  
                  <Typography variant='h2' style={{marginRight: "20px", fontWeight: "600"}}>{t("Baghdad")}</Typography>
                  <Typography variant='h5' style={{marginRight: "20px"}}>{dateTime}</Typography>
                </div>

                <hr />

                <div style={{display: "flex", justifyContent: "space-around"}}>

                  <div>

                    <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>

                      <Typography variant='h1' style={{textAlign: "right"}}>{temp.number}</Typography>
                      <img src={temp.icon} />
                    </div>

                    <Typography variant='h6'>{temp.description}</Typography>
                    
                    <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>

                      <h5>{t("Min")} : {temp.max}</h5>
                      <h5 style={{margin: "0px 10px"}}>|</h5>
                      <h5>{t("Max")} : {temp.min}</h5>
                    </div>
                  </div>

                  <CloudIcon style={{fontSize: "12rem"}} />

                </div>

              </div>

            </div>

            <div dir={locale == "ar" ? "rtl" : "ltr"} style={{display: "flex", justifyContent: "end", width: "100%"}}>

              <Button style={{color: "white"}} variant='text' onClick={handleChangeLang}>

                {locale == "en" ? "Arabic" : "انجليزي"}
              </Button>
            </div>

          </div>
          
        </Container>
      </ThemeProvider>

    </div>
  );
}

export default App;