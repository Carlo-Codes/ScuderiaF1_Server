import { Knex } from 'knex';

declare module 'knex/types/tables' {
    interface Tables{
        users:User;
        users_composite:Knex.CompositeTableType<
        User,
        Pick<User, 'email'>,
        Partial<Omit<User, 'id'>>
        >
    }

}

declare module 'knex/types/tables' {
    interface Tables{
        drivers:Driver;
    }

}

declare module 'knex/types/tables' {
    interface Tables{
        teams:Team;
    }
}

declare module 'knex/types/tables' {
    interface Tables{
        league:League;
    }
}

declare module 'knex/types/tables' {
    interface Tables{
        RacesApiStore:RacesApiStore;
    }
}

declare module 'knex/types/tables' {
    interface Tables{
        DriverApiStore:DriverApiStore;
    }
}








