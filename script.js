// pull elements from document and name them
const pastedJSON = document.getElementById("json-object");
const pastedJS = document.getElementById("javascript");
const input1 = document.getElementById("lessonID");
const button1 = document.getElementById("id-submit");
const button2 = document.getElementById("pull-text");
const button3 = document.getElementById("translate");
const textDump = document.getElementById("text-dump");
const rteDump = document.getElementById("RTE-dump");
const slideData = document.getElementById("slide-data");
// const button4 = document.getElementById("download");
const link1 = document.getElementById("downloadJSON-link");
input1.value = "58a6d1ce-b958-47d7-a012-d4b811a7751c";
let workingJSON = {};
const language = "spanish";
// fetch lesson
const bigObject = {
    english: {},
};
button1.addEventListener("click", () => {
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
                console.log(data);
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
                                console.log(contents[comp].config.materialId);
                                bigObject.english[
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
                            case "complextable":
                            case "table": {
                                bigObject.english[
                                    "slide".concat(item)
                                ].contents[componentName].rows = {};
                                for (const rowNum in contents[comp].data.rows) {
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
                                                "row".concat(
                                                    rowNum,
                                                    cellNum,
                                                    "Text"
                                                )
                                            ] = {
                                                ...contents[comp].data.rows[
                                                    rowNum
                                                ][cellNum].mixedText["0"]
                                                    .children,
                                            };
                                        } else {
                                            bigObject.english[
                                                "slide".concat(item)
                                            ].contents[componentName].rows[
                                                "row".concat(
                                                    rowNum,
                                                    cellNum,
                                                    "Text"
                                                )
                                            ] =
                                                contents[comp].data.rows[
                                                    rowNum
                                                ][cellNum].value;
                                        }
                                        bigObject.english[
                                            "slide".concat(item)
                                        ].contents[componentName].rows[
                                            "row".concat(
                                                rowNum,
                                                cellNum,
                                                "AriaLabel"
                                            )
                                        ] =
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
                            default:
                                break;
                        }
                    }
                }
                bigObject.spanish = bigObject.english;
                console.log(bigObject);
            });
    } catch (error) {
        console.error(error);
    }
});

// download alt text
button2.addEventListener("click", () => {
    // get all of the text and download it
    const blob = new Blob([JSON.stringify(bigObject)], { type: "text/json" });
    link1.href = window.URL.createObjectURL(blob);
    const todaysDate = new Date().toDateString().slice(4);
    link1.download = "AllText-".concat(todaysDate, ".JSON");
    link1.click();
});

// translate applet
button3.addEventListener("click", () => {
    if (pastedJSON) {
        workingJSON = JSON.parse(pastedJSON.value);
        console.log("Workin hard", workingJSON);

        const workingKeys = Object.keys(workingJSON[language]);
        for (const keys of workingKeys) {
            console.log(keys);
            const fragment = document.createDocumentFragment();
            const slideTitle = fragment
                .appendChild(document.createElement("div"))
                .appendChild(document.createElement("h2"));
            slideTitle.textContent = `Slide ${
                Number(keys.charAt(keys.length - 1)) + 1
            }`;
            const components = workingJSON[language][keys].contents;
            console.log(components);
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
                        const ggb = document.createElement("div");
                        ggb.setAttribute("id", "ggb-element");
                        fragment.appendChild(ggb);
                        const params = {
                            material_id: `${components[component].materialId}`,
                            appName: "classic",
                            scaleContainerClass: "container",
                            showToolBar: false,
                            showAlgebraInput: false,
                            showMenuBar: false,
                            enableRightClick: false,
                            language: "es",
                        };

                        // eslint-disable-next-line no-undef
                        const applet = new GGBApplet(params);
                        applet.inject("ggb-element");
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
