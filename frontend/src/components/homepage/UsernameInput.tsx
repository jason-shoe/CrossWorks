import { ChangeEvent, memo, useCallback } from 'react';

interface UsernameInputProps {
    clientName: string;
    setClientName: (clientName: string) => void;
    showWarning: boolean;
}
export const UsernameInput = memo(function UsernameInputFn(
    props: UsernameInputProps
) {
    const { clientName, setClientName, showWarning } = props;

    const handleChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            setClientName(event.target.value);
        },
        [setClientName]
    );

    return (
        <div>
            Username: <input value={clientName} onChange={handleChange} />
            {clientName.length === 0 && showWarning && (
                <div>cannot be empty</div>
            )}
        </div>
    );
});
