/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
