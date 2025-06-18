import { CheckCircledIcon } from "@radix-ui/react-icons";

interface Props {
    message?: string;
};

export const FormSuccess = ({ message }: Props) => {
    if (!message) return null;

    return (
        <div role="alert" className="bg-emerald-500/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-emerald-500">
            <CheckCircledIcon className="size-4" />
            <p>{message}</p>
        </div>
    );
};
