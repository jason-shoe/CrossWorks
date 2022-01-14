import { UserInfo } from '@rsuite/icons';
import { memo } from 'react';
import { CollaborativeGame } from '../shared/types/backendTypes';
import { UserEntry } from '../shared/UserEntry';

interface CollaborativePartyProps {
    game: CollaborativeGame;
    clientId: string;
}
export const CollaborativeParty = memo(function CollaborativePartyFn({
    game,
    clientId
}: CollaborativePartyProps) {
    return (
        <div>
            <h2>Party {game ? game.playerIds.length : 0}</h2>
            {game.playerIds.map((elem: string, index: number) => (
                <UserEntry name={elem} icon={<UserInfo />} key={index} />
            ))}
        </div>
    );
});
