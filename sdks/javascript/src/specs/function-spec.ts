import { FunctionSpec as FunctionSpec_ } from '../../model/generated/beam_runner_api_pb'

/**
 * A base class for classes that can be serialized to
 * a FunctionSpec proto.
 */
export class FunctionSpec {
  constructor(_props?: any) {}

  /**
   * Get the URN of this object.
   * @return {string} The object's URN.
   */
  _urn(): string {
    throw new Error('Needs to be implemented in subclasses')
  }

  /**
   * Get the payload of this object.
   * @return {string} The object's payload.
   */
  _payload(): string {
    throw new Error('Needs to be implemented in subclasses')
  }

  /**
   * Serialize this object to a protobuf.
   * @return {FunctionSpec_} The generated protobuf.
   */
  serialize() {
    const spec = new FunctionSpec_()
    spec.setUrn(this._urn())
    spec.setPayload(this._payload())
    return spec
  }
}
