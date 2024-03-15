/* eslint-disable @typescript-eslint/no-unused-vars */
//  * text - give alert
interface TextProps {
    name: string;
    type: string;
    data: {
        ariaLabel: string;
        text: string;
    };
}
//  * button
interface ButtonProps {
    name: string;
    type: string;
    data: {
        ariaLabel: string;
        text: string;
    };
}
//  * rich text editor - give alert if ariaLabel
interface RTEProps {
    name: string;
    type: string;
    data: {
        ariaLabel: string;
        text: string;
    };
}
//  * input
interface InputProps {
    name: string;
    type: string;
    data: {
        ariaLabel: string;
        label: string;
        placeholder: string;
        text: string;
    };
}
//  * image
interface ImageProps {
    name: string;
    type: string;
    data: {
        ariaLabel: string;
        alt: string;
        caption: string;
        copyright: string;
        src: string;
        config: { workflowId: string };
        title: string;
    };
}
//  * geogebra - give alert if ariaLabel
interface GeoGebraProps {
    name: string;
    type: string;
    data: {
        ariaLabel: string;
    };
    config: {
        materialId: string;
    };
}
//  * media
interface MediaProps {
    name: string;
    type: string;
    config: {
        alt: string;
        src: string;
    };
    data: {
        ariaLabel: string;
    };
}
//  * pdf
interface PDFProps {
    name: string;
    type: string;
    data: {
        ariaLabel: string;
        downloadUrl: string;
        id: number;
    };
}
//  * select - not too sure about this one
interface SelectProps {
    name: string;
    type: string;
    data: {
        ariaLabel: string;
        options: [
            {
                [key: string]: { label: string };
            },
        ];
    };
}

//  * button group - not too sure about this one
interface ButtonGroupProps {
    name: string;
    type: string;
    data: {
        ariaLabel: string;
        buttons: [
            {
                [key: string]: { text: string };
            },
        ];
    };
}
//  * table - give alert
interface TableProps {
    name: string;
    type: string;
    data: {
        ariaLabel: string;
        caption: string;
        columns: [
            {
                [key: string]: {
                    value: string;
                    ariaLabel: string;
                };
            },
        ];
        rows: [
            {
                [key: string]: {
                    [key: string]: {
                        value: string;
                        ariaLabel: string;
                    };
                };
            },
        ];
    };
}
//  * complex table - not too sure about this one
interface ComplexTableProps {
    name: string;
    type: string;
    data: {
        ariaLabel: string;
        caption: string;
        rows: [
            {
                [key: string]: {
                    [key: string]: {
                        value: string;
                        ariaLabel: string;
                    };
                };
            },
        ];
    };
}
//  * categorizing - not too sure about this one
interface CategorizingProps {
    name: string;
    type: string;
    data: {
        ariaLabel: string;
        categories: [
            {
                [key: string]: { value: string };
            },
        ];
        items: [
            {
                [key: string]: { value: string };
            },
        ];
    };
}

//  * carousel - give warning but don't build
//  * collage - give warning but don't build
//  * dropdown - give warning but don't build
