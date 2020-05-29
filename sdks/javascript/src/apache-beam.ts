// Import here Polyfills if needed. Recommended core-js (npm i -D core-js)
// import "core-js/fn/array.find"
// ...
import {
  PTransform,
  Components,
  Pipeline as Pipeline_
} from '../model/generated/beam_runner_api_pb'
export class Pipeline {
  constructor(_props?: any) {
    // TODO: add pipelineoptions
  }

  build() {
    const pipeline = new Pipeline_()
    const transform = new PTransform()
    transform.setUniqueName('unique name 1')

    const components = new Components()
    components.getTransformsMap().set('t', transform)
    pipeline.setComponents(components)
    return pipeline.toObject()
  }
}
