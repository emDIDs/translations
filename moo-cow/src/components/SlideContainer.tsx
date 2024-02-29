import TableBody from "./TableBody";
import TableRows from "./TableRows";

interface ContainerProps {
    submitted: boolean;
    headerData: HeaderDataProps;
    itemData: SlideObjectProps;
}

const SlideContainer = ({ headerData, itemData }: ContainerProps) => {
    console.log("Container", itemData[0]);
    const slideContent = Object.keys(itemData).map((item, index) => (
        <div key={index}>
            <h2>Slide {index + 1}</h2>
            <table className={"table"}>
                <thead>
                    <TableRows headerData={headerData} header={true} />
                </thead>
                <TableBody
                    headerData={headerData}
                    itemObject={itemData[item as keyof SlideObjectProps]}
                />
            </table>
        </div>
    ));
    return <div>{slideContent}</div>;
};

export default SlideContainer;
