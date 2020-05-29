import { Pipeline, Create } from '../src/apache-beam'

/**
 * Dummy test
 */
describe('Pipeline test', () => {
  // let p = new Pipeline()
  // // console.error(Pipeline);
  // // ParDo(DoFn())(Create([1, 2, 3])(p));
  // p = Create([1, 2, 3])(p)

  // console.error(p.build())

  // let x = urns[StandardPTransforms.Primitives.PAR_DO]
  // console.error(x)

  // expect(1 + 1).toEqual(2)

  let p = new Pipeline()
  p = Create(['a', 'b', 'c'])(p)
  console.log(p.build())
})
