import TableRows from "./TableRows.tsx";

interface TableBodyProps {
    itemObject: ContentObjectProps;
    headerData: HeaderDataProps;
    header?: boolean;
}
interface ContentObjectProps {
    contents: {
        [key: string]: ComponentProps;
    };
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
}
const TableBody = ({ headerData, itemObject }: TableBodyProps) => {
    console.log(itemObject);
    const tableRows = Object.keys(itemObject).map((_itemName, index) => (
        <TableRows
            headerData={headerData}
            component={itemObject.contents[index]}
            key={index}
        />
    ));
    return <tbody>{tableRows}</tbody>;
};

export default TableBody;
