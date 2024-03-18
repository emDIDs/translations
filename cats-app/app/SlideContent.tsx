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
                console.log(matID.concat("Id", count));

                useEffect(() => {
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
                        id: matID.concat("Id"),
                    };

                    // eslint-disable-next-line no-undef
                    const applet = new GGBApplet(params, true);
                    applet.inject(
                        `ggb-element${count}-${components[compNum].config.materialId}`
                    );
                    console.warn(matID.concat("Id", count));
                    const translateApplet = (
                        ggbName: string,
                        translatedText: any,
                        englishReusedText: any,
                        spanishReusedText: any,
                        matID: string,
                        count: any
                    ) => {
                        // get data from textarea
                        console.warn(matID.concat("Id", count));
                        const ggbApplet =
                            window[matID.concat("Id", count) as keyof Window];
                        // if (
                        //     !ggbApplet.exists("defaultGGBLanguage") ||
                        //     ggbApplet.getValueString("defaultGGBLanguage") === ""
                        // ) {
                        //     ggbApplet.evalCommand('defaultGGBLanguage="Spanish"');
                        // } else if (
                        //     ggbApplet.getValueString("defaultGGBLanguage") !== "Spanish"
                        // ) {
                        //     ggbApplet.setTextValue("defaultGGBLanguage", "Spanish");
                        // }
                        // ggbApplet.evalCommand(
                        //     "SetConditionToShowObject(defaultGGBLanguage,false)"
                        // );

                        // // updates alt text with specified language
                        // function handleText(
                        //     englishReusedText: { [x: string]: any },
                        //     spanishReusedText: { [x: string]: any },
                        //     translatedText: { conditions: { [x: string]: any } },
                        //     count: any
                        // ) {
                        //     const ggbApplet = window[matID.concat("Id", count)];

                        //     const reusedKeysArray = Object.keys(reusedText.english);
                        //     reusedKeysArray.forEach((key) => {
                        //         englishReusedText[key] = reusedText.english[key];
                        //         spanishReusedText[key] = reusedText.spanish[key];
                        //     });
                        //     const spanishObject = spanishReusedText;
                        //     // handles minimum/maximum text, point labels, titles
                        //     const allItems = ggbApplet.getAllObjectNames();
                        //     const filteredArray = allItems.filter((el: string) => {
                        //         return (
                        //             Object.keys(spanishObject).includes(el) ||
                        //             Object.keys(spanishObject).includes(
                        //                 el.concat("CaptionText")
                        //             )
                        //         );
                        //     });
                        //     filteredArray.forEach(function (el: string) {
                        //         const type = ggbApplet.getObjectType(el);
                        //         switch (type) {
                        //             // if text
                        //             case "text": {
                        //                 if (ggbApplet.isIndependent(el)) {
                        //                     ggbApplet.setTextValue(el, spanishObject[el]);
                        //                 } else {
                        //                     if (el !== "escText") {
                        //                         ggbApplet.evalCommand(
                        //                             el.concat("=", spanishObject[el])
                        //                         );
                        //                     }
                        //                 }
                        //                 break;
                        //             }
                        //             case "list": {
                        //                 const listXML = ggbApplet.getXML(el);
                        //                 if (listXML.includes("comboBox")) {
                        //                     const string = spanishObject[el];
                        //                     let xmlstring = ggbApplet.getXML();
                        //                     const parser = new DOMParser();
                        //                     const xmldom = parser.parseFromString(
                        //                         xmlstring,
                        //                         "application/xml"
                        //                     );

                        //                     // if there's a list, edit it
                        //                     const listNode = xmldom.querySelectorAll(
                        //                         'comboBox[val="true"]'
                        //                     );
                        //                     listNode.forEach((element) => {
                        //                         const parentName =
                        //                             element.parentElement.getAttribute("label");
                        //                         const value = xmldom.querySelectorAll(
                        //                             `expression[label=${parentName}]`
                        //                         );
                        //                         value.forEach((el) => {
                        //                             el.setAttribute("exp", string);
                        //                             const serializer = new XMLSerializer();
                        //                             const listString =
                        //                                 serializer.serializeToString(el);
                        //                             ggbApplet.evalXML(listString);
                        //                         });
                        //                     });

                        //                     // if someone used SelectedElement instead of SelectedIndex, edit it
                        //                     const conditionsShowObject =
                        //                         xmldom.querySelectorAll(
                        //                             `condition[showObject*="SelectedElement"]`
                        //                         );
                        //                     if (conditionsShowObject.length > 0) {
                        //                         const matches = xmlstring.match(
                        //                             /<condition showObject="SelectedElement\[.*\].*&quot;(.*)&quot;.*"/g
                        //                         );
                        //                         matches.forEach(
                        //                             (element: any, index: string | number) => {
                        //                                 xmlstring = xmlstring.replace(
                        //                                     element,
                        //                                     translatedText.conditions[index]
                        //                                 );
                        //                             }
                        //                         );
                        //                     }
                        //                 }
                        //                 break;
                        //             }
                        //             default: {
                        //                 if (ggbApplet.getCaption(el) !== "") {
                        //                     ggbApplet.setCaption(
                        //                         el,
                        //                         spanishObject[el.concat("CaptionText")]
                        //                     );
                        //                 }
                        //                 break;
                        //             }
                        //         }
                        //     });
                        // }

                        // // take in globalJS again,
                        // function handleGlobalJS(
                        //     englishReusedText: any,
                        //     spanishReusedText: any,
                        //     count: any
                        // ) {
                        //     handleText(
                        //         englishReusedText,
                        //         spanishReusedText,
                        //         translatedText,
                        //         count
                        //     );

                        //     const ggbApplet = window[matID.concat("Id", count)];
                        //     const fullAppletJSON = ggbApplet.getFileJSON();

                        //     let archiveNum = -1;
                        //     const jsonArchive = ggbApplet.getFileJSON().archive;
                        //     const jsonKeysArray = Object.keys(jsonArchive);
                        //     jsonKeysArray.some(function (element) {
                        //         if (
                        //             jsonArchive[element].fileName === "geogebra_javascript.js"
                        //         ) {
                        //             archiveNum = Number(element);
                        //             return true;
                        //         }
                        //         return false;
                        //     });

                        //     fullAppletJSON.archive[archiveNum].fileContent =
                        //         globalJSData[matID];

                        //     function loadAppletLast() {
                        //         const apiID = matID.concat("Id", count);
                        //         // the material ID being d5mfqpx5 is REALLY IMPORTANT. If you use the applet's actual matID, you'll register keyup listeners twice. And not know why. And break everything trying to figure out why keyboard instructions don't work.  Save the effort - don't change this.
                        //         const params = {
                        //             material_id: "d5mfqpx5",
                        //             appName: "classic",
                        //             height: 650,
                        //             showToolBar: false,
                        //             showAlgebraInput: false,
                        //             showMenuBar: false,
                        //             enableRightClick: false,
                        //             language: "es",
                        //             id: apiID,
                        //             appletOnLoad(apiID: { setFileJSON: (arg0: any) => void }) {
                        //                 apiID.setFileJSON(fullAppletJSON);
                        //             },
                        //         };

                        //         // eslint-disable-next-line no-undef
                        //         const applet = new GGBApplet(params);
                        //         applet.inject(ggbName);
                        //     }

                        //     loadAppletLast();
                        // }

                        // handleGlobalJS(englishReusedText, spanishReusedText, count);
                    };
                    // if (
                    //     Object.keys(appletData).length !== 0 &&
                    //     Object.keys(globalJSData).length !== 0
                    // ) {
                    const appletJSON = appletData[matID];
                    const englishReusedText = appletJSON.english;
                    const spanishReusedText = appletJSON.spanish;

                    translateApplet(
                        "ggb-element".concat(count, "-", matID),
                        appletData[matID],
                        englishReusedText,
                        spanishReusedText,
                        matID,
                        count
                    );
                }, []);
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
