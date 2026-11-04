import { spawn } from "node:child_process"
const process = require('node:process')

const prod = process.env.NODE_ENV === 'production'
const docker = process.env.DOCKER_ENV === 'true'

var bin = (name: string) => `./node_modules/.bin/${name}`

if (docker) {
  bin = (name: string) => `/app/node_modules/.bin/${name}`
}

var commands: any[] = []

commands = [
  ["tsx", "backend/server.ts"]
]

const children = commands.map(([name, ...args]) =>
  spawn(process.execPath, [bin(name), ...args], 
  { stdio: "inherit",
    env: {
      ...process.env,
      NODE_ENV: prod ? "production" : "development",
    },
  }
)
)

process.on("SIGTERM", () => stop())
process.on("SIGINT", () => stop())

for (const child of children) {
  child.on("error", () => {
    console.log("error")
    process.exitCode = 1
    for (const child of children) child.kill("SIGTERM")
  })
  child.on("exit", (code) => {
    console.log("exit: ", code)
    process.exitCode = code ?? 1
    for (const child of children) child.kill("SIGTERM")
  })
}