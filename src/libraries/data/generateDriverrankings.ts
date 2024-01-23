import {db} from '../../services/db/knexfile'
import { DriverApiStore,  DriverTierStore} from '../../model/dbTypes'
import { apiSportsDriverRankRes } from '../../model/apiSportsResponseTypes'

export interface IdriverTiers {
    tier1:{
        drivers:string[]|number[]
    },
    tier2:{
        drivers:string[]|number[]
    }
    tier3:{
        drivers:string[]|number[]
    }
}

const driverTiers:IdriverTiers={
    tier1:{
        drivers:[
            'Max Verstappen',
            'Lewis Hamilton',
            'Charles Leclerc',
            'Carlos Sainz Jr',
            'Sergio Perez',
            'George Russell',
        ]
    },
    tier2:{
        drivers:[
            'Pierre Gasly',
            'Esteban Ocon',
            'Fernando Alonso',
            'Alexander Albon',
            'Lance Stroll',
            'Oscar Piastri',
            'Lando Norris',

        ]
    },
    tier3:{
        drivers:[
            'Yuki Tsunoda',
            'Valtteri Bottas',
            'Nico Hulkenberg',
            'Daniel Ricciardo',
            'Guanyu Zhou',
            'Kevin Magnussen',
            'Logan Sargeant'
        ]
    }

}

export async function generateDriverTiers(){
    const driverIDTiers = {
        tier1:{
            drivers:[] as number[]
        },tier2:{
            drivers:[] as number[]
        },tier3:{
            drivers:[] as number[]
        },
    }
    const payload = await db<DriverApiStore>('DriverApiStore')
            .where('id', '=','1').returning('*')

    const drivers = payload[0].response.response as apiSportsDriverRankRes[]

    let tier : keyof IdriverTiers

    for(tier in driverTiers){
        for (let i = 0; i < driverTiers[tier].drivers.length;i++){ 

            const driverName = driverTiers[tier].drivers[i] as string
            const drivreID = drivers.filter((driver)=>{
                return driver.driver.name === driverName
            })[0]
            driverIDTiers[tier].drivers.push(drivreID.driver.id)  
        }
    }

    const currentStore = await db<DriverTierStore>('DriverTierStore').where('id', '1')
    if(currentStore[0]){
        const res = await db<DriverTierStore>('DriverTierStore').where('id', '1').update({
            tiers:driverIDTiers
        })
    }else{
        const res = await db<DriverTierStore>('DriverTierStore').insert({
            tiers:driverIDTiers
        })
    }
}