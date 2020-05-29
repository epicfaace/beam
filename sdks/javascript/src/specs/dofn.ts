import { FunctionSpec } from './function-spec'
import { CUSTOM_JS_DOFN_URN } from '../../model/urns'

export class DoFn extends FunctionSpec {
  constructor(_props?: any) {
    super()
    // TODO: allow passing in function here.
  }

  urn() {
    return CUSTOM_JS_DOFN_URN
  }

  payload() {
    // Call function by doing new Function("return " + this.toString())()(args)
    return this.toString()
  }

  process(): any {
    throw new Error('Needs to be implemented in subclasses')
  }

  // TODO: add setup, start_bundle, finish_bundle, teardown.
}
