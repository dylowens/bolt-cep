export function captureCompositionPreview() {
    try {
        var activeComp = app.project.activeItem;
        
        if (!(activeComp instanceof CompItem)) {
            return JSON.stringify({ error: "No active composition" });
        }

        var scaleFactor = 0.5; // Adjust this to change the preview size
        var captureWidth = Math.round(activeComp.width * scaleFactor);
        var captureHeight = Math.round(activeComp.height * scaleFactor);

        // Create a new composition for the snapshot
        var snapshotComp = app.project.items.addComp("Snapshot", captureWidth, captureHeight, activeComp.pixelAspect, activeComp.duration, activeComp.frameRate);

        // Copy all layers from the active composition to the snapshot composition
        for (var i = 1; i <= activeComp.numLayers; i++) {
            activeComp.layer(i).copyToComp(snapshotComp);
        }

        // Render the snapshot composition
        var renderItem = app.project.renderQueue.items.add(snapshotComp);
        var outputModule = renderItem.outputModule(1);

        // Set output to PNG
        outputModule.applyTemplate("PNG Sequence");
        var tempFile = new File(Folder.temp.fsName + "/snapshot.png");
        outputModule.file = tempFile;

        app.project.renderQueue.render();

        // Read the file and convert to base64
        tempFile.open('r');
        tempFile.encoding = "BINARY";
        var binaryString = tempFile.read();
        tempFile.close();

        var base64Image = btoa(binaryString);

        // Clean up
        tempFile.remove();
        snapshotComp.remove();

        return JSON.stringify({
            success: true,
            image: base64Image,
            width: captureWidth,
            height: captureHeight
        });
    } catch (error: unknown) { // Specify the type of error
        return JSON.stringify({ error: String(error) }); // Convert to string
    }
}