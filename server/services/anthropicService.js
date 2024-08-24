const Anthropic = require("@anthropic-ai/sdk");
require("dotenv").config();

class AnthropicService {
  constructor(options = {}) {
    this.client = new Anthropic({
      apiKey: options.apiKey || process.env.ANTHROPIC_API_KEY,
    });
    this.model = options.model || process.env.DEFAULT_MODEL;
    this.maxTokens = options.maxTokens || 4000;
    this.temperature = options.temperature || 0;
  }

  async sendMessage({ messages, system, tools, tool_choice }) {
    const clientParams = {
      model: this.model,
      max_tokens: this.maxTokens,
      temperature: this.temperature,
      messages,
      tools,
    };

    if (tool_choice) {
      clientParams.tool_choice = tool_choice;
    }
    if (system) {
      clientParams.system = system;
    }

    try {
      const response = await this.client.messages.create(clientParams, {
        headers: { "anthropic-beta": "max-tokens-3-5-sonnet-2024-07-15" },
      });
      return response;
    } catch (error) {
      console.error("Error in AnthropicService.sendMessage", error);
      throw error;
    }
  }

  static async validateKey(key) {
    const testClient = new Anthropic({ apiKey: key });
    try {
      await testClient.messages.create({
        model: process.env.DEFAULT_MODEL,
        max_tokens: 10,
        temperature: 0,
        messages: [{ role: "user", content: "Hello" }],
      });
      return true;
    } catch (error) {
      console.error("Error validating Anthropic API key:", error);
      return false;
    }
  }
}

module.exports = AnthropicService;