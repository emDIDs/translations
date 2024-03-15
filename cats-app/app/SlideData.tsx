// "use client"
import SlideContent from "./SlideContent";
// import { useState } from "react";
type SlideDataProps = {
  workingJSON: any;
  workingKeys: string[];
};



const SlideData = ({ workingJSON,workingKeys }: SlideDataProps) => {
//   const [count, setCount] = useState(0);
//   const handleOnLoad = () => {
//     setCount(count + 1);
//   };
  const slideFilling = workingKeys.map((item: string, index: number) => (
    <div key={`${item}${index}`} className="separator">
      <h2>{`Slide/Diapositiva ${Number(index + 1)}`}</h2>
      {<SlideContent
          key={index}
          components={workingJSON.slides[index].contents}
        //   count={count}
          slideNum={workingJSON.slides[index].slideId}
        />
      }
    </div>
  ));
  return <section id="slide-data">{slideFilling}</section>;
};
export default SlideData;
