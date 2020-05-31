import { Pipeline, ParDo, DoFn } from '../src/index'

describe('Pipeline', () => {
  // it('no pipeline operator', () => {
  //   let p = new Pipeline();// |> Create(['a', 'b', 'c']);
  //   p = Create(['a', 'b', 'c'])(p)
  
  //   expect(p.serialize()).toMatchSnapshot();
  // });
  it('empty with single root transform', () => {
    let p = new Pipeline();
    expect(p.serialize().toObject()).toMatchSnapshot();
  });
  it('with one transform', () => {
    let p = new Pipeline();
    p.apply(new ParDo(new DoFn()), "custom label");
    expect(p.serialize().toObject()).toMatchSnapshot();
  });
  it('with multiple subtransforms', () => {
    let p = new Pipeline()
      .apply(new ParDo(new DoFn()), "A");
    
    p.apply(new ParDo(new DoFn()), "B-1")
      .apply(new ParDo(new DoFn()), "C-1");

    p.apply(new ParDo(new DoFn()), "B-2")
      .apply(new ParDo(new DoFn()), "C-2");
    expect(p.serialize().toObject()).toMatchSnapshot();
  });
  // it('with pipeline operator', () => {
  //   let p = new Pipeline() |> Create(['a', 'b', 'c']);
  //   console.log(p.build())
  
  //   expect(1 + 1).toEqual(2);
  // });
})
