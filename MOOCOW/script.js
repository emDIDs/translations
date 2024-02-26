/** TODO: Fix copy function
 *   Find cute copy button
 *   Make dynamic tables based on possible information
 *   Render thumbnails???
 *   Fractional accounting?
 *   Asset linkage
 *   Metacog
 *   Save game?
 */
// pull elements from document and name them
const pastedJSON = document.getElementById("json-object");
const filePicker = document.getElementById("upload");
const button1 = document.getElementById("translate");
const slideData = document.getElementById("slide-data");
const slideContainer = document.getElementById("slide-data");

const sleep = (ms = 0) =>
    new Promise((resolve) => {
        setTimeout(resolve, ms);
    });

const link1 = document.getElementById("downloadJSON-link");
filePicker.addEventListener("change", readFile, false);

let workingJSON = {};
// const language = "spanish";
const bigObject = {
    english: {},
};
let translatedSlides;
const translatedApplet = {};
const translatedGlobalJS = {};

function readFile(event) {
    while (pastedJSON.firstChild) {
        pastedJSON.removeChild(pastedJSON.firstChild);
    }
    const uploadedFiles = event.target.files;
    for (const singleFile of uploadedFiles) {
        const reader = new FileReader();
        const showFile = (file) => {
            const fileNameLI = document.createElement("li");
            fileNameLI.innerHTML = singleFile.name;
            pastedJSON.appendChild(fileNameLI);
            switch (true) {
                case singleFile.name.includes("Slides"): {
                    translatedSlides = file.target.result;
                    break;
                }
                case singleFile.name.includes("Applet"): {
                    const materialIdMatch = singleFile.name
                        .replace(/G\dM\dT\wL\d+/, "")
                        .match(/-\s*([a-z0-9]{8})\s*-/);
                    if (materialIdMatch.length > 1) {
                        const materialIdFromFile = materialIdMatch[1];
                        if (materialIdFromFile) {
                            translatedApplet[materialIdFromFile] =
                                file.target.result;
                        }
                    }
                    break;
                }
                case singleFile.name.includes("GlobalJS"): {
                    const materialIdMatch = singleFile.name
                        .replace(/G\dM\dT\wL\d+/, "")
                        .match(/-\s*([a-z0-9]{8})\s*-/);
                    if (materialIdMatch.length > 1) {
                        const materialIdFromFile = materialIdMatch[1];
                        if (materialIdFromFile) {
                            translatedGlobalJS[materialIdFromFile] =
                                file.target.result;
                        }
                    }
                    break;
                }
            }
        };
        const handleLoadedFile = () => {
            return showFile;
        };
        reader.onload = handleLoadedFile(singleFile);
        reader.readAsText(singleFile);
    }
}

// function waitForIt(condition) {
//     return new Promise((resolve) => {
//         if (condition()) {
//             return resolve();
//         }
//         const observer = new MutationObserver(() => {
//             if (condition()) {
//                 observer.disconnect();
//                 resolve();
//             }
//         });
//         observer.observe(document.body, {
//             childList: true,
//             subtree: true,
//         });
//     });
// }

