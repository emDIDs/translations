/// <reference types="vite/client" />
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
interface SlideObjectProps {
    [key: string]: {
        contents: ContentObjectProps;
        code: string;
    };
}
interface ContentObjectProps {
    contents: {
        [key: string]: ComponentProps;
    };
}
interface ComponentProps {
    name: string;
    type: string;
    data?: ComponentDataProps;
    config?: ComponentConfigProps;
}
interface ComponentDataProps {
    text: string;
    ariaLabel: string;
    alt?: string;
    placeholder?: string;
    copyright?: string;
    src?: string;
    caption?: string;
    label?: string;
    title?: string;
    downloadUrl?: string;
    id?: number;
    config?: { workflowId: string };
    options?: [
        {
            [key: string]: { label: string };
        },
    ];
    buttons?: [
        {
            [key: string]: { text: string };
        },
    ];
    columns?: [
        {
            [key: string]: {
                value: string;
                ariaLabel: string;
            };
        },
    ];
    rows?: [
        {
            [key: string]: {
                [key: string]: {
                    value: string;
                    ariaLabel: string;
                };
            };
        },
    ];
    categories?: [
        {
            [key: string]: { value: string };
        },
    ];
    items?: [
        {
            [key: string]: { value: string };
        },
    ];
}
interface ComponentConfigProps {
    alt?: string;
    src?: string;
    materialId?: string;
}
