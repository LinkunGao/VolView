import '@kitware/vtk.js/Rendering/OpenGL/Profiles/Geometry';
import '@kitware/vtk.js/Rendering/OpenGL/Profiles/Volume';
import '@kitware/vtk.js/Rendering/OpenGL/Profiles/Glyph';

import vtkMapper from '@kitware/vtk.js/Rendering/Core/Mapper';
import { setPipelinesBaseUrl, setPipelineWorkerUrl } from 'itk-wasm';
import { setPipelinesBaseUrl as imageIoSetPipelinesBaseUrl } from '@itk-wasm/image-io';
import { setPipelinesBaseUrl as dicomSetPipelinesBaseUrl } from '@itk-wasm/dicom';
import { setPipelinesBaseUrl as mciSetPipelinesBaseUrl } from '@itk-wasm/morphological-contour-interpolation';

import { FILE_READERS } from './io';
import { registerAllReaders } from './io/readers';
import { patchExitPointerLock } from './utils/hacks';
import { initItkWorker } from './io/itk/worker';

patchExitPointerLock();

// Configure itk-wasm to use assets from our plugin folder
setPipelinesBaseUrl('/volview/itk/pipelines');
setPipelineWorkerUrl('/volview/itk/itk-wasm-pipeline.min.worker.js');
imageIoSetPipelinesBaseUrl('/volview/itk/image-io');
dicomSetPipelinesBaseUrl('/volview/itk/pipelines');
mciSetPipelinesBaseUrl('/volview/itk/pipelines');

initItkWorker();

// Initialize global mapper topologies
vtkMapper.setResolveCoincidentTopologyToPolygonOffset();
vtkMapper.setResolveCoincidentTopologyPolygonOffsetParameters(-3, -3);
vtkMapper.setResolveCoincidentTopologyLineOffsetParameters(-3, -3);

registerAllReaders(FILE_READERS);

import App from './components/App.vue';
export default App;
