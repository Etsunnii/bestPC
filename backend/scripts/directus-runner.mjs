import { spawn, spawnSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const directusCli = path.join(projectRoot, "node_modules", "directus", "cli.js");
const bundledNodeDir = path.join(projectRoot, ".runtime", "node-v22.23.0-win-x64");
const bundledNode = path.join(bundledNodeDir, "node.exe");
const pm2Home = path.join(projectRoot, "directus", ".pm2");
const postgresBin = "F:\\Apps\\PostgreSQL\\bin";
const postgresData = path.join(projectRoot, "directus", "postgres", "data");
const postgresLog = path.join(projectRoot, "directus", "postgres", "postgres.log");
const pgCtl = path.join(postgresBin, "pg_ctl.exe");
const pgIsReady = path.join(postgresBin, "pg_isready.exe");

if (!existsSync(directusCli)) {
  console.error("Directus is not installed. Run npm install first.");
  process.exit(1);
}

const currentNodeMajor = Number(process.versions.node.split(".")[0]);
const nodeExecutable = currentNodeMajor === 22 ? process.execPath : bundledNode;

if (!existsSync(nodeExecutable)) {
  console.error("Directus requires Node.js 22. The local Node.js 22 runtime is missing.");
  process.exit(1);
}

mkdirSync(pm2Home, { recursive: true });

if (existsSync(pgCtl) && existsSync(path.join(postgresData, "PG_VERSION"))) {
  const status = spawnSync(pgIsReady, ["-h", "127.0.0.1", "-p", "5433"], {
    stdio: "ignore",
  });

  if (status.status !== 0) {
    const started = spawnSync(
      pgCtl,
      [
        "start",
        "-D",
        postgresData,
        "-l",
        postgresLog,
        "-o",
        "-p 5433 -h 127.0.0.1",
        "-w",
      ],
      { stdio: "inherit" },
    );

    if (started.status !== 0) {
      console.error("Could not start the local PostgreSQL server.");
      process.exit(started.status ?? 1);
    }
  }
}

const command = process.argv[2] ?? "start";
const args = process.argv.slice(3);
const child = spawn(nodeExecutable, [directusCli, command, ...args], {
  cwd: projectRoot,
  env: {
    ...process.env,
    PM2_HOME: pm2Home,
    PATH: `${path.dirname(nodeExecutable)}${path.delimiter}${process.env.PATH ?? ""}`,
  },
  stdio: "inherit",
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});
