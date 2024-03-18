import Image from "next/image";
import Link from "next/link";
import TableCell from "./TableCell";
import { useEffect } from "react";

const SlideContent = ({ components, count, slideNum }: any) => {
    console.log(Object.keys(components));
    const data = Object.keys(components).map((_item, compNum) => {
        console.log(compNum, components);
        switch (components[compNum].type) {
            case "richtexteditor": {
                console.log(components[compNum].data.text);
                return (
                    <div
                        dangerouslySetInnerHTML={{
                            __html: components[compNum].data.text,
                        }}></div>
                );
            }
            case "textbox": {
                console.warn(
                    `Textbox found: ${components[compNum].name}. This lesson may not be fully remediated.`
                );
                return <p>{components[compNum].data.text}</p>;
            }
            case "button": {
                return <button>{components[compNum].data.text}</button>;
            }
            case "buttongroup":
                return Object.values(components[compNum].data.buttons).map(
                    (element: any, index) => (
                        <button key={index}>{element.text}</button>
                    )
                );
            case "select":
                return (
                    <select>
                        {Object.values(components[compNum].data.options).map(
                            (element: any, index) => (
                                <option key={index}>{element.label}</option>
                            )
                        )}
                    </select>
                );
            case "geogebra": {
                // TODO: fix counter and GeoGebra render
                // setCount(count+1);

                useEffect(() => {
                    // load geogebra here
                }, []);
                return (
                    <div className="container">
                        <div
                            id={`ggb-element${count}-${components[compNum].config.materialId}`}></div>
                    </div>
                );
            }
            case "pdfviewer": {
                return (
                    <>
                        <p>
                            This page contains a PDF with ID/Esta página
                            contiene un PDF con ID:
                            {components[compNum].data.id}.
                        </p>
                        <Link href={components[compNum].data.downloadUrl}>
                            Link to PDF/Enlace al PDF
                        </Link>
                    </>
                );
            }
            case "complextable": {
                return (
                    <table>
                        {Object.keys(components[compNum].data.rows).map(
                            (element, rowNum) => (
                                <tr key={`${element}${rowNum}`}>
                                    {Object.keys(
                                        components[compNum].data.rows[rowNum]
                                    ).map((el, colNum) => (
                                        <TableCell
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
                    </table>
                );
            }
            case "image": {
                return (
                    <>
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
                    </>
                );
            }
            case "dropdown": {
                return (
                    <>
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
                    </>
                );
            }
            case "categorization": {
                return (
                    <>
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
                    </>
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
    return <div>{data}</div>;
};
export default SlideContent;
