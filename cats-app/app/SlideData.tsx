"use client";
import SlideContent from "./SlideContent";
import { useState } from "react";
type SlideDataProps = {
    workingJSON: any;
    workingKeys: string[];
    appletData: any;
    globalJSData: any;
};
// TODO: Fix count and translation
const SlideData = ({
    workingJSON,
    workingKeys,
    appletData,
    globalJSData,
}: SlideDataProps) => {
    const [count, setCount] = useState(0);
    const handleOnLoad = () => {
        setCount(count + 1);
    };
    const slideFilling = workingKeys.map((item: string, index: number) => (
        <div key={`${item}${index}`} className="separator">
            <h2>{`Slide/Diapositiva ${Number(index + 1)}`}</h2>
            {
                <SlideContent
                    key={index}
                    count={count}
                    components={workingJSON[index].contents}
                    slideNum={workingJSON[index].slideId}
                    appletData={appletData}
                    globalJSData={globalJSData}
                />
            }
        </div>
    ));
    return <section id="slide-data">{slideFilling}</section>;
};
export default SlideData;
