import TableRows from "./TableRows.tsx";

interface TableBodyProps {
    itemObject: ContentObjectProps;
    headerData: HeaderDataProps;
    header?: boolean;
}

const TableBody = ({ headerData, itemObject }: TableBodyProps) => {
    /**
     * First, determine what type of components you're dealing with on a slide
     * Then, group them based on data/config structure
     * Then, build separate tables that based on those groups
     * Then, build rows based on component
     * Then, build cells based on properties of component
     */
    Object.keys(itemObject.contents).forEach((_itemName, index) => {
        const name: string = itemObject.contents[index].name;
        const type: string = itemObject.contents[index].type;
        console.log("Over HERE!:", name, type);
        switch (type) {
            case "button":
            case "textbox":
            case "richtexteditor": {
                return (
                    <TableRows
                        component={itemObject.contents[index]}
                        headerStrings={[
                            "Component Name",
                            "Text",
                            "Aria Label",
                            "Row Complete",
                        ]}
                        header={true}
                    />
                );
                // headers = [name, data?.text, data?.ariaLabel];
                break;
            }
            case "input": {
                // headers = [
                //     name,
                //     data?.text,
                //     data?.ariaLabel,
                //     data?.placeholder,
                //     data?.label,
                // ];
                break;
            }
            case "image": {
                // headers = [
                //     name,
                //     data?.src,
                //     data?.ariaLabel,
                //     data?.alt,
                //     data?.caption,
                //     data?.copyright,
                //     data?.config?.workflowId,
                // ];
                break;
            }
            case "geogebra": {
                // headers = [name, data?.ariaLabel, config?.materialId];
                break;
            }
            case "media": {
                // headers = [name, data?.ariaLabel, config?.alt, config?.src];
                break;
            }
            case "pdf": {
                // headers = [
                //     name,
                //     data?.ariaLabel,
                //     data?.downloadUrl,
                //     data?.id?.toString(),
                // ];
                break;
            }
            case "select": {
                // headers = [name, data?.ariaLabel];
                break;
            }
            default:
                // console.log(`Looks like you forgot one of type ${type}!`);
                break;
        }
    });
    // const tableRows = Object.keys(itemObject).map((_itemName, index) => (
    //     <TableRows
    //         headerData={headerData}
    //         component={itemObject.contents[index]}
    //         key={index}
    //     />
    // ));
    // return <tbody>{tableRows}</tbody>;
};

export default TableBody;
