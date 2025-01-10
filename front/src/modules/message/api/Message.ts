import {ApiResource} from "../../../utils";
import type {Message} from "../type.ts";

export const getMessagesList = async (): Promise<Message[]> => {
    return await ApiResource.getCollection(`messages`)
}