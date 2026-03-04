const fullUrl = (relative) => {
  // Always resolve to the /volview folder explicitly since our UMD is hosted there
  const u = new URL(document.location);
  return u.origin + '/volview' + relative;
};

const itkConfig = {
  pipelineWorkerUrl: fullUrl('/itk/itk-wasm-pipeline.min.worker.js'),
  imageIOUrl: fullUrl('/itk/image-io'),
  meshIOUrl: fullUrl('/itk/mesh-io'),
  pipelinesUrl: fullUrl('/itk/pipelines'),
};

export default itkConfig;
