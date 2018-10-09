import {from} from "rxjs";
import {IRegisterRequest} from "../dtos/User";
import {baseUrl, registerEndpoint} from "./constants";

export const registerHttpCall = (registerRequestDto: IRegisterRequest) => {
  return from(fetch(baseUrl + registerEndpoint, {
    body: JSON.stringify(registerRequestDto),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  }));
};
