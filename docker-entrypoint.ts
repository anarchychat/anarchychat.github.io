import { spawn } from "node:child_process";

const prod = process.env.NODE_ENV === 'production'
const docker = process.env.DOCKER_ENV === 'true'

var bin = (name: string) => `./node_modules/.bin/${name}`

if (docker) {
  bin = (name: string) => `/app/node_modules/.bin/${name}`
}

var commands: any[] = [];

commands = [
  ["tsx", "server.ts"],
];

const children = commands.map(([name, ...args]) =>
  spawn(process.execPath, [bin(name), ...args], 
  { stdio: "inherit",
    env: {
      ...process.env,
      NODE_ENV: prod ? "production" : "development",
    },
  }
)
);

let stopping = false;

function stop() {
  if (stopping) return;
  stopping = true;
  for (const child of children) child.kill("SIGTERM");
  setTimeout(() => {
    for (const child of children) child.kill("SIGKILL");
  }, 5000).unref();
}

process.on("SIGTERM", () => stop());
process.on("SIGINT", () => stop());

for (const child of children) {
  child.on("error", () => {
    process.exitCode = 1;
    stop();
  });
  child.on("exit", (code) => {
    if (!stopping) {
      process.exitCode = code ?? 1;
      stop();
    }
  });
}
