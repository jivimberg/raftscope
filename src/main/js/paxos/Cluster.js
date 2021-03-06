import {Role} from "./Node.js";

class Cluster {
	// _nodes;

	constructor(nodes) {
		this._nodes = nodes
	}

	get proposers() {
		return this._getNodesByRole(Role.PROPOSER)
	}

	get acceptors() {
		return this._getNodesByRole(Role.ACCEPTOR)
	}

	get learners() {
		return this._getNodesByRole(Role.LEARNER)
	}

	get quorum() {
		return Math.floor(this.acceptors.length / 2) + 1;
	}

	_getNodesByRole(role) {
		return this._nodes.filter(node => node.roles.includes(role))
	}

	getMaster() {
		return this._nodes.find(node => node.isMaster())
	}

	get nodes() {
		return this._nodes;
	}
}

export default Cluster;