import {
  PTransform,
  Components,
  Pipeline as Pipeline_
} from '../model/generated/beam_runner_api_pb'

export class Pipeline {
  constructor(_props?: any) {
    // TODO: add pipelineoptions
    // TODO: CallableWrapperDOFn for map and flatmap
  }

  _serialize() {
    const pipeline = new Pipeline_()
    const transform = new PTransform()
    transform.setUniqueName('unique name 1')

    const components = new Components()
    components.getTransformsMap().set('t', transform)
    pipeline.setComponents(components)
    const id = String(Math.random())
    pipeline.setRootTransformIdsList([id])

    // StandardPTransforms.Primitives.MAP_WINDOWS
    return pipeline
  }

  build() {
    return this._serialize().toObject()
  }
}
