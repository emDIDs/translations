import copy from "../assets/copy-button.svg";
const handleClick = async (
    event: React.MouseEventHandler<HTMLButtonElement>
) => {
    const clickedElement = event.target;
    if (clickedElement) {
        const parentElement = clickedElement.closest("td");
        const text: string = parentElement.innerText || "";
        await navigator.clipboard.writeText(text);
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
