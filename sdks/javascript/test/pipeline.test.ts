import { Pipeline, ParDo, DoFn } from '../src/index'

describe('Pipeline', () => {
  // it('no pipeline operator', () => {
  //   let p = new Pipeline();// |> Create(['a', 'b', 'c']);
  //   p = Create(['a', 'b', 'c'])(p)
  
  //   expect(p.serialize()).toMatchSnapshot();
  // });
  it('empty pipeline with single root transform', () => {
    let p = new Pipeline();
    expect(p.serialize().toObject()).toMatchSnapshot();
  });
  it('pipeline with root + subtransforms', () => {
    let p = new Pipeline();
    p.apply(new ParDo(new DoFn()), "custom label");
    expect(p.serialize().toObject()).toMatchSnapshot();
  });
  // it('with pipeline operator', () => {
  //   let p = new Pipeline() |> Create(['a', 'b', 'c']);
  //   console.log(p.build())
  
  //   expect(1 + 1).toEqual(2);
  // });
})
