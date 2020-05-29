import {
  FunctionSpec,
  StandardPTransforms,
  ParDoPayload
} from '../../model/generated/beam_runner_api_pb'
import urns, { CUSTOM_JS_DOFN_URN } from '../../model/urns'
import { PTransform, DoFn } from '../apache-beam'

export class ParDo extends PTransform {
  dofn: DoFn
  constructor(dofn: DoFn, _props?: any) {
    super(_props)
    this.dofn = dofn
    // TODO: allow passing in function here.
  }

  _urn(): string {
    return urns[StandardPTransforms.Primitives.PAR_DO]
  }

  _payload() {
    const payload = new ParDoPayload()
    payload.setDoFn(this.dofn.serialize())
    return payload.toString()
  }
}
