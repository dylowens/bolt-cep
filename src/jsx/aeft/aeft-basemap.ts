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
