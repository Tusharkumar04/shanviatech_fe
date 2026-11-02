const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const authService = require("../../services/auth.service")
const tokenService = require("../../services/token.service")

const register = catchAsync(async (req, res) => {
    const data = await authService.register(req.body);

    res.status(httpStatus.CREATED).send({
        code: httpStatus.CREATED,
        message: "Successfully registered",
        data,
    });
});

const login = catchAsync(async (req, res) => {
    const user = await authService.login(req.body);
    const tokens = await tokenService.generateAuthTokens(user)

    res.status(httpStatus.OK).send({
        code: httpStatus.OK,
        message: "Successfully logged in",
        data: { ...user, accessToken: tokens?.access?.token, refreshToken: tokens?.refresh?.token }
    });
});

module.exports = {
    register,
    login
}