function update(status, console) {
    console = document.getElementById("console").firstElementChild.innerHTML.slice(0, -1) + console;
    console = console.split("<br>").slice(-14);
    document.getElementById("console").firstElementChild.innerHTML = console.join("<br>") + "_";
    document.getElementById("control").firstElementChild.firstElementChild.innerHTML = "Current server status:" + status;
}

function server_start() {
    let cmd = "start";
    update("🟢starting", cmd + "<br>");
    command(cmd).then();
}

function server_stop() {
    let cmd = "stop";
    update("🔴stopping", cmd + "<br>");
    command(cmd).then();
}

function server_restart() {
    let cmd = "restart";
    update("🔁restarting", cmd + "<br>");
    command(cmd).then();
}

function server_refresh() {
    let cmd = "status";
    update("🔃refreshing", cmd + "<br>");
    command(cmd).then();
}

async function command(cmd) {
    let res = await send_command("/etc/init.d/tmfd " + cmd);
    if (res === "") update(" ⚡ unreachable", "<br>> ");
    else if (res === "Stopping tmfd (via systemctl): tmfd.service.") update("🔴stopping", "<br>res<br>> ");
    else if (res === "Starting tmfd (via systemctl): tmfd.service.") update("🟢starting", "<br>res<br>> ");
    else if (res === "Restarting tmfd (via systemctl): tmfd.service.") update("🔁restarting", "<br>res<br>> ");
    else if (res.split("\n") > 1) {
        if (res.split("\n")[2].trim().startsWith("Active: inactive (dead)")) update("⭕offline", "<br>res<br>> ");
        else if (res.split("\n")[2].trim().startsWith("Active: active (running)")) update("🟢online", "<br>res<br>> ");
    }
    else update("❔unknown", "<br>res<br>> ");
}

async function send_command(cmd) {
    const response = await fetch('http://127.0.0.1:5000/tmfd', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ cmd }),
    });
    return await response.json();
}
