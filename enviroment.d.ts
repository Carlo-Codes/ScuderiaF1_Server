declare global{
    namespace NodeJS{
        interface ProcessEnv{
            PORT?:string,
            DB_HOST:string,
            DB_PORT:string,
            DB_USER:string,
            DB_NAME:string,
            DB_PASSWORD:string,

            POOL_ID:string,
            CLIENT_ID:string,
            REGION:string,

            SECRET_HASH:string
        }
    }
}

export{}