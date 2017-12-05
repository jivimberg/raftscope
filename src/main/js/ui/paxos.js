/* jshint globalstrict: true */
/* jshint browser: true */
/* jshint devel: true */
/* jshint jquery: true */
/* global util */
/* global graphics */
/* global INITIAL_SERVER_NUMBER */
'use strict';

const paxos = {};
const RPC_TIMEOUT = 50000; //TODO use it to make progress
const MIN_RPC_LATENCY = 10000;
const MAX_RPC_LATENCY = 15000;
const ELECTION_TIMEOUT = 100000;

(function () {
	paxos.getServerIndexById = (model, id) => model.servers.findIndex(srv => srv.id === id);

	paxos.update = (model) => {
		model.messageHandler.update(model);
		model.messages = model.messageHandler.inFlightMessages;
		model.servers.forEach(server => {
			server.updateTime(model.time);
			server.term = server.paxosInstanceNumber;
			server.state = server.isMaster() ? 'leader' : 'follower'
		})
	};

	paxos.stop = (server) => {
		server.stop();
	};

	paxos.resume = (server) => {
		server.start();
	};

	paxos.resumeAll = (model) => {
		model.servers.forEach(server => paxos.resume(server));
	};

	paxos.restart = (server) => {
		paxos.stop(server);
		paxos.resume(server);
	};

	paxos.drop = (model, message) => {
		model.messages = model.messages.filter(m => m !== message);
		model.messageHandler.dropMessage(message);
	};

	paxos.clientRequest = (server) => {
		server.proposeUpdate("v")
	};

	// Leadership is not implemented yet. If no server is leader all are leaders
	paxos.getLeader = (model) => {
		const leaders = model.servers.filter(server => server.isMaster());
		if (leaders.length > 1) {
			alert("We have more than one leader!");
		}

		return leaders[0];
	};

	//TODO make sure this is hidden if you're not using ConfigStrategy
	paxos.addServer = (model) => {
		const addServerUpdateUi = (cluster, newNode) => {
			if (model.servers.includes(newNode)) {
				// This node was already added to the model
				return;
			}

			//Init new node
			newNode.setup(cluster, model.messageHandler);
			newNode.start();

			model.cluster = cluster;
			model.servers.forEach(graphics.realign(model.servers.length + 1));
			model.servers.push(newNode);
			model.deadServersWalking[newNode.id] = true;
			graphics.get_creator(model.servers.length)(newNode, model.servers.length - 1);
		};

		//TODO only works with leader for now
		const leader = paxos.getLeader(model);
		if (leader !== undefined) {
			const node = util.createNode(model);
			leader.addNode(node, addServerUpdateUi);
		}
	};

})();