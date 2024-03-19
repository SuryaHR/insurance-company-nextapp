import { unknownObjectType } from "@/constants/customTypes";
import { getClientCookie, getServerCookie } from "./utils/utitlity";

class HttpService {
  accessToken: string | undefined | null;
  isClient: boolean;
  isPublic: boolean;
  isFormData: boolean;
  isArrayBuffer: boolean;
  header: unknownObjectType;
  constructor(obj?: {
    isPublic?: boolean;
    isClient?: boolean;
    isFormData?: boolean;
    isArrayBuffer?: boolean;
  }) {
    this.accessToken = undefined;
    this.isClient = obj?.isClient ?? false;
    this.isPublic = obj?.isPublic ?? false;
    this.isFormData = obj?.isFormData ?? false;
    this.isArrayBuffer = obj?.isArrayBuffer ?? false;
    this.header = {
      Accept: "application/json",
      "X-originator": process.env.NEXT_PUBLIC_XORIGINATOR,
      "Time-Zone": Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
    if (!this.isFormData) {
      this.header["Content-Type"] = "application/json";
    }
    //  this.validateToken();
  }

  async validateToken() {
    if (!this.isPublic) {
      if (this.isClient) {
        this.accessToken = getClientCookie("accessToken");
      } else {
        const token = await getServerCookie("accessToken");
        this.accessToken = token;
      }
      this.header["X-Auth-Token"] = this.accessToken;
    }
  }

  async post(
    url: string,
    payload: any,
    headers?: object,
    abortControl?: AbortController
  ): Promise<unknownObjectType> {
    return new Promise((resolve, reject) => {
      this.validateToken().then(() => {
        const bodyData = this.isFormData ? payload : JSON.stringify(payload);
        try {
          fetch(url, {
            method: "POST",
            headers: { ...this.header, ...headers },
            // body: JSON.stringify(payload),
            body: bodyData,
            signal: abortControl?.signal,
          })
            .then((response) =>
              this.isArrayBuffer ? response.arrayBuffer() : response.json()
            )
            .then((result) => {
              // const data = result?.data;
              return resolve(result);
            })
            .catch((error) => reject({ error }));
        } catch (error) {
          console.error("Post API error", error);
          return reject({ error });
        }
      });
    });
  }

  async get(url: string, headers?: object): Promise<unknownObjectType> {
    return new Promise((resolve, reject) => {
      this.validateToken().then(() => {
        try {
          fetch(url, {
            method: "GET",
            headers: { ...this.header, ...headers },
          })
            .then((resp) => resp.json())
            .then((response) => {
              // const data = result?.data;
              return resolve(response);
            })
            .catch((error) => reject({ error }));
        } catch (error) {
          console.error("Get API error", error);
          return reject({ error });
        }
      });
    });
  }
  // Retrive file / pdf using params and get method using api
  async getFile(url: string, headers?: object): Promise<unknownObjectType> {
    return new Promise((resolve, reject) => {
      this.validateToken().then(() => {
        try {
          fetch(url, {
            method: "GET",
            headers: { ...this.header, ...headers },
          })
            .then((resp) => {
              return resolve(resp);
            })
            .catch((error) => reject({ error }));
        } catch (error) {
          console.error("Get API error", error);
          return reject({ error });
        }
      });
    });
  }
  // Retrive file / pdf using payload and post method using api
  async getFileByPayload(
    url: string,
    payload: any,
    headers?: object
  ): Promise<unknownObjectType> {
    return new Promise((resolve, reject) => {
      this.validateToken().then(() => {
        const bodyData = this.isFormData ? payload : JSON.stringify(payload);
        try {
          fetch(url, {
            method: "POST",
            headers: { ...this.header, ...headers },
            body: bodyData,
          })
            .then((response) => resolve(response))
            .catch((error) => reject({ error }));
        } catch (error) {
          console.error("Post API error", error);
          return reject({ error });
        }
      });
    });
  }

  async delete(
    url: string,
    payload?: unknown,
    headers?: object
  ): Promise<unknownObjectType> {
    return new Promise((resolve, reject) => {
      this.validateToken().then(() => {
        try {
          fetch(url, {
            method: "DELETE",
            headers: { ...this.header, ...headers },
            body: JSON.stringify(payload),
          })
            .then((response) => response.json())
            .then((result) => {
              // const data = result;
              return resolve(result);
            })
            .catch((error) => reject({ error }));
        } catch (error) {
          console.error("Delete API error", error);
          return reject({ error });
        }
      });
    });
  }
}

export default HttpService;
