import { FunctionSpec } from '../specs/function-spec'
import { CUSTOM_JS_TRANSFORM_URN } from '../model/urns'
import { Pipeline, PValueish } from '../pipeline'
import { PValue } from '../pcollection/pvalue'

export class PTransform extends FunctionSpec {
  constructor(_props?: any) {
    super()
    // TODO: add label argument here.
  }

  _urn() {
    return CUSTOM_JS_TRANSFORM_URN
  }

  _payload() {
    // TODO: use a custom protobuf format
    return this.expand.toString();
  }

  label() {
    throw new Error("Must be implemented by subclasses");
  }

  expand(_input: PValue): PValue {
    throw new Error("Must be implemented by subclasses");
  }

  /**
   * Extract all the pvalues contained in the input pvalueish.

    Returns pvalueish as well as the flat inputs list as the input may have to
    be copied as inspection may be destructive.

    By default, recursively extracts tuple components and dict values.

    Generally only needs to be overriden for multi-input PTransforms.
  */
  extractInputPValues(pvalueish?: PValueish): PValue[] {
    if (!pvalueish) {
      return [];
    }
    if (pvalueish instanceof Pipeline) {
      return []; // TODO: PBegin?
    }
    const isIterable = (object: any) => object != null && typeof object[Symbol.iterator] === 'function';
    const dictTupleLeaves = (pvalueish: any): any => {
      if (isIterable(pvalueish)) {
        return pvalueish.map((e: any) => dictTupleLeaves(e));
      }
      if (pvalueish.constructor == Object) {
        return dictTupleLeaves(Object.values(pvalueish));
      }
      return pvalueish;
    }
    return dictTupleLeaves(pvalueish);
  }
}
