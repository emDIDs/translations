// pull elements from document and name them
const pastedJSON = document.getElementById("json-object");
const pastedJS = document.getElementById("javascript");
const input1 = document.getElementById("mat-id");
const button1 = document.getElementById("id-submit");
const button2 = document.getElementById("pull-text");
const button3 = document.getElementById("translate");
const button4 = document.getElementById("download");
const link1 = document.getElementById("downloadJSON-link");

// boilerplate language - strip it out so translators don't keep translating it
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

// load applet
button1.addEventListener("click", () => {
    const matID = input1.value;
    const params = {
        // eslint-disable-next-line camelcase
        material_id: matID,
        appName: "classic",
        showToolBar: false,
        showAlgebraInput: false,
        showMenuBar: false,
        enableRightClick: false,
        language: "es",
    };

    // eslint-disable-next-line no-undef
    const applet = new GGBApplet(params, true);
    applet.inject("ggb-element");
});

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
    console.warn(archiveGlobalJS);
    return archiveGlobalJS;
}

// download alt text
button2.addEventListener("click", () => {
    function getText() {
        // handles minimum/maximum text, point labels, titles
        const bigObject = {
            materialID: input1.value,
            english: {},
            spanish: {},
        };

        // handle ariaLabel
        const { ariaLabel } = document.querySelector(`canvas`);
        bigObject.english.ariaLabelForGGB = ariaLabel;

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
                        bigObject.english[el] = ggbApplet
                            .getValueString(el)
                            .replace(/(\r\n|\n|\r)/gm, "");
                    } else if (!Object.keys(reusedText.english).includes(el)) {
                        bigObject.english[el] = ggbApplet
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
                        bigObject.english[el] =
                            ggbApplet.getDefinitionString(el);
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
                            bigObject.english.conditions = {
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
                        bigObject.english[el.concat("CaptionText")] =
                            ggbApplet.getCaption(el);
                    }
                    break;
                }
            }
        });

        // search through globalJS for any alt text
        bigObject.english.globalJSText = {};

        const pulledGlobalJS = getGlobalJS();

        // removes all non-line break space
        const cleanedJS = pulledGlobalJS.replace(
            /([^\n][^\S\r\n])[^\S\r\n]+/g,
            ""
        );

        // removes all line breaks
        const squeakyClean = cleanedJS.replace(/(\r\n|\n|\r)/gm, "");
        // if you find ReadText(something), pull the text
        function pullReadText() {
            // matches anything that starts with the words ReadText
            const allMatches = squeakyClean.match(/ReadText\((.*?)\)/g);

            // if matches exist, Put them into their own section of globalJSText
            if (allMatches && allMatches.length !== 0) {
                allMatches.forEach(function (element, index) {
                    bigObject.english.globalJSText["GGBReadText" + index] =
                        element
                            .replace(/([^\n][^\S\r\n])[^\S\r\n]+/g, "")
                            .trim();
                });
            }
            // get keyboard instructions constant, if something has been changed, include it
            const allKeyboardInstructions = squeakyClean.match(
                /const keyboardInstructions = \{.*?\}/g
            );
            if (
                reusedText.english.keyboardInstructionsConst !==
                allKeyboardInstructions[0].replace(
                    "const keyboardInstructions = ",
                    ""
                )
            ) {
                bigObject.english.keyboardInstructionsConst =
                    allKeyboardInstructions[0]
                        .replace("const keyboardInstructions = ", "")
                        .replace(
                            '// A: "Presiona las teclas de flecha para mover este punto.", // example for a point',
                            ""
                        )
                        .replaceAll("// example for a point", "");
            }
        }

        pullReadText();
        // take everthing in english and duplicate it
        bigObject.spanish = bigObject.english;
        return bigObject;
    }

    // get all of the text and download it
    const AllAltText = getText();
    link1.href = "data:text/json," + encodeURI(JSON.stringify(AllAltText));
    link1.download = "AllText-".concat(input1.value, ".JSON");
    link1.click();
    const originalJS = getGlobalJS();
    const blob = new Blob([originalJS], {
        type: "text/js",
    });
    const url = URL.createObjectURL(blob);
    const aLink = document.createElement("a");
    aLink.href = url;
    aLink.download = "GlobalJS-".concat(input1.value, ".js");
    document.body.appendChild(aLink);
    aLink.click();
});

// translate applet
button3.addEventListener("click", () => {
    // get data from textarea
    const translatedText = pastedJSON.value;
    const language = "spanish";
    if (!ggbApplet.exists("defaultGGBLanguage")) {
        ggbApplet.evalCommand("defaultGGBLanguage='Spanish'");
    }

    // parse the string into a JSON object
    function prettyPrint(ugly) {
        const obj = JSON.parse(ugly);
        return obj;
    }
    const prettyAltText = prettyPrint(translatedText);

    // updates alt text with specified language
    function handleText() {
        const reusedKeysArray = Object.keys(reusedText.english);
        reusedKeysArray.forEach((key) => {
            prettyAltText.english[key] = reusedText.english[key];
            prettyAltText.spanish[key] = reusedText.spanish[key];
        });

        // handles minimum/maximum text, point labels, titles
        const allItems = ggbApplet.getAllObjectNames();
        allItems.forEach(function (el) {
            const type = ggbApplet.getObjectType(el);
            switch (type) {
                // if text
                case "text": {
                    if (ggbApplet.isIndependent(el)) {
                        ggbApplet.setTextValue(el, prettyAltText[language][el]);
                    } else {
                        ggbApplet.evalCommand(
                            el.concat("=", prettyAltText[language][el])
                        );
                    }
                    break;
                }
                case "list": {
                    const listXML = ggbApplet.getXML(el);
                    if (listXML.includes("comboBox")) {
                        const string = prettyAltText[language][el];
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
                                    prettyAltText[language].conditions[index]
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
                    prettyAltText[language][el.concat("CaptionText")]
                );
            }
        });
    }

    // take in globalJS again,
    function handleGlobalJS() {
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
        handleText(translatedText);

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

        fullAppletJSON.archive[archiveNum].fileContent = pastedJS.value;

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
        applet.inject("ggb-element");
    }

    handleGlobalJS();
});

// download applet
button4.addEventListener("click", () => {
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
});
