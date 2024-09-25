import { Worker } from "worker_threads";
import path from "path";
import MinBinaryHeap from "./taskQueue";

interface Task {
  taskName: string;
  options: any;
  callback: (result: any) => void;
}

declare module "worker_threads" {
  interface Worker {
      currentTask: Task;  // Add your custom properties here
  }
}

class Pool {
    private threadCount : number;
    private threads : any;
    private idleThreads : any;
    scheduledTasks : any
  constructor(poolCount : number) {
    this.threadCount = poolCount; // number of threads that will be spawned
    this.threads = []; // all of our worker threads (same length as threadCount)
    this.idleThreads = []; // threads that are not currently working
    this.scheduledTasks = new MinBinaryHeap(); // queue of tasks that need to be executed - these are not currently running in one of the threads
    // Spawn the threads
    for (let i = 0; i < this.threadCount; i++) {
      this.spawnThread();
    }
  }

  private spawnThread() {
    const worker = new Worker(path.join(__dirname, "worker.js"));

    // When we get a message from a worker, it means that it has finished its task
    worker.on("message", (result) => {
      const { callback } = worker.currentTask;

      if (callback) {
        callback(result);
      }

      this.idleThreads.push(worker);
      this.runNextTask();
    });

    this.threads.push(worker);
    this.idleThreads.push(worker); // initially, all threads are idle
  }

  private runNextTask() {
    if (this.scheduledTasks.tasks.length > 0 && this.idleThreads.length > 0) {
      const worker = this.idleThreads.shift();
      const { taskName, options, callback } = this.scheduledTasks.remove();

      worker.currentTask = { taskName, options, callback };

      // Tell a worker to start executing that task
      worker.postMessage({ taskName, options });
    }
  }

  submit(id:number, taskName : string, options : any, callback:(result: any) => void) {
    
    this.scheduledTasks.insert({ id, taskName, options, callback });
    this.runNextTask();
  }
}
const pool = new Pool(2)
export default pool;
