import copy from "../assets/copy-button.svg";

const handleClick: React.MouseEventHandler<HTMLButtonElement> = async (
    event: React.MouseEvent<HTMLButtonElement>
) => {
    const clickedElement: HTMLButtonElement = event.currentTarget;
    if (clickedElement) {
        const parentElement = clickedElement.closest("td");
        if (parentElement) {
            const text: string = parentElement.innerText || "";
            await navigator.clipboard.writeText(text);
        }
    }
};

const CopyButton = () => {
    return (
        <button onClick={handleClick}>
            <img src={copy} className="copy-button" />
        </button>
    );
};
export default CopyButton;
