// pull elements from document and name them
const pastedJSON = document.getElementById("json-object");
// eslint-disable-next-line no-unused-vars
const pastedJS = document.getElementById("javascript");
const input1 = document.getElementById("lessonID");
// const button1 = document.getElementById("id-submit");
const button2 = document.getElementById("pull-text");
const button3 = document.getElementById("translate");
const slideData = document.getElementById("slide-data");
// const button4 = document.getElementById("download");
const link1 = document.getElementById("downloadJSON-link");
// input1.value = "758108c1-42f4-441b-9db2-dd528b088eca";
let workingJSON = {};
const language = "spanish";
// fetch lesson
const bigObject = {
    english: {},
};

function gatherData(download = false) {
    const globalID = input1.value;
    // TODO: add share and submit
    // TODO: add geogebra ID
    // header.innerHTML = "Report Generating...";
    // paragraph.innerHTML = "";
    try {
        fetch(
            `https://digital.greatminds.org/lessons/api/authoring/v2/preview/version/${globalID}`,
            {
                headers: {
                    authorization: `Basic YXV0aG9yaW5nYWRtaW46WnhDd3RXZmNpNyt0alRLcXJ1eG5kZz09`,
                },
            }
        )
            .then((response) => response.json())
            .then((data) => {
                for (const item in data.slides) {
                    const { contents } = data.slides[item];
                    bigObject.english["slide".concat(item)] = {
                        slideNumber: data.slides[item].slideId,
                        codingLayer: data.slides[item].code,
                        contents: {},
                    };
                    for (const comp in contents) {
                        const componentName = contents[comp].name;
                        bigObject.english["slide".concat(item)].contents[
                            componentName
                        ] = {
                            [componentName.concat("AriaLabel")]:
                                contents[comp].data.ariaLabel,
                            componentType: contents[comp].type,
                        };
                        switch (
                            bigObject.english["slide".concat(item)].contents[
                                componentName
                            ].componentType
                        ) {
                            case "geogebra": {
                                bigObject.english[
                                    "slide".concat(item)
                                ].contents[componentName][
                                    componentName.concat("AriaLabel")
                                ] = bigObject.english[
                                    "slide".concat(item)
                                ].contents[componentName].materialId =
                                    contents[comp].config.materialId;
                                break;
                            }
                            case "textbox":
                            case "richtexteditor": {
                                bigObject.english[
                                    "slide".concat(item)
                                ].contents[componentName].text =
                                    contents[comp].data.text;
                                break;
                            }
                            case "button": {
                                bigObject.english[
                                    "slide".concat(item)
                                ].contents[componentName].text =
                                    contents[comp].data.text;
                                break;
                            }
                            case "buttongroup": {
                                bigObject.english[
                                    "slide".concat(item)
                                ].contents[componentName].buttons = {};
                                for (const buttonNum in contents[comp].data
                                    .buttons) {
                                    bigObject.english[
                                        "slide".concat(item)
                                    ].contents[componentName].buttons[
                                        "button".concat(buttonNum, "Text")
                                    ] =
                                        contents[comp].data.buttons[
                                            buttonNum
                                        ].text;
                                }
                                break;
                            }
                            case "select": {
                                bigObject.english[
                                    "slide".concat(item)
                                ].contents[componentName].select = {};
                                for (const selectNum in contents[comp].data
                                    .options) {
                                    bigObject.english[
                                        "slide".concat(item)
                                    ].contents[componentName].select[
                                        "select".concat(selectNum, "Text")
                                    ] =
                                        contents[comp].data.options[
                                            selectNum
                                        ].label;
                                }
                                break;
                            }
                            case "image": {
                                bigObject.english[
                                    "slide".concat(item)
                                ].contents[componentName].alt =
                                    contents[comp].data.alt;
                                bigObject.english[
                                    "slide".concat(item)
                                ].contents[componentName].copyright =
                                    contents[comp].data.copyright;
                                bigObject.english[
                                    "slide".concat(item)
                                ].contents[componentName].src =
                                    contents[comp].data.src;
                                break;
                            }
                            case "dropdown": {
                                bigObject.english[
                                    "slide".concat(item)
                                ].contents[componentName].dropdown = {};
                                for (const dropNum in contents[comp].data
                                    .listBox) {
                                    bigObject.english[
                                        "slide".concat(item)
                                    ].contents[componentName].dropdown[
                                        "dropdown".concat(dropNum, "Text")
                                    ] =
                                        contents[comp].data.listBox[
                                            dropNum
                                        ].value;
                                }
                                bigObject.english[
                                    "slide".concat(item)
                                ].contents[componentName].label =
                                    contents[comp].data.label;
                                bigObject.english[
                                    "slide".concat(item)
                                ].contents[componentName].placeholder =
                                    contents[comp].data.placeholder;
                                break;
                            }
                            case "table": {
                                bigObject.english[
                                    "slide".concat(item)
                                ].contents[componentName].columns = {};
                                for (const colNum in Object.keys(
                                    contents[comp].data.columns
                                )) {
                                    bigObject.english[
                                        "slide".concat(item)
                                    ].contents[componentName].columns[
                                        "col".concat(colNum, "Text")
                                    ] =
                                        contents[comp].data.columns[
                                            colNum
                                        ].value;
                                }
                                bigObject.english[
                                    "slide".concat(item)
                                ].contents[componentName].rows = {};
                                bigObject.english[
                                    "slide".concat(item)
                                ].contents[componentName].ariaRows = {};

                                for (const rowNum in contents[comp].data.rows) {
                                    bigObject.english[
                                        "slide".concat(item)
                                    ].contents[componentName].rows[
                                        "row".concat(rowNum)
                                    ] = {};
                                    bigObject.english[
                                        "slide".concat(item)
                                    ].contents[componentName].ariaRows[
                                        "row".concat(rowNum)
                                    ] = {};
                                    for (const cellNum in contents[comp].data
                                        .rows[rowNum]) {
                                        if (
                                            contents[comp].data.rows[rowNum][
                                                cellNum
                                            ].inputType === "mixed"
                                        ) {
                                            bigObject.english[
                                                "slide".concat(item)
                                            ].contents[componentName].rows[
                                                "row".concat(rowNum)
                                            ]["col".concat(cellNum, "Text")] = {
                                                ...contents[comp].data.rows[
                                                    "row".concat(rowNum)
                                                ][cellNum].mixedText["0"]
                                                    .children,
                                            };
                                        } else {
                                            bigObject.english[
                                                "slide".concat(item)
                                            ].contents[componentName].rows[
                                                "row".concat(rowNum)
                                            ]["col".concat(cellNum, "Text")] =
                                                contents[comp].data.rows[
                                                    rowNum
                                                ][cellNum].value;
                                        }
                                        bigObject.english[
                                            "slide".concat(item)
                                        ].contents[componentName].ariaRows[
                                            "row".concat(rowNum)
                                        ]["col".concat(cellNum, "AriaLabel")] =
                                            contents[comp].data.rows[rowNum][
                                                cellNum
                                            ].ariaLabel;
                                    }
                                }
                                break;
                            }
                            case "complextable": {
                                bigObject.english[
                                    "slide".concat(item)
                                ].contents[componentName].rows = {};
                                bigObject.english[
                                    "slide".concat(item)
                                ].contents[componentName].ariaRows = {};
                                for (const rowNum in contents[comp].data.rows) {
                                    bigObject.english[
                                        "slide".concat(item)
                                    ].contents[componentName].rows[
                                        "row".concat(rowNum)
                                    ] = {};
                                    bigObject.english[
                                        "slide".concat(item)
                                    ].contents[componentName].ariaRows[
                                        "row".concat(rowNum)
                                    ] = {};
                                    for (const cellNum in contents[comp].data
                                        .rows[rowNum]) {
                                        if (
                                            contents[comp].data.rows[rowNum][
                                                cellNum
                                            ].inputType === "mixed"
                                        ) {
                                            let trimmedSentence = "";
                                            for (const item of contents[comp]
                                                .data.rows[rowNum][cellNum]
                                                .mixedText["0"].children) {
                                                if (item.text) {
                                                    trimmedSentence =
                                                        trimmedSentence.concat(
                                                            item.text
                                                        );
                                                    // do stuff
                                                } else if (item.latex) {
                                                    trimmedSentence =
                                                        trimmedSentence.concat(
                                                            item.latex,
                                                            " "
                                                        );
                                                }
                                            }
                                            bigObject.english[
                                                "slide".concat(item)
                                            ].contents[componentName].rows[
                                                "row".concat(rowNum)
                                            ]["col".concat(cellNum, "Text")] =
                                                trimmedSentence;
                                        } else {
                                            bigObject.english[
                                                "slide".concat(item)
                                            ].contents[componentName].rows[
                                                "row".concat(rowNum)
                                            ]["col".concat(cellNum, "Text")] =
                                                contents[comp].data.rows[
                                                    rowNum
                                                ][cellNum].value;
                                        }
                                        bigObject.english[
                                            "slide".concat(item)
                                        ].contents[componentName].ariaRows[
                                            "row".concat(rowNum)
                                        ]["col".concat(cellNum, "AriaLabel")] =
                                            contents[comp].data.rows[rowNum][
                                                cellNum
                                            ].ariaLabel;
                                    }
                                }
                                break;
                            }
                            case "categorization": {
                                bigObject.english[
                                    "slide".concat(item)
                                ].contents[componentName].items = {};
                                for (const itemNum in contents[comp].data
                                    .items) {
                                    bigObject.english[
                                        "slide".concat(item)
                                    ].contents[componentName].items[
                                        "item".concat(itemNum, "Text")
                                    ] =
                                        contents[comp].data.items[
                                            itemNum
                                        ].label;
                                }
                                bigObject.english[
                                    "slide".concat(item)
                                ].contents[componentName].categories = {};
                                for (const catNum in contents[comp].data
                                    .categories) {
                                    bigObject.english[
                                        "slide".concat(item)
                                    ].contents[componentName].categories[
                                        "category".concat(catNum, "Text")
                                    ] =
                                        contents[comp].data.categories[
                                            catNum
                                        ].label;
                                }
                                break;
                            }
                            case "pdfviewer": {
                                bigObject.english[
                                    "slide".concat(item)
                                ].contents[componentName].id =
                                    contents[comp].data.id;
                                break;
                            }
                            default:
                                break;
                        }
                    }
                }
                bigObject.spanish = bigObject.english;
                if (download) {
                    downloadData();
                } else {
                    console.log(bigObject);
                }
            });
    } catch (error) {
        console.error(error);
    }
}
function downloadData() {
    // get all of the text and download it
    const blob = new Blob([JSON.stringify(bigObject)], { type: "text/json" });
    link1.href = window.URL.createObjectURL(blob);
    const todaysDate = new Date().toDateString().slice(4);
    link1.download = "AllText-".concat(todaysDate, ".JSON");
    link1.click();
}

