import { stringify } from "querystring";
import { KubeObject } from "./kube-object";
import { createKubeApiURL } from "./kube-api-parse";
import { KubeApi, IKubeApiQueryParams } from "./kube-api";

export class VersionedKubeApi<T extends KubeObject = any> extends KubeApi<T> {

  private preferredVersion?: string;


  async getPreferredVersion() {
    const apiGroupVersion = await this.request.get<{ preferredVersion: { version: string; }; }>(`${this.apiPrefix}/${this.apiGroup}`);
    this.preferredVersion = apiGroupVersion.preferredVersion.version;
  }


  getUrl({ name = "", namespace = "" } = {}, query?: Partial<IKubeApiQueryParams>) {
    const { apiPrefix, apiGroup, apiVersion, apiResource } = this;

    
    const resourcePath = createKubeApiURL({
      apiPrefix: apiPrefix,
      apiVersion: `${apiGroup}/${this.preferredVersion ?? this.apiVersion}`,
      resource: apiResource,
      namespace: this.isNamespaced ? namespace : undefined,
      name: name,
    });
    return resourcePath + (query ? `?` + stringify(query) : "");
  }
}
