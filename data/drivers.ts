import { rawDrivers } from "./rawDrivers";
const driverInfo = rawDrivers.DriverTable.Drivers
const drivers = []


for(let i = 0; i < driverInfo.length; i++){
    const firstName = driverInfo[i].givenName
    const secondName = driverInfo[i].familyName
}