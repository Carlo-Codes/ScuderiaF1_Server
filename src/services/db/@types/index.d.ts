import { Knex } from 'knex';
import { LeagueTeamRelation, TeamResults, draftTeam, User, Driver, Team, League, RacesApiStore, DriverApiStore, RaceResults } from '../../../model/dbTypes';
import { CognitoAccessTokenPayload } from 'aws-jwt-verify/jwt-model';
import { Request } from 'express';



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
        leagues:League;
    }
}

declare module 'knex/types/tables' {
    interface Tables{
        draftTeams:draftTeam;
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

declare module 'knex/types/tables' {
    interface Tables{
        leagueTeamRelation:LeagueTeamRelation;
    }
}

declare module 'knex/types/tables' {
    interface Tables{
        TeamsResults:TeamResults;
    }
}

declare module 'knex/types/tables' {
    interface Tables{
        DriverTierStore:DriverTierStore;
    }
}

declare module 'knex/types/tables' {
    interface Tables{
        DriverTierStore:DriverTierStore;
    }
}


declare module 'knex/types/tables' {
    interface Tables{
        RaceResultsStore:RaceResultsStore;
    }
}

declare module 'knex/types/tables' {
    interface Tables{
        FastestLapsResultsStore:FastestLapsResultsStore;
    }
}




