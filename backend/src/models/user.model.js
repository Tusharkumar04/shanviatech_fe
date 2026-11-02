const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
      trim: true,
      default: '',
    },
    last_name: {
      type: String,
      trim: true,
      default: '',
    },
    full_name: {
      type: String,
      trim: true,
      default: '',
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    password: {
      type: String,
      required: false,
      trim: true,
      minlength: 8,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error('Password must contain at least one letter and one number');
        }
      },
      private: true,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    },
    marital_status: {
      type: String,
      enum: ['single', 'in_a_relationship', 'married', 'widowed', 'divorced', 'separated'],
    },
    dob: {
      type: String,
      default: '',
    },
    address: {
      type: Object,
      default: {
        locality: '',
        city: '',
        state: '',
        country: '',
        postal_code: null,
        latitude: null,
        longitude: null,
      },
    },
    language: {
      type: String,
      trim: true,
      default: '',
    },
    role: {
      type: String,
      required: false,
      enum: ['employee', 'admin', 'client'],
    },
    status: {
      type: Boolean,
      default: true,
    },
    is_verified: {
      type: Boolean,
      default: true,
    },
    otp: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  if (user.isModified('first_name') || user.isModified('last_name')) {
    user.full_name = `${user.first_name} ${user.last_name}`;
  }
  next();
});

userSchema.index({ 'address.location': '2dsphere' });

const User = mongoose.model('User', userSchema);

module.exports = User;
