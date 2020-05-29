import { FunctionSpec } from '../../model/generated/beam_runner_api_pb'
import { CUSTOM_JS_DOFN_URN } from '../../model/urns'

export class DoFn {
  constructor(_props?: any) {
    super(_props)
    // TODO: allow passing in function here.
  }

  process(): any {
    throw new Error('Needs to be implemented in subclasses')
  }

  // TODO: add setup, start_bundle, finish_bundle, teardown.

  serialize() {
    const spec = new FunctionSpec()
    spec.setUrn(CUSTOM_JS_DOFN_URN)
    spec.setPayload(this.toString())
    return spec
  }
}
