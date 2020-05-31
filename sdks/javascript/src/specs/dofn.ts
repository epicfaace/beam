import { FunctionSpec } from './function-spec'
import { CUSTOM_JS_DOFN_URN } from '../model/urns'

export class DoFn extends FunctionSpec {
  constructor(_props?: any) {
    super()
    // TODO: allow passing in function here.
  }

  _urn() {
    return CUSTOM_JS_DOFN_URN
  }

  _payload() {
    // Call function by doing new Function("return " + this.toString())()(args)
    return this.process.toString();
  }

  process(): any {
    throw new Error('Needs to be implemented in subclasses')
  }

  // TODO: add setup, start_bundle, finish_bundle, teardown.
}
