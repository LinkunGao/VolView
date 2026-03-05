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

// Configure itk-wasm to use assets from our plugin folder dynamically based on where the umd bundle is hosted
let basePath = '/volview'; // Fallback
try {
    const scriptUrl = document.currentScript ? (document.currentScript as HTMLScriptElement).src : '';
    if (scriptUrl) {
        basePath = scriptUrl.substring(0, scriptUrl.lastIndexOf('/'));
    }
} catch (e) {
    console.warn('Could not determine VolView UMD path, falling back to /volview', e);
}
// Export to window so Vite's async renderBuiltUrl hook can access it later when document.currentScript is null
(window as any).__VOLVIEW_BASE_PATH__ = basePath + '/';

setPipelinesBaseUrl(`${basePath}/itk/pipelines`);
setPipelineWorkerUrl(`${basePath}/itk/itk-wasm-pipeline.min.worker.js`);
imageIoSetPipelinesBaseUrl(`${basePath}/itk/image-io`);
dicomSetPipelinesBaseUrl(`${basePath}/itk/pipelines`);
mciSetPipelinesBaseUrl(`${basePath}/itk/pipelines`);

initItkWorker();

// Initialize global mapper topologies
vtkMapper.setResolveCoincidentTopologyToPolygonOffset();
vtkMapper.setResolveCoincidentTopologyPolygonOffsetParameters(-3, -3);
vtkMapper.setResolveCoincidentTopologyLineOffsetParameters(-3, -3);

registerAllReaders(FILE_READERS);

import App from './components/App.vue';
export default App;
