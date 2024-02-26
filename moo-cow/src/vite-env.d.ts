/// <reference types="vite/client" />
interface SlideObjectProps {
    [key: string]: {
        contents: {
            [key: string]: {
                name: string;
                data: {
                    text: string;
                    ariaLabel: string;
                    placeholderText?: string;
                    caption?: string;
                    label?: string;
                };
            };
        };
    };
}

interface HeaderDataProps {
    text: string;
    ariaLabel: string;
    placeholderText: string;
    caption: string;
    label: string;
    rowComplete: string;
}
