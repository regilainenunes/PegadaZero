const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const useMemory = process.env.FORCE_MEMORY === 'true' || !process.env.MONGO_URI; // Fallback com opção de forçar memória
if (!useMemory) {
  const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    points: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
  });

  UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    } catch (error) {
      next(error);
    }
  });

  UserSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  };

  module.exports = mongoose.model('User', UserSchema);
} else {
  // Fallback em memória para desenvolvimento sem MongoDB
  const users = [];
  let nextId = 1;

  class MemoryUser {
    constructor({ name, email, password, role = 'user', points = 0 }) {
      this._id = String(nextId++);
      this.name = name;
      this.email = String(email).toLowerCase().trim();
      this.password = password;
      this.role = role;
      this.points = points;
      this.createdAt = new Date();
      this._isModifiedPassword = true;
    }

    isModified(field) {
      return field === 'password' ? this._isModifiedPassword : true;
    }

    async save() {
      // Hash password
      if (this._isModifiedPassword) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        this._isModifiedPassword = false;
      }
      const existing = users.find(u => u.email === this.email);
      if (existing) {
        const err = new Error('duplicate key');
        err.code = 11000;
        throw err;
      }
      users.push({ ...this });
      return this;
    }

    async comparePassword(candidatePassword) {
      return await bcrypt.compare(candidatePassword, this.password);
    }

    static findOne(query) {
      const { email, _id } = query || {};
      let result = users.find(u => (email ? u.email === String(email).toLowerCase().trim() : true));
      if (result && _id && _id.$ne) {
        if (String(result._id) === String(_id.$ne)) {
          result = undefined;
        }
      }
      return result ? MemoryUser._wrap(result) : null;
    }

    static findById(id) {
      const result = users.find(u => String(u._id) === String(id));
      return result ? MemoryUser._wrap(result) : null;
    }

    static findByIdAndUpdate(id, updates, options = {}) {
      const idx = users.findIndex(u => String(u._id) === String(id));
      if (idx === -1) return null;
      users[idx] = { ...users[idx], ...updates };
      const updated = MemoryUser._wrap(users[idx]);
      return options && options.new ? updated : MemoryUser._wrap(users[idx]);
    }

    static findByIdAndDelete(id) {
      const idx = users.findIndex(u => String(u._id) === String(id));
      if (idx === -1) return null;
      const [removed] = users.splice(idx, 1);
      return removed ? MemoryUser._wrap(removed) : null;
    }

    static _wrap(userObj) {
      const obj = { ...userObj };
      obj.comparePassword = async function(candidatePassword) {
        return await bcrypt.compare(candidatePassword, userObj.password);
      };
      obj.select = function(fieldStr) {
        if (fieldStr && fieldStr.includes('-password')) {
          const { password, ...rest } = obj;
          return rest;
        }
        return obj;
      };
      return obj;
    }
  }

  module.exports = MemoryUser;
}