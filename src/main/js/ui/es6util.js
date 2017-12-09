import Node, {allRoles} from "../paxos/Node.js";
import {MasterMixin} from "../paxos/MasterStrategy.js";
import {SyncMixin} from "../paxos/SyncStrategy.js";
import {ConfigMixin} from "../paxos/ConfigurationStrategy.js";

//This is a workaround for scripts being loaded before modules

let nodeIdIdx = 0;

util.createNode = (model, roles = allRoles) => {
	const urlParams = new URLSearchParams(window.location.search);
	const config = urlParams.get('config');
	const newNodeId = nodeIdIdx++;
	switch (config) {
		case 'master-optimized-config':
			return new NodeWithMasterAndConfig(newNodeId, roles, model, true);
		case 'master-optimized':
			return new NodeWithMaster(newNodeId, roles, model, true);
		case 'master':
			return new NodeWithMaster(newNodeId, roles, model, false);
		case 'sync':
			return new NodeWithSync(newNodeId, roles);
		default:
			return new Node(newNodeId, roles)
	}
};

//TODO can we simplify this?
class NodeWithMasterAndConfig extends ConfigMixin(MasterMixin(SyncMixin(Node))) {
	constructor(...args) {
		super(...args);
	}
}

class NodeWithMaster extends MasterMixin(SyncMixin(Node)) {
	constructor(...args) {
		super(...args);
	}
}

class NodeWithSync extends SyncMixin(Node) {
	constructor(...args) {
		super(...args);
	}
}