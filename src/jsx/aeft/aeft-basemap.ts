export function createBasemapComp() {
  app.beginUndoGroup("Create Empty Basemap Composition");

  try {
    var comp = app.project.items.addComp(
      "Empty Basemap_" + new Date().getTime(),
      1920, // width
      1080, // height
      1, // pixel aspect ratio
      10, // duration in seconds
      30  // frame rate
    );

    return "Empty basemap composition created successfully";
  } catch (error) {
    return "Error creating empty basemap composition: " + error;
  } finally {
    app.endUndoGroup();
  }
}
