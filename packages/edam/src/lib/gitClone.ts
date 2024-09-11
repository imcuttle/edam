/* eslint-disable */
// Forked from https://github.com/jaz303/git-clone/blob/master/index.js
// use cross-spawn, instead spawn

import processAsync from "./processAsync";
import isCI from "is-ci";

var pify = require("pify");
var spawn = require("cross-spawn");
var env = {
  ...process.env,
  GIT_TERMINAL_PROMPT: "0"
};

function _checkout(checkout, { targetPath = "", git = "git" } = {}, cb) {
  var args = ["checkout", checkout];
  var process = spawn(git, args, { env, cwd: targetPath });

  processAsync(process, "git checkout", cb);
}

async function clonePromise(repo, targetPath, opts) {
  const cloneP = pify(_clone);
  try {
    return await cloneP(repo, targetPath, opts);
  } catch (err) {
    if (opts.onDisablePromptError) {
      await opts.onDisablePromptError(err);
    }
    if (!isCI) {
      return await cloneP(repo, targetPath, {
        ...opts,
        env: { ...env, GIT_TERMINAL_PROMPT: "1" }
      });
    }
  }
}

function _clone(repo, targetPath, opts, cb) {
  if (typeof opts === "function") {
    cb = opts;
    opts = null;
  }

  opts = opts || {};

  var git = opts.git || "git";
  var args = ["clone"];

  if (opts.shallow) {
    args.push("--depth");
    args.push("1");
    args.push("--recurse-submodules");
    args.push("-j8");
  }

  args.push("--");
  args.push(repo);
  args.push(targetPath);

  var process = spawn(git, args, { env: opts.env || env });
  processAsync(process, "git clone", function(err, stdout) {
    if (err) {
      cb(err);
    } else {
      if (opts.checkout) {
        checkout();
      } else {
        cb && cb();
      }
    }
  });

  function checkout() {
    _checkout(opts.checkout, { targetPath, git }, cb);
  }
}

function _pullForce(targetPath, outerEnv = env, cb) {
  var process = spawn(
    "git",
    ["pull", "--force", "--allow-unrelated-histories"],
    {
      cwd: targetPath,
      env: outerEnv
    }
  );

  processAsync(process, "git pull", cb);
}

function _reset(targetPath, outerEnv = env, cb) {
  var process = spawn(
    "git",
    ["reset", "--hard", "HEAD"],
    {
      cwd: targetPath,
      env: outerEnv
    }
  );

  processAsync(process, "git reset", cb);
}

function _cleanFD(targetPath, outerEnv = env, cb) {
  var process = spawn(
    "git",
    ["clean", "-f", "-d"],
    {
      cwd: targetPath,
      env: outerEnv
    }
  );

  processAsync(process, "git clean", cb);
}


const _pullForcePromise = pify(_pullForce);
const reset = pify(_reset);
const cleanFD = pify(_cleanFD);

export default clonePromise;
export const checkout = pify(_checkout);
export const pullForce = async (targetPath, opts?) => {
  try {
    await reset(targetPath, env);
    await cleanFD(targetPath, env);
    await _pullForcePromise(targetPath, env);
  } catch (err) {
    if (opts && opts.onDisablePromptError) {
      await opts.onDisablePromptError(err);
    }
    if (!isCI) {
      await reset(targetPath, env);
      await cleanFD(targetPath, env);
      return await _pullForcePromise(targetPath, {
        ...env,
        GIT_TERMINAL_PROMPT: "1"
      });
    }
  }
};
