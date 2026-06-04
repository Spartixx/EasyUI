module.exports = {
    extends: ["@commitlint/config-conventional"],
    ignores: [(commit) => commit.startsWith("Initial commit") || commit.startsWith("Merge")],

    defaultIgnores: true,
    rules: {}
};
