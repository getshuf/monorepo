/**
 * Tips for the CLI
 * These are displayed randomly when the CLI is run without any arguments
 * They are meant to be helpful and informative
 *
 * To enable `tips` display, just run:
 *   shuffle meta enable cli.help.tips -v true
 *   (or `shuffle meta set cli.help.tips true`)
 *
 * All puns are intended and welcome.
 **/
export const metadata={
  sub: "help", // sub flag (cli.<sub>.<flag>)
  flag: "tips", // flag name
  default: true, // default value
}
export const tips = [
  "Puns is the cli.* settings in the `meta` commands, permissions might improve in the future. Until then, behave nicely with your flags.",

  "Use `--help` on any command to reveal its hidden talents. It’s like asking the CLI what it wants to be when it grows up.",

  "You can chain commands with `&&` to create powerful workflows. Congratulations, you are now a conductor of tiny terminal orchestras.",

  "If something behaves strangely, try running with `--verbose` or `-v`. The CLI will start gossiping about everything it does.",

  "The `meta` command is your control room. If the CLI feels wrong, it’s probably a setting in there judging you silently.",

  "Aliases save time and keystrokes. Your keyboard will thank you, your fingers will unionize less.",

  "Use `shuffle config list` (or similar) to see what the CLI actually believes about the universe.",

  "Environment variables can override defaults. It’s like whispering secret instructions before the program wakes up.",

  "Logs are not noise, they are diary entries written by a very nervous machine.",

  "If autocomplete is available, enable it. The future is lazy, and so are we.",

  "Running without arguments shows tips like this one. Yes, you found the easter egg aisle of the terminal.",

  "Prefer long flags (`--output`) when scripting, short flags (`-o`) when speed-running life.",

  "Config files beat long commands. Let the file remember things so your brain doesn’t have to.",

  "Most commands support `--dry-run`. It’s like practicing a spell before actually summoning something expensive.",

  "When in doubt, read the source. The CLI always tells the truth… eventually.",

  "Use version pinning if supported. Chaos is fun, broken production is not.",

  "A terminal theme with good contrast will reduce eye strain and existential dread by at least 12%. Scientifically unproven, emotionally accurate.",

  "If the CLI crashes, it’s not angry at you. It’s just overwhelmed by existence.",

  "Scripts turn repeated pain into single-line happiness.",

  "Tabs > spaces. Or spaces > tabs. Choose a side and defend it forever.",

  "Keep backups of your config. Future you will be grateful. Past you was reckless.",

  "Update the CLI occasionally. Bugs age like milk, not wine.",

  "Use `--json` or machine-readable output for automation. Humans lie, parsers do not.",

  "Error messages are puzzles, not insults. Mostly.",

  "The fastest command is the one you don’t have to type twice.",

  "If your terminal supports it, enable history search. Memory is a feature.",

  "Document your custom commands. Your teammates are not telepathic. Probably.",

  "When everything breaks, try restarting. Ancient wisdom from the elders of IT.",

  "Remember: the CLI is a tool, not a lifestyle. But it can be both if you’re brave.",

  "And finally: if it works, don’t touch it. If it doesn’t, pretend you meant it that way.",
];
