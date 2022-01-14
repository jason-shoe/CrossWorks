import { UserInfo } from '@rsuite/icons';
import { memo, useCallback, useMemo } from 'react';
import {
    CollaborativeGame,
    CompetitiveGame
} from '../shared/types/backendTypes';
import {
    CompetitiveSocketEndpoint,
    SendMessageFn
} from '../shared/types/socketTypes';
import { UserEntry } from '../shared/UserEntry';

interface CompetitivePartyProps {
    game: CompetitiveGame;
    clientId: string;
    sendMessage: SendMessageFn;
}
export const CompetitiveParty = memo(function CompetitivePartyFn({
    game,
    clientId,
    sendMessage
}: CompetitivePartyProps) {
    const clientTeamNumber = useMemo(
        () =>
            game.playerIds.findIndex((team: string[]) =>
                team.includes(clientId)
            ),
        [clientId, game.playerIds]
    );

    const hasTeammates = useMemo(
        () => game.playerIds[clientTeamNumber].length !== 1,
        [clientTeamNumber, game.playerIds]
    );

    const joinTeam = useCallback(
        (teamNumber: number) => {
            sendMessage(
                CompetitiveSocketEndpoint.SWITCH_TEAM,
                JSON.stringify({
                    player: { playerId: clientId },
                    teamNumber: teamNumber
                }),
                game.gameId
            );
        },
        [clientId, game.gameId, sendMessage]
    );

    const createTeam = useCallback(() => {
        sendMessage(
            CompetitiveSocketEndpoint.NEW_TEAM,
            JSON.stringify({ playerId: clientId }),
            game.gameId
        );
    }, [clientId, game.gameId, sendMessage]);

    return (
        <div>
            <h2>Party {game ? game.playerIds.length : 0}</h2>
            {game.playerIds.map((team: string[], teamNumber: number) => (
                <div>
                    <h2>Team {teamNumber + 1}</h2>
                    {teamNumber !== clientTeamNumber && (
                        <button onClick={() => joinTeam(teamNumber)}>
                            Join Team
                        </button>
                    )}
                    {team.map((elem: string, index: number) => (
                        <UserEntry
                            name={elem}
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
