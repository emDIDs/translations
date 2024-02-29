interface FilePickerProps {
    passSetItemData: React.Dispatch<React.SetStateAction<string>>;
    passSetSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
}

const FilePicker = ({ passSetItemData, passSetSubmitted }: FilePickerProps) => {
    const handleFilePicker = (event: React.ChangeEvent<HTMLInputElement>) => {
        const uploadedFiles = event.currentTarget.files;
        let alertBypass = false;
        if (uploadedFiles) {
            for (const singleFile of uploadedFiles) {
                const reader = new FileReader();
                const showFile = (file: ProgressEvent<FileReader>) => {
                    const fileNameLI = document.createElement("li");
                    fileNameLI.innerHTML = singleFile.name;
                    if (singleFile.name.includes("Slides") && file.target) {
                        // I can see result.  Why can't I find something of this form in typescript???
                        const translatedSlides = file.target.result;
                        if (typeof translatedSlides === "string") {
                            const translatedObject =
                                JSON.parse(translatedSlides);
                            console.log(
                                "TranslatedObject",
                                translatedObject.slides
                            );
                            passSetSubmitted(true);
                            passSetItemData(translatedObject.slides);
                        }
                    } else {
                        if (!alertBypass) {
                            alert(
                                'Oops, you included some incorrect files. Please only use "Slides" files.'
                            );
                        }
                        alertBypass = true;
                        return;
                    }
                };

                const handleLoadedFile = (singleFile: File) => {
                    console.log(singleFile);
                    return showFile;
                };
                reader.onload = handleLoadedFile(singleFile);
                reader.readAsText(singleFile);
            }
        }
    };

    return (
        <div>
            <label htmlFor="upload">
                Choose all lesson files. You can use shift or CTRL to select
                multiple files at once.
            </label>
            <input
                id="upload"
                type="file"
                accept="text/JSON"
                name="upload"
                size={30}
                multiple
                onChange={handleFilePicker}
            />
            <ul id="json-object"></ul>
        </div>
    );
};

export default FilePicker;
