export { Pipeline } from '../pipeline'
export { ParDo } from './pardo'
export { PTransform } from './ptransform'
export { Create } from './create'

// type PipelineArgs = any[]
// // type PipelineFn = (p: Pipeline) => (...args: PipelineArgs) => Pipeline;

// const pipelineify = (Cls: new (...args: PipelineArgs) => any) => (...args: PipelineArgs) => (
//   p: Pipeline
// ) => {
//   const cls = new Cls(...args)
//   return p.clone().pipe(cls)
// }

// export const PTransform_ = pipelineify(PTransform)
// export const ParDo_ = pipelineify(ParDo)
// export const Create_ = pipelineify(Create)
