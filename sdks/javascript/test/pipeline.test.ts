import { Pipeline, ParDo, DoFn, PTransform } from '../src/index'
import { PCollection } from '../src/pcollection';

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
    p.apply({ transform: new ParDo(new DoFn()), label: "custom label"});
    expect(p.serialize().toObject()).toMatchSnapshot();
  });
  it('with multiple subtransforms', () => {
    let p = new Pipeline();
    
    let pcoll = p.apply({ transform: new ParDo(new DoFn()), label: "A" });
    
      pcoll.apply({ transform: new ParDo(new DoFn()), label: "B-1"})
      .apply({ transform: new ParDo(new DoFn()), label: "C-1"});

      pcoll.apply({ transform: new ParDo(new DoFn()), label: "B-2"})
      .apply({ transform: new ParDo(new DoFn()), label: "C-2"});
    // console.error(pcoll.serialize().toObject());
    expect(p.serialize().toObject()).toMatchSnapshot();
  });

  it('with custom ptransform', () => {
    let p = new Pipeline();
        
    class CustomTransform extends PTransform {
      expand(pcoll: PCollection) {
        return pcoll.apply({ transform: new ParDo(new DoFn()), label: "nested subtransform 1"});
        // .apply({ transform: new ParDo(new DoFn()), label: "nested subtransform 2"});
      }
    }
    p.apply({ transform: new ParDo(new DoFn()), label: "test"});

      p.apply({ transform: new CustomTransform(), label: "custom transform" })

    // console.error(pcoll.serialize().toObject());
    expect(p.serialize().toObject()).toMatchSnapshot();
  });
  // it('with pipeline operator', () => {
  //   let p = new Pipeline() |> Create(['a', 'b', 'c']);
  //   console.log(p.build())
  
  //   expect(1 + 1).toEqual(2);
  // });
})