function displayData() {
    while (slideContainer.firstChild) {
        slideContainer.removeChild(slideContainer.firstChild);
    }
    function createTableRow({ componentType, content, header }) {
        const tableRow = document.createElement("tr");
        let headerArray = [];
        let columnNumber = 0;
        switch (componentType) {
            case "button":
            case "richtexteditor": {
                columnNumber = 4;
                headerArray = [
                    "Component Name",
                    "Text",
                    "Aria Label",
                    "Marked Complete",
                ];
                break;
            }
            case "input": {
                columnNumber = 6;
                headerArray = [
                    "Component Name",
                    "Label",
                    "Aria Label",
                    "Placeholder Text",
                    "Input Value (Rare!)",
                    "Marked Complete",
                ];
                break;
            }
        }
        let tableCells = null;
        for (let i = 0; i < columnNumber; i++) {
            if (header) {
                tableCells = document.createElement("th");
                tableCells.textContent = headerArray[i];
            } else {
                tableCells = document.createElement("td");
                tableCells.textContent = content[i];
            }
        }
        return tableRow;
    }

    async function pauseEverything() {
        workingJSON = JSON.parse(translatedSlides);
        if (workingJSON.globalId) {
            const workingKeys = Object.keys(workingJSON.slides);
            for (const key of workingKeys) {
                const fragment = document.createDocumentFragment();
                const slideSeparator = document.createElement("div");
                const slideTitle = fragment
                    .appendChild(slideSeparator)
                    .appendChild(document.createElement("h2"));
                slideSeparator.setAttribute(
                    "style",
                    "border-top:1px black solid; margin-top:10px"
                );
                slideTitle.textContent = `Slide ${
                    Number(key.replace("slide", "")) + 1
                }`;
                const newTable = document.createElement("table");
                const components = workingJSON.slides[key].contents;
                for (const compNum of Object.keys(components)) {
                    switch (components[compNum].type) {
                        case "richtexteditor": {
                            const newTableRow = createTableRow({
                                componentType: components[compNum].type,
                                content: [
                                    components[compNum].name,
                                    components[compNum].data.text,
                                    components[compNum].ariaLabel,
                                    "<input type=checkbox></input>",
                                ],
                            });
                            fragment.appendChild(newTableRow);
                            break;
                        }
                        case "textbox": {
                            const textDump = document.createElement("p");
                            textDump.innerHTML = `<p>${components[compNum].data.text}</p>`;
                            fragment.appendChild(textDump);
                            console.warn(
                                `Textbox found: ${components[compNum].name}. This lesson may not be fully remediated.`
                            );
                            break;
                        }
                        case "button": {
                            const soloButton = document.createElement("button");
                            soloButton.textContent =
                                components[compNum].data.text;
                            fragment.appendChild(soloButton);
                            break;
                        }
                        case "buttongroup": {
                            Object.values(
                                components[compNum].data.buttons
                            ).forEach((element) => {
                                const groupButton =
                                    document.createElement("button");
                                groupButton.textContent = element.text;
                                fragment.appendChild(groupButton);
                            });
                            break;
                        }
                        case "select": {
                            const selectDump = document.createElement("select");
                            Object.values(
                                components[compNum].data.options
                            ).forEach((element) => {
                                const optionDump =
                                    document.createElement("option");
                                optionDump.textContent = element.label;
                                selectDump.appendChild(optionDump);
                            });
                            fragment.appendChild(selectDump);
                            break;
                        }
                        case "geogebra": {
                            const ggbContainer = document.createElement("div");
                            ggbContainer.setAttribute("class", "container");
                            const ggb = document.createElement("div");
                            fragment.appendChild(ggbContainer).appendChild(ggb);
                            break;
                        }
                        case "pdfviewer": {
                            const pdfAdvisory = document.createElement("p");
                            pdfAdvisory.textContent = `This page contains a PDF with ID: ${components[compNum].data.id}.`;
                            const pdfLink = document.createElement("a");
                            pdfLink.innerText = "Link to PDF";
                            pdfLink.href = components[compNum].data.downloadUrl;
                            fragment.appendChild(pdfAdvisory);
                            fragment.appendChild(pdfLink);
                            break;
                        }
                        case "complextable": {
                            const tableDump = document.createElement("table");
                            for (const rowNum of Object.keys(
                                components[compNum].data.rows
                            )) {
                                const tableRow = document.createElement("tr");

                                for (const colNum of Object.keys(
                                    components[compNum].data.rows[rowNum]
                                )) {
                                    let tableCells = null;
                                    if (
                                        components[compNum].data.rows[rowNum][
                                            colNum
                                        ].scope
                                    ) {
                                        tableCells =
                                            document.createElement("th");
                                        tableCells.textContent =
                                            components[compNum].data.rows[
                                                rowNum
                                            ][colNum].value;
                                        tableCells.setAttribute(
                                            "ariaLabel",
                                            components[compNum].data.rows[
                                                rowNum
                                            ][colNum].ariaLabel
                                        );
                                    } else {
                                        tableCells =
                                            document.createElement("td");
                                        tableCells.textContent =
                                            components[compNum].data.rows[
                                                rowNum
                                            ][colNum].value;
                                        tableCells.setAttribute(
                                            "ariaLabel",
                                            components[compNum].data.rows[
                                                rowNum
                                            ][colNum].ariaLabel
                                        );
                                    }
                                    tableRow.appendChild(tableCells);
                                }
                                tableDump.appendChild(tableRow);
                            }
                            fragment.appendChild(tableDump);
                            break;
                        }
                        case "image": {
                            const figDump = document.createElement("figure");
                            const imageDump = document.createElement("img");
                            imageDump.src = components[compNum].data.src;
                            imageDump.alt = components[compNum].data.alt;
                            imageDump.setAttribute(
                                "style",
                                "background-color: rgba(255, 255, 255, 1);color:rgba(0, 0, 0, 1)"
                            );
                            if (components[compNum].data.ariaLabel) {
                                imageDump.setAttribute(
                                    "ariaLabel",
                                    components[compNum].data.ariaLabel
                                );
                            }
                            if (components[compNum].data.title) {
                                imageDump.setAttribute(
                                    "title",
                                    components[compNum].data.title
                                );
                            }
                            if (components[compNum].data.caption) {
                                const captionDump =
                                    document.createElement("caption");
                                captionDump.innerText =
                                    components[compNum].data.caption;
                                figDump.appendChild(captionDump);
                            }
                            fragment
                                .appendChild(figDump)
                                .appendChild(imageDump);
                            const copyright = document.createElement("p");
                            copyright.textContent =
                                components[compNum].copyright;
                            fragment.appendChild(copyright);
                            break;
                        }
                        case "dropdown": {
                            const labelDump = document.createElement("label");
                            labelDump.innerText =
                                components[compNum].data.label;
                            fragment.appendChild(labelDump);
                            const selectDump = document.createElement("select");
                            Object.values(
                                components[compNum].data.listBox
                            ).forEach((element) => {
                                const optionDump =
                                    document.createElement("option");
                                optionDump.textContent = element.value;
                                selectDump.appendChild(optionDump);
                            });
                            labelDump.appendChild(selectDump);
                            const placeholderDump = document.createElement("p");
                            placeholderDump.innerText =
                                components[compNum].data.placeholder;
                            fragment.appendChild(placeholderDump);
                            break;
                        }
                        case "categorization": {
                            const nameDump = document.createElement("p");
                            nameDump.innerText = "Categories";
                            fragment.appendChild(nameDump);
                            const categDump = document.createElement("ul");
                            Object.values(
                                components[compNum].data.categories
                            ).forEach((element) => {
                                const optionDump = document.createElement("li");
                                optionDump.textContent = element.label;
                                categDump.appendChild(optionDump);
                            });
                            fragment.appendChild(categDump);
                            const nameDump2 = document.createElement("p");
                            nameDump2.innerText = "Items";
                            fragment.appendChild(nameDump2);
                            const itemDump = document.createElement("ul");
                            Object.values(
                                components[compNum].data.items
                            ).forEach((element) => {
                                const optionDump = document.createElement("li");
                                optionDump.textContent = element.label;
                                itemDump.appendChild(optionDump);
                            });
                            fragment.appendChild(itemDump);
                            break;
                        }
                        case "separator":
                        case "studentanswers": {
                            break;
                        }
                        case "table":
                        case "radio":
                        case "fillintheblank": {
                            alert(
                                "This lesson is not fully remediated! Please stop work and contact the DID team."
                            );
                            console.error(
                                `${components[compNum].type} on slide ${workingJSON.slides[key].slideId}`
                            );
                            return;
                        }
                        default:
                            console.warn(
                                `Not yet optimized for ${components[compNum].type}`
                            );
                            break;
                    }
                }

                slideData.appendChild(fragment);
            }
        }
    }
    pauseEverything();
}

// translate applet
button1.addEventListener("click", () => {
    displayData();
});

function myFunction(elementId) {
    alert("running");
    // Get the text field
    const copyText = document.getElementById(elementId);
    alert(copyText);
    const copiedText = copyText.innerText;
    alert("Copied the text: " + copiedText);

    // Copy the text inside the text field
    navigator.clipboard.writeText(copiedText);

    // Alert the copied text
    alert("Copied the text: " + copiedText);
}
// document
//     .querySelector("#copy-coding-layer")
//     .addEventListener("click", myFunction("coding-layer"));
