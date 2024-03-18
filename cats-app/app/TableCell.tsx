type TableCellProps = {
    components: any;
    compNum: number;
    rowNum: number;
    colNum: number;
    el: any;
};
const TableCell = ({
    components,
    compNum,
    rowNum,
    colNum,
    el,
}: TableCellProps) => {
    if (components[compNum].data.rows[rowNum][colNum].scope) {
        return (
            <td
                aria-label={
                    components[compNum].data.rows[rowNum][colNum].ariaLabel
                }
                key={`cell${el}${colNum}`}>
                {components[compNum].data.rows[rowNum][colNum].value}
            </td>
        );
    } else {
        return (
            <th
                aria-label={
                    components[compNum].data.rows[rowNum][colNum].ariaLabel
                }
                key={`header${el}${colNum}`}>
                {components[compNum].data.rows[rowNum][colNum].value}
            </th>
        );
    }
};

export default TableCell;
