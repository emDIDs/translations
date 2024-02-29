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
                    id?: number;
                };
            };
        };
    };
}

interface HeaderDataProps {
    name: string;
    text: string;
    ariaLabel: string;
    placeholderText: string;
    caption: string;
    label: string;
    id: string;
    rowComplete: string;
}
