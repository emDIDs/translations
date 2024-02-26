interface CheckboxProps {
    rowName: string;
}
const Checkbox = ({ rowName }: CheckboxProps) => {
    const hideCopies = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            console.log("hides", rowName);
        } else {
            console.log("shows", rowName);
        }
    };
    return (
        <input
            type="checkbox"
            className={"checkbox"}
            onChange={hideCopies}
            id={rowName}
        />
    );
};
export default Checkbox;
