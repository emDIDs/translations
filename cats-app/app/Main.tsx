"use client";
import Downloader from "./Downloader";
import FilePicker from "./FilePicker";
import SlideData from "./SlideData";
import translatedSlides from "../public/Slides - An Experiment with Ratios and Rates_SPA.json";


import { useState } from "react";
const workingJSON = JSON.parse(JSON.stringify(translatedSlides));
const workingKeys = Object.keys(workingJSON.slides);
const handleOnClick = () => {
    console.log("worry about GeoGebra first, then this click listener");
};
const Main = () => {
    const [submitted, setSubmitted] = useState(false);
    const [itemData, setItemData] = useState({});
    return (
        <div>
            <fieldset>
                <Downloader />
                <div className="grouper">
                    <a target="_blank" id="downloadJSON-link"></a>
                    <div id="ggb-element"></div>
                    <FilePicker
                        passSetSubmitted={setSubmitted}
                        passSetItemData={setItemData}
                    />
                </div>
                <div className="grouper">
                    <button
                        id="translate"
                        className="external-button"
                        onClick={handleOnClick}>
                        Translate to Spanish
                    </button>
                    <button
                        id="download"
                        className="external-button"
                        onClick={handleOnClick}>
                        Download Spanish Applets
                    </button>
                </div>
            </fieldset>
            <SlideData workingJSON={workingJSON} workingKeys={workingKeys} />
        </div>
    );
};
export default Main;
