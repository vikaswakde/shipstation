class AIProviderService {
  constructor() {
    this.providers = {};
  }

  registerProvider(name, provider) {
    this.providers[name] = provider;
  }

  async sendMessage(providerName, options) {
    if (!this.providers[providerName]) {
      throw new Error(`Provider ${providerName} not registered`);
    }

    try {
      return await this.providers[providerName].sendMessage(options);
    } catch (error) {
      console.error(`Error with provider ${providerName}:`, error);
      throw error;
    }
  }

  async validateKey(providerName, key) {
    if (!this.providers[providerName]) {
      throw new Error(`Provider ${providerName} not registered`);
    }

    try {
      return await this.providers[providerName].validateKey(key);
    } catch (error) {
      console.error(`Error validating key for provider ${providerName}:`, error);
      return false;
    }
  }

  getProvider(providerName) {
    return this.providers[providerName];
  }
}

module.exports = new AIProviderService();