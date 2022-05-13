function stringifyPropertyName(name: string | typeof Instance): string {
  if (typeof name == "string") {
    return name;
  }
  return name.name;
}

export default class Instance {
  private static _INSTANCE_ID = 0;
  private _instance_id: number;

  constructor() {
    this._instance_id = ++Instance._INSTANCE_ID;
    InstanceResolver.track(this);
  }

  get instanceId() {
    return `${this.constructor.name}-${this._instance_id}`;
  }

  protected addRelation(relation: {
    prop: string | typeof Instance;
    instance: Instance;
    backProp?: string | typeof Instance;
  }) {
    InstanceResolver.buildRelation(
      this,
      stringifyPropertyName(relation.prop),
      relation.instance
    );
    if (relation.backProp) {
      InstanceResolver.buildRelation(
        relation.instance,
        stringifyPropertyName(relation.backProp),
        this
      );
    }
    return this;
  }

  protected getRelated<T extends Instance>(property: string | typeof Instance) {
    return InstanceResolver.getInstanceByRelation<T>(
      this,
      stringifyPropertyName(property)
    );
  }

  protected getTrackedRelated<T extends Instance>(
    property: string | typeof Instance
  ): T {
    const instance = this.getRelated<T>(property);
    if (instance == undefined) {
      throw new Error(
        `The related instance with instance \`${this.constructor.name}\`(id:${this._instance_id}) and property \`${property}\` is \`undefined\`.`
      );
    }
    return instance;
  }
}

class InstanceResolver {
  private static _instances: Record<string, Instance> = {};
  private static _relations: Record<string, Record<string, string>> = {};

  static track(instance: Instance) {
    console.log("track instance: ", instance.instanceId);
    InstanceResolver._instances[instance.instanceId] = instance;
  }

  static buildRelation(instance: Instance, property: string, member: Instance) {
    console.log(
      "build relation:",
      instance.constructor.name,
      property,
      member.constructor.name
    );
    let relations = InstanceResolver._relations[instance.instanceId];
    if (!relations) {
      relations = {};
      InstanceResolver._relations[instance.instanceId] = relations;
    }
    relations[property] = member.instanceId;
  }

  static getInstanceByRelation<T extends Instance>(
    instance: Instance,
    property: string
  ): T | undefined {
    const relations = InstanceResolver._relations[instance.instanceId];
    if (!relations) {
      return undefined;
    }
    const instanceId = relations[property];
    if (!instanceId) {
      return undefined;
    }
    const member = InstanceResolver._instances[instanceId];
    return member == undefined ? undefined : (member as T);
  }
}
