import { ObjectLiteral } from '../utils/type';
import { DiffValue } from './value';

export namespace DiffTracker {
  /**
   * All instances tracked by the tracker.
   */
  const instances = new WeakMap<Object, ObjectLiteral<DiffValue<any>>>();

  /**
   * Register an instance for tracking.
   */
  export function trackProperty(target: Object, propertyName: string): Object {
    Reflect.defineProperty(target, propertyName, {
      configurable: true,
      enumerable: true,
      set: function(value: any) {
        ensureInstance(this, propertyName);
        instances.get(this)![propertyName].set(value);
      },
      get: function() {
        ensureInstance(this, propertyName);
        return instances.get(this)![propertyName].get();
      }
    });

    return target;
  }

  /**
   * Purge all changelogs of an instance.
   */
  export function purgeInstance(target: Object) {
    const envelope = instances.get(target);
    if (!envelope) {
      return;
    }

    for (let value of Object.values(envelope)) {
      value.clear();
    }
  }

  /**
   * Get values envelope for an instance.
   */
  export function getValues(target: Object) {
    return instances.get(target);
  }

  /**
   * Make sure the instance is in the weakmap
   */
  function ensureInstance(instance: Object, propertyName: string): void {
    if (!instances.has(instance)) {
      instances.set(instance, {});
    }

    if (!instances.get(instance)![propertyName]) {
      instances.get(instance)![propertyName] = new DiffValue();
    }
  }
}