export { Pipeline } from './pipeline'
export { DoFn } from './specs/dofn'
import { Create_, ParDo_, PTransform_ } from './transforms'

// const x = 5 |> (x => x ** 2);
// console.error(x);

export const Create = Create_
export const ParDo = ParDo_
export const PTransform = PTransform_