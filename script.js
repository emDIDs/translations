// pull elements from document and name them
const pastedJSON = document.getElementById("json-object");
const input1 = document.getElementById("lessonID");
const button1 = document.getElementById("id-submit");
const button2 = document.getElementById("pull-text");
const button3 = document.getElementById("translate");
const slideData = document.getElementById("slide-data");
const sleep = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms));

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
            .then(async function (data) {
                console.log(data);
                for (const item in data.slides) {
                    const { contents } = data.slides[item];
                    bigObject.english["slide".concat(item)] = {
                        slideNumber: data.slides[item].slideId,
                        codingLayer: data.slides[item].code,
                        contents: {},
                    };
                    for await (const comp of Object.keys(contents)) {
                        const componentName = contents[comp].name;
                        if (contents[comp].type === "geogebra") {
                            bigObject.english["slide".concat(item)].contents[
                                componentName
                            ] = {
                                componentType: contents[comp].type,
                            };
                        } else {
                            bigObject.english["slide".concat(item)].contents[
                                componentName
                            ] = {
                                [componentName.concat("AriaLabel")]:
                                    contents[comp].data.ariaLabel,
                                componentType: contents[comp].type,
                            };
                        }
                        switch (
                            bigObject.english["slide".concat(item)].contents[
                                componentName
                            ].componentType
                        ) {
                            case "geogebra": {
                                bigObject.english[
                                    "slide".concat(item)
                                ].contents[componentName].materialId =
                                    contents[comp].config.materialId;
                                bigObject.english[
                                    "slide".concat(item)
                                ].contents[componentName].geoGebraContent =
                                    await getGeoGebraGuts(
                                        contents[comp].config.materialId
                                    );
                                await sleep(1000);
                                ggbApplet.remove();
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
                document.querySelector(".applet_scaler").remove();
                document.querySelector("#ggb-element").style = "height:0";
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
const reusedText = {
    english: {
        xIconCaptionText: "Close.",
        instructionsIconCaptionText:
            "Instructions. Press space to open the instructions.",
        yAxisY: 'Text("y", YAxisTop + (4xpixel, -1 ypixel), true, true)',
        escText:
            '"" + (If(escTextCount < 2, "Press the escape key to exit the interactive and return to the page.", ""))',
        defaultGGBLanguage: "English",
        keyboardInstructions: "Keyboard instructions enabled",
        displayedInstructionsText:
            "Text(instructionsText, BottomLeftButtonBar + 3(xpixel, -ypixel), true, true)",
        intermediateKeyboardInstructions:
            'Text("\\text{" + keyboardInstructions + "}", (0, 0), true, true)',
        displayedKeyboardInstructions:
            "Text(intermediateKeyboardInstructions, corner2 + keyInstructionsVec + (2xpixel, -2 ypixel), true, true)",
        keybindText:
            '"\\\\ \\\\Press k to " + (If(showKeyboardInstructions, "hide", "show")) + " keyboard instructions." + (If(false, "\\\\ \\\\Press x to restart the tab cycle.", ""))',
        libSelectedObject: "",
        keyboardInstructionsConst:
            '{// A: "Press the arrow keys to move this point.", // example for a pointggbButton1: ggbObject.getValue("ggbButton1Enabled")? "Press space to ___.": unavailableButtonText,ggbButton2: ggbObject.getValue("ggbButton2Enabled")? "Press space to ___.": unavailableButtonText,ggbButton3: ggbObject.getValue("ggbButton3Enabled")? "Press space to ___.": unavailableButtonText,ggbButton4: ggbObject.getValue("ggbButton4Enabled")? "Press space to ___.": unavailableButtonText,ggbButton5: ggbObject.getValue("ggbButton5Enabled")? "Press space to ___.": unavailableButtonText,}',
    },
    spanish: {
        xIconCaptionText: "Cerrar.",
        instructionsIconCaptionText:
            "Instrucciones. Presiona la barra de espacio para abrir las instrucciones.",
        yAxisY: 'Text("y", YAxisTop + (4xpixel, -1 ypixel), true, true)',
        escText:
            '"" + (If(escTextCount < 2, "Presiona la tecla de escape para salir de la actividad interactiva y regresar a la página.", ""))',
        defaultGGBLanguage: "Spanish",
        keyboardInstructions: "Instrucciones de teclado habilitadas",
        displayedInstructionsText:
            "Text(instructionsText, BottomLeftButtonBar + 3(xpixel, -ypixel), true, true)",
        intermediateKeyboardInstructions:
            'Text("\\text{" + keyboardInstructions + "}", (0, 0), true, true)',
        displayedKeyboardInstructions:
            "Text(intermediateKeyboardInstructions, corner2 + keyInstructionsVec + (2xpixel, -2 ypixel), true, true)",
        keybindText:
            '"\\\\ \\\\Presiona k para " + (If(showKeyboardInstructions, "ocultar", "mostrar")) + " las instrucciones de teclado." + (If(true, "\\\\ \\\\Presiona x para reiniciar el ciclo de pestañas.", ""))',
        libSelectedObject: "",
        keyboardInstructionsConst:
            '{// A: "Press the arrow keys to move this point.", // example for a pointggbButton1: ggbObject.getValue("ggbButton1Enabled")? "Press space to ___.": unavailableButtonText,ggbButton2: ggbObject.getValue("ggbButton2Enabled")? "Press space to ___.": unavailableButtonText,ggbButton3: ggbObject.getValue("ggbButton3Enabled")? "Press space to ___.": unavailableButtonText,ggbButton4: ggbObject.getValue("ggbButton4Enabled")? "Press space to ___.": unavailableButtonText,ggbButton5: ggbObject.getValue("ggbButton5Enabled")? "Press space to ___.": unavailableButtonText,}',
    },
};

// function accessible from both buttons
function getGlobalJS() {
    let archiveNum = -1;
    const jsonArchive = ggbApplet.getFileJSON().archive;
    const jsonKeysArray = Object.keys(jsonArchive);
    jsonKeysArray.some(function (element) {
        if (jsonArchive[element].fileName === "geogebra_javascript.js") {
            archiveNum = element;
            return true;
        }
        return false;
    });
    const archiveGlobalJS = jsonArchive[archiveNum].fileContent;
    return archiveGlobalJS;
}

function waitForIt(functionName) {
    return new Promise((resolve) => {
        if (document.querySelector("canvas")) {
            return resolve(functionName);
        }

        const observer = new MutationObserver(() => {
            if (document.querySelector("canvas")) {
                observer.disconnect();
                resolve(functionName);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    });
}
async function getGeoGebraGuts(matID) {
    // boilerplate language - strip it out so translators don't keep translating it
    loadApplet(matID);
    const ggbObject = waitForIt(getText()).then((geoGebraObject) => {
        return geoGebraObject;
    });

    // load applet
    function loadApplet(matID) {
        const params = {
            // eslint-disable-next-line camelcase
            material_id: matID,
            appName: "classic",
            height: 650,
            showToolBar: false,
            showAlgebraInput: false,
            showMenuBar: false,
            enableRightClick: false,
            language: "en",
        };

        // eslint-disable-next-line no-undef
        const applet = new GGBApplet(params, true);
        applet.inject("ggb-element");
    }

    // download all text
    async function getText() {
        // handles minimum/maximum text, point labels, titles
        const bigObject = {};
        await sleep(1000);

        // handle ariaLabel
        const ariaLabel = document
            .querySelector(`canvas`)
            .getAttribute("aria-label");

        bigObject.ariaLabelForGGB = ariaLabel;

        // handle all text objects, lists, and anything that has a caption
        const allItems = ggbApplet.getAllObjectNames();
        allItems.forEach(function (el) {
            const type = ggbApplet.getObjectType(el);
            switch (type) {
                // for text, if independent get the value otherwise get the definition
                case "text": {
                    if (
                        ggbApplet.isIndependent(el) &&
                        !Object.keys(reusedText.english).includes(el)
                    ) {
                        bigObject[el] = ggbApplet
                            .getValueString(el)
                            .replace(/(\r\n|\n|\r)/gm, "");
                    } else if (!Object.keys(reusedText.english).includes(el)) {
                        bigObject[el] = ggbApplet
                            .getDefinitionString(el)
                            .replace(/(\r\n|\n|\r)/gm, "");
                    }
                    break;
                }
                // for list, get the definition string, then find out if anyone used SelectedElement instead of SelectedIndex
                case "list": {
                    const listXML = ggbApplet.getXML(el);

                    // if list is drawn as a dropdown
                    if (listXML.includes("comboBox")) {
                        bigObject[el] = ggbApplet.getDefinitionString(el);
                        const allXML = ggbApplet.getXML();
                        const parser = new DOMParser();
                        const xmldom = parser.parseFromString(
                            allXML,
                            "application/xml"
                        );

                        // if someone used SelectedElement instead of SelectedIndex, find it
                        const value = xmldom.querySelectorAll(
                            `condition[showObject*="SelectedElement"]`
                        );
                        if (value.length > 0) {
                            const matches = allXML.match(
                                /<condition showObject="SelectedElement\[.*\].*&quot;(.*)&quot;.*"/g
                            );
                            bigObject.conditions = {
                                ...matches,
                            };
                        }
                    }
                    break;
                }
                // if something has a caption, put that caption
                default: {
                    if (
                        ggbApplet.getCaption(el) !== "" &&
                        !Object.keys(reusedText.english).includes(
                            el.concat("CaptionText")
                        )
                    ) {
                        bigObject[el.concat("CaptionText")] =
                            ggbApplet.getCaption(el);
                    }
                    break;
                }
            }
        });

        // search through globalJS for any alt text
        const pulledGlobalJS = getGlobalJS();

        // removes all non-line break space
        const cleanedJS = pulledGlobalJS.replace(
            /([^\n][^\S\r\n])[^\S\r\n]+/g,
            ""
        );
        const soapyComments = cleanedJS.replace(/\/\//gm, "");
        console.log(soapyComments);
        const soapyQuotes = soapyComments.replace(/\\"/gm, "'");

        // removes all line breaks
        const squeakyClean = soapyQuotes.replace(/(\r\n|\n|\r)/gm, "");
        bigObject.globalJSText = squeakyClean;

        // if you find ReadText(something), pull the text
        function pullReadText() {
            // matches anything that starts with the words ReadText
            const allMatches = squeakyClean.match(/ReadText\((.*?)\)/g);

            // if matches exist, Put them into their own section of globalJSText
            if (allMatches && allMatches.length !== 0) {
                allMatches.forEach(function (element, index) {
                    bigObject.globalJSText["GGBReadText" + index] = element
                        .replace(/([^\n][^\S\r\n])[^\S\r\n]+/g, "")
                        .trim();
                });
            }
            // get keyboard instructions constant, if something has been changed, include it
            const allKeyboardInstructions = squeakyClean.match(
                /const keyboardInstructions = \{.*?\}/g
            );
            if (
                allKeyboardInstructions &&
                reusedText.keyboardInstructionsConst !==
                    allKeyboardInstructions[0].replace(
                        "const keyboardInstructions = ",
                        ""
                    )
            ) {
                bigObject.keyboardInstructionsConst = allKeyboardInstructions[0]
                    .replace("const keyboardInstructions = ", "")
                    .replace(
                        '// A: "Presiona las teclas de flecha para mover este punto.", // example for a point',
                        ""
                    )
                    .replaceAll("// example for a point", "");
            }
        }

        pullReadText();
        return bigObject;
    }
    return ggbObject;
}

button1.addEventListener("click", () => {
    gatherData();
});

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
    // load applet
    function loadApplet(ggbName, matID) {
        const params = {
            // eslint-disable-next-line camelcase
            material_id: matID,
            appName: "classic",
            height: 650,
            showToolBar: false,
            showAlgebraInput: false,
            showMenuBar: false,
            enableRightClick: false,
            language: "es",
        };

        // eslint-disable-next-line no-undef
        const applet = new GGBApplet(params, true);
        applet.inject(ggbName);
    }
    async function pauseForTranslation(
        ggbName,
        ggbGuts,
        englishReusedText,
        spanishReusedText
    ) {
        loadApplet(ggbName, ggbName.replace("ggb-element", ""));
        const ggbObject = waitForIt(
            translateApplet(
                ggbName,
                ggbGuts,
                englishReusedText,
                spanishReusedText
            )
        ).then((geoGebraObject) => {
            // translateApplet(
            //     "ggb-element".concat(
            //         components[component].materialId
            //     ),
            //     components[component].geoGebraContent
            // );
            console.warn(ggbObject);
            return geoGebraObject;
        });
    }
    async function pauseEverything() {
        if (pastedJSON) {
            workingJSON = JSON.parse(pastedJSON.value);
            const workingKeys = Object.keys(workingJSON[language]);
            for (const keys of workingKeys) {
                const fragment = document.createDocumentFragment();
                const slideTitle = fragment
                    .appendChild(document.createElement("div"))
                    .appendChild(document.createElement("h2"));
                console.log(keys);
                slideTitle.textContent = `Slide ${
                    Number(keys.replace("slide", "")) + 1
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
                            Object.values(
                                components[component].buttons
                            ).forEach((element) => {
                                const groupButton =
                                    document.createElement("button");
                                groupButton.textContent = element;
                                fragment.appendChild(groupButton);
                            });
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
                            console.log(workingJSON.english[keys].contents);
                            const englishReusedText =
                                workingJSON.english[keys].contents[component]
                                    .geoGebraContent;
                            const spanishReusedText =
                                workingJSON.spanish[keys].contents[component]
                                    .geoGebraContent;
                            await pauseForTranslation(
                                "ggb-element".concat(
                                    components[component].materialId
                                ),
                                components[component].geoGebraContent,
                                englishReusedText,
                                spanishReusedText
                            );
                            // const params = {
                            //     material_id: `${components[component].materialId}`,
                            //     appName: "classic",
                            //     scaleContainerClass: "container",
                            //     showToolBar: false,
                            //     showAlgebraInput: false,
                            //     showMenuBar: false,
                            //     enableRightClick: false,
                            //     language: "es",
                            //     showFullscreenButton: "true",
                            // };
                            // // eslint-disable-next-line no-undef
                            // const applet = new GGBApplet(params);
                            // applet.inject(
                            //     "ggb-element".concat(
                            //         components[component].materialId
                            //     )
                            // );

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
                            for (const rowNum of Object.keys(
                                components[component].rows
                            )) {
                                const tableRow = document.createElement("tr");

                                for (const colNum of Object.keys(
                                    components[component].rows[rowNum]
                                )) {
                                    let tableCells = null;
                                    if (
                                        components[component].rows[rowNum][
                                            colNum
                                        ].scope
                                    ) {
                                        tableCells =
                                            document.createElement("th");
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
                                            components[component].ariaRows[
                                                rowNum
                                            ][ariaCall]
                                        );
                                    } else {
                                        tableCells =
                                            document.createElement("td");
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
                                            components[component].ariaRows[
                                                rowNum
                                            ][ariaCall]
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
                            const headerRow = document.createElement("tr");

                            for (const headerCell of Object.values(
                                components[component].columns
                            )) {
                                const tableHeader =
                                    document.createElement("th");
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
                                    const tableCells =
                                        document.createElement("td");
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
                                "background-color: rgba(255, 255, 255, 1);color:rgba(0, 0, 0, 1)"
                            );
                            if (
                                components[component][
                                    component.concat("AriaLabel")
                                ]
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
                            copyright.textContent =
                                components[component].copyright;
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
    }
    pauseEverything();
});

// translate applet
async function translateApplet(
    ggbName,
    translatedText,
    englishReusedText,
    spanishReusedText
) {
    console.log("NAME", ggbName);
    // get data from textarea
    const language = "spanish";
    await sleep(2000);

    if (!ggbApplet.exists("defaultGGBLanguage")) {
        ggbApplet.evalCommand("defaultGGBLanguage='Spanish'");
    }

    // parse the string into a JSON object
    // function prettyPrint(ugly) {
    //     const obj = JSON.parse(ugly);
    //     return obj;
    // }
    // const prettyAltText = prettyPrint(translatedText);
    const prettyAltText = pastedJSON.value;
    console.warn(prettyAltText, typeof prettyAltText);
    // updates alt text with specified language
    function handleText(englishReusedText, spanishReusedText, translatedText) {
        console.log(reusedText);
        console.log(prettyAltText);
        const reusedKeysArray = Object.keys(reusedText.english);
        reusedKeysArray.forEach((key) => {
            englishReusedText[key] = reusedText.english[key];
            spanishReusedText[key] = reusedText.spanish[key];
        });

        // handles minimum/maximum text, point labels, titles
        const allItems = ggbApplet.getAllObjectNames();
        allItems.forEach(function (el) {
            const type = ggbApplet.getObjectType(el);
            switch (type) {
                // if text
                case "text": {
                    if (ggbApplet.isIndependent(el)) {
                        ggbApplet.setTextValue(el, translatedText[el]);
                    } else {
                        ggbApplet.evalCommand(
                            el.concat("=", translatedText[el])
                        );
                    }
                    break;
                }
                case "list": {
                    const listXML = ggbApplet.getXML(el);
                    if (listXML.includes("comboBox")) {
                        const string = translatedText[el];
                        let xmlstring = ggbApplet.getXML();
                        const parser = new DOMParser();
                        const xmldom = parser.parseFromString(
                            xmlstring,
                            "application/xml"
                        );

                        // if there's a list, edit it
                        const listNode = xmldom.querySelectorAll(
                            'comboBox[val="true"]'
                        );
                        listNode.forEach((element) => {
                            const parentName =
                                element.parentElement.getAttribute("label");
                            const value = xmldom.querySelectorAll(
                                `expression[label=${parentName}]`
                            );
                            value.forEach((el) => {
                                el.setAttribute("exp", string);
                                const serializer = new XMLSerializer();
                                const listString =
                                    serializer.serializeToString(el);
                                ggbApplet.evalXML(listString);
                            });
                        });

                        // if someone used SelectedElement instead of SelectedIndex, edit it
                        const conditionsShowObject = xmldom.querySelectorAll(
                            `condition[showObject*="SelectedElement"]`
                        );
                        if (conditionsShowObject.length > 0) {
                            const matches = xmlstring.match(
                                /<condition showObject="SelectedElement\[.*\].*&quot;(.*)&quot;.*"/g
                            );
                            matches.forEach((element, index) => {
                                xmlstring = xmlstring.replace(
                                    element,
                                    translatedText.conditions[index]
                                );
                            });
                        }
                    }
                    break;
                }
                default:
                    break;
            }
            if (ggbApplet.getCaption(el) !== "") {
                ggbApplet.setCaption(
                    el,
                    translatedText[el.concat("CaptionText")]
                );
            }
        });
    }

    // take in globalJS again,
    function handleGlobalJS(englishReusedText, spanishReusedText) {
        let pulledGlobalJS = getGlobalJS();
        // if you find ReadText(something), pull the text
        function replaceReadText() {
            // if there's a globalJSText section in the translated JSON object, replace the text in globalJS
            const altTextKeys = Object.keys(prettyAltText[language]);
            if (altTextKeys.includes("globalJSText")) {
                const ggbReadTextKeys = Object.keys(
                    prettyAltText[language].globalJSText
                );
                ggbReadTextKeys.forEach((el, index) => {
                    pulledGlobalJS = pulledGlobalJS.replace(
                        prettyAltText.english.globalJSText[
                            "GGBReadText" + index
                        ],
                        prettyAltText[language].globalJSText[
                            "GGBReadText" + index
                        ]
                    );
                });
            }
        }

        function replaceKIConst() {
            // get keyboard instructions constant, if something has been changed, include it
            pulledGlobalJS = pulledGlobalJS.replace(
                /const keyboardInstructions = \{.*?\}/gs,
                "const keyboardInstructions = ".concat(
                    prettyAltText[language].keyboardInstructionsConst
                        .replace(
                            '// A: "Presiona las teclas de flecha para mover este punto.", // example for a point',
                            ""
                        )
                        .replaceAll("// example for a point", "")
                )
            );
        }

        // replaceReadText();
        // replaceKIConst();
        handleText(englishReusedText, spanishReusedText, translatedText);

        const fullAppletJSON = ggbApplet.getFileJSON();

        let archiveNum = -1;
        const jsonArchive = ggbApplet.getFileJSON().archive;
        const jsonKeysArray = Object.keys(jsonArchive);
        jsonKeysArray.some(function (element) {
            if (jsonArchive[element].fileName === "geogebra_javascript.js") {
                archiveNum = element;
                return true;
            }
            return false;
        });

        fullAppletJSON.archive[archiveNum].fileContent =
            translatedText.globalJSText;

        const params = {
            material_id: "d5mfqpx5",
            appName: "classic",
            height: 650,
            showToolBar: false,
            showAlgebraInput: false,
            showMenuBar: false,
            enableRightClick: false,
            language: "es",
            appletOnLoad(api1) {
                api1.setFileJSON(fullAppletJSON);
            },
        };

        // eslint-disable-next-line no-undef
        const applet = new GGBApplet(params);
        applet.inject(ggbName);
    }

    handleGlobalJS(englishReusedText, spanishReusedText);
}

// download applet
// function downloadApplet() {
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
// }
