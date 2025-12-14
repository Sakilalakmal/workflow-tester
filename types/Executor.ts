import { Browser, Page } from "puppeteer";
import { WorkflowTasks } from "./workflows/workflow";

export type EnvironmentType = {
  browser?: Browser;
  page?: Page;
  phases: {
    [Key: string]: {
      inputs: Record<string, string>;
      outputs: Record<string, string>;
    };
  };
};

export type ExecutionEnvironmentType<T extends WorkflowTasks> = {
  getInput(name: T["inputs"][number]["name"]): string;
  getBrowser(): Browser | null;
  setBrowser(browser: Browser): void;
  getPage(): Page | undefined;
  setPage(page: Page): void;
  browser?: Browser;
  page?: Page;
};
