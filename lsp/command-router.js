/**
 * Command Router
 * Routes /review and other commands to agents
 */

class CommandRouter {
  constructor(connection, agents) {
    this.connection = connection;
    this.agents = agents;
  }

  register() {
    // TODO: Register command handlers
  }
}

module.exports = CommandRouter;
