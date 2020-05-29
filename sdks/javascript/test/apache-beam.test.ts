import { Pipeline } from '../src/apache-beam'
import { StandardPTransforms } from '../model/generated/beam_runner_api_pb'
import urns from '../model/urns'

/**
 * Dummy test
 */
describe('Pipeline test', () => {
  let p = new Pipeline()
  // console.error(Pipeline);
  // ParDo(DoFn())(Create([1, 2, 3])(p));
  p = Create([1, 2, 3])(p)

  console.error(p.build())

  let x = urns[StandardPTransforms.Primitives.PAR_DO]
  console.error(x)

  expect(1 + 1).toEqual(2)
})
