import Header from "./Header";
import Main from "./Main";
import Script from "next/script";

export default function Home() {
    return (
        <div id="full-contents">
            <Script
                type="text/javascript"
                id="geogebra-loader"
                async
                defer
                src="https://www.geogebra.org/apps/deployggb.js"
            />
            <Header />
            <Main />
        </div>
    );
}
