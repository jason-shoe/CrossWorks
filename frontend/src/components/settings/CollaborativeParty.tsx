import { UserInfo } from '@rsuite/icons';
import { memo } from 'react';
import { CollaborativeGame, PlayerInfo } from '../shared/types/backendTypes';
import { UserEntry } from '../shared/UserEntry';

interface CollaborativePartyProps {
    game: CollaborativeGame;
}
export const CollaborativeParty = memo(function CollaborativePartyFn({
    game
}: CollaborativePartyProps) {
    return (
        <div>
            <h2>Party {game ? game.players.length : 0}</h2>
            {game.players.map((elem: PlayerInfo, index: number) => (
                <UserEntry info={elem} icon={<UserInfo />} key={index} />
            ))}
        </div>
    );
});
