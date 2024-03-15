import Checkbox from "./Checkbox";
import TableCells from "./TableCells";

interface TableRowsProps {
    component?: ComponentProps;
    headerData?: HeaderDataProps;
    headerStrings: string[];
    header?: boolean;
}
const TableRows = ({
    component,
    headerStrings,
    header = false,
}: TableRowsProps) => {
    if (header && headerStrings) {
        console.log("HEADERDATA", headerStrings);
        const headerCells = headerStrings.map((item: string, index) => (
            <th key={`${item} ${index}`}>{headerStrings[index]}</th>
        ));
        return <tr>{headerCells}</tr>;
    }
    if (component && headerStrings) {
        const { name, type, data, config } = component;
        let headers = [];
        switch (type) {
            case "button":
            case "textbox":
            case "richtexteditor": {
                headers = [name, data?.text, data?.ariaLabel];
                break;
            }
            case "input": {
                headers = [
                    name,
                    data?.text,
                    data?.ariaLabel,
                    data?.placeholder,
                    data?.label,
                ];
                break;
            }
            case "image": {
                headers = [
                    name,
                    data?.src,
                    data?.ariaLabel,
                    data?.alt,
                    data?.caption,
                    data?.copyright,
                    data?.config?.workflowId,
                ];
                break;
            }
            case "geogebra": {
                headers = [name, data?.ariaLabel, config?.materialId];
                break;
            }
            case "media": {
                headers = [name, data?.ariaLabel, config?.alt, config?.src];
                break;
            }
            case "pdf": {
                headers = [
                    name,
                    data?.ariaLabel,
                    data?.downloadUrl,
                    data?.id?.toString(),
                ];
                break;
            }
            case "select": {
                headers = [name, data?.ariaLabel];
                break;
            }
            default:
                console.warn(`Looks like you forgot one of type ${type}!`);
                break;
        }
        return (
            <tr>
                {headers.map((item) =>
                    item === name ? (
                        <TableCells
                            componentBit={item}
                            copy={false}
                            name={name}
                            type={type}
                        />
                    ) : item !== "" ? (
                        <TableCells
                            componentBit={item}
                            name={name}
                            type={type}
                        />
                    ) : (
                        <td></td>
                    )
                )}
                {type !== "studentanswers" && type !== "separator" ? (
                    <td>
                        <Checkbox rowName={`${name}${type}`} />
                    </td>
                ) : (
                    <></>
                )}
            </tr>
        );
    }
};

export default TableRows;
