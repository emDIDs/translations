import CopyButton from "./CopyButton";
import Checkbox from "./Checkbox";

interface TableRowsProps {
    component?: ComponentProps;
    headerData: HeaderDataProps;
    header?: boolean;
}

interface ComponentProps {
    name: string;
    data: ComponentDataProps;
}

interface ComponentDataProps {
    text: string;
    ariaLabel: string;
    placeholderText?: string;
    caption?: string;
    label?: string;
    id?: number;
}
const TableRows = ({
    component,
    headerData,
    header = false,
}: TableRowsProps) => {
    console.log("TableRows:", component);
    if (header) {
        const headerCells = Object.keys(headerData).map(
            (item: string, index) => (
                <th key={`${item} ${index}`}>
                    {headerData[item as keyof HeaderDataProps]}
                </th>
            )
        );
        return <tr>{headerCells}</tr>;
    }
    if (component && headerData) {
        const tableCells = Object.keys(headerData).map((item, index) => (
            <td key={`cell${item}${index}`}>
                {component.data[item as keyof ComponentDataProps] ? (
                    <CopyButton />
                ) : null}
                {Object.keys(component.data).includes(item) ? (
                    `${component.data[item as keyof ComponentDataProps]}`
                ) : headerData[item as keyof HeaderDataProps] ==
                  "Row Complete" ? (
                    <Checkbox rowName={`checkbox${item}${index}`} />
                ) : headerData[item as keyof HeaderDataProps] ==
                  "Component Name" ? (
                    `${component.name}`
                ) : (
                    ""
                )}
            </td>
        ));
        return <tr>{tableCells}</tr>;
    }
};

export default TableRows;
