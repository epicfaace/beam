export class PipelineContext {
  counter: number = 0;
  namespace: string = "ref";
  
  /**
   * Create a unique ref for use within a pipeline.
   */
  createUniqueRef(object: Object, label?: string) {
    this.counter++;
    return [this.namespace, object.constructor.name, label || object.constructor.name, this.counter].join("_");
  }
}