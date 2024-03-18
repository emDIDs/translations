
type GeoGebraProps = {
  translatedApplet: any;
  translatedGlobalJS: any;
}

const GeoGebraLoader = ({ translatedApplet, translatedGlobalJS }: GeoGebraProps) => {
 
    return (
        <div>
            if(Object.keys(translatedApplet).length !== 0
            &&Object.keys(translatedGlobalJS).length !== 0)
            {
                
            }
            else{null}
        </div>
    );
};

export default GeoGebraLoader;
