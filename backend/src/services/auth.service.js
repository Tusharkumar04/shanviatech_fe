const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const UserModel = require("../models/user.model")

const register = async (data) => {
    return data
}

const login = async (data) => {
    const { email, password } = data;

    const user = await UserModel.findOne({ email });
    console.log(await user.isPasswordMatch(password), password,user,"ppppppppp")
    if (!user || !(user.password==password)) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
    }

    return { id: user._id };
};

module.exports = {
    register,
    login,
}