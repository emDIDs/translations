"use client";
import Image from "next/image";
import Link from "next/link";
import TableCell from "./TableCell";
import { Fragment, useEffect } from "react";

const SlideContent = ({
    components,
    count,
    slideNum,
    appletData,
    globalJSData,
}: any) => {
    const data = Object.keys(components).map((_item, compNum) => {
        console.log(components[compNum]);
        switch (components[compNum].type) {
            case "richtexteditor": {
                return (
                    <div
                        key={`rte${slideNum}${compNum}`}
                        dangerouslySetInnerHTML={{
                            __html: components[compNum].data.text,
                        }}></div>
                );
            }
            case "textbox": {
                console.warn(
                    `Textbox found: ${components[compNum].name}. This lesson may not be fully remediated.`
                );
                return (
                    <p key={`text${slideNum}${compNum}`}>
                        {components[compNum].data.text}
                    </p>
                );
            }
            case "button": {
                return (
                    <button key={`button${slideNum}${compNum}`}>
                        {components[compNum].data.text}
                    </button>
                );
            }
            case "buttongroup":
                return Object.values(components[compNum].data.buttons).map(
                    (element: any, index) => (
                        <button key={`buttonGroup${index}${compNum}`}>
                            {element.text}
                        </button>
                    )
                );
            case "select":
                return (
                    <select key={`select${slideNum}${compNum}`}>
                        {Object.values(components[compNum].data.options).map(
                            (element: any, index) => (
                                <option
                                    key={`option${index}${slideNum}${compNum}`}>
                                    {element.label}
                                </option>
                            )
                        )}
                    </select>
                );
            case "geogebra": {
                // TODO: fix counter and GeoGebra render
                const matID = components[compNum].config.materialId;
                const APIID = matID.concat("Id", count).toString();
                useEffect(() => {
                    const translateApplet = (
                        ggbName: string,
                        translatedText: {
                            english: { [x: string]: string };
                            spanish: { [x: string]: string };
                        },
                        matID: string,
                        count: any
                    ) => {
                        const ggbApplet = window[APIID as keyof Window];
                        const handleDefaultLanguage = () => {
                            if (
                                !ggbApplet.exists("defaultGGBLanguage") ||
                                ggbApplet.getValueString(
                                    "defaultGGBLanguage"
                                ) === ""
                            ) {
                                ggbApplet.evalCommand(
                                    'defaultGGBLanguage="Spanish"'
                                );
                            } else if (
                                ggbApplet.getValueString(
                                    "defaultGGBLanguage"
                                ) !== "Spanish"
                            ) {
                                ggbApplet.setTextValue(
                                    "defaultGGBLanguage",
                                    "Spanish"
                                );
                            }
                            ggbApplet.evalCommand(
                                "SetConditionToShowObject(defaultGGBLanguage,false)"
                            );
                        };
                        // updates alt text with specified language
                        const handleText = ({
                            translatedSpanishText,
                        }: {
                            translatedSpanishText: {
                                [x: string]: string;
                            };
                        }) => {
                            // handles minimum/maximum text, point labels, titles
                            const allItems = ggbApplet.getAllObjectNames();
                            const filteredArray = allItems.filter(
                                (el: string) => {
                                    return (
                                        Object.keys(
                                            translatedSpanishText
                                        ).includes(el) ||
                                        Object.keys(
                                            translatedSpanishText
                                        ).includes(el.concat("CaptionText"))
                                    );
                                }
                            );
                            filteredArray.forEach(function (el: string) {
                                const type = ggbApplet.getObjectType(el);
                                switch (type) {
                                    // if text
                                    case "text": {
                                        if (ggbApplet.isIndependent(el)) {
                                            ggbApplet.setTextValue(
                                                el,
                                                translatedSpanishText[el]
                                            );
                                        } else {
                                            if (el !== "escText") {
                                                ggbApplet.evalCommand(
                                                    el.concat(
                                                        "=",
                                                        translatedSpanishText[
                                                            el
                                                        ]
                                                    )
                                                );
                                            }
                                        }
                                        break;
                                    }
                                    case "list": {
                                        const listXML = ggbApplet.getXML(el);
                                        if (listXML.includes("comboBox")) {
                                            const string =
                                                translatedSpanishText[el];
                                            let xmlstring = ggbApplet.getXML();
                                            const parser = new DOMParser();
                                            const xmldom =
                                                parser.parseFromString(
                                                    xmlstring,
                                                    "application/xml"
                                                );

                                            // if there's a list, edit it
                                            const listNode =
                                                xmldom.querySelectorAll(
                                                    'comboBox[val="true"]'
                                                );
                                            listNode.forEach((element) => {
                                                if (element.parentElement) {
                                                    const parentName =
                                                        element.parentElement.getAttribute(
                                                            "label"
                                                        );
                                                    const value =
                                                        xmldom.querySelectorAll(
                                                            `expression[label=${parentName}]`
                                                        );
                                                    value.forEach((el) => {
                                                        el.setAttribute(
                                                            "exp",
                                                            string
                                                        );
                                                        const serializer =
                                                            new XMLSerializer();
                                                        const listString =
                                                            serializer.serializeToString(
                                                                el
                                                            );
                                                        ggbApplet.evalXML(
                                                            listString
                                                        );
                                                    });
                                                }
                                            });

                                            // if someone used SelectedElement instead of SelectedIndex, edit it
                                            const conditionsShowObject =
                                                xmldom.querySelectorAll(
                                                    `condition[showObject*="SelectedElement"]`
                                                );
                                            if (
                                                conditionsShowObject.length > 0
                                            ) {
                                                const matches = xmlstring.match(
                                                    /<condition showObject="SelectedElement\[.*\].*&quot;(.*)&quot;.*"/g
                                                );
                                                matches.forEach(
                                                    (
                                                        element: any,
                                                        index: number
                                                    ) => {
                                                        xmlstring =
                                                            xmlstring.replace(
                                                                element,
                                                                translatedSpanishText
                                                                    .conditions[
                                                                    index
                                                                ]
                                                            );
                                                    }
                                                );
                                            }
                                        }
                                        break;
                                    }
                                    default: {
                                        if (ggbApplet.getCaption(el) !== "") {
                                            ggbApplet.setCaption(
                                                el,
                                                translatedSpanishText[
                                                    el.concat("CaptionText")
                                                ]
                                            );
                                        }
                                        break;
                                    }
                                }
                            });
                            return true;
                        };
                        // take in globalJS again,
                        const handleGlobalJS = ({
                            globalJSData,
                            textHandled,
                            count,
                        }: {
                            globalJSData: any;
                            textHandled: boolean;
                            count: any;
                        }) => {
                            if (textHandled) {
                                const fullAppletJSON = ggbApplet.getFileJSON();
                                let archiveNum = -1;
                                const jsonArchive =
                                    ggbApplet.getFileJSON().archive;
                                const jsonKeysArray = Object.keys(jsonArchive);
                                jsonKeysArray.some(function (element) {
                                    if (
                                        jsonArchive[element].fileName ===
                                        "geogebra_javascript.js"
                                    ) {
                                        archiveNum = Number(element);
                                        return true;
                                    }
                                    return false;
                                });

                                fullAppletJSON.archive[archiveNum].fileContent =
                                    globalJSData[matID];
                                return fullAppletJSON;
                            }
                        };
                        const loadAppletLast = ({ fullAppletJSON }: any) => {
                            const apiID = matID.concat("Id", count);
                            // the material ID being d5mfqpx5 is REALLY IMPORTANT. If you use the applet's actual matID, you'll register keyup listeners twice. And not know why. And break everything trying to figure out why keyboard instructions don't work.  Save the effort - don't change this.
                            const params = {
                                material_id: "d5mfqpx5",
                                appName: "classic",
                                height: 650,
                                showToolBar: false,
                                showAlgebraInput: false,
                                showMenuBar: false,
                                enableRightClick: false,
                                language: "es",
                                id: apiID,
                                appletOnLoad(apiID: {
                                    setFileJSON: (arg0: any) => void;
                                }) {
                                    apiID.setFileJSON(fullAppletJSON);
                                },
                            };

                            // eslint-disable-next-line no-undef
                            const applet = new GGBApplet(params);
                            applet.inject(ggbName);
                        };
                        handleDefaultLanguage();
                        setTimeout(() => {
                            loadAppletLast({
                                fullAppletJSON: handleGlobalJS({
                                    globalJSData,
                                    textHandled: handleText({
                                        translatedSpanishText:
                                            translatedText.spanish,
                                    }),
                                    count,
                                }),
                            });
                        }, 1000);
                    };

                    //load the applet the first time to get data
                    const loadAppletFirst = () => {
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
                            id: APIID,
                            appletOnLoad() {
                                translateApplet(
                                    "ggb-element".concat(count, "-", matID),
                                    appletData[matID],
                                    matID,
                                    count
                                );
                            },
                        };
                        const applet = new GGBApplet(params, true);
                        applet.inject(
                            `ggb-element${count}-${components[compNum].config.materialId}`
                        );
                    };
                    loadAppletFirst();
                });
                return (
                    <div
                        className="container"
                        key={`ggb-container${count}-${components[compNum].config.materialId}`}>
                        <div
                            key={`ggb-element${count}-${components[compNum].config.materialId}`}
                            id={`ggb-element${count}-${components[compNum].config.materialId}`}></div>
                    </div>
                );
            }
            case "pdfviewer": {
                return (
                    <Fragment key={`pdfviewer${slideNum}${compNum}`}>
                        <p key={`pdf${slideNum}${compNum}`}>
                            This page contains a PDF with ID/Esta página
                            contiene un PDF con ID:
                            {components[compNum].data.id}.
                        </p>
                        <Link
                            key={`link${slideNum}${compNum}`}
                            href={components[compNum].data.downloadUrl}>
                            Link to PDF/Enlace al PDF
                        </Link>
                    </Fragment>
                );
            }
            case "complextable": {
                return (
                    <table key={`table${slideNum}${compNum}`}>
                        <tbody>
                            {Object.keys(components[compNum].data.rows).map(
                                (element, rowNum) => (
                                    <tr key={`${element}${rowNum}`}>
                                        {Object.keys(
                                            components[compNum].data.rows[
                                                rowNum
                                            ]
                                        ).map((el, colNum) => (
                                            <TableCell
                                                key={`${rowNum}${colNum}${components[compNum]._id}`}
                                                el={el}
                                                colNum={colNum}
                                                components={components}
                                                compNum={compNum}
                                                rowNum={rowNum}
                                            />
                                        ))}
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>
                );
            }
            case "image": {
                return (
                    <div key={`image${slideNum}${compNum}`}>
                        <figure>
                            <Image
                                alt={components[compNum].data.alt}
                                src={components[compNum].data.src}
                                title={components[compNum].data.title}
                                aria-label={components[compNum].data.ariaLabel}
                                width={300}
                                height={300}
                            />
                            {components[compNum].data.caption ? (
                                <caption>
                                    {components[compNum].data.caption}
                                </caption>
                            ) : null}
                        </figure>
                        <p>{components[compNum].copyright}</p>
                    </div>
                );
            }
            case "dropdown": {
                return (
                    <div key={`dropdown${slideNum}${compNum}`}>
                        <label>
                            {components[compNum].data.label}
                            <select>
                                {Object.values(
                                    components[compNum].data.listBox
                                ).map((element: any, index: number) => (
                                    <option key={`${element}${index}`}>
                                        {element.value}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <p>{components[compNum].data.placeholder}</p>
                    </div>
                );
            }
            case "categorization": {
                return (
                    <div key={`cat${slideNum}${compNum}`}>
                        <p>{"Categories/Categorías"}</p>
                        <ul>
                            {Object.values(
                                components[compNum].data.categories
                            ).map((element: any, index: number) => (
                                <option key={`${element}${index}`}>
                                    {element.label}
                                </option>
                            ))}
                        </ul>
                        <p>{"Items/Elementos"}</p>
                        <ul>
                            {Object.values(components[compNum].data.items).map(
                                (element: any, index: number) => (
                                    <option key={`${element}${index}`}>
                                        {element.label}
                                    </option>
                                )
                            )}
                        </ul>
                    </div>
                );
            }
            case "media": {
                return (
                    <Link
                        key={`videoLink${slideNum}${compNum}`}
                        href={components[compNum].config.src}>
                        Link to video/Enlace al video
                    </Link>
                );
            }
            case "input": {
                return (
                    <label key={`label${slideNum}${compNum}`}>
                        {components[compNum].data.label}
                        <input
                            key={`input${slideNum}${compNum}`}
                            aria-label={components[compNum].data.ariaLabel}
                            placeholder={
                                components[compNum].data.placeholder
                            }></input>
                    </label>
                );
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
                    `${components[compNum].type} on slide ${slideNum}`
                );
                return;
            }
            default:
                console.warn(
                    `Not yet optimized for ${components[compNum].type}`
                );
                break;
        }
    });
    return (
        <div key={`data${slideNum}`} id={`dataID-${slideNum}`}>
            {data}
        </div>
    );
};
export default SlideContent;
