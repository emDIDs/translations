const FilePicker = (props) => {
    const handleFilePicker = (event: React.ChangeEvent<HTMLInputElement>) => {
        const uploadedFiles = event.currentTarget.files;
        if (uploadedFiles) {
            for (const singleFile of uploadedFiles) {
                const reader = new FileReader();

                const showFile = (file: ProgressEvent) => {
                    const fileNameLI = document.createElement("li");
                    fileNameLI.innerHTML = singleFile.name;
                    // pastedJSON.appendChild(fileNameLI);
                    if (singleFile.name.includes("Slides") && file.target) {
                        // I can see result.  Why can't I find something of this form in typescript???
                        const translatedSlides = file.target.result;
                        const translatedObject = JSON.parse(translatedSlides);
                        console.log(
                            "TranslatedObject",
                            translatedObject.slides
                        );
                        props.passSetSubmitted(true);
                        props.passSetItemData(translatedObject.slides);
                    } else {
                        alert("Oops, wrong file. Try again please.");
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
