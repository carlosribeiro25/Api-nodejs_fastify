"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuthenticatedUser = getAuthenticatedUser;
function getAuthenticatedUser(request) {
    const user = request.user;
    if (!user) {
        throw new Error('Invalid authenticated');
    }
    return user;
}
