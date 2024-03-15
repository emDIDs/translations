import CopyButton from "./CopyButton";
interface TableCellProps {
    componentBit: string | undefined;
    name: string;
    type: string;
    copy?: boolean;
}

const TableCells = ({
    componentBit,
    name,
    type,
    copy = true,
}: TableCellProps) => {
    return copy ? (
        <td key={`cell${name}${type}`}>
            <CopyButton />
            {componentBit}
        </td>
    ) : (
        <td key={`cell${name}${type}`}>{componentBit}</td>
    );
};

export default TableCells;
