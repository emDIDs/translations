import "./styles.css";
import FilePicker from "./components/FilePicker";
import Header from "./components/Header";
import { useState } from "react";
import SlideContainer from "./components/SlideContainer";

const headerData = {
    name: "Component Name",
    text: "Text",
    ariaLabel: "Aria Label",
    placeholderText: "Placeholder Text",
    caption: "Caption",
    label: "Label",
    id: "PDF ID",
    rowComplete: "Row Complete",
};

function App() {
    const [submitted, setSubmitted] = useState(false);
    const [itemData, setItemData] = useState({});
    // TODO: fix conditional visibility and pull actual data
    return (
        <div id="full-contents">
            <Header />
            <FilePicker
                passSetSubmitted={setSubmitted}
                passSetItemData={setItemData}
            />
            <SlideContainer
                submitted={submitted}
                headerData={headerData as HeaderDataProps}
                itemData={itemData}
            />
        </div>
    );
}

export default App;
