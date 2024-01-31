// pull elements from document and name them
const pastedJSON = document.getElementById("json-object");
const filePicker = document.getElementById("upload");
const input1 = document.getElementById("lessonID");
const button1 = document.getElementById("id-submit");
const button2 = document.getElementById("pull-text");
const button3 = document.getElementById("translate");
const button4 = document.getElementById("download");
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
// fetch lesson
const bigObject = {
    english: {},
};
let translatedSlides;
let translatedApplet;
let translatedGlobalJS;

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
                    translatedApplet = file.target.result;
                    break;
                }
                case singleFile.name.includes("GlobalJS"): {
                    translatedGlobalJS = file.target.result;
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

function gatherData(download = false) {
    while (pastedJSON.firstChild) {
        pastedJSON.removeChild(pastedJSON.firstChild);
    }
    while (slideContainer.firstChild) {
        slideContainer.removeChild(slideContainer.firstChild);
    }
    const globalID = input1.value;
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
                const downloadedGGB = [];
                for (const item in data.slides) {
                    const { contents } = data.slides[item];
                    for await (const comp of Object.keys(contents)) {
                        if (contents[comp].type === "geogebra") {
                            const geoGebraMaterialId =
                                contents[comp].config.materialId;
                            if (!downloadedGGB.includes(geoGebraMaterialId)) {
                                const innerds =
                                    await getGeoGebraGuts(geoGebraMaterialId);
                                waitForIt(
                                    () => typeof innerds === "object"
                                ).then(() => {
                                    downloadData({
                                        type: "GeoGebra Applet - ".concat(
                                            geoGebraMaterialId
                                        ),
                                        title: data.title,
                                        level: data.level,
                                        module: data.module,
                                        topic: data.topic,
                                        lesson: data.lesson,
                                        data: {
                                            english: innerds.bigObject,
                                            spanish: innerds.bigObject,
                                        },
                                    });
                                    downloadData({
                                        type: "GeoGebra GlobalJS - ".concat(
                                            geoGebraMaterialId
                                        ),
                                        title: data.title,
                                        level: data.level,
                                        module: data.module,
                                        topic: data.topic,
                                        lesson: data.lesson,
                                        data: innerds.pulledGlobalJS,
                                        extension: "js",
                                    });
                                    downloadedGGB.push(geoGebraMaterialId);
                                    ggbApplet.remove();
                                });
                            }
                        }
                    }
                }

                bigObject.spanish = bigObject.english;
                if (document.querySelector(".applet_scaler")) {
                    document.querySelector(".applet_scaler").remove();
                }
                if (document.querySelector("#ggb-element")) {
                    document.querySelector("#ggb-element").style = "height:0";
                }
                if (download) {
                    downloadData({
                        type: "Slides",
                        title: data.title,
                        level: data.level,
                        module: data.module,
                        topic: data.topic,
                        lesson: data.lesson,
                        data,
                    });
                } else {
                    console.log(bigObject);
                }
            });
    } catch (error) {
        console.error(error);
    }
}
function downloadData({
    type,
    title,
    level,
    module,
    topic,
    lesson,
    data = bigObject,
    extension = "json",
}) {
    if (extension === "json") {
        // get all of the text and download it
        const blob = new Blob([JSON.stringify(data)], {
            type: "text/JSON",
        });
        link1.href = window.URL.createObjectURL(blob);
    } else {
        // get all of the text and download it
        const blob = new Blob([data], {
            type: "text/js",
        });
        link1.href = window.URL.createObjectURL(blob);
    }
    const todaysDate = new Date().toDateString().slice(4);
    link1.download = type.concat(
        " - ",
        title,
        " - G",
        level,
        "M",
        module,
        "T",
        topic,
        "L",
        lesson,
        " - ",
        todaysDate,
        ".",
        extension
    );
    link1.click();
}
const reusedText = {
    english: {
        xIconCaptionText: "Close.",
        instructionsIconCaptionText:
            "Instructions. Press space to open the instructions.",
        yAxisY: 'Text("y", YAxisTop + (4xpixel, -1 ypixel), true, true)',
        escText:
            "Press the escape key to exit the interactive and return to the page.",
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
            "Presiona la tecla de escape para salir de la actividad interactiva y regresar a la página.",
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

function waitForIt(condition) {
    return new Promise((resolve) => {
        if (condition()) {
            return resolve();
        }
        const observer = new MutationObserver(() => {
            if (condition()) {
                observer.disconnect();
                resolve();
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
    const ggbObject = waitForIt(
        () =>
            document.querySelector("canvas") &&
            document.querySelector("canvas").hasAttribute("aria-label")
    )
        .then(() => getText())
        .then((geoGebraObject) => {
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
    return ggbObject;
}
// download all text
async function getText() {
    // handles minimum/maximum text, point labels, titles
    const bigObject = {};
    await sleep(2000);
    // handle ariaLabel
    if (document.querySelector(`canvas`)) {
        const ariaLabel = document
            .querySelector(`canvas`)
            .getAttribute("aria-label");

        bigObject.ariaLabelForGGB = ariaLabel;
    }

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

    // // removes all non-line break space
    // const cleanedJS = pulledGlobalJS.replace(/([^\n][^\S\r\n])[^\S\r\n]+/g, "");
    // const soapyComments = cleanedJS.replace(/\/\//gm, "");
    // const soapyQuotes = soapyComments.replace(/\\"/gm, "'");

    // // removes all line breaks
    // const squeakyClean = soapyQuotes.replace(/(\r\n|\n|\r)/gm, "");

    // if you find ReadText(something), pull the text
    // function pullReadText() {
    //     // matches anything that starts with the words ReadText
    //     const allMatches = squeakyClean.match(/ReadText\((.*?)\)/g);

    //     // if matches exist, Put them into their own section of globalJSText
    //     if (allMatches && allMatches.length !== 0) {
    //         allMatches.forEach(function (element, index) {
    //             bigObject.globalJSText["GGBReadText" + index] = element
    //                 .replace(/([^\n][^\S\r\n])[^\S\r\n]+/g, "")
    //                 .trim();
    //         });
    //     }
    //     // get keyboard instructions constant, if something has been changed, include it
    //     const allKeyboardInstructions = squeakyClean.match(
    //         /const keyboardInstructions = \{.*?\}/g
    //     );
    //     if (
    //         allKeyboardInstructions &&
    //         reusedText.keyboardInstructionsConst !==
    //             allKeyboardInstructions[0].replace(
    //                 "const keyboardInstructions = ",
    //                 ""
    //             )
    //     ) {
    //         bigObject.keyboardInstructionsConst = allKeyboardInstructions[0]
    //             .replace("const keyboardInstructions = ", "")
    //             .replace(
    //                 '// A: "Presiona las teclas de flecha para mover este punto.", // example for a point',
    //                 ""
    //             )
    //             .replaceAll("// example for a point", "");
    //     }
    // }

    // pullReadText();
    return { bigObject, pulledGlobalJS };
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
            () =>
                document.querySelector("canvas") &&
                document.querySelector("canvas").hasAttribute("aria-label")
        )
            .then(() =>
                translateApplet(
                    ggbName,
                    ggbGuts,
                    englishReusedText,
                    spanishReusedText
                )
            )
            .then((geoGebraObject) => {
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
                const components = workingJSON.slides[key].contents;
                for (const compNum of Object.keys(components)) {
                    console.log(components[compNum]);
                    switch (components[compNum].type) {
                        case "richtexteditor": {
                            const rteDump = document.createElement("p");
                            rteDump.innerHTML = components[compNum].data.text;
                            fragment.appendChild(rteDump);
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
                            ggb.setAttribute(
                                "id",
                                "ggb-element".concat(
                                    components[compNum].config.materialId
                                )
                            );
                            if (
                                translatedApplet !== "" &&
                                translatedGlobalJS !== ""
                            ) {
                                const appletJSON = JSON.parse(translatedApplet);
                                console.log(appletJSON);
                                fragment
                                    .appendChild(ggbContainer)
                                    .appendChild(ggb);
                                const englishReusedText = appletJSON.english;
                                const spanishReusedText = appletJSON.spanish;
                                await pauseForTranslation(
                                    "ggb-element".concat(
                                        components[compNum].config.materialId
                                    ),
                                    components[compNum].geoGebraContent,
                                    englishReusedText,
                                    spanishReusedText
                                );
                            } else {
                                console.log(
                                    typeof translatedApplet,
                                    typeof translatedGlobalJS
                                );
                            }
                            /* // const params = {
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
                            // );*/

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
});

// translate applet
async function translateApplet(
    ggbName,
    translatedText,
    englishReusedText,
    spanishReusedText
) {
    // get data from textarea
    // const language = "spanish";

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
        // const pulledGlobalJS = getGlobalJS();
        // if you find ReadText(something), pull the text
        // function replaceReadText() {
        //     // if there's a globalJSText section in the translated JSON object, replace the text in globalJS
        //     const altTextKeys = Object.keys(prettyAltText[language]);
        //     if (altTextKeys.includes("globalJSText")) {
        //         const ggbReadTextKeys = Object.keys(
        //             prettyAltText[language].globalJSText
        //         );
        //         ggbReadTextKeys.forEach((el, index) => {
        //             pulledGlobalJS = pulledGlobalJS.replace(
        //                 prettyAltText.english.globalJSText[
        //                     "GGBReadText" + index
        //                 ],
        //                 prettyAltText[language].globalJSText[
        //                     "GGBReadText" + index
        //                 ]
        //             );
        //         });
        //     }
        // }

        // function replaceKIConst() {
        //     // get keyboard instructions constant, if something has been changed, include it
        //     pulledGlobalJS = pulledGlobalJS.replace(
        //         /const keyboardInstructions = \{.*?\}/gs,
        //         "const keyboardInstructions = ".concat(
        //             prettyAltText[language].keyboardInstructionsConst
        //                 .replace(
        //                     '// A: "Presiona las teclas de flecha para mover este punto.", // example for a point',
        //                     ""
        //                 )
        //                 .replaceAll("// example for a point", "")
        //         )
        //     );
        // }

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

// TODO: Fix function to download and name all applets appropriately
// download applet
function downloadApplet() {
    ggbApplet.evalCommand("ScreenDimensions = Corner(5)");
    ggbApplet.getBase64(function (str64) {
        const element = document.createElement("a");
        element.href = window.URL.createObjectURL(
            new Blob([str64], {
                type: "application/vnd.geogebra.file",
            })
        );
        element.download = input1.value + ".ggb";
        element.click();
    });
}

button4.addEventListener("click", () => {
    downloadApplet();
});

// function log(wrapped) {
//     return function () {
//         console.log("Starting", wrapped.name, arguments);
//         const result = wrapped.apply(this, arguments);
//         console.log("Finished", wrapped.name);
//         return result;
//     };
// }
