/** Swap-friendly interface. Every method is async. */
export const StorageAdapter = {
  async get(_key) {},
  async set(_key, _value) {},
  async delete(_key) {},
  async list(_prefix) { return []; },
};

const NS = 'sl:';

export const LocalStorageAdapter = {
  async get(key) {
    try {
      const raw = localStorage.getItem(NS + key);
      return raw !== null ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  async set(key, value) {
    localStorage.setItem(NS + key, JSON.stringify(value));
  },

  async delete(key) {
    try {
      localStorage.removeItem(NS + key);
    } catch {
      // no-op
    }
  },

  async list(prefix) {
    try {
      const results = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(NS + prefix)) {
          results.push(k.slice(NS.length));
        }
      }
      return results;
    } catch {
      return [];
    }
  },
};
