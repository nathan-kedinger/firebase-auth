import {ApiResource} from "../../../utils";
import type {User} from "../types/User";

export const getAuthenticatedUser = async (): Promise<User> => {
    return await ApiResource.getItem('/me')
}