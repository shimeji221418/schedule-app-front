import axios from "axios";
import applyCaseMiddleware from "axios-case-converter";

export type MethodType = "get" | "post" | "patch" | "delete";

export type BaseClientWithAuthType = {
  method: MethodType;
  url: string;
  token: string;
  data?: any;
  options?: any;
  params?: any;
};

export type BaseClientWithoutAuthType = Omit<BaseClientWithAuthType, "token">;

const options = {
  ignoreHeaders: true,
};

const baseClient = applyCaseMiddleware(
  axios.create({
    baseURL: `${process.env.BASE_URL}/api/v1/`,
  }),
  options
);

export const BaseClientWithoutAuth = (params: BaseClientWithoutAuthType) => {
  const { method, url, data } = params;

  return baseClient.request({
    method,
    url,
    data,
  });
};

export const BaseClientWithAuth = (props: BaseClientWithAuthType) => {
  const { method, url, token, data, options, params } = props;

  return baseClient.request({
    headers: { authorization: `Bearer ${token}`, ...options },
    method,
    url,
    data,
    params,
  });
};