// button1.addEventListener("click", () => {
//     gatherData();
// });

// download alt text
button2.addEventListener("click", () => {
    gatherData(true);
});

// translate applet
button3.addEventListener("click", () => {
    const slideContainer = document.getElementById("slide-data");
    while (slideContainer.firstChild) {
        slideContainer.removeChild(slideContainer.firstChild);
    }
    if (pastedJSON) {
        workingJSON = JSON.parse(pastedJSON.value);
        const workingKeys = Object.keys(workingJSON[language]);
        for (const keys of workingKeys) {
            const fragment = document.createDocumentFragment();
            const slideTitle = fragment
                .appendChild(document.createElement("div"))
                .appendChild(document.createElement("h2"));
            slideTitle.textContent = `Slide ${
                Number(keys.charAt(keys.length - 1)) + 1
            }`;
            const components = workingJSON[language][keys].contents;
            for (const component of Object.keys(components)) {
                switch (components[component].componentType) {
                    case "richtexteditor": {
                        const rteDump = document.createElement("p");
                        rteDump.innerHTML = components[component].text;
                        fragment.appendChild(rteDump);
                        break;
                    }
                    case "textbox": {
                        const textDump = document.createElement("p");
                        textDump.innerHTML = `<p>${components[component].text}</p>`;
                        fragment.appendChild(textDump);
                        break;
                    }
                    case "button": {
                        const soloButton = document.createElement("button");
                        soloButton.textContent = components[component].text;
                        fragment.appendChild(soloButton);
                        break;
                    }
                    case "buttongroup": {
                        Object.values(components[component].buttons).forEach(
                            (element) => {
                                const groupButton =
                                    document.createElement("button");
                                groupButton.textContent = element;
                                fragment.appendChild(groupButton);
                            }
                        );
                        break;
                    }
                    case "select": {
                        const selectDump = document.createElement("select");
                        Object.values(components[component].select).forEach(
                            (element) => {
                                const optionDump =
                                    document.createElement("option");
                                optionDump.textContent = element;
                                selectDump.appendChild(optionDump);
                            }
                        );
                        fragment.appendChild(selectDump);
                        break;
                    }
                    case "geogebra": {
                        const ggbContainer = document.createElement("div");
                        ggbContainer.setAttribute("class", "container");
                        const ggb = document.createElement("div");
                        ggb.setAttribute(
                            "id",
                            "ggb-element".concat(
                                components[component].materialId
                            )
                        );
                        fragment.appendChild(ggbContainer).appendChild(ggb);
                        const params = {
                            material_id: `${components[component].materialId}`,
                            appName: "classic",
                            scaleContainerClass: "container",
                            showToolBar: false,
                            showAlgebraInput: false,
                            showMenuBar: false,
                            enableRightClick: false,
                            language: "es",
                            showFullscreenButton: "true",
                        };
                        // if (components[component].)
                        // eslint-disable-next-line no-undef
                        const applet = new GGBApplet(params);
                        applet.inject(
                            "ggb-element".concat(
                                components[component].materialId
                            )
                        );
                        break;
                    }
                    case "pdfviewer": {
                        const pdfAdvisory = document.createElement("p");
                        pdfAdvisory.textContent = `This page contains a PDF with ID: ${components[component].id}.`;
                        fragment.appendChild(pdfAdvisory);

                        break;
                    }
                    case "complextable": {
                        const tableDump = document.createElement("table");
                        tableDump.setAttribute(
                            "style",
                            "border:3px white solid"
                        );
                        for (const rowNum of Object.keys(
                            components[component].rows
                        )) {
                            const tableRow = document.createElement("tr");

                            for (const colNum of Object.keys(
                                components[component].rows[rowNum]
                            )) {
                                let tableCells = null;
                                if (
                                    components[component].rows[rowNum][colNum]
                                        .scope
                                ) {
                                    tableCells = document.createElement("th");
                                    tableCells.textContent =
                                        components[component].rows[rowNum][
                                            colNum
                                        ];
                                    const ariaCall = colNum.replace(
                                        "Text",
                                        "AriaLabel"
                                    );
                                    tableCells.setAttribute(
                                        "ariaLabel",
                                        components[component].ariaRows[rowNum][
                                            ariaCall
                                        ]
                                    );
                                } else {
                                    tableCells = document.createElement("td");
                                    tableCells.textContent =
                                        components[component].rows[rowNum][
                                            colNum
                                        ];
                                    const ariaCall = colNum.replace(
                                        "Text",
                                        "AriaLabel"
                                    );
                                    tableCells.setAttribute(
                                        "ariaLabel",
                                        components[component].ariaRows[rowNum][
                                            ariaCall
                                        ]
                                    );
                                }
                                tableRow.appendChild(tableCells);
                            }
                            tableDump.appendChild(tableRow);
                        }
                        fragment.appendChild(tableDump);
                        break;
                    }
                    case "table": {
                        const tableDump = document.createElement("table");
                        tableDump.setAttribute(
                            "style",
                            "border:3px white solid"
                        );
                        const headerRow = document.createElement("tr");

                        for (const headerCell of Object.values(
                            components[component].columns
                        )) {
                            const tableHeader = document.createElement("th");
                            tableHeader.textContent = headerCell;
                            headerRow.appendChild(tableHeader);
                        }
                        tableDump.appendChild(headerRow);
                        for (const rowNum of Object.keys(
                            components[component].rows
                        )) {
                            const tableRow = document.createElement("tr");

                            for (const colNum of Object.keys(
                                components[component].rows[rowNum]
                            )) {
                                const tableCells = document.createElement("td");
                                tableCells.textContent =
                                    components[component].rows[rowNum][colNum];
                                const ariaCall = colNum.replace(
                                    "Text",
                                    "AriaLabel"
                                );
                                tableCells.setAttribute(
                                    "ariaLabel",
                                    components[component].ariaRows[rowNum][
                                        ariaCall
                                    ]
                                );
                                tableRow.appendChild(tableCells);
                            }
                            tableDump.appendChild(tableRow);
                        }
                        fragment.appendChild(tableDump);
                        break;
                    }
                    case "image": {
                        const imageDump = document.createElement("img");
                        imageDump.src = components[component].src;
                        imageDump.alt = components[component].alt;
                        imageDump.setAttribute(
                            "style",
                            "background-color: rgba(255, 255, 255, 1);"
                        );
                        if (
                            components[component][component.concat("AriaLabel")]
                        ) {
                            imageDump.setAttribute(
                                "ariaLabel",
                                components[component][
                                    component.concat("AriaLabel")
                                ]
                            );
                        }
                        fragment.appendChild(imageDump);
                        const copyright = document.createElement("p");
                        copyright.textContent = components[component].copyright;
                        fragment.appendChild(copyright);
                        break;
                    }
                    default:
                        break;
                }
            }

            slideData.appendChild(fragment);
        }
    }
});

// download applet
// button4.addEventListener("click", () => {
//     ggbApplet.evalCommand("ScreenDimensions = Corner(5)");
//     ggbApplet.getBase64(function (str64) {
//         const element = document.createElement("a");
//         element.href = window.URL.createObjectURL(
//             new Blob([str64], {
//                 type: "application/vnd.geogebra.file",
//             })
//         );
//         element.download = input1.value + ".ggb";
//         element.click();
//     });
// });
