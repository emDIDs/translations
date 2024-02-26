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
    rowComplete: "Row Complete",
};

// const itemObject = {
//     items1: {
//         name: "input1",
//         contents: {
//             data: {
//                 text: "This is a text input",
//                 ariaLabel: "Blah blah blah",
//                 placeholderText: "This is some placeholder stuff.",
//                 caption: "I don't actually have a caption, ha ha.",
//             },
//         },
//     },
//     items2: {
//         name: "rte1",
//         contents: {
//             data: {
//                 text: "This is a text box",
//                 ariaLabel: "La la la",
//                 placeholderText: "And some text here.",
//             },
//         },
//     },
//     items3: {
//         name: "rte2",
//         contents: {
//             data: {
//                 text: "This is NOT a text box",
//                 ariaLabel: "Ba ba ba",
//             },
//         },
//     },
//     items4: {
//         name: "table1",
//         contents: {
//             data: {
//                 text: "This is a table",
//                 ariaLabel: "Sis boom bah",
//                 placeholderText: "This is some more placeholder stuff.",
//                 caption: "I do actually have a caption.",
//                 label: "But I don't not have a label.",
//             },
//         },
//     },
// };

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
                headerData={headerData}
                itemData={itemData}
            />
        </div>
    );
}

export default App;
