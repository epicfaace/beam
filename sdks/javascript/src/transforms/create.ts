import {
  FunctionSpec,
  StandardPTransforms,
  ParDoPayload
} from '../../model/generated/beam_runner_api_pb'
import urns, { CUSTOM_JS_DOFN_URN } from '../../model/urns'
import { PTransform } from '../apache-beam'

/*
 * A transform that creates a PCollection from an iterable.
 * @extends PTransform
 */
export class Create extends PTransform {
  values: any[]
  constructor(values: any[], _options?: any) {
    super()
    this.values = values
  }

  _urn(): string {
    return urns[StandardPTransforms.Primitives.PAR_DO]
  }

  _payload(): string {
    const dofn = new FunctionSpec()
    dofn.setUrn(CUSTOM_JS_DOFN_URN)
    // dofn.setPayload()

    const payload = new ParDoPayload()
    payload.setDoFn(dofn)
  }
}
