import { Country, State, City } from 'country-state-city'

const useLocation = () => {
  const getCountryByCode = (countyCode: string) => {
    return Country.getAllCountries().find((country) => country.isoCode === countyCode)
  }

  const getStateByCode = (countyCode: string, stateCode: string) => {
    const state = State.getAllStates().find((state) => state.countryCode === countyCode && state.isoCode === stateCode)
    if (!state) return null

    return state
  }

  const getCountyStates = (countryCode: string) => {
    return State.getAllStates().filter((state => state.countryCode === countryCode))
  }


  const getStateCities = (countyCode: string, stateCode?: string) => {

    return City.getAllCities().filter((city) => city.countryCode === countyCode && city.stateCode === stateCode)
  }


  return {
    getAllCountries: Country.getAllCountries,
    getCountryByCode,
    getStateByCode,
    getCountyStates,
    getStateCities
  }

}
export default useLocation