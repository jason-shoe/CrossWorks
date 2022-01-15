import { UserInfo } from '@rsuite/icons';
import { memo, useCallback, useMemo } from 'react';
import { CompetitiveGame, PlayerInfo } from '../shared/types/backendTypes';
import {
    PlayerSocketEndpoint,
    SendMessageFn
} from '../shared/types/socketTypes';
import { UserEntry } from '../shared/UserEntry';

interface CompetitivePartyProps {
    game: CompetitiveGame;
    clientId: string;
    clientTeamNumber: number | undefined;
    sendMessage: SendMessageFn;
}
export const CompetitiveParty = memo(function CompetitivePartyFn({
    game,
    clientId,
    clientTeamNumber,
    sendMessage
}: CompetitivePartyProps) {
    const hasTeammates = useMemo(
        () =>
            clientTeamNumber !== undefined &&
            game.players[clientTeamNumber].length !== 1,
        [clientTeamNumber, game.players]
    );

    const joinTeam = useCallback(
        (teamNumber: number) => {
            sendMessage(
                PlayerSocketEndpoint.SWITCH_TEAM,
                teamNumber,
                game.gameId
            );
        },
        [game.gameId, sendMessage]
    );

    const createTeam = useCallback(() => {
        sendMessage(PlayerSocketEndpoint.NEW_TEAM, undefined, game.gameId);
    }, [game.gameId, sendMessage]);

    return (
        <div>
            <h2>Party {game ? game.players.length : 0}</h2>
            {game.players.map((team: PlayerInfo[], teamNumber: number) => (
                <div>
                    <h2>Team {teamNumber + 1}</h2>
                    {teamNumber !== clientTeamNumber && (
                        <button onClick={() => joinTeam(teamNumber)}>
                            Join Team
                        </button>
                    )}
                    {team.map((elem: PlayerInfo, index: number) => (
                        <UserEntry
                            info={elem}
                            icon={<UserInfo />}
                            key={index}
                        />
                    ))}
                </div>
            ))}
            {hasTeammates && (
                <button onClick={createTeam}>Create a new team</button>
            )}
        </div>
    );
});
