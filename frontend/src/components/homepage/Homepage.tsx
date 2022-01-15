import { memo, useCallback } from 'react';
import { PageState } from '../shared/types/pageState';
import { UsernameInput } from './UsernameInput';

interface HomepageProps {
    setPageState: (state: PageState) => void;
    clientName: string;
    setClientName: (clientName: string) => void;
}

export const Homepage = memo(function Homepage({
    setPageState,
    clientName,
    setClientName
}: HomepageProps) {
    const navigateToCreateGame = useCallback(
        () => setPageState(PageState.CREATE_GAME),
        [setPageState]
    );
    const navigateToJoinGame = useCallback(
        () => setPageState(PageState.JOIN_GAME),
        [setPageState]
    );

    const buttonStyles = `bg-white border border-gray-200 rounded text-xl py-32
                          flex-grow shadow hover:bg-blue-50 focus:ring-2
                          focus:ring-blue-700`;
    return (
        <div className={`max-w-2xl m-auto mt-20 space-y-8`}>
            {/* settings component there is just temporary */}
            <div className={`space-y-3`}>
                <p className={`text-4xl font-bold text-blue-700`}>CrossWorks</p>
                <p>
                    Welcome to crosswords for teams! Select an option to get
                    started:
                </p>
                <UsernameInput
                    clientName={clientName}
                    setClientName={setClientName}
                />
            </div>
            <div className={`flex justify-between space-x-6`}>
                <button className={buttonStyles} onClick={navigateToCreateGame}>
                    Create Game
                </button>
                <button className={buttonStyles} onClick={navigateToJoinGame}>
                    Join Game
                </button>
            </div>
        </div>
    );
});

export default Homepage;
