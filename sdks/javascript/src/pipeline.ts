import {
  PTransform,
  Components,
  Pipeline as Pipeline_
} from '../model/generated/beam_runner_api_pb'

// TODO: support step names.
type Step = PTransform

export class Pipeline {
  /** Steps for this pipeline. */
  _steps: Step[] = []

  constructor(_props?: any) {
    // TODO: add pipelineoptions
    // TODO: CallableWrapperDOFn for map and flatmap
  }

  /**
   * Add a step to the pipeline.
   * @param {Step} Step.
   * @returns {Pipeline_} Serialized pipeline proto
   */
  pipe(step: Step) {
    this._steps.push(step)
    return this
  }

  /**
   * Serializes this pipeline to a runner api proto.
   * @returns {Pipeline_} Serialized pipeline proto
   */
  serialize() {
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

  /**
   * Clones this pipeline.
   * @returns {Pipeline} Cloned pipeline
   */
  clone() {
    const p = new Pipeline()
    p._steps = [...this._steps]
    return p
  }

  /**
   * Builds this pipeline.
   * @returns {object} Object representing serialized pipeline
   */
  build() {
    return this.serialize().toObject()
  }
}
