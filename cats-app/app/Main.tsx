import Downloader from "./Downloader";
import FilePicker from "./FilePicker";
import SlideData from "./SlideData";
import translatedSlides from "../public/Slides - An Experiment with Ratios and Rates_SPA.json"
const workingJSON = JSON.parse(JSON.stringify(translatedSlides));
const workingKeys = Object.keys(workingJSON.slides);

const Main = () => {
  return (
    <div>
      <fieldset>
        <Downloader />
        <div className="grouper">
          <a target="_blank" id="downloadJSON-link"></a>
          <div id="ggb-element"></div>
          {/* <FilePicker /> */}
        </div>
        <div className="grouper">
          <button id="translate" className="external-button">
            Translate to Spanish
          </button>
          <button id="download" className="external-button">
            Download Spanish Applets
          </button>
        </div>
      </fieldset>
      <SlideData workingJSON={workingJSON} workingKeys={workingKeys}/>
    </div>
  );
};
export default Main;
