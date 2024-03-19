"use client";
interface FilePickerProps {
    passSetItemData: React.Dispatch<React.SetStateAction<string>>;
    passSetAppletData: React.Dispatch<React.SetStateAction<string>>;
    passSetGlobalJSData: React.Dispatch<React.SetStateAction<string>>;
}

const FilePicker = ({
    passSetItemData,
    passSetAppletData,
    passSetGlobalJSData,
}: FilePickerProps) => {
    const handleFilePicker = (event: React.ChangeEvent<HTMLInputElement>) => {
        const uploadedFiles = event.currentTarget.files;
        let translatedSlides;
        const translatedApplet: any = {};
        const translatedGlobalJS: any = {};
        if (uploadedFiles) {
            for (const singleFile of uploadedFiles) {
                const reader = new FileReader();
                const showFile = (file: ProgressEvent<FileReader>) => {
                    const fileNameLI = document.createElement("li");
                    fileNameLI.innerHTML = singleFile.name;
                    if (file.target) {
                        switch (true) {
                            case singleFile.name.includes("Slides"): {
                                translatedSlides = file.target.result;
                                if (typeof translatedSlides === "string") {
                                    const translatedObject =
                                        JSON.parse(translatedSlides);
                                    passSetItemData(translatedObject.slides);
                                    passSetAppletData(translatedApplet);
                                    passSetGlobalJSData(translatedGlobalJS);
                                }
                                break;
                            }
                            case singleFile.name.includes("Applet"): {
                                const materialIdMatch = singleFile.name
                                    .replace(/G\dM\dT\wL\d+/, "")
                                    .match(/-\s*([a-z0-9]{8})/);
                                if (materialIdMatch) {
                                    if (materialIdMatch.length > 1) {
                                        const materialIdFromFile =
                                            materialIdMatch[1];
                                        if (
                                            materialIdFromFile &&
                                            typeof file.target.result ===
                                                "string"
                                        ) {
                                            translatedApplet[
                                                materialIdFromFile
                                            ] = JSON.parse(file.target.result);
                                            const reusedText = {
                                                english: {
                                                    xIconCaptionText: "Close.",
                                                    instructionsIconCaptionText:
                                                        "Instructions. Press space to open the instructions.",
                                                    yAxisY: 'Text("y", YAxisTop + (4xpixel, -1 ypixel), true, true)',
                                                    escText:
                                                        "Press the escape key to exit the interactive and return to the page.",
                                                    defaultGGBLanguage:
                                                        "English",
                                                    keyboardInstructions:
                                                        "Keyboard instructions enabled",
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
                                                    defaultGGBLanguage:
                                                        "Spanish",
                                                    keyboardInstructions:
                                                        "Instrucciones de teclado habilitadas",
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

                                            const reusedKeysArray = Object.keys(
                                                reusedText.english
                                            );
                                            const englishReusedText: {
                                                [key: string]: string;
                                            } = reusedText.english;

                                            const spanishReusedText: {
                                                [key: string]: string;
                                            } = reusedText.spanish;

                                            reusedKeysArray.map(
                                                (key: string) => {
                                                    translatedApplet[
                                                        materialIdFromFile
                                                    ].english[key] =
                                                        englishReusedText[key];
                                                    translatedApplet[
                                                        materialIdFromFile
                                                    ].spanish[key] =
                                                        spanishReusedText[key];
                                                }
                                            );
                                        }
                                    }
                                }
                                break;
                            }
                            case singleFile.name.includes("GlobalJS"): {
                                const materialIdMatch = singleFile.name
                                    .replace(/G\dM\dT\wL\d+/, "")
                                    .match(/-\s*([a-z0-9]{8})/);
                                if (materialIdMatch) {
                                    if (materialIdMatch.length > 1) {
                                        const materialIdFromFile =
                                            materialIdMatch[1];
                                        if (materialIdFromFile) {
                                            translatedGlobalJS[
                                                materialIdFromFile
                                            ] = file.target.result;
                                        }
                                    }
                                }
                                break;
                            }
                        }
                    }
                };

                const handleLoadedFile = (singleFile: File) => {
                    return showFile;
                };
                reader.onload = handleLoadedFile(singleFile);
                reader.readAsText(singleFile);
            }
        }
    };

    return (
        <div>
            <label htmlFor="upload">
                Choose all lesson files. You can use shift or CTRL to select
                multiple files at once.
            </label>
            <input
                id="upload"
                type="file"
                accept="text/JSON"
                name="upload"
                size={30}
                multiple
                onChange={handleFilePicker}
            />
            <ul id="json-object"></ul>
        </div>
    );
};

export default FilePicker;
