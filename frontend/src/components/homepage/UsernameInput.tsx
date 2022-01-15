import { ChangeEvent, memo, useCallback } from 'react';

interface UsernameInputProps {
    clientName: string;
    setClientName: (clientName: string) => void;
}
export const UsernameInput = memo(function UsernameInputFn(
    props: UsernameInputProps
) {
    const { clientName, setClientName } = props;

    const handleChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            setClientName(event.target.value);
        },
        [setClientName]
    );

    return (
        <div>
            <input value={clientName} onChange={handleChange} />
        </div>
    );
});
