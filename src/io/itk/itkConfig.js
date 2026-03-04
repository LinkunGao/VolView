const fullUrl = (relative) => {
  // Try to find the script tag that loaded VolView to determine the base URL
  try {
    const scriptUrl = document.currentScript.src;
    const basePath = scriptUrl.substring(0, scriptUrl.lastIndexOf('/'));
    return basePath + relative;
  } catch (e) {
    // Fallback if not determinable
    console.warn('Could not determine VolView UMD path, falling back to /volview', e);
    return window.location.origin + '/volview' + relative;
  }
};

const itkConfig = {
  pipelineWorkerUrl: fullUrl('/itk/itk-wasm-pipeline.min.worker.js'),
  imageIOUrl: fullUrl('/itk/image-io'),
  meshIOUrl: fullUrl('/itk/mesh-io'),
  pipelinesUrl: fullUrl('/itk/pipelines'),
};

export default itkConfig;
