import { Pipeline, Create } from '../src/index'

describe('Pipeline', () => {
  it('no pipeline operator', () => {
    let p = new Pipeline();// |> Create(['a', 'b', 'c']);
    p = Create(['a', 'b', 'c'])(p)
  
    expect(p.serialize()).toMatchSnapshot();
  });
  // it('with pipeline operator', () => {
  //   let p = new Pipeline() |> Create(['a', 'b', 'c']);
  //   console.log(p.build())
  
  //   expect(1 + 1).toEqual(2);
  // });
})
