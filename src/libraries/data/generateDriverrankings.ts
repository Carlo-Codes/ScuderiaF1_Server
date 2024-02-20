import {db} from '../../services/db/knexfile'
import { DriverApiStore,  DriverTierStore} from '../../model/dbTypes'
import { apiSportsDriverRankRes } from '../../model/apiSportsResponseTypes'
import { IdriverTiers, IdriverNameToIdMap } from '../../model/dbTypes'

//purley for human interfacing
interface IdriverTiersNames{
    tier1:{
        drivers:string[]
    },tier2:{
        drivers:string[]
    },tier3:{
        drivers:string[]
    }
}
const driverTiers:IdriverTiersNames={
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
    try {
        interface driverNameIDTiers extends IdriverTiers{
            tier1:{
                drivers: IdriverNameToIdMap[] 
            },
            tier2:{
                drivers: IdriverNameToIdMap[]
            },
            tier3:{
                drivers: IdriverNameToIdMap[]
            },
        }
        const driverNameIDTiers:driverNameIDTiers = {
            tier1:{drivers:[]}, 
            tier2:{drivers:[]},
            tier3:{drivers:[]}, 
    
        }
        const payload = await db<DriverApiStore>('DriverApiStore')
                .where('id', '=','1').returning('*')
    
        const drivers = payload[0].response.response as apiSportsDriverRankRes[]
    
        let tier : keyof IdriverTiers
    
        for(tier in driverTiers){
            for (let i = 0; i < driverTiers[tier].drivers.length;i++){  
                
                const driverName = driverTiers[tier].drivers[i] as string
                const driverID = drivers.filter((driver)=>{
                    if(driver.driver.name === driverName){
                        return driver
                    }
                })[0]
                const driverNameId:IdriverNameToIdMap = {
                    name:driverName,
                    id:driverID.driver.id,
                }
                driverNameIDTiers[tier].drivers!.push(driverNameId)  
            }
        }
    
        const currentStore = await db<DriverTierStore>('DriverTierStore').where('id', '1')
        if(currentStore[0]){
            const res = await db<DriverTierStore>('DriverTierStore').where('id', '1').update({
                tiers:driverNameIDTiers
            })
        }else{
            const res = await db<DriverTierStore>('DriverTierStore').insert({
                tiers:driverNameIDTiers
            })
        }
    
        
    } catch (error) {
        console.log(error)
    }
}