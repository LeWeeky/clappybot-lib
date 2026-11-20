/**
 * ClappyBot - A powerful framework for bot developers
 * Copyright (C) 2019–2025 LeWeeky
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import type { TaskProps } from "../interfaces/task.interface.js";
import { AFunctionality, AFunctionalities } from "./abstracts/functionality.js";

const config = {
  title: "task",
  descriptior: undefined,
  direct_names: ["tasks", "daily", "weekly", "monthly"],
  shared_folder: false,
  extension: "tasks.js",
  folder: "tasks",
  addons: "tasks",
};

export class Tasks extends AFunctionalities<Task, typeof Task> {
  constructor() {
    super(Task, config);
  }

  /**
   * Supprime toutes les commandes
   */
  destroy() {
    for (let i = 0; i < this._list.length; i++) this._list[i].stop();
    super.destroy();
  }

  async load() {
    await super.load();

    for (let i = 0; i < this._list.length; i++) this._list[i].start();
  }

  async reload() {
    this.destroy();
    await this.load();
  }

  add(handler: Task, file_path: string) {
    if (!handler.start) {
      console.warn(file_path, "method start is missing");
      return;
    }
    if (!handler.stop) {
      console.warn(file_path, "method stop is missing");
      return;
    }
    this._list.push(new Task(handler, file_path));
  }
}

export class Task extends AFunctionality {
  start: () => void;
  stop: () => void;

  constructor(task: TaskProps, file_path: string) {
    super(file_path);
    this.start = task.start;
    this.stop = task.stop;
  }
}
