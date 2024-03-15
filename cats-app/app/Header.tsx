import Image from "next/image";
import Cat from "../public/Great Minds Cat.jpg";

const Header = () => {
    return (
        <header>
            <Image
                src={Cat}
                alt="Cat face in Great Minds logo"
                width={"100"}
                height={"75"}
            />
            <h1>Cognito Authoring Translation System</h1>
        </header>
    );
};
export default Header;
