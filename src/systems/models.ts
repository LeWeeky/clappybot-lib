import { readdirSync, statSync } from "fs";
import type ADriver from "../libraries/drivers/ADriver.js";
import type AModel from "../libraries/drivers/AModel.js";
import BuiltInModels from "../models/index.js";

export default class Models {
  _database: ADriver;
  _list: typeof AModel[];

  constructor(database: ADriver) {
    this._list = [];
    this._database = database;
  }

  async load_dir(path: string) {
    for (const file of readdirSync(path)) {
      if (file.endsWith(".js") || file.endsWith(".ts")) {
        const file_path = `${path}/${file}`;
        const model = await import(file_path);
        this._list.push(model);
      }
    }
  }

  loadBuiltIn() {
    this._list.push(...BuiltInModels);
  }

  /**
   * Load all model files from every module's models directory
   */
  async load() {
    this.loadBuiltIn();
    for (const module of readdirSync("./sources/modules")) {
      if (
        !module.startsWith(".") &&
        statSync(`./sources/modules/${module}`).isDirectory()
      ) {
        for (const file of readdirSync(`./sources/modules/${module}`)) {
          if (file == "models") {
            this.load_dir(`${process.cwd()}/sources/modules/${module}/models`);
          }
        }
      }
    }
    console.log(
      `${this._list.length} "Model" ${this._list.length === 1 ? "has" : "have"} been loaded.`,
    );
  }

  async init() {
    await Promise.all(
      this._list.map((model) => {
        model.use(this._database);
        return model.init();
      }),
    );
  }
}
