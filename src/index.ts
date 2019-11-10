import 'reflect-metadata';

import debugWrapper from './utils/debug';
import { DgraphNode } from './types/dgraph_node';

import { Node } from './decorators/node';
import { Predicate } from './decorators/predicate';

import { NODE_STORAGE, PREDICATE_STORAGE, NODE_PREDICATE_MAPPING, getGlobalDgraphSchema } from './storage';
import { DgraphType } from './types/dgraph_types';

const debug = debugWrapper('index');

@Node()
class ConnectedNode extends DgraphNode {
  @Predicate()
  name: string;
}

@Node()
class TestNode extends DgraphNode {
  @Predicate({
    type: DgraphType.String,
    isArray: true,
  })
  type: string[];

  @Predicate()
  enabled: boolean;

  @Predicate({
    type: ConnectedNode,
    isArray: true,
  })
  connects: ConnectedNode[];
}

debug('node storage:\n%O', NODE_STORAGE);
debug('predicate storage:\n%O', PREDICATE_STORAGE);
debug('node-predicate mapping:\n%O', NODE_PREDICATE_MAPPING);

const t = new TestNode();

debug(Reflect.getMetadata('dgraph:node', t.constructor));
debug(getGlobalDgraphSchema());
