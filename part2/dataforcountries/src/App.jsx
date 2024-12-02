import { useState, useEffect } from 'react'
import axios from 'axios'

const Countries = ({ countries, setProfileCountry }) => {
  if (countries.length > 10)
    return <div>Too many matches, specify another filter</div> 

  if (countries.length === 1)
    return <CountryProfile country={countries[0]} />

  return (
    <div>
      {countries.map(c => 
        <Country key={c.cca3} country={c} setProfileCountry={setProfileCountry} />
      )}
    </div>
  )
}

const Country = ({ country, setProfileCountry }) => {
  return (
    <div>
      {country.name.common} <button onClick={() => setProfileCountry(country)}>show</button>
    </div>
  )
}

const CountryProfile = ({ country }) => {
  const [weather, setWeather] = useState(null)
  const api_key = import.meta.env.VITE_SOME_KEY

  useEffect(() => {
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?q=${country.capital},${country.cca2}&appid=${api_key}&units=metric`)
      .then(response => {
        setWeather(response.data)
      })
  }, [country, api_key])

  if (!weather) return null

  return (
    <div>
      <h2>{country.name.common}</h2>
      <div>capital {country.capital}</div>
      <div>area {country.area}</div>
      <h3>languages:</h3>
      <ul>
        {Object.values(country.languages).map(language =>
          <li key={language}>{language}</li>
        )}
      </ul>
      <img 
        src={country.flags.png}
        alt={country.flags.alt} 
        style={{ width: "15%" }}
      />

      <h3>Weather in {country.capital}</h3>
      <div>temperature {weather.main.temp} Celcius</div>
      <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} />
      <div>wind {weather.wind.speed} m/s</div>
    </div>
  )
}

const App = () => {
  const [countries, setCountries] = useState(null)
  const [search, setSearch] = useState('')
  const [profileCountry, setProfileCountry] = useState(null)

  const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api'

  useEffect(() => {
    axios
      .get(`${baseUrl}/all`)
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  if (!countries) return null

  const handleSearchChange = e => {
    setSearch(e.target.value)
    setProfileCountry(null)
  }

  const countriesToShow = (search === '')
    ? countries
    : countries.filter(c => c.name.common.toLowerCase().startsWith(search.toLowerCase()))

  if (profileCountry) {
    return (
      <div>
        find countries <input value={search} onChange={handleSearchChange} />
        <CountryProfile country={profileCountry} />
      </div>
    )
  }

  return (
    <div>
      find countries <input value={search} onChange={handleSearchChange} />
      <Countries 
        countries={countriesToShow}
        setProfileCountry={setProfileCountry}
      />
    </div>
  )
}

export default App
