// ExtendScript functions

/**
 * Writes data to a file.
 * @param filePath The path where the file should be saved.
 * @param data The data to write to the file.
 * @returns A string indicating success or failure.
 */
export function writeFile(filePath: string, data: number[]): string {
    try {
        var file = new File(filePath);
        file.encoding = "BINARY";
        file.open("w");
        file.write(Array.prototype.slice.call(data));
        file.close();
        
        // Display success message
        alert("File successfully written to:\n" + filePath);
        
        return filePath;  // Return the file path on success
    } catch (error) {
        return "Error saving file: " + (error as Error).toString();
    }
}

export function createBasemapComp(imagePath: string) {
  app.beginUndoGroup("Create Basemap Composition");

  try {
    // Add a new composition
    var comp = app.project.items.addComp(
      "Basemap_" + new Date().getTime(),
      1920, // width
      1080, // height
      1, // pixel aspect ratio
      10, // duration in seconds
      30  // frame rate
    );

    // Import the image file using the provided path
    var importOptions = new ImportOptions(File(imagePath));
    var importedFile = app.project.importFile(importOptions);

    // Add the imported image to the composition as a layer
    if (importedFile instanceof FootageItem) {
      comp.layers.add(importedFile);
    } else {
      throw new Error("Imported file is not a valid FootageItem");
    }

    return "Basemap composition created successfully";
  } catch (error) {
    return "Error creating basemap composition: " + error;
  } finally {
    app.endUndoGroup();
  }
}


