import packageJson from "../package.json";

export class BuildInfoRepository {
  static getAll() {
    return { BUILD_DATE: Date.now(), BUILD_VERSION: `v${packageJson.version}` };
  }
}
