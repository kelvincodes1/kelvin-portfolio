const typedCommand = document.querySelector("#typed-command");
const consoleFeed = document.querySelector("#console-feed");
const missionButton = document.querySelector("#mission-button");
const missionText = document.querySelector("#mission-text");
const cursorGlow = document.querySelector(".cursor-glow");
const navLinks = [...document.querySelectorAll("nav a")];
const sections = [...document.querySelectorAll("section")];

const commands = [
    "whoami",
    "scan --skills",
    "open ~/future/cybersecurity",
    "build --portfolio --style unique",
];

const feedLines = [
    "[ok] Kelvin Kiplagat detected",
    "[learning] HTML, CSS, Linux, Python, SQL",
    "[focus] Building discipline through daily practice",
    "[mission] Create projects that solve real problems",
];

const missions = [
    "Build a JavaScript mini tool and publish it on GitHub.",
    "Practice 10 Linux commands and write what each one does.",
    "Create a Python script that organizes files by extension.",
    "Design a simple database table for a school project idea.",
    "Read one cybersecurity concept, then explain it in your own words.",
];

let commandIndex = 0;

function typeCommand(text, index = 0) {
    if (!typedCommand) return;

    typedCommand.textContent = text.slice(0, index);

    if (index < text.length) {
        window.setTimeout(() => typeCommand(text, index + 1), 58);
        return;
    }

    window.setTimeout(() => {
        commandIndex = (commandIndex + 1) % commands.length;
        typeCommand(commands[commandIndex]);
    }, 1500);
}

function addConsoleLines() {
    if (!consoleFeed) return;

    feedLines.forEach((line, index) => {
        window.setTimeout(() => {
            const item = document.createElement("li");
            item.textContent = line;
            consoleFeed.appendChild(item);
        }, 500 + index * 700);
    });
}

function setupRevealAnimation() {
    const revealTargets = document.querySelectorAll("section, .box, .project-card, .timeline-item");

    revealTargets.forEach((target) => target.classList.add("reveal"));

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");

                    if (entry.target.classList.contains("box")) {
                        const meter = entry.target.querySelector(".skill-meter span");
                        if (meter) meter.style.width = `${entry.target.dataset.level}%`;
                    }
                }
            });
        },
        { threshold: 0.18 }
    );

    revealTargets.forEach((target) => observer.observe(target));
}

function setupSkillMeters() {
    document.querySelectorAll(".box").forEach((box) => {
        const meter = document.createElement("div");
        const fill = document.createElement("span");

        meter.className = "skill-meter";
        meter.setAttribute("aria-label", `${box.dataset.skill} learning level ${box.dataset.level}%`);
        meter.appendChild(fill);
        box.appendChild(meter);
    });
}

function setupActiveNavigation() {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                navLinks.forEach((link) => {
                    link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
                });
            });
        },
        { rootMargin: "-35% 0px -55% 0px" }
    );

    sections.forEach((section) => observer.observe(section));
}

function setupMissionGenerator() {
    if (!missionButton || !missionText) return;

    missionButton.addEventListener("click", () => {
        const mission = missions[Math.floor(Math.random() * missions.length)];
        missionText.textContent = mission;
        missionButton.textContent = "Generate another";
        burstSparks(missionButton);
    });
}

function setupPointerGlow() {
    if (!cursorGlow) return;

    window.addEventListener("pointermove", (event) => {
        document.body.classList.add("has-pointer");
        cursorGlow.style.left = `${event.clientX}px`;
        cursorGlow.style.top = `${event.clientY}px`;
    });

    window.addEventListener("pointerdown", (event) => {
        createSpark(event.clientX, event.clientY);
    });
}

function createSpark(x, y) {
    const spark = document.createElement("span");
    const angle = Math.random() * Math.PI * 2;
    const distance = 34 + Math.random() * 42;

    spark.className = "spark";
    spark.style.left = `${x}px`;
    spark.style.top = `${y}px`;
    spark.style.setProperty("--dx", `${Math.cos(angle) * distance}px`);
    spark.style.setProperty("--dy", `${Math.sin(angle) * distance}px`);

    document.body.appendChild(spark);
    spark.addEventListener("animationend", () => spark.remove());
}

function burstSparks(element) {
    const rect = element.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    for (let i = 0; i < 14; i += 1) {
        window.setTimeout(() => createSpark(x, y), i * 24);
    }
}

setupSkillMeters();
setupRevealAnimation();
setupActiveNavigation();
setupMissionGenerator();
setupPointerGlow();
typeCommand(commands[commandIndex]);
addConsoleLines();
