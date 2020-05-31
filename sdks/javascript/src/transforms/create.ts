import { PTransform } from './ptransform'

/*
 * A transform that creates a PCollection from an iterable.
 * @extends PTransform
 */
export class Create extends PTransform {
  values: any[]
  constructor(values: any[], _options?: any) {
    super();
    this.values = values
  }

  label() {
    return "Create";
  }
}
