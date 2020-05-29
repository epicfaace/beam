import { FunctionSpec } from '../specs/function-spec'
import { CUSTOM_JS_TRANSFORM_URN } from '../../model/urns'

export class PTransform extends FunctionSpec {
  constructor(_props?: any) {
    super()
    // TODO: add label argument here.
  }

  _urn() {
    return CUSTOM_JS_TRANSFORM_URN
  }

  _payload() {
    return this.toString()
  }
}
