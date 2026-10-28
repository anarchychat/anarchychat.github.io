import { spawn } from "node:child_process";

const bin = (name: string) => `/app/node_modules/.bin/${name}`;
const commands = [
  ["next", "start", "-H", "0.0.0.0", "-p", "3000"],
  ["tsx", "chat.ts"],
  ["tsx", "draw.ts"],
  ["tsx", "dm.ts"],
  ["tsx", "vc.ts"],
];

const children = commands.map(([name, ...args]) =>
  spawn(process.execPath, [bin(name), ...args], { stdio: "inherit" })
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
