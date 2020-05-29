import { StandardPTransforms } from "./generated/beam_runner_api_pb";

// We need this because js protobuf does not give us a way to access beam_urn by default.

export default {
  [StandardPTransforms.Primitives.PAR_DO]: "beam:transform:pardo:v1",
  [StandardPTransforms.Composites.RESHUFFLE]: "beam:transform:reshuffle:v1",
};

export const CUSTOM_JS_DOFN_URN = "beam:transform:js:v1";