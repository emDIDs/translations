import Image from "next/image";
import Link from "next/link";

const SlideContent = ({ components, count, slideNum }: any) => {
  for (const compNum of Object.keys(components)) {
    switch (components[compNum].type) {
      case "richtexteditor": {
        return (
          <div
            dangerouslySetInnerHTML={{ __html: components[compNum].data.text }}
          ></div>
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
          (element: any, index) => <button key={index}>{element.text}</button>
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
        return (
          <div className="container">
            <div
              id={`ggb-element${count}-${components[compNum].config.materialId}`}
            >
              {/* { 
               (Object.keys(translatedApplet).length !== 0 &&Object.keys(translatedGlobalJS).length !== 0?
                   await pauseForTranslation(
                                  "ggb-element".concat(count, "-", materialID),
                                  translatedApplet[materialID],
                                  englishReusedText:JSON.parse(translatedApplet[materialID]).english,
                                  spanishReusedText:JSON.parse(translatedApplet[materialID]).spanish,
                                  materialID,
                                  count
                                ):null
                    } */}
            </div>
          </div>
        );
      }
      case "pdfviewer": {
        return (
          <>
            <p>
              `This page contains a PDF with ID/Esta página contiene un PDF con
              ID: ${components[compNum].data.id}.`
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
                  {Object.keys(components[compNum].data.rows[rowNum]).map(
                    (el, colNum) =>
                      components[compNum].data.rows[rowNum][colNum].scope ? (
                        <td
                          aria-label={
                            components[compNum].data.rows[rowNum][colNum]
                              .ariaLabel
                          }
                          key={`${el}${colNum}`}
                        >
                          {components[compNum].data.rows[rowNum][colNum].value}
                        </td>
                      ) : (
                        <th
                          aria-label={
                            components[compNum].data.rows[rowNum][colNum]
                              .ariaLabel
                          }
                          key={`${el}${colNum}`}
                        >
                          {components[compNum].data.rows[rowNum][colNum].value}
                        </th>
                      )
                  )}
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
                <caption>{components[compNum].data.caption}</caption>
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
                {Object.values(components[compNum].data.listBox).map(
                  (element: any, index: number) => (
                    <option key={`${element}${index}`}>{element.value}</option>
                  )
                )}
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
              {Object.values(components[compNum].data.categories).map(
                (element: any, index: number) => (
                  <option key={`${element}${index}`}>{element.label}</option>
                )
              )}
            </ul>
            <p>{"Items/Elementos"}</p>
            <ul>
              {Object.values(components[compNum].data.items).map(
                (element: any, index: number) => (
                  <option key={`${element}${index}`}>{element.label}</option>
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
        console.error(`${components[compNum].type} on slide ${slideNum}`);
        return;
      }
      default:
        console.warn(`Not yet optimized for ${components[compNum].type}`);
        break;
    }
  }

  return <div>SlideContent</div>;
};
export default SlideContent;
