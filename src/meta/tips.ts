/**
 * Tips for the CLI
 * These are displayed randomly when the CLI is run without any arguments
 * They are meant to be helpful, informative, and occasionally whimsical.
 *
 * To enable `tips` display:
 *   shuffle meta enable cli.help.tips -v true
 *   (or `shuffle meta set cli.help.tips true`)
 *
 * All puns are intended. Some may be terminal-ly bad.
 */

export const metadata = {
  sub: "help",
  flag: "tips",
  default: true,
};

export const tips = [
  // --- General CLI Wisdom ---
  "Use `--help` on any command to reveal its hidden talents. It’s like asking the CLI what it wants to be when it grows up.",
  "You can chain commands with `&&` to create powerful workflows. Congratulations, you are now a conductor of tiny terminal orchestras.",
  "`shuffle whoami` reveals your identity in the Shuffle! universe. Spoiler: you’re awesome.",
  "Tab completion isn’t just convenient—it’s your CLI’s way of saying 'I believe in you.'",
  "A terminal theme with good contrast will reduce eye strain and existential dread by at least 12%. Scientifically unproven, emotionally accurate.",
  "Never trust a command you haven’t read. Even if it promises free cookies.",
  "The `--verbose` flag is your truth-teller. Use it when things go mysteriously silent.",
  "Aliases are like nicknames for your most-used commands. Give them something cool, like 's' for 'shuffle'.",
  "Your CLI history is a diary of productivity. Or chaos. No judgment.",
  "When in doubt, `shuffle doctor` can often diagnose what’s wrong with your setup.",

  // --- Home & Personalization ---
  "In Web UI, your Shuffle! server becomes your digital home—more than a place to work, it’s where you play, learn, create, and connect.",
  "Customize your home dashboard with widgets that matter to you. Because your space should reflect your soul (and your projects).",
  "Your ‘home’ in Shuffle! isn’t just a directory—it’s your launchpad to creativity.",
  "Set a custom avatar or banner in your profile. Let your terminal know who’s boss.",
  "Pin your favorite apps to your home screen. They’ll thank you with faster access.",
  "Your home environment syncs across devices. So your workflow follows you like a loyal shadow.",
  "Think of your Shuffle! home as a garden—tend to it, and it will bloom with your ideas.",
  "You can rename your server anytime. Give it a name that sparks joy (or mild amusement).",
  "Home is where your `.env` file is. Keep it safe, keep it secret.",
  "The ‘My Stuff’ section is your personal vault. Guard it like dragon treasure (but share when inspired).",

  // --- Web UI & Client Experience ---
  "The Web UI isn’t just pretty—it’s powerful. Drag, drop, click, and conquer.",
  "Dark mode isn’t just aesthetic—it’s a lifestyle choice endorsed by owls and developers alike.",
  "Real-time updates in the Web UI mean you never miss a beat. Unless you mute notifications… then you might.",
  "Keyboard shortcuts in the Web UI? Yes. Press `?` anytime to see them all.",
  "Your browser is now a portal to your digital workshop. Treat it with respect (and maybe clear cache occasionally).",
  "Client-side caching makes everything snappier. Like espresso for your UI.",
  "The Web client remembers your last tab. It’s clingy in the best way.",
  "Offline mode lets you draft ideas even when Wi-Fi betrays you. Loyalty matters.",
  "Responsive design means your Shuffle! home looks great on phones, tablets, and that weird monitor from 2007.",
  "Notifications can be snoozed, not silenced. Because sometimes you need focus, not FOMO.",

  // --- Apptainer Apps & npm Registry ---
  "Apptainer apps are containerized magic—run anywhere, behave everywhere.",
  "Publish your app to the Shuffle! npm registry with `shuffle publish`. Share your genius with the world.",
  "Install community apps via `shuffle install <name>`. It’s like adopting a digital pet—responsibly.",
  "Every Apptainer app is versioned. So you can roll back if your ‘genius idea’ turns out to be a gremlin.",
  "Use `shuffle list --remote` to browse the public app catalog. Inspiration is one command away.",
  "Your private apps stay private unless you say otherwise. Privacy by design, not by accident.",
  "Dependencies are handled automatically. No more ‘works on my machine’ excuses!",
  "Apps can talk to each other through secure APIs. It’s like a digital dinner party—everyone brings something.",
  "Update all your apps at once with `shuffle update --all`. Spring cleaning for your digital toolbox.",
  "An Apptainer app runs in isolation. So if it crashes, it takes only itself down—not your whole world.",

  // --- Development & Extensibility ---
  "Write your own CLI plugin with `shuffle scaffold plugin`. Extend the universe, one command at a time.",
  "Hooks let you react to events—like running a script when an app starts. Automate the mundane.",
  "Environment variables override config files. Because sometimes you need to whisper secrets to your CLI.",
  "Use `shuffle logs` to peek under the hood. Knowledge is power (and debugging).",
  "The CLI respects your `.shuffleignore` file. Not everything deserves to be synced.",
  "Custom themes can be applied globally or per-project. Mood-based development is valid.",
  "Script templates live in `~/.shuffle/scripts`. Reuse, remix, repeat.",
  "Your CLI supports internationalization. Because great tools speak many languages.",
  "Type safety is enforced where possible. Fewer bugs, more hugs.",
  "Contribute to open-source Shuffle! apps. The community grows when you do.",

  // --- Security & Best Practices ---
  "Always review permissions before installing an app. Trust, but verify.",
  "Two-factor authentication is supported. Your digital home deserves a deadbolt.",
  "API tokens can be scoped. Give minimal access—principle of least surprise.",
  "Audit your installed apps monthly. Digital clutter attracts technical debt.",
  "Backups are automatic, but you can trigger manual ones with `shuffle backup now`.",
  "Never commit `.env` files to version control. Secrets belong in vaults, not repos.",
  "Session timeouts protect idle clients. Security isn’t rude—it’s responsible.",
  "Use `shuffle audit` to check for known vulnerabilities in your apps.",
  "Encrypted sync ensures your data stays yours—even in transit.",
  "Guest accounts have limited access. Perfect for demos, not for production secrets.",

  // --- Community & Philosophy ---
  "Shuffle! is built by dreamers, for doers. You belong here.",
  "Share your workflow. Someone out there is waiting for your exact solution.",
  "The best feature is the one you build yourself. We just hand you the tools.",
  "Mistakes are welcome—they’re how we learn. Just don’t `rm -rf /` on purpose.",
  "Your feedback shapes the future. Speak up in the community forum.",
  "Open source isn’t just code—it’s collaboration, transparency, and kindness.",
  "There’s no ‘right’ way to use Shuffle!. Only your way.",
  "Celebrate small wins. That working script? That’s art.",
  "Help others when you can. The CLI community thrives on generosity.",
  "You’re not just using a tool—you’re part of a movement to make tech humane.",

  // --- Fun & Puns ---
  "Puns are the CLI.* settings in the `meta` commands. Permissions might improve in the future. Until then, behave nicely with your flags.",
  "Why did the developer go broke? Because he used up all his cache!",
  "I’d tell you a UDP joke, but you might not get it.",
  "There’s no place like 127.0.0.1. Especially when Wi-Fi is down.",
  "My password is ‘incorrect’. That way, when I forget it, the system reminds me: ‘Your password is incorrect.’",
  "I’m reading a book about anti-gravity. It’s impossible to put down!",
  "Why do programmers prefer dark mode? Because light attracts bugs.",
  "I told my CLI a joke about recursion. It’s still processing.",
  "404 Humor Not Found. Try again later.",
  "This tip brought to you by the Department of Redundancy Department.",

  // --- Productivity Hacks ---
  "Use `shuffle alias add deploy 'shuffle run deploy-prod'` to save keystrokes and sanity.",
  "Schedule tasks with `shuffle cron`. Let your computer work while you sleep.",
  "Export your config with `shuffle config export`. Perfect for onboarding teammates.",
  "Search command history with `Ctrl+R`. Time travel for your terminal.",
  "Pipe output to `less` for scrollable results. Because walls of text are scary.",
  "Use `shuffle watch` to auto-reload on file changes. Live reload for the win!",
  "Group related commands into a script. Automation is self-care.",
  "Color-coded output helps spot errors faster. Your eyes will thank you.",
  "Silent mode (`--quiet`) is great for scripts. Less noise, more action.",
  "The `--dry-run` flag shows what would happen—without doing it. Perfect for nervous newcomers.",

  // --- Advanced & Niche ---
  "Shuffle! supports WebAssembly modules (powered by WASI). The future is now.", 
  "Use `shuffle debug` to attach a debugger. Step through your scripts like a pro.",
  "Custom shells can be configured per-project. Bash, Zsh, Fish—your call.",
  // --- Final Encouragement ---
  "You’ve got this. And if you don’t, `--help` has your back.",
  "Every expert was once a beginner who didn’t quit.",
  "Your terminal is a canvas. Paint something beautiful.",
  "Break things. Learn. Fix them. Grow.",
  "The CLI is patient. It will wait for you to type `--help` as many times as needed.",
];
